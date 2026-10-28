'use client';

import React, { useState, useRef } from 'react';
import { AssetInputs } from '@/types/design';
import {
  Upload,
  Type,
  ImageIcon,
  Shield,
  Layers,
  Sparkles,
  Share2,
  Trash2,
  Lock,
  Unlock,
  Settings,
  Zap,
} from 'lucide-react';

interface AssetIngestionPanelProps {
  assets: AssetInputs;
  onUpdateProperty: (key: keyof AssetInputs, value: any) => void;
  onOpenGeminiAI: () => void;
}

export const AssetIngestionPanel: React.FC<AssetIngestionPanelProps> = ({
  assets,
  onUpdateProperty,
  onOpenGeminiAI,
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'gemini' | 'text' | 'badge' | 'social'>('upload');

  const photoInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const bgInputRef = useRef<HTMLInputElement>(null);

  // Helper to read uploaded files as Data URL
  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    propertyKey: keyof AssetInputs
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onUpdateProperty(propertyKey, event.target.result as string);
          if (propertyKey === 'customBgImageUrl') {
            onUpdateProperty('useCustomBgImage', true);
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <aside
      className="glass-panel"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        borderRadius: 0,
        borderTop: 'none',
        borderBottom: 'none',
        borderLeft: 'none',
        backgroundColor: 'rgba(10, 16, 31, 0.94)',
        overflow: 'hidden',
      }}
    >
      {/* Panel Header */}
      <div
        style={{
          padding: '16px 20px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          background: 'linear-gradient(180deg, rgba(56, 189, 248, 0.05) 0%, transparent 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <div style={{ fontSize: '15px', fontWeight: 800, letterSpacing: '-0.2px' }}>
            Asset & Media Ingestion
          </div>
          <div style={{ fontSize: '11px', color: '#94A3B8' }}>
            Upload Foto, Desain, & Gemini AI
          </div>
        </div>

        <button
          onClick={onOpenGeminiAI}
          className="btn"
          style={{
            padding: '5px 10px',
            fontSize: '11px',
            background: 'rgba(56, 189, 248, 0.15)',
            border: '1px solid rgba(56, 189, 248, 0.35)',
            color: '#38BDF8',
          }}
          title="Pengaturan Google Gemini AI"
        >
          <Sparkles size={13} />
          <span>Gemini AI</span>
        </button>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          backgroundColor: 'rgba(0, 0, 0, 0.25)',
        }}
      >
        <button
          onClick={() => setActiveTab('upload')}
          style={{
            padding: '10px 2px',
            fontSize: '10px',
            fontWeight: 700,
            background: 'none',
            border: 'none',
            color: activeTab === 'upload' ? '#38BDF8' : '#94A3B8',
            borderBottom: activeTab === 'upload' ? '2px solid #38BDF8' : '2px solid transparent',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <Upload size={14} />
          <span>Upload</span>
        </button>

        <button
          onClick={() => setActiveTab('gemini')}
          style={{
            padding: '10px 2px',
            fontSize: '10px',
            fontWeight: 700,
            background: 'none',
            border: 'none',
            color: activeTab === 'gemini' ? '#38BDF8' : '#94A3B8',
            borderBottom: activeTab === 'gemini' ? '2px solid #38BDF8' : '2px solid transparent',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <Sparkles size={14} />
          <span>AI Gemini</span>
        </button>

        <button
          onClick={() => setActiveTab('text')}
          style={{
            padding: '10px 2px',
            fontSize: '10px',
            fontWeight: 700,
            background: 'none',
            border: 'none',
            color: activeTab === 'text' ? '#38BDF8' : '#94A3B8',
            borderBottom: activeTab === 'text' ? '2px solid #38BDF8' : '2px solid transparent',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <Type size={14} />
          <span>Teks</span>
        </button>

        <button
          onClick={() => setActiveTab('badge')}
          style={{
            padding: '10px 2px',
            fontSize: '10px',
            fontWeight: 700,
            background: 'none',
            border: 'none',
            color: activeTab === 'badge' ? '#38BDF8' : '#94A3B8',
            borderBottom: activeTab === 'badge' ? '2px solid #38BDF8' : '2px solid transparent',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <Layers size={14} />
          <span>SPMI</span>
        </button>

        <button
          onClick={() => setActiveTab('social')}
          style={{
            padding: '10px 2px',
            fontSize: '10px',
            fontWeight: 700,
            background: 'none',
            border: 'none',
            color: activeTab === 'social' ? '#38BDF8' : '#94A3B8',
            borderBottom: activeTab === 'social' ? '2px solid #38BDF8' : '2px solid transparent',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <Share2 size={14} />
          <span>Sosmed</span>
        </button>
      </div>

      {/* Main Tab Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* TAB 1: UPLOAD MEDIA & ASSETS */}
        {activeTab === 'upload' && (
          <>
            {/* 1. UPLOAD FOTO SUBJEK UTAMA */}
            <div
              className="glass-panel"
              style={{
                padding: '14px',
                border: '1px solid rgba(56, 189, 248, 0.25)',
                background: 'rgba(56, 189, 248, 0.03)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#38BDF8', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ImageIcon size={15} />
                  <span>Foto Subjek Utama (Reels / Poster)</span>
                </span>
                {assets.mainMediaUrl && (
                  <button
                    onClick={() => onUpdateProperty('mainMediaUrl', '')}
                    style={{ background: 'none', border: 'none', color: '#F43F5E', cursor: 'pointer', padding: '2px' }}
                    title="Hapus foto"
                  >
                    <Trash2 size={13} />
                  </button>
                )}
              </div>

              <div style={{ fontSize: '10px', color: '#94A3B8', marginBottom: '8px' }}>
                *Foto otomatis berada di urutan layer belakang nomor 2 setelah background, sehingga banner & logo berada di atasnya dan tidak bentrok.
              </div>

              {/* Upload Drop Zone / Button */}
              <input
                ref={photoInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={(e) => handleFileUpload(e, 'mainMediaUrl')}
              />

              <div
                onClick={() => photoInputRef.current?.click()}
                style={{
                  border: '2px dashed rgba(56, 189, 248, 0.4)',
                  borderRadius: '10px',
                  padding: '16px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  backgroundColor: 'rgba(15, 23, 42, 0.5)',
                  transition: 'all 0.2s',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                {assets.mainMediaUrl ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%' }}>
                    <img
                      src={assets.mainMediaUrl}
                      alt="Uploaded preview"
                      style={{ width: '48px', height: '48px', objectFit: 'contain', borderRadius: '6px', background: '#0F172A' }}
                    />
                    <div style={{ textAlign: 'left', flex: 1, overflow: 'hidden' }}>
                      <div style={{ fontSize: '12px', fontWeight: 700, color: '#F8FAFC' }}>Foto Terpasang</div>
                      <div style={{ fontSize: '10px', color: '#94A3B8' }}>Klik untuk mengganti foto dari komputer</div>
                    </div>
                  </div>
                ) : (
                  <>
                    <Upload size={22} color="#38BDF8" />
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#F8FAFC' }}>
                      Pilih Foto dari Komputer
                    </div>
                    <div style={{ fontSize: '10px', color: '#94A3B8' }}>
                      Mendukung PNG transparan, JPEG, WebP
                    </div>
                  </>
                )}
              </div>

              {/* Controls for Photo Scale & Subject Isolation */}
              {assets.mainMediaUrl && (
                <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div>
                    <label className="label-title">
                      <span>Ukuran Foto ({assets.mainMediaScale || 1.0}x)</span>
                    </label>
                    <input
                      type="range"
                      min="0.5"
                      max="2.0"
                      step="0.05"
                      value={assets.mainMediaScale || 1.0}
                      onChange={(e) => onUpdateProperty('mainMediaScale', parseFloat(e.target.value))}
                    />
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '11px', color: '#CBD5E1' }}>Isolasi / Efek Aura Subjek</span>
                    <input
                      type="checkbox"
                      checked={assets.isolateSubject}
                      onChange={(e) => onUpdateProperty('isolateSubject', e.target.checked)}
                      style={{ cursor: 'pointer', width: '16px', height: '16px' }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* 2. UPLOAD LOGO INSTANSI */}
            <div className="glass-panel" style={{ padding: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#CBD5E1', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Shield size={14} />
                  <span>Logo Instansi / Sekolah</span>
                </span>
                <input
                  type="checkbox"
                  checked={assets.logoLocked}
                  onChange={(e) => onUpdateProperty('logoLocked', e.target.checked)}
                  title={assets.logoLocked ? 'Logo Terkunci' : 'Logo Bebas Digeser'}
                  style={{ cursor: 'pointer' }}
                />
              </div>

              <input
                ref={logoInputRef}
                type="file"
                accept="image/*,.svg"
                style={{ display: 'none' }}
                onChange={(e) => handleFileUpload(e, 'logoUrl')}
              />

              <div
                onClick={() => logoInputRef.current?.click()}
                style={{
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '8px',
                  padding: '10px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                {assets.logoUrl && (
                  <img
                    src={assets.logoUrl}
                    alt="Logo"
                    style={{ height: '28px', maxWidth: '120px', objectFit: 'contain' }}
                  />
                )}
                <div style={{ textAlign: 'left', flex: 1 }}>
                  <div style={{ fontSize: '11px', fontWeight: 600, color: '#F8FAFC' }}>
                    {assets.logoUrl ? 'Ganti Logo Instansi' : 'Upload File Logo'}
                  </div>
                  <div style={{ fontSize: '9px', color: '#94A3B8' }}>SVG / PNG Transparan</div>
                </div>
                <Upload size={14} color="#94A3B8" />
              </div>
            </div>

            {/* 3. UPLOAD BACKGROUND / TEMPLATE FRAME */}
            <div className="glass-panel" style={{ padding: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#CBD5E1', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Layers size={14} />
                  <span>Template Background Gambar</span>
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ fontSize: '10px', color: '#94A3B8' }}>Gunakan</span>
                  <input
                    type="checkbox"
                    checked={assets.useCustomBgImage}
                    onChange={(e) => onUpdateProperty('useCustomBgImage', e.target.checked)}
                    style={{ cursor: 'pointer' }}
                  />
                </div>
              </div>

              <input
                ref={bgInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={(e) => handleFileUpload(e, 'customBgImageUrl')}
              />

              <div
                onClick={() => bgInputRef.current?.click()}
                style={{
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '8px',
                  padding: '10px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                {assets.customBgImageUrl && (
                  <img
                    src={assets.customBgImageUrl}
                    alt="Bg preview"
                    style={{ width: '36px', height: '36px', objectFit: 'cover', borderRadius: '4px' }}
                  />
                )}
                <div style={{ textAlign: 'left', flex: 1 }}>
                  <div style={{ fontSize: '11px', fontWeight: 600, color: '#F8FAFC' }}>
                    Upload Frame / Background Sendiri
                  </div>
                  <div style={{ fontSize: '9px', color: '#94A3B8' }}>Seperti gambar contoh bukit hijau</div>
                </div>
                <Upload size={14} color="#94A3B8" />
              </div>

              {/* Watermark Garuda Toggle */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px' }}>
                <span style={{ fontSize: '11px', color: '#94A3B8' }}>Watermark Garuda / Budaya Tengah</span>
                <input
                  type="checkbox"
                  checked={assets.showWatermark}
                  onChange={(e) => onUpdateProperty('showWatermark', e.target.checked)}
                  style={{ cursor: 'pointer' }}
                />
              </div>
            </div>
          </>
        )}

        {/* TAB 2: GOOGLE GEMINI AI GENERATE & PARAMETERS */}
        {activeTab === 'gemini' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div
              className="glass-panel"
              style={{
                padding: '16px',
                background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.08) 0%, rgba(139, 92, 246, 0.08) 100%)',
                border: '1px solid rgba(56, 189, 248, 0.3)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#38BDF8', fontWeight: 800, fontSize: '13px', marginBottom: '6px' }}>
                <Sparkles size={16} />
                <span>Google Gemini AI Assistant</span>
              </div>
              <div style={{ fontSize: '11px', color: '#CBD5E1', lineHeight: '1.45', marginBottom: '12px' }}>
                Gunakan kecerdasan buatan Google Gemini untuk merumuskan judul acara, kartu SPMI, tanggal, serta menganalisis estetika desain secara instan.
              </div>

              <button
                onClick={onOpenGeminiAI}
                className="btn btn-primary"
                style={{ width: '100%', padding: '10px', fontSize: '12px' }}
              >
                <Zap size={14} />
                <span>Buka Studio Gemini AI & Parameter</span>
              </button>
            </div>

            <div className="glass-panel" style={{ padding: '14px', fontSize: '11px', color: '#94A3B8', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ fontWeight: 700, color: '#F8FAFC' }}>Fitur AI yang Tersedia:</div>
              <div>✨ <strong>Generate Konten Tema</strong>: Merumuskan teks banner atas, kartu acara, dan skema warna harmonis.</div>
              <div>👁️ <strong>Gemini Vision Critic</strong>: Analisis tangkapan visual kanvas asli dengan Multimodal LLM.</div>
              <div>⚙️ <strong>Pengaturan Parameter</strong>: Kontrol Temperature (0.1 - 1.0) dan pilihan model (1.5 Flash / Pro).</div>
            </div>
          </div>
        )}

        {/* TAB 3: TEXT & INFORMASI */}
        {activeTab === 'text' && (
          <>
            <div>
              <label className="label-title">
                <span>Teks Judul Informasi</span>
              </label>
              <textarea
                value={assets.headlineText}
                onChange={(e) => onUpdateProperty('headlineText', e.target.value)}
                rows={2}
                className="input-control"
                placeholder="Judul kegiatan..."
                style={{ resize: 'none' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label className="label-title">
                  <span>Ukuran ({assets.headlineFontSize}px)</span>
                </label>
                <input
                  type="range"
                  min="20"
                  max="56"
                  value={assets.headlineFontSize}
                  onChange={(e) => onUpdateProperty('headlineFontSize', parseInt(e.target.value))}
                />
              </div>
              <div>
                <label className="label-title">Warna Judul</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="color"
                    value={assets.headlineColor}
                    onChange={(e) => onUpdateProperty('headlineColor', e.target.value)}
                    style={{ width: '36px', height: '36px', borderRadius: '6px', border: 'none', cursor: 'pointer' }}
                  />
                  <input
                    type="text"
                    value={assets.headlineColor}
                    onChange={(e) => onUpdateProperty('headlineColor', e.target.value)}
                    className="input-control"
                    style={{ fontSize: '11px', padding: '6px' }}
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="label-title">
                <span>Sub-Judul / Deskripsi</span>
              </label>
              <input
                type="text"
                value={assets.subtitleText}
                onChange={(e) => onUpdateProperty('subtitleText', e.target.value)}
                className="input-control"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label className="label-title">Ukuran ({assets.subtitleFontSize}px)</label>
                <input
                  type="range"
                  min="12"
                  max="24"
                  value={assets.subtitleFontSize}
                  onChange={(e) => onUpdateProperty('subtitleFontSize', parseInt(e.target.value))}
                />
              </div>
              <div>
                <label className="label-title">Warna Sub-judul</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="color"
                    value={assets.subtitleColor}
                    onChange={(e) => onUpdateProperty('subtitleColor', e.target.value)}
                    style={{ width: '36px', height: '36px', borderRadius: '6px', border: 'none', cursor: 'pointer' }}
                  />
                  <input
                    type="text"
                    value={assets.subtitleColor}
                    onChange={(e) => onUpdateProperty('subtitleColor', e.target.value)}
                    className="input-control"
                    style={{ fontSize: '11px', padding: '6px' }}
                  />
                </div>
              </div>
            </div>
          </>
        )}

        {/* TAB 4: BANNER ATAS & KARTU SPMI */}
        {activeTab === 'badge' && (
          <>
            {/* Top Green Banner Pill */}
            <div className="glass-panel" style={{ padding: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#86EFAC' }}>
                  Banner Atas (Peringatan/Event)
                </span>
                <input
                  type="checkbox"
                  checked={assets.showTopPill}
                  onChange={(e) => onUpdateProperty('showTopPill', e.target.checked)}
                  style={{ cursor: 'pointer' }}
                />
              </div>

              <input
                type="text"
                value={assets.topPillText}
                onChange={(e) => onUpdateProperty('topPillText', e.target.value)}
                className="input-control"
                placeholder="Contoh: MEMPERINGATI HARI KESAKTIAN PANCASILA"
                style={{ marginBottom: '10px' }}
              />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label className="label-title">Warna Latar Banner</label>
                  <input
                    type="color"
                    value={assets.topPillBgColor}
                    onChange={(e) => onUpdateProperty('topPillBgColor', e.target.value)}
                    style={{ width: '100%', height: '34px', borderRadius: '6px', border: 'none', cursor: 'pointer' }}
                  />
                </div>
                <div>
                  <label className="label-title">Warna Teks Banner</label>
                  <input
                    type="color"
                    value={assets.topPillTextColor}
                    onChange={(e) => onUpdateProperty('topPillTextColor', e.target.value)}
                    style={{ width: '100%', height: '34px', borderRadius: '6px', border: 'none', cursor: 'pointer' }}
                  />
                </div>
              </div>
            </div>

            {/* Event Card / SPMI Card */}
            <div className="glass-panel" style={{ padding: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#FCD34D' }}>
                  Kartu Kegiatan Bawah (SPMI)
                </span>
                <input
                  type="checkbox"
                  checked={assets.showEventCard}
                  onChange={(e) => onUpdateProperty('showEventCard', e.target.checked)}
                  style={{ cursor: 'pointer' }}
                />
              </div>

              <label className="label-title">Nama Kegiatan</label>
              <input
                type="text"
                value={assets.eventCardTitle}
                onChange={(e) => onUpdateProperty('eventCardTitle', e.target.value)}
                className="input-control"
                placeholder="Sistem Penjaminan Mutu Internal"
                style={{ marginBottom: '8px' }}
              />

              <label className="label-title">Singkatan / Kode Kegiatan</label>
              <input
                type="text"
                value={assets.eventCardSubtitle}
                onChange={(e) => onUpdateProperty('eventCardSubtitle', e.target.value)}
                className="input-control"
                placeholder="SPMI"
                style={{ marginBottom: '8px' }}
              />

              <label className="label-title">Warna Border Kartu</label>
              <input
                type="color"
                value={assets.eventCardBorderColor}
                onChange={(e) => onUpdateProperty('eventCardBorderColor', e.target.value)}
                style={{ width: '100%', height: '34px', borderRadius: '6px', border: 'none', cursor: 'pointer' }}
              />
            </div>

            {/* Date Badge */}
            <div className="glass-panel" style={{ padding: '14px' }}>
              <label className="label-title">
                <span>Tanggal Kegiatan</span>
              </label>
              <input
                type="text"
                value={assets.dateText}
                onChange={(e) => onUpdateProperty('dateText', e.target.value)}
                className="input-control"
                placeholder="18 September 2026"
                style={{ marginBottom: '8px' }}
              />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label className="label-title">Warna Lencana</label>
                  <input
                    type="color"
                    value={assets.dateBgColor}
                    onChange={(e) => onUpdateProperty('dateBgColor', e.target.value)}
                    style={{ width: '100%', height: '34px', borderRadius: '6px', border: 'none', cursor: 'pointer' }}
                  />
                </div>
                <div>
                  <label className="label-title">Warna Teks</label>
                  <input
                    type="color"
                    value={assets.dateColor}
                    onChange={(e) => onUpdateProperty('dateColor', e.target.value)}
                    style={{ width: '100%', height: '34px', borderRadius: '6px', border: 'none', cursor: 'pointer' }}
                  />
                </div>
              </div>
            </div>
          </>
        )}

        {/* TAB 5: SOCIAL MEDIA HANDLES (FOOTER) */}
        {activeTab === 'social' && (
          <>
            <div style={{ fontSize: '11px', color: '#94A3B8', marginBottom: '4px' }}>
              Daftar akun media sosial yang tampil pada pita biru dengan ikon resmi di bagian bawah kanvas:
            </div>

            <div>
              <label className="label-title">Instagram (@)</label>
              <input
                type="text"
                value={assets.socialHandles?.instagram || ''}
                onChange={(e) =>
                  onUpdateProperty('socialHandles', {
                    ...assets.socialHandles,
                    instagram: e.target.value,
                  })
                }
                className="input-control"
                placeholder="smkn1klk"
              />
            </div>

            <div>
              <label className="label-title">Website (URL)</label>
              <input
                type="text"
                value={assets.socialHandles?.website || ''}
                onChange={(e) =>
                  onUpdateProperty('socialHandles', {
                    ...assets.socialHandles,
                    website: e.target.value,
                  })
                }
                className="input-control"
                placeholder="smkn1klk.sch.id"
              />
            </div>

            <div>
              <label className="label-title">Facebook (Halaman)</label>
              <input
                type="text"
                value={assets.socialHandles?.facebook || ''}
                onChange={(e) =>
                  onUpdateProperty('socialHandles', {
                    ...assets.socialHandles,
                    facebook: e.target.value,
                  })
                }
                className="input-control"
                placeholder="SMK Negeri 1 Klungkung"
              />
            </div>

            <div>
              <label className="label-title">TikTok (@)</label>
              <input
                type="text"
                value={assets.socialHandles?.tiktok || ''}
                onChange={(e) =>
                  onUpdateProperty('socialHandles', {
                    ...assets.socialHandles,
                    tiktok: e.target.value,
                  })
                }
                className="input-control"
                placeholder="smkn1klungkung"
              />
            </div>
          </>
        )}
      </div>
    </aside>
  );
};
