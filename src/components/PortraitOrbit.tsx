import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { BATCH_STUDENTS, Student } from '../data/students';
import {
  Play,
  Pause,
  RotateCw,
  RotateCcw,
  Sparkles,
  Compass,
  Users,
} from 'lucide-react';

interface PortraitOrbitProps {
  onSelectStudent?: (student: Student) => void;
}

export const PortraitOrbit: React.FC<PortraitOrbitProps> = ({ onSelectStudent }) => {
  const [rotation, setRotation] = useState<number>(0);
  const [dragging, setDragging] = useState<boolean>(false);
  const [isAutoRotating, setIsAutoRotating] = useState<boolean>(true);
  const [rotationSpeed, setRotationSpeed] = useState<number>(0.12); // degrees per 16.6ms frame
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // High-performance physics refs (avoiding React state re-render thrashing during pointer move)
  const rotationRef = useRef<number>(0);
  const velocityRef = useRef<number>(0);
  const isDraggingRef = useRef<boolean>(false);
  const isHoveredRef = useRef<boolean>(false);
  const pointerIdRef = useRef<number | null>(null);
  const lastPointerXRef = useRef<number>(0);
  const lastPointerTimeRef = useRef<number>(0);
  const animFrameRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef<number>(performance.now());
  const hasMovedSignificantlyRef = useRef<boolean>(false);

  useEffect(() => {
    isDraggingRef.current = dragging;
  }, [dragging]);

  // Unified 60Hz / 120Hz physics & momentum animation loop
  useEffect(() => {
    const loop = (now: number) => {
      const dt = Math.min((now - lastFrameTimeRef.current) / 16.666, 3); // normalized time step
      lastFrameTimeRef.current = now;

      if (!isDraggingRef.current) {
        // Apply momentum inertia with smooth friction decay
        if (Math.abs(velocityRef.current) > 0.01) {
          rotationRef.current = (rotationRef.current + velocityRef.current * dt) % 360;
          velocityRef.current *= Math.pow(0.94, dt); // smooth aerodynamic damping
        } else {
          velocityRef.current = 0;
          // When velocity has decayed, apply steady auto-rotation (if enabled and not hovered)
          if (isAutoRotating && !isHoveredRef.current) {
            rotationRef.current = (rotationRef.current + rotationSpeed * dt) % 360;
          }
        }

        // Commit single render per display frame
        setRotation(rotationRef.current);
      }

      animFrameRef.current = requestAnimationFrame(loop);
    };

    lastFrameTimeRef.current = performance.now();
    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isAutoRotating, rotationSpeed]);

  // Pointer event handlers with momentum & velocity tracking
  const handlePointerDown = useCallback((e: React.PointerEvent<SVGSVGElement>) => {
    if (pointerIdRef.current !== null || (e.pointerType === 'mouse' && e.button !== 0)) return;

    pointerIdRef.current = e.pointerId;
    lastPointerXRef.current = e.clientX;
    lastPointerTimeRef.current = performance.now();
    velocityRef.current = 0;
    hasMovedSignificantlyRef.current = false;
    setDragging(true);

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Ignore if setPointerCapture is unsupported
    }
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent<SVGSVGElement>) => {
    if (pointerIdRef.current !== e.pointerId) return;

    const now = performance.now();
    const dt = Math.max(now - lastPointerTimeRef.current, 1);
    const deltaX = e.clientX - lastPointerXRef.current;

    if (Math.abs(deltaX) > 3) {
      hasMovedSignificantlyRef.current = true;
    }

    const width = e.currentTarget.getBoundingClientRect().width || 1200;
    // Normalized degrees rotated
    const deltaDeg = (deltaX * 220) / width;

    // Track instantaneous throw velocity for smooth release inertia
    const instVelocity = -deltaDeg / (dt / 16.666);
    // Exponential smoothing on velocity
    velocityRef.current = velocityRef.current * 0.4 + instVelocity * 0.6;

    rotationRef.current = (rotationRef.current - deltaDeg) % 360;
    lastPointerXRef.current = e.clientX;
    lastPointerTimeRef.current = now;

    // Immediate visual update during drag
    setRotation(rotationRef.current);
  }, []);

  const handlePointerUp = useCallback((e: React.PointerEvent<SVGSVGElement>) => {
    if (pointerIdRef.current === e.pointerId) {
      pointerIdRef.current = null;
      setDragging(false);

      // Clamp throw velocity to comfortable range
      velocityRef.current = Math.max(Math.min(velocityRef.current, 4.5), -4.5);

      try {
        if (e.currentTarget.hasPointerCapture(e.pointerId)) {
          e.currentTarget.releasePointerCapture(e.pointerId);
        }
      } catch {
        // Ignore
      }
    }
  }, []);

  // Keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      velocityRef.current = -1.8;
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      velocityRef.current = 1.8;
    } else if (e.key === ' ') {
      e.preventDefault();
      setIsAutoRotating((p) => !p);
    }
  }, []);

  // Compute 3D position, depth, tilt, and perspective for each of the 12 brothers
  const cards = useMemo(() => {
    return BATCH_STUDENTS.map((student, index) => {
      const angle = ((index * 30 + 90 + rotation) * Math.PI) / 180;
      const depth = Math.sin(angle); // -1 (back) to +1 (front)
      const cosVal = Math.cos(angle);

      return {
        student,
        index,
        depth,
        // Elliptical orbit centered at (700, 270)
        x: Math.round((700 + 486 * cosVal) * 10) / 10,
        y: Math.round((270 + 172 * depth) * 10) / 10,
        scale: Math.round((0.58 + ((depth + 1) / 2) * 0.62) * 1000) / 1000,
        tilt: Math.round((-21 * cosVal) * 10) / 10,
        width: Math.round((0.86 + 0.14 * Math.abs(depth)) * 1000) / 1000,
      };
    }).sort((a, b) => a.depth - b.depth);
  }, [rotation]);

  // Central Gold Insignia Badge
  const badge = useMemo(
    () => (
      <g transform="translate(700 270)" className="pointer-events-none select-none">
        {/* Outer pulsing halo circle */}
        <circle
          r="108"
          fill="none"
          stroke="#bb7d34"
          strokeWidth="6"
          opacity="0.32"
          filter="url(#glow)"
        />
        {/* Dark core badge */}
        <circle r="100" fill="#020912" stroke="url(#gold)" strokeWidth="2.5" />
        <circle r="92" fill="none" stroke="#95703c" strokeOpacity="0.35" strokeDasharray="4 3" />

        {/* Medical Electrocardiogram (ECG) rhythm heartbeat line in gold */}
        <path
          d="M-43 -28h22l5 -7 5 18 5 -43 6 54 6 -28 5 10 6 -7h23"
          fill="none"
          stroke="#e6be80"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* University & Degree Badge Text */}
        <text
          y="5"
          textAnchor="middle"
          fill="#f5e5b8"
          fontSize="12.5"
          letterSpacing="3"
          fontFamily="Cinzel, serif"
          fontWeight="600"
        >
          MUST UNIVERSITY
        </text>
        <text
          y="26"
          textAnchor="middle"
          fill="#dcb47c"
          fontSize="25"
          letterSpacing="2.5"
          fontFamily="Cinzel, serif"
          fontWeight="700"
        >
          BS MLT
        </text>
        <text
          y="51"
          textAnchor="middle"
          fill="#f5e5b8"
          fontSize="20"
          letterSpacing="3.5"
          fontFamily="Cinzel, serif"
          fontWeight="bold"
        >
          BOYS
        </text>
        <text
          y="72"
          textAnchor="middle"
          fill="#c5a16b"
          fontSize="9.5"
          letterSpacing="2"
          fontFamily="monospace"
        >
          FA23 · CLASS OF 2027
        </text>
      </g>
    ),
    []
  );

  // Render individual card on the 3D orbit
  const renderCard = (card: (typeof cards)[number]) => {
    const isFrontCard = card.depth > 0.7;
    const isHovered = hoveredIndex === card.index;

    return (
      <g
        key={card.student.id}
        transform={`translate(${card.x} ${card.y}) rotate(${card.tilt}) scale(${
          card.scale * card.width * (isHovered ? 1.05 : 1)
        } ${card.scale * (isHovered ? 1.05 : 1)})`}
        opacity={Math.max(0.52, 0.58 + (card.depth + 1) * 0.21)}
        className="cursor-pointer transition-opacity duration-200"
        style={{ willChange: 'transform' }}
        onMouseEnter={() => setHoveredIndex(card.index)}
        onMouseLeave={() => setHoveredIndex(null)}
        onClick={() => {
          if (!hasMovedSignificantlyRef.current && onSelectStudent) {
            onSelectStudent(card.student);
          }
        }}
      >
        {/* Glow halo behind card */}
        <rect
          x="-77"
          y="-99"
          width="154"
          height="198"
          rx="12"
          fill="#dc9c4d"
          opacity={isHovered ? 0.45 : isFrontCard ? 0.32 : 0.16}
          filter="url(#glow)"
        />

        {/* Outer Card Gold Frame */}
        <rect
          x="-74"
          y="-96"
          width="148"
          height="192"
          rx="11"
          fill="#0c1724"
          stroke={isHovered ? '#ffe0a0' : 'url(#gold)'}
          strokeWidth={isHovered ? 3 : isFrontCard ? 2.5 : 1.8}
        />

        {/* Fallback pattern/fill inside card */}
        <rect
          x="-71"
          y="-93"
          width="142"
          height="186"
          rx="9"
          fill="#081426"
        />

        {/* Royal Monogram Shield Seal (displayed when custom photo is not yet uploaded) */}
        <g className="pointer-events-none select-none">
          <circle cx="0" cy="-18" r="30" fill="#040d1c" stroke="url(#gold)" strokeWidth="1.2" opacity="0.85" />
          <path
            d="M-10 -26 L0 -34 L10 -26 L10 -8 C10 6 0 15 0 15 C0 15 -10 6 -10 -8 Z"
            fill="none"
            stroke="#d4af37"
            strokeWidth="1.2"
            opacity="0.65"
          />
          <text
            x="0"
            y="-8"
            textAnchor="middle"
            fill="#f5e5b8"
            fontSize="18"
            fontFamily="Cinzel, serif"
            fontWeight="bold"
            letterSpacing="1"
          >
            {card.student.initials}
          </text>
          <text
            x="0"
            y="8"
            textAnchor="middle"
            fill="#c8a45d"
            fontSize="7.5"
            fontFamily="monospace"
            letterSpacing="1.2"
            opacity="0.8"
          >
            MUST MLT
          </text>
        </g>

        {/* Real student photograph */}
        <image
          href={card.student.photoUrl}
          x="-71"
          y="-93"
          width="142"
          height="186"
          preserveAspectRatio="xMidYMid slice"
          clipPath="url(#portrait-clip)"
        />

        {/* Depth vignette: cards in the back are naturally darker for realistic 3D depth */}
        {card.depth < 0 && (
          <rect
            x="-71"
            y="-93"
            width="142"
            height="186"
            rx="9"
            fill="#020912"
            opacity={Math.min(0.55, -card.depth * 0.38)}
            className="pointer-events-none"
          />
        )}

        {/* Bottom high-contrast gradient name plate banner */}
        <rect
          x="-71"
          y="32"
          width="142"
          height="61"
          rx="0"
          fill="url(#card-gradient)"
          className="pointer-events-none"
        />

        {/* Roll number pill */}
        <g transform="translate(0, 48)" className="pointer-events-none select-none">
          <rect
            x="-38"
            y="-9"
            width="76"
            height="17"
            rx="8.5"
            fill="#050d1a"
            stroke="#d4af37"
            strokeWidth="0.9"
            opacity="0.95"
          />
          <text
            y="3"
            textAnchor="middle"
            fill="#ffe0a0"
            fontSize="9"
            fontFamily="monospace"
            fontWeight="bold"
          >
            {card.student.rollNo}
          </text>
        </g>

        {/* Student Name & Nickname with bold, legible typography */}
        <text
          x="0"
          y="70"
          textAnchor="middle"
          fill="#ffffff"
          fontSize="10.5"
          fontFamily="Cinzel, serif"
          fontWeight="bold"
          letterSpacing="0.4"
          className="pointer-events-none select-none"
        >
          {card.student.name.length > 17
            ? card.student.name.substring(0, 16) + '…'
            : card.student.name}
        </text>
        <text
          x="0"
          y="82"
          textAnchor="middle"
          fill="#f5e5b8"
          fontSize="8.5"
          fontFamily="Plus Jakarta Sans, sans-serif"
          fontWeight="600"
          className="pointer-events-none select-none"
        >
          "{card.student.nickname}"
        </text>

        {/* Hover ring sparkle badge */}
        {isHovered && (
          <g transform="translate(56, -78)" className="pointer-events-none">
            <circle r="10" fill="#07132c" stroke="#ffe0a0" strokeWidth="1" />
            <text
              y="3"
              textAnchor="middle"
              fill="#ffe0a0"
              fontSize="9"
              fontFamily="sans-serif"
            >
              ✦
            </text>
          </g>
        )}
      </g>
    );
  };

  return (
    <section
      id="portrait-ring"
      aria-label="3D Interactive Portrait Orbit"
      className="relative w-full py-12 sm:py-16 px-2 sm:px-6 lg:px-8 bg-gradient-to-b from-[var(--bg-primary)] via-[#050f24] to-[var(--bg-primary)] overflow-hidden select-none border-y border-[var(--border-gold)]/40"
      onMouseEnter={() => {
        isHoveredRef.current = true;
      }}
      onMouseLeave={() => {
        isHoveredRef.current = false;
        setHoveredIndex(null);
      }}
    >
      {/* Background celestial glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[550px] bg-gradient-to-r from-[#11244d]/40 via-[#1e40af]/20 to-[#11244d]/40 rounded-full blur-[140px] pointer-events-none" />

      {/* Section Header */}
      <div className="relative z-10 text-center max-w-3xl mx-auto mb-6 px-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-gold)] text-xs font-cinzel text-[var(--accent-gold)] uppercase tracking-widest mb-2 shadow-sm">
          <Compass className="w-3.5 h-3.5 text-[var(--accent-gold)] animate-spin [animation-duration:14s]" />
          <span>Interactive 3D Celestial Orbit</span>
        </div>
        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-cinzel font-bold text-[#F8F5EE] tracking-tight">
          The 12 Brothers Celestial Ring
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-[var(--accent-champagne)]/80 font-editorial italic max-w-xl mx-auto">
          All 12 brothers orbiting together in our perpetual constellation. Drag or swipe horizontally to spin the ring, or click any brother to inspect his legacy profile.
        </p>

        {/* Interactive Controls Bar */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs">
          {/* Play/Pause Auto Rotate */}
          <button
            onClick={() => setIsAutoRotating((prev) => !prev)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0a162e]/90 hover:bg-[#132752] border border-[var(--border-gold)] text-[#F5E5B8] transition-all hover:scale-105 active:scale-95 shadow-md cursor-pointer"
            title={isAutoRotating ? 'Pause auto rotation' : 'Start auto rotation'}
          >
            {isAutoRotating ? (
              <>
                <Pause className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
                <span>Pause Orbit</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
                <span>Auto-Spin</span>
              </>
            )}
          </button>

          {/* Step Rotate Left */}
          <button
            onClick={() => {
              velocityRef.current = -1.6;
            }}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#0a162e]/90 hover:bg-[#132752] border border-[var(--border-gold)] text-[#F5E5B8] transition-all hover:scale-105 active:scale-95 shadow-md cursor-pointer"
            title="Rotate left by 30°"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
            <span>Prev Brother</span>
          </button>

          {/* Step Rotate Right */}
          <button
            onClick={() => {
              velocityRef.current = 1.6;
            }}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#0a162e]/90 hover:bg-[#132752] border border-[var(--border-gold)] text-[#F5E5B8] transition-all hover:scale-105 active:scale-95 shadow-md cursor-pointer"
            title="Rotate right by 30°"
          >
            <RotateCw className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
            <span>Next Brother</span>
          </button>

          {/* Speed Toggle */}
          <button
            onClick={() => setRotationSpeed((s) => (s === 0.12 ? 0.25 : s === 0.25 ? 0.06 : 0.12))}
            className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#0a162e]/90 hover:bg-[#132752] border border-[var(--border-gold)] text-[#F5E5B8] transition-all hover:scale-105 active:scale-95 shadow-md cursor-pointer"
            title="Change orbit rotation speed"
          >
            <Sparkles className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
            <span>Speed: {rotationSpeed === 0.12 ? '1x' : rotationSpeed === 0.25 ? '2x' : '0.5x'}</span>
          </button>
        </div>
      </div>

      {/* Main SVG Orbit Canvas */}
      <div className="relative mx-auto w-full max-w-[1440px] px-1 sm:px-4">
        <svg
          viewBox="35 0 1330 620"
          role="slider"
          tabIndex={0}
          aria-label="12 Brothers 3D Picture Ring. Drag or swipe to rotate, or use left and right arrow keys."
          aria-valuemin={0}
          aria-valuemax={360}
          aria-valuenow={Math.round(((rotation % 360) + 360) % 360)}
          onKeyDown={handleKeyDown}
          className={`w-full touch-none select-none outline-none focus-visible:rounded-3xl focus-visible:ring-2 focus-visible:ring-[#c5a16b] ${
            dragging ? 'cursor-grabbing' : 'cursor-grab'
          }`}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onLostPointerCapture={handlePointerUp}
        >
          <defs>
            {/* Halo Gradient */}
            <radialGradient id="halo">
              <stop offset="0" stopColor="#b77b32" stopOpacity="0" />
              <stop offset="0.7" stopColor="#ba7a2f" stopOpacity="0.03" />
              <stop offset="0.88" stopColor="#bf853c" stopOpacity="0.18" />
              <stop offset="1" stopColor="#ba7a2f" stopOpacity="0" />
            </radialGradient>

            {/* Luxury Gold Gradient */}
            <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1">
              <stop stopColor="#9a652e" />
              <stop offset="0.25" stopColor="#ffe0a0" />
              <stop offset="0.52" stopColor="#aa763b" />
              <stop offset="0.8" stopColor="#f5c277" />
              <stop offset="1" stopColor="#b57c35" />
            </linearGradient>

            {/* Bottom Card Vignette Gradient */}
            <linearGradient id="card-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#020814" stopOpacity="0" />
              <stop offset="35%" stopColor="#020814" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#020814" stopOpacity="0.98" />
            </linearGradient>

            {/* Glowing filters */}
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="5" />
            </filter>
            <filter id="spark">
              <feGaussianBlur stdDeviation="1.6" />
            </filter>

            {/* Portrait Card Image Clipping Path */}
            <clipPath id="portrait-clip">
              <rect x="-71" y="-93" width="142" height="186" rx="9" />
            </clipPath>
          </defs>

          {/* Background Elliptical Glow */}
          <ellipse cx="700" cy="333" rx="605" ry="257" fill="url(#halo)" />

          {/* Concentric Golden Orbit Rings */}
          {[0, 1, 2, 3, 4].map((i) => (
            <g key={i}>
              <ellipse
                cx="700"
                cy={302 + i * 6}
                rx={570 - i * 43}
                ry={235 - i * 22}
                fill="none"
                stroke="#cc8c3d"
                strokeWidth={i === 0 ? 6 : 3}
                opacity={i === 0 ? 0.38 : 0.14}
                filter="url(#glow)"
              />
              <ellipse
                cx="700"
                cy={302 + i * 6}
                rx={570 - i * 43}
                ry={235 - i * 22}
                fill="none"
                stroke="url(#gold)"
                strokeWidth={i === 0 ? 1.7 : 0.9}
                opacity={i === 0 ? 0.8 : 0.3}
              />
            </g>
          ))}
          <ellipse
            cx="700"
            cy="340"
            rx="548"
            ry="220"
            fill="none"
            stroke="#b07834"
            strokeWidth="1"
            opacity="0.23"
          />

          {/* Render back cards (depth < 0) first */}
          {cards.filter((card) => card.depth < 0).map(renderCard)}

          {/* Central Insignia Badge */}
          {badge}

          {/* Render front cards (depth >= 0) in front of the central badge */}
          {cards.filter((card) => card.depth >= 0).map(renderCard)}

          {/* Stardust particles & golden starbursts */}
          <g className="pointer-events-none">
            {Array.from({ length: 52 }, (_, i) => {
              const a = i * 2.399;
              return (
                <circle
                  key={i}
                  cx={700 + Math.cos(a) * (505 + (i % 4) * 15)}
                  cy={328 + Math.sin(a) * 210}
                  r={i % 7 === 0 ? 2.6 : 0.9}
                  fill="#f8c273"
                  opacity={i % 3 === 0 ? 0.9 : 0.35}
                  filter={i % 7 === 0 ? 'url(#spark)' : undefined}
                />
              );
            })}

            {/* Glowing Cardinal Sparkle Crosses */}
            {[
              [-470, 100],
              [350, 170],
              [-220, 210],
              [540, -30],
            ].map(([x, y], i) => (
              <g key={i} transform={`translate(${700 + x} ${306 + y})`}>
                <circle r="9" fill="#edb05b" opacity="0.5" filter="url(#glow)" />
                <path
                  d="M-11 0H11M0 -13V13"
                  stroke="#ffdea0"
                  strokeWidth="0.9"
                />
                <circle r="2" fill="#fff0bf" />
              </g>
            ))}
          </g>
        </svg>
      </div>

      {/* Bottom Hint */}
      <div className="relative z-10 text-center mt-3 text-xs text-[var(--accent-champagne)]/60 font-cinzel flex items-center justify-center gap-2">
        <Users className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
        <span>Click any card to open profile · Drag left or right to explore with smooth momentum</span>
      </div>
    </section>
  );
};
