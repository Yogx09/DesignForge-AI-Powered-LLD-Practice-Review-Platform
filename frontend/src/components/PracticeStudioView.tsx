import React, { useState, useEffect } from 'react';
import { Problem, SubmissionContent } from '../types';
import { MermaidViewer } from './MermaidViewer';
import {
  Code2,
  GitBranch,
  FileEdit,
  Play,
  Send,
  RotateCcw,
  CheckCircle2,
  Circle,
  Lightbulb,
  Plus,
  Zap,
  AlertTriangle,
  ChevronRight
} from 'lucide-react';

interface PracticeStudioViewProps {
  problem: Problem;
  submissionContent: SubmissionContent;
  onChangeContent: (updated: Partial<SubmissionContent>) => void;
  onSubmit: () => void;
  isEvaluating: boolean;
  onReset: () => void;
  onBackToOverview: () => void;
  onLoadSampleSolution?: () => void;
  onLoadFlawedSolution?: () => void;
}

type CenterTab = 'code' | 'diagram' | 'notes';

export const PracticeStudioView: React.FC<PracticeStudioViewProps> = ({
  problem,
  submissionContent,
  onChangeContent,
  onSubmit,
  isEvaluating,
  onReset,
  onBackToOverview,
  onLoadSampleSolution,
  onLoadFlawedSolution
}) => {
  const [centerTab, setCenterTab] = useState<CenterTab>('code');
  const [completedReqs, setCompletedReqs] = useState<Record<number, boolean>>({ 0: true, 1: true });
  const [completedChecklist, setCompletedChecklist] = useState<Record<number, boolean>>({ 0: true, 1: true, 2: true });
  const [assumptionsList, setAssumptionsList] = useState<string[]>([]);

  useEffect(() => {
    if (submissionContent.assumptions) {
      const lines = submissionContent.assumptions
        .split('\n')
        .map(l => l.replace(/^[-*•\d.]\s*/, '').trim())
        .filter(Boolean);
      setAssumptionsList(lines.length > 0 ? lines : ['Parking lot has multiple floors.', 'Vehicle types: Car, Bike, Truck.', 'Assume single entry/exit for simplicity.']);
    } else {
      setAssumptionsList(['Parking lot has multiple floors.', 'Vehicle types: Car, Bike, Truck.', 'Assume single entry/exit for simplicity.']);
    }
  }, [submissionContent.assumptions]);

  const toggleReq = (idx: number) => {
    setCompletedReqs(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const toggleChecklist = (idx: number) => {
    setCompletedChecklist(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleAddAssumption = () => {
    const newAssump = `New assumption ${assumptionsList.length + 1}`;
    const updated = [...assumptionsList, newAssump];
    setAssumptionsList(updated);
    onChangeContent({ assumptions: updated.map(a => '- ' + a).join('\n') });
  };

  return (
    <div style={{ padding: '16px 8px', maxWidth: 1400, margin: '0 auto' }}>
      {/* Top Header Row */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
        padding: '0 4px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.88rem', color: 'var(--text-muted)' }}>
          <span onClick={onBackToOverview} style={{ cursor: 'pointer', color: 'var(--text-secondary)' }}>{problem.title}</span>
          <ChevronRight size={14} />
          <strong style={{ color: 'var(--text-primary)' }}>Practice Workspace</strong>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {onLoadSampleSolution && (
            <button
              onClick={onLoadSampleSolution}
              className="btn btn-outline-primary"
              style={{ padding: '5px 12px', fontSize: '0.78rem' }}
            >
              <Zap size={13} /> Try Sample Solution
            </button>
          )}

          {onLoadFlawedSolution && (
            <button
              onClick={onLoadFlawedSolution}
              className="btn btn-secondary"
              style={{ padding: '5px 10px', fontSize: '0.78rem', color: '#fbbf24' }}
            >
              <AlertTriangle size={13} /> Try Flawed
            </button>
          )}

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 5,
            fontSize: '0.78rem',
            color: 'var(--accent-emerald)',
            fontWeight: 600,
            background: 'var(--accent-emerald-soft)',
            padding: '4px 10px',
            borderRadius: 9999
          }}>
            <CheckCircle2 size={13} /> Auto-save on
          </div>

          <button
            onClick={onReset}
            className="btn btn-secondary"
            style={{ padding: '5px 10px', fontSize: '0.78rem' }}
          >
            <RotateCcw size={13} /> Reset
          </button>
        </div>
      </div>

      {/* 3-Column Workspace (Matching Screen 3 in template) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '280px 1fr 340px',
        gap: 16,
        alignItems: 'start'
      }}>
        {/* LEFT COLUMN: Requirements & Assumptions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Requirements Checklist */}
          <div className="designlab-card" style={{ padding: 18 }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
              <CheckCircle2 size={16} color="var(--accent-primary)" /> Requirements
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[
                'Support multiple floors',
                'Different vehicle types',
                'Parking spot allocation',
                'Entry/exit management',
                'Pricing strategies'
              ].map((req, idx) => {
                const isChecked = !!completedReqs[idx];
                return (
                  <div
                    key={idx}
                    onClick={() => toggleReq(idx)}
                    className={`check-item ${isChecked ? 'checked' : ''}`}
                  >
                    {isChecked ? <CheckCircle2 size={15} color="var(--accent-emerald)" /> : <Circle size={15} color="var(--text-muted)" />}
                    <span style={{ fontSize: '0.8rem', color: isChecked ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                      {req}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Assumptions */}
          <div className="designlab-card" style={{ padding: 18 }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
              <FileEdit size={16} color="var(--accent-cyan)" /> Assumptions
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
              {assumptionsList.map((item, idx) => (
                <div key={idx} style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                  <strong style={{ color: 'var(--text-primary)' }}>{idx + 1}.</strong> {item}
                </div>
              ))}
            </div>

            <button
              onClick={handleAddAssumption}
              className="btn btn-secondary"
              style={{ width: '100%', padding: '6px 12px', fontSize: '0.78rem' }}
            >
              <Plus size={13} /> Add Assumption
            </button>
          </div>

          {/* Tip Card */}
          <div className="designlab-card" style={{ padding: 14, background: 'rgba(99, 102, 241, 0.04)', border: '1px solid var(--accent-soft-border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', fontWeight: 800, color: 'var(--accent-primary)', marginBottom: 4 }}>
              <Lightbulb size={14} /> Tip
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
              Write clear assumptions. It shows structured thinking in LLD interviews.
            </div>
          </div>
        </div>

        {/* CENTER COLUMN: Code / Diagram / Notes Editor */}
        <div className="designlab-card" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {/* Editor Header */}
          <div style={{
            padding: '10px 16px',
            background: 'var(--bg-card-subtle)',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            {/* Center Tabs */}
            <div style={{ display: 'flex', gap: 4 }}>
              {[
                { id: 'code', label: 'Code', icon: Code2 },
                { id: 'diagram', label: 'Class Diagram', icon: GitBranch },
                { id: 'notes', label: 'Notes', icon: FileEdit }
              ].map((tab) => {
                const isActive = centerTab === tab.id;
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setCenterTab(tab.id as CenterTab)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      padding: '5px 12px',
                      borderRadius: 'var(--radius-xs)',
                      background: isActive ? 'var(--accent-soft)' : 'transparent',
                      border: 'none',
                      color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
                      fontWeight: isActive ? 700 : 500,
                      fontSize: '0.8rem',
                      cursor: 'pointer'
                    }}
                  >
                    <Icon size={14} color={isActive ? 'var(--accent-primary)' : 'var(--text-muted)'} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Language Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <select
                value={submissionContent.language}
                onChange={(e) => onChangeContent({ language: e.target.value as any })}
                style={{
                  background: 'var(--bg-card)',
                  color: 'var(--accent-primary)',
                  border: '1px solid var(--border-light)',
                  padding: '3px 8px',
                  borderRadius: 'var(--radius-xs)',
                  fontSize: '0.78rem',
                  fontWeight: 700,
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

          {/* Editor Body */}
          <div style={{ padding: 14, minHeight: 440, background: 'var(--code-bg)' }}>
            {centerTab === 'code' && (
              <textarea
                className="code-font"
                value={submissionContent.code}
                onChange={(e) => onChangeContent({ code: e.target.value })}
                placeholder={`// Write your complete LLD code here...\npublic class ParkingLot {\n    private List<ParkingFloor> floors;\n}`}
                style={{
                  width: '100%',
                  height: 430,
                  background: 'transparent',
                  color: 'var(--code-text)',
                  border: 'none',
                  fontSize: '0.88rem',
                  lineHeight: 1.6,
                  outline: 'none',
                  resize: 'none',
                  tabSize: 2
                }}
              />
            )}

            {centerTab === 'diagram' && (
              <textarea
                className="code-font"
                value={submissionContent.diagramMermaid}
                onChange={(e) => onChangeContent({ diagramMermaid: e.target.value })}
                placeholder={`classDiagram\n    class ParkingLot\n    class ParkingFloor\n    ParkingLot *-- ParkingFloor`}
                style={{
                  width: '100%',
                  height: 430,
                  background: 'transparent',
                  color: '#38bdf8',
                  border: 'none',
                  fontSize: '0.88rem',
                  lineHeight: 1.6,
                  outline: 'none',
                  resize: 'none'
                }}
              />
            )}

            {centerTab === 'notes' && (
              <textarea
                className="code-font"
                value={submissionContent.designRationale}
                onChange={(e) => onChangeContent({ designRationale: e.target.value })}
                placeholder={`Design Notes & Pattern Rationale:\n- Used Strategy pattern for flexible spot finding algorithms.`}
                style={{
                  width: '100%',
                  height: 430,
                  background: 'transparent',
                  color: 'var(--code-text)',
                  border: 'none',
                  fontSize: '0.88rem',
                  lineHeight: 1.6,
                  outline: 'none',
                  resize: 'none'
                }}
              />
            )}
          </div>

          {/* Bottom Execution Actions */}
          <div style={{
            padding: '12px 16px',
            background: 'var(--bg-card-subtle)',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Try implementing core classes and methods. Keep it modular and extensible.
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <button
                onClick={onSubmit}
                className="btn btn-secondary"
                style={{ padding: '7px 14px', fontSize: '0.82rem' }}
              >
                <Play size={13} /> Run (Local)
              </button>

              <button
                onClick={onSubmit}
                disabled={isEvaluating}
                className="btn btn-primary"
                style={{ padding: '7px 18px', fontSize: '0.85rem' }}
              >
                <span>{isEvaluating ? 'Evaluating...' : 'Submit for Review'}</span>
                <Send size={13} />
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Live Mermaid Diagram & Design Checklist */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Class Diagram Box */}
          <div className="designlab-card" style={{ padding: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <GitBranch size={16} color="var(--accent-primary)" /> Class Diagram (Mermaid)
              </h4>
            </div>
            <div style={{ maxHeight: 240, overflowY: 'auto' }}>
              <MermaidViewer chart={submissionContent.diagramMermaid} />
            </div>
          </div>

          {/* Design Checklist */}
          <div className="designlab-card" style={{ padding: 18 }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 12 }}>
              Design Checklist
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[
                'Clear class responsibilities',
                'Interfaces/abstractions used',
                'Extensible for new vehicle types',
                'Handles edge cases',
                'Follows SOLID principles'
              ].map((item, idx) => {
                const isChecked = !!completedChecklist[idx];
                return (
                  <div
                    key={idx}
                    onClick={() => toggleChecklist(idx)}
                    className={`check-item ${isChecked ? 'checked' : ''}`}
                  >
                    {isChecked ? <CheckCircle2 size={15} color="var(--accent-emerald)" /> : <Circle size={15} color="var(--text-muted)" />}
                    <span style={{ fontSize: '0.8rem', color: isChecked ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                      {item}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
