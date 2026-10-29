// AI Generative Visual Assets Library
// Menyediakan aset gambar latar (background) dan aset visual subjek/media (hero)
// yang dihasilkan AI sesuai tema/topik acara secara otomatis dan bebas CORS.

// 1. TEMA PAHLAWAN & PATRIOTIK (10 November / Perjuangan / Hari Kemerdekaan)
export const AI_ASSET_BG_PAHLAWAN = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1080" preserveAspectRatio="none" fill="none">
  <defs>
    <linearGradient id="pahlawanSky" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="%237F1D1D"/>
      <stop offset="35%" stop-color="%23991B1B"/>
      <stop offset="70%" stop-color="%23B91C1C"/>
      <stop offset="100%" stop-color="%23450A0A"/>
    </linearGradient>
    <radialGradient id="fajarGlow" cx="50%" cy="30%" r="60%">
      <stop offset="0%" stop-color="%23FBBF24" stop-opacity="0.45"/>
      <stop offset="50%" stop-color="%23F59E0B" stop-opacity="0.2"/>
      <stop offset="100%" stop-color="%237F1D1D" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="flagWhite" x1="0" y1="1" x2="0" y2="0">
      <stop offset="0%" stop-color="%23FFFFFF" stop-opacity="0.95"/>
      <stop offset="60%" stop-color="%23F8FAFC" stop-opacity="0.5"/>
      <stop offset="100%" stop-color="%23FFFFFF" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect width="1080" height="1080" fill="url(%23pahlawanSky)"/>
  <circle cx="540" cy="320" r="460" fill="url(%23fajarGlow)"/>
  <!-- Indonesian Flag Wave Accent -->
  <path d="M-60 760 C220 660, 480 840, 800 710 C980 640, 1100 700, 1160 680 L1160 1160 L-60 1160 Z" fill="url(%23flagWhite)"/>
  <!-- Sunburst Rays -->
  <g opacity="0.12" stroke="%23FDE047" stroke-width="4">
    <line x1="540" y1="320" x2="0" y2="0"/>
    <line x1="540" y1="320" x2="270" y2="0"/>
    <line x1="540" y1="320" x2="540" y2="0"/>
    <line x1="540" y1="320" x2="810" y2="0"/>
    <line x1="540" y1="320" x2="1080" y2="0"/>
    <line x1="540" y1="320" x2="1080" y2="320"/>
    <line x1="540" y1="320" x2="0" y2="320"/>
  </g>
  <!-- Garuda Crest Silhouette Wings Accent -->
  <circle cx="540" cy="380" r="340" stroke="%23FCD34D" stroke-width="2.5" stroke-dasharray="14 14" fill="none" opacity="0.25"/>
  <circle cx="540" cy="380" r="280" stroke="%23F59E0B" stroke-width="1.5" fill="none" opacity="0.2"/>
