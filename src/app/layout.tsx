import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'VibeGenesis - Platform Generasi Desain Otomatis & AI Visual Critique',
  description:
    'Platform generasi desain otomatis multi-format (Instagram Poster 1:1 & 4:5, Instagram Reels 9:16) terprogram dengan asisten evaluasi visual ACGT AI Critic dan fitur Auto-Fix instan.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>{children}</body>
    </html>
  );
}
