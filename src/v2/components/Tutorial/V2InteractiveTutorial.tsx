import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GraduationCap, ArrowRight, ArrowLeft, X, Target, Lightbulb, Home, Play } from 'lucide-react';

interface V2InteractiveTutorialProps {
  step: number;
  onNext: () => void;
  onPrev: () => void;
  onFinish: (action: 'menu' | 'play') => void;
}

export interface TutorialStepDef {
  step: number;
  badge: string;
  title: string;
  task: string;
  detail: string;
  hint: string;
  targetSelector: string | null;
}

export const V2_TUTORIAL_STEPS: TutorialStepDef[] = [
  {
    step: 1,
    badge: '防線認知',
    title: '第一步：觀察指揮官 PACE 四重防線',
    task: '請檢視上方【PACE 防線面板】：[P] 為日常高頻寬的「智慧型手機與 Wi-Fi (公眾網)」，[A] 為第一備援「免執照對講機 (無線電波)」。',
    detail: '在真實應急通訊中，平日依賴手機（高頻寬視訊/數據），一旦大停電或基地台故障，立即切換為 [A] 對講機。兩者使用不同物理媒介，避免「共因失效」！',
    hint: '💡 檢視完畢後，請點擊下方「下一步」開始進行物資採購！',
    targetSelector: '[data-tutorial="pace-board"]',
  },
  {
    step: 2,
    badge: '物資採購',
    title: '第二步：至市場採購通訊裝備並指派槽位',
    task: '👉 請在下方【物資市場】點擊第一張【手持海事/銥星衛星電話】上的【採購裝備 (1 AP)】，並選擇放入 [C] 應急槽位！',
    detail: '手持衛星電話需 💰3 物資，具備耐天候抗性且不依賴地面基地台，是指揮官在極端天災中最可靠的第三道防線。點擊採購後選擇放入 [C] 槽即可完成！',
    hint: '💡 點擊市場第一張卡片上的【採購裝備】按鈕並指派至 [C] 槽！',
    targetSelector: '[data-tutorial="market-card-0"]',
  },
  {
    step: 3,
    badge: '戰術發動',
    title: '第三步：手牌戰術卡 0 AP 即時發動',
    task: '👉 請在右側控制台點擊手牌戰術卡【敏捷應急通訊協議】上的【即時發動 (0 AP)】！',
    detail: '手牌戰術卡為【0 AP 免費動作 (Free Action)】，打出不扣除 AP！《敏捷協議》生效後，本回合「防線對調」與「倉庫收存」將全部 0 AP！',
    hint: '💡 點擊手牌戰術卡右側的【即時發動 (0 AP)】按鈕！',
    targetSelector: '[data-tutorial="tactic-card-0"]',
  },
  {
    step: 4,
    badge: '戰術調度',
    title: '第四步：防線動態對調 (Swap) 與倉庫收存',
    task: '👉 請點擊防線上 [P] 槽手機上的【🔄 調換 (0 AP)】，並選擇與 [A] 槽對調！',
    detail: '因為《敏捷協議》生效中，防線調換完全不消耗 AP！你可以根據預期天災或任務頻寬需求，隨時調動防線的優先檢定順序。',
    hint: '💡 點擊 [P] 槽卡片上的【🔄 調換】並點擊 [A] 槽完成對調！',
    targetSelector: '[data-tutorial="pace-board"]',
  },
  {
    step: 5,
    badge: '通訊檢定',
    title: '第五步：發起第一次危機任務通訊檢定',
    task: '👉 請在左側【危機任務】點擊第一張【山區搜救通聯】上的【發起通訊檢定】！',
    detail: '該任務需 Medium 頻寬與視距通訊，你的防線將順利連通並獲得 🏆5 積分與 💰2 物資，並彈出【專家復盤講評】！',
    hint: '💡 點擊任務卡下方的【發起通訊檢定】按鈕！',
    targetSelector: '[data-tutorial="mission-card-0"]',
  },
  {
    step: 6,
    badge: '野戰充能',
    title: '第六步：緊急野戰充電維護電力',
    task: '👉 請在右側控制台點擊【緊急野戰充電 (+2 ⚡ | 1 AP)】！',
    detail: '通訊設備運作消耗了設備電力。點擊緊急充電補充 ⚡2 點電量，確保高耗電設備（如高功率電台或通訊車）能正常發動！',
    hint: '💡 點擊【緊急野戰充電】按鈕！',
    targetSelector: '[data-tutorial="recharge-btn"]',
  },
  {
    step: 7,
    badge: '天災迎擊',
    title: '第七步：結束回合並迎擊「全域物理天災」',
    task: '👉 請點擊【結束作戰回合 (End Turn)】，迎擊全域物理天災！',
    detail: '回合結束後將推進至第 2 週期並爆發【大範圍電網大斷電】！所有「公眾網/基地台」設備（如手機）將直接癱瘓標註紅標，而你的「對講機 (無線電)」與「衛星電話」則安然無恙！',
    hint: '💡 點擊【結束作戰回合 (End Turn)】按鈕！',
    targetSelector: '[data-tutorial="end-turn-btn"]',
  },
  {
    step: 8,
    badge: '結訓認證',
    title: '第八步：恭喜結訓！掌握 PACE 應急通訊精神',
    task: '🎉 恭喜指揮官！你已完全掌握 PACE 應急通訊先鋒的核心精髓！',
    detail: '你學會了：① [P] 手機 + [A] 對講機的標準配置 ② 衛星/有線多樣性防線 ③ 0 AP 戰術爆發 ④ 天災物理阻斷與 Fallback 階梯降級。現在開始自由指揮演習吧！',
    hint: '💡 點擊【完成教學，開始實戰】正式啟動自由作戰！',
    targetSelector: null,
  },
];

