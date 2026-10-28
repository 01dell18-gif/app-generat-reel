'use client';

import React, { useState, useRef, useEffect } from 'react';
import { AssetInputs, BackgroundLayer } from '@/types/design';
import { PRESET_BACKGROUND_LIBRARY, TEMPLATE_BG_SMK } from '@/lib/preset-templates';
import {
  dbSaveAsset,
  dbGetAssets,
  dbDeleteAsset,
  dbSaveProject,
  dbGetProjects,
  dbDeleteProject,
  SavedAsset,
  SavedProject,
  AssetCategory,
} from '@/lib/asset-database';
import {
  Upload,
  Type,
  ImageIcon,
  Shield,
  Layers,
  Sparkles,
  Share2,
  Trash2,
  Database,
  Plus,
  ChevronUp,
  ChevronDown,
  Eye,
  EyeOff,
  Save,
  Check,
  RefreshCw,
  Sliders,
  FolderDown,
  CheckCircle2,
} from 'lucide-react';

// Helper: Modern Color Picker Field with Swatch Preview, Native Color Dialog & Hex Input
interface ColorPickerFieldProps {
  label: string;
  value: string;
  onChange: (color: string) => void;
  presetColors?: string[];
}

const ColorPickerField: React.FC<ColorPickerFieldProps> = ({
  label,
  value,
  onChange,
  presetColors = ['#FFFFFF', '#0F172A', '#10B981', '#38BDF8', '#D97706', '#EF4444', '#1E40AF'],
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <label className="label-title" style={{ fontSize: '11px', marginBottom: '2px' }}>
        {label}
      </label>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {/* Swatch with native color input */}
        <label
          style={{
            position: 'relative',
            width: '32px',
            height: '32px',
            borderRadius: '6px',
            backgroundColor: value || '#FFFFFF',
            border: '2px solid rgba(255, 255, 255, 0.25)',
            boxShadow: '0 2px 5px rgba(0,0,0,0.3)',
            cursor: 'pointer',
            flexShrink: 0,
            overflow: 'hidden',
            display: 'block',
          }}
          title="Klik untuk memilih warna"
        >
          <input
            type="color"
            value={value || '#FFFFFF'}
            onChange={(e) => onChange(e.target.value)}
            style={{
              position: 'absolute',
              top: '-10px',
              left: '-10px',
              width: '54px',
              height: '54px',
              opacity: 0,
              cursor: 'pointer',
            }}
          />
        </label>

        {/* Text HEX code input */}
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="input-control"
          style={{
            fontSize: '11px',
            fontFamily: 'monospace',
            textTransform: 'uppercase',
            padding: '5px 8px',
            flex: 1,
          }}
          placeholder="#HEX"
        />
      </div>

      {/* Preset Quick Swatches */}
      {presetColors && presetColors.length > 0 && (
        <div style={{ display: 'flex', gap: '4px', marginTop: '3px' }}>
          {presetColors.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => onChange(color)}
              style={{
                width: '16px',
                height: '16px',
                borderRadius: '3px',
                backgroundColor: color,
                border: value?.toLowerCase() === color.toLowerCase() ? '1.5px solid #38BDF8' : '1px solid rgba(255,255,255,0.2)',
                cursor: 'pointer',
                padding: 0,
              }}
              title={color}
            />
          ))}
        </div>
      )}
    </div>
  );
};

interface AssetIngestionPanelProps {
  assets: AssetInputs;
  onUpdateProperty: (key: keyof AssetInputs, value: any) => void;
  onOpenGeminiAI: () => void;
  onApplyFullAssets?: (assets: AssetInputs) => void;
}

