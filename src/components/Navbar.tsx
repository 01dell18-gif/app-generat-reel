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
  Settings,
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
        height: '64px',
        backgroundColor: 'rgba(7, 11, 20, 0.90)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
    >
      {/* Brand & Preset Selector */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #06B6D4 0%, #8B5CF6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 16px rgba(139, 92, 246, 0.5)',
            }}
          >
            <Sparkles size={20} color="#FFFFFF" />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '15px', letterSpacing: '-0.3px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>VIBEGENESIS</span>
              <span
                style={{
                  fontSize: '10px',
                  background: 'rgba(6, 182, 212, 0.2)',
                  color: '#38BDF8',
                  padding: '1px 6px',
                  borderRadius: '6px',
                  fontWeight: 700,
                  border: '1px solid rgba(6, 182, 212, 0.4)',
                }}
              >
                GEMINI AI CRITIC
              </span>
            </div>
            <div style={{ fontSize: '11px', color: '#94A3B8' }}>
              Programmatic Spatial Design & Multi-Format Engine
            </div>
          </div>
        </div>

        {/* Preset Selector Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '12px' }}>
          <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 600 }}>Preset:</span>
          <select
            value={activePresetId}
            onChange={(e) => onSelectPreset(e.target.value)}
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: '#F8FAFC',
              borderRadius: '8px',
              padding: '6px 12px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              outline: 'none',
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

      {/* Format Selector Pills */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          background: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '12px',
          padding: '4px',
          gap: '4px',
        }}
      >
        <button
          onClick={() => onFormatChange('poster_1_1')}
          className="btn"
          style={{
            padding: '6px 14px',
            fontSize: '12px',
            borderRadius: '8px',
            background: currentFormat === 'poster_1_1' ? 'rgba(56, 189, 248, 0.18)' : 'transparent',
            color: currentFormat === 'poster_1_1' ? '#38BDF8' : '#94A3B8',
            border: currentFormat === 'poster_1_1' ? '1px solid rgba(56, 189, 248, 0.4)' : '1px solid transparent',
          }}
        >
          <Square size={14} />
          <span>Poster 1:1</span>
        </button>

        <button
          onClick={() => onFormatChange('poster_4_5')}
          className="btn"
          style={{
            padding: '6px 14px',
            fontSize: '12px',
            borderRadius: '8px',
            background: currentFormat === 'poster_4_5' ? 'rgba(139, 92, 246, 0.18)' : 'transparent',
            color: currentFormat === 'poster_4_5' ? '#C084FC' : '#94A3B8',
            border: currentFormat === 'poster_4_5' ? '1px solid rgba(139, 92, 246, 0.4)' : '1px solid transparent',
          }}
        >
          <Layout size={14} />
          <span>Portrait 4:5</span>
        </button>

        <button
          onClick={() => onFormatChange('reels_9_16')}
          className="btn"
          style={{
            padding: '6px 14px',
            fontSize: '12px',
            borderRadius: '8px',
            background: currentFormat === 'reels_9_16' ? 'rgba(236, 72, 153, 0.18)' : 'transparent',
            color: currentFormat === 'reels_9_16' ? '#F472B6' : '#94A3B8',
            border: currentFormat === 'reels_9_16' ? '1px solid rgba(236, 72, 153, 0.4)' : '1px solid transparent',
          }}
        >
          <Smartphone size={14} />
          <span>Reels 9:16 (Motion)</span>
        </button>
      </div>

      {/* Right Tools: Gemini AI, Social Overlay, Auto-Fix, Score, Export */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {/* Google Gemini AI Button */}
        <button
          onClick={onOpenGeminiAI}
          className="btn"
          style={{
            padding: '7px 13px',
            fontSize: '12px',
            background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.22) 0%, rgba(139, 92, 246, 0.22) 100%)',
            border: '1px solid rgba(56, 189, 248, 0.5)',
            color: '#38BDF8',
            fontWeight: 700,
            boxShadow: '0 0 16px rgba(6, 182, 212, 0.25)',
          }}
          title="Buka Pengaturan Google Gemini AI & Generator"
        >
          <Sparkles size={15} color="#38BDF8" />
          <span>Gemini AI Studio</span>
        </button>

        {/* Toggle Social Safe Zone Overlay */}
        <button
          onClick={onToggleSocialOverlay}
          className="btn btn-secondary"
          style={{
            padding: '7px 11px',
            fontSize: '12px',
            background: showSocialOverlay ? 'rgba(6, 182, 212, 0.16)' : 'rgba(255, 255, 255, 0.05)',
            borderColor: showSocialOverlay ? 'rgba(6, 182, 212, 0.5)' : 'rgba(255, 255, 255, 0.1)',
            color: showSocialOverlay ? '#38BDF8' : '#94A3B8',
          }}
          title="Toggle Social UI Safe-Zone Overlay"
        >
          <Eye size={15} />
          <span>Instagram Overlay</span>
        </button>

        {/* Auto Fix All Button */}
        {issueCount > 0 && (
          <button
            onClick={onAutoFixAll}
            className="btn btn-autofix"
            style={{ padding: '7px 13px', fontSize: '12px' }}
          >
            <Wand2 size={14} />
            <span>Auto-Fix ({issueCount})</span>
          </button>
        )}

        {/* AI Critic Score Toggle Button */}
        <button
          onClick={onToggleCritic}
          className="btn"
          style={{
            padding: '5px 10px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: `1px solid ${getScoreColor(overallScore)}55`,
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <div
            style={{
              width: '26px',
              height: '26px',
              borderRadius: '50%',
              backgroundColor: `${getScoreColor(overallScore)}22`,
              border: `2px solid ${getScoreColor(overallScore)}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '11px',
              color: getScoreColor(overallScore),
            }}
          >
            {overallScore}
          </div>
          <span style={{ fontSize: '11px', fontWeight: 600, color: '#F8FAFC' }}>
            ACGT Critic
          </span>
        </button>

        {/* Export Button */}
        <button onClick={onExport} className="btn btn-primary" style={{ padding: '7px 15px', fontSize: '12px' }}>
          <Download size={14} />
          <span>Export {currentFormat === 'reels_9_16' ? 'Video' : 'High-Res'}</span>
        </button>
      </div>
    </header>
  );
};
