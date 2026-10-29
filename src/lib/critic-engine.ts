import {
  AssetInputs,
  OutputFormat,
  CriticIssue,
  ACGTReport,
} from '@/types/design';

/**
 * Formula Perceptual Luminance (WCAG 2.1)
 * Standard relative luminance of sRGB colors
 */
export function getRelativeLuminance(hex?: string): number {
  if (!hex || typeof hex !== 'string') return 0.5;
  const cleanHex = hex.replace('#', '').trim();
  if (cleanHex.length !== 6) return 0.5;
  const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
  const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
  const b = parseInt(cleanHex.substring(4, 6), 16) / 255;
  if (isNaN(r) || isNaN(g) || isNaN(b)) return 0.5;

  const a = [r, g, b].map((v) => {
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });

  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

/**
 * Calculates WCAG 2.1 Contrast Ratio between two hex colors:
 * (L1 + 0.05) / (L2 + 0.05)
 */
export function getContrastRatio(hex1: string, hex2: string): number {
  try {
    const l1 = getRelativeLuminance(hex1);
    const l2 = getRelativeLuminance(hex2);
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    return Number(((lighter + 0.05) / (darker + 0.05)).toFixed(2));
  } catch (e) {
    return 4.5;
  }
}

/**
 * Find the optimal high-contrast color (WCAG AA compliant >= 4.5:1)
 * for a given background color
 */
export function getOptimalTextColor(bgHex: string): string {
  const whiteRatio = getContrastRatio('#FFFFFF', bgHex);
  const darkRatio = getContrastRatio('#0F172A', bgHex);

  if (whiteRatio >= 4.5) return '#FFFFFF';
  if (darkRatio >= 4.5) return '#0F172A';
  return whiteRatio > darkRatio ? '#FFFFFF' : '#0F172A';
}

/**
 * Platform Safe-zone definitions in normalized coordinates and pixels
 */
export interface SafeZoneBoundary {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

export function getSafeZoneForFormat(
  format: OutputFormat,
  width: number,
  height: number
): SafeZoneBoundary {
  if (format === 'reels_9_16') {
    // 9:16 Instagram Reels: top UI bar (140px), bottom caption & audio (320px), right action buttons (100px)
    return {
      top: Math.round(height * 0.1), // ~190px on 1920
      bottom: Math.round(height * 0.18), // ~345px on 1920
      left: Math.round(width * 0.05), // ~54px
      right: Math.round(width * 0.12), // ~130px (action buttons)
    };
  } else if (format === 'poster_4_5') {
    // 4:5 Instagram Portrait
    return {
      top: Math.round(height * 0.05),
      bottom: Math.round(height * 0.07),
      left: Math.round(width * 0.04),
      right: Math.round(width * 0.04),
    };
  } else {
    // 1:1 Instagram Square
    return {
      top: Math.round(height * 0.04),
      bottom: Math.round(height * 0.05),
      left: Math.round(width * 0.04),
      right: Math.round(width * 0.04),
    };
  }
}

/**
 * ACGT Deterministic Analysis Engine
 * Evaluates Contrast, Hierarchy, Spatial Balance, and Visual Density
 */
export function runACGTDeterministicAnalysis(
  rawAssets: Partial<AssetInputs> | AssetInputs,
  format: OutputFormat,
  canvasWidth: number = 800,
  canvasHeight: number = 800
): ACGTReport {
  const assets: AssetInputs = {
    bgColor: '#070B14',
    headlineColor: '#FFFFFF',
    headlineFontSize: 36,
    subtitleColor: '#94A3B8',
    subtitleFontSize: 16,
    dateColor: '#FFFFFF',
    dateBgColor: '#2563EB',
    footerHeightPercent: 12,
    supportingGraphics: [],
    ...(rawAssets || {}),
  } as AssetInputs;

  const startTime = performance.now();
  const issues: CriticIssue[] = [];

  // Dimensions based on format
  let w = canvasWidth;
  let h = canvasHeight;
  if (format === 'reels_9_16') {
    w = 540;
    h = 960;
  } else if (format === 'poster_4_5') {
    w = 640;
    h = 800;
  } else {
    w = 700;
    h = 700;
  }

  const safeZone = getSafeZoneForFormat(format, w, h);

  // 1. KONTRAST WARNA (WCAG 2.1 AA/AAA)
  // Headline Contrast
  const headlineRatio = getContrastRatio(assets.headlineColor, assets.bgColor);
  const minRequiredRatio = assets.headlineFontSize >= 24 ? 3.0 : 4.5;

  if (headlineRatio < minRequiredRatio) {
    const recommendedHex = getOptimalTextColor(assets.bgColor);
    issues.push({
      issue_id: 'ERR_CONTRAST_HEADLINE',
      category: 'color_contrast',
      severity: headlineRatio < 2.2 ? 'high' : 'medium',
      target_layer: 'headline',
      bounding_box: [
        Math.round(w * 0.1),
        Math.round(h * 0.28),
        Math.round(w * 0.8),
        Math.round(assets.headlineFontSize * 2),
      ],
      description: `Rasio kontras teks judul (${headlineRatio}:1) di bawah standar WCAG AA (${minRequiredRatio}:1). Keterbacaan terganggu di atas latar belakang saat ini.`,
      current_value: assets.headlineColor,
      recommended_value: recommendedHex,
      auto_fix: {
        property: 'headlineColor',
        value: recommendedHex,
        description: `Ubah warna teks judul ke ${recommendedHex} untuk mencapai kontras tajam & lolos WCAG 2.1.`,
      },
    });
  }

  // Subtitle Contrast
  const subtitleRatio = getContrastRatio(assets.subtitleColor, assets.bgColor);
  if (subtitleRatio < 4.5) {
    const recSubHex = getOptimalTextColor(assets.bgColor);
    issues.push({
      issue_id: 'ERR_CONTRAST_SUBTITLE',
      category: 'color_contrast',
      severity: 'medium',
      target_layer: 'subtitle',
      bounding_box: [
        Math.round(w * 0.1),
        Math.round(h * 0.42),
        Math.round(w * 0.7),
        Math.round(assets.subtitleFontSize * 1.6),
      ],
      description: `Rasio kontras sub-judul (${subtitleRatio}:1) belum memenuhi standar WCAG AA (4.5:1).`,
      current_value: assets.subtitleColor,
      recommended_value: recSubHex,
      auto_fix: {
        property: 'subtitleColor',
        value: recSubHex,
        description: `Sesuaikan warna teks sub-judul ke ${recSubHex}.`,
      },
    });
  }

  // Date Badge Contrast
  const dateRatio = getContrastRatio(assets.dateColor, assets.dateBgColor);
  if (dateRatio < 3.0) {
    const recDateText = getOptimalTextColor(assets.dateBgColor);
    issues.push({
      issue_id: 'ERR_CONTRAST_DATE_BADGE',
      category: 'color_contrast',
      severity: 'low',
      target_layer: 'dateBadge',
      bounding_box: [
        Math.round(w * 0.08),
        Math.round(h * 0.2),
        Math.round(w * 0.4),
        44,
      ],
      description: `Kontras teks tanggal di dalam badge (${dateRatio}:1) terlalu rendah.`,
      current_value: assets.dateColor,
      recommended_value: recDateText,
      auto_fix: {
        property: 'dateColor',
        value: recDateText,
        description: `Ubah warna teks tanggal menjadi ${recDateText} agar kontras di dalam badge.`,
      },
    });
  }

  // Top Pill Banner Contrast
  if (assets.showTopPill && assets.topPillText) {
    const topPillRatio = getContrastRatio(assets.topPillTextColor || '#86EFAC', assets.topPillBgColor || '#05472A');
    if (topPillRatio < 3.5) {
      const recPillText = getOptimalTextColor(assets.topPillBgColor || '#05472A');
      issues.push({
        issue_id: 'ERR_CONTRAST_TOP_BANNER',
        category: 'color_contrast',
        severity: 'medium',
        target_layer: 'topPill',
        bounding_box: [Math.round(w * 0.1), Math.round(h * 0.12), Math.round(w * 0.8), 44],
        description: `Rasio kontras teks banner atas (${topPillRatio}:1) terlalu rendah di atas warna latar banner saat ini.`,
        current_value: assets.topPillTextColor,
        recommended_value: recPillText,
        auto_fix: {
          property: 'topPillTextColor',
          value: recPillText,
          description: `Ubah warna teks banner atas menjadi ${recPillText} agar terbaca jelas.`,
        },
      });
    }
  }

  // 2. HIERARKI TIPOGRAFI
  // Standard ratio Headline to Subtitle should be around 1.8x - 2.5x
  const headlineToSubRatio = assets.headlineFontSize / (assets.subtitleFontSize || 16);
  if (headlineToSubRatio < 1.45) {
    const recommendedHeadlineSize = Math.round(assets.subtitleFontSize * 2.1);
    issues.push({
      issue_id: 'ERR_HIERARCHY_RATIO',
      category: 'hierarchy',
      severity: 'high',
      target_layer: 'headline',
      bounding_box: [
        Math.round(w * 0.1),
        Math.round(h * 0.28),
        Math.round(w * 0.8),
        Math.round(assets.headlineFontSize * 2),
      ],
      description: `Hierarki visual lemah. Rasio ukuran Judul terhadap Subjudul hanya ${headlineToSubRatio.toFixed(
        2
      )}x (Rekomendasi profesional: 2.0x - 2.5x). Judul kurang dominan sebagai pusat perhatian visual.`,
      current_value: `${assets.headlineFontSize}px`,
      recommended_value: `${recommendedHeadlineSize}px`,
      auto_fix: {
        property: 'headlineFontSize',
        value: recommendedHeadlineSize,
        description: `Tingkatkan ukuran font judul ke ${recommendedHeadlineSize}px untuk mempertegas focal point.`,
      },
    });
  }

  // 3. KESEIMBANGAN SPASIAL & SAFE ZONE VIOLATION
  if (format === 'reels_9_16') {
    // Check if footer height violates bottom safe zone
    if (assets.footerHeightPercent > 22) {
      issues.push({
        issue_id: 'ERR_SAFEZONE_REELS_FOOTER',
        category: 'safe_zone_violation',
        severity: 'high',
        target_layer: 'footer',
        bounding_box: [
          0,
          Math.round(h * (1 - assets.footerHeightPercent / 100)),
          w,
          Math.round(h * (assets.footerHeightPercent / 100)),
        ],
        description: `Tinggi footer (${assets.footerHeightPercent}%) menabrak area antarmuka bawaan Instagram Reels (caption, sound info, dan bilah progres video).`,
        current_value: `${assets.footerHeightPercent}%`,
        recommended_value: '14%',
        auto_fix: {
          property: 'footerHeightPercent',
          value: 14,
          description: `Koreksi tinggi footer menjadi 14% agar berada tepat di atas deskripsi video Reels.`,
        },
      });
    }

    // Check if headline is too close to top safe zone in Reels
    if (assets.headlineFontSize > 48) {
      issues.push({
        issue_id: 'ERR_SAFEZONE_HEADLINE_OVERFLOW',
        category: 'safe_zone_violation',
        severity: 'medium',
        target_layer: 'headline',
        bounding_box: [
          Math.round(w * 0.08),
          safeZone.top,
          Math.round(w * 0.84),
          Math.round(assets.headlineFontSize * 2),
        ],
        description: `Ukuran judul (${assets.headlineFontSize}px) berpotensi meluap ke area status bar / tombol navigasi Instagram Reels di bagian atas.`,
        current_value: `${assets.headlineFontSize}px`,
        recommended_value: '38px',
        auto_fix: {
          property: 'headlineFontSize',
          value: 38,
          description: `Rampingkan ukuran judul menjadi 38px untuk layout vertikal 9:16.`,
        },
      });
    }
  } else {
    // Poster checks
    if (assets.footerHeightPercent > 18) {
      issues.push({
        issue_id: 'ERR_SPATIAL_FOOTER_LARGE',
        category: 'spatial_balance',
        severity: 'medium',
        target_layer: 'footer',
        bounding_box: [
          0,
          Math.round(h * (1 - assets.footerHeightPercent / 100)),
          w,
          Math.round(h * (assets.footerHeightPercent / 100)),
        ],
        description: `Tinggi banner bawah (${assets.footerHeightPercent}%) mendominasi kanvas secara berlebihan dan mengurangi ruang nafas (*white space*).`,
        current_value: `${assets.footerHeightPercent}%`,
        recommended_value: '12%',
        auto_fix: {
          property: 'footerHeightPercent',
          value: 12,
          description: `Sesuaikan tinggi footer ke 12% untuk mengembalikan proporsi ruang kosong.`,
        },
      });
    }
  }

  // 4. KERAPATAN VISUAL (Visual Density: 30% - 70%)
  // Approximate filled surface area
  const headlineArea = (w * 0.75 * ((assets.headlineFontSize || 36) * 2)) / (w * h);
  const mediaArea = assets.mainMediaUrl ? 0.35 : 0.05;
  const footerArea = (assets.footerHeightPercent || 12) / 100;
  const graphicsArea = ((assets.supportingGraphics || []).length * 0.03);
  const estimatedFilledRatio = Number(
    Math.min(0.95, headlineArea + mediaArea + footerArea + graphicsArea).toFixed(2)
  );

  if (estimatedFilledRatio > 0.75) {
    issues.push({
      issue_id: 'ERR_DENSITY_CLUTTERED',
      category: 'visual_density',
      severity: 'medium',
      target_layer: 'supportingGraphics',
      bounding_box: [Math.round(w * 0.05), Math.round(h * 0.05), Math.round(w * 0.9), Math.round(h * 0.9)],
      description: `Kerapatan kanvas terlalu padat (${Math.round(
        estimatedFilledRatio * 100
      )}% terisi). Komposisi membutuhkan lebih banyak ruang negatif (*white space*) agar pesan utama menonjol.`,
      current_value: `${Math.round(estimatedFilledRatio * 100)}%`,
      recommended_value: '52%',
      auto_fix: {
        property: 'footerHeightPercent',
        value: Math.max(10, assets.footerHeightPercent - 4),
        description: `Kurangi kepadatan elemen bawah dan rapikan spasi untuk ruang nafas visual.`,
      },
    });
  } else if (estimatedFilledRatio < 0.28) {
    issues.push({
      issue_id: 'ERR_DENSITY_EMPTY',
      category: 'visual_density',
      severity: 'low',
      target_layer: 'supportingGraphics',
      bounding_box: [Math.round(w * 0.1), Math.round(h * 0.1), Math.round(w * 0.8), Math.round(h * 0.8)],
      description: `Kanvas tampak terlalu kosong (${Math.round(
        estimatedFilledRatio * 100
      )}% terisi). Elemen visual pendukung atau subjek utama dapat diperbesar untuk memperkuat daya tarik visual.`,
      current_value: `${Math.round(estimatedFilledRatio * 100)}%`,
      recommended_value: '45%',
      auto_fix: {
        property: 'headlineFontSize',
        value: Math.round(assets.headlineFontSize * 1.2),
        description: `Perbesar ukuran teks headline dan perkuat subjek utama.`,
      },
    });
  }

  // Calculate scores
  let contrastScore = 100;
  let hierarchyScore = 100;
  let spatialScore = 100;
  let densityScore = 100;

  issues.forEach((iss) => {
    const penalty = iss.severity === 'high' ? 22 : iss.severity === 'medium' ? 14 : 7;
    if (iss.category === 'color_contrast') contrastScore = Math.max(20, contrastScore - penalty);
    if (iss.category === 'hierarchy') hierarchyScore = Math.max(25, hierarchyScore - penalty);
    if (iss.category === 'safe_zone_violation' || iss.category === 'spatial_balance')
      spatialScore = Math.max(25, spatialScore - penalty);
    if (iss.category === 'visual_density') densityScore = Math.max(30, densityScore - penalty);
  });

  const overall = Math.round(
    contrastScore * 0.35 +
      hierarchyScore * 0.25 +
      spatialScore * 0.25 +
      densityScore * 0.15
  );

  const endTime = performance.now();

  return {
    overall_score: Math.min(100, Math.max(0, overall)),
    category_scores: {
      contrast: contrastScore,
      hierarchy: hierarchyScore,
      spatial_balance: spatialScore,
      visual_density: densityScore,
    },
    issues,
    mode: 'deterministic_fallback',
    engine_latency_ms: Math.round(endTime - startTime),
    contrast_metrics: {
      headlineRatio,
      subtitleRatio,
      dateRatio,
      standardWcagAA: minRequiredRatio,
    },
    typography_metrics: {
      headlineToSubRatio: Number(headlineToSubRatio.toFixed(2)),
      idealRatio: 2.2,
    },
    density_metrics: {
      filledPercent: Math.round(estimatedFilledRatio * 100),
      optimalRange: [30, 70],
    },
  };
}