export const AssetIngestionPanel: React.FC<AssetIngestionPanelProps> = ({
  assets,
  onUpdateProperty,
  onOpenGeminiAI,
  onApplyFullAssets,
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'text' | 'badge' | 'social' | 'database' | 'gemini'>('upload');

  // Input refs
  const photoInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const bgInputRef = useRef<HTMLInputElement>(null);
  const layerInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Database state
  const [dbAssets, setDbAssets] = useState<SavedAsset[]>([]);
  const [dbProjects, setDbProjects] = useState<SavedProject[]>([]);
  const [dbFilter, setDbFilter] = useState<'all' | AssetCategory | 'project'>('all');
  const [isSavingDesign, setIsSavingDesign] = useState<boolean>(false);
  const [designSaveTitle, setDesignSaveTitle] = useState<string>('');
  const [dbStatusMsg, setDbStatusMsg] = useState<string>('');

  // Load database items
  const refreshDatabase = async () => {
    try {
      const [allAssets, allProjects] = await Promise.all([
        dbGetAssets(),
        dbGetProjects(),
      ]);
      setDbAssets(allAssets);
      setDbProjects(allProjects);
    } catch (e) {
      console.warn('DB Load error', e);
    }
  };

  useEffect(() => {
    refreshDatabase();
  }, [activeTab]);

  // Helper to read uploaded files as Data URL and auto-save into Database
  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    propertyKey: keyof AssetInputs
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        if (event.target?.result) {
          const dataUrl = event.target.result as string;
          onUpdateProperty(propertyKey, dataUrl);

          if (propertyKey === 'customBgImageUrl') {
            onUpdateProperty('useCustomBgImage', true);
            await dbSaveAsset(file.name || 'Background Template', 'background', dataUrl);
          } else if (propertyKey === 'mainMediaUrl') {
            await dbSaveAsset(file.name || 'Foto Subjek Utama', 'photo', dataUrl);
          } else if (propertyKey === 'logoUrl') {
            await dbSaveAsset(file.name || 'Logo Instansi', 'logo', dataUrl);
          }
          refreshDatabase();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // ================= MULTI-BACKGROUND MANAGEMENT (MAX 4) =================
  const currentBgLayers = assets.backgroundLayers || [];

  const handleAddBackgroundLayer = async (url?: string, name?: string) => {
    if (currentBgLayers.length >= 4) {
      alert('Maksimal 4 template background gambar telah tercapai.');
      return;
    }
    const targetUrl = url || TEMPLATE_BG_SMK;
    const layerName = name || `Background ${currentBgLayers.length + 1}`;
    const newLayer: BackgroundLayer = {
      id: `bg-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      name: layerName,
      url: targetUrl,
      opacity: 1.0,
      blendMode: 'normal',
      visible: true,
    };
    const updated = [...currentBgLayers, newLayer];
    onUpdateProperty('backgroundLayers', updated);
    onUpdateProperty('useCustomBgImage', true);
    await dbSaveAsset(layerName, 'background', targetUrl);
    refreshDatabase();
  };

  const handleUpdateBackgroundLayer = (index: number, updates: Partial<BackgroundLayer>) => {
    const current = [...currentBgLayers];
    if (current[index]) {
      current[index] = { ...current[index], ...updates };
      onUpdateProperty('backgroundLayers', current);
    }
  };

  const handleRemoveBackgroundLayer = (index: number) => {
    const current = currentBgLayers.filter((_, i) => i !== index);
    onUpdateProperty('backgroundLayers', current);
  };

  const handleMoveBackgroundLayer = (index: number, direction: 'up' | 'down') => {
    const current = [...currentBgLayers];
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= current.length) return;
    const temp = current[index];
    current[index] = current[target];
    current[target] = temp;
    onUpdateProperty('backgroundLayers', current);
  };

  const handleLayerImageUpload = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        if (event.target?.result) {
          const dataUrl = event.target.result as string;
          handleUpdateBackgroundLayer(index, { url: dataUrl, name: file.name });
          await dbSaveAsset(file.name || `Background ${index + 1}`, 'background', dataUrl);
          refreshDatabase();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // ================= DATABASE VAULT ACTIONS =================
  const handleApplyAssetFromDB = (item: SavedAsset) => {
    if (item.type === 'photo') {
      onUpdateProperty('mainMediaUrl', item.dataUrl);
    } else if (item.type === 'logo') {
      onUpdateProperty('logoUrl', item.dataUrl);
    } else if (item.type === 'background') {
      if (currentBgLayers.length < 4) {
        handleAddBackgroundLayer(item.dataUrl, item.name);
      } else {
        onUpdateProperty('customBgImageUrl', item.dataUrl);
        onUpdateProperty('useCustomBgImage', true);
      }
    } else if (item.type === 'watermark') {
      onUpdateProperty('watermarkUrl', item.dataUrl);
      onUpdateProperty('showWatermark', true);
    }
    setDbStatusMsg(`Aset "${item.name}" berhasil diterapkan!`);
    setTimeout(() => setDbStatusMsg(''), 3000);
  };

  const handleDeleteAssetFromDB = async (id: string) => {
    await dbDeleteAsset(id);
    refreshDatabase();
  };

  const handleSaveCurrentDesign = async () => {
    const title = designSaveTitle.trim() || `Desain ${assets.headlineText ? assets.headlineText.slice(0, 24) : 'Sekolah'} (${new Date().toLocaleDateString()})`;
    await dbSaveProject(title, 'poster_1_1', assets);
    setDesignSaveTitle('');
    setIsSavingDesign(false);
    refreshDatabase();
    setDbStatusMsg('Desain berhasil disimpan ke database!');
    setTimeout(() => setDbStatusMsg(''), 3000);
  };

  const handleLoadProjectFromDB = (p: SavedProject) => {
    if (onApplyFullAssets) {
      onApplyFullAssets(p.assets);
      setDbStatusMsg(`Desain "${p.title}" berhasil dimuat!`);
      setTimeout(() => setDbStatusMsg(''), 3000);
    }
  };

  const handleDeleteProjectFromDB = async (id: string) => {
    await dbDeleteProject(id);
    refreshDatabase();
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
          padding: '14px 18px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          background: 'linear-gradient(180deg, rgba(56, 189, 248, 0.05) 0%, transparent 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <div style={{ fontSize: '15px', fontWeight: 800, letterSpacing: '-0.2px' }}>
            Asset & Media Studio
          </div>
          <div style={{ fontSize: '11px', color: '#94A3B8' }}>
            Multi-Background, Database & AI Ingestion
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

      {/* Tabs Bar (6 Tabs) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 1fr)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          backgroundColor: 'rgba(0, 0, 0, 0.35)',
        }}
      >
        {[
          { id: 'upload', label: 'Upload', icon: Upload },
          { id: 'text', label: 'Teks 1', icon: Type },
          { id: 'badge', label: 'Teks 2', icon: Layers },
          { id: 'social', label: 'Sosmed', icon: Share2 },
          { id: 'database', label: 'Database', icon: Database },
          { id: 'gemini', label: 'Gemini', icon: Sparkles },
        ].map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              style={{
                padding: '9px 1px',
                fontSize: '10px',
                fontWeight: 700,
                background: 'none',
                border: 'none',
                color: isActive ? '#38BDF8' : '#94A3B8',
                borderBottom: isActive ? '2px solid #38BDF8' : '2px solid transparent',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '3px',
              }}
            >
              <Icon size={13} />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Tab Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* TAB 1: UPLOAD MEDIA & MULTI-BACKGROUND */}
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
                *Foto otomatis tersimpan ke Database lokal dan berada di layer belakang nomor 2.
              </div>

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
                  padding: '14px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  backgroundColor: 'rgba(15, 23, 42, 0.5)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                {assets.mainMediaUrl ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%' }}>
                    <img
                      src={assets.mainMediaUrl}
                      alt="Uploaded preview"
                      style={{ width: '44px', height: '44px', objectFit: 'contain', borderRadius: '6px', background: '#0F172A' }}
                    />
                    <div style={{ textAlign: 'left', flex: 1, overflow: 'hidden' }}>
                      <div style={{ fontSize: '12px', fontWeight: 700, color: '#F8FAFC' }}>Foto Terpasang</div>
                      <div style={{ fontSize: '10px', color: '#94A3B8' }}>Klik untuk mengganti foto dari file</div>
                    </div>
                  </div>
                ) : (
                  <>
                    <Upload size={20} color="#38BDF8" />
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#F8FAFC' }}>
                      Pilih Foto dari Komputer
                    </div>
                    <div style={{ fontSize: '10px', color: '#94A3B8' }}>
                      PNG transparan, JPEG, WebP
                    </div>
                  </>
                )}
              </div>

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

            {/* 3. MULTI-BACKGROUND IMAGE MANAGEMENT (MAX 4 LAYERS) */}
            <div className="glass-panel" style={{ padding: '14px', border: '1px solid rgba(139, 92, 246, 0.3)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#C084FC', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Layers size={14} />
                  <span>Template Background Gambar (Max 4)</span>
                </span>
                <span
                  style={{
                    fontSize: '10px',
                    fontWeight: 700,
                    color: currentBgLayers.length >= 4 ? '#F59E0B' : '#38BDF8',
                    background: 'rgba(255,255,255,0.06)',
                    padding: '2px 8px',
                    borderRadius: '12px',
                  }}
                >
                  {currentBgLayers.length} / 4 Layer
                </span>
              </div>

              <div style={{ fontSize: '10px', color: '#94A3B8', marginBottom: '10px' }}>
                Tumpuk hingga 4 background berbeda (tekstur, grid, gradasi, frame) untuk mempercantik estetika desain.
              </div>

              {/* Add Background Button */}
              {currentBgLayers.length < 4 ? (
                <button
                  onClick={() => handleAddBackgroundLayer()}
                  className="btn btn-secondary"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    fontSize: '11px',
                    marginBottom: '12px',
                    borderColor: 'rgba(192, 132, 252, 0.4)',
                    color: '#C084FC',
                  }}
                >
                  <Plus size={14} />
                  <span>Tambah Layer Background ({currentBgLayers.length}/4)</span>
                </button>
              ) : (
                <div
                  style={{
                    fontSize: '11px',
                    color: '#F59E0B',
                    padding: '6px 10px',
                    borderRadius: '6px',
                    background: 'rgba(245, 158, 11, 0.1)',
                    marginBottom: '10px',
                    textAlign: 'center',
                  }}
                >
                  ✓ Batas maksimal 4 background telah terpasang.
                </div>
              )}

              {/* Active Background Layers Cards */}
              {currentBgLayers.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '14px' }}>
                  {currentBgLayers.map((layer, idx) => (
                    <div
                      key={layer.id || idx}
                      style={{
                        padding: '10px',
                        background: 'rgba(0, 0, 0, 0.35)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '8px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                      }}
                    >
                      {/* Layer Header Row */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <img
                            src={layer.url}
                            alt="layer preview"
                            style={{ width: '28px', height: '28px', borderRadius: '4px', objectFit: 'cover', background: '#0F172A' }}
                          />
                          <span style={{ fontSize: '11px', fontWeight: 700, color: '#F8FAFC' }}>
                            Layer {idx + 1}: {layer.name || 'Background'}
                          </span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          {/* Visibility Toggle */}
                          <button
                            onClick={() => handleUpdateBackgroundLayer(idx, { visible: !layer.visible })}
                            className="btn"
                            style={{ padding: '3px 6px', background: 'none', border: 'none', color: layer.visible ? '#38BDF8' : '#64748B' }}
                            title={layer.visible ? 'Sembunyikan' : 'Tampilkan'}
                          >
                            {layer.visible ? <Eye size={13} /> : <EyeOff size={13} />}
                          </button>

                          {/* Reorder Up */}
                          {idx > 0 && (
                            <button
                              onClick={() => handleMoveBackgroundLayer(idx, 'up')}
                              className="btn"
                              style={{ padding: '3px 6px', background: 'none', border: 'none', color: '#94A3B8' }}
                              title="Pindahkan ke Bawah (Urutan Lapisan)"
                            >
                              <ChevronUp size={13} />
                            </button>
                          )}

                          {/* Reorder Down */}
                          {idx < currentBgLayers.length - 1 && (
                            <button
                              onClick={() => handleMoveBackgroundLayer(idx, 'down')}
                              className="btn"
                              style={{ padding: '3px 6px', background: 'none', border: 'none', color: '#94A3B8' }}
                              title="Pindahkan ke Atas (Urutan Lapisan)"
                            >
                              <ChevronDown size={13} />
                            </button>
                          )}

                          {/* Remove Layer */}
                          <button
                            onClick={() => handleRemoveBackgroundLayer(idx)}
                            className="btn"
                            style={{ padding: '3px 6px', background: 'none', border: 'none', color: '#F43F5E' }}
                            title="Hapus Layer Background"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>

                      {/* Controls: Opacity & Blend Mode */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '8px', alignItems: 'center' }}>
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: '#94A3B8', marginBottom: '2px' }}>
                            <span>Opasitas</span>
                            <span>{Math.round((layer.opacity ?? 1.0) * 100)}%</span>
                          </div>
                          <input
                            type="range"
                            min="0.05"
                            max="1.0"
                            step="0.05"
                            value={layer.opacity ?? 1.0}
                            onChange={(e) => handleUpdateBackgroundLayer(idx, { opacity: parseFloat(e.target.value) })}
                          />
                        </div>

                        <div>
                          <div style={{ fontSize: '9px', color: '#94A3B8', marginBottom: '2px' }}>Blend Mode</div>
                          <select
                            value={layer.blendMode || 'normal'}
                            onChange={(e) => handleUpdateBackgroundLayer(idx, { blendMode: e.target.value as any })}
                            className="input-control"
                            style={{ padding: '3px 6px', fontSize: '10px' }}
                          >
                            <option value="normal">Normal</option>
                            <option value="overlay">Overlay</option>
                            <option value="screen">Screen</option>
                            <option value="multiply">Multiply</option>
                            <option value="lighten">Lighten</option>
                          </select>
                        </div>
                      </div>

                      {/* Upload Replacement for this Layer */}
                      <input
                        ref={(el) => { layerInputRefs.current[idx] = el; }}
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={(e) => handleLayerImageUpload(e, idx)}
                      />
                      <button
                        onClick={() => layerInputRefs.current[idx]?.click()}
                        className="btn btn-secondary"
                        style={{ padding: '4px', fontSize: '9px', width: '100%' }}
                      >
                        <Upload size={11} />
                        <span>Ganti Gambar Layer Ini dari Komputer</span>
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                /* Primary Single Background fallback upload */
                <div>
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
                      marginBottom: '10px',
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
                      <div style={{ fontSize: '9px', color: '#94A3B8' }}>Bisa ditambah hingga 4 lapis</div>
                    </div>
                    <Upload size={14} color="#94A3B8" />
                  </div>
                </div>
              )}

              {/* Preset Gallery Quick Picks */}
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '10px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#94A3B8', display: 'block', marginBottom: '8px' }}>
                  ✨ Galeri Preset Background Cepat (1-Klik Tambah):
                </span>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                  {PRESET_BACKGROUND_LIBRARY.map((bg) => (
                    <button
                      key={bg.id}
                      onClick={() => handleAddBackgroundLayer(bg.url, bg.name)}
                      disabled={currentBgLayers.length >= 4}
                      className="btn"
                      style={{
                        padding: '6px 8px',
                        fontSize: '10px',
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        textAlign: 'left',
                        cursor: currentBgLayers.length >= 4 ? 'not-allowed' : 'pointer',
                        opacity: currentBgLayers.length >= 4 ? 0.5 : 1,
                      }}
                      title={`Tambahkan ${bg.name} sebagai background`}
                    >
                      <div
                        style={{
                          width: '18px',
                          height: '18px',
                          borderRadius: '4px',
                          background: bg.previewGradient,
                          flexShrink: 0,
                        }}
                      />
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#F8FAFC' }}>
                        {bg.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Watermark Garuda Toggle */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '12px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '8px' }}>
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

        {/* TAB 2: DATABASE & ASSET VAULT */}
        {activeTab === 'database' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div
              className="glass-panel"
              style={{
                padding: '14px',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.08) 0%, rgba(139, 92, 246, 0.08) 100%)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#38BDF8', fontWeight: 800, fontSize: '13px', marginBottom: '4px' }}>
                <Database size={16} />
                <span>Asset Database & Library Vault</span>
              </div>
              <div style={{ fontSize: '11px', color: '#CBD5E1', lineHeight: '1.45', marginBottom: '10px' }}>
                Seluruh foto subjek, logo, dan background yang pernah diunggah tersimpan aman di basis data peramban (IndexedDB) dan siap dipakai kembali sewaktu-waktu.
              </div>

              {/* Save Current Design Button */}
              {isSavingDesign ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '8px' }}>
                  <input
                    type="text"
                    value={designSaveTitle}
                    onChange={(e) => setDesignSaveTitle(e.target.value)}
                    placeholder="Nama Desain (contoh: Poster HUT SMK)..."
                    className="input-control"
                    style={{ fontSize: '11px' }}
                  />
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      onClick={handleSaveCurrentDesign}
                      className="btn btn-primary"
                      style={{ flex: 1, padding: '6px', fontSize: '11px' }}
                    >
                      <Save size={12} />
                      <span>Simpan ke Database</span>
                    </button>
                    <button
                      onClick={() => setIsSavingDesign(false)}
                      className="btn btn-secondary"
                      style={{ padding: '6px 10px', fontSize: '11px' }}
                    >
                      Batal
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setIsSavingDesign(true)}
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '8px 12px', fontSize: '11px' }}
                >
                  <Save size={13} />
                  <span>Simpan Desain Saat Ini ke Database</span>
                </button>
              )}
            </div>

            {/* Notification message */}
            {dbStatusMsg && (
              <div
                style={{
                  padding: '8px 12px',
                  borderRadius: '6px',
                  backgroundColor: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid #10B981',
                  color: '#A7F3D0',
                  fontSize: '11px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <CheckCircle2 size={13} />
                <span>{dbStatusMsg}</span>
              </div>
            )}

            {/* Filter Pills */}
            <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
              {[
                { id: 'all', label: 'Semua' },
                { id: 'background', label: 'Background' },
                { id: 'photo', label: 'Foto Subjek' },
                { id: 'logo', label: 'Logo' },
                { id: 'project', label: 'Desain Tersimpan' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setDbFilter(f.id as any)}
                  className="btn"
                  style={{
                    padding: '4px 10px',
                    fontSize: '10px',
                    borderRadius: '12px',
                    background: dbFilter === f.id ? 'rgba(56, 189, 248, 0.22)' : 'rgba(255, 255, 255, 0.05)',
                    border: dbFilter === f.id ? '1px solid #38BDF8' : '1px solid rgba(255, 255, 255, 0.08)',
                    color: dbFilter === f.id ? '#38BDF8' : '#94A3B8',
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Saved Projects section */}
            {(dbFilter === 'all' || dbFilter === 'project') && dbProjects.length > 0 && (
              <div>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#FCD34D', marginBottom: '8px' }}>
                  Desain Tersimpan ({dbProjects.length}):
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {dbProjects.map((p) => (
                    <div
                      key={p.id}
                      style={{
                        padding: '10px 12px',
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div style={{ overflow: 'hidden' }}>
                        <div style={{ fontSize: '12px', fontWeight: 700, color: '#F8FAFC' }}>
                          {p.title}
                        </div>
                        <div style={{ fontSize: '10px', color: '#94A3B8' }}>
                          {new Date(p.createdAt).toLocaleString()} • {p.assets?.topPillText || 'Desain'}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button
                          onClick={() => handleLoadProjectFromDB(p)}
                          className="btn btn-primary"
                          style={{ padding: '4px 10px', fontSize: '10px' }}
                        >
                          Terapkan
                        </button>
                        <button
                          onClick={() => handleDeleteProjectFromDB(p.id)}
                          className="btn"
                          style={{ padding: '4px 6px', background: 'none', border: 'none', color: '#F43F5E' }}
                          title="Hapus Desain"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Saved Assets Grid */}
            <div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#CBD5E1', marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
                <span>Aset Media Tersimpan ({dbAssets.filter((a) => dbFilter === 'all' || a.type === dbFilter).length}):</span>
                <button
                  onClick={refreshDatabase}
                  style={{ background: 'none', border: 'none', color: '#38BDF8', cursor: 'pointer', fontSize: '10px', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <RefreshCw size={10} />
                  <span>Segarkan</span>
                </button>
              </div>

              {dbAssets.filter((a) => dbFilter === 'all' || a.type === dbFilter).length === 0 ? (
                <div style={{ padding: '24px', textAlign: 'center', color: '#64748B', fontSize: '11px' }}>
                  Belum ada aset tersimpan di kategori ini. Unggah foto atau logo untuk menyimpannya secara otomatis ke database!
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                  {dbAssets
                    .filter((a) => dbFilter === 'all' || a.type === dbFilter)
                    .map((item) => (
                      <div
                        key={item.id}
                        style={{
                          padding: '8px',
                          background: 'rgba(255, 255, 255, 0.03)',
                          border: '1px solid rgba(255, 255, 255, 0.08)',
                          borderRadius: '8px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '6px',
                        }}
                      >
                        <div style={{ height: '70px', borderRadius: '4px', overflow: 'hidden', background: '#0F172A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <img
                            src={item.dataUrl}
                            alt={item.name}
                            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                          />
                        </div>

                        <div style={{ fontSize: '11px', fontWeight: 700, color: '#F8FAFC', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {item.name}
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2px' }}>
                          <span
                            style={{
                              fontSize: '9px',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              background: 'rgba(56, 189, 248, 0.15)',
                              color: '#38BDF8',
                              textTransform: 'capitalize',
                            }}
                          >
                            {item.type}
                          </span>

                          <div style={{ display: 'flex', gap: '4px' }}>
                            <button
                              onClick={() => handleApplyAssetFromDB(item)}
                              className="btn btn-primary"
                              style={{ padding: '3px 8px', fontSize: '10px' }}
                              title="Terapkan aset ini ke kanvas"
                            >
                              Pakai
                            </button>
                            <button
                              onClick={() => handleDeleteAssetFromDB(item.id)}
                              className="btn"
                              style={{ padding: '3px 5px', background: 'none', border: 'none', color: '#F43F5E' }}
                              title="Hapus dari database"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: GOOGLE GEMINI AI GENERATE & PARAMETERS */}
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
                style={{ width: '100%', padding: '10px' }}
              >
                <Sparkles size={14} />
                <span>Buka Gemini AI Studio</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: TEKS 1 (BANNER ATAS & JUDUL UTAMA) */}
        {activeTab === 'text' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ fontSize: '11px', color: '#94A3B8', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '6px' }}>
              Kontrol teks bagian atas: Banner Peringatan / Event dan Judul Utama Informasi.
            </div>

            {/* 1. Banner Atas (Peringatan / Event) */}
            <div className="glass-panel" style={{ padding: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#86EFAC', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>Banner Atas (Peringatan/Event)</span>
                </span>
                <input
                  type="checkbox"
                  checked={assets.showTopPill}
                  onChange={(e) => onUpdateProperty('showTopPill', e.target.checked)}
                  style={{ cursor: 'pointer', accentColor: '#10B981', width: '16px', height: '16px' }}
                />
              </div>

              <div style={{ marginBottom: '10px' }}>
                <label className="label-title">Teks Banner Atas</label>
                <input
                  type="text"
                  value={assets.topPillText}
                  onChange={(e) => onUpdateProperty('topPillText', e.target.value)}
                  className="input-control"
                  placeholder="Contoh: MEMPERINGATI HARI KESAKTIAN PANCASILA"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <ColorPickerField
                  label="Warna Latar Banner"
                  value={assets.topPillBgColor}
                  onChange={(val) => onUpdateProperty('topPillBgColor', val)}
                  presetColors={['#10B981', '#059669', '#2563EB', '#DC2626', '#D97706', '#475569']}
                />
                <ColorPickerField
                  label="Warna Teks Banner"
                  value={assets.topPillTextColor}
                  onChange={(val) => onUpdateProperty('topPillTextColor', val)}
                  presetColors={['#FFFFFF', '#0F172A', '#FEF08A', '#E2E8F0']}
                />
              </div>
            </div>

            {/* 2. Judul Utama (Headline) */}
            <div className="glass-panel" style={{ padding: '14px' }}>
              <label className="label-title">
                <span>Teks Judul Informasi (Headline)</span>
              </label>
              <textarea
                value={assets.headlineText}
                onChange={(e) => onUpdateProperty('headlineText', e.target.value)}
                rows={2}
                className="input-control"
                placeholder="Judul kegiatan..."
                style={{ resize: 'none', marginBottom: '10px' }}
              />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', alignItems: 'flex-start' }}>
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
                    style={{ width: '100%', marginTop: '4px' }}
                  />
                </div>
                <ColorPickerField
                  label="Warna Judul"
                  value={assets.headlineColor}
                  onChange={(val) => onUpdateProperty('headlineColor', val)}
                  presetColors={['#0F172A', '#FFFFFF', '#1E40AF', '#D97706', '#DC2626']}
                />
              </div>
            </div>

            {/* 3. Sub-Judul / Deskripsi */}
            <div className="glass-panel" style={{ padding: '14px' }}>
              <label className="label-title">
                <span>Sub-Judul / Deskripsi</span>
              </label>
              <input
                type="text"
                value={assets.subtitleText}
                onChange={(e) => onUpdateProperty('subtitleText', e.target.value)}
                className="input-control"
                placeholder="Sub-judul atau tema..."
                style={{ marginBottom: '10px' }}
              />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', alignItems: 'flex-start' }}>
                <div>
                  <label className="label-title">
                    <span>Ukuran ({assets.subtitleFontSize}px)</span>
                  </label>
                  <input
                    type="range"
                    min="12"
                    max="28"
                    value={assets.subtitleFontSize}
                    onChange={(e) => onUpdateProperty('subtitleFontSize', parseInt(e.target.value))}
                    style={{ width: '100%', marginTop: '4px' }}
                  />
                </div>
                <ColorPickerField
                  label="Warna Sub-judul"
                  value={assets.subtitleColor}
                  onChange={(val) => onUpdateProperty('subtitleColor', val)}
                  presetColors={['#475569', '#94A3B8', '#FFFFFF', '#1E293B']}
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: TEKS 2 (INFORMASI DI BAGIAN BAWAH / KARTU SPMI & TANGGAL) */}
        {activeTab === 'badge' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ fontSize: '11px', color: '#94A3B8', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '6px' }}>
              Kontrol teks 2 untuk informasi di bagian bawah kanvas: Kartu Kegiatan SPMI & Lencana Tanggal Pelaksanaan.
            </div>

            {/* 1. Kartu Kegiatan Bawah (SPMI) */}
            <div className="glass-panel" style={{ padding: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#FCD34D', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>Kartu Kegiatan Bawah (SPMI)</span>
                </span>
                <input
                  type="checkbox"
                  checked={assets.showEventCard}
                  onChange={(e) => onUpdateProperty('showEventCard', e.target.checked)}
                  style={{ cursor: 'pointer', accentColor: '#F59E0B', width: '16px', height: '16px' }}
                />
              </div>

              <div style={{ marginBottom: '10px' }}>
                <label className="label-title">Nama Kegiatan</label>
                <input
                  type="text"
                  value={assets.eventCardTitle}
                  onChange={(e) => onUpdateProperty('eventCardTitle', e.target.value)}
                  className="input-control"
                  placeholder="Sistem Penjaminan Mutu Internal"
                />
              </div>

              <div style={{ marginBottom: '10px' }}>
                <label className="label-title">Singkatan / Kode Kegiatan</label>
                <input
                  type="text"
                  value={assets.eventCardSubtitle}
                  onChange={(e) => onUpdateProperty('eventCardSubtitle', e.target.value)}
                  className="input-control"
                  placeholder="SPMI"
                />
              </div>

              <div>
                <ColorPickerField
                  label="Warna Border Kartu"
                  value={assets.eventCardBorderColor}
                  onChange={(val) => onUpdateProperty('eventCardBorderColor', val)}
                  presetColors={['#B45309', '#D97706', '#2563EB', '#10B981', '#475569', '#E2E8F0']}
                />
              </div>
            </div>

            {/* 2. Lencana Tanggal Pelaksanaan */}
            <div className="glass-panel" style={{ padding: '14px' }}>
              <div style={{ marginBottom: '10px' }}>
                <label className="label-title">
                  <span>Tanggal Pelaksanaan Kegiatan</span>
                </label>
                <input
                  type="text"
                  value={assets.dateText}
                  onChange={(e) => onUpdateProperty('dateText', e.target.value)}
                  className="input-control"
                  placeholder="18 September 2026"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <ColorPickerField
                  label="Warna Lencana Tanggal"
                  value={assets.dateBgColor}
                  onChange={(val) => onUpdateProperty('dateBgColor', val)}
                  presetColors={['#2563EB', '#1D4ED8', '#10B981', '#D97706', '#DC2626', '#1E293B']}
                />
                <ColorPickerField
                  label="Warna Teks Tanggal"
                  value={assets.dateColor}
                  onChange={(val) => onUpdateProperty('dateColor', val)}
                  presetColors={['#FFFFFF', '#FEF08A', '#0F172A', '#E2E8F0']}
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: SOCIAL MEDIA HANDLES (FOOTER) */}
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
