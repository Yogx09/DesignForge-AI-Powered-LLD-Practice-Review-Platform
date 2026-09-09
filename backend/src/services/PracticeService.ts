import { ProblemRepository } from '../repositories/ProblemRepository.js';
import { DatabaseAttemptRepository } from '../repositories/DatabaseAttemptRepository.js';
import { CompositeEvaluator } from '../evaluators/CompositeEvaluator.js';
import { IEvaluator } from '../evaluators/IEvaluator.js';
import {
  Problem,
  Attempt,
  Submission,
  SubmissionContent,
  EvaluationResult,
  AttemptComparison
} from '../domain/types.js';
import { v4 as uuidv4 } from 'uuid';

export class PracticeService {
  private problemRepo: ProblemRepository;
  private attemptRepo: DatabaseAttemptRepository;
  private evaluator: IEvaluator;

  constructor(
    problemRepo: ProblemRepository = new ProblemRepository(),
    attemptRepo: DatabaseAttemptRepository = new DatabaseAttemptRepository(),
    evaluator: IEvaluator = new CompositeEvaluator()
  ) {
    this.problemRepo = problemRepo;
    this.attemptRepo = attemptRepo;
    this.evaluator = evaluator;
  }

  public getProblems(): Problem[] {
    return this.problemRepo.getAll();
  }

  public getProblem(id: string): Problem | undefined {
    return this.problemRepo.getById(id);
  }

  public async getOrCreateAttempt(problemId: string, userId: string = 'default-learner'): Promise<Attempt> {
    const problem = this.problemRepo.getById(problemId);
    if (!problem) {
      throw new Error(`Problem with id "${problemId}" not found.`);
    }

    let attempt = await this.attemptRepo.getByProblemAndUser(problemId, userId);
    if (!attempt) {
      attempt = {
        id: uuidv4(),
        problemId,
        userId,
        status: 'IN_PROGRESS',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        submissions: []
      };
      await this.attemptRepo.save(attempt);
    }
    return attempt;
  }

  public async getAttempt(id: string): Promise<Attempt | undefined> {
    return this.attemptRepo.getById(id);
  }

  public async submitSolution(
    attemptId: string,
    content: SubmissionContent
  ): Promise<{ submission: Submission; evaluation: EvaluationResult; comparison?: AttemptComparison }> {
    const attempt = await this.attemptRepo.getById(attemptId);
    if (!attempt) {
      throw new Error(`Attempt with id "${attemptId}" not found.`);
    }

    const problem = this.problemRepo.getById(attempt.problemId);
    if (!problem) {
      throw new Error(`Problem with id "${attempt.problemId}" not found.`);
    }

    const version = attempt.submissions.length + 1;
    const submissionId = uuidv4();

    const newSubmission: Submission = {
      id: submissionId,
      attemptId,
      problemId: problem.id,
      version,
      content,
      createdAt: new Date().toISOString()
    };

    // Update state to EVALUATING and store submission
    attempt.status = 'EVALUATING';
    attempt.submissions.push(newSubmission);
    attempt.updatedAt = new Date().toISOString();
    await this.attemptRepo.save(attempt);

    try {
      // Run evaluation
      const evaluation = await this.evaluator.evaluate(problem, content, attemptId, submissionId);
      newSubmission.evaluationId = evaluation.id;
      newSubmission.evaluation = evaluation;

      attempt.status = 'EVALUATED';
      attempt.updatedAt = new Date().toISOString();
      await this.attemptRepo.save(attempt);

      let comparison: AttemptComparison | undefined;
      if (version > 1) {
        const prevSubmission = attempt.submissions[version - 2];
        if (prevSubmission && prevSubmission.evaluation) {
          comparison = this.computeComparison(prevSubmission, newSubmission, problem.id);
        }
      }

      return {
        submission: newSubmission,
        evaluation,
        comparison
      };
    } catch (err: any) {
      attempt.status = 'FAILED';
      await this.attemptRepo.save(attempt);
      throw err;
    }
  }

  public async compareAttempts(attemptId: string, v1: number, v2: number): Promise<AttemptComparison> {
    const attempt = await this.attemptRepo.getById(attemptId);
    if (!attempt) {
      throw new Error(`Attempt with id "${attemptId}" not found.`);
    }

    const sub1 = attempt.submissions.find(s => s.version === v1);
    const sub2 = attempt.submissions.find(s => s.version === v2);

    if (!sub1 || !sub1.evaluation || !sub2 || !sub2.evaluation) {
      throw new Error('Both submissions must be evaluated to perform comparison.');
    }

    return this.computeComparison(sub1, sub2, attempt.problemId);
  }

  private computeComparison(sub1: Submission, sub2: Submission, problemId: string): AttemptComparison {
    const eval1 = sub1.evaluation!;
    const eval2 = sub2.evaluation!;

    const scoreDelta = eval2.overallScore - eval1.overallScore;

    const criteriaScoreDeltas = eval2.criteriaFeedback.map(c2 => {
      const c1 = eval1.criteriaFeedback.find(c => c.criterionId === c2.criterionId);
      const prevScore = c1 ? c1.score : 0;
      return {
        criterionId: c2.criterionId,
        criterionName: c2.criterionName,
        previousScore: prevScore,
        currentScore: c2.score,
        delta: c2.score - prevScore
      };
    });

    // Check which concerns from eval1 are no longer in eval2
    const prevConcerns = eval1.criticalConcerns || [];
    const currentConcerns = eval2.criticalConcerns || [];
    const addressedConcerns = prevConcerns.filter(
      pc => !currentConcerns.some(cc => cc.toLowerCase().includes(pc.toLowerCase().slice(0, 15)))
    );

    const prevStrengths = new Set((eval1.strengths || []).map(s => s.toLowerCase()));
    const newStrengths = (eval2.strengths || []).filter(s => !prevStrengths.has(s.toLowerCase()));

    let summary = `Attempt #${sub2.version} achieved ${eval2.overallScore}/100 (Score delta: ${scoreDelta >= 0 ? '+' + scoreDelta : scoreDelta}).`;
    if (scoreDelta > 0) {
      summary += ` Great progress! You resolved key concerns and improved your design structure.`;
    } else if (scoreDelta === 0) {
      summary += ` Design score is consistent with your previous attempt.`;
    } else {
      summary += ` Some newly introduced trade-offs decreased the score; check critical concerns below.`;
    }

    return {
      attemptId: sub1.attemptId,
      problemId,
      previousVersion: sub1.version,
      currentVersion: sub2.version,
      scoreDelta,
      criteriaScoreDeltas,
      addressedConcerns,
      newStrengths,
      summary
    };
  }
}
