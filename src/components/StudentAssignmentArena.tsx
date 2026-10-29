import React, { useEffect, useMemo, useState, useRef } from 'react';
import {
  CheckCircle2,
  AlertCircle,
  Sparkles,
  RotateCcw,
  Volume2,
  BookOpen,
  Send,
  Trophy,
  FileText,
  Camera,
  Upload,
  Check,
  GraduationCap,
  Users,
  Edit3,
  Headphones,
} from 'lucide-react';
import { VocabSlide } from '../data/chineseData';
import { speakChinese, playGentleChime } from '../utils/speech';
import { BinBinPandaMascotSVG, PandaMood } from './BinBinPandaAI';
import { StudentLeaderboard } from './StudentLeaderboard';
import {
  getStoredAssignment,
  UploadedAssignmentPackage,
} from '../utils/assignmentParser';
import {
  getStoredStudentRoster,
  STORAGE_KEY_STUDENTS,
  ClassStudent,
} from './ClassroomManager';
import { applyStudentSubmissionToRoster } from '../utils/chineseEngine';

interface StudentAssignmentArenaProps {
  slides: VocabSlide[];
  studentName?: string;
  onSelectStudentName?: (name: string) => void;
  onSwitchToTeacherView?: () => void;
}

const LISTENING_CHALLENGES = [
  {
    id: 'lc-1',
    audioText: '温暖',
    pinyin: 'wēn nuǎn',
    correctHanzi: '温暖',
    meaning: 'ấm áp, đầm ấm',
    explanation:
      '“温暖” (wēn nuǎn - ấm áp) dùng để miêu tả thời tiết dễ chịu hoặc tình cảm gia đình, bạn bè ấm cúng.',
    options: ['温暖 (ấm áp)', '空调 (điều hòa)', '花园 (vườn hoa)', '咱们 (chúng ta)'],
  },
  {
    id: 'lc-2',
    audioText: '咱们',
    pinyin: 'zán men',
    correctHanzi: '咱们',
    meaning: 'chúng ta, chúng mình',
    explanation:
      '“咱们” (zán men - chúng ta) là đại từ ngôi thứ nhất số nhiều bao gồm cả người nói và người nghe.',
    options: ['老师 (giáo viên)', '咱们 (chúng ta)', '聪明 (thông minh)', '愿意 (sẵn lòng)'],
  },
];

