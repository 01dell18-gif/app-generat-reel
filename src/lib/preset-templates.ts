import { PresetTemplate, SocialHandles } from '@/types/design';

// SVG Logo SMK Negeri 1 Klungkung matching user's reference image
export const LOGO_SMK_KLUNGKUNG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 60" fill="none">
  <rect width="320" height="60" rx="14" fill="white" fill-opacity="0.95"/>
  <!-- Shield 1 (Blue) -->
  <polygon points="26,12 38,18 38,36 26,48 14,36 14,18" fill="%232563EB" stroke="%231D4ED8" stroke-width="2"/>
  <circle cx="26" cy="28" r="6" fill="%23FCD34D"/>
  <!-- Shield 2 (Green) -->
  <polygon points="56,12 68,18 68,36 56,48 44,36 44,18" fill="%2365A30D" stroke="%234D7C0F" stroke-width="2"/>
  <polygon points="56,20 62,34 50,34" fill="%23FEF08A"/>
  <!-- Text -->
  <text x="82" y="37" fill="%230F172A" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-weight="900" font-size="16" letter-spacing="0.5">SMK NEGERI 1 KLUNGKUNG</text>
</svg>`;

// Subtle Garuda / Balinese Cultural Watermark
export const WATERMARK_GARUDA = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" fill="none" opacity="0.18">
  <defs>
    <radialGradient id="wmG" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="%23064E3B" stop-opacity="0.8"/>
      <stop offset="100%" stop-color="%230284C7" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <circle cx="300" cy="300" r="260" fill="url(%23wmG)"/>
  <!-- Crown & Feathers -->
  <path d="M300 100 L320 180 L380 140 L340 210 L420 200 L350 250 L440 280 L350 310 L430 370 L340 370 L400 450 L300 400 L200 450 L260 370 L170 370 L250 310 L160 280 L250 250 L180 200 L260 210 L220 140 L280 180 Z" stroke="%23047857" stroke-width="4" fill="none"/>
  <circle cx="300" cy="300" r="80" stroke="%23047857" stroke-width="4"/>
  <path d="M260 280 C280 260 320 260 340 280 C340 320 260 320 260 280 Z" fill="%23047857"/>
  <polygon points="300,290 315,330 285,330" fill="%23F59E0B"/>
</svg>`;

// Complete Template Background (Sky, Clouds, Rolling Green Hills) matching user's image
export const TEMPLATE_BG_SMK = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1080" preserveAspectRatio="none" fill="none">
  <defs>
    <!-- Sky Gradient -->
    <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="%23C7E9FE"/>
      <stop offset="40%" stop-color="%23E0F2FE"/>
      <stop offset="70%" stop-color="%23F0F9FF"/>
      <stop offset="100%" stop-color="%23F7FEE7"/>
    </linearGradient>
    <!-- Hill 1 (Light Olive Green) -->
    <linearGradient id="hill1" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="%23A3E635"/>
      <stop offset="100%" stop-color="%2384CC16"/>
    </linearGradient>
    <!-- Hill 2 (Dark Olive Green) -->
    <linearGradient id="hill2" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="%2365A30D"/>
      <stop offset="100%" stop-color="%234D7C0F"/>
    </linearGradient>
  </defs>

  <!-- Sky Canvas -->
  <rect width="1080" height="1080" fill="url(%23skyGrad)"/>

  <!-- Clouds -->
  <!-- Top Clouds -->
  <ellipse cx="200" cy="80" rx="140" ry="60" fill="white" opacity="0.8"/>
  <ellipse cx="320" cy="70" rx="120" ry="50" fill="white" opacity="0.85"/>
  <ellipse cx="880" cy="90" rx="160" ry="70" fill="white" opacity="0.8"/>
  <ellipse cx="760" cy="80" rx="110" ry="50" fill="white" opacity="0.85"/>

  <!-- Center Floating Clouds -->
  <ellipse cx="220" cy="280" rx="110" ry="45" fill="white" opacity="0.6"/>
  <ellipse cx="280" cy="270" rx="90" ry="40" fill="white" opacity="0.7"/>
  <ellipse cx="840" cy="300" rx="130" ry="50" fill="white" opacity="0.65"/>

  <!-- Rolling Hills Layer 1 (Upper Light Green Wave) -->
  <path d="M-50 820 C180 720, 360 840, 600 780 C820 720, 980 770, 1150 720 L1150 1150 L-50 1150 Z" fill="url(%23hill1)"/>

  <!-- Rolling Hills Layer 2 (Lower Deep Olive Wave) -->
  <path d="M-50 880 C120 800, 320 920, 540 850 C760 780, 920 850, 1150 780 L1150 1150 L-50 1150 Z" fill="url(%23hill2)"/>

  <!-- Soft Mist in Hills -->
  <ellipse cx="540" cy="980" rx="480" ry="60" fill="white" opacity="0.25"/>
