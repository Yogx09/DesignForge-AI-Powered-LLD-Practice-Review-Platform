export type ProblemDifficulty = 'Easy' | 'Medium' | 'Hard';

export interface RubricCriterionSpec {
  id: string;
  name: string;
  description: string;
  weight: number;
  maxScore: number;
}

export interface StarterTemplate {
  assumptions: string;
  diagramMermaid: string;
  code: string;
  language: 'java' | 'python' | 'typescript' | 'cpp';
  designRationale: string;
}

export interface ProblemSummary {
  id: string;
  title: string;
  category: string;
  difficulty: ProblemDifficulty;
  timeEstimate: string;
  description: string;
  requirementsCount: number;
  concepts: string[];
}

export interface Problem extends ProblemSummary {
  functionalRequirements: string[];
  nonFunctionalRequirements: string[];
  constraints: string[];
  expectedEntities: string[];
  starterTemplate: StarterTemplate;
  rubric: RubricCriterionSpec[];
  referenceKeyConcepts: string[];
}

export interface SubmissionContent {
  assumptions: string;
  diagramMermaid: string;
  code: string;
  language: 'java' | 'python' | 'typescript' | 'cpp';
  designRationale: string;
}

export interface CriterionFeedback {
  criterionId: string;
  criterionName: string;
  score: number;
  maxScore: number;
  weight: number;
  evidence: string[];
  strengths: string[];
  concerns: string[];
  suggestions: string[];
}

export interface DeterministicCheckResult {
  passed: boolean;
  checkName: string;
  message: string;
  details?: string[];
}

export type EvaluationStatus = 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED';

export interface EvaluationResult {
  id: string;
  submissionId: string;
  attemptId: string;
  problemId: string;
  status: EvaluationStatus;
  overallScore: number;
  criteriaFeedback: CriterionFeedback[];
  strengths: string[];
  criticalConcerns: string[];
  actionableRecommendations: string[];
  deterministicChecks: DeterministicCheckResult[];
  evaluatorUsed: 'AI_GEMINI' | 'HEURISTIC_RULE_ENGINE' | 'COMPOSITE';
  durationMs: number;
  createdAt: string;
  errorMessage?: string;
}

export interface Submission {
  id: string;
  attemptId: string;
  problemId: string;
  version: number;
  content: SubmissionContent;
  createdAt: string;
  evaluationId?: string;
  evaluation?: EvaluationResult;
}

export type AttemptStatus = 'IN_PROGRESS' | 'EVALUATING' | 'EVALUATED' | 'FAILED';

export interface Attempt {
  id: string;
  problemId: string;
  userId: string;
  status: AttemptStatus;
  createdAt: string;
  updatedAt: string;
  submissions: Submission[];
}

export interface AttemptComparison {
  attemptId: string;
  problemId: string;
  previousVersion: number;
  currentVersion: number;
  scoreDelta: number;
  criteriaScoreDeltas: {
    criterionId: string;
    criterionName: string;
    previousScore: number;
    currentScore: number;
    delta: number;
  }[];
  addressedConcerns: string[];
  newStrengths: string[];
  summary: string;
}
