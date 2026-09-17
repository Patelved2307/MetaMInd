import React, { useState } from 'react';
import { Dialog } from './Dialog';
import { Button } from './Button';
import type { IssuedCertificate } from '@/features/exam';
import { ShieldCheck, Printer, Check, Copy, Award, Download } from 'lucide-react';
import {
  GeometricAchievementCertificate,
  generateCertificateHtml,
  downloadCertificatePng,
  getRegisteredUserName,
} from './GeometricAchievementCertificate';

interface CertificateDesignModalProps {
  isOpen: boolean;
  onClose: () => void;
  certificate: IssuedCertificate | null;
  userName?: string;
  primaryColor?: string;
}

export const CertificateDesignModal: React.FC<CertificateDesignModalProps> = ({
  isOpen,
  onClose,
  certificate,
  userName,
  primaryColor = '#353B97',
}) => {
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  if (!certificate) return null;

  const registeredName = userName || certificate.studentName || getRegisteredUserName();

  const handlePrintCertificate = () => {
    const windowPrint = window.open('', '_blank');
    if (!windowPrint) return;

    windowPrint.document.open();
    windowPrint.document.write(generateCertificateHtml(certificate, registeredName));
    windowPrint.document.close();
    windowPrint.focus();

    // Give font and image a moment to load before triggering print dialog
    setTimeout(() => {
      windowPrint.print();
    }, 600);
  };

  const handleDownloadPng = async () => {
    try {
      setIsDownloading(true);
      const safeTopic = (certificate.topic || 'certificate').toLowerCase().replace(/[^a-z0-9]/g, '-');
      const safeName = registeredName.toLowerCase().replace(/[^a-z0-9]/g, '-');
      await downloadCertificatePng(registeredName, `certificate-${safeName}-${safeTopic}.png`);
    } catch (err) {
      console.error('Failed to download certificate PNG:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCopyVerificationLink = () => {
    const url = `${window.location.origin}/app/certificates?code=${certificate.verificationCode}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Official Verified Certificate"
      description="Official credential using the authorized template, personalized with your registered name."
      className="max-w-4xl w-full"
    >
      <div className="space-y-6 pt-2">
        {/* CERTIFICATE INFO STRIP */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200/90 gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#353B97] text-white flex items-center justify-center font-bold text-xs shadow-xs">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-900">{certificate.topic}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                  {certificate.scorePercent}% SCORE
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-mono">
                Registered Student: <strong className="text-slate-800 font-bold">{registeredName}</strong>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCopyVerificationLink}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold shadow-2xs transition-all cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Link Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                <span>Copy Verify Link</span>
              </>
            )}
          </button>
        </div>

        {/* HIGH-RES CERTIFICATE PREVIEW (DIRECT PNG TEMPLATE) */}
        <div className="w-full overflow-x-auto p-1">
          <div className="min-w-[600px] sm:min-w-0">
            <GeometricAchievementCertificate certificate={certificate} userName={registeredName} />
          </div>
        </div>

        {/* MODAL FOOTER */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <span className="text-xs text-slate-500 font-mono flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Verified Record: <strong className="text-slate-800">{certificate.verificationCode}</strong>
          </span>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onClose} className="cursor-pointer">
              Close
            </Button>

            <Button
              variant="secondary"
              size="sm"
              onClick={handleDownloadPng}
              disabled={isDownloading}
              className="font-bold text-xs cursor-pointer shadow-xs bg-slate-100 text-slate-800 border-slate-200 hover:bg-slate-200"
              leftIcon={<Download className="w-4 h-4 text-blue-600" />}
            >
              {isDownloading ? 'Generating PNG...' : 'Download Image (PNG)'}
            </Button>

            <Button
              variant="primary"
              size="sm"
              onClick={handlePrintCertificate}
              className="font-bold text-xs cursor-pointer shadow-md text-white transition-transform hover:scale-105"
              style={{ backgroundColor: primaryColor }}
              leftIcon={<Printer className="w-4 h-4" />}
            >
              Print / Save PDF
            </Button>
          </div>
        </div>
      </div>
    </Dialog>
  );
};
