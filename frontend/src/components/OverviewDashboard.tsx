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
  Compass
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

  const categories = ['All', 'System Design', 'OOP Core', 'State & Concurrency'];

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
    'parking-lot': ['Strategy', 'Factory', 'Observer'],
    'elevator-system': ['State', 'Strategy', 'Observer'],
    'rate-limiter': ['Token Bucket', 'Decorator'],
    'vending-machine': ['State Machine', 'Chain of Resp'],
    'logging-framework': ['Singleton', 'Chain of Resp', 'Sink Pattern'],
    'chat-system': ['Pub-Sub', 'Observer', 'Flyweight'],
    'chess-game': ['Command', 'Factory', 'Memento']
  };

  const filteredProblems = selectedCategory === 'All' 
    ? problems 
    : problems.filter(p => p.category.toLowerCase().includes(selectedCategory.toLowerCase()) || (selectedCategory === 'OOP Core' && p.category.includes('System Design')));

  return (
    <div style={{ maxWidth: 1240, margin: '0 auto', padding: '16px 4px' }}>
      {/* 1. Hero Banner */}
      <div className="gradient-border-card" style={{
        padding: '32px 36px',
        marginBottom: 24,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden',
        background: 'var(--bg-card)'
      }}>
        <div style={{ maxWidth: 580, zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <span className="glow-tag">
              <Sparkles size={13} /> SDE-2 / Staff LLD Practice Arena
            </span>
          </div>
          
          <h1 style={{ fontSize: '2.1rem', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.03em', marginBottom: 8, lineHeight: 1.15 }}>
            Master Real-World Object Oriented Systems
          </h1>
          
          <p style={{ fontSize: '0.94rem', color: 'var(--text-secondary)', marginBottom: 22, lineHeight: 1.6 }}>
            Practice low-level design problems with instant AST code validation, Mermaid UML synchronization, and multi-tier rubric evaluation with exact code evidence.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <button
              onClick={() => onSelectProblem('parking-lot')}
              className="btn btn-primary"
              style={{ padding: '10px 22px', fontSize: '0.92rem', borderRadius: 'var(--radius-sm)' }}
            >
              <span>Continue Parking Lot Challenge</span> <ArrowRight size={16} />
            </button>
            <button
              onClick={onTrySampleDemo}
              className="btn btn-outline-primary"
              style={{ padding: '10px 18px', fontSize: '0.9rem', borderRadius: 'var(--radius-sm)' }}
            >
              <Zap size={15} /> 1-Click Instant Review
            </button>
          </div>
        </div>

        {/* Hero Visual Card / Tech Art */}
        <div style={{
          position: 'relative',
          width: 380,
          height: 190,
          borderRadius: 'var(--radius-md)',
          overflow: 'hidden',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-card)',
          background: 'linear-gradient(135deg, #090e17 0%, #151d2f 100%)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 20
        }}>
          <img
            src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop&q=80"
            alt="System Architecture"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: 0.22,
              filter: 'grayscale(30%)'
            }}
          />
          <div style={{ zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Architecture Engine
            </span>
            <div style={{ display: 'flex', gap: 4 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981' }} />
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#6366f1' }} />
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#06b6d4' }} />
            </div>
          </div>

          <div style={{ zIndex: 2 }}>
            <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#f8fafc', marginBottom: 4 }}>
              SOLID • Concurrency • Extensibility
            </div>
            <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
              Deterministic AST & Gemini Pro Heuristics
            </div>
          </div>
        </div>
      </div>

      {/* 2. Stat Metric Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 16,
        marginBottom: 24
      }}>
        {[
          { icon: BookOpen, val: '3 / 7', label: 'Problems Solved', trend: '42% completed', color: '#6366f1', bg: 'rgba(99, 102, 241, 0.1)' },
          { icon: Award, val: '84 / 100', label: 'Average Architecture Score', trend: 'Top 8% percentile', color: '#06b6d4', bg: 'rgba(6, 182, 212, 0.1)' },
          { icon: TrendingUp, val: '+16 pts', label: 'Score Improvement Delta', trend: 'Attempt 2 vs Attempt 1', color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },
          { icon: Clock, val: '2.4 hrs', label: 'Active Practice Time', trend: '3 sessions logged', color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.1)' }
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="designlab-card" style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{
                width: 46,
                height: 46,
                borderRadius: 'var(--radius-sm)',
                background: stat.bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Icon size={24} color={stat.color} />
              </div>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-primary)', lineHeight: 1.1 }}>
                  {stat.val}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600, marginTop: 2 }}>
                  {stat.label}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 2 }}>
                  {stat.trend}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Continue Your Journey & Skill Radar (2 Columns) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.2fr', gap: 20, marginBottom: 28 }}>
        {/* Continue Your Journey Card */}
        <div className="designlab-card" style={{ padding: 24, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                Active Studio Session
              </h3>
              <span className="badge badge-easy">In Progress</span>
            </div>

            <div style={{
              background: 'var(--bg-card-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: 20,
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 20
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <div style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: 'var(--accent-gradient)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '1rem'
                  }}>
                    P
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-primary)' }}>
                      Parking Lot Management System
                    </div>
                    <div style={{ display: 'flex', gap: 6, marginTop: 2 }}>
                      <span className="badge badge-medium">Medium</span>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Building2 size={12} /> Asked in Amazon, Google
                      </span>
                    </div>
                  </div>
                </div>

                <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: 14, lineHeight: 1.5 }}>
                  Design a multi-floor parking lot with dynamic spot allocation, vehicle polymorphism, and extensible pricing strategies.
                </p>

                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>
                    Last Score: 85/100 (Attempt #2)
                  </span>
                  <button
                    onClick={() => onSelectProblem('parking-lot')}
                    className="btn btn-primary"
                    style={{ padding: '7px 16px', fontSize: '0.82rem' }}
                  >
                    Resume Practice &rarr;
                  </button>
                </div>
              </div>

              {/* Mini Architecture Thumbnail */}
              <div style={{
                width: 140,
                height: 110,
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
              }}>
                <Boxes size={28} color="#38bdf8" style={{ marginBottom: 6 }} />
                <span>Strategy + Factory</span>
                <span style={{ fontSize: '0.68rem', color: '#94a3b8', marginTop: 2 }}>Mermaid UML Synced</span>
              </div>
            </div>
          </div>
        </div>

        {/* Design Patterns Mastery Radar */}
        <div className="designlab-card" style={{ padding: 24, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                Design Pattern Mastery
              </h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', fontWeight: 700 }}>6 Patterns</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { name: 'Strategy Pattern', level: '85%', color: '#10b981' },
                { name: 'Factory Method', level: '90%', color: '#6366f1' },
                { name: 'Observer Pattern', level: '75%', color: '#06b6d4' },
                { name: 'State Machine', level: '60%', color: '#f59e0b' },
                { name: 'Singleton (Thread-safe)', level: '95%', color: '#8b5cf6' }
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

          <div style={{ marginTop: 14, paddingTop: 10, borderTop: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <span>Target: 100% Core Patterns</span>
            <span style={{ color: 'var(--accent-emerald)', fontWeight: 700 }}>On Track 🚀</span>
          </div>
        </div>
      </div>

      {/* 4. Filterable Problem Catalog Grid */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 2 }}>
              Practice Problem Catalog
            </h3>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
              Select a system design scenario to practice requirements gathering, UML drafting, and OOP implementation.
            </p>
          </div>

          {/* Filter Pills */}
          <div style={{ display: 'flex', gap: 6, background: 'var(--bg-card)', padding: 4, borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '5px 12px',
                  borderRadius: 'var(--radius-xs)',
                  border: 'none',
                  background: selectedCategory === cat ? 'var(--accent-soft)' : 'transparent',
                  color: selectedCategory === cat ? 'var(--accent-primary)' : 'var(--text-secondary)',
                  fontWeight: selectedCategory === cat ? 700 : 500,
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Problem Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: 18
        }}>
          {filteredProblems.map((p) => {
            const badgeClass =
              p.difficulty === 'Easy'
                ? 'badge-easy'
                : p.difficulty === 'Medium'
                ? 'badge-medium'
                : 'badge-hard';

            const companies = companyBadges[p.id] || ['Google', 'Amazon'];
            const patterns = patternBadges[p.id] || ['Factory', 'Strategy'];

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
                  <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 8 }}>
                    {p.title}
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 16, lineHeight: 1.55 }}>
                    {p.description}
                  </p>

                  {/* Company Tags */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginBottom: 18 }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700 }}>Patterns:</span>
                    {patterns.map((pat, i) => (
                      <span
                        key={i}
                        style={{
                          fontSize: '0.7rem',
                          background: 'rgba(99, 102, 241, 0.06)',
                          border: '1px solid rgba(99, 102, 241, 0.2)',
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
                </div>

                {/* Bottom Card Action */}
                <div style={{ paddingTop: 14, borderTop: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Passing threshold: <strong style={{ color: 'var(--text-primary)' }}>75 pts</strong>
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

