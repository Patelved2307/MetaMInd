/**
 * Avatar-Driven Dynamic Color Theme Engine (Light Mode Architecture)
 * Supports 10 Signature 3D Cartoon Avatars stored cleanly under /assets/avatars/
 */

export interface AvatarTheme {
  primary: string;       // Primary Accent Color
  secondary: string;     // Soft Accent Color
  glow: string;          // CSS radial background glow tint
  border: string;        // Light glass border highlight
  badgeBg: string;       // Badge background
  badgeText: string;     // Badge text color
  progressColor: string; // Progress bar fill color
  heroGradient: string;  // Background gradient for hero banner
  pageBgGradient: string;// Full-screen app page background gradient sheen
  themeName: string;     // Theme Name
  isLightMode: boolean;  // Enforce Light Theme Flag
}

export interface AvatarVectorStyle {
  archetype: 'scholar' | 'cyber' | 'solar' | 'joy' | 'fresh' | 'lofi' | 'retro' | 'teal' | 'bear' | 'skeleton';
  skin: string;
  skinShadow: string;
  hair: string;
  hairHighlight: string;
  clothing: string;
  accessory: 'glasses' | 'headphones' | 'visor' | 'earrings' | 'cap' | 'beanie' | 'hoodie' | 'none';
  backdrop: string;
}

export interface AvatarPreset {
  id: string;
  name: string;
  category: 'green' | 'blue' | 'orange' | 'pink' | 'lime' | 'lofi' | 'retro' | 'teal' | 'bear' | 'skeleton';
  gender: 'Girl' | 'Boy' | 'Mascot';
  url: string;
  theme: AvatarTheme;
  avatarStyle: AvatarVectorStyle;
}

