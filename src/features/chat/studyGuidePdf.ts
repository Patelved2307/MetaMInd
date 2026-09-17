import type { CognitiveDiagnostic } from './chat.types';

export const generateStudyGuidePdfHtml = (
  topic: string,
  diagnostic: CognitiveDiagnostic,
  userName: string
): string => {
  const dateFormatted = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <title>MetaMind AI Study Guide - ${topic}</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet" />
        <style>
          @page {
            size: A4 portrait;
            margin: 14mm;
          }
          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }
          body {
            font-family: 'Plus Jakarta Sans', -apple-system, sans-serif;
            color: #1E293B;
            background: #FFFFFF;
            line-height: 1.6;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .guide-container {
            max-width: 820px;
            margin: 0 auto;
            border: 1px solid #E2E8F0;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(53, 59, 151, 0.08);
          }
          /* Top Geometric Brand Header (Bauhaus style matching certificate) */
          .header-banner {
            background-color: #353B97;
            padding: 24px 32px;
            color: #FFFFFF;
            display: flex;
            align-items: center;
            justify-content: space-between;
            position: relative;
            overflow: hidden;
          }
          .header-left {
            display: flex;
            align-items: center;
            gap: 16px;
          }
          .brand-rings {
            width: 42px;
            height: 28px;
          }
          .header-title {
            font-size: 20px;
            font-weight: 800;
            letter-spacing: -0.5px;
          }
          .header-subtitle {
            font-size: 11px;
            color: #FFB800;
            font-weight: 700;
            letter-spacing: 2px;
            text-transform: uppercase;
          }
          .header-tiles {
            display: flex;
            gap: 6px;
          }
          .tile-disc {
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background: #5CE1E6;
          }
          .tile-square {
            width: 24px;
            height: 24px;
            background: #F15A24;
            border-radius: 6px;
          }
          .tile-star {
            width: 24px;
            height: 24px;
            background: #FFB800;
            border-radius: 50%;
          }

          /* Content Area */
          .content-body {
            padding: 32px;
          }
          .meta-strip {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding-bottom: 20px;
            border-bottom: 1px solid #E2E8F0;
            margin-bottom: 24px;
            font-size: 12px;
          }
          .student-badge {
            font-weight: 700;
            color: #353B97;
          }

          .topic-heading {
            font-size: 28px;
            font-weight: 800;
            color: #0F172A;
            line-height: 1.2;
            margin-bottom: 12px;
          }
          .topic-sub {
            font-size: 14px;
            color: #475569;
            margin-bottom: 24px;
          }

          /* Diagnostic Cards */
          .diagnostic-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
            margin-bottom: 24px;
          }
          .diag-card {
            padding: 16px;
            border-radius: 12px;
            font-size: 13px;
          }
          .diag-weak {
            background: #FFF1F2;
            border: 1px solid #FECDD3;
            color: #9F1239;
          }
          .diag-strong {
            background: #F0FDF4;
            border: 1px solid #BBF7D0;
            color: #166534;
          }
          .diag-title {
            font-size: 11px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 6px;
          }

          /* Confidence Meter Bar */
          .confidence-meter {
            background: #F8FAFC;
            border: 1px solid #E2E8F0;
            border-radius: 12px;
            padding: 16px;
            margin-bottom: 28px;
          }
          .meter-header {
            display: flex;
            justify-content: space-between;
            font-size: 12px;
            font-weight: 700;
            color: #334155;
            margin-bottom: 8px;
          }
          .meter-bar-track {
            height: 10px;
            background: #E2E8F0;
            border-radius: 999px;
            overflow: hidden;
          }
          .meter-bar-fill {
            height: 100%;
            border-radius: 999px;
            background: linear-gradient(90deg, #F59E0B, #10B981);
            width: ${diagnostic.confidenceScore}%;
          }

          /* Deep Explanation Section */
          .section-title {
            font-size: 16px;
            font-weight: 800;
            color: #353B97;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-top: 24px;
            margin-bottom: 12px;
            display: flex;
            align-items: center;
            gap: 8px;
          }
          .section-title::before {
            content: '';
            display: inline-block;
            width: 4px;
            height: 16px;
            background: #F15A24;
            border-radius: 2px;
          }

          .takeaways-list {
            list-style: none;
            margin: 16px 0;
            display: flex;
            flex-direction: column;
            gap: 8px;
          }
          .takeaway-item {
            display: flex;
            align-items: flex-start;
            gap: 10px;
            font-size: 13px;
            background: #F8FAFC;
            padding: 10px 14px;
            border-radius: 8px;
            border-left: 3px solid #353B97;
          }

          /* Quiz Box */
          .quiz-box {
            background: #FFFBEB;
            border: 1px solid #FDE68A;
            border-radius: 12px;
            padding: 20px;
            margin-top: 24px;
          }
          .quiz-question {
            font-size: 13px;
            font-weight: 700;
            color: #92400E;
            margin-bottom: 10px;
          }
          .quiz-option {
            font-size: 12px;
            padding: 6px 10px;
            background: #FFFFFF;
            border-radius: 6px;
            margin-bottom: 6px;
            border: 1px solid #FEF3C7;
          }
          .quiz-answer {
            font-size: 12px;
            font-weight: 700;
            color: #059669;
            margin-top: 8px;
          }

          /* Footer */
          .footer-strip {
            background: #F8FAFC;
            border-top: 1px solid #E2E8F0;
            padding: 16px 32px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 11px;
            color: #64748B;
          }
          .footer-brand {
            font-weight: 700;
            color: #353B97;
          }
        </style>
      </head>
      <body>
        <div class="guide-container">
          <!-- Geometric Top Banner -->
          <div class="header-banner">
            <div class="header-left">
              <svg class="brand-rings" viewBox="0 0 34 24" fill="none">
                <rect x="2" y="2" width="18" height="20" rx="10" stroke="#F15A24" stroke-width="3" />
                <rect x="14" y="2" width="18" height="20" rx="10" stroke="#FFB800" stroke-width="3" />
              </svg>
              <div>
                <div class="header-title">MetaMind Adaptive AI</div>
                <div class="header-subtitle">Official Concept Study Guide & Doubt Diagnostic</div>
              </div>
            </div>
            <div class="header-tiles">
              <div class="tile-disc"></div>
              <div class="tile-square"></div>
              <div class="tile-star"></div>
            </div>
          </div>

          <!-- Body Content -->
          <div class="content-body">
            <div class="meta-strip">
              <div>Student: <span class="student-badge">${userName}</span></div>
              <div>Generated: <strong>${dateFormatted}</strong></div>
              <div>Topic: <strong>${topic}</strong></div>
            </div>

            <h1 class="topic-heading">${topic}</h1>
            <p class="topic-sub">
              Personalized concept breakdown generated from your interactive doubt query.
            </p>

            <!-- Cognitive Diagnostic Row -->
            <div class="diagnostic-grid">
              <div class="diag-card diag-weak">
                <div class="diag-title">⚠️ Misconception Identified</div>
                <div>${diagnostic.weakness}</div>
              </div>
              <div class="diag-card diag-strong">
                <div class="diag-title">✓ Verified Strength</div>
                <div>${diagnostic.strength}</div>
              </div>
            </div>

            <!-- Confidence Meter -->
            <div class="confidence-meter">
              <div class="meter-header">
                <span>Cognitive Confidence Index</span>
                <span>${diagnostic.confidenceScore}% (${diagnostic.confidenceLevel} Mastery)</span>
              </div>
              <div class="meter-bar-track">
                <div class="meter-bar-fill"></div>
              </div>
            </div>

            <!-- Key Takeaways & Rules -->
            <div class="section-title">Core Principles & Rules</div>
            <div class="takeaways-list">
              ${diagnostic.keyTakeaways
                .map(
                  (item) => `
                <div class="takeaway-item">
                  <span>💡</span>
                  <span>${item}</span>
                </div>
              `
                )
                .join('')}
            </div>

            <!-- Self-Assessment Quick-Check -->
            <div class="section-title">Self-Assessment Practice Drills</div>
            ${diagnostic.quickCheck
              .map(
                (q, idx) => `
              <div class="quiz-box">
                <div class="quiz-question">Question ${idx + 1}: ${q.question}</div>
                ${q.options
                  .map(
                    (opt, i) => `
                  <div class="quiz-option" style="${i === q.correctIndex ? 'border-color: #10B981; font-weight: 600;' : ''}">
                    ${String.fromCharCode(65 + i)}. ${opt}
                  </div>
                `
                  )
                  .join('')}
                <div class="quiz-answer">
                  ✓ Correct Answer: Option ${String.fromCharCode(65 + q.correctIndex)} — ${q.explanation}
                </div>
              </div>
            `
              )
              .join('')}
          </div>

          <!-- Footer -->
          <div class="footer-strip">
            <span class="footer-brand">MetaMind AI Learning Platform</span>
            <span>Authentication ID: MTM-GUIDE-${Math.random().toString(36).substring(2, 8).toUpperCase()}</span>
            <span>metamind.ai • Confidential Study Material</span>
          </div>
        </div>
      </body>
    </html>
  `;
};

export const downloadStudyGuidePdf = (
  topic: string,
  diagnostic: CognitiveDiagnostic,
  userName: string
) => {
  const windowPrint = window.open('', '_blank');
  if (!windowPrint) return;

  windowPrint.document.open();
  windowPrint.document.write(generateStudyGuidePdfHtml(topic, diagnostic, userName));
  windowPrint.document.close();
  windowPrint.focus();

  setTimeout(() => {
    windowPrint.print();
  }, 600);
};
