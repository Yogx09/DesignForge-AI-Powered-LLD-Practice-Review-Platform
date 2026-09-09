import { Problem, SubmissionContent, EvaluationResult } from '../domain/types.js';

export interface IEvaluator {
  evaluate(
    problem: Problem,
    submission: SubmissionContent,
    attemptId: string,
    submissionId: string
  ): Promise<EvaluationResult>;
}
