import { RubricCriterionSpec } from './types.js';

export const STANDARD_LLD_RUBRIC: RubricCriterionSpec[] = [
  {
    id: 'domain_modeling',
    name: 'Domain Modeling & Cohesion',
    description: 'Appropriate entity breakdown, clean encapsulation, single-responsibility principle (SRP), and realistic mapping to real-world domain concepts.',
    weight: 0.25,
    maxScore: 10
  },
  {
    id: 'abstraction_interfaces',
    name: 'Abstraction & Interface Segregation',
    description: 'Clear contract interfaces, loose coupling between components, adherence to Dependency Inversion (DIP) and Liskov Substitution (LSP).',
    weight: 0.25,
    maxScore: 10
  },
  {
    id: 'extensibility_patterns',
    name: 'Extensibility & Design Patterns',
    description: 'Appropriate application of classic GoF design patterns (Strategy, Factory, State, Observer) to allow easy requirement extensions without modifying existing code (OCP).',
    weight: 0.20,
    maxScore: 10
  },
  {
    id: 'edge_cases_concurrency',
    name: 'Edge Cases, State & Concurrency',
    description: 'Handling boundary conditions, state validation, thread safety considerations, idempotency, and testability of core logic.',
    weight: 0.15,
    maxScore: 10
  },
  {
    id: 'rationale_tradeoffs',
    name: 'Assumptions, Rationale & Trade-offs',
    description: 'Explicit declaration of system scope, trade-off clarity (e.g. latency vs consistency, memory vs computation), and justification for key design choices.',
    weight: 0.15,
    maxScore: 10
  }
];
