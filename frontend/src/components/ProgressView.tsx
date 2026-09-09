import React from 'react';
import { ProblemSummary, Attempt } from '../types';
import {
  Award,
  TrendingUp,
  Clock,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  History,
  GitCompare,
  ArrowRight
} from 'lucide-react';

interface ProgressViewProps {
  problems: ProblemSummary[];
  attempt?: Attempt | null;
  onSelectProblem: (id: string) => void;
  onOpenHistoryModal: () => void;
}

export const ProgressView: React.FC<ProgressViewProps> = ({
  problems,
  attempt,
  onSelectProblem,
  onOpenHistoryModal
}) => {
  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 8px' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>
          Learning Progress & Skill Analytics
        </h1>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
          Track your object-oriented design mastery, rubric breakdown, and attempt improvements over time.
        </p>
      </div>

      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 16,
        marginBottom: 24
      }}>
        {[
          { label: 'Total Challenges', val: `${problems.length}`, icon: BookOpen, color: '#6366f1' },
          { label: 'Average Score', val: '82%', icon: Award, color: '#10b981' },
          { label: 'Score Improvement', val: '+14 pts', icon: TrendingUp, color: '#06b6d4' },
          { label: 'Time Invested', val: '2.5 hrs', icon: Clock, color: '#f59e0b' }
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="designlab-card" style={{ padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>{item.label}</span>
                <Icon size={18} color={item.color} />
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {item.val}
              </div>
            </div>
          );
        })}
      </div>

      {/* Rubric Skill Radar / Bar Grid */}
      <div className="designlab-card" style={{ padding: 24, marginBottom: 24 }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 16 }}>
          Skill Mastery by Architectural Dimension
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          {[
            { name: 'Domain Modeling & Cohesion', pct: 91, color: '#10b981' },
            { name: 'Abstraction & Interface Segregation', pct: 84, color: '#10b981' },
            { name: 'Extensibility & Design Patterns', pct: 76, color: '#06b6d4' },
            { name: 'Edge Cases & Concurrency', pct: 70, color: '#f59e0b' },
            { name: 'Trade-offs & Rationale', pct: 88, color: '#6366f1' }
          ].map((skill, idx) => (
            <div key={idx}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {skill.name}
                </span>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {skill.pct}%
                </span>
              </div>
              <div style={{ height: 8, background: 'var(--bg-card-subtle)', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${skill.pct}%`, background: skill.color, borderRadius: 4 }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Attempt History Quick Action Card */}
      {attempt && attempt.submissions.length > 0 && (
        <div className="designlab-card" style={{
          padding: 24,
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(255, 255, 255, 0.95) 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>
              Active Attempt History ({attempt.submissions.length} Submissions recorded)
            </h3>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
              Inspect attempt score deltas and resolved design smells version-over-version.
            </p>
          </div>
          <button onClick={onOpenHistoryModal} className="btn btn-primary" style={{ padding: '8px 18px', fontSize: '0.85rem' }}>
            <History size={15} /> View Version Diffs
          </button>
        </div>
      )}
    </div>
  );
};
