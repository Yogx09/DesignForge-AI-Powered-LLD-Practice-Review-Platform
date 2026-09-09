# AI Usage Log & Architectural Decisions

This document outlines key AI-assisted decisions made during the design and implementation of the **LLD Practice Platform**, detailing what was suggested, what was accepted or rejected, and the engineering rationale behind each decision.

---

### Decision 1: Structured Multi-Faceted Submission vs. Single Code Blob

* **AI Suggestion**: A single monolithic code editor where candidates write classes and comments in one file (similar to LeetCode).
* **Decision**: **Rejected** single code blob; **Accepted** multi-section structured submission (`Assumptions`, `Mermaid Class Diagram`, `Code Implementation`, `Design Patterns & Trade-offs`).
* **Rationale**: In real-world LLD interviews (e.g. Google, Amazon, Uber), interviewers evaluate how well a candidate scopes assumptions, sketches structural relationships, and justifies trade-offs *before* judging code syntax. Separating these sections allows the evaluator to score domain modeling and trade-offs independently.

---

### Decision 2: Rubric-Grounded Evaluation vs. Unconstrained "100-point AI Score"

* **AI Suggestion**: A prompt asking the LLM: *"Rate this LLD solution out of 100 and give general feedback."*
* **Decision**: **Rejected** generic unconstrained scoring; **Accepted** a strict 5-dimension rubric with JSON schema constraints and mandatory evidence quoting.
* **Rationale**: Unconstrained prompts produce inconsistent, non-actionable "hallucinated" grades. By breaking down evaluation into 5 weighted dimensions (*Domain Modeling (25%)*, *Abstraction & Interfaces (25%)*, *Extensibility (20%)*, *Edge Cases & Concurrency (15%)*, and *Rationale (15%)*), the feedback becomes explainable, reproducible, and directly points to evidence in the candidate's code.

---

### Decision 3: Deterministic Static Checks + Heuristic Fallback vs. Pure LLM Pipeline

* **AI Suggestion**: Rely solely on OpenAI/Gemini API calls for all validation, syntax checks, and rubric grading.
* **Decision**: **Rejected** pure LLM dependency; **Accepted** a Composite Evaluator with a fast `DeterministicValidator` and a high-fidelity offline `HeuristicEvaluator` fallback.
* **Rationale**: 
  1. Deterministic checks (e.g., presence of required sections, class count, interface contracts, enum usage) run in `<10ms` without API latency or cost.
  2. If the user does not have an API key or is offline, the platform still provides rich, constructive rubric feedback out-of-the-box.
  3. External API failures never crash the practice workflow.

---

### Decision 4: Version-over-Version Delta Tracking vs. Isolated Stateless Submissions

* **AI Suggestion**: Reset the attempt upon each submission or treat every submission as an isolated one-off assessment.
* **Decision**: **Rejected** isolated submissions; **Accepted** an `Attempt` Aggregate Root maintaining an append-only `Submission[]` history with automated delta computation ($Attempt_{N} - Attempt_{N-1}$).
* **Rationale**: The true value of a practice platform is the learning loop: *Design $\to$ Submit $\to$ Review $\to$ Refine $\to$ Re-evaluate*. Tracking score deltas (e.g., "$+15$ on Abstraction; resolved 2 critical coupling concerns") provides visible positive reinforcement of architectural growth.
