import React, { useState } from 'react';
import { ProblemSummary } from '../types';
import {
  ArrowRight,
  BookOpen,
  Zap,
  TrendingUp,
  Clock,
  Award,
  Layers,
  Sparkles,
  ChevronRight,
  Filter,
  CheckCircle2,
  Building2,
  Cpu,
  Code2,
  Boxes,
  Compass,
  Flame,
  Search,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Lightbulb,
  ShieldCheck,
  Share2,
  Play,
  RotateCcw,
  Check,
  Terminal,
  Activity,
  GitBranch,
  Key,
  Copy,
  ExternalLink,
  Target
} from 'lucide-react';

interface OverviewDashboardProps {
  problems: ProblemSummary[];
  onSelectProblem: (id: string) => void;
  onViewAllProblems: () => void;
  onTrySampleDemo: () => void;
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({
  problems,
  onSelectProblem,
  onViewAllProblems,
  onTrySampleDemo
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activePipelineTab, setActivePipelineTab] = useState<'parking-lot' | 'elevator-system' | 'rate-limiter'>('parking-lot');
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);
  const [showTipAnswer, setShowTipAnswer] = useState<boolean>(false);
  const [copiedSnippet, setCopiedSnippet] = useState<boolean>(false);

  const categories = ['All', 'System Design', 'OOP Core', 'State & Concurrency', 'Distributed'];
  const difficulties = ['All', 'Easy', 'Medium', 'Hard'];

  const companyBadges: Record<string, { name: string; color: string }[]> = {
    'parking-lot': [
      { name: 'Amazon', color: '#f59e0b' },
      { name: 'Google', color: '#38bdf8' },
      { name: 'Uber', color: '#10b981' }
    ],
    'elevator-system': [
      { name: 'Microsoft', color: '#6366f1' },
      { name: 'Uber', color: '#10b981' },
      { name: 'Salesforce', color: '#06b6d4' }
    ],
    'rate-limiter': [
      { name: 'Stripe', color: '#6366f1' },
      { name: 'Netflix', color: '#ef4444' },
      { name: 'Meta', color: '#38bdf8' }
    ],
    'vending-machine': [
      { name: 'Atlassian', color: '#06b6d4' },
      { name: 'Adobe', color: '#ef4444' }
    ],
    'logging-framework': [
      { name: 'Datadog', color: '#8b5cf6' },
      { name: 'Amazon', color: '#f59e0b' }
    ],
    'chat-system': [
      { name: 'Discord', color: '#6366f1' },
      { name: 'Meta', color: '#38bdf8' }
    ],
    'chess-game': [
      { name: 'Google', color: '#38bdf8' },
      { name: 'Bloomberg', color: '#f59e0b' }
    ]
  };

  const patternBadges: Record<string, string[]> = {
    'parking-lot': ['Strategy Pattern', 'Factory Method', 'Observer'],
    'elevator-system': ['State Machine', 'LOOK Strategy', 'Observer'],
    'rate-limiter': ['Token Bucket', 'Sliding Window', 'Decorator'],
    'vending-machine': ['State Machine', 'Chain of Resp', 'Command'],
    'logging-framework': ['Singleton', 'Chain of Resp', 'Sink Pattern'],
    'chat-system': ['Pub-Sub', 'Observer', 'Flyweight'],
    'chess-game': ['Command Pattern', 'Factory', 'Memento']
  };

