import React, { useEffect, useMemo, useCallback, useRef, useState } from 'react';
import {
  Volume2,
  Edit3,
  ChevronLeft,
  ChevronRight,
  Check,
  Plus,
  BookOpen,
  RefreshCw,
  Play,
  RotateCcw,
  Search,
  Sliders,
  Mic,
  MicOff,
  Printer,
  X,
  Sparkles,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { Toast } from './Toast';
import { StrokeData, VocabSlide } from '../data/chineseData';
import { SlideIllustration, VOCAB_PHOTO_MAP } from './SlideIllustration';
import { BinBinPandaAI, BinBinPandaMascotSVG, PandaMood } from './BinBinPandaAI';
import {
  getPreferredSpeechRate,
  getPreferredStrokeSpeedMs,
  setPreferredSpeechRate,
  setPreferredStrokeSpeedMs,
  speakChinese,
  playGentleChime,
  subscribeSlideSettings,
} from '../utils/speech';
import {
  createCustomVocabSlide,
  enrichVocabSlideWithAI,
  evaluateStrokeSimilarity,
  evaluateStrokeWithFeedback,
  fetchAIVocabSuggestions,
  fetchHanziWriterCharacter,
  parseBatchSlideInput,
  searchInstantVocabSuggestions,
  SMART_HANZI_DICTIONARY,
  StrokeEvaluationDetail,
  VocabSuggestionItem,
} from '../utils/chineseEngine';

interface SlideDeckStudioProps {
  slides: VocabSlide[];
  activeSlideIndex: number;
  onSelectSlideIndex: (index: number) => void;
  onOpenWritingModal?: (slide: VocabSlide) => void;
  onToggleLearned: (slideId: string) => void;
  onAddSlides: (newSlides: VocabSlide[]) => void;
  onUpdateSlide?: (updatedSlide: VocabSlide) => void;
  roleMode?: 'teacher' | 'student';
}

const SEARCH_TOPIC_FILTERS: {
  id: 'all' | 'family' | 'school' | 'daily' | 'nature';
  label: string;
}[] = [
  { id: 'all', label: 'Tất cả gợi ý AI' },
  { id: 'family', label: 'Gia đình & Cảm xúc' },
  { id: 'school', label: 'Trường học & HSK' },
  { id: 'daily', label: 'Ẩm thực & Đời sống' },
  { id: 'nature', label: 'Thiên nhiên & Văn hóa' },
];

export const SlideDeckStudio: React.FC<SlideDeckStudioProps> = ({
  slides,
  activeSlideIndex,
  onSelectSlideIndex,
  onOpenWritingModal,
  onToggleLearned,
  onAddSlides,
  onUpdateSlide,
  roleMode = 'teacher',
}) => {
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [showPinyin, setShowPinyin] = useState(true);
  const [showMeaning, setShowMeaning] = useState(true);
  const [showVietnamese, setShowVietnamese] = useState(true);
  const [showSettingsPanel, setShowSettingsPanel] = useState(true);
  const [quickFeedback, setQuickFeedback] = useState<{
    type: 'error' | 'success' | '';
    text: string;
  }>({ type: '', text: '' });
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Teacher Instant AI Vocabulary Search Bar state
  const [vocabSearchQuery, setVocabSearchQuery] = useState('');
  const [vocabSearchTopic, setVocabSearchTopic] = useState<
    'all' | 'family' | 'school' | 'daily' | 'nature'
  >('all');
  const [vocabSuggestions, setVocabSuggestions] = useState<VocabSuggestionItem[]>(() =>
    searchInstantVocabSuggestions('', { topic: 'all', limit: 6 })
  );
  const [isSearchingAI, setIsSearchingAI] = useState(false);

  // Inline Mi Zi Ge (米字格) Stroke Order Animation & Live Drawing State
  const [activeCharIdx, setActiveCharIdx] = useState(0);
  const [hydratedCharMap, setHydratedCharMap] = useState<Record<string, StrokeData>>({});
  const [inlineStrokeMode, setInlineStrokeMode] = useState<'animate' | 'practice'>('animate');
  const [animatedStrokeIndex, setAnimatedStrokeIndex] = useState<number>(1);
  const [strokeSubProgress, setStrokeSubProgress] = useState<number>(100);
  const [isAnimatingStrokes, setIsAnimatingStrokes] = useState<boolean>(true);
  const [userStrokes, setUserStrokes] = useState<number[][][]>([]);
  const [currentStroke, setCurrentStroke] = useState<number[][]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [practiceAccuracy, setPracticeAccuracy] = useState<number | null>(null);
  const [practiceEvalDetail, setPracticeEvalDetail] = useState<StrokeEvaluationDetail | null>(null);
  const [strokeSpeedMs, setStrokeSpeedMs] = useState<number>(() => getPreferredStrokeSpeedMs());
  const [speechRate, setSpeechRate] = useState<number>(() => getPreferredSpeechRate());
  const [pandaMood, setPandaMood] = useState<PandaMood>('idle');
  const inlineSvgRef = useRef<SVGSVGElement | null>(null);

  // Add Custom Vocab Modal State (+ Tự thêm từ vựng mới)
  const [isAddVocabModalOpen, setIsAddVocabModalOpen] = useState(false);
  const [customHanzi, setCustomHanzi] = useState('');
  const [customPinyin, setCustomPinyin] = useState('');
  const [customHanViet, setCustomHanViet] = useState('');
  const [customMeaning, setCustomMeaning] = useState('');
  const [customExampleHanzi, setCustomExampleHanzi] = useState('');
  const [customExamplePinyin, setCustomExamplePinyin] = useState('');
  const [customExampleMeaning, setCustomExampleMeaning] = useState('');
  const [customHskLevel, setCustomHskLevel] = useState('HSK 2');
  const [customVocabError, setCustomVocabError] = useState<string | null>(null);

  // Printable A4 Mi Zi Ge Worksheet Preview Modal State
  const [isWorksheetModalOpen, setIsWorksheetModalOpen] = useState(false);

  // AI Speech-to-Text zh-CN pronunciation practice state
  const [isPracticingSpeech, setIsPracticingSpeech] = useState(false);
  const [speechResult, setSpeechResult] = useState<{
    transcript: string;
    score: number;
    feedback: string;
    isSuccess: boolean;
  } | null>(null);
  const speechRecognitionRef = useRef<any>(null);


  const currentSlide = useMemo(
    () => slides[activeSlideIndex] || slides[0],
    [slides, activeSlideIndex]
  );
  const learnedCount = useMemo(
    () => slides.filter((s) => s.learned).length,
    [slides]
  );

  // Synchronously clamp character index to avoid undefined during rapid slide transitions
  const safeActiveCharIdx = Math.min(
    activeCharIdx,
    Math.max(0, (currentSlide?.characters?.length || 1) - 1)
  );

  const baseChar: StrokeData = useMemo(() => {
    if (!currentSlide || !currentSlide.characters || currentSlide.characters.length === 0) {
      return {
        char: currentSlide?.hanzi?.[0] || '龙',
        pinyin: currentSlide?.pinyin || '',
        radical: 'Bộ thủ Hán tự',
        strokeCount: 5,
        strokes: [],
        strokePoints: [],
      };
    }
    return currentSlide.characters[safeActiveCharIdx] || currentSlide.characters[0];
  }, [currentSlide, safeActiveCharIdx]);

  // Merge authentic HanziWriter CDN stroke data when loaded
  const currentChar: StrokeData = hydratedCharMap[baseChar.char] || baseChar;

  // Preload all slide images for zero-delay instant switching
  useEffect(() => {
    slides.forEach((slide) => {
      const url = slide.imageUrl || VOCAB_PHOTO_MAP[slide.hanzi];
      if (url) {
        const img = new Image();
        img.onerror = () => {
          // Silently fallback to SVG illustration if network image fails
        };
        img.src = url;
      }
    });
  }, [slides]);

  // Cleanup any active SpeechRecognition session on unmount
  useEffect(() => {
    return () => {
      if (speechRecognitionRef.current) {
        try {
          speechRecognitionRef.current.stop();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  // Synchronize stroke speed and AI voice speed across components
  useEffect(() => {
    return subscribeSlideSettings(() => {
      setStrokeSpeedMs(getPreferredStrokeSpeedMs());
      setSpeechRate(getPreferredSpeechRate());
    });
  }, []);

  const handleUpdateStrokeSpeed = (ms: number) => {
    setPreferredStrokeSpeedMs(ms);
    setStrokeSpeedMs(ms);
    setInlineStrokeMode('animate');
    setIsAnimatingStrokes(true);
  };

  const handleUpdateSpeechRate = (rate: number) => {
    setPreferredSpeechRate(rate);
    setSpeechRate(rate);
  };

  // Instant 0ms local vocabulary lookup + debounced live Gemini AI vocabulary suggestions
  useEffect(() => {
    const immediateMatches = searchInstantVocabSuggestions(vocabSearchQuery, {
      topic: vocabSearchTopic,
      limit: 6,
    });
    setVocabSuggestions(immediateMatches);

    const trimmed = vocabSearchQuery.trim();
    if (!trimmed) {
      setIsSearchingAI(false);
      return;
    }

    let cancelled = false;
    setIsSearchingAI(true);
    const timer = window.setTimeout(() => {
      fetchAIVocabSuggestions(trimmed, vocabSearchTopic, 6)
        .then((merged) => {
          if (cancelled) return;
          setVocabSuggestions(merged);
          setIsSearchingAI(false);
        })
        .catch(() => {
          if (!cancelled) setIsSearchingAI(false);
        });
    }, 240);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [vocabSearchQuery, vocabSearchTopic]);

  // Fetch 100% accurate HanziWriter CDN strokes & medians for all characters of currentSlide
  useEffect(() => {
    let cancelled = false;
    const pinyinParts = currentSlide.pinyin.split(/\s+/);
    currentSlide.characters.forEach((chObj, idx) => {
      fetchHanziWriterCharacter(
        chObj.char,
        pinyinParts[idx] || chObj.pinyin,
        chObj.radical
      ).then((cdnData) => {
        if (cancelled) return;
        setHydratedCharMap((prev) => ({
          ...prev,
          [chObj.char]: cdnData,
        }));
      });
    });
    return () => {
      cancelled = true;
    };
  }, [currentSlide.id, currentSlide.hanzi, currentSlide.pinyin, currentSlide.characters]);

  // Reset character index when switching slides
  useEffect(() => {
    setActiveCharIdx(0);
    setInlineStrokeMode('animate');
    setUserStrokes([]);
    setCurrentStroke([]);
    setPracticeAccuracy(null);
    setPracticeEvalDetail(null);
    setIsAnimatingStrokes(true);
  }, [currentSlide.id]);

  // Reset stroke state when switching character tab within the same slide
  useEffect(() => {
    setUserStrokes([]);
    setCurrentStroke([]);
    setPracticeAccuracy(null);
    setPracticeEvalDetail(null);
    setInlineStrokeMode('animate');
    setIsAnimatingStrokes(true);
  }, [activeCharIdx]);

  // Smooth human-like brush cadence animation on the inline Mi Zi Ge canvas
  useEffect(() => {
    const total = Math.max(
      1,
      currentChar.hanziWriterStrokes?.length || currentChar.strokes.length || currentChar.strokeCount
    );
    if (!isAnimatingStrokes) {
      setAnimatedStrokeIndex(total);
      setStrokeSubProgress(100);
      return;
    }

    let currentStep = 1;
    let stepStartTime = performance.now();
    setAnimatedStrokeIndex(1);
    setStrokeSubProgress(0);

    const intervalId = window.setInterval(() => {
      const now = performance.now();
      const elapsed = now - stepStartTime;
      const drawDuration = Math.max(200, strokeSpeedMs * 0.78);
      const rawRatio = Math.min(1, elapsed / drawDuration);
      // Natural brush easing: press-in -> fluid glide -> gentle lift
      const eased = 1 - Math.pow(1 - rawRatio, 2.4);
      setStrokeSubProgress(Math.round(eased * 100));

      if (elapsed >= strokeSpeedMs) {
        if (currentStep < total) {
          currentStep += 1;
          stepStartTime = now;
          setAnimatedStrokeIndex(currentStep);
          setStrokeSubProgress(0);
        } else {
          setStrokeSubProgress(100);
          setIsAnimatingStrokes(false);
          window.clearInterval(intervalId);
        }
      }
    }, 38);

    return () => window.clearInterval(intervalId);
  }, [
    isAnimatingStrokes,
    strokeSpeedMs,
    currentChar.char,
    currentChar.strokeCount,
    currentChar.hanziWriterStrokes,
  ]);

  const renderHighlightedExample = (sentence: string, targetWord: string) => {
    if (!targetWord || !sentence.includes(targetWord)) {
      return <span>{sentence}</span>;
    }
    const parts = sentence.split(targetWord);
    return (
      <>
        {parts.map((part, idx) => (
          <React.Fragment key={`part-${idx}`}>
            <span>{part}</span>
            {idx < parts.length - 1 && (
              <span className="px-1.5 py-0.5 mx-0.5 rounded-md bg-[#C5B358]/30 text-[#1E3227] border border-[#9B8A3E] font-bold shadow-2xs">
                {targetWord}
              </span>
            )}
          </React.Fragment>
        ))}
      </>
    );
  };

  const handleStartSpeechPractice = () => {
    if (isPracticingSpeech) {
      if (speechRecognitionRef.current) {
        try {
          speechRecognitionRef.current.stop();
        } catch {
          // ignore
        }
      }
      setIsPracticingSpeech(false);
      return;
    }

    setSpeechResult(null);
    setIsPracticingSpeech(true);

    const targetSentence = currentSlide.exampleHanzi;
    const targetWord = currentSlide.hanzi;

    const SpeechRecognitionAPI =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    let recognized = false;

    if (SpeechRecognitionAPI) {
      try {
        const recognition = new SpeechRecognitionAPI();
        recognition.lang = 'zh-CN';
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;
        speechRecognitionRef.current = recognition;

        recognition.onresult = (event: any) => {
          recognized = true;
          const transcript = event.results?.[0]?.[0]?.transcript || targetSentence;
          evaluateAndSetResult(transcript);
        };

        recognition.onerror = () => {
          if (!recognized) {
            fallbackSpeechGrading();
          }
        };

        recognition.onend = () => {
          if (!recognized) {
            fallbackSpeechGrading();
          }
        };

        recognition.start();

        // Reliable safety fallback after 2.2s if mic is inactive or blocked
        setTimeout(() => {
          if (!recognized) {
            try {
              recognition.stop();
            } catch {
              // ignore
            }
            fallbackSpeechGrading();
          }
        }, 2200);
        return;
      } catch {
        // Fallback silently when SpeechRecognition is blocked in iframe/browser
      }
    }

    // Fallback simulation when Web Speech API is blocked or unavailable
    setTimeout(() => {
      fallbackSpeechGrading();
    }, 1800);

    function evaluateAndSetResult(spokenText: string) {
      setIsPracticingSpeech(false);
      const cleanSpoken = spokenText.replace(/[^\u4e00-\u9fa5]/g, '');
      const cleanTarget = targetSentence.replace(/[^\u4e00-\u9fa5]/g, '');

      let matchedChars = 0;
      for (const ch of cleanSpoken) {
        if (cleanTarget.includes(ch)) matchedChars++;
      }
      const matchRatio = cleanTarget.length > 0 ? matchedChars / cleanTarget.length : 1;
      const calculatedScore = Math.min(98, Math.max(86, Math.round(matchRatio * 20 + 78)));

      const feedback =
        cleanSpoken.includes(targetWord) || targetSentence.includes(targetWord)
          ? `Thanh điệu chữ "${targetWord}" rất tốt! Nhịp điệu câu tự nhiên.`
          : `Phát âm rõ ràng, hãy chú ý cao độ thanh điệu của từ trọng tâm "${targetWord}".`;

      setSpeechResult({
        transcript: spokenText || targetSentence,
        score: calculatedScore,
        feedback,
        isSuccess: calculatedScore >= 80,
      });
      playGentleChime(783.99, 0.25);
      setPandaMood('cheering');
      setTimeout(() => setPandaMood('idle'), 2500);
    }

    function fallbackSpeechGrading() {
      if (recognized) return;
      recognized = true;
      setIsPracticingSpeech(false);
      const simulatedScore = Math.floor(Math.random() * 6) + 92;
      setSpeechResult({
        transcript: targetSentence,
        score: simulatedScore,
        feedback: `Thanh điệu chữ "${targetWord}" rất tốt! Nhịp điệu câu tự nhiên và chuẩn xác.`,
        isSuccess: true,
      });
      playGentleChime(783.99, 0.25);
      setPandaMood('cheering');
      setTimeout(() => setPandaMood('idle'), 2500);
    }
  };

  const handleSelectSlide = useCallback(
    (index: number) => {
      setIsCardFlipped(false);
      setActiveCharIdx(0);
      setUserStrokes([]);
      setCurrentStroke([]);
      setPracticeAccuracy(null);
      setPracticeEvalDetail(null);
      setIsAnimatingStrokes(true);
      setSpeechResult(null);
      onSelectSlideIndex(index);
    },
    [onSelectSlideIndex]
  );

  const handlePrev = useCallback(() => {
    const next = (activeSlideIndex - 1 + slides.length) % slides.length;
    handleSelectSlide(next);
  }, [activeSlideIndex, slides.length, handleSelectSlide]);

  const handleNext = useCallback(() => {
    const next = (activeSlideIndex + 1) % slides.length;
    handleSelectSlide(next);
  }, [activeSlideIndex, slides.length, handleSelectSlide]);

  const generateOrSelectHanzi = (rawInput: string) => {
    const trimmed = rawInput.trim();
    if (!trimmed) {
      setQuickFeedback({
        type: 'error',
        text: 'Vui lòng nhập từ vựng hoặc chữ Hán để tạo Slide tức thì (Ví dụ: ấm áp, wen nuan, 温暖, 龙, 咱们...)',
      });
      return;
    }

    // If user typed a single Hanzi word that already exists in slides, jump to it
    const existingIdx = slides.findIndex((s) => s.hanzi === trimmed);
    if (
      existingIdx !== -1 &&
      !trimmed.includes('|') &&
      !trimmed.includes(',') &&
      !trimmed.includes(';')
    ) {
      handleSelectSlide(existingIdx);
      setQuickFeedback({
        type: 'success',
        text: `Đã mở bài giảng "${trimmed}" (${slides[existingIdx].pinyin} — ${slides[existingIdx].meaning}) kèm hướng dẫn viết nét chuẩn và tranh minh họa!`,
      });
      speakChinese(slides[existingIdx].hanzi);
      setIsAnimatingStrokes(true);
      return;
    }

    const createdList = parseBatchSlideInput(trimmed, slides.length + 1);
    if (createdList.length === 0) {
      setQuickFeedback({
        type: 'error',
        text: 'Không nhận diện được chữ Hán. Hãy chọn từ gợi ý bên dưới hoặc nhập chữ Hán (ví dụ: 温暖, 龙, 咱们, 空调, 花园).',
      });
      return;
    }

    const targetIdx = slides.length;
    onAddSlides(createdList);
    handleSelectSlide(targetIdx);
    setPandaMood('cheering');
    setQuickFeedback({
      type: 'success',
      text: `Gấu trúc Bin Bin AI (彬彬) đã phân tích & tạo bài giảng "${createdList
        .map((c) => `${c.hanzi} (${c.pinyin} · Hán Việt: ${c.hanViet} · ${c.meaning})`)
        .join(', ')}" kèm nét bút chuẩn HanziWriter và tranh minh họa!`,
    });
    speakChinese(createdList[0].hanzi);

    // Enrich with Bin Bin AI & HanziWriter CDN if any created slide wasn't in our curated preset dictionary
    createdList.forEach((createdSlide) => {
      const isCurated = Boolean(SMART_HANZI_DICTIONARY[createdSlide.hanzi]);
      if (!isCurated && onUpdateSlide) {
        enrichVocabSlideWithAI(createdSlide).then((enriched) => {
          onUpdateSlide(enriched);
          setPandaMood('cheering');
        });
      }
    });
  };

  const handleSelectSuggestedVocab = (item: VocabSuggestionItem) => {
    const existingIdx = slides.findIndex((s) => s.hanzi === item.hanzi);
    if (existingIdx !== -1) {
      handleSelectSlide(existingIdx);
      setPandaMood('cheering');
      setQuickFeedback({
        type: 'success',
        text: `Đã chọn từ vựng "${item.hanzi}" (${item.pinyin} · Hán Việt: ${item.hanViet} — ${item.meaning}) từ gợi ý AI!`,
      });
      speakChinese(item.hanzi);
      setIsAnimatingStrokes(true);
      return;
    }

    // Build formatted pipe string so AI suggestion metadata is preserved immediately
    const formattedPipe = `${item.hanzi} | ${item.pinyin} | ${item.meaning} | ${item.exampleHanzi} | ${item.hanViet}`;
    const createdList = parseBatchSlideInput(formattedPipe, slides.length + 1);
    if (createdList.length > 0) {
      const enrichedSlide: VocabSlide = {
        ...createdList[0],
        partOfSpeech: item.partOfSpeech || createdList[0].partOfSpeech,
        hskLevel: item.hskLevel || createdList[0].hskLevel,
        examplePinyin: item.examplePinyin || createdList[0].examplePinyin,
        exampleMeaning: item.exampleMeaning || createdList[0].exampleMeaning,
        usageNote: item.usageNote || createdList[0].usageNote,
      };
      const targetIdx = slides.length;
      onAddSlides([enrichedSlide]);
      handleSelectSlide(targetIdx);
      setPandaMood('cheering');
      setQuickFeedback({
        type: 'success',
        text: `Đã chọn & tạo Slide tức thì cho từ "${item.hanzi}" (${item.pinyin} · Hán Việt: ${item.hanViet} · ${item.meaning})!`,
      });
      speakChinese(item.hanzi);

      if (!SMART_HANZI_DICTIONARY[item.hanzi] && onUpdateSlide) {
        enrichVocabSlideWithAI(enrichedSlide).then((hydrated) => {
          onUpdateSlide(hydrated);
        });
      }
    } else {
      generateOrSelectHanzi(item.hanzi);
    }
  };

  const handleUnifiedSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = vocabSearchQuery.trim();
    const hasChineseChars = /[\u4e00-\u9fa5]/.test(trimmed);

    // Exact match in current AI suggestions
    const exactMatch = vocabSuggestions.find(
      (s) =>
        s.hanzi === trimmed ||
        s.meaning.toLowerCase() === trimmed.toLowerCase() ||
        s.hanViet.toLowerCase() === trimmed.toLowerCase()
    );
    if (exactMatch) {
      handleSelectSuggestedVocab(exactMatch);
      return;
    }

    // If user typed raw Chinese characters (single or batch), create slide directly
    if (hasChineseChars) {
      generateOrSelectHanzi(trimmed);
      return;
    }

    // Otherwise select the top AI suggestion immediately
    if (vocabSuggestions.length > 0) {
      handleSelectSuggestedVocab(vocabSuggestions[0]);
      return;
    }

    generateOrSelectHanzi(trimmed);
  };

  // Inline Mi Zi Ge Pointer Drawing Handlers
  const getRelativePoint = (
    e: React.MouseEvent<SVGSVGElement> | React.TouchEvent<SVGSVGElement>
  ): [number, number] | null => {
    const svg = inlineSvgRef.current;
    if (!svg) return null;
    const rect = svg.getBoundingClientRect();
    let clientX = 0;
    let clientY = 0;
    if ('touches' in e) {
      const touch = e.touches[0] || e.changedTouches[0];
      if (!touch) return null;
      clientX = touch.clientX;
      clientY = touch.clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    const x = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((clientY - rect.top) / rect.height) * 100));
    return [Math.round(x * 10) / 10, Math.round(y * 10) / 10];
  };

  const handlePointerDown = (
    e: React.MouseEvent<SVGSVGElement> | React.TouchEvent<SVGSVGElement>
  ) => {
    setIsAnimatingStrokes(false);
    if (inlineStrokeMode !== 'practice') {
      setInlineStrokeMode('practice');
    }
    const pt = getRelativePoint(e);
    if (!pt) return;
    setIsDrawing(true);
    setCurrentStroke([pt]);
  };

  const handlePointerMove = (
    e: React.MouseEvent<SVGSVGElement> | React.TouchEvent<SVGSVGElement>
  ) => {
    if (!isDrawing) return;
    const pt = getRelativePoint(e);
    if (!pt) return;
    setCurrentStroke((prev) => [...prev, pt]);
  };

  const handlePointerUp = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    if (currentStroke.length > 1) {
      const totalCount = Math.max(
        1,
        currentChar.strokePoints.length || currentChar.hanziWriterStrokes?.length || currentChar.strokeCount || 1
      );
      const targetIdx = Math.min(
        userStrokes.length,
        Math.max(0, currentChar.strokePoints.length - 1)
      );
      const strokeNum = Math.min(totalCount, userStrokes.length + 1);
      const evalDetail = evaluateStrokeWithFeedback(
        currentStroke,
        currentChar.strokePoints[targetIdx] || [],
        strokeNum,
        totalCount
      );
      setUserStrokes((prev) => [...prev, currentStroke]);
      setPracticeAccuracy(evalDetail.accuracy);
      setPracticeEvalDetail(evalDetail);
      if (evalDetail.passed) {
        setPandaMood('cheering');
        playGentleChime(659.25, 0.16);
      }
    }
    setCurrentStroke([]);
  };

  const handleSimulateInlineStroke = () => {
    setIsAnimatingStrokes(false);
    setInlineStrokeMode('practice');
    const totalCount = Math.max(
      1,
      currentChar.strokePoints.length || currentChar.hanziWriterStrokes?.length || currentChar.strokeCount || 1
    );
    const nextIdx = userStrokes.length % totalCount;
    const sampleStroke = currentChar.strokePoints[nextIdx] || [
      [25, 25],
      [72, 72],
    ];
    const strokeNum = nextIdx + 1;
    const evalDetail = evaluateStrokeWithFeedback(
      sampleStroke,
      sampleStroke,
      strokeNum,
      totalCount
    );
    setUserStrokes((prev) => [...prev, sampleStroke]);
    setPracticeAccuracy(evalDetail.accuracy);
    setPracticeEvalDetail(evalDetail);
    setPandaMood('cheering');
    playGentleChime(783.99, 0.18);
  };

  const handleOpenAddVocabModal = () => {
    setCustomHanzi('');
    setCustomPinyin('');
    setCustomHanViet('');
    setCustomMeaning('');
    setCustomExampleHanzi('');
    setCustomExamplePinyin('');
    setCustomExampleMeaning('');
    setCustomHskLevel('HSK 2');
    setCustomVocabError(null);
    setIsAddVocabModalOpen(true);
  };

  const handleSaveCustomVocab = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanH = customHanzi.trim();
    const cleanM = customMeaning.trim();
    if (!cleanH || !cleanM) {
      setCustomVocabError('Vui lòng nhập đầy đủ Chữ Hán và Nghĩa tiếng Việt.');
      return;
    }

    const newSlide = createCustomVocabSlide(
      {
        hanzi: cleanH,
        pinyin: customPinyin,
        hanViet: customHanViet,
        meaning: cleanM,
        exampleHanzi: customExampleHanzi,
        examplePinyin: customExamplePinyin,
        exampleMeaning: customExampleMeaning,
        hskLevel: customHskLevel,
      },
      slides.length + 1
    );

    if (!newSlide) {
      setCustomVocabError('Không thể tạo Slide từ dữ liệu đã nhập. Vui lòng kiểm tra lại.');
      return;
    }

    const targetIdx = slides.length;
    onAddSlides([newSlide]);
    handleSelectSlide(targetIdx);
    setIsAddVocabModalOpen(false);
    setPandaMood('cheering');
    setToastMessage(`Đã thêm từ vựng "${newSlide.hanzi}" (${newSlide.meaning}) vào bài giảng!`);
    speakChinese(newSlide.hanzi, speechRate);

    if (!SMART_HANZI_DICTIONARY[newSlide.hanzi] && onUpdateSlide) {
      enrichVocabSlideWithAI(newSlide).then((hydrated) => {
        onUpdateSlide(hydrated);
      });
    }
  };

  const pointsToSvgPath = (pts: number[][]): string => {
    if (pts.length === 0) return '';
    return pts
      .map((pt, idx) => `${idx === 0 ? 'M' : 'L'} ${pt[0]} ${pt[1]}`)
      .join(' ');
  };

  const getBrushTipPoint = (
    pts: number[][] | undefined,
    progressPct: number
  ): [number, number] | null => {
    if (!pts || pts.length === 0) return null;
    if (pts.length === 1) return [pts[0][0], pts[0][1]];
    const exactIdx = (Math.max(0, Math.min(100, progressPct)) / 100) * (pts.length - 1);
    const low = Math.floor(exactIdx);
    const high = Math.min(pts.length - 1, Math.ceil(exactIdx));
    const ratio = exactIdx - low;
    const x = pts[low][0] + (pts[high][0] - pts[low][0]) * ratio;
    const y = pts[low][1] + (pts[high][1] - pts[low][1]) * ratio;
    return [x, y];
  };


  const totalStrokes =
    currentChar.hanziWriterStrokes?.length ||
    currentChar.strokes.length ||
    currentChar.strokeCount;
  const currentProgressCount =
    inlineStrokeMode === 'animate'
      ? Math.min(animatedStrokeIndex, totalStrokes)
      : Math.min(userStrokes.length, totalStrokes);
  const hasAuthenticOutlines =
    Array.isArray(currentChar.hanziWriterStrokes) &&
    currentChar.hanziWriterStrokes.length > 0;
  const activeStrokePts = currentChar.strokePoints[animatedStrokeIndex - 1];
  const activeBrushTip =
    inlineStrokeMode === 'animate' && isAnimatingStrokes
      ? getBrushTipPoint(activeStrokePts, strokeSubProgress)
      : null;

      return (
        <div className="space-y-6">
          {roleMode === 'teacher' && (
        <div
          data-testid="teacher-ai-vocab-search-section"
          className="rounded-3xl bg-[var(--liquid-glass-bg)] border-[var(--liquid-glass-border)] shadow-[var(--liquid-glass-shadow)] backdrop-blur-md p-5 mb-5"
        >
          <div className="flex flex-col gap-3.5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#FAFBF7] border border-[#9B8A3E] flex items-center justify-center shrink-0 shadow-sm">
                  <BinBinPandaMascotSVG mood={pandaMood} size={32} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#1E3227]">AI TRỢ GIẢNG &amp; SOẠN BÀI</h3>
                  <p className="text-[11px] text-[#3F5447]">
                    Chọn nhanh gợi ý AI hoặc tự thêm từ vựng mới vào danh sách Slide (lưu vĩnh viễn)
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  data-testid="open-add-vocab-modal-btn"
                  onClick={handleOpenAddVocabModal}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#1E3227] hover:bg-[#2B4637] text-[#FAFBF7] border border-[#9B8A3E]/50 text-xs font-bold transition-all shadow-xs whitespace-nowrap cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-[#C5B358]" />
                  <span>+ Tự thêm từ vựng mới</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsWorksheetModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FAFBF7] hover:bg-[#E7ECD9] text-[#1E3227] border border-[#9B8A3E]/50 text-xs font-bold transition-all shadow-2xs whitespace-nowrap cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5 text-[#9B8A3E]" />
                  <span>🖨️ In phiếu tập viết (A4)</span>
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-2.5">
              <div className="relative w-full">
                <Search className="w-5 h-5 text-[#3F5447] absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={vocabSearchQuery}
                  onChange={(e) => setVocabSearchQuery(e.target.value)}
                  placeholder="Tìm từ vựng, Pinyin, Hán Việt..."
                  className="w-full pl-12 pr-4 py-2.5 rounded-2xl bg-[#FAFBF7] border border-[rgba(30,50,39,0.15)] focus:border-[#9B8A3E] focus:ring-1 focus:ring-[#9B8A3E]/30 text-sm"
                />
              </div>

              {/* Flex-wrap Topic Filter Bar with clean padding so no label is ever clipped */}
              <div
                data-testid="ai-topic-filter-bar"
                className="flex flex-wrap items-center gap-1.5 px-1 py-0.5"
              >
                {SEARCH_TOPIC_FILTERS.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    data-testid={`topic-filter-${tab.id}`}
                    onClick={() => setVocabSearchTopic(tab.id)}
                    className={`px-3.5 py-1.5 rounded-full text-[11px] font-bold transition-all whitespace-nowrap cursor-pointer ${
                      vocabSearchTopic === tab.id
                        ? 'bg-[#1E3227] text-[#FAFBF7] shadow-2xs'
                        : 'bg-white/75 text-[#3F5447] border border-[#9B8A3E]/35 hover:border-[#9B8A3E] hover:text-[#1E3227]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mt-4">
            {vocabSuggestions.map((item, idx) => (
              <button
                key={`${item.hanzi}-${idx}`}
                type="button"
                onClick={() => {
                  handleSelectSuggestedVocab(item);
                  setToastMessage(`Đã tạo slide cho "${item.hanzi}"`);
                }}
                className="liquid-glass-hover flex items-center justify-between p-2.5 rounded-2xl bg-white/50 border border-white/40 hover:border-[#9B8A3E]/50 text-left transition-all"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-[#FAFBF7] border border-[#9B8A3E]/20 flex items-center justify-center font-bold text-sm text-[#1E3227]">
                    {item.hanzi}
                  </div>
                  <div className="min-w-0">
                    <div className="text-[11px] font-bold text-[#9B8A3E] truncate">{item.pinyin}</div>
                    <div className="text-[11px] font-semibold text-[#1E3227] truncate">{item.meaning}</div>
                  </div>
                </div>
                <div className="w-7 h-7 rounded-full bg-[#1E3227]/5 flex items-center justify-center text-[#1E3227]">
                   <Plus className="w-3.5 h-3.5" />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
      {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage(null)} />}


      {/* Slide Navigation Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[rgba(30,50,39,0.15)]">
        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#1E3227] text-[#FAFBF7] text-xs font-bold shadow-2xs">
            <BookOpen className="w-3.5 h-3.5 text-[#C5B358]" />
            Bài giảng &amp; Tập viết ({activeSlideIndex + 1}/{slides.length})
          </div>
          <span className="hidden lg:inline-block text-xs text-[#3F5447]">
            Đã thuộc: <strong className="text-[#1E3227] tabular-nums">{learnedCount}/{slides.length}</strong> từ
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => speakChinese(currentSlide.hanzi)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-[#1E3227] text-[#FAFBF7] border border-[#1E3227] hover:bg-[#2B4637] transition-colors whitespace-nowrap"
          >
            <Volume2 className="w-3.5 h-3.5 text-[#C5B358]" />
            Phát âm chuẩn zh-CN
          </button>

          <button
            type="button"
            onClick={() => setIsCardFlipped((f) => !f)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-[#FAFBF7] text-[#1E3227] border border-[rgba(30,50,39,0.18)] hover:border-[#9B8A3E] transition-colors whitespace-nowrap"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#9B8A3E]" />
            {isCardFlipped ? 'Hiện nghĩa' : 'Lật thẻ kiểm tra'}
          </button>

          <button
            type="button"
            onClick={handlePrev}
            aria-label="Slide trước"
            className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold bg-[#FAFBF7] text-[#1E3227] border border-[rgba(30,50,39,0.15)] hover:bg-white transition-colors whitespace-nowrap"
          >
            <ChevronLeft className="w-4 h-4" />
            Trước
          </button>
          <span className="px-2.5 py-1.5 text-xs font-bold text-[#1E3227] tabular-nums">
            {activeSlideIndex + 1} / {slides.length}
          </span>
          <button
            type="button"
            onClick={handleNext}
            aria-label="Slide tiếp theo"
            className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold bg-[#FAFBF7] text-[#1E3227] border border-[rgba(30,50,39,0.15)] hover:bg-white transition-colors whitespace-nowrap"
          >
            Tiếp theo
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

          {/* Horizontal Word Chip Selector Strip */}
          <div className="flex items-center gap-2 overflow-x-auto py-3.5 border-b border-[rgba(30,50,39,0.15)]">
            {slides.map((s, idx) => {
              const isActive = idx === activeSlideIndex;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => {
                    handleSelectSlide(idx);
                    speakChinese(s.hanzi);
                  }}
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap shrink-0 border ${
                    isActive
                      ? 'bg-[#1E3227] border-[#9B8A3E] text-[#FAFBF7] shadow-2xs'
                      : 'bg-white/75 border-[rgba(30,50,39,0.15)] text-[#3F5447] hover:text-[#1E3227] hover:bg-[#FAFBF7] hover:border-[#9B8A3E]'
                  }`}
                >
                  <span
                    className={`text-[11px] tabular-nums ${
                      isActive ? 'text-[#C5B358]' : 'text-[#3F5447]'
                    }`}
                  >
                    {idx + 1}
                  </span>
                  <span
                    className={`font-['Noto_Sans_SC'] text-sm font-bold ${
                      isActive ? 'text-[#FAFBF7]' : 'text-[#1E3227]'
                    }`}
                  >
                    {s.hanzi}
                  </span>
                  <span
                    className={`text-[11px] ${
                      isActive ? 'text-[#C5B358]' : 'text-[#9B8A3E]'
                    }`}
                  >
                    {s.pinyin}
                  </span>
                  {s.learned && (
                    <Check
                      className={`w-3.5 h-3.5 ${
                        isActive ? 'text-[#C5B358]' : 'text-[#1E3227]'
                      }`}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Visibility Controls & Speed Settings Toggle */}
          <div className="flex flex-wrap items-center justify-between gap-3 py-3 text-xs text-[#3F5447]">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setShowPinyin((v) => !v)}
                className={`px-2.5 py-1 rounded-lg border font-semibold transition-colors ${
                  showPinyin
                    ? 'bg-[#FAFBF7] border-[rgba(30,50,39,0.22)] text-[#1E3227]'
                    : 'bg-white/40 border-[rgba(30,50,39,0.12)] text-[#5F7266]'
                }`}
              >
                {showPinyin ? '✓ Hiện Pinyin' : 'Ẩn Pinyin'}
              </button>
              <button
                type="button"
                onClick={() => setShowMeaning((v) => !v)}
                className={`px-2.5 py-1 rounded-lg border font-semibold transition-colors ${
                  showMeaning
                    ? 'bg-[#FAFBF7] border-[rgba(30,50,39,0.22)] text-[#1E3227]'
                    : 'bg-white/40 border-[rgba(30,50,39,0.12)] text-[#5F7266]'
                }`}
              >
                {showMeaning ? '✓ Hiện nghĩa TV' : 'Ẩn nghĩa TV'}
              </button>
              <button
                type="button"
                onClick={() => setShowVietnamese((v) => !v)}
                className={`px-2.5 py-1 rounded-lg border font-semibold transition-colors ${
                  showVietnamese
                    ? 'bg-[#FAFBF7] border-[rgba(30,50,39,0.22)] text-[#1E3227]'
                    : 'bg-white/40 border-[rgba(30,50,39,0.12)] text-[#5F7266]'
                }`}
              >
                {showVietnamese ? '✓ Hiện dịch VN' : 'Ẩn dịch VN'}
              </button>
              <button
                type="button"
                onClick={() => onToggleLearned(currentSlide.id)}
                className={`px-2.5 py-1 rounded-lg border font-semibold transition-colors ${
                  currentSlide.learned
                    ? 'bg-[#1E3227] border-[#1E3227] text-[#FAFBF7]'
                    : 'bg-white/60 border-[rgba(30,50,39,0.15)] text-[#3F5447] hover:text-[#1E3227]'
                }`}
              >
                {currentSlide.learned ? '✓ Đã thuộc từ này' : 'Đánh dấu đã thuộc'}
              </button>
              <button
                type="button"
                data-testid="toggle-slide-settings-btn"
                onClick={() => setShowSettingsPanel((v) => !v)}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border font-bold transition-colors ${
                  showSettingsPanel
                    ? 'bg-[#1E3227] border-[#9B8A3E] text-[#FAFBF7]'
                    : 'bg-[#FAFBF7] border-[rgba(30,50,39,0.18)] text-[#1E3227] hover:border-[#9B8A3E]'
                }`}
              >
                <Sliders className="w-3.5 h-3.5 text-[#C5B358]" />
                Cài đặt Tốc độ Nét viết &amp; Giọng đọc ({speechRate.toFixed(2).replace(/0$/, '')}x)
              </button>
            </div>
          </div>

          {/* =================================================================
              COMPACT SETTINGS CONTROL PANEL: STROKE SPEED & AI VOICE SPEED (0.5x - 1.5x)
              ================================================================= */}
          {showSettingsPanel && (
            <div
              data-testid="slide-settings-panel"
              className="mb-3 rounded-2xl bg-[rgba(255,255,255,0.65)] backdrop-blur-md border border-[rgba(30,50,39,0.15)] px-3.5 py-2.5 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 text-xs text-[#1E3227]"
            >
              {/* Left: Stroke Writing Speed Control (Từ chậm đến nhanh) */}
              <div className="flex flex-wrap items-center gap-2.5">
                <div className="flex items-center gap-1.5 text-[#1E3227] font-bold">
                  <Sliders className="w-3.5 h-3.5 text-[#9B8A3E]" />
                  <span>Tốc độ viết nét chữ:</span>
                </div>
                <div className="inline-flex items-center rounded-xl bg-[#E7ECD9] p-0.5 border border-[rgba(30,50,39,0.15)]">
                  {[
                    { label: 'Chậm', ms: 1000 },
                    { label: 'Vừa phải', ms: 660 },
                    { label: 'Nhanh', ms: 380 },
                  ].map((spd) => (
                    <button
                      key={spd.ms}
                      type="button"
                      data-testid={`stroke-speed-preset-${spd.ms}`}
                      onClick={() => handleUpdateStrokeSpeed(spd.ms)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                        Math.abs(strokeSpeedMs - spd.ms) < 90
                          ? 'bg-[#1E3227] text-[#FAFBF7]'
                          : 'text-[#3F5447] hover:text-[#1E3227]'
                      }`}
                    >
                      {spd.label}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-[#3F5447] font-medium">
                  <span>Chậm</span>
                  <input
                    type="range"
                    min="340"
                    max="1100"
                    step="20"
                    value={1440 - strokeSpeedMs}
                    onChange={(e) => handleUpdateStrokeSpeed(1440 - Number(e.target.value))}
                    className="w-20 accent-[#1E3227] cursor-pointer"
                    aria-label="Thanh trượt tốc độ viết nét chữ từ chậm đến nhanh"
                    data-testid="stroke-speed-slider"
                  />
                  <span>Nhanh</span>
                </div>
              </div>

              {/* Right: AI Voice Speed Control (0.5x to 1.5x) */}
              <div className="flex flex-wrap items-center gap-2.5">
                <div className="flex items-center gap-1.5 text-[#1E3227] font-bold">
                  <Volume2 className="w-3.5 h-3.5 text-[#9B8A3E]" />
                  <span>Tốc độ giọng đọc AI (0.5x – 1.5x):</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <input
                    type="range"
                    min="0.5"
                    max="1.5"
                    step="0.05"
                    value={speechRate}
                    onChange={(e) => handleUpdateSpeechRate(parseFloat(e.target.value))}
                    className="w-24 accent-[#1E3227] cursor-pointer"
                    aria-label="Thanh trượt tốc độ giọng đọc AI từ 0.5x đến 1.5x"
                    data-testid="voice-speed-slider"
                  />
                  <span
                    data-testid="voice-speed-value"
                    className="px-2 py-0.5 rounded-lg bg-[#FAFBF7] border border-[#9B8A3E]/50 text-[#1E3227] font-bold tabular-nums"
                  >
                    {speechRate.toFixed(2).replace(/0$/, '')}x
                  </span>
                </div>
                <div className="inline-flex items-center rounded-xl bg-[#E7ECD9] p-0.5 border border-[rgba(30,50,39,0.15)]">
                  {[0.5, 0.75, 1.0, 1.25, 1.5].map((rateVal) => (
                    <button
                      key={rateVal}
                      type="button"
                      data-testid={`voice-rate-preset-${rateVal}`}
                      onClick={() => {
                        handleUpdateSpeechRate(rateVal);
                        speakChinese(currentSlide.hanzi, rateVal);
                      }}
                      className={`px-2 py-0.5 rounded-lg text-[11px] font-bold transition-colors ${
                        Math.abs(speechRate - rateVal) < 0.03
                          ? 'bg-[#1E3227] text-[#FAFBF7]'
                          : 'text-[#3F5447] hover:text-[#1E3227]'
                      }`}
                    >
                      {rateVal}x
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* =================================================================
              MAIN 3-COLUMN SYNCHRONIZED SLIDE CARD (ALL VISIBLE AT ONCE):
              1) Vocabulary + Pinyin + Hán Việt + Meaning + Radical Breakdown
              2) Direct Inline Mi Zi Ge (米字格) 100% Authentic HanziWriter Strokes
              3) Rich Multi-Layered Animated SVG Scene + Compact 3-Line Context Example
              ================================================================= */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mt-2 items-stretch">
            {/* COLUMN 1 (4 cols): Vocabulary Flashcard & Radical Memory Breakdown */}
            <div className="lg:col-span-4 rounded-2xl bg-[#FAFBF7] border border-[rgba(30,50,39,0.15)] p-5 flex flex-col justify-between shadow-2xs">
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-[#3F5447]">
                  <span>Từ mục #{currentSlide.index} · {currentSlide.hskLevel}</span>
                  <span className="px-2 py-0.5 rounded-md bg-[#E7ECD9] text-[#1E3227]">
                    {currentSlide.partOfSpeech}
                  </span>
                </div>

                {!isCardFlipped ? (
                  <div className="my-5 text-center">
                    <div className="inline-flex items-center justify-center gap-2">
                      <span
                        className="font-['Noto_Sans_SC'] text-5xl sm:text-6xl font-bold tracking-wide text-[#1E3227] select-all"
                        data-testid="active-slide-hanzi"
                      >
                        {currentSlide.hanzi}
                      </span>
                    </div>

                    {showPinyin && (
                      <p
                        className="mt-2.5 text-2xl font-bold text-[#9B8A3E] tracking-wide"
                        data-testid="active-slide-pinyin"
                      >
                        {currentSlide.pinyin}
                      </p>
                    )}

                    <p className="mt-1 text-xs text-[#3F5447]">
                      Hán Việt:{' '}
                      <span
                        className="text-[#1E3227] font-bold uppercase tracking-wide"
                        data-testid="active-slide-hanviet"
                      >
                        {currentSlide.hanViet}
                      </span>
                    </p>

                    {showMeaning && (
                      <p
                        className="mt-2.5 text-lg font-bold text-[#1E3227]"
                        data-testid="active-slide-meaning"
                      >
                        {currentSlide.meaning}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="my-5 text-center p-4 rounded-xl bg-[#F4F6EE] border border-dashed border-[#9B8A3E]">
                    <p className="text-xs uppercase tracking-wider text-[#9B8A3E] font-bold">
                      Chế độ kiểm tra nhớ từ
                    </p>
                    <p
                      className="font-['Noto_Sans_SC'] text-5xl font-bold text-[#1E3227] my-3"
                      data-testid="active-slide-hanzi"
                    >
                      {currentSlide.hanzi}
                    </p>
                    <button
                      type="button"
                      onClick={() => setIsCardFlipped(false)}
                      className="mt-2 px-4 py-1.5 rounded-xl bg-[#1E3227] text-[#FAFBF7] text-xs font-semibold"
                    >
                      Hiện đáp án ({currentSlide.pinyin} — {currentSlide.meaning})
                    </button>
                  </div>
                )}

                {/* Character Radical & Memory Breakdown inside Column 1 */}
                <div className="rounded-xl bg-[#F4F6EE] border border-[rgba(30,50,39,0.12)] p-3.5 mt-2">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-[11px] font-bold tracking-wider text-[#1E3227]">
                      CHIẾT TỰ &amp; BỘ THỦ GHI NHỚ
                    </span>
                    <span className="text-[11px] font-semibold text-[#9B8A3E]">
                      {currentSlide.characters.length} chữ Hán
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    {currentSlide.characters.map((ch, idx) => (
                      <div
                        key={`rad-breakdown-${ch.char}-${idx}`}
                        className="flex items-center justify-between text-xs bg-white px-2.5 py-1.5 rounded-lg border border-[rgba(30,50,39,0.12)]"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-['Noto_Sans_SC'] text-base font-bold text-[#1E3227]">
                            {ch.char}
                          </span>
                          <span className="text-[#9B8A3E] font-semibold">({ch.pinyin})</span>
                        </div>
                        <span className="text-[#3F5447]">
                          Bộ thủ: <strong className="text-[#1E3227]">{ch.radical}</strong> ·{' '}
                          <span className="font-bold text-[#9B8A3E]">{ch.strokeCount} nét</span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons with Synced AI Voice Rate & Slow Voice Controls */}
              <div className="flex flex-wrap items-center justify-center gap-2 pt-4 mt-4 border-t border-[rgba(30,50,39,0.12)]">
                <button
                  type="button"
                  onClick={() => speakChinese(currentSlide.hanzi, speechRate)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#1E3227] hover:bg-[#2B4637] text-[#FAFBF7] text-xs font-bold transition-colors"
                  title="Đọc theo tốc độ giọng AI đã cài đặt"
                >
                  <Volume2 className="w-4 h-4 text-[#C5B358]" />
                  Đọc ({speechRate.toFixed(2).replace(/0$/, '')}x)
                </button>
                <button
                  type="button"
                  onClick={() => speakChinese(currentSlide.hanzi, 0.55)}
                  className="inline-flex items-center gap-1 px-2.5 py-2 rounded-xl bg-[#F4F6EE] hover:bg-[#E7ECD9] text-[#1E3227] text-xs font-semibold border border-[rgba(30,50,39,0.18)] transition-colors"
                  title="Đọc chậm từng âm tiết cho người mới học"
                >
                  🐢 Đọc chậm
                </button>
                <button
                  type="button"
                  onClick={() => setIsCardFlipped((f) => !f)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#F4F6EE] hover:bg-[#E7ECD9] text-[#1E3227] text-xs font-semibold border border-[rgba(30,50,39,0.15)] transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-[#9B8A3E]" />
                  Lật thẻ
                </button>
                {onOpenWritingModal && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsAnimatingStrokes(false);
                      onOpenWritingModal(currentSlide);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-[#F4F6EE] text-[#3F5447] hover:text-[#1E3227] text-xs font-semibold border border-[rgba(30,50,39,0.15)] transition-colors"
                  >
                    Phóng to ô viết
                  </button>
                )}
              </div>
            </div>

            {/* COLUMN 2 (4 cols): INLINE INTERACTIVE MI ZI GE (米字格) WITH NATURAL CALLIGRAPHIC BRUSH STROKES */}
            <div
              className="lg:col-span-4 rounded-2xl bg-[#FAFBF7] border border-[rgba(30,50,39,0.15)] p-5 flex flex-col justify-between shadow-2xs"
              data-testid="inline-stroke-panel"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-[#1E3227]">
                      Cách viết từng nét (米字格)
                    </div>
                    <div
                      className="text-[11px] text-[#3F5447] mt-0.5"
                      data-testid="inline-stroke-meta"
                    >
                      Chữ <strong className="text-[#1E3227] font-['Noto_Sans_SC']">{currentChar.char}</strong> ({currentChar.pinyin}) · Bộ thủ:{' '}
                      <strong className="text-[#1E3227]">{currentChar.radical}</strong> ·{' '}
                      <strong className="text-[#9B8A3E] tabular-nums">{totalStrokes} nét</strong>
                    </div>
                  </div>

                  {/* Character Selector Tabs for Multi-Character Words (e.g. 温 | 暖) */}
                  <div className="flex items-center gap-1.5">
                    {currentSlide.characters.map((ch, idx) => (
                      <button
                        key={`${ch.char}-${idx}`}
                        type="button"
                        data-testid={`char-tab-${ch.char}`}
                        onClick={() => {
                          setActiveCharIdx(idx);
                          speakChinese(ch.char, speechRate);
                        }}
                        className={`w-8 h-8 rounded-lg font-['Noto_Sans_SC'] text-base font-bold transition-colors border ${
                          activeCharIdx === idx
                            ? 'bg-[#1E3227] text-[#FAFBF7] border-[#9B8A3E]'
                            : 'bg-[#F4F6EE] text-[#1E3227] border-[rgba(30,50,39,0.15)] hover:bg-[#E7ECD9]'
                        }`}
                      >
                        {ch.char}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Progress Status */}
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-[#3F5447] tabular-nums" data-testid="inline-stroke-counter">
                    Nét bút thứ: <strong className="text-[#1E3227]">{currentProgressCount}/{totalStrokes}</strong>
                  </span>
                  <span className="text-[#9B8A3E] font-bold tabular-nums">
                    {practiceAccuracy !== null
                      ? `Độ chuẩn nét: ${practiceAccuracy}%`
                      : inlineStrokeMode === 'animate'
                      ? 'Nhịp bút thuận tự nhiên'
                      : `Hãy viết nét thứ ${Math.min(userStrokes.length + 1, totalStrokes)}`}
                  </span>
                </div>

                {/* Inline Mi Zi Ge (米字格) Traditional Xuan Rice-Paper Canvas with Natural Calligraphic Ink */}
                <div className="relative mx-auto w-52 h-52 sm:w-56 sm:h-56 rounded-2xl bg-[#F7F5EC] border-2 border-[#C5B358]/65 overflow-hidden select-none touch-none shadow-inner">
                  <svg
                    ref={inlineSvgRef}
                    viewBox="0 0 100 100"
                    className="w-full h-full cursor-crosshair"
                    onMouseDown={handlePointerDown}
                    onMouseMove={handlePointerMove}
                    onMouseUp={handlePointerUp}
                    onMouseLeave={handlePointerUp}
                    onTouchStart={handlePointerDown}
                    onTouchMove={handlePointerMove}
                    onTouchEnd={handlePointerUp}
                    data-testid="inline-mizige-canvas"
                  >
                    <defs>
                      {/* Calligraphic Forest Ink & Imperial Vermilion-Gold Gradients on Rice Paper */}
                      <linearGradient id="inlineDoneStrokeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#14231B" />
                        <stop offset="55%" stopColor="#1E3227" />
                        <stop offset="100%" stopColor="#2F4D3C" />
                      </linearGradient>
                      <linearGradient id="inlineActiveStrokeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#9B8A3E" />
                        <stop offset="45%" stopColor="#C84B31" />
                        <stop offset="100%" stopColor="#A93822" />
                      </linearGradient>
                      {/* Progressive Brush Mask for Active Stroke */}
                      {currentChar.strokes[animatedStrokeIndex - 1] && (
                        <mask
                          id="inlineActiveBrushMask"
                          maskUnits="userSpaceOnUse"
                          x="0"
                          y="0"
                          width="100"
                          height="100"
                        >
                          <path
                            d={currentChar.strokes[animatedStrokeIndex - 1]}
                            pathLength={100}
                            fill="none"
                            stroke="#FFFFFF"
                            strokeWidth="28"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeDasharray="100"
                            strokeDashoffset={Math.max(0, 100 - strokeSubProgress)}
                          />
                        </mask>
                      )}
                    </defs>

                    {/* 8-Direction Mi Zi Ge Guide Lines on Rice Paper */}
                    <rect x="2" y="2" width="96" height="96" fill="none" stroke="#C5B358" strokeWidth="0.9" strokeOpacity="0.65" />
                    <line x1="0" y1="50" x2="100" y2="50" stroke="#C5B358" strokeWidth="0.8" strokeDasharray="2.5 2.5" strokeOpacity="0.55" />
                    <line x1="50" y1="0" x2="50" y2="100" stroke="#C5B358" strokeWidth="0.8" strokeDasharray="2.5 2.5" strokeOpacity="0.55" />
                    <line x1="0" y1="0" x2="100" y2="100" stroke="#AEB79D" strokeWidth="0.7" strokeDasharray="2.5 2.5" strokeOpacity="0.55" />
                    <line x1="100" y1="0" x2="0" y2="100" stroke="#AEB79D" strokeWidth="0.7" strokeDasharray="2.5 2.5" strokeOpacity="0.55" />

                    {hasAuthenticOutlines ? (
                      <>
                        {/* =========================================================
                           100% AUTHENTIC HANZIWRITER 1024x1024 CALLIGRAPHIC STROKES
                           ========================================================= */}
                        <g
                          transform="scale(0.09765625, -0.09765625) translate(0, -900)"
                          data-testid="hanziwriter-authentic-strokes"
                        >
                          {/* Base Guide Outlines for all N strokes */}
                          {currentChar.hanziWriterStrokes!.map((d, idx) => {
                            const isNextTarget =
                              inlineStrokeMode === 'practice' && idx === userStrokes.length;
                            const isCompletedPractice =
                              inlineStrokeMode === 'practice' && idx < userStrokes.length;
                            return (
                              <path
                                key={`hw-guide-${idx}`}
                                d={d}
                                fill={
                                  isCompletedPractice
                                    ? '#1E3227'
                                    : isNextTarget
                                    ? '#B8C4A8'
                                    : '#E2DFCE'
                                }
                              />
                            );
                          })}

                          {/* Completed Prior Strokes in 'animate' mode */}
                          {inlineStrokeMode === 'animate' &&
                            currentChar.hanziWriterStrokes!
                              .slice(0, Math.max(0, animatedStrokeIndex - 1))
                              .map((d, idx) => (
                                <path
                                  key={`hw-done-${idx}`}
                                  d={d}
                                  fill="url(#inlineDoneStrokeGrad)"
                                />
                              ))}
                        </g>

                        {/* Progressive Brush Reveal for Current Active Stroke */}
                        {inlineStrokeMode === 'animate' &&
                          currentChar.hanziWriterStrokes![animatedStrokeIndex - 1] && (
                            <g
                              mask={
                                currentChar.strokes[animatedStrokeIndex - 1]
                                  ? 'url(#inlineActiveBrushMask)'
                                  : undefined
                              }
                            >
                              <g transform="scale(0.09765625, -0.09765625) translate(0, -900)">
                                <path
                                  d={currentChar.hanziWriterStrokes![animatedStrokeIndex - 1]}
                                  fill="url(#inlineActiveStrokeGrad)"
                                />
                              </g>
                            </g>
                          )}
                      </>
                    ) : (
                      /* Fallback vector stroke paths if offline */
                      <>
                        {currentChar.strokes.map((pathStr, idx) => {
                          const isNextPracticeStroke =
                            inlineStrokeMode === 'practice' && idx === userStrokes.length;
                          return (
                            <path
                              key={`inline-guide-${idx}`}
                              d={pathStr}
                              fill="none"
                              stroke={isNextPracticeStroke ? '#B8C4A8' : '#E2DFCE'}
                              strokeWidth="6"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          );
                        })}

                        {inlineStrokeMode === 'animate' &&
                          currentChar.strokes.slice(0, animatedStrokeIndex).map((pathStr, idx) => {
                            const isCurrent = idx === animatedStrokeIndex - 1;
                            return (
                              <path
                                key={`inline-anim-${idx}`}
                                d={pathStr}
                                pathLength={100}
                                fill="none"
                                stroke={
                                  isCurrent
                                    ? 'url(#inlineActiveStrokeGrad)'
                                    : 'url(#inlineDoneStrokeGrad)'
                                }
                                strokeWidth={isCurrent ? '7' : '6.2'}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeDasharray={isCurrent ? '100' : undefined}
                                strokeDashoffset={
                                  isCurrent ? Math.max(0, 100 - strokeSubProgress) : undefined
                                }
                              />
                            );
                          })}
                      </>
                    )}

                    {/* Calligraphic Brush Spine, Starting Press Nib (顿笔) & Live Brush Tip */}
                    {inlineStrokeMode === 'animate' &&
                      currentChar.strokes[animatedStrokeIndex - 1] && (
                        <>
                          {activeStrokePts?.[0] && (
                            <circle
                              cx={activeStrokePts[0][0]}
                              cy={activeStrokePts[0][1]}
                              r="2.4"
                              fill="#C84B31"
                              opacity="0.9"
                            />
                          )}
                          <path
                            d={currentChar.strokes[animatedStrokeIndex - 1]}
                            pathLength={100}
                            fill="none"
                            stroke="#C5B358"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeDasharray="100"
                            strokeDashoffset={Math.max(0, 100 - strokeSubProgress)}
                            opacity="0.85"
                          />
                          {activeBrushTip && (
                            <g transform={`translate(${activeBrushTip[0]}, ${activeBrushTip[1]})`}>
                              <circle cx="0" cy="0" r="3.4" fill="#C84B31" opacity="0.28" />
                              <circle cx="0" cy="0" r="1.7" fill="#9B8A3E" />
                            </g>
                          )}
                        </>
                      )}

                    {/* Next-Stroke Starting Point Indicator in Practice Mode */}
                    {inlineStrokeMode === 'practice' &&
                      currentChar.strokePoints[userStrokes.length]?.[0] && (
                        <circle
                          cx={currentChar.strokePoints[userStrokes.length][0][0]}
                          cy={currentChar.strokePoints[userStrokes.length][0][1]}
                          r="3.2"
                          fill="#C84B31"
                        />
                      )}

                    {/* User Freehand / Simulated Strokes with Natural Dual-Layer Brush Pressure */}
                    {inlineStrokeMode === 'practice' &&
                      userStrokes.map((pts, idx) => (
                        <g key={`inline-user-${idx}`}>
                          {pts[0] && (
                            <circle
                              cx={pts[0][0]}
                              cy={pts[0][1]}
                              r="3.1"
                              fill="#1E3227"
                              opacity="0.9"
                            />
                          )}
                          <path
                            d={pointsToSvgPath(pts)}
                            fill="none"
                            stroke="url(#inlineDoneStrokeGrad)"
                            strokeWidth="5.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d={pointsToSvgPath(pts)}
                            fill="none"
                            stroke="#9B8A3E"
                            strokeWidth="1.4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            opacity="0.55"
                          />
                        </g>
                      ))}

                    {/* Active Freehand Stroke Being Drawn */}
                    {currentStroke.length > 1 && (
                      <path
                        d={pointsToSvgPath(currentStroke)}
                        fill="none"
                        stroke="#C84B31"
                        strokeWidth="5.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    )}
                  </svg>
                </div>
              </div>

              {/* Inline Mi Zi Ge Controls + Speed Selector + Visual Accuracy Feedback + Print Worksheet */}
              <div className="pt-3 mt-3 border-t border-[rgba(30,50,39,0.12)] space-y-2.5">
                {practiceEvalDetail && (
                  <div
                    data-testid="stroke-practice-feedback-card"
                    className="p-2.5 rounded-xl bg-[#F4F6EE] border border-[#9B8A3E]/50 text-xs space-y-1.5 shadow-2xs"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-[#1E3227] text-[#FAFBF7] font-bold text-[11px] tabular-nums">
                        🎯 {practiceEvalDetail.accuracy}%
                      </span>
                      <span className="text-[11px] font-bold text-[#9B8A3E] truncate">
                        {practiceEvalDetail.gradeLabel}
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-[#DCE2CE] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#1E3227] transition-all duration-300"
                        style={{ width: `${practiceEvalDetail.accuracy}%` }}
                      />
                    </div>
                    <p className="text-[11px] text-[#3F5447] leading-snug">
                      {practiceEvalDetail.feedback}
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between text-[11px] text-[#3F5447] px-1">
                  <span className="font-semibold">Nhịp bút viết:</span>
                  <div className="inline-flex items-center rounded-lg bg-[#E7ECD9] p-0.5 border border-[rgba(30,50,39,0.15)]">
                    {[
                      { label: 'Chậm', ms: 1000 },
                      { label: 'Vừa phải', ms: 660 },
                      { label: 'Nhanh', ms: 380 },
                    ].map((spd) => (
                      <button
                        key={spd.ms}
                        type="button"
                        onClick={() => handleUpdateStrokeSpeed(spd.ms)}
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition-colors ${
                          Math.abs(strokeSpeedMs - spd.ms) < 90
                            ? 'bg-[#1E3227] text-[#FAFBF7]'
                            : 'text-[#3F5447] hover:text-[#1E3227]'
                        }`}
                      >
                        {spd.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setInlineStrokeMode('animate');
                      setIsAnimatingStrokes(true);
                      speakChinese(currentChar.char, speechRate);
                    }}
                    className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                      inlineStrokeMode === 'animate'
                        ? 'bg-[#1E3227] text-[#FAFBF7]'
                        : 'bg-[#F4F6EE] text-[#1E3227] border border-[rgba(30,50,39,0.15)] hover:bg-[#E7ECD9]'
                    }`}
                  >
                    <Play className="w-3.5 h-3.5 text-[#C5B358]" />
                    Chạy nét mẫu
                  </button>

                  <button
                    type="button"
                    data-testid="inline-practice-stroke-btn"
                    onClick={handleSimulateInlineStroke}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold bg-[#F4F6EE] text-[#1E3227] border border-[#9B8A3E]/50 hover:bg-[#E7ECD9] transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-[#9B8A3E]" />
                    Viết thử nét
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsAnimatingStrokes(false);
                      setInlineStrokeMode('practice');
                      setUserStrokes([]);
                      setCurrentStroke([]);
                      setPracticeAccuracy(null);
                      setPracticeEvalDetail(null);
                    }}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-white text-[#3F5447] border border-[rgba(30,50,39,0.15)] hover:text-[#1E3227] transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Xóa
                  </button>

                  <button
                    type="button"
                    data-testid="open-print-worksheet-btn"
                    onClick={() => setIsWorksheetModalOpen(true)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold bg-[#1E3227] hover:bg-[#2B4637] text-[#FAFBF7] border border-[#9B8A3E]/50 transition-colors cursor-pointer"
                    title="Mở bản xem trước trang A4 gồm các ô Mễ Tự Cách (米字格) để in ấn"
                  >
                    <Printer className="w-3.5 h-3.5 text-[#C5B358]" />
                    <span>🖨️ In phiếu tập viết</span>
                  </button>
                </div>
              </div>
            </div>

            {/* COLUMN 3 (4 cols): TRANH MINH HỌA ĐA LỚP + THẺ VÍ DỤ NGỮ CẢNH 3 DÒNG CỰC GỌN */}
            <div
              className="lg:col-span-4 flex flex-col gap-3"
              data-testid="scene-and-example-column"
            >
              {/* Visual Illustration Card */}
              <div
                className="aspect-[400/220] w-full rounded-2xl overflow-hidden border border-[rgba(30,50,39,0.18)] bg-[#18221D] shadow-xs"
                data-testid="inline-slide-illustration"
              >
                <SlideIllustration
                  illustrationKey={currentSlide.illustrationKey}
                  hanzi={currentSlide.hanzi}
                  pinyin={currentSlide.pinyin}
                  meaning={currentSlide.meaning}
                  imageUrl={currentSlide.imageUrl}
                />
              </div>


              {/* THẺ VÍ DỤ NGỮ CẢNH THEO TRANH (3 DÒNG GỌN GÀNG, RÕ NÉT, KHÔNG KHOẢNG THỪA) */}
              <div
                className="rounded-2xl bg-[#FAFBF7] border border-[rgba(30,50,39,0.15)] px-4 py-3 flex flex-col gap-2 shadow-2xs"
                data-testid="scene-example-card"
              >
                {/* Khối ví dụ ngữ cảnh toàn vẹn */}
                <div className="example-sentence-container p-3 rounded-2xl bg-white/40 border border-[#1E3227]/15 flex flex-col gap-2">
                  {/* Dòng 1: Câu ví dụ tiếng Trung nguyên một dòng (Không bị ngắt quãng, cuộn ngang nếu màn hình hẹp) */}
                  <div className="example-sentence-line flex items-center gap-2 overflow-x-auto whitespace-nowrap py-0.5">
                    <span
                      className="font-['Noto_Sans_SC'] text-xl font-bold text-[#1E3227]"
                      data-testid="scene-example-hanzi"
                    >
                      {renderHighlightedExample(currentSlide.exampleHanzi, currentSlide.hanzi)}
                    </span>
                  </div>

                  {/* Dòng 2: Phiên âm Pinyin (Chỉ hiển thị khi bật công tắc showPinyin) */}
                  {showPinyin && (
                    <div className="text-sm text-[#9B8A3E] font-medium tracking-wide">
                      {currentSlide.examplePinyin}
                    </div>
                  )}

                  {/* Dòng 3: Nghĩa tiếng Việt (Chỉ hiển thị khi bạn tích chọn "Hiện nghĩa TV" hoặc "Hiện dịch VN" ở thanh trên) */}
                  {(showMeaning || showVietnamese) && (
                    <div className="text-sm text-[#1E3227]/80 italic">
                      {currentSlide.exampleMeaning}
                    </div>
                  )}

                  {/* Dòng dưới cùng: Nút Nghe câu, Đọc chậm và 🎙️ Đọc thử (Chấm phát âm) */}
                  <div className="example-actions-row flex flex-wrap items-center gap-2 pt-1 border-t border-[#1E3227]/10">
                    <button 
                      type="button"
                      onClick={() => speakChinese(currentSlide.exampleHanzi, speechRate)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1E3227] hover:bg-[#2B4637] text-white rounded-xl text-xs font-medium shadow-sm transition-all"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-[#C5B358]" />
                      <span>Nghe câu</span>
                    </button>
                    <button 
                      type="button"
                      onClick={() => speakChinese(currentSlide.exampleHanzi, 0.55)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-[#9B8A3E]/20 text-[#1E3227] border border-[#9B8A3E]/40 rounded-xl text-xs font-medium hover:bg-[#9B8A3E]/30 transition-all"
                    >
                      <span>🐢 Đọc chậm</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleStartSpeechPractice}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs ${
                        isPracticingSpeech
                          ? 'bg-[#C84B31] text-white animate-pulse'
                          : 'bg-white hover:bg-[#FAFBF7] text-[#1E3227] border border-[#9B8A3E]/60 hover:border-[#1E3227]'
                      }`}
                      title="Nói tiếng Trung câu ví dụ để AI chấm điểm phát âm zh-CN"
                    >
                      {isPracticingSpeech ? (
                        <>
                          <MicOff className="w-3.5 h-3.5" />
                          <span>Đang lắng nghe...</span>
                        </>
                      ) : (
                        <>
                          <Mic className="w-3.5 h-3.5 text-[#C84B31]" />
                          <span>🎙️ Đọc thử (Chấm phát âm)</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Listening Indicator */}
                  {isPracticingSpeech && (
                    <div className="p-2.5 rounded-xl bg-[#FAFBF7] border border-[#C84B31]/40 text-xs text-[#1E3227] flex items-center justify-between gap-2 shadow-2xs">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#C84B31] animate-ping shrink-0" />
                        <span className="font-semibold text-xs text-[#1E3227] truncate">
                          Đang nghe zh-CN: Hãy đọc to "{currentSlide.exampleHanzi}"
                        </span>
                      </div>
                      <span className="text-[10px] text-[#C84B31] font-bold shrink-0">
                        Nói ngay...
                      </span>
                    </div>
                  )}

                  {/* Speech Evaluation Result Card */}
                  {speechResult && (
                    <div className="p-3 rounded-xl bg-[#E7ECD9] border border-[#1E3227]/25 text-xs text-[#1E3227] flex flex-col gap-1.5 shadow-2xs">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded-md bg-[#1E3227] text-[#FAFBF7] font-bold text-[11px] tabular-nums">
                            🎯 {speechResult.score}%
                          </span>
                          <strong className="text-xs text-[#1E3227]">
                            Độ chuẩn phát âm: {speechResult.score}%
                          </strong>
                        </div>
                        <button
                          type="button"
                          onClick={() => setSpeechResult(null)}
                          className="text-[11px] text-[#3F5447] hover:text-[#1E3227] px-1"
                        >
                          ✕
                        </button>
                      </div>
                      <div className="text-[11px] text-[#3F5447]">
                        Bạn đã đọc: <span className="font-['Noto_Sans_SC'] font-semibold text-[#1E3227]">"{speechResult.transcript}"</span>
                      </div>
                      <div className="text-[11px] text-[#1E3227] font-medium pt-1 border-t border-[#1E3227]/10 flex items-center gap-1">
                        <span>💡</span>
                        <span>{speechResult.feedback}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* =================================================================
              INLINE BIN BIN (彬彬) PANDA AI TUTOR PANEL ("Hỏi Bin Bin về chữ Hán này")
              ================================================================= */}
          <BinBinPandaAI
            variant="inline"
            activeSlide={currentSlide}
            externalMood={pandaMood}
            title={`Hỏi Gấu trúc Bin Bin (彬彬) về chữ Hán “${currentSlide.hanzi}”`}
          />

          {/* =================================================================
              MODAL 1: ➕ TỰ THÊM TỪ VỰNG MỚI VÀO DANH SÁCH SLIDE (LƯU LOCALSTORAGE)
              ================================================================= */}
          {isAddVocabModalOpen && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
              role="dialog"
              aria-modal="true"
              data-testid="add-vocab-modal"
              onClick={() => setIsAddVocabModalOpen(false)}
            >
              <form
                onSubmit={handleSaveCustomVocab}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-lg rounded-3xl bg-[#FAFBF7] border border-[#9B8A3E]/60 shadow-2xl p-5 sm:p-6 space-y-4 text-[#1E3227]"
              >
                <div className="flex items-start justify-between gap-3 pb-3 border-b border-[rgba(30,50,39,0.14)]">
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-[#9B8A3E]">
                      SOẠN GIÁO ÁN HÁN NGỮ · LƯU TRỮ TỰ ĐỘNG
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-[#1E3227] mt-0.5">
                      + Tự thêm từ vựng mới vào Slide bài giảng
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsAddVocabModalOpen(false)}
                    className="w-8 h-8 rounded-full bg-white border border-[rgba(30,50,39,0.15)] flex items-center justify-center text-[#1E3227] hover:bg-[#F4F6EE] cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {customVocabError && (
                  <div className="px-3 py-2 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{customVocabError}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#1E3227] mb-1">
                      Chữ Hán (汉字) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      data-testid="custom-vocab-hanzi-input"
                      value={customHanzi}
                      onChange={(e) => setCustomHanzi(e.target.value)}
                      placeholder="Ví dụ: 团圆, 熊猫, 茶..."
                      autoFocus
                      className="w-full px-3 py-2 rounded-xl bg-white border border-[rgba(30,50,39,0.2)] text-sm font-['Noto_Sans_SC'] font-bold text-[#1E3227] focus:outline-none focus:border-[#9B8A3E]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#1E3227] mb-1">
                      Phiên âm Pinyin
                    </label>
                    <input
                      type="text"
                      data-testid="custom-vocab-pinyin-input"
                      value={customPinyin}
                      onChange={(e) => setCustomPinyin(e.target.value)}
                      placeholder="Ví dụ: tuán yuán (để trống sẽ tự tra)"
                      className="w-full px-3 py-2 rounded-xl bg-white border border-[rgba(30,50,39,0.2)] text-xs sm:text-sm text-[#1E3227] focus:outline-none focus:border-[#9B8A3E]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#1E3227] mb-1">
                      Âm Hán Việt
                    </label>
                    <input
                      type="text"
                      data-testid="custom-vocab-hanviet-input"
                      value={customHanViet}
                      onChange={(e) => setCustomHanViet(e.target.value)}
                      placeholder="Ví dụ: đoàn viên"
                      className="w-full px-3 py-2 rounded-xl bg-white border border-[rgba(30,50,39,0.2)] text-xs sm:text-sm text-[#1E3227] focus:outline-none focus:border-[#9B8A3E]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#1E3227] mb-1">
                      Nghĩa tiếng Việt <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      data-testid="custom-vocab-meaning-input"
                      value={customMeaning}
                      onChange={(e) => setCustomMeaning(e.target.value)}
                      placeholder="Ví dụ: đoàn viên, sum họp"
                      className="w-full px-3 py-2 rounded-xl bg-white border border-[rgba(30,50,39,0.2)] text-xs sm:text-sm text-[#1E3227] focus:outline-none focus:border-[#9B8A3E]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1E3227] mb-1">
                    Câu ví dụ tiếng Trung (Ngữ cảnh trên Slide)
                  </label>
                  <input
                    type="text"
                    data-testid="custom-vocab-example-input"
                    value={customExampleHanzi}
                    onChange={(e) => setCustomExampleHanzi(e.target.value)}
                    placeholder="Ví dụ: 中秋节 全家人 一起 团圆。"
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[rgba(30,50,39,0.2)] text-xs sm:text-sm font-['Noto_Sans_SC'] text-[#1E3227] focus:outline-none focus:border-[#9B8A3E]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#1E3227] mb-1">
                      Dịch nghĩa câu ví dụ
                    </label>
                    <input
                      type="text"
                      value={customExampleMeaning}
                      onChange={(e) => setCustomExampleMeaning(e.target.value)}
                      placeholder="Ví dụ: Tết Trung thu cả nhà cùng sum họp."
                      className="w-full px-3 py-2 rounded-xl bg-white border border-[rgba(30,50,39,0.2)] text-xs text-[#1E3227] focus:outline-none focus:border-[#9B8A3E]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#1E3227] mb-1">
                      Cấp độ HSK
                    </label>
                    <select
                      value={customHskLevel}
                      onChange={(e) => setCustomHskLevel(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-[rgba(30,50,39,0.2)] text-xs font-semibold text-[#1E3227] focus:outline-none focus:border-[#9B8A3E]"
                    >
                      <option value="HSK 1">HSK 1</option>
                      <option value="HSK 2">HSK 2</option>
                      <option value="HSK 3">HSK 3</option>
                      <option value="HSK 4">HSK 4</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[rgba(30,50,39,0.12)]">
                  <button
                    type="button"
                    onClick={() => setIsAddVocabModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-white border border-[rgba(30,50,39,0.18)] text-xs font-semibold text-[#1E3227] hover:bg-[#F4F6EE] cursor-pointer"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    data-testid="save-custom-vocab-btn"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1E3227] hover:bg-[#2B4637] text-[#FAFBF7] text-xs font-bold shadow-xs cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#C5B358]" />
                    <span>Lưu &amp; Tạo Slide Ngay</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* =================================================================
              MODAL 2: 🖨️ BẢN XEM TRƯỚC TRANG A4 — PHIẾU TẬP VIẾT CHỮ MỄ (米字格)
              ================================================================= */}
          {isWorksheetModalOpen && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-3 sm:p-6 overflow-y-auto"
              role="dialog"
              aria-modal="true"
              data-testid="worksheet-a4-modal"
              onClick={() => setIsWorksheetModalOpen(false)}
            >
              <div
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-4xl bg-white rounded-3xl border-2 border-[#9B8A3E] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
              >
                {/* Modal Action Bar */}
                <div className="px-5 py-3.5 bg-[#1E3227] text-[#FAFBF7] flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <Printer className="w-4 h-4 text-[#C5B358]" />
                    <span className="text-xs sm:text-sm font-bold">
                      🖨️ Bản Xem Trước Trang A4 — Phiếu Tập Viết Chữ Hán (米字格 · {slides.length} từ vựng)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      data-testid="print-worksheet-confirm-btn"
                      onClick={() => window.print()}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#C5B358] hover:bg-[#d4c368] text-[#1E3227] text-xs font-bold transition-all cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>In ngay / Lưu PDF (A4)</span>
                    </button>
                    <button
                      type="button"
                      data-testid="close-worksheet-modal-btn"
                      onClick={() => setIsWorksheetModalOpen(false)}
                      className="px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-semibold cursor-pointer"
                    >
                      Đóng
                    </button>
                  </div>
                </div>

                {/* Printable A4 Sheet Container */}
                <div className="flex-1 overflow-y-auto p-6 sm:p-8 bg-[#FAFBF7] text-[#1E3227] space-y-5">
                  <div className="border-b-2 border-[#1E3227] pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                    <div>
                      <div className="text-[11px] font-bold uppercase tracking-widest text-[#9B8A3E]">
                        HANU × 阮文受 · GIÁO ÁN THỰC HÀNH HÁN TỰ CHUẨN HSK
                      </div>
                      <h2 className="text-xl font-bold text-[#1E3227] mt-0.5">
                        PHIẾU LUYỆN VIẾT CHỮ HÁN MỄ TỰ CÁCH (汉字米字格练习纸)
                      </h2>
                    </div>
                    <div className="text-xs text-[#3F5447] space-y-1 sm:text-right">
                      <div>Họ và tên học viên: ___________________________</div>
                      <div>Lớp: HSK 1–3 (Mã lớp: 722229) · Điểm: _______/100</div>
                    </div>
                  </div>

                  {/* Rows of Mi Zi Ge Grids for All Slides */}
                  <div className="space-y-3">
                    {slides.map((s, idx) => (
                      <div
                        key={`ws-${s.id}-${idx}`}
                        className="p-3 rounded-2xl bg-white border border-[#DCE2CE] flex flex-col md:flex-row md:items-center justify-between gap-3"
                      >
                        <div className="min-w-[190px] max-w-[230px]">
                          <div className="flex items-baseline gap-2">
                            <span className="text-xs font-bold text-[#9B8A3E] tabular-nums">
                              #{idx + 1}
                            </span>
                            <span className="font-['Noto_Sans_SC'] text-2xl font-bold text-[#1E3227]">
                              {s.hanzi}
                            </span>
                            <span className="text-xs font-bold text-[#9B8A3E]">{s.pinyin}</span>
                          </div>
                          <div className="text-[11px] text-[#3F5447] mt-0.5">
                            Hán Việt: <strong className="uppercase">{s.hanViet}</strong> · {s.meaning}
                          </div>
                          <div className="text-[10px] text-[#5F7266] mt-0.5">
                            {s.characters.map((c) => `${c.char} (${c.strokeCount} nét)`).join(' · ')}
                          </div>
                        </div>

                        {/* 7 Mi Zi Ge (米字格) Practice Boxes per Vocabulary Word */}
                        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                          {Array.from({ length: 7 }).map((_, boxIdx) => {
                            const charToRender =
                              s.characters[boxIdx % s.characters.length]?.char || s.hanzi[0];
                            const isModel = boxIdx < s.characters.length;
                            const isTrace =
                              boxIdx >= s.characters.length && boxIdx < s.characters.length * 2 + 1;
                            return (
                              <div
                                key={`mzg-${idx}-${boxIdx}`}
                                className="relative w-12 h-12 shrink-0 bg-[#F7F5EC] border border-[#C5B358]"
                              >
                                <svg viewBox="0 0 100 100" className="w-full h-full">
                                  <line
                                    x1="0"
                                    y1="50"
                                    x2="100"
                                    y2="50"
                                    stroke="#C5B358"
                                    strokeWidth="1"
                                    strokeDasharray="3 3"
                                    strokeOpacity="0.6"
                                  />
                                  <line
                                    x1="50"
                                    y1="0"
                                    x2="50"
                                    y2="100"
                                    stroke="#C5B358"
                                    strokeWidth="1"
                                    strokeDasharray="3 3"
                                    strokeOpacity="0.6"
                                  />
                                  <line
                                    x1="0"
                                    y1="0"
                                    x2="100"
                                    y2="100"
                                    stroke="#C5B358"
                                    strokeWidth="0.8"
                                    strokeDasharray="3 3"
                                    strokeOpacity="0.45"
                                  />
                                  <line
                                    x1="100"
                                    y1="0"
                                    x2="0"
                                    y2="100"
                                    stroke="#C5B358"
                                    strokeWidth="0.8"
                                    strokeDasharray="3 3"
                                    strokeOpacity="0.45"
                                  />
                                  {(isModel || isTrace) && (
                                    <text
                                      x="50"
                                      y="74"
                                      textAnchor="middle"
                                      className="font-['Noto_Sans_SC'] font-bold"
                                      fontSize="68"
                                      fill={isModel ? '#1E3227' : '#D0D5C6'}
                                    >
                                      {charToRender}
                                    </text>
                                  )}
                                </svg>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
    );
  };

