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
    badge: '回合 1 · 步驟 1 / 9 · 觀念建立',
    icon: <ShieldCheck className="w-6 h-6 text-cyan-400" />,
    instruction: '歡迎來到 PACE 通訊先鋒指揮部！在上方儀表板中，您擁有 [P] 主要、[A] 備用、[C] 應急、[E] 緊急 四個專屬槽位。目前您已裝備了起始的 [P] 5G 專網，但其他備援槽位仍是空缺！',
    tips: '💡 實務準則：當災害發生導致主要基地台斷網或停電時，只有備援槽位能拯救整支小隊！',
    actionRequired: '請閱讀說明後，點擊「下一步」開始組建備用防線！'
  },
  2: {
    title: '第二步：採購裝備並安裝至 [A] 槽位',
    badge: '回合 1 · 步驟 2 / 9 · 採購裝備',
    icon: <ShoppingBag className="w-6 h-6 text-cyan-400" />,
    instruction: '請在左下方「通訊裝備補給庫」中，找到【戰術跳頻無線電 (SINCGARS)】，點擊「裝備至 [A] 槽位」按鈕。',
    tips: '💡 提示：購買裝備會消耗 1 點行動點數 (AP) 與對應的物資資金 💰。',
    actionRequired: '👉 請在下方點擊【裝備至 [A] 槽位 (消耗 1 AP)】'
  },
  3: {
    title: '第三步：使用戰術手牌補充資源',
    badge: '回合 1 · 步驟 3 / 9 · 戰術支援',
    icon: <Zap className="w-6 h-6 text-purple-400" />,
    instruction: '通訊設備運作需要消耗電力 ⚡。目前您的電量較低，請在右側操作面板的「戰術手牌」中，點擊【機動柴油發電機】上的「啟動戰術」按鈕！',
    tips: '💡 戰術卡可以在關鍵時刻扭轉戰局，例如補充電力、獲得空投物資、或提升天線增益。',
    actionRequired: '👉 請點擊右側戰術手牌【機動柴油發電機】的「啟動戰術 (消耗 1 AP)」'
  },
  4: {
    title: '第四步：發起廣播連通危機任務',
    badge: '回合 1 · 步驟 4 / 9 · 核心備援連通',
    icon: <Radio className="w-6 h-6 text-emerald-400" />,
    instruction: '左上方出現了「暴風雪雪崩搜救呼叫」任務！由於暴風雪吹垮了基地台，[P] 槽位無法使用，但系統會自動 Fallback 切換至剛安裝的 [A] 戰術無線電連通！請點擊【發起廣播連通】！',
    tips: '💡 成功連通任務即可獲得勝利積分 (VP) 與物資獎勵 💰！',
    actionRequired: '👉 請在左上方任務卡點擊【發起廣播連通 (消耗 1 AP)】'
  },
  5: {
    title: '第五步：結束第一回合與輪替',
    badge: '回合 1 · 步驟 5 / 9 · 回合循環',
    icon: <Play className="w-6 h-6 text-cyan-400" />,
    instruction: '太棒了！您成功觸發了 A 槽備援連通！此時第一回合的 3 點行動點數 (AP) 已全數使用完畢。請點擊右側操作面板上的【結束本回合】按鈕進入第二回合！',
    tips: '💡 結束回合後，系統將為所有指揮官重置 AP 為 3 點，並提供每回合基礎電力與物資補給。',
    actionRequired: '👉 請點擊操作面板上的【結束本回合】'
  },
  6: {
    title: '第六步：執行野戰手搖充電 (進入第 2 回合)',
    badge: '回合 2 · 步驟 6 / 9 · 能源管理',
    icon: <Zap className="w-6 h-6 text-amber-400" />,
    instruction: '進入第 2 回合！您的 AP 已重置為 3 點！如果手牌沒有發電機，指揮官也可以消耗 1 點 AP 進行「野戰充能」來補充 2 點電力 ⚡。請點擊操作面板上的【野戰充能 (+2⚡)】按鈕！',
    tips: '💡 隨時保持蓄電池充足，才能在突發危機發生時順暢啟動高耗電設備。',
    actionRequired: '👉 請點擊操作面板上的【野戰充能 (+2⚡) [1 AP]】'
  },
  7: {
    title: '第七步：採購 [C] 槽位應急有線通訊設備',
    badge: '回合 2 · 步驟 7 / 9 · 深度防線',
    icon: <ShoppingBag className="w-6 h-6 text-amber-400" />,
    instruction: '在突發 EMP 武器打擊或強烈電子戰干擾下，常規無線電晶片會瞬間過載燒毀！實體銅線與手搖發電的有線通訊是極為堅固的防線。請在左下方補給庫中，找到【野戰雙絞有線電話 (TA-312)】，點擊「裝備至 [C] 槽位」！',
    tips: '💡 [C] 應急槽位在空中電磁頻譜遭全面壓制時是關鍵的生命線！',
    actionRequired: '👉 請在下方點擊【裝備至 [C] 槽位 (消耗 1 AP)】'
  },
  8: {
    title: '第八步：發起第二項突發危機任務 (應急 Fallback 實戰)',
    badge: '回合 2 · 步驟 8 / 9 · 多元情境實戰',
    icon: <Radio className="w-6 h-6 text-blue-400" />,
    instruction: '請檢視左上方高亮的危機任務【電磁脈衝打擊後的緊急聯絡】，點擊【發起廣播連通】！觀察當主要 P (5G) 與備用 A (SINCGARS) 因缺乏抗 EMP 防護而受阻時，系統如何自動無縫 Fallback 切換至 C 槽位的有線電話完成通聯！',
    tips: '💡 當主/備通訊皆中斷時，觸發 C 應急通訊成功可額外獲得 +1 VP 的防衛應變積分！',
    actionRequired: '👉 請點擊左上方危機任務【電磁脈衝打擊後的緊急聯絡】的【發起廣播連通 (消耗 1 AP)】'
  },
  9: {
    title: '第九步：結束第二回合',
    badge: '回合 2 · 步驟 9 / 9 · 戰役總結',
    icon: <CheckCircle2 className="w-6 h-6 text-emerald-400" />,
    instruction: '您已經成功完成了兩個完整回合的戰略決策、能源調配、裝備建置與任務連通！請點擊【結束本回合】完成整個新手教學！',
    tips: '💡 在正式戰局中，率先達到目標 VP (例如 18 或 20 VP) 或 8 回合結束時最高分者獲勝！',
    actionRequired: '👉 請點擊操作面板上的【結束本回合】'
  },
  10: {
    title: '🎉 實戰教學圓滿完成！',
    badge: '教學結業 · 榮譽認證',
    icon: <Sparkles className="w-6 h-6 text-amber-400" />,
    instruction: '太棒了！您已經掌握了 PACE 槽位組建、裝備採購、戰術卡運用、野戰充能、多回合流轉與 Fallback 備援連通的所有核心技巧！現在您可以回到主選單，挑選 AI 對手數量或進行同機雙人對戰！',
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
  const isFinalStep = step >= 10;

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