  const pipelineConfigs = {
    'parking-lot': {
      title: 'Smart Parking Lot Architecture',
      subtitle: 'Multi-floor vehicle decomposition with dynamic strategy selection & mutex concurrency',
      nodes: ['Vehicle Ingress', 'Gate Allocator', 'Strategy: NearestSpot', 'Mutex Lock', 'Ticket Issued'],
      snippet: `export class ParkingLot {
  private floors: ParkingFloor[];
  private strategy: IParkingStrategy;
  
  public async parkVehicle(vehicle: Vehicle): Promise<Ticket> {
    const spot = this.strategy.findSpot(this.floors, vehicle);
    if (!spot) throw new CapacityFullException("All slots filled");
    return await spot.lockAndAssign(vehicle);
  }
}`,
      accentColor: '#6366f1',
      tag: 'Strategy + Factory'
    },
    'elevator-system': {
      title: 'Elevator Dispatch & State Engine',
      subtitle: 'LOOK algorithm optimization with decoupled finite state machines',
      nodes: ['Hall Call (Floor 7)', 'Dispatcher Queue', 'LOOK Optimizer', 'Motor Controller', 'Arrival Notice'],
      snippet: `export class ElevatorController {
  private cars: ElevatorCar[];
  private strategy: IDispatchStrategy;

  public requestElevator(floor: number, direction: Direction): void {
    const optimalCar = this.strategy.selectOptimalCar(this.cars, floor, direction);
    optimalCar.enqueueDestination(floor);
  }
}`,
      accentColor: '#10b981',
      tag: 'State Machine + LOOK'
    },
    'rate-limiter': {
      title: 'Distributed Rate Limiting Service',
      subtitle: 'Sliding window logs and token bucket algorithms with atomic counter synchronizations',
      nodes: ['HTTP Request', 'IP Extract', 'Token Bucket Leak', 'Atomic Check', 'Allow / 429'],
      snippet: `export class TokenBucketLimiter implements IRateLimitAlgorithm {
  private tokens: number;
  private lastRefill: number;

  public allowRequest(clientId: string): boolean {
    this.refill();
    if (this.tokens >= 1) { this.tokens--; return true; }
    return false; // 429 Too Many Requests
  }
}`,
      accentColor: '#f59e0b',
      tag: 'Token Bucket + Decorator'
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  const filteredProblems = problems.filter((p) => {
    const matchesCategory =
      selectedCategory === 'All' ||
      p.category.toLowerCase().includes(selectedCategory.toLowerCase()) ||
      (selectedCategory === 'OOP Core' && p.category.includes('System Design'));

    const matchesDifficulty =
      selectedDifficulty === 'All' || p.difficulty.toLowerCase() === selectedDifficulty.toLowerCase();

    const matchesSearch =
      searchQuery.trim() === '' ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (companyBadges[p.id] || []).some((c) => c.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (patternBadges[p.id] || []).some((pat) => pat.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesDifficulty && matchesSearch;
  });

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '16px 8px', position: 'relative' }}>
      {/* Background Ambient Glowing Orbs */}
      <div
        className="ambient-orb"
        style={{
          top: -30,
          left: '12%',
          width: 480,
          height: 480,
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.22) 0%, rgba(99, 102, 241, 0) 70%)'
        }}
      />
      <div
        className="ambient-orb"
        style={{
          top: 320,
          right: '5%',
          width: 440,
          height: 440,
          background: 'radial-gradient(circle, rgba(6, 182, 212, 0.16) 0%, rgba(6, 182, 212, 0) 70%)',
          animationDelay: '-4s'
        }}
      />

