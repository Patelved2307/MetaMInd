import React, { useState } from 'react';
import { Dialog } from './Dialog';
import { Button } from './Button';
import { SIGNATURE_AVATARS } from '@/lib/avatarGenerator';
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
  // Gender/Category filter (All, Girl, Boy)
  const [selectedFilter, setSelectedFilter] = useState<'All' | 'Girl' | 'Boy'>('All');

  const filteredPresets =
    selectedFilter === 'All'
      ? SIGNATURE_AVATARS
      : SIGNATURE_AVATARS.filter((p) => p.gender === selectedFilter);

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Customize 3D Persona & Global Theme"
      description="Select a signature 3D avatar. The entire website theme will automatically transform to match your chosen persona!"
      className="max-w-3xl"
    >
      <div className="space-y-6 pt-3">
        {/* Category Filter Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200 gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
            <User className="w-4 h-4 text-blue-600" />
            <span>Select Persona Style:</span>
          </div>

          <div className="flex items-center gap-1.5 bg-white p-1 rounded-full border border-slate-200 shadow-xs">
            <button
              type="button"
              onClick={() => setSelectedFilter('All')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                selectedFilter === 'All'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Personas ✨
            </button>

            <button
              type="button"
              onClick={() => setSelectedFilter('Boy')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                selectedFilter === 'Boy'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Boy 👨‍💻
            </button>

            <button
              type="button"
              onClick={() => setSelectedFilter('Girl')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                selectedFilter === 'Girl'
                  ? 'bg-pink-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Girl 👩‍💻
            </button>
          </div>
        </div>

        {/* Filtered Avatars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[380px] overflow-y-auto pr-1">
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
                    ? 'bg-white border-2 shadow-md'
                    : 'bg-white border-slate-200/80 hover:border-slate-300 hover:bg-slate-50'
                }`}
                style={{
                  borderColor: isSelected ? theme.primary : undefined,
                }}
              >
                {/* 3D Character Thumbnail */}
                <div className="relative shrink-0">
                  <img
                    src={preset.url}
                    alt={preset.name}
                    className="w-20 h-20 rounded-2xl bg-slate-50 border border-slate-200 object-cover group-hover:scale-105 transition-transform"
                  />
                  {isSelected && (
                    <div
                      className="absolute -top-1 -right-1 p-1 text-white rounded-full font-bold shadow-sm"
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
                    <h4 className="text-sm font-bold text-slate-900 truncate">
                      {preset.name}
                    </h4>
                  </div>

                  <span
                    className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold border"
                    style={{
                      backgroundColor: theme.badgeBg,
                      color: theme.badgeText,
                      borderColor: theme.border,
                    }}
                  >
                    {theme.themeName}
                  </span>

                  <p className="text-[11px] text-slate-500 font-medium leading-tight">
                    Avatar-driven dynamic theme & ambient glow
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Info Banner */}
        <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 flex items-center gap-2.5 text-xs text-blue-700 font-medium">
          <Sparkles className="w-4 h-4 shrink-0" />
          <span>
            Selecting any persona instantly updates the primary colors, radial glow, card highlights, and hero gradients across all pages.
          </span>
        </div>

        <div className="flex justify-end pt-2 border-t border-slate-100">
          <Button variant="ghost" size="sm" onClick={onClose} className="cursor-pointer">
            Close
          </Button>
        </div>
      </div>
    </Dialog>
  );
};
