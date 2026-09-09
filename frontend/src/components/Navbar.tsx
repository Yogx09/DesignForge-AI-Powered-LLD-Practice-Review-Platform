import React from 'react';
import { Layers, BookOpen, History, Cpu, Zap, FileText } from 'lucide-react';
import { ProblemSummary } from '../types';

interface NavbarProps {
  problems: ProblemSummary[];
  activeProblemId: string | null;
  onSelectProblem: (id: string) => void;
  onViewLanding: () => void;
  onOpenHistory?: () => void;
  onOpenDocs: () => void;
  onTrySampleDemo: () => void;
  submissionCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  problems,
  activeProblemId,
  onSelectProblem,
  onViewLanding,
  onOpenHistory,
  onOpenDocs,
  onTrySampleDemo,
  submissionCount
}) => {
  return (
    <header style={{
      borderBottom: '1px solid var(--border-subtle)',
      background: 'rgba(9, 11, 16, 0.92)',
      backdropFilter: 'blur(16px)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      padding: '10px 20px'
    }}>
      <div style={{
        maxWidth: 1440,
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16
      }}>
        {/* Brand & Landing Trigger */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div 
            onClick={onViewLanding}
            style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}
          >
            <div style={{
              width: 32,
              height: 32,
              borderRadius: 'var(--radius-sm)',
              background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 12px rgba(99, 102, 241, 0.4)'
            }}>
              <Layers size={18} color="#ffffff" />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.05rem', letterSpacing: '-0.02em', color: '#f8fafc' }}>
                CipherLLD <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>STUDIO</span>
              </div>
            </div>
          </div>

          <button 
            onClick={onViewLanding}
            className="btn btn-secondary"
            style={{ padding: '5px 10px', fontSize: '0.78rem' }}
          >
            <BookOpen size={13} /> Challenges
          </button>

          <button 
            onClick={onOpenDocs}
            className="btn btn-secondary"
            style={{ padding: '5px 10px', fontSize: '0.78rem' }}
          >
            <FileText size={13} /> Reviewer Notes
          </button>
        </div>

        {/* Active Problem Selector */}
        {activeProblemId && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Problem:</span>
            <select
              value={activeProblemId}
              onChange={(e) => onSelectProblem(e.target.value)}
              style={{
                background: 'var(--bg-tertiary)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-light)',
                padding: '4px 10px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              {problems.map(p => (
                <option key={p.id} value={p.id}>
                  {p.title} ({p.difficulty})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Action Controls & AI Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            onClick={onTrySampleDemo}
            className="btn btn-outline-cyan"
            style={{ padding: '5px 12px', fontSize: '0.78rem' }}
          >
            <Zap size={13} /> 1-Click Reviewer Demo
          </button>

          {submissionCount > 0 && onOpenHistory && (
            <button
              onClick={onOpenHistory}
              className="btn btn-secondary"
              style={{ padding: '5px 10px', fontSize: '0.78rem' }}
            >
              <History size={13} /> History ({submissionCount})
            </button>
          )}

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 5,
            background: 'rgba(99, 102, 241, 0.1)',
            border: '1px solid rgba(99, 102, 241, 0.25)',
            padding: '4px 8px',
            borderRadius: 9999,
            fontSize: '0.72rem',
            color: '#a5b4fc',
            fontWeight: 600
          }}>
            <Cpu size={12} color="#818cf8" />
            <span>Hybrid Evaluator</span>
          </div>
        </div>
      </div>
    </header>
  );
};
