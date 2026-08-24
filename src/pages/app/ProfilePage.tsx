import React, { useState } from 'react';
import { useAuth } from '@/features/auth';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Dialog } from '@/components/ui/Dialog';
import { User, Mail, GraduationCap, Target, Edit3, Lightbulb, Shield, Sparkles } from 'lucide-react';

import { AvatarSelectorModal } from '@/components/ui/AvatarSelectorModal';
import { generateAvatarUrl } from '@/lib/avatarGenerator';

export const ProfilePage: React.FC = () => {
  const { user, profile, updateProfile } = useAuth();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const avatarUrl = profile?.avatar_url || generateAvatarUrl(user?.id || 'demo');

  const [editForm, setEditForm] = useState({
    full_name: profile?.full_name || '',
    username: profile?.username || '',
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
      await updateProfile({ avatar_url: newUrl });
    } catch (err) {
      console.error('Failed to update avatar:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card variant="elevated" className="relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#8DD3FF]/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="relative group cursor-pointer" onClick={() => setIsAvatarModalOpen(true)}>
              <img
                src={avatarUrl}
                alt="Profile Avatar"
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#05070A] border border-white/10 p-1 object-cover group-hover:scale-105 transition-transform"
              />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#8DD3FF] text-[#05070A] rounded-full border-2 border-[#0B0F14] flex items-center justify-center font-bold text-xs" title="Change Avatar">
                ✏️
              </div>
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-semibold text-[#F4F5F7] tracking-tight">
                {profile?.full_name || 'Learner'}
              </h1>
              <p className="text-xs text-[#8B94A3] font-mono mt-0.5">
                @{profile?.username || user?.email?.split('@')[0] || 'user'}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="accent">Active Learner</Badge>
                <Badge variant="glass">Phase 2 Profile System</Badge>
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
                bio: profile?.bio || '',
                education_level: profile?.education_level || '',
                field_of_study: profile?.field_of_study || '',
                institution: profile?.institution || '',
                preferred_explanation_style: profile?.preferred_explanation_style || '',
              });
              setIsEditOpen(true);
            }}
            leftIcon={<Edit3 className="w-4 h-4" />}
          >
            Edit Profile
          </Button>
        </div>
      </Card>

      {/* Profile Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ABOUT */}
        <Card variant="default">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <User className="w-4 h-4 text-[#8DD3FF]" />
              <span>About</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {profile?.bio ? (
              <p className="text-xs text-[#F4F5F7]/90 leading-relaxed">{profile.bio}</p>
            ) : (
              <div className="p-4 rounded-lg bg-[#05070A] border border-white/5 text-center text-xs text-[#8B94A3]">
                No bio added yet. Click 'Edit Profile' to add a short learner summary.
              </div>
            )}
          </CardContent>
        </Card>

        {/* EDUCATION */}
        <Card variant="default">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <GraduationCap className="w-4 h-4 text-[#B9A7FF]" />
              <span>Education</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div className="flex justify-between border-b border-white/5 pb-2">
              <span className="text-[#8B94A3]">Education Level</span>
              <span className="font-medium text-[#F4F5F7]">{profile?.education_level || 'Not set'}</span>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-2">
              <span className="text-[#8B94A3]">Field of Study</span>
              <span className="font-medium text-[#F4F5F7]">{profile?.field_of_study || 'General'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#8B94A3]">Institution</span>
              <span className="font-medium text-[#F4F5F7]">{profile?.institution || 'Self Learning'}</span>
            </div>
          </CardContent>
        </Card>

        {/* LEARNING PREFERENCES */}
        <Card variant="default">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Target className="w-4 h-4 text-[#7ED6A5]" />
              <span>Learning Preferences</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div>
              <span className="block text-[#8B94A3] mb-1">Learning Goals</span>
              <p className="font-medium text-[#7ED6A5]">
                {profile?.learning_goal || 'Understand academic subjects'}
              </p>
            </div>
            <div className="pt-2 border-t border-white/5">
              <span className="block text-[#8B94A3] mb-1">Preferred Explanation Style</span>
              <div className="flex items-center gap-1.5 text-[#8DD3FF] font-medium">
                <Lightbulb className="w-3.5 h-3.5" />
                <span>{profile?.preferred_explanation_style || 'Step-by-step'}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ACCOUNT */}
        <Card variant="default">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Shield className="w-4 h-4 text-[#F4C56A]" />
              <span>Account & Security</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#8B94A3]" />
              <span className="text-[#F4F5F7]">{user?.email}</span>
            </div>
            <div className="p-3 rounded-lg bg-[#05070A] border border-white/5 text-[11px] text-[#8B94A3]">
              Supabase Authentication Provider • Session Active
            </div>
          </CardContent>
        </Card>
      </div>

      {/* EDIT PROFILE DIALOG */}
      <Dialog
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="Edit Learner Profile"
        description="Update your profile information and preferences."
      >
        <form onSubmit={handleSaveProfile} className="space-y-4 pt-2">
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
            <label className="block text-xs font-medium text-[#8B94A3] mb-1.5">Bio</label>
            <textarea
              rows={3}
              value={editForm.bio}
              onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
              className="w-full bg-[#05070A] border border-white/10 rounded-lg text-xs p-3 text-[#F4F5F7] outline-none focus:border-[#8DD3FF]/50"
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

          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <Button variant="ghost" size="sm" type="button" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" isLoading={isSaving} rightIcon={<Sparkles className="w-3.5 h-3.5" />}>
              Save Changes
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
