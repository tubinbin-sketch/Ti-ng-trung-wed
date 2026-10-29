/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  Menu,
  X,
  BookOpen,
  Sparkles,
  Users,
  Presentation,
  GraduationCap,
  Palette,
  Edit3,
  UserCheck,
  LogIn,
} from 'lucide-react';
import {
  INITIAL_VOCAB_SLIDES,
  TEACHER_THEME_PRESETS,
  TeacherThemePreset,
  VocabSlide,
} from './data/chineseData';
import { HaloraCenterScene } from './components/HaloraCenterScene';
import { SlideDeckStudio } from './components/SlideDeckStudio';
import { StrokeWritingModal } from './components/StrokeWritingModal';
import { QuizGameArena } from './components/QuizGameArena';
import { StudentAssignmentArena } from './components/StudentAssignmentArena';
import { ClassroomManager, getStoredStudentRoster } from './components/ClassroomManager';
import { TeacherThemeStudio } from './components/TeacherThemeStudio';
import { AuthModal, UserProfile, UserRole } from './components/AuthModal';
import { BinBinPandaAI } from './components/BinBinPandaAI';
import { speakChinese } from './utils/speech';

type TeacherTab = 'lesson-builder' | 'class-manager';
type StudentTab = 'today-lesson' | 'quiz-leaderboard';

