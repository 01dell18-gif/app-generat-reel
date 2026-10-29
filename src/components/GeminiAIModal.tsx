'use client';

import React, { useState, useEffect } from 'react';
import { AssetInputs } from '@/types/design';
import { dbSaveProject } from '@/lib/asset-database';
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
  Save,
  Database,
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

export interface AIDesignPreset {
  id: string;
  badge: string;
  title: string;
  description: string;
  category: string;
  previewColors: string[];
  updates: Partial<AssetInputs>;
}

export const AI_DESIGN_RECOMMENDATIONS: AIDesignPreset[] = [
  {
    id: 'rec_spmi_official',
    badge: '⭐ REKOMENDASI UTAMA',
    title: 'Resmi SPMI & Penjaminan Mutu Internal',
    description: 'Kombinasi hijau zamrud dan emas amber yang memancarkan wibawa institusi, integritas akreditasi, dan keterbacaan tinggi.',
    category: 'Akreditasi & SPMI',
    previewColors: ['#05472A', '#86EFAC', '#F59E0B', '#1D4ED8', '#1E3A8A'],
    updates: {
      topPillText: 'SISTEM PENJAMINAN MUTU INTERNAL 2026',
      topPillBgColor: '#05472A',
      topPillTextColor: '#86EFAC',
      eventCardTitle: 'Sistem Penjaminan Mutu Internal',
      eventCardTitleFontSize: 13,
      eventCardSubtitle: 'SPMI',
      eventCardSubtitleFontSize: 18,
      eventCardBorderColor: '#B45309',
      dateText: '18 September 2026',
      dateFontSize: 11,
      dateBgColor: '#1D4ED8',
      dateColor: '#FFFFFF',
      headlineText: 'PENINGKATAN MUTU DAN KUALITAS PENDIDIKAN VOKASI',
      headlineColor: '#064E3B',
      subtitleText: 'Mewujudkan Generasi Unggul Berkarakter Pancasila & Siap Kerja',
      subtitleColor: '#1E293B',
      socialFooterBgColor: '#1D4ED8',
      socialFooterTextColor: '#FFFFFF',
      socialFooterBorderColor: 'rgba(255, 255, 255, 0.22)',
      showTopPill: true,
      showEventCard: true,
    },
  },
  {
    id: 'rec_pahlawan_vokasi',
    badge: '🔥 ENERGETIK & PATRIOTIK',
    title: 'Semangat Vokasi SMK & Hari Pahlawan',
    description: 'Palet merah marun berani dan emas kejayaan untuk peringatan hari nasional, lomba kompetensi siswa, dan prestasi vokasi.',
    category: 'Peringatan Nasional & Prestasi',
    previewColors: ['#831843', '#FECACA', '#D97706', '#DC2626', '#7F1D1D'],
    updates: {
      topPillText: 'MEMPERINGATI HARI PAHLAWAN NASIONAL 2026',
      topPillBgColor: '#831843',
      topPillTextColor: '#FECACA',
      eventCardTitle: 'Semangat Patriotisme & Inovasi Vokasi',
      eventCardTitleFontSize: 13,
      eventCardSubtitle: 'SMK BISA - SMK HEBAT',
      eventCardSubtitleFontSize: 18,
      eventCardBorderColor: '#D97706',
      dateText: '10 November 2026',
      dateFontSize: 11,
      dateBgColor: '#DC2626',
      dateColor: '#FFFFFF',
      headlineText: 'PAHLAWANKU TELADANKU, VOKASI UNGGUL INDONESIA MAJU',
      headlineColor: '#0F172A',
      subtitleText: 'Terus Berkarya Nyata Menjawab Tantangan Dunia Kerja & Industri',
      subtitleColor: '#334155',
      socialFooterBgColor: '#7F1D1D',
      socialFooterTextColor: '#FFFFFF',
      socialFooterBorderColor: '#F59E0B',
      showTopPill: true,
      showEventCard: true,
    },
  },
  {
    id: 'rec_ppdb_vokasi',
    badge: '🎓 PPDB SISWA BARU',
    title: 'Penerimaan Siswa Baru (PPDB) SMK Unggulan',
    description: 'Palet biru navy dan oranye energik dengan hierarki teks jelas untuk menarik calon siswa berprestasi.',
    category: 'Pendidikan & PPDB',
    previewColors: ['#1E3A8A', '#93C5FD', '#EA580C', '#0284C7', '#0F172A'],
    updates: {
      topPillText: 'PENERIMAAN PESERTA DIDIK BARU 2026/2027',
      topPillBgColor: '#1E3A8A',
      topPillTextColor: '#93C5FD',
      eventCardTitle: 'Jalur Prestasi, Zonasi & Afirmasi',
      eventCardTitleFontSize: 13,
      eventCardSubtitle: 'GELOMBANG 1 DIBUKA',
      eventCardSubtitleFontSize: 18,
      eventCardBorderColor: '#EA580C',
      dateText: 'Pendaftaran: 1 - 30 Juni 2026',
      dateFontSize: 11,
      dateBgColor: '#EA580C',
      dateColor: '#FFFFFF',
      headlineText: 'SIAPKAN MASA DEPAN GEMILANG BERSAMA SMK PUSAT KEUNGGULAN',
      headlineColor: '#0F172A',
      subtitleText: 'Daftar sekarang melalui portal online resmi: ppdb.smkn1klk.sch.id',
      subtitleColor: '#334155',
      socialFooterBgColor: '#1E3A8A',
      socialFooterTextColor: '#FFFFFF',
      socialFooterBorderColor: '#EA580C',
      showTopPill: true,
      showEventCard: true,
    },
  },
  {
    id: 'rec_diesnatalis_modern',
    badge: '✨ MODERN & PRESTASI',
    title: 'Dies Natalis, Gelar Karya & Wisuda',
    description: 'Nuansa violet elegan dengan aksen cyan futuristik, sangat cocok untuk poster expo karya siswa dan perayaan ulang tahun sekolah.',
    category: 'Dies Natalis & Wisuda',
    previewColors: ['#4C1D95', '#DDD6FE', '#0D9488', '#6366F1', '#312E81'],
    updates: {
      topPillText: 'DIES NATALIS & GELAR KARYA SISWA 2026',
      topPillBgColor: '#4C1D95',
      topPillTextColor: '#DDD6FE',
      eventCardTitle: 'Pameran Produk Inovasi & Kewirausahaan',
      eventCardTitleFontSize: 13,
      eventCardSubtitle: 'KREASI VOKASI',
      eventCardSubtitleFontSize: 18,
      eventCardBorderColor: '#0D9488',
      dateText: '22 Desember 2026',
      dateFontSize: 11,
      dateBgColor: '#6366F1',
      dateColor: '#FFFFFF',
      headlineText: 'KARYA NYATA GENERASI EMAS MENUJU INDUSTRI 4.0',
      headlineColor: '#1E1B4B',
      subtitleText: 'Menampilkan Karya Unggulan Siswa dari Berbagai Bidang Keahlian',
      subtitleColor: '#475569',
      socialFooterBgColor: '#312E81',
      socialFooterTextColor: '#FFFFFF',
      socialFooterBorderColor: '#38BDF8',
      showTopPill: true,
      showEventCard: true,
    },
  },
  {
    id: 'rec_guru_karakter',
    badge: '📘 EDUKATIF & HUMANIS',
    title: 'Hari Guru Nasional & Karakter Pelajar',
    description: 'Biru samudra yang menenangkan dengan aksen hijau dedikasi, menghadirkan rasa hormat dan inspirasi yang mendalam.',
    category: 'Pendidikan & Karakter',
    previewColors: ['#0369A1', '#E0F2FE', '#15803D', '#0284C7', '#075985'],
    updates: {
      topPillText: 'MEMPERINGATI HARI GURU NASIONAL 2026',
      topPillBgColor: '#0369A1',
      topPillTextColor: '#E0F2FE',
      eventCardTitle: 'Dedikasi Tanpa Batas Membangun Karakter',
      eventCardTitleFontSize: 13,
      eventCardSubtitle: 'GURU PENGGERAK',
      eventCardSubtitleFontSize: 18,
      eventCardBorderColor: '#15803D',
      dateText: '25 November 2026',
      dateFontSize: 11,
      dateBgColor: '#0284C7',
      dateColor: '#FFFFFF',
      headlineText: 'GURU HEBAT, INDONESIA KUAT & BERMARTABAT',
      headlineColor: '#0F172A',
      subtitleText: 'Terima Kasih Atas Bimbingan dan Ketulusan Mendidik Generasi Bangsa',
      subtitleColor: '#334155',
      socialFooterBgColor: '#075985',
      socialFooterTextColor: '#FFFFFF',
      socialFooterBorderColor: '#86EFAC',
      showTopPill: true,
      showEventCard: true,
    },
  },
  {
    id: 'rec_seminar_ai',
    badge: '🤖 TEKNOLOGI & DIGITAL',
    title: 'Workshop & Seminar Nasional AI',
    description: 'Cyber cyan dan biru gelap profesional dengan gaya teknologi masa depan untuk webinar dan workshop inovatif.',
    category: 'Teknologi & Bisnis',
    previewColors: ['#082F49', '#38BDF8', '#06B6D4', '#0284C7', '#0F172A'],
    updates: {
      topPillText: 'WORKSHOP TEKNOLOGI KECERDASAN BUATAN 2026',
      topPillBgColor: '#082F49',
      topPillTextColor: '#38BDF8',
      eventCardTitle: 'Artificial Intelligence & Future Career',
      eventCardTitleFontSize: 13,
      eventCardSubtitle: 'KEYNOTE WORKSHOP',
      eventCardSubtitleFontSize: 18,
      eventCardBorderColor: '#06B6D4',
      dateText: '14 November 2026',
      dateFontSize: 11,
      dateBgColor: '#38BDF8',
      dateColor: '#0F172A',
      headlineText: 'MENGUASAI AI UNTUK INDUSTRI KREATIF DAN REELS SOSMED',
      headlineColor: '#FFFFFF',
      subtitleText: 'Kupas Tuntas Otomasi Konten Digital dan Generative AI Multimodal',
      subtitleColor: '#7DD3FC',
      socialFooterBgColor: '#0C4A6E',
      socialFooterTextColor: '#FFFFFF',
      socialFooterBorderColor: '#38BDF8',
      showTopPill: true,
      showEventCard: true,
    },
  },
  {
    id: 'rec_esports_neon',
    badge: '🎮 GAMING & YOUTH',
    title: 'Turnamen E-Sport Championship Pelajar',
    description: 'Nuansa gelap dengan aksen toxic neon lime dan ungu gaming untuk event kompetisi e-sport dan gaming sosmed.',
    category: 'Gaming & Pemuda',
    previewColors: ['#3B0764', '#BEF264', '#84CC16', '#2E1065', '#090514'],
    updates: {
      topPillText: 'PELAJAR ESPORTS CHAMPIONSHIP 2026',
      topPillBgColor: '#3B0764',
      topPillTextColor: '#BEF264',
      eventCardTitle: 'Mobile Legends & Free Fire National Series',
      eventCardTitleFontSize: 13,
      eventCardSubtitle: 'TOTAL PRIZE 50 JUTA',
      eventCardSubtitleFontSize: 18,
      eventCardBorderColor: '#84CC16',
      dateText: 'Grand Final: 5 Desember 2026',
      dateFontSize: 11,
      dateBgColor: '#84CC16',
      dateColor: '#0F172A',
      headlineText: 'BUKTIKAN KETANGGUHAN TIMMU DI ARENA JUARA',
      headlineColor: '#FFFFFF',
      subtitleText: 'Pendaftaran Terbuka untuk Seluruh Pelajar SMA/SMK se-Indonesia',
      subtitleColor: '#BEF264',
      socialFooterBgColor: '#2E1065',
      socialFooterTextColor: '#FFFFFF',
      socialFooterBorderColor: '#84CC16',
      showTopPill: true,
      showEventCard: true,
    },
  },
  {
    id: 'rec_kuliner_promo',
    badge: '🍔 KULINER & BISNIS',
    title: 'Festival Kuliner Nusantara & Grand Promo Resto',
    description: 'Kombinasi amber hangat dan merah bata menggugah selera untuk promosi bisnis kuliner dan diskon makanan.',
    category: 'Bisnis & Kuliner',
    previewColors: ['#7C2D12', '#FEF08A', '#F59E0B', '#431407', '#EA580C'],
    updates: {
      topPillText: 'SPECIAL GRAND OPENING & PROMO DISKON 50%',
      topPillBgColor: '#7C2D12',
      topPillTextColor: '#FEF08A',
      eventCardTitle: 'Sensasi Rasa Otentik Masakan Nusantara',
      eventCardTitleFontSize: 13,
      eventCardSubtitle: 'BUY 1 GET 1 FREE',
      eventCardSubtitleFontSize: 18,
      eventCardBorderColor: '#F59E0B',
      dateText: 'Promo Berlaku: 1 - 15 November 2026',
      dateFontSize: 11,
      dateBgColor: '#FDE68A',
      dateColor: '#7C2D12',
      headlineText: 'KELEZATAN KULINER TRADISIONAL BERKUALITAS BINTANG LIMA',
      headlineColor: '#FFFFFF',
      subtitleText: 'Kunjungi outlet kami dan nikmati sajian istimewa bersama keluarga',
      subtitleColor: '#FDE68A',
      socialFooterBgColor: '#431407',
      socialFooterTextColor: '#FFFFFF',
      socialFooterBorderColor: '#F59E0B',
      showTopPill: true,
      showEventCard: true,
    },
  },
];

