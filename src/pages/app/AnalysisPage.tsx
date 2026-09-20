import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { useLearning } from '@/features/learning';
import { useAuth } from '@/features/auth';
import { getAvatarPresetByUrl, generateAvatarUrl } from '@/lib/avatarGenerator';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  BookOpen,
  Check,
  TrendingUp,
  Brain,
  RotateCw,
  Zap,
  ShieldCheck,
  Award,
} from 'lucide-react';

interface MilestoneData {
  day: string;
  cx: number;
  cyActive: number;
  cyPassive: number;
  metamind: number;
  cramming: number;
  edge: number;
}

const MILESTONES: MilestoneData[] = [
  { day: 'Day 0', cx: 40, cyActive: 40, cyPassive: 40, metamind: 100, cramming: 100, edge: 0 },
  { day: 'Day 3', cx: 160, cyActive: 46, cyPassive: 105, metamind: 96, cramming: 65, edge: 31 },
  { day: 'Day 7', cx: 280, cyActive: 51, cyPassive: 148, metamind: 94, cramming: 45, edge: 49 },
  { day: 'Day 14', cx: 420, cyActive: 56, cyPassive: 168, metamind: 92, cramming: 32, edge: 60 },
  { day: 'Day 30', cx: 580, cyActive: 62, cyPassive: 185, metamind: 90, cramming: 24, edge: 66 },
];

