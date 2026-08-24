import React, { useState } from 'react';
import { Dialog } from './Dialog';
import { Button } from './Button';
import { SIGNATURE_AVATARS, getAvatarPresetByUrl } from '@/lib/avatarGenerator';
import { Check, Sparkles, User } from 'lucide-react';

interface AvatarSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentAvatarUrl: string;
  onSelectAvatar: (url: string) => void;
}

export const AvatarSelectorModal: React.FC<AvatarSelectorModalProps> = ({
  isOpen,
  onClose,
  currentAvatarUrl,
  onSelectAvatar,
}) => {
  const currentPreset = getAvatarPresetByUrl(currentAvatarUrl);

  // Default gender filter matching current profile persona (Girl or Boy)
  const [selectedGender, setSelectedGender] = useState<'Girl' | 'Boy'>(currentPreset.gender);

  // Filter avatars strictly by gender matching the profile requirement
  const filteredPresets = SIGNATURE_AVATARS.filter((p) => p.gender === selectedGender);

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Customize 3D Avatar & Theme"
      description={`Select a ${selectedGender} persona avatar. The website theme will automatically adjust to match your selected character!`}
      className="max-w-2xl"
    >
      <div className="space-y-6 pt-3">
        {/* Gender Toggle Filter Header */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-[#05070A] border border-white/10">
          <div className="flex items-center gap-2 text-xs font-semibold text-white/80">
            <User className="w-4 h-4 text-[#8DD3FF]" />
            <span>Profile Persona Category:</span>
          </div>

          <div className="flex items-center gap-1.5 bg-white/5 p-1 rounded-full border border-white/10">
            <button
              type="button"
              onClick={() => setSelectedGender('Boy')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                selectedGender === 'Boy'
                  ? 'bg-[#3B82F6] text-white shadow-md'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Boy Personas 👨‍💻
            </button>

            <button
              type="button"
              onClick={() => setSelectedGender('Girl')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                selectedGender === 'Girl'
                  ? 'bg-[#EC4899] text-white shadow-md'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Girl Personas 👩‍💻
            </button>
          </div>
        </div>

        {/* Gender Filtered Signature Avatars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredPresets.map((preset) => {
            const isSelected = currentAvatarUrl === preset.url;
            const theme = preset.theme;

            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => {
                  onSelectAvatar(preset.url);
                  onClose();
                }}
                className={`group relative p-4 rounded-3xl border transition-all text-left flex items-center gap-4 cursor-pointer overflow-hidden ${
                  isSelected
                    ? 'liquid-glass border-2 shadow-2xl bg-white/[0.04]'
                    : 'bg-[#0B0F14] border-white/10 hover:border-white/20 hover:bg-white/[0.02]'
                }`}
                style={{
                  borderColor: isSelected ? theme.primary : undefined,
                  boxShadow: isSelected ? `0 0 25px ${theme.glow}` : undefined,
                }}
              >
                {/* 3D Character Thumbnail */}
                <div className="relative shrink-0">
                  <img
                    src={preset.url}
                    alt={preset.name}
                    className="w-20 h-20 rounded-2xl bg-[#05070A] border border-white/10 object-cover group-hover:scale-105 transition-transform"
                  />
                  {isSelected && (
                    <div
                      className="absolute -top-1 -right-1 p-1 text-[#05070A] rounded-full font-bold shadow-md"
                      style={{ backgroundColor: theme.primary }}
                    >
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>

                {/* Avatar Info & Theme Badge */}
                <div className="flex-1 min-w-0 space-y-1.5">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: theme.primary }}
                    />
                    <h4 className="text-sm font-semibold text-white truncate">
                      {preset.name}
                    </h4>
                  </div>

                  <span
                    className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium border"
                    style={{
                      backgroundColor: theme.badgeBg,
                      color: theme.badgeText,
                      borderColor: theme.border,
                    }}
                  >
                    {theme.themeName}
                  </span>

                  <p className="text-[11px] text-white/50 leading-tight">
                    Strictly matches {preset.gender} profile persona
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Info Banner */}
        <div className="p-3.5 rounded-2xl bg-[#8DD3FF]/10 border border-[#8DD3FF]/20 flex items-center gap-2.5 text-xs text-[#8DD3FF]">
          <Sparkles className="w-4 h-4 shrink-0" />
          <span>
            Theme colors and avatar options are filtered according to your selected profile gender category ({selectedGender}).
          </span>
        </div>

        <div className="flex justify-end pt-2 border-t border-white/10">
          <Button variant="ghost" size="sm" onClick={onClose} className="cursor-pointer">
            Close
          </Button>
        </div>
      </div>
    </Dialog>
  );
};
