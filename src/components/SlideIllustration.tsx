import React, { useState, useEffect } from 'react';
import { IllustrationCategoryKey } from '../data/chineseData';
import { inferIllustrationCategory } from '../utils/chineseEngine';
import { Image as ImageIcon, Sparkles, Palette } from 'lucide-react';

interface SlideIllustrationProps {
  illustrationKey: IllustrationCategoryKey;
  hanzi?: string;
  pinyin?: string;
  meaning?: string;
  imageUrl?: string;
  className?: string;
}

export const VOCAB_PHOTO_MAP: Record<string, string> = {
  咱们: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80',
  换: 'https://images.unsplash.com/photo-1580519542036-c47de6196ba5?auto=format&fit=crop&w=800&q=80',
  空调: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80',
  洗衣机: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=800&q=80',
  花园: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=800&q=80',
  挺: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=800&q=80',
  初中: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80',
  刻: 'https://images.unsplash.com/photo-1508057198894-247b23fe5ade?auto=format&fit=crop&w=800&q=80',
  愿意: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=800&q=80',
  龙: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80',
  温暖: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
  狗: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80',
  咖啡: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80',
  努力: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80',
  冰箱: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=800&q=80',
  卫生间: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
  灯: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=800&q=80',
  学校: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80',
  老师: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80',
  朋友: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80',
};

// Fallback search keywords by category for any dynamically added words
const CATEGORY_UNSPLASH_FALLBACKS: Record<string, string> = {
  dog: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80',
  huan: 'https://images.unsplash.com/photo-1580519542036-c47de6196ba5?auto=format&fit=crop&w=800&q=80',
  wennuan: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
  long: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80',
  kafei: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80',
  nuli: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80',
  huayuan: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=800&q=80',
  chuzhong: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80',
  ke: 'https://images.unsplash.com/photo-1508057198894-247b23fe5ade?auto=format&fit=crop&w=800&q=80',
  yuanyi: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=800&q=80',
  zanmen: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80',
  kongtiao: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80',
  xiyiji: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=800&q=80',
  bingxiang: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=800&q=80',
  weishengjian: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
  deng: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=800&q=80',
  nature: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80',
};

