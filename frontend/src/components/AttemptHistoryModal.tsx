import React, { useState } from 'react';
import { Attempt, Submission, AttemptComparison } from '../types';
import {
  X,
  History,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  Award,
  ArrowRight,
  Code2,
  Calendar,
  GitCompare
} from 'lucide-react';
import { compareAttempts } from '../api';

interface AttemptHistoryModalProps {
  attempt: Attempt;
  isOpen: boolean;
  onClose: () => void;
  onSelectSubmission: (submission: Submission) => void;
}

export const AttemptHistoryModal: React.FC<AttemptHistoryModalProps> = ({
  attempt,
  isOpen,
  onClose,
  onSelectSubmission
}) => {
  const [selectedV1, setSelectedV1] = useState<number>(1);
  const [selectedV2, setSelectedV2] = useState<number>(attempt.submissions.length);
  const [comparison, setComparison] = useState<AttemptComparison | null>(null);
  const [loadingComparison, setLoadingComparison] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleRunComparison = async () => {
    if (selectedV1 === selectedV2) return;
    try {
      setLoadingComparison(true);
      const res = await compareAttempts(attempt.id, selectedV1, selectedV2);
      setComparison(res);
    } catch (err: any) {
      console.error('Failed to compare attempts:', err);
    } finally {
      setLoadingComparison(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(5, 8, 15, 0.85)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 90,
      padding: 24
    }}>
      <div className="glass-card" style={{
        maxWidth: 900,
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        padding: 28,
        border: '1px solid var(--border-light)'
      }}>
        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <History size={22} color="var(--accent-cyan)" />
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Attempt Progression & Learning History ({attempt.submissions.length} Submissions)
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: 4
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Submissions List Timeline */}
        <div style={{ marginBottom: 28 }}>
          <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 12 }}>
            Submission Timeline
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {attempt.submissions.map((sub) => {
              const evalRes = sub.evaluation;
              return (
                <div
                  key={sub.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 18px',
                    background: 'rgba(15, 23, 42, 0.6)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <span className="badge badge-primary">Version #{sub.version}</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Calendar size={12} /> {new Date(sub.createdAt).toLocaleTimeString()}
                    </span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      Language: <strong>{sub.content.language}</strong>
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    {evalRes && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{
                          fontWeight: 800,
                          fontSize: '1.1rem',
                          color: evalRes.overallScore >= 80 ? '#10b981' : evalRes.overallScore >= 60 ? '#f59e0b' : '#f43f5e'
                        }}>
                          {evalRes.overallScore}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>/ 100</span>
                      </div>
                    )}

                    <button
                      onClick={() => {
                        onSelectSubmission(sub);
                        onClose();
                      }}
                      className="btn btn-secondary"
                      style={{ padding: '4px 12px', fontSize: '0.8rem' }}
                    >
                      Load into Studio
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Side-by-Side Version Comparison Tool */}
        {attempt.submissions.length >= 2 && (
          <div style={{
            background: 'rgba(99, 102, 241, 0.05)',
            border: '1px solid rgba(99, 102, 241, 0.25)',
            borderRadius: 'var(--radius-md)',
            padding: 20
          }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#a5b4fc', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <GitCompare size={16} /> Compare Score Delta Between Attempts
            </h4>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 16 }}>
              <span>Compare</span>
              <select
                value={selectedV1}
                onChange={(e) => setSelectedV1(parseInt(e.target.value, 10))}
                style={{
                  background: 'var(--bg-tertiary)',
                  color: '#fff',
                  border: '1px solid var(--border-light)',
                  padding: '6px 12px',
                  borderRadius: 6
                }}
              >
                {attempt.submissions.map(s => (
                  <option key={s.version} value={s.version}>Attempt #{s.version}</option>
                ))}
              </select>

              <span>with</span>

              <select
                value={selectedV2}
                onChange={(e) => setSelectedV2(parseInt(e.target.value, 10))}
                style={{
                  background: 'var(--bg-tertiary)',
                  color: '#fff',
                  border: '1px solid var(--border-light)',
                  padding: '6px 12px',
                  borderRadius: 6
                }}
              >
                {attempt.submissions.map(s => (
                  <option key={s.version} value={s.version}>Attempt #{s.version}</option>
                ))}
              </select>

              <button
                onClick={handleRunComparison}
                disabled={loadingComparison || selectedV1 === selectedV2}
                className="btn btn-primary"
                style={{ padding: '6px 16px', fontSize: '0.85rem' }}
              >
                {loadingComparison ? 'Comparing...' : 'Compute Improvement Delta'}
              </button>
            </div>

            {/* Comparison Results Card */}
            {comparison && (
              <div style={{
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-md)',
                padding: 16
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                    Summary of Progress:
                  </div>
                  <div style={{
                    fontWeight: 800,
                    fontSize: '1.2rem',
                    color: comparison.scoreDelta >= 0 ? '#10b981' : '#f43f5e'
                  }}>
                    {comparison.scoreDelta >= 0 ? `+${comparison.scoreDelta}` : comparison.scoreDelta} PTS OVERALL
                  </div>
                </div>

                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: 16 }}>
                  {comparison.summary}
                </p>

                {/* Criterion Deltas */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 10 }}>
                  {comparison.criteriaScoreDeltas.map(cd => (
                    <div
                      key={cd.criterionId}
                      style={{
                        padding: '8px 12px',
                        background: 'rgba(255, 255, 255, 0.03)',
                        borderRadius: 6,
                        border: '1px solid var(--border-subtle)'
                      }}
                    >
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{cd.criterionName}</div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{cd.previousScore} &rarr; {cd.currentScore}</span>
                        <span style={{
                          fontWeight: 700,
                          fontSize: '0.85rem',
                          color: cd.delta >= 0 ? '#10b981' : '#f43f5e'
                        }}>
                          {cd.delta >= 0 ? `+${cd.delta}` : cd.delta}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
