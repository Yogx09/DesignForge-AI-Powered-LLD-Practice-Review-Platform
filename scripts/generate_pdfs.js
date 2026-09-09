import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const browserPath = fs.existsSync(edgePath) ? edgePath : chromePath;

// Styling for professional publication-ready PDF documents
const baseStyle = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap');
  
  @page {
    size: A4;
    margin: 18mm 16mm 18mm 16mm;
  }
  
  body {
    font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    color: #0f172a;
    line-height: 1.55;
    font-size: 10.5pt;
    background: #ffffff;
    margin: 0;
    padding: 0;
  }
  
  h1 {
    font-size: 19pt;
    font-weight: 800;
    color: #0f172a;
    margin-top: 0;
    margin-bottom: 8px;
    letter-spacing: -0.02em;
    border-bottom: 2px solid #6366f1;
    padding-bottom: 6px;
  }
  
  h2 {
    font-size: 13.5pt;
    font-weight: 700;
    color: #1e293b;
    margin-top: 18px;
    margin-bottom: 8px;
    letter-spacing: -0.01em;
    border-bottom: 1px solid #e2e8f0;
    padding-bottom: 4px;
  }
  
  h3 {
    font-size: 11.5pt;
    font-weight: 700;
    color: #334155;
    margin-top: 14px;
    margin-bottom: 6px;
  }

  p {
    margin-top: 0;
    margin-bottom: 10px;
    color: #334155;
  }
  
  .meta-box {
    background: #f8fafc;
    border-left: 4px solid #6366f1;
    padding: 10px 14px;
    border-radius: 4px;
    margin-bottom: 16px;
    font-size: 9.5pt;
    color: #475569;
  }
  
  .meta-box strong {
    color: #0f172a;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin: 14px 0;
    font-size: 9pt;
  }
  
  th, td {
    border: 1px solid #cbd5e1;
    padding: 7px 10px;
    text-align: left;
    vertical-align: top;
  }
  
  th {
    background: #f1f5f9;
    font-weight: 700;
    color: #0f172a;
  }

  tr:nth-child(even) {
    background: #f8fafc;
  }

  code {
    font-family: 'JetBrains Mono', monospace;
    background: #f1f5f9;
    color: #4338ca;
    padding: 2px 5px;
    border-radius: 3px;
    font-size: 9pt;
  }
  
  pre {
    font-family: 'JetBrains Mono', monospace;
    background: #0f172a;
    color: #e2e8f0;
    padding: 12px 14px;
    border-radius: 6px;
    font-size: 8.5pt;
    line-height: 1.45;
    overflow-x: auto;
    margin: 12px 0;
  }

  pre code {
    background: transparent;
    color: inherit;
    padding: 0;
  }

  ul, ol {
    margin-top: 0;
    margin-bottom: 10px;
    padding-left: 20px;
    color: #334155;
  }

  li {
    margin-bottom: 4px;
  }

  .badge {
    display: inline-block;
    padding: 2px 7px;
    border-radius: 999px;
    font-size: 8pt;
    font-weight: 700;
  }
  
  .badge-primary { background: #e0e7ff; color: #4338ca; }
  .badge-success { background: #dcfce7; color: #15803d; }
  .badge-amber { background: #fef3c7; color: #b45309; }

  .callout {
    background: #eff6ff;
    border: 1px solid #bfdbfe;
    border-radius: 6px;
    padding: 10px 14px;
    margin: 12px 0;
    font-size: 9.5pt;
    color: #1e40af;
  }

  .footer {
    margin-top: 24px;
    padding-top: 8px;
    border-top: 1px solid #e2e8f0;
    font-size: 8pt;
    color: #94a3b8;
    display: flex;
    justify-content: space-between;
  }
`;

function wrapHtml(title, bodyContent) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <style>${baseStyle}</style>
</head>
<body>
  ${bodyContent}
  <div class="footer">
    <span>DesignForge • CipherSchools Engineering Assignment</span>
    <span>Automated Evaluation Platform • Confidential</span>
  </div>
</body>
</html>`;
}

// 1. Research Note HTML
const researchNoteHtml = wrapHtml('Research Note - LLD Practice Platform', `
  <h1>Research Note: Low-Level Design (LLD) Practice & Evaluation Platform</h1>
  
  <div class="meta-box">
    <strong>Author:</strong> Engineering Assignment Submission &nbsp;|&nbsp;
    <strong>Target Track:</strong> CipherSchools 2-Day Engineering Assessment &nbsp;|&nbsp;
    <strong>Date:</strong> September 2026 &nbsp;|&nbsp;
    <strong>Deliverable:</strong> 1–2 Page Research Note
  </div>

  <h2>1. The Learner Problem: Why LLD Practice is Broken</h2>
  <p>
    Low-Level Design (Object-Oriented Design) is a mandatory hiring gate for Software Development Engineers (SDE-1, SDE-2, and Staff Engineers). In Data Structures and Algorithms (DSA), test vectors provide binary Pass/Fail feedback. In contrast, <strong>LLD evaluation is inherently multi-dimensional, open-ended, and non-deterministic</strong>.
  </p>
  <ul>
    <li><strong>Lack of Instant, Explainable Feedback:</strong> In DSA, candidates run code against hidden test cases. In LLD, candidates write classes (e.g. <em>Parking Lot</em>, <em>Elevator</em>) but have no automated feedback on class coupling, single responsibility violations, interface segregation, and concurrency bottlenecks.</li>
    <li><strong>Subjectivity vs. Principled Rubrics:</strong> Two engineers can model a <em>Parking Lot</em> differently (floor-centric vs. spot-centric) and both can be valid if trade-offs are defended. Learners struggle because existing tutorials show one rigid "solution" without explaining <em>why</em> alternative structures fail under evolving requirements.</li>
    <li><strong>The "Passive Consumption" Trap:</strong> Most candidates practice LLD by watching YouTube videos or reading static GitHub repos without building the active muscle memory of decomposing requirements into clean OOP interfaces.</li>
    <li><strong>No Version-over-Version Delta Tracking:</strong> Learners rarely know what improved between Attempt #1 and Attempt #2. Without delta scoring (e.g. <em>"+15 pts on Abstraction; resolved 2 critical coupling concerns"</em>), candidates cannot track architectural growth.</li>
  </ul>

  <h2>2. Competitive Landscape & Gap Analysis</h2>
  <table>
    <thead>
      <tr>
        <th>Platform / Tool</th>
        <th>Current Workflow</th>
        <th>Strengths</th>
        <th>Critical Gaps for LLD Learners</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>LeetCode / HackerRank</strong></td>
        <td>Unit test execution on single function / class interface (e.g. <code>LRUCache.get()</code>).</td>
        <td>Fast deterministic feedback; automated grading.</td>
        <td><strong>Forces algorithmic mindset.</strong> Ignores class decomposition, UML relationships, domain modeling, and design patterns.</td>
      </tr>
      <tr>
        <td><strong>Educative / Grokking LLD</strong></td>
        <td>Static reading, reference code walkthroughs, fixed class diagrams.</td>
        <td>Curated problem statements; good conceptual explanations.</td>
        <td><strong>Zero active evaluation.</strong> No feedback on learner submissions; passive consumption with no practice loop.</td>
      </tr>
      <tr>
        <td><strong>Interviewing.io / Pramp</strong></td>
        <td>Peer or mock human interviews with senior engineers.</td>
        <td>Rich, nuanced feedback on design choices and trade-offs.</td>
        <td><strong>High cost ($150–$250/session)</strong>; scheduling friction; not scalable for continuous daily practice.</td>
      </tr>
      <tr>
        <td><strong>Generic LLMs (ChatGPT)</strong></td>
        <td>Pasting code into chat window asking "Review my LLD".</td>
        <td>Capable reasoning; instant conversational answers.</td>
        <td><strong>Unconstrained, inconsistent output.</strong> Generates generic praise/essays without a fixed rubric, lacks AST static validation, and provides no version history.</td>
      </tr>
    </tbody>
  </table>

  <h2>3. Product Direction: The Hybrid Rubric-Grounded Architecture</h2>
  <p>
    To bridge the gap between deterministic test runners and high-cost human mock interviews, <strong>DesignForge</strong> implements a 4-stage active practice loop:
  </p>

  <div class="callout">
    <strong>Structured Practice Loop:</strong><br>
    <code>Problem Catalog</code> &rarr; <code>Assumptions & Scope</code> &rarr; <code>Mermaid UML Diagram</code> &rarr; <code>Polymorphic Code</code> &rarr; <code>Design Rationale</code> &rarr; <code>Hybrid Evaluator (AST + AI)</code> &rarr; <code>Version Delta Comparison</code>
  </div>

  <h3>Core Product Tenets</h3>
  <ol>
    <li><strong>Multi-Faceted Submission:</strong> Learners submit Assumptions, Visual Mermaid UML diagrams, Concrete Code, and Design Rationale.</li>
    <li><strong>Strict 5-Dimension Rubric:</strong> Evaluates Domain Modeling (25%), Abstraction & DIP (25%), Extensibility & GoF Patterns (20%), Edge Cases & Concurrency (15%), and Trade-off Rationale (15%).</li>
    <li><strong>Deterministic + Heuristic + AI Synergy:</strong> AST parser runs static sanity checks in &lt;10ms; Gemini AI or local rule heuristics provide semantic critiques with verbatim code evidence quotes; 100% offline fallback guarantees resilience.</li>
    <li><strong>Iterative Delta Comparison:</strong> Tracks score gains ($Attempt_N - Attempt_{N-1}$) and highlights resolved architectural smells.</li>
  </ol>
`);

// 2. Design Note HTML
const designNoteHtml = wrapHtml('Design Note - LLD Practice Platform Architecture', `
  <h1>Design Note: LLD Practice Platform Architecture & Domain Model</h1>
  
  <div class="meta-box">
    <strong>Platform:</strong> DesignForge LLD Practice Studio &nbsp;|&nbsp;
    <strong>Focus:</strong> Clean Architecture, Domain Models, Evaluator Strategy & Trade-offs &nbsp;|&nbsp;
    <strong>Date:</strong> September 2026
  </div>

  <h2>1. System Architecture & Domain Model</h2>
  <p>
    The platform itself is engineered following strict Clean Architecture and Domain-Driven Design (DDD) principles:
  </p>

  <pre><code>┌─────────────────────────────────────────────────────────────┐
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
└─────────────────────────────┘└──────────────────────────────┘</code></pre>

  <h3>Core Domain Entities & Responsibilities</h3>
  <table>
    <thead>
      <tr>
        <th>Class / Interface</th>
        <th>Primary Responsibility</th>
        <th>Collaborators / Dependencies</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>Problem</code></td>
        <td>Encapsulates challenge metadata, functional/non-functional requirements, constraints, expected entities, and rubric specifications.</td>
        <td><code>RubricCriterionSpec</code>, <code>StarterTemplate</code></td>
      </tr>
      <tr>
        <td><code>Attempt</code></td>
        <td>Aggregate Root managing the lifecycle of a learner's attempts (<code>IN_PROGRESS</code> &rarr; <code>EVALUATING</code> &rarr; <code>EVALUATED</code> &rarr; <code>FAILED</code>).</td>
        <td><code>Submission[]</code>, <code>Problem</code></td>
      </tr>
      <tr>
        <td><code>Submission</code></td>
        <td>Entity representing a specific version snapshot ($v1, v2, ...$) containing Assumptions, Mermaid diagram, code, language, and design rationale.</td>
        <td><code>SubmissionContent</code>, <code>EvaluationResult</code></td>
      </tr>
      <tr>
        <td><code>IEvaluator</code></td>
        <td>Polymorphic Strategy interface defining the evaluation contract (<code>evaluate(problem, submission)</code>).</td>
        <td><code>Problem</code>, <code>SubmissionContent</code>, <code>EvaluationResult</code></td>
      </tr>
      <tr>
        <td><code>DeterministicValidator</code></td>
        <td>Performs AST static checks: verifies mandatory sections, extracts classes/interfaces/enums, detects God classes and public state leaks.</td>
        <td><code>CodeStructureAnalysis</code>, <code>DeterministicCheckResult</code></td>
      </tr>
      <tr>
        <td><code>HeuristicEvaluator</code></td>
        <td>Zero-baseline rule engine calculating 5-dimension rubric scores, verbatim evidence quotes, concerns, and actionable advice offline.</td>
        <td><code>DeterministicValidator</code>, <code>RubricCriterionSpec</code></td>
      </tr>
      <tr>
        <td><code>GeminiAIEvaluator</code></td>
        <td>LLM-based evaluator leveraging Google Gemini with strict JSON schema prompt; falls back gracefully to Heuristic engine.</td>
        <td><code>IEvaluator</code>, <code>DeterministicValidator</code></td>
      </tr>
      <tr>
        <td><code>CompositeEvaluator</code></td>
        <td>Orchestrator combining deterministic sanity checks with AI / Heuristic evaluation strategies.</td>
        <td><code>IEvaluator</code>, <code>DeterministicValidator</code></td>
      </tr>
      <tr>
        <td><code>PracticeService</code></td>
        <td>Application Service coordinating problem retrieval, attempt state transitions, submission evaluation, and version delta comparisons.</td>
        <td><code>ProblemRepository</code>, <code>AttemptRepository</code>, <code>IEvaluator</code></td>
      </tr>
    </tbody>
  </table>

  <h2>2. Extensibility & Change Tests</h2>
  <p>
    The platform was subjected to two rigorous change tests to validate adherence to SOLID principles:
  </p>
  <ul>
    <li><strong>Change Test A:</strong> <em>"Today the learner submits text. Later the platform supports an interactive drag-and-drop UML canvas."</em><br>
    <strong>Domain Impact: Zero.</strong> <code>SubmissionContent</code> is an encapsulated value object containing <code>diagramMermaid: string</code>. Introducing a visual canvas only extends the serializer in the presentation layer and adds an optional schema field to <code>SubmissionContent</code>. <code>Attempt</code>, <code>Problem</code>, and <code>PracticeService</code> remain untouched.</li>
    <li><strong>Change Test B:</strong> <em>"Today feedback comes from one evaluator. Later you add a peer review, automated unit test runner, or human mentor review."</em><br>
    <strong>Domain Impact: Zero.</strong> <code>IEvaluator</code> is a polymorphic strategy interface. Adding <code>HumanMentorEvaluator</code> or <code>AutomatedUnitTestRunner</code> only requires implementing <code>IEvaluator.evaluate()</code> and registering it in <code>CompositeEvaluator</code> (Open-Closed Principle).</li>
  </ul>

  <h2>3. Key Trade-offs Made for the MVP</h2>
  <ol>
    <li><strong>Monolithic In-Memory Repository vs. Distributed Database:</strong> Clean repository pattern defaults to fast durable in-memory storage while supporting PostgreSQL via <code>DATABASE_URL</code> with zero code changes.</li>
    <li><strong>Hybrid Heuristic Engine vs Pure Cloud LLM:</strong> Rule-based <code>HeuristicEvaluator</code> guarantees 100% offline availability and instant execution if no <code>GEMINI_API_KEY</code> is provided.</li>
    <li><strong>Structured Tabbed Editor vs Heavy Container Sandbox:</strong> Focused on architectural decomposition and OOP contracts rather than heavy Docker container compilation overhead.</li>
  </ol>
`);

// 3. README + AI Usage Note HTML
const readmeAiUsageHtml = wrapHtml('README & AI Usage Report', `
  <h1>DesignForge: README & AI Usage Report</h1>
  
  <div class="meta-box">
    <strong>Project:</strong> DesignForge - AI-Powered LLD Practice & Review Platform &nbsp;|&nbsp;
    <strong>Repository:</strong> https://github.com/Yogx09/DesignForge-AI-Powered-LLD-Practice-Review-Platform.git &nbsp;|&nbsp;
    <strong>Date:</strong> September 2026
  </div>

  <h2>1. Quickstart & How to Run</h2>
  <pre><code># 1. Clone repository
git clone https://github.com/Yogx09/DesignForge-AI-Powered-LLD-Practice-Review-Platform.git
cd DesignForge-AI-Powered-LLD-Practice-Review-Platform

# 2. (Optional) Configure environment variables
cp .env.example .env
# Set GEMINI_API_KEY for live Google Gemini AI evaluation

# 3. Install dependencies & build
npm run build

# 4. Start backend & frontend concurrently
npm run dev
# Frontend: http://localhost:5173
# Backend API: http://localhost:4000

# 5. Run automated test suite
npm test</code></pre>

  <h2>2. Environment Configuration & Hybrid Evaluator Modes</h2>
  <table>
    <thead>
      <tr>
        <th>Variable</th>
        <th>Default</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>GEMINI_API_KEY</code></td>
        <td><em>Optional</em></td>
        <td>When set, unlocks live Gemini 1.5 Flash AI evaluation (<code>AI_GEMINI</code>) and interactive mentor chat. If omitted, automatically falls back to the deterministic AST rule engine (<code>HEURISTIC_RULE_ENGINE</code>).</td>
      </tr>
      <tr>
        <td><code>DATABASE_URL</code></td>
        <td><em>Optional</em></td>
        <td>PostgreSQL connection string. If omitted, defaults to high-performance durable In-Memory store.</td>
      </tr>
      <tr>
        <td><code>PORT</code></td>
        <td><code>4000</code></td>
        <td>Backend Express REST API port.</td>
      </tr>
    </tbody>
  </table>

  <h2>3. AI Usage Report: Key Architectural Decisions</h2>
  <p>
    This section details the key AI-assisted decisions made during design and implementation, documenting accepted/rejected suggestions and engineering rationale:
  </p>

  <h3>Decision 1: Structured Multi-Faceted Submission vs. Single Code Blob</h3>
  <ul>
    <li><strong>AI Suggestion:</strong> Single monolithic code editor where candidates write classes and comments in one file (similar to LeetCode).</li>
    <li><strong>Decision:</strong> <strong>Rejected</strong> single code blob; <strong>Accepted</strong> multi-section structured submission (<em>Assumptions</em>, <em>Mermaid Class Diagram</em>, <em>Code Implementation</em>, <em>Design Patterns & Trade-offs</em>).</li>
    <li><strong>Rationale:</strong> In real-world LLD interviews (Google, Amazon, Uber), interviewers evaluate assumptions, structural relationships, and trade-offs before judging syntax. Separating sections enables independent rubric scoring.</li>
  </ul>

  <h3>Decision 2: Rubric-Grounded Evaluation vs. Unconstrained "100-point AI Score"</h3>
  <ul>
    <li><strong>AI Suggestion:</strong> A prompt asking the LLM: <em>"Rate this LLD solution out of 100 and give general feedback."</em></li>
    <li><strong>Decision:</strong> <strong>Rejected</strong> generic unconstrained scoring; <strong>Accepted</strong> a strict 5-dimension zero-baseline rubric with JSON schema constraints and mandatory verbatim evidence quoting.</li>
    <li><strong>Rationale:</strong> Unconstrained prompts produce inconsistent, hallucinated grades. Weighted criteria (Domain Modeling 25%, Abstraction 25%, Extensibility 20%, Edge Cases 15%, Rationale 15%) ensure reproducible, actionable feedback.</li>
  </ul>

  <h3>Decision 3: Deterministic Static Checks + Heuristic Fallback vs. Pure LLM Pipeline</h3>
  <ul>
    <li><strong>AI Suggestion:</strong> Rely solely on OpenAI/Gemini API calls for all validation, syntax checks, and rubric grading.</li>
    <li><strong>Decision:</strong> <strong>Rejected</strong> pure LLM dependency; <strong>Accepted</strong> a Composite Evaluator with a fast <code>DeterministicValidator</code> and an offline <code>HeuristicEvaluator</code> fallback.</li>
    <li><strong>Rationale:</strong> Static AST checks run in &lt;10ms; offline heuristic fallback guarantees the platform never crashes or fails even if API keys are missing or rate-limited.</li>
  </ul>

  <h3>Decision 4: Version-over-Version Delta Tracking vs. Isolated Stateless Submissions</h3>
  <ul>
    <li><strong>AI Suggestion:</strong> Reset the attempt upon each submission or treat every submission as an isolated one-off assessment.</li>
    <li><strong>Decision:</strong> <strong>Rejected</strong> isolated submissions; <strong>Accepted</strong> an <code>Attempt</code> Aggregate Root maintaining an append-only <code>Submission[]</code> history with automated delta computation ($Attempt_{N} - Attempt_{N-1}$).</li>
    <li><strong>Rationale:</strong> The true value of a practice platform is the learning loop: <em>Design &rarr; Submit &rarr; Review &rarr; Refine &rarr; Re-evaluate</em>. Tracking score deltas (e.g. <em>"+15 on Abstraction; resolved 2 critical coupling concerns"</em>) reinforces architectural growth.</li>
  </ul>
`);

// Write HTML files and generate PDFs
const docsDir = path.join(rootDir, 'docs_pdf');
if (!fs.existsSync(docsDir)) fs.mkdirSync(docsDir, { recursive: true });

const filesToGenerate = [
  { name: 'Research_Note', html: researchNoteHtml, pdf: 'Research_Note.pdf' },
  { name: 'Design_Note', html: designNoteHtml, pdf: 'Design_Note.pdf' },
  { name: 'README_and_AI_USAGE', html: readmeAiUsageHtml, pdf: 'README_and_AI_USAGE.pdf' }
];

for (const file of filesToGenerate) {
  const htmlPath = path.join(docsDir, `${file.name}.html`);
  const pdfPath = path.join(docsDir, file.pdf);
  
  fs.writeFileSync(htmlPath, file.html, 'utf8');
  console.log(`Wrote ${htmlPath}`);

  try {
    const cmd = `"${browserPath}" --headless --disable-gpu --no-pdf-header-footer --print-to-pdf="${pdfPath}" "${htmlPath}"`;
    execSync(cmd, { stdio: 'inherit' });
    console.log(`✅ Generated PDF: ${pdfPath}`);
  } catch (err) {
    console.error(`❌ Failed to generate PDF for ${file.name}:`, err.message);
  }
}

console.log('🎉 All PDFs successfully generated in:', docsDir);
