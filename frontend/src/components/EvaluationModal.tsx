import React, { useEffect, useState } from 'react';
import { Loader2, CheckCircle2, ShieldCheck, Cpu, Sparkles, Layers } from 'lucide-react';

interface EvaluationModalProps {
  isOpen: boolean;
}

const STAGES = [
  { label: 'Sanitizing Submission & Static Structural Analysis', icon: ShieldCheck },
  { label: 'Evaluating Domain Entities & Single Responsibility Principle', icon: Layers },
  { label: 'Analyzing Interface Segregation & Design Patterns', icon: Sparkles },
  { label: 'Extracting Evidence Quotes & Scoring Rubric Dimensions', icon: Cpu }
];

export const EvaluationModal: React.FC<EvaluationModalProps> = ({ isOpen }) => {
  const [currentStage, setCurrentStage] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setCurrentStage(0);
      return;
    }

    const interval = setInterval(() => {
      setCurrentStage((prev) => (prev < STAGES.length - 1 ? prev + 1 : prev));
    }, 600);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(5, 8, 15, 0.85)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      padding: 20
    }}>
      <div className="glass-card" style={{
        maxWidth: 520,
        width: '100%',
        padding: 32,
        textAlign: 'center',
        border: '1px solid rgba(99, 102, 241, 0.3)',
        boxShadow: '0 0 50px rgba(99, 102, 241, 0.25)'
      }}>
        <div style={{
          width: 56,
          height: 56,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-cyan))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px',
          boxShadow: '0 0 25px rgba(99, 102, 241, 0.5)'
        }}>
          <Loader2 size={28} color="#ffffff" className="animate-spin" />
        </div>

        <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: 8, color: '#f8fafc' }}>
          Evaluating LLD Solution
        </h3>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: 24 }}>
          Our hybrid evaluation engine is analyzing your design contracts, class coupling, patterns, and trade-offs...
        </p>

        {/* Multi-stage Progress Indicators */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, textAlign: 'left' }}>
          {STAGES.map((stage, idx) => {
            const Icon = stage.icon;
            const isCompleted = idx < currentStage;
            const isCurrent = idx === currentStage;

            return (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-sm)',
                  background: isCurrent
                    ? 'rgba(99, 102, 241, 0.15)'
                    : isCompleted
                    ? 'rgba(16, 185, 129, 0.1)'
                    : 'rgba(255, 255, 255, 0.02)',
                  border: isCurrent
                    ? '1px solid rgba(99, 102, 241, 0.4)'
                    : isCompleted
                    ? '1px solid rgba(16, 185, 129, 0.3)'
                    : '1px solid var(--border-subtle)',
                  transition: 'all 0.3s ease'
                }}
              >
                {isCompleted ? (
                  <CheckCircle2 size={18} color="#10b981" />
                ) : isCurrent ? (
                  <Loader2 size={18} color="#6366f1" className="animate-spin" />
                ) : (
                  <Icon size={18} color="#64748b" />
                )}
                <span style={{
                  fontSize: '0.85rem',
                  fontWeight: isCurrent ? 700 : 500,
                  color: isCompleted ? '#34d399' : isCurrent ? '#a5b4fc' : '#64748b'
                }}>
                  {stage.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
