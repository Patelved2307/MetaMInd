import React, { useState } from 'react';
import { Dialog } from './Dialog';
import { Button } from './Button';
import type { IssuedCertificate } from '@/features/exam';
import { Sparkles, ShieldCheck, Printer } from 'lucide-react';

interface CertificateDesignModalProps {
  isOpen: boolean;
  onClose: () => void;
  certificate: IssuedCertificate | null;
  primaryColor?: string;
}

export const CertificateDesignModal: React.FC<CertificateDesignModalProps> = ({
  isOpen,
  onClose,
  certificate,
  primaryColor = '#2563EB',
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<'geometric-side' | 'corner-mosaic'>('geometric-side');

  if (!certificate) return null;

  const handlePrintCertificate = () => {
    const windowPrint = window.open('', '_blank');
    if (!windowPrint) return;

    if (selectedTemplate === 'geometric-side') {
      windowPrint.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Certificate - ${certificate.topic}</title>
            <style>
              @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;700;800&display=swap');
              body {
                margin: 0;
                padding: 40px;
                background: #FFFDF5;
                font-family: 'Plus Jakarta Sans', sans-serif;
                color: #1E293B;
                display: flex;
                align-items: center;
                justify-content: center;
                min-height: 90vh;
              }
              .cert-card {
                width: 900px;
                height: 600px;
                background: #FFFFFF;
                border-radius: 20px;
                box-shadow: 0 20px 40px rgba(0,0,0,0.08);
                display: flex;
                overflow: hidden;
                position: relative;
                border: 1px solid #E2E8F0;
              }
              .side-strip {
                width: 140px;
                background: #FFFBEB;
                border-right: 2px solid #FDE68A;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: space-around;
                padding: 20px 0;
              }
              .shape-circle { width: 45px; height: 45px; border-radius: 50%; background: #2563EB; }
              .shape-square { width: 40px; height: 40px; background: #EA580C; border-radius: 8px; }
              .shape-triangle { width: 0; height: 0; border-left: 25px solid transparent; border-right: 25px solid transparent; border-bottom: 40px solid #059669; }
              .shape-pill { width: 50px; height: 25px; border-radius: 20px; background: #DB2777; }
              .main-content {
                flex: 1;
                padding: 45px 50px;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                position: relative;
              }
              .header-brand {
                display: flex;
                align-items: center;
                gap: 10px;
                font-size: 14px;
                font-weight: 700;
                color: #64748B;
                letter-spacing: 2px;
                text-transform: uppercase;
              }
              .title-main {
                font-size: 42px;
                font-weight: 800;
                color: #1E3A8A;
                margin: 10px 0 0 0;
                letter-spacing: -1px;
              }
              .subtitle {
                font-size: 12px;
                font-weight: 700;
                letter-spacing: 4px;
                color: #94A3B8;
                text-transform: uppercase;
                margin-top: 5px;
              }
              .recipient-label {
                font-size: 11px;
                font-weight: 700;
                letter-spacing: 2px;
                color: #64748B;
                text-transform: uppercase;
                margin-top: 30px;
              }
              .recipient-name {
                font-size: 38px;
                font-weight: 800;
                color: #E11D48;
                margin: 10px 0;
              }
              .desc {
                font-size: 14px;
                color: #475569;
                line-height: 1.6;
                max-width: 520px;
              }
              .seal-badge {
                position: absolute;
                top: 50px;
                right: 50px;
                width: 100px;
                height: 100px;
                border-radius: 50%;
                background: #F43F5E;
                border: 4px solid #FFE4E6;
                color: white;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                text-align: center;
                box-shadow: 0 10px 20px rgba(244,63,94,0.3);
              }
              .seal-badge span { font-size: 11px; font-weight: 800; text-transform: uppercase; line-height: 1.1; }
              .footer-row {
                display: flex;
                align-items: flex-end;
                justify-content: space-between;
                border-top: 1px solid #F1F5F9;
                padding-top: 20px;
              }
              .code-stamp { font-family: monospace; font-size: 12px; font-weight: 700; color: #059669; }
            </style>
          </head>
          <body>
            <div class="cert-card">
              <div class="side-strip">
                <div class="shape-circle"></div>
                <div class="shape-square"></div>
                <div class="shape-triangle"></div>
                <div class="shape-pill"></div>
                <div class="shape-circle" style="background:#F59E0B"></div>
              </div>
              <div class="main-content">
                <div class="seal-badge">
                  <span>★ BEST ★</span>
                  <span style="font-size:13px; margin-top:2px;">AWARD</span>
                </div>
                <div>
                  <div class="header-brand">MetaMind Adaptive AI</div>
                  <h1 class="title-main">Certificate</h1>
                  <div class="subtitle">OF ACHIEVEMENT</div>
                  <div class="recipient-label">THIS CERTIFICATE IS PRESENTED TO</div>
                  <div class="recipient-name">${certificate.studentName}</div>
                  <div class="desc">
                    For achieving an outstanding score of <b>${certificate.scorePercent}%</b> on the official verified <b>${certificate.topic}</b> examination.
                  </div>
                </div>

                <div class="footer-row">
                  <div>
                    <div style="font-size: 12px; font-weight: 700;">${new Date(certificate.issuedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
                    <div style="font-size: 10px; color: #94A3B8; font-weight: 700; text-transform: uppercase; margin-top:2px;">ISSUE DATE</div>
                  </div>
                  <div class="code-stamp">VERIFIED ID: ${certificate.verificationCode}</div>
                  <div style="text-align: right;">
                    <div style="font-family: cursive; font-size: 18px; font-weight: bold; color: #1E293B;">MetaMind Academic Board</div>
                    <div style="font-size: 10px; color: #94A3B8; font-weight: 700; text-transform: uppercase; margin-top:2px;">AUTHORIZED SIGNATURE</div>
                  </div>
                </div>
              </div>
            </div>
          </body>
        </html>
      `);
    } else {
      windowPrint.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Certificate - ${certificate.topic}</title>
            <style>
              @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Plus+Jakarta+Sans:wght@400;700&display=swap');
              body {
                margin: 0;
                padding: 40px;
                background: #FFFBEB;
                font-family: 'Plus Jakarta Sans', sans-serif;
                color: #1E293B;
                display: flex;
                align-items: center;
                justify-content: center;
                min-height: 90vh;
              }
              .cert-card {
                width: 900px;
                height: 600px;
                background: #FFFFFF;
                border-radius: 24px;
                box-shadow: 0 20px 40px rgba(0,0,0,0.08);
                padding: 60px;
                box-sizing: border-box;
                position: relative;
                overflow: hidden;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                border: 1px solid #FDE68A;
              }
              .top-right-mosaic {
                position: absolute;
                top: 0;
                right: 0;
                width: 220px;
                height: 220px;
                background: radial-gradient(circle, #DB2777 20%, transparent 20%), radial-gradient(circle, #2563EB 20%, transparent 20%);
                background-size: 30px 30px;
                background-position: 0 0, 15px 15px;
                opacity: 0.85;
                clip-path: polygon(100% 0, 0 0, 100% 100%);
              }
              .bottom-left-mosaic {
                position: absolute;
                bottom: 0;
                left: 0;
                width: 220px;
                height: 220px;
                background: radial-gradient(circle, #059669 20%, transparent 20%), radial-gradient(circle, #F59E0B 20%, transparent 20%);
                background-size: 30px 30px;
                background-position: 0 0, 15px 15px;
                opacity: 0.85;
                clip-path: polygon(0 100%, 0 0, 100% 100%);
              }
              .gold-seal {
                position: absolute;
                top: 50px;
                left: 50px;
                width: 85px;
                height: 85px;
                border-radius: 50%;
                background: linear-gradient(135deg, #F59E0B, #D97706);
                border: 4px solid #FEF3C7;
                box-shadow: 0 8px 16px rgba(245,158,11,0.4);
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                color: white;
                font-weight: 800;
              }
              .gold-seal span { font-size: 26px; line-height: 1; }
              .gold-seal p { font-size: 9px; margin: 2px 0 0 0; text-transform: uppercase; letter-spacing: 1px; }
              .center-box { text-align: center; margin-top: 20px; }
              .cert-title { font-size: 34px; font-weight: 800; color: #0F172A; letter-spacing: 2px; margin: 0; }
              .cert-sub { font-size: 11px; font-weight: 700; letter-spacing: 4px; color: #64748B; margin-top: 4px; }
              .pres-to { font-size: 11px; font-weight: 700; letter-spacing: 2px; color: #94A3B8; margin-top: 30px; }
              .name-script { font-family: 'Playfair Display', serif; font-size: 46px; color: #D97706; margin: 10px 0; }
              .footer-box { display: flex; align-items: flex-end; justify-content: space-between; position: relative; z-index: 10; }
            </style>
          </head>
          <body>
            <div class="cert-card">
              <div class="top-right-mosaic"></div>
              <div class="bottom-left-mosaic"></div>
              <div class="gold-seal">
                <span>🥇</span>
                <p>TOP RANK</p>
              </div>

              <div class="center-box">
                <h1 class="cert-title">CERTIFICATE</h1>
                <div class="cert-sub">OF ACHIEVEMENT</div>
                <div class="pres-to">THIS CERTIFICATE IS PROUDLY PRESENTED TO:</div>
                <div class="name-script">${certificate.studentName}</div>
                <p style="font-size: 13px; color: #475569; max-width: 500px; margin: 15px auto 0 auto;">
                  In recognition of successfully passing the official <b>${certificate.topic}</b> assessment with a score of <b>${certificate.scorePercent}%</b>.
                </p>
              </div>

              <div class="footer-box">
                <div style="text-align: left;">
                  <div style="font-family: cursive; font-size: 18px; font-weight: bold; color: #0F172A;">Academic Director</div>
                  <div style="font-size: 10px; color: #64748B; font-weight: 700; text-transform: uppercase; margin-top: 2px;">PRESIDENT'S SIGNATURE</div>
                </div>

                <div style="font-family: monospace; font-size: 12px; font-weight: 700; color: #059669;">
                  ID: ${certificate.verificationCode}
                </div>

                <div style="text-align: right;">
                  <div style="font-size: 13px; font-weight: 700; color: #0F172A;">${new Date(certificate.issuedAt).toLocaleDateString()}</div>
                  <div style="font-size: 10px; color: #64748B; font-weight: 700; text-transform: uppercase; margin-top: 2px;">DATE</div>
                </div>
              </div>
            </div>
          </body>
        </html>
      `);
    }

    windowPrint.document.close();
    windowPrint.focus();
    setTimeout(() => {
      windowPrint.print();
    }, 500);
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Verified Certificate Template Viewer"
      description="Choose your preferred high-resolution certificate design template to view, share, or print."
      className="max-w-4xl"
    >
      <div className="space-y-6 pt-2">
        {/* TEMPLATE SWITCHER TABS */}
        <div className="flex flex-col sm:flex-row items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200 gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Select Certificate Design Template:</span>
          </div>

          <div className="flex items-center gap-2 bg-white p-1 rounded-full border border-slate-200 shadow-xs">
            <button
              onClick={() => setSelectedTemplate('geometric-side')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                selectedTemplate === 'geometric-side'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Geometric Side Strip (Template 1)
            </button>

            <button
              onClick={() => setSelectedTemplate('corner-mosaic')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                selectedTemplate === 'corner-mosaic'
                  ? 'bg-pink-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Corner Mosaic & Gold Badge (Template 2)
            </button>
          </div>
        </div>

        {/* LIVE HIGH-RES CERTIFICATE PREVIEW CANVAS */}
        <div className="w-full overflow-x-auto">
          <div className="relative rounded-3xl overflow-hidden border border-slate-200 shadow-xl bg-white min-h-[380px] p-4 sm:p-6 flex flex-col justify-between min-w-[580px] sm:min-w-0">
          {selectedTemplate === 'geometric-side' ? (
            /* TEMPLATE 1: GEOMETRIC SIDE STRIP PREVIEW */
            <div className="flex gap-6 h-full items-stretch">
              {/* Geometric side strip */}
              <div className="w-20 rounded-2xl bg-amber-50 border border-amber-200/80 flex flex-col items-center justify-around py-4 shrink-0">
                <div className="w-8 h-8 rounded-full bg-blue-600" />
                <div className="w-7 h-7 rounded-lg bg-emerald-600" />
                <div className="w-0 h-0 border-l-[12px] border-r-[12px] border-b-[20px] border-l-transparent border-r-transparent border-b-rose-500" />
                <div className="w-8 h-4 rounded-full bg-purple-600" />
                <div className="w-7 h-7 rounded-full bg-amber-500" />
              </div>

              {/* Certificate Details */}
              <div className="flex-1 space-y-4 relative py-2">
                {/* Red Award Badge Seal */}
                <div className="absolute top-0 right-0 w-20 h-20 rounded-full bg-rose-500 border-4 border-rose-100 flex flex-col items-center justify-center text-white text-center shadow-md">
                  <span className="text-[9px] font-extrabold uppercase">★ BEST ★</span>
                  <span className="text-xs font-extrabold">AWARD</span>
                </div>

                <div>
                  <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400">
                    MetaMind Platform
                  </p>
                  <h2 className="text-3xl font-display font-extrabold text-blue-900 tracking-tight">
                    Certificate
                  </h2>
                  <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400 mt-0.5">
                    OF ACHIEVEMENT
                  </p>
                </div>

                <div className="pt-2">
                  <p className="text-[10px] font-mono font-bold uppercase text-slate-500">
                    THIS CERTIFICATE IS PRESENTED TO
                  </p>
                  <p className="text-2xl font-extrabold text-rose-600 font-display mt-1">
                    {certificate.studentName}
                  </p>
                  <p className="text-xs text-slate-600 leading-relaxed max-w-md mt-1">
                    For achieving an outstanding score of <span className="font-bold text-emerald-600">{certificate.scorePercent}%</span> on the verified exam for <span className="font-bold text-slate-900">{certificate.topic}</span>.
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-mono">
                  <div>
                    <p className="font-bold text-slate-900">{new Date(certificate.issuedAt).toLocaleDateString()}</p>
                    <p className="text-[9px] text-slate-400 font-bold uppercase">Date Issued</p>
                  </div>
                  <span className="font-bold text-emerald-600">ID: {certificate.verificationCode}</span>
                  <div className="text-right">
                    <p className="font-bold text-slate-900 font-serif">Academic Director</p>
                    <p className="text-[9px] text-slate-400 font-bold uppercase">Authorized Signature</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* TEMPLATE 2: CORNER MOSAIC & GOLD BADGE PREVIEW */
            <div className="relative p-6 h-full flex flex-col justify-between text-center space-y-6">
              {/* Corner Patterns */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-pink-500 via-purple-500 to-transparent opacity-30 rounded-bl-full pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-emerald-500 via-amber-500 to-transparent opacity-30 rounded-tr-full pointer-events-none" />

              {/* Gold Ribbon Seal on Top-Left */}
              <div className="absolute top-4 left-4 w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 border-4 border-amber-100 shadow-lg flex flex-col items-center justify-center text-white">
                <span className="text-xl">🥇</span>
                <span className="text-[8px] font-mono font-extrabold uppercase tracking-wider">Top Rank</span>
              </div>

              <div className="pt-4">
                <h2 className="text-2xl font-bold font-display text-slate-900 tracking-wider">
                  CERTIFICATE
                </h2>
                <p className="text-[10px] font-mono font-bold text-slate-400 tracking-widest">
                  OF ACHIEVEMENT
                </p>
                <p className="text-[10px] font-mono font-bold text-slate-400 mt-4">
                  THIS CERTIFICATE IS PROUDLY PRESENTED TO:
                </p>
                <p className="text-3xl font-serif font-extrabold text-amber-600 mt-1">
                  {certificate.studentName}
                </p>
                <p className="text-xs text-slate-600 max-w-sm mx-auto mt-2">
                  In recognition of passing the official <b>{certificate.topic}</b> assessment with <b>{certificate.scorePercent}%</b> score.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-mono">
                <div className="text-left">
                  <p className="font-bold text-slate-900 font-serif">Academic President</p>
                  <p className="text-[9px] text-slate-400 font-bold uppercase">Signature</p>
                </div>
                <span className="font-bold text-emerald-600">ID: {certificate.verificationCode}</span>
                <div className="text-right">
                  <p className="font-bold text-slate-900">{new Date(certificate.issuedAt).toLocaleDateString()}</p>
                  <p className="text-[9px] text-slate-400 font-bold uppercase">Date</p>
                </div>
              </div>
            </div>
          )}
        </div>
        </div>

        {/* FOOTER ACTIONS */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <span className="text-xs text-slate-500 font-mono flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Verified Record: {certificate.verificationCode}
          </span>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onClose} className="cursor-pointer">
              Close
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handlePrintCertificate}
              className="font-bold text-xs cursor-pointer shadow-md text-white"
              style={{ backgroundColor: primaryColor }}
              leftIcon={<Printer className="w-4 h-4" />}
            >
              Print / Download Certificate PDF
            </Button>
          </div>
        </div>
      </div>
    </Dialog>
  );
};
