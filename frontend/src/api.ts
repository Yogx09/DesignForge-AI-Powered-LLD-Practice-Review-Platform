import {
  ProblemSummary,
  Problem,
  Attempt,
  SubmissionContent,
  Submission,
  EvaluationResult,
  AttemptComparison
} from './types';

const API_BASE = import.meta.env.VITE_API_URL || (typeof window !== 'undefined' && window.location.hostname === 'localhost' && window.location.port === '5173' ? 'http://localhost:4000/api' : '/api');

export async function getProblems(): Promise<ProblemSummary[]> {
  const res = await fetch(`${API_BASE}/problems`);
  const data = await res.json();
  if (!data.success) throw new Error(data.error || 'Failed to fetch problems');
  return data.problems;
}

export async function getProblemById(id: string): Promise<Problem> {
  const res = await fetch(`${API_BASE}/problems/${id}`);
  const data = await res.json();
  if (!data.success) throw new Error(data.error || 'Failed to fetch problem');
  return data.problem;
}

export async function startOrGetAttempt(problemId: string, userId: string = 'candidate-learner'): Promise<Attempt> {
  const res = await fetch(`${API_BASE}/attempts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ problemId, userId })
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.error || 'Failed to start attempt');
  return data.attempt;
}

export async function getAttempt(id: string): Promise<Attempt> {
  const res = await fetch(`${API_BASE}/attempts/${id}`);
  const data = await res.json();
  if (!data.success) throw new Error(data.error || 'Failed to get attempt');
  return data.attempt;
}

export async function submitSolution(
  attemptId: string,
  content: SubmissionContent
): Promise<{ submission: Submission; evaluation: EvaluationResult; comparison?: AttemptComparison }> {
  const res = await fetch(`${API_BASE}/attempts/${attemptId}/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content })
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.error || 'Failed to submit solution');
  return data;
}

export async function compareAttempts(
  attemptId: string,
  v1: number,
  v2: number
): Promise<AttemptComparison> {
  const res = await fetch(`${API_BASE}/attempts/${attemptId}/compare?v1=${v1}&v2=${v2}`);
  const data = await res.json();
  if (!data.success) throw new Error(data.error || 'Failed to compare attempts');
  return data.comparison;
}
