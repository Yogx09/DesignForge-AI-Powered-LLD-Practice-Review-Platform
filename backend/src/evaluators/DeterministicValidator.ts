import { Problem, SubmissionContent, DeterministicCheckResult } from '../domain/types.js';

export interface CodeStructureAnalysis {
  classes: string[];
  interfaces: string[];
  enums: string[];
  abstractClasses: string[];
  methodCount: number;
  linesOfCode: number;
  hasDesignPatternsIdentified: string[];
}

export class DeterministicValidator {
  public analyzeCode(code: string): CodeStructureAnalysis {
    const lines = code.split('\n');
    const classes: string[] = [];
    const interfaces: string[] = [];
    const enums: string[] = [];
    const abstractClasses: string[] = [];
    let methodCount = 0;

    // Regex extraction
    const classRegex = /(?:class|public\s+class|abstract\s+class)\s+([A-Za-z0-9_]+)/g;
    const interfaceRegex = /(?:interface|public\s+interface)\s+([A-Za-z0-9_]+)/g;
    const enumRegex = /(?:enum|public\s+enum)\s+([A-Za-z0-9_]+)/g;
    const abstractClassRegex = /abstract\s+class\s+([A-Za-z0-9_]+)/g;
    const methodRegex = /(?:public|private|protected|static|\s+async)?\s+([A-Za-z0-9_]+)\s*\([^)]*\)\s*(?::|\{|throws)/g;

    let match;
    while ((match = classRegex.exec(code)) !== null) {
      if (!match[0].includes('abstract')) {
        classes.push(match[1]);
      }
    }
    while ((match = abstractClassRegex.exec(code)) !== null) {
      abstractClasses.push(match[1]);
    }
    while ((match = interfaceRegex.exec(code)) !== null) {
      interfaces.push(match[1]);
    }
    while ((match = enumRegex.exec(code)) !== null) {
      enums.push(match[1]);
    }
    while ((match = methodRegex.exec(code)) !== null) {
      if (!['if', 'for', 'while', 'switch', 'catch', 'constructor'].includes(match[1])) {
        methodCount++;
      }
    }

    // Identify common design pattern keywords
    const patternsFound: string[] = [];
    const lower = code.toLowerCase();
    if (lower.includes('strategy') || lower.includes('istrategy') || lower.includes('algorithm')) patternsFound.push('Strategy');
    if (lower.includes('factory') || lower.includes('createvehicle') || lower.includes('createexpense')) patternsFound.push('Factory');
    if (lower.includes('observer') || lower.includes('listener') || lower.includes('subscribe') || lower.includes('notify')) patternsFound.push('Observer');
    if (lower.includes('state') || lower.includes('istate') || lower.includes('transition')) patternsFound.push('State');
    if (lower.includes('singleton') || lower.includes('getinstance')) patternsFound.push('Singleton');
    if (lower.includes('decorator') || lower.includes('wrapper')) patternsFound.push('Decorator');

    return {
      classes,
      interfaces,
      enums,
      abstractClasses,
      methodCount,
      linesOfCode: lines.length,
      hasDesignPatternsIdentified: patternsFound
    };
  }

  public validate(problem: Problem, submission: SubmissionContent): {
    isValid: boolean;
    checks: DeterministicCheckResult[];
    analysis: CodeStructureAnalysis;
  } {
    const checks: DeterministicCheckResult[] = [];
    const analysis = this.analyzeCode(submission.code);

    // 1. Mandatory Submission Sections Check
    const hasAssumptions = (submission.assumptions || '').trim().length > 15;
    checks.push({
      checkName: 'Assumptions & Scope Definition',
      passed: hasAssumptions,
      message: hasAssumptions
        ? 'Assumptions and system boundary clearly stated.'
        : 'Missing or overly brief assumptions. Clear scoping is required for LLD interviews.'
    });

    const hasDiagram = (submission.diagramMermaid || '').trim().length > 20;
    checks.push({
      checkName: 'Class Diagram / Structural Overview',
      passed: hasDiagram,
      message: hasDiagram
        ? 'Mermaid structural diagram provided.'
        : 'Missing structural diagram or class relationship definition.'
    });

    const hasCode = (submission.code || '').trim().length > 50;
    checks.push({
      checkName: 'Code Implementation Substance',
      passed: hasCode,
      message: hasCode
        ? `Code provided (${analysis.linesOfCode} lines, ${analysis.classes.length + analysis.abstractClasses.length} classes).`
        : 'Code implementation is too brief or empty.'
    });

    const hasRationale = (submission.designRationale || '').trim().length > 20;
    checks.push({
      checkName: 'Design Pattern Justifications & Rationale',
      passed: hasRationale,
      message: hasRationale
        ? 'Design rationale and trade-offs documented.'
        : 'Missing design rationale and trade-off justification.'
    });

    // 2. Structural Abstraction & Cohesion Checks
    const totalTypes = analysis.classes.length + analysis.abstractClasses.length + analysis.interfaces.length;
    const hasSufficientDecomposition = totalTypes >= 3;
    checks.push({
      checkName: 'Domain Decomposition & Types',
      passed: hasSufficientDecomposition,
      message: hasSufficientDecomposition
        ? `Identified ${totalTypes} distinct domain types (Classes: ${analysis.classes.length}, Interfaces: ${analysis.interfaces.length}, Abstract: ${analysis.abstractClasses.length}).`
        : `Under-decomposed design: found only ${totalTypes} types. LLD problems typically require separating responsibilities across multiple classes/interfaces.`
    });

    // 3. Interface / Abstraction Presence
    const hasAbstractions = analysis.interfaces.length > 0 || analysis.abstractClasses.length > 0;
    checks.push({
      checkName: 'Interface & Abstraction Contracts',
      passed: hasAbstractions,
      message: hasAbstractions
        ? `Good use of abstraction contracts (${analysis.interfaces.length} interfaces, ${analysis.abstractClasses.length} abstract classes).`
        : 'No interfaces or abstract classes found. Relying solely on concrete classes violates Dependency Inversion (DIP) and weakens testability.'
    });

    // 4. Expected Entities Coverage
    const allCodeText = (submission.code + ' ' + submission.diagramMermaid).toLowerCase();
    const matchedExpectedEntities = problem.expectedEntities.filter(entity => {
      const baseName = entity.split(' ')[0].toLowerCase().replace(/[^a-z]/g, '');
      return allCodeText.includes(baseName);
    });
    const entityCoverageRatio = matchedExpectedEntities.length / Math.max(1, problem.expectedEntities.length);
    const hasEntityCoverage = entityCoverageRatio >= 0.4;
    checks.push({
      checkName: 'Core Domain Entities Coverage',
      passed: hasEntityCoverage,
      message: `Domain entity coverage: ${matchedExpectedEntities.length}/${problem.expectedEntities.length} core concepts represented.`,
      details: matchedExpectedEntities
    });

    // Determine overall validity
    const isValid = checks.filter(c => !c.passed).length <= 2 && hasCode;

    return { isValid, checks, analysis };
  }
}
