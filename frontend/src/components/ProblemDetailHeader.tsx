import React, { useState } from 'react';
import { Problem } from '../types';
import { ChevronDown, ChevronUp, FileText, CheckSquare, AlertCircle, Layers, Award } from 'lucide-react';

interface ProblemDetailHeaderProps {
  problem: Problem;
}

export const ProblemDetailHeader: React.FC<ProblemDetailHeaderProps> = ({ problem }) => {
  const [expanded, setExpanded] = useState<boolean>(true);

  const badgeClass =
    problem.difficulty === 'Easy'
      ? 'badge-easy'
      : problem.difficulty === 'Medium'
      ? 'badge-medium'
      : 'badge-hard';

  return (
    <div className="glass-card" style={{ marginBottom: 24, overflow: 'hidden' }}>
      {/* Header Summary Row */}
      <div 
        onClick={() => setExpanded(!expanded)}
        style={{
          padding: '18px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          background: 'rgba(255, 255, 255, 0.02)',
          borderBottom: expanded ? '1px solid var(--border-subtle)' : 'none'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span className={`badge ${badgeClass}`}>{problem.difficulty}</span>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {problem.title}
            </h2>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {problem.category} • Estimated: {problem.timeEstimate}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', fontWeight: 600 }}>
            {expanded ? 'Collapse Details' : 'View Requirements & Rubric'}
          </span>
          {expanded ? <ChevronUp size={18} color="var(--accent-cyan)" /> : <ChevronDown size={18} color="var(--accent-cyan)" />}
        </div>
      </div>

      {/* Expanded Content Body */}
      {expanded && (
        <div style={{ padding: '24px', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 24 }}>
          {/* Left Column: Description, Functional & Non-Functional Requirements */}
          <div>
            <div style={{ marginBottom: 18 }}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 6 }}>
                Problem Overview
              </h4>
              <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                {problem.description}
              </p>
            </div>

            {/* Functional Requirements */}
            <div style={{ marginBottom: 18 }}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#38bdf8', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                <CheckSquare size={15} /> Functional Requirements
              </h4>
              <ul style={{ paddingLeft: 20, fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                {problem.functionalRequirements.map((req, i) => (
                  <li key={i} style={{ marginBottom: 6 }}>{req}</li>
                ))}
              </ul>
            </div>

            {/* Constraints & Non-Functional */}
            <div>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fbbf24', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                <AlertCircle size={15} /> Key Constraints & Non-Functional Goals
              </h4>
              <ul style={{ paddingLeft: 20, fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                {problem.constraints.map((c, i) => (
                  <li key={i} style={{ marginBottom: 4 }}>{c}</li>
                ))}
                {problem.nonFunctionalRequirements.map((nf, i) => (
                  <li key={i} style={{ marginBottom: 4, color: '#94a3b8' }}>{nf}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Column: Expected Entities & Evaluation Rubric */}
          <div style={{ background: 'rgba(15, 23, 42, 0.5)', padding: 18, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            {/* Expected Core Entities */}
            <div style={{ marginBottom: 20 }}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#a5b4fc', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                <Layers size={15} /> Expected Domain Entities
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {problem.expectedEntities.map((ent, i) => (
                  <span
                    key={i}
                    style={{
                      fontSize: '0.78rem',
                      background: 'rgba(99, 102, 241, 0.12)',
                      border: '1px solid rgba(99, 102, 241, 0.25)',
                      padding: '3px 8px',
                      borderRadius: 6,
                      color: '#c7d2fe',
                      fontFamily: 'JetBrains Mono, monospace'
                    }}
                  >
                    {ent}
                  </span>
                ))}
              </div>
            </div>

            {/* Evaluation Rubric Breakdown */}
            <div>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#34d399', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                <Award size={15} /> Evaluation Rubric Dimensions (100 pts)
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {problem.rubric.map((r) => (
                  <div
                    key={r.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '0.8rem',
                      padding: '6px 10px',
                      background: 'rgba(255, 255, 255, 0.03)',
                      borderRadius: 6,
                      border: '1px solid var(--border-subtle)'
                    }}
                  >
                    <div>
                      <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{r.name}</span>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{r.description.slice(0, 65)}...</div>
                    </div>
                    <span style={{ fontWeight: 700, color: 'var(--accent-emerald)', marginLeft: 10 }}>
                      {Math.round(r.weight * 100)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
