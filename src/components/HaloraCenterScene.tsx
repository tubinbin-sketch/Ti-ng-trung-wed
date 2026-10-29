import React, { useEffect, useRef, useState } from 'react';
import {
  Upload,
  Sparkles,
  Check,
  RotateCcw,
  Image as ImageIcon,
  Layers,
  X,
  Palette,
  Eye,
} from 'lucide-react';

export type DragonStylePreset = 'song-long' | 'chu-sa' | 'thanh-long' | 'custom';

export const HaloraCenterScene: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Style State — Default to Chu Sa Thần Long to reflect the reference image
  const [activeStyle, setActiveStyle] = useState<DragonStylePreset>('chu-sa');
  const [characterForm, setCharacterForm] = useState<'traditional' | 'simplified'>('traditional');
  const [showCalligraphyWithCustom, setShowCalligraphyWithCustom] = useState(true);
  const [customImage, setCustomImage] = useState<string | null>(null);
  const [customBlendMode, setCustomBlendMode] = useState<'normal' | 'screen' | 'overlay'>('normal');
  const [modalOpen, setModalOpen] = useState(false);

  // Golden Auspicious Spirit Particles (Linh Khí Hoàng Kim)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId = 0;
    const width = 960;
    const height = 960;
    canvas.width = width;
    canvas.height = height;

    const particles = Array.from({ length: 36 }, (_, i) => ({
      angle: (i / 36) * Math.PI * 2,
      radius: 140 + (i % 8) * 26,
      speed: 0.0016 + (i % 4) * 0.0005,
      size: 1.4 + (i % 3) * 1.1,
      alpha: 0.25 + (i % 5) * 0.12,
      gold: i % 4 !== 0,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      const cx = width * 0.5;
      const cy = height * 0.5;

      for (const p of particles) {
        p.angle += p.speed;
        const x = cx + Math.cos(p.angle) * p.radius;
        const y = cy + Math.sin(p.angle * 1.05) * (p.radius * 0.92);

        ctx.beginPath();
        ctx.arc(x, y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.gold
          ? `rgba(212, 175, 55, ${p.alpha})`
          : `rgba(184, 41, 33, ${p.alpha * 0.8})`;
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Handle custom image upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        if (typeof loadEvent.target?.result === 'string') {
          setCustomImage(loadEvent.target.result);
          setActiveStyle('custom');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Generate Hồi Văn (Fretwork / Meander) repeating teeth around circle
  const meanderSegments = Array.from({ length: 48 }, (_, i) => {
    const angle = (i * 360) / 48;
    return angle;
  });

  return (
    <div
      className="halora-visual-stage"
      data-testid="eastern-dragon-scene"
      aria-label="Nguyệt Môn Hoàng Gia & Thần Long Ấn Chương"
    >
      <div className="halora-visual-media-wrap">
        {/* Particle Canvas */}
        <canvas ref={canvasRef} className="halora-dragon-canvas" aria-hidden="true" />

        {/* Master Imperial SVG Scene */}
        <svg
          viewBox="0 0 1920 1084"
          preserveAspectRatio="xMidYMid meet"
          className="w-full h-full"
          aria-hidden="true"
        >
          <defs>
            {/* 1. Deep Jade Background Gradient */}
            <radialGradient id="imperialJadeGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#1C3829" />
              <stop offset="65%" stopColor="#15281D" />
              <stop offset="100%" stopColor="#0E1B13" />
            </radialGradient>

            {/* 2. Imperial Gold Gradients */}
            <linearGradient id="imperialGoldBeam" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF4D0" />
              <stop offset="25%" stopColor="#ECC869" />
              <stop offset="50%" stopColor="#D4AF37" />
              <stop offset="80%" stopColor="#A88126" />
              <stop offset="100%" stopColor="#674E11" />
            </linearGradient>

            <linearGradient id="imperialGoldHorizontal" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#9C7924" />
              <stop offset="30%" stopColor="#FDEAA8" />
              <stop offset="50%" stopColor="#D4AF37" />
              <stop offset="70%" stopColor="#FDEAA8" />
              <stop offset="100%" stopColor="#9C7924" />
            </linearGradient>

            {/* 3. Cinnabar Vermilion Dragon Gradient */}
            <linearGradient id="cinnabarDragonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FA5B50" />
              <stop offset="35%" stopColor="#DE2820" />
              <stop offset="75%" stopColor="#B31610" />
              <stop offset="100%" stopColor="#7E0C08" />
            </linearGradient>

            {/* 4. Azure Emerald Dragon Gradient */}
            <linearGradient id="azureDragonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#74E5D4" />
              <stop offset="35%" stopColor="#22B8A0" />
              <stop offset="70%" stopColor="#107C6B" />
              <stop offset="100%" stopColor="#094A40" />
            </linearGradient>

            {/* 5. Cinnabar Seal Stone Gradient */}
            <linearGradient id="cinnabarSealGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#D83025" />
              <stop offset="50%" stopColor="#B82017" />
              <stop offset="100%" stopColor="#82110B" />
            </linearGradient>

            {/* 6. Flaming Luminous Pearl Gradients */}
            <radialGradient id="flamingPearlCore" cx="40%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="25%" stopColor="#FFF5B8" />
              <stop offset="55%" stopColor="#FFB319" />
              <stop offset="85%" stopColor="#E6391A" />
              <stop offset="100%" stopColor="#8A1305" />
            </radialGradient>

            <radialGradient id="pearlAuraGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(255, 235, 150, 0.9)" />
              <stop offset="40%" stopColor="rgba(212, 175, 55, 0.45)" />
              <stop offset="80%" stopColor="rgba(212, 175, 55, 0.1)" />
              <stop offset="100%" stopColor="rgba(212, 175, 55, 0)" />
            </radialGradient>

            {/* 7. Imperial Brocade Lattice Grid Pattern */}
            <pattern id="brocadeLattice" width="28" height="28" patternUnits="userSpaceOnUse">
              <path
                d="M 14,0 L 28,14 L 14,28 L 0,14 Z"
                fill="none"
                stroke="#D4AF37"
                strokeWidth="0.8"
                opacity="0.14"
              />
              <circle cx="14" cy="14" r="1.5" fill="#D4AF37" opacity="0.18" />
            </pattern>

            {/* 8. Dragon Lattice Scales Pattern */}
            <pattern id="dragonLatticeScales" width="16" height="16" patternUnits="userSpaceOnUse">
              <path
                d="M 0,8 Q 8,16 16,8 Q 8,0 0,8 Z"
                fill="none"
                stroke="#FFE082"
                strokeWidth="0.9"
                opacity="0.35"
              />
            </pattern>

            {/* 9. Filters for 3D Emboss & Shimmer */}
            <filter id="goldEmboss3D" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#000000" floodOpacity="0.75" />
              <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#D4AF37" floodOpacity="0.4" />
            </filter>

            <filter id="cinnabarSealShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="rgba(70, 8, 5, 0.6)" />
            </filter>

            {/* Circular Moon Gate Clip Path */}
            <clipPath id="moonGateClip">
              <circle cx="975" cy="535" r="338" />
            </clipPath>
          </defs>

          {/* MAIN MEDALLION GROUP */}
          <g transform="translate(0, 0)">
            {/* ========================================================
                1. NGUYỆT MÔN HOÀNG GIA (MULTI-LAYERED IMPERIAL MOON GATE)
                ======================================================== */}

            {/* Back ambient halo */}
            <circle
              cx="975"
              cy="535"
              r="385"
              fill="none"
              stroke="#D4AF37"
              strokeWidth="1.5"
              opacity="0.25"
              strokeDasharray="4 8"
            />

            {/* A. Outermost Ring: Rotating Chinese Fretwork / Meander Border (Hồi Văn) */}
            <g className="halora-fretwork-rotating">
              <circle
                cx="975"
                cy="535"
                r="368"
                fill="none"
                stroke="url(#imperialGoldBeam)"
                strokeWidth="20"
                opacity="0.75"
              />
              {/* Geometric Fretwork Meander Teeth */}
              {meanderSegments.map((angle, idx) => (
                <g key={idx} transform={`rotate(${angle} 975 535)`}>
                  <path
                    d="M 975,158 L 980,158 L 980,172 L 970,172 L 970,163 L 975,163"
                    fill="none"
                    stroke="#2D1C05"
                    strokeWidth="1.8"
                    strokeLinecap="square"
                  />
                  <rect
                    x="973"
                    y="174"
                    width="4"
                    height="4"
                    fill="#FFF0B3"
                    opacity="0.8"
                  />
                </g>
              ))}
            </g>

            {/* Inner Ring Separator Rim */}
            <circle
              cx="975"
              cy="535"
              r="354"
              fill="none"
              stroke="url(#imperialGoldHorizontal)"
              strokeWidth="4"
              filter="drop-shadow(0 0 6px rgba(212, 175, 55, 0.5))"
            />

            {/* B. Interior Circular Window: Deep Jade Green & Brocade Texture */}
            <g clipPath="url(#moonGateClip)">
              {/* Deep Jade Gradient Ground */}
              <circle cx="975" cy="535" r="340" fill="url(#imperialJadeGrad)" />

              {/* Brocade Lattice Overlay */}
              <rect
                x="635"
                y="195"
                width="680"
                height="680"
                fill="url(#brocadeLattice)"
              />

              {/* Inner Center Radiance Glow */}
              <circle
                cx="975"
                cy="535"
                r="220"
                fill="url(#pearlAuraGlow)"
                opacity="0.38"
              />

              {/* Base Engravings: Chinese Water Waves (Sóng Thủy Ba / Hải Thủy Giang Nhai) */}
              <g transform="translate(975, 535)" opacity="0.35">
                {/* Layer 1 Waves */}
                <path
                  d="M -340,240 C -260,200 -180,260 -100,210 C -20,170 60,250 140,200 C 220,160 280,230 340,240 L 340,340 L -340,340 Z"
                  fill="#0B1A12"
                  stroke="#D4AF37"
                  strokeWidth="1.5"
                />
                {/* Layer 2 Waves */}
                <path
                  d="M -340,270 C -270,245 -200,285 -130,250 C -50,220 30,280 110,240 C 190,210 260,265 340,270 L 340,340 L -340,340 Z"
                  fill="#08140E"
                  stroke="#ECC869"
                  strokeWidth="1.2"
                />
                {/* Mountain peak in center (Giang Sơn) */}
                <path
                  d="M -50,340 L 0,230 L 50,340 Z"
                  fill="#0E2319"
                  stroke="#D4AF37"
                  strokeWidth="1.8"
                />
                <path
                  d="M -90,340 L -50,270 L -10,340 Z"
                  fill="#0B1C14"
                  stroke="#D4AF37"
                  strokeWidth="1.4"
                  opacity="0.8"
                />
                <path
                  d="M 10,340 L 50,270 L 90,340 Z"
                  fill="#0B1C14"
                  stroke="#D4AF37"
                  strokeWidth="1.4"
                  opacity="0.8"
                />
              </g>

              {/* ========================================================
                  2. CENTRAL ARTWORK (DRAGON PRESETS / CUSTOM ART)
                  ======================================================== */}

              {/* PRESET 1: SONG LONG HOÀNG KIM (IMPERIAL TWIN GOLD DRAGONS) */}
              {activeStyle === 'song-long' && (
                <g className="halora-dragon-levitating">
                  {/* Left Imperial Dragon */}
                  <g transform="translate(810, 535) scale(0.9, 0.9)">
                    {/* Dorsal Spine Fins (Gai lưng rồng) */}
                    <path
                      d="M -160,-175 L -175,-195 L -150,-170 L -165,-185 L -138,-158 L -150,-170 L -120,-140 L -130,-150 L -90,-105 L -100,-115 L -60,-65 L -68,-75 L -35,-20 L -42,-30 L -15,40 L -22,30 L -5,95 L -12,85 L 5,150 L -2,140 L 25,195 L 18,185 L 50,230"
                      fill="none"
                      stroke="#FFE082"
                      strokeWidth="2.5"
                      strokeLinejoin="round"
                    />

                    {/* Main Serpent Body - Outer Glow & Shadow */}
                    <path
                      d="M -135,-150 C -220,-60 -200,60 -140,140 C -80,220 20,240 70,220 C 120,200 140,140 100,90 C 60,40 -20,10 -30,-50 C -40,-110 10,-170 55,-220"
                      fill="none"
                      stroke="#422905"
                      strokeWidth="38"
                      strokeLinecap="round"
                      opacity="0.8"
                    />
                    {/* Serpent Body - Rich Imperial Gold Gradient Trunk */}
                    <path
                      d="M -135,-150 C -220,-60 -200,60 -140,140 C -80,220 20,240 70,220 C 120,200 140,140 100,90 C 60,40 -20,10 -30,-50 C -40,-110 10,-170 55,-220"
                      fill="none"
                      stroke="url(#imperialGoldBeam)"
                      strokeWidth="32"
                      strokeLinecap="round"
                      filter="drop-shadow(0 6px 12px rgba(0,0,0,0.65))"
                    />
                    {/* Inner Diamond Lattice Scales */}
                    <path
                      d="M -135,-150 C -220,-60 -200,60 -140,140 C -80,220 20,240 70,220 C 120,200 140,140 100,90 C 60,40 -20,10 -30,-50 C -40,-110 10,-170 55,-220"
                      fill="none"
                      stroke="#FFF4D0"
                      strokeWidth="5"
                      strokeDasharray="4 6"
                      opacity="0.85"
                    />

                    {/* Dragon Head (Facing Center/Pearl) */}
                    <g transform="translate(58, -225) scale(0.95)">
                      {/* Antler Horns (Gạc hươu hoàng gia phân nhánh) */}
                      <path
                        d="M -10,-10 C -25,-40 -50,-65 -85,-75 M -45,-48 C -65,-65 -75,-60 -95,-62 M -28,-30 C -48,-42 -60,-35 -75,-35"
                        fill="none"
                        stroke="#FFF8E1"
                        strokeWidth="4"
                        strokeLinecap="round"
                      />
                      {/* Flame Mane (Bờm lửa cuồn cuộn) */}
                      <path
                        d="M -18,5 C -45,-5 -80,-8 -115,0 M -12,20 C -42,22 -75,18 -105,30 M -15,35 C -40,48 -68,45 -90,62"
                        fill="none"
                        stroke="#F5B041"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                      />
                      {/* Jaws & Teeth (Hàm rồng mở oai phong) */}
                      <path
                        d="M -10,-8 C 15,-12 38,-8 52,2 C 62,8 65,18 56,24 C 38,28 20,22 5,18 C 22,28 28,38 14,44 C -6,48 -20,38 -24,24 Z"
                        fill="url(#imperialGoldBeam)"
                        stroke="#FFE082"
                        strokeWidth="2"
                      />
                      {/* Sharp Fangs */}
                      <polygon points="40,12 43,18 46,12" fill="#FFFFFF" />
                      <polygon points="26,17 29,22 32,17" fill="#FFFFFF" />
                      {/* Eye (Mắt rồng tinh anh) */}
                      <circle cx="16" cy="4" r="5" fill="#FFEAA8" />
                      <circle cx="17" cy="4" r="2.5" fill="#2E1802" />
                      <path d="M 8,-2 C 16,-6 24,-5 30,-1" fill="none" stroke="#674E11" strokeWidth="1.8" />
                      {/* Whisker (Râu rồng uốn lượn) */}
                      <path
                        d="M 38,10 C 65,16 80,42 70,68 C 60,88 38,92 22,78"
                        fill="none"
                        stroke="#FFFDF0"
                        strokeWidth="2.8"
                        strokeLinecap="round"
                      />
                    </g>

                    {/* Front Claw (Móng vuốt vươn ra dũng mãnh) */}
                    <g transform="translate(-10, -50)">
                      <path
                        d="M 0,0 C 25,15 45,35 60,60"
                        fill="none"
                        stroke="url(#imperialGoldBeam)"
                        strokeWidth="10"
                        strokeLinecap="round"
                      />
                      {/* 4 Sharp Talons */}
                      <path
                        d="M 60,60 L 78,54 M 60,60 L 82,65 M 60,60 L 75,76 M 60,60 L 58,82"
                        fill="none"
                        stroke="#FFEAA8"
                        strokeWidth="3.2"
                        strokeLinecap="round"
                      />
                      {/* Joint Flame */}
                      <path
                        d="M 15,8 C 28,2 35,-8 30,-16 C 22,-8 15,-2 8,2"
                        fill="#ECC869"
                        opacity="0.7"
                      />
                    </g>

                    {/* Rear Claw */}
                    <g transform="translate(-130, 80)">
                      <path
                        d="M 0,0 C 20,20 40,30 55,50"
                        fill="none"
                        stroke="url(#imperialGoldBeam)"
                        strokeWidth="9"
                        strokeLinecap="round"
                      />
                      <path
                        d="M 55,50 L 70,45 M 55,50 L 74,56 M 55,50 L 68,66"
                        fill="none"
                        stroke="#FFEAA8"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                    </g>

                    {/* Flame Tail Tip */}
                    <g transform="translate(-140, -155)">
                      <path
                        d="M 0,0 C -25,-25 -45,-20 -55,-5 C -45,5 -30,15 -10,20 M 0,0 C -30,-10 -50,10 -45,35 M 0,0 C -20,15 -35,40 -25,60"
                        fill="none"
                        stroke="#ECC869"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                    </g>

                    {/* Auspicious Clouds */}
                    <path
                      d="M -160,20 C -185,10 -205,30 -185,50 C -205,65 -180,88 -150,78 C -135,92 -108,78 -118,58 Z"
                      fill="none"
                      stroke="#ECC869"
                      strokeWidth="1.8"
                      opacity="0.45"
                    />
                  </g>

                  {/* Right Imperial Dragon (Symmetrical Counterpart) */}
                  <g transform="translate(1140, 535) scale(-0.9, 0.9)">
                    <path
                      d="M -160,-175 L -175,-195 L -150,-170 L -165,-185 L -138,-158 L -150,-170 L -120,-140 L -130,-150 L -90,-105 L -100,-115 L -60,-65 L -68,-75 L -35,-20 L -42,-30 L -15,40 L -22,30 L -5,95 L -12,85 L 5,150 L -2,140 L 25,195 L 18,185 L 50,230"
                      fill="none"
                      stroke="#FFE082"
                      strokeWidth="2.5"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M -135,-150 C -220,-60 -200,60 -140,140 C -80,220 20,240 70,220 C 120,200 140,140 100,90 C 60,40 -20,10 -30,-50 C -40,-110 10,-170 55,-220"
                      fill="none"
                      stroke="#422905"
                      strokeWidth="38"
                      strokeLinecap="round"
                      opacity="0.8"
                    />
                    <path
                      d="M -135,-150 C -220,-60 -200,60 -140,140 C -80,220 20,240 70,220 C 120,200 140,140 100,90 C 60,40 -20,10 -30,-50 C -40,-110 10,-170 55,-220"
                      fill="none"
                      stroke="url(#imperialGoldBeam)"
                      strokeWidth="32"
                      strokeLinecap="round"
                      filter="drop-shadow(0 6px 12px rgba(0,0,0,0.65))"
                    />
                    <path
                      d="M -135,-150 C -220,-60 -200,60 -140,140 C -80,220 20,240 70,220 C 120,200 140,140 100,90 C 60,40 -20,10 -30,-50 C -40,-110 10,-170 55,-220"
                      fill="none"
                      stroke="#FFF4D0"
                      strokeWidth="5"
                      strokeDasharray="4 6"
                      opacity="0.85"
                    />

                    <g transform="translate(58, -225) scale(0.95)">
                      <path
                        d="M -10,-10 C -25,-40 -50,-65 -85,-75 M -45,-48 C -65,-65 -75,-60 -95,-62 M -28,-30 C -48,-42 -60,-35 -75,-35"
                        fill="none"
                        stroke="#FFF8E1"
                        strokeWidth="4"
                        strokeLinecap="round"
                      />
                      <path
                        d="M -18,5 C -45,-5 -80,-8 -115,0 M -12,20 C -42,22 -75,18 -105,30 M -15,35 C -40,48 -68,45 -90,62"
                        fill="none"
                        stroke="#F5B041"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                      />
                      <path
                        d="M -10,-8 C 15,-12 38,-8 52,2 C 62,8 65,18 56,24 C 38,28 20,22 5,18 C 22,28 28,38 14,44 C -6,48 -20,38 -24,24 Z"
                        fill="url(#imperialGoldBeam)"
                        stroke="#FFE082"
                        strokeWidth="2"
                      />
                      <polygon points="40,12 43,18 46,12" fill="#FFFFFF" />
                      <polygon points="26,17 29,22 32,17" fill="#FFFFFF" />
                      <circle cx="16" cy="4" r="5" fill="#FFEAA8" />
                      <circle cx="17" cy="4" r="2.5" fill="#2E1802" />
                      <path d="M 8,-2 C 16,-6 24,-5 30,-1" fill="none" stroke="#674E11" strokeWidth="1.8" />
                      <path
                        d="M 38,10 C 65,16 80,42 70,68 C 60,88 38,92 22,78"
                        fill="none"
                        stroke="#FFFDF0"
                        strokeWidth="2.8"
                        strokeLinecap="round"
                      />
                    </g>

                    <g transform="translate(-10, -50)">
                      <path
                        d="M 0,0 C 25,15 45,35 60,60"
                        fill="none"
                        stroke="url(#imperialGoldBeam)"
                        strokeWidth="10"
                        strokeLinecap="round"
                      />
                      <path
                        d="M 60,60 L 78,54 M 60,60 L 82,65 M 60,60 L 75,76 M 60,60 L 58,82"
                        fill="none"
                        stroke="#FFEAA8"
                        strokeWidth="3.2"
                        strokeLinecap="round"
                      />
                      <path
                        d="M 15,8 C 28,2 35,-8 30,-16 C 22,-8 15,-2 8,2"
                        fill="#ECC869"
                        opacity="0.7"
                      />
                    </g>

                    <g transform="translate(-130, 80)">
                      <path
                        d="M 0,0 C 20,20 40,30 55,50"
                        fill="none"
                        stroke="url(#imperialGoldBeam)"
                        strokeWidth="9"
                        strokeLinecap="round"
                      />
                      <path
                        d="M 55,50 L 70,45 M 55,50 L 74,56 M 55,50 L 68,66"
                        fill="none"
                        stroke="#FFEAA8"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                    </g>

                    <g transform="translate(-140, -155)">
                      <path
                        d="M 0,0 C -25,-25 -45,-20 -55,-5 C -45,5 -30,15 -10,20 M 0,0 C -30,-10 -50,10 -45,35 M 0,0 C -20,15 -35,40 -25,60"
                        fill="none"
                        stroke="#ECC869"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                    </g>

                    <path
                      d="M -160,20 C -185,10 -205,30 -185,50 C -205,65 -180,88 -150,78 C -135,92 -108,78 -118,58 Z"
                      fill="none"
                      stroke="#ECC869"
                      strokeWidth="1.8"
                      opacity="0.45"
                    />
                  </g>
                </g>
              )}

              {/* PRESET 2: CHU SA THẦN LONG (TRADITIONAL CINNABAR DRAGON — EXACT PHOTO MATCH) */}
              {activeStyle === 'chu-sa' && (
                <g className="halora-dragon-levitating">
                  <g transform="translate(975, 535)">
                    {/* Outer Auspicious Cloud Swirls */}
                    <path
                      d="M 160,-170 C 190,-185 220,-160 200,-135 C 225,-120 205,-90 175,-100 C 160,-85 130,-100 140,-125 Z"
                      fill="none"
                      stroke="#FFD54F"
                      strokeWidth="1.8"
                      opacity="0.4"
                    />
                    <path
                      d="M -210,130 C -240,115 -260,140 -235,165 C -255,185 -225,210 -195,195 C -180,215 -150,195 -165,170 Z"
                      fill="none"
                      stroke="#FFD54F"
                      strokeWidth="1.8"
                      opacity="0.4"
                    />

                    {/* Master Coiling Body Shadow */}
                    <path
                      d="M -110,-170 C -40,-235 60,-245 150,-205 C 235,-145 265,-40 250,60 C 230,160 140,240 20,255 C -90,250 -185,195 -230,110 C -265,10 -235,-100 -150,-160 C -90,-200 30,-190 90,-130 C 140,-75 150,20 90,80 C 40,120 -30,105 -60,60"
                      fill="none"
                      stroke="#4A0503"
                      strokeWidth="38"
                      strokeLinecap="round"
                      opacity="0.75"
                    />

                    {/* Serrated Spine Fins (Gai lưng Thần Long dọc sống lưng vòng ngoài) */}
                    <path
                      d="M -110,-170 L -120,-188 L -85,-198 L -90,-216 L -55,-226 L -56,-245 L -20,-242 L -18,-260 L 18,-250 L 22,-268 L 58,-248 L 65,-265 L 98,-238 L 108,-254 L 138,-220 L 150,-234 L 175,-195 L 190,-206 L 210,-160 L 226,-170 L 238,-120 L 255,-126 L 255,-75 L 272,-78 L 265,-30 L 282,-28 L 265,22 L 280,26 L 252,72 L 265,80 L 230,120 L 240,132 L 198,168 L 206,180 L 155,208 L 160,222 L 105,238 L 106,252 L 50,255 L 48,270 L -10,258 L -15,272 L -70,246 L -78,258 L -128,218 L -138,228 L -178,175 L -190,182 L -218,125 L -232,130 L -242,70 L -258,72 L -248,15 L -262,12 L -235,-42 L -248,-48 L -205,-95 L -215,-104 L -162,-142 L -170,-152"
                      fill="none"
                      stroke="#FFD54F"
                      strokeWidth="2.5"
                      strokeLinejoin="round"
                    />

                    {/* Main Vermilion Serpentine Body Trunk */}
                    <path
                      d="M -110,-170 C -40,-235 60,-245 150,-205 C 235,-145 265,-40 250,60 C 230,160 140,240 20,255 C -90,250 -185,195 -230,110 C -265,10 -235,-100 -150,-160 C -90,-200 30,-190 90,-130 C 140,-75 150,20 90,80 C 40,120 -30,105 -60,60"
                      fill="none"
                      stroke="url(#cinnabarDragonGrad)"
                      strokeWidth="32"
                      strokeLinecap="round"
                      filter="drop-shadow(0 6px 14px rgba(0,0,0,0.7))"
                    />

                    {/* Underbelly Ventral Plates (Đốt bụng vàng nhạt cong phía trong) */}
                    <path
                      d="M -110,-170 C -40,-235 60,-245 150,-205 C 235,-145 265,-40 250,60 C 230,160 140,240 20,255 C -90,250 -185,195 -230,110 C -265,10 -235,-100 -150,-160 C -90,-200 30,-190 90,-130 C 140,-75 150,20 90,80 C 40,120 -30,105 -60,60"
                      fill="none"
                      stroke="#FFE082"
                      strokeWidth="6"
                      strokeLinecap="round"
                      strokeDasharray="4 6"
                      opacity="0.85"
                    />

                    {/* High Precision Diamond Scales Lattice Line */}
                    <path
                      d="M -110,-170 C -40,-235 60,-245 150,-205 C 235,-145 265,-40 250,60 C 230,160 140,240 20,255 C -90,250 -185,195 -230,110 C -265,10 -235,-100 -150,-160 C -90,-200 30,-190 90,-130 C 140,-75 150,20 90,80 C 40,120 -30,105 -60,60"
                      fill="none"
                      stroke="#FFF9C4"
                      strokeWidth="2"
                      strokeDasharray="5 7"
                      opacity="0.9"
                    />

                    {/* Majestic Dragon Head (Upper Left, looking down-right toward center) */}
                    <g transform="translate(-135, -170) scale(1.15)">
                      {/* Branched Deer Antlers (Gạc hươu đôi cong vút hoàng gia) */}
                      <path
                        d="M -8,-6 C -25,-32 -48,-52 -78,-58 M -36,-36 C -55,-48 -68,-44 -86,-45 M -22,-20 C -40,-30 -52,-24 -66,-26"
                        fill="none"
                        stroke="#FFE082"
                        strokeWidth="3.6"
                        strokeLinecap="round"
                      />
                      {/* Flaming Mane Streaming Backwards */}
                      <path
                        d="M -12,4 C -38,-5 -68,-4 -98,5 M -8,18 C -34,18 -64,13 -88,24 M -10,32 C -32,42 -58,40 -76,55"
                        fill="none"
                        stroke="#FA5B50"
                        strokeWidth="3.2"
                        strokeLinecap="round"
                      />
                      {/* Muzzle, Snout & Jaws with bared fangs */}
                      <path
                        d="M -8,-6 C 14,-12 36,-6 50,4 C 58,12 60,22 50,28 C 32,32 15,26 2,20 C 18,30 22,40 10,46 C -6,50 -20,38 -24,24 Z"
                        fill="url(#cinnabarDragonGrad)"
                        stroke="#FFCDD2"
                        strokeWidth="2"
                      />
                      {/* Sharp Teeth & Canine Fangs */}
                      <polygon points="38,14 41,20 45,14" fill="#FFFDE7" />
                      <polygon points="26,18 29,24 33,18" fill="#FFFDE7" />
                      <polygon points="16,20 19,25 22,20" fill="#FFFDE7" />
                      {/* Eye with Fierce Brow */}
                      <circle cx="16" cy="6" r="5" fill="#FFEAA8" />
                      <circle cx="17" cy="6" r="2.5" fill="#4A0503" />
                      <path d="M 8,0 C 16,-3 24,-2 30,2" fill="none" stroke="#2B0503" strokeWidth="1.8" />
                      {/* Sinuous Dragon Whiskers (Râu rồng mềm mại) */}
                      <path
                        d="M 38,14 C 65,20 80,48 70,72 C 62,94 40,100 24,84"
                        fill="none"
                        stroke="#FFF8E1"
                        strokeWidth="2.8"
                        strokeLinecap="round"
                      />
                      <path
                        d="M 32,22 C 50,30 60,50 54,68 C 48,82 34,85 22,74"
                        fill="none"
                        stroke="#FFE082"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        opacity="0.8"
                      />
                    </g>

                    {/* 4 Imperial Claws (Tứ Trảo - 4 Móng vuốt sắc bén bố trí 4 góc) */}
                    {/* Claw 1: Front-Left (Vươn xuống phía dưới bên trái) */}
                    <g transform="translate(-185, 40)">
                      <path
                        d="M 0,0 C 20,20 40,35 55,55"
                        fill="none"
                        stroke="url(#cinnabarDragonGrad)"
                        strokeWidth="10"
                        strokeLinecap="round"
                      />
                      <path
                        d="M 55,55 L 72,48 M 55,55 L 75,58 M 55,55 L 68,70 M 55,55 L 54,76"
                        fill="none"
                        stroke="#FFD54F"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                      <path d="M 12,8 C 24,3 30,-5 26,-12 C 18,-5 12,0 6,3" fill="#FF8A80" opacity="0.8" />
                    </g>

                    {/* Claw 2: Front-Right (Vươn vào tâm chầu nguyệt) */}
                    <g transform="translate(140, -100)">
                      <path
                        d="M 0,0 C -20,15 -35,25 -50,35"
                        fill="none"
                        stroke="url(#cinnabarDragonGrad)"
                        strokeWidth="9"
                        strokeLinecap="round"
                      />
                      <path
                        d="M -50,35 L -65,30 M -50,35 L -68,38 M -50,35 L -60,48 M -50,35 L -48,54"
                        fill="none"
                        stroke="#FFD54F"
                        strokeWidth="2.8"
                        strokeLinecap="round"
                      />
                    </g>

                    {/* Claw 3: Rear-Left (Ở vòng cung dưới đáy) */}
                    <g transform="translate(-60, 210)">
                      <path
                        d="M 0,0 C 15,15 28,26 40,38"
                        fill="none"
                        stroke="url(#cinnabarDragonGrad)"
                        strokeWidth="9"
                        strokeLinecap="round"
                      />
                      <path
                        d="M 40,38 L 54,34 M 40,38 L 56,42 M 40,38 L 48,50"
                        fill="none"
                        stroke="#FFD54F"
                        strokeWidth="2.8"
                        strokeLinecap="round"
                      />
                    </g>

                    {/* Claw 4: Rear-Right (Ở thân sau bên phải) */}
                    <g transform="translate(200, 110)">
                      <path
                        d="M 0,0 C -15,12 -28,20 -40,28"
                        fill="none"
                        stroke="url(#cinnabarDragonGrad)"
                        strokeWidth="9"
                        strokeLinecap="round"
                      />
                      <path
                        d="M -40,28 L -54,24 M -40,28 L -56,32 M -40,28 L -48,42"
                        fill="none"
                        stroke="#FFD54F"
                        strokeWidth="2.8"
                        strokeLinecap="round"
                      />
                    </g>

                    {/* Inner Ascending Flame Tail Plume (Đuôi rồng xòe ngọn lửa vút cao) */}
                    <g transform="translate(-40, 45)">
                      <path
                        d="M 0,0 C -15,-20 -25,-45 -20,-75 C -10,-55 2,-38 5,-20 M -8,-35 C -25,-55 -35,-80 -30,-105 C -20,-85 -8,-65 0,-50 M -18,-65 C -40,-88 -52,-115 -48,-140 C -36,-118 -22,-98 -12,-80"
                        fill="none"
                        stroke="#FF8A80"
                        strokeWidth="3.2"
                        strokeLinecap="round"
                      />
                    </g>
                  </g>
                </g>
              )}

              {/* PRESET 3: THANH LONG HỘ QUỐC (IMPERIAL AZURE JADE DRAGON) */}
              {activeStyle === 'thanh-long' && (
                <g className="halora-dragon-levitating">
                  <g transform="translate(975, 535)">
                    {/* Coiling Azure Serpent Body */}
                    <path
                      d="M -110,-170 C -40,-235 60,-245 150,-205 C 235,-145 265,-40 250,60 C 230,160 140,240 20,255 C -90,250 -185,195 -230,110 C -265,10 -235,-100 -150,-160 C -90,-200 30,-190 90,-130 C 140,-75 150,20 90,80 C 40,120 -30,105 -60,60"
                      fill="none"
                      stroke="url(#azureDragonGrad)"
                      strokeWidth="32"
                      strokeLinecap="round"
                      filter="drop-shadow(0 6px 14px rgba(0,0,0,0.7))"
                    />
                    {/* Golden Scales Line */}
                    <path
                      d="M -110,-170 C -40,-235 60,-245 150,-205 C 235,-145 265,-40 250,60 C 230,160 140,240 20,255 C -90,250 -185,195 -230,110 C -265,10 -235,-100 -150,-160 C -90,-200 30,-190 90,-130 C 140,-75 150,20 90,80 C 40,120 -30,105 -60,60"
                      fill="none"
                      stroke="#ECC869"
                      strokeWidth="2.8"
                      strokeDasharray="5 7"
                      opacity="0.85"
                    />

                    {/* Azure Dragon Head */}
                    <g transform="translate(-135, -170) scale(1.15)">
                      <path
                        d="M -8,-6 C -25,-32 -48,-52 -78,-58 M -36,-36 C -55,-48 -68,-44 -86,-45"
                        fill="none"
                        stroke="#E0F2F1"
                        strokeWidth="3.6"
                        strokeLinecap="round"
                      />
                      <path
                        d="M -12,4 C -38,-5 -68,-4 -98,5 M -8,18 C -34,18 -64,13 -88,24"
                        fill="none"
                        stroke="#80CBC4"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                      <path
                        d="M -8,-6 C 14,-12 36,-6 50,4 C 58,12 60,22 50,28 C 32,32 15,26 2,20 C 18,30 22,40 10,46 C -6,50 -20,38 -24,24 Z"
                        fill="url(#azureDragonGrad)"
                        stroke="#B2DFDB"
                        strokeWidth="2"
                      />
                      <circle cx="16" cy="6" r="5" fill="#FFEAA8" />
                      <circle cx="17" cy="6" r="2.5" fill="#00332C" />
                      <path
                        d="M 38,14 C 65,20 80,48 70,72 C 62,94 40,100 24,84"
                        fill="none"
                        stroke="#ECC869"
                        strokeWidth="2.8"
                        strokeLinecap="round"
                      />
                    </g>

                    {/* Claws */}
                    <g transform="translate(-185, 40)">
                      <path
                        d="M 0,0 C 20,20 40,35 55,55"
                        fill="none"
                        stroke="url(#azureDragonGrad)"
                        strokeWidth="9"
                        strokeLinecap="round"
                      />
                      <path
                        d="M 55,55 L 72,48 M 55,55 L 75,58 M 55,55 L 68,70"
                        fill="none"
                        stroke="#80CBC4"
                        strokeWidth="2.8"
                        strokeLinecap="round"
                      />
                    </g>
                    <g transform="translate(140, -100)">
                      <path
                        d="M 0,0 C -20,15 -35,25 -50,35"
                        fill="none"
                        stroke="url(#azureDragonGrad)"
                        strokeWidth="9"
                        strokeLinecap="round"
                      />
                      <path
                        d="M -50,35 L -65,30 M -50,35 L -68,38 M -50,35 L -60,48"
                        fill="none"
                        stroke="#80CBC4"
                        strokeWidth="2.8"
                        strokeLinecap="round"
                      />
                    </g>
                  </g>
                </g>
              )}

              {/* MODE 4: CUSTOM UPLOADED IMAGE */}
              {activeStyle === 'custom' && customImage && (
                <g className="halora-dragon-levitating">
                  <image
                    href={customImage}
                    x="635"
                    y="195"
                    width="680"
                    height="680"
                    preserveAspectRatio="xMidYMid slice"
                    style={{
                      mixBlendMode:
                        customBlendMode === 'screen'
                           ? 'screen'
                          : customBlendMode === 'overlay'
                          ? 'overlay'
                          : 'normal',
                    }}
                  />
                  {/* Elegant Golden Rim inside custom art */}
                  <circle
                    cx="975"
                    cy="535"
                    r="330"
                    fill="none"
                    stroke="url(#imperialGoldBeam)"
                    strokeWidth="3"
                    opacity="0.6"
                  />
                </g>
              )}

              {/* ========================================================
                  3. CENTRAL 3D EMBOSSED METALLIC GOLD CALLIGRAPHY ("龍" / "龙")
                  ======================================================== */}
              {(activeStyle !== 'custom' || showCalligraphyWithCustom) && (
                <g transform="translate(975, 545)" filter="url(#goldEmboss3D)">
                  {/* Subtle Dark Drop Shadow Text */}
                  <text
                    x="0"
                    y="38"
                    textAnchor="middle"
                    fill="#1A0F02"
                    fontSize="110"
                    fontWeight="900"
                    fontFamily="'Noto Serif SC', 'Songti SC', serif"
                    opacity="0.95"
                  >
                    {characterForm === 'traditional' ? '龍' : '龙'}
                  </text>
                  {/* Back Golden Stroke */}
                  <text
                    x="0"
                    y="36"
                    textAnchor="middle"
                    fill="none"
                    stroke="#593E0A"
                    strokeWidth="8"
                    strokeLinejoin="round"
                    fontFamily="'Noto Serif SC', 'Songti SC', serif"
                    fontSize="110"
                    fontWeight="900"
                  >
                    {characterForm === 'traditional' ? '龍' : '龙'}
                  </text>
                  {/* Middle Radiant Gold */}
                  <text
                    x="0"
                    y="34"
                    textAnchor="middle"
                    fill="url(#imperialGoldBeam)"
                    stroke="#FFEBB5"
                    strokeWidth="2.2"
                    strokeLinejoin="round"
                    fontFamily="'Noto Serif SC', 'Songti SC', serif"
                    fontSize="110"
                    fontWeight="900"
                  >
                    {characterForm === 'traditional' ? '龍' : '龙'}
                  </text>
                  {/* Top Bevel Highlight */}
                  <text
                    x="-1"
                    y="33"
                    textAnchor="middle"
                    fill="none"
                    stroke="#FFFFFF"
                    strokeWidth="1"
                    opacity="0.75"
                    fontFamily="'Noto Serif SC', 'Songti SC', serif"
                    fontSize="110"
                    fontWeight="900"
                  >
                    {characterForm === 'traditional' ? '龍' : '龙'}
                  </text>
                </g>
              )}
            </g>

            {/* Inner Golden Rim Frame */}
            <circle
              cx="975"
              cy="535"
              r="340"
              fill="none"
              stroke="url(#imperialGoldBeam)"
              strokeWidth="6"
              filter="drop-shadow(0 0 8px rgba(212, 175, 55, 0.6))"
            />

            {/* ========================================================
                4. FLAMING LUMINOUS PEARL (MINH CHÂU HOÀNG GIA - AT ZENITH)
                ======================================================== */}
            <g transform="translate(975, 195)" className="halora-pearl-glowing">
              {/* Pulsing Luminous Aura */}
              <circle cx="0" cy="0" r="42" fill="url(#pearlAuraGlow)" />

              {/* Flaming Tongues */}
              <path
                d="M 0,-36 C -12,-20 -28,-10 -32,8 C -36,25 -20,38 0,38 C 20,38 36,25 32,8 C 28,-10 12,-20 0,-36 Z"
                fill="none"
                stroke="url(#imperialGoldBeam)"
                strokeWidth="3"
                opacity="0.85"
              />
              <path
                d="M -16,-22 C -28,-8 -32,15 -18,28 M 16,-22 C 28,-8 32,15 18,28"
                fill="none"
                stroke="#FF8A80"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {/* Core Flaming Pearl Sphere */}
              <circle
                cx="0"
                cy="0"
                r="22"
                fill="url(#flamingPearlCore)"
                stroke="#FFFDF0"
                strokeWidth="2.5"
                filter="drop-shadow(0 0 14px rgba(255, 180, 50, 0.9))"
              />

              {/* Pearl Highlight Glisten */}
              <circle cx="-6" cy="-6" r="5" fill="#FFFFFF" opacity="0.85" />
            </g>

            {/* ========================================================
                5. CLASSICAL CINNABAR SEALS (ẤN TRIỆN CHU SA CỔ ĐIỂN)
                ======================================================== */}

            {/* SEAL 1: TOP-LEFT ARCHAIC SEAL "龍" (LÓNG) */}
            <g
              transform="translate(685, 290)"
              className="halora-cinnabar-seal-top"
              filter="url(#cinnabarSealShadow)"
            >
              {/* Square Seal Stone */}
              <rect
                x="0"
                y="0"
                width="68"
                height="68"
                rx="6"
                fill="url(#cinnabarSealGrad)"
                stroke="#FAF3E8"
                strokeWidth="2.2"
              />
              {/* Inner Double Line */}
              <rect
                x="5"
                y="5"
                width="58"
                height="58"
                rx="3"
                fill="none"
                stroke="#FFF0E6"
                strokeWidth="1.6"
                opacity="0.9"
              />
              {/* Traditional Seal Script "龍" */}
              <text
                x="34"
                y="48"
                textAnchor="middle"
                fill="#FFFDF7"
                fontSize="38"
                fontWeight="700"
                fontFamily="'Noto Serif SC', 'Songti SC', serif"
              >
                龍
              </text>
            </g>

            {/* SEAL 2: BOTTOM-RIGHT TEACHER SEAL "阮文受" (NGUYỄN VĂN THỤ) */}
            <g
              transform="translate(1205, 680)"
              className="halora-cinnabar-seal-bottom"
              filter="url(#cinnabarSealShadow)"
            >
              {/* Vertical Rectangular Seal Stone */}
              <rect
                x="0"
                y="0"
                width="84"
                height="118"
                rx="8"
                fill="url(#cinnabarSealGrad)"
                stroke="#FAF3E8"
                strokeWidth="2.2"
              />
              <rect
                x="6"
                y="6"
                width="72"
                height="106"
                rx="4"
                fill="none"
                stroke="#F4E8D6"
                strokeWidth="1.8"
                opacity="0.9"
              />
              {/* 3 Seal Script Characters "阮文受" */}
              <text
                x="42"
                y="38"
                textAnchor="middle"
                fill="#FAF3E8"
                fontSize="25"
                fontWeight="700"
                fontFamily="'Noto Serif SC', 'Songti SC', serif"
                letterSpacing="2"
              >
                阮
              </text>
              <text
                x="42"
                y="71"
                textAnchor="middle"
                fill="#FAF3E8"
                fontSize="25"
                fontWeight="700"
                fontFamily="'Noto Serif SC', 'Songti SC', serif"
                letterSpacing="2"
              >
                文
              </text>
              <text
                x="42"
                y="103"
                textAnchor="middle"
                fill="#FAF3E8"
                fontSize="25"
                fontWeight="700"
                fontFamily="'Noto Serif SC', 'Songti SC', serif"
                letterSpacing="2"
              >
                受
              </text>
            </g>
          </g>
        </svg>

        {/* ========================================================
            6. INTERACTIVE STYLE SWITCHER & CUSTOM UPLOADER BUTTON
            (Floating at bottom edge with pointer-events: auto)
            ======================================================== */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 pointer-events-auto flex items-center gap-2">
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            data-testid="mascot-style-switcher-btn"
            className="group flex items-center gap-2 px-4 py-2 rounded-full bg-[#16281E]/80 hover:bg-[#16281E] backdrop-blur-md border border-[#D4AF37]/50 text-[#F4E8C1] text-xs font-semibold shadow-lg hover:shadow-[#D4AF37]/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            title="Đổi phong cách linh vật hoặc tải ảnh riêng"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#ECC869] group-hover:rotate-12 transition-transform" />
            <span>
              {activeStyle === 'song-long' && '🐉 Song Long Hoàng Kim'}
              {activeStyle === 'chu-sa' && '🏮 Chu Sa Thần Long'}
              {activeStyle === 'thanh-long' && '🌊 Thanh Long Hộ Quốc'}
              {activeStyle === 'custom' && '🖼️ Linh vật riêng'}
            </span>
            <span className="text-[#D4AF37] opacity-80 text-[11px]">· Đổi kiểu</span>
          </button>
        </div>
      </div>

      {/* ========================================================
          7. MODAL: "ĐỔI PHONG CÁCH / TẢI ẢNH LINH VẬT RIÊNG"
          ======================================================== */}
      {modalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Cài đặt Nguyệt Môn Hoàng Gia & Linh Vật"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm pointer-events-auto animate-fade-in"
        >
          <div className="relative w-full max-w-xl rounded-3xl bg-[#14231A] border border-[#D4AF37]/40 shadow-2xl overflow-hidden text-[#F2E8D2] flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="p-5 sm:p-6 border-b border-[#D4AF37]/20 flex items-center justify-between bg-gradient-to-r from-[#172B20] to-[#0E1A13]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center text-[#ECC869]">
                  <Palette className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-[#FFF4D0] font-['Noto_Serif_SC']">
                    Nguyệt Môn Hoàng Gia &amp; Linh Vật
                  </h3>
                  <p className="text-xs text-[#A8BFAE]">
                    Chọn phong cách Thần Long cung đình hoặc tải linh vật riêng của lớp
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-[#A8BFAE] hover:text-white transition-colors"
                aria-label="Đóng"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
              {/* Preset Cards */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#ECC869] mb-3">
                  1. Phong cách Thần Long Cung Đình
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Song Long */}
                  <button
                    type="button"
                    onClick={() => setActiveStyle('song-long')}
                    className={`p-3.5 rounded-2xl border text-left flex flex-col gap-2 transition-all ${
                      activeStyle === 'song-long'
                        ? 'bg-[#D4AF37]/20 border-[#ECC869] ring-2 ring-[#ECC869]/30 shadow-md'
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xl">🐉</span>
                      {activeStyle === 'song-long' && (
                        <Check className="w-4 h-4 text-[#ECC869]" />
                      )}
                    </div>
                    <div className="font-semibold text-xs text-[#FFF4D0]">
                      Song Long Hoàng Kim
                    </div>
                    <div className="text-[11px] text-[#A8BFAE] leading-relaxed">
                      Song Long Chầu Nguyệt đối xứng tôn nghiêm, ánh kim dát vàng
                    </div>
                  </button>

                  {/* Chu Sa */}
                  <button
                    type="button"
                    onClick={() => setActiveStyle('chu-sa')}
                    className={`p-3.5 rounded-2xl border text-left flex flex-col gap-2 transition-all ${
                      activeStyle === 'chu-sa'
                        ? 'bg-[#B82921]/30 border-[#FA5B50] ring-2 ring-[#FA5B50]/30 shadow-md'
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xl">🏮</span>
                      {activeStyle === 'chu-sa' && (
                        <Check className="w-4 h-4 text-[#FA5B50]" />
                      )}
                    </div>
                    <div className="font-semibold text-xs text-[#FFCDD2]">
                      Chu Sa Thần Long
                    </div>
                    <div className="text-[11px] text-[#A8BFAE] leading-relaxed">
                      Sắc đỏ son cung đình, vảy lưới uốn lượn chữ S kép uy lực
                    </div>
                  </button>

                  {/* Thanh Long */}
                  <button
                    type="button"
                    onClick={() => setActiveStyle('thanh-long')}
                    className={`p-3.5 rounded-2xl border text-left flex flex-col gap-2 transition-all ${
                      activeStyle === 'thanh-long'
                        ? 'bg-[#107C6B]/30 border-[#4DB6AC] ring-2 ring-[#4DB6AC]/30 shadow-md'
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xl">🌊</span>
                      {activeStyle === 'thanh-long' && (
                        <Check className="w-4 h-4 text-[#4DB6AC]" />
                      )}
                    </div>
                    <div className="font-semibold text-xs text-[#B2DFDB]">
                      Thanh Long Hộ Quốc
                    </div>
                    <div className="text-[11px] text-[#A8BFAE] leading-relaxed">
                      Sắc ngọc bích trầm, dáng rồng cuộn tường vân thanh thoát
                    </div>
                  </button>
                </div>
              </div>

              {/* Custom Mascot Upload */}
              <div className="pt-2 border-t border-white/10">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#ECC869]">
                    2. Hoặc Tải Ảnh Linh Vật Riêng (Logo / Huy hiệu trường)
                  </label>
                  {customImage && (
                    <button
                      type="button"
                      onClick={() => {
                        setCustomImage(null);
                        setActiveStyle('song-long');
                      }}
                      className="text-[11px] text-[#FA5B50] hover:underline flex items-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Xóa ảnh riêng
                    </button>
                  )}
                </div>

                <div
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all ${
                    activeStyle === 'custom' && customImage
                      ? 'border-[#ECC869] bg-[#D4AF37]/10'
                      : 'border-white/20 hover:border-[#D4AF37]/60 bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  {customImage ? (
                    <div className="flex items-center justify-center gap-4">
                      <img
                        src={customImage}
                        alt="Linh vật đã tải"
                        className="w-14 h-14 rounded-full object-cover border-2 border-[#ECC869] shadow-md"
                      />
                      <div className="text-left">
                        <div className="text-xs font-semibold text-[#FFF4D0]">
                          Đã nạp ảnh linh vật tùy chỉnh
                        </div>
                        <div className="text-[11px] text-[#A8BFAE]">
                          Bấm để chọn file khác (PNG, JPG, SVG)
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2 py-2">
                      <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-[#ECC869]">
                        <Upload className="w-5 h-5" />
                      </div>
                      <div className="text-xs font-semibold text-[#FFF4D0]">
                        Bấm để tải ảnh linh vật lên
                      </div>
                      <div className="text-[11px] text-[#A8BFAE]">
                        Tự động cắt lồng vào khung Nguyệt Môn tròn chuẩn cung đình
                      </div>
                    </div>
                  )}
                </div>

                {/* Blend Mode Options for Custom Image */}
                {customImage && (
                  <div className="mt-3 flex flex-wrap items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/10 text-xs">
                    <span className="text-[#A8BFAE] text-[11px]">Chế độ hòa trộn:</span>
                    <button
                      type="button"
                      onClick={() => setCustomBlendMode('normal')}
                      className={`px-2.5 py-1 rounded-lg ${
                        customBlendMode === 'normal'
                          ? 'bg-[#ECC869] text-[#14231A] font-bold'
                          : 'bg-white/10 text-[#F2E8D2]'
                      }`}
                    >
                      Bình thường
                    </button>
                    <button
                      type="button"
                      onClick={() => setCustomBlendMode('screen')}
                      className={`px-2.5 py-1 rounded-lg ${
                        customBlendMode === 'screen'
                          ? 'bg-[#ECC869] text-[#14231A] font-bold'
                          : 'bg-white/10 text-[#F2E8D2]'
                      }`}
                    >
                      Ánh kim phát sáng
                    </button>
                    <button
                      type="button"
                      onClick={() => setCustomBlendMode('overlay')}
                      className={`px-2.5 py-1 rounded-lg ${
                        customBlendMode === 'overlay'
                          ? 'bg-[#ECC869] text-[#14231A] font-bold'
                          : 'bg-white/10 text-[#F2E8D2]'
                      }`}
                    >
                      Lồng gấm cung đình
                    </button>
                  </div>
                )}
              </div>

              {/* Calligraphy Overlay Controls */}
              <div className="pt-2 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <div className="font-semibold text-[#FFF4D0]">
                    Đại tự thư pháp trung tâm
                  </div>
                  <div className="text-[11px] text-[#A8BFAE]">
                    Chữ Hán 3D ánh kim đúc nổi ở tâm Nguyệt Môn
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center rounded-xl bg-white/10 p-1 border border-white/10">
                    <button
                      type="button"
                      onClick={() => setCharacterForm('traditional')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                        characterForm === 'traditional'
                          ? 'bg-[#ECC869] text-[#14231A]'
                          : 'text-[#A8BFAE] hover:text-white'
                      }`}
                    >
                      Phồn thể (龍)
                    </button>
                    <button
                      type="button"
                      onClick={() => setCharacterForm('simplified')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                        characterForm === 'simplified'
                          ? 'bg-[#ECC869] text-[#14231A]'
                          : 'text-[#A8BFAE] hover:text-white'
                      }`}
                    >
                      Giản thể (龙)
                    </button>
                  </div>

                  {activeStyle === 'custom' && (
                    <button
                      type="button"
                      onClick={() => setShowCalligraphyWithCustom((v) => !v)}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-medium flex items-center gap-1.5 ${
                        showCalligraphyWithCustom
                          ? 'bg-[#D4AF37]/20 border-[#ECC869] text-[#FFF4D0]'
                          : 'bg-white/5 border-white/10 text-[#A8BFAE]'
                      }`}
                    >
                      <Eye className="w-3.5 h-3.5" />
                      {showCalligraphyWithCustom ? 'Hiện chữ' : 'Ẩn chữ'}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 sm:p-5 border-t border-[#D4AF37]/20 bg-[#0E1A13] flex items-center justify-between">
              <span className="text-[11px] text-[#A8BFAE]">
                Thần Long Ấn Chương · HANU × 阮文受
              </span>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#ECC869] to-[#D4AF37] hover:from-[#FDEAA8] hover:to-[#ECC869] text-[#16261E] font-bold text-xs shadow-md transition-all"
              >
                Hoàn tất &amp; Áp dụng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