      {/* 1. TOP FLOATING COMMAND BAR (Dribbble / 21st.dev Style) */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
          padding: '10px 20px',
          background: 'var(--bg-glass)',
          backdropFilter: 'blur(16px)',
          borderRadius: 'var(--radius-pill)',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-sm)',
          marginBottom: 26
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.82rem', fontWeight: 800 }}>
            <span className="pulse-dot" />
            <span style={{ color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
              DesignForge Live Arena
            </span>
          </div>

          <div style={{ height: 16, width: 1, background: 'var(--border-light)' }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            <ShieldCheck size={14} color="#10b981" />
            <span>AST Static Rules</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            <Sparkles size={14} color="#6366f1" />
            <span>Gemini AI Engine</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              padding: '3px 12px',
              borderRadius: 'var(--radius-pill)',
              background: 'rgba(245, 158, 11, 0.12)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              color: '#f59e0b',
              fontSize: '0.76rem',
              fontWeight: 800
            }}
          >
            <Flame size={13} /> 4-Day Streak
          </span>

          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              padding: '3px 12px',
              borderRadius: 'var(--radius-pill)',
              background: 'rgba(99, 102, 241, 0.12)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              color: 'var(--accent-primary)',
              fontSize: '0.76rem',
              fontWeight: 800
            }}
          >
            <Award size={13} /> Staff Tier (84 Avg)
          </span>
        </div>
      </div>

      {/* 2. THE BENTO GRID - ROW 1: Interactive System Architecture Deck */}
      <div className="bento-grid">
        {/* Bento Cell 1: Large Interactive Architecture Pipeline Canvas (Span 8) */}
        <div className="bento-cell bento-cell-hero holo-border" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            {/* Cell Header with Tabs */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
              <div>
                <span className="glow-tag" style={{ marginBottom: 6 }}>
                  <Activity size={12} /> Live Interactive Architecture Studio
                </span>
                <h2 style={{ fontSize: '1.45rem', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.02em', marginTop: 4 }}>
                  {pipelineConfigs[activePipelineTab].title}
                </h2>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                  {pipelineConfigs[activePipelineTab].subtitle}
                </p>
              </div>

              {/* Challenge Selector Switcher */}
              <div style={{ display: 'flex', gap: 4, background: 'var(--bg-card-subtle)', padding: 3, borderRadius: 'var(--radius-pill)', border: '1px solid var(--border-subtle)' }}>
                {[
                  { id: 'parking-lot', label: '🚗 Parking' },
                  { id: 'elevator-system', label: '🛗 Elevator' },
                  { id: 'rate-limiter', label: '⚡ Limiter' }
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setActivePipelineTab(t.id as any)}
                    style={{
                      padding: '5px 12px',
                      borderRadius: 'var(--radius-pill)',
                      border: 'none',
                      background: activePipelineTab === t.id ? 'var(--accent-primary)' : 'transparent',
                      color: activePipelineTab === t.id ? '#ffffff' : 'var(--text-secondary)',
                      fontWeight: 700,
                      fontSize: '0.76rem',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Visual Signal Flow Pipeline */}
            <div
              style={{
                background: 'var(--bg-card-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '16px 18px',
                border: '1px solid var(--border-subtle)',
                marginBottom: 16
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
                {pipelineConfigs[activePipelineTab].nodes.map((node, idx) => (
                  <React.Fragment key={idx}>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        zIndex: 2,
                        textAlign: 'center'
                      }}
                    >
                      <div
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: '50%',
                          background: idx === 2 ? 'var(--accent-gradient)' : 'var(--bg-card)',
                          border: `2px solid ${idx === 2 ? 'var(--accent-primary)' : 'var(--border-medium)'}`,
                          color: idx === 2 ? '#ffffff' : 'var(--text-primary)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.72rem',
                          fontWeight: 800,
                          boxShadow: idx === 2 ? '0 0 12px rgba(99, 102, 241, 0.5)' : 'none'
                        }}
                      >
                        {idx + 1}
                      </div>
                      <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: 4, maxWidth: 85 }}>
                        {node}
                      </span>
                    </div>

                    {idx < pipelineConfigs[activePipelineTab].nodes.length - 1 && (
                      <div style={{ flex: 1, margin: '0 8px', position: 'relative', height: 2, background: 'var(--border-subtle)' }}>
                        <div className="signal-dot" />
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Live Syntax-Highlighted Code Sandbox Preview */}
            <div
              style={{
                background: 'var(--code-bg)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--code-border)',
                padding: '12px 16px',
                position: 'relative'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Terminal size={12} color="#38bdf8" /> TypeScript AST Architecture Contract
                </span>
                <button
                  onClick={() => handleCopy(pipelineConfigs[activePipelineTab].snippet)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#94a3b8',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    fontSize: '0.72rem'
                  }}
                >
                  {copiedSnippet ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
                  <span>{copiedSnippet ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <pre style={{ margin: 0, fontSize: '0.76rem', color: '#38bdf8', fontFamily: 'JetBrains Mono, monospace', lineHeight: 1.45, maxHeight: 110, overflowY: 'auto' }}>
                <code>{pipelineConfigs[activePipelineTab].snippet}</code>
              </pre>
            </div>
          </div>

          {/* Cell Footer CTA */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 16, paddingTop: 12, borderTop: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
              Evaluates: Class Decomposition, Interfaces, Enums, Concurrency Locks
            </span>
            <button
              onClick={() => onSelectProblem(activePipelineTab)}
              className="btn btn-primary"
              style={{ padding: '7px 16px', fontSize: '0.82rem' }}
            >
              <span>Practice in Studio</span> <ArrowRight size={15} />
            </button>
          </div>
        </div>

        {/* Bento Cell 2: Holographic Mastery Radar & Staff Tier (Span 4) */}
        <div className="bento-cell bento-cell-side holo-border" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <span className="glow-tag">
                <Target size={12} /> Architectural Radar
              </span>
              <span style={{ fontSize: '0.74rem', color: '#10b981', fontWeight: 800 }}>
                95th Percentile
              </span>
            </div>

            <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: 12 }}>
              Design Dimensions
            </h3>

            {/* Circular / Polygon SVG Skill Matrix */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 11, marginBottom: 16 }}>
              {[
                { label: 'Domain Modeling & SRP', score: '94%', color: '#6366f1' },
                { label: 'Abstraction & DIP', score: '90%', color: '#06b6d4' },
                { label: 'GoF Design Patterns', score: '92%', color: '#10b981' },
                { label: 'State & Concurrency Safety', score: '82%', color: '#f59e0b' },
                { label: 'Trade-off Rationale & Scope', score: '88%', color: '#8b5cf6' }
              ].map((dim, idx) => (
                <div key={idx}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', fontWeight: 700, marginBottom: 3 }}>
                    <span style={{ color: 'var(--text-secondary)' }}>{dim.label}</span>
                    <span style={{ color: 'var(--text-primary)' }}>{dim.score}</span>
                  </div>
                  <div style={{ height: 5, background: 'var(--border-subtle)', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: dim.score, background: dim.color, borderRadius: 3 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Demo Button */}
          <div style={{ background: 'var(--bg-card-subtle)', borderRadius: 'var(--radius-sm)', padding: 12, border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 2 }}>
              Want to see a perfect 90+ submission?
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginBottom: 10 }}>
              Load gold-standard multi-floor parking lot with live AI scoring.
            </div>
            <button
              onClick={onTrySampleDemo}
              className="btn btn-outline-primary"
              style={{ width: '100%', padding: '7px 12px', fontSize: '0.8rem' }}
            >
              <Zap size={14} /> Run Instant Review Demo
            </button>
          </div>
        </div>
      </div>

      {/* 3. BENTO GRID - ROW 2: 3-Column Tool Cards */}
      <div className="bento-grid">
        {/* Cell 3: Realtime AST Validator Rules (Span 4) */}
        <div className="bento-cell bento-cell-third">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(99, 102, 241, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldCheck size={18} color="#6366f1" />
            </div>
            <div>
              <div style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                AST Static Engine
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                Deterministic &lt;10ms feedback
              </div>
            </div>
          </div>

          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: 12, lineHeight: 1.5 }}>
            Automated compiler scans for anti-patterns: God classes, missing interfaces, public mutable state, and unhandled thread concurrency.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            <span className="floating-chip">✔ DIP Enforcement</span>
            <span className="floating-chip">✔ God Class Detector</span>
            <span className="floating-chip">✔ Mutex Scanner</span>
          </div>
        </div>

        {/* Cell 4: Weekly Featured Battle Challenge (Span 4) */}
        <div className="bento-cell bento-cell-third" style={{ background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.05) 0%, rgba(245, 158, 11, 0.05) 100%)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <span className="badge badge-hard">Staff Level Challenge</span>
            <span style={{ fontSize: '0.72rem', color: '#ef4444', fontWeight: 800 }}>⚡ High Concurrency</span>
          </div>

          <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>
            Distributed Rate Limiting Engine
          </h4>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 12, lineHeight: 1.5 }}>
            Design a multi-tiered rate limiter combining Token Bucket algorithms with thread-safe sliding window counters.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Asked in Stripe, Netflix</span>
            <button
              onClick={() => onSelectProblem('rate-limiter')}
              className="btn btn-secondary"
              style={{ padding: '5px 12px', fontSize: '0.78rem' }}
            >
              Solve Challenge &rarr;
            </button>
          </div>
        </div>

        {/* Cell 5: Architect Concept of the Day (Span 4) */}
        <div className="bento-cell bento-cell-third">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Lightbulb size={16} color="#f59e0b" />
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                Architect Rule of the Day
              </span>
            </div>
            <button
              onClick={() => setShowTipAnswer(!showTipAnswer)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--accent-primary)',
                fontWeight: 700,
                fontSize: '0.75rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 2
              }}
            >
              {showTipAnswer ? 'Hide' : 'Reveal'}
              {showTipAnswer ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
            </button>
          </div>

          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: showTipAnswer ? 8 : 0 }}>
            <strong>Question:</strong> When to use <em>State Pattern</em> vs <em>Strategy Pattern</em> in LLD interviews?
          </p>

          {showTipAnswer && (
            <div
              style={{
                padding: 10,
                borderRadius: 'var(--radius-xs)',
                background: 'var(--bg-card-subtle)',
                fontSize: '0.76rem',
                color: 'var(--text-primary)',
                lineHeight: 1.5
              }}
            >
              <strong>Verdict:</strong> State Pattern encapsulates internal object state transitions (e.g. <code>ElevatorCar: Moving $\to$ Stopped</code>). Strategy Pattern encapsulates interchangeable external algorithms (e.g. <code>LOOK Dispatch Strategy</code>).
            </div>
          )}
        </div>
      </div>

      {/* 4. THE DRIBBLE-STYLE PROBLEM DECK CATALOG */}
      <div style={{ marginTop: 10 }}>
        {/* Catalog Navigation Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 14 }}>
          <div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.02em', marginBottom: 3 }}>
              Curated Problem Deck
            </h3>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
              Practice real-world LLD problems with instant Mermaid UML diagram rendering, code AST parsing, and AI rubric grading.
            </p>
          </div>

          {/* Search & Filter Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            {/* Search Input */}
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Search size={14} color="var(--text-muted)" style={{ position: 'absolute', left: 12 }} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter by problem, company, pattern..."
                style={{
                  padding: '7px 12px 7px 34px',
                  borderRadius: 'var(--radius-pill)',
                  border: '1px solid var(--border-subtle)',
                  background: 'var(--bg-card)',
                  color: 'var(--text-primary)',
                  fontSize: '0.82rem',
                  width: 250,
                  outline: 'none'
                }}
              />
            </div>

            {/* Category Filter Pills */}
            <div style={{ display: 'flex', gap: 4, background: 'var(--bg-card)', padding: 3, borderRadius: 'var(--radius-pill)', border: '1px solid var(--border-subtle)' }}>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    padding: '5px 12px',
                    borderRadius: 'var(--radius-pill)',
                    border: 'none',
                    background: selectedCategory === cat ? 'var(--accent-soft)' : 'transparent',
                    color: selectedCategory === cat ? 'var(--accent-primary)' : 'var(--text-secondary)',
                    fontWeight: selectedCategory === cat ? 800 : 500,
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Difficulty Filter */}
            <div style={{ display: 'flex', gap: 4, background: 'var(--bg-card)', padding: 3, borderRadius: 'var(--radius-pill)', border: '1px solid var(--border-subtle)' }}>
              {difficulties.map((diff) => (
                <button
                  key={diff}
                  onClick={() => setSelectedDifficulty(diff)}
                  style={{
                    padding: '5px 10px',
                    borderRadius: 'var(--radius-pill)',
                    border: 'none',
                    background: selectedDifficulty === diff ? 'var(--accent-primary)' : 'transparent',
                    color: selectedDifficulty === diff ? '#ffffff' : 'var(--text-secondary)',
                    fontWeight: selectedDifficulty === diff ? 800 : 500,
                    fontSize: '0.78rem',
                    cursor: 'pointer'
                  }}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Problem Deck Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(370px, 1fr))',
            gap: 20
          }}
        >
          {filteredProblems.map((p) => {
            const badgeClass =
              p.difficulty === 'Easy'
                ? 'badge-easy'
                : p.difficulty === 'Medium'
                ? 'badge-medium'
                : 'badge-hard';

            const companies = companyBadges[p.id] || [{ name: 'Google', color: '#38bdf8' }, { name: 'Amazon', color: '#f59e0b' }];
            const patterns = patternBadges[p.id] || ['Factory Method', 'Strategy Pattern'];
            const isExpanded = expandedCardId === p.id;

            return (
              <div
                key={p.id}
                className="designlab-card designlab-card-interactive"
                style={{
                  padding: 24,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  borderRadius: 'var(--radius-xl)'
                }}
                onClick={() => onSelectProblem(p.id)}
              >
                <div>
                  {/* Top Row: Difficulty & Estimated Time */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span className={`badge ${badgeClass}`}>{p.difficulty}</span>
                      <span className="badge badge-primary">{p.category}</span>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Clock size={12} /> {p.timeEstimate}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h4 style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: 8, letterSpacing: '-0.01em' }}>
                    {p.title}
                  </h4>
                  <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', marginBottom: 16, lineHeight: 1.55 }}>
                    {p.description}
                  </p>

                  {/* Company Badges with Brand Accents */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700 }}>Companies:</span>
                    {companies.map((c, i) => (
                      <span
                        key={i}
                        style={{
                          fontSize: '0.72rem',
                          background: 'var(--bg-card-subtle)',
                          border: '1px solid var(--border-light)',
                          padding: '2px 8px',
                          borderRadius: 'var(--radius-pill)',
                          fontWeight: 700,
                          color: 'var(--text-primary)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4
                        }}
                      >
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: c.color }} />
                        {c.name}
                      </span>
                    ))}
                  </div>

                  {/* Design Patterns */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700 }}>Patterns:</span>
                    {patterns.map((pat, i) => (
                      <span
                        key={i}
                        style={{
                          fontSize: '0.7rem',
                          background: 'rgba(99, 102, 241, 0.08)',
                          border: '1px solid rgba(99, 102, 241, 0.25)',
                          padding: '2px 8px',
                          borderRadius: 4,
                          fontWeight: 700,
                          color: 'var(--accent-primary)'
                        }}
                      >
                        {pat}
                      </span>
                    ))}
                  </div>

                  {/* Collapsible Architecture Peek Drawer */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpandedCardId(isExpanded ? null : p.id);
                    }}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--text-muted)',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      cursor: 'pointer',
                      marginBottom: isExpanded ? 10 : 0
                    }}
                  >
                    {isExpanded ? 'Hide Architecture Scope' : 'Peek Core Concepts & Patterns'}
                    {isExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                  </button>

                  {isExpanded && (
                    <div
                      style={{
                        padding: 10,
                        background: 'var(--bg-card-subtle)',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border-subtle)',
                        marginBottom: 10,
                        fontSize: '0.76rem',
                        color: 'var(--text-secondary)'
                      }}
                    >
                      <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
                        Key Architectural Concepts:
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                        {(p.concepts || []).map((concept, idx) => (
                          <span
                            key={idx}
                            style={{
                              background: 'var(--bg-card)',
                              padding: '2px 6px',
                              borderRadius: 3,
                              border: '1px solid var(--border-light)'
                            }}
                          >
                            {concept}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Bottom Card Action */}
                <div
                  style={{
                    paddingTop: 14,
                    borderTop: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Passing bar: <strong style={{ color: 'var(--text-primary)' }}>75 pts</strong>
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectProblem(p.id);
                    }}
                    className="btn btn-outline-primary"
                    style={{ padding: '6px 14px', fontSize: '0.8rem' }}
                  >
                    <span>Open Studio</span> <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
