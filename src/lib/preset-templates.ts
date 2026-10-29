import { PresetTemplate, SocialHandles } from '@/types/design';

// SVG Logo SMK Negeri 1 Klungkung - Modern Curved Capsule Pill Shape (LENGKUNG SEMPURNA, BUKAN KOTAK)
const RAW_LOGO_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 380 64" fill="none">
  <defs>
    <!-- Soft Ambient Glow & Drop Shadow -->
    <filter id="pillGlow" x="-10%" y="-20%" width="125%" height="150%">
      <feDropShadow dx="0" dy="4" stdDeviation="5" flood-color="#0F172A" flood-opacity="0.2"/>
    </filter>
    <!-- Frosted Glass Gradient -->
    <linearGradient id="pillBg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.98"/>
      <stop offset="100%" stop-color="#F8FAFC" stop-opacity="0.94"/>
    </linearGradient>
    <linearGradient id="pillStroke" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="1"/>
      <stop offset="50%" stop-color="#93C5FD" stop-opacity="0.6"/>
      <stop offset="100%" stop-color="#86EFAC" stop-opacity="0.6"/>
    </linearGradient>
    <linearGradient id="blueCrest" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#2563EB"/>
      <stop offset="100%" stop-color="#1E3A8A"/>
    </linearGradient>
    <linearGradient id="greenCrest" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#84CC16"/>
      <stop offset="100%" stop-color="#3F6212"/>
    </linearGradient>
    <linearGradient id="goldFlame" x1="0" y1="1" x2="0" y2="0">
      <stop offset="0%" stop-color="#EA580C"/>
      <stop offset="50%" stop-color="#EF4444"/>
      <stop offset="100%" stop-color="#FBBF24"/>
    </linearGradient>
    <linearGradient id="goldWing" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#FDE047"/>
      <stop offset="100%" stop-color="#D97706"/>
    </linearGradient>
  </defs>

  <!-- Perfectly Curved Pill Container (LENGKUNG SEMPURNA, BUKAN KOTAK) -->
  <rect x="3" y="3" width="374" height="58" rx="29" fill="url(#pillBg)" stroke="url(#pillStroke)" stroke-width="1.8" filter="url(#pillGlow)"/>

  <!-- Left Emblem: Dinas Pendidikan Bali Shield -->
  <g transform="translate(14, 12)">
    <polygon points="20,0 40,9 40,29 20,40 0,29 0,9" fill="url(#blueCrest)" stroke="#1D4ED8" stroke-width="1.2"/>
    <polygon points="20,3 37,11 37,27 20,37 3,27 3,11" stroke="#FDE047" stroke-width="1" fill="none" opacity="0.9"/>
    <!-- Candi / Spire -->
    <polygon points="20,7 24,15 16,15" fill="#FCD34D"/>
    <polygon points="20,13 26,22 14,22" fill="#F59E0B"/>
    <polygon points="20,20 28,30 12,30" fill="#D97706"/>
    <rect x="14" y="30" width="12" height="3" rx="1.5" fill="#FEF08A"/>
    <!-- Green Garland wreath -->
    <path d="M7 26 C 7 16, 13 9, 20 9 C 27 9, 33 16, 33 26" stroke="#4ADE80" stroke-width="1.6" fill="none"/>
  </g>

  <!-- Right Emblem: SMK Negeri 1 Klungkung Wings & Torch -->
  <g transform="translate(58, 12)">
    <polygon points="20,0 40,9 40,29 20,40 0,29 0,9" fill="url(#greenCrest)" stroke="#365314" stroke-width="1.2"/>
    <polygon points="20,3 37,11 37,27 20,37 3,27 3,11" stroke="#FEF08A" stroke-width="1" fill="none" opacity="0.9"/>
    <!-- Wings -->
    <path d="M20 20 C 14 13, 5 14, 3 20 C 7 25, 15 25, 20 23 Z" fill="url(#goldWing)"/>
    <path d="M20 20 C 26 13, 35 14, 37 20 C 33 25, 25 25, 20 23 Z" fill="url(#goldWing)"/>
    <!-- Torch -->
    <line x1="20" y1="18" x2="20" y2="31" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="20" y1="19" x2="20" y2="30" stroke="#71717A" stroke-width="1.2" stroke-linecap="round"/>
    <path d="M20 7 C 23 11, 25 14, 23 18 C 21 19, 19 19, 17 18 C 15 14, 17 11, 20 7 Z" fill="url(#goldFlame)"/>
    <rect x="8" y="31" width="24" height="4.5" rx="2" fill="#FEF08A" stroke="#CA8A04" stroke-width="0.8"/>
  </g>

  <!-- Modern Clean Typography -->
  <text x="108" y="36" fill="#0F172A" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-weight="900" font-size="15" letter-spacing="0.3px">SMK NEGERI 1 KLUNGKUNG</text>
  <text x="109" y="49" fill="#2563EB" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-weight="800" font-size="8.5" letter-spacing="1.4px">PUSAT KEUNGGULAN • ISO 9001</text>
