import React, { useState, useEffect } from 'react';
import { useAuth } from '@/features/auth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Dialog } from '@/components/ui/Dialog';
import {
  User,
  Mail,
  GraduationCap,
  Target,
  Edit3,
  Lightbulb,
  Shield,
  Sparkles,
  Check,
  Award,
  Flame,
  CheckCircle2,
  Save,
  X,
} from 'lucide-react';

import { AvatarSelectorModal } from '@/components/ui/AvatarSelectorModal';
import { GSAPAvatar } from '@/components/ui/GSAPAvatar';
import { generateAvatarUrl, getAvatarPresetByUrl, sanitizeAvatarUrl, SIGNATURE_AVATARS } from '@/lib/avatarGenerator';

export const ProfilePage: React.FC = () => {
  const { user, profile, updateProfile } = useAuth();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Quick inline bio editing state
  const [isEditingBioInline, setIsEditingBioInline] = useState(false);
  const [inlineBioText, setInlineBioText] = useState('');
  const [isSavingInlineBio, setIsSavingInlineBio] = useState(false);

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

  // Sync edit form with profile updates
  useEffect(() => {
    if (profile) {
      setEditForm({
        full_name: profile.full_name || '',
        username: profile.username || '',
        avatar_url: sanitizeAvatarUrl(profile.avatar_url || avatarUrl),
        bio: profile.bio || '',
        education_level: profile.education_level || '',
        field_of_study: profile.field_of_study || '',
        institution: profile.institution || '',
        preferred_explanation_style: profile.preferred_explanation_style || '',
      });
      setInlineBioText(profile.bio || '');
    }
  }, [profile, avatarUrl]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateProfile(editForm);
      setIsEditOpen(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3500);
    } catch (err: any) {
      alert(err.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveInlineBio = async () => {
    setIsSavingInlineBio(true);
    try {
      await updateProfile({ bio: inlineBioText });
      setIsEditingBioInline(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3500);
    } catch (err) {
      console.error('Failed to save bio:', err);
    } finally {
      setIsSavingInlineBio(false);
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
      {/* Toast Banner on Save Success */}
      {saveSuccess && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-between shadow-xs animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Profile updated successfully! All changes have been synchronized.</span>
          </div>
          <button
            type="button"
            onClick={() => setSaveSuccess(false)}
            className="text-emerald-600 hover:text-emerald-900 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Profile Header Card */}
      <div id="tour-profile-hero" className="rounded-3xl p-6 sm:p-8 bg-white border border-slate-200/90 shadow-xs relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="relative group cursor-pointer" onClick={() => setIsAvatarModalOpen(true)}>
              <GSAPAvatar
                avatarId={avatarUrl}
                size="lg"
                interactive={true}
                className="group-hover:scale-105 transition-transform"
              />
              <div
                className="absolute -bottom-1 -right-1 w-6 h-6 text-white rounded-full border-2 border-white flex items-center justify-center font-bold text-xs shadow-xs cursor-pointer"
                style={{ backgroundColor: theme.primary }}
                title="Change Avatar & Theme"
              >
                ✏️
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 tracking-tight">
                  {profile?.full_name || 'Student'}
                </h1>
                <span
                  className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border"
                  style={{ backgroundColor: theme.badgeBg, color: theme.badgeText, borderColor: theme.border }}
                >
                  {theme.themeName}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-mono mt-0.5">
                @{profile?.username || user?.email?.split('@')[0] || 'student_1'}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold font-mono">
                  Active Learner
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-bold font-mono">
                  MetaMind Certified
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
            className="text-xs bg-slate-100 text-slate-800 border-slate-200 hover:bg-slate-200 cursor-pointer shadow-xs"
            leftIcon={<Edit3 className="w-4 h-4" />}
          >
            Edit Profile
          </Button>
        </div>
      </div>

      {/* Learning Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono text-slate-400 font-semibold block">Mastery</span>
            <span className="text-base font-bold text-slate-900">5/7 Concepts</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono text-slate-400 font-semibold block">Streak</span>
            <span className="text-base font-bold text-slate-900">5 Days 🔥</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono text-slate-400 font-semibold block">Total XP</span>
            <span className="text-base font-bold text-slate-900">850 XP</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono text-slate-400 font-semibold block">Accuracy</span>
            <span className="text-base font-bold text-slate-900">88%</span>
          </div>
        </div>
      </div>

      {/* Profile Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ABOUT / BIO SECTION WITH INLINE EDIT CAPABILITY */}
        <div className="rounded-3xl p-6 bg-white border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h2 className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <User className="w-4 h-4 text-indigo-600" />
              <span>About Learner</span>
            </h2>
            {!isEditingBioInline ? (
              <button
                type="button"
                onClick={() => {
                  setInlineBioText(profile?.bio || '');
                  setIsEditingBioInline(true);
                }}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 cursor-pointer"
              >
                <Edit3 className="w-3 h-3" />
                <span>Quick Edit Bio</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditingBioInline(false)}
                  className="text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveInlineBio}
                  disabled={isSavingInlineBio}
                  className="text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 px-2.5 py-1 rounded-lg flex items-center gap-1 cursor-pointer shadow-xs"
                >
                  <Save className="w-3 h-3" />
                  <span>Save</span>
                </button>
              </div>
            )}
          </div>

          {isEditingBioInline ? (
            <div className="space-y-2 pt-1">
              <textarea
                rows={3}
                value={inlineBioText}
                onChange={(e) => setInlineBioText(e.target.value)}
                placeholder="Tell us about your learning journey..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl text-xs p-3 text-slate-800 placeholder:text-slate-400 outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
              />
              <p className="text-[11px] text-slate-400">
                Type your bio in the box above and click Save to update your profile.
              </p>
            </div>
          ) : profile?.bio ? (
            <p className="text-xs text-slate-700 leading-relaxed font-medium pt-1">
              {profile.bio}
            </p>
          ) : (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-500 font-medium space-y-2">
              <p>No bio added yet.</p>
              <button
                type="button"
                onClick={() => {
                  setInlineBioText('');
                  setIsEditingBioInline(true);
                }}
                className="text-xs font-semibold text-indigo-600 hover:underline cursor-pointer"
              >
                + Add a short learner summary
              </button>
            </div>
          )}
        </div>

        {/* EDUCATION & BACKGROUND */}
        <div className="rounded-3xl p-6 bg-white border border-slate-200/80 shadow-xs space-y-3">
          <h2 className="flex items-center gap-2 text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
            <GraduationCap className="w-4 h-4 text-purple-600" />
            <span>Education & Background</span>
          </h2>
          <div className="space-y-2.5 text-xs font-mono">
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
              <span className="font-bold text-slate-900">{profile?.institution || 'Self Learning Academy'}</span>
            </div>
          </div>
        </div>

        {/* LEARNING PREFERENCES */}
        <div className="rounded-3xl p-6 bg-white border border-slate-200/80 shadow-xs space-y-3">
          <h2 className="flex items-center gap-2 text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
            <Target className="w-4 h-4 text-emerald-600" />
            <span>Learning Goals & Style</span>
          </h2>
          <div className="space-y-3 text-xs">
            <div>
              <span className="block text-slate-500 font-mono mb-1">Learning Goals</span>
              <p className="font-bold text-emerald-700">
                {profile?.learning_goal || 'Master database systems, data structures & algorithms for exams'}
              </p>
            </div>
            <div className="pt-2 border-t border-slate-100">
              <span className="block text-slate-500 font-mono mb-1">Preferred Explanation Style</span>
              <div className="flex items-center gap-1.5 text-indigo-600 font-bold">
                <Lightbulb className="w-3.5 h-3.5" />
                <span>{profile?.preferred_explanation_style || 'Step-by-step with examples'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ACCOUNT & SECURITY */}
        <div className="rounded-3xl p-6 bg-white border border-slate-200/80 shadow-xs space-y-3">
          <h2 className="flex items-center gap-2 text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
            <Shield className="w-4 h-4 text-amber-600" />
            <span>Account Status</span>
          </h2>
          <div className="space-y-3 text-xs">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-slate-400" />
              <span className="text-slate-800 font-medium">{user?.email || 'student@metamind.app'}</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-[11px] font-mono text-slate-500">
              Authentication: Supabase Auth • Active Session Encrypted
            </div>
          </div>
        </div>
      </div>

      {/* EDIT PROFILE DIALOG (CLEAN WHITE MODAL) */}
      <Dialog
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="Edit Learner Profile"
        description="Update your learner information and select your preferred avatar."
        className="max-w-2xl bg-white text-slate-900 border border-slate-200 shadow-2xl"
      >
        <form onSubmit={handleSaveProfile} className="space-y-4 pt-2 max-h-[75vh] overflow-y-auto pr-1">
          {/* Avatar Preset Grid */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-2 flex items-center justify-between">
              <span>Choose Profile 3D Avatar Persona:</span>
              <span className="text-[10px] font-mono text-indigo-600">10 Presets Available</span>
            </label>
            <div className="grid grid-cols-5 gap-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-200">
              {SIGNATURE_AVATARS.map((preset) => {
                const isSelected = sanitizeAvatarUrl(editForm.avatar_url) === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => setEditForm({ ...editForm, avatar_url: preset.id })}
                    className={`relative rounded-2xl overflow-hidden border-2 p-2 flex flex-col items-center justify-center transition-all cursor-pointer bg-white group hover:scale-105 ${
                      isSelected ? 'border-indigo-600 shadow-md ring-2 ring-indigo-400/50' : 'border-slate-200 hover:border-slate-300'
                    }`}
                    title={preset.name}
                  >
                    <GSAPAvatar avatarId={preset.id} size="sm" interactive={false} />
                    <span className="text-[10px] font-bold text-slate-700 mt-1 truncate max-w-full">
                      {preset.name.split(' ')[0]}
                    </span>
                    {isSelected && (
                      <div className="absolute top-1 right-1 bg-indigo-600 text-white rounded-full p-0.5 shadow-xs">
                        <Check className="w-2.5 h-2.5" />
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
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Bio / Learner Summary
            </label>
            <textarea
              rows={3}
              value={editForm.bio}
              onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl text-sm p-3 text-slate-800 placeholder:text-slate-400 outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
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
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
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
