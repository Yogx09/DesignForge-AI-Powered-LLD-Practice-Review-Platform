import React, { useState, useEffect } from 'react';
import { ProblemSummary } from '../types';
import { Search, X, ArrowRight, Box, Zap, Sparkles, BookOpen, FileText } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  problems: ProblemSummary[];
  onSelectProblem: (id: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  problems,
  onSelectProblem
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filtered = problems.filter(p => {
    const q = query.toLowerCase();
    return (
      p.title.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.difficulty.toLowerCase().includes(q) ||
      p.concepts.some(c => c.toLowerCase().includes(q))
    );
  });

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'var(--bg-modal-backdrop)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'center',
      zIndex: 110,
      paddingTop: '12vh'
    }}>
      <div className="designlab-card" style={{
        maxWidth: 620,
        width: '100%',
        overflow: 'hidden',
        boxShadow: '0 24px 60px rgba(0,0,0,0.5)',
        border: '1px solid var(--border-light)'
      }}>
        {/* Search Input */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '16px 20px',
          borderBottom: '1px solid var(--border-subtle)',
          background: 'var(--bg-card)'
        }}>
          <Search size={18} color="var(--accent-primary)" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search LLD problems, GoF patterns, or concepts..."
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              fontSize: '0.96rem',
              color: 'var(--text-primary)',
              outline: 'none',
              fontWeight: 500
            }}
          />
          <kbd style={{
            background: 'var(--bg-card-subtle)',
            border: '1px solid var(--border-light)',
            padding: '2px 6px',
            borderRadius: 4,
            fontSize: '0.7rem',
            color: 'var(--text-muted)'
          }}>
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div style={{ maxHeight: 380, overflowY: 'auto', padding: 8 }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
              No problems found matching "<strong style={{ color: 'var(--text-primary)' }}>{query}</strong>"
            </div>
          ) : (
            filtered.map((p) => (
              <div
                key={p.id}
                onClick={() => {
                  onSelectProblem(p.id);
                  onClose();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '11px 14px',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--accent-soft)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 36,
                    height: 36,
                    borderRadius: 8,
                    background: 'var(--accent-soft)',
                    color: 'var(--accent-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '0.9rem'
                  }}>
                    {p.title.charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                      {p.title}
                    </div>
                    <div style={{ display: 'flex', gap: 6, marginTop: 2 }}>
                      <span className="badge badge-medium" style={{ padding: '2px 6px', fontSize: '0.68rem' }}>{p.difficulty}</span>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{p.category} • {p.timeEstimate}</span>
                    </div>
                  </div>
                </div>

                <ArrowRight size={14} color="var(--text-muted)" />
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '10px 16px',
          background: 'var(--bg-card-subtle)',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.74rem',
          color: 'var(--text-muted)'
        }}>
          <span>Press <strong>↵ Enter</strong> to open</span>
          <span><strong>↑↓</strong> to navigate</span>
        </div>
      </div>
    </div>
  );
};

