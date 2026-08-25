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
  Users,
  Menu,
  X,
  LogOut,
} from 'lucide-react';
import { generateAvatarUrl, getAvatarPresetByUrl, sanitizeAvatarUrl } from '@/lib/avatarGenerator';

interface NavItem {
  name: string;
  path: string;
  icon: React.ElementType;
  badge?: string;
}

const navItems: NavItem[] = [
  { name: 'Dashboard', path: '/app/dashboard', icon: LayoutDashboard },
  { name: 'Learn & AI Hub', path: '/app/learn', icon: BookOpen },
  { name: 'Group Study Room', path: '/app/study-room', icon: Users, badge: 'Live' },
  { name: 'Learning Map', path: '/app/learning-map', icon: Network },
  { name: 'Practice & Puzzles', path: '/app/practice', icon: Code },
  { name: 'Timed Exam', path: '/app/exam', icon: FileCheck },
  { name: 'Library', path: '/app/library', icon: Library },
  { name: 'Achievements', path: '/app/achievements', icon: Award },
  { name: 'Certificates', path: '/app/certificates', icon: ShieldCheck },
  { name: 'Profile & Theme', path: '/app/profile', icon: User },
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
  const rawAvatarUrl = profile?.avatar_url || generateAvatarUrl(user?.id || 'default');
  const avatarUrl = sanitizeAvatarUrl(rawAvatarUrl);
  const activePreset = getAvatarPresetByUrl(avatarUrl);
  const theme = activePreset.theme;

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-white/90 border-b border-slate-200 sticky top-0 z-40 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <img src="/assets/brand/metamind_logo.png" alt="MetaMind" className="h-8 w-auto object-contain" />
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 text-slate-600 hover:text-slate-900 focus:outline-none"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Backdrop for Mobile */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="lg:hidden fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40"
        />
      )}

      {/* Desktop Sidebar Container */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white/95 backdrop-blur-md border-r border-slate-200/90 transform transition-transform duration-200 ease-in-out flex flex-col justify-between shadow-sm ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-5 overflow-y-auto">
          {/* Brand Header */}
          <div className="flex flex-col gap-1 pb-5 border-b border-slate-200/80">
            <img src="/assets/brand/metamind_logo.png" alt="MetaMind Logo" className="h-10 w-auto object-contain object-left" />
            <p className="text-[10px] font-mono font-bold tracking-wider pl-0.5" style={{ color: theme.primary }}>
              {theme.themeName}
            </p>
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
                          color: theme.primary,
                          borderColor: theme.border,
                        }
                      : {}
                  }
                  className={({ isActive }) =>
                    cn(
                      'flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 border border-transparent',
                      !isActive && 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                    )
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-mono font-bold">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer with User Avatar, Profile link & Logout */}
        <div className="p-4 border-t border-slate-200/80 bg-slate-50/80 space-y-2">
          <NavLink
            to="/app/profile"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-slate-200/60 transition-colors group"
          >
            <img
              src={avatarUrl}
              alt="Avatar"
              className="w-9 h-9 rounded-xl bg-white border-2 object-cover shadow-sm transition-transform group-hover:scale-105"
              style={{ borderColor: theme.primary }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-900 truncate">
                {displayName}
              </p>
              <p className="text-[10px] truncate font-mono text-slate-500">
                {displayUsername}
              </p>
            </div>
          </NavLink>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-all duration-150 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Log Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};
