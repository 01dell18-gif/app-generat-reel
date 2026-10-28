'use client';

import React, { useState, useRef, useEffect } from 'react';
import { AssetInputs, BackgroundLayer } from '@/types/design';
import { PRESET_BACKGROUND_LIBRARY, TEMPLATE_BG_SMK, PRESET_TEMPLATES, LOGO_SMK_KLUNGKUNG } from '@/lib/preset-templates';
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
  RotateCw,
  RotateCcw,
  FlipHorizontal,
  FlipVertical,
  Zap,
  Move,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Crosshair,
} from 'lucide-react';
import { AI_DESIGN_RECOMMENDATIONS, AIDesignPreset } from './GeminiAIModal';

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
      let [allAssets, allProjects] = await Promise.all([
        dbGetAssets(),
        dbGetProjects(),
      ]);

      // Seed database with default master project if fresh/empty
      if (allProjects.length === 0 && PRESET_TEMPLATES.length > 0) {
        await dbSaveProject(
          'SMK N 1 Klungkung (Default Master)',
          'poster_1_1',
          PRESET_TEMPLATES[0].data
        );
        allProjects = await dbGetProjects();
      }

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

  const handleApplyRecInPanel = (rec: AIDesignPreset) => {
    if (onApplyFullAssets) {
      onApplyFullAssets({ ...assets, ...rec.updates });
    } else {
      Object.entries(rec.updates).forEach(([k, v]) => {
        onUpdateProperty(k as keyof AssetInputs, v);
      });
    }
    setDbStatusMsg(`Rekomendasi "${rec.title}" diterapkan!`);
    setTimeout(() => setDbStatusMsg(''), 3000);
  };

  const handleSaveRecToDatabase = async (rec: AIDesignPreset) => {
    const mergedAssets: AssetInputs = {
      ...assets,
      ...rec.updates,
    };
    await dbSaveProject(
      `AI: ${rec.title} (${new Date().toLocaleDateString()})`,
      'poster_1_1',
      mergedAssets
    );
    refreshDatabase();
    setDbStatusMsg(`Rekomendasi "${rec.title}" berhasil disimpan ke Database!`);
    setTimeout(() => setDbStatusMsg(''), 3000);
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
                <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {/* Scale & Zoom Slider */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <label className="label-title" style={{ margin: 0 }}>
                        <span>Ukuran Foto (Perbesar / Perkecil)</span>
                      </label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <button
                          type="button"
                          onClick={() => onUpdateProperty('mainMediaScale', Math.max(0.2, Number(((assets.mainMediaScale || 1.0) - 0.1).toFixed(2))))}
                          className="btn btn-secondary"
                          style={{ padding: '2px 7px', fontSize: '11px', fontWeight: 800 }}
                          title="Perkecil (-10%)"
                        >
                          -
                        </button>
                        <span style={{ fontSize: '11px', fontWeight: 800, color: '#38BDF8', minWidth: '42px', textAlign: 'center' }}>
                          {Number(assets.mainMediaScale || 1.0).toFixed(2)}x
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateProperty('mainMediaScale', Math.min(3.0, Number(((assets.mainMediaScale || 1.0) + 0.1).toFixed(2))))}
                          className="btn btn-secondary"
                          style={{ padding: '2px 7px', fontSize: '11px', fontWeight: 800 }}
                          title="Perbesar (+10%)"
                        >
                          +
                        </button>
                        <button
                          type="button"
                          onClick={() => onUpdateProperty('mainMediaScale', 1.0)}
                          style={{ background: 'none', border: 'none', color: '#94A3B8', fontSize: '9px', cursor: 'pointer', padding: '0 4px' }}
                          title="Reset ke Ukuran Asli 1.0x"
                        >
                          Reset
                        </button>
                      </div>
                    </div>
                    <input
                      type="range"
                      min="0.2"
                      max="3.0"
                      step="0.05"
                      value={assets.mainMediaScale || 1.0}
                      onChange={(e) => onUpdateProperty('mainMediaScale', parseFloat(e.target.value))}
                    />
                  </div>

                  {/* Rotation & Mirror Controls */}
                  <div style={{ background: 'rgba(0, 0, 0, 0.25)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: '#38BDF8' }}>
                        Rotasi & Mirror (Balik Foto)
                      </span>
                      <span style={{ fontSize: '10px', color: '#94A3B8', fontFamily: 'monospace' }}>
                        {assets.mainMediaRotation || 0}°
                      </span>
                    </div>

                    {/* Quick Rotate & Mirror Buttons */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px', marginBottom: '8px' }}>
                      <button
                        type="button"
                        onClick={() => {
                          const current = assets.mainMediaRotation || 0;
                          const next = (current - 90) % 360;
                          onUpdateProperty('mainMediaRotation', next < -180 ? next + 360 : next);
                        }}
                        className="btn btn-secondary"
                        style={{ padding: '6px 4px', fontSize: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}
                        title="Putar Kiri -90°"
                      >
                        <RotateCcw size={13} />
                        <span>-90°</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const current = assets.mainMediaRotation || 0;
                          const next = (current + 90) % 360;
                          onUpdateProperty('mainMediaRotation', next > 180 ? next - 360 : next);
                        }}
                        className="btn btn-secondary"
                        style={{ padding: '6px 4px', fontSize: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}
                        title="Putar Kanan +90°"
                      >
                        <RotateCw size={13} />
                        <span>+90°</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onUpdateProperty('mainMediaFlipH', !assets.mainMediaFlipH)}
                        className="btn"
                        style={{
                          padding: '6px 4px',
                          fontSize: '10px',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '3px',
                          background: assets.mainMediaFlipH ? 'rgba(56, 189, 248, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                          border: assets.mainMediaFlipH ? '1px solid #38BDF8' : '1px solid rgba(255, 255, 255, 0.12)',
                          color: assets.mainMediaFlipH ? '#38BDF8' : '#CBD5E1',
                        }}
                        title="Mirror Horizontal (Balik Kiri-Kanan)"
                      >
                        <FlipHorizontal size={13} />
                        <span>Mirror H</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onUpdateProperty('mainMediaFlipV', !assets.mainMediaFlipV)}
                        className="btn"
                        style={{
                          padding: '6px 4px',
                          fontSize: '10px',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '3px',
                          background: assets.mainMediaFlipV ? 'rgba(56, 189, 248, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                          border: assets.mainMediaFlipV ? '1px solid #38BDF8' : '1px solid rgba(255, 255, 255, 0.12)',
                          color: assets.mainMediaFlipV ? '#38BDF8' : '#CBD5E1',
                        }}
                        title="Mirror Vertikal (Balik Atas-Bawah)"
                      >
                        <FlipVertical size={13} />
                        <span>Mirror V</span>
                      </button>
                    </div>

                    {/* Rotation Range Slider */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: '#94A3B8', marginBottom: '2px' }}>
                        <span>Derajat Rotasi Bebas</span>
                        {(assets.mainMediaRotation !== 0 || assets.mainMediaFlipH || assets.mainMediaFlipV) && (
                          <button
                            type="button"
                            onClick={() => {
                              onUpdateProperty('mainMediaRotation', 0);
                              onUpdateProperty('mainMediaFlipH', false);
                              onUpdateProperty('mainMediaFlipV', false);
                            }}
                            style={{ background: 'none', border: 'none', color: '#F43F5E', fontSize: '9px', cursor: 'pointer', padding: 0 }}
                          >
                            Reset Transformasi
                          </button>
                        )}
                      </div>
                      <input
                        type="range"
                        min="-180"
                        max="180"
                        step="1"
                        value={assets.mainMediaRotation || 0}
                        onChange={(e) => onUpdateProperty('mainMediaRotation', parseInt(e.target.value))}
                      />
                    </div>

                    {/* Scale / Ukuran Foto Subjek Slider */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: '#94A3B8', marginBottom: '2px' }}>
                        <span>Ukuran Foto Subjek ({(assets.mainMediaScale || 1.0).toFixed(2)}x)</span>
                        {assets.mainMediaScale && assets.mainMediaScale !== 1.0 && (
                          <button
                            type="button"
                            onClick={() => onUpdateProperty('mainMediaScale', 1.0)}
                            style={{ background: 'none', border: 'none', color: '#38BDF8', fontSize: '9px', cursor: 'pointer', padding: 0 }}
                          >
                            Reset (1.0x)
                          </button>
                        )}
                      </div>
                      <input
                        type="range"
                        min="0.2"
                        max="3.0"
                        step="0.05"
                        value={assets.mainMediaScale || 1.0}
                        onChange={(e) => onUpdateProperty('mainMediaScale', parseFloat(e.target.value))}
                      />
                    </div>

                    {/* Posisi Geser X & Y Foto Subjek */}
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: '#94A3B8', marginBottom: '2px' }}>
                          <span>Geser X ({assets.mainMediaX ?? 290}px)</span>
                          {assets.mainMediaX !== undefined && (
                            <button
                              type="button"
                              onClick={() => onUpdateProperty('mainMediaX', 290)}
                              style={{ background: 'none', border: 'none', color: '#38BDF8', fontSize: '8.5px', cursor: 'pointer', padding: 0 }}
                            >
                              Tengah
                            </button>
                          )}
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="580"
                          step="2"
                          value={assets.mainMediaX ?? 290}
                          onChange={(e) => onUpdateProperty('mainMediaX', parseInt(e.target.value))}
                        />
                      </div>

                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: '#94A3B8', marginBottom: '2px' }}>
                          <span>Geser Y ({assets.mainMediaY ?? 300}px)</span>
                          {assets.mainMediaY !== undefined && (
                            <button
                              type="button"
                              onClick={() => onUpdateProperty('mainMediaY', 300)}
                              style={{ background: 'none', border: 'none', color: '#38BDF8', fontSize: '8.5px', cursor: 'pointer', padding: 0 }}
                            >
                              Tengah
                            </button>
                          )}
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="675"
                          step="2"
                          value={assets.mainMediaY ?? 300}
                          onChange={(e) => onUpdateProperty('mainMediaY', parseInt(e.target.value))}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Aura Effect Toggle */}
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

              <button
                type="button"
                onClick={() => {
                  onUpdateProperty('logoUrl', LOGO_SMK_KLUNGKUNG);
                  setDbStatusMsg('Logo kapsul melengkung modern diterapkan!');
                  setTimeout(() => setDbStatusMsg(''), 3000);
                }}
                style={{
                  marginTop: '8px',
                  width: '100%',
                  padding: '7px 12px',
                  fontSize: '11px',
                  fontWeight: 600,
                  borderRadius: '9999px',
                  backgroundColor: 'rgba(56, 189, 248, 0.1)',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  color: '#38BDF8',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  transition: 'all 0.2s ease',
                }}
              >
                <Sparkles size={12} />
                <span>Pakai Logo Kapsul Lengkung Modern SMK</span>
              </button>

              <div
                style={{
                  marginTop: '8px',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  backgroundColor: 'rgba(16, 185, 129, 0.08)',
                  border: '1px solid rgba(16, 185, 129, 0.25)',
                  fontSize: '9.5px',
                  color: '#6EE7B7',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <CheckCircle2 size={13} style={{ flexShrink: 0 }} />
                <span>Auto-Frame Lengkung: Gambar logo apapun yang di-upload (meski kotak) otomatis dibingkai kapsul melengkung estetik.</span>
              </div>

              {/* Logo Position, Scale & Rotation Settings */}
              <div
                style={{
                  marginTop: '10px',
                  padding: '10px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(0, 0, 0, 0.25)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '10px', fontWeight: 700, color: '#38BDF8' }}>
                    Ukuran & Posisi Logo
                  </span>
                  {(assets.logoX !== undefined || assets.logoY !== undefined || (assets.logoScale && assets.logoScale !== 1.0) || assets.logoRotation) && (
                    <button
                      type="button"
                      onClick={() => {
                        onUpdateProperty('logoX', undefined);
                        onUpdateProperty('logoY', undefined);
                        onUpdateProperty('logoScale', 1.0);
                        onUpdateProperty('logoRotation', 0);
                      }}
                      style={{ background: 'none', border: 'none', color: '#F43F5E', fontSize: '9px', cursor: 'pointer', padding: 0 }}
                    >
                      Reset Posisi
                    </button>
                  )}
                </div>

                {/* Scale Slider */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: '#94A3B8', marginBottom: '2px' }}>
                    <span>Ukuran / Skala Logo ({(assets.logoScale || 1.0).toFixed(2)}x)</span>
                  </div>
                  <input
                    type="range"
                    min="0.3"
                    max="2.5"
                    step="0.05"
                    value={assets.logoScale || 1.0}
                    onChange={(e) => onUpdateProperty('logoScale', parseFloat(e.target.value))}
                  />
                </div>

                {/* Posisi Geser X & Y Logo */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: '#94A3B8', marginBottom: '2px' }}>
                      <span>Posisi X ({assets.logoX ?? 24}px)</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="450"
                      step="2"
                      value={assets.logoX ?? 24}
                      onChange={(e) => onUpdateProperty('logoX', parseInt(e.target.value))}
                    />
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: '#94A3B8', marginBottom: '2px' }}>
                      <span>Posisi Y ({assets.logoY ?? 24}px)</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="450"
                      step="2"
                      value={assets.logoY ?? 24}
                      onChange={(e) => onUpdateProperty('logoY', parseInt(e.target.value))}
                    />
                  </div>
                </div>
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

                      {/* Scale / Zoom Control for Layer */}
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: '#94A3B8', marginBottom: '2px' }}>
                          <span>Ukuran / Skala Background</span>
                          <span style={{ color: '#C084FC', fontWeight: 700 }}>{Number(layer.scale || 1.0).toFixed(2)}x</span>
                        </div>
                        <input
                          type="range"
                          min="0.5"
                          max="3.0"
                          step="0.05"
                          value={layer.scale || 1.0}
                          onChange={(e) => handleUpdateBackgroundLayer(idx, { scale: parseFloat(e.target.value) })}
                        />
                      </div>

                      {/* 1. Posisi / Pindah-Pindah (Offset X & Y) */}
                      <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '8px', borderRadius: '6px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                          <span style={{ fontSize: '10px', fontWeight: 700, color: '#C084FC', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Move size={11} />
                            <span>Pindah Posisi Background</span>
                          </span>
                          <span style={{ fontSize: '9px', color: '#94A3B8' }}>
                            X: {layer.x || 0}px | Y: {layer.y || 0}px
                          </span>
                        </div>

                        {/* Slider X & Y */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '6px' }}>
                          <div>
                            <div style={{ fontSize: '8.5px', color: '#94A3B8', marginBottom: '2px' }}>Geser Kiri / Kanan (X)</div>
                            <input
                              type="range"
                              min="-350"
                              max="350"
                              step="5"
                              value={layer.x || 0}
                              onChange={(e) => handleUpdateBackgroundLayer(idx, { x: parseInt(e.target.value, 10) })}
                            />
                          </div>
                          <div>
                            <div style={{ fontSize: '8.5px', color: '#94A3B8', marginBottom: '2px' }}>Geser Atas / Bawah (Y)</div>
                            <input
                              type="range"
                              min="-350"
                              max="350"
                              step="5"
                              value={layer.y || 0}
                              onChange={(e) => handleUpdateBackgroundLayer(idx, { y: parseInt(e.target.value, 10) })}
                            />
                          </div>
                        </div>

                        {/* D-Pad Directional Controls & Center Button */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <button
                            type="button"
                            onClick={() => handleUpdateBackgroundLayer(idx, { x: (layer.x || 0) - 20 })}
                            className="btn btn-secondary"
                            style={{ padding: '3px 8px', fontSize: '9px', flex: 1 }}
                            title="Geser Kiri 20px"
                          >
                            <ArrowLeft size={11} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleUpdateBackgroundLayer(idx, { y: (layer.y || 0) - 20 })}
                            className="btn btn-secondary"
                            style={{ padding: '3px 8px', fontSize: '9px', flex: 1 }}
                            title="Geser Atas 20px"
                          >
                            <ArrowUp size={11} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleUpdateBackgroundLayer(idx, { x: 0, y: 0 })}
                            className="btn btn-secondary"
                            style={{ padding: '3px 8px', fontSize: '9px', flex: 1.2, color: '#38BDF8' }}
                            title="Kembalikan ke Posisi Tengah (0,0)"
                          >
                            <Crosshair size={11} />
                            <span>Tengah</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleUpdateBackgroundLayer(idx, { y: (layer.y || 0) + 20 })}
                            className="btn btn-secondary"
                            style={{ padding: '3px 8px', fontSize: '9px', flex: 1 }}
                            title="Geser Bawah 20px"
                          >
                            <ArrowDown size={11} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleUpdateBackgroundLayer(idx, { x: (layer.x || 0) + 20 })}
                            className="btn btn-secondary"
                            style={{ padding: '3px 8px', fontSize: '9px', flex: 1 }}
                            title="Geser Kanan 20px"
                          >
                            <ArrowRight size={11} />
                          </button>
                        </div>
                        <div style={{ fontSize: '8px', color: '#64748B', marginTop: '4px', textAlign: 'center' }}>
                          Bisa juga langsung diklik & digeser (drag) di kanvas
                        </div>
                      </div>

                      {/* 2. Rotasi & Mirror Controls */}
                      <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '8px', borderRadius: '6px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                        {/* Rotation Free Slider */}
                        <div style={{ marginBottom: '6px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: '#94A3B8', marginBottom: '2px' }}>
                            <span>Sudut Rotasi Background</span>
                            <span style={{ color: '#38BDF8', fontWeight: 700 }}>{layer.rotation || 0}°</span>
                          </div>
                          <input
                            type="range"
                            min="-180"
                            max="180"
                            step="1"
                            value={layer.rotation || 0}
                            onChange={(e) => handleUpdateBackgroundLayer(idx, { rotation: parseInt(e.target.value, 10) })}
                          />
                        </div>

                        {/* Quick Rotate Buttons (-90, +90, 0) */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '6px' }}>
                          <button
                            type="button"
                            onClick={() => handleUpdateBackgroundLayer(idx, { rotation: ((layer.rotation || 0) - 90) % 360 })}
                            className="btn btn-secondary"
                            style={{ padding: '3px 6px', fontSize: '9px', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3px' }}
                            title="Putar -90 Derajat"
                          >
                            <RotateCcw size={10} />
                            <span>-90°</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleUpdateBackgroundLayer(idx, { rotation: 0 })}
                            className="btn btn-secondary"
                            style={{ padding: '3px 6px', fontSize: '9px', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            title="Reset Sudut ke 0 Derajat"
                          >
                            <span>Reset (0°)</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleUpdateBackgroundLayer(idx, { rotation: ((layer.rotation || 0) + 90) % 360 })}
                            className="btn btn-secondary"
                            style={{ padding: '3px 6px', fontSize: '9px', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3px' }}
                            title="Putar +90 Derajat"
                          >
                            <RotateCw size={10} />
                            <span>+90°</span>
                          </button>
                        </div>

                        {/* Mirror Horizontal & Vertical Buttons */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <button
                            type="button"
                            onClick={() => handleUpdateBackgroundLayer(idx, { flipH: !layer.flipH })}
                            className="btn"
                            style={{
                              padding: '5px 8px',
                              fontSize: '9.5px',
                              flex: 1,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '4px',
                              background: layer.flipH ? 'rgba(56, 189, 248, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                              border: layer.flipH ? '1px solid #38BDF8' : '1px solid rgba(255, 255, 255, 0.1)',
                              color: layer.flipH ? '#38BDF8' : '#CBD5E1',
                              fontWeight: layer.flipH ? 700 : 500,
                            }}
                            title="Mirror Horizontal (Balik Kiri-Kanan)"
                          >
                            <FlipHorizontal size={12} />
                            <span>Mirror Horisontal {layer.flipH ? '✓' : ''}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleUpdateBackgroundLayer(idx, { flipV: !layer.flipV })}
                            className="btn"
                            style={{
                              padding: '5px 8px',
                              fontSize: '9.5px',
                              flex: 1,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '4px',
                              background: layer.flipV ? 'rgba(56, 189, 248, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                              border: layer.flipV ? '1px solid #38BDF8' : '1px solid rgba(255, 255, 255, 0.1)',
                              color: layer.flipV ? '#38BDF8' : '#CBD5E1',
                              fontWeight: layer.flipV ? 700 : 500,
                            }}
                            title="Mirror Vertikal (Balik Atas-Bawah)"
                          >
                            <FlipVertical size={12} />
                            <span>Mirror Vertikal {layer.flipV ? '✓' : ''}</span>
                          </button>
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
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '10px', width: '100%', boxSizing: 'border-box', overflow: 'hidden' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#94A3B8', display: 'block', marginBottom: '8px' }}>
                  ✨ Galeri Preset Background Cepat (1-Klik Tambah):
                </span>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '6px', width: '100%', boxSizing: 'border-box' }}>
                  {PRESET_BACKGROUND_LIBRARY.map((bg) => (
                    <button
                      key={bg.id}
                      onClick={() => handleAddBackgroundLayer(bg.url, bg.name)}
                      disabled={currentBgLayers.length >= 4}
                      className="btn"
                      style={{
                        padding: '5px 7px',
                        fontSize: '9.5px',
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        textAlign: 'left',
                        cursor: currentBgLayers.length >= 4 ? 'not-allowed' : 'pointer',
                        opacity: currentBgLayers.length >= 4 ? 0.5 : 1,
                        minWidth: 0,
                        width: '100%',
                        overflow: 'hidden',
                        boxSizing: 'border-box',
                      }}
                      title={`Tambahkan ${bg.name} sebagai background`}
                    >
                      <div
                        style={{
                          width: '16px',
                          height: '16px',
                          borderRadius: '4px',
                          background: bg.previewGradient,
                          flexShrink: 0,
                        }}
                      />
                      <span
                        style={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          color: '#F8FAFC',
                          minWidth: 0,
                          flex: 1,
                        }}
                      >
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
              Kontrol teks 2 untuk informasi di bagian bawah kanvas: Kartu Kegiatan SPMI & Lencana Tanggal Pelaksanaan beserta pengaturan ukuran font.
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

              {/* Event Card Title & Font Size */}
              <div style={{ marginBottom: '10px' }}>
                <label className="label-title">Nama Kegiatan</label>
                <input
                  type="text"
                  value={assets.eventCardTitle}
                  onChange={(e) => onUpdateProperty('eventCardTitle', e.target.value)}
                  className="input-control"
                  placeholder="Sistem Penjaminan Mutu Internal"
                  style={{ marginBottom: '6px' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#94A3B8', marginBottom: '2px' }}>
                  <span>Ukuran Tulisan Nama Kegiatan</span>
                  <span style={{ fontWeight: 700, color: '#FCD34D' }}>{assets.eventCardTitleFontSize || 13}px</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="24"
                  value={assets.eventCardTitleFontSize || 13}
                  onChange={(e) => onUpdateProperty('eventCardTitleFontSize', parseInt(e.target.value))}
                  style={{ width: '100%' }}
                />
              </div>

              {/* Event Card Subtitle & Font Size */}
              <div style={{ marginBottom: '10px' }}>
                <label className="label-title">Singkatan / Kode Kegiatan</label>
                <input
                  type="text"
                  value={assets.eventCardSubtitle}
                  onChange={(e) => onUpdateProperty('eventCardSubtitle', e.target.value)}
                  className="input-control"
                  placeholder="SPMI"
                  style={{ marginBottom: '6px' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#94A3B8', marginBottom: '2px' }}>
                  <span>Ukuran Tulisan Singkatan / Kode</span>
                  <span style={{ fontWeight: 700, color: '#FCD34D' }}>{assets.eventCardSubtitleFontSize || 18}px</span>
                </div>
                <input
                  type="range"
                  min="12"
                  max="36"
                  value={assets.eventCardSubtitleFontSize || 18}
                  onChange={(e) => onUpdateProperty('eventCardSubtitleFontSize', parseInt(e.target.value))}
                  style={{ width: '100%' }}
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
                  style={{ marginBottom: '6px' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#94A3B8', marginBottom: '2px' }}>
                  <span>Ukuran Tulisan Tanggal</span>
                  <span style={{ fontWeight: 700, color: '#38BDF8' }}>{assets.dateFontSize || 11}px</span>
                </div>
                <input
                  type="range"
                  min="9"
                  max="22"
                  value={assets.dateFontSize || 11}
                  onChange={(e) => onUpdateProperty('dateFontSize', parseInt(e.target.value))}
                  style={{ width: '100%' }}
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

        {/* TAB 4: SOCIAL MEDIA HANDLES (FOOTER) */}
        {activeTab === 'social' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ fontSize: '11px', color: '#94A3B8', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '6px' }}>
              Atur tampilan dan akun media sosial yang tampil pada pita kapsul di bagian bawah kanvas desain:
            </div>

            {/* Social Media Footer Bar Colors */}
            <div className="glass-panel" style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#38BDF8', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Share2 size={14} />
                <span>Pengaturan Warna Pita Media Sosial</span>
              </span>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <ColorPickerField
                  label="Warna Latar Pita"
                  value={assets.socialFooterBgColor || '#1D4ED8'}
                  onChange={(val) => onUpdateProperty('socialFooterBgColor', val)}
                  presetColors={['#1D4ED8', '#0F172A', '#065F46', '#991B1B', '#5B21B6', '#1E3A8A', '#0284C7']}
                />
                <ColorPickerField
                  label="Warna Teks & Ikon"
                  value={assets.socialFooterTextColor || '#FFFFFF'}
                  onChange={(val) => onUpdateProperty('socialFooterTextColor', val)}
                  presetColors={['#FFFFFF', '#FEF08A', '#E2E8F0', '#0F172A', '#FCD34D']}
                />
              </div>

              <div>
                <ColorPickerField
                  label="Warna Garis Tepi / Border Pita"
                  value={assets.socialFooterBorderColor || 'rgba(255, 255, 255, 0.22)'}
                  onChange={(val) => onUpdateProperty('socialFooterBorderColor', val)}
                  presetColors={['rgba(255, 255, 255, 0.25)', '#38BDF8', '#F59E0B', '#10B981', 'transparent']}
                />
              </div>

              {/* Mini Visual Preview of the Social Bar */}
              <div
                style={{
                  padding: '8px 12px',
                  borderRadius: '20px',
                  background: assets.socialFooterBgColor || '#1D4ED8',
                  border: `1.5px solid ${assets.socialFooterBorderColor || 'rgba(255, 255, 255, 0.22)'}`,
                  color: assets.socialFooterTextColor || '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-around',
                  fontSize: '10px',
                  fontWeight: 700,
                  marginTop: '4px',
                }}
              >
                <span>📷 {assets.socialHandles?.instagram || 'smkn1klk'}</span>
                <span>🌐 {assets.socialHandles?.website || 'smkn1klk.sch.id'}</span>
                <span>🎵 {assets.socialHandles?.tiktok || 'smkn1klungkung'}</span>
              </div>
            </div>

            {/* Handle Inputs */}
            <div className="glass-panel" style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#CBD5E1' }}>
                  Akun & URL Media Sosial:
                </span>
                <span style={{ fontSize: '10px', color: '#38BDF8', fontWeight: 600 }}>
                  Ukuran: {assets.socialFooterFontSize || 13}px
                </span>
              </div>

              {/* Ukuran Teks Media Sosial Slider & Presets */}
              <div
                style={{
                  padding: '8px 10px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(0, 0, 0, 0.25)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label className="label-title" style={{ marginBottom: 0, fontSize: '10.5px' }}>
                    <span>Ukuran Teks Media Sosial</span>
                  </label>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {[
                      { label: 'Kecil (11)', val: 11 },
                      { label: 'Sedang (13)', val: 13 },
                      { label: 'Besar (16)', val: 16 },
                      { label: 'Ekstra (18)', val: 18 },
                    ].map((sz) => (
                      <button
                        key={sz.val}
                        type="button"
                        onClick={() => onUpdateProperty('socialFooterFontSize', sz.val)}
                        style={{
                          padding: '2px 6px',
                          fontSize: '9.5px',
                          borderRadius: '4px',
                          background: (assets.socialFooterFontSize || 13) === sz.val ? 'rgba(56, 189, 248, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                          border: (assets.socialFooterFontSize || 13) === sz.val ? '1px solid #38BDF8' : '1px solid rgba(255, 255, 255, 0.1)',
                          color: (assets.socialFooterFontSize || 13) === sz.val ? '#38BDF8' : '#CBD5E1',
                          cursor: 'pointer',
                        }}
                      >
                        {sz.label}
                      </button>
                    ))}
                  </div>
                </div>
                <input
                  type="range"
                  min="9"
                  max="24"
                  step="1"
                  value={assets.socialFooterFontSize || 13}
                  onChange={(e) => onUpdateProperty('socialFooterFontSize', parseInt(e.target.value))}
                />
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
            </div>
          </div>
        )}

        {/* TAB 6: GEMINI AI & REKOMENDASI DESAIN */}
        {activeTab === 'gemini' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Header Gemini Assistant Hero */}
            <div
              className="glass-panel"
              style={{
                padding: '14px',
                border: '1px solid rgba(56, 189, 248, 0.35)',
                background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.12) 0%, rgba(139, 92, 246, 0.15) 100%)',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '7px',
                    background: 'linear-gradient(135deg, #06B6D4, #8B5CF6)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Sparkles size={16} color="#FFFFFF" />
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#F8FAFC' }}>
                    Google Gemini AI Studio
                  </div>
                  <div style={{ fontSize: '10px', color: '#94A3B8' }}>
                    Model resmi, Prompt Generator & Vision Critic
                  </div>
                </div>
              </div>

              <p style={{ fontSize: '11px', color: '#CBD5E1', lineHeight: '1.4', margin: 0 }}>
                Gunakan kecerdasan buatan Google Gemini untuk merumuskan judul acara, kartu SPMI, dan kritik visual desain secara otomatis.
              </p>

              <button
                onClick={onOpenGeminiAI}
                className="btn btn-primary"
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  fontSize: '11.5px',
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #06B6D4 0%, #3B82F6 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  boxShadow: '0 4px 12px rgba(6, 182, 212, 0.25)',
                }}
              >
                <Sparkles size={14} />
                <span>Buka Google Gemini Studio</span>
              </button>
            </div>

            {/* AI Design Recommendations Section */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#38BDF8', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Zap size={14} />
                  <span>Rekomendasi Cerdas AI</span>
                </span>
                <button
                  type="button"
                  onClick={() => setActiveTab('database')}
                  className="btn"
                  style={{
                    fontSize: '9.5px',
                    color: '#FCD34D',
                    padding: '3px 8px',
                    background: 'rgba(252, 211, 77, 0.1)',
                    border: '1px solid rgba(252, 211, 77, 0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                  title="Lihat atau gunakan isian yang tersimpan di Database"
                >
                  <Database size={11} />
                  <span>Isian Database</span>
                </button>
              </div>

              {/* Online AI Recommendation Button */}
              <button
                type="button"
                onClick={() => {
                  if (onOpenGeminiAI) onOpenGeminiAI();
                }}
                className="btn btn-primary"
                style={{
                  width: '100%',
                  padding: '7px 12px',
                  fontSize: '11px',
                  fontWeight: 700,
                  marginBottom: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  background: 'linear-gradient(135deg, #06B6D4 0%, #3B82F6 50%, #8B5CF6 100%)',
                  boxShadow: '0 4px 14px rgba(6, 182, 212, 0.3)',
                  borderRadius: '8px',
                }}
                title="Generate rekomendasi desain baru secara online menggunakan Google Gemini API Key"
              >
                <Sparkles size={13} />
                <span>Minta Rekomendasi AI Online (Google Gemini)</span>
              </button>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {AI_DESIGN_RECOMMENDATIONS.map((rec) => (
                  <div
                    key={rec.id}
                    className="glass-panel"
                    style={{
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      background: 'rgba(15, 23, 42, 0.55)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span
                        style={{
                          fontSize: '9px',
                          fontWeight: 800,
                          padding: '2px 6px',
                          borderRadius: '999px',
                          background: 'rgba(56, 189, 248, 0.18)',
                          color: '#38BDF8',
                          border: '1px solid rgba(56, 189, 248, 0.35)',
                        }}
                      >
                        {rec.badge}
                      </span>
                      <span style={{ fontSize: '10px', color: '#64748B' }}>{rec.category}</span>
                    </div>

                    <div>
                      <div style={{ fontSize: '12px', fontWeight: 700, color: '#F1F5F9' }}>
                        {rec.title}
                      </div>
                      <div style={{ fontSize: '10.5px', color: '#94A3B8', marginTop: '2px', lineHeight: '1.3' }}>
                        {rec.description}
                      </div>
                    </div>

                    {/* Palette Swatches */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <span style={{ fontSize: '10px', color: '#64748B' }}>Palet:</span>
                      {rec.previewColors.map((color, i) => (
                        <span
                          key={i}
                          style={{
                            width: '14px',
                            height: '14px',
                            borderRadius: '50%',
                            backgroundColor: color,
                            border: '1px solid rgba(255,255,255,0.25)',
                            display: 'inline-block',
                          }}
                          title={color}
                        />
                      ))}
                    </div>

                    {/* Dual Action: Apply AI directly or Save to Database */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: '6px' }}>
                      <button
                        onClick={() => handleApplyRecInPanel(rec)}
                        className="btn btn-secondary"
                        style={{
                          padding: '6px 8px',
                          fontSize: '10.5px',
                          fontWeight: 700,
                          background: 'rgba(56, 189, 248, 0.1)',
                          borderColor: 'rgba(56, 189, 248, 0.3)',
                          color: '#38BDF8',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '5px',
                        }}
                        title="Terapkan konfigurasi AI langsung ke kanvas"
                      >
                        <Check size={12} />
                        <span>Terapkan AI</span>
                      </button>

                      <button
                        onClick={() => handleSaveRecToDatabase(rec)}
                        className="btn"
                        style={{
                          padding: '6px 8px',
                          fontSize: '10px',
                          fontWeight: 600,
                          background: 'rgba(252, 211, 77, 0.1)',
                          borderColor: 'rgba(252, 211, 77, 0.25)',
                          color: '#FCD34D',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '4px',
                        }}
                        title="Simpan preset rekomendasi AI ini ke database lokal"
                      >
                        <Save size={11} />
                        <span>Ke Database</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
