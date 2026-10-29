'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import dynamic from 'next/dynamic';
import {
  AssetInputs,
  OutputFormat,
  CriticIssue,
  AutoFixAction,
  IterationLog,
} from '@/types/design';
import { PRESET_TEMPLATES } from '@/lib/preset-templates';
import { runACGTDeterministicAnalysis } from '@/lib/critic-engine';
import { Navbar } from '@/components/Navbar';
import { AssetIngestionPanel } from '@/components/AssetIngestionPanel';
import { CriticDrawer } from '@/components/CriticDrawer';
import { GeminiAIModal } from '@/components/GeminiAIModal';
import confetti from 'canvas-confetti';
import { Square, Sliders, ShieldAlert, Sparkles, Download } from 'lucide-react';

// Dynamic imports to prevent SSR issues with HTML5 Canvas / Fabric.js
const InteractiveCanvas = dynamic(
  () => import('@/components/InteractiveCanvas').then((m) => m.InteractiveCanvas),
  { ssr: false }
);

const ReelsMotionPlayer = dynamic(
  () => import('@/components/ReelsMotionPlayer').then((m) => m.ReelsMotionPlayer),
  { ssr: false }
);

export default function StudioPage() {
  const [activePresetId, setActivePresetId] = useState<string>(PRESET_TEMPLATES[0].id);
  const [currentFormat, setCurrentFormat] = useState<OutputFormat>('poster_1_1');
  const [assets, setAssets] = useState<AssetInputs>(PRESET_TEMPLATES[0].data);
  const [showSocialOverlay, setShowSocialOverlay] = useState<boolean>(false);
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null);
  const [isCriticOpen, setIsCriticOpen] = useState<boolean>(true);
  const [isGeminiModalOpen, setIsGeminiModalOpen] = useState<boolean>(false);
  const [iterationHistory, setIterationHistory] = useState<IterationLog[]>([]);
  const [reelsExportTrigger, setReelsExportTrigger] = useState<number>(0);

  // Mobile layout state
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [mobileActiveTab, setMobileActiveTab] = useState<'canvas' | 'editor' | 'critic'>('canvas');

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 860);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Compute live ACGT Critic Report whenever assets or format changes
  const report = useMemo(() => {
    return runACGTDeterministicAnalysis(assets, currentFormat);
  }, [assets, currentFormat]);

  // Handle Preset Selection
  const handleSelectPreset = (presetId: string) => {
    const template = PRESET_TEMPLATES.find((t) => t.id === presetId);
    if (template) {
      setActivePresetId(presetId);
      setAssets({ ...template.data });
      setSelectedIssueId(null);
    }
  };

  // Update a single asset property
  const handleUpdateAssetProperty = useCallback((key: keyof AssetInputs, value: any) => {
    setAssets((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  // Update multiple asset properties atomically (prevents resets and stale closures)
  const handleUpdateAssetsBatch = useCallback((updates: Partial<AssetInputs>) => {
    setAssets((prev) => ({
      ...prev,
      ...updates,
    }));
  }, []);

  // Apply Generated Content from Gemini AI
  const handleApplyGeneratedAssets = (updates: Partial<AssetInputs>) => {
    setAssets((prev) => ({
      ...prev,
      ...updates,
    }));

    confetti({
      particleCount: 110,
      spread: 75,
      origin: { y: 0.55 },
    });
  };

  // Apply a single Auto-Fix
  const handleApplySingleFix = (action: AutoFixAction) => {
    const scoreBefore = report.overall_score;

    setAssets((prev) => {
      const updated = { ...prev, [action.property]: action.value };
      const newReport = runACGTDeterministicAnalysis(updated, currentFormat);
      const scoreAfter = newReport.overall_score;

      // Add to iteration history (Track phase of ACGT)
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const newLog: IterationLog = {
        id: `iter-${Date.now()}`,
        timestamp: timeStr,
        actionTaken: action.description || `Auto-fix diaplikasikan pada ${action.property}`,
        scoreBefore,
        scoreAfter,
        issuesResolvedCount: 1,
      };

      setIterationHistory((h) => [newLog, ...h]);

      if (scoreAfter >= 95) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      }

      return updated;
    });

    setSelectedIssueId(null);
  };

  // Apply All Auto-Fixes simultaneously (< 200ms)
  const handleApplyAllFixes = () => {
    if (report.issues.length === 0) return;

    const scoreBefore = report.overall_score;
    const resolvedCount = report.issues.length;

    setAssets((prev) => {
      let updated = { ...prev };
      report.issues.forEach((iss) => {
        if (iss.auto_fix && iss.auto_fix.property) {
          (updated as any)[iss.auto_fix.property] = iss.auto_fix.value;
        }
      });

      const newReport = runACGTDeterministicAnalysis(updated, currentFormat);
      const scoreAfter = newReport.overall_score;

      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const newLog: IterationLog = {
        id: `iter-${Date.now()}`,
        timestamp: timeStr,
        actionTaken: `Auto-Fix All: ${resolvedCount} masalah estetika & safe-zone diperbaiki`,
        scoreBefore,
        scoreAfter,
        issuesResolvedCount: resolvedCount,
      };

      setIterationHistory((h) => [newLog, ...h]);

      if (scoreAfter >= 90) {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.55 },
        });
      }

      return updated;
    });

    setSelectedIssueId(null);
  };

  // High-Resolution Export
  const handleExport = () => {
    if (currentFormat === 'reels_9_16') {
      setReelsExportTrigger((prev) => prev + 1);
      return;
    }

    // High-Res Static Export for 1:1 and 4:5
    const canvas = document.getElementById('main-interactive-canvas') as HTMLCanvasElement;
    if (canvas) {
      const dataUrl = canvas.toDataURL('image/png', 1.0);
      const link = document.createElement('a');
      link.download = `fyj-${currentFormat}-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      {/* Top Studio Navbar */}
      <Navbar
        currentFormat={currentFormat}
        onFormatChange={(fmt) => {
          setCurrentFormat(fmt);
          setSelectedIssueId(null);
        }}
        showSocialOverlay={showSocialOverlay}
        onToggleSocialOverlay={() => setShowSocialOverlay(!showSocialOverlay)}
        overallScore={report.overall_score}
        issueCount={report.issues.length}
        onAutoFixAll={handleApplyAllFixes}
        onExport={handleExport}
        presets={PRESET_TEMPLATES}
        activePresetId={activePresetId}
        onSelectPreset={handleSelectPreset}
        isCriticOpen={isCriticOpen}
        onToggleCritic={() => setIsCriticOpen(!isCriticOpen)}
        onOpenGeminiAI={() => setIsGeminiModalOpen(true)}
        isMobile={isMobile}
      />

      {/* Main Studio Workspace: Responsive 3-Column on Desktop, Full Single-Column Tabs on Mobile */}
      {!isMobile ? (
        <main
          style={{
            display: 'grid',
            gridTemplateColumns: isCriticOpen ? '320px 1fr 240px' : '320px 1fr',
            height: 'calc(100vh - 58px)',
            overflow: 'hidden',
            transition: 'grid-template-columns 0.3s ease',
          }}
        >
          {/* Left Column: Asset Ingestion Panel */}
          <AssetIngestionPanel
            assets={assets}
            onUpdateProperty={handleUpdateAssetProperty}
            onUpdatePropertiesBatch={handleUpdateAssetsBatch}
            onOpenGeminiAI={() => setIsGeminiModalOpen(true)}
            onApplyFullAssets={(loaded) => setAssets(loaded)}
          />

          {/* Center Column: Viewport & Canvas Engine */}
          <section
            style={{
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#050811',
              backgroundImage:
                'radial-gradient(#1e293b 1px, transparent 1px), radial-gradient(#1e293b 1px, #050811 1px)',
              backgroundSize: '40px 40px',
              backgroundPosition: '0 0, 20px 20px',
              overflow: 'hidden',
            }}
          >
            {currentFormat === 'reels_9_16' ? (
              <ReelsMotionPlayer
                assets={assets}
                issues={report.issues}
                showSocialOverlay={showSocialOverlay}
                exportTrigger={reelsExportTrigger}
                onExportVideo={handleExport}
              />
            ) : (
              <InteractiveCanvas
                assets={assets}
                format={currentFormat}
                issues={report.issues}
                showSocialOverlay={showSocialOverlay}
                selectedIssueId={selectedIssueId}
                onSelectIssue={setSelectedIssueId}
                onApplySingleFix={handleApplySingleFix}
                onUpdateAssetProperty={handleUpdateAssetProperty}
                onUpdateAssetsBatch={handleUpdateAssetsBatch}
              />
            )}
          </section>

          {/* Right Column: ACGT AI Critic Drawer */}
          {isCriticOpen && (
            <CriticDrawer
              report={report}
              selectedIssueId={selectedIssueId}
              onSelectIssue={setSelectedIssueId}
              onApplySingleFix={handleApplySingleFix}
              onApplyAllFixes={handleApplyAllFixes}
              iterationHistory={iterationHistory}
              isOpen={isCriticOpen}
              onClose={() => setIsCriticOpen(false)}
            />
          )}
        </main>
      ) : (
        /* Mobile Dedicated Smartphone Workspace (Full-height tabs with zero squishing) */
        <main
          style={{
            display: 'flex',
            flexDirection: 'column',
            height: 'calc(100vh - 58px - 62px)',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          {/* Mobile Tab 1: Editor Aset */}
          <div
            style={{
              display: mobileActiveTab === 'editor' ? 'flex' : 'none',
              flexDirection: 'column',
              width: '100%',
              height: '100%',
              overflow: 'hidden',
            }}
          >
            <AssetIngestionPanel
              assets={assets}
              onUpdateProperty={handleUpdateAssetProperty}
              onUpdatePropertiesBatch={handleUpdateAssetsBatch}
              onOpenGeminiAI={() => setIsGeminiModalOpen(true)}
              onApplyFullAssets={(loaded) => setAssets(loaded)}
            />
          </div>

          {/* Mobile Tab 2: Kanvas Engine (ALWAYS mounted to preserve Fabric.js state & elements) */}
          <section
            style={{
              display: mobileActiveTab === 'canvas' ? 'flex' : 'none',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: '100%',
              backgroundColor: '#050811',
              backgroundImage:
                'radial-gradient(#1e293b 1px, transparent 1px), radial-gradient(#1e293b 1px, #050811 1px)',
              backgroundSize: '40px 40px',
              backgroundPosition: '0 0, 20px 20px',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            {currentFormat === 'reels_9_16' ? (
              <ReelsMotionPlayer
                assets={assets}
                issues={report.issues}
                showSocialOverlay={showSocialOverlay}
                exportTrigger={reelsExportTrigger}
                onExportVideo={handleExport}
              />
            ) : (
              <InteractiveCanvas
                assets={assets}
                format={currentFormat}
                issues={report.issues}
                showSocialOverlay={showSocialOverlay}
                selectedIssueId={selectedIssueId}
                onSelectIssue={setSelectedIssueId}
                onApplySingleFix={handleApplySingleFix}
                onUpdateAssetProperty={handleUpdateAssetProperty}
                onUpdateAssetsBatch={handleUpdateAssetsBatch}
              />
            )}
          </section>

          {/* Mobile Tab 3: ACGT AI Critic Drawer */}
          <div
            style={{
              display: mobileActiveTab === 'critic' ? 'flex' : 'none',
              flexDirection: 'column',
              width: '100%',
              height: '100%',
              overflow: 'hidden',
            }}
          >
            <CriticDrawer
              report={report}
              selectedIssueId={selectedIssueId}
              onSelectIssue={setSelectedIssueId}
              onApplySingleFix={handleApplySingleFix}
              onApplyAllFixes={handleApplyAllFixes}
              iterationHistory={iterationHistory}
              isOpen={true}
              onClose={() => setMobileActiveTab('canvas')}
            />
          </div>
        </main>
      )}

      {/* Mobile Dedicated Bottom Navigation Tab Bar */}
      {isMobile && (
        <nav
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            height: '62px',
            backgroundColor: 'rgba(7, 11, 20, 0.98)',
            backdropFilter: 'blur(20px)',
            borderTop: '1px solid rgba(255, 255, 255, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
            zIndex: 90,
            padding: '0 6px',
            boxShadow: '0 -6px 24px rgba(0, 0, 0, 0.6)',
          }}
        >
          {/* Tab 1: Kanvas */}
          <button
            onClick={() => setMobileActiveTab('canvas')}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '3px',
              background: mobileActiveTab === 'canvas' ? 'rgba(56, 189, 248, 0.15)' : 'none',
              border: mobileActiveTab === 'canvas' ? '1px solid rgba(56, 189, 248, 0.35)' : '1px solid transparent',
              color: mobileActiveTab === 'canvas' ? '#38BDF8' : '#94A3B8',
              cursor: 'pointer',
              padding: '6px 14px',
              borderRadius: '10px',
              transition: 'all 0.15s ease',
            }}
          >
            <Square size={18} color={mobileActiveTab === 'canvas' ? '#38BDF8' : '#94A3B8'} />
            <span style={{ fontSize: '10.5px', fontWeight: mobileActiveTab === 'canvas' ? 800 : 600 }}>Kanvas</span>
          </button>

          {/* Tab 2: Editor */}
          <button
            onClick={() => setMobileActiveTab('editor')}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '3px',
              background: mobileActiveTab === 'editor' ? 'rgba(168, 85, 247, 0.15)' : 'none',
              border: mobileActiveTab === 'editor' ? '1px solid rgba(168, 85, 247, 0.35)' : '1px solid transparent',
              color: mobileActiveTab === 'editor' ? '#C084FC' : '#94A3B8',
              cursor: 'pointer',
              padding: '6px 14px',
              borderRadius: '10px',
              transition: 'all 0.15s ease',
            }}
          >
            <Sliders size={18} color={mobileActiveTab === 'editor' ? '#C084FC' : '#94A3B8'} />
            <span style={{ fontSize: '10.5px', fontWeight: mobileActiveTab === 'editor' ? 800 : 600 }}>Editor</span>
          </button>

          {/* Tab 3: Critic Score */}
          <button
            onClick={() => setMobileActiveTab('critic')}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '3px',
              background: mobileActiveTab === 'critic' ? 'rgba(16, 185, 129, 0.15)' : 'none',
              border: mobileActiveTab === 'critic' ? '1px solid rgba(16, 185, 129, 0.35)' : '1px solid transparent',
              color: mobileActiveTab === 'critic' ? '#34D399' : '#94A3B8',
              cursor: 'pointer',
              padding: '6px 14px',
              borderRadius: '10px',
              position: 'relative',
              transition: 'all 0.15s ease',
            }}
          >
            <div style={{ position: 'relative' }}>
              <ShieldAlert size={18} color={mobileActiveTab === 'critic' ? '#34D399' : '#94A3B8'} />
              <span
                style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-12px',
                  backgroundColor: report.overall_score >= 90 ? '#10B981' : '#F59E0B',
                  color: '#FFFFFF',
                  fontSize: '9px',
                  fontWeight: 900,
                  padding: '1px 4px',
                  borderRadius: '10px',
                  lineHeight: '1',
                }}
              >
                {report.overall_score}
              </span>
            </div>
            <span style={{ fontSize: '10.5px', fontWeight: mobileActiveTab === 'critic' ? 800 : 600 }}>Critic</span>
          </button>

          {/* Tab 4: Gemini AI */}
          <button
            onClick={() => setIsGeminiModalOpen(true)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '3px',
              background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(139, 92, 246, 0.2))',
              border: '1px solid rgba(56, 189, 248, 0.4)',
              color: '#38BDF8',
              cursor: 'pointer',
              padding: '6px 12px',
              borderRadius: '10px',
              transition: 'all 0.15s ease',
            }}
          >
            <Sparkles size={18} color="#38BDF8" />
            <span style={{ fontSize: '10.5px', fontWeight: 800 }}>Gemini AI</span>
          </button>

          {/* Tab 5: Ekspor */}
          <button
            onClick={handleExport}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '3px',
              background: 'none',
              border: '1px solid transparent',
              color: '#F8FAFC',
              cursor: 'pointer',
              padding: '6px 12px',
              borderRadius: '10px',
              transition: 'all 0.15s ease',
            }}
          >
            <Download size={18} color="#F8FAFC" />
            <span style={{ fontSize: '10.5px', fontWeight: 600 }}>Ekspor</span>
          </button>
        </nav>
      )}

      {/* Google Gemini AI Studio & Parameters Modal */}
      <GeminiAIModal
        isOpen={isGeminiModalOpen}
        onClose={() => setIsGeminiModalOpen(false)}
        assets={assets}
        onApplyGeneratedAssets={handleApplyGeneratedAssets}
      />
    </div>
  );
}
