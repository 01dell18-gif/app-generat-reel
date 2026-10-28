import { SocialHandles } from '@/types/design';

/**
 * Generates an SVG Data URI for the social media footer bar
 * featuring official crisp vector icons for Instagram, Website, Facebook, and TikTok
 */
export function generateSocialFooterSvg(
  handles: SocialHandles,
  width: number = 1000,
  height: number = 56,
  bgColor: string = '#1D4ED8'
): string {
  const ig = handles.instagram || 'smkn1klk';
  const web = handles.website || 'smkn1klk.sch.id';
  const fb = handles.facebook || 'SMK Negeri 1 Klungkung';
  const tt = handles.tiktok || 'smkn1klungkung';

  // SVG Icons
  // Instagram Camera Icon
  const igIcon = `
    <g transform="translate(0, -11)">
      <rect x="0" y="0" width="22" height="22" rx="6" fill="white"/>
      <rect x="2" y="2" width="18" height="18" rx="5" fill="${bgColor}"/>
      <circle cx="11" cy="11" r="4.5" stroke="white" stroke-width="2" fill="none"/>
      <circle cx="15.5" cy="6.5" r="1.2" fill="white"/>
    </g>
  `;

  // Website / Globe Icon
  const webIcon = `
    <g transform="translate(0, -11)">
      <circle cx="11" cy="11" r="10" stroke="white" stroke-width="2" fill="none"/>
      <ellipse cx="11" cy="11" rx="4.5" ry="10" stroke="white" stroke-width="1.8" fill="none"/>
      <line x1="1" y1="11" x2="21" y2="11" stroke="white" stroke-width="1.8"/>
      <line x1="3" y1="6" x2="19" y2="6" stroke="white" stroke-width="1.5"/>
      <line x1="3" y1="16" x2="19" y2="16" stroke="white" stroke-width="1.5"/>
    </g>
  `;

  // Facebook Icon
  const fbIcon = `
    <g transform="translate(0, -11)">
      <circle cx="11" cy="11" r="10" fill="white"/>
      <path d="M12.5 7 H14.5 V4.5 C14.1 4.4 13.2 4.3 12 4.3 C9.6 4.3 8 5.8 8 8.6 V11 H5.5 V14 H8 V21 H11 V14 H13.5 L14 11 H11 V8.9 C11 8 11.3 7 12.5 7 Z" fill="${bgColor}"/>
    </g>
  `;

  // TikTok Icon
  const ttIcon = `
    <g transform="translate(0, -11)">
      <circle cx="11" cy="11" r="10" fill="white"/>
      <path d="M11 6 V13.5 C11 14.9 9.9 16 8.5 16 C7.1 16 6 14.9 6 13.5 C6 12.1 7.1 11 8.5 11 C8.8 11 9.1 11.1 9.3 11.2 V8.8 C9 8.7 8.8 8.7 8.5 8.7 C5.8 8.7 3.7 10.8 3.7 13.5 C3.7 16.2 5.8 18.3 8.5 18.3 C11.2 18.3 13.3 16.2 13.3 13.5 V9.4 C14.3 10.1 15.4 10.5 16.6 10.5 V8.2 C15.1 8.2 13.8 7.3 13.3 6 H11 Z" fill="${bgColor}"/>
    </g>
  `;

  const svgContent = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
      <defs>
        <filter id="footShadow" x="-5%" y="-10%" width="110%" height="130%">
          <feDropShadow dx="0" dy="3" stdDeviation="4" flood-color="#000000" flood-opacity="0.35"/>
        </filter>
      </defs>
      <!-- Pill Background -->
      <rect x="4" y="4" width="${width - 8}" height="${height - 8}" rx="${(height - 8) / 2}" fill="${bgColor}" filter="url(#footShadow)" stroke="rgba(255,255,255,0.2)" stroke-width="1.5"/>

      <!-- Group Content -->
      <g transform="translate(${width / 2}, ${height / 2})" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-weight="700" font-size="16" fill="white">
        <!-- 4 Items distributed evenly -->
        <!-- Item 1: IG -->
        <g transform="translate(${-width * 0.40}, 0)">
          ${igIcon}
          <text x="30" y="5" font-size="17" fill="white">${ig}</text>
        </g>

        <!-- Item 2: WEB -->
        <g transform="translate(${-width * 0.16}, 0)">
          ${webIcon}
          <text x="30" y="5" font-size="17" fill="white">${web}</text>
        </g>

        <!-- Item 3: FB -->
        <g transform="translate(${width * 0.10}, 0)">
          ${fbIcon}
          <text x="30" y="5" font-size="17" fill="white">${fb}</text>
        </g>

        <!-- Item 4: TT -->
        <g transform="translate(${width * 0.34}, 0)">
          ${ttIcon}
          <text x="30" y="5" font-size="17" fill="white">${tt}</text>
        </g>
      </g>
    </svg>
  `;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svgContent)}`;
}
