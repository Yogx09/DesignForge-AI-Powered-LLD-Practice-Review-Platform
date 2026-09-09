import React, { useState } from 'react';
import { X, Bot, Send, Sparkles, Lightbulb, ShieldCheck, Code2, Zap } from 'lucide-react';

interface AIMentorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AIMentorModal: React.FC<AIMentorModalProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Array<{ sender: 'ai' | 'user'; text: string }>>([
    {
      sender: 'ai',
      text: 'Hello Yogesh! I am your DesignLab AI Architecture Mentor. Ask me anything about GoF Design Patterns, SOLID principles, concurrency trade-offs, or code structure for your LLD problems.'
    }
  ]);
  const [input, setInput] = useState('');

  if (!isOpen) return null;

  const quickPrompts = [
    'How to make Parking Lot thread-safe?',
    'Explain Strategy Pattern for pricing',
    'What are key SOLID rules for LLD interviews?',
    'How to handle concurrency in elevator scheduling?'
  ];

  const handleSendText = (textToSend: string) => {
    if (!textToSend.trim()) return;
    setMessages(prev => [...prev, { sender: 'user', text: textToSend }]);
    setInput('');

    setTimeout(() => {
      let reply = 'In Low-Level Design, the key is defining clear abstractions (interfaces) before concrete classes so that new features can be added without modifying existing coordinator logic (Open-Closed Principle).';
      const lower = textToSend.toLowerCase();
      if (lower.includes('thread') || lower.includes('concurrency') || lower.includes('safe')) {
        reply = 'To ensure thread-safety in multi-floor systems:\n1. Use ConcurrentHashMap for spot lookups by ID.\n2. Synchronize at the floor or spot level rather than locking the entire ParkingLot class to maintain high gate throughput.\n3. Use atomic state transitions (e.g. AtomicBoolean isOccupied) when reserving spots.';
      } else if (lower.includes('strategy') || lower.includes('pricing') || lower.includes('spot')) {
        reply = 'The Strategy Pattern encapsulates algorithms inside separate classes:\n- Define interface `IPricingStrategy` with method `calculateFee(Ticket ticket)`.\n- Create implementations: `HourlyPricingStrategy`, `FlatRateStrategy`, `WeekendSurgeStrategy`.\n- The ParkingLot or ExitGate delegates fee calculation to whichever strategy is injected at runtime without changing entity code.';
      } else if (lower.includes('elevator')) {
        reply = 'For Elevator Systems:\n- Use the State Pattern (IdleState, MovingUpState, MovingDownState, DoorOpenState).\n- Use the Strategy Pattern for the Dispatcher (e.g. LOOK/SCAN algorithm or Shortest-Seek-Time).\n- Ensure external HallButtons communicate with an ElevatorController that dispatches requests.';
      } else if (lower.includes('solid') || lower.includes('pattern')) {
        reply = 'Core SOLID guidelines for LLD:\n- S: Separate ticket generation from spot finding.\n- O: Use interfaces so new pricing or vehicle types don\'t alter existing classes.\n- L: Any vehicle subtype (Car, Bike, Truck) can park in an allocated compatible spot.\n- I: Keep interfaces small (e.g. `IParkingStrategy`, `IPaymentProcessor`).\n- D: Depend on abstractions (`IPricingStrategy`), not concrete implementations.';
      }

      setMessages(prev => [...prev, { sender: 'ai', text: reply }]);
    }, 350);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'var(--bg-modal-backdrop)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      padding: 20
    }}>
      <div className="designlab-card" style={{
        maxWidth: 680,
        width: '100%',
        height: '80vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
      }}>
        {/* Header */}
        <div style={{
          padding: '16px 22px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--bg-card-subtle)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: 'var(--accent-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.35)'
            }}>
              <Bot size={20} color="#fff" />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-primary)' }}>
                DesignLab AI Architecture Mentor
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                Powered by Gemini 2.5 Flash • Real-time LLD Guidance
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '50%',
              width: 32,
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--text-secondary)'
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Quick Prompt Pills */}
        <div style={{
          padding: '10px 18px',
          background: 'var(--bg-card)',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          gap: 6,
          overflowX: 'auto',
          whiteSpace: 'nowrap'
        }}>
          {quickPrompts.map((qp, idx) => (
            <button
              key={idx}
              onClick={() => handleSendText(qp)}
              style={{
                fontSize: '0.74rem',
                padding: '4px 10px',
                borderRadius: 'var(--radius-pill)',
                background: 'var(--bg-card-subtle)',
                border: '1px solid var(--border-light)',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                transition: 'all 0.15s ease'
              }}
              className="prompt-chip"
            >
              <Sparkles size={11} color="var(--accent-primary)" />
              <span>{qp}</span>
            </button>
          ))}
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
          {messages.map((m, i) => (
            <div
              key={i}
              style={{
                alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '85%',
                padding: '12px 16px',
                borderRadius: 'var(--radius-sm)',
                background: m.sender === 'user' ? 'var(--accent-gradient)' : 'var(--bg-card-subtle)',
                color: m.sender === 'user' ? '#ffffff' : 'var(--text-primary)',
                fontSize: '0.86rem',
                lineHeight: 1.6,
                border: m.sender === 'user' ? 'none' : '1px solid var(--border-subtle)',
                whiteSpace: 'pre-line'
              }}
            >
              {m.text}
            </div>
          ))}
        </div>

        {/* Input */}
        <div style={{
          padding: 16,
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          gap: 10,
          background: 'var(--bg-card)'
        }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendText(input)}
            placeholder="Ask AI mentor about design patterns, concurrency locks, or trade-offs..."
            style={{
              flex: 1,
              padding: '10px 16px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-light)',
              background: 'var(--bg-card-subtle)',
              color: 'var(--text-primary)',
              fontSize: '0.88rem',
              outline: 'none'
            }}
          />
          <button
            onClick={() => handleSendText(input)}
            className="btn btn-primary"
            style={{ padding: '10px 18px' }}
          >
            <Send size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};