</svg>`;

// Preset Background 2: Modern Cyber & Tech Geometric Grid
export const TEMPLATE_BG_CYBER_TECH = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1080" preserveAspectRatio="none" fill="none">
  <defs>
    <linearGradient id="cyberBg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="%23061126"/>
      <stop offset="50%" stop-color="%230F172A"/>
      <stop offset="100%" stop-color="%23022C43"/>
    </linearGradient>
    <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
      <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(56, 189, 248, 0.08)" stroke-width="1"/>
    </pattern>
    <radialGradient id="cyberGlow" cx="50%" cy="30%" r="50%">
      <stop offset="0%" stop-color="%2306B6D4" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="%2306B6D4" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1080" height="1080" fill="url(%23cyberBg)"/>
  <rect width="1080" height="1080" fill="url(%23grid)"/>
  <circle cx="540" cy="350" r="450" fill="url(%23cyberGlow)"/>
  <polygon points="120,80 160,105 160,155 120,180 80,155 80,105" stroke="%2338BDF8" stroke-width="1.5" fill="none" opacity="0.25"/>
  <polygon points="960,140 1000,165 1000,215 960,240 920,215 920,165" stroke="%2338BDF8" stroke-width="1.5" fill="none" opacity="0.25"/>
  <path d="M0 900 Q 540 820 1080 920 L 1080 1080 L 0 1080 Z" fill="rgba(6, 182, 212, 0.08)"/>
</svg>`;

// Preset Background 3: Royal Gold & Maroon Prestigious
export const TEMPLATE_BG_ROYAL_GOLD = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1080" preserveAspectRatio="none" fill="none">
  <defs>
    <linearGradient id="maroonGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="%234A041D"/>
      <stop offset="50%" stop-color="%232D0612"/>
      <stop offset="100%" stop-color="%23140207"/>
    </linearGradient>
    <radialGradient id="goldAura" cx="50%" cy="40%" r="55%">
      <stop offset="0%" stop-color="%23F59E0B" stop-opacity="0.28"/>
      <stop offset="70%" stop-color="%23B45309" stop-opacity="0.08"/>
      <stop offset="100%" stop-color="%23000000" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1080" height="1080" fill="url(%23maroonGrad)"/>
  <circle cx="540" cy="400" r="500" fill="url(%23goldAura)"/>
  <!-- Decorative Golden Arches -->
  <circle cx="540" cy="450" r="420" stroke="%23FCD34D" stroke-width="1.5" stroke-dasharray="8 12" fill="none" opacity="0.25"/>
  <circle cx="540" cy="450" r="380" stroke="%23F59E0B" stroke-width="1" fill="none" opacity="0.2"/>
  <rect x="40" y="40" width="1000" height="1000" rx="20" stroke="%23FCD34D" stroke-width="1" fill="none" opacity="0.15"/>
</svg>`;

// Preset Background 4: Vibrant Neon Mesh Gradient
export const TEMPLATE_BG_VIBRANT_GRADIENT = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1080" preserveAspectRatio="none" fill="none">
  <defs>
    <linearGradient id="meshBase" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="%231E1B4B"/>
      <stop offset="100%" stop-color="%230F172A"/>
    </linearGradient>
    <radialGradient id="orb1" cx="20%" cy="20%" r="50%">
      <stop offset="0%" stop-color="%23EC4899" stop-opacity="0.45"/>
      <stop offset="100%" stop-color="%23EC4899" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="orb2" cx="80%" cy="60%" r="50%">
      <stop offset="0%" stop-color="%238B5CF6" stop-opacity="0.45"/>
      <stop offset="100%" stop-color="%238B5CF6" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="orb3" cx="50%" cy="90%" r="50%">
      <stop offset="0%" stop-color="%2306B6D4" stop-opacity="0.4"/>
      <stop offset="100%" stop-color="%2306B6D4" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1080" height="1080" fill="url(%23meshBase)"/>
  <rect width="1080" height="1080" fill="url(%23orb1)"/>
  <rect width="1080" height="1080" fill="url(%23orb2)"/>
  <rect width="1080" height="1080" fill="url(%23orb3)"/>
</svg>`;