export const SIGNATURE_AVATARS: AvatarPreset[] = [
  {
    id: 'green_yeo',
    name: 'Emerald Scholar',
    category: 'green',
    gender: 'Girl',
    url: 'green_yeo',
    theme: {
      primary: '#059669',
      secondary: '#10B981',
      glow: 'rgba(16, 185, 129, 0.2)',
      border: 'rgba(5, 150, 105, 0.25)',
      badgeBg: 'rgba(16, 185, 129, 0.12)',
      badgeText: '#047857',
      progressColor: '#059669',
      heroGradient: 'from-[#ECFDF5] via-[#D1FAE5] to-[#A7F3D0]',
      pageBgGradient: 'radial-gradient(ellipse at top right, rgba(16, 185, 129, 0.15) 0%, transparent 65%)',
      themeName: 'Emerald Scholar 🌿',
      isLightMode: true,
    },
    avatarStyle: {
      archetype: 'scholar',
      skin: '#FFDFBF',
      skinShadow: '#F5BE98',
      hair: '#1E293B',
      hairHighlight: '#334155',
      clothing: '#065F46',
      accessory: 'glasses',
      backdrop: '#064E3B',
    },
  },
  {
    id: 'blue_focus',
    name: 'Electric Cyber Boy',
    category: 'blue',
    gender: 'Boy',
    url: 'blue_focus',
    theme: {
      primary: '#2563EB',
      secondary: '#3B82F6',
      glow: 'rgba(37, 99, 235, 0.2)',
      border: 'rgba(37, 99, 235, 0.25)',
      badgeBg: 'rgba(37, 99, 235, 0.12)',
      badgeText: '#1D4ED8',
      progressColor: '#2563EB',
      heroGradient: 'from-[#EFF6FF] via-[#DBEAFE] to-[#BFDBFE]',
      pageBgGradient: 'radial-gradient(ellipse at top right, rgba(37, 99, 235, 0.15) 0%, transparent 65%)',
      themeName: 'Electric Cyber ⚡',
      isLightMode: true,
    },
    avatarStyle: {
      archetype: 'cyber',
      skin: '#FCD34D',
      skinShadow: '#F59E0B',
      hair: '#1E1B4B',
      hairHighlight: '#3B82F6',
      clothing: '#1E3A8A',
      accessory: 'visor',
      backdrop: '#172554',
    },
  },
  {
    id: 'orange_luffy',
    name: 'Sunset Maverick',
    category: 'orange',
    gender: 'Boy',
    url: 'orange_luffy',
    theme: {
      primary: '#EA580C',
      secondary: '#F97316',
      glow: 'rgba(234, 88, 12, 0.2)',
      border: 'rgba(234, 88, 12, 0.25)',
      badgeBg: 'rgba(234, 88, 12, 0.12)',
      badgeText: '#C2410C',
      progressColor: '#EA580C',
      heroGradient: 'from-[#FFF7ED] via-[#FFEDD5] to-[#FED7AA]',
      pageBgGradient: 'radial-gradient(ellipse at top right, rgba(234, 88, 12, 0.15) 0%, transparent 65%)',
      themeName: 'Sunset Maverick 🔥',
      isLightMode: true,
    },
    avatarStyle: {
      archetype: 'solar',
      skin: '#FED7AA',
      skinShadow: '#FB923C',
      hair: '#18181B',
      hairHighlight: '#71717A',
      clothing: '#C2410C',
      accessory: 'none',
      backdrop: '#7C2D12',
    },
  },
  {
    id: 'pink_celebrate',
    name: 'Joy Creator Girl',
    category: 'pink',
    gender: 'Girl',
    url: 'pink_celebrate',
    theme: {
      primary: '#DB2777',
      secondary: '#EC4899',
      glow: 'rgba(219, 39, 119, 0.2)',
      border: 'rgba(219, 39, 119, 0.25)',
      badgeBg: 'rgba(219, 39, 119, 0.12)',
      badgeText: '#BE185D',
      progressColor: '#DB2777',
      heroGradient: 'from-[#FDF2F8] via-[#FCE7F3] to-[#FBCFE8]',
      pageBgGradient: 'radial-gradient(ellipse at top right, rgba(219, 39, 119, 0.15) 0%, transparent 65%)',
      themeName: 'Pink Joy 💖',
      isLightMode: true,
    },
    avatarStyle: {
      archetype: 'joy',
      skin: '#FFE4E6',
      skinShadow: '#FDA4AF',
      hair: '#831843',
      hairHighlight: '#BE185D',
      clothing: '#9D174D',
      accessory: 'earrings',
      backdrop: '#500724',
    },
  },
  {
    id: 'green_shinchan',
    name: 'Lime Prodigy',
    category: 'lime',
    gender: 'Boy',
    url: 'green_shinchan',
    theme: {
      primary: '#65A30D',
      secondary: '#84CC16',
      glow: 'rgba(101, 163, 13, 0.2)',
      border: 'rgba(101, 163, 13, 0.25)',
      badgeBg: 'rgba(101, 163, 13, 0.12)',
      badgeText: '#4D7C0F',
      progressColor: '#65A30D',
      heroGradient: 'from-[#F7FEE7] via-[#ECFCCB] to-[#D9F99D]',
      pageBgGradient: 'radial-gradient(ellipse at top right, rgba(101, 163, 13, 0.15) 0%, transparent 65%)',
      themeName: 'Lime Fresh 🍏',
      isLightMode: true,
    },
    avatarStyle: {
      archetype: 'fresh',
      skin: '#FEF08A',
      skinShadow: '#FACC15',
      hair: '#14532D',
      hairHighlight: '#15803D',
      clothing: '#3F6212',
      accessory: 'none',
      backdrop: '#1A2E05',
    },
  },
  {
    id: 'lofi_headphones',
    name: 'Warm Lo-Fi Girl',
    category: 'lofi',
    gender: 'Girl',
    url: 'lofi_headphones',
    theme: {
      primary: '#D97706',
      secondary: '#F59E0B',
      glow: 'rgba(217, 119, 6, 0.2)',
      border: 'rgba(217, 119, 6, 0.25)',
      badgeBg: 'rgba(217, 119, 6, 0.12)',
      badgeText: '#B45309',
      progressColor: '#D97706',
      heroGradient: 'from-[#FFFBEB] via-[#FEF3C7] to-[#FDE68A]',
      pageBgGradient: 'radial-gradient(ellipse at top right, rgba(217, 119, 6, 0.15) 0%, transparent 65%)',
      themeName: 'Warm Lo-Fi 🎧',
      isLightMode: true,
    },
    avatarStyle: {
      archetype: 'lofi',
      skin: '#FDE68A',
      skinShadow: '#F59E0B',
      hair: '#451A03',
      hairHighlight: '#78350F',
      clothing: '#92400E',
      accessory: 'headphones',
      backdrop: '#451A03',
    },
  },
  {
    id: 'retro_stripes',
    name: 'Retro Slate Stylist',
    category: 'retro',
    gender: 'Girl',
    url: 'retro_stripes',
    theme: {
      primary: '#475569',
      secondary: '#64748B',
      glow: 'rgba(71, 85, 105, 0.2)',
      border: 'rgba(71, 85, 105, 0.25)',
      badgeBg: 'rgba(71, 85, 105, 0.12)',
      badgeText: '#334155',
      progressColor: '#475569',
      heroGradient: 'from-[#F8FAFC] via-[#F1F5F9] to-[#E2E8F0]',
      pageBgGradient: 'radial-gradient(ellipse at top right, rgba(71, 85, 105, 0.15) 0%, transparent 65%)',
      themeName: 'Retro Slate 🕶️',
      isLightMode: true,
    },
    avatarStyle: {
      archetype: 'scholar',
      skin: '#FED7AA',
      skinShadow: '#FB923C',
      hair: '#0F172A',
      hairHighlight: '#334155',
      clothing: '#334155',
      accessory: 'cap',
      backdrop: '#0F172A',
    },
  },
  {
    id: 'teal_beanie',
    name: 'Teal Voyager',
    category: 'teal',
    gender: 'Boy',
    url: 'teal_beanie',
    theme: {
      primary: '#0D9488',
      secondary: '#14B8A6',
      glow: 'rgba(13, 148, 136, 0.2)',
      border: 'rgba(13, 148, 136, 0.25)',
      badgeBg: 'rgba(13, 148, 136, 0.12)',
      badgeText: '#0F766E',
      progressColor: '#0D9488',
      heroGradient: 'from-[#F0FDFA] via-[#CCFBF1] to-[#99F6E4]',
      pageBgGradient: 'radial-gradient(ellipse at top right, rgba(13, 148, 136, 0.15) 0%, transparent 65%)',
      themeName: 'Deep Teal 🌊',
      isLightMode: true,
    },
    avatarStyle: {
      archetype: 'cyber',
      skin: '#FFEDD5',
      skinShadow: '#FDBA74',
      hair: '#042F2E',
      hairHighlight: '#115E59',
      clothing: '#0F766E',
      accessory: 'beanie',
      backdrop: '#134E4A',
    },
  },
  {
    id: 'teddy_oversize',
    name: 'Cyber Bear Mascot',
    category: 'bear',
    gender: 'Mascot',
    url: 'teddy_oversize',
    theme: {
      primary: '#9A3412',
      secondary: '#C2410C',
      glow: 'rgba(154, 52, 18, 0.2)',
      border: 'rgba(154, 52, 18, 0.25)',
      badgeBg: 'rgba(154, 52, 18, 0.12)',
      badgeText: '#7C2D12',
      progressColor: '#9A3412',
      heroGradient: 'from-[#FFF7ED] via-[#FFEDD5] to-[#FED7AA]',
      pageBgGradient: 'radial-gradient(ellipse at top right, rgba(154, 52, 18, 0.15) 0%, transparent 65%)',
      themeName: 'Streetwear Bear 🧸',
      isLightMode: true,
    },
    avatarStyle: {
      archetype: 'bear',
      skin: '#C2410C',
      skinShadow: '#9A3412',
      hair: '#7C2D12',
      hairHighlight: '#EA580C',
      clothing: '#7C2D12',
      accessory: 'headphones',
      backdrop: '#431407',
    },
  },
  {
    id: 'neon_skeleton',
    name: 'Neural Phantom Android',
    category: 'skeleton',
    gender: 'Mascot',
    url: 'neon_skeleton',
    theme: {
      primary: '#9333EA',
      secondary: '#A855F7',
      glow: 'rgba(147, 51, 234, 0.2)',
      border: 'rgba(147, 51, 234, 0.25)',
      badgeBg: 'rgba(147, 51, 234, 0.12)',
      badgeText: '#7E22CE',
      progressColor: '#9333EA',
      heroGradient: 'from-[#FAF5FF] via-[#F3E8FF] to-[#E9D5FF]',
      pageBgGradient: 'radial-gradient(ellipse at top right, rgba(147, 51, 234, 0.15) 0%, transparent 65%)',
      themeName: 'Neon Purple 💜',
      isLightMode: true,
    },
    avatarStyle: {
      archetype: 'skeleton',
      skin: '#0F172A',
      skinShadow: '#020617',
      hair: '#581C87',
      hairHighlight: '#A855F7',
      clothing: '#581C87',
      accessory: 'none',
      backdrop: '#3B0764',
    },
  },
];

