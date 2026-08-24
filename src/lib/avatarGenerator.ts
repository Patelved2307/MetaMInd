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
      primary: '#22C55E',
      secondary: '#7ED6A5',
      glow: 'rgba(34, 197, 94, 0.35)',
      border: 'rgba(34, 197, 94, 0.45)',
      badgeBg: 'rgba(34, 197, 94, 0.18)',
      badgeText: '#7ED6A5',
      progressColor: '#22C55E',
      heroGradient: 'from-[#0B1A10] via-[#122B1B] to-[#060D08]',
      pageBgGradient: 'radial-gradient(ellipse at top right, rgba(34, 197, 94, 0.15) 0%, transparent 60%)',
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
      secondary: '#8DD3FF',
      glow: 'rgba(59, 130, 246, 0.35)',
      border: 'rgba(141, 211, 255, 0.45)',
      badgeBg: 'rgba(59, 130, 246, 0.18)',
      badgeText: '#8DD3FF',
      progressColor: '#3B82F6',
      heroGradient: 'from-[#0A1628] via-[#102342] to-[#050B14]',
      pageBgGradient: 'radial-gradient(ellipse at top right, rgba(59, 130, 246, 0.15) 0%, transparent 60%)',
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
      secondary: '#F4C56A',
      glow: 'rgba(249, 115, 22, 0.35)',
      border: 'rgba(249, 115, 22, 0.45)',
      badgeBg: 'rgba(249, 115, 22, 0.18)',
      badgeText: '#F4C56A',
      progressColor: '#F97316',
      heroGradient: 'from-[#211207] via-[#361D0B] to-[#0F0803]',
      pageBgGradient: 'radial-gradient(ellipse at top right, rgba(249, 115, 22, 0.15) 0%, transparent 60%)',
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
      secondary: '#FF8B8B',
      glow: 'rgba(236, 72, 153, 0.35)',
      border: 'rgba(236, 72, 153, 0.45)',
      badgeBg: 'rgba(236, 72, 153, 0.18)',
      badgeText: '#FF8B8B',
      progressColor: '#EC4899',
      heroGradient: 'from-[#210B1B] via-[#38112D] to-[#0F050C]',
      pageBgGradient: 'radial-gradient(ellipse at top right, rgba(236, 72, 153, 0.15) 0%, transparent 60%)',
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
