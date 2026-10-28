'use client';

import React, { useState, useEffect, useRef } from 'react';
import { AssetInputs, CriticIssue } from '@/types/design';
import { generateSocialFooterSvg } from '@/lib/social-footer-svg';
import {
  Play,
  Pause,
  RotateCcw,
  Video,
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  Music2,
  Volume2,
  Disc3,
} from 'lucide-react';

interface ReelsMotionPlayerProps {
  assets: AssetInputs;
  issues: CriticIssue[];
  showSocialOverlay: boolean;
  onExportVideo?: () => void;
  exportTrigger?: number;
}

export const ReelsMotionPlayer: React.FC<ReelsMotionPlayerProps> = ({
  assets,
  issues,
  showSocialOverlay,
  exportTrigger,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingProgress, setRecordingProgress] = useState<number>(0);

  const duration = 15;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lastTimeRef = useRef<number>(performance.now());
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  // 9:16 viewport
  const displayWidth = 360;
  const displayHeight = 640;
  const renderWidth = 720;
  const renderHeight = 1280;

  // Cached Image elements for smooth 60fps canvas rendering
  const bgImgRef = useRef<HTMLImageElement | null>(null);
  const bgLayersImgsRef = useRef<{ img: HTMLImageElement; opacity: number; blendMode?: string }[]>([]);
  const logoImgRef = useRef<HTMLImageElement | null>(null);
  const photoImgRef = useRef<HTMLImageElement | null>(null);
  const wmImgRef = useRef<HTMLImageElement | null>(null);
  const footerImgRef = useRef<HTMLImageElement | null>(null);

  // Load images
  useEffect(() => {
    // Multi-background layers
    const visibleLayers = (assets.backgroundLayers || []).filter((l) => l.visible && l.url);
    if (visibleLayers.length > 0) {
      bgLayersImgsRef.current = visibleLayers.map((layer) => {
        const img = new Image();
        img.src = layer.url;
        return { img, opacity: layer.opacity ?? 1.0, blendMode: layer.blendMode };
      });
    } else {
      bgLayersImgsRef.current = [];
    }

    if (assets.useCustomBgImage && assets.customBgImageUrl) {
      const bg = new Image();
      bg.src = assets.customBgImageUrl;
      bgImgRef.current = bg;
    } else {
      bgImgRef.current = null;
    }

    if (assets.logoUrl) {
      const l = new Image();
      l.src = assets.logoUrl;
      logoImgRef.current = l;
    }

    if (assets.mainMediaUrl) {
      const p = new Image();
      p.src = assets.mainMediaUrl;
      photoImgRef.current = p;
    }

    if (assets.showWatermark && assets.watermarkUrl) {
      const wm = new Image();
      wm.src = assets.watermarkUrl;
      wmImgRef.current = wm;
    }

    if (assets.useDefaultSocialFooter) {
      const fSvg = generateSocialFooterSvg(
        assets.socialHandles || {
          instagram: 'smkn1klk',
          website: 'smkn1klk.sch.id',
          facebook: 'SMK Negeri 1 Klungkung',
          tiktok: 'smkn1klungkung',
        },
        1000,
        56,
        '#1D4ED8'
      );
      const fImg = new Image();
      fImg.src = fSvg;
      footerImgRef.current = fImg;
    }
  }, [
    assets.customBgImageUrl,
    assets.useCustomBgImage,
    assets.logoUrl,
    assets.mainMediaUrl,
    assets.showWatermark,
    assets.watermarkUrl,
    assets.useDefaultSocialFooter,
    assets.socialHandles,
  ]);

  // Frame Rendering Function with Strict Layer Stacking Order
  const renderFrame = (t: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    // LAYER 1: BACKGROUND (Multi-Layer Backgrounds, Template Image, or Sky Gradient)
    if (bgLayersImgsRef.current.length > 0) {
      ctx.fillStyle = assets.bgColor || '#0F172A';
      ctx.fillRect(0, 0, w, h);

      bgLayersImgsRef.current.forEach(({ img, opacity, blendMode }) => {
        if (img && img.complete) {
          ctx.save();
          ctx.globalAlpha = opacity;
          if (blendMode && blendMode !== 'normal') {
            ctx.globalCompositeOperation = blendMode as GlobalCompositeOperation;
          }
          ctx.drawImage(img, 0, 0, w, h);
          ctx.restore();
        }
      });
    } else if (bgImgRef.current && bgImgRef.current.complete) {
      ctx.drawImage(bgImgRef.current, 0, 0, w, h);
    } else {
      const skyGrad = ctx.createLinearGradient(0, 0, 0, h);
      skyGrad.addColorStop(0, '#C7E9FE');
      skyGrad.addColorStop(0.5, '#E0F2FE');
      skyGrad.addColorStop(0.85, '#A3E635');
      skyGrad.addColorStop(1, '#4D7C0F');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, w, h);
    }

    // LAYER 2: FOTO SUBJEK UTAMA (Urutan Belakang No. 2 - di belakang Banner & Logo!)
    if (photoImgRef.current && photoImgRef.current.complete) {
      const p = photoImgRef.current;
      ctx.save();

      // Pan & Zoom camera effect
      const zoom = 1.0 + Math.sin((t / duration) * Math.PI) * 0.08;
      const floatY = Math.sin(t * 1.2) * 8;
      const userScale = assets.mainMediaScale || 1.0;

      ctx.translate(w / 2, h * 0.50 + floatY);
      ctx.scale(zoom * userScale, zoom * userScale);

      // Subject aura halo
      if (assets.isolateSubject) {
        ctx.shadowColor = 'rgba(255, 255, 255, 0.75)';
        ctx.shadowBlur = 35;
      }

      const pW = w * 0.75;
      const pH = pW * (p.naturalHeight / (p.naturalWidth || 1));
      ctx.drawImage(p, -pW / 2, -pH / 2, pW, pH);
      ctx.restore();
    }

    // LAYER 3: WATERMARK GARUDA (Subtle pulse)
    if (wmImgRef.current && wmImgRef.current.complete && assets.showWatermark) {
      ctx.save();
      ctx.globalAlpha = 0.18 + Math.sin(t * 1.5) * 0.04;
      const wmSize = w * 0.85;
      ctx.drawImage(wmImgRef.current, w / 2 - wmSize / 2, h * 0.3 - wmSize / 2, wmSize, wmSize);
      ctx.restore();
    }

    // LAYER 4: EVENT CARD (SPMI) - Staggered entrance at t >= 0.8s (ON TOP OF PHOTO)
    if (assets.showEventCard && t >= 0.8) {
      const cardProgress = Math.min(1, (t - 0.8) / 0.6);
      const cardEase = 1 - Math.pow(1 - cardProgress, 3);
      const cardY = h * 0.78 + (1 - cardEase) * 40;

      ctx.save();
      ctx.globalAlpha = cardProgress;

      const cW = w * 0.68;
      const cH = 80;
      const cX = w / 2 - cW / 2;

      // Card Background
      ctx.fillStyle = '#FFFFFF';
      ctx.strokeStyle = assets.eventCardBorderColor || '#F59E0B';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.roundRect(cX, cardY, cW, cH, 14);
      ctx.fill();
      ctx.stroke();

      // Card Title
      ctx.fillStyle = '#0F172A';
      ctx.textAlign = 'center';
      ctx.font = 'bold 18px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(assets.eventCardTitle || 'Sistem Penjaminan Mutu Internal', w / 2, cardY + 34);

      // Card Subtitle (SPMI)
      ctx.font = '900 26px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(assets.eventCardSubtitle || 'SPMI', w / 2, cardY + 65);

      ctx.restore();
    }

    // LAYER 5: DATE BADGE ("18 September 2026") - entrance at t >= 1.2s (ON TOP OF PHOTO)
    if (assets.dateText && t >= 1.2) {
      const dProgress = Math.min(1, (t - 1.2) / 0.5);
      const dY = h * 0.86;

      ctx.save();
      ctx.globalAlpha = dProgress;

      ctx.font = 'bold 17px "Plus Jakarta Sans", sans-serif';
      const dMetrics = ctx.measureText(assets.dateText);
      const dbW = dMetrics.width + 40;
      const dbH = 36;
      const dbX = w / 2 - dbW / 2;

      ctx.fillStyle = assets.dateBgColor || '#2563EB';
      ctx.beginPath();
      ctx.roundRect(dbX, dY, dbW, dbH, 18);
      ctx.fill();

      ctx.fillStyle = assets.dateColor || '#FFFFFF';
      ctx.textAlign = 'center';
      ctx.fillText(assets.dateText, w / 2, dY + 24);
      ctx.restore();
    }

    // LAYER 6: TOP BANNER PILL ("MEMPERINGATI HARI KESAKTIAN PANCASILA") - MUST BE ON TOP OF PHOTO!
    if (assets.showTopPill && assets.topPillText) {
      const enterProgress = Math.min(1, t / 0.8);
      const ease = 1 - Math.pow(1 - enterProgress, 3);
      const pillY = h * 0.15 - (1 - ease) * 60;

      ctx.save();
      ctx.globalAlpha = enterProgress;

      ctx.font = '900 20px "Plus Jakarta Sans", Arial, sans-serif';
      const textMetrics = ctx.measureText(assets.topPillText.toUpperCase());
      const bW = Math.max(w * 0.88, textMetrics.width + 48);
      const bH = 50;
      const bX = w / 2 - bW / 2;

      ctx.fillStyle = assets.topPillBgColor || '#05472A';
      ctx.beginPath();
      ctx.roundRect(bX, pillY, bW, bH, 25);
      ctx.fill();

      ctx.fillStyle = assets.topPillTextColor || '#86EFAC';
      ctx.textAlign = 'center';
      ctx.fillText(assets.topPillText.toUpperCase(), w / 2, pillY + 32);
      ctx.restore();
    }

    // LAYER 7: TOP LOGO (SMK Negeri 1 Klungkung) - ON TOP OF PHOTO!
    if (logoImgRef.current && logoImgRef.current.complete) {
      ctx.save();
      const lW = w * 0.52;
      const lH = lW * (logoImgRef.current.naturalHeight / (logoImgRef.current.naturalWidth || 1));
      ctx.drawImage(logoImgRef.current, w * 0.05, h * 0.07, lW, lH);
      ctx.restore();
    }

    // LAYER 8: SOCIAL MEDIA FOOTER WITH ICONS (Instagram, Web, Facebook, TikTok)
    if (assets.useDefaultSocialFooter) {
      ctx.save();
      if (footerImgRef.current && footerImgRef.current.complete) {
        const fW = w * 0.94;
        const fH = fW * (56 / 1000);
        const fX = w / 2 - fW / 2;
        const fY = h * 0.94;
        ctx.drawImage(footerImgRef.current, fX, fY, fW, fH);
      }
      ctx.restore();
    }
  };

  // Playback Loop
  useEffect(() => {
    let frameId: number;

    const loop = (timestamp: number) => {
      const delta = (timestamp - lastTimeRef.current) / 1000;
      lastTimeRef.current = timestamp;

      if (isPlaying) {
        setCurrentTime((prev) => {
          const next = prev + delta;
          if (next >= duration) return 0;
          return next;
        });
      }

      renderFrame(currentTime);
      frameId = requestAnimationFrame(loop);
    };

    lastTimeRef.current = performance.now();
    frameId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [isPlaying, currentTime, assets, duration]);

  // Video Recording & Export (MediaRecorder)
  const handleRecordVideo = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsRecording(true);
    setRecordingProgress(0);
    setCurrentTime(0);
    setIsPlaying(true);
    recordedChunksRef.current = [];

    const stream = canvas.captureStream(60);
    const recorder = new MediaRecorder(stream, {
      mimeType: 'video/webm;codecs=vp9',
      videoBitsPerSecond: 8000000,
    });

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        recordedChunksRef.current.push(e.data);
      }
    };

    recorder.onstop = () => {
      const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `reels-smk-klungkung-${Date.now()}.webm`;
      a.click();
      URL.revokeObjectURL(url);
      setIsRecording(false);
      setRecordingProgress(100);
    };

    recorder.start();
    mediaRecorderRef.current = recorder;

    const interval = setInterval(() => {
      setCurrentTime((t) => {
        const percent = Math.min(100, Math.round((t / duration) * 100));
        setRecordingProgress(percent);
        if (t >= duration - 0.2) {
          clearInterval(interval);
          recorder.stop();
        }
        return t;
      });
    }, 100);
  };

  // Trigger export from external action (e.g. Navbar Export Button)
  useEffect(() => {
    if (exportTrigger && exportTrigger > 0 && !isRecording) {
      handleRecordVideo();
    }
  }, [exportTrigger]);

  const formatTime = (secs: number) => {
    const s = Math.floor(secs);
    const ms = Math.floor((secs - s) * 100);
    return `00:${s.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        padding: '16px',
        gap: '12px',
      }}
    >
      {/* 9:16 Reels Frame */}
      <div
        style={{
          position: 'relative',
          width: `${displayWidth}px`,
          height: `${displayHeight}px`,
          borderRadius: '24px',
          overflow: 'hidden',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.1)',
          backgroundColor: '#000000',
        }}
      >
        <canvas
          ref={canvasRef}
          width={renderWidth}
          height={renderHeight}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />

        {/* Real Instagram Reels Interface Simulation (Social Overlay) */}
        {showSocialOverlay && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              zIndex: 30,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '16px 12px',
              background: 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, transparent 15%, transparent 75%, rgba(0,0,0,0.7) 100%)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#FFFFFF' }}>
              <span style={{ fontSize: '15px', fontWeight: 800 }}>Reels</span>
              <Volume2 size={18} color="#FFFFFF" />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', width: '100%' }}>
              <div style={{ maxWidth: '78%', color: '#FFFFFF' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: '#2563EB',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '11px',
                    }}
                  >
                    SMK
                  </div>
                  <span style={{ fontWeight: 700, fontSize: '13px' }}>smkn1klk</span>
                  <button
                    style={{
                      background: 'transparent',
                      border: '1px solid #FFFFFF',
                      borderRadius: '6px',
                      color: '#FFFFFF',
                      fontSize: '10px',
                      fontWeight: 700,
                      padding: '2px 8px',
                    }}
                  >
                    Follow
                  </button>
                </div>

                <div style={{ fontSize: '12px', lineHeight: '1.4', marginBottom: '8px' }}>
                  {assets.topPillText} • {assets.eventCardTitle} #smknegeri1klungkung #pancasila
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', opacity: 0.9 }}>
                  <Music2 size={13} />
                  <span>Lagu Resmi • SMK Bisa SMK Hebat</span>
                </div>
              </div>

              {/* Right Action Icons Column */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', color: '#FFFFFF' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                  <Heart size={26} color="#FFFFFF" />
                  <span style={{ fontSize: '11px', fontWeight: 600 }}>12.4K</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                  <MessageCircle size={26} color="#FFFFFF" />
                  <span style={{ fontSize: '11px', fontWeight: 600 }}>342</span>
                </div>
                <Send size={24} color="#FFFFFF" />
                <Bookmark size={24} color="#FFFFFF" />
                <div
                  style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    backgroundColor: '#1E293B',
                    border: '2px solid #FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Disc3 size={20} color="#38BDF8" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Programmatic Video Timeline Controls */}
      <div
        className="glass-panel"
        style={{
          width: `${displayWidth + 40}px`,
          padding: '12px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="btn btn-primary"
              style={{ padding: '6px 12px', borderRadius: '8px' }}
            >
              {isPlaying ? <Pause size={14} /> : <Play size={14} />}
            </button>
            <button
              onClick={() => setCurrentTime(0)}
              className="btn btn-secondary"
              style={{ padding: '6px 10px', borderRadius: '8px' }}
              title="Reset Timeline"
            >
              <RotateCcw size={14} />
            </button>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
                color: '#38BDF8',
                fontWeight: 600,
              }}
            >
              {formatTime(currentTime)} / 00:15.00
            </span>
          </div>

          <button
            onClick={handleRecordVideo}
            disabled={isRecording}
            className="btn btn-autofix"
            style={{ padding: '6px 12px', fontSize: '12px' }}
          >
            <Video size={14} />
            <span>{isRecording ? `Render ${recordingProgress}%` : 'Ekspor Video Reels'}</span>
          </button>
        </div>

        <input
          type="range"
          min="0"
          max={duration}
          step="0.05"
          value={currentTime}
          onChange={(e) => {
            setCurrentTime(parseFloat(e.target.value));
            setIsPlaying(false);
          }}
          style={{ width: '100%', cursor: 'pointer' }}
        />
      </div>
    </div>
  );
};
