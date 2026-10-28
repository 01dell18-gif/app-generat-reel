export type OutputFormat = 'poster_1_1' | 'poster_4_5' | 'reels_9_16';

export interface SupportingGraphic {
  id: string;
  type: 'sparkle' | 'ring' | 'dots' | 'badge' | 'blur_orb';
  x: number;
  y: number;
  size: number;
  color: string;
  rotation?: number;
}

export interface SocialHandles {
  instagram: string;
  website: string;
  facebook: string;
  tiktok: string;
}

export interface BackgroundLayer {
  id: string;
  name?: string;
  url: string;
  opacity: number; // 0.0 - 1.0
  blendMode?: 'normal' | 'multiply' | 'screen' | 'overlay' | 'lighten';
  visible: boolean;
}

export interface AssetInputs {
  // Brand & Logo
  logoUrl: string;
  logoLocked: boolean;
  institutionName?: string;

  // Background / Template Frame
  customBgImageUrl: string; // User uploaded template background
  useCustomBgImage: boolean;
  backgroundLayers?: BackgroundLayer[]; // Up to 4 layered backgrounds
  watermarkUrl: string; // Center Garuda / Cultural watermark
  showWatermark: boolean;

  // Top Banner / Pill
  topPillText: string;
  topPillBgColor: string;
  topPillTextColor: string;
  showTopPill: boolean;

  // Event Card / Sub-Information (Middle-Bottom)
  eventCardTitle: string; // e.g. "Sistem Penjaminan Mutu Internal"
  eventCardSubtitle: string; // e.g. "SPMI"
  eventCardBorderColor: string; // e.g. "#F59E0B"
  showEventCard: boolean;

  // Informational Text (Headline & Subtitle)
  headlineText: string;
  headlineColor: string;
  headlineFontSize: number;
  headlineFontFamily: string;
  subtitleText: string;
  subtitleColor: string;
  subtitleFontSize: number;

  // Date Badge
  dateText: string;
  dateColor: string;
  dateBgColor: string;
  dateBadgeStyle: 'pill' | 'rect' | 'glass';

  // Main Media (Uploaded Photo / Subject)
  mainMediaUrl: string;
  isolateSubject: boolean;
  smartCropFocal: 'center' | 'top' | 'subject';
  mainMediaScale?: number;
  mainMediaX?: number;
  mainMediaY?: number;

  // Footer Social Media Bar
  footerImageUrl: string;
  footerLocked: boolean;
  footerHeightPercent: number;
  socialHandles: SocialHandles;
  useDefaultSocialFooter: boolean;

  // Colors & Accents
  accentColor: string;
  bgColor: string;
  secondaryBgColor: string;
  supportingGraphics: SupportingGraphic[];
}

export type CriticCategory =
  | 'color_contrast'
  | 'safe_zone_violation'
  | 'hierarchy'
  | 'visual_density'
  | 'spatial_balance';

export type CriticSeverity = 'high' | 'medium' | 'low';

export interface AutoFixAction {
  property: string;
  value: any;
  description?: string;
  layerId: string;
}

export interface CriticIssue {
  issue_id: string;
  category: CriticCategory;
  severity: CriticSeverity;
  target_layer: string;
  bounding_box: [number, number, number, number]; // [x, y, width, height]
  description: string;
  current_value?: any;
  recommended_value?: any;
  auto_fix: {
    property: string;
    value: any;
    description?: string;
  };
}

export interface ACGTReport {
  overall_score: number;
  category_scores: {
    contrast: number;
    hierarchy: number;
    spatial_balance: number;
    visual_density: number;
  };
  issues: CriticIssue[];
  mode: 'mllm' | 'deterministic_fallback';
  engine_latency_ms: number;
  contrast_metrics?: {
    headlineRatio: number;
    subtitleRatio: number;
    dateRatio: number;
    standardWcagAA: number;
  };
  typography_metrics?: {
    headlineToSubRatio: number;
    idealRatio: number;
  };
  density_metrics?: {
    filledPercent: number;
    optimalRange: [number, number];
  };
}

export interface IterationLog {
  id: string;
  timestamp: string;
  actionTaken: string;
  scoreBefore: number;
  scoreAfter: number;
  issuesResolvedCount: number;
}

export interface PresetTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  previewGradient: string;
  data: AssetInputs;
}