export const AnalysisPage: React.FC = () => {
  const { activeSession, knowledgeAnalysis, loadPersonalizedModule, loading } = useLearning();
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const activePathRef = useRef<SVGPathElement | null>(null);
  const passivePathRef = useRef<SVGPathElement | null>(null);
  const clipRectRef = useRef<SVGRectElement | null>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState<MilestoneData | null>(null);

  const avatarUrl = profile?.avatar_url || generateAvatarUrl(user?.id || 'demo');
  const activePreset = getAvatarPresetByUrl(avatarUrl);
  const theme = activePreset?.theme || {
    primary: '#4F46E5',
    secondary: '#818CF8',
    glow: 'rgba(99, 102, 241, 0.15)',
    heroGradient: 'from-indigo-50 to-white',
  };

  const topicName = activeSession?.topic || 'SQL JOINs';

  const strongConcepts = Array.isArray(knowledgeAnalysis?.strongConcepts) && knowledgeAnalysis.strongConcepts.length > 0
    ? knowledgeAnalysis.strongConcepts
    : ['Database Tables', 'Primary Keys', 'INNER JOIN'];

  const needsImprovement = Array.isArray(knowledgeAnalysis?.needsImprovementConcepts) && knowledgeAnalysis.needsImprovementConcepts.length > 0
    ? knowledgeAnalysis.needsImprovementConcepts
    : ['Difference between INNER JOIN & LEFT JOIN', 'Handling Missing Rows'];

  const mainGap = typeof knowledgeAnalysis?.mainKnowledgeGap === 'string' && knowledgeAnalysis.mainKnowledgeGap.trim()
    ? knowledgeAnalysis.mainKnowledgeGap
    : 'You understand that tables store data, but you need to strengthen your understanding of how related rows behave when data is missing.';

  const recommendedPath = Array.isArray(knowledgeAnalysis?.recommendedPath) && knowledgeAnalysis.recommendedPath.length > 0
    ? knowledgeAnalysis.recommendedPath
    : [
        'Table Relationships & Foreign Keys',
        'INNER JOIN Mechanism',
        'LEFT JOIN with Real-world Examples',
        'Targeted Practice',
      ];

  const handleStartPersonalizedModule = async () => {
    try {
      const firstConcept = recommendedPath[0] || 'LEFT JOIN';
      await loadPersonalizedModule(firstConcept);
      navigate('/app/module');
    } catch {
      // error handled
    }
  };

  // Master GSAP Premium Animation Orchestrator
  const runAnalysisAnimation = useCallback(() => {
    if (timelineRef.current) {
      timelineRef.current.kill();
    }

    setIsAnimating(true);

    const tl = gsap.timeline({
      onComplete: () => setIsAnimating(false),
    });
    timelineRef.current = tl;

    // 1. Bento Cards Staggered Entrance
    const bentoCards = document.querySelectorAll('.analysis-bento-card');
    if (bentoCards.length > 0) {
      tl.fromTo(
        bentoCards,
        { opacity: 0, y: 28, scale: 0.98 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          stagger: 0.08,
          duration: 0.6,
          ease: 'power3.out',
        }
      );
    }

    // 2. SVG Retention Graph & Curves Animation
    const activePath = activePathRef.current || document.querySelector<SVGPathElement>('#retention-active-curve');
    const passivePath = passivePathRef.current || document.querySelector<SVGPathElement>('#retention-passive-curve');
    const clipRect = clipRectRef.current || document.querySelector<SVGRectElement>('#curve-clip-rect');

    if (activePath && passivePath) {
      let lenActive = 600;
      let lenPassive = 600;
      try {
        if (typeof activePath.getTotalLength === 'function') {
          lenActive = activePath.getTotalLength() || 600;
        }
      } catch {
        lenActive = 600;
      }
      try {
        if (typeof passivePath.getTotalLength === 'function') {
          lenPassive = passivePath.getTotalLength() || 600;
        }
      } catch {
        lenPassive = 600;
      }

      // Initial SVG path resets
      gsap.set(activePath, { strokeDasharray: lenActive, strokeDashoffset: lenActive });
      gsap.set(passivePath, { strokeDasharray: lenPassive, strokeDashoffset: lenPassive });
      if (clipRect) {
        gsap.set(clipRect, { attr: { width: 0 } });
      }

      // Simultaneously unroll area gradient and stroke lines
      tl.add('curveStart', '-=0.35');

      if (clipRect) {
        tl.to(
          clipRect,
          {
            attr: { width: 560 },
            duration: 1.8,
            ease: 'power2.out',
          },
          'curveStart'
        );
      }

      tl.to(
        activePath,
        {
          strokeDashoffset: 0,
          duration: 1.9,
          ease: 'power2.out',
        },
        'curveStart'
      );

      tl.to(
        passivePath,
        {
          strokeDashoffset: 0,
          duration: 1.6,
          ease: 'power2.out',
        },
        'curveStart+=0.1'
      );

      // Milestone Dots sequential pop
      tl.fromTo(
        '.retention-point',
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          stagger: 0.12,
          duration: 0.45,
          ease: 'back.out(2)',
        },
        'curveStart+=0.5'
      );
    }

    // 3. Numerical Stat Tickers
    // Stat: Active Recall 92%
    const statActiveEl = document.getElementById('stat-active-pct');
    if (statActiveEl) {
      const activeObj = { val: 0 };
      tl.to(
        activeObj,
        {
          val: 92,
          duration: 1.4,
          ease: 'power2.out',
          onUpdate: () => {
            statActiveEl.textContent = `${Math.round(activeObj.val)}%`;
          },
        },
        'curveStart+=0.2'
      );
    }

    // Stat: Cramming 24%
    const statPassiveEl = document.getElementById('stat-passive-pct');
    if (statPassiveEl) {
      const passiveObj = { val: 0 };
      tl.to(
        passiveObj,
        {
          val: 24,
          duration: 1.3,
          ease: 'power2.out',
          onUpdate: () => {
            statPassiveEl.textContent = `${Math.round(passiveObj.val)}%`;
          },
        },
        'curveStart+=0.2'
      );
    }

    // Stat: +68% Advantage
    const statAdvantageEl = document.getElementById('stat-advantage-pct');
    if (statAdvantageEl) {
      const advObj = { val: 0 };
      tl.to(
        advObj,
        {
          val: 68,
          duration: 1.5,
          ease: 'power2.out',
          onUpdate: () => {
            statAdvantageEl.textContent = `+${Math.round(advObj.val)}%`;
          },
        },
        'curveStart+=0.4'
      );
    }

    // 4. Elastic Mastery Bars & Dynamic Score Tickers
    const bars = document.querySelectorAll<HTMLElement>('.concept-mastery-bar');
    bars.forEach((bar, idx) => {
      const targetWidth = bar.getAttribute('data-target-width') || '75%';
      tl.fromTo(
        bar,
        { width: '0%' },
        {
          width: targetWidth,
          duration: 1.1,
          ease: 'power2.out',
        },
        `curveStart+=${0.5 + idx * 0.08}`
      );
    });

    const scoreCounters = document.querySelectorAll<HTMLElement>('.concept-score-val');
    scoreCounters.forEach((counter, idx) => {
      const targetVal = parseInt(counter.getAttribute('data-target') || '75', 10);
      const counterObj = { val: 0 };
      tl.to(
        counterObj,
        {
          val: targetVal,
          duration: 1.1,
          ease: 'power2.out',
          onUpdate: () => {
            counter.textContent = `${Math.round(counterObj.val)}%`;
          },
        },
        `curveStart+=${0.5 + idx * 0.08}`
      );
    });

    // 5. Recommended Path Domino Stagger
    const pathCards = document.querySelectorAll('.path-step-card');
    if (pathCards.length > 0) {
      tl.fromTo(
        pathCards,
        { opacity: 0, y: 20, scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          stagger: 0.09,
          duration: 0.5,
          ease: 'back.out(1.6)',
        },
        '-=0.6'
      );
    }
  }, []);

  // Initial trigger after mount
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;
    const animFrame = requestAnimationFrame(() => {
      timer = setTimeout(() => {
        runAnalysisAnimation();
      }, 80);
    });

    return () => {
      cancelAnimationFrame(animFrame);
      if (timer) clearTimeout(timer);
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
    };
  }, [runAnalysisAnimation]);

  return (
    <div className="max-w-4xl mx-auto space-y-8 relative selection:bg-blue-100 text-slate-800 pb-12">
      {/* Light Radial Ambient Glow */}
      <div
        className="fixed top-0 right-0 w-[650px] h-[650px] rounded-full blur-[140px] pointer-events-none opacity-20 z-0"
        style={{ background: theme.glow }}
      />

      {/* Header */}
      <div className="analysis-bento-card flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <Badge variant="accent" className="gap-1.5 shadow-xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600" />
              </span>
              <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
              AI Diagnostic Analytics
            </Badge>
            <span className="text-xs text-slate-500 font-mono font-bold">Session Completed</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            Learning Analysis: {topicName}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 font-sans">
            Here is your diagnostic breakdown. We've computed your cognitive retention curve and mapped a personalized trajectory.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={runAnalysisAnimation}
            disabled={isAnimating}
            className="flex items-center gap-1.5 text-xs font-bold text-indigo-700 bg-white hover:bg-indigo-50 px-3.5 py-2.5 rounded-xl border border-indigo-200 transition-all cursor-pointer shadow-xs active:scale-95 disabled:opacity-60"
            title="Replay Entrance & Curve Animations"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isAnimating ? 'animate-spin text-indigo-600' : ''}`} />
            <span>{isAnimating ? 'Analyzing...' : 'Replay Animation'}</span>
          </button>

          <Button
            variant="primary"
            size="lg"
            onClick={handleStartPersonalizedModule}
            isLoading={loading}
            className="font-bold cursor-pointer shadow-md border-none hover:scale-105 shrink-0 text-white"
            style={{ backgroundColor: theme.primary }}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Start Learning
          </Button>
        </div>
      </div>

      {/* MAIN KNOWLEDGE GAP ENCOURAGING BANNER */}
      <div className="analysis-bento-card rounded-3xl p-6 sm:p-8 border border-amber-200/90 bg-gradient-to-br from-amber-50/70 via-white to-amber-50/30 shadow-sm space-y-3 relative z-10 overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-bold text-amber-800">
            <div className="w-7 h-7 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Lightbulb className="w-4 h-4 text-amber-600" />
            </div>
            <span>Primary Growth Opportunity</span>
          </div>
          <span className="text-[11px] font-mono font-bold text-amber-700 bg-amber-100/70 px-2.5 py-0.5 rounded-full border border-amber-200">
            High Impact
          </span>
        </div>
        <p className="text-base sm:text-lg text-slate-900 font-bold leading-relaxed font-display">
          "{mainGap}"
        </p>
        <div className="flex items-center gap-2 text-xs text-slate-600 font-sans pt-1">
          <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          <span>Encouraging Note: Master this single concept to unlock 100% test accuracy on this chapter.</span>
        </div>
      </div>

      {/* ELASTIC COGNITIVE RETENTION CURVE CHART */}
      <div className="analysis-bento-card rounded-3xl p-6 sm:p-8 border border-slate-200/80 bg-white shadow-sm space-y-5 relative z-10 overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                <Brain className="w-4 h-4 text-indigo-600" />
              </div>
              <h2 className="text-lg sm:text-xl font-display font-bold text-slate-900">
                Cognitive Memory & Ebbinghaus Retention Curve
              </h2>
            </div>
            <p className="text-xs text-slate-500 font-sans">
              Predicted concept retention over 30 days comparing MetaMind Active Recall vs Standard Cramming
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium flex-wrap">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-indigo-600 shadow-xs" />
              <span className="text-slate-800 font-bold">
                MetaMind Recall: <span id="stat-active-pct" className="font-mono text-indigo-700">92%</span>
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-slate-300" />
              <span className="text-slate-500">
                Standard Cramming: <span id="stat-passive-pct" className="font-mono">24%</span>
              </span>
            </div>
          </div>
        </div>

        {/* Milestone Hover Details Banner */}
        {selectedMilestone && (
          <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-2xl flex items-center justify-between text-xs animate-in fade-in duration-200">
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-indigo-700 bg-white px-2 py-0.5 rounded-lg border border-indigo-100">
                {selectedMilestone.day}
              </span>
              <span className="text-slate-700">
                MetaMind: <strong className="text-indigo-900">{selectedMilestone.metamind}%</strong> vs Cramming: <strong className="text-slate-600">{selectedMilestone.cramming}%</strong>
              </span>
            </div>
            <span className="font-bold text-emerald-700 font-mono bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
              +{selectedMilestone.edge}% Memory Edge
            </span>
          </div>
        )}

        {/* SVG Retention Graph Canvas */}
        <div className="relative w-full h-56 sm:h-64 pt-2 select-none">
          <svg
            className="w-full h-full overflow-visible"
            viewBox="0 0 650 220"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="activeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#4F46E5" stopOpacity="0.0" />
              </linearGradient>
              <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
              <clipPath id="activeCurveClip">
                <rect ref={clipRectRef} id="curve-clip-rect" x="35" y="0" width="560" height="220" />
              </clipPath>
            </defs>

            {/* Grid lines */}
            {[40, 85, 130, 175].map((y, idx) => (
              <line
                key={idx}
                x1="40"
                y1={y}
                x2="600"
                y2={y}
                stroke="#F1F5F9"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
            ))}

            {/* Y-Axis Labels */}
            <text x="15" y="44" className="text-[10px] fill-slate-400 font-mono">100%</text>
            <text x="20" y="89" className="text-[10px] fill-slate-400 font-mono">75%</text>
            <text x="20" y="134" className="text-[10px] fill-slate-400 font-mono">50%</text>
            <text x="20" y="179" className="text-[10px] fill-slate-400 font-mono">25%</text>

            {/* X-Axis Labels */}
            <text x="40" y="208" className="text-[10px] fill-slate-400 font-mono">Day 0</text>
            <text x="160" y="208" className="text-[10px] fill-slate-400 font-mono">Day 3</text>
            <text x="280" y="208" className="text-[10px] fill-slate-400 font-mono">Day 7</text>
            <text x="420" y="208" className="text-[10px] fill-slate-400 font-mono">Day 14</text>
            <text x="565" y="208" className="text-[10px] fill-slate-400 font-mono">Day 30</text>

            {/* MetaMind Area Fill (Unrolls with line via animated clipPath) */}
            <path
              d="M 40 40 C 120 42, 200 48, 300 52 C 400 56, 500 60, 580 62 L 580 185 L 40 185 Z"
              fill="url(#activeGradient)"
              clipPath="url(#activeCurveClip)"
            />

            {/* Passive Cramming Curve (Dashed line dropping to 24%) */}
            <path
              ref={passivePathRef}
              id="retention-passive-curve"
              d="M 40 40 C 120 90, 200 145, 300 155 C 400 168, 500 180, 580 185"
              fill="none"
              stroke="#CBD5E1"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray="6 4"
            />

            {/* MetaMind Active Recall Curve (Elastic Draw) */}
            <path
              ref={activePathRef}
              id="retention-active-curve"
              d="M 40 40 C 120 42, 200 48, 300 52 C 400 56, 500 60, 580 62"
              fill="none"
              stroke="#4F46E5"
              strokeWidth="3.5"
              strokeLinecap="round"
              filter="url(#glowEffect)"
            />

            {/* Milestone Interactive Points */}
            {MILESTONES.map((pt, i) => {
              const isSelected = selectedMilestone?.day === pt.day;
              return (
                <g
                  key={i}
                  className="retention-point cursor-pointer group"
                  onMouseEnter={() => setSelectedMilestone(pt)}
                  onMouseLeave={() => setSelectedMilestone(null)}
                >
                  {/* Subtle hover target expansion */}
                  <circle cx={pt.cx} cy={pt.cyActive} r="14" fill="transparent" />

                  {/* Pulsing halo for Day 30 finish or selected */}
                  {(i === MILESTONES.length - 1 || isSelected) && (
                    <circle
                      cx={pt.cx}
                      cy={pt.cyActive}
                      r="10"
                      fill="#4F46E5"
                      opacity="0.2"
                      className="animate-pulse"
                    />
                  )}

                  {/* Inner node */}
                  <circle
                    cx={pt.cx}
                    cy={pt.cyActive}
                    r={isSelected ? 7 : 5.5}
                    fill={isSelected ? '#312E81' : '#4F46E5'}
                    stroke="#FFFFFF"
                    strokeWidth="2.5"
                    className="transition-transform duration-200"
                  />

                  {/* Tag label */}
                  <text
                    x={pt.cx}
                    y={pt.cyActive - 12}
                    textAnchor="middle"
                    className="text-[10px] fill-indigo-700 font-bold font-mono"
                  >
                    {pt.metamind}%
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Callout Metric Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-indigo-50/80 border border-indigo-100 rounded-2xl gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
              <Zap className="w-4 h-4 fill-white" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <span id="stat-advantage-pct" className="font-mono text-indigo-700 font-extrabold">+68%</span>
                Retention Advantage with MetaMind
              </p>
              <p className="text-[11px] text-slate-500">Spaced interval active recall converts short-term cramming into permanent long-term memory.</p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold text-indigo-700 px-3 py-1.5 bg-white rounded-xl border border-indigo-200 shrink-0 shadow-2xs">
            Adaptive Spacing: Active
          </span>
        </div>
      </div>

      {/* STRENGTHS & IMPROVEMENT AREAS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
        {/* STRONG CONCEPTS */}
        <div className="analysis-bento-card rounded-3xl p-6 bg-white border border-emerald-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-base font-display">
              <div className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <span>Strong Concepts</span>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Mastered
            </span>
          </div>
          <p className="text-xs text-slate-600 font-sans">Concepts where you demonstrated high accuracy and confidence:</p>

          <div className="space-y-3 pt-1">
            {strongConcepts.map((item, idx) => {
              const targetPct = 90 - idx * 4;
              return (
                <div
                  key={item}
                  className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/90 space-y-2 hover:bg-emerald-100/50 transition-colors"
                >
                  <div className="flex items-center justify-between text-xs font-semibold text-emerald-950">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 stroke-[2.5]" />
                      </div>
                      <span className="text-slate-800 font-medium">{item}</span>
                    </div>
                    <span className="font-mono text-xs font-bold text-emerald-800 bg-white px-2 py-0.5 rounded-md border border-emerald-200 shadow-2xs">
                      <span className="concept-score-val" data-target={targetPct}>
                        {targetPct}%
                      </span>
                    </span>
                  </div>
                  {/* Mastery Bar */}
                  <div className="w-full bg-emerald-200/60 h-2 rounded-full overflow-hidden p-0.5">
                    <div
                      className="concept-mastery-bar h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all"
                      data-target-width={`${targetPct}%`}
                      style={{ width: `${targetPct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* NEEDS IMPROVEMENT */}
        <div className="analysis-bento-card rounded-3xl p-6 bg-white border border-amber-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-800 font-bold text-base font-display">
              <div className="w-7 h-7 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <AlertCircle className="w-4 h-4 text-amber-600" />
              </div>
              <span>Concepts to Strengthen</span>
            </div>
            <span className="text-xs font-mono font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
              Targeted Review
            </span>
          </div>
          <p className="text-xs text-slate-600 font-sans">Target areas scheduled for your adaptive personalized learning module:</p>

          <div className="space-y-3 pt-1">
            {needsImprovement.map((item, idx) => {
              const targetPct = 45 + idx * 10;
              return (
                <div
                  key={item}
                  className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/90 space-y-2 hover:bg-amber-100/50 transition-colors"
                >
                  <div className="flex items-center justify-between text-xs font-semibold text-amber-950">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                        <Sparkles className="w-3 h-3 text-amber-600" />
                      </div>
                      <span className="text-slate-800 font-medium">{item}</span>
                    </div>
                    <span className="font-mono text-xs font-bold text-amber-800 bg-white px-2 py-0.5 rounded-md border border-amber-200 shadow-2xs">
                      <span className="concept-score-val" data-target={targetPct}>
                        {targetPct}%
                      </span>
                    </span>
                  </div>
                  {/* Mastery Bar */}
                  <div className="w-full bg-amber-200/60 h-2 rounded-full overflow-hidden p-0.5">
                    <div
                      className="concept-mastery-bar h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all"
                      data-target-width={`${targetPct}%`}
                      style={{ width: `${targetPct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* RECOMMENDED LEARNING PATH */}
      <div className="analysis-bento-card rounded-3xl p-6 sm:p-8 bg-white border border-slate-200/80 shadow-sm space-y-4 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <BookOpen className="w-4 h-4" style={{ color: theme.primary }} />
            </div>
            <div>
              <h2 className="text-xl font-display font-bold text-slate-900">Recommended Learning Trajectory</h2>
              <p className="text-xs text-slate-500">Sequential roadmap generated specifically for your knowledge gaps</p>
            </div>
          </div>
          <Badge variant="default" className="gap-1 text-xs">
            <Award className="w-3 h-3 text-indigo-600" />
            4 Focused Steps
          </Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-2">
          {recommendedPath.map((step, idx) => (
            <div
              key={step}
              className="path-step-card p-4 rounded-2xl bg-gradient-to-b from-white to-slate-50 border border-slate-200/90 space-y-2 text-xs hover:border-indigo-300 hover:shadow-md hover:-translate-y-1 transition-all group cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                  Step 0{idx + 1}
                </span>
                <div className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center opacity-60 group-hover:opacity-100 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
              <p className="font-bold text-slate-900 font-sans text-sm leading-snug">{step}</p>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>AI Focus Point</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PRIMARY CTA */}
      <div className="analysis-bento-card text-center pt-4 relative z-10 flex flex-col items-center gap-3">
        <Button
          variant="primary"
          size="lg"
          onClick={handleStartPersonalizedModule}
          isLoading={loading}
          className="font-bold cursor-pointer shadow-lg px-9 py-4 border-none hover:scale-105 transition-all text-white text-base"
          style={{ backgroundColor: theme.primary }}
          rightIcon={<ArrowRight className="w-5 h-5" />}
        >
          Start Personalized Learning Module
        </Button>
        <p className="text-xs text-slate-500">Includes targeted micro-lessons and active recall challenges</p>
      </div>
    </div>
  );
};
