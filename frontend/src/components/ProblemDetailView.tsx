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
  ChevronRight,
  Building2,
  Cpu,
  Clock,
  ShieldCheck,
  Zap,
  Boxes,
  HelpCircle
} from 'lucide-react';

interface ProblemDetailViewProps {
  problem: Problem;
  onStartPractice: () => void;
  onBackToProblems: () => void;
}

type TabKey = 'overview' | 'requirements' | 'constraints' | 'examples' | 'hints' | 'tradeoffs';

export const ProblemDetailView: React.FC<ProblemDetailViewProps> = ({
  problem,
  onStartPractice,
  onBackToProblems
}) => {
  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  const [checkedPreReqs, setCheckedPreReqs] = useState<Record<number, boolean>>({});

  const togglePreReq = (idx: number) => {
    setCheckedPreReqs(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const companyBadges: Record<string, string[]> = {
    'parking-lot': ['Amazon', 'Google', 'Uber'],
    'elevator-system': ['Microsoft', 'Uber', 'Salesforce'],
    'rate-limiter': ['Stripe', 'Netflix', 'Meta'],
    'vending-machine': ['Atlassian', 'Adobe'],
    'logging-framework': ['Datadog', 'Amazon'],
    'chat-system': ['Discord', 'Meta'],
    'chess-game': ['Google', 'Bloomberg']
  };

  const companies = companyBadges[problem.id] || ['Google', 'Amazon'];

  return (
    <div style={{ maxWidth: 1240, margin: '0 auto', padding: '16px 4px' }}>
      {/* Breadcrumbs & Actions Row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.86rem', color: 'var(--text-muted)' }}>
          <span onClick={onBackToProblems} style={{ cursor: 'pointer', color: 'var(--text-secondary)' }}>Problem Catalog</span>
          <ChevronRight size={14} />
          <strong style={{ color: 'var(--text-primary)' }}>{problem.title}</strong>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            onClick={() => setIsBookmarked(!isBookmarked)}
            className="btn btn-secondary"
            style={{ padding: '8px 12px' }}
            title="Bookmark this problem"
          >
            <Bookmark size={16} fill={isBookmarked ? 'var(--accent-primary)' : 'none'} color={isBookmarked ? 'var(--accent-primary)' : 'var(--text-secondary)'} />
          </button>
          <button
            onClick={onStartPractice}
            className="btn btn-primary"
            style={{ padding: '8px 22px', fontSize: '0.9rem' }}
          >
            <span>Open Practice Studio</span> <ArrowRight size={15} />
          </button>
        </div>
      </div>

      {/* Main Title Banner */}
      <div className="designlab-card" style={{ padding: '24px 28px', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 18 }}>
          <div style={{
            width: 52,
            height: 52,
            borderRadius: 14,
            background: 'var(--accent-gradient)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.4rem',
            fontWeight: 900,
            flexShrink: 0,
            boxShadow: '0 4px 14px rgba(99, 102, 241, 0.35)'
          }}>
            {problem.title.charAt(0)}
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 8 }}>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                {problem.title}
              </h1>
              <span className="badge badge-medium">{problem.difficulty}</span>
              <span className="badge badge-primary">{problem.category}</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                <Clock size={13} /> {problem.timeEstimate}
              </span>
            </div>

            <p style={{ fontSize: '0.94rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 12 }}>
              {problem.description}
            </p>

            {/* Company Tags */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>Top Companies:</span>
              {companies.map((c, i) => (
                <span
                  key={i}
                  style={{
                    fontSize: '0.72rem',
                    background: 'var(--bg-card-subtle)',
                    border: '1px solid var(--border-light)',
                    padding: '3px 8px',
                    borderRadius: 6,
                    fontWeight: 600,
                    color: 'var(--text-secondary)'
                  }}
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{
          display: 'flex',
          gap: 6,
          borderTop: '1px solid var(--border-subtle)',
          marginTop: 20,
          paddingTop: 16,
          flexWrap: 'wrap'
        }}>
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'requirements', label: 'Requirements' },
            { id: 'constraints', label: 'System Constraints' },
            { id: 'tradeoffs', label: 'Architecture Tradeoffs' },
            { id: 'examples', label: 'Execution Example' },
            { id: 'hints', label: 'Design Hints' }
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabKey)}
                style={{
                  padding: '7px 16px',
                  borderRadius: 'var(--radius-xs)',
                  border: 'none',
                  background: isActive ? 'var(--accent-soft)' : 'transparent',
                  color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
                  fontWeight: isActive ? 700 : 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content Body (2 Columns) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.45fr 1fr', gap: 20 }}>
        {/* Left Column */}
        <div className="designlab-card" style={{ padding: 24 }}>
          {activeTab === 'overview' && (
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 12 }}>
                🎯 Problem Statement & Design Objectives
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 20 }}>
                Design a modular, extensible, and thread-safe object-oriented system for a commercial multi-tier infrastructure. The system must adhere to strict SOLID principles, decouple business policies (such as spot allocation strategies and fee calculation rules) from core entity state, and support rapid extensibility.
              </p>

              {/* Quote Card */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.06), rgba(6, 182, 212, 0.04))',
                borderLeft: '4px solid var(--accent-primary)',
                padding: '16px 20px',
                borderRadius: '0 var(--radius-sm) var(--radius-sm) 0',
                marginBottom: 24
              }}>
                <div style={{ fontStyle: 'italic', fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                  "A great low-level design anticipates change without modifying existing business rules."
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 4 }}>
                  Open-Closed Principle (OCP) In Practice
                </div>
              </div>

              {/* Pre-flight Checklist */}
              <div>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 10 }}>
                  Pre-Submission Checklist
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {[
                    'Identify core actors and entities (ParkingLot, ParkingFloor, Spot, Vehicle, Ticket)',
                    'Use polymorphic abstractions for Vehicle types (Car, Bike, Truck)',
                    'Encapsulate dynamic pricing using the Strategy Pattern',
                    'Ensure thread-safe spot locking and ticket generation',
                    'Validate edge cases (Lot Full, Invalid Ticket, Already Paid)'
                  ].map((item, idx) => {
                    const isChecked = !!checkedPreReqs[idx];
                    return (
                      <div
                        key={idx}
                        onClick={() => togglePreReq(idx)}
                        className={`check-item ${isChecked ? 'checked' : ''}`}
                      >
                        <CheckCircle2 size={16} color={isChecked ? 'var(--accent-emerald)' : 'var(--text-muted)'} />
                        <span style={{ fontSize: '0.82rem', color: isChecked ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                          {item}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'requirements' && (
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 14 }}>
                Functional Requirements
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {problem.functionalRequirements.map((r, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: 12, borderRadius: 'var(--radius-sm)', background: 'var(--bg-card-subtle)', border: '1px solid var(--border-subtle)' }}>
                    <span style={{
                      width: 22,
                      height: 22,
                      borderRadius: '50%',
                      background: 'var(--accent-soft)',
                      color: 'var(--accent-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      flexShrink: 0
                    }}>
                      {i + 1}
                    </span>
                    <span style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                      {r}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'constraints' && (
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 14 }}>
                System & Non-Functional Constraints
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {problem.constraints.map((c, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: 12, borderRadius: 'var(--radius-sm)', background: 'var(--bg-card-subtle)', border: '1px solid var(--border-subtle)' }}>
                    <AlertCircle size={16} color="var(--accent-amber)" style={{ flexShrink: 0, marginTop: 2 }} />
                    <span style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                      {c}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'tradeoffs' && (
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 14 }}>
                Key Architectural Tradeoffs
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ padding: 14, borderRadius: 'var(--radius-sm)', background: 'var(--bg-card-subtle)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontWeight: 800, fontSize: '0.88rem', color: 'var(--text-primary)', marginBottom: 4 }}>
                    Strategy Pattern vs Hardcoded if-else Pricing
                  </div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    <strong>Tradeoff:</strong> Adding classes increases file count, but allows adding Weekend/Surge pricing without touching core ParkingSpot classes (eliminating regression risk).
                  </p>
                </div>

                <div style={{ padding: 14, borderRadius: 'var(--radius-sm)', background: 'var(--bg-card-subtle)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontWeight: 800, fontSize: '0.88rem', color: 'var(--text-primary)', marginBottom: 4 }}>
                    Synchronized Locks vs Concurrent Collections
                  </div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    <strong>Tradeoff:</strong> Coarse-grained floor locks are simpler to implement, but fine-grained slot locks allow multiple gates to issue tickets simultaneously.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'examples' && (
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 14 }}>
                Sample Execution & Flow Trace
              </h3>
              <div style={{
                background: 'var(--code-bg)',
                padding: 18,
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--code-border)',
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '0.82rem',
                color: 'var(--code-text)',
                lineHeight: 1.8
              }}>
                <span style={{ color: '#94a3b8' }}>// 1. Initialize Parking System</span><br />
                ParkingLot lot = ParkingLot.getInstance("Downtown-Hub", 3);<br /><br />
                <span style={{ color: '#94a3b8' }}>// 2. Vehicle Arrives at Entry Gate</span><br />
                Vehicle car = new Car("KA-01-HH-1234");<br />
                Ticket ticket = lot.parkVehicle(car); <span style={{ color: '#10b981' }}>// Floor 1, Spot C-14</span><br /><br />
                <span style={{ color: '#94a3b8' }}>// 3. Vehicle Exits at Exit Gate</span><br />
                Receipt receipt = lot.unparkVehicle(ticket.getId(), new HourlyPricingStrategy());<br />
                <span style={{ color: '#38bdf8' }}>// Total Fee: $60.00 (Paid & Spot Released)</span>
              </div>
            </div>
          )}

          {activeTab === 'hints' && (
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 14 }}>
                Design Pattern & Structure Hints
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {problem.referenceKeyConcepts.map((k, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 12, borderRadius: 'var(--radius-sm)', background: 'var(--bg-card-subtle)', border: '1px solid var(--border-subtle)' }}>
                    <Lightbulb size={18} color="var(--accent-primary)" />
                    <span style={{ fontSize: '0.86rem', color: 'var(--text-primary)', fontWeight: 600 }}>{k}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Industrial Context & Graphic Art */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* Industrial Context Visual Card */}
          <div className="designlab-card" style={{
            height: 200,
            borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, #090e17 0%, #172033 100%)',
            border: '1px solid rgba(56, 189, 248, 0.25)',
            padding: 24,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <img
              src="https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=600&auto=format&fit=crop&q=80"
              alt="Parking Lot Architecture"
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                opacity: 0.35
              }}
            />
            <div style={{ zIndex: 2 }}>
              <span className="badge badge-cyan" style={{ marginBottom: 6 }}>Production Scale</span>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#f8fafc', marginBottom: 4 }}>
                Real-World Commercial Infrastructure
              </div>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                Used in multi-tenant airports, shopping malls, and smart transit hubs.
              </div>
            </div>
          </div>

          {/* Key Design Patterns Card */}
          <div className="designlab-card" style={{ padding: 22 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 800, fontSize: '0.92rem', color: 'var(--text-primary)', marginBottom: 12 }}>
              <Boxes size={18} color="var(--accent-primary)" /> Recommended Design Patterns
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.82rem', padding: '6px 10px', borderRadius: 6, background: 'var(--bg-card-subtle)' }}>
                <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Strategy Pattern</span>
                <span style={{ color: 'var(--accent-emerald)', fontSize: '0.75rem', fontWeight: 700 }}>Fee Calculation</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.82rem', padding: '6px 10px', borderRadius: 6, background: 'var(--bg-card-subtle)' }}>
                <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Factory Pattern</span>
                <span style={{ color: 'var(--accent-primary)', fontSize: '0.75rem', fontWeight: 700 }}>Spot Allocation</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.82rem', padding: '6px 10px', borderRadius: 6, background: 'var(--bg-card-subtle)' }}>
                <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Singleton (Double-Check)</span>
                <span style={{ color: 'var(--accent-purple)', fontSize: '0.75rem', fontWeight: 700 }}>ParkingLot Registry</span>
              </div>
            </div>
          </div>

          {/* Quick Start CTA Button Card */}
          <div className="designlab-card" style={{ padding: 20, textAlign: 'center', background: 'var(--accent-soft)', border: '1px solid var(--accent-soft-border)' }}>
            <div style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--accent-primary)', marginBottom: 6 }}>
              Ready to construct your design?
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 14 }}>
              Write assumptions, generate live Mermaid diagrams, and submit code for instant AST evaluation.
            </p>
            <button
              onClick={onStartPractice}
              className="btn btn-primary"
              style={{ width: '100%', padding: '10px 18px', fontSize: '0.88rem' }}
            >
              <span>Launch Practice Studio</span> <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