interface TargetRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function V2InteractiveTutorial({
  step,
  onNext,
  onPrev,
  onFinish,
}: V2InteractiveTutorialProps) {
  const current = V2_TUTORIAL_STEPS.find((s) => s.step === step) || V2_TUTORIAL_STEPS[0];
  const isLast = step === V2_TUTORIAL_STEPS.length;
  const [targetRect, setTargetRect] = useState<TargetRect | null>(null);
  const [showMisclickHint, setShowMisclickHint] = useState(false);
  const misclickTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Measure target element position
  const updateTargetRect = useCallback(() => {
    if (!current.targetSelector) {
      setTargetRect(null);
      return;
    }

    const el = document.querySelector(current.targetSelector);
    if (el) {
      const rect = el.getBoundingClientRect();
      setTargetRect({
        x: rect.left,
        y: rect.top,
        width: rect.width,
        height: rect.height,
      });
    } else {
      setTargetRect(null);
    }
  }, [current.targetSelector]);

  // Scroll target smoothly into view & update rect on step change
  useEffect(() => {
    if (!current.targetSelector) {
      setTargetRect(null);
      return;
    }

    const timer = setTimeout(() => {
      const el = document.querySelector(current.targetSelector!);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      updateTargetRect();
    }, 80);

    return () => clearTimeout(timer);
  }, [step, current.targetSelector, updateTargetRect]);

  // Keep rect updated during scroll, resize, or dynamic layout changes
  useEffect(() => {
    updateTargetRect();
    window.addEventListener('scroll', updateTargetRect, { passive: true });
    window.addEventListener('resize', updateTargetRect);

    // Short RAF interval to track animated elements smoothly
    const interval = setInterval(updateTargetRect, 250);

    return () => {
      window.removeEventListener('scroll', updateTargetRect);
      window.removeEventListener('resize', updateTargetRect);
      clearInterval(interval);
    };
  }, [updateTargetRect]);

  // Handle accidental clicks outside the spotlight cutout
  const handleBackdropClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMisclickHint(true);
    if (misclickTimerRef.current) clearTimeout(misclickTimerRef.current);
    misclickTimerRef.current = setTimeout(() => setShowMisclickHint(false), 2000);
  };

  const pad = 10;
  const isTargetInLowerHalf = Boolean(
    targetRect && targetRect.y + targetRect.height / 2 > (typeof window !== 'undefined' ? window.innerHeight * 0.55 : 500)
  );

  return (
    <>
      {/* 1. Global Dimmed Spotlight Mask (82% Opacity Dark Veil) */}
      <div className="fixed inset-0 z-[50] pointer-events-none transition-all duration-300">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <mask id="tutorial-spotlight-mask">
              {/* White area retains full dark backdrop */}
              <rect x="0" y="0" width="100%" height="100%" fill="white" />
              {/* Black cutout punches a transparent hole for the focused element */}
              {targetRect && (
                <rect
                  x={Math.max(0, targetRect.x - pad)}
                  y={Math.max(0, targetRect.y - pad)}
                  width={targetRect.width + pad * 2}
                  height={targetRect.height + pad * 2}
                  rx="18"
                  fill="black"
                  className="transition-all duration-300 ease-out"
                />
              )}
            </mask>
          </defs>
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill="rgba(3, 7, 18, 0.82)"
            mask="url(#tutorial-spotlight-mask)"
          />
        </svg>
      </div>

      {/* 2. Hit-testing Click Blockers (Prevents accidental misclicks outside the illuminated hole) */}
      {targetRect && (
        <div className="fixed inset-0 z-[51] pointer-events-none">
          {/* Top Blocker */}
          <div
            onClick={handleBackdropClick}
            style={{ height: Math.max(0, targetRect.y - pad) }}
            className="absolute top-0 left-0 right-0 pointer-events-auto cursor-not-allowed"
          />
          {/* Bottom Blocker */}
          <div
            onClick={handleBackdropClick}
            style={{ top: targetRect.y + targetRect.height + pad }}
            className="absolute bottom-0 left-0 right-0 pointer-events-auto cursor-not-allowed"
          />
          {/* Left Blocker */}
          <div
            onClick={handleBackdropClick}
            style={{
              top: Math.max(0, targetRect.y - pad),
              height: targetRect.height + pad * 2,
              width: Math.max(0, targetRect.x - pad),
            }}
            className="absolute left-0 pointer-events-auto cursor-not-allowed"
          />
          {/* Right Blocker */}
          <div
            onClick={handleBackdropClick}
            style={{
              top: Math.max(0, targetRect.y - pad),
              height: targetRect.height + pad * 2,
              left: targetRect.x + targetRect.width + pad,
            }}
            className="absolute right-0 pointer-events-auto cursor-not-allowed"
          />
        </div>
      )}

      {/* 3. Glowing Neon Halo & Target Pointer Indicator */}
      {targetRect && (
        <div
          style={{
            top: targetRect.y - pad,
            left: targetRect.x - pad,
            width: targetRect.width + pad * 2,
            height: targetRect.height + pad * 2,
          }}
          className="fixed pointer-events-none z-[52] rounded-2xl border-2 border-cyan-400 shadow-[0_0_35px_rgba(6,182,212,0.85)] animate-pulse transition-all duration-300"
        >
          {/* Animated Pointer Badge */}
          <div className="absolute -top-3.5 left-4 px-3 py-0.5 rounded-full bg-cyan-500 text-slate-950 font-black text-[11px] shadow-lg flex items-center gap-1.5 animate-bounce">
            <span>👉 請在此操作</span>
          </div>
        </div>
      )}

      {/* 4. Outside Misclick Tooltip Notification */}
      {showMisclickHint && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[80] px-4 py-2 rounded-2xl bg-purple-900 border border-purple-400 text-white font-black text-xs shadow-2xl animate-bounce flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-amber-300" />
          <span>💡 請依照步驟指示，點擊高亮區域進行操作！</span>
        </div>
      )}

      {/* 5. Main Step-by-Step Interactive Tutorial Card (Adaptive Top/Bottom Placement) */}
      <div className={`fixed ${isTargetInLowerHalf ? 'top-3 sm:top-6 animate-slideDown' : 'bottom-3 sm:bottom-6 animate-slideUp'} left-1/2 -translate-x-1/2 z-[70] w-full max-w-3xl px-3 sm:px-4 font-mono transition-all duration-300`}>
        <div className="rounded-3xl border-2 border-purple-500 bg-slate-950/95 p-4 sm:p-5 shadow-2xl backdrop-blur-xl flex flex-col gap-3 text-slate-100 relative shadow-purple-950/80">
          {/* Step Indicator & Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-purple-950 border border-purple-500/50 text-purple-300 shadow-md">
                <GraduationCap className="w-5 h-5 animate-bounce" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-purple-900/60 border border-purple-500/40 text-[10px] font-black text-purple-300 uppercase tracking-wider">
                    實戰新手教學 · 步驟 {step} / {V2_TUTORIAL_STEPS.length}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/40 text-[10px] font-black text-cyan-300">
                    {current.badge}
                  </span>
                </div>
                <h3 className="text-sm sm:text-base font-black text-slate-100 mt-0.5">
                  {current.title}
                </h3>
              </div>
            </div>

            <button
              onClick={() => onFinish('menu')}
              className="p-1.5 text-slate-400 hover:text-slate-100 rounded-xl hover:bg-slate-900 transition-all text-xs flex items-center gap-1 font-bold"
              title="退出教學回到主選單"
            >
              <span>退出教學</span>
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Action Task Banner (High Contrast Interactive Callout) */}
          <div className="tutorial-dialog-callout p-3 rounded-2xl bg-gradient-to-r from-purple-950/90 via-slate-900 to-cyan-950/80 border border-purple-500/50 flex flex-col gap-1.5 text-xs shadow-inner">
            <div className="flex items-center gap-2 text-purple-200 font-black">
              <Target className="w-4 h-4 text-purple-400 shrink-0 animate-pulse" />
              <span className="text-xs sm:text-sm">{current.task}</span>
            </div>

            <p className="text-slate-300 leading-relaxed text-[11px] sm:text-xs">
              {current.detail}
            </p>

            <div className="flex items-center gap-1.5 text-amber-300 text-[11px] font-bold pt-1 border-t border-white/5">
              <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>{current.hint}</span>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-1 gap-2 flex-wrap sm:flex-nowrap">
            <button
              onClick={onPrev}
              disabled={step === 1}
              className="px-3.5 py-1.5 rounded-xl border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> 上一步
            </button>

            <div className="hidden sm:flex items-center gap-1.5">
              {V2_TUTORIAL_STEPS.map((s) => (
                <div
                  key={s.step}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    s.step === step
                      ? 'w-6 bg-gradient-to-r from-purple-400 to-cyan-400 shadow-sm shadow-purple-400/50'
                      : s.step < step
                      ? 'w-2 bg-purple-600'
                      : 'w-2 bg-slate-800'
                  }`}
                />
              ))}
            </div>

            {isLast ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onFinish('menu')}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 font-bold text-xs transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
                >
                  <Home className="w-4 h-4 text-cyan-400" />
                  <span>返回主選單</span>
                </button>
                <button
                  onClick={() => onFinish('play')}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-cyan-400 hover:from-purple-400 hover:to-cyan-300 text-slate-950 font-black text-xs transition-all shadow-lg shadow-cyan-500/25 active:scale-95 flex items-center gap-1.5"
                >
                  <Play className="w-4 h-4" />
                  <span>展開正式演習！</span>
                </button>
              </div>
            ) : (
              <button
                onClick={onNext}
                className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-black text-xs transition-all shadow-md shadow-purple-500/25 active:scale-95 flex items-center gap-1"
              >
                <span>下一步</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
