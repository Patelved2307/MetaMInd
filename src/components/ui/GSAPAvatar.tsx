import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { getAvatarPresetByUrl, type AvatarPreset } from '@/lib/avatarGenerator';

export interface GSAPAvatarProps {
  avatarId?: string;
  seed?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | number;
  interactive?: boolean;
  showAura?: boolean;
  className?: string;
  onClick?: () => void;
}

const SIZE_MAP: Record<string, number> = {
  xs: 28,
  sm: 36,
  md: 48,
  lg: 76,
  xl: 110,
  '2xl': 150,
};

export const GSAPAvatar: React.FC<GSAPAvatarProps> = ({
  avatarId,
  seed,
  size = 'md',
  interactive = true,
  showAura = true,
  className = '',
  onClick,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<SVGGElement>(null);
  const eyesRef = useRef<SVGGElement>(null);
  const pupilsRef = useRef<SVGGElement>(null);
  const eyelidsRef = useRef<SVGGElement>(null);
  const auraRef = useRef<SVGCircleElement>(null);
  const accessoriesRef = useRef<SVGGElement>(null);

  const dimension = typeof size === 'number' ? size : SIZE_MAP[size] || 48;
  const preset: AvatarPreset = getAvatarPresetByUrl(avatarId || seed);
  const theme = preset.theme;
  const style = preset.avatarStyle;

  // Unique ID prefix for gradients to prevent SVG ID collisions across multiple avatars
  const uid = useRef(`meta_av_${Math.random().toString(36).substring(2, 9)}`).current;

  // Setup GSAP Animation Lifecycles
  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Organic Idle Float / Breathing
      if (headRef.current) {
        gsap.to(headRef.current, {
          y: -2.5,
          rotation: 0.6,
          transformOrigin: '50% 85%',
          duration: 2.6,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
      }

      // 2. Ambient Pulsing Aura
      if (auraRef.current) {
        gsap.to(auraRef.current, {
          scale: 1.08,
          opacity: 0.85,
          transformOrigin: '50% 50%',
          duration: 3,
          repeat: -1,
          yoyo: true,
          ease: 'power1.inOut',
        });
      }

      // 3. Natural Random Blinking Loop
      let blinkTimeout: ReturnType<typeof setTimeout>;
      const triggerBlink = () => {
        if (eyelidsRef.current) {
          gsap.timeline({
            onComplete: () => {
              // Next blink between 3.2s and 6s
              const nextDelay = 3200 + Math.random() * 2800;
              blinkTimeout = setTimeout(triggerBlink, nextDelay);
            },
          })
            .to(eyelidsRef.current, {
              scaleY: 1,
              transformOrigin: '50% 50%',
              duration: 0.1,
              ease: 'power2.in',
            })
            .to(eyelidsRef.current, {
              scaleY: 0,
              transformOrigin: '50% 50%',
              duration: 0.12,
              ease: 'power2.out',
            });
        }
      };

      // Initial blink delay
      blinkTimeout = setTimeout(triggerBlink, 2000 + Math.random() * 1500);

      return () => clearTimeout(blinkTimeout);
    }, containerRef);

    return () => ctx.revert();
  }, [preset.id]);

  // Interactive Mouse Gaze Movement
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive || !containerRef.current || !pupilsRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const xRatio = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
    const yRatio = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);

    gsap.to(pupilsRef.current, {
      x: xRatio * 2.2,
      y: yRatio * 1.8,
      duration: 0.25,
      ease: 'power2.out',
      overwrite: 'auto',
    });

    if (headRef.current) {
      gsap.to(headRef.current, {
        rotation: xRatio * 2,
        duration: 0.35,
        ease: 'power1.out',
        overwrite: 'auto',
      });
    }
  };

  const handleMouseLeave = () => {
    if (!interactive) return;
    if (pupilsRef.current) {
      gsap.to(pupilsRef.current, {
        x: 0,
        y: 0,
        duration: 0.45,
        ease: 'power2.out',
      });
    }
    if (headRef.current) {
      gsap.to(headRef.current, {
        rotation: 0,
        duration: 0.45,
        ease: 'power2.out',
      });
    }
  };

  const handleMouseEnter = () => {
    if (!interactive) return;
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { scale: 0.96 },
        { scale: 1.04, duration: 0.3, ease: 'back.out(2.5)' }
      );
    }
    if (accessoriesRef.current) {
      gsap.fromTo(
        accessoriesRef.current,
        { y: -1 },
        { y: 0, duration: 0.4, ease: 'elastic.out(1, 0.4)' }
      );
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={`relative inline-flex items-center justify-center shrink-0 rounded-full select-none overflow-visible ${
        interactive ? 'cursor-pointer hover:shadow-lg transition-shadow duration-300' : ''
      } ${className}`}
      style={{
        width: dimension,
        height: dimension,
      }}
      title={`${preset.name} (${preset.theme.themeName})`}
    >
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full drop-shadow-sm overflow-visible"
      >
        <defs>
          {/* Subtle Ambient Radial Lighting */}
          <radialGradient id={`${uid}_aura`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={theme.primary} stopOpacity="0.4" />
            <stop offset="65%" stopColor={theme.secondary} stopOpacity="0.2" />
            <stop offset="100%" stopColor={theme.primary} stopOpacity="0" />
          </radialGradient>

          {/* Background Badge Gradient */}
          <linearGradient id={`${uid}_bg`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={style.backdrop} />
            <stop offset="100%" stopColor={theme.primary} stopOpacity="0.85" />
          </linearGradient>

          {/* Skin Volumetric 3D Shading */}
          <linearGradient id={`${uid}_skin`} x1="30%" y1="0%" x2="70%" y2="100%">
            <stop offset="0%" stopColor={style.skin} />
            <stop offset="100%" stopColor={style.skinShadow} />
          </linearGradient>

          {/* Hair Gradient */}
          <linearGradient id={`${uid}_hair`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={style.hairHighlight} />
            <stop offset="50%" stopColor={style.hair} />
            <stop offset="100%" stopColor="#0F172A" />
          </linearGradient>

          {/* Eye Iris Gradient */}
          <radialGradient id={`${uid}_iris`} cx="40%" cy="40%" r="50%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
            <stop offset="30%" stopColor={theme.secondary} />
            <stop offset="85%" stopColor={theme.primary} />
            <stop offset="100%" stopColor="#090D16" />
          </radialGradient>

          {/* Clothes Fabric Gradient */}
          <linearGradient id={`${uid}_clothes`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={style.clothing} />
            <stop offset="100%" stopColor={theme.primary} />
          </linearGradient>

          {/* Metallic / Glass Specular */}
          <linearGradient id={`${uid}_glass`} x1="0%" y1="0%" x2="100%" y2="80%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.85" />
            <stop offset="45%" stopColor="#FFFFFF" stopOpacity="0.1" />
            <stop offset="100%" stopColor={theme.secondary} stopOpacity="0.35" />
          </linearGradient>

          {/* Clip paths for circular frame and eyelids */}
          <clipPath id={`${uid}_circle_clip`}>
            <circle cx="50" cy="50" r="47" />
          </clipPath>
        </defs>

        {/* 1. Pulsing Synaptic Aura (Outside circle) */}
        {showAura && (
          <circle
            ref={auraRef}
            cx="50"
            cy="50"
            r="49"
            fill={`url(#${uid}_aura)`}
            className="pointer-events-none"
          />
        )}

        {/* 2. Main Framed Avatar Container */}
        <g clipPath={`url(#${uid}_circle_clip)`}>
          {/* Circular Backdrop Plate */}
          <circle cx="50" cy="50" r="47" fill={`url(#${uid}_bg)`} />

          {/* Cybernetic Grid Line Highlights */}
          <path
            d="M20 90 L50 40 L80 90 M10 50 Q50 20 90 50"
            stroke="white"
            strokeOpacity="0.12"
            strokeWidth="1.5"
            fill="none"
          />

          {/* 3. Shoulders / Clothing Base */}
          <g>
            {/* Base Torso */}
            <path
              d="M18 100 C18 78 32 72 50 72 C68 72 82 78 82 100 Z"
              fill={`url(#${uid}_clothes)`}
            />

            {/* Collar & Jacket Details */}
            <path
              d="M36 73 L50 87 L64 73"
              fill="#FFFFFF"
              fillOpacity="0.18"
            />
            <path
              d="M48 87 L48 100 M52 87 L52 100"
              stroke="#000000"
              strokeOpacity="0.15"
              strokeWidth="1"
            />
            {/* Neck */}
            <path
              d="M43 65 L43 75 C43 78 57 78 57 75 L57 65 Z"
              fill={style.skinShadow}
            />
          </g>

          {/* 4. Head Group (Animates with GSAP Float & Rotation) */}
          <g ref={headRef}>
            {/* Back Hair / Shadow Behind Ears */}
            {style.archetype !== 'skeleton' && style.archetype !== 'bear' && (
              <ellipse cx="50" cy="46" rx="27" ry="26" fill={`url(#${uid}_hair)`} />
            )}

            {/* Ears */}
            {style.archetype !== 'skeleton' && (
              <g>
                <circle cx="24" cy="50" r="5.5" fill={style.skinShadow} />
                <circle cx="24" cy="50" r="3" fill={style.skin} />
                <circle cx="76" cy="50" r="5.5" fill={style.skinShadow} />
                <circle cx="76" cy="50" r="3" fill={style.skin} />
                {style.accessory === 'earrings' && (
                  <circle cx="77" cy="55" r="2" fill={theme.secondary} />
                )}
              </g>
            )}

            {/* Bear Ears */}
            {style.archetype === 'bear' && (
              <g>
                <circle cx="27" cy="27" r="10" fill={style.skinShadow} />
                <circle cx="27" cy="27" r="6" fill={theme.primary} />
                <circle cx="73" cy="27" r="10" fill={style.skinShadow} />
                <circle cx="73" cy="27" r="6" fill={theme.primary} />
              </g>
            )}

            {/* Face Shape */}
            {style.archetype === 'skeleton' ? (
              // Cyber Android Skull
              <g>
                <path
                  d="M28 42 C28 26 72 26 72 42 C72 58 64 68 50 68 C36 68 28 58 28 42 Z"
                  fill="#0F172A"
                  stroke={theme.primary}
                  strokeWidth="2"
                />
                <path
                  d="M40 68 L40 76 C40 78 60 78 60 76 L60 68 Z"
                  fill="#1E293B"
                  stroke={theme.secondary}
                  strokeWidth="1.5"
                />
              </g>
            ) : style.archetype === 'bear' ? (
              // Streetwear Bear Head
              <circle cx="50" cy="48" r="24" fill={`url(#${uid}_skin)`} />
            ) : (
              // Human Realistic Face Contour
              <path
                d="M26 44 C26 29 74 29 74 44 C74 58 65 67 50 68 C35 67 26 58 26 44 Z"
                fill={`url(#${uid}_skin)`}
              />
            )}

            {/* Nose */}
            {style.archetype !== 'skeleton' && style.archetype !== 'bear' && (
              <path
                d="M49 51 L48 55 Q50 56.5 52 55"
                stroke={style.skinShadow}
                strokeWidth="1.6"
                strokeLinecap="round"
                fill="none"
              />
            )}

            {/* Bear Snout */}
            {style.archetype === 'bear' && (
              <g>
                <ellipse cx="50" cy="53" rx="9" ry="7" fill="#FED7AA" />
                <path d="M46 50 Q50 48 54 50 L50 53 Z" fill="#431407" />
                <path d="M50 53 L50 57" stroke="#431407" strokeWidth="1.5" />
              </g>
            )}

            {/* Cheeks Glow / Blush */}
            {style.archetype !== 'skeleton' && (
              <g opacity="0.35">
                <circle cx="34" cy="55" r="4.5" fill="#F43F5E" />
                <circle cx="66" cy="55" r="4.5" fill="#F43F5E" />
              </g>
            )}

            {/* Mouth / Smile */}
            <g>
              {style.archetype === 'skeleton' ? (
                <path
                  d="M42 73 L42 75 M46 73 L46 75 M50 73 L50 75 M54 73 L54 75 M58 73 L58 75"
                  stroke={theme.secondary}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              ) : style.archetype === 'solar' ? (
                <path
                  d="M43 59 Q50 66 57 59"
                  stroke="#BE123C"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  fill="#FFFFFF"
                />
              ) : (
                <path
                  d="M44 60 Q50 64 56 60"
                  stroke={style.skinShadow}
                  strokeWidth="2"
                  strokeLinecap="round"
                  fill="none"
                />
              )}
            </g>

            {/* 5. Eyes & Pupils (Animates with Cursor tracking & Blinks) */}
            <g ref={eyesRef}>
              {/* Eye Whites */}
              {style.archetype === 'skeleton' ? (
                // Cyber Glowing Oculars
                <g>
                  <circle cx="38" cy="44" r="6.5" fill="#000000" stroke={theme.primary} strokeWidth="1.5" />
                  <circle cx="62" cy="44" r="6.5" fill="#000000" stroke={theme.primary} strokeWidth="1.5" />
                </g>
              ) : (
                <g>
                  <ellipse cx="37" cy="45" rx="5.5" ry="5" fill="#FFFFFF" />
                  <ellipse cx="63" cy="45" rx="5.5" ry="5" fill="#FFFFFF" />
                  {/* Subtle Eyelash & Crease */}
                  <path d="M31 42 Q37 38 43 42" stroke="#0F172A" strokeWidth="1.8" fill="none" strokeLinecap="round" />
                  <path d="M57 42 Q63 38 69 42" stroke="#0F172A" strokeWidth="1.8" fill="none" strokeLinecap="round" />
                </g>
              )}

              {/* Pupils with GSAP Gaze Movement */}
              <g ref={pupilsRef}>
                {style.archetype === 'skeleton' ? (
                  // Glowing Laser Core
                  <g>
                    <circle cx="38" cy="44" r="3.5" fill={theme.secondary} />
                    <circle cx="38" cy="44" r="1.5" fill="#FFFFFF" />
                    <circle cx="62" cy="44" r="3.5" fill={theme.secondary} />
                    <circle cx="62" cy="44" r="1.5" fill="#FFFFFF" />
                  </g>
                ) : (
                  // Realistic Gradient Irises with Specular Sparkle
                  <g>
                    {/* Left Eye */}
                    <circle cx="37" cy="45" r="3.6" fill={`url(#${uid}_iris)`} />
                    <circle cx="37" cy="45" r="1.8" fill="#090D16" />
                    <circle cx="35.5" cy="43.5" r="1" fill="#FFFFFF" />
                    <circle cx="38.5" cy="46" r="0.5" fill="#FFFFFF" opacity="0.8" />

                    {/* Right Eye */}
                    <circle cx="63" cy="45" r="3.6" fill={`url(#${uid}_iris)`} />
                    <circle cx="63" cy="45" r="1.8" fill="#090D16" />
                    <circle cx="61.5" cy="43.5" r="1" fill="#FFFFFF" />
                    <circle cx="64.5" cy="46" r="0.5" fill="#FFFFFF" opacity="0.8" />
                  </g>
                )}
              </g>

              {/* GSAP Animated Eyelids (for realistic randomized blinking) */}
              <g ref={eyelidsRef} style={{ transformOrigin: '50% 45%', transform: 'scaleY(0)' }}>
                <rect x="30" y="39" width="14" height="12" fill={style.skin} rx="3" />
                <rect x="56" y="39" width="14" height="12" fill={style.skin} rx="3" />
                <line x1="31" y1="45" x2="43" y2="45" stroke={style.skinShadow} strokeWidth="1.5" />
                <line x1="57" y1="45" x2="69" y2="45" stroke={style.skinShadow} strokeWidth="1.5" />
              </g>
            </g>

            {/* Eyebrows */}
            {style.archetype !== 'skeleton' && style.archetype !== 'bear' && (
              <g>
                <path
                  d="M32 38 Q37 34 43 37"
                  stroke={style.hair}
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  fill="none"
                />
                <path
                  d="M57 37 Q63 34 68 38"
                  stroke={style.hair}
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  fill="none"
                />
              </g>
            )}

            {/* 6. Front Hair / Headwear Styling */}
            <g>
              {style.archetype === 'scholar' && (
                // Long sleek scholar bangs with highlights
                <path
                  d="M24 38 C28 20 72 20 76 38 C72 32 66 31 58 35 C52 38 46 38 42 35 C34 31 28 32 24 38 Z"
                  fill={`url(#${uid}_hair)`}
                />
              )}

              {style.archetype === 'cyber' && (
                // Sharp Spiky Cyber Locks
                <path
                  d="M25 36 L30 20 L38 28 L48 16 L54 26 L64 18 L70 28 L76 36 C70 30 62 33 50 30 C38 33 30 30 25 36 Z"
                  fill={`url(#${uid}_hair)`}
                />
              )}

              {style.archetype === 'solar' && (
                // Energetic anime wavy hair with straw/band highlight
                <g>
                  <path
                    d="M22 40 C22 18 78 18 78 40 C70 30 64 34 50 31 C36 34 30 30 22 40 Z"
                    fill={`url(#${uid}_hair)`}
                  />
                  <path d="M26 34 Q50 26 74 34" stroke={theme.secondary} strokeWidth="3" fill="none" />
                </g>
              )}

              {style.archetype === 'joy' && (
                // Bubbly double top-buns
                <g>
                  <circle cx="28" cy="22" r="9" fill={`url(#${uid}_hair)`} />
                  <circle cx="72" cy="22" r="9" fill={`url(#${uid}_hair)`} />
                  <path
                    d="M25 38 C28 22 72 22 75 38 C70 31 60 33 50 31 C40 33 30 31 25 38 Z"
                    fill={`url(#${uid}_hair)`}
                  />
                </g>
              )}

              {style.archetype === 'fresh' && (
                // Clean side-fade pompadour
                <path
                  d="M26 38 C26 19 76 22 74 38 C68 31 60 32 50 30 C40 32 32 31 26 38 Z"
                  fill={`url(#${uid}_hair)`}
                />
              )}

              {style.archetype === 'lofi' && (
                // Soft curtain bangs framing face
                <path
                  d="M24 42 C26 24 74 24 76 42 C70 32 62 34 50 33 C38 34 30 32 24 42 Z"
                  fill={`url(#${uid}_hair)`}
                />
              )}

              {style.accessory === 'cap' && (
                // Retro cap turned sideways
                <g>
                  <path d="M26 33 Q50 16 74 33" fill="#1E293B" />
                  <path d="M20 33 Q45 28 65 33" stroke="#F59E0B" strokeWidth="4" strokeLinecap="round" fill="none" />
                </g>
              )}

              {style.accessory === 'beanie' && (
                // Knit Beanie
                <path
                  d="M24 35 C24 16 76 16 76 35 C68 31 32 31 24 35 Z"
                  fill={theme.primary}
                />
              )}
            </g>

            {/* 7. Distinctive High-Tech Accessories */}
            <g ref={accessoriesRef}>
              {style.accessory === 'glasses' && (
                // Smart Designer Specs with Glass Specular Glare
                <g>
                  <rect
                    x="29"
                    y="39"
                    width="18"
                    height="12"
                    rx="3.5"
                    fill={`url(#${uid}_glass)`}
                    stroke="#0F172A"
                    strokeWidth="1.8"
                  />
                  <rect
                    x="53"
                    y="39"
                    width="18"
                    height="12"
                    rx="3.5"
                    fill={`url(#${uid}_glass)`}
                    stroke="#0F172A"
                    strokeWidth="1.8"
                  />
                  <line x1="47" y1="44" x2="53" y2="44" stroke="#0F172A" strokeWidth="2" />
                  {/* Lens Specular Streak */}
                  <line x1="31" y1="48" x2="37" y2="41" stroke="#FFFFFF" strokeWidth="1.2" strokeOpacity="0.7" />
                  <line x1="55" y1="48" x2="61" y2="41" stroke="#FFFFFF" strokeWidth="1.2" strokeOpacity="0.7" />
                </g>
              )}

              {style.accessory === 'headphones' && (
                // Professional Over-Ear Studio Headphones
                <g>
                  {/* Headband arch */}
                  <path
                    d="M17 48 C17 17 83 17 83 48"
                    stroke="#1E293B"
                    strokeWidth="4.5"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <path
                    d="M20 48 C20 22 80 22 80 48"
                    stroke={theme.secondary}
                    strokeWidth="1.5"
                    fill="none"
                  />
                  {/* Ear Cushions */}
                  <rect x="14" y="42" width="8" height="16" rx="4" fill={theme.primary} />
                  <rect x="78" y="42" width="8" height="16" rx="4" fill={theme.primary} />
                </g>
              )}

              {style.accessory === 'visor' && (
                // Cyberpunk AR Holographic Visor
                <g opacity="0.9">
                  <path
                    d="M26 41 Q50 37 74 41 L72 49 Q50 45 28 49 Z"
                    fill={theme.secondary}
                    fillOpacity="0.5"
                    stroke={theme.primary}
                    strokeWidth="1.5"
                  />
                  <line x1="32" y1="45" x2="68" y2="45" stroke="#FFFFFF" strokeWidth="1" strokeDasharray="3, 2" />
                </g>
              )}
            </g>
          </g>
        </g>

        {/* 8. Outer Sleek Glass Border Rim */}
        <circle
          cx="50"
          cy="50"
          r="47"
          fill="none"
          stroke={theme.primary}
          strokeWidth="2"
          strokeOpacity="0.8"
        />
        <circle
          cx="50"
          cy="50"
          r="48.5"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="1"
          strokeOpacity="0.4"
        />
      </svg>
    </div>
  );
};
