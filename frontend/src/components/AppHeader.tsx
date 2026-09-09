import React from 'react';
import { Search, Sun, Moon, Bell, Flame, Zap, Terminal, ExternalLink, FileText, Activity } from 'lucide-react';

interface AppHeaderProps {
  onSearchOpen: () => void;
  onTrySampleDemo: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  onSearchOpen,
  onTrySampleDemo,
  theme,
  onToggleTheme
}) => {
  return (
    <header className="glass-panel" style={{
      height: 64,
      borderBottom: '1px solid var(--border-subtle)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      position: 'sticky',
      top: 0,
      zIndex: 40
    }}>
      {/* Left: Search Bar & Engine Health Pill */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div 
          onClick={onSearchOpen}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            background: 'var(--bg-card-subtle)',
            border: '1px solid var(--border-light)',
            padding: '7px 14px',
            borderRadius: 'var(--radius-pill)',
            width: 320,
            cursor: 'pointer',
            color: 'var(--text-muted)',
            fontSize: '0.84rem',
            transition: 'all 0.15s ease'
          }}
          className="search-input-pill"
        >
          <Search size={14} color="var(--text-muted)" />
          <span style={{ flex: 1 }}>Search problems, patterns, rules...</span>
          <kbd style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-light)',
            padding: '2px 6px',
            borderRadius: 4,
            fontSize: '0.7rem',
            fontWeight: 700,
            color: 'var(--text-secondary)'
          }}>
            ⌘K
          </kbd>
        </div>

        {/* Engine Status Tag */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          background: 'var(--accent-emerald-soft)',
          border: '1px solid rgba(16, 185, 129, 0.25)',
          padding: '4px 10px',
          borderRadius: 'var(--radius-pill)',
          fontSize: '0.72rem',
          fontWeight: 700,
          color: 'var(--accent-emerald)'
        }}>
          <span className="pulse-dot" />
          <span>LLD Engine Ready • AST + AI</span>
        </div>
      </div>

      {/* Right: Quick Reviewer Demo, Streak, Theme Toggle, GitHub */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* Instant Reviewer Demo Action */}
        <button
          onClick={onTrySampleDemo}
          className="btn btn-primary"
          style={{
            padding: '6px 14px',
            fontSize: '0.82rem',
            borderRadius: 'var(--radius-pill)',
            gap: 6
          }}
          title="Instantly load Gold Standard Parking Lot and evaluate"
        >
          <Zap size={14} />
          <span>1-Click Reviewer Demo</span>
        </button>

        {/* GitHub Repo Link */}
        <a
          href="https://github.com/Yogx09/DesignForge-AI-Powered-LLD-Practice-Review-Platform"
          target="_blank"
          rel="noreferrer"
          className="btn btn-secondary"
          style={{
            padding: '6px 12px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.78rem',
            gap: 6
          }}
          title="GitHub Repository"
        >
          <span>GitHub Repo</span>
          <ExternalLink size={13} />
        </a>

        {/* Dark/Light Mode Toggle */}
        <button
          onClick={onToggleTheme}
          style={{
            width: 36,
            height: 36,
            borderRadius: 'var(--radius-sm)',
            background: 'var(--bg-card-subtle)',
            border: '1px solid var(--border-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'var(--text-secondary)',
            transition: 'all 0.15s ease'
          }}
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? <Sun size={16} color="#fbbf24" /> : <Moon size={16} color="#6366f1" />}
        </button>

        {/* Streak Flame */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          background: 'var(--accent-amber-soft)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          padding: '5px 12px',
          borderRadius: 'var(--radius-pill)',
          fontSize: '0.78rem',
          fontWeight: 800,
          color: '#d97706'
        }}>
          <Flame size={15} color="#ea580c" />
          <span>7-Day Streak</span>
        </div>
      </div>
    </header>
  );
};