</svg>
`.trim();

export const LOGO_SMK_KLUNGKUNG = `data:image/svg+xml;utf8,${encodeURIComponent(RAW_LOGO_SVG)}`;

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

// Complete Template Background (Sky, Clouds, Rolling Green Hills) - Modern Aesthetic Waves
export const TEMPLATE_BG_SMK = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1080" preserveAspectRatio="none" fill="none">
  <defs>
    <!-- Modern Vibrant Sky Gradient -->
    <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="%23BAE6FD"/>
      <stop offset="35%" stop-color="%23E0F2FE"/>
      <stop offset="65%" stop-color="%23F0F9FF"/>
      <stop offset="100%" stop-color="%23FEF9C3"/>
    </linearGradient>
    <!-- Sun Ambient Glow Halo -->
    <radialGradient id="sunAura" cx="75%" cy="20%" r="55%">
      <stop offset="0%" stop-color="%23FEF08A" stop-opacity="0.6"/>
      <stop offset="50%" stop-color="%23FDE047" stop-opacity="0.2"/>
      <stop offset="100%" stop-color="%23FFFFFF" stop-opacity="0"/>
    </radialGradient>
    <!-- Rolling Hill 1 (Bright Lime Green) -->
    <linearGradient id="hill1" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="%23A3E635"/>
      <stop offset="100%" stop-color="%2365A30D"/>
    </linearGradient>
    <!-- Rolling Hill 2 (Deep Emerald Olive) -->
    <linearGradient id="hill2" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="%234D7C0F"/>
      <stop offset="100%" stop-color="%2314532D"/>
    </linearGradient>
    <!-- Ambient Horizon Glow -->
    <linearGradient id="horizonGlow" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="%23FFFFFF" stop-opacity="0.5"/>
      <stop offset="100%" stop-color="%2384CC16" stop-opacity="0"/>
    </linearGradient>
  </defs>

  <!-- Sky Canvas -->
  <rect width="1080" height="1080" fill="url(%23skyGrad)"/>
  <rect width="1080" height="1080" fill="url(%23sunAura)"/>

  <!-- Aesthetic Floating Soft Cloud Puffs -->
  <g opacity="0.85">
    <ellipse cx="200" cy="90" rx="150" ry="60" fill="white"/>
    <ellipse cx="310" cy="75" rx="130" ry="55" fill="white"/>
    <ellipse cx="880" cy="110" rx="170" ry="70" fill="white"/>
    <ellipse cx="750" cy="95" rx="120" ry="50" fill="white"/>
  </g>

  <!-- Center Floating Clouds -->
  <g opacity="0.65">
    <ellipse cx="180" cy="300" rx="130" ry="50" fill="white"/>
    <ellipse cx="270" cy="285" rx="100" ry="45" fill="white"/>
    <ellipse cx="860" cy="320" rx="150" ry="55" fill="white"/>
  </g>

  <!-- Rolling Hills Layer 1 (Upper Smooth Bezier Curve) -->
  <path d="M-60 760 C160 660, 380 810, 620 740 C840 670, 990 730, 1160 670 L1160 1160 L-60 1160 Z" fill="url(%23hill1)"/>
  <path d="M-60 760 C160 660, 380 810, 620 740 C840 670, 990 730, 1160 670" stroke="%23BEF264" stroke-width="3" fill="none" opacity="0.6"/>

  <!-- Rolling Hills Layer 2 (Lower Deep Organic Wave) -->
  <path d="M-60 840 C140 750, 340 890, 580 810 C800 740, 950 820, 1160 740 L1160 1160 L-60 1160 Z" fill="url(%23hill2)"/>
  <path d="M-60 840 C140 750, 340 890, 580 810 C800 740, 950 820, 1160 740" stroke="%23A3E635" stroke-width="2.5" fill="none" opacity="0.5"/>

  <!-- Soft Morning Mist Layer in Hills -->
  <ellipse cx="540" cy="970" rx="520" ry="70" fill="white" opacity="0.22"/>
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

// Preset Background 5: Patriotik Merah-Putih & Golden Wings
export const TEMPLATE_BG_PATRIOTIK = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1080" preserveAspectRatio="none" fill="none">
  <defs>
    <linearGradient id="redGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="%23991B1B"/>
      <stop offset="50%" stop-color="%23DC2626"/>
      <stop offset="100%" stop-color="%237F1D1D"/>
    </linearGradient>
    <linearGradient id="whiteGlow" x1="0" y1="1" x2="0" y2="0">
      <stop offset="0%" stop-color="%23FFFFFF" stop-opacity="0.95"/>
      <stop offset="60%" stop-color="%23F8FAFC" stop-opacity="0.4"/>
      <stop offset="100%" stop-color="%23FFFFFF" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect width="1080" height="1080" fill="url(%23redGrad)"/>
  <!-- Indonesian flag wave bottom -->
  <path d="M-50 780 C200 680, 450 820, 750 720 C950 650, 1080 710, 1150 690 L1150 1150 L-50 1150 Z" fill="url(%23whiteGlow)"/>
  <circle cx="540" cy="380" r="420" fill="%23F59E0B" fill-opacity="0.12"/>
  <circle cx="540" cy="380" r="320" stroke="%23FCD34D" stroke-width="2" stroke-dasharray="12 12" fill="none" opacity="0.3"/>
</svg>`;