export function sanitizeAvatarUrl(url?: string): string {
  if (!url) return SIGNATURE_AVATARS[0].id;
  
  // Exact match by id or url
  const exactMatch = SIGNATURE_AVATARS.find((a) => a.id === url || a.url === url);
  if (exactMatch) return exactMatch.id;

  // Keyword match for legacy URLs e.g. "/assets/avatars/female/yeo_scholar_girl.png" -> "green_yeo"
  const clean = url.toLowerCase();
  const keywordMatch = SIGNATURE_AVATARS.find(
    (a) => clean.includes(a.category) || clean.includes(a.id) || (clean.includes('yeo') && a.id === 'green_yeo') || (clean.includes('focus') && a.id === 'blue_focus') || (clean.includes('luffy') && a.id === 'orange_luffy') || (clean.includes('joy') && a.id === 'pink_celebrate') || (clean.includes('shinchan') && a.id === 'green_shinchan') || (clean.includes('lofi') && a.id === 'lofi_headphones') || (clean.includes('retro') && a.id === 'retro_stripes') || (clean.includes('beanie') && a.id === 'teal_beanie') || (clean.includes('bear') && a.id === 'teddy_oversize') || (clean.includes('skeleton') && a.id === 'neon_skeleton')
  );
  if (keywordMatch) return keywordMatch.id;

  // Hash unknown string to a deterministic preset
  const index = Math.abs(clean.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % SIGNATURE_AVATARS.length;
  return SIGNATURE_AVATARS[index].id;
}

export function getAvatarPresetByUrl(url?: string): AvatarPreset {
  const cleanId = sanitizeAvatarUrl(url);
  return SIGNATURE_AVATARS.find((a) => a.id === cleanId || a.url === cleanId) || SIGNATURE_AVATARS[0];
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
  const hash = Math.abs(userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0));
  const index = hash % SIGNATURE_AVATARS.length;
  return SIGNATURE_AVATARS[index].id;
}
