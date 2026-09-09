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

    const codeLower = submission.code.toLowerCase();
    const rationaleLower = submission.designRationale.toLowerCase();
    const assumptionsLower = submission.assumptions.toLowerCase();
    const diagramLower = submission.diagramMermaid.toLowerCase();
    const fullText = `${codeLower} ${rationaleLower} ${assumptionsLower} ${diagramLower}`;

    const criteriaFeedback: CriterionFeedback[] = [];
    const allStrengths: string[] = [];
    const allConcerns: string[] = [];
    const allRecommendations: string[] = [];

    // --- CRITERION 1: Domain Modeling & Cohesion (Weight: 25%) ---
    let domainScore = 5;
    const domainStrengths: string[] = [];
    const domainConcerns: string[] = [];
    const domainSuggestions: string[] = [];
    const domainEvidence: string[] = [];

    if (analysis.classes.length >= 3) {
      domainScore += 2;
      domainStrengths.push(`Clean decomposition into ${analysis.classes.length} dedicated domain entities.`);
      domainEvidence.push(`Classes defined: ${analysis.classes.slice(0, 4).join(', ')}`);
    } else {
      domainScore -= 1;
      domainConcerns.push('Low entity granularity; multiple responsibilities appear merged into too few classes.');
      domainSuggestions.push('Split orchestrator logic from individual domain models to maintain high cohesion.');
    }

    if (analysis.enums.length > 0) {
      domainScore += 1;
      domainStrengths.push(`Used explicit enums (${analysis.enums.join(', ')}) instead of magic strings for states/types.`);
      domainEvidence.push(`Enums: ${analysis.enums.join(', ')}`);
    } else {
      domainConcerns.push('No enums or type constants found for states/categories.');
      domainSuggestions.push('Replace string or integer representations of types/statuses with strongly-typed enums.');
    }

    if (codeLower.includes('private') || codeLower.includes('readonly') || codeLower.includes('protected')) {
      domainScore += 1;
      domainStrengths.push('Proper encapsulation applied with private/protected instance fields.');
    } else {
      domainConcerns.push('Weak field encapsulation detected; fields might be exposed publicly.');
      domainSuggestions.push('Make internal state private and provide explicit domain methods rather than naked getters/setters.');
    }

    domainScore = Math.min(10, Math.max(2, domainScore));
    criteriaFeedback.push({
      criterionId: 'domain_modeling',
      criterionName: 'Domain Modeling & Cohesion',
      score: domainScore,
      maxScore: 10,
      weight: 0.25,
      evidence: domainEvidence.length > 0 ? domainEvidence : ['Analyzed class declarations and field visibility modifiers.'],
      strengths: domainStrengths.length > 0 ? domainStrengths : ['Basic entity structure created.'],
      concerns: domainConcerns.length > 0 ? domainConcerns : ['Entity boundaries could be sharpened further.'],
      suggestions: domainSuggestions.length > 0 ? domainSuggestions : ['Continue enforcing Single Responsibility Principle across entities.']
    });

    // --- CRITERION 2: Abstraction & Interface Segregation (Weight: 25%) ---
    let abstractionScore = 4;
    const absStrengths: string[] = [];
    const absConcerns: string[] = [];
    const absSuggestions: string[] = [];
    const absEvidence: string[] = [];

    if (analysis.interfaces.length > 0 || analysis.abstractClasses.length > 0) {
      abstractionScore += 3;
      absStrengths.push(`Decoupled interfaces/abstract contracts created (${[...analysis.interfaces, ...analysis.abstractClasses].join(', ')}).`);
      absEvidence.push(`Contracts: ${[...analysis.interfaces, ...analysis.abstractClasses].join(', ')}`);
    } else {
      abstractionScore -= 2;
      absConcerns.push('Lack of interface contracts; high coupling to concrete implementations (violates DIP).');
      absSuggestions.push('Introduce interface contracts for variable behaviors (e.g. strategy interfaces or data providers).');
    }

    if (codeLower.includes('implements') || codeLower.includes('extends')) {
      abstractionScore += 2;
      absStrengths.push('Polymorphism and inheritance used to eliminate switch-case anti-patterns.');
    }

    abstractionScore = Math.min(10, Math.max(2, abstractionScore));
    criteriaFeedback.push({
      criterionId: 'abstraction_interfaces',
      criterionName: 'Abstraction & Interface Segregation',
      score: abstractionScore,
      maxScore: 10,
      weight: 0.25,
      evidence: absEvidence.length > 0 ? absEvidence : ['Evaluated interface definitions and inheritance hierarchy.'],
      strengths: absStrengths.length > 0 ? absStrengths : ['Basic class inheritance present.'],
      concerns: absConcerns.length > 0 ? absConcerns : ['Interfaces could be segregated into more focused client contracts.'],
      suggestions: absSuggestions.length > 0 ? absSuggestions : ['Ensure caller classes depend on abstractions rather than concrete classes.']
    });

    // --- CRITERION 3: Extensibility & Design Patterns (Weight: 20%) ---
    let patternScore = 4;
    const patStrengths: string[] = [];
    const patConcerns: string[] = [];
    const patSuggestions: string[] = [];
    const patEvidence: string[] = [];

    if (analysis.hasDesignPatternsIdentified.length > 0) {
      patternScore += 3;
      patStrengths.push(`Identified relevant GoF patterns: ${analysis.hasDesignPatternsIdentified.join(', ')}.`);
      patEvidence.push(`Patterns detected in code/diagram: ${analysis.hasDesignPatternsIdentified.join(', ')}`);
    } else {
      patConcerns.push('No clear design patterns detected; algorithm/business variations appear hardcoded.');
      patSuggestions.push(`Consider applying patterns relevant to ${problem.title}, such as ${problem.referenceKeyConcepts.slice(0, 2).join(' or ')}.`);
    }

    if (rationaleLower.includes('strategy') || rationaleLower.includes('factory') || rationaleLower.includes('open-closed')) {
      patternScore += 2;
      patStrengths.push('Design rationale explicitly explains how the architecture supports future feature extension (Open-Closed Principle).');
    }

    patternScore = Math.min(10, Math.max(2, patternScore));
    criteriaFeedback.push({
      criterionId: 'extensibility_patterns',
      criterionName: 'Extensibility & Design Patterns',
      score: patternScore,
      maxScore: 10,
      weight: 0.20,
      evidence: patEvidence.length > 0 ? patEvidence : ['Inspected extensibility mechanisms and pattern semantics.'],
      strengths: patStrengths.length > 0 ? patStrengths : ['Clear intention to modularize business logic.'],
      concerns: patConcerns.length > 0 ? patConcerns : ['Adding new behavior will require modifying existing coordinator classes.'],
      suggestions: patSuggestions.length > 0 ? patSuggestions : ['Use Factory or Strategy pattern to make algorithm selection dynamically configurable.']
    });

    // --- CRITERION 4: Edge Cases, State & Concurrency (Weight: 15%) ---
    let edgeScore = 4;
    const edgeStrengths: string[] = [];
    const edgeConcerns: string[] = [];
    const edgeSuggestions: string[] = [];
    const edgeEvidence: string[] = [];

    const hasValidation = codeLower.includes('if (!') || codeLower.includes('throw new') || codeLower.includes('return false') || codeLower.includes('null');
    if (hasValidation) {
      edgeScore += 2;
      edgeStrengths.push('Input validation and defensive boundary checks present.');
      edgeEvidence.push('Contains defensive condition checks / exception handling.');
    } else {
      edgeConcerns.push('Missing boundary validations (e.g. null checks, capacity overflow, invalid state transitions).');
      edgeSuggestions.push('Add defensive checks for invalid inputs, full capacity, and race conditions.');
    }

    const hasConcurrencyMention = fullText.includes('thread') || fullText.includes('concurren') || fullText.includes('sync') || fullText.includes('mutex') || fullText.includes('atomic') || fullText.includes('lock');
    if (hasConcurrencyMention) {
      edgeScore += 2;
      edgeStrengths.push('Demonstrated awareness of concurrent access and race condition prevention.');
      edgeEvidence.push('Concurrency / thread-safety mechanisms referenced.');
    } else {
      edgeConcerns.push('Concurrency and multi-gate/multi-client race conditions were not addressed.');
      edgeSuggestions.push('Explain how state mutations (e.g. booking a spot or dispatching a car) remain atomic under high concurrency.');
    }

    edgeScore = Math.min(10, Math.max(2, edgeScore));
    criteriaFeedback.push({
      criterionId: 'edge_cases_concurrency',
      criterionName: 'Edge Cases, State & Concurrency',
      score: edgeScore,
      maxScore: 10,
      weight: 0.15,
      evidence: edgeEvidence.length > 0 ? edgeEvidence : ['Evaluated defensive programming and state transition guards.'],
      strengths: edgeStrengths.length > 0 ? edgeStrengths : ['Basic state handling in place.'],
      concerns: edgeConcerns.length > 0 ? edgeConcerns : ['Edge cases like empty states or conflicting operations need explicit guards.'],
      suggestions: edgeSuggestions.length > 0 ? edgeSuggestions : ['Add thread safety considerations and explicit error handling for edge cases.']
    });

    // --- CRITERION 5: Assumptions, Rationale & Trade-offs (Weight: 15%) ---
    let rationaleScore = 4;
    const ratStrengths: string[] = [];
    const ratConcerns: string[] = [];
    const ratSuggestions: string[] = [];
    const ratEvidence: string[] = [];

    if (submission.assumptions.trim().length > 30) {
      rationaleScore += 2;
      ratStrengths.push('Well-structured assumptions that constrain problem scope sensibly.');
      ratEvidence.push(`Assumptions provided: "${submission.assumptions.slice(0, 60)}..."`);
    } else {
      ratConcerns.push('Assumptions are minimal or unspecified.');
      ratSuggestions.push('Document key assumptions regarding throughput, scale, synchronous vs async processing, and payment/persistence guarantees.');
    }

    if (submission.designRationale.trim().length > 40) {
      rationaleScore += 2;
      ratStrengths.push('Clear design trade-off reasoning provided explaining why specific structures were chosen.');
    } else {
      ratConcerns.push('Lacks trade-off explanations (e.g. latency vs consistency, memory vs computation).');
      ratSuggestions.push('Explicitly defend your design decisions and explain alternative approaches you considered and rejected.');
    }

    rationaleScore = Math.min(10, Math.max(2, rationaleScore));
    criteriaFeedback.push({
      criterionId: 'rationale_tradeoffs',
      criterionName: 'Assumptions, Rationale & Trade-offs',
      score: rationaleScore,
      maxScore: 10,
      weight: 0.15,
      evidence: ratEvidence.length > 0 ? ratEvidence : ['Analyzed stated assumptions and rationale section.'],
      strengths: ratStrengths.length > 0 ? ratStrengths : ['Assumptions documented.'],
      concerns: ratConcerns.length > 0 ? ratConcerns : ['Discuss design trade-offs in greater depth.'],
      suggestions: ratSuggestions.length > 0 ? ratSuggestions : ['Highlight what trade-offs were made and why.']
    });

    // Compute Overall Weighted Score (0 - 100)
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
