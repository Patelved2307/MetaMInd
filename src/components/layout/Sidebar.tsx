import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/features/auth';
import {
  LayoutDashboard,
  BookOpen,
  Network,
  Code,
  FileCheck,
  Library,
  Award,
  ShieldCheck,
  User,
  Sparkles,
  Menu,
  X,
  LogOut,
} from 'lucide-react';
import { generateAvatarUrl, getAvatarPresetByUrl } from '@/lib/avatarGenerator';

interface NavItem {
  name: string;
  path: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { name: 'Dashboard', path: '/app/dashboard', icon: LayoutDashboard },
  { name: 'Learn', path: '/app/learn', icon: BookOpen },
  { name: 'Learning Map', path: '/app/learning-map', icon: Network },
  { name: 'Practice', path: '/app/practice', icon: Code },
  { name: 'Exam', path: '/app/exam', icon: FileCheck },
  { name: 'Library', path: '/app/library', icon: Library },
  { name: 'Achievements', path: '/app/achievements', icon: Award },
  { name: 'Certificates', path: '/app/certificates', icon: ShieldCheck },
  { name: 'Profile', path: '/app/profile', icon: User },
];

export const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/sign-in', { replace: true });
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const displayName = profile?.full_name || user?.user_metadata?.full_name || 'Learner';
  const displayUsername = profile?.username ? `@${profile.username}` : user?.email || '';
  const avatarUrl = profile?.avatar_url || generateAvatarUrl(user?.id || 'default');
  const activePreset = getAvatarPresetByUrl(avatarUrl);
  const theme = activePreset.theme;

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-[#0B0F14] border-b border-white/10 sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-lg border flex items-center justify-center"
            style={{ backgroundColor: theme.badgeBg, borderColor: theme.border }}
          >
            <Sparkles className="w-4 h-4" style={{ color: theme.badgeText }} />
          </div>
          <span className="font-display text-xl text-[#F4F5F7]">Aether</span>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 text-[#8B94A3] hover:text-[#F4F5F7] focus:outline-none"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Overlay for mobile drawer */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="lg:hidden fixed inset-0 bg-[#05070A]/80 backdrop-blur-sm z-40"
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={cn(
          'fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-[#0B0F14] border-r border-white/10 flex flex-col justify-between transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="p-5 overflow-y-auto">
          {/* Brand Header */}
          <div className="flex items-center gap-3 pb-6 border-b border-white/10">
            <div
              className="w-9 h-9 rounded-xl border flex items-center justify-center shadow-sm"
              style={{ backgroundColor: theme.badgeBg, borderColor: theme.border }}
            >
              <Sparkles className="w-5 h-5" style={{ color: theme.badgeText }} />
            </div>
            <div>
              <h2 className="font-display text-2xl font-normal text-[#F4F5F7] tracking-tight">Aether</h2>
              <p className="text-[10px] uppercase tracking-widest font-medium" style={{ color: theme.badgeText }}>
                {theme.themeName}
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="mt-6 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  style={({ isActive }) =>
                    isActive
                      ? {
                          backgroundColor: theme.badgeBg,
                          color: theme.badgeText,
                          borderColor: theme.border,
                        }
                      : {}
                  }
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 border border-transparent',
                      !isActive && 'text-[#8B94A3] hover:text-[#F4F5F7] hover:bg-white/[0.03]'
                    )
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer with User Avatar, Profile link & Logout */}
        <div className="p-4 border-t border-white/10 bg-[#05070A]/50 space-y-2">
          <NavLink
            to="/app/profile"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 p-1.5 rounded-lg hover:bg-white/5 transition-colors group"
          >
            <img
              src={avatarUrl}
              alt="Avatar"
              className="w-9 h-9 rounded-xl bg-[#111722] border-2 object-cover transition-all"
              style={{ borderColor: theme.primary }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-[#F4F5F7] truncate group-hover:text-white">
                {displayName}
              </p>
              <p className="text-[10px] truncate font-mono" style={{ color: theme.badgeText }}>
                {displayUsername}
              </p>
            </div>
          </NavLink>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-[#FF8B8B] bg-[#FF8B8B]/10 hover:bg-[#FF8B8B]/20 border border-[#FF8B8B]/20 transition-all duration-150"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Log Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};
