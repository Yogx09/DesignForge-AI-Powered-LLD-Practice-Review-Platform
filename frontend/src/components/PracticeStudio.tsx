import React, { useState, useEffect } from 'react';
import { Problem, SubmissionContent } from '../types';
import { MermaidViewer } from './MermaidViewer';
import {
  Code2,
  GitBranch,
  FileEdit,
  Sparkles,
  Send,
  RotateCcw,
  BookTemplate,
  Zap,
  AlertTriangle
} from 'lucide-react';

interface PracticeStudioProps {
  problem: Problem;
  submissionContent: SubmissionContent;
  onChangeContent: (updated: Partial<SubmissionContent>) => void;
  onSubmit: () => void;
  isEvaluating: boolean;
  onReset: () => void;
  onLoadTemplate: () => void;
  onLoadSampleSolution?: () => void;
  onLoadFlawedSolution?: () => void;
}

type StudioTab = 'assumptions' | 'diagram' | 'code' | 'rationale';

export const PracticeStudio: React.FC<PracticeStudioProps> = ({
  problem,
  submissionContent,
  onChangeContent,
  onSubmit,
  isEvaluating,
  onReset,
  onLoadTemplate,
  onLoadSampleSolution,
  onLoadFlawedSolution
}) => {
  const [activeTab, setActiveTab] = useState<StudioTab>('code');

  // Keyboard shortcut Ctrl/Cmd + Enter to submit
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        onSubmit();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onSubmit]);

  const lineCount = (submissionContent.code || '').split('\n').length;
  const charCount = (submissionContent.code || '').length;

  return (
    <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Top Toolbar */}
      <div style={{
        padding: '10px 18px',
        background: 'rgba(12, 16, 25, 0.95)',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 12
      }}>
        {/* Tab Switcher */}
        <div style={{ display: 'flex', gap: 4 }}>
          {[
            { id: 'assumptions', label: '1. Assumptions', icon: FileEdit },
            { id: 'diagram', label: '2. Class Diagram', icon: GitBranch },
            { id: 'code', label: '3. Code Implementation', icon: Code2 },
            { id: 'rationale', label: '4. Design Rationale', icon: Sparkles }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as StudioTab)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-sm)',
                  border: isActive ? '1px solid var(--accent-primary)' : '1px solid transparent',
                  background: isActive ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                  color: isActive ? '#f8fafc' : 'var(--text-secondary)',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.82rem',
                  cursor: 'pointer'
                }}
              >
                <Icon size={14} color={isActive ? 'var(--accent-primary)' : 'var(--text-muted)'} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Action Controls & Instant Reviewer Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          {onLoadSampleSolution && (
            <button
              onClick={onLoadSampleSolution}
              className="btn btn-outline-cyan"
              title="Pre-populate Gold Standard Parking Lot Solution"
              style={{ padding: '5px 10px', fontSize: '0.78rem' }}
            >
              <Zap size={13} /> Try Sample Solution
            </button>
          )}

          {onLoadFlawedSolution && (
            <button
              onClick={onLoadFlawedSolution}
              className="btn btn-secondary"
              title="Populate an anti-pattern solution to test feedback sensitivity"
              style={{ padding: '5px 10px', fontSize: '0.78rem', color: '#fbbf24' }}
            >
              <AlertTriangle size={13} /> Try Flawed Solution
            </button>
          )}

          <button
            onClick={onLoadTemplate}
            className="btn btn-secondary"
            title="Load starter template boilerplate"
            style={{ padding: '5px 10px', fontSize: '0.78rem' }}
          >
            <BookTemplate size={13} /> Starter Boilerplate
          </button>

          <button
            onClick={onReset}
            className="btn btn-secondary"
            title="Clear workspace"
            style={{ padding: '5px 8px', fontSize: '0.78rem', color: '#fb7185' }}
          >
            <RotateCcw size={13} />
          </button>

          <button
            onClick={onSubmit}
            disabled={isEvaluating}
            className="btn btn-success"
            title="Submit and run evaluation (Ctrl + Enter)"
            style={{ padding: '6px 16px', fontSize: '0.85rem' }}
          >
            <Send size={14} />
            <span>{isEvaluating ? 'Evaluating...' : 'Submit (Ctrl+↵)'}</span>
          </button>
        </div>
      </div>

      {/* Editor Body */}
      <div style={{ padding: 18, minHeight: 460 }}>
        {/* TAB 1: Assumptions */}
        {activeTab === 'assumptions' && (
          <div>
            <div style={{ marginBottom: 8 }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                System Boundary & Assumptions
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                State explicit capacity, gate configurations, scale, and currency/time granularity assumptions.
              </p>
            </div>
            <textarea
              className="code-font"
              value={submissionContent.assumptions}
              onChange={(e) => onChangeContent({ assumptions: e.target.value })}
              placeholder={`Example:\n- Single entry and exit gate per floor.\n- Spot allocation follows "Nearest to Entrance" strategy.\n- Mutex locks protect state transitions during peak entries.`}
              style={{
                width: '100%',
                height: 380,
                background: '#07090e',
                color: '#e2e8f0',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-sm)',
                padding: 14,
                fontSize: '0.88rem',
                lineHeight: 1.6,
                outline: 'none',
                resize: 'vertical'
              }}
            />
          </div>
        )}

        {/* TAB 2: Class Architecture Diagram (Split View) */}
        {activeTab === 'diagram' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 14 }}>
            <div>
              <div style={{ marginBottom: 8 }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Mermaid Class Diagram
                </h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Use <code>*--</code> (Composition), <code>o--</code> (Aggregation), <code>..|&gt;</code> (Interface), <code>--|&gt;</code> (Inheritance).
                </p>
              </div>
              <textarea
                className="code-font"
                value={submissionContent.diagramMermaid}
                onChange={(e) => onChangeContent({ diagramMermaid: e.target.value })}
                placeholder={`classDiagram\n    class ParkingLot {\n        -List~ParkingFloor~ floors\n        +parkVehicle(Vehicle v)\n    }\n    ParkingLot *-- ParkingFloor`}
                style={{
                  width: '100%',
                  height: 380,
                  background: '#07090e',
                  color: '#38bdf8',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-sm)',
                  padding: 14,
                  fontSize: '0.84rem',
                  lineHeight: 1.5,
                  outline: 'none',
                  resize: 'vertical'
                }}
              />
            </div>

            <div>
              <div style={{ marginBottom: 8 }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>
                  Live Visual Render
                </h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Interactive dynamic diagram preview.
                </p>
              </div>
              <div style={{ height: 380, overflowY: 'auto' }}>
                <MermaidViewer chart={submissionContent.diagramMermaid} />
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Code Implementation */}
        {activeTab === 'code' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  OOP Implementation
                </h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Define clean interfaces, abstract classes, entities, and coordinators.
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace' }}>
                  {lineCount} lines • {charCount} chars
                </span>
                <select
                  value={submissionContent.language}
                  onChange={(e) => onChangeContent({ language: e.target.value as any })}
                  style={{
                    background: 'var(--bg-tertiary)',
                    color: 'var(--accent-cyan)',
                    border: '1px solid var(--border-light)',
                    padding: '3px 8px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    outline: 'none'
                  }}
                >
                  <option value="typescript">TypeScript</option>
                  <option value="java">Java</option>
                  <option value="python">Python</option>
                  <option value="cpp">C++</option>
                </select>
              </div>
            </div>

            <textarea
              className="code-font"
              value={submissionContent.code}
              onChange={(e) => onChangeContent({ code: e.target.value })}
              placeholder={`// Write your complete LLD code here...\nexport abstract class Vehicle {\n  constructor(public readonly licensePlate: string) {}\n}`}
              style={{
                width: '100%',
                height: 420,
                background: '#06080d',
                color: '#a5f3fc',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-sm)',
                padding: 14,
                fontSize: '0.86rem',
                lineHeight: 1.5,
                outline: 'none',
                resize: 'vertical',
                tabSize: 2
              }}
            />
          </div>
        )}

        {/* TAB 4: Design Rationale */}
        {activeTab === 'rationale' && (
          <div>
            <div style={{ marginBottom: 8 }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Design Patterns & Trade-off Defense
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Explain how your design satisfies the Open-Closed Principle and handles concurrency/scale.
              </p>
            </div>
            <textarea
              className="code-font"
              value={submissionContent.designRationale}
              onChange={(e) => onChangeContent({ designRationale: e.target.value })}
              placeholder={`1. Strategy Pattern: IParkingStrategy and IFeeStrategy decouple algorithmic execution.\n2. Open-Closed Principle: New vehicle or spot types can be added without changing ParkingLot core.\n3. Concurrency: State changes to parking spots are protected by mutex locks.`}
              style={{
                width: '100%',
                height: 380,
                background: '#07090e',
                color: '#e2e8f0',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-sm)',
                padding: 14,
                fontSize: '0.88rem',
                lineHeight: 1.6,
                outline: 'none',
                resize: 'vertical'
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};
