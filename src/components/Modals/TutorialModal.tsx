import React, { useState } from 'react';
import { X, BookOpen, CheckCircle, ArrowRight, Zap, Shield, Radio, Trophy, Award, Layers, Sparkles, BatteryCharging, ShoppingBag } from 'lucide-react';

interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type GuideTab = 'QUICKSTART' | 'PACE_SYSTEM' | 'FALLBACK' | 'TACTICS';

export const TutorialModal: React.FC<TutorialModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<GuideTab>('QUICKSTART');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl rounded-3xl border border-cyan-500/40 bg-slate-950 p-5 sm:p-7 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <BookOpen className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-xl font-black text-slate-100 font-orbitron">
                  PACE 通訊先鋒 · <span className="text-cyan-400">作戰手冊與規則指南</span>
                </h2>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/40 hidden sm:inline-block">
                  M.A.P.S 戰術指引
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">掌握應急通訊四重防線，成為頂尖應急指揮官</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white border border-slate-800 transition-all active:scale-95"
            title="關閉手冊 (ESC)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 4 Progressive Navigation Tabs (S - Step-by-Step) */}
        <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-800/60 overflow-x-auto shrink-0 font-mono text-xs">
          <button
            onClick={() => setActiveTab('QUICKSTART')}
            className={`px-3.5 py-2 rounded-xl font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'QUICKSTART'
                ? 'bg-cyan-500 text-slate-950 font-black shadow-md shadow-cyan-500/30'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>1. 快速上手與獲勝</span>
          </button>

          <button
            onClick={() => setActiveTab('PACE_SYSTEM')}
            className={`px-3.5 py-2 rounded-xl font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'PACE_SYSTEM'
                ? 'bg-blue-500 text-white font-black shadow-md shadow-blue-500/30'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>2. PACE 四防線架構</span>
          </button>

          <button
            onClick={() => setActiveTab('FALLBACK')}
            className={`px-3.5 py-2 rounded-xl font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'FALLBACK'
                ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/30'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>3. Fallback 智慧備援</span>
          </button>

          <button
            onClick={() => setActiveTab('TACTICS')}
            className={`px-3.5 py-2 rounded-xl font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'TACTICS'
                ? 'bg-purple-500 text-slate-950 font-black shadow-md shadow-purple-500/30'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>4. 能源與戰術調配</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
          {activeTab === 'QUICKSTART' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/60 to-blue-950/40 border border-cyan-500/40 shadow-inner">
                <h3 className="text-sm sm:text-base font-bold text-cyan-300 flex items-center gap-2 mb-2 font-mono">
                  <Trophy className="w-5 h-5 text-amber-400" /> 遊戲核心目標與勝利條件
                </h3>
                <p className="text-slate-300 leading-relaxed">
                  在極端戰場與突發災害中，玩家扮演應急通訊指揮官。遊戲中將不斷湧現各類危機任務（深山雪崩、電網癱瘓、核磁脈衝 EMP、地下掩體崩塌等）。
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 font-mono text-xs">
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-amber-500/30">
                    <span className="text-amber-400 font-bold block mb-1">🏆 積分達標獲勝</span>
                    率先累積達到 <strong className="text-amber-300 text-base font-black">20 VP</strong>（或自訂目標）的指揮官立即奪冠！
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-cyan-500/30">
                    <span className="text-cyan-400 font-bold block mb-1">⏱️ 回合終局結算</span>
                    進行至 <strong className="text-cyan-300 text-base font-black">8 回合</strong> 結束時，積分最高者贏得最終榮譽！
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                <h4 className="text-xs sm:text-sm font-bold text-slate-100 font-mono mb-2">🎯 3 步決策循環 (每回合 3 AP)：</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                    <span className="text-cyan-400 font-bold block mb-1">步驟 1：檢視危機需求</span>
                    觀察現場任務的【頻寬、距離、EMP/耐候/地底抗性】要求。
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                    <span className="text-blue-400 font-bold block mb-1">步驟 2：充能或升級裝備</span>
                    至補給庫採購對應槽位裝備，或使用野戰充能確保電力充足。
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                    <span className="text-emerald-400 font-bold block mb-1">步驟 3：發起廣播連通</span>
                    點擊「發起廣播連通」，系統自動觸發 PACE 智慧備援並收穫積分與物資！
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'PACE_SYSTEM' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                <h3 className="text-sm sm:text-base font-bold text-blue-300 flex items-center gap-2 mb-2 font-mono">
                  <Shield className="w-5 h-5 text-cyan-400" /> PACE 應急通訊四重防線詳解
                </h3>
                <p className="text-slate-300 mb-3 text-xs sm:text-sm">
                  PACE 是美軍戰術通訊與現代國家級防災的核心準則。四個槽位必須具備不同技術路徑，以避免單點故障（SPOF）。
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
                  <div className="p-3.5 rounded-2xl bg-cyan-950/40 border border-cyan-500/40 text-cyan-200">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-cyan-300 text-sm">[P] Primary (主要通訊)</span>
                      <span className="text-[10px] bg-cyan-900/80 px-2 py-0.5 rounded-full">第 1 防線</span>
                    </div>
                    <p className="text-slate-300 text-xs leading-relaxed">
                      日常首選。頻寬最大、速度最快（如 5G 行動專網、低軌衛星 Starlink）。優點是傳輸海量數據，缺點是易受大停電或惡劣天候影響。
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-blue-950/40 border border-blue-500/40 text-blue-200">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-blue-300 text-sm">[A] Alternate (備用通訊)</span>
                      <span className="text-[10px] bg-blue-900/80 px-2 py-0.5 rounded-full">第 2 防線</span>
                    </div>
                    <p className="text-slate-300 text-xs leading-relaxed">
                      標準替代。主通道斷線時的軍規跳頻電台（如 SINCGARS VHF/UHF、長距離短波 HF）。具備全天候防護，抗干擾能力強。
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-amber-950/40 border border-amber-500/40 text-amber-200">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-amber-300 text-sm">[C] Contingency (應急通訊)</span>
                      <span className="text-[10px] bg-amber-900/80 px-2 py-0.5 rounded-full">第 3 防線</span>
                    </div>
                    <p className="text-slate-300 text-xs leading-relaxed">
                      惡劣防線。主備皆斷時的強韌方案。不依賴市電與複雜晶片，如手搖野戰有線電話 (TA-312)、地底震波聲學儀、信差無人機。
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-red-950/40 border border-red-500/40 text-red-200">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-red-300 text-sm">[E] Emergency (緊急通訊)</span>
                      <span className="text-[10px] bg-red-900/80 px-2 py-0.5 rounded-full">第 4 防線</span>
                    </div>
                    <p className="text-slate-300 text-xs leading-relaxed">
                      最後底牌。現代電子晶片全面癱瘓時的終極保命手段。如全免疫的阿爾迪斯摩斯信號燈、日光反射鏡、軍用信鴿！
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'FALLBACK' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                <h3 className="text-sm sm:text-base font-bold text-amber-300 flex items-center gap-2 mb-2 font-mono">
                  <Radio className="w-5 h-5 text-amber-400" /> 智慧廣播與 Fallback 備援判定
                </h3>
                <p className="text-slate-300 mb-3 text-xs sm:text-sm">
                  當你發起廣播連通時，系統會自動按 <span className="text-cyan-400 font-bold">P ➔ A ➔ C ➔ E</span> 順序逐級檢查設備與環境抗性：
                </p>

                <div className="space-y-2.5 font-mono text-xs">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-cyan-300">[P] 主要通訊</span>
                      <span className="text-slate-400">若電量充足、天候正常、無 EMP</span>
                    </div>
                    <span className="text-emerald-400 font-bold">順暢連通 (基礎任務得分)</span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-blue-950/40 border border-blue-500/30">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-blue-300">[A] 備用通訊</span>
                      <span className="text-slate-400">P 受阻時自動切換戰術跳頻電台</span>
                    </div>
                    <span className="text-blue-300 font-bold">無縫備援 (任務得分)</span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-amber-950/40 border border-amber-500/30">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-amber-300">[C] 應急通訊</span>
                      <span className="text-slate-400">主/備中斷，拉起實體有線或震波</span>
                    </div>
                    <span className="text-amber-400 font-bold">觸發應急獎勵 (+1 VP 額外加分)</span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-red-950/40 border border-red-500/30">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-red-300">[E] 緊急通訊</span>
                      <span className="text-slate-400">常規全滅，依靠光學/信差力挽狂瀾</span>
                    </div>
                    <span className="text-red-400 font-bold">終極應變大獎 (+2 VP 額外加分)</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'TACTICS' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                <h3 className="text-sm sm:text-base font-bold text-purple-300 flex items-center gap-2 mb-2 font-mono">
                  <Zap className="w-5 h-5 text-purple-400" /> 能源、資金與戰術手牌體系
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs mb-3">
                  <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/30">
                    <span className="font-bold text-amber-300 block mb-1">⚡ 電力蓄能 (Energy)</span>
                    所有無線通訊與衛星運作皆消耗電量。可隨時消耗 1 AP 進行「野戰充能 +2⚡」或使用柴油發電機。
                  </div>

                  <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/30">
                    <span className="font-bold text-cyan-300 block mb-1">💰 物資資金 (Credits)</span>
                    完成危機任務獲得資金，用於在補給庫採購高階通訊設備與戰術手牌。
                  </div>

                  <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-500/30">
                    <span className="font-bold text-purple-300 block mb-1">🎴 戰術手牌 (Tactics)</span>
                    包含【高功率射頻超頻】(範圍+1階)、【法拉第抗干擾遮蔽】(免疫EMP)、【八木天線】(+1 VP) 等關鍵底牌！
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-3 shrink-0 font-mono text-xs">
          <span className="text-slate-400 hidden sm:inline-block">
            PACE: Primary · Alternate · Contingency · Emergency
          </span>
          <div className="flex items-center gap-2">
            {activeTab !== 'TACTICS' ? (
              <button
                onClick={() => {
                  if (activeTab === 'QUICKSTART') setActiveTab('PACE_SYSTEM');
                  else if (activeTab === 'PACE_SYSTEM') setActiveTab('FALLBACK');
                  else if (activeTab === 'FALLBACK') setActiveTab('TACTICS');
                }}
                className="py-2 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-500/40 font-bold transition-all flex items-center gap-1"
              >
                <span>下一篇章</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : null}

            <button
              onClick={onClose}
              className="py-2 px-5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-black tracking-wider transition-all shadow-md shadow-cyan-500/25 active:scale-95"
            >
              進入戰場
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
