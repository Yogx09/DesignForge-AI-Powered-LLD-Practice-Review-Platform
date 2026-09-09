import React, { useEffect, useState } from 'react';
import { X, BookOpen, FileText, Cpu, Lightbulb, CheckCircle2 } from 'lucide-react';

interface DocViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDoc?: 'research' | 'design' | 'ai_usage';
}

export const DocViewerModal: React.FC<DocViewerModalProps> = ({
  isOpen,
  onClose,
  initialDoc = 'research'
}) => {
  const [activeDoc, setActiveDoc] = useState<'research' | 'design' | 'ai_usage'>(initialDoc);
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen) return;

    const fetchDoc = async () => {
      try {
        setLoading(true);
        const apiBase = typeof window !== 'undefined' && window.location.hostname === 'localhost' && window.location.port === '5173' ? 'http://localhost:4000/api' : '/api';
        const res = await fetch(`${apiBase}/docs/${activeDoc}`);
        const data = await res.json();
        if (data.success) {
          setContent(data.content);
        } else {
          setContent('Document could not be loaded.');
        }
      } catch (err: any) {
        setContent('Error loading document: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDoc();
  }, [isOpen, activeDoc]);

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(5, 7, 12, 0.88)',
      backdropFilter: 'blur(16px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      padding: 24
    }}>
      <div className="glass-card" style={{
        maxWidth: 960,
        width: '100%',
        height: '88vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        border: '1px solid var(--border-light)'
      }}>
        {/* Modal Header & Tabs */}
        <div style={{
          padding: '16px 24px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(12, 16, 25, 0.9)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 800, fontSize: '1.05rem', color: '#fff' }}>
              <BookOpen size={18} color="var(--accent-primary)" />
              <span>Project Documentation & Reviewer Notes</span>
            </div>

            {/* Doc Tabs */}
            <div style={{ display: 'flex', gap: 6 }}>
              {[
                { id: 'research', label: '1. Research Note', icon: FileText },
                { id: 'design', label: '2. Design Note', icon: Lightbulb },
                { id: 'ai_usage', label: '3. AI Usage Decisions', icon: Cpu }
              ].map((tab) => {
                const isActive = activeDoc === tab.id;
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveDoc(tab.id as any)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      padding: '6px 12px',
                      borderRadius: 'var(--radius-sm)',
                      background: isActive ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                      border: isActive ? '1px solid var(--accent-primary)' : '1px solid transparent',
                      color: isActive ? '#fff' : 'var(--text-secondary)',
                      fontSize: '0.8rem',
                      fontWeight: isActive ? 700 : 500,
                      cursor: 'pointer'
                    }}
                  >
                    <Icon size={14} color={isActive ? 'var(--accent-primary)' : 'var(--text-muted)'} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '28px 36px', background: '#090b10' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
              Loading document...
            </div>
          ) : (
            <div style={{
              color: '#cbd5e1',
              lineHeight: 1.7,
              fontSize: '0.92rem',
              whiteSpace: 'pre-wrap',
              fontFamily: 'system-ui, -apple-system, sans-serif'
            }}>
              {content}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
