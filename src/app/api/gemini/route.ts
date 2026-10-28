import { NextRequest, NextResponse } from 'next/server';

interface GeminiRequest {
  apiKey?: string;
  model?: string;
  temperature?: number;
  action: 'generate_design' | 'vision_critique' | 'list_models' | 'test_connection';
  prompt?: string;
  canvasImageBase64?: string;
  currentAssets?: any;
}

const FALLBACK_MODELS = [
  'gemini-1.5-flash',
  'gemini-2.0-flash',
  'gemini-1.5-pro',
  'gemini-1.5-flash-8b',
];

export async function POST(req: NextRequest) {
  try {
    const body: GeminiRequest = await req.json();
    const apiKey = (body.apiKey || process.env.GEMINI_API_KEY || '').trim();
    let requestedModel = (body.model || 'gemini-1.5-flash').trim();
    const temperature = body.temperature ?? 0.7;

    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            'Google Gemini API Key belum diisi. Silakan masukkan API Key Anda di menu Pengaturan Gemini AI.',
        },
        { status: 400 }
      );
    }

    // ACTION: LIST / VERIFY MODELS FOR THIS KEY
    if (body.action === 'list_models' || body.action === 'test_connection') {
      try {
        const listEndpoint = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
        const listRes = await fetch(listEndpoint);

        if (!listRes.ok) {
          const errText = await listRes.text();
          return NextResponse.json(
            {
              error: `API Key tidak valid atau ditolak oleh Google (${listRes.status}): ${errText}`,
              status: listRes.status,
            },
            { status: listRes.status }
          );
        }

        const data = await listRes.json();
        const availableModels: string[] = (data.models || [])
          .filter((m: any) => m.supportedGenerationMethods?.includes('generateContent'))
          .map((m: any) => m.name.replace(/^models\//, ''));

        // Pick best recommended model
        let recommended = 'gemini-1.5-flash';
        for (const pref of ['gemini-1.5-flash', 'gemini-2.0-flash', 'gemini-1.5-pro']) {
          if (availableModels.includes(pref)) {
            recommended = pref;
            break;
          }
        }

        return NextResponse.json({
          success: true,
          message: `Koneksi Berhasil! Ditemukan ${availableModels.length} model aktif untuk API Key ini.`,
          availableModels,
          recommendedModel: recommended,
        });
      } catch (err: any) {
        return NextResponse.json(
          { error: `Gagal memeriksa daftar model: ${err.message}` },
          { status: 500 }
        );
      }
    }

    // ACTION 1: GENERATE DESIGN CONTENT (Theme -> Banner, Card, Date, Headline, Colors)
    if (body.action === 'generate_design') {
      const systemPrompt = `Anda adalah seorang desainer grafis profesional dan Senior Art Director untuk media sosial institusi pendidikan dan instansi resmi.
Berdasarkan tema atau topik kegiatan yang diberikan pengguna, buatkan struktur data JSON yang presisi untuk diterapkan ke template desain Instagram.
Balas HANYA dengan JSON valid murni tanpa markdown triple backticks.

Struktur JSON yang WAJIB dihasilkan:
{
  "topPillText": "Teks banner atas melengkung (contoh: MEMPERINGATI HARI GURU NASIONAL 2026, huruf kapital, ringkas dan berwibawa)",
  "topPillBgColor": "#Hex (warna latar banner yang berwibawa, misal hijau tua #05472A, biru dongker #1E3A8A, atau marun #831843)",
  "topPillTextColor": "#Hex (warna teks dengan kontras tinggi WCAG AA, misal #86EFAC atau #FFFFFF)",
  "eventCardTitle": "Nama kegiatan atau penjaminan mutu pada kartu bawah (contoh: Sistem Penjaminan Mutu Internal / Peringatan Hari Bersejarah)",
  "eventCardSubtitle": "Singkatan / Kode Kegiatan (contoh: SPMI / HGN / HUT-35)",
  "eventCardBorderColor": "#Hex (warna garis tepi kartu, misal #F59E0B atau #2563EB)",
  "dateText": "Tanggal pelaksanaan kegiatan (contoh: 25 November 2026)",
  "dateBgColor": "#Hex (warna lencana tanggal)",
  "dateColor": "#FFFFFF",
  "headlineText": "Judul inspiratif pelengkap (maksimal 8 kata)",
  "subtitleText": "Sub-judul atau pesan pembangun karakter",
  "reasoning": "Penjelasan singkat alasan pemilihan warna dan hierarki desain"
}`;

      const userMessage = `Tema Kegiatan: "${body.prompt || 'Peringatan Hari Kesaktian Pancasila & Penjaminan Mutu Sekolah'}"`;

      // Helper to attempt generateContent with automatic model fallback
      const tryGenerate = async (targetModel: string) => {
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${targetModel}:generateContent?key=${apiKey}`;
        return fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [{ text: `${systemPrompt}\n\n${userMessage}` }],
              },
            ],
            generationConfig: {
              temperature: temperature,
              responseMimeType: 'application/json',
            },
          }),
        });
      };

      let response = await tryGenerate(requestedModel);

      // Automatic fallback if model not found (404)
      if (response.status === 404) {
        for (const alt of FALLBACK_MODELS) {
          if (alt !== requestedModel) {
            const altRes = await tryGenerate(alt);
            if (altRes.ok) {
              response = altRes;
              requestedModel = alt;
              break;
            }
          }
        }
      }

      if (!response.ok) {
        const errText = await response.text();
        return NextResponse.json(
          { error: `Gemini API Error: ${response.status} - ${errText}` },
          { status: response.status }
        );
      }

      const data = await response.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
      const cleanJson = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);

      return NextResponse.json({
        success: true,
        modelUsed: requestedModel,
        result: parsed,
      });
    }

    // ACTION 2: MULTIMODAL VISION CRITIQUE (Evaluates Canvas Image Base64)
    if (body.action === 'vision_critique') {
      if (!body.canvasImageBase64) {
        return NextResponse.json(
          { error: 'Tangkapan layar kanvas tidak ditemukan untuk evaluasi visual.' },
          { status: 400 }
        );
      }

      const base64Data = body.canvasImageBase64.replace(/^data:image\/\w+;base64,/, '');

      const visionPrompt = `Anda adalah asisten AI Visual Critic profesional sesuai kerangka ACGT (Analyze, Clarify, Guide, Track).
Perhatikan gambar desain poster/reels Instagram terlampir. Analisis komposisinya secara cermat:
1. Kontras warna teks banner atas dan teks kartu bawah terhadap latar belakang.
2. Posisi foto subjek utama: apakah tertutup banner/logo atau sudah proporsional berada di belakang banner.
3. Keterbacaan informasi tanggal dan akun sosial media.
4. Keseimbangan ruang kosong (white space).

Balas HANYA dalam format JSON murni:
{
  "overall_score": 88,
  "category_scores": {
    "contrast": 90,
    "hierarchy": 85,
    "spatial_balance": 88,
    "visual_density": 89
  },
  "visual_critique_summary": "Evaluasi visual menyeluruh dalam bahasa Indonesia...",
  "issues": [
    {
      "issue_id": "ERR_VISUAL_01",
      "category": "color_contrast",
      "severity": "medium",
      "target_layer": "headline",
      "description": "Deskripsi isu yang diamati langsung pada gambar",
      "auto_fix": {
        "property": "headlineColor",
        "value": "#064E3B",
        "description": "Rekomendasi perbaikan spesifik"
      }
    }
  ]
}`;

      const tryVision = async (targetModel: string) => {
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${targetModel}:generateContent?key=${apiKey}`;
        return fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [
                  { text: visionPrompt },
                  {
                    inlineData: {
                      mimeType: 'image/png',
                      data: base64Data,
                    },
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.3,
              responseMimeType: 'application/json',
            },
          }),
        });
      };

      let response = await tryVision(requestedModel);

      // Automatic fallback if model not found
      if (response.status === 404) {
        for (const alt of FALLBACK_MODELS) {
          if (alt !== requestedModel) {
            const altRes = await tryVision(alt);
            if (altRes.ok) {
              response = altRes;
              requestedModel = alt;
              break;
            }
          }
        }
      }

      if (!response.ok) {
        const errText = await response.text();
        return NextResponse.json(
          { error: `Gemini Vision Error: ${response.status} - ${errText}` },
          { status: response.status }
        );
      }

      const data = await response.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
      const cleanJson = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);

      return NextResponse.json({
        success: true,
        modelUsed: requestedModel,
        result: parsed,
      });
    }

    return NextResponse.json({ error: 'Aksi tidak dikenali' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Gagal memproses permintaan Gemini AI', details: error.message },
      { status: 500 }
    );
  }
}
