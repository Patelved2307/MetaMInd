/**
 * 3D Signature Persona Avatars & Global Theme Engine
 * Exclusively uses the 4 Signature PNG Avatars (Green, Blue, Orange, Pink).
 */

export interface AvatarTheme {
  primary: string;       // Primary Accent Color
  secondary: string;     // Soft Accent Color
  glow: string;          // CSS radial background glow
  border: string;        // Glass border highlight
  badgeBg: string;       // Badge background
  badgeText: string;     // Badge text color
  progressColor: string; // Progress bar fill color
  heroGradient: string;  // Background gradient for hero banner
  pageBgGradient: string;// Full-screen app page background gradient sheen
  themeName: string;     // Theme Name
}

export interface AvatarPreset {
  id: string;
  name: string;
  category: 'green' | 'blue' | 'orange' | 'pink';
  gender: 'Girl' | 'Boy';
  url: string;
  theme: AvatarTheme;
}

export const SIGNATURE_AVATARS: AvatarPreset[] = [
  {
    id: 'green_yeo',
    name: 'YEO! Scholar Girl',
    category: 'green',
    gender: 'Girl',
    url: '/avatars/green_avatar.png',
    theme: {
      primary: '#10B981',
      secondary: '#6EE7B7',
      glow: 'rgba(16, 185, 129, 0.2)',
      border: 'rgba(110, 231, 183, 0.35)',
      badgeBg: 'rgba(16, 185, 129, 0.15)',
      badgeText: '#6EE7B7',
      progressColor: '#10B981',
      heroGradient: 'from-[#061C14] via-[#0B2E22] to-[#07090E]',
      pageBgGradient: 'radial-gradient(ellipse at top right, rgba(16, 185, 129, 0.12) 0%, transparent 60%)',
      themeName: 'Emerald Scholar Theme 🌿',
    },
  },
  {
    id: 'blue_focus',
    name: 'NO LIMITS Focus Boy',
    category: 'blue',
    gender: 'Boy',
    url: '/avatars/blue_avatar.png',
    theme: {
      primary: '#3B82F6',
      secondary: '#93C5FD',
      glow: 'rgba(59, 130, 246, 0.2)',
      border: 'rgba(147, 197, 253, 0.35)',
      badgeBg: 'rgba(59, 130, 246, 0.15)',
      badgeText: '#93C5FD',
      progressColor: '#3B82F6',
      heroGradient: 'from-[#0A1628] via-[#102342] to-[#07090E]',
      pageBgGradient: 'radial-gradient(ellipse at top right, rgba(59, 130, 246, 0.12) 0%, transparent 60%)',
      themeName: 'Electric Cyber Focus ⚡',
    },
  },
  {
    id: 'orange_stay_focused',
    name: 'STAY FOCUSED Creator Boy',
    category: 'orange',
    gender: 'Boy',
    url: '/avatars/orange_avatar.png',
    theme: {
      primary: '#F97316',
      secondary: '#FDBA74',
      glow: 'rgba(249, 115, 22, 0.2)',
      border: 'rgba(253, 186, 116, 0.35)',
      badgeBg: 'rgba(249, 115, 22, 0.15)',
      badgeText: '#FDBA74',
      progressColor: '#F97316',
      heroGradient: 'from-[#241206] via-[#3B1C0B] to-[#07090E]',
      pageBgGradient: 'radial-gradient(ellipse at top right, rgba(249, 115, 22, 0.12) 0%, transparent 60%)',
      themeName: 'Sunset Creator Theme 🔥',
    },
  },
  {
    id: 'pink_celebrate',
    name: 'CELEBRATE Joy Girl',
    category: 'pink',
    gender: 'Girl',
    url: '/avatars/pink_avatar.png',
    theme: {
      primary: '#EC4899',
      secondary: '#F472B6',
      glow: 'rgba(236, 72, 153, 0.2)',
      border: 'rgba(244, 114, 182, 0.35)',
      badgeBg: 'rgba(236, 72, 153, 0.15)',
      badgeText: '#F472B6',
      progressColor: '#EC4899',
      heroGradient: 'from-[#230B1C] via-[#3B1230] to-[#07090E]',
      pageBgGradient: 'radial-gradient(ellipse at top right, rgba(236, 72, 153, 0.12) 0%, transparent 60%)',
      themeName: 'Pink Joy Energy 💖',
    },
  },
];

export function sanitizeAvatarUrl(url?: string): string {
  if (!url) return SIGNATURE_AVATARS[0].url;
  const match = SIGNATURE_AVATARS.find(
    (a) => a.url === url || url.includes(a.category) || url.includes(a.id)
  );
  return match ? match.url : SIGNATURE_AVATARS[0].url;
}

export function getAvatarPresetByUrl(url?: string): AvatarPreset {
  const cleanUrl = sanitizeAvatarUrl(url);
  return SIGNATURE_AVATARS.find((a) => a.url === cleanUrl) || SIGNATURE_AVATARS[0];
}

export function generateUsername(fullName: string, userId: string): string {
  const parts = fullName.trim().toLowerCase().split(/\s+/);
  const firstName = parts[0] || 'learner';
  const lastName = parts.length > 1 ? parts[parts.length - 1] : '';
  const nameSlug = lastName ? `${firstName}_${lastName}` : firstName;
  const cleanSlug = nameSlug.replace(/[^a-z0-9_]/g, '');
  const uniqueCode = userId.replace(/[^a-zA-Z0-9]/g, '').substring(0, 4) || Math.floor(Math.random() * 8999 + 1000).toString();
  return `${cleanSlug}_${uniqueCode}`;
}

export function generateAvatarUrl(userId: string): string {
  const index = Math.abs(userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % SIGNATURE_AVATARS.length;
  return SIGNATURE_AVATARS[index].url;
}
