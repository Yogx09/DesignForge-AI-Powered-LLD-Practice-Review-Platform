import React from 'react';
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
  ChevronRight
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
  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 8px' }}>
      {/* 1. Hero Banner */}
      <div className="designlab-card" style={{
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(255, 255, 255, 0.9) 100%)',
        padding: '32px 36px',
        marginBottom: 24,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid rgba(99, 102, 241, 0.2)'
      }}>
        <div style={{ maxWidth: 540 }}>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', marginBottom: 6 }}>
            Good evening, Yogesh! 👋
          </h1>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: 20 }}>
            Small designs today, big systems tomorrow.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              onClick={() => onSelectProblem('parking-lot')}
              className="btn btn-primary"
              style={{ padding: '10px 20px', fontSize: '0.9rem' }}
            >
              <span>Continue Practice</span> <ArrowRight size={15} />
            </button>
            <button
              onClick={onViewAllProblems}
              className="btn btn-secondary"
              style={{ padding: '10px 18px', fontSize: '0.9rem' }}
            >
              Explore Problems
            </button>
          </div>
        </div>

        {/* Decorative Quote / Illustration */}
        <div style={{
          textAlign: 'right',
          padding: '16px 24px',
          background: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(8px)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid rgba(99, 102, 241, 0.15)'
        }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Think • Design • Build • Grow
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>
            System Architecture Mastery
          </div>
        </div>
      </div>

      {/* 2. Stat Cards Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 16,
        marginBottom: 24
      }}>
        {[
          { icon: BookOpen, val: '3', label: 'Problems Solved', color: '#6366f1', bg: 'rgba(99, 102, 241, 0.1)' },
          { icon: Award, val: '78', label: 'Average Score', color: '#06b6d4', bg: 'rgba(6, 182, 212, 0.1)' },
          { icon: TrendingUp, val: '+14', label: 'Improvement', color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },
          { icon: Clock, val: '2h', label: 'Time Spent', color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.1)' }
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="designlab-card" style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{
                width: 44,
                height: 44,
                borderRadius: 'var(--radius-sm)',
                background: stat.bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Icon size={22} color={stat.color} />
              </div>
              <div>
                <div style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.1 }}>
                  {stat.val}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                  {stat.label}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Continue Your Journey & Your Progress (2 Columns) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.2fr', gap: 20, marginBottom: 28 }}>
        {/* Continue Your Journey Card */}
        <div className="designlab-card" style={{ padding: 24 }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 16 }}>
            Continue Your Journey
          </h3>

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
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: 'var(--accent-gradient)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '0.9rem'
                }}>
                  P
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-primary)' }}>
                    Parking Lot
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <span className="badge badge-medium">Intermediate</span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>System Design</span>
                  </div>
                </div>
              </div>

              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: 14 }}>
                Design a scalable parking lot system with multiple floors, vehicle types and pricing strategies.
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--accent-emerald)' }}>
                  Last score: 82/100
                </span>
                <button
                  onClick={() => onSelectProblem('parking-lot')}
                  className="btn btn-primary"
                  style={{ padding: '6px 14px', fontSize: '0.8rem' }}
                >
                  Continue &rarr;
                </button>
              </div>
            </div>

            <div style={{
              width: 140,
              height: 100,
              borderRadius: 'var(--radius-sm)',
              background: 'linear-gradient(135deg, #1e293b, #0f172a)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#38bdf8',
              fontSize: '0.75rem',
              fontWeight: 700,
              border: '1px solid rgba(56, 189, 248, 0.2)'
            }}>
              <Layers size={28} color="#38bdf8" style={{ marginBottom: 6 }} />
              Real Systems Thinking
            </div>
          </div>
        </div>

        {/* Your Progress Circular Ring Card */}
        <div className="designlab-card" style={{ padding: 24, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 12 }}>
            Your Progress
          </h3>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
            {/* Donut percentage ring */}
            <div style={{
              width: 100,
              height: 100,
              borderRadius: '50%',
              background: 'conic-gradient(#6366f1 0% 42%, #e2e8f0 42% 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div style={{
                width: 76,
                height: 76,
                borderRadius: '50%',
                background: 'var(--bg-card)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>
                  42%
                </span>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>3/7 problems</span>
              </div>
            </div>

            {/* Level breakdown */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: '0.8rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981' }} />
                <span style={{ color: 'var(--text-secondary)' }}>Beginner</span>
                <strong style={{ marginLeft: 'auto', color: 'var(--text-primary)' }}>1</strong>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#f59e0b' }} />
                <span style={{ color: 'var(--text-secondary)' }}>Intermediate</span>
                <strong style={{ marginLeft: 'auto', color: 'var(--text-primary)' }}>2</strong>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444' }} />
                <span style={{ color: 'var(--text-secondary)' }}>Advanced</span>
                <strong style={{ marginLeft: 'auto', color: 'var(--text-primary)' }}>0</strong>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#8b5cf6' }} />
                <span style={{ color: 'var(--text-secondary)' }}>Expert</span>
                <strong style={{ marginLeft: 'auto', color: 'var(--text-primary)' }}>0</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Popular Problems Row */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Popular Problems
          </h3>
          <button
            onClick={onViewAllProblems}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--accent-primary)',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 4
            }}
          >
            View all &rarr;
          </button>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 14
        }}>
          {problems.map((p) => {
            const badgeClass =
              p.difficulty === 'Easy'
                ? 'badge-easy'
                : p.difficulty === 'Medium'
                ? 'badge-medium'
                : 'badge-hard';

            const firstLetter = p.title.charAt(0);

            return (
              <div
                key={p.id}
                onClick={() => onSelectProblem(p.id)}
                className="designlab-card"
                style={{
                  padding: 16,
                  cursor: 'pointer',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 10
                }}
              >
                <div style={{
                  width: 42,
                  height: 42,
                  borderRadius: 12,
                  background: 'var(--accent-soft)',
                  border: '1px solid var(--accent-soft-border)',
                  color: 'var(--accent-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.1rem',
                  fontWeight: 800
                }}>
                  {firstLetter}
                </div>

                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                  {p.title}
                </div>

                <span className={`badge ${badgeClass}`}>{p.difficulty}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
