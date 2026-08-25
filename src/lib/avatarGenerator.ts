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

export interface AvatarPreset {
  id: string;
  name: string;
  category: 'green' | 'blue' | 'orange' | 'pink' | 'lime' | 'lofi' | 'retro' | 'teal' | 'bear' | 'skeleton';
  gender: 'Girl' | 'Boy' | 'Mascot';
  url: string;
  theme: AvatarTheme;
}

export const SIGNATURE_AVATARS: AvatarPreset[] = [
  {
    id: 'green_yeo',
    name: 'YEO! Scholar Girl',
    category: 'green',
    gender: 'Girl',
    url: '/assets/avatars/female/yeo_scholar_girl.png',
    theme: {
      primary: '#059669',
      secondary: '#10B981',
      glow: 'rgba(16, 185, 129, 0.15)',
      border: 'rgba(5, 150, 105, 0.25)',
      badgeBg: 'rgba(16, 185, 129, 0.12)',
      badgeText: '#047857',
      progressColor: '#059669',
      heroGradient: 'from-[#ECFDF5] via-[#D1FAE5] to-[#A7F3D0]',
      pageBgGradient: 'radial-gradient(ellipse at top right, rgba(16, 185, 129, 0.12) 0%, transparent 65%)',
      themeName: 'Emerald Scholar 🌿',
      isLightMode: true,
    },
  },
  {
    id: 'blue_focus',
    name: 'NO LIMITS Focus Boy',
    category: 'blue',
    gender: 'Boy',
    url: '/assets/avatars/male/focus_boy.png',
    theme: {
      primary: '#2563EB',
      secondary: '#3B82F6',
      glow: 'rgba(37, 99, 235, 0.15)',
      border: 'rgba(37, 99, 235, 0.25)',
      badgeBg: 'rgba(37, 99, 235, 0.12)',
      badgeText: '#1D4ED8',
      progressColor: '#2563EB',
      heroGradient: 'from-[#EFF6FF] via-[#DBEAFE] to-[#BFDBFE]',
      pageBgGradient: 'radial-gradient(ellipse at top right, rgba(37, 99, 235, 0.12) 0%, transparent 65%)',
      themeName: 'Electric Cyber ⚡',
      isLightMode: true,
    },
  },
  {
    id: 'orange_luffy',
    name: 'STAY FOCUSED Luffy Boy',
    category: 'orange',
    gender: 'Boy',
    url: '/assets/avatars/male/luffy_boy.jpg',
    theme: {
      primary: '#EA580C',
      secondary: '#F97316',
      glow: 'rgba(234, 88, 12, 0.15)',
      border: 'rgba(234, 88, 12, 0.25)',
      badgeBg: 'rgba(234, 88, 12, 0.12)',
      badgeText: '#C2410C',
      progressColor: '#EA580C',
      heroGradient: 'from-[#FFF7ED] via-[#FFEDD5] to-[#FED7AA]',
      pageBgGradient: 'radial-gradient(ellipse at top right, rgba(234, 88, 12, 0.12) 0%, transparent 65%)',
      themeName: 'Sunset Creator 🔥',
      isLightMode: true,
    },
  },
  {
    id: 'pink_celebrate',
    name: 'CELEBRATE Joy Girl',
    category: 'pink',
    gender: 'Girl',
    url: '/assets/avatars/female/joy_girl.png',
    theme: {
      primary: '#DB2777',
      secondary: '#EC4899',
      glow: 'rgba(219, 39, 119, 0.15)',
      border: 'rgba(219, 39, 119, 0.25)',
      badgeBg: 'rgba(219, 39, 119, 0.12)',
      badgeText: '#BE185D',
      progressColor: '#DB2777',
      heroGradient: 'from-[#FDF2F8] via-[#FCE7F3] to-[#FBCFE8]',
      pageBgGradient: 'radial-gradient(ellipse at top right, rgba(219, 39, 119, 0.12) 0%, transparent 65%)',
      themeName: 'Pink Joy 💖',
      isLightMode: true,
    },
  },
  {
    id: 'green_shinchan',
    name: 'FRESH Shinchan Boy',
    category: 'lime',
    gender: 'Boy',
    url: '/assets/avatars/male/shinchan_boy.png',
    theme: {
      primary: '#65A30D',
      secondary: '#84CC16',
      glow: 'rgba(101, 163, 13, 0.15)',
      border: 'rgba(101, 163, 13, 0.25)',
      badgeBg: 'rgba(101, 163, 13, 0.12)',
      badgeText: '#4D7C0F',
      progressColor: '#65A30D',
      heroGradient: 'from-[#F7FEE7] via-[#ECFCCB] to-[#D9F99D]',
      pageBgGradient: 'radial-gradient(ellipse at top right, rgba(101, 163, 13, 0.12) 0%, transparent 65%)',
      themeName: 'Lime Fresh 🍏',
      isLightMode: true,
    },
  },
  {
    id: 'lofi_headphones',
    name: 'CHILL Lo-Fi Girl',
    category: 'lofi',
    gender: 'Girl',
    url: '/assets/avatars/female/lofi_girl.png',
    theme: {
      primary: '#D97706',
      secondary: '#F59E0B',
      glow: 'rgba(217, 119, 6, 0.15)',
      border: 'rgba(217, 119, 6, 0.25)',
      badgeBg: 'rgba(217, 119, 6, 0.12)',
      badgeText: '#B45309',
      progressColor: '#D97706',
      heroGradient: 'from-[#FFFBEB] via-[#FEF3C7] to-[#FDE68A]',
      pageBgGradient: 'radial-gradient(ellipse at top right, rgba(217, 119, 6, 0.12) 0%, transparent 65%)',
      themeName: 'Warm Lo-Fi 🎧',
      isLightMode: true,
    },
  },
  {
    id: 'retro_stripes',
    name: 'RETRO Cap Girl',
    category: 'retro',
    gender: 'Girl',
    url: '/assets/avatars/female/retro_cap_girl.png',
    theme: {
      primary: '#475569',
      secondary: '#64748B',
      glow: 'rgba(71, 85, 105, 0.15)',
      border: 'rgba(71, 85, 105, 0.25)',
      badgeBg: 'rgba(71, 85, 105, 0.12)',
      badgeText: '#334155',
      progressColor: '#475569',
      heroGradient: 'from-[#F8FAFC] via-[#F1F5F9] to-[#E2E8F0]',
      pageBgGradient: 'radial-gradient(ellipse at top right, rgba(71, 85, 105, 0.12) 0%, transparent 65%)',
      themeName: 'Retro Slate 🕶️',
      isLightMode: true,
    },
  },
  {
    id: 'teal_beanie',
    name: 'DEEP Teal Chill Boy',
    category: 'teal',
    gender: 'Boy',
    url: '/assets/avatars/male/teal_beanie_boy.png',
    theme: {
      primary: '#0D9488',
      secondary: '#14B8A6',
      glow: 'rgba(13, 148, 136, 0.15)',
      border: 'rgba(13, 148, 136, 0.25)',
      badgeBg: 'rgba(13, 148, 136, 0.12)',
      badgeText: '#0F766E',
      progressColor: '#0D9488',
      heroGradient: 'from-[#F0FDFA] via-[#CCFBF1] to-[#99F6E4]',
      pageBgGradient: 'radial-gradient(ellipse at top right, rgba(13, 148, 136, 0.12) 0%, transparent 65%)',
      themeName: 'Deep Teal 🌊',
      isLightMode: true,
    },
  },
  {
    id: 'teddy_oversize',
    name: 'STREETWEAR Bear',
    category: 'bear',
    gender: 'Mascot',
    url: '/assets/avatars/mascots/streetwear_bear.png',
    theme: {
      primary: '#9A3412',
      secondary: '#C2410C',
      glow: 'rgba(154, 52, 18, 0.15)',
      border: 'rgba(154, 52, 18, 0.25)',
      badgeBg: 'rgba(154, 52, 18, 0.12)',
      badgeText: '#7C2D12',
      progressColor: '#9A3412',
      heroGradient: 'from-[#FFF7ED] via-[#FFEDD5] to-[#FED7AA]',
      pageBgGradient: 'radial-gradient(ellipse at top right, rgba(154, 52, 18, 0.12) 0%, transparent 65%)',
      themeName: 'Streetwear Bear 🧸',
      isLightMode: true,
    },
  },
  {
    id: 'neon_skeleton',
    name: 'CYBER Skeleton',
    category: 'skeleton',
    gender: 'Mascot',
    url: '/assets/avatars/mascots/cyber_skeleton.png',
    theme: {
      primary: '#9333EA',
      secondary: '#A855F7',
      glow: 'rgba(147, 51, 234, 0.15)',
      border: 'rgba(147, 51, 234, 0.25)',
      badgeBg: 'rgba(147, 51, 234, 0.12)',
      badgeText: '#7E22CE',
      progressColor: '#9333EA',
      heroGradient: 'from-[#FAF5FF] via-[#F3E8FF] to-[#E9D5FF]',
      pageBgGradient: 'radial-gradient(ellipse at top right, rgba(147, 51, 234, 0.12) 0%, transparent 65%)',
      themeName: 'Neon Purple 💜',
      isLightMode: true,
    },
  },
];

export function sanitizeAvatarUrl(url?: string): string {
  if (!url) return SIGNATURE_AVATARS[0].url;
  
  // Exact match with valid signature avatar URLs
  const exactMatch = SIGNATURE_AVATARS.find((a) => a.url === url);
  if (exactMatch) return exactMatch.url;

  // Category / ID keyword match (rejecting certificate / media images)
  if (!url.includes('media_') && !url.includes('Certificate')) {
    const keywordMatch = SIGNATURE_AVATARS.find(
      (a) => url.includes(a.category) || url.includes(a.id)
    );
    if (keywordMatch) return keywordMatch.url;
  }

  // Fallback to default signature avatar
  return SIGNATURE_AVATARS[0].url;
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