</svg>`;

export const AI_ASSET_SUBJECT_PAHLAWAN = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 650" fill="none">
  <defs>
    <linearGradient id="heroSuit" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="%23991B1B"/>
      <stop offset="100%" stop-color="%23450A0A"/>
    </linearGradient>
    <linearGradient id="heroSkin" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="%23FED7AA"/>
      <stop offset="100%" stop-color="%23FDBA74"/>
    </linearGradient>
    <radialGradient id="heroGlow" cx="50%" cy="40%" r="55%">
      <stop offset="0%" stop-color="%23FEF08A" stop-opacity="0.6"/>
      <stop offset="60%" stop-color="%23F59E0B" stop-opacity="0.2"/>
      <stop offset="100%" stop-color="%23FFFFFF" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="goldMedal" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="%23FDE047"/>
      <stop offset="100%" stop-color="%23D97706"/>
    </linearGradient>
  </defs>
  <!-- Hero Aura Halo -->
  <circle cx="250" cy="270" r="230" fill="url(%23heroGlow)"/>
  <!-- Body / Pejuang Jacket -->
  <path d="M110 470 C110 370, 390 370, 390 470 L450 650 L50 650 Z" fill="url(%23heroSuit)"/>
  <!-- White Inner Shirt -->
  <polygon points="250,370 295,470 205,470" fill="white"/>
  <!-- Gold Merit Badge & Sash -->
  <path d="M160 410 L310 590 L340 570 L190 390 Z" fill="url(%23goldMedal)" opacity="0.9"/>
  <!-- Neck -->
  <rect x="220" y="310" width="60" height="70" rx="12" fill="url(%23heroSkin)"/>
  <!-- Head -->
  <ellipse cx="250" cy="250" rx="80" ry="95" fill="url(%23heroSkin)"/>
  <!-- Pejuang Red & White Headband (Ikat Kepala Merah Putih) -->
  <path d="M165 205 C190 190, 310 190, 335 205 L338 230 C310 215, 190 215, 162 230 Z" fill="%23DC2626"/>
  <path d="M163 223 C190 210, 310 210, 337 223 L338 232 C310 218, 190 218, 162 232 Z" fill="%23FFFFFF"/>
  <!-- Hair Above Headband -->
  <path d="M170 205 C170 120, 330 120, 330 205 C330 145, 280 135, 250 135 C220 135, 175 145, 170 205 Z" fill="%231C1917"/>
  <!-- Eyes & Eyebrows (Tegas & Optimis) -->
  <path d="M200 238 Q220 228, 235 238" stroke="%23292524" stroke-width="4.5" stroke-linecap="round"/>
  <path d="M265 238 Q280 228, 300 238" stroke="%23292524" stroke-width="4.5" stroke-linecap="round"/>
  <circle cx="218" cy="252" r="7.5" fill="%231C1917"/>
  <circle cx="282" cy="252" r="7.5" fill="%231C1917"/>
  <!-- Nose & Confident Smile -->
  <path d="M250 252 L245 274 L255 274" stroke="%23C2410C" stroke-width="3" stroke-linecap="round" fill="none"/>
  <path d="M230 295 Q250 312, 270 295" stroke="%239A3412" stroke-width="4" stroke-linecap="round" fill="none"/>
</svg>`;

// 2. TEMA DIES NATALIS / EXPO KARYA / GEBYAR PRESTASI
export const AI_ASSET_BG_DIESNATALIS = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1080" preserveAspectRatio="none" fill="none">
  <defs>
    <linearGradient id="natalisBg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="%232E1065"/>
      <stop offset="50%" stop-color="%234C1D95"/>
      <stop offset="100%" stop-color="%230F172A"/>
    </linearGradient>
    <radialGradient id="stageLight" cx="50%" cy="10%" r="70%">
      <stop offset="0%" stop-color="%23FDE047" stop-opacity="0.4"/>
      <stop offset="40%" stop-color="%23C084FC" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="%232E1065" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="cyanOrb" cx="85%" cy="80%" r="45%">
      <stop offset="0%" stop-color="%2306B6D4" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="%2306B6D4" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1080" height="1080" fill="url(%23natalisBg)"/>
  <rect width="1080" height="1080" fill="url(%23stageLight)"/>
  <circle cx="850" cy="800" r="400" fill="url(%23cyanOrb)"/>
  <!-- Floating Sparkles & Confetti -->
  <g fill="%23FDE047" opacity="0.6">
    <polygon points="200,180 206,198 224,204 206,210 200,228 194,210 176,204 194,198"/>
    <polygon points="860,220 864,234 878,238 864,242 860,256 856,242 842,238 856,234"/>
    <polygon points="150,520 154,534 168,538 154,542 150,556 146,542 132,538 146,534"/>
    <circle cx="340" cy="140" r="4"/>
    <circle cx="720" cy="160" r="5"/>
    <circle cx="910" cy="420" r="6"/>
  </g>
  <path d="M-50 880 Q 540 760 1150 890 L 1150 1150 L -50 1150 Z" fill="rgba(192, 132, 252, 0.15)"/>
