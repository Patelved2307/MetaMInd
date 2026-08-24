import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth';
import { examService, type IssuedCertificate } from '@/features/exam';
import { getAvatarPresetByUrl, generateAvatarUrl } from '@/lib/avatarGenerator';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  ShieldCheck,
  Award,
  Download,
  FileCheck,
  Lock,
  Sparkles,
} from 'lucide-react';

export const CertificatesPage: React.FC = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const avatarUrl = profile?.avatar_url || generateAvatarUrl(user?.id || 'demo');
  const activePreset = getAvatarPresetByUrl(avatarUrl);
  const theme = activePreset.theme;

  const [certificates, setCertificates] = useState<IssuedCertificate[]>([]);

  useEffect(() => {
    const list = examService.getCertificates();
    setCertificates(list);
  }, []);

  const handleDownloadCert = (cert: IssuedCertificate) => {
    const windowPrint = window.open('', '_blank');
    if (!windowPrint) return;

    windowPrint.document.write(`
      <html>
        <head>
          <title>Certificate - ${cert.topic}</title>
          <style>
            body { font-family: 'Helvetica Neue', Arial, sans-serif; background: #05070A; color: #fff; text-align: center; padding: 50px; }
            .cert-box { border: 8px double ${theme.primary}; padding: 40px; border-radius: 20px; background: #0B0F14; }
            h1 { font-size: 38px; color: ${theme.secondary}; font-family: serif; }
            .name { font-size: 32px; font-weight: bold; color: #fff; margin: 20px 0; border-bottom: 2px solid ${theme.primary}; display: inline-block; padding-bottom: 5px; }
            .score { color: #7ED6A5; font-size: 20px; font-weight: bold; }
            .code { font-family: monospace; font-size: 14px; color: #8B94A3; margin-top: 30px; }
          </style>
        </head>
        <body>
          <div class="cert-box">
            <p style="text-transform: uppercase; letter-spacing: 3px; font-size: 12px; color: ${theme.primary}">Official Certificate of Excellence</p>
            <h1>AETHER ADAPTIVE AI PLATFORM</h1>
            <p>This is proudly presented to</p>
            <div class="name">${cert.studentName}</div>
            <p>For achieving a score of <span class="score">${cert.scorePercent}%</span> on the verified exam:</p>
            <h2>${cert.topic}</h2>
            <p style="color: #8B94A3;">Subject: ${cert.subject} • Difficulty: ${cert.difficulty.toUpperCase()}</p>
            <div class="code">Verification Code: ${cert.verificationCode} • Date: ${new Date(cert.issuedAt).toLocaleDateString()}</div>
          </div>
        </body>
      </html>
    `);
    windowPrint.document.close();
    windowPrint.focus();
    setTimeout(() => {
      windowPrint.print();
    }, 500);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 relative selection:bg-white/20">
      {/* Background Sheen */}
      <div
        className="fixed top-0 right-0 w-[600px] h-[600px] rounded-full blur-[140px] pointer-events-none transition-all opacity-40 z-0"
        style={{ background: theme.glow }}
      />

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="success" className="gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified Credentials
            </Badge>
            <span className="text-xs text-white/50 font-mono">80%+ Pass Requirement</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl text-white tracking-tight">
            My Certificates
          </h1>
          <p className="text-xs sm:text-sm text-white/70 mt-1">
            Official verified digital certificates earned by completing timed exams with 80% or higher accuracy.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => navigate('/app/exam')}
          className="font-semibold cursor-pointer shadow-lg border-none shrink-0"
          style={{ backgroundColor: theme.primary, color: '#05070A' }}
          rightIcon={<FileCheck className="w-4 h-4" />}
        >
          Take An Exam
        </Button>
      </div>

      {/* CERTIFICATES GRID */}
      {certificates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
          {certificates.map((cert) => (
            <div
              key={cert.id}
              className="liquid-glass rounded-3xl p-6 sm:p-8 border space-y-6 relative overflow-hidden transition-all shadow-2xl group hover:scale-[1.02]"
              style={{ borderColor: theme.border }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="p-2.5 rounded-xl border"
                    style={{ backgroundColor: theme.badgeBg, borderColor: theme.border }}
                  >
                    <Award className="w-5 h-5" style={{ color: theme.badgeText }} />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase font-bold text-white/50">Verified Certificate</span>
                    <h3 className="text-lg font-serif text-white">{cert.topic}</h3>
                  </div>
                </div>

                <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-[#7ED6A5]/20 text-[#7ED6A5] border border-[#7ED6A5]/40">
                  {cert.scorePercent}% SCORE
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-[#05070A] border border-white/10 space-y-2 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-white/60">Recipient:</span>
                  <span className="text-white font-bold">{cert.studentName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Difficulty:</span>
                  <span className="text-[#8DD3FF] uppercase font-semibold">{cert.difficulty}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Verification Code:</span>
                  <span className="text-[#7ED6A5]">{cert.verificationCode}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-white/50">
                  Issued {new Date(cert.issuedAt).toLocaleDateString()}
                </span>

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleDownloadCert(cert)}
                  className="text-xs liquid-glass text-white border-white/20 hover:bg-white/10 cursor-pointer"
                  leftIcon={<Download className="w-4 h-4 text-[#8DD3FF]" />}
                >
                  Download PDF
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* NO CERTIFICATES YET BANNER */
        <div className="liquid-glass rounded-3xl p-10 sm:p-14 border border-white/10 text-center space-y-5 relative z-10 max-w-xl mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto">
            <Lock className="w-8 h-8 text-white/40" />
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl font-serif text-white">No Verified Certificates Yet</h3>
            <p className="text-xs sm:text-sm text-white/60 leading-relaxed font-sans">
              Complete your personalized learning modules and pass official timed exams with a score of <span className="text-[#7ED6A5] font-semibold">80% or higher</span> to earn shareable certificates!
            </p>
          </div>

          <Button
            variant="primary"
            size="lg"
            onClick={() => navigate('/app/exam')}
            className="font-semibold cursor-pointer shadow-xl px-8 py-3.5 border-none hover:scale-105"
            style={{ backgroundColor: theme.primary, color: '#05070A' }}
            rightIcon={<Sparkles className="w-5 h-5" />}
          >
            Start An Exam Now
          </Button>
        </div>
      )}
    </div>
  );
};