// Robust JSON Fetcher to completely eliminate "Unexpected token '<'" JSON parsing errors
async function safeFetchJson(url: string, bodyObj: any): Promise<{ ok: boolean; status: number; data: any }> {
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bodyObj),
    });

    const rawText = await res.text();
    let data: any = {};
    try {
      data = JSON.parse(rawText);
    } catch {
      return {
        ok: false,
        status: res.status,
        data: {
          error: `Respon server bukan JSON valid (${res.status}). Server dev sedang memuat ulang modul. Silakan coba klik sekali lagi.`,
        },
      };
    }

    return { ok: res.ok, status: res.status, data };
  } catch (err: any) {
    return {
      ok: false,
      status: 0,
      data: { error: `Gagal menghubungi server: ${err.message}` },
    };
  }
}

export const GeminiAIModal: React.FC<GeminiAIModalProps> = ({
  isOpen,
  onClose,
  assets,
  onApplyGeneratedAssets,
  onApplyVisionCriticResult,
}) => {
  const [activeTab, setActiveTab] = useState<'generate' | 'recommendations' | 'vision' | 'settings'>('generate');

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
  const [applyVisualAssets, setApplyVisualAssets] = useState<boolean>(true);

  // Online Dynamic Recommendations Generated from Google Gemini
  const [onlineRecommendations, setOnlineRecommendations] = useState<AIDesignPreset[]>([]);
  const [isGeneratingRec, setIsGeneratingRec] = useState<boolean>(false);
  const [recTopic, setRecTopic] = useState<string>('Peringatan Hari Pahlawan & Vokasi Unggul');

  // Multimodal Vision Critic State
  const [isAnalyzingVision, setIsAnalyzingVision] = useState<boolean>(false);
  const [visionReport, setVisionReport] = useState<any>(null);
  const [dbNotification, setDbNotification] = useState<string>('');

  // Generate Online Dynamic AI Recommendation with Google Gemini
  const handleGenerateOnlineRecommendation = async (customTopic?: string) => {
    const key = apiKey.trim();
    if (!key) {
      setActiveTab('settings');
      setStatusMessage('Silakan masukkan Google Gemini API Key Anda terlebih dahulu.');
      return;
    }

    setIsGeneratingRec(true);
    const topicToUse = (customTopic || recTopic).trim() || 'Peningkatan Mutu Pendidikan & Karakter Vokasi';

    try {
      const { ok, data } = await safeFetchJson('/api/gemini', {
        apiKey: key,
        model: selectedModel,
        temperature: 0.75,
        action: 'generate_design',
        prompt: `Rancang konsep desain visual kreatif dan profesional untuk tema: "${topicToUse}". Berikan palet warna harmonis dengan kontras tinggi WCAG AA, teks banner acara, dan kartu SPMI/kegiatan.`,
      });

      if (ok && data.success && data.result) {
        if (data.modelUsed && data.modelUsed !== selectedModel) {
          setSelectedModel(data.modelUsed);
          if (typeof window !== 'undefined') {
            localStorage.setItem('GEMINI_MODEL', data.modelUsed);
          }
        }

        const res = data.result;
        const newRec: AIDesignPreset = {
          id: `online_rec_${Date.now()}`,
          badge: '✨ GEMINI AI ONLINE (LIVE)',
          title: res.topPillText || topicToUse,
          description: res.reasoning || `Rekomendasi desain cerdas dari model resmi Google Gemini (${data.modelUsed || selectedModel}) untuk topik "${topicToUse}".`,
          category: 'Generatif AI Online',
          previewColors: [
            res.topPillBgColor || '#05472A',
            res.topPillTextColor || '#86EFAC',
            res.eventCardBorderColor || '#F59E0B',
            res.dateBgColor || '#2563EB',
            '#0F172A',
          ],
          updates: {
            topPillText: res.topPillText || topicToUse,
            topPillBgColor: res.topPillBgColor || '#05472A',
            topPillTextColor: res.topPillTextColor || '#86EFAC',
            eventCardTitle: res.eventCardTitle || 'Sistem Penjaminan Mutu Internal',
            eventCardTitleFontSize: 13,
            eventCardSubtitle: res.eventCardSubtitle || 'SPMI',
            eventCardSubtitleFontSize: 18,
            eventCardBorderColor: res.eventCardBorderColor || '#F59E0B',
            dateText: res.dateText || '2026',
            dateFontSize: 11,
            dateBgColor: res.dateBgColor || '#2563EB',
            dateColor: res.dateColor || '#FFFFFF',
            headlineText: res.headlineText || topicToUse,
            subtitleText: res.subtitleText || '',
            socialFooterBgColor: res.dateBgColor || '#1D4ED8',
            socialFooterTextColor: '#FFFFFF',
            socialFooterBorderColor: res.eventCardBorderColor || '#F59E0B',
            showTopPill: true,
            showEventCard: true,
            ...(res.customBgImageUrl
              ? { customBgImageUrl: res.customBgImageUrl, useCustomBgImage: true }
              : {}),
            ...(res.mainMediaUrl
              ? { mainMediaUrl: res.mainMediaUrl, isolateSubject: true }
              : {}),
          },
        };

        setOnlineRecommendations((prev) => [newRec, ...prev]);
        setDbNotification(`Rekomendasi online "${newRec.title}" berhasil digenerate oleh Gemini!`);
        setTimeout(() => setDbNotification(''), 4000);
      } else {
        alert(data.error || 'Gagal menghasilkan rekomendasi dengan Gemini API. Silakan periksa Google Gemini API Key Anda.');
      }
    } catch (e: any) {
      alert(`Terjadi kesalahan: ${e.message}`);
    } finally {
      setIsGeneratingRec(false);
    }
  };

  const handleSaveRecToDatabase = async (rec: AIDesignPreset) => {
    const merged = { ...assets, ...rec.updates };
    await dbSaveProject(`AI: ${rec.title}`, 'poster_1_1', merged);
    setDbNotification(`Preset "${rec.title}" berhasil disimpan ke Database!`);
    setTimeout(() => setDbNotification(''), 3000);
  };

  const handleSaveGeneratedToDatabase = async () => {
    if (!generationResult) return;
    const merged = {
      ...assets,
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
      ...(applyVisualAssets && generationResult.customBgImageUrl
        ? { customBgImageUrl: generationResult.customBgImageUrl, useCustomBgImage: true }
        : {}),
      ...(applyVisualAssets && generationResult.mainMediaUrl
        ? { mainMediaUrl: generationResult.mainMediaUrl, isolateSubject: true }
        : {}),
    };
    await dbSaveProject(`AI: ${generationResult.topPillText || promptTopic}`, 'poster_1_1', merged);
    setDbNotification('Hasil rancangan & aset AI berhasil disimpan ke Database!');
    setTimeout(() => setDbNotification(''), 3000);
  };

  // Load API key & cached models from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedKey = (localStorage.getItem('GEMINI_API_KEY') || '').trim();
      let savedModel = (localStorage.getItem('GEMINI_MODEL') || 'gemini-1.5-flash').trim();
      // Automatically migrate deprecated or invalid models to gemini-1.5-flash
      if (
        !savedModel ||
        savedModel.includes('2.5') ||
        savedModel.includes('3.8') ||
        savedModel.includes('3.5')
      ) {
        savedModel = 'gemini-1.5-flash';
        localStorage.setItem('GEMINI_MODEL', 'gemini-1.5-flash');
      }
      const savedModelsJson = localStorage.getItem('GEMINI_AVAILABLE_MODELS');
      
      setApiKey(savedKey);
      setSelectedModel(savedModel);

      if (savedModelsJson) {
        try {
          let parsed: GeminiModelOption[] = JSON.parse(savedModelsJson);
          if (Array.isArray(parsed) && parsed.length > 0) {
            // Filter out deprecated or invalid models
            parsed = parsed.filter(
              (m) =>
                !m.id.includes('2.5') &&
                !m.id.includes('3.8') &&
                !m.id.includes('3.5')
            );
            if (!parsed.some((m) => m.id === 'gemini-1.5-flash')) {
              parsed.unshift({
                id: 'gemini-1.5-flash',
                displayName: 'Gemini 1.5 Flash (Rekomendasi Utama Google)',
                description: 'Model multimodal tercepat, paling stabil, dan efisien untuk teks & poster',
              });
            }
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
      const { ok, data } = await safeFetchJson('/api/gemini', {
        apiKey: key,
        action: 'test_connection',
      });

      if (ok && data.success) {
        setConnectionStatus('success');
        
        const models: GeminiModelOption[] = (data.availableModels || [])
          .map((m: any) => (typeof m === 'string' ? { id: m, displayName: m } : m))
          .filter(
            (m: any) =>
              !m.id.includes('2.5') &&
              !m.id.includes('3.8') &&
              !m.id.includes('3.5')
          );

        if (!models.some((m) => m.id === 'gemini-1.5-flash')) {
          models.unshift({
            id: 'gemini-1.5-flash',
            displayName: 'Gemini 1.5 Flash (Rekomendasi Utama Google)',
            description: 'Model multimodal tercepat, paling stabil, dan efisien untuk teks & poster',
          });
        }

        setAvailableModels(models);

        // Auto-select recommended model (e.g. gemini-1.5-flash) or fallback
        const recModel = data.recommendedModel || 'gemini-1.5-flash';
        setSelectedModel(recModel);

        if (typeof window !== 'undefined') {
          localStorage.setItem('GEMINI_API_KEY', key);
          localStorage.setItem('GEMINI_MODEL', recModel);
          localStorage.setItem('GEMINI_AVAILABLE_MODELS', JSON.stringify(models));
        }

        setStatusMessage(
          `✓ Terhubung Sukses! Berhasil memuat ${models.length} model resmi dari API Key Anda. Model aktif: '${recModel}'.`
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
  const handleGenerateContent = async (topicOverride?: string) => {
    const topicToUse = (topicOverride || promptTopic).trim() || 'Peringatan Hari Pahlawan 10 November & Peningkatan Mutu Vokasi';
    setIsGenerating(true);
    setGenerationResult(null);

    try {
      const { ok, data } = await safeFetchJson('/api/gemini', {
        apiKey: apiKey.trim(),
        model: selectedModel,
        temperature,
        action: 'generate_design',
        prompt: `${topicToUse} (Gaya Tone: ${tone})`,
      });

      if (ok && data.success && data.result) {
        setGenerationResult(data.result);
        if (data.modelUsed && data.modelUsed !== selectedModel && !data.modelUsed.includes('Smart') && !data.modelUsed.includes('Tanpa')) {
          setSelectedModel(data.modelUsed);
          if (typeof window !== 'undefined') {
            localStorage.setItem('GEMINI_MODEL', data.modelUsed);
          }
        }
      } else {
        alert(data.error || 'Gagal generate dengan Gemini AI. Silakan coba klik sekali lagi.');
      }
    } catch (e: any) {
      alert(`Terjadi kesalahan: ${e.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  // Apply Generated Content & Visual Assets to Canvas
  const handleApplyToCanvas = () => {
    if (!generationResult) return;

    const updates: Partial<AssetInputs> = {
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
    };

    if (applyVisualAssets && generationResult.customBgImageUrl) {
      updates.customBgImageUrl = generationResult.customBgImageUrl;
      updates.useCustomBgImage = true;
      updates.backgroundLayers = [];
    }
    if (applyVisualAssets && generationResult.mainMediaUrl) {
      updates.mainMediaUrl = generationResult.mainMediaUrl;
      updates.isolateSubject = true;
    }

    onApplyGeneratedAssets(updates);
    onClose();
  };

  // Apply AI Recommendation Preset Directly
  const handleApplyRecommendation = (rec: AIDesignPreset) => {
    onApplyGeneratedAssets(rec.updates);
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

      const { ok, data } = await safeFetchJson('/api/gemini', {
        apiKey,
        model: selectedModel,
        action: 'vision_critique',
        canvasImageBase64,
      });

      if (ok && data.success) {
        setVisionReport(data.result);
        if (data.modelUsed && data.modelUsed !== selectedModel) {
          setSelectedModel(data.modelUsed);
          if (typeof window !== 'undefined') {
            localStorage.setItem('GEMINI_MODEL', data.modelUsed);
          }
        }
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
            onClick={() => setActiveTab('recommendations')}
            style={{
              flex: 1,
              padding: '12px 6px',
              fontSize: '12px',
              fontWeight: 700,
              background: 'none',
              border: 'none',
              color: activeTab === 'recommendations' ? '#38BDF8' : '#94A3B8',
              borderBottom: activeTab === 'recommendations' ? '2px solid #38BDF8' : '2px solid transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}
          >
            <Sparkles size={14} color={activeTab === 'recommendations' ? '#38BDF8' : '#94A3B8'} />
            <span>Rekomendasi AI</span>
          </button>

          <button
            onClick={() => setActiveTab('generate')}
            style={{
              flex: 1,
              padding: '12px 6px',
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
            <span>Prompt Generator</span>
          </button>

          <button
            onClick={() => setActiveTab('vision')}
            style={{
              flex: 1,
              padding: '12px 6px',
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
            <span>Vision Critic</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            style={{
              flex: 1,
              padding: '12px 6px',
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
            <span>Pengaturan API</span>
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Notification toast */}
          {dbNotification && (
            <div
              style={{
                padding: '8px 12px',
                borderRadius: '8px',
                background: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid #10B981',
                color: '#6EE7B7',
                fontSize: '11.5px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <CheckCircle2 size={14} color="#10B981" />
              <span>{dbNotification}</span>
            </div>
          )}

          {/* TAB 0: REKOMENDASI CERDAS AI */}
          {activeTab === 'recommendations' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div
                style={{
                  background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.12) 0%, rgba(139, 92, 246, 0.12) 100%)',
                  border: '1px solid rgba(56, 189, 248, 0.25)',
                  borderRadius: '10px',
                  padding: '12px 14px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                }}
              >
                <Sparkles size={20} color="#38BDF8" style={{ marginTop: '2px', flexShrink: 0 }} />
                <div style={{ fontSize: '12px', color: '#E2E8F0', lineHeight: 1.5 }}>
                  <strong style={{ color: '#38BDF8' }}>Rekomendasi Desain AI Online & Presets:</strong> Minta rekomendasi langsung dari <strong>Google Gemini API</strong> menggunakan API Key Anda, atau pilih preset teruji di bawah untuk langsung memperbarui teks SPMI, headline, palet warna, dan kartu acara.
                </div>
              </div>

              {/* LIVE ONLINE GEMINI AI RECOMMENDATION GENERATOR */}
              <div
                className="glass-panel"
                style={{
                  padding: '16px',
                  borderRadius: '12px',
                  border: '1px solid rgba(56, 189, 248, 0.35)',
                  background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.08) 0%, rgba(59, 130, 246, 0.08) 100%)',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Wand2 size={15} color="#38BDF8" />
                    <span style={{ fontSize: '13px', fontWeight: 800, color: '#F8FAFC' }}>
                      Generate Rekomendasi AI Online (Google Gemini)
                    </span>
                  </div>
                  {connectionStatus === 'success' ? (
                    <span style={{ fontSize: '10px', color: '#34D399', fontWeight: 700, background: 'rgba(16, 185, 129, 0.15)', padding: '2px 8px', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                      ✓ API Key Aktif ({selectedModel})
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setActiveTab('settings')}
                      style={{ fontSize: '10.5px', color: '#FCD34D', background: 'rgba(252, 211, 77, 0.12)', border: '1px solid rgba(252, 211, 77, 0.3)', padding: '2px 8px', borderRadius: '12px', cursor: 'pointer' }}
                    >
                      Masukkan API Key →
                    </button>
                  )}
                </div>

                <p style={{ fontSize: '11px', color: '#94A3B8', marginBottom: '10px', lineHeight: 1.4 }}>
                  Ketik tema/topik kegiatan Anda, dan Google Gemini akan merancang palet warna harmonis, banner atas, dan kartu informasi acara secara live.
                </p>

                {/* Quick Topic Chips */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '10px' }}>
                  {[
                    'Peringatan Hari Pahlawan & Vokasi',
                    'SPMI & Akreditasi Mutu',
                    'PPDB Siswa Baru 2026',
                    'Workshop AI & Masa Depan',
                    'Dies Natalis & Gelar Karya',
                    'Hari Guru Nasional',
                  ].map((topic) => (
                    <button
                      key={topic}
                      type="button"
                      onClick={() => {
                        setRecTopic(topic);
                        handleGenerateOnlineRecommendation(topic);
                      }}
                      disabled={isGeneratingRec}
                      style={{
                        padding: '3px 8px',
                        fontSize: '10px',
                        borderRadius: '6px',
                        background: recTopic === topic ? 'rgba(56, 189, 248, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                        border: recTopic === topic ? '1px solid #38BDF8' : '1px solid rgba(255, 255, 255, 0.1)',
                        color: recTopic === topic ? '#38BDF8' : '#CBD5E1',
                        cursor: isGeneratingRec ? 'not-allowed' : 'pointer',
                      }}
                    >
                      {topic}
                    </button>
                  ))}
                </div>

                {/* Custom Topic Input & Submit Button */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    value={recTopic}
                    onChange={(e) => setRecTopic(e.target.value)}
                    placeholder="Ketik tema kegiatan (misal: Lomba Kompetensi Siswa SMK)..."
                    className="input-control"
                    style={{ flex: 1, fontSize: '11.5px', padding: '7px 10px' }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleGenerateOnlineRecommendation();
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => handleGenerateOnlineRecommendation()}
                    disabled={isGeneratingRec}
                    className="btn btn-primary"
                    style={{
                      padding: '7px 14px',
                      fontSize: '11.5px',
                      fontWeight: 700,
                      background: 'linear-gradient(135deg, #06B6D4 0%, #3B82F6 100%)',
                      boxShadow: '0 4px 14px rgba(6, 182, 212, 0.35)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {isGeneratingRec ? (
                      <>
                        <RefreshCw size={13} className="spin" />
                        <span>Menghubungi Gemini...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles size={13} />
                        <span>Minta Rekomendasi AI</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* DYNAMIC LIST OF ONLINE AI RECOMMENDATIONS (IF ANY GENERATED) */}
              {onlineRecommendations.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 800, color: '#34D399', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Sparkles size={13} />
                    <span>Hasil Rekomendasi Gemini AI Online ({onlineRecommendations.length}):</span>
                  </div>

                  {onlineRecommendations.map((rec) => (
                    <div
                      key={rec.id}
                      className="glass-panel"
                      style={{
                        padding: '14px',
                        borderRadius: '10px',
                        border: '1.5px solid rgba(16, 185, 129, 0.45)',
                        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(15, 23, 42, 0.75) 100%)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                        boxShadow: '0 8px 24px rgba(16, 185, 129, 0.15)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '6px' }}>
                        <span
                          style={{
                            fontSize: '10px',
                            fontWeight: 800,
                            padding: '3px 8px',
                            borderRadius: '999px',
                            background: 'rgba(16, 185, 129, 0.25)',
                            color: '#34D399',
                            border: '1px solid #10B981',
                          }}
                        >
                          {rec.badge}
                        </span>
                        <span style={{ fontSize: '10.5px', color: '#94A3B8', fontWeight: 600 }}>
                          Model: {selectedModel}
                        </span>
                      </div>

                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 800, color: '#F8FAFC' }}>
                          {rec.title}
                        </div>
                        <div style={{ fontSize: '11px', color: '#CBD5E1', marginTop: '2px', lineHeight: 1.4 }}>
                          {rec.description}
                        </div>
                      </div>

                      {/* Palette swatches & details */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(0,0,0,0.35)', padding: '8px 12px', borderRadius: '8px', flexWrap: 'wrap', gap: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontSize: '10px', color: '#94A3B8', fontWeight: 600 }}>Palet Warna AI:</span>
                          <div style={{ display: 'flex', gap: '5px' }}>
                            {rec.previewColors.map((color, i) => (
                              <span
                                key={i}
                                style={{
                                  width: '16px',
                                  height: '16px',
                                  borderRadius: '50%',
                                  backgroundColor: color,
                                  border: '1px solid rgba(255,255,255,0.4)',
                                  display: 'inline-block',
                                }}
                                title={color}
                              />
                            ))}
                          </div>
                        </div>

                        <div style={{ fontSize: '10px', color: '#CBD5E1', display: 'flex', gap: '10px' }}>
                          <span>Event Card: <strong>{rec.updates.eventCardTitle?.slice(0, 24)}</strong></span>
                          <span>Badge: <strong style={{ color: rec.updates.dateBgColor }}>{rec.updates.dateText}</strong></span>
                        </div>
                      </div>

                      {/* Dual Action: Apply AI directly or Save to Database */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '8px' }}>
                        <button
                          type="button"
                          onClick={() => handleApplyRecommendation(rec)}
                          className="btn btn-primary"
                          style={{
                            padding: '8px 12px',
                            fontSize: '11.5px',
                            fontWeight: 700,
                            background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                            boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)',
                          }}
                        >
                          <Zap size={13} />
                          <span>⚡ Terapkan AI Ini</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleSaveRecToDatabase(rec)}
                          className="btn"
                          style={{
                            padding: '8px 10px',
                            fontSize: '11px',
                            fontWeight: 600,
                            background: 'rgba(252, 211, 77, 0.1)',
                            border: '1px solid rgba(252, 211, 77, 0.3)',
                            color: '#FCD34D',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '5px',
                          }}
                          title="Simpan preset rekomendasi AI ini ke database"
                        >
                          <Save size={13} />
                          <span>Simpan ke DB</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div style={{ fontSize: '11px', fontWeight: 800, color: '#94A3B8', marginTop: '6px', marginBottom: '-4px' }}>
                📋 Preset Desain Rekomendasi Teruji:
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {AI_DESIGN_RECOMMENDATIONS.map((rec) => (
                  <div
                    key={rec.id}
                    className="glass-panel"
                    style={{
                      padding: '14px',
                      borderRadius: '10px',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      background: 'rgba(15, 23, 42, 0.65)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '6px' }}>
                      <span
                        style={{
                          fontSize: '10px',
                          fontWeight: 800,
                          padding: '3px 8px',
                          borderRadius: '999px',
                          background: 'rgba(6, 182, 212, 0.2)',
                          color: '#38BDF8',
                          border: '1px solid rgba(6, 182, 212, 0.4)',
                        }}
                      >
                        {rec.badge}
                      </span>
                      <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 600 }}>
                        {rec.category}
                      </span>
                    </div>

                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 800, color: '#F8FAFC' }}>
                        {rec.title}
                      </div>
                      <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '2px', lineHeight: 1.4 }}>
                        {rec.description}
                      </div>
                    </div>

                    {/* Palette swatches & details */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(0,0,0,0.3)', padding: '8px 12px', borderRadius: '8px', flexWrap: 'wrap', gap: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '10px', color: '#94A3B8', fontWeight: 600 }}>Palet Warna:</span>
                        <div style={{ display: 'flex', gap: '5px' }}>
                          {rec.previewColors.map((color, i) => (
                            <span
                              key={i}
                              style={{
                                width: '16px',
                                height: '16px',
                                borderRadius: '50%',
                                backgroundColor: color,
                                border: '1px solid rgba(255,255,255,0.3)',
                                display: 'inline-block',
                              }}
                              title={color}
                            />
                          ))}
                        </div>
                      </div>

                      <div style={{ fontSize: '10px', color: '#CBD5E1', display: 'flex', gap: '10px' }}>
                        <span>Pill: <strong style={{ color: rec.updates.topPillTextColor }}>{rec.updates.topPillText?.slice(0, 16)}...</strong></span>
                        <span>Sosmed: <strong style={{ color: rec.updates.socialFooterTextColor }}>{rec.updates.socialFooterBgColor}</strong></span>
                      </div>
                    </div>

                    {/* Dual Action: Apply AI directly or Save to Database */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '8px' }}>
                      <button
                        onClick={() => handleApplyRecommendation(rec)}
                        className="btn btn-primary"
                        style={{
                          padding: '8px 12px',
                          fontSize: '11.5px',
                          fontWeight: 700,
                          background: 'linear-gradient(135deg, #06B6D4 0%, #3B82F6 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          boxShadow: '0 4px 14px rgba(6, 182, 212, 0.25)',
                        }}
                      >
                        <Zap size={13} />
                        <span>⚡ Terapkan AI</span>
                      </button>

                      <button
                        onClick={() => handleSaveRecToDatabase(rec)}
                        className="btn"
                        style={{
                          padding: '8px 10px',
                          fontSize: '11px',
                          fontWeight: 600,
                          background: 'rgba(252, 211, 77, 0.1)',
                          border: '1px solid rgba(252, 211, 77, 0.3)',
                          color: '#FCD34D',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '5px',
                        }}
                        title="Simpan preset rekomendasi AI ini ke database lokal"
                      >
                        <Save size={13} />
                        <span>Simpan ke DB</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
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
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleGenerateContent();
                    }}
                    placeholder="Contoh: Peringatan Hari Guru Nasional 2026 atau Workshop SPMI"
                    className="input-control"
                    style={{ fontSize: '13px' }}
                  />
                  <button
                    onClick={() => handleGenerateContent()}
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
                  Atau pilih contoh ide tema cepat (1-klik langsung generate):
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
                      onClick={() => {
                        setPromptTopic(idea);
                        handleGenerateContent(idea);
                      }}
                      className="glass-pill"
                      style={{
                        padding: '4px 10px',
                        fontSize: '11px',
                        color: promptTopic === idea ? '#38BDF8' : '#CBD5E1',
                        border: promptTopic === idea ? '1px solid #38BDF8' : '1px solid rgba(255, 255, 255, 0.12)',
                        cursor: 'pointer',
                        background: promptTopic === idea ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255, 255, 255, 0.04)',
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
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10B981', fontWeight: 700, fontSize: '13px' }}>
                      <CheckCircle2 size={16} />
                      <span>Rekomendasi AI Selesai Dibuat</span>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={handleApplyToCanvas}
                        className="btn btn-autofix"
                        style={{
                          padding: '7px 14px',
                          fontSize: '11.5px',
                          fontWeight: 700,
                          background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                          boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)',
                          color: '#FFFFFF',
                          border: 'none',
                        }}
                      >
                        <Wand2 size={13} />
                        <span>✨ Terapkan ke Kanvas Sekarang</span>
                      </button>
                      <button
                        onClick={handleSaveGeneratedToDatabase}
                        className="btn"
                        style={{
                          padding: '7px 10px',
                          fontSize: '11px',
                          background: 'rgba(252, 211, 77, 0.12)',
                          border: '1px solid #FCD34D',
                          color: '#FCD34D',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                        title="Simpan rancangan ini ke database lokal"
                      >
                        <Save size={12} />
                        <span>Simpan DB</span>
                      </button>
                    </div>
                  </div>

                  {/* Visual Palet Warna yang Dihasilkan AI */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px' }}>
                    <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 600 }}>Palet Warna AI:</span>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      {[
                        { label: 'Latar Banner', color: generationResult.topPillBgColor || '#05472A' },
                        { label: 'Teks Banner', color: generationResult.topPillTextColor || '#86EFAC' },
                        { label: 'Border SPMI', color: generationResult.eventCardBorderColor || '#F59E0B' },
                        { label: 'Lencana Tanggal', color: generationResult.dateBgColor || '#2563EB' },
                      ].map((item, idx) => (
                        <span
                          key={idx}
                          style={{
                            width: '16px',
                            height: '16px',
                            borderRadius: '50%',
                            backgroundColor: item.color,
                            border: '1.5px solid rgba(255,255,255,0.4)',
                            display: 'inline-block',
                          }}
                          title={`${item.label}: ${item.color}`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Aset Visual yang Dihasilkan AI (Background & Subjek Media) */}
                  {(generationResult.customBgImageUrl || generationResult.mainMediaUrl) && (
                    <div style={{
                      background: 'rgba(15, 23, 42, 0.7)',
                      border: '1px solid rgba(56, 189, 248, 0.35)',
                      borderRadius: '10px',
                      padding: '12px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#38BDF8', fontWeight: 700, fontSize: '12px' }}>
                          <Sparkles size={14} />
                          <span>🎨 Aset Visual yang Dihasilkan AI:</span>
                        </div>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '11px', color: '#E2E8F0', userSelect: 'none' }}>
                          <input
                            type="checkbox"
                            checked={applyVisualAssets}
                            onChange={(e) => setApplyVisualAssets(e.target.checked)}
                            style={{ cursor: 'pointer', accentColor: '#10B981' }}
                          />
                          <span>Sertakan & Terapkan ke Kanvas</span>
                        </label>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '10px' }}>
                        {/* Background Asset Preview */}
                        {generationResult.customBgImageUrl && (
                          <div style={{
                            display: 'flex',
                            gap: '10px',
                            alignItems: 'center',
                            background: 'rgba(0, 0, 0, 0.35)',
                            border: '1px solid rgba(56, 189, 248, 0.25)',
                            borderRadius: '8px',
                            padding: '8px 10px',
                          }}>
                            <div style={{
                              width: '48px',
                              height: '48px',
                              borderRadius: '6px',
                              overflow: 'hidden',
                              border: '1px solid rgba(56, 189, 248, 0.5)',
                              flexShrink: 0,
                              background: '#090D16',
                            }}>
                              <img
                                src={generationResult.customBgImageUrl}
                                alt="AI Background"
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                              <span style={{ fontSize: '10px', color: '#38BDF8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                                🖼️ Background AI
                              </span>
                              <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#F1F5F9', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {generationResult.bgName || 'Background Tema AI'}
                              </span>
                              <span style={{ fontSize: '10px', color: '#94A3B8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {generationResult.bgDescription || 'Vektor beresolusi tinggi'}
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Main Media / Subject Asset Preview */}
                        {generationResult.mainMediaUrl && (
                          <div style={{
                            display: 'flex',
                            gap: '10px',
                            alignItems: 'center',
                            background: 'rgba(0, 0, 0, 0.35)',
                            border: '1px solid rgba(245, 158, 11, 0.3)',
                            borderRadius: '8px',
                            padding: '8px 10px',
                          }}>
                            <div style={{
                              width: '48px',
                              height: '48px',
                              borderRadius: '6px',
                              overflow: 'hidden',
                              border: '1px solid rgba(245, 158, 11, 0.5)',
                              flexShrink: 0,
                              background: '#090D16',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}>
                              <img
                                src={generationResult.mainMediaUrl}
                                alt="AI Subject"
                                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                              />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                              <span style={{ fontSize: '10px', color: '#F59E0B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                                👤 Subjek / Hero AI
                              </span>
                              <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#F1F5F9', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {generationResult.mainMediaName || 'Karakter/Objek AI'}
                              </span>
                              <span style={{ fontSize: '10px', color: '#94A3B8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {generationResult.mainMediaDescription || 'Subjek visual utama tema'}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

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
                      if (isFlash) badge = '⭐ [Rekomendasi Utama Google - Aktif & Tercepat]';
                      else if (is20Flash) badge = '⚡ [Generasi 2.0 - Super Cepat]';
                      else if (isPro) badge = '🧠 [Penalaran Kompleks]';

                      return (
                        <option key={m.id} value={m.id} style={{ background: '#0F172A', color: '#F8FAFC' }}>
                          {m.displayName || m.id} ({m.id}) {badge}
                        </option>
                      );
                    })
                  ) : (
                    <>
                      <option value="gemini-1.5-flash">⭐ gemini-1.5-flash (Rekomendasi Utama Google - Aktif & Cepat)</option>
                      <option value="gemini-2.0-flash">⚡ gemini-2.0-flash (Generasi 2.0 - Super Cepat)</option>
                      <option value="gemini-1.5-pro">🧠 gemini-1.5-pro (Penalaran Kompleks & Estetika Tinggi)</option>
                      <option value="gemini-1.5-flash-8b">🍃 gemini-1.5-flash-8b (Ultra Ringan)</option>
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
                  Model otomatis menggunakan <strong>gemini-3.8-flash</strong> sebagai rekomendasi utama resmi dari Google Generative Language API, dilengkapi dengan sistem multi-model auto-fallback (gemini-3.8-flash &rarr; gemini-2.0-flash &rarr; gemini-1.5-flash) bila terjadi kendala kuota atau ketersediaan model regional.
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
