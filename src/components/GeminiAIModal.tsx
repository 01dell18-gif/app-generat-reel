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

  // Load API key from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedKey = localStorage.getItem('GEMINI_API_KEY') || '';
      const savedModel = localStorage.getItem('GEMINI_MODEL') || 'gemini-1.5-flash';
      setApiKey(savedKey);
      setSelectedModel(savedModel);
    }
  }, []);

  // Save API key
  const handleSaveSettings = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('GEMINI_API_KEY', apiKey);
      localStorage.setItem('GEMINI_MODEL', selectedModel);
    }
    testConnection();
  };

  // Test Connection
  const testConnection = async () => {
    if (!apiKey) {
      setConnectionStatus('error');
      setStatusMessage('Silakan masukkan Google Gemini API Key terlebih dahulu.');
      return;
    }

    setConnectionStatus('testing');
    setStatusMessage('Menghubungkan ke server Google Gemini AI...');

    try {
      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiKey,
          model: selectedModel,
          temperature: 0.2,
          action: 'generate_design',
          prompt: 'Tes Koneksi Singkat',
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setConnectionStatus('success');
        setStatusMessage('Terhubung Berhasil! Google Gemini AI siap digunakan.');
      } else {
        setConnectionStatus('error');
        setStatusMessage(data.error || 'Gagal terhubung ke Gemini API.');
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
              {/* API Key */}
              <div>
                <label className="label-title">
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Key size={13} />
                    <span>Google Gemini API Key</span>
                  </span>
                  <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noreferrer"
                    style={{ fontSize: '11px', color: '#38BDF8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '3px' }}
                  >
                    <span>Dapatkan API Key Gratis</span>
                    <ExternalLink size={11} />
                  </a>
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type={showKey ? 'text' : 'password'}
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="AIzaSy..."
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
              </div>

              {/* Model Selection */}
              <div>
                <label className="label-title">Model Google Gemini</label>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="input-control"
                  style={{ cursor: 'pointer' }}
                >
                  <option value="gemini-1.5-flash">gemini-1.5-flash (Cepat, Hemat & Multimodal Vision)</option>
                  <option value="gemini-1.5-pro">gemini-1.5-pro (Penalaran Kompleks & Estetika Tinggi)</option>
                  <option value="gemini-2.0-flash">gemini-2.0-flash (Generasi Terbaru)</option>
                </select>
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
                <div style={{ fontSize: '11px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {connectionStatus === 'success' && <CheckCircle2 size={14} color="#10B981" />}
                  {connectionStatus === 'error' && <AlertCircle size={14} color="#F43F5E" />}
                  <span style={{ color: connectionStatus === 'success' ? '#10B981' : connectionStatus === 'error' ? '#F43F5E' : '#94A3B8' }}>
                    {statusMessage || 'Kunci API tersimpan di browser.'}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={testConnection} className="btn btn-secondary" style={{ padding: '8px 12px', fontSize: '12px' }}>
                    Uji Koneksi
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