export const SlideIllustration: React.FC<SlideIllustrationProps> = ({
  illustrationKey,
  hanzi = '',
  pinyin = '',
  meaning = '',
  imageUrl,
  className = 'w-full h-full',
}) => {
  const [viewMode, setViewMode] = useState<'photo' | 'svg'>('photo');
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Resolve effective category
  const effectiveKey: IllustrationCategoryKey =
    illustrationKey || inferIllustrationCategory(hanzi, meaning);

  // Resolve active image source: direct prop -> exact hanzi match -> category fallback
  const resolvedPhotoUrl =
    imageUrl ||
    VOCAB_PHOTO_MAP[hanzi] ||
    CATEGORY_UNSPLASH_FALLBACKS[effectiveKey] ||
    CATEGORY_UNSPLASH_FALLBACKS['nature'];

  // Reset image status when word changes
  useEffect(() => {
    setImageError(false);
    setImageLoaded(false);
  }, [hanzi, resolvedPhotoUrl]);

  // Shared decorative Halora Sage & Gold frame + floating luminous particles + badge overlay
  const renderSceneFrameAndBadge = (
    defaultHanzi: string,
    defaultLabel: string,
    themeTone = '#182A21'
  ) => {
    const titleHanzi = hanzi || defaultHanzi;
    const subText = meaning ? `${pinyin ? `${pinyin} · ` : ''}${meaning}` : defaultLabel;
    return (
      <g>
        {/* Subtle Ambient Floating Gold & Sage Dust Motes */}
        {[
          { cx: 68, cy: 48, r: 1.8, dur: '4.2s', dy: -8 },
          { cx: 184, cy: 36, r: 2.2, dur: '5.1s', dy: -10 },
          { cx: 264, cy: 62, r: 1.6, dur: '3.8s', dy: -7 },
          { cx: 348, cy: 42, r: 2.0, dur: '4.6s', dy: -9 },
        ].map((p, idx) => (
          <circle
            key={`mote-${idx}`}
            cx={p.cx}
            cy={p.cy}
            r={p.r}
            fill="#FDE68A"
            opacity="0.65"
          >
            <animate
              attributeName="cy"
              values={`${p.cy};${p.cy + p.dy};${p.cy}`}
              dur={p.dur}
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.25;0.8;0.25"
              dur={p.dur}
              repeatCount="indefinite"
            />
          </circle>
        ))}

        {/* Inner Classical Halora Gold Filigree Border */}
        <rect
          x="5"
          y="5"
          width="390"
          height="210"
          rx="11"
          fill="none"
          stroke="#DFC470"
          strokeOpacity="0.32"
          strokeWidth="1"
        />

        {/* Top-Left Halora Sage & Gold Glassmorphic Badge */}
        <rect
          x="12"
          y="12"
          width="184"
          height="38"
          rx="10"
          fill={themeTone}
          fillOpacity="0.88"
          stroke="#DFC470"
          strokeWidth="1.2"
        />
        <circle cx="24" cy="31" r="3.5" fill="#DFC470" />
        <text
          x="34"
          y="29"
          fill="#F7E29C"
          fontSize="14.5"
          fontWeight="700"
          fontFamily="'Noto Sans SC', sans-serif"
        >
          {titleHanzi}
        </text>
        <text
          x="34"
          y="43"
          fill="#E5E9D7"
          fontSize="9.5"
          fontWeight="500"
          fontFamily="'Plus Jakarta Sans', sans-serif"
        >
          {subText.length > 26 ? `${subText.slice(0, 25)}…` : subText}
        </text>
      </g>
    );
  };

  const renderSvgArtwork = () => {
    switch (effectiveKey) {
      case 'dog':
        return (
          <svg
            viewBox="0 0 400 220"
            className="w-full h-full"
            role="img"
            aria-label="Minh họa từ vựng 狗 - Chú cún con đáng yêu vui đùa trên bãi cỏ dưới ánh nắng mùa xuân"
          >
            <defs>
              <linearGradient id="dogSkyGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1E382B" />
                <stop offset="45%" stopColor="#3F6B4F" />
                <stop offset="100%" stopColor="#D1FAE5" />
              </linearGradient>
            </defs>
            <rect width="400" height="220" rx="14" fill="url(#dogSkyGrad)" />
            {/* Gentle Warm Sun */}
            <circle cx="328" cy="48" r="26" fill="#FEF08A" opacity="0.9" />

            {/* Rolling Emerald Green Garden Hills */}
            <path d="M0 144 Q130 114 260 142 T400 134 L400 220 L0 220 Z" fill="#2E6044" />
            <path d="M0 168 Q150 148 290 166 T400 160 L400 220 L0 220 Z" fill="#1C3D2B" />

            {/* Cozy Dog House in Background */}
            <g transform="translate(46, 84)">
              <polygon points="36,4 4,32 68,32" fill="#7C2D12" stroke="#DFC470" strokeWidth="1.5" />
              <rect x="10" y="32" width="52" height="42" rx="4" fill="#FAF5E8" stroke="#9B8A3E" strokeWidth="1.5" />
              <path d="M24 74 C24 54, 48 54, 48 74 Z" fill="#1E3227" />
              <circle cx="36" cy="22" r="4" fill="#FEF08A" />
            </g>

            {/* Adorable Golden Puppy in Foreground */}
            <g transform="translate(204, 116)">
              {/* Wagging Tail */}
              <path
                d="M-38 24 Q-58 12 -48 -2"
                fill="none"
                stroke="#D97706"
                strokeWidth="10"
                strokeLinecap="round"
              >
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  values="-10 -38 24; 16 -38 24; -10 -38 24"
                  dur="0.8s"
                  repeatCount="indefinite"
                />
              </path>

              {/* Puppy Body */}
              <ellipse cx="0" cy="22" rx="42" ry="26" fill="#F59E0B" stroke="#B45309" strokeWidth="2.5" />
              <ellipse cx="4" cy="22" rx="28" ry="17" fill="#FDE68A" />

              {/* Four Paws */}
              <ellipse cx="-24" cy="46" rx="8" ry="6" fill="#D97706" />
              <ellipse cx="-10" cy="48" rx="7" ry="5.5" fill="#D97706" />
              <ellipse cx="14" cy="48" rx="7" ry="5.5" fill="#D97706" />
              <ellipse cx="28" cy="46" rx="8" ry="6" fill="#D97706" />

              {/* Puppy Head & Floppy Ears */}
              <circle cx="28" cy="-6" r="28" fill="#F59E0B" stroke="#B45309" strokeWidth="2.5" />
              {/* Left & Right Ears */}
              <path d="M8 -24 C-2 -12, 4 8, 14 0 Z" fill="#B45309" />
              <path d="M48 -24 C58 -12, 52 8, 42 0 Z" fill="#B45309" />

              {/* Cute Face Features */}
              <circle cx="18" cy="-10" r="4.5" fill="#1E293B" />
              <circle cx="16.5" cy="-11.5" r="1.5" fill="#FFFFFF" />
              <circle cx="38" cy="-10" r="4.5" fill="#1E293B" />
              <circle cx="36.5" cy="-11.5" r="1.5" fill="#FFFFFF" />

              {/* Shiny Nose & Happy Tongue */}
              <ellipse cx="28" cy="0" rx="4" ry="3" fill="#0F172A" />
              <path d="M28 3 Q24 9 28 11 Q32 9 28 3" fill="#FB7185" />

              {/* Red Collar & Golden Medallion */}
              <path d="M10 14 Q28 24 46 14" fill="none" stroke="#DC2626" strokeWidth="5" strokeLinecap="round" />
              <circle cx="28" cy="20" r="4.5" fill="#FDE047" stroke="#B45309" strokeWidth="1" />
            </g>

            {/* Little Dog Bone & Food Bowl on Grass */}
            <g transform="translate(308, 172)">
              <ellipse cx="0" cy="8" rx="22" ry="7" fill="#065F46" />
              <path d="M-18 6 L18 6 L12 18 L-12 18 Z" fill="#EF4444" stroke="#FDE68A" strokeWidth="1.5" />
              <text x="0" y="15" textAnchor="middle" fill="#FFFFFF" fontSize="8" fontWeight="bold">
                狗
              </text>
            </g>

            {renderSceneFrameAndBadge('狗 · gǒu', 'Chú cún con thông minh & Đáng yêu', '#1C3D2B')}
          </svg>
        );

      case 'huan':
        return (
          <svg
            viewBox="0 0 400 220"
            className="w-full h-full"
            role="img"
            aria-label="Minh họa từ vựng 换 - Đổi tiền, trao đổi Nhân dân tệ, đồng tiền vàng và bạc thỏi"
          >
            <defs>
              <linearGradient id="huanBg" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#14261C" />
                <stop offset="55%" stopColor="#254332" />
                <stop offset="100%" stopColor="#4A341E" />
              </linearGradient>
              <radialGradient id="coinGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FEF08A" />
                <stop offset="60%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#B45309" />
              </radialGradient>
            </defs>
            <rect width="400" height="220" rx="14" fill="url(#huanBg)" />

            {/* Imperial Classical Exchange Pavilion Table */}
            <rect x="30" y="156" width="340" height="52" rx="10" fill="#2E1C12" stroke="#DFC470" strokeWidth="1.8" />
            <line x1="30" y1="166" x2="370" y2="166" stroke="#C5B358" strokeWidth="1" strokeOpacity="0.4" />

            {/* Left Side: Modern 100 RMB & Foreign Currencies */}
            <g transform="translate(86, 114)">
              <rect x="-38" y="-24" width="76" height="46" rx="5" fill="#BE123C" stroke="#FDE68A" strokeWidth="1.5" />
              <rect x="-34" y="-20" width="68" height="38" rx="3" fill="#9F1239" opacity="0.6" />
              <circle cx="0" cy="-1" r="11" fill="#FDA4AF" opacity="0.3" />
              <text x="0" y="5" textAnchor="middle" fill="#FEF08A" fontSize="16" fontWeight="bold">
                ¥100
              </text>
              <text x="-28" y="-12" fill="#FEF08A" fontSize="7" fontWeight="bold">
                中国人民银行
              </text>
            </g>

            {/* Center: Dynamic Golden Exchange Arrows (Biểu tượng đổi tiền) */}
            <g transform="translate(200, 108)">
              {/* Upper Curved Arrow: Left to Right */}
              <path
                d="M-34 -14 C-10 -32, 10 -32, 34 -14"
                fill="none"
                stroke="#FDE047"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <polygon points="34,-14 26,-22 28,-10" fill="#FDE047" />

              {/* Lower Curved Arrow: Right to Left */}
              <path
                d="M34 14 C10 32, -10 32, -34 14"
                fill="none"
                stroke="#6EE7B7"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <polygon points="-34,14 -26,22 -28,10" fill="#6EE7B7" />

              {/* Central Hanzi Seal "换" */}
              <circle cx="0" cy="0" r="17" fill="#182A21" stroke="#DFC470" strokeWidth="2" />
              <text
                x="0"
                y="6"
                textAnchor="middle"
                fill="#F7E29C"
                fontSize="16"
                fontWeight="bold"
                fontFamily="'Noto Sans SC', sans-serif"
              >
                换
              </text>
            </g>

            {/* Right Side: Traditional Gold Taels & Ancient Coins */}
            <g transform="translate(314, 114)">
              {/* Golden Sycee Ingot (Thỏi Vàng Kim Nguyên Bảo) */}
              <ellipse cx="0" cy="8" rx="28" ry="11" fill="url(#coinGlow)" stroke="#92400E" strokeWidth="1.5" />
              <path
                d="M-26 4 C-28 -8, -12 -14, 0 -6 C12 -14, 28 -8, 26 4 Z"
                fill="#FBBF24"
                stroke="#92400E"
                strokeWidth="1.5"
              />
              <circle cx="0" cy="-3" r="5" fill="#FEF08A" />

              {/* Traditional Round Coin with Square Hole */}
              <g transform="translate(0, -22)">
                <circle cx="0" cy="0" r="14" fill="#F59E0B" stroke="#B45309" strokeWidth="1.5" />
                <rect x="-4.5" y="-4.5" width="9" height="9" fill="#14261C" stroke="#B45309" strokeWidth="1" />
              </g>
            </g>

            {renderSceneFrameAndBadge('换 · huàn', 'Đổi tiền, thay đổi & Giao lưu', '#1E3227')}
          </svg>
        );

      case 'wennuan':
        return (
          <svg
            viewBox="0 0 400 220"
            className="w-full h-full"
            role="img"
            aria-label="Minh họa từ vựng 温暖 - Nắng xuân ấm áp, ngôi nhà, tách trà nóng bốc khói và khăn choàng đỏ"
          >
            <defs>
              <linearGradient id="warmSkyGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1E3227" />
                <stop offset="28%" stopColor="#5D6D4E" />
                <stop offset="68%" stopColor="#E6B973" />
                <stop offset="100%" stopColor="#F7D08A" />
              </linearGradient>
              <radialGradient id="sunGlowGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FFFBEB" stopOpacity="1" />
                <stop offset="45%" stopColor="#F59E0B" stopOpacity="0.55" />
                <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="sunbeamGrad" x1="1" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.28" />
                <stop offset="100%" stopColor="#FEF08A" stopOpacity="0" />
              </linearGradient>
            </defs>

            <rect width="400" height="220" rx="14" fill="url(#warmSkyGrad)" />
            <polygon points="290,40 350,40 180,220 90,220" fill="url(#sunbeamGrad)" />
            <polygon points="320,55 385,55 280,220 205,220" fill="url(#sunbeamGrad)" />

            <g transform="translate(316, 58)">
              <circle cx="0" cy="0" r="64" fill="url(#sunGlowGrad)">
                <animate attributeName="r" values="56;68;56" dur="4s" repeatCount="indefinite" />
              </circle>
              <circle cx="0" cy="0" r="24" fill="#FFFBEB" stroke="#F59E0B" strokeWidth="2" />
            </g>

            <path d="M0 138 Q65 98 145 126 T295 112 T400 128 L400 220 L0 220 Z" fill="#2E4A3B" opacity="0.55" />
            <path d="M0 156 Q95 124 210 148 T400 138 L400 220 L0 220 Z" fill="#8D6E46" opacity="0.68" />
            <path d="M0 174 Q140 152 270 170 T400 164 L400 220 L0 220 Z" fill="#4B3621" opacity="0.82" />

            {/* Cozy Traditional Courtyard Cottage */}
            <g transform="translate(44, 78)">
              <rect x="86" y="6" width="12" height="22" rx="2" fill="#5C2D16" stroke="#DFC470" strokeWidth="1" />
              <path d="M-14 38 Q58 -2 130 38 L120 42 Q58 10 -4 42 Z" fill="#6B2710" stroke="#F7E29C" strokeWidth="1.4" />
              <rect x="4" y="38" width="108" height="66" rx="6" fill="#FAF5E8" stroke="#9B8A3E" strokeWidth="2" />
              <rect x="18" y="50" width="36" height="30" rx="4" fill="#FBBF24" stroke="#78350F" strokeWidth="2" />
              <rect x="74" y="52" width="26" height="52" rx="3" fill="#7C2D12" stroke="#DFC470" strokeWidth="1.2" />
            </g>

            {/* Tea Table with Steaming Tea & Red Scarf */}
            <rect x="174" y="168" width="206" height="42" rx="8" fill="#3E2414" stroke="#DFC470" strokeWidth="1.4" />
            <path d="M192 174 C214 160, 248 162, 270 174 C284 180, 296 196, 288 206 L266 206 Z" fill="#DC2626" />
            <g transform="translate(324, 152)">
              <ellipse cx="0" cy="22" rx="28" ry="6" fill="#D1FAE5" stroke="#DFC470" strokeWidth="1.5" />
              <path d="M-18 0 L18 0 C18 16, 12 22, 0 22 C-12 22, -18 16, -18 0 Z" fill="#ECFDF5" stroke="#059669" strokeWidth="1.8" />
              <ellipse cx="0" cy="1" rx="16" ry="3.5" fill="#D97706" />
            </g>

            {renderSceneFrameAndBadge('温暖 · wēnnuǎn', 'Nắng xuân ấm áp & Trà nóng', '#1E3227')}
          </svg>
        );

      case 'long':
        return (
          <svg
            viewBox="0 0 400 220"
            className="w-full h-full"
            role="img"
            aria-label="Minh họa từ vựng 龙 - Thần Long bay lượn giữa mây vàng và sóng biển Đông"
          >
            <defs>
              <linearGradient id="dragonSkyGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#0D1913" />
                <stop offset="55%" stopColor="#182C22" />
                <stop offset="100%" stopColor="#264636" />
              </linearGradient>
            </defs>
            <rect width="400" height="220" rx="14" fill="url(#dragonSkyGrad)" />
            <circle cx="322" cy="56" r="28" fill="#FEF08A" stroke="#DFC470" strokeWidth="2" />
            <path
              d="M52 178 C78 114, 132 144, 168 96 C204 48, 258 112, 286 64 C302 40, 268 24, 242 40"
              fill="none"
              stroke="#F59E0B"
              strokeWidth="16"
              strokeLinecap="round"
            />
            <circle cx="198" cy="78" r="16" fill="#FEF08A" stroke="#F59E0B" strokeWidth="2.5" />
            <text x="198" y="84" textAnchor="middle" fill="#1E3227" fontSize="15" fontWeight="700">
              龙
            </text>
            {renderSceneFrameAndBadge('龙 · lóng', 'Thần Long hí châu · Cát tường', '#064E3B')}
          </svg>
        );

      case 'kafei':
        return (
          <svg
            viewBox="0 0 400 220"
            className="w-full h-full"
            role="img"
            aria-label="Minh họa Đời sống & Thưởng thức Cà phê"
          >
            <defs>
              <linearGradient id="cafeBg" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#1E2D24" />
                <stop offset="60%" stopColor="#3B2F26" />
                <stop offset="100%" stopColor="#5C4028" />
              </linearGradient>
            </defs>
            <rect width="400" height="220" rx="14" fill="url(#cafeBg)" />
            <circle cx="200" cy="118" r="68" fill="#DFC470" fillOpacity="0.14" stroke="#DFC470" strokeOpacity="0.4" />
            <ellipse cx="200" cy="164" rx="58" ry="12" fill="#432818" stroke="#DFC470" strokeWidth="1.5" />
            <path d="M160 104 L240 104 C238 148, 222 162, 200 162 C178 162, 162 148, 160 104 Z" fill="#FFFBEB" stroke="#DFC470" strokeWidth="2.5" />
            <path d="M240 114 C258 114, 258 142, 236 144" fill="none" stroke="#DFC470" strokeWidth="3.5" />
            <ellipse cx="200" cy="105" rx="38" ry="8" fill="#6F4E37" />
            {renderSceneFrameAndBadge('咖啡 · kāfēi', 'Tách cà phê nóng buổi sáng', '#3E2414')}
          </svg>
        );

      case 'ke':
        return (
          <svg
            viewBox="0 0 400 220"
            className="w-full h-full"
            role="img"
            aria-label="Minh họa từ vựng 刻 - Đồng hồ cổ và một khắc 15 phút"
          >
            <defs>
              <linearGradient id="clockBg" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#11221A" />
                <stop offset="100%" stopColor="#2A4537" />
              </linearGradient>
            </defs>
            <rect width="400" height="220" rx="14" fill="url(#clockBg)" />
            {/* Classical Pocket Watch / Sundial */}
            <g transform="translate(200, 114)">
              <circle cx="0" cy="0" r="66" fill="#182A21" stroke="#DFC470" strokeWidth="3.5" />
              <circle cx="0" cy="0" r="58" fill="#FAF5E8" stroke="#9B8A3E" strokeWidth="1.5" />
              {/* 15 Minute Sector Highlight */}
              <path d="M0 0 L0 -58 A58 58 0 0 1 58 0 Z" fill="#FDE68A" fillOpacity="0.45" />
              {/* Hour & Minute Hands */}
              <line x1="0" y1="0" x2="0" y2="-44" stroke="#1E3227" strokeWidth="3.5" strokeLinecap="round" />
              <line x1="0" y1="0" x2="38" y2="0" stroke="#DC2626" strokeWidth="2.5" strokeLinecap="round" />
              <circle cx="0" cy="0" r="4.5" fill="#DFC470" />
            </g>
            {renderSceneFrameAndBadge('刻 · kè', 'Một khắc (15 phút) · Thời gian quý báu', '#182A21')}
          </svg>
        );

      case 'nuli':
      case 'school':
      case 'chuzhong':
        return (
          <svg
            viewBox="0 0 400 220"
            className="w-full h-full"
            role="img"
            aria-label="Minh họa Trường học & Rèn luyện chăm chỉ"
          >
            <defs>
              <linearGradient id="scholarBg" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#16281F" />
                <stop offset="100%" stopColor="#2B4C3B" />
              </linearGradient>
            </defs>
            <rect width="400" height="220" rx="14" fill="url(#scholarBg)" />
            <rect x="56" y="58" width="288" height="116" rx="12" fill="#1E3227" stroke="#DFC470" strokeWidth="2" />
            <path d="M132 148 Q166 134 200 148 Q234 134 268 148 L268 96 Q234 82 200 96 Q166 82 132 96 Z" fill="#FFFBEB" stroke="#DFC470" strokeWidth="2.2" />
            <line x1="200" y1="96" x2="200" y2="148" stroke="#9B8A3E" strokeWidth="2" />
            {renderSceneFrameAndBadge(hanzi || '努力 · 学习', meaning || 'Chăm chỉ & Rèn luyện Hán ngữ', '#182A21')}
          </svg>
        );

      case 'huayuan':
      case 'ting':
        return (
          <svg
            viewBox="0 0 400 220"
            className="w-full h-full"
            role="img"
            aria-label="Minh họa Vườn hoa tươi thắm mùa xuân"
          >
            <defs>
              <linearGradient id="gardenSky" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1E382B" />
                <stop offset="45%" stopColor="#4F795E" />
                <stop offset="100%" stopColor="#A7F3D0" />
              </linearGradient>
            </defs>
            <rect width="400" height="220" rx="14" fill="url(#gardenSky)" />
            <circle cx="332" cy="46" r="24" fill="#FEF08A" opacity="0.88" />
            <path d="M0 144 Q120 116 240 142 T400 134 L400 220 L0 220 Z" fill="#3B6E52" />
            <path d="M0 168 Q150 146 290 168 T400 162 L400 220 L0 220 Z" fill="#234835" />
            {renderSceneFrameAndBadge('花园 · huāyuán', 'Hoa viên mùa xuân rực rỡ', '#14532D')}
          </svg>
        );

      case 'kongtiao':
      case 'xiyiji':
      case 'bingxiang':
      case 'weishengjian':
      case 'deng':
        return (
          <svg
            viewBox="0 0 400 220"
            className="w-full h-full"
            role="img"
            aria-label="Minh họa Tiện nghi hiện đại: Điều hòa, Máy giặt, Tủ lạnh"
          >
            <defs>
              <linearGradient id="modernRoomBg" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#1B2A26" />
                <stop offset="60%" stopColor="#28423B" />
                <stop offset="100%" stopColor="#385B52" />
              </linearGradient>
            </defs>
            <rect width="400" height="220" rx="14" fill="url(#modernRoomBg)" />
            <rect x="0" y="176" width="400" height="44" fill="#18221F" />
            {/* Air Conditioner */}
            <g transform="translate(38, 64)">
              <rect x="0" y="0" width="168" height="46" rx="10" fill="#F8FAFC" stroke="#DFC470" strokeWidth="2" />
              <rect x="124" y="10" width="32" height="15" rx="4" fill="#0F172A" />
              <text x="140" y="21" textAnchor="middle" fill="#6EE7B7" fontSize="9.5" fontWeight="700">24°C</text>
            </g>
            {/* Washing Machine */}
            <g transform="translate(244, 46)">
              <rect x="0" y="0" width="112" height="136" rx="12" fill="#F8FAFC" stroke="#DFC470" strokeWidth="2.2" />
              <circle cx="56" cy="82" r="34" fill="#0F172A" stroke="#9B8A3E" strokeWidth="4.5" />
            </g>
            {renderSceneFrameAndBadge(hanzi || '现代电器', meaning || 'Thiết bị gia dụng tiện nghi', '#0F172A')}
          </svg>
        );

      case 'zanmen':
      case 'laoshi':
      case 'pengyou':
        return (
          <svg
            viewBox="0 0 400 220"
            className="w-full h-full"
            role="img"
            aria-label="Minh họa Thầy trò & Bạn bè lớp học"
          >
            <defs>
              <linearGradient id="hanuWallGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#E6ECE0" />
                <stop offset="100%" stopColor="#CEDBC7" />
              </linearGradient>
            </defs>
            <rect width="400" height="220" rx="14" fill="url(#hanuWallGrad)" />
            <rect x="0" y="178" width="400" height="42" fill="#2A3B31" />
            <g transform="translate(188, 20)">
              <rect x="0" y="0" width="194" height="108" rx="10" fill="#182820" stroke="#DFC470" strokeWidth="3" />
              <text x="97" y="58" textAnchor="middle" fill="#A7F3D0" fontSize="14" fontWeight="600">
                {hanzi || '咱们 · 朋友'}
              </text>
            </g>
            {renderSceneFrameAndBadge(hanzi || '咱们 · 朋友', 'Thầy trò & Bạn bè cùng nhau học tập', '#1E3227')}
          </svg>
        );

      default:
        return (
          <svg
            viewBox="0 0 400 220"
            className="w-full h-full"
            role="img"
            aria-label="Minh họa Phong cảnh Sơn Thủy Trung Hoa"
          >
            <defs>
              <linearGradient id="shanShuiSky" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#162920" />
                <stop offset="55%" stopColor="#2E503F" />
                <stop offset="100%" stopColor="#658C75" />
              </linearGradient>
            </defs>
            <rect width="400" height="220" rx="14" fill="url(#shanShuiSky)" />
            <circle cx="308" cy="60" r="28" fill="#FDE68A" stroke="#DFC470" strokeWidth="1.5" />
            <path d="M0 162 L78 88 L152 148 L234 74 L328 152 L400 104 L400 220 L0 220 Z" fill="#3B5949" opacity="0.7" />
            <path d="M0 178 L112 112 L206 168 L296 108 L400 172 L400 220 L0 220 Z" fill="#1E3227" opacity="0.92" />
            {renderSceneFrameAndBadge(hanzi || '锦绣山河', meaning || 'Phong cảnh thiên nhiên & Hán ngữ', '#182A21')}
          </svg>
        );
    }
  };

  return (
    <div className={`relative ${className} select-none overflow-hidden rounded-2xl group bg-[#111A15]`}>
      {/* If Photo Mode is active and image hasn't errored */}
      {viewMode === 'photo' && !imageError ? (
        <div className="relative w-full h-full overflow-hidden">
          {!imageLoaded && (
            <div className="absolute inset-0 pointer-events-none">
              {renderSvgArtwork()}
            </div>
          )}
          <img
            src={resolvedPhotoUrl}
            alt={`Ảnh minh họa cho từ ${hanzi} (${pinyin})`}
            className={`w-full h-full object-cover transition-all duration-300 ease-out ${
              imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
            }`}
            loading="eager"
            onLoad={() => setImageLoaded(true)}
            onError={() => {
              setImageError(true);
              setViewMode('svg');
            }}
          />

          {/* Elegant Dark-to-Transparent Vignette Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/40 pointer-events-none" />

          {/* Halora Gold Filigree Inner Frame */}
          <div className="absolute inset-2 border border-[#DFC470]/40 rounded-xl pointer-events-none" />

          {/* Floating Subtle Ambient Gold Dust */}
          <div className="absolute top-3 left-3 bg-[#182A21]/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-[#DFC470]/60 shadow-lg flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#DFC470] animate-pulse" />
            <div className="flex flex-col">
              <span className="font-['Noto_Sans_SC'] text-base font-bold text-[#F7E29C] leading-tight">
                {hanzi}
              </span>
              <span className="text-[10px] text-[#E5E9D7] font-medium leading-tight">
                {pinyin} {meaning ? `· ${meaning}` : ''}
              </span>
            </div>
          </div>
        </div>
      ) : (
        renderSvgArtwork()
      )}

      {/* Mode Switcher Button (Top Right) */}
      <button
        type="button"
        onClick={() => {
          if (imageError) {
            setImageError(false);
          }
          setViewMode((m) => (m === 'photo' ? 'svg' : 'photo'));
        }}
        title={viewMode === 'photo' ? 'Chuyển sang Tranh cổ phong SVG' : 'Chuyển sang Ảnh thực tế Unsplash'}
        className="absolute top-2.5 right-2.5 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-bold bg-[#182A21]/80 hover:bg-[#182A21] text-[#F7E29C] border border-[#DFC470]/60 backdrop-blur-md shadow-md transition-all active:scale-95"
      >
        {viewMode === 'photo' ? (
          <>
            <Palette className="w-3.5 h-3.5 text-[#DFC470]" />
            <span>Tranh vẽ</span>
          </>
        ) : (
          <>
            <ImageIcon className="w-3.5 h-3.5 text-[#DFC470]" />
            <span>Ảnh thật</span>
          </>
        )}
      </button>
    </div>
  );
};