export default function App() {
  // User Profile & Role State (Default logged in as Teacher Nguyễn Văn Thụ)
  const [selectedStudentName, setSelectedStudentName] = useState<string>(() => {
    const roster = getStoredStudentRoster();
    return roster[0]?.name || 'Lưu Thị Minh Thư';
  });
  const [userProfile, setUserProfile] = useState<UserProfile>({
    role: 'teacher',
    name: 'Nguyễn Văn Thụ (阮文受)',
    classCode: '722229',
  });
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [hasOpenedPortalOnce, setHasOpenedPortalOnce] = useState(false);

  // Separate 2-Tab State for Teacher Mode & Student Mode
  const [teacherTab, setTeacherTab] = useState<TeacherTab>('lesson-builder');
  const [studentTab, setStudentTab] = useState<StudentTab>('today-lesson');
  const [showThemeDrawer, setShowThemeDrawer] = useState(false);

  const [slides, setSlides] = useState<VocabSlide[]>(() => {
    try {
      const saved = localStorage.getItem('hanu_custom_vocab_slides_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const baseIds = new Set(INITIAL_VOCAB_SLIDES.map((s) => s.hanzi));
          const extra = parsed.filter((s: VocabSlide) => s && s.hanzi && !baseIds.has(s.hanzi));
          return [...INITIAL_VOCAB_SLIDES, ...extra];
        }
      }
    } catch {
      // ignore storage errors
    }
    return INITIAL_VOCAB_SLIDES;
  });
  const [activeSlideIndex, setActiveSlideIndex] = useState(10); // Default to 温暖 (wēn nuǎn)
  const [writingModalSlide, setWritingModalSlide] = useState<VocabSlide | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<TeacherThemePreset>(
    TEACHER_THEME_PRESETS[0]
  );
  const [classroomStudentCount, setClassroomStudentCount] = useState<number>(
    () => getStoredStudentRoster().length
  );

  useEffect(() => {
    const handleRosterUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<number>;
      if (typeof customEvent.detail === 'number') {
        setClassroomStudentCount(customEvent.detail);
      } else {
        setClassroomStudentCount(getStoredStudentRoster().length);
      }
    };
    window.addEventListener('hanu_students_updated', handleRosterUpdate);
    return () => {
      window.removeEventListener('hanu_students_updated', handleRosterUpdate);
    };
  }, []);

  // Refs for Web Animations API entrance timeline
  const headerItemsRef = useRef<(HTMLElement | null)[]>([]);
  const kickerDotRef = useRef<HTMLSpanElement | null>(null);
  const kickerLabelRef = useRef<HTMLSpanElement | null>(null);
  const headlineLine1Ref = useRef<HTMLSpanElement | null>(null);
  const headlineLine2Ref = useRef<HTMLSpanElement | null>(null);
  const bodyCopyRef = useRef<HTMLParagraphElement | null>(null);
  const ctaGroupRef = useRef<HTMLDivElement | null>(null);
  const glassCardsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const studioSectionRef = useRef<HTMLElement | null>(null);

  // Synchronize CSS variables whenever the user switches among the 5 teacher themes
  useEffect(() => {
    const root = document.documentElement;
    const isDark = selectedTheme.id === 'moon-night';
    root.style.setProperty('--theme-canvas', selectedTheme.bgCanvas);
    root.style.setProperty('--theme-surface', selectedTheme.bgSurface);
    root.style.setProperty('--theme-ink', selectedTheme.inkPrimary);
    root.style.setProperty('--theme-ink-muted', selectedTheme.inkSecondary);
    root.style.setProperty('--theme-accent', selectedTheme.accentColor);
    root.style.setProperty('--theme-banner', selectedTheme.bannerTone);
    root.style.setProperty(
      '--theme-tab-bar-bg',
      isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(30, 50, 39, 0.09)'
    );
    root.style.setProperty(
      '--theme-tab-bar-border',
      isDark ? 'rgba(255, 255, 255, 0.18)' : 'rgba(30, 50, 39, 0.18)'
    );
  }, [selectedTheme]);

  // Web Animations API Entrance (runs once when fonts are ready, fill: backwards, then cancels)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) return;

    let cancelled = false;
    const activeAnimations: Animation[] = [];

    const runEntrance = async () => {
      try {
        if ('fonts' in document) {
          await document.fonts.ready;
        }
      } catch {
        // Ignore font readiness errors
      }
      if (cancelled) return;

      const easing = 'cubic-bezier(0.16, 1, 0.3, 1)';

      // 1. Header items drop from top staggered
      headerItemsRef.current.forEach((el, idx) => {
        if (!el || typeof el.animate !== 'function') return;
        const anim = el.animate(
          [
            { opacity: 0, transform: 'translateY(-18px)' },
            { opacity: 1, transform: 'translateY(0)' },
          ],
          {
            duration: 520,
            delay: idx * 55,
            easing,
            fill: 'backwards',
          }
        );
        activeAnimations.push(anim);
      });

      // 2. Tracking dot pops in with circular clip-path, label follows
      if (kickerDotRef.current && typeof kickerDotRef.current.animate === 'function') {
        activeAnimations.push(
          kickerDotRef.current.animate(
            [
              { clipPath: 'circle(0% at 50% 50%)', transform: 'scale(0.5)' },
              { clipPath: 'circle(50% at 50% 50%)', transform: 'scale(1)' },
            ],
            { duration: 420, delay: 180, easing, fill: 'backwards' }
          )
        );
      }

      if (kickerLabelRef.current && typeof kickerLabelRef.current.animate === 'function') {
        activeAnimations.push(
          kickerLabelRef.current.animate(
            [
              { opacity: 0, transform: 'translateX(-10px)' },
              { opacity: 1, transform: 'translateX(0)' },
            ],
            { duration: 460, delay: 250, easing, fill: 'backwards' }
          )
        );
      }

      // 3. Each headline line rises inside its own mask
      [headlineLine1Ref.current, headlineLine2Ref.current].forEach((lineEl, idx) => {
        if (!lineEl || typeof lineEl.animate !== 'function') return;
        activeAnimations.push(
          lineEl.animate(
            [
              { transform: 'translateY(105%)', opacity: 0 },
              { transform: 'translateY(0%)', opacity: 1 },
            ],
            {
              duration: 620,
              delay: 300 + idx * 110,
              easing,
              fill: 'backwards',
            }
          )
        );
      });

      // 4. Paragraph and CTA settle into position
      [bodyCopyRef.current, ctaGroupRef.current].forEach((el, idx) => {
        if (!el || typeof el.animate !== 'function') return;
        activeAnimations.push(
          el.animate(
            [
              { opacity: 0, transform: 'translateY(16px)' },
              { opacity: 1, transform: 'translateY(0)' },
            ],
            {
              duration: 540,
              delay: 480 + idx * 90,
              easing,
              fill: 'backwards',
            }
          )
        );
      });

      // 5. Three frosted glass metric cards rise sequentially
      glassCardsRef.current.forEach((cardEl, idx) => {
        if (!cardEl || typeof cardEl.animate !== 'function') return;
        activeAnimations.push(
          cardEl.animate(
            [
              { opacity: 0, transform: 'translateY(22px)' },
              { opacity: 1, transform: 'translateY(0)' },
            ],
            {
              duration: 560,
              delay: 380 + idx * 110,
              easing,
              fill: 'backwards',
            }
          )
        );
      });

      Promise.allSettled(activeAnimations.map((a) => a.finished)).then(() => {
        if (!cancelled) {
          activeAnimations.forEach((a) => {
            try {
              a.cancel();
            } catch {
              // ignore
            }
          });
        }
      });
    };

    runEntrance();

    return () => {
      cancelled = true;
      activeAnimations.forEach((a) => {
        try {
          a.cancel();
        } catch {
          // ignore
        }
      });
    };
  }, []);

  const scrollToStudio = () => {
    setMobileMenuOpen(false);
    studioSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Switch role directly via the quick Role Switcher in #studio
  const handleQuickSwitchRole = (targetRole: UserRole) => {
    const roster = getStoredStudentRoster();
    const validStudentName =
      roster.some((s) => s.name === selectedStudentName)
        ? selectedStudentName
        : roster[0]?.name || 'Lưu Thị Minh Thư';
    if (targetRole === 'student' && validStudentName !== selectedStudentName) {
      setSelectedStudentName(validStudentName);
    }
    setUserProfile((prev) => ({
      role: targetRole,
      name:
        targetRole === 'teacher'
          ? 'Nguyễn Văn Thụ (阮文受)'
          : validStudentName,
      classCode: prev.classCode || '722229',
    }));
  };

  // Navigate to a specific feature and open AuthModal on first start if requested
  const handleStartFromHero = (openPortal = true) => {
    scrollToStudio();
    if (openPortal && !hasOpenedPortalOnce) {
      setHasOpenedPortalOnce(true);
      setAuthModalOpen(true);
    }
  };

  const handleSelectNavTarget = (target: 'vocab' | 'writing' | 'quiz' | 'class') => {
    setMobileMenuOpen(false);
    if (target === 'vocab' || target === 'writing') {
      if (userProfile.role === 'teacher') {
        setTeacherTab('lesson-builder');
      } else {
        setStudentTab('today-lesson');
      }
      if (target === 'writing') {
        const current = slides[activeSlideIndex] || slides[6];
        speakChinese(current.hanzi);
      }
    } else if (target === 'quiz') {
      handleQuickSwitchRole('student');
      setStudentTab('quiz-leaderboard');
    } else if (target === 'class') {
      handleQuickSwitchRole('teacher');
      setTeacherTab('class-manager');
    }
    studioSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleToggleLearnedSlide = (slideId: string) => {
    setSlides((prev) =>
      prev.map((s) => (s.id === slideId ? { ...s, learned: !s.learned } : s))
    );
    setWritingModalSlide((prev) =>
      prev && prev.id === slideId ? { ...prev, learned: !prev.learned } : prev
    );
  };

  const persistCustomSlides = (allSlides: VocabSlide[]) => {
    try {
      const baseHanzis = new Set(INITIAL_VOCAB_SLIDES.map((s) => s.hanzi));
      const customOnly = allSlides.filter((s) => !baseHanzis.has(s.hanzi));
      localStorage.setItem('hanu_custom_vocab_slides_v2', JSON.stringify(customOnly));
    } catch {
      // ignore storage quota errors
    }
  };

  const handleAddSlides = (newSlides: VocabSlide[]) => {
    setSlides((prev) => {
      const updated = [...prev, ...newSlides];
      persistCustomSlides(updated);
      return updated;
    });
  };

  const handleUpdateSlide = (updatedSlide: VocabSlide) => {
    setSlides((prev) => {
      const updated = prev.map((s) => (s.id === updatedSlide.id ? updatedSlide : s));
      persistCustomSlides(updated);
      return updated;
    });
  };

  const isDarkTheme = selectedTheme.id === 'moon-night';

  return (
    <div
      id="top"
      className="min-h-screen transition-colors duration-300"
      style={{
        backgroundColor: selectedTheme.bgCanvas,
        color: selectedTheme.inkPrimary,
      }}
    >
      {/* =====================================================================
          SCREEN 1: HANU × 阮文受 HERO STAGE (Full 100vh Screen)
          3-Zone Desktop Layout: Left Text (max 420px) | Center Dragon & Jade Ring | Right 3 Glass Cards
          ===================================================================== */}
      <section className="halora-stage" aria-label="HANU × 阮文受 — Nền tảng Hán ngữ Thông minh">
        {/* Header */}
        <header className="halora-header">
          {/* Left: 6-petal dot circle logo + "HANU × 阮文受" */}
          <a
            href="#top"
            ref={(el) => {
              headerItemsRef.current[0] = el;
            }}
            className="halora-brand"
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 32 32"
              fill="none"
              aria-hidden="true"
              className="shrink-0"
            >
              <circle cx="16" cy="5" r="2.6" fill="#1E3227" />
              <circle cx="25.5" cy="10.5" r="2.6" fill="#1E3227" />
              <circle cx="25.5" cy="21.5" r="2.6" fill="#1E3227" />
              <circle cx="16" cy="27" r="2.6" fill="#1E3227" />
              <circle cx="6.5" cy="21.5" r="2.6" fill="#1E3227" />
              <circle cx="6.5" cy="10.5" r="2.6" fill="#1E3227" />
              <circle cx="16" cy="16" r="3.2" fill="#9B8A3E" />
            </svg>
            <span>
              HANU × <span className="font-['Noto_Sans_SC']">阮文受</span>
            </span>
          </a>

          {/* Center: 4 Concise Pure Vietnamese Navigation Links */}
          <nav className="halora-nav" aria-label="Điều hướng chính">
            <button
              type="button"
              ref={(el) => {
                headerItemsRef.current[1] = el;
              }}
              onClick={() => handleSelectNavTarget('vocab')}
              className="halora-nav-link"
            >
              Từ vựng
            </button>
            <button
              type="button"
              ref={(el) => {
                headerItemsRef.current[2] = el;
              }}
              onClick={() => handleSelectNavTarget('writing')}
              className="halora-nav-link"
            >
              Tập viết
            </button>
            <button
              type="button"
              ref={(el) => {
                headerItemsRef.current[3] = el;
              }}
              onClick={() => handleSelectNavTarget('quiz')}
              className="halora-nav-link"
            >
              Trò chơi
            </button>
            <button
              type="button"
              ref={(el) => {
                headerItemsRef.current[4] = el;
              }}
              onClick={() => handleSelectNavTarget('class')}
              className="halora-nav-link"
            >
              Lớp học
            </button>
          </nav>

          {/* Right: Active Role Status + Prominent "Đăng nhập / Đổi vai trò" + "Giao diện" */}
          <div className="halora-header-actions">
            <button
              type="button"
              ref={(el) => {
                headerItemsRef.current[5] = el;
              }}
              onClick={() => setAuthModalOpen(true)}
              data-testid="header-auth-btn"
              className="halora-pill-cart"
              title="Bấm để mở Cổng Đăng Nhập & Chọn Vai Trò"
            >
              <UserCheck className="w-4 h-4 shrink-0" />
              <span>
                {userProfile.role === 'teacher'
                  ? `Giáo viên: ${userProfile.name}`
                  : `Học sinh: ${userProfile.name}`}
              </span>
              <span className="opacity-75">· Đổi vai trò</span>
            </button>

            <button
              type="button"
              ref={(el) => {
                headerItemsRef.current[6] = el;
              }}
              onClick={() => setShowThemeDrawer(true)}
              className="halora-pill-dark"
            >
              Giao diện
            </button>
          </div>

          {/* Mobile (<820px) Circular Hamburger Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-label={mobileMenuOpen ? 'Đóng menu' : 'Mở menu điều hướng'}
            aria-expanded={mobileMenuOpen}
            className="halora-hamburger-btn"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </header>

        {/* Mobile (<820px) Light Sage Green Menu Panel */}
        {mobileMenuOpen && (
          <div className="relative z-30 mt-3 rounded-2xl bg-[#DCE1C8]/95 backdrop-blur-md border border-[#1E3227]/20 p-4 flex flex-col gap-2.5 text-[#1E3227]">
            <div className="px-3 py-2 rounded-xl bg-[#1E3227]/10 text-xs font-semibold flex items-center justify-between">
              <span>
                {userProfile.role === 'teacher'
                  ? `Giáo viên: ${userProfile.name}`
                  : `Học sinh: ${userProfile.name}`}
              </span>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setAuthModalOpen(true);
                }}
                className="underline font-bold"
              >
                Đổi vai trò
              </button>
            </div>
            <button
              type="button"
              onClick={() => handleSelectNavTarget('vocab')}
              className="text-left py-2 px-3 rounded-lg text-sm font-medium hover:bg-[#1E3227]/10"
            >
              Từ vựng — Bài giảng tự động
            </button>
            <button
              type="button"
              onClick={() => handleSelectNavTarget('writing')}
              className="text-left py-2 px-3 rounded-lg text-sm font-medium hover:bg-[#1E3227]/10"
            >
              Tập viết — Bảng viết chữ Mễ (米字格)
            </button>
            <button
              type="button"
              onClick={() => handleSelectNavTarget('quiz')}
              className="text-left py-2 px-3 rounded-lg text-sm font-medium hover:bg-[#1E3227]/10"
            >
              Trò chơi — Tương tác học sinh
            </button>
            <button
              type="button"
              onClick={() => handleSelectNavTarget('class')}
              className="text-left py-2 px-3 rounded-lg text-sm font-medium hover:bg-[#1E3227]/10"
            >
              Lớp học — Quản lý &amp; Giao bài
            </button>
            <div className="pt-2 border-t border-[#1E3227]/15 flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setAuthModalOpen(true);
                }}
                className="flex-1 py-2.5 px-3 rounded-full bg-[#3E5646]/85 text-white text-xs font-medium text-center"
              >
                Đăng nhập / Đổi vai trò
              </button>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setShowThemeDrawer(true);
                }}
                className="flex-1 py-2.5 px-3 rounded-full bg-[#1E3227] text-white text-xs font-medium text-center"
              >
                Giao diện
              </button>
            </div>
          </div>
        )}

        {/* Main 3-Zone Hero Content: Left Copy (max-width 420px) | Center Dragon & Ring | Right 3 Glass Cards */}
        <div className="halora-hero-main">
          {/* Left Copy Column (Vertically Centered, max-width 420px) */}
          <div className="halora-copy-col">
            <div className="halora-kicker">
              <span ref={kickerDotRef} className="halora-kicker-dot" />
              <span ref={kickerLabelRef}>
                HANU × 阮文受 · NỀN TẢNG HÁN NGỮ THÔNG MINH
              </span>
            </div>

            <h1 className="halora-headline">
              <span className="halora-headline-mask">
                <span ref={headlineLine1Ref} className="halora-headline-line">
                  Hiểu ngôn ngữ.
                </span>
              </span>
              <span className="halora-headline-mask">
                <span ref={headlineLine2Ref} className="halora-headline-line">
                  Làm chủ Hán ngữ.
                </span>
              </span>
            </h1>

            <p ref={bodyCopyRef} className="halora-body-copy">
              Từ vựng, thứ tự nét viết, ngữ pháp, trò chơi tương tác và chấm bài tự động — chuẩn hóa thành bài giảng sinh động, tức thì.
            </p>

            <div ref={ctaGroupRef} className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                data-testid="hero-start-btn"
                onClick={() => handleStartFromHero(true)}
                className="halora-pill-dark"
              >
                Bắt đầu soạn bài
              </button>

              <button
                type="button"
                onClick={() => {
                  handleSelectNavTarget('writing');
                }}
                className="halora-pill-cart !text-[#1E3227] !bg-white/55 hover:!bg-white/75"
              >
                <Edit3 className="w-4 h-4" />
                <span>Tập viết chữ Hán</span>
              </button>
            </div>
          </div>

          {/* Middle Grid Spacer for Center Dragon Visual */}
          <div className="hidden md:block" aria-hidden="true" />

          {/* Right Column: Three Minimalist Frosted Glass Metric Cards (222x160s) */}
          <div className="halora-metrics-col">
            {/* Card 1: TỪ VỰNG | 82.120 | CHUẨN HSK 1–9 */}
            <button
              type="button"
              ref={(el) => {
                glassCardsRef.current[0] = el;
              }}
              onClick={() => handleSelectNavTarget('vocab')}
              className="halora-glass-card"
              aria-label="TỪ VỰNG 82.120 CHUẨN HSK 1–9 — Mở trình chiếu từ vựng"
            >
              <div className="halora-card-label">
                <span>TỪ VỰNG</span>
                <BookOpen className="w-4 h-4 stroke-[1.75] shrink-0" />
              </div>
              <div className="halora-card-value">82.120</div>
              <div className="halora-card-sub is-gold">CHUẨN HSK 1–9</div>
            </button>

            {/* Card 2: SOẠN BÀI | Tự động | GIÁO ÁN THÔNG MINH */}
            <button
              type="button"
              ref={(el) => {
                glassCardsRef.current[1] = el;
              }}
              onClick={() => handleSelectNavTarget('vocab')}
              className="halora-glass-card"
              aria-label="SOẠN BÀI Tự động GIÁO ÁN THÔNG MINH — Mở soạn bài tự động"
            >
              <div className="halora-card-label">
                <span>SOẠN BÀI</span>
                <Sparkles className="w-4 h-4 stroke-[1.75] shrink-0" />
              </div>
              <div className="halora-card-value">Tự động</div>
              <div className="halora-card-sub is-gold">GIÁO ÁN THÔNG MINH</div>
            </button>

            {/* Card 3: HỌC VIÊN | 800+ | ĐẠT CHUẨN ĐẦU RA */}
            <button
              type="button"
              ref={(el) => {
                glassCardsRef.current[2] = el;
              }}
              onClick={() => handleSelectNavTarget('class')}
              className="halora-glass-card"
              aria-label="HỌC VIÊN 800+ ĐẠT CHUẨN ĐẦU RA — Mở quản lý lớp học"
            >
              <div className="halora-card-label">
                <span>HỌC VIÊN</span>
                <Users className="w-4 h-4 stroke-[1.75] shrink-0" />
              </div>
              <div className="halora-card-value">800+</div>
              <div className="halora-card-sub">ĐẠT CHUẨN ĐẦU RA</div>
            </button>
          </div>
        </div>

        {/* Center Visual: Eastern Dragon, Jade Ring, Luminous Pearl, Auspicious Clouds & Red Seal Stamp ("阮文受") */}
        <HaloraCenterScene />
      </section>

      {/* =====================================================================
          SCREEN 2: HANU × 阮文受 — ROLE-SEPARATED LEARNING & TEACHING STUDIO (#studio)
          ===================================================================== */}
      <main
        ref={studioSectionRef}
        id="studio"
        className="relative z-20 max-w-[1360px] mx-auto px-4 sm:px-8 py-12 md:py-16 pb-28 md:pb-36"
      >
        {/* Top Role Switcher Bar ("Chế độ Giáo viên" | "Chế độ Học sinh") */}
        <div className="flex flex-col gap-4 mb-7">
          <div className="rounded-3xl bg-[rgba(255,255,255,0.65)] backdrop-blur-md border border-[rgba(30,50,39,0.15)] p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xs">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#9B8A3E]">
                <span>HANU × 阮文受</span>
                <span aria-hidden="true">·</span>
                <span className="px-2 py-0.5 rounded-full bg-[#1E3227]/10 text-[#1E3227] font-semibold text-[11px]">
                  {userProfile.role === 'teacher'
                    ? 'KHÔNG GIAN GIẢNG VIÊN (教师端)'
                    : 'KHÔNG GIAN HỌC VIÊN (学生端)'}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-[#1E3227] mt-1 truncate">
                {userProfile.role === 'teacher'
                  ? `Xin chào Giáo viên ${userProfile.name}`
                  : `Xin chào Học sinh ${userProfile.name}`}
              </h2>
              <p className="text-xs text-[#3F5447] mt-0.5">
                Lớp HSK 1–3 · Mã lớp: <strong className="text-[#1E3227] tabular-nums">{userProfile.classCode}</strong>
              </p>
            </div>

            {/* Quick Role Switcher + Open Auth Portal Button */}
            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <div
                className="inline-flex items-center p-1 rounded-2xl bg-[#E7ECD9] border border-[rgba(30,50,39,0.15)] shadow-inner"
                role="group"
                aria-label="Chuyển đổi nhanh vai trò"
              >
                <button
                  type="button"
                  data-testid="role-switch-teacher"
                  onClick={() => handleQuickSwitchRole('teacher')}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    userProfile.role === 'teacher'
                      ? 'bg-[#1E3227] text-[#FAFBF7] shadow-sm'
                      : 'text-[#3F5447] hover:text-[#1E3227] hover:bg-black/5'
                  }`}
                >
                  <GraduationCap className="w-4 h-4" />
                  Chế độ Giáo viên
                </button>
                <button
                  type="button"
                  data-testid="role-switch-student"
                  onClick={() => handleQuickSwitchRole('student')}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    userProfile.role === 'student'
                      ? 'bg-[#9B8A3E] text-white shadow-sm'
                      : 'text-[#3F5447] hover:text-[#1E3227] hover:bg-black/5'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  Chế độ Học sinh
                </button>
              </div>

              <button
                type="button"
                onClick={() => setAuthModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-[#FAFBF7] hover:bg-white border border-[rgba(30,50,39,0.18)] text-[#1E3227] text-xs font-semibold transition-all shadow-2xs whitespace-nowrap"
              >
                <LogIn className="w-3.5 h-3.5 text-[#9B8A3E]" />
                <span>Đổi vai trò</span>
              </button>
            </div>
          </div>

          {/* 2-Tab Navigation Bar Specific to the Active Role */}
          {userProfile.role === 'teacher' ? (
            <div
              className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full"
              role="tablist"
              aria-label="Không gian Giáo viên (2 mục)"
            >
              <button
                type="button"
                role="tab"
                data-testid="teacher-tab-lesson"
                aria-selected={teacherTab === 'lesson-builder'}
                onClick={() => setTeacherTab('lesson-builder')}
                className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-2xl text-left transition-all border ${
                  teacherTab === 'lesson-builder'
                    ? 'bg-[#1E3227] border-[#1E3227] text-white shadow-sm'
                    : isDarkTheme
                    ? 'bg-white/10 border-white/20 text-[#E5E7EB] hover:bg-white/15'
                    : 'bg-white/70 border-[rgba(30,50,39,0.15)] text-[#1E3227] hover:bg-white hover:border-[#9B8A3E]'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    teacherTab === 'lesson-builder' ? 'bg-white/15 text-[#C5B358]' : 'bg-[#E7ECD9] text-[#1E3227]'
                  }`}>
                    <Presentation className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs sm:text-sm font-bold truncate">1. Soạn Bài Tự Động</div>
                    <div className={`text-[11px] truncate ${
                      teacherTab === 'lesson-builder' ? 'text-white/80' : 'text-[#3F5447]'
                    }`}>
                      Chữ Hán · Nét viết · Tranh minh họa
                    </div>
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase shrink-0 ${
                  teacherTab === 'lesson-builder' ? 'bg-white/20 text-white' : 'bg-[#1E3227]/10 text-[#1E3227]'
                }`}>
                  Soạn Slide
                </span>
              </button>

              <button
                type="button"
                role="tab"
                data-testid="teacher-tab-classroom"
                aria-selected={teacherTab === 'class-manager'}
                onClick={() => setTeacherTab('class-manager')}
                className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-2xl text-left transition-all border ${
                  teacherTab === 'class-manager'
                    ? 'bg-[#1E3227] border-[#1E3227] text-white shadow-sm'
                    : isDarkTheme
                    ? 'bg-white/10 border-white/20 text-[#E5E7EB] hover:bg-white/15'
                    : 'bg-white/70 border-[rgba(30,50,39,0.15)] text-[#1E3227] hover:bg-white hover:border-[#9B8A3E]'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    teacherTab === 'class-manager' ? 'bg-white/15 text-[#C5B358]' : 'bg-[#E7ECD9] text-[#1E3227]'
                  }`}>
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs sm:text-sm font-bold truncate">2. Quản Lý Lớp &amp; Giao Bài</div>
                    <div className={`text-[11px] truncate ${
                      teacherTab === 'class-manager' ? 'text-white/80' : 'text-[#3F5447]'
                    }`}>
                      Sĩ số {classroomStudentCount} học viên · Tự động chấm AI
                    </div>
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase shrink-0 ${
                  teacherTab === 'class-manager' ? 'bg-white/20 text-white' : 'bg-[#9B8A3E]/20 text-[#1E3227]'
                }`}>
                  19 Buổi học
                </span>
              </button>
            </div>
          ) : (
            <div
              className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full"
              role="tablist"
              aria-label="Không gian Học sinh (2 mục)"
            >
              <button
                type="button"
                role="tab"
                data-testid="student-tab-lesson"
                aria-selected={studentTab === 'today-lesson'}
                onClick={() => setStudentTab('today-lesson')}
                className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-2xl text-left transition-all border ${
                  studentTab === 'today-lesson'
                    ? 'bg-[#1E3227] border-[#1E3227] text-white shadow-sm'
                    : isDarkTheme
                    ? 'bg-white/10 border-white/20 text-[#E5E7EB] hover:bg-white/15'
                    : 'bg-white/70 border-[rgba(30,50,39,0.15)] text-[#1E3227] hover:bg-white hover:border-[#9B8A3E]'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    studentTab === 'today-lesson' ? 'bg-white/15 text-[#C5B358]' : 'bg-[#E7ECD9] text-[#1E3227]'
                  }`}>
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs sm:text-sm font-bold truncate">
                      📖 Bài Học &amp; Tập Viết Hôm Nay
                    </div>
                    <div className={`text-[11px] truncate ${
                      studentTab === 'today-lesson' ? 'text-white/80' : 'text-[#3F5447]'
                    }`}>
                      Nghe chuẩn zh-CN · Luyện viết chữ Mễ · Ví dụ ngữ cảnh
                    </div>
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase shrink-0 ${
                  studentTab === 'today-lesson' ? 'bg-white/20 text-white' : 'bg-[#1E3227]/10 text-[#1E3227]'
                }`}>
                  {slides.length} Từ
                </span>
              </button>

              <button
                type="button"
                role="tab"
                data-testid="student-tab-quiz"
                aria-selected={studentTab === 'quiz-leaderboard'}
                onClick={() => setStudentTab('quiz-leaderboard')}
                className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-2xl text-left transition-all border ${
                  studentTab === 'quiz-leaderboard'
                    ? 'bg-[#1E3227] border-[#1E3227] text-white shadow-sm'
                    : isDarkTheme
                    ? 'bg-white/10 border-white/20 text-[#E5E7EB] hover:bg-white/15'
                    : 'bg-white/70 border-[rgba(30,50,39,0.15)] text-[#1E3227] hover:bg-white hover:border-[#9B8A3E]'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    studentTab === 'quiz-leaderboard' ? 'bg-white/15 text-[#C5B358]' : 'bg-[#E7ECD9] text-[#1E3227]'
                  }`}>
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs sm:text-sm font-bold truncate">
                      ✍️ Bài Tập Được Giao &amp; AI Chấm Chữa
                    </div>
                    <div className={`text-[11px] truncate ${
                      studentTab === 'quiz-leaderboard' ? 'text-white/80' : 'text-[#3F5447]'
                    }`}>
                      Trắc nghiệm · Ghép câu · Tự luận chấm điểm AI
                    </div>
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase shrink-0 ${
                  studentTab === 'quiz-leaderboard' ? 'bg-[#9B8A3E] text-white' : 'bg-[#9B8A3E]/20 text-[#1E3227]'
                }`}>
                  Tự động chấm AI
                </span>
              </button>
            </div>
          )}
        </div>

        {/* Active Role Workspace Content */}
        {userProfile.role === 'teacher' ? (
          teacherTab === 'lesson-builder' ? (
            <SlideDeckStudio
              slides={slides}
              activeSlideIndex={activeSlideIndex}
              onSelectSlideIndex={setActiveSlideIndex}
              onOpenWritingModal={(slide) => setWritingModalSlide(slide)}
              onToggleLearned={handleToggleLearnedSlide}
              onAddSlides={handleAddSlides}
              onUpdateSlide={handleUpdateSlide}
              roleMode="teacher"
            />
          ) : (
            <ClassroomManager
              onStudentCountChange={setClassroomStudentCount}
              onSwitchToStudentView={() => {
                handleQuickSwitchRole('student');
                setStudentTab('quiz-leaderboard');
              }}
            />
          )
        ) : studentTab === 'today-lesson' ? (
          <SlideDeckStudio
            slides={slides}
            activeSlideIndex={activeSlideIndex}
            onSelectSlideIndex={setActiveSlideIndex}
            onOpenWritingModal={(slide) => setWritingModalSlide(slide)}
            onToggleLearned={handleToggleLearnedSlide}
            onAddSlides={handleAddSlides}
            onUpdateSlide={handleUpdateSlide}
            roleMode="student"
          />
        ) : (
          <StudentAssignmentArena
            slides={slides}
            studentName={userProfile.name}
            onSelectStudentName={(nextName) => {
              setSelectedStudentName(nextName);
              setUserProfile((prev) => ({ ...prev, name: nextName }));
            }}
            onSwitchToTeacherView={() => {
              handleQuickSwitchRole('teacher');
              setTeacherTab('class-manager');
            }}
          />
        )}
      </main>

      {/* Quiet Editorial Footer */}
      <footer
        className="max-w-[1360px] mx-auto px-4 sm:px-8 py-8 border-t flex flex-wrap items-center justify-between gap-4 text-xs"
        style={{
          color: selectedTheme.inkSecondary,
          borderColor: isDarkTheme
            ? 'rgba(255, 255, 255, 0.14)'
            : 'rgba(30, 50, 39, 0.15)',
        }}
      >
        <div>
          <strong style={{ color: selectedTheme.inkPrimary }}>
            HANU × 阮文受 (Nguyễn Văn Thụ)
          </strong>{' '}
          · Nền tảng Giảng dạy &amp; Học Hán Ngữ Thông Minh
        </div>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setAuthModalOpen(true)}
            className="hover:underline font-medium"
            style={{ color: selectedTheme.inkPrimary }}
          >
            Đổi vai trò Giáo viên / Học sinh
          </button>
          <span aria-hidden="true">·</span>
          <button
            type="button"
            onClick={() => setShowThemeDrawer(true)}
            className="hover:underline font-medium"
            style={{ color: selectedTheme.inkPrimary }}
          >
            Tùy chỉnh giao diện
          </button>
          <span aria-hidden="true">·</span>
          <a
            href="#top"
            className="hover:underline"
            style={{ color: selectedTheme.inkPrimary }}
          >
            Lên đầu trang
          </a>
        </div>
      </footer>

      {/* Floating Bottom-Right Widget: Gấu trúc Bin Bin AI (彬彬) · Hỗ trợ học tập */}
      <BinBinPandaAI
        variant="floating"
        activeSlide={slides[activeSlideIndex] || slides[0]}
      />

      {/* Login & Role Selection Portal Modal */}
      <AuthModal
        isOpen={authModalOpen}
        currentUser={userProfile}
        onSelectRoleAndLogin={(nextProfile) => {
          if (nextProfile.role === 'student' && nextProfile.name) {
            setSelectedStudentName(nextProfile.name);
          }
          setUserProfile(nextProfile);
          setHasOpenedPortalOnce(true);
          setAuthModalOpen(false);
          scrollToStudio();
        }}
        onClose={() => setAuthModalOpen(false)}
      />

      {/* Optional Full-Screen Hanzi Stroke Order Modal (when user clicks "Phóng to ô viết") */}
      {writingModalSlide && (
        <StrokeWritingModal
          slide={writingModalSlide}
          onClose={() => setWritingModalSlide(null)}
          onToggleLearned={handleToggleLearnedSlide}
        />
      )}

      {/* Theme Customizer Modal when clicking "Giao diện" */}
      {showThemeDrawer && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-4 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-label="Tùy chỉnh giao diện HANU × 阮文受"
        >
          <div className="relative w-full max-w-5xl my-auto">
            <div className="flex justify-end mb-2">
              <button
                type="button"
                onClick={() => setShowThemeDrawer(false)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#1E3227] text-white text-xs font-semibold border border-white/20"
              >
                <Palette className="w-3.5 h-3.5" />
                Đóng bảng Giao diện
              </button>
            </div>
            <TeacherThemeStudio
              selectedTheme={selectedTheme}
              onSelectTheme={setSelectedTheme}
            />
          </div>
        </div>
      )}
    </div>
  );
}
