import React from 'react';
import { EvaluationResult, AttemptComparison } from '../types';
import {
  Award,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  ShieldCheck,
  Zap,
  TrendingUp,
  FileCode,
  Clock,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface FeedbackDashboardProps {
  evaluation: EvaluationResult;
  comparison?: AttemptComparison;
  version: number;
  onIterate: () => void;
}

export const FeedbackDashboard: React.FC<FeedbackDashboardProps> = ({
  evaluation,
  comparison,
  version,
  onIterate
}) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#f59e0b';
    return '#f43f5e';
  };

  const scoreColor = getScoreColor(evaluation.overallScore);

  return (
    <div style={{ marginTop: 32 }}>
      {/* Top Banner: Overall Score & Summary */}
      <div className="glass-card" style={{ padding: 28, marginBottom: 24, position: 'relative', overflow: 'hidden' }}>
        {/* Glow accent */}
        <div style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: 250,
          height: 250,
          background: `radial-gradient(circle, ${scoreColor}22 0%, transparent 70%)`,
          pointerEvents: 'none'
        }} />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
          {/* Left: Attempt Version & Score */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            {/* Score Ring / Box */}
            <div style={{
              width: 90,
              height: 90,
              borderRadius: 'var(--radius-lg)',
              background: 'rgba(15, 23, 42, 0.85)',
              border: `2px solid ${scoreColor}`,
              boxShadow: `0 0 25px ${scoreColor}33`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span style={{ fontSize: '2rem', fontWeight: 800, color: scoreColor, lineHeight: 1 }}>
                {evaluation.overallScore}
              </span>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>/ 100 PTS</span>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                <span className="badge badge-primary">Attempt #{version} Evaluated</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Clock size={12} /> {evaluation.durationMs}ms evaluation time
                </span>
              </div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {evaluation.overallScore >= 80
                  ? 'Strong Architectural Design!'
                  : evaluation.overallScore >= 60
                  ? 'Promising Design with Key Areas for Refinement'
                  : 'Foundational Structure Needs More Decomposition'}
              </h2>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                Evaluated by <strong style={{ color: 'var(--accent-cyan)' }}>{evaluation.evaluatorUsed}</strong> against standard LLD interview rubrics.
              </p>
            </div>
          </div>

          {/* Right: Iterate Button */}
          <button
            onClick={onIterate}
            className="btn btn-primary"
            style={{ padding: '12px 24px', fontSize: '0.95rem' }}
          >
            <span>Refine Solution & Attempt #{version + 1}</span>
            <ArrowRight size={16} />
          </button>
        </div>

        {/* Comparison Delta Callout (If Version > 1) */}
        {comparison && (
          <div style={{
            marginTop: 20,
            padding: '14px 18px',
            background: comparison.scoreDelta >= 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)',
            border: comparison.scoreDelta >= 0 ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(244, 63, 94, 0.3)',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <TrendingUp size={20} color={comparison.scoreDelta >= 0 ? '#10b981' : '#f43f5e'} />
              <div>
                <span style={{ fontWeight: 700, color: comparison.scoreDelta >= 0 ? '#34d399' : '#fb7185' }}>
                  Progress from Attempt #{comparison.previousVersion} to #{comparison.currentVersion}:
                </span>{' '}
                <span style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                  {comparison.summary}
                </span>
              </div>
            </div>

            <div style={{
              fontWeight: 800,
              fontSize: '1.1rem',
              color: comparison.scoreDelta >= 0 ? '#10b981' : '#f43f5e'
            }}>
              {comparison.scoreDelta >= 0 ? `+${comparison.scoreDelta}` : comparison.scoreDelta} pts
            </div>
          </div>
        )}
      </div>

      {/* Deterministic Quality Checks Grid */}
      {evaluation.deterministicChecks && evaluation.deterministicChecks.length > 0 && (
        <div className="glass-card" style={{ padding: 20, marginBottom: 24 }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
            <ShieldCheck size={16} color="var(--accent-cyan)" /> Static Structural Quality Checks
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
            {evaluation.deterministicChecks.map((check, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 10,
                  padding: '10px 14px',
                  background: check.passed ? 'rgba(16, 185, 129, 0.06)' : 'rgba(245, 158, 11, 0.06)',
                  border: check.passed ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid rgba(245, 158, 11, 0.25)',
                  borderRadius: 'var(--radius-sm)'
                }}
              >
                {check.passed ? (
                  <CheckCircle2 size={16} color="#10b981" style={{ flexShrink: 0, marginTop: 2 }} />
                ) : (
                  <AlertTriangle size={16} color="#f59e0b" style={{ flexShrink: 0, marginTop: 2 }} />
                )}
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: check.passed ? '#34d399' : '#fbbf24' }}>
                    {check.checkName}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: 2 }}>
                    {check.message}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Rubric Criteria Feedback Breakdown */}
      <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
        <Award size={20} color="var(--accent-primary)" /> Dimension-by-Dimension Rubric Feedback
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        {evaluation.criteriaFeedback.map((criterion) => {
          const critScoreColor = getScoreColor((criterion.score / criterion.maxScore) * 100);

          return (
            <div key={criterion.criterionId} className="glass-card" style={{ padding: 22 }}>
              {/* Criterion Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <div>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {criterion.criterionName}
                  </h4>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Weight: {Math.round(criterion.weight * 100)}% of total grade
                  </div>
                </div>

                {/* Criterion Score Pill */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '6px 14px',
                  borderRadius: 9999,
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: `1px solid ${critScoreColor}66`
                }}>
                  <span style={{ fontSize: '1.1rem', fontWeight: 800, color: critScoreColor }}>
                    {criterion.score}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>/ {criterion.maxScore}</span>
                </div>
              </div>

              {/* Score Progress Bar */}
              <div style={{
                height: 6,
                width: '100%',
                background: 'rgba(255, 255, 255, 0.06)',
                borderRadius: 3,
                marginBottom: 16,
                overflow: 'hidden'
              }}>
                <div style={{
                  height: '100%',
                  width: `${(criterion.score / criterion.maxScore) * 100}%`,
                  background: `linear-gradient(to right, ${critScoreColor}99, ${critScoreColor})`,
                  borderRadius: 3,
                  transition: 'width 0.8s ease'
                }} />
              </div>

              {/* Feedback Columns: Strengths & Concerns */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 14 }}>
                {/* Strengths */}
                <div style={{
                  background: 'rgba(16, 185, 129, 0.05)',
                  padding: 14,
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid rgba(16, 185, 129, 0.15)'
                }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#34d399', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                    <CheckCircle2 size={14} /> Strengths & Valid Patterns
                  </div>
                  <ul style={{ paddingLeft: 18, fontSize: '0.83rem', color: 'var(--text-secondary)' }}>
                    {criterion.strengths.map((str, i) => (
                      <li key={i} style={{ marginBottom: 4 }}>{str}</li>
                    ))}
                  </ul>
                </div>

                {/* Concerns */}
                <div style={{
                  background: 'rgba(245, 158, 11, 0.05)',
                  padding: 14,
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid rgba(245, 158, 11, 0.15)'
                }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fbbf24', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                    <AlertTriangle size={14} /> Design Smells & Concerns
                  </div>
                  <ul style={{ paddingLeft: 18, fontSize: '0.83rem', color: 'var(--text-secondary)' }}>
                    {criterion.concerns.map((con, i) => (
                      <li key={i} style={{ marginBottom: 4 }}>{con}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Actionable Suggestion */}
              {criterion.suggestions.length > 0 && (
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 10,
                  background: 'rgba(99, 102, 241, 0.06)',
                  padding: 12,
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid rgba(99, 102, 241, 0.2)'
                }}>
                  <Lightbulb size={16} color="var(--accent-primary)" style={{ flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#a5b4fc' }}>
                      Actionable Improvement Tip:{' '}
                    </span>
                    <span style={{ fontSize: '0.83rem', color: 'var(--text-secondary)' }}>
                      {criterion.suggestions.join(' ')}
                    </span>
                  </div>
                </div>
              )}

              {/* Evidence Quotes */}
              {criterion.evidence && criterion.evidence.length > 0 && (
                <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>Evidence identified:</span>
                  {criterion.evidence.map((ev, i) => (
                    <span
                      key={i}
                      style={{
                        fontSize: '0.72rem',
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid var(--border-subtle)',
                        padding: '2px 8px',
                        borderRadius: 4,
                        color: 'var(--accent-cyan)',
                        fontFamily: 'JetBrains Mono, monospace'
                      }}
                    >
                      {ev}
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
