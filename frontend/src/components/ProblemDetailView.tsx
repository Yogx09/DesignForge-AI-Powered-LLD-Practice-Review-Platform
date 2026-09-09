import React, { useState } from 'react';
import { Problem } from '../types';
import {
  Bookmark,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Lightbulb,
  AlertCircle,
  FileCode,
  Layers,
  ChevronRight
} from 'lucide-react';

interface ProblemDetailViewProps {
  problem: Problem;
  onStartPractice: () => void;
  onBackToProblems: () => void;
}

type TabKey = 'overview' | 'requirements' | 'constraints' | 'examples' | 'hints';

export const ProblemDetailView: React.FC<ProblemDetailViewProps> = ({
  problem,
  onStartPractice,
  onBackToProblems
}) => {
  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 8px' }}>
      {/* Breadcrumbs & Actions Row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.88rem', color: 'var(--text-muted)' }}>
          <span onClick={onBackToProblems} style={{ cursor: 'pointer', color: 'var(--text-secondary)' }}>Problems</span>
          <ChevronRight size={14} />
          <strong style={{ color: 'var(--text-primary)' }}>{problem.title}</strong>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            onClick={() => setIsBookmarked(!isBookmarked)}
            className="btn btn-secondary"
            style={{ padding: '8px 12px' }}
          >
            <Bookmark size={16} fill={isBookmarked ? 'var(--accent-primary)' : 'none'} color={isBookmarked ? 'var(--accent-primary)' : 'var(--text-secondary)'} />
          </button>
          <button
            onClick={onStartPractice}
            className="btn btn-primary"
            style={{ padding: '8px 20px', fontSize: '0.9rem' }}
          >
            <span>Start Practice</span> <ArrowRight size={15} />
          </button>
        </div>
      </div>

      {/* Main Title Banner */}
      <div className="designlab-card" style={{ padding: '24px 28px', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 18 }}>
          <div style={{
            width: 48,
            height: 48,
            borderRadius: 14,
            background: 'var(--accent-gradient)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.4rem',
            fontWeight: 800,
            flexShrink: 0
          }}>
            {problem.title.charAt(0)}
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 6 }}>
              <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                {problem.title}
              </h1>
              <span className="badge badge-medium">{problem.difficulty}</span>
              <span className="badge badge-primary">{problem.category}</span>
              <span style={{ fontSize: '0.75rem', background: 'var(--bg-card-subtle)', padding: '3px 8px', borderRadius: 6, color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)' }}>
                OOP
              </span>
              <span style={{ fontSize: '0.75rem', background: 'var(--bg-card-subtle)', padding: '3px 8px', borderRadius: 6, color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)' }}>
                Real-world
              </span>
            </div>

            <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              {problem.description}
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{
          display: 'flex',
          gap: 8,
          borderTop: '1px solid var(--border-subtle)',
          marginTop: 20,
          paddingTop: 16
        }}>
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'requirements', label: 'Requirements' },
            { id: 'constraints', label: 'Constraints' },
            { id: 'examples', label: 'Examples' },
            { id: 'hints', label: 'Hints' }
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabKey)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-xs)',
                  border: 'none',
                  background: isActive ? 'var(--accent-soft)' : 'transparent',
                  color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
                  fontWeight: isActive ? 700 : 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content Body (2 Columns matching template) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 20 }}>
        {/* Left Column */}
        <div className="designlab-card" style={{ padding: 24 }}>
          {activeTab === 'overview' && (
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 12 }}>
                🎯 Problem Statement
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 18 }}>
                Design a scalable system for a large commercial complex. The system should support multiple floors, different vehicle types (car, bike, truck), parking spot allocation, entry/exit management and flexible pricing strategies.
              </p>

              {/* Quote Card */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.06), rgba(6, 182, 212, 0.04))',
                borderLeft: '4px solid var(--accent-primary)',
                padding: '14px 18px',
                borderRadius: '0 var(--radius-sm) var(--radius-sm) 0',
                marginBottom: 24
              }}>
                <div style={{ fontStyle: 'italic', fontSize: '0.88rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                  "The goal is not just to make it work, but to make it extendable."
                </div>
              </div>

              {/* Key Topics Tags */}
              <div>
                <h4 style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 10 }}>
                  Key Topics
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {['OOP', 'SOLID Principles', 'Design Patterns', 'Scalability', 'Extensibility', 'System Design'].map((topic, i) => (
                    <span
                      key={i}
                      style={{
                        padding: '5px 12px',
                        background: 'var(--bg-card-subtle)',
                        border: '1px solid var(--border-light)',
                        borderRadius: 9999,
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        color: 'var(--text-secondary)'
                      }}
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'requirements' && (
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 14 }}>
                Functional Requirements
              </h3>
              <ul style={{ paddingLeft: 20, fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                {problem.functionalRequirements.map((r, i) => (
                  <li key={i} style={{ marginBottom: 8 }}>{r}</li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === 'constraints' && (
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 14 }}>
                System Constraints
              </h3>
              <ul style={{ paddingLeft: 20, fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                {problem.constraints.map((c, i) => (
                  <li key={i} style={{ marginBottom: 8 }}>{c}</li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === 'examples' && (
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 14 }}>
                Sample Interaction Flow
              </h3>
              <div style={{ background: 'var(--bg-card-subtle)', padding: 16, borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                1. Vehicle "KA-01-HH-1234" (CAR) arrives at Entry Gate 1<br />
                2. System assigns Floor 1, Spot C-14 (Compact)<br />
                3. Ticket generated with Timestamp 17:00:00<br />
                4. Vehicle exits at 19:30:00 (2.5 hrs)<br />
                5. Fee calculated: 3 hrs * $20/hr = $60.00
              </div>
            </div>
          )}

          {activeTab === 'hints' && (
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 14 }}>
                Architectural Hints
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {problem.referenceKeyConcepts.map((k, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
                    <Lightbulb size={16} color="var(--accent-primary)" />
                    <span>{k}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Visual Art & Real-World Relevance Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Parking Visual Graphic Card */}
          <div className="designlab-card" style={{
            height: 180,
            borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            border: '1px solid rgba(56, 189, 248, 0.2)',
            padding: 24,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: 16,
              right: 16,
              width: 36,
              height: 36,
              borderRadius: 8,
              background: '#0284c7',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800
            }}>
              P
            </div>
            <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#f8fafc', marginBottom: 4 }}>
              More than just parking.
            </div>
            <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
              A system of possibilities.
            </div>
          </div>

          {/* Real-World Relevance Card */}
          <div className="designlab-card" style={{ padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, fontSize: '0.88rem', color: '#d97706', marginBottom: 8 }}>
              <Lightbulb size={16} /> Real-World Relevance
            </div>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Similar concepts are used in malls, airports, corporate offices, and smart city transit hubs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
