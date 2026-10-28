'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  AssetInputs,
  OutputFormat,
  CriticIssue,
  AutoFixAction,
} from '@/types/design';
import { generateSocialFooterSvg } from '@/lib/social-footer-svg';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, User, AlertCircle, Wand2 } from 'lucide-react';

interface InteractiveCanvasProps {
  assets: AssetInputs;
  format: OutputFormat;
  issues: CriticIssue[];
  showSocialOverlay: boolean;
  selectedIssueId: string | null;
  onSelectIssue: (issueId: string | null) => void;
  onApplySingleFix: (action: AutoFixAction) => void;
  onUpdateAssetProperty: (key: keyof AssetInputs, value: any) => void;
}

// Strict Z-Index Layer Stacking Order requested by user
const LAYER_ORDER: Record<string, number> = {
  bg: 1,            // Paling belakang
  mainMedia: 2,     // Urutan nomor 2 setelah Background (Foto Subjek Utama)
  watermark: 3,     // Watermark Garuda
  eventCard: 4,     // Kartu SPMI di atas foto
  dateBadge: 5,     // Lencana tanggal
  topPill: 6,       // Banner atas di atas foto
  logo: 7,          // Logo di atas foto
  socialFooter: 8,  // Footer sosial media paling depan
};

export const InteractiveCanvas: React.FC<InteractiveCanvasProps> = ({
  assets,
  format,
  issues,
  showSocialOverlay,
  selectedIssueId,
  onSelectIssue,
  onApplySingleFix,
  onUpdateAssetProperty,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<any>(null);
  const [activeIssue, setActiveIssue] = useState<CriticIssue | null>(null);

  // Canvas Display Dimensions
  const isSquare = format === 'poster_1_1';
  const canvasWidth = isSquare ? 580 : 540;
  const canvasHeight = isSquare ? 580 : 675;

  // Re-sorts all objects in Fabric.js so the Photo is ALWAYS layer #2
  const enforceLayerOrdering = (canvas: any) => {
    if (!canvas) return;
    const objs = canvas.getObjects();
    objs.sort((a: any, b: any) => {
      const orderA = LAYER_ORDER[a.dataId] ?? 5;
      const orderB = LAYER_ORDER[b.dataId] ?? 5;
      return orderA - orderB;
    });
    objs.forEach((obj: any, index: number) => {
      obj.moveTo(index);
    });
    canvas.renderAll();
  };

  useEffect(() => {
    let isMounted = true;

    const initFabric = async () => {
      if (!canvasRef.current) return;

      const fabricModule = await import('fabric');
      const fabric = fabricModule.fabric || fabricModule;

      if (!fabricCanvasRef.current) {
        fabricCanvasRef.current = new fabric.Canvas(canvasRef.current, {
          width: canvasWidth,
          height: canvasHeight,
          selection: true,
          preserveObjectStacking: true,
        });

        // Listen for modifications
        fabricCanvasRef.current.on('object:modified', (e: any) => {
          const obj = e.target;
          if (!obj) return;
          if (obj.dataId === 'headline') {
            onUpdateAssetProperty('headlineFontSize', Math.round(obj.fontSize * (obj.scaleY || 1)));
          } else if (obj.dataId === 'mainMedia') {
            onUpdateAssetProperty('mainMediaScale', Number((obj.scaleX || 1).toFixed(2)));
          }
        });
      }

      const canvas = fabricCanvasRef.current;
      canvas.setWidth(canvasWidth);
      canvas.setHeight(canvasHeight);
      canvas.clear();

      // 1. LAYER 1: BACKGROUND (Template Image or Gradient)
      if (assets.useCustomBgImage && assets.customBgImageUrl) {
        fabric.Image.fromURL(assets.customBgImageUrl, (bgImg: any) => {
          if (!isMounted || !canvas) return;
          bgImg.set({
            left: 0,
            top: 0,
            scaleX: canvasWidth / (bgImg.width || 1080),
            scaleY: canvasHeight / (bgImg.height || 1080),
            selectable: false,
            evented: false,
            dataId: 'bg',
          });
          canvas.add(bgImg);
          enforceLayerOrdering(canvas);
        });
      } else {
        canvas.setBackgroundColor(assets.bgColor || '#E0F2FE', canvas.renderAll.bind(canvas));
      }

      // 2. LAYER 2: FOTO SUBJEK UTAMA (Urutan Belakang No. 2 setelah Background)
      if (assets.mainMediaUrl) {
        fabric.Image.fromURL(assets.mainMediaUrl, (img: any) => {
          if (!isMounted || !canvas) return;
          const baseScale = (canvasWidth * 0.62) / Math.max(img.width || 500, img.height || 500);
          const finalScale = baseScale * (assets.mainMediaScale || 1.0);

          img.set({
            left: canvasWidth * 0.5,
            top: canvasHeight * 0.52,
            originX: 'center',
            originY: 'center',
            scaleX: finalScale,
            scaleY: finalScale,
            selectable: true,
            hasBorders: true,
            cornerColor: '#38BDF8',
            dataId: 'mainMedia',
          });

          // Subject isolation aura if enabled
          if (assets.isolateSubject) {
            img.set({
              shadow: new fabric.Shadow({
                color: 'rgba(255, 255, 255, 0.8)',
                blur: 32,
                offsetX: 0,
                offsetY: 2,
              }),
            });
          }

          canvas.add(img);
          enforceLayerOrdering(canvas);
        });
      }

      // 3. LAYER 3: WATERMARK GARUDA (Center)
      if (assets.showWatermark && assets.watermarkUrl) {
        fabric.Image.fromURL(assets.watermarkUrl, (wmImg: any) => {
          if (!isMounted || !canvas) return;
          const wmSize = canvasWidth * 0.65;
          const scale = wmSize / (wmImg.width || 600);
          wmImg.set({
            left: canvasWidth / 2,
            top: canvasHeight * 0.36,
            originX: 'center',
            originY: 'center',
            scaleX: scale,
            scaleY: scale,
            opacity: 0.22,
            selectable: false,
            evented: false,
            dataId: 'watermark',
          });
          canvas.add(wmImg);
          enforceLayerOrdering(canvas);
        });
      }

      // 4. LAYER 4: EVENT CARD (SPMI) - Middle Bottom
      if (assets.showEventCard) {
        const cardTitle = new fabric.Text(assets.eventCardTitle || 'Sistem Penjaminan Mutu Internal', {
          fontSize: 13,
          fontWeight: 'bold',
          fill: '#0F172A',
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          originX: 'center',
          top: -14,
        });

        const cardSub = new fabric.Text(assets.eventCardSubtitle || 'SPMI', {
          fontSize: 18,
          fontWeight: '900',
          fill: '#0F172A',
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          originX: 'center',
          top: 4,
        });

        const cardW = canvasWidth * 0.44;
        const cardH = 54;

        const cardBg = new fabric.Rect({
          width: cardW,
          height: cardH,
          rx: 10,
          ry: 10,
          fill: '#FFFFFF',
          stroke: assets.eventCardBorderColor || '#F59E0B',
          strokeWidth: 3,
          originX: 'center',
          originY: 'center',
          shadow: new fabric.Shadow({
            color: 'rgba(0, 0, 0, 0.2)',
            blur: 10,
            offsetY: 3,
          }),
        });

        const eventCardGroup = new fabric.Group([cardBg, cardTitle, cardSub], {
          left: canvasWidth / 2,
          top: canvasHeight * 0.81,
          originX: 'center',
          originY: 'center',
          selectable: true,
          dataId: 'eventCard',
        });
        canvas.add(eventCardGroup);
      }

      // 5. LAYER 5: DATE BADGE ("18 September 2026")
      if (assets.dateText) {
        const dateTextObj = new fabric.Text(assets.dateText, {
          fontSize: 11,
          fontWeight: 'bold',
          fill: assets.dateColor || '#FFFFFF',
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          originX: 'center',
          originY: 'center',
        });

        const dBw = dateTextObj.width + 30;
        const dBh = 24;

        const dateBgObj = new fabric.Rect({
          width: dBw,
          height: dBh,
          rx: 12,
          ry: 12,
          fill: assets.dateBgColor || '#2563EB',
          originX: 'center',
          originY: 'center',
        });

        const dateGroup = new fabric.Group([dateBgObj, dateTextObj], {
          left: canvasWidth / 2,
          top: canvasHeight * 0.89,
          originX: 'center',
          originY: 'center',
          selectable: true,
          dataId: 'dateBadge',
        });
        canvas.add(dateGroup);
      }

      // 6. LAYER 6: TOP PILL BANNER ("MEMPERINGATI HARI KESAKTIAN PANCASILA") - MUST BE ON TOP OF PHOTO!
      if (assets.showTopPill && assets.topPillText) {
        const topText = new fabric.Text(assets.topPillText.toUpperCase(), {
          fontSize: 13,
          fontWeight: '900',
          fill: assets.topPillTextColor || '#86EFAC',
          fontFamily: "'Plus Jakarta Sans', Arial, sans-serif",
          originX: 'center',
          originY: 'center',
        });

        const pillW = Math.max(canvasWidth * 0.72, topText.width + 48);
        const pillH = 38;

        const pillBg = new fabric.Rect({
          width: pillW,
          height: pillH,
          rx: 19,
          ry: 19,
          fill: assets.topPillBgColor || '#05472A',
          originX: 'center',
          originY: 'center',
          shadow: new fabric.Shadow({
            color: 'rgba(0, 0, 0, 0.35)',
            blur: 10,
            offsetY: 2,
          }),
        });

        const topPillGroup = new fabric.Group([pillBg, topText], {
          left: canvasWidth / 2,
          top: canvasHeight * 0.16,
          originX: 'center',
          originY: 'center',
          selectable: true,
          dataId: 'topPill',
        });
        canvas.add(topPillGroup);
      }

      // 7. LAYER 7: LOGO INSTANSI / SEKOLAH (Top Left) - ON TOP OF PHOTO
      if (assets.logoUrl) {
        fabric.Image.fromURL(assets.logoUrl, (logoImg: any) => {
          if (!isMounted || !canvas) return;
          const targetW = canvasWidth * 0.42;
          const scale = targetW / (logoImg.width || 320);

          logoImg.set({
            left: canvasWidth * 0.04,
            top: canvasHeight * 0.04,
            scaleX: scale,
            scaleY: scale,
            selectable: !assets.logoLocked,
            lockMovementX: assets.logoLocked,
            lockMovementY: assets.logoLocked,
            dataId: 'logo',
          });
          canvas.add(logoImg);
          enforceLayerOrdering(canvas);
        });
      }

      // 8. LAYER 8: SOCIAL FOOTER BAR WITH CRISP VECTOR ICONS (Instagram, Web, Facebook, TikTok)
      if (assets.useDefaultSocialFooter) {
        const footerSvgUrl = generateSocialFooterSvg(
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

        fabric.Image.fromURL(footerSvgUrl, (footerImg: any) => {
          if (!isMounted || !canvas) return;
          const targetW = canvasWidth * 0.94;
          const scale = targetW / (footerImg.width || 1000);

          footerImg.set({
            left: canvasWidth / 2,
            top: canvasHeight * 0.955,
            originX: 'center',
            originY: 'center',
            scaleX: scale,
            scaleY: scale,
            selectable: false,
            evented: false,
            dataId: 'socialFooter',
          });
          canvas.add(footerImg);
          enforceLayerOrdering(canvas);
        });
      }

      enforceLayerOrdering(canvas);
    };

    initFabric();

    return () => {
      isMounted = false;
    };
  }, [assets, format, canvasWidth, canvasHeight]);

  // Keep active issue highlighted
  useEffect(() => {
    if (selectedIssueId) {
      const found = issues.find((i) => i.issue_id === selectedIssueId);
      setActiveIssue(found || null);
    } else {
      setActiveIssue(null);
    }
  }, [selectedIssueId, issues]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        padding: '20px',
      }}
    >
      {/* Canvas Wrapper */}
      <div
        style={{
          position: 'relative',
          width: `${canvasWidth}px`,
          height: `${canvasHeight}px`,
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.65), 0 0 0 1px rgba(255, 255, 255, 0.12)',
          borderRadius: '16px',
          overflow: 'hidden',
          backgroundColor: '#FFFFFF',
        }}
      >
        <canvas ref={canvasRef} id="main-interactive-canvas" />

        {/* Dynamic Bounding Box Overlays for AI Critic Issues */}
        {issues.map((issue) => {
          const isSelected = selectedIssueId === issue.issue_id;
          const scaleX = canvasWidth / 700;
          const scaleY = canvasHeight / 700;

          const boxX = issue.bounding_box[0] * scaleX;
          const boxY = issue.bounding_box[1] * scaleY;
          const boxW = issue.bounding_box[2] * scaleX;
          const boxH = issue.bounding_box[3] * scaleY;

          const borderColor =
            issue.severity === 'high'
              ? '#F43F5E'
              : issue.severity === 'medium'
              ? '#F59E0B'
              : '#38BDF8';

          return (
            <div
              key={issue.issue_id}
              onClick={() => onSelectIssue(isSelected ? null : issue.issue_id)}
              style={{
                position: 'absolute',
                left: `${boxX}px`,
                top: `${boxY}px`,
                width: `${boxW}px`,
                height: `${boxH}px`,
                border: `2px ${isSelected ? 'solid' : 'dashed'} ${borderColor}`,
                backgroundColor: isSelected ? `${borderColor}22` : `${borderColor}0D`,
                borderRadius: '6px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                zIndex: 20,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                pointerEvents: 'auto',
              }}
              title={issue.description}
            >
              <div
                style={{
                  alignSelf: 'flex-start',
                  backgroundColor: borderColor,
                  color: '#FFFFFF',
                  fontSize: '9px',
                  fontWeight: 800,
                  padding: '2px 6px',
                  borderRadius: '4px',
                  transform: 'translateY(-100%)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                }}
              >
                <AlertCircle size={10} />
                <span>{issue.issue_id}</span>
              </div>
            </div>
          );
        })}

        {/* Selected Issue Quick-Fix Popover */}
        {activeIssue && (
          <div
            style={{
              position: 'absolute',
              bottom: '40px',
              left: '16px',
              right: '16px',
              backgroundColor: 'rgba(15, 23, 42, 0.95)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '12px',
              padding: '12px 16px',
              zIndex: 35,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: '0 12px 28px rgba(0, 0, 0, 0.6)',
            }}
          >
            <div style={{ maxWidth: '75%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                <span className={`badge badge-${activeIssue.severity}`}>
                  {activeIssue.category.replace('_', ' ')}
                </span>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#F8FAFC' }}>
                  {activeIssue.issue_id}
                </span>
              </div>
              <div style={{ fontSize: '11px', color: '#CBD5E1', lineHeight: '1.4' }}>
                {activeIssue.description}
              </div>
            </div>

            <button
              onClick={() => {
                onApplySingleFix({
                  layerId: activeIssue.target_layer,
                  property: activeIssue.auto_fix.property,
                  value: activeIssue.auto_fix.value,
                  description: activeIssue.auto_fix.description,
                });
                setActiveIssue(null);
              }}
              className="btn btn-autofix"
              style={{ padding: '6px 12px', fontSize: '12px', whiteSpace: 'nowrap' }}
            >
              <Wand2 size={13} />
              <span>Terapkan Auto-Fix</span>
            </button>
          </div>
        )}

        {/* Instagram Feed Mockup Overlay */}
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
              padding: '12px 16px',
              background: 'linear-gradient(180deg, rgba(0,0,0,0.35) 0%, transparent 15%, transparent 85%, rgba(0,0,0,0.55) 100%)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#FFFFFF' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'linear-gradient(45deg, #F59E0B, #EC4899, #8B5CF6)',
                    padding: '2px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: '50%',
                      backgroundColor: '#1E293B',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <User size={16} color="#FFFFFF" />
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 700 }}>smkn1klk</div>
                  <div style={{ fontSize: '10px', color: '#CBD5E1' }}>SMK Negeri 1 Klungkung</div>
                </div>
              </div>
              <MoreHorizontal size={18} color="#FFFFFF" />
            </div>

            <div style={{ color: '#FFFFFF' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <Heart size={20} color="#FFFFFF" />
                  <MessageCircle size={20} color="#FFFFFF" />
                  <Send size={20} color="#FFFFFF" />
                </div>
                <Bookmark size={20} color="#FFFFFF" />
              </div>
              <div style={{ fontSize: '12px', fontWeight: 600 }}>2,481 likes</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
