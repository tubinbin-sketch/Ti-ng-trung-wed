import React, { useEffect, useRef, useState } from 'react';
import {
  Volume2,
  Send,
  MessageCircle,
  X,
  Lightbulb,
  BookOpen,
  CheckCircle2,
  PenTool,
} from 'lucide-react';
import { VocabSlide } from '../data/chineseData';
import {
  askBinBinPandaAI,
  BinBinActionType,
  BinBinReply,
  BinBinWordCardInfo,
  generateBinBinSmartReply,
} from '../utils/chineseEngine';
import { speakChinese } from '../utils/speech';

export type PandaMood = 'idle' | 'waving' | 'cheering' | 'thinking';

interface BinBinPandaMascotSVGProps {
  mood?: PandaMood;
  size?: number;
  className?: string;
}

/**
 * Animated SVG Mascot: Gấu Trúc Bin Bin (彬彬)
 * Wearing a Jade-Green & Gold Scholar Cap + Classical Scarf (HANU × 阮文受 style)
 * Holding a fresh green bamboo branch (竹), with blinking eyes, waving paw on hover,
 * and cheering expression when students succeed.
 */
export const BinBinPandaMascotSVG: React.FC<BinBinPandaMascotSVGProps> = ({
  mood = 'idle',
  size = 68,
  className = '',
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false);

  useEffect(() => {
    const blinkInterval = window.setInterval(() => {
      setIsBlinking(true);
      window.setTimeout(() => setIsBlinking(false), 180);
    }, 3400);
    return () => window.clearInterval(blinkInterval);
  }, []);

  const effectiveMood: PandaMood = isHovered && mood === 'idle' ? 'waving' : mood;
  const isCheering = effectiveMood === 'cheering';
  const isWaving = effectiveMood === 'waving' || isCheering;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      className={`select-none overflow-visible ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="img"
      aria-label="Linh vật Gấu trúc Bin Bin (彬彬) — Trợ lý AI HANU × 阮文受"
    >
      <defs>
        <radialGradient id="binbinAura" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#F7E29C" stopOpacity="0.45" />
          <stop offset="70%" stopColor="#1E3227" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#1E3227" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="jadeScarf" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1E3227" />
          <stop offset="60%" stopColor="#2E4F3D" />
          <stop offset="100%" stopColor="#9B8A3E" />
        </linearGradient>
      </defs>

      {/* Soft Golden Jade Halo */}
      <circle cx="60" cy="64" r="52" fill="url(#binbinAura)" />

      {/* Cheering Sparkles when student answers/writes correctly */}
      {isCheering && (
        <g>
          <circle cx="18" cy="28" r="3.5" fill="#FBBF24" />
          <circle cx="104" cy="24" r="4" fill="#F43F5E" />
          <circle cx="14" cy="76" r="3" fill="#34D399" />
          <text
            x="98"
            y="18"
            fontSize="12"
            fontWeight="700"
            fill="#D97706"
            fontFamily="'Noto Sans SC', sans-serif"
          >
            棒!
          </text>
        </g>
      )}

      {/* Left & Right Round Panda Ears */}
      <circle cx="31" cy="34" r="13" fill="#18221D" />
      <circle cx="31" cy="34" r="6.5" fill="#374151" />
      <circle cx="89" cy="34" r="13" fill="#18221D" />
      <circle cx="89" cy="34" r="6.5" fill="#374151" />

      {/* Chubby Panda Body */}
      <ellipse cx="60" cy="91" rx="31" ry="23" fill="#18221D" />
      <ellipse cx="60" cy="94" rx="22" ry="17" fill="#FAFBF7" />

      {/* Right Arm Holding Fresh Green Bamboo Branch (竹) */}
      <g transform="translate(86, 74)">
        {/* Bamboo stalk */}
        <line
          x1="8"
          y1="26"
          x2="18"
          y2="-30"
          stroke="#15803D"
          strokeWidth="4.2"
          strokeLinecap="round"
        />
        <line
          x1="11"
          y1="8"
          x2="15"
          y2="8"
          stroke="#DCFCE7"
          strokeWidth="1.5"
        />
        <line
          x1="14"
          y1="-10"
          x2="18"
          y2="-10"
          stroke="#DCFCE7"
          strokeWidth="1.5"
        />
        {/* Bamboo leaves */}
        <path
          d="M16 -14 Q28 -22 33 -12 Q23 -8 16 -14 Z"
          fill="#22C55E"
        />
        <path
          d="M14 -2 Q27 -6 30 3 Q20 4 14 -2 Z"
          fill="#16A34A"
        />
        <path
          d="M17 -24 Q8 -34 3 -24 Q10 -19 17 -24 Z"
          fill="#4ADE80"
        />
        {/* Right Panda Paw holding bamboo */}
        <ellipse cx="4" cy="8" rx="9" ry="7" fill="#18221D" transform="rotate(-20)" />
        <circle cx="4" cy="8" r="3" fill="#374151" />
      </g>

      {/* Left Arm (Waves hello on hover / cheering!) */}
      <g
        transform={
          isWaving
            ? 'translate(26, 72) rotate(-38)'
            : 'translate(28, 80) rotate(12)'
        }
        className="transition-transform duration-300"
      >
        <ellipse cx="-6" cy="0" rx="11" ry="7.5" fill="#18221D" />
        <circle cx="-11" cy="0" r="3.2" fill="#F472B6" opacity="0.85" />
      </g>

      {/* Panda Head */}
      <ellipse cx="60" cy="56" rx="33" ry="28" fill="#FFFFFF" stroke="#18221D" strokeWidth="2.2" />

      {/* Characteristic Dark Eye Patches */}
      <ellipse
        cx="45"
        cy="56"
        rx="10"
        ry="8"
        fill="#18221D"
        transform="rotate(-14 45 56)"
      />
      <ellipse
        cx="75"
        cy="56"
        rx="10"
        ry="8"
        fill="#18221D"
        transform="rotate(14 75 56)"
      />

      {/* Eyes: Blinking / Cheering Happy Arcs / Standard Bright Eyes */}
      {isCheering ? (
        <>
          <path
            d="M40 56 Q45 50 50 56"
            fill="none"
            stroke="#FFFBEB"
            strokeWidth="2.6"
            strokeLinecap="round"
          />
          <path
            d="M70 56 Q75 50 80 56"
            fill="none"
            stroke="#FFFBEB"
            strokeWidth="2.6"
            strokeLinecap="round"
          />
        </>
      ) : isBlinking ? (
        <>
          <line
            x1="40"
            y1="56"
            x2="50"
            y2="56"
            stroke="#FFFBEB"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
          <line
            x1="70"
            y1="56"
            x2="80"
            y2="56"
            stroke="#FFFBEB"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
        </>
      ) : (
        <>
          <circle cx="46" cy="55" r="3.8" fill="#FFFFFF" />
          <circle cx="47.2" cy="54" r="1.5" fill="#FDE68A" />
          <circle cx="74" cy="55" r="3.8" fill="#FFFFFF" />
          <circle cx="75.2" cy="54" r="1.5" fill="#FDE68A" />
        </>
      )}

      {/* Rosy Cheeks */}
      <ellipse cx="34" cy="64" rx="5.5" ry="3.2" fill="#FB7185" opacity={isCheering ? 0.85 : 0.55} />
      <ellipse cx="86" cy="64" rx="5.5" ry="3.2" fill="#FB7185" opacity={isCheering ? 0.85 : 0.55} />

      {/* Cute Panda Nose & Smile */}
      <ellipse cx="60" cy="63" rx="4.5" ry="3.2" fill="#18221D" />
      {isCheering ? (
        <path
          d="M52 67 Q60 76 68 67 Z"
          fill="#E11D48"
        />
      ) : (
        <path
          d="M54 67 Q57 71 60 67 Q63 71 66 67"
          fill="none"
          stroke="#18221D"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
      )}

      {/* Classical Jade-Green & Gold Scarf (Khăn quàng cổ phong HANU × 阮文受) */}
      <path
        d="M35 76 Q60 86 85 76 L82 85 Q60 94 38 85 Z"
        fill="url(#jadeScarf)"
        stroke="#9B8A3E"
        strokeWidth="1.5"
      />
      {/* Scarf golden tassel tail */}
      <path
        d="M66 83 L72 102 L61 100 L62 84 Z"
        fill="#1E3227"
        stroke="#9B8A3E"
        strokeWidth="1.2"
      />
      <text
        x="66"
        y="96"
        textAnchor="middle"
        fill="#F7E29C"
        fontSize="7"
        fontWeight="700"
        fontFamily="'Noto Sans SC', sans-serif"
      >
        彬
      </text>

      {/* Scholar Mortarboard Cap in Jade Green & Gold (#1E3227 & #9B8A3E) */}
      <g transform="translate(60, 24)">
        <polygon
          points="0,-14 28,-4 0,6 -28,-4"
          fill="#1E3227"
          stroke="#9B8A3E"
          strokeWidth="1.8"
        />
        <rect x="-14" y="2" width="28" height="7" rx="3" fill="#2A4436" stroke="#9B8A3E" strokeWidth="1.2" />
        {/* Golden Tassel */}
        <circle cx="0" cy="-4" r="2.5" fill="#F7E29C" />
        <path
          d="M0 -4 Q16 -2 21 11"
          fill="none"
          stroke="#F59E0B"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="21" cy="12" r="2.5" fill="#F59E0B" />
      </g>
    </svg>
  );
};

export interface BinBinChatMessage {
  id: string;
  sender: 'binbin' | 'user';
  text: string;
  chinesePhrase?: string;
  pinyinPhrase?: string;
  vietnamesePhrase?: string;
  actionLabel?: string;
  wordCard?: BinBinWordCardInfo;
}

interface BinBinPandaAIProps {
  variant?: 'floating' | 'inline';
  activeSlide?: VocabSlide | null;
  quizContext?: {
    prompt?: string;
    grammarHint?: string;
    pinyinHint?: string;
  } | null;
  externalMood?: PandaMood;
  title?: string;
}

export const BinBinPandaAI: React.FC<BinBinPandaAIProps> = ({
  variant = 'inline',
  activeSlide = null,
  quizContext = null,
  externalMood = 'idle',
  title,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mood, setMood] = useState<PandaMood>(externalMood);
  const [inputText, setInputText] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const responseBoxRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 120);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const targetHanzi = activeSlide?.hanzi || '温暖';
  const targetPinyin = activeSlide?.pinyin || 'wēn nuǎn';
  const targetMeaning = activeSlide?.meaning || 'ấm áp, đầm ấm';

  const [messages, setMessages] = useState<BinBinChatMessage[]>(() => {
    const initialReply: BinBinReply = generateBinBinSmartReply(
      'mnemonic',
      `Giải thích mẹo nhớ chữ ${targetHanzi}`,
      activeSlide,
      quizContext
    );
    return [
      {
        id: 'welcome-binbin',
        sender: 'binbin',
        text: initialReply.replyText,
        chinesePhrase: initialReply.chinesePhrase,
        pinyinPhrase: initialReply.pinyinPhrase,
        vietnamesePhrase: initialReply.vietnamesePhrase,
        actionLabel: `🐼 Mẹo nhớ chữ “${targetHanzi}”`,
        wordCard: initialReply.wordCard,
      },
    ];
  });

  // Auto-scroll to newest message immediately
  useEffect(() => {
    if (responseBoxRef.current) {
      responseBoxRef.current.scrollTop = responseBoxRef.current.scrollHeight;
    }
  }, [messages.length, isOpen]);

  // Sync external cheering/waving mood
  useEffect(() => {
    if (externalMood !== 'idle') {
      setMood(externalMood);
      const timer = window.setTimeout(() => setMood('idle'), 2400);
      return () => window.clearTimeout(timer);
    }
  }, [externalMood]);

  // Update Bin Bin's top welcome tip automatically when the user switches to a different VocabSlide
  useEffect(() => {
    if (!activeSlide) return;
    const tip = generateBinBinSmartReply(
      'mnemonic',
      `Giải thích mẹo nhớ chữ ${activeSlide.hanzi}`,
      activeSlide,
      quizContext
    );
    setMessages((prev) => {
      const rest = prev.slice(1);
      return [
        {
          id: `welcome-${activeSlide.id}`,
          sender: 'binbin',
          text: tip.replyText,
          chinesePhrase: tip.chinesePhrase,
          pinyinPhrase: tip.pinyinPhrase,
          vietnamesePhrase: tip.vietnamesePhrase,
          actionLabel: `🐼 Mẹo nhớ chữ “${activeSlide.hanzi}”`,
          wordCard: tip.wordCard,
        },
        ...rest,
      ];
    });
  }, [activeSlide?.id, activeSlide?.hanzi]);

  const handleQuickAction = (
    actionType: BinBinActionType,
    label: string,
    defaultPrompt: string
  ) => {
    const now = Date.now();
    const userMsg: BinBinChatMessage = {
      id: `user-${now}`,
      sender: 'user',
      text: defaultPrompt,
    };

    // 0ms Instant Local Chinese Engine response
    const instantReply = generateBinBinSmartReply(
      actionType,
      defaultPrompt,
      activeSlide,
      quizContext
    );
    const botMsgId = `binbin-${now + 1}`;
    const instantBotMsg: BinBinChatMessage = {
      id: botMsgId,
      sender: 'binbin',
      text: instantReply.replyText,
      chinesePhrase: instantReply.chinesePhrase,
      pinyinPhrase: instantReply.pinyinPhrase,
      vietnamesePhrase: instantReply.vietnamesePhrase,
      actionLabel: label,
      wordCard: instantReply.wordCard,
    };

    setMessages((prev) => [...prev, userMsg, instantBotMsg]);
    setMood('cheering');
  };

  const handleSendCustomMessage = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputText.trim();
    if (!trimmed) return;
    setInputText('');

    const now = Date.now();
    const userMsg: BinBinChatMessage = {
      id: `user-${now}`,
      sender: 'user',
      text: trimmed,
    };

    // Detect if student is asking for sentence/grammar check vs vocabulary lookup
    const isGrammarFix =
      trimmed.toLowerCase().includes('sửa') ||
      trimmed.toLowerCase().includes('dịch') ||
      trimmed.toLowerCase().includes('đúng không') ||
      trimmed.length > 8;

    const actionType: BinBinActionType = isGrammarFix ? 'grammar-fix' : 'chat';

    // 0ms Instant Local Chinese Engine response — ZERO waiting or loading spinner
    const instantReply = generateBinBinSmartReply(
      actionType,
      trimmed,
      activeSlide,
      quizContext
    );

    const resolvedHanzi = instantReply.wordCard?.hanzi || targetHanzi;
    const botMsgId = `binbin-${now + 1}`;
    const instantBotMsg: BinBinChatMessage = {
      id: botMsgId,
      sender: 'binbin',
      text: instantReply.replyText,
      chinesePhrase: instantReply.chinesePhrase,
      pinyinPhrase: instantReply.pinyinPhrase,
      vietnamesePhrase: instantReply.vietnamesePhrase,
      actionLabel: `🐼 Phân tích tức thì: “${resolvedHanzi}”`,
      wordCard: instantReply.wordCard,
    };

    setMessages((prev) => [...prev, userMsg, instantBotMsg]);
    setMood('cheering');

    // Non-blocking background hybrid enrichment for open-ended sentences (strictly capped, never blocks UI)
    void askBinBinPandaAI(actionType, trimmed, activeSlide, quizContext).then(
      (aiReply) => {
        if (aiReply && aiReply.replyText && aiReply.replyText !== instantReply.replyText) {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === botMsgId
                ? {
                    ...m,
                    text: aiReply.replyText,
                    chinesePhrase: aiReply.chinesePhrase || m.chinesePhrase,
                    pinyinPhrase: aiReply.pinyinPhrase || m.pinyinPhrase,
                    vietnamesePhrase: aiReply.vietnamesePhrase || m.vietnamesePhrase,
                    wordCard: aiReply.wordCard || m.wordCard,
                  }
                : m
            )
          );
        }
      }
    );
  };

  const renderQuickActionButtons = (compact = false) => (
    <div
      className={`grid ${
        compact ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
      } gap-2`}
    >
      <button
        type="button"
        data-testid={`binbin-btn-mnemonic-${variant}`}
        onClick={() =>
          handleQuickAction(
            'mnemonic',
            `🐼 Chiết tự chữ “${targetHanzi}”`,
            `Giải thích bộ thủ và mẹo nhớ chiết tự chữ Hán “${targetHanzi}” (${targetPinyin} - ${targetMeaning}).`
          )
        }
        className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-[#1E3227] hover:bg-[#2B4637] border border-[#9B8A3E]/50 text-left text-xs font-bold text-[#FAFBF7] transition-all shadow-2xs"
      >
        <BookOpen className="w-3.5 h-3.5 text-[#C5B358] shrink-0" />
        <span>🐼 Giải thích mẹo nhớ chữ Hán đang học</span>
      </button>

      <button
        type="button"
        data-testid={`binbin-btn-dialogue-${variant}`}
        onClick={() =>
          handleQuickAction(
            'dialogue',
            `🗣️ Hội thoại cùng Bin Bin`,
            `Luyện hội thoại tiếng Trung song ngữ Trung - Việt với từ “${targetHanzi}” (${targetPinyin}).`
          )
        }
        className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white hover:bg-[#FAFBF7] border border-[rgba(30,50,39,0.18)] hover:border-[#9B8A3E] text-left text-xs font-bold text-[#1E3227] transition-all"
      >
        <MessageCircle className="w-3.5 h-3.5 text-[#1E3227] shrink-0" />
        <span>🗣️ Luyện hội thoại tiếng Trung với Bin Bin</span>
      </button>

      <button
        type="button"
        data-testid={`binbin-btn-grammar-${variant}`}
        onClick={() =>
          handleQuickAction(
            'grammar-fix',
            `✍️ Sửa lỗi câu & Ngữ pháp`,
            `Sửa lỗi câu và hướng dẫn ngữ pháp cách dùng từ “${targetHanzi}” trong câu tiếng Trung.`
          )
        }
        className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white hover:bg-[#FAFBF7] border border-[rgba(30,50,39,0.18)] hover:border-[#9B8A3E] text-left text-xs font-bold text-[#1E3227] transition-all"
      >
        <PenTool className="w-3.5 h-3.5 text-[#9B8A3E] shrink-0" />
        <span>✍️ Sửa lỗi câu &amp; Ngữ pháp</span>
      </button>

      <button
        type="button"
        data-testid={`binbin-btn-hint-${variant}`}
        onClick={() =>
          handleQuickAction(
            'quiz-hint',
            `💡 Gợi ý đáp án Trò chơi`,
            quizContext?.prompt
              ? `Gợi ý cấu trúc ngữ pháp cho câu hỏi: “${quizContext.prompt}” mà không lộ đáp án.`
              : `Gợi ý cấu trúc ngữ pháp để ghép câu với từ “${targetHanzi}” mà không lộ ngay đáp án.`
          )
        }
        className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-[#C5B358]/20 hover:bg-[#C5B358]/30 border border-[#9B8A3E]/60 text-left text-xs font-bold text-[#1E3227] transition-all"
      >
        <Lightbulb className="w-3.5 h-3.5 text-[#9B8A3E] shrink-0" />
        <span>💡 Gợi ý đáp án Trò chơi</span>
      </button>
    </div>
  );

  /* =========================================================================
     SHARED POPUP / EXPANDED CHAT CARD CONTENT (Only rendered when isOpen === true)
     ========================================================================= */
  const renderPopupChatCard = (isFloating: boolean) => (
    <div
      data-testid={isFloating ? 'binbin-floating-panel' : 'binbin-inline-panel'}
      className={
        isFloating
          ? 'mb-3 w-[350px] sm:w-[430px] max-h-[80vh] rounded-3xl bg-[#FAFBF7]/95 backdrop-blur-md border-2 border-[rgba(30,50,39,0.2)] shadow-2xl text-[#1E3227] flex flex-col overflow-hidden'
          : 'mt-4 rounded-3xl bg-[rgba(255,255,255,0.65)] backdrop-blur-md border border-[rgba(30,50,39,0.18)] shadow-md text-[#1E3227] flex flex-col overflow-hidden'
      }
    >
      {/* Popup Header with "Đóng / Thu nhỏ (✕)" button */}
      <div className="px-4 py-3.5 bg-gradient-to-r from-[#1E3227] to-[#2B4637] border-b border-[#9B8A3E]/40 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-11 h-11 rounded-full bg-[#FAFBF7] border border-[#9B8A3E] flex items-center justify-center shrink-0">
            <BinBinPandaMascotSVG mood={mood} size={42} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-sm font-bold text-[#FAFBF7] truncate">
                {title || `Gấu trúc Bin Bin (彬彬)`}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#C5B358]/25 border border-[#C5B358]/60 text-[10px] font-bold text-[#FAFBF7]">
                ⚡ Phản hồi 0ms
              </span>
            </div>
            <p className="text-[11px] text-[#CBCFB8] flex items-center gap-1.5 mt-0.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#C5B358] shrink-0" />
              <span>
                Đang hỗ trợ từ:{' '}
                <strong className="text-[#FAFBF7] font-['Noto_Sans_SC']">
                  {targetHanzi} ({targetPinyin})
                </strong>
              </span>
            </p>
          </div>
        </div>

        <button
          type="button"
          data-testid={`binbin-close-${variant}`}
          onClick={() => setIsOpen(false)}
          aria-label="Đóng / Thu nhỏ Gấu trúc Bin Bin AI"
          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/25 text-xs font-semibold text-[#FAFBF7] transition-colors shrink-0"
        >
          <span>Thu nhỏ</span>
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 4 Quick Action Buttons */}
      <div className="p-3.5 bg-[#F4F6EE] border-b border-[rgba(30,50,39,0.12)]">
        <div className="text-[11px] font-bold uppercase tracking-wider text-[#9B8A3E] mb-2">
          Hỏi nhanh Bin Bin (1 chạm):
        </div>
        {renderQuickActionButtons(isFloating)}
      </div>

      {/* Conversation / Response History */}
      <div
        ref={responseBoxRef}
        data-testid="binbin-response-box"
        className="p-4 space-y-3 overflow-y-auto max-h-72 bg-[#FAFBF7]"
      >
        {messages.slice(-4).map((msg) => (
          <div
            key={msg.id}
            className={`rounded-2xl p-3.5 text-xs leading-relaxed ${
              msg.sender === 'binbin'
                ? 'bg-[#F4F6EE] border border-[rgba(30,50,39,0.15)] text-[#1E3227]'
                : 'bg-[#1E3227] border border-[#9B8A3E]/50 text-[#FAFBF7] ml-6'
            }`}
          >
            {msg.actionLabel && (
              <div
                className={`text-[11px] font-bold mb-1.5 ${
                  msg.sender === 'binbin' ? 'text-[#9B8A3E]' : 'text-[#C5B358]'
                }`}
              >
                {msg.actionLabel}
              </div>
            )}

            {/* Instant Dictionary & Radical Breakdown Card when wordCard is present */}
            {msg.sender === 'binbin' && msg.wordCard && (
              <div
                data-testid="binbin-word-card"
                className="mb-2.5 p-2.5 rounded-xl bg-white border border-[#9B8A3E]/35 shadow-2xs space-y-1.5"
              >
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className="font-['Noto_Sans_SC'] text-base font-extrabold text-[#1E3227]">
                      {msg.wordCard.hanzi}
                    </span>
                    <span className="text-xs font-bold text-[#9B8A3E]">
                      /{msg.wordCard.pinyin}/
                    </span>
                    <span className="px-1.5 py-0.5 rounded-md bg-[#1E3227]/10 text-[10px] font-extrabold uppercase text-[#1E3227]">
                      Hán Việt: {msg.wordCard.hanViet}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#C5B358]/20 text-[#1E3227]">
                    {msg.wordCard.hskLevel}
                  </span>
                </div>

                <div className="text-xs font-bold text-[#1E3227]">
                  🇻🇳 Nghĩa: <span className="text-[#2B4637]">{msg.wordCard.meaning}</span>
                </div>

                {/* 2 Common Compound Words */}
                {msg.wordCard.compoundWords && msg.wordCard.compoundWords.length > 0 && (
                  <div className="pt-1 border-t border-[rgba(30,50,39,0.08)] flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] font-bold text-[#5F7266]">
                      🔗 2 từ ghép:
                    </span>
                    {msg.wordCard.compoundWords.map((cw, idx) => (
                      <button
                        key={`${cw.hanzi}-${idx}`}
                        type="button"
                        onClick={() => speakChinese(cw.hanzi)}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-[#F4F6EE] hover:bg-[#E7ECE0] border border-[rgba(30,50,39,0.14)] text-[11px] font-semibold text-[#1E3227] transition-colors"
                        title={`Nghe phát âm ${cw.hanzi}`}
                      >
                        <span className="font-['Noto_Sans_SC'] font-bold">{cw.hanzi}</span>
                        <span className="text-[#9B8A3E]">({cw.pinyin})</span>
                        <span className="text-[#3F5447]">: {cw.meaning}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            <p
              className={`text-xs sm:text-sm leading-relaxed font-medium ${
                msg.sender === 'binbin' ? 'text-[#1E3227]' : 'text-[#FAFBF7]'
              }`}
            >
              {msg.text}
            </p>

            {msg.chinesePhrase && (
              <div className="mt-2.5 p-2.5 rounded-xl bg-white border border-[rgba(30,50,39,0.15)] flex items-center justify-between gap-2">
                <div>
                  <div className="font-['Noto_Sans_SC'] text-sm sm:text-base font-bold text-[#1E3227]">
                    {msg.chinesePhrase}
                  </div>
                  {msg.pinyinPhrase && (
                    <div className="text-[11px] font-bold text-[#9B8A3E] mt-0.5">
                      {msg.pinyinPhrase}
                    </div>
                  )}
                  {msg.vietnamesePhrase && (
                    <div className="text-[11px] font-medium text-[#3F5447] mt-0.5">
                      {msg.vietnamesePhrase}
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  data-testid="binbin-listen-zh"
                  onClick={() => speakChinese(msg.chinesePhrase!)}
                  aria-label={`Nghe Bin Bin đọc ${msg.chinesePhrase}`}
                  className="px-2.5 py-1.5 rounded-xl bg-[#1E3227] hover:bg-[#2B4637] border border-[#9B8A3E]/50 text-[#FAFBF7] text-[11px] font-bold inline-flex items-center gap-1 shrink-0"
                >
                  <Volume2 className="w-3.5 h-3.5 text-[#C5B358]" />
                  🔊 Nghe zh-CN
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Custom Question / Sentence Correction Input Form */}
      <form
        onSubmit={handleSendCustomMessage}
        className="p-3 bg-[#F4F6EE] border-t border-[rgba(30,50,39,0.12)] flex items-center gap-2"
      >
        <input
          type="text"
          data-testid={`binbin-custom-input-${variant}`}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={`Nhập từ (vd: 交通, 温暖) hoặc câu tiếng Trung/Việt...`}
          className="flex-1 px-3.5 py-2 rounded-xl bg-white border border-[rgba(30,50,39,0.18)] text-xs text-[#1E3227] placeholder-[#5F7266] focus:outline-none focus:border-[#9B8A3E]"
        />
        <button
          type="submit"
          data-testid={`binbin-custom-submit-${variant}`}
          aria-label="Gửi câu hỏi cho Bin Bin"
          className="px-3.5 py-2 rounded-xl bg-[#1E3227] hover:bg-[#2B4637] text-[#FAFBF7] border border-[#9B8A3E]/60 text-xs font-bold inline-flex items-center gap-1 shrink-0 transition-colors"
        >
          <Send className="w-3.5 h-3.5 text-[#C5B358]" />
          Gửi
        </button>
      </form>
    </div>
  );

  /* =========================================================================
     VARIANT 1: FLOATING BOTTOM-RIGHT WIDGET (Collapsed Icon Badge -> Popup)
     ========================================================================= */
  if (variant === 'floating') {
    return (
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 flex flex-col items-end pointer-events-auto">
        {isOpen && renderPopupChatCard(true)}

        {/* Smart Compact Circular or Pill Floating Trigger Button ("Hỏi Bin Bin") */}
        <button
          type="button"
          data-testid="binbin-floating-trigger"
          onClick={() => setIsOpen((v) => !v)}
          aria-expanded={isOpen}
          aria-label="Hỏi Bin Bin — Mở trợ lý AI Gấu trúc Bin Bin"
          className={`group relative flex items-center transition-all duration-300 shadow-xl border-2 border-[#9B8A3E] bg-[#1E3227] hover:bg-[#274133] text-[#FAFBF7] ${
            isOpen
              ? 'rounded-full px-3.5 py-1.5 gap-2 hover:scale-105'
              : isScrolled
              ? 'w-12 h-12 rounded-full justify-center hover:scale-110 p-0.5'
              : 'rounded-full pl-1.5 pr-3.5 py-1.5 gap-2 hover:scale-105'
          }`}
          title={isOpen ? 'Thu nhỏ bảng Hỏi Bin Bin' : 'Hỏi Bin Bin — Trợ lý AI Hán ngữ'}
        >
          <div className="w-9 h-9 rounded-full bg-[#FAFBF7] border border-[#9B8A3E] flex items-center justify-center shrink-0 relative">
            <BinBinPandaMascotSVG mood={mood} size={34} />
            <span className="w-2.5 h-2.5 rounded-full bg-[#C5B358] border border-[#1E3227] absolute -top-0.5 -right-0.5 animate-pulse" />
          </div>

          {(isOpen || !isScrolled) && (
            <span className="text-xs font-bold text-[#FAFBF7] whitespace-nowrap">
              {isOpen ? 'Thu nhỏ ✕' : 'Hỏi Bin Bin'}
            </span>
          )}

          {/* Hover tooltip for compact circular mode */}
          {!isOpen && isScrolled && (
            <span className="pointer-events-none absolute right-full mr-2.5 px-2.5 py-1 rounded-xl bg-[#1E3227] text-white text-[11px] font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity border border-[#9B8A3E]/50 shadow-md">
              Hỏi Bin Bin (彬彬)
            </span>
          )}
        </button>
      </div>
    );
  }

  /* =========================================================================
     VARIANT 2: COMPACT INLINE BADGE BELOW LESSON / QUIZ (Collapsed by default, expands on click)
     ========================================================================= */
  return (
    <div className="mt-4 flex flex-col items-end">
      {!isOpen ? (
        <button
          type="button"
          data-testid="binbin-inline-trigger"
          onClick={() => setIsOpen(true)}
          aria-expanded={isOpen}
          className="group inline-flex items-center gap-2.5 pl-1.5 pr-4 py-1.5 rounded-full bg-[rgba(255,255,255,0.75)] hover:bg-[#FAFBF7] border border-[rgba(30,50,39,0.18)] hover:border-[#9B8A3E] text-[#1E3227] shadow-2xs transition-all"
        >
          <div className="w-9 h-9 rounded-full bg-[#FAFBF7] border border-[#9B8A3E] flex items-center justify-center shrink-0">
            <BinBinPandaMascotSVG mood={mood} size={34} />
          </div>
          <span className="text-xs font-bold text-[#1E3227]">Hỏi Bin Bin</span>
          <span className="text-[11px] font-bold text-[#9B8A3E] font-['Noto_Sans_SC']">
            · {targetHanzi}
          </span>
        </button>
      ) : (
        <div className="w-full">{renderPopupChatCard(false)}</div>
      )}
    </div>
  );
};

