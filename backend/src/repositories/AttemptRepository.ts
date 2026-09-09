import { Attempt, Submission, EvaluationResult } from '../domain/types.js';

export class AttemptRepository {
  private attempts: Map<string, Attempt> = new Map();

  public getAllByProblemId(problemId: string): Attempt[] {
    return Array.from(this.attempts.values()).filter(a => a.problemId === problemId);
  }

  public getById(id: string): Attempt | undefined {
    return this.attempts.get(id);
  }

  public getByProblemAndUser(problemId: string, userId: string): Attempt | undefined {
    return Array.from(this.attempts.values()).find(
      a => a.problemId === problemId && a.userId === userId
    );
  }

  public save(attempt: Attempt): void {
    this.attempts.set(attempt.id, attempt);
  }

  public findSubmissionById(submissionId: string): { attempt: Attempt; submission: Submission } | null {
    for (const attempt of this.attempts.values()) {
      const sub = attempt.submissions.find(s => s.id === submissionId);
      if (sub) {
        return { attempt, submission: sub };
      }
    }
    return null;
  }
}
