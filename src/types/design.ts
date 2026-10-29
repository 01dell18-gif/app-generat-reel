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
  rotation?: number; // Rotation in degrees (0, 90, 180, 270)
  flipH?: boolean; // Flip horizontal (mirror)
  flipV?: boolean; // Flip vertical
  scale?: number; // Zoom/scale factor (0.5 - 3.0)
  x?: number; // X position offset in pixels (-400 to 400)
  y?: number; // Y position offset in pixels (-400 to 400)
}

export interface AssetInputs {
  // Brand & Logo
  logoUrl: string;
  logoLocked: boolean;
  institutionName?: string;
  logoFrameShape?: 'capsule' | 'rounded' | 'none'; // Frame lengkung logo: kapsul, rounded card, atau none
  logoX?: number; // Custom X position on canvas
  logoY?: number; // Custom Y position on canvas
  logoScale?: number; // Custom scale factor for logo
  logoRotation?: number; // Custom rotation in degrees

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
  topPillX?: number; // Custom X position
  topPillY?: number; // Custom Y position
  topPillScale?: number; // Custom scale factor (0.4 - 2.5)
  topPillRotation?: number; // Custom rotation (-180 to 180)
  topPillFontSize?: number; // Custom font size (default 13)

  // Event Card / Sub-Information (Middle-Bottom)
  eventCardTitle: string; // e.g. "Sistem Penjaminan Mutu Internal"
  eventCardTitleFontSize?: number; // Custom font size for event card title
  eventCardSubtitle: string; // e.g. "SPMI"
  eventCardSubtitleFontSize?: number; // Custom font size for event card subtitle/code
  eventCardBorderColor: string; // e.g. "#F59E0B"
  showEventCard: boolean;
  eventCardX?: number; // Custom X position
  eventCardY?: number; // Custom Y position
  eventCardScale?: number; // Custom scale factor (0.4 - 2.5)
  eventCardRotation?: number; // Custom rotation (-180 to 180)

  // Informational Text (Headline & Subtitle)
  headlineText: string;
  headlineColor: string;
  headlineFontSize: number;
  headlineFontFamily: string;
  headlineX?: number;
  headlineY?: number;
  headlineScale?: number;
  headlineRotation?: number;
  subtitleText: string;
  subtitleColor: string;
  subtitleFontSize: number;
  subtitleX?: number;
  subtitleY?: number;

  // Date Badge
  dateText: string;
  dateFontSize?: number; // Custom font size for date badge
  dateColor: string;
  dateBgColor: string;
  dateBadgeStyle: 'pill' | 'rect' | 'glass';
  dateBadgeX?: number; // Custom X position
  dateBadgeY?: number; // Custom Y position
  dateBadgeScale?: number; // Custom scale factor (0.4 - 2.5)
  dateBadgeRotation?: number; // Custom rotation (-180 to 180)

  // Main Media (Uploaded Photo / Subject)
  mainMediaUrl: string;
  isolateSubject: boolean;
  smartCropFocal: 'center' | 'top' | 'subject';
  mainMediaScale?: number;
  mainMediaX?: number;
  mainMediaY?: number;
  mainMediaRotation?: number; // Rotation in degrees (0 - 360 or -180 to 180)
  mainMediaFlipH?: boolean; // Mirror / Flip Horizontal
  mainMediaFlipV?: boolean; // Mirror / Flip Vertical

  // Footer Social Media Bar
  footerImageUrl: string;
  footerLocked: boolean;
  footerHeightPercent: number;
  socialHandles: SocialHandles;
  useDefaultSocialFooter: boolean;
  socialFooterBgColor?: string; // Background color of footer pill
  socialFooterTextColor?: string; // Text & Icon color of footer pill
  socialFooterBorderColor?: string; // Border color of footer pill
  socialFooterFontSize?: number; // Custom font size for social handles text (default ~13)

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
