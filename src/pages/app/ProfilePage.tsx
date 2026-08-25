import React, { useState } from 'react';
import { useAuth } from '@/features/auth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Dialog } from '@/components/ui/Dialog';
import { User, Mail, GraduationCap, Target, Edit3, Lightbulb, Shield, Sparkles, Check } from 'lucide-react';

import { AvatarSelectorModal } from '@/components/ui/AvatarSelectorModal';
import { generateAvatarUrl, getAvatarPresetByUrl, sanitizeAvatarUrl, SIGNATURE_AVATARS } from '@/lib/avatarGenerator';

export const ProfilePage: React.FC = () => {
  const { user, profile, updateProfile } = useAuth();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const rawAvatarUrl = profile?.avatar_url || generateAvatarUrl(user?.id || 'demo');
  const avatarUrl = sanitizeAvatarUrl(rawAvatarUrl);
  const activePreset = getAvatarPresetByUrl(avatarUrl);
  const theme = activePreset.theme;

  const [editForm, setEditForm] = useState({
    full_name: profile?.full_name || '',
    username: profile?.username || '',
    avatar_url: avatarUrl,
    bio: profile?.bio || '',
    education_level: profile?.education_level || '',
    field_of_study: profile?.field_of_study || '',
    institution: profile?.institution || '',
    preferred_explanation_style: profile?.preferred_explanation_style || '',
  });

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateProfile(editForm);
      setIsEditOpen(false);
    } catch (err: any) {
      alert(err.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSelectAvatar = async (newUrl: string) => {
    try {
      const cleanUrl = sanitizeAvatarUrl(newUrl);
      setEditForm((prev) => ({ ...prev, avatar_url: cleanUrl }));
      await updateProfile({ avatar_url: cleanUrl });
    } catch (err) {
      console.error('Failed to update avatar:', err);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16 text-slate-800 selection:bg-blue-100 font-sans">
      {/* Dynamic Radial Ambient Sheen */}
      <div
        className="fixed top-0 right-0 w-[600px] h-[600px] rounded-full blur-[140px] pointer-events-none opacity-20 z-0 transition-all duration-700"
        style={{ background: theme.glow }}
      />

      {/* Profile Header */}
      <div className="rounded-3xl p-6 sm:p-8 bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-md relative overflow-hidden z-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="relative group cursor-pointer" onClick={() => setIsAvatarModalOpen(true)}>
              <img
                src={avatarUrl}
                alt="Profile Avatar"
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white border-2 p-1 object-cover group-hover:scale-105 transition-transform shadow-md"
                style={{ borderColor: theme.primary }}
              />
              <div
                className="absolute -bottom-1 -right-1 w-6 h-6 text-white rounded-full border-2 border-white flex items-center justify-center font-bold text-xs shadow-sm cursor-pointer"
                style={{ backgroundColor: theme.primary }}
                title="Change Avatar & Theme"
              >
                ✏️
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 tracking-tight">
                  {profile?.full_name || 'Vedika'}
                </h1>
                <span
                  className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border"
                  style={{ backgroundColor: theme.badgeBg, color: theme.badgeText, borderColor: theme.border }}
                >
                  {theme.themeName}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-mono mt-0.5">
                @{profile?.username || user?.email?.split('@')[0] || 'vedika_usr1'}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold font-mono">
                  Active Learner
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold font-mono">
                  Avatar-Driven Theme Sync
                </span>
              </div>
            </div>
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setEditForm({
                full_name: profile?.full_name || '',
                username: profile?.username || '',
                avatar_url: avatarUrl,
                bio: profile?.bio || '',
                education_level: profile?.education_level || '',
                field_of_study: profile?.field_of_study || '',
                institution: profile?.institution || '',
                preferred_explanation_style: profile?.preferred_explanation_style || '',
              });
              setIsEditOpen(true);
            }}
            className="text-xs bg-slate-100 text-slate-800 border-slate-200 hover:bg-slate-200 cursor-pointer shadow-sm"
            leftIcon={<Edit3 className="w-4 h-4" />}
          >
            Edit Profile
          </Button>
        </div>
      </div>

      {/* Profile Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
        {/* ABOUT */}
        <div className="rounded-3xl p-6 bg-white border border-slate-200/80 shadow-sm space-y-3">
          <h2 className="flex items-center gap-2 text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
            <User className="w-4 h-4 text-blue-600" />
            <span>About Learner</span>
          </h2>
          {profile?.bio ? (
            <p className="text-xs text-slate-700 leading-relaxed font-medium">{profile.bio}</p>
          ) : (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-500 font-medium">
              No bio added yet. Click 'Edit Profile' to add a short learner summary.
            </div>
          )}
        </div>

        {/* EDUCATION */}
        <div className="rounded-3xl p-6 bg-white border border-slate-200/80 shadow-sm space-y-3">
          <h2 className="flex items-center gap-2 text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
            <GraduationCap className="w-4 h-4 text-purple-600" />
            <span>Education & Background</span>
          </h2>
          <div className="space-y-2 text-xs font-mono">
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <span className="text-slate-500">Education Level:</span>
              <span className="font-bold text-slate-900">{profile?.education_level || 'Undergraduate'}</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <span className="text-slate-500">Field of Study:</span>
              <span className="font-bold text-slate-900">{profile?.field_of_study || 'Computer Science & AI'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Institution:</span>
              <span className="font-bold text-slate-900">{profile?.institution || 'Self Learning'}</span>
            </div>
          </div>
        </div>

        {/* LEARNING PREFERENCES */}
        <div className="rounded-3xl p-6 bg-white border border-slate-200/80 shadow-sm space-y-3">
          <h2 className="flex items-center gap-2 text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
            <Target className="w-4 h-4 text-emerald-600" />
            <span>Learning Goals & Preferences</span>
          </h2>
          <div className="space-y-3 text-xs">
            <div>
              <span className="block text-slate-500 font-mono mb-1">Learning Goals</span>
              <p className="font-bold text-emerald-700">
                {profile?.learning_goal || 'Understand academic subjects & master code algorithms'}
              </p>
            </div>
            <div className="pt-2 border-t border-slate-100">
              <span className="block text-slate-500 font-mono mb-1">Preferred Explanation Style</span>
              <div className="flex items-center gap-1.5 text-blue-600 font-bold">
                <Lightbulb className="w-3.5 h-3.5" />
                <span>{profile?.preferred_explanation_style || 'Step-by-step'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ACCOUNT & SECURITY */}
        <div className="rounded-3xl p-6 bg-white border border-slate-200/80 shadow-sm space-y-3">
          <h2 className="flex items-center gap-2 text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
            <Shield className="w-4 h-4 text-amber-600" />
            <span>Account Status</span>
          </h2>
          <div className="space-y-3 text-xs">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-slate-400" />
              <span className="text-slate-800 font-medium">{user?.email || 'vedika@metamind.app'}</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-[11px] font-mono text-slate-500">
              Authentication Provider: Supabase • Session Active
            </div>
          </div>
        </div>
      </div>

      {/* EDIT PROFILE DIALOG */}
      <Dialog
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="Edit Learner Profile & Select Avatar"
        description="Update your profile information and select your preferred 3D cartoon avatar."
        className="max-w-2xl"
      >
        <form onSubmit={handleSaveProfile} className="space-y-4 pt-2 max-h-[75vh] overflow-y-auto pr-1">
          {/* AVATAR SELECTOR INSIDE EDIT PROFILE FORM */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-2 flex items-center justify-between">
              <span>Choose Profile 3D Cartoon Avatar Persona:</span>
              <span className="text-[10px] font-mono text-blue-600">10 Presets Available</span>
            </label>
            <div className="grid grid-cols-5 gap-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-200">
              {SIGNATURE_AVATARS.map((preset) => {
                const isSelected = editForm.avatar_url === preset.url;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => setEditForm({ ...editForm, avatar_url: preset.url })}
                    className={`relative rounded-xl overflow-hidden border-2 p-1 transition-all cursor-pointer bg-white group hover:scale-105 ${
                      isSelected ? 'border-blue-600 shadow-md ring-2 ring-blue-400/50' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <img src={preset.url} alt={preset.name} className="w-full h-12 rounded-lg object-cover" />
                    {isSelected && (
                      <div className="absolute top-0.5 right-0.5 bg-blue-600 text-white rounded-full p-0.5">
                        <Check className="w-3 h-3" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <Input
            label="Full Name"
            value={editForm.full_name}
            onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
          />

          <Input
            label="Username"
            value={editForm.username}
            onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
          />

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">Bio</label>
            <textarea
              rows={2}
              value={editForm.bio}
              onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl text-xs p-3 text-slate-800 outline-none focus:border-blue-500"
              placeholder="Tell us about your learning journey..."
            />
          </div>

          <Input
            label="Education Level"
            value={editForm.education_level}
            onChange={(e) => setEditForm({ ...editForm, education_level: e.target.value })}
          />

          <Input
            label="Field of Study"
            value={editForm.field_of_study}
            onChange={(e) => setEditForm({ ...editForm, field_of_study: e.target.value })}
          />

          <Input
            label="Institution"
            value={editForm.institution}
            onChange={(e) => setEditForm({ ...editForm, institution: e.target.value })}
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button variant="ghost" size="sm" type="button" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              type="submit"
              isLoading={isSaving}
              rightIcon={<Sparkles className="w-3.5 h-3.5" />}
              style={{ backgroundColor: theme.primary, color: '#FFFFFF' }}
            >
              Save Profile Changes
            </Button>
          </div>
        </form>
      </Dialog>

      {/* AVATAR SELECTOR MODAL */}
      <AvatarSelectorModal
        isOpen={isAvatarModalOpen}
        onClose={() => setIsAvatarModalOpen(false)}
        currentAvatarUrl={avatarUrl}
        onSelectAvatar={handleSelectAvatar}
      />
    </div>
  );
};
