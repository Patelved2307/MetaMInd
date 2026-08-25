import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth';
import { examService, type IssuedCertificate } from '@/features/exam';
import { getAvatarPresetByUrl, generateAvatarUrl, sanitizeAvatarUrl } from '@/lib/avatarGenerator';
import { CertificateDesignModal } from '@/components/ui/CertificateDesignModal';
import { Button } from '@/components/ui/Button';
import {
  ShieldCheck,
  Award,
  FileCheck,
  Lock,
  Sparkles,
  Share2,
  Eye,
} from 'lucide-react';

export const CertificatesPage: React.FC = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const rawAvatarUrl = profile?.avatar_url || generateAvatarUrl(user?.id || 'demo');
  const avatarUrl = sanitizeAvatarUrl(rawAvatarUrl);
  const activePreset = getAvatarPresetByUrl(avatarUrl);
  const theme = activePreset.theme;

  const [certificates, setCertificates] = useState<IssuedCertificate[]>([]);
  const [activeCertModal, setActiveCertModal] = useState<IssuedCertificate | null>(null);

  useEffect(() => {
    const list = examService.getCertificates();
    setCertificates(list);
  }, []);

  const handleOpenDesignModal = (cert: IssuedCertificate) => {
    setActiveCertModal(cert);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 relative selection:bg-blue-100 text-slate-800">
      {/* Light Radial Ambient Glow */}
      <div
        className="fixed top-0 right-0 w-[600px] h-[600px] rounded-full blur-[140px] pointer-events-none opacity-20 z-0"
        style={{ background: theme.glow }}
      />

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold font-mono flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Verified Credentials
            </span>
            <span className="text-xs text-slate-500 font-mono">60%+ Pass Benchmark</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            My Verified Certificates
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 font-sans">
            Official verified digital credentials featuring modern geometric design templates & unique verification IDs.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => navigate('/app/exam')}
          className="font-bold cursor-pointer shadow-md hover:scale-105 shrink-0"
          style={{ backgroundColor: theme.primary, color: '#FFFFFF' }}
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
              className="rounded-3xl p-6 sm:p-8 bg-white border border-slate-200/80 space-y-6 relative overflow-hidden transition-all shadow-sm hover:shadow-md group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div
                    className="p-2.5 rounded-xl border"
                    style={{ backgroundColor: theme.badgeBg, borderColor: theme.border }}
                  >
                    <Award className="w-5 h-5" style={{ color: theme.primary }} />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase font-bold text-slate-400">Verified ID Certificate</span>
                    <h3 className="text-base font-bold text-slate-900 font-display">{cert.topic}</h3>
                  </div>
                </div>

                <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {cert.scorePercent}% SCORE
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-500">Student Recipient:</span>
                  <span className="text-slate-900 font-bold">{cert.studentName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Difficulty Mode:</span>
                  <span className="text-blue-600 uppercase font-semibold">{cert.difficulty}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Unique Verification ID:</span>
                  <span className="text-emerald-700 font-bold">{cert.verificationCode}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-slate-500 font-mono">
                  Issued {new Date(cert.issuedAt).toLocaleDateString()}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => alert(`Share URL: https://metamind.app/verify/${cert.verificationCode}`)}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer transition-all"
                    title="Share Link"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                  </button>

                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleOpenDesignModal(cert)}
                    className="text-xs bg-slate-100 text-slate-800 border-slate-200 hover:bg-slate-200 cursor-pointer shadow-xs font-semibold"
                    leftIcon={<Eye className="w-4 h-4 text-blue-600" />}
                  >
                    View Templates
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* NO CERTIFICATES YET BANNER */
        <div className="rounded-3xl p-10 sm:p-14 bg-white border border-slate-200/80 text-center space-y-5 relative z-10 max-w-xl mx-auto shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center mx-auto text-slate-400">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl font-display font-bold text-slate-900">No Verified Certificates Yet</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans">
              Complete your personalized learning modules and pass official timed exams with a score of <span className="text-emerald-600 font-bold">60% or higher</span> to earn shareable certificates!
            </p>
          </div>

          <Button
            variant="primary"
            size="lg"
            onClick={() => navigate('/app/exam')}
            className="font-bold cursor-pointer shadow-md px-8 py-3.5 border-none hover:scale-105 text-white"
            style={{ backgroundColor: theme.primary }}
            rightIcon={<Sparkles className="w-5 h-5" />}
          >
            Start An Exam Now
          </Button>
        </div>
      )}

      {/* HIGH-RES CERTIFICATE TEMPLATES MODAL */}
      <CertificateDesignModal
        isOpen={!!activeCertModal}
        onClose={() => setActiveCertModal(null)}
        certificate={activeCertModal}
        primaryColor={theme.primary}
      />
    </div>
  );
};
