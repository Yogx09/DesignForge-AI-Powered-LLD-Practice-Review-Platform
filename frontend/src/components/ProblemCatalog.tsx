import React from 'react';
import { ProblemSummary } from '../types';
import { Clock, ArrowRight, CheckCircle2, ShieldCheck, Sparkles, Terminal, Code2 } from 'lucide-react';

interface ProblemCatalogProps {
  problems: ProblemSummary[];
  onSelectProblem: (id: string) => void;
}

export const ProblemCatalog: React.FC<ProblemCatalogProps> = ({ problems, onSelectProblem }) => {
  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 20px' }}>
      {/* Hero Section */}
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          background: 'rgba(99, 102, 241, 0.12)',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          padding: '6px 16px',
          borderRadius: 9999,
          fontSize: '0.82rem',
          color: '#a5b4fc',
          fontWeight: 600,
          marginBottom: 16
        }}>
          <Sparkles size={14} /> Master Object-Oriented & Low-Level System Design
        </div>
        <h1 style={{
          fontSize: '2.75rem',
          fontWeight: 800,
          letterSpacing: '-0.03em',
          marginBottom: 16,
          background: 'linear-gradient(to right, #ffffff, #cbd5e1)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Practice Low-Level Design with Explainable Rubric Feedback
        </h1>
        <p style={{
          maxWidth: 720,
          margin: '0 auto',
          fontSize: '1.05rem',
          color: 'var(--text-secondary)',
          lineHeight: 1.7
        }}>
          Choose a real-world design problem, model entities, define class relationships, write clean extensible code, and get multi-dimensional feedback evaluated against Principal Engineer interview standards.
        </p>

        {/* Practice Loop Stepper */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 12,
          marginTop: 32,
          flexWrap: 'wrap'
        }}>
          {[
            { step: '1', title: 'Choose Problem' },
            { step: '2', title: 'Model & Diagram' },
            { step: '3', title: 'Write Clean Code' },
            { step: '4', title: 'Get Rubric Feedback' },
            { step: '5', title: 'Iterate & Track Delta' }
          ].map((item, idx) => (
            <div key={idx} style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: 'var(--bg-glass)',
              border: '1px solid var(--border-subtle)',
              padding: '6px 14px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.8rem',
              color: 'var(--text-secondary)'
            }}>
              <span style={{
                width: 20,
                height: 20,
                borderRadius: '50%',
                background: 'var(--accent-primary)',
                color: '#fff',
                fontSize: '0.7rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>{item.step}</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{item.title}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Problem Grid */}
      <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
        <Terminal size={20} color="var(--accent-cyan)" /> Curated LLD Challenges ({problems.length})
      </h2>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
        gap: 24
      }}>
        {problems.map((p) => {
          const badgeClass =
            p.difficulty === 'Easy'
              ? 'badge-easy'
              : p.difficulty === 'Medium'
              ? 'badge-medium'
              : 'badge-hard';

          return (
            <div
              key={p.id}
              className="glass-card"
              style={{
                padding: 24,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div>
                {/* Header tags */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                  <span className={`badge ${badgeClass}`}>{p.difficulty}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    <Clock size={13} /> {p.timeEstimate}
                  </div>
                </div>

                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 10, color: 'var(--text-primary)' }}>
                  {p.title}
                </h3>
                
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: 20, lineHeight: 1.6 }}>
                  {p.description}
                </p>

                {/* Key Concepts */}
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase' }}>
                    Core Design Patterns & Concepts:
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {p.concepts.slice(0, 3).map((concept, idx) => (
                      <span
                        key={idx}
                        style={{
                          fontSize: '0.72rem',
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid var(--border-subtle)',
                          padding: '3px 8px',
                          borderRadius: 6,
                          color: '#cbd5e1'
                        }}
                      >
                        {concept}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Start Practice CTA */}
              <button
                onClick={() => onSelectProblem(p.id)}
                className="btn btn-primary"
                style={{ width: '100%', marginTop: 8 }}
              >
                <span>Start Practice</span> <ArrowRight size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
