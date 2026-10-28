'use client';

import React, { useState, useEffect } from 'react';
import { AssetInputs } from '@/types/design';
import {
  Sparkles,
  Settings,
  Eye,
  Wand2,
  CheckCircle2,
  AlertCircle,
  Key,
  Sliders,
  X,
  ExternalLink,
  RefreshCw,
  Send,
  Zap,
} from 'lucide-react';

interface GeminiAIModalProps {
  isOpen: boolean;
  onClose: () => void;
  assets: AssetInputs;
  onApplyGeneratedAssets: (updates: Partial<AssetInputs>) => void;
  onApplyVisionCriticResult?: (result: any) => void;
}

interface GeminiModelOption {
  id: string;
  displayName: string;
  description?: string;
}

export const GeminiAIModal: React.FC<GeminiAIModalProps> = ({
  isOpen,
  onClose,
  assets,
  onApplyGeneratedAssets,
  onApplyVisionCriticResult,
}) => {
  const [activeTab, setActiveTab] = useState<'generate' | 'vision' | 'settings'>('generate');

  // Gemini Settings State (stored in localStorage)
  const [apiKey, setApiKey] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState<string>('gemini-1.5-flash');
  const [availableModels, setAvailableModels] = useState<GeminiModelOption[]>([]);
  const [temperature, setTemperature] = useState<number>(0.7);
  const [tone, setTone] = useState<string>('formal');
  const [showKey, setShowKey] = useState<boolean>(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState<string>('');

  // Generation Prompt State
  const [promptTopic, setPromptTopic] = useState<string>(
    'Peringatan Hari Pahlawan 10 November & Peningkatan Mutu Vokasi'
  );
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationResult, setGenerationResult] = useState<any>(null);

  // Multimodal Vision Critic State
  const [isAnalyzingVision, setIsAnalyzingVision] = useState<boolean>(false);
  const [visionReport, setVisionReport] = useState<any>(null);

  // Load API key & cached models from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedKey = (localStorage.getItem('GEMINI_API_KEY') || '').trim();
      const savedModel = (localStorage.getItem('GEMINI_MODEL') || 'gemini-1.5-flash').trim();
      const savedModelsJson = localStorage.getItem('GEMINI_AVAILABLE_MODELS');
      
      setApiKey(savedKey);
      setSelectedModel(savedModel);

      if (savedModelsJson) {
        try {
          const parsed = JSON.parse(savedModelsJson);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setAvailableModels(parsed);
            setConnectionStatus('success');
            setStatusMessage(`Terkoneksi dengan ${parsed.length} model resmi dari Google.`);
          }
        } catch {
          // Ignore JSON parse error
        }
      }

      // If key is present but models are not loaded, connect automatically
      if (savedKey && !savedModelsJson) {
        testConnection(savedKey);
      }
    }
  }, []);

  // Save API key and trigger test connection
  const handleSaveSettings = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('GEMINI_API_KEY', apiKey.trim());
      localStorage.setItem('GEMINI_MODEL', selectedModel);
    }
    testConnection(apiKey.trim());
  };

  // Test Connection & Auto-Fetch Supported Models from Google for this Key
  const testConnection = async (customKey?: string) => {
    const key = (customKey !== undefined ? customKey : apiKey).trim();
    if (!key) {
      setConnectionStatus('error');
      setStatusMessage('Silakan masukkan Google Gemini API Key Anda terlebih dahulu.');
      return;
    }

    setConnectionStatus('testing');
    setStatusMessage('Menghubungi Google Gemini API & mengambil model yang kompatibel...');

    try {
      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiKey: key,
          action: 'test_connection',
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setConnectionStatus('success');
        
        const models: GeminiModelOption[] = (data.availableModels || []).map((m: any) =>
          typeof m === 'string' ? { id: m, displayName: m } : m
        );

        setAvailableModels(models);

        // Auto-select recommended model (e.g. gemini-1.5-flash) or fallback to first
        const recModel = data.recommendedModel || (models[0]?.id ?? 'gemini-1.5-flash');
        setSelectedModel(recModel);

        if (typeof window !== 'undefined') {
          localStorage.setItem('GEMINI_API_KEY', key);
          localStorage.setItem('GEMINI_MODEL', recModel);
          localStorage.setItem('GEMINI_AVAILABLE_MODELS', JSON.stringify(models));
        }

        setStatusMessage(
          `✓ Terhubung Sukses! Berhasil memuat ${models.length} model resmi dari API Key Anda. Model otomatis disesuaikan ke '${recModel}'.`
        );
      } else {
        setConnectionStatus('error');
        setStatusMessage(data.error || 'Gagal terhubung ke Google Gemini API. Pastikan API Key valid.');
      }
    } catch (e: any) {
      setConnectionStatus('error');
      setStatusMessage(`Koneksi gagal: ${e.message}`);
    }
  };

  // Trigger Gemini AI Generation for Content & Layout
  const handleGenerateContent = async () => {
    setIsGenerating(true);
    setGenerationResult(null);

    try {
      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiKey,
          model: selectedModel,
          temperature,
          action: 'generate_design',
          prompt: `${promptTopic} (Gaya Tone: ${tone})`,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setGenerationResult(data.result);
      } else {
        alert(data.error || 'Gagal generate dengan Gemini AI. Periksa API Key di Pengaturan.');
      }
    } catch (e: any) {
      alert(`Terjadi kesalahan: ${e.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  // Apply Generated Content to Canvas
  const handleApplyToCanvas = () => {
    if (!generationResult) return;

    onApplyGeneratedAssets({
      topPillText: generationResult.topPillText || assets.topPillText,
      topPillBgColor: generationResult.topPillBgColor || assets.topPillBgColor,
      topPillTextColor: generationResult.topPillTextColor || assets.topPillTextColor,
      eventCardTitle: generationResult.eventCardTitle || assets.eventCardTitle,
      eventCardSubtitle: generationResult.eventCardSubtitle || assets.eventCardSubtitle,
      eventCardBorderColor: generationResult.eventCardBorderColor || assets.eventCardBorderColor,
      dateText: generationResult.dateText || assets.dateText,
      dateBgColor: generationResult.dateBgColor || assets.dateBgColor,
      headlineText: generationResult.headlineText || assets.headlineText,
      subtitleText: generationResult.subtitleText || assets.subtitleText,
      showTopPill: true,
      showEventCard: true,
    });

    onClose();
  };

  // Trigger Multimodal Vision Critique
  const handleRunVisionCritique = async () => {
    setIsAnalyzingVision(true);
    setVisionReport(null);

    try {
      const canvas = document.getElementById('main-interactive-canvas') as HTMLCanvasElement;
      if (!canvas) {
        alert('Kanvas tidak ditemukan.');
        return;
      }

      const canvasImageBase64 = canvas.toDataURL('image/png');

      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiKey,
          model: selectedModel,
          action: 'vision_critique',
          canvasImageBase64,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setVisionReport(data.result);
      } else {
        alert(data.error || 'Gagal menjalankan analisis Gemini Vision.');
      }
    } catch (e: any) {
      alert(`Gagal memindai gambar: ${e.message}`);
    } finally {
      setIsAnalyzingVision(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '680px',
          maxHeight: '90vh',
          backgroundColor: '#0A101F',
          border: '1px solid rgba(56, 189, 248, 0.3)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 30px rgba(6, 182, 212, 0.2)',
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '16px 22px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'linear-gradient(90deg, rgba(56, 189, 248, 0.12) 0%, rgba(139, 92, 246, 0.12) 100%)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #06B6D4, #8B5CF6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Sparkles size={18} color="#FFFFFF" />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '15px', color: '#F8FAFC' }}>
                Google Gemini AI Studio
              </div>
              <div style={{ fontSize: '11px', color: '#94A3B8' }}>
                Generasi Konten Otomatis & Analisis Desain Multimodal Vision
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#94A3B8',
              cursor: 'pointer',
              padding: '6px',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Tabs */}
        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
          }}
        >
          <button
            onClick={() => setActiveTab('generate')}
            style={{
              flex: 1,
              padding: '12px',
              fontSize: '12px',
              fontWeight: 700,
              background: 'none',
              border: 'none',
              color: activeTab === 'generate' ? '#38BDF8' : '#94A3B8',
              borderBottom: activeTab === 'generate' ? '2px solid #38BDF8' : '2px solid transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}
          >
            <Wand2 size={14} />
            <span>Generate Desain AI</span>
          </button>

          <button
            onClick={() => setActiveTab('vision')}
            style={{
              flex: 1,
              padding: '12px',
              fontSize: '12px',
              fontWeight: 700,
              background: 'none',
              border: 'none',
              color: activeTab === 'vision' ? '#38BDF8' : '#94A3B8',
              borderBottom: activeTab === 'vision' ? '2px solid #38BDF8' : '2px solid transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}
          >
            <Eye size={14} />
            <span>Gemini Vision Critic</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            style={{
              flex: 1,
              padding: '12px',
              fontSize: '12px',
              fontWeight: 700,
              background: 'none',
              border: 'none',
              color: activeTab === 'settings' ? '#38BDF8' : '#94A3B8',
              borderBottom: activeTab === 'settings' ? '2px solid #38BDF8' : '2px solid transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}
          >
            <Settings size={14} />
            <span>Pengaturan API & Parameter</span>
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* TAB 1: GENERATE DESAIN DENGAN GEMINI */}
          {activeTab === 'generate' && (
            <>
              {/* Connection Status Indicator Banner */}
              {connectionStatus === 'success' ? (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    background: 'rgba(16, 185, 129, 0.1)',
                    border: '1px solid rgba(16, 185, 129, 0.25)',
                    fontSize: '11px',
                    color: '#6EE7B7',
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle2 size={13} color="#10B981" />
                    <span>Model Terkoneksi: <strong>{selectedModel}</strong></span>
                  </span>
                  <button
                    onClick={() => setActiveTab('settings')}
                    style={{ background: 'none', border: 'none', color: '#38BDF8', fontSize: '11px', cursor: 'pointer', textDecoration: 'underline' }}
                  >
                    Ganti Model / API Key
                  </button>
                </div>
              ) : (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    background: 'rgba(245, 158, 11, 0.12)',
                    border: '1px solid rgba(245, 158, 11, 0.3)',
                    fontSize: '12px',
                    color: '#FDE68A',
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <AlertCircle size={15} color="#F59E0B" />
                    <span>Google Gemini API Key belum terhubung.</span>
                  </span>
                  <button
                    onClick={() => setActiveTab('settings')}
                    className="btn btn-secondary"
                    style={{ padding: '4px 10px', fontSize: '11px', borderColor: '#F59E0B', color: '#FCD34D' }}
                  >
                    Hubungkan Sekarang
                  </button>
                </div>
              )}

              <div>
                <label className="label-title">
                  <span>Tema / Topik Acara yang Ingin Dibuat</span>
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    value={promptTopic}
                    onChange={(e) => setPromptTopic(e.target.value)}
                    placeholder="Contoh: Peringatan Hari Guru Nasional 2026 atau Workshop SPMI"
                    className="input-control"
                    style={{ fontSize: '13px' }}
                  />
                  <button
                    onClick={handleGenerateContent}
                    disabled={isGenerating}
                    className="btn btn-primary"
                    style={{ padding: '0 18px', whiteSpace: 'nowrap' }}
                  >
                    {isGenerating ? <RefreshCw size={15} className="spin" /> : <Zap size={15} />}
                    <span>{isGenerating ? 'Memproses...' : 'Generate AI'}</span>
                  </button>
                </div>
              </div>

              {/* Quick Prompt Ideas */}
              <div>
                <span style={{ fontSize: '11px', color: '#94A3B8', marginBottom: '6px', display: 'block' }}>
                  Atau pilih contoh ide tema cepat:
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {[
                    'Peringatan Hari Pahlawan 10 November',
                    'Hari Guru Nasional 2026',
                    'Audit & Akreditasi SPMI Sekolah',
                    'Dies Natalis & Gebyar Vokasi SMK',
                    'Pelepasan Siswa Lulusan 2026',
                  ].map((idea) => (
                    <button
                      key={idea}
                      onClick={() => setPromptTopic(idea)}
                      className="glass-pill"
                      style={{
                        padding: '4px 10px',
                        fontSize: '11px',
                        color: '#CBD5E1',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        cursor: 'pointer',
                        background: 'rgba(255, 255, 255, 0.04)',
                      }}
                    >
                      {idea}
                    </button>
                  ))}
                </div>
              </div>

              {/* Generation Result Display */}
              {generationResult && (
                <div
                  className="glass-panel"
                  style={{
                    padding: '16px',
                    border: '1px solid rgba(16, 185, 129, 0.4)',
                    background: 'rgba(16, 185, 129, 0.04)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10B981', fontWeight: 700, fontSize: '13px' }}>
                      <CheckCircle2 size={16} />
                      <span>Rekomendasi AI Selesai Dibuat</span>
                    </div>
                    <button onClick={handleApplyToCanvas} className="btn btn-autofix" style={{ padding: '6px 14px', fontSize: '12px' }}>
                      <Wand2 size={13} />
                      <span>Terapkan ke Kanvas</span>
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '12px' }}>
                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '8px' }}>
                      <span style={{ color: '#94A3B8', fontSize: '10px' }}>Banner Atas:</span>
                      <div style={{ fontWeight: 700, color: '#86EFAC', marginTop: '2px' }}>
                        {generationResult.topPillText}
                      </div>
                    </div>

                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '8px' }}>
                      <span style={{ color: '#94A3B8', fontSize: '10px' }}>Kartu Kegiatan (SPMI):</span>
                      <div style={{ fontWeight: 700, color: '#FCD34D', marginTop: '2px' }}>
                        {generationResult.eventCardTitle} ({generationResult.eventCardSubtitle})
                      </div>
                    </div>

                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '8px' }}>
                      <span style={{ color: '#94A3B8', fontSize: '10px' }}>Tanggal:</span>
                      <div style={{ fontWeight: 700, color: '#38BDF8', marginTop: '2px' }}>
                        {generationResult.dateText}
                      </div>
                    </div>

                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '8px' }}>
                      <span style={{ color: '#94A3B8', fontSize: '10px' }}>Judul Informasi:</span>
                      <div style={{ fontWeight: 700, color: '#F8FAFC', marginTop: '2px' }}>
                        {generationResult.headlineText}
                      </div>
                    </div>
                  </div>

                  {generationResult.reasoning && (
                    <div style={{ fontSize: '11px', color: '#94A3B8', fontStyle: 'italic', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '8px' }}>
                      💡 {generationResult.reasoning}
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {/* TAB 2: MULTIMODAL VISION CRITIC */}
          {activeTab === 'vision' && (
            <>
              <div style={{ fontSize: '12px', color: '#CBD5E1', lineHeight: '1.5' }}>
                Kirim tangkapan gambar kanvas aktif saat ini ke <strong>Google Gemini Multimodal Vision</strong> untuk mendeteksi tumpang tindih elemen, posisi foto subjek, dan kejelasan tipografi.
              </div>

              <button
                onClick={handleRunVisionCritique}
                disabled={isAnalyzingVision}
                className="btn btn-primary"
                style={{ width: '100%', padding: '12px' }}
              >
                {isAnalyzingVision ? <RefreshCw size={16} className="spin" /> : <Eye size={16} />}
                <span>{isAnalyzingVision ? 'Gemini Vision Sedang Memeriksa Gambar...' : 'Pindai Desain Kanvas Sekarang'}</span>
              </button>

              {visionReport && (
                <div className="glass-panel" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 800, fontSize: '14px', color: '#38BDF8' }}>
                      Skor Visual Gemini: {visionReport.overall_score}/100
                    </span>
                  </div>

                  <div style={{ fontSize: '12px', color: '#CBD5E1', lineHeight: '1.5', background: 'rgba(0,0,0,0.25)', padding: '10px', borderRadius: '8px' }}>
                    {visionReport.visual_critique_summary}
                  </div>

                  {visionReport.issues && visionReport.issues.length > 0 && (
                    <div>
                      <div style={{ fontSize: '11px', fontWeight: 700, color: '#94A3B8', marginBottom: '6px' }}>
                        Temuan Visual:
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {visionReport.issues.map((iss: any, idx: number) => (
                          <div key={idx} style={{ background: 'rgba(255,255,255,0.03)', padding: '8px 12px', borderRadius: '6px', fontSize: '11px', borderLeft: '3px solid #F59E0B' }}>
                            <div style={{ fontWeight: 700, color: '#FCD34D' }}>{iss.issue_id}</div>
                            <div style={{ color: '#CBD5E1' }}>{iss.description}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {/* TAB 3: PENGATURAN API & PARAMETER */}
          {activeTab === 'settings' && (
            <>
              {/* API Key Box */}
              <div className="glass-panel" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label className="label-title" style={{ marginBottom: 0 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Key size={14} color="#38BDF8" />
                      <span style={{ fontWeight: 800 }}>Google Gemini API Key</span>
                    </span>
                  </label>
                  <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noreferrer"
                    style={{ fontSize: '11px', color: '#38BDF8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <span>Dapatkan API Key Gratis</span>
                    <ExternalLink size={12} />
                  </a>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type={showKey ? 'text' : 'password'}
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Masukkan API Key (contoh: AIzaSy...)"
                    className="input-control"
                    style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}
                  />
                  <button
                    onClick={() => setShowKey(!showKey)}
                    className="btn btn-secondary"
                    style={{ padding: '0 12px', fontSize: '11px' }}
                  >
                    {showKey ? 'Tutup' : 'Lihat'}
                  </button>
                </div>

                {/* Primary Action Button: Connect and Fetch Models */}
                <button
                  onClick={() => testConnection()}
                  disabled={connectionStatus === 'testing' || !apiKey.trim()}
                  className="btn btn-primary"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    fontSize: '12px',
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, #06B6D4 0%, #3B82F6 100%)',
                    cursor: connectionStatus === 'testing' || !apiKey.trim() ? 'not-allowed' : 'pointer',
                    opacity: !apiKey.trim() ? 0.6 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                  }}
                >
                  {connectionStatus === 'testing' ? (
                    <RefreshCw size={14} className="spin" />
                  ) : (
                    <Zap size={14} />
                  )}
                  <span>
                    {connectionStatus === 'testing'
                      ? 'Sedang Menghubungkan & Memindai Model Gemini...'
                      : '⚡ Hubungkan API Key & Ambil Model Gemini'}
                  </span>
                </button>

                {/* Connection Status Banner */}
                {connectionStatus !== 'idle' && (
                  <div
                    style={{
                      padding: '10px 12px',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '8px',
                      fontSize: '11.5px',
                      lineHeight: '1.45',
                      background:
                        connectionStatus === 'success'
                          ? 'rgba(16, 185, 129, 0.12)'
                          : connectionStatus === 'error'
                          ? 'rgba(244, 63, 94, 0.12)'
                          : 'rgba(56, 189, 248, 0.1)',
                      border:
                        connectionStatus === 'success'
                          ? '1px solid rgba(16, 185, 129, 0.35)'
                          : connectionStatus === 'error'
                          ? '1px solid rgba(244, 63, 94, 0.35)'
                          : '1px solid rgba(56, 189, 248, 0.3)',
                      color:
                        connectionStatus === 'success'
                          ? '#6EE7B7'
                          : connectionStatus === 'error'
                          ? '#FDA4AF'
                          : '#BAE6FD',
                    }}
                  >
                    {connectionStatus === 'testing' && <RefreshCw size={15} className="spin" style={{ flexShrink: 0, marginTop: '2px' }} />}
                    {connectionStatus === 'success' && <CheckCircle2 size={15} color="#10B981" style={{ flexShrink: 0, marginTop: '2px' }} />}
                    {connectionStatus === 'error' && <AlertCircle size={15} color="#F43F5E" style={{ flexShrink: 0, marginTop: '2px' }} />}
                    <div>{statusMessage}</div>
                  </div>
                )}
              </div>

              {/* Dynamic Model Selection */}
              <div className="glass-panel" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label className="label-title" style={{ marginBottom: 0 }}>
                    <span style={{ fontWeight: 800 }}>Model Google Gemini</span>
                    {availableModels.length > 0 && (
                      <span style={{ fontSize: '10px', color: '#10B981', background: 'rgba(16, 185, 129, 0.15)', padding: '2px 6px', borderRadius: '4px', marginLeft: '6px' }}>
                        {availableModels.length} Model Resmi Ditemukan
                      </span>
                    )}
                  </label>
                  {apiKey && (
                    <button
                      onClick={() => testConnection()}
                      disabled={connectionStatus === 'testing'}
                      className="btn btn-secondary"
                      style={{ padding: '3px 8px', fontSize: '10px', color: '#38BDF8', borderColor: 'rgba(56, 189, 248, 0.4)' }}
                      title="Perbarui daftar model dari API Key"
                    >
                      <RefreshCw size={11} className={connectionStatus === 'testing' ? 'spin' : ''} />
                      <span>Segarkan Model</span>
                    </button>
                  )}
                </div>

                <select
                  value={selectedModel}
                  onChange={(e) => {
                    setSelectedModel(e.target.value);
                    if (typeof window !== 'undefined') {
                      localStorage.setItem('GEMINI_MODEL', e.target.value);
                    }
                  }}
                  className="input-control"
                  style={{ cursor: 'pointer', fontSize: '12px', padding: '8px 10px' }}
                >
                  {availableModels.length > 0 ? (
                    availableModels.map((m) => {
                      const isFlash = m.id === 'gemini-1.5-flash';
                      const isPro = m.id === 'gemini-1.5-pro';
                      const is20Flash = m.id === 'gemini-2.0-flash';
                      let badge = '';
                      if (isFlash) badge = '⭐ [Direkomendasikan - Kuota Gratis & Cepat]';
                      else if (is20Flash) badge = '⚡ [Generasi Terbaru]';
                      else if (isPro) badge = '🧠 [Penalaran Kompleks]';

                      return (
                        <option key={m.id} value={m.id} style={{ background: '#0F172A', color: '#F8FAFC' }}>
                          {m.displayName || m.id} ({m.id}) {badge}
                        </option>
                      );
                    })
                  ) : (
                    <>
                      <option value="gemini-1.5-flash">⭐ gemini-1.5-flash (Direkomendasikan - Kuota Gratis & Multimodal)</option>
                      <option value="gemini-2.0-flash">⚡ gemini-2.0-flash (Generasi Terbaru - Super Cepat)</option>
                      <option value="gemini-1.5-pro">🧠 gemini-1.5-pro (Penalaran Kompleks & Estetika Tinggi)</option>
                      <option value="gemini-1.5-flash-8b">🚀 gemini-1.5-flash-8b (Ultra Ringan & Respons Cepat)</option>
                    </>
                  )}
                </select>

                <div
                  style={{
                    padding: '10px 12px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(56, 189, 248, 0.06)',
                    border: '1px solid rgba(56, 189, 248, 0.2)',
                    fontSize: '11px',
                    lineHeight: '1.5',
                    color: '#BAE6FD',
                  }}
                >
                  <div style={{ fontWeight: 700, color: '#38BDF8', marginBottom: '3px' }}>
                    💡 Informasi Model & API Key:
                  </div>
                  Model yang tampil disinkronkan secara langsung dengan izin API Key Anda. Model <strong>gemini-1.5-flash</strong> otomatis dipilih sebagai rekomendasi utama karena memiliki latensi tercepat, mendukung analisis multimodal gambar kanvas, dan kuota gratis harian paling melimpah di Google AI Studio.
                </div>
              </div>

              {/* Temperature Parameter Slider */}
              <div>
                <label className="label-title">
                  <span>Tingkat Kreativitas / Temperature ({temperature})</span>
                  <span style={{ fontSize: '10px', color: '#94A3B8' }}>
                    {temperature <= 0.3 ? 'Presisi & Formal' : temperature <= 0.7 ? 'Seimbang' : 'Sangat Kreatif'}
                  </span>
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.05"
                  value={temperature}
                  onChange={(e) => setTemperature(parseFloat(e.target.value))}
                />
              </div>

              {/* Tone Gaya Bahasa */}
              <div>
                <label className="label-title">Gaya Bahasa (Tone) Desain</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                  {[
                    { id: 'formal', label: 'Formal Sekolah' },
                    { id: 'vokasi', label: 'Semangat Vokasi' },
                    { id: 'prestasi', label: 'Inspiratif & Bangga' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setTone(t.id)}
                      className="btn"
                      style={{
                        padding: '8px',
                        fontSize: '11px',
                        background: tone === t.id ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                        color: tone === t.id ? '#38BDF8' : '#94A3B8',
                        border: tone === t.id ? '1px solid #38BDF8' : '1px solid rgba(255, 255, 255, 0.1)',
                      }}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Connection Status & Save Button */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ fontSize: '11px', color: '#94A3B8' }}>
                  *Setelan dan API Key otomatis tersimpan di browser Anda.
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => testConnection()} className="btn btn-secondary" style={{ padding: '8px 12px', fontSize: '12px' }}>
                    Uji Ulang Koneksi
                  </button>
                  <button onClick={handleSaveSettings} className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '12px' }}>
                    Simpan Pengaturan
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