// Preset Background 6: PPDB & Educational Blue Dynamic Waves
export const TEMPLATE_BG_PPDB = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1080" preserveAspectRatio="none" fill="none">
  <defs>
    <linearGradient id="ppdbBlue" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="%230F172A"/>
      <stop offset="40%" stop-color="%231E3A8A"/>
      <stop offset="100%" stop-color="%230284C7"/>
    </linearGradient>
    <linearGradient id="orangeWave" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="%23EA580C"/>
      <stop offset="100%" stop-color="%23F59E0B"/>
    </linearGradient>
  </defs>
  <rect width="1080" height="1080" fill="url(%23ppdbBlue)"/>
  <path d="M-50 850 Q 300 700 650 860 T 1150 800 L 1150 1150 L -50 1150 Z" fill="url(%23orangeWave)" opacity="0.9"/>
  <path d="M-50 890 Q 400 760 800 900 T 1150 850 L 1150 1150 L -50 1150 Z" fill="%23FFFFFF" opacity="0.15"/>
  <circle cx="950" cy="180" r="220" fill="%2338BDF8" fill-opacity="0.15"/>
  <circle cx="120" cy="300" r="140" fill="%23F59E0B" fill-opacity="0.12"/>
</svg>`;

// Preset Background 7: E-Sports & Gaming Neon Toxic Dark
export const TEMPLATE_BG_ESPORTS = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1080" preserveAspectRatio="none" fill="none">
  <defs>
    <linearGradient id="esportBg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="%23090514"/>
      <stop offset="50%" stop-color="%2317072B"/>
      <stop offset="100%" stop-color="%2306010F"/>
    </linearGradient>
    <radialGradient id="toxicGlow" cx="50%" cy="40%" r="55%">
      <stop offset="0%" stop-color="%2384CC16" stop-opacity="0.35"/>
      <stop offset="60%" stop-color="%23A855F7" stop-opacity="0.15"/>
      <stop offset="100%" stop-color="%23000000" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1080" height="1080" fill="url(%23esportBg)"/>
  <circle cx="540" cy="400" r="480" fill="url(%23toxicGlow)"/>
  <polygon points="540,80 980,340 820,850 260,850 100,340" stroke="%2384CC16" stroke-width="2" stroke-opacity="0.3" fill="none"/>
  <polygon points="540,120 940,360 800,820 280,820 140,360" stroke="%23A855F7" stroke-width="1.5" stroke-opacity="0.25" fill="none"/>
</svg>`;

// Preset Background 8: Culinary & Warm Amber
export const TEMPLATE_BG_CULINARY = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1080" preserveAspectRatio="none" fill="none">
  <defs>
    <linearGradient id="culinaryBg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="%23431407"/>
      <stop offset="50%" stop-color="%237C2D12"/>
      <stop offset="100%" stop-color="%231C0A00"/>
    </linearGradient>
    <radialGradient id="warmSun" cx="50%" cy="35%" r="50%">
      <stop offset="0%" stop-color="%23F59E0B" stop-opacity="0.45"/>
      <stop offset="100%" stop-color="%23B45309" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1080" height="1080" fill="url(%23culinaryBg)"/>
  <circle cx="540" cy="380" r="420" fill="url(%23warmSun)"/>
  <circle cx="540" cy="400" r="360" stroke="%23FDE68A" stroke-width="1.5" stroke-dasharray="10 10" fill="none" opacity="0.3"/>
