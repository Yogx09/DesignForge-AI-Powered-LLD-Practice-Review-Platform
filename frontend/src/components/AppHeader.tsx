import React, { useState, useEffect } from 'react';
import { Search, Sun, Moon, Bell, Flame, Zap } from 'lucide-react';

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
    <header style={{
      height: 64,
      background: 'var(--bg-header)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-subtle)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 28px',
      position: 'sticky',
      top: 0,
      zIndex: 40
    }}>
      {/* Search Bar */}
      <div 
        onClick={onSearchOpen}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          background: 'var(--bg-card-subtle)',
          border: '1px solid var(--border-light)',
          padding: '8px 16px',
          borderRadius: 9999,
          width: 380,
          cursor: 'pointer',
          color: 'var(--text-muted)',
          fontSize: '0.85rem'
        }}
      >
        <Search size={15} />
        <span style={{ flex: 1 }}>Search problems, concepts, or tags...</span>
        <kbd style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-light)',
          padding: '2px 6px',
          borderRadius: 4,
          fontSize: '0.72rem',
          fontWeight: 700
        }}>
          ⌘ K
        </kbd>
      </div>

      {/* Right Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        {/* Instant Reviewer Demo Button */}
        <button
          onClick={onTrySampleDemo}
          className="btn btn-outline-primary"
          style={{ padding: '6px 14px', fontSize: '0.82rem', borderRadius: 9999 }}
        >
          <Zap size={14} /> 1-Click Reviewer Demo
        </button>

        {/* Dark/Light Mode Toggle */}
        <button
          onClick={onToggleTheme}
          style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            background: 'var(--bg-card-subtle)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'var(--text-secondary)'
          }}
          title="Toggle Theme"
        >
          {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
        </button>

        {/* Notification Bell */}
        <button
          style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            background: 'var(--bg-card-subtle)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'var(--text-secondary)',
            position: 'relative'
          }}
        >
          <Bell size={17} />
          <span style={{
            position: 'absolute',
            top: 7,
            right: 7,
            width: 7,
            height: 7,
            borderRadius: '50%',
            background: 'var(--accent-rose)'
          }} />
        </button>

        {/* Streak Counter */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          background: 'rgba(245, 158, 11, 0.12)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          padding: '6px 12px',
          borderRadius: 9999,
          fontSize: '0.8rem',
          fontWeight: 700,
          color: '#d97706'
        }}>
          <Flame size={15} color="#ea580c" />
          <span>Streak 7 days</span>
        </div>
      </div>
    </header>
  );
};
