import { Problem } from '../domain/types.js';
import { SEED_PROBLEMS } from '../data/seedProblems.js';

export class ProblemRepository {
  private problems: Map<string, Problem> = new Map();

  constructor() {
    for (const p of SEED_PROBLEMS) {
      this.problems.set(p.id, p);
    }
  }

  public getAll(): Problem[] {
    return Array.from(this.problems.values());
  }

  public getById(id: string): Problem | undefined {
    return this.problems.get(id);
  }

  public save(problem: Problem): void {
    this.problems.set(problem.id, problem);
  }
}
