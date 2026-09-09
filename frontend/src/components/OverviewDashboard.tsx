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
  Check
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
  const [activePreviewTab, setActivePreviewTab] = useState<'parking-lot' | 'elevator-system' | 'rate-limiter'>('parking-lot');
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);
  const [showTipAnswer, setShowTipAnswer] = useState<boolean>(false);

  const categories = ['All', 'System Design', 'OOP Core', 'State & Concurrency', 'Distributed'];
  const difficulties = ['All', 'Easy', 'Medium', 'Hard'];

  const companyBadges: Record<string, string[]> = {
    'parking-lot': ['Amazon', 'Google', 'Uber'],
    'elevator-system': ['Microsoft', 'Uber', 'Salesforce'],
    'rate-limiter': ['Stripe', 'Netflix', 'Meta'],
    'vending-machine': ['Atlassian', 'Adobe'],
    'logging-framework': ['Datadog', 'Amazon'],
    'chat-system': ['Discord', 'Meta'],
    'chess-game': ['Google', 'Bloomberg']
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

  const previewSimulations = {
    'parking-lot': {
      title: 'Smart Parking Lot Architecture',
      entities: ['ParkingLot', 'ParkingFloor', 'ParkingSpot', 'Vehicle', 'Ticket', 'IParkingStrategy'],
      pattern: 'Strategy + Factory + Mutex Locks',
      complexity: 'Time: O(1) spot allocation | Space: O(N) capacity',
      codeSnippet: `export class ParkingLot {
  private static instance: ParkingLot;
  private strategy: IParkingStrategy;
  
  public async parkVehicle(vehicle: Vehicle): Promise<Ticket> {
    const spot = this.strategy.findSpot(this.floors, vehicle);
    if (!spot) throw new CapacityFullException();
    return spot.lockAndAssign(vehicle);
  }
}`,
      bgGradient: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(6, 182, 212, 0.1) 100%)',
      borderColor: 'rgba(99, 102, 241, 0.35)',
      badgeColor: '#6366f1'
    },
    'elevator-system': {
      title: 'Elevator Dispatch & State Engine',
      entities: ['ElevatorController', 'ElevatorCar', 'FloorRequest', 'IDispatchStrategy', 'ElevatorState'],
      pattern: 'State Machine + LOOK Algorithm',
      complexity: 'Time: O(K) nearest car dispatch | Thread-safe queue',
      codeSnippet: `export class ElevatorController {
  private cars: ElevatorCar[];
  private dispatchStrategy: IDispatchStrategy;

  public requestElevator(floor: number, dir: Direction) {
    const bestCar = this.dispatchStrategy.selectOptimalCar(this.cars, floor, dir);
    bestCar.enqueueFloor(floor);
  }
}`,
      bgGradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(6, 182, 212, 0.1) 100%)',
      borderColor: 'rgba(16, 185, 129, 0.35)',
      badgeColor: '#10b981'
    },
    'rate-limiter': {
      title: 'Distributed Rate Limiting Engine',
      entities: ['RateLimiterService', 'IRateLimitAlgorithm', 'TokenBucket', 'SlidingWindowLog'],
      pattern: 'Decorator + Strategy Pattern',
      complexity: 'Time: O(1) lock-free token leak | Space: O(U) active users',
      codeSnippet: `export class TokenBucketLimiter implements IRateLimitAlgorithm {
  private tokens: number;
  private lastRefillTimestamp: number;

  public allowRequest(clientId: string): boolean {
    this.refillTokens();
    if (this.tokens >= 1) { this.tokens--; return true; }
    return false;
  }
}`,
      bgGradient: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(239, 68, 68, 0.1) 100%)',
      borderColor: 'rgba(245, 158, 11, 0.35)',
      badgeColor: '#f59e0b'
    }
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
      (companyBadges[p.id] || []).some((c) => c.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (patternBadges[p.id] || []).some((pat) => pat.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesDifficulty && matchesSearch;
  });

  return (
    <div style={{ maxWidth: 1260, margin: '0 auto', padding: '16px 8px', position: 'relative' }}>
      {/* Background Ambient Glowing Orbs */}
      <div
        className="ambient-orb"
        style={{
          top: -40,
          left: '15%',
          width: 420,
          height: 420,
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.22) 0%, rgba(99, 102, 241, 0) 70%)'
        }}
      />
      <div
        className="ambient-orb"
        style={{
          top: 180,
          right: '8%',
          width: 380,
          height: 380,
          background: 'radial-gradient(circle, rgba(6, 182, 212, 0.18) 0%, rgba(6, 182, 212, 0) 70%)',
          animationDelay: '-3s'
        }}
      />

      {/* 1. Live Interactive Status Pill Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
          padding: '10px 18px',
          background: 'var(--bg-glass)',
          backdropFilter: 'blur(12px)',
          borderRadius: 'var(--radius-pill)',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-sm)',
          marginBottom: 24
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: '0.8rem', fontWeight: 700 }}>
            <span className="pulse-dot" />
            <span style={{ color: 'var(--text-primary)' }}>7 LLD System Design Challenges</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            <ShieldCheck size={14} color="#10b981" />
            <span>AST Static Analysis Engine</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            <Sparkles size={14} color="#6366f1" />
            <span>Gemini AI Evaluation Ready</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              padding: '3px 10px',
              borderRadius: 'var(--radius-pill)',
              background: 'rgba(245, 158, 11, 0.12)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              color: '#f59e0b',
              fontSize: '0.76rem',
              fontWeight: 800
            }}
          >
            <Flame size={13} /> 4-Day Architect Streak
          </span>
        </div>
      </div>

      {/* 2. Hero Section with Interactive Architecture Sandbox Preview */}
      <div
        className="gradient-border-card"
        style={{
          padding: '36px 36px',
          marginBottom: 28,
          position: 'relative',
          overflow: 'hidden',
          background: 'var(--bg-card)'
        }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 32, alignItems: 'center' }}>
          {/* Left Column: Heading & CTAs */}
          <div style={{ zIndex: 2 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <span className="glow-tag">
                <Sparkles size={13} /> SDE-2 / Staff Engineering LLD Arena
              </span>
            </div>

            <h1
              style={{
                fontSize: '2.4rem',
                fontWeight: 900,
                color: 'var(--text-primary)',
                letterSpacing: '-0.03em',
                marginBottom: 12,
                lineHeight: 1.15
              }}
            >
              Master Low-Level Design with <span className="gradient-text">Instant AI Feedback</span>
            </h1>

            <p style={{ fontSize: '0.96rem', color: 'var(--text-secondary)', marginBottom: 26, lineHeight: 1.6 }}>
              Practice structuring classes, abstracting strategies, handling multi-threaded race conditions, and documenting SOLID trade-offs with immediate AST parsing and multi-tier rubric grading.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
              <button
                onClick={() => onSelectProblem('parking-lot')}
                className="btn btn-primary"
                style={{ padding: '11px 24px', fontSize: '0.94rem', borderRadius: 'var(--radius-sm)' }}
              >
                <span>Launch Practice Studio</span> <ArrowRight size={17} />
              </button>
              <button
                onClick={onTrySampleDemo}
                className="btn btn-outline-primary"
                style={{ padding: '11px 20px', fontSize: '0.92rem', borderRadius: 'var(--radius-sm)' }}
              >
                <Zap size={16} /> 1-Click Instant Evaluation
              </button>
            </div>
          </div>

          {/* Right Column: Live Interactive Architecture Sandbox Card */}
          <div
            className="pulse-glow-box"
            style={{
              background: 'var(--bg-card-subtle)',
              borderRadius: 'var(--radius-md)',
              border: `1px solid ${previewSimulations[activePreviewTab].borderColor}`,
              padding: 20,
              boxShadow: 'var(--shadow-card)',
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.3s ease'
            }}
          >
            {/* Tab Switcher */}
            <div style={{ display: 'flex', gap: 6, marginBottom: 14, borderBottom: '1px solid var(--border-subtle)', paddingBottom: 10 }}>
              {[
                { id: 'parking-lot', label: '🚗 Parking Lot' },
                { id: 'elevator-system', label: '🛗 Elevator Engine' },
                { id: 'rate-limiter', label: '⚡ Rate Limiter' }
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActivePreviewTab(t.id as any)}
                  className="tab-btn-interactive"
                  style={{
                    padding: '5px 12px',
                    borderRadius: 'var(--radius-xs)',
                    border: 'none',
                    background: activePreviewTab === t.id ? 'var(--accent-primary)' : 'rgba(255, 255, 255, 0.05)',
                    color: activePreviewTab === t.id ? '#ffffff' : 'var(--text-secondary)',
                    fontWeight: 700,
                    fontSize: '0.78rem',
                    cursor: 'pointer'
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Active Simulation Preview */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {previewSimulations[activePreviewTab].title}
                </span>
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: 4,
                    background: 'rgba(99, 102, 241, 0.12)',
                    color: previewSimulations[activePreviewTab].badgeColor
                  }}
                >
                  {previewSimulations[activePreviewTab].pattern}
                </span>
              </div>

              {/* Code Preview Frame */}
              <div
                style={{
                  background: 'var(--code-bg)',
                  borderRadius: 'var(--radius-sm)',
                  padding: 12,
                  border: '1px solid var(--code-border)',
                  marginBottom: 10,
                  maxHeight: 130,
                  overflowY: 'auto'
                }}
              >
                <pre style={{ margin: 0, fontSize: '0.74rem', color: '#38bdf8', fontFamily: 'JetBrains Mono, monospace', lineHeight: 1.45 }}>
                  <code>{previewSimulations[activePreviewTab].codeSnippet}</code>
                </pre>
              </div>

              {/* Entity Chips */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
                {previewSimulations[activePreviewTab].entities.slice(0, 4).map((ent, idx) => (
                  <span
                    key={idx}
                    style={{
                      fontSize: '0.68rem',
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid var(--border-subtle)',
                      padding: '2px 6px',
                      borderRadius: 4,
                      color: 'var(--text-secondary)',
                      fontWeight: 600
                    }}
                  >
                    class {ent}
                  </span>
                ))}
                <span style={{ fontSize: '0.68rem', color: 'var(--accent-primary)', fontWeight: 700 }}>+2 more</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                <span>{previewSimulations[activePreviewTab].complexity}</span>
                <button
                  onClick={() => onSelectProblem(activePreviewTab)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--accent-primary)',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 3
                  }}
                >
                  Open in Studio &rarr;
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Stat Metric Cards (4 Grid) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 16,
          marginBottom: 28
        }}
      >
        {[
          { icon: BookOpen, val: '3 / 7', label: 'Problems Solved', trend: '42% completed', color: '#6366f1', bg: 'rgba(99, 102, 241, 0.1)', progress: '42%' },
          { icon: Award, val: '84 / 100', label: 'Avg Architecture Score', trend: 'Top 8% percentile', color: '#06b6d4', bg: 'rgba(6, 182, 212, 0.1)', progress: '84%' },
          { icon: TrendingUp, val: '+16 pts', label: 'Score Improvement Delta', trend: 'Attempt 2 vs Attempt 1', color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)', progress: '75%' },
          { icon: Clock, val: '2.4 hrs', label: 'Active Practice Time', trend: '3 sessions logged', color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.1)', progress: '60%' }
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="designlab-card"
              style={{
                padding: '20px 20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: 12
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div
                  style={{
                    width: 46,
                    height: 46,
                    borderRadius: 'var(--radius-sm)',
                    background: stat.bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  <Icon size={24} color={stat.color} />
                </div>
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-primary)', lineHeight: 1.1 }}>
                    {stat.val}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600, marginTop: 2 }}>
                    {stat.label}
                  </div>
                </div>
              </div>

              {/* Progress Mini Bar */}
              <div>
                <div style={{ height: 4, background: 'var(--border-subtle)', borderRadius: 2, overflow: 'hidden', marginBottom: 4 }}>
                  <div style={{ height: '100%', width: stat.progress, background: stat.color, borderRadius: 2 }} />
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{stat.trend}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. Two Columns: Active Studio Practice & Design Pattern Mastery Matrix */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1.4fr', gap: 20, marginBottom: 30 }}>
        {/* Active Session Card */}
        <div className="designlab-card" style={{ padding: 24, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="pulse-dot" />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  Active Practice Session
                </h3>
              </div>
              <span className="badge badge-medium">In Progress</span>
            </div>

            <div
              style={{
                background: 'var(--bg-card-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: 20,
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 20
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 10,
                      background: 'var(--accent-gradient)',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 900,
                      fontSize: '1.1rem'
                    }}
                  >
                    P
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-primary)' }}>
                      Parking Lot Management System
                    </div>
                    <div style={{ display: 'flex', gap: 6, marginTop: 2 }}>
                      <span className="badge badge-medium">Medium</span>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Building2 size={12} /> Asked in Amazon, Google, Uber
                      </span>
                    </div>
                  </div>
                </div>

                <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: 14, lineHeight: 1.5 }}>
                  Multi-floor parking lot with dynamic spot allocation strategies, vehicle polymorphism, and extensible pricing algorithms.
                </p>

                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>
                    Last Score: 85/100 (Attempt #2)
                  </span>
                  <button
                    onClick={() => onSelectProblem('parking-lot')}
                    className="btn btn-primary"
                    style={{ padding: '8px 18px', fontSize: '0.84rem' }}
                  >
                    Resume Practice &rarr;
                  </button>
                </div>
              </div>

              {/* Architectural Mini Icon */}
              <div
                style={{
                  width: 130,
                  height: 105,
                  borderRadius: 'var(--radius-sm)',
                  background: 'linear-gradient(135deg, #0f172a, #1e293b)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#38bdf8',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  border: '1px solid rgba(56, 189, 248, 0.25)',
                  textAlign: 'center',
                  padding: 8,
                  flexShrink: 0
                }}
              >
                <Boxes size={26} color="#38bdf8" style={{ marginBottom: 6 }} />
                <span>Strategy + Factory</span>
                <span style={{ fontSize: '0.66rem', color: '#94a3b8', marginTop: 2 }}>UML Synced</span>
              </div>
            </div>
          </div>
        </div>

        {/* Design Pattern Mastery Radar Matrix */}
        <div className="designlab-card" style={{ padding: 24, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Cpu size={18} color="var(--accent-primary)" />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  Design Pattern Mastery
                </h3>
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', fontWeight: 700 }}>6 Patterns Validated</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { name: 'Strategy Pattern (OCP compliance)', level: '92%', color: '#10b981' },
                { name: 'Factory Method (Decoupled instantiation)', level: '88%', color: '#6366f1' },
                { name: 'State Machine (Lifecycle transitions)', level: '78%', color: '#06b6d4' },
                { name: 'Observer / Event Bus (Decoupled events)', level: '82%', color: '#f59e0b' },
                { name: 'Thread-Safe Singleton (Double-checked lock)', level: '95%', color: '#8b5cf6' }
              ].map((pat, idx) => (
                <div key={idx}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: 700, marginBottom: 4 }}>
                    <span style={{ color: 'var(--text-secondary)' }}>{pat.name}</span>
                    <span style={{ color: 'var(--text-primary)' }}>{pat.level}</span>
                  </div>
                  <div style={{ height: 6, background: 'var(--border-subtle)', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: pat.level, background: pat.color, borderRadius: 4 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              marginTop: 14,
              paddingTop: 10,
              borderTop: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.75rem',
              color: 'var(--text-muted)'
            }}
          >
            <span>Target: 100% Core GoF Patterns</span>
            <span style={{ color: 'var(--accent-emerald)', fontWeight: 700 }}>On Track for Staff LLD 🚀</span>
          </div>
        </div>
      </div>

      {/* 5. Architectural Concept of the Day (Interactive Card) */}
      <div
        className="designlab-card"
        style={{
          padding: 22,
          marginBottom: 30,
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(6, 182, 212, 0.05) 100%)',
          border: '1px solid rgba(99, 102, 241, 0.25)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8, flexWrap: 'wrap', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span
              style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                background: 'rgba(245, 158, 11, 0.15)',
                color: '#f59e0b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Lightbulb size={16} />
            </span>
            <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Architect Interview Tip of the Day
            </span>
          </div>

          <button
            onClick={() => setShowTipAnswer(!showTipAnswer)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--accent-primary)',
              fontWeight: 700,
              fontSize: '0.8rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 4
            }}
          >
            {showTipAnswer ? 'Hide Architectural Rule' : 'Reveal Solution Rule'}
            {showTipAnswer ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </button>
        </div>

        <p style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: showTipAnswer ? 10 : 0 }}>
          <strong>Scenario:</strong> In the Elevator Dispatcher problem, when should you use the <em>State Pattern</em> vs the <em>Strategy Pattern</em>?
        </p>

        {showTipAnswer && (
          <div
            style={{
              marginTop: 10,
              padding: 14,
              borderRadius: 'var(--radius-sm)',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.84rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.6
            }}
          >
            <div style={{ fontWeight: 700, color: '#10b981', marginBottom: 4 }}>
              ✅ Staff Architect Verdict:
            </div>
            Use the <strong>State Pattern</strong> for the internal lifecycle of an <code>ElevatorCar</code> (e.g. <code>IdleState</code>, <code>MovingUpState</code>, <code>MaintenanceState</code>), where the car's behavior changes dynamically based on its state transitions. Use the <strong>Strategy Pattern</strong> in the <code>ElevatorController</code> to encapsulate the dispatch algorithm (e.g. <code>LOOKStrategy</code>, <code>ScanStrategy</code>, <code>ShortestSeekStrategy</code>) so algorithms can be swapped without modifying car logic!
          </div>
        )}
      </div>

      {/* 6. Filterable Problem Catalog Grid */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18, flexWrap: 'wrap', gap: 14 }}>
          <div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: 2 }}>
              Practice Problem Catalog
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Choose an object-oriented scenario to gather requirements, draft Mermaid UML diagrams, and evaluate OOP implementation.
            </p>
          </div>

          {/* Search & Filter Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            {/* Search Input */}
            <div
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <Search size={15} color="var(--text-muted)" style={{ position: 'absolute', left: 12 }} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search problem, company, pattern..."
                style={{
                  padding: '7px 12px 7px 34px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-subtle)',
                  background: 'var(--bg-card)',
                  color: 'var(--text-primary)',
                  fontSize: '0.82rem',
                  width: 240,
                  outline: 'none'
                }}
              />
            </div>

            {/* Category Filter Pills */}
            <div style={{ display: 'flex', gap: 4, background: 'var(--bg-card)', padding: 3, borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    padding: '5px 11px',
                    borderRadius: 'var(--radius-xs)',
                    border: 'none',
                    background: selectedCategory === cat ? 'var(--accent-soft)' : 'transparent',
                    color: selectedCategory === cat ? 'var(--accent-primary)' : 'var(--text-secondary)',
                    fontWeight: selectedCategory === cat ? 700 : 500,
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
            <div style={{ display: 'flex', gap: 4, background: 'var(--bg-card)', padding: 3, borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
              {difficulties.map((diff) => (
                <button
                  key={diff}
                  onClick={() => setSelectedDifficulty(diff)}
                  style={{
                    padding: '5px 10px',
                    borderRadius: 'var(--radius-xs)',
                    border: 'none',
                    background: selectedDifficulty === diff ? 'var(--accent-primary)' : 'transparent',
                    color: selectedDifficulty === diff ? '#ffffff' : 'var(--text-secondary)',
                    fontWeight: selectedDifficulty === diff ? 700 : 500,
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

        {/* Problem Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
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

            const companies = companyBadges[p.id] || ['Google', 'Amazon'];
            const patterns = patternBadges[p.id] || ['Factory Method', 'Strategy Pattern'];
            const isExpanded = expandedCardId === p.id;

            return (
              <div
                key={p.id}
                className="designlab-card designlab-card-interactive"
                style={{
                  padding: 22,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
                onClick={() => onSelectProblem(p.id)}
              >
                <div>
                  {/* Top Row: Difficulty & Time */}
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
                  <h4 style={{ fontSize: '1.18rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 8 }}>
                    {p.title}
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 14, lineHeight: 1.55 }}>
                    {p.description}
                  </p>

                  {/* Company Tags */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700 }}>Companies:</span>
                    {companies.map((c, i) => (
                      <span
                        key={i}
                        style={{
                          fontSize: '0.7rem',
                          background: 'var(--bg-card-subtle)',
                          border: '1px solid var(--border-light)',
                          padding: '2px 7px',
                          borderRadius: 4,
                          fontWeight: 600,
                          color: 'var(--text-secondary)'
                        }}
                      >
                        {c}
                      </span>
                    ))}
                  </div>

                  {/* Pattern Badges */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700 }}>Patterns:</span>
                    {patterns.map((pat, i) => (
                      <span
                        key={i}
                        style={{
                          fontSize: '0.7rem',
                          background: 'rgba(99, 102, 241, 0.08)',
                          border: '1px solid rgba(99, 102, 241, 0.25)',
                          padding: '2px 7px',
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
                        borderRadius: 'var(--radius-xs)',
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
