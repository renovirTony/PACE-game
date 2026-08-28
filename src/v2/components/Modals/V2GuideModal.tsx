import React from 'react';
import { Shield, Radio, CheckCircle, AlertTriangle, Zap, Layers, Award, X } from 'lucide-react';

interface V2GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function V2GuideModal({ isOpen, onClose }: V2GuideModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md font-mono animate-fadeIn">
      <div className="relative w-full max-w-3xl max-h-[90vh] rounded-3xl border border-cyan-500/40 bg-slate-950 p-6 sm:p-8 shadow-2xl flex flex-col gap-5 text-slate-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Shield className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-100">
                PACE 應急通訊原理與防衛指引 (Operational Guide)
              </h3>
              <p className="text-xs text-slate-400">
                從做中學：理解為什麼日常通訊會失靈，以及如何建立四重獨立防線
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-100 rounded-xl hover:bg-slate-900 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Guide Content */}
        <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-5 text-xs leading-relaxed">
          {/* Section 1: What is PACE? */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col gap-2.5">
            <h4 className="text-sm font-black text-cyan-300 flex items-center gap-2">
              <Radio className="w-4 h-4 text-cyan-400" /> 一、 什麼是 PACE 四重備援原則？
            </h4>
            <p className="text-slate-300">
              PACE 是美軍與各國災害防救組織的核心通訊規劃準則。在極端災難中，<b>沒有任何單一科技是萬能的</b>。必須依序規劃四道防線：
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
              <div className="p-2.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30">
                <b className="text-cyan-300 block text-xs">[P] Primary (主要通訊)</b>
                <span className="text-[11px] text-slate-400">
                  日常最高頻寬、最便捷工具（如 5G 手機、寬頻光纖）。處理日常大量數據，但依賴市電。
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-blue-950/40 border border-blue-500/30">
                <b className="text-blue-300 block text-xs">[A] Alternate (備用通訊)</b>
                <span className="text-[11px] text-slate-400">
                  P 失靈時的第一替代方案（如對講機、短波電台）。功能相近但必須使用獨立媒介。
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-500/30">
                <b className="text-amber-300 block text-xs">[C] Contingency (應急通訊)</b>
                <span className="text-[11px] text-slate-400">
                  前兩道全毀時的強韌防線（如手搖有線電話、地底震波儀）。具備抗 EMP 與斷電耐受力。
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-red-950/40 border border-red-500/30">
                <b className="text-red-300 block text-xs">[E] Emergency (緊急通訊)</b>
                <span className="text-[11px] text-slate-400">
                  終極保命手段（如信差騎士、手電筒摩斯光碼、哨子）。完全免電，科技全滅時的最後希望。
                </span>
              </div>
            </div>
          </div>

          {/* Section 2: Media Diversity & Common-mode Failure */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col gap-2.5">
            <h4 className="text-sm font-black text-amber-300 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" /> 二、 媒介獨立性 (Media Diversity) 與共因失效
            </h4>
            <p className="text-slate-300">
              許多人在做備援規劃時常犯致命錯誤：<b>「P 用 iPhone 5G，A 用 iPad 家用 Wi-Fi」</b>——兩者本質上都依賴市電與地面基地台，一旦大停電兩者會<b>同時暴斃（共因失效 Common-Mode Failure）</b>！
            </p>
            <p className="text-slate-300">
              遊戲中涵蓋 <b>5 大實體物理媒介</b>：
            </p>
            <ul className="list-disc pl-5 space-y-1 text-[11px] text-slate-300">
              <li>🏙️ <b>公眾網/基地台 (Cellular)</b>：頻寬極大，但市電一斷或機房受損即失效。</li>
              <li>🛰️ <b>衛星通訊 (Satellite)</b>：全球覆蓋，但厚重暴雨雲層（雨衰）與高空 EMP 會阻斷。</li>
              <li>📻 <b>無線電波 (Radio)</b>：免基地台直接通聯，但會被地形山脈阻隔，且易受電子雜訊干擾。</li>
              <li>🔌 <b>實體有線 (Wired)</b>：完全免疫電磁干擾與 EMP，但地震土石流可能扯斷線路。</li>
              <li>🏃 <b>人力/光學 (Physical/Optical)</b>：完全免電力、零干擾，但距離短，濃霧會遮蔽光學。</li>
            </ul>
          </div>

          {/* Section 3: Bandwidth Gates & Fallback Degradation */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col gap-2.5">
            <h4 className="text-sm font-black text-purple-300 flex items-center gap-2">
              <Award className="w-4 h-4 text-purple-400" /> 三、 頻寬門檻與 Fallback 階梯降級機制
            </h4>
            <p className="text-slate-300">
              在真實世界中，啟動 C 或 E 應急手段意味著「傳輸速度變慢、只能傳遞座標與短碼」：
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-center text-[11px]">
              <div className="p-2 rounded-xl bg-cyan-950/40 border border-cyan-500/30">
                <b className="text-cyan-300 block">由 [P] 或 [A] 連通</b>
                <span>滿額 100% 收益（資訊完整、高傳輸）</span>
              </div>
              <div className="p-2 rounded-xl bg-amber-950/40 border border-amber-500/30">
                <b className="text-amber-300 block">退入 [C] 應急連通</b>
                <span>獲得 70% 止血收益（語音/文字受限）</span>
              </div>
              <div className="p-2 rounded-xl bg-red-950/40 border border-red-500/30">
                <b className="text-red-300 block">退入 [E] 緊急連通</b>
                <span>獲得 50% 保命收益（SOS座標救援）</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              📌 <b>高難度戰略任務（需 High 頻寬）</b>：低階工具（哨子/信差）無法勝任，只能由高頻寬工具處理。<br />
              📌 <b>突發危機 SOS 任務（只需 Low 頻寬）</b>：即使常規手段全滅，只要 C 或 E 存活就能成功救人！
            </p>
          </div>
        </div>

        {/* Footer Button */}
        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-slate-950 font-black text-xs tracking-wider transition-all"
        >
          我已瞭解，返回作戰
        </button>
      </div>
    </div>
  );
}
