import { IEvaluator } from './IEvaluator.js';
import { DeterministicValidator } from './DeterministicValidator.js';
import { Problem, SubmissionContent, EvaluationResult, CriterionFeedback } from '../domain/types.js';
import { v4 as uuidv4 } from 'uuid';

export class HeuristicEvaluator implements IEvaluator {
  private validator = new DeterministicValidator();

  public async evaluate(
    problem: Problem,
    submission: SubmissionContent,
    attemptId: string,
    submissionId: string
  ): Promise<EvaluationResult> {
    const startTime = Date.now();
    const { checks, analysis } = this.validator.validate(problem, submission);

    const code = submission.code || '';
    const codeLower = code.toLowerCase();
    const rationale = submission.designRationale || '';
    const rationaleLower = rationale.toLowerCase();
    const assumptions = submission.assumptions || '';
    const assumptionsLower = assumptions.toLowerCase();
    const diagram = submission.diagramMermaid || '';
    const diagramLower = diagram.toLowerCase();

    const lines = code.split('\n').map(l => l.trim()).filter(Boolean);

    // Helper: Find matching lines for evidence
    const findEvidence = (keywords: string[]): string[] => {
      const matched: string[] = [];
      for (const line of lines) {
        const lineLower = line.toLowerCase();
        if (keywords.some(k => lineLower.includes(k.toLowerCase()))) {
          if (!line.startsWith('//') && !line.startsWith('/*')) {
            matched.push(line.slice(0, 80));
            if (matched.length >= 3) break;
          }
        }
      }
      return matched;
    };

    const criteriaFeedback: CriterionFeedback[] = [];
    const allStrengths: string[] = [];
    const allConcerns: string[] = [];
    const allRecommendations: string[] = [];

    // =========================================================================
    // 1. CRITERION: Domain Modeling & Cohesion (Weight: 25%, Max: 10)
    // =========================================================================
    let domainScore = 4;
    const domainStrengths: string[] = [];
    const domainConcerns: string[] = [];
    const domainSuggestions: string[] = [];
    const domainEvidence: string[] = [];

    // Check entity decomposition
    if (analysis.classes.length >= 3) {
      domainScore += 3;
      domainStrengths.push(`Good domain decomposition into ${analysis.classes.length} distinct classes (${analysis.classes.slice(0, 4).join(', ')}).`);
      domainEvidence.push(...findEvidence(['class ']));
    } else if (analysis.classes.length >= 1) {
      domainScore += 1;
      domainConcerns.push(`Found only ${analysis.classes.length} class(es). Multiple distinct domain entities are merged together.`);
      domainSuggestions.push('Decompose the problem into separate domain models (e.g. Spot, Floor, Ticket, Coordinator).');
    } else {
      domainConcerns.push('No concrete domain classes defined.');
      domainSuggestions.push('Define concrete entity classes modeling the core problem domain.');
    }

    // Check strongly typed enums
    if (analysis.enums.length > 0) {
      domainScore += 2;
      domainStrengths.push(`Utilized strongly-typed enums (${analysis.enums.join(', ')}) instead of raw strings.`);
      domainEvidence.push(...findEvidence(['enum ']));
    } else {
      domainScore -= 1;
      domainConcerns.push('No enums found for vehicle/spot types or states; relying on raw strings or magic numbers.');
      domainSuggestions.push('Introduce enums (e.g. VehicleType, SpotType, SlotStatus) for strict compile-time safety.');
    }

    // Check field encapsulation
    const hasPrivateFields = codeLower.includes('private ') || codeLower.includes('#') || codeLower.includes('readonly ');
    if (hasPrivateFields) {
      domainScore += 1;
      domainStrengths.push('Applied clean field encapsulation using private / protected / readonly modifiers.');
      domainEvidence.push(...findEvidence(['private ', 'readonly ']));
    } else {
      domainConcerns.push('Internal entity state is publicly exposed without encapsulation boundaries.');
      domainSuggestions.push('Make fields private and expose business behaviors through descriptive domain methods.');
    }

    domainScore = Math.min(10, Math.max(2, domainScore));
    criteriaFeedback.push({
      criterionId: 'domain_modeling',
      criterionName: 'Requirements & Domain Modeling',
      score: domainScore,
      maxScore: 10,
      weight: 0.25,
      evidence: domainEvidence.length > 0 ? domainEvidence.slice(0, 3) : ['Evaluated class declarations and state encapsulation.'],
      strengths: domainStrengths.length > 0 ? domainStrengths : ['Basic class structure declared.'],
      concerns: domainConcerns.length > 0 ? domainConcerns : ['Entity boundaries could be isolated further.'],
      suggestions: domainSuggestions.length > 0 ? domainSuggestions : ['Continue enforcing Single Responsibility Principle across all entities.']
    });

    // =========================================================================
    // 2. CRITERION: Abstraction & Interface Segregation (Weight: 25%, Max: 10)
    // =========================================================================
    let absScore = 3;
    const absStrengths: string[] = [];
    const absConcerns: string[] = [];
    const absSuggestions: string[] = [];
    const absEvidence: string[] = [];

    const totalAbstractions = analysis.interfaces.length + analysis.abstractClasses.length;
    if (totalAbstractions >= 2) {
      absScore += 4;
      absStrengths.push(`Excellent use of abstraction contracts (${[...analysis.interfaces, ...analysis.abstractClasses].join(', ')}).`);
      absEvidence.push(...findEvidence(['interface ', 'abstract class ']));
    } else if (totalAbstractions === 1) {
      absScore += 2;
      absStrengths.push(`Defined abstraction contract: ${[...analysis.interfaces, ...analysis.abstractClasses].join(', ')}.`);
      absEvidence.push(...findEvidence(['interface ', 'abstract class ']));
    } else {
      absScore -= 1;
      absConcerns.push('Zero interface contracts found. Caller classes depend directly on concrete implementations (violates Dependency Inversion).');
      absSuggestions.push('Define interface contracts (e.g. IParkingStrategy, IFeeStrategy) to decouple caller logic.');
    }

    if (codeLower.includes('implements ') || codeLower.includes('extends ')) {
      absScore += 2;
      absStrengths.push('Polymorphism used to eliminate rigid if-else / switch-case checks.');
      absEvidence.push(...findEvidence(['implements ', 'extends ']));
    }

    absScore = Math.min(10, Math.max(2, absScore));
    criteriaFeedback.push({
      criterionId: 'abstraction_interfaces',
      criterionName: 'Abstraction & Interfaces',
      score: absScore,
      maxScore: 10,
      weight: 0.25,
      evidence: absEvidence.length > 0 ? absEvidence.slice(0, 3) : ['Analyzed inheritance and interface implementations.'],
      strengths: absStrengths.length > 0 ? absStrengths : ['Basic inheritance present.'],
      concerns: absConcerns.length > 0 ? absConcerns : ['Caller classes are tightly coupled to concrete instances.'],
      suggestions: absSuggestions.length > 0 ? absSuggestions : ['Inject dependencies via interface contracts in constructors.']
    });

    // =========================================================================
    // 3. CRITERION: Extensibility & Design Patterns (Weight: 20%, Max: 10)
    // =========================================================================
    let patScore = 3;
    const patStrengths: string[] = [];
    const patConcerns: string[] = [];
    const patSuggestions: string[] = [];
    const patEvidence: string[] = [];

    if (analysis.hasDesignPatternsIdentified.length > 0) {
      patScore += 4;
      patStrengths.push(`Implemented GoF design patterns: ${analysis.hasDesignPatternsIdentified.join(', ')}.`);
      patEvidence.push(...findEvidence(['strategy', 'factory', 'singleton', 'observer', 'state']));
    } else {
      patConcerns.push('No recognized design patterns detected; algorithmic workflows appear hardcoded into coordinator methods.');
      patSuggestions.push(`Apply classic patterns relevant to ${problem.title}, such as ${problem.referenceKeyConcepts.slice(0, 2).join(' or ')}.`);
    }

    if (rationaleLower.includes('strategy') || rationaleLower.includes('open-closed') || rationaleLower.includes('factory')) {
      patScore += 2;
      patStrengths.push('Design rationale clearly explains how the architecture respects the Open-Closed Principle.');
    }

    patScore = Math.min(10, Math.max(2, patScore));
    criteriaFeedback.push({
      criterionId: 'extensibility_patterns',
      criterionName: 'Extensibility & Patterns',
      score: patScore,
      maxScore: 10,
      weight: 0.20,
      evidence: patEvidence.length > 0 ? patEvidence.slice(0, 3) : ['Inspected extensibility points and pattern semantics.'],
      strengths: patStrengths.length > 0 ? patStrengths : ['Clear modular structure.'],
      concerns: patConcerns.length > 0 ? patConcerns : ['Adding new behavior requires modifying existing coordinator code.'],
      suggestions: patSuggestions.length > 0 ? patSuggestions : ['Use Strategy or Factory pattern to make algorithm selection dynamically pluggable.']
    });

    // =========================================================================
    // 4. CRITERION: Edge Cases, State & Concurrency (Weight: 15%, Max: 10)
    // =========================================================================
    let edgeScore = 3;
    const edgeStrengths: string[] = [];
    const edgeConcerns: string[] = [];
    const edgeSuggestions: string[] = [];
    const edgeEvidence: string[] = [];

    const hasDefensiveChecks = codeLower.includes('throw new') || codeLower.includes('return null') || codeLower.includes('return false') || codeLower.includes('if (!') || codeLower.includes('== null');
    if (hasDefensiveChecks) {
      edgeScore += 3;
      edgeStrengths.push('Defensive boundary checks and error handling present.');
      edgeEvidence.push(...findEvidence(['throw new', 'return null', 'return false', 'if (!']));
    } else {
      edgeConcerns.push('Missing boundary validations (e.g. lot full, invalid tickets, null vehicle inputs).');
      edgeSuggestions.push('Add explicit validation for full capacity, double unparking, and invalid ticket lookups.');
    }

    const hasConcurrency = (codeLower + ' ' + rationaleLower + ' ' + assumptionsLower).includes('thread') ||
      (codeLower + ' ' + rationaleLower + ' ' + assumptionsLower).includes('concurren') ||
      (codeLower + ' ' + rationaleLower + ' ' + assumptionsLower).includes('lock') ||
      (codeLower + ' ' + rationaleLower + ' ' + assumptionsLower).includes('atomic') ||
      (codeLower + ' ' + rationaleLower + ' ' + assumptionsLower).includes('mutex');

    if (hasConcurrency) {
      edgeScore += 3;
      edgeStrengths.push('Demonstrated awareness of thread safety and race conditions during simultaneous entry/exit.');
    } else {
      edgeConcerns.push('Concurrency and multi-gate race conditions were not addressed in code or design rationale.');
      edgeSuggestions.push('Explain how spot allocation state transitions remain thread-safe under concurrent requests.');
    }

    edgeScore = Math.min(10, Math.max(2, edgeScore));
    criteriaFeedback.push({
      criterionId: 'edge_cases_concurrency',
      criterionName: 'Edge Cases & Testability',
      score: edgeScore,
      maxScore: 10,
      weight: 0.15,
      evidence: edgeEvidence.length > 0 ? edgeEvidence.slice(0, 3) : ['Evaluated defensive programming and state transition guards.'],
      strengths: edgeStrengths.length > 0 ? edgeStrengths : ['Basic state checking present.'],
      concerns: edgeConcerns.length > 0 ? edgeConcerns : ['Edge cases like empty states or conflicting operations need explicit guards.'],
      suggestions: edgeSuggestions.length > 0 ? edgeSuggestions : ['Add thread safety considerations and explicit error handling for edge cases.']
    });

    // =========================================================================
    // 5. CRITERION: Assumptions, Rationale & Trade-offs (Weight: 15%, Max: 10)
    // =========================================================================
    let ratScore = 3;
    const ratStrengths: string[] = [];
    const ratConcerns: string[] = [];
    const ratSuggestions: string[] = [];
    const ratEvidence: string[] = [];

    if (assumptions.trim().length > 40) {
      ratScore += 3;
      ratStrengths.push('Well-structured assumptions constraining scale, gates, and vehicle dimensions.');
      ratEvidence.push(`Assumptions: "${assumptions.slice(0, 65)}..."`);
    } else {
      ratConcerns.push('Assumptions are minimal or unspecified.');
      ratSuggestions.push('Document explicit assumptions regarding scale, synchronous vs async checkout, and payment gateways.');
    }

    if (rationale.trim().length > 50) {
      ratScore += 3;
      ratStrengths.push('Clear architectural rationale explaining why specific patterns and structures were chosen.');
    } else {
      ratConcerns.push('Lacks trade-off defense (e.g. space vs time complexity, consistency vs availability).');
      ratSuggestions.push('Explicitly defend your design decisions and explain alternative approaches you considered and rejected.');
    }

    ratScore = Math.min(10, Math.max(2, ratScore));
    criteriaFeedback.push({
      criterionId: 'rationale_tradeoffs',
      criterionName: 'Design Rationale',
      score: ratScore,
      maxScore: 10,
      weight: 0.15,
      evidence: ratEvidence.length > 0 ? ratEvidence.slice(0, 2) : ['Evaluated stated assumptions and design rationale.'],
      strengths: ratStrengths.length > 0 ? ratStrengths : ['Assumptions documented.'],
      concerns: ratConcerns.length > 0 ? ratConcerns : ['Discuss design trade-offs in greater depth.'],
      suggestions: ratSuggestions.length > 0 ? ratSuggestions : ['Highlight what trade-offs were made and why.']
    });

    // =========================================================================
    // Aggregate Overall Score & Findings
    // =========================================================================
    let overallScore = 0;
    for (const c of criteriaFeedback) {
      overallScore += (c.score / c.maxScore) * (c.weight * 100);
      allStrengths.push(...c.strengths);
      allConcerns.push(...c.concerns);
      allRecommendations.push(...c.suggestions);
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
      criteriaFeedback,
      strengths: Array.from(new Set(allStrengths)).slice(0, 5),
      criticalConcerns: Array.from(new Set(allConcerns)).slice(0, 4),
      actionableRecommendations: Array.from(new Set(allRecommendations)).slice(0, 4),
      deterministicChecks: checks,
      evaluatorUsed: 'HEURISTIC_RULE_ENGINE',
      durationMs,
      createdAt: new Date().toISOString()
    };
  }
}
