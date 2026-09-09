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
      const prompt = `You are a Principal Software Architect conducting a rigorous Low-Level Design (LLD) interview code evaluation.
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

CRITICAL SCORING INSTRUCTIONS:
1. STRICT ZERO-BASELINE: Start at 0/10 for every criterion. Points must be earned solely through substantive, working LLD architecture.
2. INCOMPLETE / STUB / MINIMAL CODE PENALTY:
   - If the code contains fewer than 15 lines, or lacks core domain entities/methods, or is a stub (e.g. 1-2 empty classes), every criterion score MUST be strictly 0, 1, or 2 out of 10.
   - The overall score for incomplete/minimal submissions MUST NOT exceed 15/100.
   - Do NOT give charity points or praise for empty/placeholder submissions.
3. EVIDENCE: Every evidence item MUST be an exact verbatim snippet from the candidate's code. If no code demonstrates the concept, output ["No implementation evidence found in submission."].

Evaluate strictly against these 5 criteria (0 to 10 scale):
1. domain_modeling ("Requirements & Domain Modeling", weight: 0.25): Entities decomposition, enums, encapsulation, single responsibility.
2. abstraction_interfaces ("Abstraction & Interfaces", weight: 0.25): Interface contracts, DIP, polymorphism.
3. extensibility_patterns ("Extensibility & Patterns", weight: 0.20): Strategy, Factory, Observer, OCP compliance.
4. edge_cases_concurrency ("Edge Cases & Testability", weight: 0.15): Defensive guards, concurrency safety, error handling.
5. rationale_tradeoffs ("Design Rationale", weight: 0.15): Assumptions depth, complexity trade-offs, architecture justification.

Provide your response in EXACT JSON format with this structure:
{
  "criteriaFeedback": [
    {
      "criterionId": "domain_modeling",
      "criterionName": "Requirements & Domain Modeling",
      "score": 0,
      "maxScore": 10,
      "weight": 0.25,
      "evidence": ["Exact line or 'No implementation evidence found in submission.'"],
      "strengths": ["Real strengths if score >= 5, otherwise empty array"],
      "concerns": ["Specific missing architectural entities or flaws"],
      "suggestions": ["Concrete actionable advice to implement"]
    }
  ],
  "strengths": ["Overall real strengths if any"],
  "criticalConcerns": ["Top critical design gaps (e.g., Incomplete code, missing entities)"],
  "actionableRecommendations": ["Concrete next steps"]
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
