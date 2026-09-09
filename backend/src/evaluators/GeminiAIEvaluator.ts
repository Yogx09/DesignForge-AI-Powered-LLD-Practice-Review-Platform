import { IEvaluator } from './IEvaluator.js';
import { DeterministicValidator } from './DeterministicValidator.js';
import { HeuristicEvaluator } from './HeuristicEvaluator.js';
import { Problem, SubmissionContent, EvaluationResult, CriterionFeedback } from '../domain/types.js';
import { v4 as uuidv4 } from 'uuid';

export class GeminiAIEvaluator implements IEvaluator {
  private heuristicEvaluator = new HeuristicEvaluator();
  private validator = new DeterministicValidator();

  public async evaluate(
    problem: Problem,
    submission: SubmissionContent,
    attemptId: string,
    submissionId: string
  ): Promise<EvaluationResult> {
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

    if (!apiKey) {
      // Graceful fallback to heuristic evaluator if no API key is configured
      return this.heuristicEvaluator.evaluate(problem, submission, attemptId, submissionId);
    }

    const startTime = Date.now();
    const { checks } = this.validator.validate(problem, submission);

    try {
      const prompt = `You are a Principal Software Architect evaluating a Low-Level Design (LLD) interview solution.
Problem: "${problem.title}"
Difficulty: "${problem.difficulty}"
Problem Requirements:
${problem.functionalRequirements.map(r => '- ' + r).join('\n')}

Constraints:
${problem.constraints.map(c => '- ' + c).join('\n')}

Learner Submission:
--- ASSUMPTIONS ---
${submission.assumptions || 'None'}

--- MERMAID DIAGRAM ---
${submission.diagramMermaid || 'None'}

--- CODE IMPLEMENTATION (${submission.language}) ---
${submission.code || 'None'}

--- DESIGN RATIONALE ---
${submission.designRationale || 'None'}

Evaluate this submission strictly against the following 5 criteria on a scale of 0 to 10:
1. domain_modeling ("Domain Modeling & Cohesion", weight: 0.25)
2. abstraction_interfaces ("Abstraction & Interface Segregation", weight: 0.25)
3. extensibility_patterns ("Extensibility & Design Patterns", weight: 0.20)
4. edge_cases_concurrency ("Edge Cases, State & Concurrency", weight: 0.15)
5. rationale_tradeoffs ("Assumptions, Rationale & Trade-offs", weight: 0.15)

Provide your response in EXACT JSON format with this structure:
{
  "criteriaFeedback": [
    {
      "criterionId": "domain_modeling",
      "criterionName": "Domain Modeling & Cohesion",
      "score": 8,
      "maxScore": 10,
      "weight": 0.25,
      "evidence": ["Quote or line from learner code demonstrating this"],
      "strengths": ["Specific strength"],
      "concerns": ["Specific constructive criticism"],
      "suggestions": ["Concrete actionable advice to improve in next attempt"]
    },
    ... (for all 5 criteria)
  ],
  "strengths": ["Top 3-4 overall strengths"],
  "criticalConcerns": ["Top 3 critical design gaps"],
  "actionableRecommendations": ["Top 3 actionable steps for next version"]
}
`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              responseMimeType: 'application/json',
              temperature: 0.2
            }
          })
        }
      );

      if (!response.ok) {
        throw new Error(`Gemini API responded with status ${response.status}`);
      }

      const data = (await response.json()) as any;
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawText) {
        throw new Error('Empty response from Gemini');
      }

      const parsed = JSON.parse(rawText);

      // Compute overall score
      let overallScore = 0;
      for (const c of parsed.criteriaFeedback) {
        overallScore += (c.score / c.maxScore) * (c.weight * 100);
      }
      overallScore = Math.round(overallScore);

      const durationMs = Date.now() - startTime;

      return {
        id: uuidv4(),
        submissionId,
        attemptId,
        problemId: problem.id,
        status: 'COMPLETED',
        overallScore,
        criteriaFeedback: parsed.criteriaFeedback,
        strengths: parsed.strengths || [],
        criticalConcerns: parsed.criticalConcerns || [],
        actionableRecommendations: parsed.actionableRecommendations || [],
        deterministicChecks: checks,
        evaluatorUsed: 'AI_GEMINI',
        durationMs,
        createdAt: new Date().toISOString()
      };
    } catch (err: any) {
      console.warn('Gemini evaluation failed, falling back to heuristic engine:', err.message);
      return this.heuristicEvaluator.evaluate(problem, submission, attemptId, submissionId);
    }
  }
}