</svg>`;

export const AI_ASSET_SUBJECT_DIESNATALIS = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 650" fill="none">
  <defs>
    <linearGradient id="trophyGold" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="%23FDE047"/>
      <stop offset="50%" stop-color="%23F59E0B"/>
      <stop offset="100%" stop-color="%23B45309"/>
    </linearGradient>
    <radialGradient id="tHalo" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="%23FDE047" stop-opacity="0.8"/>
      <stop offset="60%" stop-color="%23A855F7" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="%23000000" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <circle cx="250" cy="310" r="240" fill="url(%23tHalo)"/>
  <!-- Grand Award Trophy Cup -->
  <!-- Cup Base -->
  <rect x="180" y="520" width="140" height="30" rx="8" fill="url(%23trophyGold)"/>
  <polygon points="210,520 290,520 270,440 230,440" fill="url(%23trophyGold)"/>
  <!-- Cup Stem Rib -->
  <rect x="235" y="420" width="30" height="25" rx="4" fill="%23FEF08A"/>
  <!-- Cup Body -->
  <path d="M150 220 C150 380, 350 380, 350 220 Z" fill="url(%23trophyGold)"/>
  <!-- Left Handle -->
  <path d="M165 240 C100 240, 100 340, 175 340" stroke="url(%23trophyGold)" stroke-width="18" stroke-linecap="round" fill="none"/>
  <!-- Right Handle -->
  <path d="M335 240 C400 240, 400 340, 325 340" stroke="url(%23trophyGold)" stroke-width="18" stroke-linecap="round" fill="none"/>
  <!-- Star on Cup -->
  <polygon points="250,250 258,274 283,274 263,289 270,313 250,298 230,313 237,289 217,274 242,274" fill="%23FFFFFF"/>
  <!-- Sparkles -->
  <circle cx="160" cy="180" r="8" fill="%23FFFFFF"/>
  <circle cx="340" cy="190" r="6" fill="%23FFFFFF"/>
</svg>`;

// 3. TEMA PPDB & PENDIDIKAN UNGGULAN
export const AI_ASSET_BG_PPDB = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1080" preserveAspectRatio="none" fill="none">
  <defs>
    <linearGradient id="ppdbDark" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="%230F172A"/>
      <stop offset="45%" stop-color="%231E3A8A"/>
      <stop offset="100%" stop-color="%230369A1"/>
    </linearGradient>
    <linearGradient id="accentOrange" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="%23EA580C"/>
      <stop offset="100%" stop-color="%23F59E0B"/>
    </linearGradient>
  </defs>
  <rect width="1080" height="1080" fill="url(%23ppdbDark)"/>
  <!-- Dynamic Educational Waves -->
  <path d="M-60 840 Q 300 690 680 850 T 1160 790 L 1160 1160 L -60 1160 Z" fill="url(%23accentOrange)" opacity="0.92"/>
  <path d="M-60 890 Q 380 750 820 900 T 1160 840 L 1160 1160 L -60 1160 Z" fill="%23FFFFFF" opacity="0.18"/>
  <circle cx="940" cy="200" r="260" fill="%2338BDF8" fill-opacity="0.16"/>
  <circle cx="140" cy="320" r="160" fill="%23F59E0B" fill-opacity="0.12"/>
</svg>`;

export const AI_ASSET_SUBJECT_PPDB = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 650" fill="none">
  <defs>
    <linearGradient id="studentSuit" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="%232563EB"/>
      <stop offset="100%" stop-color="%231E3A8A"/>
    </linearGradient>
    <linearGradient id="studentSkin" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="%23FED7AA"/>
      <stop offset="100%" stop-color="%23FDBA74"/>
    </linearGradient>
    <radialGradient id="studyHalo" cx="50%" cy="40%" r="55%">
      <stop offset="0%" stop-color="%2360A5FA" stop-opacity="0.55"/>
      <stop offset="100%" stop-color="%23FFFFFF" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <circle cx="250" cy="270" r="220" fill="url(%23studyHalo)"/>
  <!-- Student Body & Jacket -->
  <path d="M110 470 C110 370, 390 370, 390 470 L450 650 L50 650 Z" fill="url(%23studentSuit)"/>
  <!-- White Collar -->
  <polygon points="250,370 295,470 205,470" fill="white"/>
  <!-- Tie Oranye Kejuruan -->
  <polygon points="250,380 260,450 250,510 240,450" fill="%23EA580C"/>
  <!-- Neck -->
  <rect x="220" y="310" width="60" height="70" rx="10" fill="url(%23studentSkin)"/>
  <!-- Head -->
  <ellipse cx="250" cy="250" rx="75" ry="90" fill="url(%23studentSkin)"/>
  <!-- Modern Hair -->
  <path d="M175 230 C175 140, 325 140, 325 230 C325 160, 275 150, 250 150 C220 150, 180 160, 175 230 Z" fill="%231E293B"/>
  <!-- Friendly Eyes & Smile -->
  <circle cx="220" cy="245" r="7" fill="%230F172A"/>
  <circle cx="280" cy="245" r="7" fill="%230F172A"/>
  <path d="M250 248 L246 268 L254 268" stroke="%23EA580C" stroke-width="2.5" stroke-linecap="round" fill="none"/>
  <path d="M225 288 Q250 306, 275 288" stroke="%23C2410C" stroke-width="3.5" stroke-linecap="round" fill="none"/>
  <!-- Diploma / Folder on hand -->
  <rect x="180" y="530" width="140" height="60" rx="8" fill="%23F59E0B" stroke="%23FFFFFF" stroke-width="3"/>
  <line x1="200" y1="550" x2="300" y2="550" stroke="%2378350F" stroke-width="4" stroke-linecap="round"/>
  <line x1="200" y1="565" x2="270" y2="565" stroke="%2378350F" stroke-width="3" stroke-linecap="round"/>
</svg>`;

