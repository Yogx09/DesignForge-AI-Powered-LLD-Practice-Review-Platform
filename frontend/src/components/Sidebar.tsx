import React from 'react';
import {
  LayoutDashboard,
  Box,
  FileCheck2,
  TrendingUp,
  GraduationCap,
  Bot,
  Bookmark,
  Settings,
  Sparkles,
  FileText
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
  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'problems', label: 'Problems', icon: Box },
    { id: 'attempts', label: 'My Attempts', icon: FileCheck2 },
    { id: 'progress', label: 'Progress', icon: TrendingUp },
    { id: 'learning', label: 'Learning Paths', icon: GraduationCap },
    { id: 'mentor', label: 'AI Mentor', icon: Bot },
    { id: 'docs', label: 'Reviewer Notes', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <aside style={{
      width: 260,
      background: 'var(--bg-sidebar)',
      borderRight: '1px solid var(--border-subtle)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '20px 16px',
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
            padding: '4px 8px 20px',
            borderBottom: '1px solid var(--border-subtle)'
          }}
        >
          <div style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: 'linear-gradient(135deg, #6366f1, #4338ca)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.35)'
          }}>
            <Sparkles size={20} color="#ffffff" />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.15rem', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              DesignLab
            </div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              Design. Build. Improve.
            </div>
          </div>
        </div>

        {/* Nav Links */}
        <nav style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id as NavTab)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '9px 12px',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  background: isActive ? 'var(--accent-gradient)' : 'transparent',
                  color: isActive ? '#ffffff' : 'var(--text-secondary)',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease',
                  boxShadow: isActive ? '0 4px 12px rgba(99, 102, 241, 0.25)' : 'none'
                }}
              >
                <Icon size={18} color={isActive ? '#ffffff' : 'var(--text-muted)'} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Promo Card & User Badge */}
      <div>
        {/* Keep Building Card */}
        <div style={{
          background: 'linear-gradient(145deg, #eef2ff, #e0e7ff)',
          borderRadius: 'var(--radius-md)',
          padding: '14px',
          marginBottom: 16,
          position: 'relative',
          overflow: 'hidden',
          border: '1px solid #c7d2fe'
        }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#4338ca', marginBottom: 2 }}>
            Keep Building 🚀
          </div>
          <div style={{ fontSize: '0.72rem', color: '#6366f1', fontStyle: 'italic', fontWeight: 600 }}>
            "Better Designs, Brighter Engineers"
          </div>
        </div>

        {/* User Profile */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '8px 10px',
          borderRadius: 'var(--radius-sm)',
          background: 'var(--bg-card-subtle)',
          border: '1px solid var(--border-subtle)'
        }}>
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=60"
            alt="Yogesh"
            style={{ width: 34, height: 34, borderRadius: '50%', objectFit: 'cover' }}
          />
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Yogesh
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              Aspiring SDE
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
