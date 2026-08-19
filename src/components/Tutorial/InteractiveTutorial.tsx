import React from 'react';
import { 
  GraduationCap, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  X, 
  Sparkles, 
  Play, 
  Radio, 
  Zap, 
  ShieldCheck, 
  ShoppingBag 
} from 'lucide-react';

interface InteractiveTutorialProps {
  step: number;
  onNext: () => void;
  onPrev: () => void;
  onFinish: () => void;
}

interface StepContent {
  title: string;
  badge: string;
  icon: React.ReactNode;
  instruction: string;
  tips: string;
  actionRequired?: string;
}

const TUTORIAL_STEPS: Record<number, StepContent> = {
  1: {
    title: '第一步：認識 PACE 四重防線',
    badge: '步驟 1 / 7 · 觀念建立',
    icon: <ShieldCheck className="w-6 h-6 text-cyan-400" />,
    instruction: '歡迎來到 PACE 通訊先鋒指揮部！在右側儀表板中，您擁有 [P] 主要、[A] 備用、[C] 應急、[E] 緊急 四個專屬槽位。目前您已裝備了起始的 [P] 5G 專網，但其他備援槽位仍是空缺！',
    tips: '💡 實務準則：當災害發生導致主要基地台斷網或停電時，只有備援槽位能拯救整支小隊！',
    actionRequired: '請閱讀說明後，點擊「下一步」開始組建備用防線！'
  },
  2: {
    title: '第二步：採購裝備並安裝至槽位',
    badge: '步驟 2 / 7 · 採購裝備',
    icon: <ShoppingBag className="w-6 h-6 text-cyan-400" />,
    instruction: '請在左下方「通訊裝備補給庫」中，找到【戰術跳頻無線電 (SINCGARS)】，點擊「裝備至 [A] 槽位」按鈕。',
    tips: '💡 提示：購買裝備會消耗 1 點行動點數 (AP) 與對應的物資資金 💰。',
    actionRequired: '👉 請在下方點擊【裝備至 [A] 槽位】'
  },
  3: {
    title: '第三步：使用戰術手牌補充資源',
    badge: '步驟 3 / 7 · 戰術支援',
    icon: <Zap className="w-6 h-6 text-purple-400" />,
    instruction: '通訊設備運作需要消耗電力 ⚡。目前您的電量較低，請在右側操作面板的「戰術手牌」中，點擊【機動柴油發電機】上的「啟動戰術」按鈕！',
    tips: '💡 戰術卡可以在關鍵時刻扭轉戰局，例如補充電力、獲得空投物資、或提升天線增益。',
    actionRequired: '👉 請點擊右側戰術手牌【機動柴油發電機】的「啟動戰術」'
  },
  4: {
    title: '第四步：執行野戰手搖充電',
    badge: '步驟 4 / 7 · 能源管理',
    icon: <Zap className="w-6 h-6 text-amber-400" />,
    instruction: '如果手牌沒有發電機，指揮官也可以消耗 1 點 AP 進行「野戰充能」來補充 2 點電力 ⚡。請點擊操作面板上的【野戰充能 (+2⚡)】按鈕！',
    tips: '💡 隨時保持蓄電池有電，才能在突發危機發生時順暢啟動高功率設備。',
    actionRequired: '👉 請點擊操作面板上的【野戰充能 (+2⚡) [1 AP]】'
  },
  5: {
    title: '第五步：發起廣播連通危機任務',
    badge: '步驟 5 / 7 · 核心連通',
    icon: <Radio className="w-6 h-6 text-emerald-400" />,
    instruction: '左上方出現了「暴風雪雪崩搜救呼叫」任務！由於暴風雪吹垮了基地台，[P] 槽位無法使用，但系統會自動 Fallback 切換至剛安裝的 [A] 戰術無線電連通！請點擊【發起廣播連通】！',
    tips: '💡 成功連通任務即可獲得勝利積分 (VP) 與物資獎勵 💰！',
    actionRequired: '👉 請在左上方任務卡點擊【發起廣播連通 (消耗 1 AP)】'
  },
  6: {
    title: '第六步：結束回合與結算',
    badge: '步驟 6 / 7 · 回合循環',
    icon: <Play className="w-6 h-6 text-cyan-400" />,
    instruction: '當 3 點行動點數 (AP) 使用完畢或完成本輪部署後，請點擊操作面板上的【結束本回合】按鈕。系統將自動補滿 AP 並自然回復少許電量與物資。',
    tips: '💡 率先達到 18 VP 或在 8 回合結束時分數最高者贏得勝利！',
    actionRequired: '👉 請點擊操作面板上的【結束本回合】'
  },
  7: {
    title: '🎉 實戰教學圓滿完成！',
    badge: '教學結業 · 榮譽認證',
    icon: <Sparkles className="w-6 h-6 text-amber-400" />,
    instruction: '太棒了！您已經掌握了 PACE 槽位組建、裝備採購、戰術卡運用、野戰充能與 Fallback 備援連通的所有核心技巧！現在您可以回到主選單，挑選 AI 對手數量或進行同機雙人對戰！',
    tips: '🏆 祝您在未來的戰場上，永遠保持生命線暢通！',
    actionRequired: '點擊下方按鈕即可開始您的第一場正式戰役！'
  }
};

export const InteractiveTutorial: React.FC<InteractiveTutorialProps> = ({
  step,
  onNext,
  onPrev,
  onFinish,
}) => {
  const currentStep = TUTORIAL_STEPS[step] || TUTORIAL_STEPS[1];
  const isFinalStep = step >= 7;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-2xl animate-fadeIn">
      <div className="rounded-2xl border-2 border-cyan-500/80 bg-slate-950/95 p-4 sm:p-5 shadow-2xl backdrop-blur-xl ring-4 ring-cyan-500/20">
        {/* Header */}
        <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-cyan-500/20 border border-cyan-500/30 text-cyan-400">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-mono font-bold text-cyan-400 uppercase tracking-wider block">
                {currentStep.badge}
              </span>
              <h3 className="text-sm sm:text-base font-bold text-slate-100">{currentStep.title}</h3>
            </div>
          </div>

          <button
            onClick={onFinish}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 text-xs font-mono flex items-center gap-1"
            title="跳過新手教學"
          >
            <X className="w-4 h-4" />
            <span className="hidden sm:inline">跳過教學</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="space-y-2 mb-3 text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
          <p className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80">
            {currentStep.instruction}
          </p>

          <div className="flex items-center justify-between text-xs font-mono text-cyan-300/90 bg-cyan-950/30 px-3 py-1.5 rounded-lg border border-cyan-500/20">
            <span>{currentStep.tips}</span>
          </div>

          {currentStep.actionRequired && (
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-300 bg-amber-950/40 px-3 py-1.5 rounded-lg border border-amber-500/40 animate-pulse">
              <span>{currentStep.actionRequired}</span>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          <div className="flex items-center gap-1.5">
            {step > 1 && (
              <button
                onClick={onPrev}
                className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-mono font-bold border border-slate-700 flex items-center gap-1 transition-all"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>上一步</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {!isFinalStep ? (
              <button
                onClick={onNext}
                className="px-4 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-mono font-black flex items-center gap-1 shadow-md shadow-cyan-500/20 transition-all active:scale-95"
              >
                <span>下一步</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={onFinish}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 text-xs font-mono font-black flex items-center gap-1.5 shadow-lg shadow-cyan-500/30 transition-all active:scale-95"
              >
                <Play className="w-4 h-4" />
                <span>進入正式戰場！</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
