import React from 'react';
import { GraduationCap, ArrowRight, ArrowLeft, Check, Sparkles, X, Target, Lightbulb } from 'lucide-react';

interface V2InteractiveTutorialProps {
  step: number;
  onNext: () => void;
  onPrev: () => void;
  onFinish: () => void;
}

export interface TutorialStepDef {
  step: number;
  badge: string;
  title: string;
  task: string;
  detail: string;
  hint: string;
}

export const V2_TUTORIAL_STEPS: TutorialStepDef[] = [
  {
    step: 1,
    badge: '防線認知',
    title: '第一步：觀察指揮官 PACE 四重防線',
    task: '請檢視上方【PACE 防線面板】中 [P]、[A]、[C]、[E] 的角色定位與媒介多樣性指數。',
    detail: '在真實應急通訊中，單一科技隨時可能崩潰！PACE 原則要求由左至右依序規劃 [P]主要、[A]備用、[C]應急、[E]緊急。目前你的防線已有初始裝備，請注意避免同種媒介引發共因失效。',
    hint: '💡 檢視完畢後，請點擊「下一步」開始進行物資採購！',
  },
  {
    step: 2,
    badge: '物資採購',
    title: '第二步：至市場採購通訊裝備並指派槽位',
    task: '👉 請在下方【物資市場】點擊第一張裝備卡上的【採購裝備 (1 AP)】，並選擇放入 [C] 或 [E] 槽！',
    detail: '所有裝備均不綁定槽位，由你自由配置！點擊採購後可自選放入任一槽位。若該槽位已有舊裝備，舊裝備會自動安全移至【備用裝備倉庫】，隨時可再調度！',
    hint: '💡 點擊市場上的【採購裝備】按鈕並指派槽位即可直接達成任務！',
  },
  {
    step: 3,
    badge: '戰術發動',
    title: '第三步：手牌戰術卡 0 AP 即時發動',
    task: '👉 請在右側控制台點擊手牌戰術卡上的【即時發動 (0 AP)】！',
    detail: '手牌戰術卡為【0 AP 免費動作 (Free Action)】，打出不扣除 AP！可即時帶來《敏捷協議 (調換 0 AP)》、《綠色後勤 (採購 0 AP)》或補充發電機電量等強大戰術優勢。',
    hint: '💡 點擊手牌戰術卡右側的【即時發動 (0 AP)】按鈕！',
  },
  {
    step: 4,
    badge: '戰術調度',
    title: '第四步：防線動態對調 (Swap) 與倉庫收存',
    task: '👉 請點擊防線上任一裝備卡上的【🔄 調換】或【📥 收存】進行戰術調配！',
    detail: '點擊【🔄 調換】可將不同槽位的裝備對調（如將耐天候裝備移至前線）；點擊【📥 收存 (0 AP)】可將裝備安全卸下存入備用倉庫。若手牌發動過《敏捷協議》，調換將為 0 AP！',
    hint: '💡 點擊防線卡片上的【🔄 調換】並選擇另一個槽位完成對調！',
  },
  {
    step: 5,
    badge: '通訊檢定',
    title: '第五步：發起第一次危機任務通訊檢定',
    task: '👉 請在左側【危機任務】點擊【發起通訊檢定】！',
    detail: '系統將依序由 [P] ➔ [A] ➔ [C] ➔ [E] 逐層驗證防線是否符合該任務的「頻寬門檻」、「通訊距離」與「物理抗性」。連通成功將獲得救災積分 (VP) 與物資，並彈出【專家復盤講評】！',
    hint: '💡 點擊任務卡下方的【發起通訊檢定】按鈕！',
  },
  {
    step: 6,
    badge: '野戰充能',
    title: '第六步：緊急野戰充電維護電力',
    task: '👉 請在右側控制台點擊【緊急野戰充電 (+2 ⚡ | 1 AP)】！',
    detail: '通訊設備運作會消耗電力（如 1⚡~2⚡）。當電量耗盡時設備將無法啟動！在必要時可消耗 1 AP 進行緊急充電，或使用柴油發電機等戰術卡快速回電。',
    hint: '💡 點擊【緊急野戰充電】按鈕！',
  },
  {
    step: 7,
    badge: '天災迎擊',
    title: '第七步：結束回合並迎擊「全域物理天災」',
    task: '👉 請點擊【結束作戰回合 (End Turn)】！',
    detail: '回合結束後將推進至下一週期，並觸發全域物理天災（如大停電、颱風、EMP 或地震）。天災會直接癱瘓對應的物理媒介，考驗你的 PACE 備援防線是否具備抗災多樣性！',
    hint: '💡 點擊【結束作戰回合 (End Turn)】按鈕！',
  },
  {
    step: 8,
    badge: '結訓認證',
    title: '第八步：恭喜結訓！掌握 PACE 應急通訊精神',
    task: '🎉 你已完整掌握自組防線、媒介獨立性、0 AP 戰術與 Fallback 階梯降級！',
    detail: '記住：沒有任何單一通訊工具是萬能的。真正的強韌來自於多樣化的物理媒介備援！現在點擊下方按鈕，開始自由指揮演習吧！',
    hint: '💡 點擊【完成教學，開始實戰】正式啟動自由作戰！',
  },
];

export function V2InteractiveTutorial({
  step,
  onNext,
  onPrev,
  onFinish,
}: V2InteractiveTutorialProps) {
  const current = V2_TUTORIAL_STEPS.find((s) => s.step === step) || V2_TUTORIAL_STEPS[0];
  const isLast = step === V2_TUTORIAL_STEPS.length;

  return (
    <div className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-[60] w-full max-w-3xl px-4 animate-slideUp font-mono">
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
            onClick={onFinish}
            className="p-1.5 text-slate-400 hover:text-slate-100 rounded-xl hover:bg-slate-900 transition-all text-xs flex items-center gap-1 font-bold"
            title="跳過教學直接開始遊戲"
          >
            <span>跳過教學</span>
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action Task Banner (High Contrast Interactive Callout) */}
        <div className="p-3 rounded-2xl bg-gradient-to-r from-purple-950/90 via-slate-900 to-cyan-950/80 border border-purple-500/50 flex flex-col gap-1.5 text-xs shadow-inner">
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
        <div className="flex items-center justify-between pt-1">
          <button
            onClick={onPrev}
            disabled={step === 1}
            className="px-3.5 py-1.5 rounded-xl border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> 上一步
          </button>

          <div className="flex items-center gap-1.5">
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
            <button
              onClick={onFinish}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-cyan-400 hover:from-purple-400 hover:to-cyan-300 text-slate-950 font-black text-xs sm:text-sm transition-all shadow-lg shadow-cyan-500/25 active:scale-95 flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>完成教學，開始實戰！</span>
            </button>
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
  );
}
