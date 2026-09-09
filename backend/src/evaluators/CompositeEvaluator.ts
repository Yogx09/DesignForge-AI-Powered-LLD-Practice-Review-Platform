import { IEvaluator } from './IEvaluator.js';
import { DeterministicValidator } from './DeterministicValidator.js';
import { GeminiAIEvaluator } from './GeminiAIEvaluator.js';
import { HeuristicEvaluator } from './HeuristicEvaluator.js';
import { Problem, SubmissionContent, EvaluationResult } from '../domain/types.js';

export class CompositeEvaluator implements IEvaluator {
  private validator = new DeterministicValidator();
  private primaryEvaluator: IEvaluator;

  constructor(useAI: boolean = true) {
    if (useAI && (process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY)) {
      this.primaryEvaluator = new GeminiAIEvaluator();
    } else {
      this.primaryEvaluator = new HeuristicEvaluator();
    }
  }

  public async evaluate(
    problem: Problem,
    submission: SubmissionContent,
    attemptId: string,
    submissionId: string
  ): Promise<EvaluationResult> {
    // 1. Run deterministic checks first
    const { isValid, checks } = this.validator.validate(problem, submission);

    // If completely invalid (e.g. empty submission), we can still evaluate but with low baseline
    const result = await this.primaryEvaluator.evaluate(problem, submission, attemptId, submissionId);
    result.deterministicChecks = checks;
    return result;
  }
}