// 4. TEMA E-SPORTS & GAMING
export const AI_ASSET_BG_ESPORTS = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1080" preserveAspectRatio="none" fill="none">
  <defs>
    <linearGradient id="esportSky" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="%23080512"/>
      <stop offset="50%" stop-color="%2319082F"/>
      <stop offset="100%" stop-color="%23030206"/>
    </linearGradient>
    <radialGradient id="toxicRad" cx="50%" cy="35%" r="55%">
      <stop offset="0%" stop-color="%2384CC16" stop-opacity="0.4"/>
      <stop offset="60%" stop-color="%23A855F7" stop-opacity="0.2"/>
      <stop offset="100%" stop-color="%23000000" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1080" height="1080" fill="url(%23esportSky)"/>
  <circle cx="540" cy="380" r="480" fill="url(%23toxicRad)"/>
  <!-- Hexagon Cyber Shields -->
  <polygon points="540,80 980,340 820,850 260,850 100,340" stroke="%2384CC16" stroke-width="2.5" stroke-opacity="0.4" fill="none"/>
  <polygon points="540,130 930,360 790,820 290,820 150,360" stroke="%23A855F7" stroke-width="2" stroke-opacity="0.3" fill="none"/>
</svg>`;

export const AI_ASSET_SUBJECT_ESPORTS = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 650" fill="none">
  <defs>
    <linearGradient id="gamerSuit" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="%231E1B4B"/>
      <stop offset="100%" stop-color="%230F172A"/>
    </linearGradient>
    <radialGradient id="neonHeadHalo" cx="50%" cy="40%" r="50%">
      <stop offset="0%" stop-color="%2384CC16" stop-opacity="0.6"/>
      <stop offset="60%" stop-color="%23A855F7" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="%23000000" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <circle cx="250" cy="270" r="230" fill="url(%23neonHeadHalo)"/>
  <!-- Gamer Body / Hoodie -->
  <path d="M100 470 C100 360, 400 360, 400 470 L450 650 L50 650 Z" fill="url(%23gamerSuit)"/>
  <!-- Neon Neon Trim on Hoodie -->
  <path d="M190 380 L250 490 L310 380" stroke="%2384CC16" stroke-width="6" stroke-linecap="round" fill="none"/>
  <!-- Head & Gamer Headset -->
  <ellipse cx="250" cy="260" rx="75" ry="90" fill="%23FED7AA"/>
  <!-- Headset Band -->
  <path d="M165 240 C165 130, 335 130, 335 240" stroke="%2384CC16" stroke-width="14" fill="none"/>
  <!-- Left Headset Ear-Cup -->
  <rect x="150" y="220" width="26" height="55" rx="12" fill="%23A855F7" stroke="%2384CC16" stroke-width="3"/>
  <!-- Right Headset Ear-Cup -->
  <rect x="324" y="220" width="26" height="55" rx="12" fill="%23A855F7" stroke="%2384CC16" stroke-width="3"/>
  <!-- Mic Extension -->
  <path d="M160 260 L190 290 L220 290" stroke="%2384CC16" stroke-width="4" stroke-linecap="round" fill="none"/>
  <!-- Cyber Glasses / Visor -->
  <rect x="185" y="235" width="130" height="32" rx="10" fill="%2306B6D4" opacity="0.85"/>
  <!-- Controller in Hand -->
  <rect x="160" y="520" width="180" height="70" rx="28" fill="%231E293B" stroke="%2384CC16" stroke-width="4"/>
  <circle cx="200" cy="555" r="14" fill="%23A855F7"/>
  <circle cx="300" cy="555" r="14" fill="%2384CC16"/>
</svg>`;

