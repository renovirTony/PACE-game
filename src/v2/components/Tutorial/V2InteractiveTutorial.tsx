import React from 'react';
import { GraduationCap, ArrowRight, ArrowLeft, Check, Sparkles, X } from 'lucide-react';

interface V2InteractiveTutorialProps {
  step: number;
  onNext: () => void;
  onPrev: () => void;
  onFinish: () => void;
}

const tutorialSteps = [
  {
    step: 1,
    title: '第一步：認識 PACE 四重防線面板',
    instruction: '在極端災害中，單一科技隨時可能中斷！',
    detail: '查看上方【指揮官自組 PACE 四重防線】。由左至右分別為 [P] 主要、[A] 備用、[C] 應急、[E] 緊急。你不再被強制綁定槽位，可以根據策略自由配置各防線的裝備！',
  },
  {
    step: 2,
    title: '第二步：媒介獨立性與共因失效防範',
    instruction: '避免將所有雞蛋放在同一個籃子裡！',
    detail: '注意面板頂部的【媒介多樣性指數】。如果你的 [P] 和 [A] 都依賴同種「公眾網/基地台」，大停電時兩者會同時癱瘓！真正強韌的 PACE 方案必須使用不同的物理媒介（如衛星、無線電、有線或人力）。',
  },
  {
    step: 3,
    title: '第三步：物資採購與自由指派防線',
    instruction: '至右側市場採購裝備，自選放入防線！',
    detail: '點擊市場卡牌上的【採購裝備 (1 AP)】，系統會讓你自選放入 [P]、[A]、[C] 或 [E]。若該槽位已有舊卡，舊卡會自動安全收納至【備用裝備倉庫】，絕不會被直接刪除！',
  },
  {
    step: 4,
    title: '第四步：自由調換防線與倉庫存取',
    instruction: '隨時微調防線順序，零 AP 消耗！',
    detail: '點擊防線卡牌上的【🔄 調換】，即可與其他槽位即時對調；點擊【📥 收存】可將裝備放至下方備用倉庫，之後隨時能重新裝備！',
  },
  {
    step: 5,
    title: '第五步：全域物理天災的真實衝擊',
    instruction: '天災只打擊物理媒介，不人為鎖定槽位！',
    detail: '注意中央的【全域物理災情橫幅】。大停電會中斷公眾網、暴風雨會阻斷衛星、EMP 會燒毀無線電晶片。只有選對不受天災影響的物理防線，通訊才能暢通！',
  },
  {
    step: 6,
    title: '第六步：頻寬門檻與發起任務通訊',
    instruction: '大任務需高頻寬，SOS 求救只需低頻寬！',
    detail: '查看左側【危機任務】卡牌。標註 🔴 High 頻寬的任務只能由高階工具完成；標註 🟢 Low 頻寬的 SOS 求救任務，即使常規手段全滅，C 或 E 也能成功救人！點擊【發起通訊檢定】開始驗證！',
  },
  {
    step: 7,
    title: '第七步：逐層 Fallback 與階梯降級',
    instruction: 'P 失靈自動切至 A，全倒退入 C 與 E！',
    detail: '由 [P] 或 [A] 連通可獲得滿額 100% 收益；退入 [C] 應急連通獲得 70% 止血收益；退入 [E] 緊急連通獲得 50% 保命收益。雖然收益打折，但成功救回了任務！',
  },
  {
    step: 8,
    title: '第八步：通訊專家復盤講評',
    instruction: '從做中學，每一次通訊都有專家解析！',
    detail: '通訊結束後會彈出【專家復盤報告】，詳細解說該配置成功或失敗的物理成因。恭喜你已掌握 PACE 通訊先鋒的核心精神，現在開始實戰吧！',
  },
];

export function V2InteractiveTutorial({
  step,
  onNext,
  onPrev,
  onFinish,
}: V2InteractiveTutorialProps) {
  const current = tutorialSteps.find((s) => s.step === step) || tutorialSteps[0];
  const isLast = step === tutorialSteps.length;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-4 animate-slideUp font-mono">
      <div className="rounded-3xl border-2 border-purple-500/80 bg-slate-950/95 p-5 sm:p-6 shadow-2xl backdrop-blur-xl flex flex-col gap-3 text-slate-100 relative">
        {/* Step Indicator & Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-purple-950 border border-purple-500/50 text-purple-300">
              <GraduationCap className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <span className="text-[10px] font-black text-purple-400 uppercase tracking-wider block">
                實戰新手教學 · 步驟 {step} / {tutorialSteps.length}
              </span>
              <h3 className="text-sm sm:text-base font-black text-slate-100">
                {current.title}
              </h3>
            </div>
          </div>

          <button
            onClick={onFinish}
            className="p-1.5 text-slate-500 hover:text-slate-300 rounded-lg hover:bg-slate-900"
            title="跳過教學"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-3 rounded-2xl bg-purple-950/30 border border-purple-500/20 flex flex-col gap-1 text-xs">
          <span className="font-bold text-purple-300">
            👉 {current.instruction}
          </span>
          <p className="text-slate-300 leading-relaxed">
            {current.detail}
          </p>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-1">
          <button
            onClick={onPrev}
            disabled={step === 1}
            className="px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> 上一步
          </button>

          <div className="flex items-center gap-1">
            {tutorialSteps.map((s) => (
              <div
                key={s.step}
                className={`w-2 h-2 rounded-full transition-all ${
                  s.step === step ? 'w-5 bg-purple-400' : 'bg-slate-700'
                }`}
              />
            ))}
          </div>

          {isLast ? (
            <button
              onClick={onFinish}
              className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-purple-500 to-cyan-400 hover:from-purple-400 hover:to-cyan-300 text-slate-950 font-black text-xs transition-all shadow-md active:scale-95 flex items-center gap-1"
            >
              <Check className="w-3.5 h-3.5" /> 完成教學
            </button>
          ) : (
            <button
              onClick={onNext}
              className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-black text-xs transition-all shadow-md active:scale-95 flex items-center gap-1"
            >
              下一步 <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
