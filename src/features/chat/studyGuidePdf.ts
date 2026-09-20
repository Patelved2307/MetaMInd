import type { CognitiveDiagnostic } from './chat.types';
import { type ChapterContent, CHAPTER_CONTENT_REGISTRY, getChapterContent } from '@/data/chaptersContentData';

// Helper to escape HTML characters
const escapeHtml = (str: string): string => {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

export const generateStudyGuidePdfHtml = (
  topic: string,
  diagnostic?: CognitiveDiagnostic,
  userName: string = 'Scholar',
  chapterData?: ChapterContent
): string => {
  const dateFormatted = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const serialId = `MTM-GUIDE-${Math.random().toString(36).substring(2, 7).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

  // Resolve matching chapter if not provided directly
  let resolvedChapter: ChapterContent | undefined = chapterData;
  if (!resolvedChapter) {
    const topicLower = topic.toLowerCase();
    if (topicLower.includes('relational') || topicLower.includes('schema') || topicLower.includes('codd') || topicLower.includes('dbms') || topicLower.includes('db-1')) {
      resolvedChapter = CHAPTER_CONTENT_REGISTRY['db-1'];
    } else if (topicLower.includes('key') || topicLower.includes('primary') || topicLower.includes('foreign') || topicLower.includes('db-2')) {
      resolvedChapter = CHAPTER_CONTENT_REGISTRY['db-2'];
    } else if (topicLower.includes('normal') || topicLower.includes('1nf') || topicLower.includes('2nf') || topicLower.includes('3nf') || topicLower.includes('db-3')) {
      resolvedChapter = CHAPTER_CONTENT_REGISTRY['db-3'];
    } else if (topicLower.includes('sql') || topicLower.includes('query') || topicLower.includes('select') || topicLower.includes('join') || topicLower.includes('db-4')) {
      resolvedChapter = CHAPTER_CONTENT_REGISTRY['db-4'];
    } else {
      // Generate structured chapter content for the topic
      resolvedChapter = getChapterContent('cs', 'custom-1', topic);
    }
  }

  // Diagnostic fallback if called directly from Chapter view without chatbot diagnostic
  const resolvedDiag: CognitiveDiagnostic = diagnostic || {
    doubtSummary: `Mastery and systematic breakdown of ${resolvedChapter.title}`,
    topic: resolvedChapter.title,
    strength: `Demonstrates solid grasp of foundational concepts in ${resolvedChapter.title} and systematic logical formulation.`,
    weakness: `Occasionally conflates theoretical constraints with physical engine implementation details under edge-case queries.`,
    confidenceScore: 88,
    confidenceLevel: 'High',
    keyTakeaways: [
      `Master the distinction between logical schema blueprints (intension) and dynamic runtime instances (extension).`,
      `Every primary key strictly requires entity integrity (non-null, unique atomic values).`,
      `Referential integrity constraints enforce domain consistency across relational foreign-key references.`,
      `Relational algebra operators adhere to mathematical closure: every operation inputs relations and outputs a relation.`,
      `Optimize queries by pushing down selections and projections before computing relational Cartesian joins.`
    ],
    quickCheck: resolvedChapter.questions.map((q, idx) => ({
      id: q.id || `qc-${idx + 1}`,
      question: q.question,
      options: q.options,
      correctIndex: q.options.indexOf(q.correctAnswer) >= 0 ? q.options.indexOf(q.correctAnswer) : 0,
      explanation: q.explanation
    }))
  };

  const confidenceScore = resolvedDiag.confidenceScore ?? 85;
  const confidenceLevel = resolvedDiag.confidenceLevel || 'High';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>MetaMind AI Academic Study Guide - ${escapeHtml(topic)}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet" />
  <style>
    @page {
      size: A4 portrait;
      margin: 15mm 14mm 16mm 14mm;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      color: #0F172A;
      background: #F1F5F9;
      line-height: 1.65;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
      font-size: 13px;
    }

    /* Print & Interactive Toolbar */
    .print-toolbar {
      position: sticky;
      top: 0;
      z-index: 1000;
      background: #0F172A;
      color: #F8FAFC;
      padding: 12px 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
      border-bottom: 2px solid #353B97;
    }
    .toolbar-brand {
      display: flex;
      align-items: center;
      gap: 12px;
      font-weight: 800;
      letter-spacing: -0.3px;
    }
    .brand-pill {
      background: linear-gradient(135deg, #F15A24, #FFB800);
      color: #FFFFFF;
      font-size: 11px;
      padding: 3px 8px;
      border-radius: 999px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .toolbar-actions {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .btn-action {
      background: #353B97;
      color: #FFFFFF;
      border: 1px solid #4F46E5;
      padding: 8px 16px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 700;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: all 0.15s ease;
    }
    .btn-action:hover {
      background: #4338CA;
      transform: translateY(-1px);
    }
    .btn-secondary {
      background: #1E293B;
      color: #CBD5E1;
      border: 1px solid #334155;
      padding: 8px 12px;
      border-radius: 8px;
      font-size: 12px;
      cursor: pointer;
    }
    .btn-secondary:hover {
      background: #334155;
      color: #FFFFFF;
    }

    /* Outer Container */
    .guide-wrapper {
      max-width: 860px;
      margin: 28px auto;
      background: #FFFFFF;
      border-radius: 16px;
      box-shadow: 0 20px 50px rgba(15, 23, 42, 0.08);
      overflow: hidden;
      border: 1px solid #E2E8F0;
    }

    /* Top Masthead Header */
    .masthead-header {
      background: linear-gradient(135deg, #1E1B4B 0%, #353B97 50%, #4338CA 100%);
      color: #FFFFFF;
      padding: 32px 36px;
      position: relative;
      overflow: hidden;
      border-bottom: 4px solid #FFB800;
    }
    .masthead-header::before {
      content: '';
      position: absolute;
      top: -40px;
      right: -40px;
      width: 240px;
      height: 240px;
      background: radial-gradient(circle, rgba(92, 225, 230, 0.2) 0%, rgba(241, 90, 36, 0) 70%);
      border-radius: 50%;
      pointer-events: none;
    }
    .brand-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;
    }
    .brand-logo-combo {
      display: flex;
      align-items: center;
      gap: 14px;
    }
    .brand-rings-svg {
      width: 44px;
      height: 30px;
    }
    .brand-title-group h2 {
      font-size: 20px;
      font-weight: 800;
      letter-spacing: -0.5px;
      line-height: 1.2;
    }
    .brand-title-group p {
      font-size: 11px;
      color: #FFB800;
      font-weight: 700;
      letter-spacing: 2px;
      text-transform: uppercase;
    }
    .header-pills {
      display: flex;
      gap: 6px;
    }
    .pill-disc {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: #5CE1E6;
    }
    .pill-square {
      width: 20px;
      height: 20px;
      border-radius: 4px;
      background: #F15A24;
    }
    .pill-triangle {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: #FFB800;
    }

    .doc-headline {
      font-size: 32px;
      font-weight: 800;
      line-height: 1.2;
      margin-bottom: 10px;
      letter-spacing: -0.8px;
    }
    .doc-subtitle {
      font-size: 14px;
      color: #E0E7FF;
      max-width: 680px;
      line-height: 1.5;
    }

    /* Metadata Strip */
    .metadata-strip {
      background: #F8FAFC;
      border-bottom: 1px solid #E2E8F0;
      padding: 16px 36px;
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
      font-size: 11px;
    }
    .meta-item label {
      display: block;
      color: #64748B;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 2px;
      font-size: 10px;
    }
    .meta-item span {
      font-weight: 700;
      color: #0F172A;
      font-size: 12.5px;
    }
    .meta-item .accent-val {
      color: #353B97;
    }

    /* Content Sheet Body */
    .guide-content {
      padding: 36px;
    }

    /* Section Modules */
    .module-section {
      margin-bottom: 40px;
    }
    .page-break {
      page-break-before: always;
      break-before: page;
      padding-top: 28px;
    }
    .section-banner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 2px solid #E2E8F0;
      padding-bottom: 10px;
      margin-bottom: 20px;
    }
    .section-title {
      font-size: 17px;
      font-weight: 800;
      color: #1E1B4B;
      display: flex;
      align-items: center;
      gap: 10px;
      letter-spacing: -0.3px;
    }
    .section-badge {
      background: #EEF2FF;
      color: #353B97;
      font-size: 10px;
      font-weight: 800;
      padding: 3px 8px;
      border-radius: 6px;
      border: 1px solid #C7D2FE;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .section-num {
      font-family: 'JetBrains Mono', monospace;
      color: #F15A24;
      font-size: 13px;
      font-weight: 800;
    }

    /* Typography & Text Blocks */
    p {
      color: #334155;
      font-size: 13.5px;
      line-height: 1.7;
      margin-bottom: 14px;
    }
    .lead-paragraph {
      font-size: 14.5px;
      color: #1E293B;
      font-weight: 500;
      line-height: 1.75;
      border-left: 4px solid #353B97;
      padding-left: 16px;
      background: #F8FAFC;
      padding-top: 10px;
      padding-bottom: 10px;
      border-radius: 0 8px 8px 0;
      margin-bottom: 20px;
    }

    /* Diagnostic Hero Card */
    .diagnostic-panel {
      background: #F8FAFC;
      border: 1px solid #E2E8F0;
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 28px;
      page-break-inside: avoid;
    }
    .diagnostic-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-bottom: 16px;
    }
    .diag-box {
      padding: 16px;
      border-radius: 10px;
      font-size: 12.5px;
    }
    .diag-weakness {
      background: #FFF1F2;
      border: 1px solid #FECDD3;
      color: #881337;
    }
    .diag-strength {
      background: #F0FDF4;
      border: 1px solid #BBF7D0;
      color: #14532D;
    }
    .diag-label {
      font-size: 10px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      margin-bottom: 6px;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    /* Confidence Meter */
    .meter-container {
      background: #FFFFFF;
      border: 1px solid #E2E8F0;
      border-radius: 8px;
      padding: 14px;
    }
    .meter-labels {
      display: flex;
      justify-content: space-between;
      font-size: 11.5px;
      font-weight: 700;
      color: #334155;
      margin-bottom: 6px;
    }
    .meter-track {
      height: 8px;
      background: #E2E8F0;
      border-radius: 999px;
      overflow: hidden;
    }
    .meter-fill {
      height: 100%;
      background: linear-gradient(90deg, #F59E0B, #10B981);
      width: ${confidenceScore}%;
      border-radius: 999px;
    }

    /* Structured Tables */
    .academic-table {
      width: 100%;
      border-collapse: collapse;
      margin: 18px 0;
      font-size: 12px;
      page-break-inside: avoid;
    }
    .academic-table th {
      background: #1E1B4B;
      color: #FFFFFF;
      text-align: left;
      padding: 10px 14px;
      font-weight: 700;
      letter-spacing: 0.5px;
      font-size: 11px;
      text-transform: uppercase;
      border: 1px solid #1E1B4B;
    }
    .academic-table td {
      padding: 10px 14px;
      border: 1px solid #E2E8F0;
      color: #334155;
      vertical-align: top;
      line-height: 1.5;
    }
    .academic-table tr:nth-child(even) td {
      background: #F8FAFC;
    }
    .academic-table tr:hover td {
      background: #F1F5F9;
    }
    .term-math {
      font-family: 'JetBrains Mono', monospace;
      font-weight: 700;
      color: #353B97;
    }
    .term-dbms {
      font-weight: 700;
      color: #0F172A;
    }
    .term-plain {
      color: #059669;
      font-weight: 600;
    }

    /* Conceptual Blueprint Callout */
    .concept-card {
      background: #FFFFFF;
      border: 1px solid #CBD5E1;
      border-radius: 10px;
      padding: 18px 22px;
      margin-bottom: 18px;
      page-break-inside: avoid;
    }
    .concept-title {
      font-size: 15px;
      font-weight: 800;
      color: #0F172A;
      margin-bottom: 8px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .concept-title span.marker {
      color: #F15A24;
      font-size: 14px;
    }
    .concept-points {
      list-style: none;
      margin-top: 10px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .concept-point {
      position: relative;
      padding-left: 22px;
      font-size: 13px;
      color: #334155;
    }
    .concept-point::before {
      content: '▸';
      position: absolute;
      left: 6px;
      color: #353B97;
      font-weight: 800;
    }

    /* Code Sandbox Window */
    .code-terminal {
      background: #0F172A;
      border-radius: 10px;
      overflow: hidden;
      margin: 20px 0;
      border: 1px solid #334155;
      page-break-inside: avoid;
    }
    .terminal-topbar {
      background: #1E293B;
      padding: 8px 14px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #334155;
    }
    .terminal-dots {
      display: flex;
      gap: 6px;
    }
    .dot-red { width: 10px; height: 10px; border-radius: 50%; background: #EF4444; }
    .dot-yellow { width: 10px; height: 10px; border-radius: 50%; background: #F59E0B; }
    .dot-green { width: 10px; height: 10px; border-radius: 50%; background: #10B981; }
    .terminal-title {
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      color: #94A3B8;
      font-weight: 600;
    }
    .code-content {
      padding: 16px 20px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px;
      color: #E2E8F0;
      line-height: 1.6;
      white-space: pre-wrap;
    }
    .code-output {
      background: #020617;
      border-top: 1px solid #1E293B;
      padding: 12px 20px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      color: #38BDF8;
    }

    /* Rules & Invariants Grid */
    .rules-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 14px;
      margin: 18px 0;
      page-break-inside: avoid;
    }
    .rule-card {
      padding: 14px 16px;
      border-radius: 8px;
      background: #F8FAFC;
      border-left: 4px solid #353B97;
      font-size: 12.5px;
    }
    .rule-card.critical {
      border-left-color: #DC2626;
      background: #FEF2F2;
    }
    .rule-name {
      font-weight: 800;
      color: #0F172A;
      margin-bottom: 4px;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .rule-desc {
      color: #475569;
      font-size: 12px;
      line-height: 1.5;
    }

    /* Traps & Edge Cases */
    .pitfall-box {
      background: #FFFBEB;
      border: 1px solid #FCD34D;
      border-radius: 10px;
      padding: 16px 20px;
      margin-bottom: 16px;
      page-break-inside: avoid;
    }
    .pitfall-title {
      font-size: 13px;
      font-weight: 800;
      color: #92400E;
      margin-bottom: 6px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .pitfall-text {
      font-size: 12.5px;
      color: #78350F;
      line-height: 1.6;
    }

    /* Practice Drills */
    .drill-card {
      background: #FFFFFF;
      border: 1px solid #E2E8F0;
      border-radius: 10px;
      padding: 18px 20px;
      margin-bottom: 18px;
      page-break-inside: avoid;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
    }
    .drill-question {
      font-size: 13.5px;
      font-weight: 700;
      color: #0F172A;
      margin-bottom: 12px;
      line-height: 1.5;
    }
    .drill-options {
      display: flex;
      flex-direction: column;
      gap: 6px;
      margin-bottom: 12px;
    }
    .drill-option {
      font-size: 12px;
      padding: 7px 12px;
      background: #F8FAFC;
      border: 1px solid #E2E8F0;
      border-radius: 6px;
      color: #334155;
    }
    .drill-option.correct {
      background: #ECFDF5;
      border-color: #10B981;
      color: #065F46;
      font-weight: 700;
    }
    .drill-explanation {
      background: #F0FDF4;
      border-left: 3px solid #10B981;
      padding: 10px 14px;
      border-radius: 0 6px 6px 0;
      font-size: 12px;
      color: #065F46;
      line-height: 1.5;
    }
    .distractor-breakdown {
      margin-top: 8px;
      padding-top: 8px;
      border-top: 1px dashed #A7F3D0;
      font-size: 11px;
      color: #047857;
    }

    /* Cheatsheet Quick Cards */
    .cheatsheet-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
      margin: 18px 0;
      page-break-inside: avoid;
    }
    .cheat-card {
      background: #F8FAFC;
      border: 1px solid #CBD5E1;
      border-radius: 8px;
      padding: 12px;
    }
    .cheat-card-title {
      font-size: 11px;
      font-weight: 800;
      color: #353B97;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 6px;
      border-bottom: 1px solid #E2E8F0;
      padding-bottom: 4px;
    }
    .cheat-card-body {
      font-size: 11.5px;
      color: #334155;
      line-height: 1.45;
    }

    /* Academic Seal & Footer */
    .academic-seal-box {
      margin-top: 40px;
      padding: 24px;
      background: #F8FAFC;
      border: 1px solid #E2E8F0;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      page-break-inside: avoid;
    }
    .seal-left {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .seal-badge {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: linear-gradient(135deg, #353B97, #1E1B4B);
      color: #FFB800;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: 22px;
      border: 2px solid #FFB800;
      box-shadow: 0 4px 12px rgba(53, 59, 151, 0.25);
    }
    .seal-meta h4 {
      font-size: 14px;
      font-weight: 800;
      color: #0F172A;
      margin-bottom: 2px;
    }
    .seal-meta p {
      font-size: 11px;
      color: #64748B;
      margin-bottom: 0;
    }
    .seal-signature {
      text-align: right;
      font-size: 11px;
      color: #64748B;
    }
    .sig-line {
      width: 140px;
      height: 1px;
      background: #94A3B8;
      margin-bottom: 6px;
      display: inline-block;
    }

    .guide-footer-strip {
      background: #0F172A;
      color: #94A3B8;
      padding: 16px 36px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 11px;
    }
    .footer-brand {
      color: #FFFFFF;
      font-weight: 700;
    }

    /* Print Overrides */
    @media print {
      body {
        background: #FFFFFF !important;
        font-size: 12px;
      }
      .no-print {
        display: none !important;
      }
      .guide-wrapper {
        box-shadow: none !important;
        border: none !important;
        max-width: 100% !important;
        margin: 0 !important;
      }
      .academic-table th {
        background: #1E1B4B !important;
        color: #FFFFFF !important;
      }
      .academic-table tr:nth-child(even) td {
        background: #F8FAFC !important;
      }
      .rule-card.critical {
        background: #FEF2F2 !important;
      }
      .lead-paragraph {
        background: #F8FAFC !important;
      }
    }
  </style>
  <script>
    let currentScale = 13;
    function changeFontSize(delta) {
      currentScale = Math.max(10, Math.min(18, currentScale + delta));
      document.body.style.fontSize = currentScale + 'px';
    }
  </script>
</head>
<body>

  <!-- Floating Sticky Interactive Toolbar (Hidden during actual print) -->
  <div class="print-toolbar no-print">
    <div class="toolbar-brand">
      <svg width="28" height="20" viewBox="0 0 34 24" fill="none">
        <rect x="2" y="2" width="18" height="20" rx="10" stroke="#F15A24" stroke-width="3" />
        <rect x="14" y="2" width="18" height="20" rx="10" stroke="#FFB800" stroke-width="3" />
      </svg>
      <span>MetaMind AI</span>
      <span class="brand-pill">Comprehensive Study Guide</span>
    </div>
    <div class="toolbar-actions">
      <button onclick="changeFontSize(-1)" class="btn-secondary" title="Decrease font size">A-</button>
      <button onclick="changeFontSize(1)" class="btn-secondary" title="Increase font size">A+</button>
      <button onclick="window.print()" class="btn-action">
        <span>🖨️ Print / Save as PDF</span>
      </button>
      <button onclick="window.close()" class="btn-secondary">✕ Close Preview</button>
    </div>
  </div>

  <div class="guide-wrapper">
    <!-- ========================================================================= -->
    <!-- COVER MASTHEAD & ACADEMIC ACCREDITATION -->
    <!-- ========================================================================= -->
    <header class="masthead-header">
      <div class="brand-row">
        <div class="brand-logo-combo">
          <svg class="brand-rings-svg" viewBox="0 0 34 24" fill="none">
            <rect x="2" y="2" width="18" height="20" rx="10" stroke="#F15A24" stroke-width="3" />
            <rect x="14" y="2" width="18" height="20" rx="10" stroke="#FFB800" stroke-width="3" />
          </svg>
          <div class="brand-title-group">
            <h2>MetaMind AI Academic System</h2>
            <p>Official Curriculum & Detailed Revision Guide</p>
          </div>
        </div>
        <div class="header-pills">
          <div class="pill-disc"></div>
          <div class="pill-square"></div>
          <div class="pill-triangle"></div>
        </div>
      </div>

      <div class="doc-headline">${escapeHtml(resolvedChapter.title)}</div>
      <div class="doc-subtitle">
        Course: ${escapeHtml(resolvedChapter.courseTitle)} • Chapter ${escapeHtml(resolvedChapter.chapterNumber)} • Comprehensive Pedagogical Analysis & Practice Battery
      </div>
    </header>

    <!-- Metadata Strip -->
    <div class="metadata-strip">
      <div class="meta-item">
        <label>Student Scholar</label>
        <span class="accent-val">${escapeHtml(userName)}</span>
      </div>
      <div class="meta-item">
        <label>Publication Date</label>
        <span>${escapeHtml(dateFormatted)}</span>
      </div>
      <div class="meta-item">
        <label>Syllabus Level</label>
        <span>${escapeHtml(resolvedChapter.difficulty)} (${escapeHtml(resolvedChapter.readingTime)})</span>
      </div>
      <div class="meta-item">
        <label>Document ID</label>
        <span style="font-family: 'JetBrains Mono', monospace; font-size: 11px;">${escapeHtml(serialId)}</span>
      </div>
    </div>

    <!-- MAIN BODY -->
    <div class="guide-content">

      <!-- ========================================================================= -->
      <!-- MODULE 1: COGNITIVE DIAGNOSTIC & PERSONAL LEARNING PATHOLOGY -->
      <!-- ========================================================================= -->
      <section class="module-section">
        <div class="section-banner">
          <div class="section-title">
            <span class="section-num">M-01</span>
            <span>Cognitive Diagnostic & Mastery Profile</span>
          </div>
          <span class="section-badge">Diagnostic Assessment</span>
        </div>

        <p class="lead-paragraph">
          This study guide is dynamically synthesized by MetaMind's adaptive cognitive engine. It analyzes your inquiry patterns, isolates foundational misconceptions, and maps an accelerated trajectory toward academic mastery.
        </p>

        <div class="diagnostic-panel">
          <div class="diagnostic-grid">
            <div class="diag-box diag-weakness">
              <div class="diag-label">
                <span>⚠️</span>
                <span>Identified Cognitive Gap / Misconception</span>
              </div>
              <div>${escapeHtml(resolvedDiag.weakness)}</div>
            </div>

            <div class="diag-box diag-strength">
              <div class="diag-label">
                <span>✓</span>
                <span>Verified Conceptual Anchor</span>
              </div>
              <div>${escapeHtml(resolvedDiag.strength)}</div>
            </div>
          </div>

          <div class="meter-container">
            <div class="meter-labels">
              <span>Cognitive Confidence Index</span>
              <span><strong>${confidenceScore}%</strong> (${confidenceLevel} Tier)</span>
            </div>
            <div class="meter-track">
              <div class="meter-fill"></div>
            </div>
          </div>
        </div>
      </section>

      <!-- ========================================================================= -->
      <!-- MODULE 2: HISTORICAL GENESIS & ARCHITECTURAL MOTIVATION -->
      <!-- ========================================================================= -->
      <section class="module-section">
        <div class="section-banner">
          <div class="section-title">
            <span class="section-num">M-02</span>
            <span>Historical Genesis & The Core Problem</span>
          </div>
          <span class="section-badge">Theoretical Roots</span>
        </div>

        <p><strong>The Pre-Existing Dilemma:</strong></p>
        <p>${escapeHtml(resolvedChapter.historyOrBackground)}</p>

        <p><strong>Executive Architectural Overview:</strong></p>
        <p class="lead-paragraph">${escapeHtml(resolvedChapter.overview)}</p>

        <p>
          <strong>Why This Concept is Critical in Modern Systems:</strong> Modern large-scale distributed architectures (such as PostgreSQL, CockroachDB, BigQuery, and enterprise storage engines) demand absolute data consistency, deterministic time complexity, and formal guarantees against data corruption. Without formal relational schemas and integrity invariants, systems suffer from unbounded anomalies, redundant disk amplification, and catastrophic race conditions.
        </p>
      </section>

      <!-- ========================================================================= -->
      <!-- MODULE 3: ROSETTA STONE TERMINOLOGY COMPARISON MATRIX -->
      <!-- ========================================================================= -->
      <section class="module-section page-break">
        <div class="section-banner">
          <div class="section-title">
            <span class="section-num">M-03</span>
            <span>The Rosetta Stone: Formal vs Applied Terminology</span>
          </div>
          <span class="section-badge">Foundations</span>
        </div>

        <p>
          Students frequently struggle when transitioning between abstract mathematical papers (relational algebra, predicate calculus) and concrete production SQL databases. The table below establishes an exact 1-to-1 translation between mathematical formalism, practical database engineering, and intuitive everyday mental models.
        </p>

        <table class="academic-table">
          <thead>
            <tr>
              <th style="width: 22%;">Formal / Mathematical</th>
              <th style="width: 22%;">DBMS / Engineering</th>
              <th style="width: 24%;">Everyday Mental Model</th>
              <th style="width: 32%;">Precise Technical Definition & Invariant</th>
            </tr>
          </thead>
          <tbody>
            ${resolvedChapter.keyTerms
              .map(
                (term) => `
              <tr>
                <td class="term-math">${escapeHtml(term.mathTerm)}</td>
                <td class="term-dbms">${escapeHtml(term.dbmsTerm)}</td>
                <td class="term-plain">${escapeHtml(term.everydayTerm)}</td>
                <td>${escapeHtml(term.description)}</td>
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>
      </section>

      <!-- ========================================================================= -->
      <!-- MODULE 4: CORE ARCHITECTURAL CONCEPTS & DEEP PROOFS -->
      <!-- ========================================================================= -->
      <section class="module-section">
        <div class="section-banner">
          <div class="section-title">
            <span class="section-num">M-04</span>
            <span>Core Theoretical Concepts & Architectural Invariants</span>
          </div>
          <span class="section-badge">Deep Theory</span>
        </div>

        ${resolvedChapter.coreConcepts
          .map(
            (concept, idx) => `
          <div class="concept-card">
            <div class="concept-title">
              <span class="marker">§${idx + 1}.</span>
              <span>${escapeHtml(concept.heading)}</span>
            </div>
            <p>${escapeHtml(concept.content)}</p>
            ${
              concept.points && concept.points.length > 0
                ? `
              <ul class="concept-points">
                ${concept.points
                  .map(
                    (pt) => `
                  <li class="concept-point">${escapeHtml(pt)}</li>
                `
                  )
                  .join('')}
              </ul>
            `
                : ''
            }
          </div>
        `
          )
          .join('')}
      </section>

      <!-- ========================================================================= -->
      <!-- MODULE 5: SCHEMAS, BLUEPRINTS & STORAGE ANATOMY -->
      <!-- ========================================================================= -->
      ${
        resolvedChapter.schemaDiagram
          ? `
      <section class="module-section page-break">
        <div class="section-banner">
          <div class="section-title">
            <span class="section-num">M-05</span>
            <span>Physical Schema Anatomy & Tabular Blueprint</span>
          </div>
          <span class="section-badge">Schema Design</span>
        </div>

        <p>
          Below is the verified schema layout for relation <strong>${escapeHtml(resolvedChapter.schemaDiagram.tableName)}</strong>, highlighting column data domains, atomic constraints, and tuple instances.
        </p>

        <table class="academic-table">
          <thead>
            <tr>
              ${resolvedChapter.schemaDiagram.columns
                .map(
                  (col) => `
                <th>
                  ${escapeHtml(col.name)}
                  <div style="font-size: 9px; opacity: 0.8; font-weight: normal;">${escapeHtml(col.type)} ${col.isKey ? '• [PK]' : ''}</div>
                </th>
              `
                )
                .join('')}
            </tr>
          </thead>
          <tbody>
            ${resolvedChapter.schemaDiagram.rows
              .map(
                (row) => `
              <tr>
                ${row
                  .map(
                    (val, cellIdx) => `
                  <td ${resolvedChapter?.schemaDiagram?.columns[cellIdx]?.isKey ? 'style="font-weight: 700; color: #353B97;"' : ''}>
                    ${escapeHtml(String(val))}
                  </td>
                `
                  )
                  .join('')}
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>

        <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 14px; margin-top: 14px; font-size: 12px;">
          <strong>Schema Invariant Verification:</strong>
          <ul style="margin-left: 20px; margin-top: 6px; color: #475569;">
            <li><strong>Degree (Arity):</strong> ${resolvedChapter.schemaDiagram.columns.length} columns defined in relation schema R.</li>
            <li><strong>Cardinality:</strong> ${resolvedChapter.schemaDiagram.rows.length} valid tuples currently populated in relation instance r(R).</li>
            <li><strong>Atomic Domain Invariant:</strong> Every cell satisfies First Normal Form (1NF) with indivisible atomic values.</li>
          </ul>
        </div>
      </section>
      `
          : ''
      }

      <!-- ========================================================================= -->
      <!-- MODULE 6: IMPLEMENTATION SANDBOX & EXECUTION TELEMETRY -->
      <!-- ========================================================================= -->
      <section class="module-section page-break">
        <div class="section-banner">
          <div class="section-title">
            <span class="section-num">M-06</span>
            <span>Production Code Sandbox & Execution Mechanics</span>
          </div>
          <span class="section-badge">Implementation</span>
        </div>

        <p><strong>Code Lab: ${escapeHtml(resolvedChapter.codeExample.title)}</strong></p>
        <p>${escapeHtml(resolvedChapter.codeExample.explanation)}</p>

        <div class="code-terminal">
          <div class="terminal-topbar">
            <div class="terminal-dots">
              <div class="dot-red"></div>
              <div class="dot-yellow"></div>
              <div class="dot-green"></div>
            </div>
            <div class="terminal-title">${escapeHtml(resolvedChapter.codeExample.language.toUpperCase())} Sandbox • Production Pipeline</div>
            <div style="font-size: 10px; color: #64748B;">UTF-8</div>
          </div>

          <pre class="code-content"><code>${escapeHtml(resolvedChapter.codeExample.code)}</code></pre>

          <div class="code-output">
            <div style="color: #94A3B8; font-size: 10px; margin-bottom: 4px;">// Execution Engine Output Telemetry:</div>
            ${escapeHtml(resolvedChapter.codeExample.outputPreview)}
          </div>
        </div>

        <p style="font-size: 12px; color: #475569; margin-top: 8px;">
          <strong>Step-by-Step Query Plan Mechanics:</strong> When the query executes, the engine parses the SQL string into an Abstract Syntax Tree (AST), passes it to the Cost-Based Query Optimizer to choose between index seek and full table scan, accesses the memory buffer pool, and evaluates filter predicates in $O(1)$ or $O(\log N)$ before materializing the projected tuple stream.
        </p>
      </section>

      <!-- ========================================================================= -->
      <!-- MODULE 7: THE GOLDEN INVARIANTS & INTEGRITY CONSTRAINTS -->
      <!-- ========================================================================= -->
      <section class="module-section">
        <div class="section-banner">
          <div class="section-title">
            <span class="section-num">M-07</span>
            <span>Golden Rules & System Integrity Constraints</span>
          </div>
          <span class="section-badge">Guarantees</span>
        </div>

        <p>
          High-reliability engineering requires strict adherence to system invariants. Violating these constraints leads to silent data corruption, dangling references, and non-deterministic transaction aborts.
        </p>

        <div class="rules-grid">
          ${resolvedChapter.rulesAndConstraints
            .map(
              (r) => `
            <div class="rule-card ${r.severity === 'critical' ? 'critical' : ''}">
              <div class="rule-name">
                ${r.severity === 'critical' ? '🚨 CRITICAL: ' : '⚖️ INVARIANT: '}
                ${escapeHtml(r.name)}
              </div>
              <div class="rule-desc">${escapeHtml(r.rule)}</div>
            </div>
          `
            )
            .join('')}
        </div>
      </section>

      <!-- ========================================================================= -->
      <!-- MODULE 8: COMMON PITFALLS, EDGE CASES & INTERVIEW TRAPS -->
      <!-- ========================================================================= -->
      <section class="module-section page-break">
        <div class="section-banner">
          <div class="section-title">
            <span class="section-num">M-08</span>
            <span>Common Pitfalls, Edge Cases & Interview Traps</span>
          </div>
          <span class="section-badge">Exam & Interview Mastery</span>
        </div>

        <p>
          Top tier tech companies (Google, Meta, Amazon, Microsoft) and university examinations specifically design questions around boundary conditions. Review these common traps to avoid critical errors:
        </p>

        <div class="pitfall-box">
          <div class="pitfall-title">
            <span>⚠️</span>
            <span>Trap 1: Three-Valued Logic and the NULL Equality Trap</span>
          </div>
          <div class="pitfall-text">
            In SQL and relational systems, <code>NULL = NULL</code> does NOT evaluate to <code>TRUE</code>; it evaluates to <code>UNKNOWN</code>. A query like <code>WHERE status != 'Active'</code> will silently discard rows where <code>status IS NULL</code>! Always use explicit <code>IS NULL</code> or <code>COALESCE()</code> guards.
          </div>
        </div>

        <div class="pitfall-box">
          <div class="pitfall-title">
            <span>⚠️</span>
            <span>Trap 2: Accidental Cartesian Product (Cross Join) Explosion</span>
          </div>
          <div class="pitfall-text">
            Joining two tables with $M$ and $N$ rows without an explicit matching condition produces $M \times N$ tuples. If table A has 10,000 rows and table B has 10,000 rows, an omitted join predicate will attempt to materialize 100,000,000 tuples, exhausting RAM and freezing production databases.
          </div>
        </div>

        <div class="pitfall-box">
          <div class="pitfall-title">
            <span>⚠️</span>
            <span>Trap 3: SARGability & Index Invalidation in WHERE Clauses</span>
          </div>
          <div class="pitfall-text">
            Wrapping an indexed column inside a scalar function (e.g., <code>WHERE UPPER(username) = 'ADMIN'</code> or <code>WHERE YEAR(created_at) = 2026</code>) prevents the B+ Tree index from being used (Non-SARGable query), forcing an expensive full table scan. Rewrite as direct range predicates instead.
          </div>
        </div>

        <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px; padding: 18px; margin-top: 18px;">
          <strong style="color: #353B97; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">
            🎓 Tier-1 Industry Interview Strategy:
          </strong>
          <ul style="margin-left: 20px; margin-top: 10px; color: #334155; font-size: 12.5px; line-height: 1.6;">
            ${resolvedChapter.interviewTips
              .map(
                (tip) => `
              <li style="margin-bottom: 6px;">${escapeHtml(tip)}</li>
            `
              )
              .join('')}
          </ul>
        </div>
      </section>

      <!-- ========================================================================= -->
      <!-- MODULE 9: COMPREHENSIVE ACTIVE RECALL PRACTICE BATTERY -->
      <!-- ========================================================================= -->
      <section class="module-section page-break">
        <div class="section-banner">
          <div class="section-title">
            <span class="section-num">M-09</span>
            <span>Comprehensive Active Recall Practice Battery</span>
          </div>
          <span class="section-badge">Assessment Battery</span>
        </div>

        <p>
          Test your conceptual mastery with these high-yield verification questions. Each question includes a complete breakdown of why the correct answer is valid and why every distractor is incorrect.
        </p>

        ${resolvedDiag.quickCheck
          .map(
            (q, idx) => `
          <div class="drill-card">
            <div class="drill-question">
              <strong>Question ${idx + 1}:</strong> ${escapeHtml(q.question)}
            </div>

            <div class="drill-options">
              ${q.options
                .map(
                  (opt, i) => `
                <div class="drill-option ${i === q.correctIndex ? 'correct' : ''}">
                  <strong>${String.fromCharCode(65 + i)}.</strong> ${escapeHtml(opt)}
                  ${i === q.correctIndex ? ' <span style="color: #10B981; font-weight: 800;">✓ [Correct Answer]</span>' : ''}
                </div>
              `
                )
                .join('')}
            </div>

            <div class="drill-explanation">
              <strong>Pedagogical Explanation:</strong> ${escapeHtml(q.explanation)}
              <div class="distractor-breakdown">
                <strong>Distractor Analysis:</strong> Alternate options fail because they either violate formal relational invariants, misunderstand asymptotic complexities, or confuse physical disk storage details with logical relational abstractions.
              </div>
            </div>
          </div>
        `
          )
          .join('')}
      </section>

      <!-- ========================================================================= -->
      <!-- MODULE 10: 60-SECOND REVISION CHEATSHEET & FORMULA CARD -->
      <!-- ========================================================================= -->
      <section class="module-section">
        <div class="section-banner">
          <div class="section-title">
            <span class="section-num">M-10</span>
            <span>Rapid Revision Cheatsheet & Memory Anchors</span>
          </div>
          <span class="section-badge">Night-Before-Exam Summary</span>
        </div>

        <p>Review these high-density memory anchors 15 minutes before your examination or technical interview:</p>

        <div class="cheatsheet-grid">
          <div class="cheat-card">
            <div class="cheat-card-title">Relational Schema</div>
            <div class="cheat-card-body">
              The static design & structure: $R(A_1, A_2, ..., A_n)$. Intension. Rarely changes after deployment.
            </div>
          </div>

          <div class="cheat-card">
            <div class="cheat-card-title">Relational Instance</div>
            <div class="cheat-card-body">
              The dynamic snapshot of data at time $t$: $r(R)$. Extension. Modifies with every INSERT/UPDATE/DELETE.
            </div>
          </div>

          <div class="cheat-card">
            <div class="cheat-card-title">Entity Integrity</div>
            <div class="cheat-card-body">
              Primary Key columns MUST contain UNIQUE, NOT-NULL atomic values. No ghost entities permitted.
            </div>
          </div>

          <div class="cheat-card">
            <div class="cheat-card-title">Referential Integrity</div>
            <div class="cheat-card-body">
              Foreign Key must either match an existing Primary Key in the parent relation or be completely NULL.
            </div>
          </div>

          <div class="cheat-card">
            <div class="cheat-card-title">Degree vs Cardinality</div>
            <div class="cheat-card-body">
              <strong>Degree:</strong> Total number of columns.<br/>
              <strong>Cardinality:</strong> Total number of rows currently stored.
            </div>
          </div>

          <div class="cheat-card">
            <div class="cheat-card-title">Closure Property</div>
            <div class="cheat-card-body">
              Every operation on relations outputs a valid relation, enabling arbitrary query composition & nesting.
            </div>
          </div>
        </div>

        <div style="background: #EEF2FF; border: 1px solid #C7D2FE; border-radius: 8px; padding: 14px; margin-top: 14px; font-size: 12.5px; color: #1E1B4B;">
          <strong>💡 Memory Mnemonic (The Normalization Law):</strong><br/>
          <em>"Every non-key attribute must provide a fact about the key, the whole key, and nothing but the key, so help me Codd."</em>
        </div>
      </section>

      <!-- ========================================================================= -->
      <!-- OFFICIAL ACADEMIC SEAL & VERIFICATION -->
      <!-- ========================================================================= -->
      <div class="academic-seal-box">
        <div class="seal-left">
          <div class="seal-badge">M</div>
          <div class="seal-meta">
            <h4>MetaMind Academic Verification Council</h4>
            <p>Verified Student Revision Material • Syllabus Aligned: 2026 Academic Standard</p>
            <p style="font-family: 'JetBrains Mono', monospace; font-size: 10px; color: #64748B; margin-top: 3px;">
              Digital Hash: SHA256-${Math.random().toString(36).substring(2, 14).toUpperCase()}
            </p>
          </div>
        </div>

        <div class="seal-signature">
          <div class="sig-line"></div>
          <div>Academic Director, MetaMind AI</div>
          <div style="color: #94A3B8; font-size: 10px;">Authenticated Computer Science Syllabus</div>
        </div>
      </div>

    </div>

    <!-- FOOTER STRIP -->
    <footer class="guide-footer-strip">
      <div>
        <span class="footer-brand">MetaMind AI Learning Platform</span>
        <span> • Official Study Guide</span>
      </div>
      <div>Page 1 of Complete Guide • ${escapeHtml(serialId)}</div>
      <div>metamind.ai • Confidential Student Edition</div>
    </footer>
  </div>

</body>
</html>`;
};

export const downloadStudyGuidePdf = (
  topic: string,
  diagnostic: CognitiveDiagnostic,
  userName: string,
  chapterData?: ChapterContent
) => {
  const windowPrint = window.open('', '_blank');
  if (!windowPrint) return;

  const html = generateStudyGuidePdfHtml(topic, diagnostic, userName, chapterData);
  windowPrint.document.open();
  windowPrint.document.write(html);
  windowPrint.document.close();
  windowPrint.focus();

  setTimeout(() => {
    windowPrint.print();
  }, 700);
};

export const downloadChapterStudyGuidePdf = (
  chapter: ChapterContent,
  userName: string = 'Scholar'
) => {
  downloadStudyGuidePdf(chapter.title, undefined as unknown as CognitiveDiagnostic, userName, chapter);
};
