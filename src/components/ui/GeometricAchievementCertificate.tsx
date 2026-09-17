import React from 'react';
import type { IssuedCertificate } from '@/features/exam';

interface GeometricAchievementCertificateProps {
  certificate?: IssuedCertificate | null;
  userName?: string;
  className?: string;
}

/**
 * Retrieve the active registered user's name from stored profile or fallback.
 */
export const getRegisteredUserName = (fallback = 'Ved Patel'): string => {
  try {
    const cached = localStorage.getItem('active_user_profile');
    if (cached) {
      const parsed = JSON.parse(cached);
      if (parsed?.full_name && typeof parsed.full_name === 'string' && parsed.full_name.trim()) {
        return parsed.full_name.trim();
      }
    }
  } catch {
    // ignore
  }
  return fallback;
};

/**
 * Certificate component that directly renders the provided PNG template
 * and places the user's registered name in the exact slot.
 */
export const GeometricAchievementCertificate: React.FC<GeometricAchievementCertificateProps> = ({
  certificate,
  userName,
  className = '',
}) => {
  const registeredName = userName || certificate?.studentName || getRegisteredUserName();

  return (
    <div
      className={`relative w-full aspect-[610/427] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl select-none bg-slate-100 ${className}`}
      style={{
        boxShadow: '0 20px 50px rgba(53, 59, 151, 0.22)',
      }}
    >
      {/* DIRECT PNG CERTIFICATE TEMPLATE */}
      <img
        src="/assets/certificates/certificate_template_clean.png"
        alt="Official Certificate of Achievement"
        className="w-full h-full object-cover block pointer-events-none select-none"
        loading="eager"
      />

      {/* REGISTERED USER NAME DYNAMIC OVERLAY */}
      <div
        className="absolute left-[10.33%] top-[55.2%] w-[54%] pointer-events-none flex items-center"
        style={{
          fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
        }}
      >
        <span
          className="font-extrabold tracking-tight leading-none text-[#363C9E] whitespace-nowrap overflow-hidden text-ellipsis text-[clamp(15px,3.8vw,36px)]"
          style={{
            color: '#363C9E',
            textShadow: '0 0.5px 1px rgba(54,60,158,0.15)',
          }}
        >
          {registeredName}
        </span>
      </div>
    </div>
  );
};

/**
 * Generates and triggers instant high-res PNG download with the registered user's name.
 */
export const downloadCertificatePng = async (
  userName: string,
  fileName = 'certificate.png'
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = '/assets/certificates/certificate_template_clean.png';

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const width = img.naturalWidth || 1830;
        const height = img.naturalHeight || 1281;
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context unavailable'));
          return;
        }

        // Draw clean base template PNG
        ctx.drawImage(img, 0, 0, width, height);

        // Draw registered user's name
        const fontSize = Math.round(height * 0.054);
        ctx.font = `800 ${fontSize}px "Plus Jakarta Sans", -apple-system, sans-serif`;
        ctx.fillStyle = '#363C9E';
        ctx.textBaseline = 'middle';

        const posX = width * 0.1033;
        const posY = height * 0.584;
        ctx.fillText(userName, posX, posY);

        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error('Failed to generate PNG blob'));
            return;
          }
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = fileName;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
          resolve();
        }, 'image/png');
      } catch (err) {
        reject(err);
      }
    };

    img.onerror = (err) => reject(err);
  });
};

/**
 * Generates standalone HTML document for high-res printing or PDF download.
 */
export const generateCertificateHtml = (certificate: IssuedCertificate, userName?: string): string => {
  const registeredName = userName || certificate?.studentName || getRegisteredUserName();

  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <title>Certificate of Achievement - ${registeredName}</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800;900&display=swap" rel="stylesheet" />
        <style>
          @page {
            size: A4 landscape;
            margin: 0;
          }
          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }
          body {
            background-color: #F8FAFC;
            font-family: 'Plus Jakarta Sans', -apple-system, sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            padding: 20px;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          @media print {
            body {
              padding: 0;
              background: none;
            }
            .cert-box {
              box-shadow: none !important;
              border: none !important;
              border-radius: 0 !important;
              width: 100vw !important;
              height: 100vh !important;
            }
          }
          .cert-box {
            position: relative;
            width: 1050px;
            height: 735px;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 25px 60px rgba(53, 59, 151, 0.28);
            background-color: #FFFFFF;
          }
          .cert-bg-img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
          }
          .user-name-overlay {
            position: absolute;
            left: 10.33%;
            top: 55.4%;
            width: 54%;
            font-family: 'Plus Jakarta Sans', sans-serif;
            font-size: 38px;
            font-weight: 800;
            color: #363C9E;
            line-height: 1;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            letter-spacing: -0.5px;
          }
        </style>
      </head>
      <body>
        <div class="cert-box">
          <img class="cert-bg-img" src="${window.location.origin}/assets/certificates/certificate_template_clean.png" alt="Certificate" />
          <div class="user-name-overlay">${registeredName}</div>
        </div>
      </body>
    </html>
  `;
};
