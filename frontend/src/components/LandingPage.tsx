import React from 'react';
import { ProblemSummary } from '../types';
import {
  Sparkles,
  Zap,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Layers,
  TrendingUp,
  Clock,
  Terminal,
  FileCheck2,
  CheckCircle2
} from 'lucide-react';

interface LandingPageProps {
  problems: ProblemSummary[];
  onSelectProblem: (id: string) => void;
  onTrySampleDemo: () => void;
  onOpenDocs: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  problems,
  onSelectProblem,
  onTrySampleDemo,
  onOpenDocs
}) => {
  return (
    <div style={{ maxWidth: 1240, margin: '0 auto', padding: '40px 20px' }}>
      {/* Hero Section */}
      <div style={{ textAlign: 'center', marginBottom: 56 }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          background: 'rgba(99, 102, 241, 0.1)',
          border: '1px solid rgba(99, 102, 241, 0.25)',
          padding: '6px 14px',
          borderRadius: 9999,
          fontSize: '0.8rem',
          color: '#a5b4fc',
          fontWeight: 600,
          marginBottom: 20
        }}>
          <Sparkles size={14} color="var(--accent-primary)" />
          <span>CipherSchools 2-Day Engineering Assignment • Live Production Studio</span>
        </div>

        <h1 style={{
          fontSize: '3.2rem',
          fontWeight: 800,
          letterSpacing: '-0.035em',
          lineHeight: 1.15,
          marginBottom: 20,
          background: 'linear-gradient(180deg, #ffffff 0%, #cbd5e1 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Master Low-Level Design with<br />Explainable Rubric Feedback
        </h1>

        <p style={{
          maxWidth: 680,
          margin: '0 auto 32px',
          fontSize: '1.05rem',
          color: 'var(--text-secondary)',
          lineHeight: 1.7
        }}>
          Model domain entities, sketch live Mermaid class diagrams, write clean SOLID code, and receive instant multi-dimensional rubric feedback evaluated against Principal Engineer interview standards.
        </p>

        {/* Hero CTAs */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, flexWrap: 'wrap' }}>
          <button
            onClick={onTrySampleDemo}
            className="btn btn-primary"
            style={{
              padding: '12px 24px',
              fontSize: '0.95rem',
              background: 'linear-gradient(180deg, #6366f1, #4338ca)',
              boxShadow: '0 0 25px rgba(99, 102, 241, 0.4)'
            }}
          >
            <Zap size={16} /> Try Sample Submission (Instant Reviewer Demo)
          </button>

          <button
            onClick={() => onSelectProblem('parking-lot')}
            className="btn btn-secondary"
            style={{ padding: '12px 20px', fontSize: '0.95rem' }}
          >
            <span>Start Blank Workspace</span> <ArrowRight size={15} />
          </button>

          <button
            onClick={onOpenDocs}
            className="btn btn-secondary"
            style={{ padding: '12px 18px', fontSize: '0.95rem' }}
          >
            <BookOpen size={16} /> Reviewer Notes & Research
          </button>
        </div>
      </div>

      {/* Feature Highlights Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: 16,
        marginBottom: 60
      }}>
        {[
          {
            icon: ShieldCheck,
            title: '5-Dimension Rubric Scoring',
            desc: 'Evaluates Cohesion, Interface Segregation, GoF Patterns, Concurrency & Trade-offs (0-100 pts).'
          },
          {
            icon: Layers,
            title: 'Live Mermaid Class Diagrams',
            desc: 'Write Mermaid syntax and visualize dynamic SVG class relationships in real-time.'
          },
          {
            icon: Cpu,
            title: 'Hybrid Evaluation Engine',
            desc: 'Instant static quality checks with zero-config offline heuristics and optional Google Gemini AI.'
          },
          {
            icon: TrendingUp,
            title: 'Attempt Delta Tracking',
            desc: 'Compare Attempt #N vs Attempt #N-1 with score deltas and resolved design smell checklists.'
          }
        ].map((feat, idx) => {
          const Icon = feat.icon;
          return (
            <div key={idx} className="glass-card" style={{ padding: 22 }}>
              <div style={{
                width: 36,
                height: 36,
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(99, 102, 241, 0.1)',
                border: '1px solid rgba(99, 102, 241, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 14
              }}>
                <Icon size={18} color="var(--accent-primary)" />
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 6, color: '#f8fafc' }}>
                {feat.title}
              </h3>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {feat.desc}
              </p>
            </div>
          );
        })}
      </div>

      {/* Problem Catalog Section */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: 10 }}>
              <Terminal size={20} color="var(--accent-cyan)" /> Curated LLD Challenges
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Select any problem to launch the practice studio or inspect requirements.
            </p>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
          gap: 20
        }}>
          {problems.map((p) => {
            const badgeClass =
              p.difficulty === 'Easy'
                ? 'badge-easy'
                : p.difficulty === 'Medium'
                ? 'badge-medium'
                : 'badge-hard';

            const isFullyImplemented = p.id === 'parking-lot';

            return (
              <div
                key={p.id}
                className="glass-card"
                style={{
                  padding: 24,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  border: isFullyImplemented ? '1px solid rgba(99, 102, 241, 0.35)' : '1px solid var(--border-subtle)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span className={`badge ${badgeClass}`}>{p.difficulty}</span>
                      {isFullyImplemented && (
                        <span className="badge badge-primary" style={{ fontSize: '0.68rem' }}>Full Implementation</span>
                      )}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      <Clock size={12} /> {p.timeEstimate}
                    </div>
                  </div>

                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 8, color: '#f8fafc' }}>
                    {p.title}
                  </h3>

                  <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', marginBottom: 18, lineHeight: 1.6 }}>
                    {p.description}
                  </p>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 20 }}>
                    {p.concepts.slice(0, 3).map((concept, idx) => (
                      <span
                        key={idx}
                        style={{
                          fontSize: '0.72rem',
                          background: 'rgba(255, 255, 255, 0.04)',
                          border: '1px solid var(--border-subtle)',
                          padding: '2px 8px',
                          borderRadius: 4,
                          color: '#cbd5e1'
                        }}
                      >
                        {concept}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 10 }}>
                  <button
                    onClick={() => onSelectProblem(p.id)}
                    className="btn btn-primary"
                    style={{ flex: 1 }}
                  >
                    <span>Practice Studio</span> <ArrowRight size={14} />
                  </button>
                  {isFullyImplemented && (
                    <button
                      onClick={onTrySampleDemo}
                      className="btn btn-secondary"
                      title="1-Click Reviewer Demo"
                      style={{ padding: '8px 12px' }}
                    >
                      <Zap size={15} color="var(--accent-cyan)" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