export const PRESET_BACKGROUND_LIBRARY = [
  { id: 'bg_hills_smk', name: 'Bukit Hijau & Langit (SMK)', url: TEMPLATE_BG_SMK, previewGradient: 'linear-gradient(135deg, #38BDF8 0%, #84CC16 100%)' },
  { id: 'bg_cyber_tech', name: 'Cyber Grid & Tech Cyan', url: TEMPLATE_BG_CYBER_TECH, previewGradient: 'linear-gradient(135deg, #061126 0%, #06B6D4 100%)' },
  { id: 'bg_royal_gold', name: 'Royal Gold & Maroon', url: TEMPLATE_BG_ROYAL_GOLD, previewGradient: 'linear-gradient(135deg, #4A041D 0%, #F59E0B 100%)' },
  { id: 'bg_vibrant_mesh', name: 'Modern Neon Mesh', url: TEMPLATE_BG_VIBRANT_GRADIENT, previewGradient: 'linear-gradient(135deg, #EC4899 0%, #8B5CF6 100%)' },
];

// Default sample speaker / teacher photo
export const SAMPLE_SPEAKER_PHOTO = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 650" fill="none">
  <defs>
    <linearGradient id="suit" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="%231E293B"/>
      <stop offset="100%" stop-color="%230F172A"/>
    </linearGradient>
    <linearGradient id="skin" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="%23FCD34D"/>
      <stop offset="100%" stop-color="%23F59E0B"/>
    </linearGradient>
    <radialGradient id="halo" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="%23FFFFFF" stop-opacity="0.8"/>
      <stop offset="100%" stop-color="%23FFFFFF" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <!-- Aura Halo -->
  <circle cx="250" cy="300" r="220" fill="url(%23halo)" opacity="0.4"/>

  <!-- Body / Formal Suit -->
  <path d="M120 480 C120 380, 380 380, 380 480 L440 650 L60 650 Z" fill="url(%23suit)"/>
  <!-- White Shirt -->
  <polygon points="250,380 290,480 210,480" fill="white"/>
  <!-- Tie (Batik/Gold) -->
  <polygon points="250,390 260,460 250,520 240,460" fill="%23D97706"/>

  <!-- Neck -->
  <rect x="225" y="320" width="50" height="70" rx="10" fill="url(%23skin)"/>

  <!-- Head -->
  <ellipse cx="250" cy="270" rx="75" ry="90" fill="url(%23skin)"/>
  <!-- Hair -->
  <path d="M175 250 C175 160, 325 160, 325 250 C325 180, 275 170, 250 170 C220 170, 180 180, 175 250 Z" fill="%2318181B"/>

  <!-- Face details -->
  <!-- Eyebrows -->
  <path d="M205 240 Q220 235 235 242" stroke="%2327272A" stroke-width="4" stroke-linecap="round"/>
  <path d="M265 242 Q280 235 295 240" stroke="%2327272A" stroke-width="4" stroke-linecap="round"/>
  <!-- Eyes -->
  <circle cx="220" cy="255" r="7" fill="%2318181B"/>
  <circle cx="280" cy="255" r="7" fill="%2318181B"/>
  <!-- Glasses -->
  <rect x="200" y="244" width="38" height="24" rx="6" stroke="%231E293B" stroke-width="3" fill="none"/>
  <rect x="262" y="244" width="38" height="24" rx="6" stroke="%231E293B" stroke-width="3" fill="none"/>
  <line x1="238" y1="254" x2="262" y2="254" stroke="%231E293B" stroke-width="3"/>
  <!-- Nose -->
  <path d="M250 256 L246 278 L254 278" stroke="%23B45309" stroke-width="3" stroke-linecap="round" fill="none"/>
  <!-- Smile -->
  <path d="M230 300 Q250 315 270 300" stroke="%23B45309" stroke-width="4" stroke-linecap="round" fill="none"/>
