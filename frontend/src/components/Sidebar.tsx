import React from 'react';
import {
  LayoutDashboard,
  Box,
  FileCheck2,
  TrendingUp,
  GraduationCap,
  Bot,
  Settings,
  Sparkles,
  FileText,
  Zap,
  Code2,
  ShieldCheck
} from 'lucide-react';

export type NavTab =
  | 'overview'
  | 'problems'
  | 'attempts'
  | 'progress'
  | 'learning'
  | 'mentor'
  | 'bookmarks'
  | 'docs'
  | 'settings';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  solvedCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  solvedCount
}) => {
  const mainNav = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'problems', label: 'Problem Catalog', icon: Box, badge: '7' },
    { id: 'attempts', label: 'Attempt History', icon: FileCheck2 },
    { id: 'progress', label: 'Skill Analytics', icon: TrendingUp }
  ];

  const toolsNav = [
    { id: 'mentor', label: 'AI Design Mentor', icon: Bot, isNew: true },
    { id: 'docs', label: 'Reviewer Guide & Specs', icon: FileText },
    { id: 'learning', label: 'Design Patterns', icon: GraduationCap }
  ];

  return (
    <aside style={{
      width: 250,
      background: 'var(--bg-sidebar)',
      borderRight: '1px solid var(--border-subtle)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '20px 14px',
      height: '100vh',
      position: 'sticky',
      top: 0,
      flexShrink: 0
    }}>
      {/* Brand Header */}
      <div>
        <div 
          onClick={() => onSelectTab('overview')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            cursor: 'pointer',
            padding: '2px 8px 18px',
            borderBottom: '1px solid var(--border-subtle)'
          }}
        >
          <div style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: 'var(--accent-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)'
          }}>
            <Sparkles size={19} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontWeight: 800, fontSize: '1.15rem', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                DesignLab
              </span>
              <span style={{
                fontSize: '0.62rem',
                fontWeight: 800,
                background: 'var(--accent-soft)',
                color: 'var(--accent-primary)',
                padding: '2px 6px',
                borderRadius: 4,
                border: '1px solid var(--accent-soft-border)'
              }}>
                PRO
              </span>
            </div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              AI-Powered LLD Studio
            </div>
          </div>
        </div>

        {/* Section: MAIN WORKSPACE */}
        <div style={{ marginTop: 18 }}>
          <div style={{
            fontSize: '0.68rem',
            fontWeight: 800,
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            padding: '0 10px 8px'
          }}>
            Workspace
          </div>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {mainNav.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id as NavTab)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    border: 'none',
                    background: isActive ? 'var(--accent-gradient)' : 'transparent',
                    color: isActive ? '#ffffff' : 'var(--text-secondary)',
                    fontWeight: isActive ? 700 : 500,
                    fontSize: '0.86rem',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s ease',
                    boxShadow: isActive ? '0 4px 12px rgba(99, 102, 241, 0.28)' : 'none'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Icon size={17} color={isActive ? '#ffffff' : 'var(--text-muted)'} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span style={{
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      padding: '1px 6px',
                      borderRadius: 9999,
                      background: isActive ? 'rgba(255,255,255,0.2)' : 'var(--bg-card-subtle)',
                      color: isActive ? '#ffffff' : 'var(--text-muted)'
                    }}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Section: COPILOT & DOCS */}
        <div style={{ marginTop: 18 }}>
          <div style={{
            fontSize: '0.68rem',
            fontWeight: 800,
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            padding: '0 10px 8px'
          }}>
            Review & Learning
          </div>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {toolsNav.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id as NavTab)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    border: 'none',
                    background: isActive ? 'var(--accent-gradient)' : 'transparent',
                    color: isActive ? '#ffffff' : 'var(--text-secondary)',
                    fontWeight: isActive ? 700 : 500,
                    fontSize: '0.86rem',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s ease',
                    boxShadow: isActive ? '0 4px 12px rgba(99, 102, 241, 0.28)' : 'none'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Icon size={17} color={isActive ? '#ffffff' : 'var(--text-muted)'} />
                    <span>{item.label}</span>
                  </div>
                  {item.isNew && (
                    <span style={{
                      fontSize: '0.62rem',
                      fontWeight: 800,
                      padding: '2px 5px',
                      borderRadius: 4,
                      background: isActive ? 'rgba(255,255,255,0.2)' : 'var(--accent-emerald-soft)',
                      color: isActive ? '#ffffff' : 'var(--accent-emerald)'
                    }}>
                      AI
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* User Progression Badge & Profile */}
      <div>
        {/* Level Progression Card */}
        <div style={{
          background: 'var(--bg-card-subtle)',
          borderRadius: 'var(--radius-sm)',
          padding: '12px 14px',
          marginBottom: 12,
          border: '1px solid var(--border-subtle)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Level 3 Architect
            </span>
            <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--accent-primary)' }}>
              1,420 XP
            </span>
          </div>
          <div style={{
            height: 5,
            width: '100%',
            background: 'var(--border-light)',
            borderRadius: 9999,
            overflow: 'hidden'
          }}>
            <div style={{
              height: '100%',
              width: '68%',
              background: 'var(--accent-gradient)',
              borderRadius: 9999
            }} />
          </div>
        </div>

        {/* User Profile */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '8px 10px',
          borderRadius: 'var(--radius-sm)',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)'
        }}>
          <div style={{ position: 'relative' }}>
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
              alt="Yogesh"
              style={{ width: 34, height: 34, borderRadius: '50%', objectFit: 'cover' }}
            />
            <span style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              width: 9,
              height: 9,
              borderRadius: '50%',
              background: '#10b981',
              border: '2px solid var(--bg-sidebar)'
            }} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              Yogesh
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              Candidate Reviewer
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