// 5. TEMA AI, SEMINAR TEKNOLOGI & WORKSHOP MASA DEPAN
export const AI_ASSET_BG_AI_TECH = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1080" preserveAspectRatio="none" fill="none">
  <defs>
    <linearGradient id="aiTechBg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="%23021024"/>
      <stop offset="50%" stop-color="%23052659"/>
      <stop offset="100%" stop-color="%23010712"/>
    </linearGradient>
    <radialGradient id="cyberBrainGlow" cx="50%" cy="35%" r="55%">
      <stop offset="0%" stop-color="%2306B6D4" stop-opacity="0.45"/>
      <stop offset="50%" stop-color="%233B82F6" stop-opacity="0.2"/>
      <stop offset="100%" stop-color="%23000000" stop-opacity="0"/>
    </radialGradient>
    <pattern id="aiGrid" width="60" height="60" patternUnits="userSpaceOnUse">
      <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(56, 189, 248, 0.12)" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="1080" height="1080" fill="url(%23aiTechBg)"/>
  <rect width="1080" height="1080" fill="url(%23aiGrid)"/>
  <circle cx="540" cy="380" r="480" fill="url(%23cyberBrainGlow)"/>
  <polygon points="120,80 160,105 160,155 120,180 80,155 80,105" stroke="%2338BDF8" stroke-width="2" fill="none" opacity="0.3"/>
  <polygon points="960,140 1000,165 1000,215 960,240 920,215 920,165" stroke="%2338BDF8" stroke-width="2" fill="none" opacity="0.3"/>
</svg>`;

export const AI_ASSET_SUBJECT_AI_TECH = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 650" fill="none">
  <defs>
    <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="%2367E8F9" stop-opacity="0.9"/>
      <stop offset="50%" stop-color="%2306B6D4" stop-opacity="0.5"/>
      <stop offset="100%" stop-color="%233B82F6" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="circuitGold" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="%2338BDF8"/>
      <stop offset="100%" stop-color="%23818CF8"/>
    </linearGradient>
  </defs>
  <circle cx="250" cy="300" r="230" fill="url(%23coreGlow)"/>
  <!-- Quantum AI Core Hologram Ring -->
  <circle cx="250" cy="300" r="160" stroke="%2338BDF8" stroke-width="4" stroke-dasharray="16 12" fill="none"/>
  <circle cx="250" cy="300" r="130" stroke="%23818CF8" stroke-width="3" stroke-dasharray="24 8" fill="none"/>
  <circle cx="250" cy="300" r="90" stroke="%2322D3EE" stroke-width="5" fill="none"/>
  <!-- Brain / Neural Nodes -->
  <g stroke="url(%23circuitGold)" stroke-width="3">
    <line x1="250" y1="210" x2="210" y2="260"/>
    <line x1="250" y1="210" x2="290" y2="260"/>
    <line x1="210" y1="260" x2="230" y2="330"/>
    <line x1="290" y1="260" x2="270" y2="330"/>
    <line x1="230" y1="330" x2="250" y2="390"/>
    <line x1="270" y1="330" x2="250" y2="390"/>
  </g>
  <circle cx="250" cy="210" r="10" fill="%23FFFFFF"/>
  <circle cx="210" cy="260" r="10" fill="%2338BDF8"/>
  <circle cx="290" cy="260" r="10" fill="%2338BDF8"/>
  <circle cx="230" cy="330" r="10" fill="%23818CF8"/>
  <circle cx="270" cy="330" r="10" fill="%23818CF8"/>
  <circle cx="250" cy="390" r="10" fill="%23FFFFFF"/>
</svg>`;

