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

    const code = (submission.code || '').trim();
    const codeLower = code.toLowerCase();
    const rationale = (submission.designRationale || '').trim();
    const rationaleLower = rationale.toLowerCase();
    const assumptions = (submission.assumptions || '').trim();
    const assumptionsLower = assumptions.toLowerCase();
    const diagram = (submission.diagramMermaid || '').trim();

    const nonCommentLines = code
      .split('\n')
      .map(l => l.trim())
      .filter(l => l.length > 0 && !l.startsWith('//') && !l.startsWith('/*') && !l.startsWith('*'));

    // Helper: Find real non-comment matching lines for evidence
    const findEvidence = (keywords: string[]): string[] => {
      const matched: string[] = [];
      for (const line of nonCommentLines) {
        const lineLower = line.toLowerCase();
        if (keywords.some(k => lineLower.includes(k.toLowerCase()))) {
          matched.push(line.slice(0, 80));
          if (matched.length >= 3) break;
        }
      }
      return matched;
    };

    const totalTypes = analysis.classes.length + analysis.abstractClasses.length + analysis.interfaces.length;
    const isMinimalOrStub = nonCommentLines.length < 10 || (analysis.classes.length <= 1 && totalTypes < 2 && analysis.methodCount < 2);

    const criteriaFeedback: CriterionFeedback[] = [];
    const allStrengths: string[] = [];
    const allConcerns: string[] = [];
    const allRecommendations: string[] = [];

    // =========================================================================
    // 1. CRITERION: Domain Modeling & Cohesion (Weight: 25%, Max: 10)
    // =========================================================================
    let domainScore = 0;
    const domainStrengths: string[] = [];
    const domainConcerns: string[] = [];
    const domainSuggestions: string[] = [];
    const domainEvidence: string[] = [];

    if (analysis.classes.length >= 3) {
      domainScore += 6;
      domainStrengths.push(`Decomposed into ${analysis.classes.length} domain classes (${analysis.classes.slice(0, 4).join(', ')}).`);
      domainEvidence.push(...findEvidence(['class ']));
    } else if (analysis.classes.length === 2) {
      domainScore += 4;
      domainStrengths.push(`Declared 2 domain classes (${analysis.classes.join(', ')}).`);
      domainConcerns.push('Domain decomposition is minimal; real-world LLD requires isolating separate responsibilities (e.g. entities, services, coordinators).');
      domainSuggestions.push('Decompose the problem into additional granular entities (e.g., Coordinator, Strategy, Value Objects).');
      domainEvidence.push(...findEvidence(['class ']));
    } else if (analysis.classes.length === 1) {
      domainScore += 2;
      domainConcerns.push(`Found only 1 class (${analysis.classes[0]}). This represents a God Object anti-pattern where all responsibilities are merged.`);
      domainSuggestions.push('Break the monolithic class down into individual domain entities with single responsibilities.');
      domainEvidence.push(...findEvidence(['class ']));
    } else {
      domainConcerns.push('No concrete domain classes declared. The solution lacks essential object-oriented structure.');
      domainSuggestions.push('Model the core problem entities as dedicated classes with clear state and behavior.');
    }

    // Strongly typed enums
    if (analysis.enums.length > 0) {
      domainScore += 2;
      domainStrengths.push(`Utilized strongly-typed enums (${analysis.enums.join(', ')}) to enforce type safety.`);
      domainEvidence.push(...findEvidence(['enum ']));
    } else if (nonCommentLines.length >= 10) {
      domainConcerns.push('No enums found for domain states or categories; risk of using error-prone string literals or magic numbers.');
      domainSuggestions.push('Introduce enums (e.g. Status, Type, StrategyMode) for strict compile-time type checking.');
    }

    // Encapsulation
    const hasPrivateFields = codeLower.includes('private ') || codeLower.includes('#') || codeLower.includes('readonly ');
    if (hasPrivateFields) {
      domainScore += 2;
      domainStrengths.push('State encapsulation maintained using private/readonly member modifiers.');
      domainEvidence.push(...findEvidence(['private ', 'readonly ']));
    } else if (analysis.classes.length > 0) {
      domainConcerns.push('Entity state lacks strict encapsulation (missing private/protected modifiers).');
      domainSuggestions.push('Make class fields private and expose operations via explicit domain methods.');
    }

    domainScore = Math.min(10, Math.max(0, domainScore));
    criteriaFeedback.push({
      criterionId: 'domain_modeling',
      criterionName: 'Requirements & Domain Modeling',
      score: domainScore,
      maxScore: 10,
      weight: 0.25,
      evidence: domainEvidence.length > 0 ? domainEvidence.slice(0, 3) : ['No concrete domain entity declarations found in code.'],
      strengths: domainStrengths.length > 0 ? domainStrengths : [],
      concerns: domainConcerns.length > 0 ? domainConcerns : ['Entities should maintain high cohesion and clear lifecycle boundaries.'],
      suggestions: domainSuggestions.length > 0 ? domainSuggestions : ['Continue enforcing Single Responsibility Principle across all domain entities.']
    });

    // =========================================================================
    // 2. CRITERION: Abstraction & Interface Segregation (Weight: 25%, Max: 10)
    // =========================================================================
    let absScore = 0;
    const absStrengths: string[] = [];
    const absConcerns: string[] = [];
    const absSuggestions: string[] = [];
    const absEvidence: string[] = [];

    const totalAbstractions = analysis.interfaces.length + analysis.abstractClasses.length;
    if (totalAbstractions >= 2) {
      absScore += 7;
      absStrengths.push(`Defined clean abstraction contracts (${[...analysis.interfaces, ...analysis.abstractClasses].join(', ')}).`);
      absEvidence.push(...findEvidence(['interface ', 'abstract class ']));
    } else if (totalAbstractions === 1) {
      absScore += 4;
      absStrengths.push(`Defined abstraction contract: ${[...analysis.interfaces, ...analysis.abstractClasses].join(', ')}.`);
      absEvidence.push(...findEvidence(['interface ', 'abstract class ']));
      absSuggestions.push('Consider defining additional interface contracts for swappable strategies and storage/repositories.');
    } else {
      absConcerns.push('Zero interface contracts found. Caller classes depend directly on concrete implementations, violating Dependency Inversion.');
      absSuggestions.push('Define interface contracts (e.g. IStrategy, IService, IRepository) to decouple calling logic from concrete implementations.');
    }

    if (codeLower.includes('implements ') || codeLower.includes('extends ')) {
      absScore += 3;
      absStrengths.push('Employed polymorphic inheritance/contracts to eliminate rigid conditional branches.');
      absEvidence.push(...findEvidence(['implements ', 'extends ']));
    } else if (totalAbstractions > 0) {
      absConcerns.push('Abstractions are declared but not implemented or extended by concrete classes.');
    }

    absScore = Math.min(10, Math.max(0, absScore));
    criteriaFeedback.push({
      criterionId: 'abstraction_interfaces',
      criterionName: 'Abstraction & Interfaces',
      score: absScore,
      maxScore: 10,
      weight: 0.25,
      evidence: absEvidence.length > 0 ? absEvidence.slice(0, 3) : ['No interface contracts or abstract base classes detected.'],
      strengths: absStrengths.length > 0 ? absStrengths : [],
      concerns: absConcerns.length > 0 ? absConcerns : ['Caller classes are tightly coupled to concrete classes.'],
      suggestions: absSuggestions.length > 0 ? absSuggestions : ['Inject dependencies via interface contracts in constructors.']
    });

    // =========================================================================
    // 3. CRITERION: Extensibility & Design Patterns (Weight: 20%, Max: 10)
    // =========================================================================
    let patScore = 0;
    const patStrengths: string[] = [];
    const patConcerns: string[] = [];
    const patSuggestions: string[] = [];
    const patEvidence: string[] = [];

    if (analysis.hasDesignPatternsIdentified.length >= 2) {
      patScore += 8;
      patStrengths.push(`Applied GoF design patterns: ${analysis.hasDesignPatternsIdentified.join(', ')}.`);
      patEvidence.push(...findEvidence(['strategy', 'factory', 'singleton', 'observer', 'state', 'decorator']));
    } else if (analysis.hasDesignPatternsIdentified.length === 1) {
      patScore += 5;
      patStrengths.push(`Applied ${analysis.hasDesignPatternsIdentified[0]} pattern for behavioral extensibility.`);
      patEvidence.push(...findEvidence(['strategy', 'factory', 'singleton', 'observer', 'state', 'decorator']));
      patSuggestions.push(`Consider combining with a Factory or Observer pattern to decouple instantiation and event handling.`);
    } else {
      patConcerns.push('No recognized design patterns detected; algorithm logic appears hardcoded into coordinator methods.');
      patSuggestions.push(`Apply classic patterns relevant to ${problem.title}, such as ${problem.referenceKeyConcepts.slice(0, 2).join(' or ')}.`);
    }

    if (rationaleLower.includes('strategy') || rationaleLower.includes('open-closed') || rationaleLower.includes('factory') || rationaleLower.includes('solid')) {
      patScore += 2;
      patStrengths.push('Design rationale explicitly justifies how design patterns protect the Open-Closed Principle.');
    }

    patScore = Math.min(10, Math.max(0, patScore));
    criteriaFeedback.push({
      criterionId: 'extensibility_patterns',
      criterionName: 'Extensibility & Patterns',
      score: patScore,
      maxScore: 10,
      weight: 0.20,
      evidence: patEvidence.length > 0 ? patEvidence.slice(0, 3) : ['No recognized design patterns detected in code.'],
      strengths: patStrengths.length > 0 ? patStrengths : [],
      concerns: patConcerns.length > 0 ? patConcerns : ['Adding new requirements requires modifying existing coordinator code.'],
      suggestions: patSuggestions.length > 0 ? patSuggestions : ['Use Strategy pattern to make core algorithms pluggable at runtime.']
    });

    // =========================================================================
    // 4. CRITERION: Edge Cases, State & Concurrency (Weight: 15%, Max: 10)
    // =========================================================================
    let edgeScore = 0;
    const edgeStrengths: string[] = [];
    const edgeConcerns: string[] = [];
    const edgeSuggestions: string[] = [];
    const edgeEvidence: string[] = [];

    // Defensive error handling & validation
    const defensiveCount = (codeLower.match(/throw new|return null|return false|if\s*\(!|== null|=== null|undefined/g) || []).length;
    if (defensiveCount >= 3) {
      edgeScore += 5;
      edgeStrengths.push(`Robust defensive programming with ${defensiveCount} explicit boundary validations & guards.`);
      edgeEvidence.push(...findEvidence(['throw new', 'return null', 'return false', 'if (!', '== null']));
    } else if (defensiveCount >= 1) {
      edgeScore += 2;
      edgeStrengths.push('Basic boundary check present.');
      edgeEvidence.push(...findEvidence(['throw new', 'return null', 'return false', 'if (!']));
      edgeConcerns.push('Limited defensive validations for edge cases (e.g. capacity overflow, invalid identifiers, double actions).');
      edgeSuggestions.push('Add comprehensive defensive checks for boundary conditions and invalid input states.');
    } else {
      edgeConcerns.push('Missing boundary validations (e.g. full capacity, double operations, missing entity lookups).');
      edgeSuggestions.push('Implement explicit guards with domain-specific exceptions or Result types.');
    }

    // Concurrency awareness
    const hasConcurrency = (codeLower + ' ' + rationaleLower + ' ' + assumptionsLower).includes('thread') ||
      (codeLower + ' ' + rationaleLower + ' ' + assumptionsLower).includes('concurren') ||
      (codeLower + ' ' + rationaleLower + ' ' + assumptionsLower).includes('lock') ||
      (codeLower + ' ' + rationaleLower + ' ' + assumptionsLower).includes('atomic') ||
      (codeLower + ' ' + rationaleLower + ' ' + assumptionsLower).includes('mutex') ||
      (codeLower + ' ' + rationaleLower + ' ' + assumptionsLower).includes('synchronized');

    if (hasConcurrency) {
      edgeScore += 5;
      edgeStrengths.push('Addressed thread safety and race conditions under simultaneous operations.');
      edgeEvidence.push(...findEvidence(['lock', 'atomic', 'mutex', 'synchronized', 'concurren']));
    } else if (nonCommentLines.length >= 15) {
      edgeConcerns.push('Concurrency and multi-client race conditions were not addressed in code or design notes.');
      edgeSuggestions.push('Explain how shared resource state transitions remain thread-safe under concurrent requests.');
    }

    edgeScore = Math.min(10, Math.max(0, edgeScore));
    criteriaFeedback.push({
      criterionId: 'edge_cases_concurrency',
      criterionName: 'Edge Cases & Testability',
      score: edgeScore,
      maxScore: 10,
      weight: 0.15,
      evidence: edgeEvidence.length > 0 ? edgeEvidence.slice(0, 3) : ['No defensive guards or concurrency synchronization found.'],
      strengths: edgeStrengths.length > 0 ? edgeStrengths : [],
      concerns: edgeConcerns.length > 0 ? edgeConcerns : ['State transitions need explicit guards against race conditions.'],
      suggestions: edgeSuggestions.length > 0 ? edgeSuggestions : ['Add thread safety considerations and explicit error handling for edge cases.']
    });

    // =========================================================================
    // 5. CRITERION: Assumptions, Rationale & Trade-offs (Weight: 15%, Max: 10)
    // =========================================================================
    let ratScore = 0;
    const ratStrengths: string[] = [];
    const ratConcerns: string[] = [];
    const ratSuggestions: string[] = [];
    const ratEvidence: string[] = [];

    if (assumptions.length >= 60) {
      ratScore += 5;
      ratStrengths.push('Thoroughly documented assumptions constraining scale, concurrency, and functional scope.');
      ratEvidence.push(`Assumptions: "${assumptions.slice(0, 65)}..."`);
    } else if (assumptions.length >= 20) {
      ratScore += 2;
      ratStrengths.push('Basic scope assumptions documented.');
      ratEvidence.push(`Assumptions: "${assumptions.slice(0, 50)}..."`);
      ratSuggestions.push('Expand assumptions to cover operational scale, transaction boundaries, and external dependencies.');
    } else {
      ratConcerns.push('Assumptions section is empty or too brief. Scoping is vital in LLD interviews.');
      ratSuggestions.push('Document explicit assumptions regarding throughput, synchronous vs asynchronous flows, and boundary constraints.');
    }

    if (rationale.length >= 80) {
      ratScore += 5;
      ratStrengths.push('Clear architectural trade-off analysis explaining why specific patterns and data structures were chosen.');
    } else if (rationale.length >= 30) {
      ratScore += 2;
      ratStrengths.push('Brief design rationale provided.');
      ratSuggestions.push('Deepen rationale by analyzing time/space trade-offs and alternative design approaches.');
    } else {
      ratConcerns.push('Lacks design rationale explaining architectural trade-offs (e.g. space vs time complexity, flexibility vs simplicity).');
      ratSuggestions.push('Defend your structural choices and explain why chosen patterns fit better than alternative designs.');
    }

    ratScore = Math.min(10, Math.max(0, ratScore));
    criteriaFeedback.push({
      criterionId: 'rationale_tradeoffs',
      criterionName: 'Design Rationale',
      score: ratScore,
      maxScore: 10,
      weight: 0.15,
      evidence: ratEvidence.length > 0 ? ratEvidence.slice(0, 2) : ['Assumptions and rationale sections are missing or minimal.'],
      strengths: ratStrengths.length > 0 ? ratStrengths : [],
      concerns: ratConcerns.length > 0 ? ratConcerns : ['Discuss architectural trade-offs in greater depth.'],
      suggestions: ratSuggestions.length > 0 ? ratSuggestions : ['Highlight what trade-offs were made and why alternative options were discarded.']
    });

    // =========================================================================
    // Aggregate Overall Score & Findings
    // =========================================================================
    let overallScore = 0;
    for (const c of criteriaFeedback) {
      overallScore += (c.score / c.maxScore) * (c.weight * 100);
      if (c.strengths.length > 0) allStrengths.push(...c.strengths);
      if (c.concerns.length > 0) allConcerns.push(...c.concerns);
      if (c.suggestions.length > 0) allRecommendations.push(...c.suggestions);
    }
    overallScore = Math.round(overallScore);

    // Apply strict penalty if submission is stub / minimal
    if (isMinimalOrStub) {
      overallScore = Math.min(overallScore, 12);
      allConcerns.unshift(`Incomplete Submission: Only ${nonCommentLines.length} line(s) of code and ${totalTypes} domain type(s) submitted. LLD practice requires a complete architectural decomposition.`);
      allRecommendations.unshift(`Implement the core domain entities (${problem.expectedEntities.slice(0, 3).join(', ')}), interface contracts, and complete business methods.`);
    }

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

