import React, { useState } from 'react';
import { X, Bot, Send, Sparkles, Lightbulb, ShieldCheck } from 'lucide-react';

interface AIMentorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AIMentorModal: React.FC<AIMentorModalProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Array<{ sender: 'ai' | 'user'; text: string }>>([
    {
      sender: 'ai',
      text: 'Hello Yogesh! I am your DesignLab AI Architecture Mentor. Ask me anything about GoF Design Patterns, SOLID principles, or concurrency trade-offs for your LLD problems.'
    }
  ]);
  const [input, setInput] = useState('');

  if (!isOpen) return null;

  const handleSend = () => {
    if (!input.trim()) return;
    const userText = input;
    setMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setInput('');

    setTimeout(() => {
      let reply = 'In Low-Level Design, the key is defining clear abstractions (interfaces) before concrete classes so that new features can be added without modifying existing coordinator logic (Open-Closed Principle).';
      const lower = userText.toLowerCase();
      if (lower.includes('parking') || lower.includes('spot')) {
        reply = 'For Parking Lot, use the Strategy Pattern for spot finding (e.g. NearestFirstStrategy, LowestFloorFirstStrategy) and separate Spot occupancy state from Vehicle dimensions.';
      } else if (lower.includes('elevator')) {
        reply = 'For Elevator, use the State Pattern to represent moving, idle, and door open states. Use a SCAN/LOOK elevator scheduling algorithm to minimize passenger wait times.';
      } else if (lower.includes('pattern') || lower.includes('solid')) {
        reply = 'Key GoF patterns in LLD: Strategy (pluggable algorithms), Factory (object creation based on enum types), State (transition logic), and Observer (event notifications).';
      }

      setMessages(prev => [...prev, { sender: 'ai', text: reply }]);
    }, 400);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(5, 7, 12, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      padding: 20
    }}>
      <div className="designlab-card" style={{
        maxWidth: 620,
        width: '100%',
        height: '75vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--bg-card-subtle)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: 'var(--accent-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Bot size={18} color="#fff" />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                DesignLab AI Mentor
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                LLD Architecture Guidance
              </div>
            </div>
          </div>

          <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
            <X size={18} />
          </button>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {messages.map((m, i) => (
            <div
              key={i}
              style={{
                alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '82%',
                padding: '10px 14px',
                borderRadius: 'var(--radius-sm)',
                background: m.sender === 'user' ? 'var(--accent-primary)' : 'var(--bg-card-subtle)',
                color: m.sender === 'user' ? '#ffffff' : 'var(--text-primary)',
                fontSize: '0.85rem',
                lineHeight: 1.5,
                border: m.sender === 'user' ? 'none' : '1px solid var(--border-subtle)'
              }}
            >
              {m.text}
            </div>
          ))}
        </div>

        {/* Input */}
        <div style={{
          padding: 14,
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          gap: 10,
          background: 'var(--bg-card)'
        }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask AI mentor about LLD design patterns or trade-offs..."
            style={{
              flex: 1,
              padding: '8px 14px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-light)',
              background: 'var(--bg-card-subtle)',
              color: 'var(--text-primary)',
              fontSize: '0.85rem',
              outline: 'none'
            }}
          />
          <button onClick={handleSend} className="btn btn-primary" style={{ padding: '8px 16px' }}>
            <Send size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};