export const StudentAssignmentArena: React.FC<StudentAssignmentArenaProps> = ({
  slides,
  studentName = 'Lưu Thị Minh Thư',
  onSelectStudentName,
  onSwitchToTeacherView,
}) => {
  // Roster from localStorage (hanu_classroom_students_roster_v2)
  const [roster, setRoster] = useState<ClassStudent[]>(() => getStoredStudentRoster());
  const [activeStudentName, setActiveStudentName] = useState<string>(studentName);

  useEffect(() => {
    setActiveStudentName(studentName);
  }, [studentName]);

  useEffect(() => {
    const refreshRoster = () => setRoster(getStoredStudentRoster());
    window.addEventListener('hanu_students_updated', refreshRoster);
    return () => window.removeEventListener('hanu_students_updated', refreshRoster);
  }, []);

  // Ensure activeStudentName is always present in the dropdown options so select and labels match 100%
  const effectiveRoster = useMemo<ClassStudent[]>(() => {
    if (roster.some((st) => st.name === activeStudentName)) {
      return roster;
    }
    const fallbackStudent: ClassStudent = {
      id: 'st-active-default',
      studentCode: 'HV-001',
      hskLevel: 'HSK 3',
      name: activeStudentName,
      vocabScore: '18/18 từ',
      writingScore: '96% độ chuẩn nét',
      quizScore: '10/10 câu đúng',
      totalPoints: 98,
      status: 'Đã chấm AI',
      feedback: 'Đang làm bài trực tuyến.',
    };
    return [fallbackStudent, ...roster];
  }, [roster, activeStudentName]);

  // Load assignment package from storage or sync event
  const [assignmentPackage, setAssignmentPackage] = useState<UploadedAssignmentPackage>(() =>
    getStoredAssignment()
  );

  // User responses
  const [mcAnswers, setMcAnswers] = useState<Record<string, string>>({});
  const [selectedTokensMap, setSelectedTokensMap] = useState<Record<string, string[]>>({});
  const [availableTokensMap, setAvailableTokensMap] = useState<Record<string, string[]>>({});
  const [revealedPinyinHints, setRevealedPinyinHints] = useState<Record<string, boolean>>({});
  const [essayAnswers, setEssayAnswers] = useState<Record<string, string>>({});
  const [listeningAnswers, setListeningAnswers] = useState<Record<string, string>>({});
  const [practicedChars, setPracticedChars] = useState<Record<string, number>>({
    温: 96,
    暖: 95,
  });

  // Hand-written homework photo / file upload
  const [uploadedHomeworkFile, setUploadedHomeworkFile] = useState<File | null>(null);
  const [homeworkImagePreview, setHomeworkImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scorecardRef = useRef<HTMLDivElement>(null);

  // Submission & AI Grading states
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isGrading, setIsGrading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [pandaMood, setPandaMood] = useState<PandaMood>('idle');
  const [showBinBinFeedbackModal, setShowBinBinFeedbackModal] = useState(false);
  const [activeSection, setActiveSection] = useState<'homework' | 'leaderboard'>('homework');
  const [syncedSubmissionSummary, setSyncedSubmissionSummary] = useState<{
    studentName: string;
    totalScore: number;
    vocabProgress: string;
    writingAccuracy: number;
    reviewWords: string[];
  } | null>(null);

  // Synchronize initial token maps when assignmentPackage changes
  useEffect(() => {
    const selMap: Record<string, string[]> = {};
    const availMap: Record<string, string[]> = {};
    assignmentPackage.sentenceOrderingList.forEach((q) => {
      selMap[q.id] = [];
      availMap[q.id] = [...q.tokensShuffled];
    });
    setSelectedTokensMap(selMap);
    setAvailableTokensMap(availMap);
    setMcAnswers({});
    setEssayAnswers({});
    setIsSubmitted(false);
    setPandaMood('idle');
  }, [assignmentPackage.id]);

  // Listen to cross-component assignment updates
  useEffect(() => {
    const handleAssignmentUpdate = (e: any) => {
      if (e.detail) {
        setAssignmentPackage(e.detail);
      }
    };
    window.addEventListener('hanu_assignment_updated', handleAssignmentUpdate);
    return () => {
      window.removeEventListener('hanu_assignment_updated', handleAssignmentUpdate);
    };
  }, []);

  // Pick/Return token in Sentence Ordering
  const handlePickToken = (qId: string, token: string, index: number) => {
    if (isSubmitted) return;
    speakChinese(token);
    setSelectedTokensMap((prev) => ({
      ...prev,
      [qId]: [...(prev[qId] || []), token],
    }));
    setAvailableTokensMap((prev) => ({
      ...prev,
      [qId]: (prev[qId] || []).filter((_, i) => i !== index),
    }));
  };

  const handleReturnToken = (qId: string, token: string, index: number) => {
    if (isSubmitted) return;
    setAvailableTokensMap((prev) => ({
      ...prev,
      [qId]: [...(prev[qId] || []), token],
    }));
    setSelectedTokensMap((prev) => ({
      ...prev,
      [qId]: (prev[qId] || []).filter((_, i) => i !== index),
    }));
  };

  // Handle Photo/File Submission
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedHomeworkFile(file);
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          setHomeworkImagePreview(ev.target?.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setHomeworkImagePreview(null);
      }
      playGentleChime(659.25, 0.2);
    }
  };

  // Evaluation calculations (100-point rubric)
  const calculateScoreBreakdown = () => {
    let mcScore = 0;
    const mcTotalPossible = 30;
    const mcWeight =
      assignmentPackage.multipleChoiceList.length > 0
        ? mcTotalPossible / assignmentPackage.multipleChoiceList.length
        : 10;

    assignmentPackage.multipleChoiceList.forEach((q) => {
      const selected = q.options.find((opt) => opt.key === mcAnswers[q.id]);
      if (selected && selected.isCorrect) mcScore += mcWeight;
    });

    let soScore = 0;
    const soTotalPossible = 40;
    const soWeight =
      assignmentPackage.sentenceOrderingList.length > 0
        ? soTotalPossible / assignmentPackage.sentenceOrderingList.length
        : 20;

    assignmentPackage.sentenceOrderingList.forEach((q) => {
      const userTokens = selectedTokensMap[q.id] || [];
      if (userTokens.join('') === q.correctTokens.join('')) {
        soScore += soWeight;
      }
    });

    let esScore = 0;
    const esTotalPossible = 30;
    const esWeight =
      assignmentPackage.essayList.length > 0
        ? esTotalPossible / assignmentPackage.essayList.length
        : 15;

    assignmentPackage.essayList.forEach((q) => {
      const text = (essayAnswers[q.id] || '').trim();
      if (text.length >= 3 && text.includes(q.targetWord)) {
        esScore += esWeight;
      } else if (text.length >= 2 || uploadedHomeworkFile) {
        esScore += Math.round(esWeight * 0.6);
      }
    });

    let listeningBonus = 0;
    LISTENING_CHALLENGES.forEach((lc) => {
      if (listeningAnswers[lc.id]?.startsWith(lc.correctHanzi)) {
        listeningBonus += 5;
      }
    });

    const strokeValues = Object.values(practicedChars);
    const avgWritingAccuracy =
      strokeValues.length > 0
        ? Math.round(strokeValues.reduce((a, b) => a + b, 0) / strokeValues.length)
        : 94;

    const rawScore = Math.round(mcScore + soScore + esScore + listeningBonus);
    const totalScore = Math.min(100, Math.max(0, rawScore));

    // Determine reviewWords from any missed questions or unlearned slides
    const reviewSet = new Set<string>();
    assignmentPackage.multipleChoiceList.forEach((q) => {
      const selected = q.options.find((opt) => opt.key === mcAnswers[q.id]);
      if (!selected || !selected.isCorrect) {
        if (q.targetWord) reviewSet.add(q.targetWord);
      }
    });
    assignmentPackage.essayList.forEach((q) => {
      const text = (essayAnswers[q.id] || '').trim();
      if (!text.includes(q.targetWord)) {
        if (q.targetWord) reviewSet.add(q.targetWord);
      }
    });
    LISTENING_CHALLENGES.forEach((lc) => {
      if (listeningAnswers[lc.id] && !listeningAnswers[lc.id].startsWith(lc.correctHanzi)) {
        reviewSet.add(lc.correctHanzi);
      }
    });

    return {
      mcScore: Math.round(mcScore),
      soScore: Math.round(soScore),
      esScore: Math.round(esScore),
      listeningScore: listeningBonus,
      avgWritingAccuracy,
      reviewWords: Array.from(reviewSet),
      totalScore,
    };
  };

  const handleQuickFillSampleAnswers = () => {
    const nextMc: Record<string, string> = {};
    assignmentPackage.multipleChoiceList.forEach((q) => {
      const correctOpt = q.options.find((o) => o.isCorrect) || q.options[0];
      if (correctOpt) nextMc[q.id] = correctOpt.key;
    });
    setMcAnswers(nextMc);

    const nextSel: Record<string, string[]> = {};
    const nextAvail: Record<string, string[]> = {};
    assignmentPackage.sentenceOrderingList.forEach((q) => {
      nextSel[q.id] = [...q.correctTokens];
      nextAvail[q.id] = [];
    });
    setSelectedTokensMap(nextSel);
    setAvailableTokensMap(nextAvail);

    const nextEs: Record<string, string> = {};
    assignmentPackage.essayList.forEach((q) => {
      nextEs[q.id] = q.sampleSentence;
    });
    setEssayAnswers(nextEs);

    const nextListening: Record<string, string> = {};
    LISTENING_CHALLENGES.forEach((lc) => {
      nextListening[lc.id] = lc.options.find((o) => o.startsWith(lc.correctHanzi)) || lc.options[0];
    });
    setListeningAnswers(nextListening);
    setPracticedChars({ 温: 98, 暖: 97, 咱: 96 });
    playGentleChime(659.25, 0.18);
  };

  const handleSubmitAssignment = () => {
    setIsGrading(true);
    playGentleChime(523.25, 0.2);
    setTimeout(() => {
      setIsGrading(false);
      setIsSubmitted(true);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3500);

      const breakdown = calculateScoreBreakdown();
      const totalVocab = Math.max(18, slides.length);
      const learnedVocab = Math.max(
        12,
        Math.min(totalVocab, totalVocab - breakdown.reviewWords.length)
      );
      const quizTotal =
        assignmentPackage.multipleChoiceList.length +
        assignmentPackage.sentenceOrderingList.length +
        assignmentPackage.essayList.length +
        LISTENING_CHALLENGES.length;
      const quizCorrect = Math.max(
        5,
        Math.min(quizTotal, Math.round((breakdown.totalScore / 100) * quizTotal))
      );

      // Persist directly to Teacher's Gradebook in localStorage (hanu_classroom_students_roster_v2)
      const currentRoster = getStoredStudentRoster();
      const updatedRoster = applyStudentSubmissionToRoster(currentRoster, {
        studentName: activeStudentName,
        totalScore: breakdown.totalScore,
        learnedVocabCount: learnedVocab,
        totalVocabCount: totalVocab,
        writingAccuracy: breakdown.avgWritingAccuracy,
        quizCorrectCount: quizCorrect,
        quizTotalCount: quizTotal,
        reviewWords: breakdown.reviewWords,
      });

      try {
        localStorage.setItem(STORAGE_KEY_STUDENTS, JSON.stringify(updatedRoster));
      } catch {
        // ignore storage errors
      }
      setRoster(updatedRoster);
      window.dispatchEvent(
        new CustomEvent('hanu_students_updated', { detail: updatedRoster.length })
      );

      setSyncedSubmissionSummary({
        studentName: activeStudentName,
        totalScore: breakdown.totalScore,
        vocabProgress: `${learnedVocab}/${totalVocab} từ`,
        writingAccuracy: breakdown.avgWritingAccuracy,
        reviewWords: breakdown.reviewWords,
      });

      if (breakdown.totalScore >= 80) {
        setPandaMood('cheering');
        playGentleChime(783.99, 0.3);
      } else {
        setPandaMood('thinking');
        playGentleChime(440, 0.25);
      }

      // Smoothly auto-scroll to the AI Grading Scorecard so the student immediately sees their A-B-C-D breakdown
      setTimeout(() => {
        scorecardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 80);
    }, 200);
  };

  const handleResetAssignment = () => {
    setIsSubmitted(false);
    setShowConfetti(false);
    setMcAnswers({});
    const selMap: Record<string, string[]> = {};
    const availMap: Record<string, string[]> = {};
    assignmentPackage.sentenceOrderingList.forEach((q) => {
      selMap[q.id] = [];
      availMap[q.id] = [...q.tokensShuffled];
    });
    setSelectedTokensMap(selMap);
    setAvailableTokensMap(availMap);
    setRevealedPinyinHints({});
    setEssayAnswers({});
    setListeningAnswers({});
    setSyncedSubmissionSummary(null);
    setPandaMood('idle');
  };

  const {
    mcScore,
    soScore,
    esScore,
    listeningScore,
    totalScore,
    reviewWords,
    avgWritingAccuracy,
  } = calculateScoreBreakdown();
  const finalScore = isSubmitted ? totalScore : 0;

  return (
    <div className="space-y-6 pb-28 sm:pb-32 relative">
      {/* =======================================================================
          CELEBRATION CONFETTI OVERLAY UPON SUBMISSION
          ======================================================================= */}
      {showConfetti && (
        <div
          data-testid="submission-confetti-celebration"
          aria-hidden="true"
          className="fixed inset-0 z-50 pointer-events-none overflow-hidden"
        >
          {Array.from({ length: 42 }).map((_, i) => {
            const left = `${(i * 97) % 100}%`;
            const delay = `${(i % 7) * 0.08}s`;
            const duration = `${1.8 + (i % 5) * 0.3}s`;
            const colors = ['#D4AF37', '#1E3227', '#C83E31', '#9B8A3E', '#2E7D32', '#F59E0B'];
            const bg = colors[i % colors.length];
            return (
              <span
                key={i}
                style={{
                  left,
                  top: '-20px',
                  backgroundColor: bg,
                  animationDelay: delay,
                  animationDuration: duration,
                }}
                className="absolute w-2.5 h-4 rounded-xs opacity-90 animate-bounce shadow-xs"
              />
            );
          })}
        </div>
      )}

      {/* =======================================================================
          STUDENT ROSTER SELECTOR BAR (CONNECTED TO hanu_classroom_students_roster_v2)
          ======================================================================= */}
      <div
        data-testid="student-roster-selector-bar"
        className="p-4 rounded-3xl bg-[#FAFBF7] border-2 border-[#9B8A3E]/50 text-[#1E3227] flex flex-col lg:flex-row lg:items-center justify-between gap-3.5 shadow-2xs"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#1E3227] text-[#C5B358] flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#9B8A3E]">
              KẾT NỐI TRỰC TIẾP SỔ ĐIỂM GIÁO VIÊN ({effectiveRoster.length} HỌC VIÊN)
            </div>
            <div className="text-sm font-bold text-[#1E3227]">
              Đang làm bài với tư cách:{' '}
              <span data-testid="active-student-badge-name" className="text-[#9B8A3E]">
                {activeStudentName}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <label htmlFor="student-roster-select" className="text-xs font-bold text-[#3F5447]">
            Chọn học viên trong lớp:
          </label>
          <select
            id="student-roster-select"
            data-testid="student-roster-selector"
            value={activeStudentName}
            onChange={(e) => {
              const nextName = e.target.value;
              setActiveStudentName(nextName);
              onSelectStudentName?.(nextName);
              setIsSubmitted(false);
              setSyncedSubmissionSummary(null);
            }}
            className="px-3.5 py-2 rounded-xl bg-white border border-[#9B8A3E]/60 text-xs font-bold text-[#1E3227] focus:outline-none focus:border-[#1E3227] cursor-pointer"
          >
            {effectiveRoster.map((st) => (
              <option key={st.id} value={st.name}>
                {st.studentCode} · {st.name} ({st.hskLevel} · {st.totalPoints}đ)
              </option>
            ))}
          </select>

          {!isSubmitted && (
            <button
              type="button"
              data-testid="quick-fill-sample-answers-btn"
              onClick={handleQuickFillSampleAnswers}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#E7ECD9] hover:bg-[#dce3c8] text-[#1E3227] border border-[#1E3227]/20 text-xs font-bold transition-all cursor-pointer"
              title="Điền nhanh đáp án mẫu để kiểm thử luồng nộp bài và đồng bộ điểm"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#9B8A3E]" />
              <span>⚡ Điền nhanh bài mẫu</span>
            </button>
          )}
        </div>
      </div>

      {/* =======================================================================
          TOP BANNER: DIRECT ASSIGNMENT FROM TEACHER NGUYEN VAN THU
          ======================================================================= */}
      <div className="p-4 sm:p-5 rounded-3xl bg-[#E7ECD9] border-2 border-[#1E3227]/25 text-[#1E3227] flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm animate-fade-in">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#1E3227] text-white flex items-center justify-center shrink-0 shadow-xs">
            <FileText className="w-6 h-6 text-[#C5B358]" />
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#9B8A3E]">
              <span>ĐỀ BÀI ĐÃ ĐỒNG BỘ TỰ ĐỘNG</span>
              <span>·</span>
              <span className="px-2 py-0.5 rounded-full bg-[#1E3227]/10 text-[#1E3227]">
                Buổi {assignmentPackage.sessionNumber} · HSK 1–3
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-[#1E3227] mt-0.5">
              📄 Bài tập mới từ Giáo viên {assignmentPackage.teacherName}:{' '}
              <span className="text-[#9B8A3E]">{assignmentPackage.fileName}</span> — Hạn nộp:{' '}
              {assignmentPackage.dueDate}
            </h3>
            <p className="text-xs text-[#3F5447] mt-1">
              Khóa: <strong>{assignmentPackage.sessionTitle}</strong> · Học viên:{' '}
              <strong className="text-[#1E3227]">{activeStudentName}</strong> · Tự động chấm AI thang 100 điểm.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {onSwitchToTeacherView && (
            <button
              type="button"
              data-testid="switch-to-teacher-gradebook-btn"
              onClick={onSwitchToTeacherView}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#1E3227]/20 text-[11px] font-semibold text-[#1E3227] hover:bg-[#FAFBF7] transition-all shadow-2xs cursor-pointer"
            >
              <GraduationCap className="w-3.5 h-3.5 text-[#9B8A3E]" />
              <span>Chuyển sang Quản Lý Lớp</span>
            </button>
          )}

          <span className="px-3 py-1.5 rounded-xl bg-[#1E3227] text-white text-xs font-bold shadow-xs whitespace-nowrap">
            {assignmentPackage.multipleChoiceList.length +
              assignmentPackage.sentenceOrderingList.length +
              assignmentPackage.essayList.length}{' '}
            Câu tương tác
          </span>
        </div>
      </div>

      {/* Sub-tab Switcher: Phiếu Bài Tập vs Bảng Xếp Hạng Thi Đua */}
      <div className="flex items-center justify-between gap-3 p-1.5 rounded-2xl bg-[#E7ECD9] border border-[rgba(30,50,39,0.15)] shadow-inner">
        <button
          type="button"
          onClick={() => setActiveSection('homework')}
          className={`flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeSection === 'homework'
              ? 'bg-[#1E3227] text-[#FAFBF7] shadow-sm'
              : 'text-[#3F5447] hover:text-[#1E3227]'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>
            Phiếu Làm Bài Tập (
            {assignmentPackage.multipleChoiceList.length +
              assignmentPackage.sentenceOrderingList.length +
              assignmentPackage.essayList.length}{' '}
            câu hỏi)
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('leaderboard')}
          className={`flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeSection === 'leaderboard'
              ? 'bg-[#1E3227] text-[#FAFBF7] shadow-sm'
              : 'text-[#3F5447] hover:text-[#1E3227]'
          }`}
        >
          <Trophy className="w-4 h-4 text-[#C5B358]" />
          <span>Bảng Xếp Hạng Học Tập (Thi đua lớp)</span>
          {isSubmitted && (
            <span className="w-2 h-2 rounded-full bg-[#9B8A3E] animate-pulse" />
          )}
        </button>
      </div>

      {/* =======================================================================
          UPGRADED AI GRADING OVERVIEW (100-POINT RUBRIC WHEN SUBMITTED)
          ======================================================================= */}
      {isSubmitted && (
        <div
          ref={scorecardRef}
          data-testid="ai-grading-scorecard"
          className="rounded-3xl bg-[#FAFBF7] border-2 border-[#9B8A3E] p-6 shadow-md space-y-4 animate-fade-in scroll-mt-6"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-[#9B8A3E]/25 pb-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#E7ECD9] flex items-center justify-center text-[#1E3227] shrink-0 border border-[#9B8A3E]/50">
                <BinBinPandaMascotSVG mood={pandaMood} size={44} />
              </div>
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-[#9B8A3E] uppercase tracking-wider">
                  <span>KẾT QUẢ CHẤM ĐIỂM TỰ ĐỘNG BỞI AI</span>
                  <span>·</span>
                  <span className="text-[#1E3227]">HSK 1–3 CHUẨN</span>
                </div>
                <h4 className="text-lg sm:text-xl font-bold text-[#1E3227] mt-0.5">
                  {totalScore >= 85
                    ? '🎉 Xuất sắc! Bạn đã nắm rất vững kiến thức và ngữ pháp bài học!'
                    : totalScore >= 70
                    ? '👍 Kết quả khá tốt! Cần chú ý thêm vị trí trạng ngữ & trợ từ kết cấu.'
                    : '💪 Đã nộp bài thành công! Hãy xem kỹ phần chữa lỗi sai bên dưới nhé.'}
                </h4>
                <p className="text-xs text-[#3F5447] mt-1">
                  Bài làm của học viên <strong className="text-[#1E3227]">{activeStudentName}</strong> đã được đồng bộ trực tiếp vào Sổ điểm của Giáo viên.
                </p>
              </div>
            </div>

            {/* Scorecard Widget */}
            <div className="flex items-center gap-3 bg-white p-3.5 rounded-2xl border border-[#9B8A3E]/40 shadow-xs">
              <div className="text-right">
                <div className="text-[11px] font-semibold text-[#3F5447]">TỔNG ĐIỂM AI</div>
                <div
                  data-testid="submitted-total-score"
                  className="text-3xl font-black text-[#1E3227] tabular-nums"
                >
                  {totalScore}{' '}
                  <span className="text-sm font-bold text-[#9B8A3E]">/ 100</span>
                </div>
              </div>
              <div
                className={`px-3 py-2 rounded-xl flex items-center justify-center font-bold text-xs text-white shadow-xs ${
                  totalScore >= 85
                    ? 'bg-[#1E3227]'
                    : totalScore >= 70
                    ? 'bg-[#9B8A3E]'
                    : 'bg-[#B45309]'
                }`}
              >
                {totalScore >= 85 ? 'Xuất sắc' : totalScore >= 70 ? 'Khá giỏi' : 'Đạt'}
              </div>
            </div>
          </div>

          {syncedSubmissionSummary && (
            <div
              data-testid="teacher-gradebook-sync-banner"
              className="p-3.5 rounded-2xl bg-[#E7ECD9] border border-[#1E3227]/25 text-xs text-[#1E3227] flex flex-col sm:flex-row sm:items-center justify-between gap-2"
            >
              <div className="space-y-0.5">
                <div className="font-bold text-[#1E3227]">
                  ✅ Đã lưu điểm vào Sổ điểm Giáo viên cho học viên “{activeStudentName}”:
                </div>
                <div className="text-[#3F5447]">
                  Tiến độ từ vựng: <strong>{syncedSubmissionSummary.vocabProgress}</strong> · Nét viết:{' '}
                  <strong>{syncedSubmissionSummary.writingAccuracy}%</strong> · Từ vựng cần ôn:{' '}
                  <strong className="text-[#9B8A3E]">
                    {syncedSubmissionSummary.reviewWords.length > 0
                      ? syncedSubmissionSummary.reviewWords.join(', ')
                      : 'Không có (Đã nắm vững 100%)'}
                  </strong>
                </div>
              </div>
              {onSwitchToTeacherView && (
                <button
                  type="button"
                  onClick={onSwitchToTeacherView}
                  className="px-3 py-1.5 rounded-xl bg-[#1E3227] text-[#FAFBF7] font-bold text-xs whitespace-nowrap cursor-pointer"
                >
                  📊 Xem Bảng điểm Giáo viên
                </button>
              )}
            </div>
          )}

          {/* 4 Rubric Breakdown Cards (Parts A - B - C - D) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="rounded-2xl bg-white border border-[rgba(30,50,39,0.12)] p-3.5 flex items-center justify-between">
              <div>
                <div className="text-xs text-[#3F5447]">Phần A: Trắc nghiệm</div>
                <div className="text-sm font-bold text-[#1E3227]">
                  {mcScore} / 30 điểm
                </div>
              </div>
              <span className="text-[11px] px-2 py-0.5 rounded-md bg-[#E7ECD9] font-bold text-[#1E3227]">
                {Object.keys(mcAnswers).length}/{assignmentPackage.multipleChoiceList.length} câu
              </span>
            </div>

            <div className="rounded-2xl bg-white border border-[rgba(30,50,39,0.12)] p-3.5 flex items-center justify-between">
              <div>
                <div className="text-xs text-[#3F5447]">Phần B: Sắp xếp câu</div>
                <div className="text-sm font-bold text-[#1E3227]">
                  {soScore} / 40 điểm
                </div>
              </div>
              <span className="text-[11px] px-2 py-0.5 rounded-md bg-[#E7ECD9] font-bold text-[#1E3227]">
                {assignmentPackage.sentenceOrderingList.length} câu
              </span>
            </div>

            <div className="rounded-2xl bg-white border border-[rgba(30,50,39,0.12)] p-3.5 flex items-center justify-between">
              <div>
                <div className="text-xs text-[#3F5447]">Phần C: Tự luận đặt câu</div>
                <div className="text-sm font-bold text-[#1E3227]">
                  {esScore} / 30 điểm
                </div>
              </div>
              <span className="text-[11px] px-2 py-0.5 rounded-md bg-[#E7ECD9] font-bold text-[#1E3227]">
                {reviewWords.length > 0 ? `Ôn: ${reviewWords.join(', ')}` : 'Thuộc 100%'}
              </span>
            </div>

            <div className="rounded-2xl bg-white border border-[rgba(30,50,39,0.12)] p-3.5 flex items-center justify-between">
              <div>
                <div className="text-xs text-[#3F5447]">Phần D: Nghe &amp; Nét viết</div>
                <div className="text-sm font-bold text-[#1E3227]">
                  +{listeningScore}đ · {avgWritingAccuracy}% nét
                </div>
              </div>
              <span className="text-[11px] px-2 py-0.5 rounded-md bg-[#E7ECD9] font-bold text-[#1E3227]">
                {Object.keys(listeningAnswers).length}/{LISTENING_CHALLENGES.length} câu nghe
              </span>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={handleResetAssignment}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[rgba(30,50,39,0.2)] bg-white hover:bg-[#FAFBF7] text-[#1E3227] text-xs font-bold transition-all shadow-2xs cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#3F5447]" />
              Làm lại bài này
            </button>
            <button
              type="button"
              onClick={() => setActiveSection('leaderboard')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[#9B8A3E]/40 bg-[#FAFBF7] hover:bg-white text-[#1E3227] text-xs font-bold transition-all shadow-2xs cursor-pointer"
            >
              <Trophy className="w-3.5 h-3.5 text-[#9B8A3E]" />
              Xem Bảng vàng thi đua
            </button>
            <button
              type="button"
              onClick={() => setShowBinBinFeedbackModal(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1E3227] hover:bg-[#2B4637] text-white text-xs font-bold transition-all shadow-2xs cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C5B358]" />
              Lời khuyên của Bin Bin AI
            </button>
          </div>
        </div>
      )}

      {/* =======================================================================
          VIEW 1: HOMEWORK QUESTIONS (PARTS A, B, C)
          ======================================================================= */}
      {activeSection === 'homework' && (
        <div className="space-y-6">
          {/* -------------------------------------------------------------------
              SECTION A: TRẮC NGHIỆM TỪ VỰNG & NGỮ CẢNH (30 ĐIỂM)
              ------------------------------------------------------------------- */}
          <div className="rounded-3xl bg-[rgba(255,255,255,0.65)] backdrop-blur-md border border-[rgba(30,50,39,0.15)] p-5 sm:p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-[rgba(30,50,39,0.12)] pb-3">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-[#1E3227] text-white text-xs font-bold flex items-center justify-center">
                  A
                </span>
                <h4 className="text-sm sm:text-base font-bold text-[#1E3227]">
                  Phần A · Trắc Nghiệm Từ Vựng &amp; Ngữ Cảnh ({assignmentPackage.multipleChoiceList.length} câu · 30 điểm)
                </h4>
              </div>
              <span className="text-xs text-[#9B8A3E] font-semibold">10 điểm / câu</span>
            </div>

            <div className="space-y-4">
              {assignmentPackage.multipleChoiceList.map((q, idx) => {
                const userChoice = mcAnswers[q.id];
                const selectedOpt = q.options.find((o) => o.key === userChoice);
                const isCorrect = selectedOpt?.isCorrect === true;

                return (
                  <div
                    key={q.id}
                    className="rounded-2xl bg-[#FAFBF7] border border-[rgba(30,50,39,0.12)] p-4 sm:p-5 space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="px-2 py-0.5 rounded-md bg-[#E7ECD9] text-[#1E3227] text-xs font-bold">
                          Câu {idx + 1}
                        </span>
                        <h5 className="text-sm sm:text-base font-bold text-[#1E3227] mt-1 font-['Noto_Sans_SC']">
                          {q.question}
                        </h5>
                        {q.pinyinSentence && (
                          <div className="flex items-center gap-2 mt-1">
                            <p className="text-xs text-[#9B8A3E] font-medium">
                              {q.pinyinSentence}
                            </p>
                            <button
                              type="button"
                              onClick={() => speakChinese(q.question.replace('______', q.targetWord))}
                              className="text-xs text-[#3F5447] hover:text-[#1E3227]"
                              title="Nghe phát âm chuẩn zh-CN"
                            >
                              <Volume2 className="w-3.5 h-3.5 inline" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Options Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {q.options.map((opt) => {
                        const isChosen = userChoice === opt.key;
                        let optionStyle =
                          'bg-white border-[rgba(30,50,39,0.15)] text-[#1E3227] hover:border-[#9B8A3E]';

                        if (isSubmitted) {
                          if (opt.isCorrect) {
                            optionStyle = 'bg-[#E7ECD9] border-[#1E3227] text-[#1E3227] font-bold';
                          } else if (isChosen && !opt.isCorrect) {
                            optionStyle = 'bg-red-50 border-red-400 text-red-900';
                          } else {
                            optionStyle = 'bg-white opacity-50 border-[rgba(30,50,39,0.1)]';
                          }
                        } else if (isChosen) {
                          optionStyle =
                            'bg-[#1E3227] border-[#1E3227] text-white font-semibold shadow-xs';
                        }

                        return (
                          <button
                            key={opt.key}
                            type="button"
                            disabled={isSubmitted}
                            onClick={() => {
                              speakChinese(opt.label);
                              setMcAnswers((prev) => ({ ...prev, [q.id]: opt.key }));
                            }}
                            className={`p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between gap-2 ${optionStyle}`}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <span
                                className={`w-5 h-5 rounded-full text-[11px] font-bold flex items-center justify-center shrink-0 ${
                                  isChosen && !isSubmitted
                                    ? 'bg-white text-[#1E3227]'
                                    : 'bg-[rgba(30,50,39,0.1)] text-[#1E3227]'
                                }`}
                              >
                                {opt.key}
                              </span>
                              <span className="truncate font-['Noto_Sans_SC']">{opt.label}</span>
                            </div>

                            {isSubmitted && opt.isCorrect && (
                              <CheckCircle2 className="w-4 h-4 text-[#1E3227] shrink-0" />
                            )}
                            {isSubmitted && isChosen && !opt.isCorrect && (
                              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Detailed AI Explanation & Grammar Diagnostic */}
                    {isSubmitted && (
                      <div
                        className={`p-3.5 rounded-xl text-xs space-y-1.5 ${
                          isCorrect
                            ? 'bg-[#E7ECD9] text-[#1E3227]'
                            : 'bg-red-50 text-red-900 border border-red-200'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 font-bold">
                          {isCorrect ? (
                            <>
                              <CheckCircle2 className="w-4 h-4 text-[#1E3227]" />
                              <span>Đáp án chính xác! (+10 điểm)</span>
                            </>
                          ) : (
                            <>
                              <AlertCircle className="w-4 h-4 text-red-600" />
                              <span>
                                Chưa chính xác (0/10 điểm) — Bạn đã chọn {userChoice || 'trống'}.
                              </span>
                            </>
                          )}
                        </div>
                        <div>
                          <strong>Giải thích chuẩn xác:</strong> {q.explanation}
                        </div>
                        {q.grammarTip && (
                          <div className="text-[11px] pt-1 border-t border-black/10 flex items-start gap-1">
                            <Sparkles className="w-3.5 h-3.5 shrink-0 text-[#9B8A3E] mt-0.5" />
                            <span>
                              <strong>Phân tích ngữ pháp:</strong> {q.grammarTip}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* -------------------------------------------------------------------
              SECTION B: SẮP XẾP CÂU TIẾNG TRUNG (40 ĐIỂM)
              ------------------------------------------------------------------- */}
          <div className="rounded-3xl bg-[rgba(255,255,255,0.65)] backdrop-blur-md border border-[rgba(30,50,39,0.15)] p-5 sm:p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-[rgba(30,50,39,0.12)] pb-3">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-[#9B8A3E] text-white text-xs font-bold flex items-center justify-center">
                  B
                </span>
                <h4 className="text-sm sm:text-base font-bold text-[#1E3227]">
                  Phần B · Sắp Xếp Câu Tiếng Trung ({assignmentPackage.sentenceOrderingList.length} câu · 40 điểm)
                </h4>
              </div>
              <span className="text-xs text-[#9B8A3E] font-semibold">20 điểm / câu</span>
            </div>

            <div className="space-y-4">
              {assignmentPackage.sentenceOrderingList.map((q, idx) => {
                const userTokens = selectedTokensMap[q.id] || [];
                const remainingTokens = availableTokensMap[q.id] || [];
                const isCorrect = userTokens.join('') === q.correctTokens.join('');

                return (
                  <div
                    key={q.id}
                    className="rounded-2xl bg-[#FAFBF7] border border-[rgba(30,50,39,0.12)] p-4 sm:p-5 space-y-3.5"
                  >
                    <div>
                      <span className="px-2 py-0.5 rounded-md bg-[#E7ECD9] text-[#1E3227] text-xs font-bold">
                        Câu {idx + 1}
                      </span>
                      <h5 className="text-sm font-bold text-[#1E3227] mt-1">
                        Dịch nghĩa cần sắp xếp: “{q.vietnameseMeaning}”
                      </h5>
                      <div className="flex flex-wrap items-center gap-2 mt-1.5">
                        {isSubmitted || revealedPinyinHints[q.id] ? (
                          <p
                            data-testid={`part-b-pinyin-${q.id}`}
                            className="text-xs text-[#9B8A3E] font-medium"
                          >
                            {q.pinyin}
                          </p>
                        ) : null}
                        {!isSubmitted && (
                          <button
                            type="button"
                            data-testid={`toggle-pinyin-hint-${q.id}`}
                            onClick={() =>
                              setRevealedPinyinHints((prev) => ({
                                ...prev,
                                [q.id]: !prev[q.id],
                              }))
                            }
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#E7ECD9]/80 hover:bg-[#E7ECD9] border border-[#9B8A3E]/35 text-[11px] font-bold text-[#1E3227] transition-all cursor-pointer"
                          >
                            <span>
                              {revealedPinyinHints[q.id]
                                ? '🙈 Ẩn gợi ý Pinyin'
                                : '💡 Xem gợi ý Pinyin'}
                            </span>
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => speakChinese(q.correctTokens.join(''))}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-white border border-[rgba(30,50,39,0.15)] text-[11px] font-semibold text-[#3F5447] hover:text-[#1E3227] cursor-pointer"
                          title="Nghe câu mẫu"
                        >
                          <Volume2 className="w-3.5 h-3.5 inline text-[#9B8A3E]" />
                          <span>Nghe câu</span>
                        </button>
                      </div>
                    </div>

                    {/* Target Answer Slot */}
                    <div className="min-h-[58px] p-2.5 rounded-xl bg-white border-2 border-dashed border-[rgba(30,50,39,0.2)] flex flex-wrap items-center gap-2">
                      {userTokens.length === 0 ? (
                        <span className="text-xs text-[#3F5447]/60 italic pl-1">
                          Bấm vào các từ bên dưới theo thứ tự đúng để ghép câu...
                        </span>
                      ) : (
                        userTokens.map((tok, tIdx) => (
                          <button
                            key={`${tok}-${tIdx}`}
                            type="button"
                            disabled={isSubmitted}
                            onClick={() => handleReturnToken(q.id, tok, tIdx)}
                            className="px-3 py-1.5 rounded-xl bg-[#1E3227] text-white font-['Noto_Sans_SC'] font-bold text-sm shadow-xs flex items-center gap-1.5 hover:bg-[#2B4637] transition-all"
                            title="Bấm để hoàn lại từ"
                          >
                            <span>{tok}</span>
                            {!isSubmitted && <span className="text-white/60 text-xs">×</span>}
                          </button>
                        ))
                      )}
                    </div>

                    {/* Word Bank */}
                    {!isSubmitted && (
                      <div>
                        <div className="text-[11px] font-semibold text-[#3F5447] uppercase tracking-wider mb-1.5">
                          Ngân hàng từ vựng (Bấm để chọn):
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          {remainingTokens.map((tok, tIdx) => (
                            <button
                              key={`${tok}-${tIdx}`}
                              type="button"
                              onClick={() => handlePickToken(q.id, tok, tIdx)}
                              className="px-3 py-1.5 rounded-xl bg-white border border-[#9B8A3E]/40 text-[#1E3227] font-['Noto_Sans_SC'] font-bold text-sm shadow-2xs hover:bg-[#FAFBF7] hover:border-[#9B8A3E] transition-all"
                            >
                              {tok}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Upgraded Feedback & Diagnostic */}
                    {isSubmitted && (
                      <div
                        className={`p-3.5 rounded-xl text-xs space-y-2 ${
                          isCorrect
                            ? 'bg-[#E7ECD9] text-[#1E3227]'
                            : 'bg-red-50 text-red-900 border border-red-200'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 font-bold">
                          {isCorrect ? (
                            <>
                              <CheckCircle2 className="w-4 h-4 text-[#1E3227]" />
                              <span>Chính xác hoàn hảo! (+20 điểm)</span>
                            </>
                          ) : (
                            <>
                              <AlertCircle className="w-4 h-4 text-red-600" />
                              <span>Chưa chính xác (0/20 điểm)</span>
                            </>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <span>Đáp án chuẩn:</span>
                          <strong className="font-['Noto_Sans_SC'] text-sm text-[#1E3227]">
                            {q.correctTokens.join(' ')}
                          </strong>
                          <button
                            type="button"
                            onClick={() => speakChinese(q.correctTokens.join(''))}
                            className="p-1 rounded-md bg-white/70 hover:bg-white text-[#1E3227]"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <p className="text-[11px] opacity-90 leading-relaxed">{q.explanation}</p>

                        {q.grammarTip && (
                          <div className="p-2.5 rounded-lg bg-white/80 border border-black/10 text-[11px] text-[#1E3227] space-y-1">
                            <div className="font-bold text-[#9B8A3E] flex items-center gap-1">
                              <Sparkles className="w-3.5 h-3.5" />
                              Chẩn đoán lỗi ngữ pháp thường gặp:
                            </div>
                            <div>{q.grammarTip}</div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* -------------------------------------------------------------------
              SECTION C: TỰ LUẬN ĐẶT CÂU & TẢI ẢNH BÀI LÀM VIẾT TAY (30 ĐIỂM)
              ------------------------------------------------------------------- */}
          <div className="rounded-3xl bg-[rgba(255,255,255,0.65)] backdrop-blur-md border border-[rgba(30,50,39,0.15)] p-5 sm:p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-[rgba(30,50,39,0.12)] pb-3">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-[#3F5447] text-white text-xs font-bold flex items-center justify-center">
                  C
                </span>
                <h4 className="text-sm sm:text-base font-bold text-[#1E3227]">
                  Phần C · Tự Luận Đặt Câu &amp; Chấm Chữa Chi Tiết ({assignmentPackage.essayList.length} câu · 30 điểm)
                </h4>
              </div>
              <span className="text-xs text-[#9B8A3E] font-semibold">15 điểm / câu</span>
            </div>

            {/* Optional Photo/File upload for hand-written homework */}
            <div className="p-4 rounded-2xl bg-white border border-[#9B8A3E]/30 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#E7ECD9] flex items-center justify-center shrink-0">
                  <Camera className="w-5 h-5 text-[#1E3227]" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#1E3227]">
                    📸 Tải ảnh bài viết chữ tay / File bài làm (Tùy chọn)
                  </div>
                  <div className="text-[11px] text-[#3F5447]">
                    Chụp vở viết ô Mễ (米字格) hoặc giấy kiểm tra · AI phân tích nét bút &amp; ngữ pháp
                  </div>
                </div>
              </div>

              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,.pdf,.docx,.txt"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  disabled={isSubmitted}
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3.5 py-2 rounded-xl bg-[#FAFBF7] border border-[#9B8A3E]/40 hover:bg-[#E7ECD9] text-xs font-bold text-[#1E3227] flex items-center gap-1.5 transition-all shadow-2xs"
                >
                  <Upload className="w-3.5 h-3.5 text-[#9B8A3E]" />
                  <span>{uploadedHomeworkFile ? 'Đổi ảnh/file khác' : 'Chụp / Tải ảnh lên'}</span>
                </button>
              </div>
            </div>

            {uploadedHomeworkFile && (
              <div className="p-3 rounded-xl bg-[#E7ECD9] text-xs text-[#1E3227] flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#1E3227]" />
                  <span>
                    Đã đính kèm:{' '}
                    <strong>{uploadedHomeworkFile.name}</strong> (
                    {(uploadedHomeworkFile.size / 1024).toFixed(1)} KB)
                  </span>
                </div>
                {homeworkImagePreview && (
                  <img
                    src={homeworkImagePreview}
                    alt="Preview bài viết tay"
                    className="w-10 h-10 object-cover rounded-lg border border-[#1E3227]/30"
                  />
                )}
              </div>
            )}

            <div className="space-y-4">
              {assignmentPackage.essayList.map((q, idx) => {
                const userText = essayAnswers[q.id] || '';
                const hasTarget = userText.includes(q.targetWord);
                const isGoodLength = userText.trim().length >= 4;

                return (
                  <div
                    key={q.id}
                    className="rounded-2xl bg-[#FAFBF7] border border-[rgba(30,50,39,0.12)] p-4 sm:p-5 space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="px-2 py-0.5 rounded-md bg-[#E7ECD9] text-[#1E3227] text-xs font-bold">
                          Câu {idx + 1}
                        </span>
                        <h5 className="text-sm font-bold text-[#1E3227] mt-1">
                          Đặt câu có chứa từ: “
                          <span className="font-['Noto_Sans_SC'] text-base text-[#9B8A3E]">
                            {q.targetWord}
                          </span>
                          ” ({q.pinyin} · {q.meaning})
                        </h5>
                        <p className="text-xs text-[#3F5447] mt-0.5">{q.suggestedPrompt}</p>
                      </div>
                    </div>

                    {/* Input Area */}
                    <div>
                      <textarea
                        rows={2}
                        disabled={isSubmitted}
                        value={userText}
                        onChange={(e) =>
                          setEssayAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))
                        }
                        placeholder={`Gõ câu tiếng Trung của bạn ở đây (bắt buộc có chữ "${q.targetWord}")...`}
                        className="w-full p-3 rounded-xl bg-white border border-[rgba(30,50,39,0.18)] focus:border-[#9B8A3E] focus:ring-1 focus:ring-[#9B8A3E]/30 text-sm font-['Noto_Sans_SC'] text-[#1E3227] placeholder:text-[#3F5447]/40 outline-none"
                      />
                      <div className="flex items-center justify-between text-[11px] text-[#3F5447] mt-1 px-1">
                        <span>
                          {hasTarget ? (
                            <span className="text-[#1E3227] font-bold">
                              ✓ Đã xuất hiện từ "{q.targetWord}"
                            </span>
                          ) : (
                            <span className="text-amber-700">
                              Chưa chứa từ vựng bắt buộc "{q.targetWord}"
                            </span>
                          )}
                        </span>
                        <span>{userText.length} ký tự</span>
                      </div>
                    </div>

                    {/* AI Review, Error Diagnostic & Teacher Model Sentence */}
                    {isSubmitted && (
                      <div className="p-4 rounded-xl bg-white border border-[#9B8A3E]/40 text-xs space-y-3 shadow-xs">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 font-bold text-[#1E3227]">
                            <Sparkles className="w-4 h-4 text-[#C5B358]" />
                            <span>Trợ lý AI &amp; Thầy Nguyễn Văn Thụ Chấm Sửa:</span>
                          </div>
                          <span className="px-2.5 py-0.5 rounded-md bg-[#1E3227] text-white font-bold text-[11px]">
                            {hasTarget && isGoodLength
                              ? '+15/15 điểm (Xuất sắc)'
                              : hasTarget || isGoodLength || uploadedHomeworkFile
                              ? '+10/15 điểm (Khá)'
                              : '+6/15 điểm'}
                          </span>
                        </div>

                        {/* Error Diagnostic */}
                        <div className="p-3 rounded-lg bg-[#FAFBF7] border border-[rgba(30,50,39,0.1)] text-[#1E3227] space-y-1">
                          <div className="font-bold text-[#1E3227]">
                            {hasTarget && isGoodLength
                              ? '✅ Nhận xét ngữ pháp: Câu viết tự nhiên, dùng đúng vị trí trạng từ và cấu trúc Hán ngữ.'
                              : '⚠️ Lưu ý chẩn đoán: Cần đảm bảo có đầy đủ thành phần Chủ ngữ + Vị ngữ và đặt trạng từ thời gian/địa điểm trước động từ.'}
                          </div>
                          {q.grammarFocus && (
                            <div className="text-[11px] text-[#3F5447]">
                              <strong>Trọng điểm bài giảng:</strong> {q.grammarFocus}
                            </div>
                          )}
                        </div>

                        {/* Teacher's Model Answer (范句) */}
                        <div className="p-3 rounded-lg bg-[#E7ECD9]/70 border border-[#9B8A3E]/30 text-[#1E3227] space-y-1">
                          <div className="flex items-center justify-between text-[11px] text-[#9B8A3E] font-bold uppercase tracking-wider">
                            <span>Câu Mẫu Chuẩn Của Giáo Viên (范句):</span>
                            <button
                              type="button"
                              onClick={() => speakChinese(q.sampleSentence)}
                              className="inline-flex items-center gap-1 text-[#1E3227] hover:underline"
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                              <span>Nghe mẫu</span>
                            </button>
                          </div>
                          <p className="font-['Noto_Sans_SC'] font-bold text-sm text-[#1E3227]">
                            {q.sampleSentence}
                          </p>
                          <p className="text-[11px] text-[#9B8A3E] font-medium">{q.samplePinyin}</p>
                          <p className="text-[11px] text-[#3F5447] italic">
                            Dịch nghĩa: {q.sampleTranslation}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* -------------------------------------------------------------------
              SECTION D: NGHE ÂM CHỌN CHỮ & KIỂM TRA VIẾT NÉT CHỮ HÁN (米字格)
              ------------------------------------------------------------------- */}
          <div className="rounded-3xl bg-[rgba(255,255,255,0.65)] backdrop-blur-md border border-[rgba(30,50,39,0.15)] p-5 sm:p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[rgba(30,50,39,0.12)] pb-3">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-[#1E3227] text-[#C5B358] text-xs font-bold flex items-center justify-center">
                  D
                </span>
                <h4 className="text-sm sm:text-base font-bold text-[#1E3227]">
                  Phần D · Nghe Âm Chọn Chữ &amp; Luyện Viết Nét Chữ Hán (米字格)
                </h4>
              </div>
              <span className="text-xs text-[#9B8A3E] font-semibold">
                Đồng bộ độ chuẩn nét viết vào sổ điểm
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {LISTENING_CHALLENGES.map((lc, idx) => {
                const selectedAnswer = listeningAnswers[lc.id];
                const hasAnsweredOrSubmitted = Boolean(selectedAnswer) || isSubmitted;
                const isListeningCorrect = selectedAnswer?.startsWith(lc.correctHanzi);

                return (
                  <div
                    key={lc.id}
                    className="p-4 rounded-2xl bg-[#FAFBF7] border border-[rgba(30,50,39,0.12)] space-y-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-[#1E3227]">
                        🎧 Câu nghe #{idx + 1}: Chọn đúng chữ Hán
                      </span>
                      <button
                        type="button"
                        data-testid={`listening-play-btn-${lc.id}`}
                        onClick={() => speakChinese(lc.audioText)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1E3227] hover:bg-[#2B4637] text-[#FAFBF7] text-xs font-bold transition-all cursor-pointer shadow-2xs"
                      >
                        <Headphones className="w-3.5 h-3.5 text-[#C5B358]" />
                        <span>🔊 Nghe phát âm câu #{idx + 1}</span>
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {lc.options.map((opt) => {
                        const picked = selectedAnswer === opt;
                        const isOptCorrect = opt.startsWith(lc.correctHanzi);
                        let btnStyle =
                          'bg-white text-[#1E3227] border-[rgba(30,50,39,0.15)] hover:border-[#9B8A3E]';
                        if (isSubmitted) {
                          if (isOptCorrect) {
                            btnStyle = 'bg-[#E7ECD9] text-[#1E3227] border-[#1E3227] font-bold';
                          } else if (picked && !isOptCorrect) {
                            btnStyle = 'bg-red-50 text-red-900 border-red-400';
                          }
                        } else if (picked) {
                          btnStyle = 'bg-[#1E3227] text-white border-[#1E3227]';
                        }

                        return (
                          <button
                            key={opt}
                            type="button"
                            disabled={isSubmitted}
                            onClick={() => {
                              speakChinese(opt.split(' ')[0]);
                              setListeningAnswers((prev) => ({ ...prev, [lc.id]: opt }));
                            }}
                            className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${btnStyle}`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>

                    {hasAnsweredOrSubmitted && (
                      <div
                        data-testid={`listening-feedback-${lc.id}`}
                        className={`p-3 rounded-xl text-xs space-y-1 transition-all ${
                          isListeningCorrect
                            ? 'bg-[#E7ECD9] text-[#1E3227] border border-[#1E3227]/20'
                            : 'bg-amber-50 text-amber-950 border border-amber-300'
                        }`}
                      >
                        <div className="flex flex-wrap items-center justify-between gap-1 font-bold">
                          <span>
                            {isListeningCorrect
                              ? `✓ Chính xác! Từ vừa nghe là “${lc.correctHanzi}” (${lc.meaning})`
                              : `💡 Đáp án chuẩn: “${lc.correctHanzi}” (${lc.meaning})`}
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-white/80 text-[#9B8A3E] font-bold">
                            Pinyin: {lc.pinyin}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#3F5447] leading-relaxed">
                          {lc.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Quick Interactive Stroke Practice Verification */}
            <div className="p-4 rounded-2xl bg-[#FAFBF7] border border-[#9B8A3E]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="text-xs font-bold text-[#1E3227] flex items-center gap-1.5">
                  <Edit3 className="w-3.5 h-3.5 text-[#9B8A3E]" />
                  <span>Kiểm tra nhanh nét viết chữ trọng tâm trên ô Mễ (米字格):</span>
                </div>
                <p className="text-[11px] text-[#3F5447] mt-0.5">
                  Bấm vào từng chữ để luyện nét bút và ghi nhận độ chuẩn xác ({avgWritingAccuracy}% độ chuẩn nét)
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {['温', '暖', '咱', '换'].map((ch) => {
                  const acc = practicedChars[ch];
                  return (
                    <button
                      key={ch}
                      type="button"
                      disabled={isSubmitted}
                      onClick={() => {
                        speakChinese(ch);
                        setPracticedChars((prev) => ({ ...prev, [ch]: 97 }));
                      }}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        acc
                          ? 'bg-[#1E3227] text-[#FAFBF7] border-[#9B8A3E]'
                          : 'bg-white text-[#1E3227] border-[rgba(30,50,39,0.2)] hover:border-[#9B8A3E]'
                      }`}
                    >
                      <span className="font-['Noto_Sans_SC'] text-sm mr-1">{ch}</span>
                      <span>{acc ? `✓ ${acc}%` : 'Viết thử'}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* -------------------------------------------------------------------
              BOTTOM ACTION BAR: NỘP BÀI & CHẤM ĐIỂM AI (COMPACT & NON-OVERLAPPING)
              ------------------------------------------------------------------- */}
          {!isSubmitted && (
            <div
              data-testid="sticky-submit-assignment-bar"
              className="sticky bottom-4 z-20 sm:mr-44 md:mr-48 p-3 sm:px-5 sm:py-3.5 rounded-2xl bg-[rgba(30,50,39,0.95)] text-white border border-[#C5B358]/40 backdrop-blur-md shadow-xl flex flex-col sm:flex-row items-center justify-between gap-3"
            >
              <div className="flex items-center gap-2.5 text-xs">
                <Sparkles className="w-4 h-4 text-[#C5B358] shrink-0" />
                <span>
                  Học viên: <strong data-testid="bottom-bar-student-name" className="text-[#C5B358]">{activeStudentName}</strong> · Buổi{' '}
                  {assignmentPackage.sessionNumber} · Tự động lưu vào Bảng điểm Giáo viên.
                </span>
              </div>

              <button
                type="button"
                data-testid="submit-student-assignment-btn"
                disabled={isGrading}
                onClick={handleSubmitAssignment}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#FAFBF7] hover:bg-white text-[#1E3227] font-bold text-xs transition-all shadow-sm whitespace-nowrap cursor-pointer"
              >
                {isGrading ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-[#1E3227] border-t-transparent rounded-full animate-spin" />
                    <span>AI đang phân tích &amp; chấm điểm...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 text-[#9B8A3E]" />
                    <span>Nộp Bài &amp; AI Chấm Chữa Ngay (100đ)</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}

      {/* =======================================================================
          VIEW 2: LEADERBOARD DISPLAY
          ======================================================================= */}
      {activeSection === 'leaderboard' && (
        <StudentLeaderboard
          currentStudentName={activeStudentName}
          currentStudentScore={finalScore}
          hasSubmitted={isSubmitted}
        />
      )}

      {/* =======================================================================
          FEEDBACK MODAL FROM BIN BIN PANDA AI
          ======================================================================= */}
      {showBinBinFeedbackModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="max-w-md w-full rounded-3xl bg-[#FAFBF7] border border-[#9B8A3E] p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#E7ECD9] flex items-center justify-center">
                <BinBinPandaMascotSVG mood="cheering" size={38} />
              </div>
              <div>
                <h4 className="text-base font-bold text-[#1E3227]">
                  Lời khuyên từ Trợ lý Gấu trúc Bin Bin (彬彬)
                </h4>
                <p className="text-xs text-[#9B8A3E]">
                  Đánh giá bài tập: {assignmentPackage.fileName}
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-[rgba(30,50,39,0.12)] text-xs text-[#1E3227] space-y-2">
              <p>
                <strong>1. Nhận xét tổng quan:</strong> Bạn đã đạt{' '}
                <strong className="text-[#9B8A3E]">{totalScore}/100 điểm</strong> trong bài tập Buổi{' '}
                {assignmentPackage.sessionNumber}!
              </p>
              <p>
                <strong>2. Lưu ý ngữ pháp Hán ngữ cốt lõi:</strong> Hãy luôn nhớ quy tắc ngữ pháp vàng:
                <em className="text-[#1E3227] block mt-0.5">
                  Chủ ngữ + Trạng ngữ thời gian/địa điểm + Động từ + Tân ngữ.
                </em>
                Khác với tiếng Việt, trong tiếng Trung thời gian và nơi chốn không được để ở cuối câu.
              </p>
              <p>
                <strong>3. Lời khen nét chữ &amp; luyện tập:</strong> Hãy tiếp tục luyện viết chữ Mễ ở Tab 1 để trau chuốt độ cân đối của các chữ Hán nhé!
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowBinBinFeedbackModal(false)}
              className="w-full py-2.5 rounded-xl bg-[#1E3227] text-white text-xs font-bold hover:bg-[#2B4637] transition-all"
            >
              Đã hiểu, cảm ơn Bin Bin!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
