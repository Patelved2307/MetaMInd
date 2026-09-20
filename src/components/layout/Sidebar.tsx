import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { cn } from '@/lib/utils';
import { useAuth } from '@/features/auth';
import {
  LayoutDashboard,
  Network,
  Code,
  FileCheck,
  Award,
  User,
  Menu,
  X,
  LogOut,
  GraduationCap,
  BookOpen,
} from 'lucide-react';
import { generateAvatarUrl, sanitizeAvatarUrl } from '@/lib/avatarGenerator';
import { GSAPAvatar } from '@/components/ui/GSAPAvatar';

interface NavItem {
  name: string;
  path: string;
  icon: React.ElementType;
  badge?: string;
}

const navItems: NavItem[] = [
  { name: 'Home', path: '/app/dashboard', icon: LayoutDashboard },
  { name: 'Learn', path: '/app/chat', icon: BookOpen, badge: 'AI' },
  { name: 'Practice', path: '/app/practice', icon: Code },
  { name: 'Progress', path: '/app/learning-map', icon: Network },
  { name: 'Badges', path: '/app/achievements', icon: Award },
  { name: 'Committee', path: '/app/committee', icon: GraduationCap, badge: 'Hub' },
  { name: 'Timed Exam', path: '/app/exam', icon: FileCheck },
  { name: 'Settings', path: '/app/profile', icon: User },
];

export const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  // GSAP desktop sidebar entrance upon authenticated load
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.sidebar-brand-anim',
        { opacity: 0, x: -18, scale: 0.95 },
        { opacity: 1, x: 0, scale: 1, duration: 0.6, ease: 'back.out(1.4)' }
      );
      gsap.fromTo(
        '.sidebar-nav-item',
        { opacity: 0, x: -14 },
        { opacity: 1, x: 0, duration: 0.45, stagger: 0.04, ease: 'power2.out', delay: 0.1 }
      );
      gsap.fromTo(
        '.sidebar-footer-card',
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', delay: 0.35 }
      );
    });

    return () => ctx.revert();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/sign-in', { replace: true });
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const displayName = profile?.full_name || user?.user_metadata?.full_name || 'Student';
  const displayUsername = profile?.username ? `@${profile.username}` : user?.email || '';
  const rawAvatarUrl = profile?.avatar_url || generateAvatarUrl(user?.id || 'default');
  const avatarUrl = sanitizeAvatarUrl(rawAvatarUrl);

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <img
            src="/assets/brand/metamind_icon.png"
            alt="MetaMind"
            className="w-8 h-8 object-contain rounded-lg shadow-xs"
          />
          <span className="font-display font-bold text-slate-900 tracking-tight text-lg">MetaMind</span>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 text-slate-600 hover:text-slate-900 focus:outline-none cursor-pointer"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Backdrop for Mobile */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="lg:hidden fixed inset-0 bg-slate-900/30 backdrop-blur-xs z-40"
        />
      )}

      {/* Desktop Sidebar Container */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-60 bg-white border-r border-slate-200/80 transform transition-transform duration-200 ease-in-out flex flex-col justify-between select-none ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-4 overflow-y-auto custom-scrollbar">
          {/* Brand Header with Official MetaMind Icon */}
          <div className="sidebar-brand-anim flex items-center gap-2.5 px-2 py-3 mb-4">
            <img
              src="/assets/brand/metamind_icon.png"
              alt="MetaMind"
              className="w-9 h-9 object-contain rounded-xl shadow-xs"
            />
            <span className="font-display font-bold text-xl text-slate-900 tracking-tight">MetaMind</span>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  id={
                    item.path.includes('dashboard')
                      ? 'tour-nav-dashboard'
                      : item.path.includes('learning-map')
                      ? 'tour-nav-learning-map'
                      : item.path.includes('practice')
                      ? 'tour-nav-practice'
                      : item.path.includes('analysis')
                      ? 'tour-nav-analysis'
                      : item.path.includes('committee')
                      ? 'tour-nav-committee'
                      : undefined
                  }
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'sidebar-nav-item flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 cursor-pointer',
                      isActive
                        ? 'bg-blue-50 text-blue-600 font-semibold shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    )
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 font-mono font-bold">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom Motivational Plant Card & Profile */}
        <div className="sidebar-footer-card p-4 space-y-4">
          {/* Potted Plant Graphic note from shared design */}
          <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-50/60 to-indigo-50/40 border border-blue-100/70 flex items-center gap-3">
            <div className="text-2xl select-none shrink-0">🪴</div>
            <p className="text-xs text-indigo-900 font-medium italic leading-tight">
              Small steps create big progress.
            </p>
          </div>

          {/* User Profile Pill */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <NavLink
              to="/app/profile"
              id="tour-nav-profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 group flex-1 min-w-0 pr-2"
            >
              <GSAPAvatar
                avatarId={avatarUrl}
                size="sm"
                interactive={false}
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-800 truncate group-hover:text-indigo-600">
                  {displayName}
                </p>
                <p className="text-[10px] font-mono text-slate-400 truncate">
                  {displayUsername}
                </p>
              </div>
            </NavLink>
            <button
              onClick={handleLogout}
              title="Log Out"
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
