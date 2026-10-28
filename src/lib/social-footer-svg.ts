import { SocialHandles } from '@/types/design';

/**
 * Generates an SVG Data URI for the social media footer bar
 * featuring official crisp vector icons for Instagram, Website, Facebook, and TikTok.
 * 
 * Implements dynamic balanced spacing & boundary containment
 * so that handles NEVER overflow the pill boundary regardless of text length.
 */
export function generateSocialFooterSvg(
  handles: SocialHandles,
  width: number = 1000,
  height: number = 56,
  bgColor: string = '#1D4ED8',
  textColor: string = '#FFFFFF',
  borderColor: string = 'rgba(255, 255, 255, 0.22)',
  customFontSize?: number
): string {
  const ig = (handles?.instagram || 'smkn1klk').trim();
  const web = (handles?.website || 'smkn1klk.sch.id').trim();
  const fb = (handles?.facebook || 'SMK Negeri 1 Klungkung').trim();
  const tt = (handles?.tiktok || 'smkn1klungkung').trim();

  // SVG Icons with dynamic colors
  const igIcon = `
    <rect x="0" y="0" width="20" height="20" rx="5.5" fill="${textColor}"/>
    <rect x="2" y="2" width="16" height="16" rx="4.5" fill="${bgColor}"/>
    <circle cx="10" cy="10" r="4" stroke="${textColor}" stroke-width="1.8" fill="none"/>
    <circle cx="14" cy="6" r="1" fill="${textColor}"/>
  `;

  const webIcon = `
    <circle cx="10" cy="10" r="9" stroke="${textColor}" stroke-width="1.8" fill="none"/>
    <ellipse cx="10" cy="10" rx="4" ry="9" stroke="${textColor}" stroke-width="1.6" fill="none"/>
    <line x1="1" y1="10" x2="19" y2="10" stroke="${textColor}" stroke-width="1.6"/>
    <line x1="2.5" y1="5.5" x2="17.5" y2="5.5" stroke="${textColor}" stroke-width="1.3"/>
    <line x1="2.5" y1="14.5" x2="17.5" y2="14.5" stroke="${textColor}" stroke-width="1.3"/>
  `;

  const fbIcon = `
    <circle cx="10" cy="10" r="9" fill="${textColor}"/>
    <path d="M11.3 6.5 H13 V4.3 C12.7 4.2 11.9 4.1 10.8 4.1 C8.6 4.1 7.2 5.5 7.2 8.1 V10.2 H5 V12.9 H7.2 V19.2 H9.9 V12.9 H12.1 L12.5 10.2 H9.9 V8.3 C9.9 7.5 10.2 6.5 11.3 6.5 Z" fill="${bgColor}"/>
  `;

  const ttIcon = `
    <circle cx="10" cy="10" r="9" fill="${textColor}"/>
    <path d="M10 5.5 V12.2 C10 13.5 9 14.5 7.7 14.5 C6.4 14.5 5.4 13.5 5.4 12.2 C5.4 10.9 6.4 9.9 7.7 9.9 C8 9.9 8.2 10 8.4 10.1 V7.9 C8.2 7.8 7.9 7.8 7.7 7.8 C5.2 7.8 3.3 9.7 3.3 12.2 C3.3 14.6 5.2 16.5 7.7 16.5 C10.1 16.5 12 14.6 12 12.2 V8.5 C12.9 9.1 13.9 9.5 15 9.5 V7.4 C13.6 7.4 12.5 6.6 12 5.5 H10 Z" fill="${bgColor}"/>
  `;

  const rawItems = [
    { icon: igIcon, text: ig },
    { icon: webIcon, text: web },
    { icon: fbIcon, text: fb },
    { icon: ttIcon, text: tt },
  ].filter((it) => it.text.length > 0);

  const items = rawItems.length > 0 ? rawItems : [{ icon: igIcon, text: ig }];

  // Safe inner pill horizontal boundaries
  // Pill has corner radius ~24px, so margin >= 38px keeps everything strictly inside
  const pillRadius = (height - 8) / 2;
  const safeMargin = Math.max(38, pillRadius + 14);
  const usableWidth = width - safeMargin * 2;

  // Custom or Adaptive font sizing based on handle text lengths
  let fontSize = customFontSize && customFontSize > 6 ? customFontSize : 14;
  if (!customFontSize) {
    const totalChars = items.reduce((acc, it) => acc + it.text.length, 0);

    if (totalChars > 65) {
      fontSize = 11.5;
    } else if (totalChars > 50) {
      fontSize = 12.5;
    } else if (totalChars > 40) {
      fontSize = 13.5;
    }
  }

  const iconWidth = 20;
  const iconGap = 7;
  const charWidthFactor = fontSize * 0.58;

  // Measure each item width
  const itemMetrics = items.map((it) => {
    const textWidth = it.text.length * charWidthFactor;
    const totalItemWidth = iconWidth + iconGap + textWidth;
    return {
      ...it,
      textWidth,
      totalItemWidth,
    };
  });

  const sumItemsWidth = itemMetrics.reduce((acc, it) => acc + it.totalItemWidth, 0);
  const numItems = itemMetrics.length;

  // Calculate balanced uniform gap between items
  let uniformGap = 24;
  if (numItems > 1) {
    const remainingForGaps = usableWidth - sumItemsWidth;
    uniformGap = Math.max(12, Math.min(44, remainingForGaps / (numItems - 1)));
  }

  const totalBlockWidth = sumItemsWidth + (numItems - 1) * uniformGap;

  // Center the balanced group inside the SVG
  const startX = Math.max(safeMargin, (width - totalBlockWidth) / 2);

  // Build rendered items with exact balanced positions
  let currentX = startX;
  const renderedItems = itemMetrics.map((it) => {
    const itemX = currentX;
    currentX += it.totalItemWidth + uniformGap;

    return `
      <g transform="translate(${Math.round(itemX)}, ${Math.round(height / 2)})">
        <!-- Crisp Icon -->
        <g transform="translate(0, -10)">
          ${it.icon}
        </g>
        <!-- Balanced Text Label -->
        <text
          x="${iconWidth + iconGap}"
          y="1"
          dominant-baseline="central"
          font-family="'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          font-weight="700"
          font-size="${fontSize}"
          fill="${textColor}"
          letter-spacing="0.2px"
        >${it.text}</text>
      </g>
    `;
  }).join('\n');

  const svgContent = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
      <defs>
        <filter id="footShadow" x="-5%" y="-15%" width="110%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="3.5" flood-color="#000000" flood-opacity="0.35"/>
        </filter>
        <linearGradient id="pillGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="${bgColor}" />
          <stop offset="100%" stop-color="${bgColor}" />
        </linearGradient>
      </defs>

      <!-- Pill Background with Smooth Border & Shadow -->
      <rect
        x="4"
        y="4"
        width="${width - 8}"
        height="${height - 8}"
        rx="${pillRadius}"
        fill="url(#pillGrad)"
        filter="url(#footShadow)"
        stroke="${borderColor}"
        stroke-width="1.2"
      />

      <!-- Balanced & Confined Social Handles Group -->
      <g>
        ${renderedItems}
      </g>
    </svg>
  `.trim();

  return `data:image/svg+xml;utf8,${encodeURIComponent(svgContent)}`;
}
