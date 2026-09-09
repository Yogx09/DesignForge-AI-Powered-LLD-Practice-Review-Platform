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
  ChevronRight,
  Sparkles,
  Trash2,
  Copy,
  Maximize2,
  ZoomIn,
  ZoomOut,
  HelpCircle,
  Terminal,
  Activity
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
  const [newAssumptionInput, setNewAssumptionInput] = useState<string>('');
  const [isAddingAssumption, setIsAddingAssumption] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [validationSuccess, setValidationSuccess] = useState<boolean | null>(null);

  useEffect(() => {
    if (submissionContent.assumptions) {
      const lines = submissionContent.assumptions
        .split('\n')
        .map(l => l.replace(/^[-*•\d.]\s*/, '').trim())
        .filter(Boolean);
      setAssumptionsList(lines.length > 0 ? lines : [
        'Parking lot has multiple floors with designated spot types.',
        'Vehicle types include Motorcycle, Compact Car, and Large Truck.',
        'Single entry and exit gate per floor for deterministic processing.'
      ]);
    } else {
      setAssumptionsList([
        'Parking lot has multiple floors with designated spot types.',
        'Vehicle types include Motorcycle, Compact Car, and Large Truck.',
        'Single entry and exit gate per floor for deterministic processing.'
      ]);
    }
  }, [submissionContent.assumptions]);

  const toggleReq = (idx: number) => {
    setCompletedReqs(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const toggleChecklist = (idx: number) => {
    setCompletedChecklist(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleAddAssumption = () => {
    if (!newAssumptionInput.trim()) return;
    const updated = [...assumptionsList, newAssumptionInput.trim()];
    setAssumptionsList(updated);
    setNewAssumptionInput('');
    setIsAddingAssumption(false);
    onChangeContent({ assumptions: updated.map(a => '- ' + a).join('\n') });
  };

  const handleDeleteAssumption = (idx: number) => {
    const updated = assumptionsList.filter((_, i) => i !== idx);
    setAssumptionsList(updated);
    onChangeContent({ assumptions: updated.map(a => '- ' + a).join('\n') });
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(submissionContent.code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleLocalValidate = () => {
    setValidationSuccess(null);
    setTimeout(() => {
      const hasClasses = submissionContent.code.includes('class ') || submissionContent.code.includes('interface ');
      setValidationSuccess(hasClasses);
      setTimeout(() => setValidationSuccess(null), 3000);
    }, 400);
  };

  const lineCount = submissionContent.code ? submissionContent.code.split('\n').length : 1;

  return (
    <div style={{ padding: '12px 2px', maxWidth: 1440, margin: '0 auto' }}>
      {/* Top Header Row */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 14,
        padding: '0 4px',
        flexWrap: 'wrap',
        gap: 12
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.86rem', color: 'var(--text-muted)' }}>
          <span onClick={onBackToOverview} style={{ cursor: 'pointer', color: 'var(--text-secondary)' }}>{problem.title}</span>
          <ChevronRight size={14} />
          <strong style={{ color: 'var(--text-primary)' }}>Architecture & Code Studio</strong>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          {onLoadSampleSolution && (
            <button
              onClick={onLoadSampleSolution}
              className="btn btn-emerald"
              style={{ padding: '6px 14px', fontSize: '0.8rem', borderRadius: 'var(--radius-pill)' }}
              title="Load Gold-Standard Solution (Strategy + Factory + High Modularity)"
            >
              <Zap size={14} /> Load Gold Standard (85+ Score)
            </button>
          )}

          {onLoadFlawedSolution && (
            <button
              onClick={onLoadFlawedSolution}
              className="btn btn-secondary"
              style={{ padding: '6px 12px', fontSize: '0.8rem', color: '#f59e0b', borderRadius: 'var(--radius-pill)' }}
              title="Load Under-decomposed monolithic solution to test rubric diagnostics"
            >
              <AlertTriangle size={14} /> Load Flawed Solution
            </button>
          )}

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontSize: '0.78rem',
            color: 'var(--accent-emerald)',
            fontWeight: 700,
            background: 'var(--accent-emerald-soft)',
            padding: '5px 12px',
            borderRadius: 'var(--radius-pill)',
            border: '1px solid rgba(16, 185, 129, 0.25)'
          }}>
            <span className="pulse-dot" /> Auto-syncing
          </div>

          <button
            onClick={onReset}
            className="btn btn-secondary"
            style={{ padding: '6px 12px', fontSize: '0.8rem', borderRadius: 'var(--radius-sm)' }}
            title="Reset to blank template"
          >
            <RotateCcw size={13} /> Reset
          </button>
        </div>
      </div>

      {/* 3-Column Studio Layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '290px 1fr 340px',
        gap: 16,
        alignItems: 'start'
      }}>
        {/* LEFT COLUMN: Requirements & Assumptions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Requirements Checklist */}
          <div className="designlab-card" style={{ padding: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <h4 style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <CheckCircle2 size={16} color="var(--accent-primary)" /> Functional Scope
              </h4>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                {Object.values(completedReqs).filter(Boolean).length}/5 done
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {problem.functionalRequirements.slice(0, 5).map((req, idx) => {
                const isChecked = !!completedReqs[idx];
                return (
                  <div
                    key={idx}
                    onClick={() => toggleReq(idx)}
                    className={`check-item ${isChecked ? 'checked' : ''}`}
                  >
                    {isChecked ? <CheckCircle2 size={15} color="var(--accent-emerald)" style={{ flexShrink: 0 }} /> : <Circle size={15} color="var(--text-muted)" style={{ flexShrink: 0 }} />}
                    <span style={{
                      fontSize: '0.8rem',
                      color: isChecked ? 'var(--text-primary)' : 'var(--text-secondary)',
                      textDecoration: isChecked ? 'line-through' : 'none',
                      opacity: isChecked ? 0.8 : 1
                    }}>
                      {req}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Interactive Assumptions Builder */}
          <div className="designlab-card" style={{ padding: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <h4 style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <FileEdit size={16} color="var(--accent-cyan)" /> Assumptions ({assumptionsList.length})
              </h4>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
              {assumptionsList.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    gap: 6,
                    padding: '6px 8px',
                    borderRadius: 6,
                    background: 'var(--bg-card-subtle)',
                    fontSize: '0.78rem',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.4
                  }}
                >
                  <div>
                    <strong style={{ color: 'var(--text-primary)' }}>{idx + 1}.</strong> {item}
                  </div>
                  <button
                    onClick={() => handleDeleteAssumption(idx)}
                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 2 }}
                    title="Delete assumption"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>

            {isAddingAssumption ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <input
                  type="text"
                  value={newAssumptionInput}
                  onChange={(e) => setNewAssumptionInput(e.target.value)}
                  placeholder="e.g. Rate card is configurable per floor..."
                  style={{
                    width: '100%',
                    padding: '6px 10px',
                    borderRadius: 'var(--radius-xs)',
                    border: '1px solid var(--border-light)',
                    background: 'var(--bg-card)',
                    color: 'var(--text-primary)',
                    fontSize: '0.78rem',
                    outline: 'none'
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddAssumption()}
                  autoFocus
                />
                <div style={{ display: 'flex', gap: 6 }}>
                  <button
                    onClick={handleAddAssumption}
                    className="btn btn-primary"
                    style={{ flex: 1, padding: '5px 10px', fontSize: '0.75rem' }}
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setIsAddingAssumption(false)}
                    className="btn btn-secondary"
                    style={{ padding: '5px 10px', fontSize: '0.75rem' }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setIsAddingAssumption(true)}
                className="btn btn-secondary"
                style={{ width: '100%', padding: '6px 12px', fontSize: '0.78rem' }}
              >
                <Plus size={13} /> Add Custom Assumption
              </button>
            )}
          </div>

          {/* Architectural Best Practice Tip */}
          <div className="designlab-card" style={{ padding: 14, background: 'rgba(99, 102, 241, 0.04)', border: '1px solid var(--accent-soft-border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', fontWeight: 800, color: 'var(--accent-primary)', marginBottom: 4 }}>
              <Lightbulb size={14} /> Architectural Tip
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
              Use the <strong>Strategy Pattern</strong> for spot allocation and fee calculations so new vehicle policies can be added without modifying existing classes.
            </div>
          </div>
        </div>

        {/* CENTER COLUMN: Code / Mermaid / Notes Studio */}
        <div className="designlab-card" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {/* Studio Tab Header */}
          <div style={{
            padding: '8px 16px',
            background: 'var(--bg-card-subtle)',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 10
          }}>
            {/* Center View Tabs */}
            <div style={{ display: 'flex', gap: 4 }}>
              {[
                { id: 'code', label: 'Implementation Code', icon: Code2 },
                { id: 'diagram', label: 'Mermaid UML', icon: GitBranch },
                { id: 'notes', label: 'Design Rationale', icon: FileEdit }
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
                      padding: '6px 12px',
                      borderRadius: 'var(--radius-xs)',
                      background: isActive ? 'var(--accent-soft)' : 'transparent',
                      border: 'none',
                      color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
                      fontWeight: isActive ? 700 : 500,
                      fontSize: '0.82rem',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <Icon size={15} color={isActive ? 'var(--accent-primary)' : 'var(--text-muted)'} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Right Editor Controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace' }}>
                {lineCount} lines • {submissionContent.code.length} chars
              </span>

              <button
                onClick={handleCopyCode}
                style={{
                  background: 'transparent',
                  border: '1px solid var(--border-light)',
                  padding: '3px 8px',
                  borderRadius: 'var(--radius-xs)',
                  color: 'var(--text-secondary)',
                  fontSize: '0.72rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4
                }}
                title="Copy code"
              >
                <Copy size={12} />
                <span>{copiedCode ? 'Copied!' : 'Copy'}</span>
              </button>

              {/* Language Selector */}
              <select
                value={submissionContent.language}
                onChange={(e) => onChangeContent({ language: e.target.value as any })}
                style={{
                  background: 'var(--bg-card)',
                  color: 'var(--accent-primary)',
                  border: '1px solid var(--border-light)',
                  padding: '4px 10px',
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

          {/* Editor Workspace Body */}
          <div style={{ padding: 0, minHeight: 460, background: 'var(--code-bg)', position: 'relative' }}>
            {centerTab === 'code' && (
              <textarea
                className="code-font"
                value={submissionContent.code}
                onChange={(e) => onChangeContent({ code: e.target.value })}
                placeholder={`// Write your complete LLD code here (classes, interfaces, methods)...\n// Example:\npublic class ParkingLot {\n    private List<ParkingFloor> floors;\n    private ParkingStrategy strategy;\n}`}
                style={{
                  width: '100%',
                  height: 460,
                  background: 'transparent',
                  color: 'var(--code-text)',
                  border: 'none',
                  fontSize: '0.88rem',
                  lineHeight: 1.6,
                  outline: 'none',
                  resize: 'none',
                  padding: '16px 20px',
                  tabSize: 2
                }}
                spellCheck={false}
              />
            )}

            {centerTab === 'diagram' && (
              <textarea
                className="code-font"
                value={submissionContent.diagramMermaid}
                onChange={(e) => onChangeContent({ diagramMermaid: e.target.value })}
                placeholder={`classDiagram\n    class ParkingLot {\n        +parkVehicle(v: Vehicle)\n        +unparkVehicle(ticketId: string)\n    }\n    class ParkingFloor\n    ParkingLot *-- ParkingFloor`}
                style={{
                  width: '100%',
                  height: 460,
                  background: 'transparent',
                  color: '#38bdf8',
                  border: 'none',
                  fontSize: '0.88rem',
                  lineHeight: 1.6,
                  outline: 'none',
                  resize: 'none',
                  padding: '16px 20px',
                  tabSize: 2
                }}
                spellCheck={false}
              />
            )}

            {centerTab === 'notes' && (
              <textarea
                className="code-font"
                value={submissionContent.designRationale}
                onChange={(e) => onChangeContent({ designRationale: e.target.value })}
                placeholder={`Design Notes & Pattern Rationale:\n- Used Strategy Pattern to isolate fee calculation rules.\n- Implemented Factory Pattern for ParkingSpot allocation.\n- Handled concurrency via thread-safe synchronized locks.`}
                style={{
                  width: '100%',
                  height: 460,
                  background: 'transparent',
                  color: 'var(--code-text)',
                  border: 'none',
                  fontSize: '0.88rem',
                  lineHeight: 1.6,
                  outline: 'none',
                  resize: 'none',
                  padding: '16px 20px'
                }}
                spellCheck={false}
              />
            )}
          </div>

          {/* Bottom Execution & Evaluation Action Bar */}
          <div style={{
            padding: '12px 18px',
            background: 'var(--bg-card-subtle)',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 12
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Evaluator checks: AST Class Structure, SOLID Principles, Design Patterns & Evidence Lines.
              </span>
              {validationSuccess === true && (
                <span style={{ fontSize: '0.75rem', color: 'var(--accent-emerald)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <CheckCircle2 size={13} /> Syntax Validated
                </span>
              )}
              {validationSuccess === false && (
                <span style={{ fontSize: '0.75rem', color: 'var(--accent-rose)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <AlertTriangle size={13} /> Classes Missing
                </span>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <button
                onClick={handleLocalValidate}
                className="btn btn-secondary"
                style={{ padding: '8px 14px', fontSize: '0.82rem' }}
                title="Perform local AST syntax check"
              >
                <Play size={13} /> Local Check
              </button>

              <button
                onClick={onSubmit}
                disabled={isEvaluating}
                className="btn btn-primary"
                style={{ padding: '8px 22px', fontSize: '0.86rem', gap: 8 }}
              >
                <span>{isEvaluating ? 'Evaluating Architecture...' : 'Submit for Review'}</span>
                <Send size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Live Mermaid Diagram Visualizer & Readiness Checklist */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Live Mermaid UML Diagram Card */}
          <div className="designlab-card" style={{ padding: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <h4 style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <GitBranch size={16} color="var(--accent-primary)" /> Live UML Diagram
              </h4>
              <span style={{ fontSize: '0.68rem', background: 'var(--accent-soft)', color: 'var(--accent-primary)', padding: '2px 6px', borderRadius: 4, fontWeight: 700 }}>
                Mermaid
              </span>
            </div>

            <div style={{ maxHeight: 260, overflowY: 'auto' }}>
              <MermaidViewer chart={submissionContent.diagramMermaid} />
            </div>
          </div>

          {/* Design Quality Readiness Checklist */}
          <div className="designlab-card" style={{ padding: 18 }}>
            <h4 style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 12 }}>
              Rubric Readiness Checklist
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[
                'Decomposed classes (SRP)',
                'Interfaces / Abstractions (DIP)',
                'Strategy pattern for policies (OCP)',
                'Vehicle polymorphism (LSP)',
                'Edge cases & Thread-safety'
              ].map((item, idx) => {
                const isChecked = !!completedChecklist[idx];
                return (
                  <div
                    key={idx}
                    onClick={() => toggleChecklist(idx)}
                    className={`check-item ${isChecked ? 'checked' : ''}`}
                  >
                    {isChecked ? <CheckCircle2 size={15} color="var(--accent-emerald)" style={{ flexShrink: 0 }} /> : <Circle size={15} color="var(--text-muted)" style={{ flexShrink: 0 }} />}
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

