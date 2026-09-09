import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

interface MermaidViewerProps {
  chart: string;
}

mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  themeVariables: {
    darkMode: true,
    background: '#0f1422',
    primaryColor: '#1e293b',
    primaryTextColor: '#f8fafc',
    primaryBorderColor: '#6366f1',
    lineColor: '#38bdf8',
    secondaryColor: '#1e1b4b',
    tertiaryColor: '#0f172a'
  },
  securityLevel: 'loose'
});

export const MermaidViewer: React.FC<MermaidViewerProps> = ({ chart }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const renderDiagram = async () => {
      if (!containerRef.current || !chart.trim()) return;

      try {
        setError(null);
        const id = `mermaid-svg-${Math.random().toString(36).substring(2, 9)}`;
        const { svg } = await mermaid.render(id, chart);
        if (isMounted && containerRef.current) {
          containerRef.current.innerHTML = svg;
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err?.message || 'Invalid Mermaid syntax');
        }
      }
    };

    const timer = setTimeout(renderDiagram, 300);
    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [chart]);

  if (error) {
    return (
      <div style={{
        padding: 16,
        background: 'rgba(244, 63, 94, 0.08)',
        border: '1px solid rgba(244, 63, 94, 0.25)',
        borderRadius: 'var(--radius-md)',
        color: '#fb7185',
        fontSize: '0.85rem'
      }}>
        <div style={{ fontWeight: 700, marginBottom: 4 }}>Diagram Rendering Notice:</div>
        <div>{error}</div>
        <div style={{ marginTop: 8, fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          Tip: Ensure the diagram starts with valid Mermaid syntax like <code>classDiagram</code>.
        </div>
      </div>
    );
  }

  return (
    <div className="mermaid-wrapper" ref={containerRef}>
      {!chart.trim() && (
        <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          Enter a Mermaid class diagram in the editor to see the live visualization.
        </div>
      )}
    </div>
  );
};