</svg>`;

export const PRESET_BACKGROUND_LIBRARY = [
  { id: 'bg_hills_smk', name: 'Bukit Hijau & Langit (SMK)', url: TEMPLATE_BG_SMK, previewGradient: 'linear-gradient(135deg, #38BDF8 0%, #84CC16 100%)' },
  { id: 'bg_patriotik', name: 'Patriotik Merah Putih & Emas', url: TEMPLATE_BG_PATRIOTIK, previewGradient: 'linear-gradient(135deg, #DC2626 0%, #F59E0B 100%)' },
  { id: 'bg_ppdb', name: 'PPDB Vokasi Biru & Oranye', url: TEMPLATE_BG_PPDB, previewGradient: 'linear-gradient(135deg, #1E3A8A 0%, #EA580C 100%)' },
  { id: 'bg_cyber_tech', name: 'Cyber Grid & Tech Cyan', url: TEMPLATE_BG_CYBER_TECH, previewGradient: 'linear-gradient(135deg, #061126 0%, #06B6D4 100%)' },
  { id: 'bg_royal_gold', name: 'Royal Gold & Maroon', url: TEMPLATE_BG_ROYAL_GOLD, previewGradient: 'linear-gradient(135deg, #4A041D 0%, #F59E0B 100%)' },
  { id: 'bg_vibrant_mesh', name: 'Modern Neon Mesh', url: TEMPLATE_BG_VIBRANT_GRADIENT, previewGradient: 'linear-gradient(135deg, #EC4899 0%, #8B5CF6 100%)' },
  { id: 'bg_esports', name: 'E-Sports Toxic Neon Dark', url: TEMPLATE_BG_ESPORTS, previewGradient: 'linear-gradient(135deg, #17072B 0%, #84CC16 100%)' },
  { id: 'bg_culinary', name: 'Culinary Warm Amber', url: TEMPLATE_BG_CULINARY, previewGradient: 'linear-gradient(135deg, #7C2D12 0%, #F59E0B 100%)' },
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
    description: 'Template resmi institusi: Latar bukit hijau & langit biru, banner atas hijau tua, kartu SPMI, dan bar sosial media biru.',
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
      eventCardTitleFontSize: 13,
      eventCardSubtitle: 'SPMI',
      eventCardSubtitleFontSize: 18,
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
      dateFontSize: 11,
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
      socialFooterFontSize: 18,
      socialHandles: {
        instagram: 'fyjchannel',
        website: 'fyjchannel.co.id',
        facebook: 'FYJ Channel',
        tiktok: 'fyjchannel',
      },

      accentColor: '#10B981',
      bgColor: '#E0F2FE',
      secondaryBgColor: '#65A30D',
      supportingGraphics: [],
    },
  },
  {
    id: 'pahlawan_vokasi',
    name: 'Peringatan Hari Pahlawan Nasional & Vokasi Maju',
    category: 'Peringatan Nasional & Patriotik',
    description: 'Nuansa patriotik merah putih dan aksen emas dengan tipografi berwibawa untuk peringatan pahlawan dan lomba kompetensi.',
    previewGradient: 'linear-gradient(135deg, #991B1B 0%, #DC2626 50%, #F59E0B 100%)',
    data: {
      logoUrl: LOGO_SMK_KLUNGKUNG,
      logoLocked: true,
      institutionName: 'SMK NEGERI 1 KLUNGKUNG',
      customBgImageUrl: TEMPLATE_BG_PATRIOTIK,
      useCustomBgImage: true,
      backgroundLayers: [],
      watermarkUrl: WATERMARK_GARUDA,
      showWatermark: true,
      topPillText: 'MEMPERINGATI HARI PAHLAWAN NASIONAL 2026',
      topPillBgColor: '#831843',
      topPillTextColor: '#FECACA',
      showTopPill: true,
      eventCardTitle: 'Semangat Patriotisme & Inovasi Vokasi',
      eventCardTitleFontSize: 13,
      eventCardSubtitle: 'SMK BISA - SMK HEBAT',
      eventCardSubtitleFontSize: 18,
      eventCardBorderColor: '#D97706',
      showEventCard: true,
      headlineText: 'PAHLAWANKU TELADANKU, VOKASI UNGGUL INDONESIA MAJU',
      headlineColor: '#0F172A',
      headlineFontSize: 28,
      headlineFontFamily: "'Plus Jakarta Sans', sans-serif",
      subtitleText: 'Terus Berkarya Nyata Menjawab Tantangan Dunia Kerja & Industri',
      subtitleColor: '#334155',
      subtitleFontSize: 14,
      dateText: '10 November 2026',
      dateFontSize: 11,
      dateColor: '#FFFFFF',
      dateBgColor: '#DC2626',
      dateBadgeStyle: 'pill',
      mainMediaUrl: SAMPLE_SPEAKER_PHOTO,
      isolateSubject: true,
      smartCropFocal: 'center',
      mainMediaScale: 1.0,
      mainMediaRotation: 0,
      mainMediaFlipH: false,
      mainMediaFlipV: false,
      footerImageUrl: '',
      footerLocked: true,
      footerHeightPercent: 7,
      useDefaultSocialFooter: true,
      socialFooterBgColor: '#7F1D1D',
      socialFooterTextColor: '#FFFFFF',
      socialFooterBorderColor: '#F59E0B',
      socialFooterFontSize: 18,
      socialHandles: {
        instagram: 'fyjchannel',
        website: 'fyjchannel.co.id',
        facebook: 'FYJ Channel',
        tiktok: 'fyjchannel',
      },
      accentColor: '#DC2626',
      bgColor: '#FEF2F2',
      secondaryBgColor: '#991B1B',
      supportingGraphics: [],
    },
  },
  {
    id: 'ppdb_vokasi',
    name: 'PPDB SMK Unggulan 2026/2027 - Pendaftaran Siswa Baru',
    category: 'Sekolah & Institusi Pendidikan',
    description: 'Desain penerimaan peserta didik baru (PPDB) yang modern, energik dan informatif dengan kombinasi biru dan oranye.',
    previewGradient: 'linear-gradient(135deg, #1E3A8A 0%, #0284C7 50%, #EA580C 100%)',
    data: {
      logoUrl: LOGO_SMK_KLUNGKUNG,
      logoLocked: true,
      institutionName: 'SMK NEGERI 1 KLUNGKUNG',
      customBgImageUrl: TEMPLATE_BG_PPDB,
      useCustomBgImage: true,
      backgroundLayers: [],
      watermarkUrl: WATERMARK_GARUDA,
      showWatermark: false,
      topPillText: 'PENERIMAAN PESERTA DIDIK BARU 2026/2027',
      topPillBgColor: '#1E3A8A',
      topPillTextColor: '#93C5FD',
      showTopPill: true,
      eventCardTitle: 'Jalur Prestasi, Zonasi & Afirmasi',
      eventCardTitleFontSize: 13,
      eventCardSubtitle: 'GELOMBANG 1 DIBUKA',
      eventCardSubtitleFontSize: 18,
      eventCardBorderColor: '#EA580C',
      showEventCard: true,
      headlineText: 'SIAPKAN MASA DEPAN GEMILANG BERSAMA SMK PUSAT KEUNGGULAN',
      headlineColor: '#0F172A',
      headlineFontSize: 27,
      headlineFontFamily: "'Plus Jakarta Sans', sans-serif",
      subtitleText: 'Daftar sekarang melalui portal online resmi: ppdb.smkn1klk.sch.id',
      subtitleColor: '#334155',
      subtitleFontSize: 14,
      dateText: 'Pendaftaran: 1 - 30 Juni 2026',
      dateFontSize: 11,
      dateColor: '#FFFFFF',
      dateBgColor: '#EA580C',
      dateBadgeStyle: 'pill',
      mainMediaUrl: SAMPLE_SPEAKER_PHOTO,
      isolateSubject: true,
      smartCropFocal: 'center',
      mainMediaScale: 1.0,
      mainMediaRotation: 0,
      mainMediaFlipH: false,
      mainMediaFlipV: false,
      footerImageUrl: '',
      footerLocked: true,
      footerHeightPercent: 7,
      useDefaultSocialFooter: true,
      socialFooterBgColor: '#1E3A8A',
      socialFooterTextColor: '#FFFFFF',
      socialFooterBorderColor: '#EA580C',
      socialFooterFontSize: 18,
      socialHandles: {
        instagram: 'fyjchannel',
        website: 'fyjchannel.co.id',
        facebook: 'FYJ Channel',
        tiktok: 'fyjchannel',
      },
      accentColor: '#EA580C',
      bgColor: '#F0F9FF',
      secondaryBgColor: '#1E3A8A',
      supportingGraphics: [],
    },
  },
  {
    id: 'dies_natalis',
    name: 'Dies Natalis & Gelar Karya Inovasi Siswa',
    category: 'Event & Pameran Pendidikan',
    description: 'Nuansa violet elegan dengan aksen cyan glow untuk expo hasil karya kewirausahaan dan ulang tahun sekolah.',
    previewGradient: 'linear-gradient(135deg, #4C1D95 0%, #7C3AED 50%, #06B6D4 100%)',
    data: {
      logoUrl: LOGO_SMK_KLUNGKUNG,
      logoLocked: true,
      institutionName: 'SMK NEGERI 1 KLUNGKUNG',
      customBgImageUrl: TEMPLATE_BG_VIBRANT_GRADIENT,
      useCustomBgImage: true,
      backgroundLayers: [],
      watermarkUrl: '',
      showWatermark: false,
      topPillText: 'DIES NATALIS & GELAR KARYA SISWA 2026',
      topPillBgColor: '#4C1D95',
      topPillTextColor: '#DDD6FE',
      showTopPill: true,
      eventCardTitle: 'Pameran Produk Inovasi & Kewirausahaan',
      eventCardTitleFontSize: 13,
      eventCardSubtitle: 'KREASI VOKASI',
      eventCardSubtitleFontSize: 18,
      eventCardBorderColor: '#06B6D4',
      showEventCard: true,
      headlineText: 'KARYA NYATA GENERASI EMAS MENUJU INDUSTRI 4.0',
      headlineColor: '#FFFFFF',
      headlineFontSize: 29,
      headlineFontFamily: "'Plus Jakarta Sans', sans-serif",
      subtitleText: 'Menampilkan Karya Unggulan Siswa dari Berbagai Bidang Keahlian',
      subtitleColor: '#DDD6FE',
      subtitleFontSize: 14,
      dateText: '22 - 24 Desember 2026',
      dateFontSize: 11,
      dateColor: '#FFFFFF',
      dateBgColor: '#7C3AED',
      dateBadgeStyle: 'pill',
      mainMediaUrl: SAMPLE_SPEAKER_PHOTO,
      isolateSubject: true,
      smartCropFocal: 'center',
      mainMediaScale: 1.0,
      mainMediaRotation: 0,
      mainMediaFlipH: false,
      mainMediaFlipV: false,
      footerImageUrl: '',
      footerLocked: true,
      footerHeightPercent: 7,
      useDefaultSocialFooter: true,
      socialFooterBgColor: '#312E81',
      socialFooterTextColor: '#FFFFFF',
      socialFooterBorderColor: '#38BDF8',
      socialFooterFontSize: 18,
      socialHandles: {
        instagram: 'fyjchannel',
        website: 'fyjchannel.co.id',
        facebook: 'FYJ Channel',
        tiktok: 'fyjchannel',
      },
      accentColor: '#06B6D4',
      bgColor: '#1E1B4B',
      secondaryBgColor: '#312E81',
      supportingGraphics: [],
    },
  },
  {
    id: 'seminar_ai',
    name: 'Workshop & Seminar Nasional AI Masa Depan',
    category: 'Teknologi & Bisnis',
    description: 'Format modern teknologi tinggi dengan grid futuristik dan aksen cyan elektrik untuk seminar dan workshop.',
    previewGradient: 'linear-gradient(135deg, #082F49 0%, #0284C7 50%, #38BDF8 100%)',
    data: {
      logoUrl: LOGO_SMK_KLUNGKUNG,
      logoLocked: true,
      institutionName: 'TECH VOKASI ACADEMY',
      customBgImageUrl: TEMPLATE_BG_CYBER_TECH,
      useCustomBgImage: true,
      backgroundLayers: [],
      watermarkUrl: '',
      showWatermark: false,
      topPillText: 'WORKSHOP TEKNOLOGI KECERDASAN BUATAN',
      topPillBgColor: '#082F49',
      topPillTextColor: '#38BDF8',
      showTopPill: true,
      eventCardTitle: 'Artificial Intelligence & Future Career',
      eventCardTitleFontSize: 13,
      eventCardSubtitle: 'KEYNOTE WORKSHOP',
      eventCardSubtitleFontSize: 18,
      eventCardBorderColor: '#06B6D4',
      showEventCard: true,
      headlineText: 'MENGUASAI AI UNTUK INDUSTRI KREATIF DAN REELS SOSMED',
      headlineColor: '#FFFFFF',
      headlineFontSize: 28,
      headlineFontFamily: "'Plus Jakarta Sans', sans-serif",
      subtitleText: 'Kupas Tuntas Otomasi Konten Digital dan Generative AI Multimodal',
      subtitleColor: '#7DD3FC',
      subtitleFontSize: 14,
      dateText: 'Sabtu, 14 November 2026',
      dateFontSize: 11,
      dateColor: '#0F172A',
      dateBgColor: '#38BDF8',
      dateBadgeStyle: 'pill',
      mainMediaUrl: SAMPLE_SPEAKER_PHOTO,
      isolateSubject: true,
      smartCropFocal: 'center',
      mainMediaScale: 1.0,
      mainMediaRotation: 0,
      mainMediaFlipH: false,
      mainMediaFlipV: false,
      footerImageUrl: '',
      footerLocked: true,
      footerHeightPercent: 7,
      useDefaultSocialFooter: true,
      socialFooterBgColor: '#0C4A6E',
      socialFooterTextColor: '#FFFFFF',
      socialFooterBorderColor: '#38BDF8',
      socialHandles: {
        instagram: 'techvokasi',
        website: 'seminar.vokasi.id',
        facebook: 'Tech Vokasi Indonesia',
        tiktok: 'techvokasi',
      },
      accentColor: '#38BDF8',
      bgColor: '#070D18',
      secondaryBgColor: '#0F172A',
      supportingGraphics: [],
    },
  },
  {
    id: 'esports_cup',
    name: 'Turnamen E-Sport Championship Pelajar 2026',
    category: 'Gaming & Pemuda Sosmed',
    description: 'Gaya visual energetik gaming neon toxic dengan latar gelap dan kontras tajam untuk kompetisi e-sport sosmed.',
    previewGradient: 'linear-gradient(135deg, #17072B 0%, #581C87 50%, #84CC16 100%)',
    data: {
      logoUrl: LOGO_SMK_KLUNGKUNG,
      logoLocked: true,
      institutionName: 'YOUTH ESPORTS LEAGUE',
      customBgImageUrl: TEMPLATE_BG_ESPORTS,
      useCustomBgImage: true,
      backgroundLayers: [],
      watermarkUrl: '',
      showWatermark: false,
      topPillText: 'PELAJAR ESPORTS CHAMPIONSHIP 2026',
      topPillBgColor: '#3B0764',
      topPillTextColor: '#BEF264',
      showTopPill: true,
      eventCardTitle: 'Mobile Legends & Free Fire National Series',
      eventCardTitleFontSize: 13,
      eventCardSubtitle: 'TOTAL PRIZE 50 JUTA',
      eventCardSubtitleFontSize: 18,
      eventCardBorderColor: '#84CC16',
      showEventCard: true,
      headlineText: 'BUKTIKAN KETANGGUHAN TIMMU DI ARENA JUARA',
      headlineColor: '#FFFFFF',
      headlineFontSize: 30,
      headlineFontFamily: "'Plus Jakarta Sans', sans-serif",
      subtitleText: 'Pendaftaran Terbuka untuk Seluruh Pelajar SMA/SMK se-Indonesia',
      subtitleColor: '#BEF264',
      subtitleFontSize: 14,
      dateText: 'Grand Final: 5 Desember 2026',
      dateFontSize: 11,
      dateColor: '#0F172A',
      dateBgColor: '#84CC16',
      dateBadgeStyle: 'pill',
      mainMediaUrl: SAMPLE_SPEAKER_PHOTO,
      isolateSubject: true,
      smartCropFocal: 'center',
      mainMediaScale: 1.0,
      mainMediaRotation: 0,
      mainMediaFlipH: false,
      mainMediaFlipV: false,
      footerImageUrl: '',
      footerLocked: true,
      footerHeightPercent: 7,
      useDefaultSocialFooter: true,
      socialFooterBgColor: '#2E1065',
      socialFooterTextColor: '#FFFFFF',
      socialFooterBorderColor: '#84CC16',
      socialHandles: {
        instagram: 'esports_pelajar',
        website: 'esportsleague.id',
        facebook: 'Youth Esports League',
        tiktok: 'esports_championship',
      },
      accentColor: '#84CC16',
      bgColor: '#090514',
      secondaryBgColor: '#17072B',
      supportingGraphics: [],
    },
  },
  {
    id: 'kuliner_promo',
    name: 'Festival Kuliner Nusantara & Grand Opening Resto',
    category: 'Bisnis, UMKM & Kuliner Sosmed',
    description: 'Palet hangat amber terakota yang menggugah selera untuk promosi bisnis F&B, UMKM, diskon resto, dan kuliner sosmed.',
    previewGradient: 'linear-gradient(135deg, #7C2D12 0%, #EA580C 50%, #F59E0B 100%)',
    data: {
      logoUrl: LOGO_SMK_KLUNGKUNG,
      logoLocked: true,
      institutionName: 'RESTO NUSANTARA TASTE',
      customBgImageUrl: TEMPLATE_BG_CULINARY,
      useCustomBgImage: true,
      backgroundLayers: [],
      watermarkUrl: '',
      showWatermark: false,
      topPillText: 'SPECIAL GRAND OPENING & PROMO DISKON 50%',
      topPillBgColor: '#7C2D12',
      topPillTextColor: '#FEF08A',
      showTopPill: true,
      eventCardTitle: 'Sensasi Rasa Otentik Masakan Nusantara',
      eventCardTitleFontSize: 13,
      eventCardSubtitle: 'BUY 1 GET 1 FREE',
      eventCardSubtitleFontSize: 18,
      eventCardBorderColor: '#F59E0B',
      showEventCard: true,
      headlineText: 'KELEZATAN KULINER TRADISIONAL BERKUALITAS BINTANG LIMA',
      headlineColor: '#FFFFFF',
      headlineFontSize: 28,
      headlineFontFamily: "'Plus Jakarta Sans', sans-serif",
      subtitleText: 'Kunjungi outlet kami dan nikmati sajian istimewa bersama keluarga',
      subtitleColor: '#FDE68A',
      subtitleFontSize: 14,
      dateText: 'Promo Berlaku: 1 - 15 November 2026',
      dateFontSize: 11,
      dateColor: '#7C2D12',
      dateBgColor: '#FDE68A',
      dateBadgeStyle: 'pill',
      mainMediaUrl: SAMPLE_SPEAKER_PHOTO,
      isolateSubject: true,
      smartCropFocal: 'center',
      mainMediaScale: 1.0,
      mainMediaRotation: 0,
      mainMediaFlipH: false,
      mainMediaFlipV: false,
      footerImageUrl: '',
      footerLocked: true,
      footerHeightPercent: 7,
      useDefaultSocialFooter: true,
      socialFooterBgColor: '#431407',
      socialFooterTextColor: '#FFFFFF',
      socialFooterBorderColor: '#F59E0B',
      socialHandles: {
        instagram: 'nusantara.taste',
        website: 'nusantarataste.id',
        facebook: 'Nusantara Taste Resto',
        tiktok: 'kuliner_nusantara',
      },
      accentColor: '#F59E0B',
      bgColor: '#431407',
      secondaryBgColor: '#7C2D12',
      supportingGraphics: [],
    },
  },
  {
    id: 'hari_guru',
    name: 'Hari Guru Nasional & Dedikasi Pendidik Karakter',
    category: 'Pendidikan & Karakter',
    description: 'Nuansa biru samudra berwibawa dengan aksen hijau dedikasi untuk menghormati bapak/ibu guru dan tenaga kependidikan.',
    previewGradient: 'linear-gradient(135deg, #0369A1 0%, #0284C7 50%, #15803D 100%)',
    data: {
      logoUrl: LOGO_SMK_KLUNGKUNG,
      logoLocked: true,
      institutionName: 'SMK NEGERI 1 KLUNGKUNG',
      customBgImageUrl: TEMPLATE_BG_ROYAL_GOLD,
      useCustomBgImage: true,
      backgroundLayers: [],
      watermarkUrl: WATERMARK_GARUDA,
      showWatermark: true,
      topPillText: 'MEMPERINGATI HARI GURU NASIONAL 2026',
      topPillBgColor: '#0369A1',
      topPillTextColor: '#E0F2FE',
      showTopPill: true,
      eventCardTitle: 'Dedikasi Tanpa Batas Membangun Karakter',
      eventCardTitleFontSize: 13,
      eventCardSubtitle: 'GURU PENGGERAK',
      eventCardSubtitleFontSize: 18,
      eventCardBorderColor: '#15803D',
      showEventCard: true,
      headlineText: 'GURU HEBAT, INDONESIA KUAT & BERMARTABAT',
      headlineColor: '#FFFFFF',
      headlineFontSize: 29,
      headlineFontFamily: "'Plus Jakarta Sans', sans-serif",
      subtitleText: 'Terima Kasih Atas Bimbingan dan Ketulusan Mendidik Generasi Bangsa',
      subtitleColor: '#BAE6FD',
      subtitleFontSize: 14,
      dateText: '25 November 2026',
      dateFontSize: 11,
      dateColor: '#FFFFFF',
      dateBgColor: '#0284C7',
      dateBadgeStyle: 'pill',
      mainMediaUrl: SAMPLE_SPEAKER_PHOTO,
      isolateSubject: true,
      smartCropFocal: 'center',
      mainMediaScale: 1.0,
      mainMediaRotation: 0,
      mainMediaFlipH: false,
      mainMediaFlipV: false,
      footerImageUrl: '',
      footerLocked: true,
      footerHeightPercent: 7,
      useDefaultSocialFooter: true,
      socialFooterBgColor: '#075985',
      socialFooterTextColor: '#FFFFFF',
      socialFooterBorderColor: '#86EFAC',
      socialFooterFontSize: 18,
      socialHandles: {
        instagram: 'fyjchannel',
        website: 'fyjchannel.co.id',
        facebook: 'FYJ Channel',
        tiktok: 'fyjchannel',
      },
      accentColor: '#15803D',
      bgColor: '#0C4A6E',
      secondaryBgColor: '#0369A1',
      supportingGraphics: [],
    },
  },
  {
    id: 'music_festival',
    name: 'Neon Soundwave Electronic Music Festival',
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
      eventCardTitleFontSize: 13,
      eventCardSubtitle: 'EDM STAGE',
      eventCardSubtitleFontSize: 18,
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
      dateFontSize: 11,
      dateColor: '#FFFFFF',
      dateBgColor: '#7C3AED',
      dateBadgeStyle: 'pill',
      mainMediaUrl: SAMPLE_SPEAKER_PHOTO,
      isolateSubject: true,
      smartCropFocal: 'center',
      mainMediaScale: 1.0,
      mainMediaRotation: 0,
      mainMediaFlipH: false,
      mainMediaFlipV: false,
      footerImageUrl: '',
      footerLocked: true,
      footerHeightPercent: 8,
      useDefaultSocialFooter: true,
      socialFooterBgColor: '#831843',
      socialFooterTextColor: '#FFFFFF',
      socialFooterBorderColor: '#EC4899',
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
    name: 'Quantum AI Global Summit 2026',
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
      eventCardTitleFontSize: 13,
      eventCardSubtitle: 'KEYNOTE SESSION',
      eventCardSubtitleFontSize: 18,
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
      dateFontSize: 11,
      dateColor: '#0F172A',
      dateBgColor: '#38BDF8',
      dateBadgeStyle: 'pill',
      mainMediaUrl: SAMPLE_SPEAKER_PHOTO,
      isolateSubject: true,
      smartCropFocal: 'subject',
      mainMediaScale: 1.0,
      mainMediaRotation: 0,
      mainMediaFlipH: false,
      mainMediaFlipV: false,
      footerImageUrl: '',
      footerLocked: true,
      footerHeightPercent: 8,
      useDefaultSocialFooter: true,
      socialFooterBgColor: '#082F49',
      socialFooterTextColor: '#FFFFFF',
      socialFooterBorderColor: '#06B6D4',
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
