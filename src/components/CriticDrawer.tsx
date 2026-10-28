'use client';

import React, { useState } from 'react';
import {
  ACGTReport,
  CriticIssue,
  AutoFixAction,
  IterationLog,
} from '@/types/design';
import {
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  Info,
  Wand2,
  Cpu,
  History,
  Code2,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

interface CriticDrawerProps {
  report: ACGTReport;
  selectedIssueId: string | null;
  onSelectIssue: (issueId: string | null) => void;
  onApplySingleFix: (action: AutoFixAction) => void;
  onApplyAllFixes: () => void;
  iterationHistory: IterationLog[];
  isOpen: boolean;
  onClose?: () => void;
}

export const CriticDrawer: React.FC<CriticDrawerProps> = ({
  report,
  selectedIssueId,
  onSelectIssue,
  onApplySingleFix,
  onApplyAllFixes,
  iterationHistory,
  isOpen,
}) => {
  const [activeTab, setActiveTab] = useState<'issues' | 'metrics' | 'history' | 'schema'>('issues');

  if (!isOpen) return null;

  const getScoreColor = (score: number) => {
    if (score >= 90) return '#10B981';
    if (score >= 70) return '#F59E0B';
    return '#F43F5E';
  };

  const scoreColor = getScoreColor(report.overall_score);
  const strokeDashoffset = 283 - (283 * report.overall_score) / 100;

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
        borderRight: 'none',
        backgroundColor: 'rgba(10, 16, 31, 0.92)',
        overflow: 'hidden',
      }}
    >
      {/* Header with Circular Score Gauge */}
      <div
        style={{
          padding: '20px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          background: 'radial-gradient(circle at top right, rgba(56, 189, 248, 0.08), transparent 70%)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <div>
            <div style={{ fontSize: '15px', fontWeight: 800, letterSpacing: '-0.2px' }}>
              ACGT Visual Critic
            </div>
            <div style={{ fontSize: '11px', color: '#94A3B8' }}>
              Dual-Layer MLLM & Deterministic Engine
            </div>
          </div>

          {/* Engine Mode Badge */}
          <div
            className="glass-pill"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              fontSize: '11px',
              color: '#38BDF8',
              border: '1px solid rgba(56, 189, 248, 0.3)',
            }}
          >
            <Cpu size={13} />
            <span>Fallback Engine (WCAG 2.1)</span>
          </div>
        </div>

        {/* Score Gauge & Category Breakdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {/* Circular Progress Gauge */}
          <div style={{ position: 'relative', width: '84px', height: '84px', flexShrink: 0 }}>
            <svg width="84" height="84" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="rgba(255, 255, 255, 0.08)"
                strokeWidth="8"
              />
              <circle
                className="score-circle"
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke={scoreColor}
                strokeWidth="8"
                strokeDasharray="283"
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                transform="rotate(-90 50 50)"
              />
            </svg>
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span style={{ fontSize: '24px', fontWeight: 900, color: scoreColor, lineHeight: 1 }}>
                {report.overall_score}
              </span>
              <span style={{ fontSize: '9px', fontWeight: 700, color: '#94A3B8', marginTop: '2px' }}>
                SKOR DESAIN
              </span>
            </div>
          </div>

          {/* 4 Pillar Category Mini-Progress Bars */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '2px' }}>
                <span style={{ color: '#CBD5E1' }}>Kontras Warna</span>
                <span style={{ fontWeight: 700, color: getScoreColor(report.category_scores.contrast) }}>
                  {report.category_scores.contrast}%
                </span>
              </div>
              <div style={{ height: '4px', background: 'rgba(255,255,255,0.08)', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{ width: `${report.category_scores.contrast}%`, height: '100%', background: getScoreColor(report.category_scores.contrast) }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '2px' }}>
                <span style={{ color: '#CBD5E1' }}>Hierarki Tipografi</span>
                <span style={{ fontWeight: 700, color: getScoreColor(report.category_scores.hierarchy) }}>
                  {report.category_scores.hierarchy}%
                </span>
              </div>
              <div style={{ height: '4px', background: 'rgba(255,255,255,0.08)', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{ width: `${report.category_scores.hierarchy}%`, height: '100%', background: getScoreColor(report.category_scores.hierarchy) }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '2px' }}>
                <span style={{ color: '#CBD5E1' }}>Safe-Zone & Spasial</span>
                <span style={{ fontWeight: 700, color: getScoreColor(report.category_scores.spatial_balance) }}>
                  {report.category_scores.spatial_balance}%
                </span>
              </div>
              <div style={{ height: '4px', background: 'rgba(255,255,255,0.08)', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{ width: `${report.category_scores.spatial_balance}%`, height: '100%', background: getScoreColor(report.category_scores.spatial_balance) }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '2px' }}>
                <span style={{ color: '#CBD5E1' }}>Kerapatan Visual</span>
                <span style={{ fontWeight: 700, color: getScoreColor(report.category_scores.visual_density) }}>
                  {report.category_scores.visual_density}%
                </span>
              </div>
              <div style={{ height: '4px', background: 'rgba(255,255,255,0.08)', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{ width: `${report.category_scores.visual_density}%`, height: '100%', background: getScoreColor(report.category_scores.visual_density) }} />
              </div>
            </div>
          </div>
        </div>

        {/* 1-Click Auto Fix All Banner Button */}
        {report.issues.length > 0 && (
          <button
            onClick={onApplyAllFixes}
            className="btn btn-autofix"
            style={{ width: '100%', marginTop: '16px', padding: '10px 14px' }}
          >
            <Wand2 size={16} />
            <span>Perbaiki Semua Otomatis ({report.issues.length} Isu)</span>
          </button>
        )}
      </div>

      {/* Tabs */}
      <div
        style={{
          display: 'flex',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
        }}
      >
        <button
          onClick={() => setActiveTab('issues')}
          style={{
            flex: 1,
            padding: '10px',
            fontSize: '12px',
            fontWeight: 600,
            background: 'none',
            border: 'none',
            color: activeTab === 'issues' ? '#38BDF8' : '#94A3B8',
            borderBottom: activeTab === 'issues' ? '2px solid #38BDF8' : '2px solid transparent',
            cursor: 'pointer',
          }}
        >
          Daftar Isu ({report.issues.length})
        </button>

        <button
          onClick={() => setActiveTab('metrics')}
          style={{
            flex: 1,
            padding: '10px',
            fontSize: '12px',
            fontWeight: 600,
            background: 'none',
            border: 'none',
            color: activeTab === 'metrics' ? '#38BDF8' : '#94A3B8',
            borderBottom: activeTab === 'metrics' ? '2px solid #38BDF8' : '2px solid transparent',
            cursor: 'pointer',
          }}
        >
          Metrik ACGT
        </button>

        <button
          onClick={() => setActiveTab('history')}
          style={{
            flex: 1,
            padding: '10px',
            fontSize: '12px',
            fontWeight: 600,
            background: 'none',
            border: 'none',
            color: activeTab === 'history' ? '#38BDF8' : '#94A3B8',
            borderBottom: activeTab === 'history' ? '2px solid #38BDF8' : '2px solid transparent',
            cursor: 'pointer',
          }}
        >
          Log Iterasi
        </button>

        <button
          onClick={() => setActiveTab('schema')}
          style={{
            flex: 1,
            padding: '10px',
            fontSize: '12px',
            fontWeight: 600,
            background: 'none',
            border: 'none',
            color: activeTab === 'schema' ? '#38BDF8' : '#94A3B8',
            borderBottom: activeTab === 'schema' ? '2px solid #38BDF8' : '2px solid transparent',
            cursor: 'pointer',
          }}
        >
          JSON Schema
        </button>
      </div>

      {/* Tab Contents */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {/* TAB 1: ISSUES LIST */}
        {activeTab === 'issues' && (
          <>
            {report.issues.length === 0 ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '40px 16px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                <div
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(16, 185, 129, 0.15)',
                    border: '1px solid rgba(16, 185, 129, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <CheckCircle2 size={32} color="#10B981" />
                </div>
                <div style={{ fontWeight: 800, fontSize: '15px', color: '#F8FAFC' }}>
                  Komposisi Sempurna!
                </div>
                <div style={{ fontSize: '12px', color: '#94A3B8', maxWidth: '240px', lineHeight: '1.5' }}>
                  Semua kriteria kontras WCAG 2.1 AA, hierarki tipografi, batas area aman, dan kepadatan visual telah lolos audit standar desain profesional.
                </div>
              </div>
            ) : (
              report.issues.map((iss) => {
                const isSelected = selectedIssueId === iss.issue_id;
                return (
                  <div
                    key={iss.issue_id}
                    onClick={() => onSelectIssue(isSelected ? null : iss.issue_id)}
                    style={{
                      backgroundColor: isSelected ? 'rgba(56, 189, 248, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                      border: `1px solid ${
                        isSelected
                          ? '#38BDF8'
                          : iss.severity === 'high'
                          ? 'rgba(244, 63, 94, 0.3)'
                          : 'rgba(255, 255, 255, 0.08)'
                      }`,
                      borderRadius: '12px',
                      padding: '14px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span className={`badge badge-${iss.severity}`}>{iss.severity}</span>
                        <span style={{ fontSize: '12px', fontWeight: 700, color: '#F8FAFC' }}>
                          {iss.issue_id}
                        </span>
                      </div>
                      <span style={{ fontSize: '11px', color: '#94A3B8', textTransform: 'capitalize' }}>
                        {iss.category.replace('_', ' ')}
                      </span>
                    </div>

                    <div style={{ fontSize: '12px', color: '#CBD5E1', lineHeight: '1.45', marginBottom: '10px' }}>
                      {iss.description}
                    </div>

                    {/* Auto Fix Button */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '8px', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
                      <div style={{ fontSize: '11px', color: '#94A3B8' }}>
                        Target: <span style={{ color: '#38BDF8', fontWeight: 600 }}>{iss.target_layer}</span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onApplySingleFix({
                            layerId: iss.target_layer,
                            property: iss.auto_fix.property,
                            value: iss.auto_fix.value,
                            description: iss.auto_fix.description,
                          });
                        }}
                        className="btn btn-autofix"
                        style={{ padding: '4px 10px', fontSize: '11px' }}
                      >
                        <Wand2 size={12} />
                        <span>Terapkan Fix</span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </>
        )}

        {/* TAB 2: DETAILED METRICS */}
        {activeTab === 'metrics' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '12px' }}>
            <div className="glass-panel" style={{ padding: '14px' }}>
              <div style={{ fontWeight: 700, color: '#38BDF8', marginBottom: '8px' }}>
                1. WCAG 2.1 Contrast Analysis
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', color: '#CBD5E1' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Headline vs Background:</span>
                  <span style={{ fontWeight: 700, color: (report.contrast_metrics?.headlineRatio || 0) >= 4.5 ? '#10B981' : '#F43F5E' }}>
                    {report.contrast_metrics?.headlineRatio}:1 (Min 4.5:1)
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Subtitle vs Background:</span>
                  <span style={{ fontWeight: 700, color: (report.contrast_metrics?.subtitleRatio || 0) >= 4.5 ? '#10B981' : '#F59E0B' }}>
                    {report.contrast_metrics?.subtitleRatio}:1
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Date Badge Contrast:</span>
                  <span style={{ fontWeight: 700, color: '#10B981' }}>
                    {report.contrast_metrics?.dateRatio}:1
                  </span>
                </div>
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '14px' }}>
              <div style={{ fontWeight: 700, color: '#C084FC', marginBottom: '8px' }}>
                2. Hierarki Tipografi (Typography Ratio)
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', color: '#CBD5E1' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Headline : Subtitle Ratio:</span>
                  <span style={{ fontWeight: 700, color: (report.typography_metrics?.headlineToSubRatio || 0) >= 1.8 ? '#10B981' : '#F59E0B' }}>
                    {report.typography_metrics?.headlineToSubRatio}x
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Standar Ideal Desain:</span>
                  <span style={{ fontWeight: 700, color: '#94A3B8' }}>2.0x - 2.5x</span>
                </div>
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '14px' }}>
              <div style={{ fontWeight: 700, color: '#34D399', marginBottom: '8px' }}>
                3. Kerapatan Visual (Canvas Density)
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', color: '#CBD5E1' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Total Area Terisi:</span>
                  <span style={{ fontWeight: 700, color: '#34D399' }}>
                    {report.density_metrics?.filledPercent}%
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Rentang Optimal PRD:</span>
                  <span style={{ fontWeight: 700, color: '#94A3B8' }}>30% - 70%</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ITERATION TRACKING (TRACK PHASE) */}
        {activeTab === 'history' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {iterationHistory.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '30px 10px', color: '#94A3B8', fontSize: '12px' }}>
                Belum ada iterasi tercatat. Terapkan Auto-Fix atau modifikasi elemen untuk melacak perkembangan kualitas desain.
              </div>
            ) : (
              iterationHistory.map((log, index) => (
                <div
                  key={log.id}
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '10px',
                    padding: '12px',
                    fontSize: '12px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94A3B8', marginBottom: '4px' }}>
                    <span>Iterasi #{iterationHistory.length - index}</span>
                    <span>{log.timestamp}</span>
                  </div>
                  <div style={{ fontWeight: 600, color: '#F8FAFC', marginBottom: '6px' }}>
                    {log.actionTaken}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: '#F43F5E', fontWeight: 700 }}>{log.scoreBefore}</span>
                    <TrendingUp size={14} color="#10B981" />
                    <span style={{ color: '#10B981', fontWeight: 800 }}>{log.scoreAfter}</span>
                    <span className="badge badge-success" style={{ marginLeft: 'auto' }}>
                      +{log.scoreAfter - log.scoreBefore} Poin
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 4: PRD MACHINE-READABLE JSON SCHEMA PREVIEW */}
        {activeTab === 'schema' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ fontSize: '11px', color: '#94A3B8' }}>
              Format data JSON terstruktur sesuai spesifikasi PRD Section 3.3 untuk memfasilitasi integrasi MLLM & Auto-Fix terprogram:
            </div>
            <pre
              style={{
                backgroundColor: '#050811',
                padding: '12px',
                borderRadius: '8px',
                fontSize: '11px',
                fontFamily: 'var(--font-mono)',
                color: '#38BDF8',
                overflowX: 'auto',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                maxHeight: '380px',
              }}
            >
              {JSON.stringify(
                {
                  overall_score: report.overall_score,
                  issues: report.issues.map((i) => ({
                    issue_id: i.issue_id,
                    category: i.category,
                    severity: i.severity,
                    target_layer: i.target_layer,
                    bounding_box: i.bounding_box,
                    description: i.description,
                    auto_fix: i.auto_fix,
                  })),
                  engine_mode: report.mode,
                  latency_ms: report.engine_latency_ms,
                },
                null,
                2
              )}
            </pre>
          </div>
        )}
      </div>
    </aside>
  );
};
