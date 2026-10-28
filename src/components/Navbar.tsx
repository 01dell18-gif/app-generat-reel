'use client';

import React from 'react';
import { OutputFormat, PresetTemplate } from '@/types/design';
import {
  Sparkles,
  Layout,
  Smartphone,
  Square,
  Wand2,
  Download,
  Eye,
} from 'lucide-react';

interface NavbarProps {
  currentFormat: OutputFormat;
  onFormatChange: (format: OutputFormat) => void;
  showSocialOverlay: boolean;
  onToggleSocialOverlay: () => void;
  overallScore: number;
  issueCount: number;
  onAutoFixAll: () => void;
  onExport: () => void;
  presets: PresetTemplate[];
  activePresetId: string;
  onSelectPreset: (presetId: string) => void;
  isCriticOpen: boolean;
  onToggleCritic: () => void;
  onOpenGeminiAI: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentFormat,
  onFormatChange,
  showSocialOverlay,
  onToggleSocialOverlay,
  overallScore,
  issueCount,
  onAutoFixAll,
  onExport,
  presets,
  activePresetId,
  onSelectPreset,
  isCriticOpen,
  onToggleCritic,
  onOpenGeminiAI,
}) => {
  const getScoreColor = (score: number) => {
    if (score >= 90) return '#10B981';
    if (score >= 70) return '#F59E0B';
    return '#F43F5E';
  };

  return (
    <header
      style={{
        height: '58px',
        backgroundColor: 'rgba(7, 11, 20, 0.94)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        whiteSpace: 'nowrap',
        overflowX: 'auto',
      }}
    >
      {/* Left: Brand Identity & Preset Template Selector */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexShrink: 0 }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #06B6D4 0%, #8B5CF6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 12px rgba(6, 182, 212, 0.35)',
              flexShrink: 0,
            }}
          >
            <Sparkles size={17} color="#FFFFFF" />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '14px', letterSpacing: '-0.3px', color: '#F8FAFC', lineHeight: '1.2' }}>
              VIBEGENESIS
            </div>
            <div style={{ fontSize: '10px', color: '#64748B', fontWeight: 600 }}>
              Reel & Poster Studio
            </div>
          </div>
        </div>

        {/* Subtle Divider */}
        <div style={{ height: '22px', width: '1px', background: 'rgba(255, 255, 255, 0.12)' }} />

        {/* Preset Selector Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>Template:</span>
          <select
            value={activePresetId}
            onChange={(e) => onSelectPreset(e.target.value)}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: '#F8FAFC',
              borderRadius: '8px',
              padding: '5px 10px',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              outline: 'none',
              maxWidth: '220px',
            }}
          >
            {presets.map((p) => (
              <option key={p.id} value={p.id} style={{ background: '#0F172A', color: '#F8FAFC' }}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Center: Segmented Format Switcher */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          background: 'rgba(0, 0, 0, 0.45)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '10px',
          padding: '3px',
          gap: '3px',
        }}
      >
        <button
          onClick={() => onFormatChange('poster_1_1')}
          className="btn"
          style={{
            padding: '5px 12px',
            fontSize: '11.5px',
            fontWeight: 600,
            borderRadius: '7px',
            background: currentFormat === 'poster_1_1' ? 'rgba(56, 189, 248, 0.18)' : 'transparent',
            color: currentFormat === 'poster_1_1' ? '#38BDF8' : '#94A3B8',
            border: currentFormat === 'poster_1_1' ? '1px solid rgba(56, 189, 248, 0.35)' : '1px solid transparent',
          }}
        >
          <Square size={13} />
          <span>1:1 Square</span>
        </button>

        <button
          onClick={() => onFormatChange('poster_4_5')}
          className="btn"
          style={{
            padding: '5px 12px',
            fontSize: '11.5px',
            fontWeight: 600,
            borderRadius: '7px',
            background: currentFormat === 'poster_4_5' ? 'rgba(139, 92, 246, 0.18)' : 'transparent',
            color: currentFormat === 'poster_4_5' ? '#C084FC' : '#94A3B8',
            border: currentFormat === 'poster_4_5' ? '1px solid rgba(139, 92, 246, 0.35)' : '1px solid transparent',
          }}
        >
          <Layout size={13} />
          <span>4:5 Feed</span>
        </button>

        <button
          onClick={() => onFormatChange('reels_9_16')}
          className="btn"
          style={{
            padding: '5px 12px',
            fontSize: '11.5px',
            fontWeight: 600,
            borderRadius: '7px',
            background: currentFormat === 'reels_9_16' ? 'rgba(236, 72, 153, 0.18)' : 'transparent',
            color: currentFormat === 'reels_9_16' ? '#F472B6' : '#94A3B8',
            border: currentFormat === 'reels_9_16' ? '1px solid rgba(236, 72, 153, 0.35)' : '1px solid transparent',
          }}
        >
          <Smartphone size={13} />
          <span>9:16 Reels</span>
        </button>
      </div>

      {/* Right: Tools & Export Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {/* Gemini AI Assistant Modal Button */}
        <button
          onClick={onOpenGeminiAI}
          className="btn"
          style={{
            padding: '6px 11px',
            fontSize: '11.5px',
            background: 'rgba(56, 189, 248, 0.1)',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            color: '#38BDF8',
            fontWeight: 600,
            borderRadius: '8px',
          }}
          title="Buka Google Gemini AI Studio"
        >
          <Sparkles size={13} color="#38BDF8" />
          <span>Gemini AI</span>
        </button>

        {/* Toggle Social Safe Zone Overlay */}
        <button
          onClick={onToggleSocialOverlay}
          className="btn btn-secondary"
          style={{
            padding: '6px 10px',
            fontSize: '11.5px',
            background: showSocialOverlay ? 'rgba(6, 182, 212, 0.15)' : 'rgba(255, 255, 255, 0.04)',
            borderColor: showSocialOverlay ? '#38BDF8' : 'rgba(255, 255, 255, 0.1)',
            color: showSocialOverlay ? '#38BDF8' : '#94A3B8',
            borderRadius: '8px',
          }}
          title="Simulasi Tampilan Overlay Instagram Safe-Zone"
        >
          <Eye size={13} />
          <span>Overlay</span>
        </button>

        {/* Auto Fix All (Visible if issues exist) */}
        {issueCount > 0 && (
          <button
            onClick={onAutoFixAll}
            className="btn btn-autofix"
            style={{ padding: '6px 11px', fontSize: '11.5px', borderRadius: '8px' }}
            title="Terapkan perbaikan otomatis untuk seluruh isu desain"
          >
            <Wand2 size={13} />
            <span>Auto-Fix ({issueCount})</span>
          </button>
        )}

        {/* AI Critic Score Toggle Button */}
        <button
          onClick={onToggleCritic}
          className="btn"
          style={{
            padding: '4px 8px',
            background: 'rgba(255, 255, 255, 0.04)',
            border: `1px solid ${getScoreColor(overallScore)}40`,
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
          title="Buka Panel Evaluasi ACGT Visual Critic"
        >
          <div
            style={{
              width: '22px',
              height: '22px',
              borderRadius: '50%',
              backgroundColor: `${getScoreColor(overallScore)}22`,
              border: `1.5px solid ${getScoreColor(overallScore)}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '10px',
              color: getScoreColor(overallScore),
            }}
          >
            {overallScore}
          </div>
          <span style={{ fontSize: '11px', fontWeight: 600, color: '#F8FAFC' }}>
            Critic
          </span>
        </button>

        {/* Primary Export Action */}
        <button
          onClick={onExport}
          className="btn btn-primary"
          style={{
            padding: '6px 14px',
            fontSize: '11.5px',
            fontWeight: 700,
            borderRadius: '8px',
            boxShadow: '0 0 14px rgba(56, 189, 248, 0.3)',
          }}
        >
          <Download size={13} />
          <span>{currentFormat === 'reels_9_16' ? 'Ekspor Video' : 'Ekspor Desain'}</span>
        </button>
      </div>
    </header>
  );
};
