'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { OutputFormat, PresetTemplate } from '@/types/design';
import {
  Sparkles,
  Layout,
  Smartphone,
  Square,
  Wand2,
  Download,
  Eye,
  Wifi,
  Copy,
  Check,
  X,
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
  isMobile?: boolean;
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
  isMobile = false,
}) => {
  const [showDeviceModal, setShowDeviceModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const lanUrl = 'http://10.10.10.159:3030';

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleCopyUrl = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(lanUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

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
            <div style={{ fontWeight: 800, fontSize: isMobile ? '13px' : '14px', letterSpacing: '-0.3px', color: '#F8FAFC', lineHeight: '1.2' }}>
              VIBEGENESIS
            </div>
            {!isMobile && (
              <div style={{ fontSize: '10px', color: '#38BDF8', fontWeight: 700 }}>
                Sosmed Reels & Poster Editor
              </div>
            )}
          </div>
        </div>

        {/* Subtle Divider */}
        <div style={{ height: '22px', width: '1px', background: 'rgba(255, 255, 255, 0.12)' }} />

        {/* Preset Selector Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {!isMobile && <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>Template:</span>}
          <select
            value={activePresetId}
            onChange={(e) => onSelectPreset(e.target.value)}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: '#F8FAFC',
              borderRadius: '8px',
              padding: '5px 8px',
              fontSize: '11.5px',
              fontWeight: 600,
              cursor: 'pointer',
              outline: 'none',
              maxWidth: isMobile ? '120px' : '240px',
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
            padding: isMobile ? '5px 8px' : '5px 12px',
            fontSize: '11.5px',
            fontWeight: 600,
            borderRadius: '7px',
            background: currentFormat === 'poster_1_1' ? 'rgba(56, 189, 248, 0.18)' : 'transparent',
            color: currentFormat === 'poster_1_1' ? '#38BDF8' : '#94A3B8',
            border: currentFormat === 'poster_1_1' ? '1px solid rgba(56, 189, 248, 0.35)' : '1px solid transparent',
          }}
          title="Format Poster Persegi 1:1 untuk Post Feed Instagram & Facebook"
        >
          <Square size={13} />
          <span>{isMobile ? '1:1' : 'Poster 1:1'}</span>
        </button>

        <button
          onClick={() => onFormatChange('poster_4_5')}
          className="btn"
          style={{
            padding: isMobile ? '5px 8px' : '5px 12px',
            fontSize: '11.5px',
            fontWeight: 600,
            borderRadius: '7px',
            background: currentFormat === 'poster_4_5' ? 'rgba(139, 92, 246, 0.18)' : 'transparent',
            color: currentFormat === 'poster_4_5' ? '#C084FC' : '#94A3B8',
            border: currentFormat === 'poster_4_5' ? '1px solid rgba(139, 92, 246, 0.35)' : '1px solid transparent',
          }}
          title="Format Feed Portrait 4:5 Optimal Layar Handphone"
        >
          <Layout size={13} />
          <span>{isMobile ? '4:5' : 'Feed 4:5'}</span>
        </button>

        <button
          onClick={() => onFormatChange('reels_9_16')}
          className="btn"
          style={{
            padding: isMobile ? '5px 8px' : '5px 12px',
            fontSize: '11.5px',
            fontWeight: 600,
            borderRadius: '7px',
            background: currentFormat === 'reels_9_16' ? 'rgba(236, 72, 153, 0.18)' : 'transparent',
            color: currentFormat === 'reels_9_16' ? '#F472B6' : '#94A3B8',
            border: currentFormat === 'reels_9_16' ? '1px solid rgba(236, 72, 153, 0.35)' : '1px solid transparent',
          }}
          title="Format Video Gerak 9:16 untuk Reels Instagram, TikTok & YouTube Shorts"
        >
          <Smartphone size={13} />
          <span>{isMobile ? 'Reels' : 'Reels 9:16 (Motion)'}</span>
        </button>
      </div>

      {/* Right: Tools & Export Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {/* Buka di HP / Perangkat Lain Button (Only on desktop) */}
        {!isMobile && (
          <button
            onClick={() => setShowDeviceModal(true)}
            className="btn"
            style={{
              padding: '6px 11px',
              fontSize: '11.5px',
              background: 'rgba(16, 185, 129, 0.12)',
              border: '1px solid rgba(16, 185, 129, 0.35)',
              color: '#34D399',
              fontWeight: 600,
              borderRadius: '8px',
            }}
            title="Buka di HP / Tablet / Perangkat Lain (Wi-Fi LAN)"
          >
            <Smartphone size={13} color="#34D399" />
            <span>Buka di HP</span>
          </button>
        )}

        {/* Gemini AI Assistant Modal Button (Desktop only, mobile has bottom bar) */}
        {!isMobile && (
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
        )}

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

        {/* AI Critic Score Toggle Button (Desktop only) */}
        {!isMobile && (
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
        )}

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

      {/* Modal Dialog: Akses di Perangkat Lain (HP, Tablet, Laptop) via Portal langsung ke document.body */}
      {showDeviceModal && isMounted && createPortal(
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(10px)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
          onClick={() => setShowDeviceModal(false)}
        >
          <div
            className="glass-panel"
            style={{
              width: '100%',
              maxWidth: '460px',
              padding: '24px',
              borderRadius: '20px',
              border: '1px solid rgba(56, 189, 248, 0.35)',
              backgroundColor: '#0F172A',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.85), 0 0 35px rgba(56, 189, 248, 0.2)',
              maxHeight: '92vh',
              overflowY: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(16, 185, 129, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                  }}
                >
                  <Wifi size={17} color="#34D399" />
                </div>
                <div>
                  <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#F8FAFC' }}>
                    Buka di HP / Perangkat Lain
                  </h3>
                  <p style={{ fontSize: '11px', color: '#94A3B8' }}>
                    Akses editor reel & poster langsung dari HP atau tablet
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowDeviceModal(false)}
                className="btn"
                style={{ padding: '6px', background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* QR Code Container */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                padding: '16px',
                borderRadius: '14px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                marginBottom: '16px',
              }}
            >
              <div
                style={{
                  padding: '10px',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '12px',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
                  marginBottom: '10px',
                }}
              >
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(lanUrl)}`}
                  alt="QR Code Akses HP"
                  style={{ width: '150px', height: '150px', display: 'block' }}
                />
              </div>
              <div style={{ fontSize: '11px', color: '#CBD5E1', fontWeight: 600 }}>
                Scan QR Code ini dengan Kamera HP Anda
              </div>
            </div>

            {/* Direct URL with Copy Button */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '11px', color: '#94A3B8', marginBottom: '6px' }}>
                Atau ketik alamat URL ini di browser HP:
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 12px',
                  backgroundColor: 'rgba(0, 0, 0, 0.4)',
                  borderRadius: '8px',
                  border: '1px solid rgba(56, 189, 248, 0.25)',
                }}
              >
                <span
                  style={{
                    fontFamily: 'monospace',
                    fontSize: '13px',
                    color: '#38BDF8',
                    fontWeight: 700,
                    flex: 1,
                  }}
                >
                  {lanUrl}
                </span>
                <button
                  type="button"
                  onClick={handleCopyUrl}
                  className="btn btn-secondary"
                  style={{
                    padding: '4px 10px',
                    fontSize: '11px',
                    color: copied ? '#34D399' : '#F8FAFC',
                    borderColor: copied ? '#34D399' : 'rgba(255, 255, 255, 0.2)',
                  }}
                >
                  {copied ? <Check size={12} /> : <Copy size={12} />}
                  <span>{copied ? 'Tersalin!' : 'Salin'}</span>
                </button>
              </div>
            </div>

            {/* Practical Guide */}
            <div
              style={{
                backgroundColor: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.2)',
                borderRadius: '10px',
                padding: '12px',
                fontSize: '11px',
                color: '#CBD5E1',
                lineHeight: '1.5',
              }}
            >
              <div style={{ fontWeight: 700, color: '#34D399', marginBottom: '4px' }}>
                Petunjuk Singkat:
              </div>
              <ol style={{ paddingLeft: '16px', margin: 0 }}>
                <li>Pastikan HP / Tablet Anda terhubung ke <b>jaringan Wi-Fi yang sama</b> dengan komputer ini.</li>
                <li>Buka browser (Google Chrome atau Safari) di HP, lalu buka URL di atas atau scan QR Code.</li>
                <li>Database project tersinkronisasi otomatis sehingga desain yang disimpan bisa langsung dibuka di HP!</li>
              </ol>
            </div>
          </div>
        </div>,
        document.body
      )}
    </header>
  );
};
