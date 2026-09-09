# Design Note: LLD Practice Platform Architecture & Domain Model

**Platform**: CipherSchools LLD Practice Studio  
**Target Focus**: Domain-Driven Design, Extensibility, Evaluator Architecture & Trade-offs  

---

## 1. System Architecture & Domain Model

The platform itself is engineered following strict Low-Level Design and Clean Architecture principles, structuring the application into clear decoupled layers:

```
┌─────────────────────────────────────────────────────────────┐
│                    Presentation Layer                       │
│  React Studio, Problem Catalog, Visual Feedback Dashboard   │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTP REST
┌──────────────────────────────▼──────────────────────────────┐
│                    Application Layer                        │
│            PracticeService, Evaluator Orchestration         │
└──────────────┬──────────────────────────────┬───────────────┘
               │                              │
┌──────────────▼──────────────┐┌──────────────▼───────────────┐
│        Domain Layer         ││     Evaluator Pipeline       │
│  Problem, Attempt,          ││  IEvaluator (Strategy)       │
│  Submission, RubricSpec,    ││  - DeterministicValidator    │
│  EvaluationResult           ││  - CompositeEvaluator        │
│                             ││  - HeuristicEvaluator        │
│                             ││  - GeminiAIEvaluator         │
└─────────────────────────────┘└──────────────────────────────┘
```

### Core Domain Entities & Responsibilities

| Class / Interface | Primary Responsibility | Key Collaborators / Dependencies |
| :--- | :--- | :--- |
| **`Problem`** | Encapsulates challenge metadata, functional & non-functional requirements, constraints, expected entities, and rubric specifications. | `RubricCriterionSpec`, `StarterTemplate` |
| **`Attempt`** | Aggregate Root managing the lifecycle of a learner's attempts for a problem (`IN_PROGRESS` $\to$ `EVALUATING` $\to$ `EVALUATED` $\to$ `FAILED`). | `Submission`, `Problem` |
| **`Submission`** | Entity representing a specific version snapshot ($v1, v2, ...$) containing Assumptions, Mermaid diagram, code, language, and design rationale. | `SubmissionContent`, `EvaluationResult` |
| **`IEvaluator`** | Strategy interface establishing the contract for evaluating a submission against a problem. | `Problem`, `SubmissionContent`, `EvaluationResult` |
| **`DeterministicValidator`** | Performs fast, deterministic static analysis (checks mandatory sections, extracts classes/interfaces/enums/patterns, detects God classes). | `CodeStructureAnalysis`, `DeterministicCheckResult` |
| **`HeuristicEvaluator`** | Zero-config, rule-grounded evaluator calculating 5-dimension rubric scores, evidence quotes, concerns, and actionable advice offline. | `DeterministicValidator`, `RubricCriterionSpec` |
| **`GeminiAIEvaluator`** | LLM-based evaluator leveraging Google Gemini with a strict JSON schema prompt; falls back gracefully to Heuristic evaluator. | `IEvaluator`, `DeterministicValidator` |
| **`CompositeEvaluator`** | Orchestrator combining deterministic sanity checks with AI / Heuristic evaluation strategies. | `IEvaluator`, `DeterministicValidator` |
| **`PracticeService`** | Application Service coordinating problem retrieval, attempt state transitions, submission evaluation, and version delta comparisons. | `ProblemRepository`, `AttemptRepository`, `IEvaluator` |

---

## 2. Evaluation Approach & State Machine

### Deterministic vs. AI Division of Labor

```
                                [ Learner Submission ]
                                          │
                   ┌──────────────────────┴──────────────────────┐
                   ▼                                             ▼
       [ Deterministic Validator ]                     [ Semantic Evaluator ]
       - Non-empty section guards                      - Cohesion & SRP Depth
       - Domain class count extraction                 - Coupling & Abstraction Quality
       - Interface / Abstract class count              - GoF Pattern Appropriateness
       - Enum usage for states                         - Defensive Concurrency Reasoning
       - Mermaid syntax validation                     - Trade-off & Assumption Quality
                   │                                             │
                   └──────────────────────┬──────────────────────┘
                                          ▼
                             [ Composite Rubric Result ]
                             - Overall Score (0-100 pts)
                             - Criterion Feedback + Evidence
                             - Concrete Actionable Tips
```

### Evaluation Lifecycle State Machine
```
[ DRAFT / IN_PROGRESS ] ──> (Submit) ──> [ EVALUATING ]
                                            │
                                ┌───────────┴───────────┐
                                ▼                       ▼
                         [ EVALUATED ]               [ FAILED ]
                      (Store Score & Delta)    (Preserve Submission)
```
- **Durability**: The learner's submission is stored in the repository *before* evaluation execution begins. If the evaluator encounters a timeout or external failure, the submission content is never lost.
- **Async Resilience**: In high-load environments, `PracticeService` can dispatch evaluation to an async worker queue (e.g. BullMQ / Redis) while the client polls or receives updates via WebSockets/SSE.

---

## 3. Extensibility & Change Tests

### Change Test A: "Today the learner submits text. Later the platform supports a class diagram or interactive UML canvas."
- **Domain Impact**: **Minimal to zero.** `SubmissionContent` is an encapsulated value object containing `diagramMermaid: string`. If we introduce a drag-and-drop canvas (e.g., ReactFlow or PlantUML), we only extend the serializer in the presentation layer and add an optional JSON schema field to `SubmissionContent`. The `Attempt`, `Problem`, and `PracticeService` remain completely untouched.

### Change Test B: "Today feedback comes from one evaluator. Later you add a peer review, automated test runner, or human mentor review."
- **Domain Impact**: **Zero.** `IEvaluator` is a polymorphic strategy interface. Adding `HumanMentorEvaluator` or `AutomatedJUnitTestRunner` only requires implementing `IEvaluator.evaluate()` and registering it in `CompositeEvaluator`. The practice loop and submission workflows remain 100% stable (Open-Closed Principle).

---

## 4. Key Trade-offs Made for the 2-Day MVP

1. **Monolithic In-Memory Repository vs. Distributed Database**:
   - *Decision*: In-memory repository with clean repository interface.
   - *Rationale*: Avoided external database setup friction (Postgres/MongoDB) to focus 100% of effort on domain modeling, rubric depth, and the learner experience. A SQL/NoSQL implementation is a drop-in replacement for `ProblemRepository` and `AttemptRepository`.
2. **Hybrid Heuristic Engine vs Pure Cloud LLM Dependency**:
   - *Decision*: Built a comprehensive, rule-based `HeuristicEvaluator` with optional `GeminiAIEvaluator`.
   - *Rationale*: Eliminates fragile API key requirements and network rate-limiting during evaluation demos, ensuring the platform runs out-of-the-box in any environment.
3. **Structured Tabbed Editor vs Heavy Cloud IDE Containers**:
   - *Decision*: Structured multi-tab form (Assumptions + Mermaid + Code + Rationale) rather than spinning up heavy Docker containers per learner.
   - *Rationale*: LLD interviews focus on class contracts, responsibilities, and architecture rather than raw bytecode compilation.
