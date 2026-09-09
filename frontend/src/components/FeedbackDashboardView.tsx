import React from 'react';
import { EvaluationResult, AttemptComparison } from '../types';
import {
  Award,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Share2,
  Zap,
  TrendingUp,
  Bot,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

interface FeedbackDashboardViewProps {
  evaluation: EvaluationResult;
  comparison?: AttemptComparison;
  version: number;
  problemTitle: string;
  onImproveAndResubmit: () => void;
  onBackToOverview: () => void;
}

export const FeedbackDashboardView: React.FC<FeedbackDashboardViewProps> = ({
  evaluation,
  comparison,
  version,
  problemTitle,
  onImproveAndResubmit,
  onBackToOverview
}) => {
  const score = evaluation.overallScore;
  const scoreColor = score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444';

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 8px' }}>
      {/* Top Breadcrumbs & Actions Row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.88rem', color: 'var(--text-muted)' }}>
          <span onClick={onBackToOverview} style={{ cursor: 'pointer', color: 'var(--text-secondary)' }}>{problemTitle}</span>
          <ChevronRight size={14} />
          <strong style={{ color: 'var(--text-primary)' }}>Attempt #{version}</strong>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button className="btn btn-secondary" style={{ padding: '8px 14px' }}>
            <Share2 size={15} /> Share
          </button>
          <button
            onClick={onImproveAndResubmit}
            className="btn btn-primary"
            style={{ padding: '8px 20px', fontSize: '0.9rem' }}
          >
            <Zap size={15} /> Improve & Resubmit
          </button>
        </div>
      </div>

      {/* Top Score Banner (Matching Screen 4 in template) */}
      <div className="designlab-card" style={{
        padding: '24px 32px',
        marginBottom: 20,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 24,
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.04) 0%, rgba(255, 255, 255, 0.95) 100%)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          {/* Circular Score Ring */}
          <div style={{
            width: 96,
            height: 96,
            borderRadius: '50%',
            background: `conic-gradient(${scoreColor} 0% ${score}%, #e2e8f0 ${score}% 100%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
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
              <span style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>
                {score}
              </span>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 600 }}>/ 100</span>
            </div>
          </div>

          <div>
            <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 6 }}>
              {score >= 80 ? 'Strong submission! 🎉' : score >= 60 ? 'Good foundational design! 💡' : 'Under-decomposed structure! ⚠️'}
            </h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', maxWidth: 520, lineHeight: 1.5 }}>
              Your design shows good understanding of core concepts with room for improvement in extensibility and edge cases.
            </p>
          </div>
        </div>

        {/* Improvement Potential Card */}
        <div style={{
          background: 'rgba(16, 185, 129, 0.08)',
          borderRadius: 'var(--radius-md)',
          padding: '16px 20px',
          border: '1px solid rgba(16, 185, 129, 0.25)',
          textAlign: 'right'
        }}>
          <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#059669', lineHeight: 1 }}>
            +{comparison?.scoreDelta ? Math.abs(comparison.scoreDelta) : 14}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 700, marginTop: 4 }}>
            Improvement potential
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
            <TrendingUp size={24} color="#10b981" />
          </div>
        </div>
      </div>

      {/* Middle Section: Category Scores (Left) & Strengths/Needs Attention (Right) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 20, marginBottom: 20 }}>
        {/* Category Scores Breakdown */}
        <div className="designlab-card" style={{ padding: 24 }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 18 }}>
            Category Scores
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {evaluation.criteriaFeedback.map((crit) => {
              const pct = (crit.score / crit.maxScore) * 100;
              const barColor = pct >= 80 ? '#10b981' : pct >= 70 ? '#f59e0b' : '#ef4444';

              return (
                <div key={crit.criterionId}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {crit.criterionName}
                    </span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                      {Math.round(pct)}%
                    </span>
                  </div>

                  <div style={{
                    height: 8,
                    width: '100%',
                    background: 'var(--bg-card-subtle)',
                    borderRadius: 4,
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      height: '100%',
                      width: `${pct}%`,
                      background: barColor,
                      borderRadius: 4,
                      transition: 'width 0.8s ease'
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Strengths & Needs Attention Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Strengths Card */}
          <div className="designlab-card" style={{ padding: 20 }}>
            <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <CheckCircle2 size={16} color="var(--accent-emerald)" /> Strengths
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {evaluation.strengths.map((str, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  <CheckCircle2 size={14} color="#10b981" style={{ flexShrink: 0, marginTop: 2 }} />
                  <span>{str}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Needs Attention Card */}
          <div className="designlab-card" style={{ padding: 20 }}>
            <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <AlertTriangle size={16} color="var(--accent-rose)" /> Needs Attention
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {evaluation.criticalConcerns.map((con, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  <AlertTriangle size={14} color="#ef4444" style={{ flexShrink: 0, marginTop: 2 }} />
                  <span>{con}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row: AI Review Summary & Inspirational Quote Card */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 20 }}>
        {/* AI Review Summary */}
        <div className="designlab-card" style={{ padding: 20 }}>
          <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <Bot size={18} color="var(--accent-primary)" /> AI Review Summary
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Your design demonstrates solid object-oriented principles and a good understanding of system design concepts. Focus on improving extensibility and handling more edge cases to make it production-ready.
          </p>
        </div>

        {/* Inspirational Quote Card */}
        <div className="designlab-card" style={{
          padding: 20,
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05), rgba(6, 182, 212, 0.05))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center'
        }}>
          <div>
            <div style={{ fontStyle: 'italic', fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
              "Good design is obvious. Great design is transparent."
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              DesignLab Architectural Standards
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