</svg>`;

// Preset Templates
export const PRESET_TEMPLATES: PresetTemplate[] = [
  {
    id: 'smk_klungkung',
    name: 'SMK N 1 Klungkung - Kesaktian Pancasila & SPMI',
    category: 'Sekolah & Institusi Pendidikan',
    description: 'Template resmi sesuai contoh gambar: Latar bukit hijau & langit biru, banner atas hijau tua, kartu SPMI, dan bar sosial media biru.',
    previewGradient: 'linear-gradient(135deg, #0284C7 0%, #84CC16 60%, #15803D 100%)',
    data: {
      logoUrl: LOGO_SMK_KLUNGKUNG,
      logoLocked: true,
      institutionName: 'SMK NEGERI 1 KLUNGKUNG',

      // Background
      customBgImageUrl: TEMPLATE_BG_SMK,
      useCustomBgImage: true,
      backgroundLayers: [],
      watermarkUrl: WATERMARK_GARUDA,
      showWatermark: true,

      // Top Banner Pill
      topPillText: 'MEMPERINGATI HARI KESAKTIAN PANCASILA',
      topPillBgColor: '#05472A',
      topPillTextColor: '#86EFAC',
      showTopPill: true,

      // Event Card
      eventCardTitle: 'Sistem Penjaminan Mutu Internal',
      eventCardSubtitle: 'SPMI',
      eventCardBorderColor: '#F59E0B',
      showEventCard: true,

      // Informational Text
      headlineText: 'PENINGKATAN MUTU DAN KUALITAS PENDIDIKAN VOKASI',
      headlineColor: '#064E3B',
      headlineFontSize: 28,
      headlineFontFamily: "'Plus Jakarta Sans', sans-serif",
      subtitleText: 'Mewujudkan Generasi Unggul Berkarakter Pancasila & Siap Kerja',
      subtitleColor: '#1E293B',
      subtitleFontSize: 15,

      // Date Badge
      dateText: '18 September 2026',
      dateColor: '#FFFFFF',
      dateBgColor: '#2563EB',
      dateBadgeStyle: 'pill',

      // Main Media (Uploaded Photo)
      mainMediaUrl: SAMPLE_SPEAKER_PHOTO,
      isolateSubject: true,
      smartCropFocal: 'center',
      mainMediaScale: 1.0,
      mainMediaRotation: 0,
      mainMediaFlipH: false,
      mainMediaFlipV: false,

      // Footer
      footerImageUrl: '',
      footerLocked: true,
      footerHeightPercent: 7,
      useDefaultSocialFooter: true,
      socialFooterBgColor: '#1D4ED8',
      socialFooterTextColor: '#FFFFFF',
      socialFooterBorderColor: 'rgba(255, 255, 255, 0.22)',
      socialHandles: {
        instagram: 'smkn1klk',
        website: 'smkn1klk.sch.id',
        facebook: 'SMK Negeri 1 Klungkung',
        tiktok: 'smkn1klungkung',
      },

      accentColor: '#10B981',
      bgColor: '#E0F2FE',
      secondaryBgColor: '#65A30D',
      supportingGraphics: [],
    },
  },
  {
    id: 'music_festival',
    name: 'Neon Soundwave Festival',
    category: 'Entertainment & Music',
    description: 'Tata letak dinamis dengan palet cyberpunk neon, tipografi ekspresif, dan visual DJ energetik.',
    previewGradient: 'linear-gradient(135deg, #EC4899 0%, #8B5CF6 50%, #1E1B4B 100%)',
    data: {
      logoUrl: LOGO_SMK_KLUNGKUNG,
      logoLocked: true,
      institutionName: 'SOUNDWAVE MUSIC FEST',
      customBgImageUrl: '',
      useCustomBgImage: false,
      backgroundLayers: [],
      watermarkUrl: '',
      showWatermark: false,
      topPillText: 'LIVE MUSIC PERFORMANCE 2026',
      topPillBgColor: '#831843',
      topPillTextColor: '#F472B6',
      showTopPill: true,
      eventCardTitle: 'Electronic Dance & Soundwave Fest',
      eventCardSubtitle: 'EDM STAGE',
      eventCardBorderColor: '#EC4899',
      showEventCard: true,
      headlineText: 'NEON SOUNDWAVE 2026',
      headlineColor: '#FFFFFF',
      headlineFontSize: 38,
      headlineFontFamily: "'Plus Jakarta Sans', sans-serif",
      subtitleText: 'FESTIVAL MUSIK ELEKTRONIK TERBESAR DI ASIA TENGGARA',
      subtitleColor: '#F472B6',
      subtitleFontSize: 16,
      dateText: 'SABTU, 14 NOVEMBER 2026',
      dateColor: '#FFFFFF',
      dateBgColor: '#7C3AED',
      dateBadgeStyle: 'pill',
      mainMediaUrl: SAMPLE_SPEAKER_PHOTO,
      isolateSubject: true,
      smartCropFocal: 'center',
      mainMediaScale: 1.0,
      footerImageUrl: '',
      footerLocked: true,
      footerHeightPercent: 8,
      useDefaultSocialFooter: true,
      socialHandles: {
        instagram: 'soundwave.id',
        website: 'soundwave.id',
        facebook: 'Soundwave Indonesia',
        tiktok: 'soundwavefest',
      },
      accentColor: '#EC4899',
      bgColor: '#0B091A',
      secondaryBgColor: '#1A103C',
      supportingGraphics: [
        { id: 'g1', type: 'sparkle', x: 80, y: 180, size: 36, color: '#F43F5E' },
        { id: 'g2', type: 'ring', x: 580, y: 240, size: 54, color: '#8B5CF6' },
      ],
    },
  },
  {
    id: 'quantum_summit',
    name: 'Quantum AI Global Summit',
    category: 'Technology & Business',
    description: 'Desain presisi modern dengan tipografi geometris, aksen sirkuit cyan-blue, dan avatar AI masa depan.',
    previewGradient: 'linear-gradient(135deg, #06B6D4 0%, #3B82F6 50%, #0F172A 100%)',
    data: {
      logoUrl: LOGO_SMK_KLUNGKUNG,
      logoLocked: true,
      institutionName: 'QUANTUM AI GLOBAL',
      customBgImageUrl: '',
      useCustomBgImage: false,
      backgroundLayers: [],
      watermarkUrl: '',
      showWatermark: false,
      topPillText: 'INTERNATIONAL AI SYMPOSIUM',
      topPillBgColor: '#082F49',
      topPillTextColor: '#38BDF8',
      showTopPill: true,
      eventCardTitle: 'Artificial Intelligence & Future Tech',
      eventCardSubtitle: 'KEYNOTE SESSION',
      eventCardBorderColor: '#06B6D4',
      showEventCard: true,
      headlineText: 'QUANTUM AI GLOBAL SUMMIT',
      headlineColor: '#FFFFFF',
      headlineFontSize: 36,
      headlineFontFamily: "'Plus Jakarta Sans', sans-serif",
      subtitleText: 'MERANCANG MASA DEPAN KECERDASAN BUATAN MULTIMODAL',
      subtitleColor: '#38BDF8',
      subtitleFontSize: 15,
      dateText: '18 - 20 OKTOBER 2026',
      dateColor: '#0F172A',
      dateBgColor: '#38BDF8',
      dateBadgeStyle: 'rect',
      mainMediaUrl: SAMPLE_SPEAKER_PHOTO,
      isolateSubject: true,
      smartCropFocal: 'subject',
      mainMediaScale: 1.0,
      footerImageUrl: '',
      footerLocked: true,
      footerHeightPercent: 8,
      useDefaultSocialFooter: true,
      socialHandles: {
        instagram: 'quantum.ai',
        website: 'quantum-summit.ai',
        facebook: 'Quantum AI Summit',
        tiktok: 'quantum_tech',
      },
      accentColor: '#06B6D4',
      bgColor: '#070D18',
      secondaryBgColor: '#0F172A',
      supportingGraphics: [
        { id: 't1', type: 'sparkle', x: 120, y: 160, size: 28, color: '#38BDF8' },
        { id: 't2', type: 'ring', x: 620, y: 380, size: 48, color: '#06B6D4' },
      ],
    },
  },
];