// Helper untuk memilih aset berdasarkan analisis topik
export function getAIAssetsForTopic(topic: string) {
  const t = topic.toLowerCase();

  if (t.includes('pahlawan') || t.includes('nasional') || t.includes('patriotik') || t.includes('merdeka')) {
    return {
      customBgImageUrl: AI_ASSET_BG_PAHLAWAN,
      bgName: 'Patriotik Merah Putih & Fajar Emas',
      bgDescription: 'Latar resmi peringatan nasional dengan kibaran sang saka & siluet cahaya kepahlawanan.',
      mainMediaUrl: AI_ASSET_SUBJECT_PAHLAWAN,
      mainMediaName: 'Sosok Pejuang & Generasi Juang',
      mainMediaDescription: 'Ilustrasi patriot muda berikat kepala merah-putih berkarakter wibawa & inspiratif.',
    };
  }

  if (t.includes('dies') || t.includes('natalis') || t.includes('hut') || t.includes('gebyar') || t.includes('wisuda') || t.includes('expo')) {
    return {
      customBgImageUrl: AI_ASSET_BG_DIESNATALIS,
      bgName: 'Panggung Dies Natalis & Confetti Gold',
      bgDescription: 'Latar panggung perayaan megah ungu-magenta gelap dengan kilau bintang prestasi.',
      mainMediaUrl: AI_ASSET_SUBJECT_DIESNATALIS,
      mainMediaName: 'Piala Prestasi Emas (Gold Award Trophy)',
      mainMediaDescription: 'Ilustrasi trofi kejuaraan emas bergengsi dengan aura kejayaan vokasi.',
    };
  }

  if (t.includes('ppdb') || t.includes('siswa baru') || t.includes('daftar') || t.includes('penerimaan')) {
    return {
      customBgImageUrl: AI_ASSET_BG_PPDB,
      bgName: 'PPDB Vokasi Gelombang Biru Oranye',
      bgDescription: 'Latar biru navy dan oranye energik dengan hierarki teks jelas untuk sosialisasi pendaftaran.',
      mainMediaUrl: AI_ASSET_SUBJECT_PPDB,
      mainMediaName: 'Siswa Berprestasi & Sertifikat Vokasi',
      mainMediaDescription: 'Ilustrasi pelajar inspiratif bersiap menyambut masa depan gemilang.',
    };
  }

  if (t.includes('esport') || t.includes('game') || t.includes('turnamen') || t.includes('championship')) {
    return {
      customBgImageUrl: AI_ASSET_BG_ESPORTS,
      bgName: 'Arena Cyber Toxic Neon Dark',
      bgDescription: 'Latar bertema kompetisi gaming berintensitas tinggi dengan heksagon cyber futuristik.',
      mainMediaUrl: AI_ASSET_SUBJECT_ESPORTS,
      mainMediaName: 'Avatar Pro Gamer Headset RGB',
      mainMediaDescription: 'Karakter atlet e-sports profesional ber-headset neon dan konsol gaming.',
    };
  }

  if (t.includes('ai') || t.includes('kecerdasan') || t.includes('workshop') || t.includes('seminar') || t.includes('teknologi')) {
    return {
      customBgImageUrl: AI_ASSET_BG_AI_TECH,
      bgName: 'Cyber Grid & Hologram Neural Network',
      bgDescription: 'Latar teknologi canggih biru kosmik dengan matriks komputasi digital.',
      mainMediaUrl: AI_ASSET_SUBJECT_AI_TECH,
      mainMediaName: 'Inti Kuantum Kecerdasan Buatan (AI Core)',
      mainMediaDescription: 'Visual hologram simpul saraf neural AI dan sirkuit bercahaya cyan futuristik.',
    };
  }

  // Fallback Umum: Elegan FYJ Master
  return {
    customBgImageUrl: AI_ASSET_BG_PAHLAWAN,
    bgName: 'Harmoni Visual Publikasi FYJ',
    bgDescription: 'Latar dinamis dengan kontras tinggi WCAG AA yang diselaraskan oleh AI.',
    mainMediaUrl: AI_ASSET_SUBJECT_PAHLAWAN,
    mainMediaName: 'Subjek Kreatif Resmi FYJ',
    mainMediaDescription: 'Ilustrasi visual sentral untuk memperkuat pesan utama informasi.',
  };
}
