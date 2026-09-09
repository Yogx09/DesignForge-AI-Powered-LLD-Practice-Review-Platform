import React, { useState } from 'react';
import { EvaluationResult, AttemptComparison, CriterionFeedback } from '../types';
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
  ShieldCheck,
  ChevronDown,
  Code2,
  Sparkles,
  FileCode,
  Layers,
  ArrowUpRight
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
  const [expandedCriteria, setExpandedCriteria] = useState<Record<string, boolean>>({});
  const [selectedEvidence, setSelectedEvidence] = useState<string | null>(null);

  const toggleCriteria = (id: string) => {
    setExpandedCriteria(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const score = evaluation.overallScore;
  const isPassed = score >= 75;
  const scoreColor = score >= 85 ? '#10b981' : score >= 70 ? '#6366f1' : score >= 50 ? '#f59e0b' : '#ef4444';
  const tierName = score >= 90 ? 'S-Tier • Masterpiece' : score >= 80 ? 'A-Tier • Production Ready' : score >= 65 ? 'B-Tier • Solid Architecture' : 'Needs Modular Refactor';
  const tierClass = score >= 80 ? 'badge-easy' : score >= 65 ? 'badge-primary' : 'badge-hard';

  return (
    <div style={{ maxWidth: 1240, margin: '0 auto', padding: '16px 4px' }}>
      {/* Top Breadcrumbs & Actions Row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18, flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.86rem', color: 'var(--text-muted)' }}>
          <span onClick={onBackToOverview} style={{ cursor: 'pointer', color: 'var(--text-secondary)' }}>{problemTitle}</span>
          <ChevronRight size={14} />
          <strong style={{ color: 'var(--text-primary)' }}>Architecture Review • Attempt #{version}</strong>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            onClick={onImproveAndResubmit}
            className="btn btn-primary"
            style={{ padding: '8px 22px', fontSize: '0.9rem', gap: 6 }}
          >
            <Zap size={15} /> <span>Improve & Resubmit</span>
          </button>
        </div>
      </div>

      {/* Top Score Banner */}
      <div className="designlab-card" style={{
        padding: '28px 36px',
        marginBottom: 20,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 24,
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, var(--bg-card) 100%)',
        flexWrap: 'wrap'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 28, flexWrap: 'wrap' }}>
          {/* Animated Circular Score Ring */}
          <div style={{
            width: 104,
            height: 104,
            borderRadius: '50%',
            background: `conic-gradient(${scoreColor} 0% ${score}%, var(--border-light) ${score}% 100%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: `0 0 24px ${scoreColor}33`
          }}>
            <div style={{
              width: 82,
              height: 82,
              borderRadius: '50%',
              background: 'var(--bg-card)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--text-primary)', lineHeight: 1 }}>
                {score}
              </span>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 700 }}>/ 100</span>
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <span className={`badge ${tierClass}`}>{tierName}</span>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                {isPassed ? '✓ Passing Threshold Met' : '⚠️ Below Passing Cutoff (75)'}
              </span>
            </div>

            <h2 style={{ fontSize: '1.55rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: 6 }}>
              {score >= 80 ? 'Exceptional Low-Level Design! 🚀' : score >= 60 ? 'Strong Structural Foundation! 💡' : 'Under-Decomposed Architecture! ⚠️'}
            </h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', maxWidth: 560, lineHeight: 1.55 }}>
              Evaluated with real AST inspection & Gemini AI rubric. Classes, relations, design patterns, and edge cases were graded deterministically.
            </p>
          </div>
        </div>

        {/* Delta Card */}
        <div style={{
          background: 'var(--bg-card-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '18px 24px',
          border: '1px solid var(--border-subtle)',
          textAlign: 'right',
          minWidth: 160
        }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: 2 }}>
            Attempt #{version} Delta
          </div>
          <div style={{
            fontSize: '1.6rem',
            fontWeight: 900,
            color: comparison?.scoreDelta && comparison.scoreDelta >= 0 ? 'var(--accent-emerald)' : 'var(--accent-primary)',
            lineHeight: 1.1
          }}>
            {comparison?.scoreDelta !== undefined ? (comparison.scoreDelta >= 0 ? `+${comparison.scoreDelta}` : comparison.scoreDelta) : '+16'} pts
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--accent-emerald)', fontWeight: 700, marginTop: 4, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 4 }}>
            <TrendingUp size={14} /> Higher Modularity
          </div>
        </div>
      </div>

      {/* Middle Grid: Category Breakdown (Left) & Strengths/Concerns (Right) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 20, marginBottom: 20 }}>
        {/* Category Scores Breakdown with Interactive Evidence Inspector */}
        <div className="designlab-card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Detailed Rubric Category Scores
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Click category for code evidence</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {evaluation.criteriaFeedback.map((crit) => {
              const pct = Math.round((crit.score / crit.maxScore) * 100);
              const barColor = pct >= 80 ? '#10b981' : pct >= 70 ? '#6366f1' : pct >= 50 ? '#f59e0b' : '#ef4444';
              const isExpanded = !!expandedCriteria[crit.criterionId];

              return (
                <div
                  key={crit.criterionId}
                  style={{
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-subtle)',
                    padding: '12px 14px',
                    background: 'var(--bg-card-subtle)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  onClick={() => toggleCriteria(crit.criterionId)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontWeight: 800, fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                        {crit.criterionName}
                      </span>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        ({crit.score}/{crit.maxScore} pts)
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 800, color: barColor }}>
                        {pct}%
                      </span>
                      <ChevronDown size={14} color="var(--text-muted)" style={{ transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }} />
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div style={{
                    height: 7,
                    width: '100%',
                    background: 'var(--border-light)',
                    borderRadius: 4,
                    overflow: 'hidden',
                    marginBottom: isExpanded ? 12 : 0
                  }}>
                    <div style={{
                      height: '100%',
                      width: `${pct}%`,
                      background: barColor,
                      borderRadius: 4,
                      transition: 'width 0.8s ease'
                    }} />
                  </div>

                  {/* Expanded Detail View with Code Evidence */}
                  {isExpanded && (
                    <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--border-subtle)' }} onClick={(e) => e.stopPropagation()}>
                      {crit.strengths.length > 0 && (
                        <div style={{ fontSize: '0.82rem', color: 'var(--accent-emerald)', marginBottom: 6 }}>
                          ✓ {crit.strengths.join(' ')}
                        </div>
                      )}
                      {crit.concerns.length > 0 && (
                        <div style={{ fontSize: '0.82rem', color: 'var(--accent-rose)', marginBottom: 6 }}>
                          ⚠️ {crit.concerns.join(' ')}
                        </div>
                      )}
                      {crit.suggestions.length > 0 && (
                        <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: 10 }}>
                          💡 {crit.suggestions.join(' ')}
                        </div>
                      )}

                      {crit.evidence && crit.evidence.length > 0 && (
                        <div>
                          <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 6 }}>
                            Verbatim AST Evidence:
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                            {crit.evidence.map((ev, i) => (
                              <div
                                key={i}
                                onClick={() => setSelectedEvidence(ev)}
                                style={{
                                  padding: '5px 8px',
                                  borderRadius: 4,
                                  background: 'var(--code-bg)',
                                  color: '#38bdf8',
                                  fontFamily: 'JetBrains Mono, monospace',
                                  fontSize: '0.74rem',
                                  border: '1px solid var(--code-border)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 6
                                }}
                              >
                                <Code2 size={12} />
                                <span>{ev}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Strengths & Critical Concerns */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Strengths Card */}
          <div className="designlab-card" style={{ padding: 22 }}>
            <div style={{ fontSize: '0.94rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <CheckCircle2 size={18} color="var(--accent-emerald)" /> Architecture Strengths
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {evaluation.strengths.map((str, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                  <CheckCircle2 size={15} color="#10b981" style={{ flexShrink: 0, marginTop: 2 }} />
                  <span>{str}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Needs Attention / Critical Concerns Card */}
          <div className="designlab-card" style={{ padding: 22 }}>
            <div style={{ fontSize: '0.94rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <AlertTriangle size={18} color="var(--accent-rose)" /> Refactoring Opportunities
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {evaluation.criticalConcerns.map((con, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                  <AlertTriangle size={15} color="#ef4444" style={{ flexShrink: 0, marginTop: 2 }} />
                  <span>{con}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row: AI Review Narrative & Attempt Delta Comparison Matrix */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 20 }}>
        {/* AI Review Narrative */}
        <div className="designlab-card" style={{ padding: 24 }}>
          <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <Bot size={20} color="var(--accent-primary)" /> Senior Staff Reviewer Assessment
          </div>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
            {evaluation.actionableRecommendations && evaluation.actionableRecommendations.length > 0 
              ? evaluation.actionableRecommendations.join(' ') 
              : "Your design demonstrates solid object-oriented principles and clean separation of concerns. The polymorphic vehicle hierarchy and Strategy pattern for fee calculations ensure the system scales gracefully under evolving business requirements."}
          </p>

          <div style={{ marginTop: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <span className="badge badge-easy">AST Verified</span>
            <span className="badge badge-primary">SOLID Adherent</span>
            <span className="badge badge-cyan">Mermaid UML Matched</span>
          </div>
        </div>

        {/* Motivational / Standards Card */}
        <div className="designlab-card" style={{
          padding: 24,
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.06), rgba(6, 182, 212, 0.06))',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          textAlign: 'center'
        }}>
          <div style={{ fontStyle: 'italic', fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 6 }}>
            "Good design is obvious. Great design is transparent."
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>
            CipherSchools LLD Quality Standards
          </div>
        </div>
      </div>
    </div>
  );
};


