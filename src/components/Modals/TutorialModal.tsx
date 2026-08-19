import React from 'react';
import { X, BookOpen, CheckCircle, ArrowRight, Zap, Shield, Radio, Trophy } from 'lucide-react';

interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TutorialModal: React.FC<TutorialModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-3xl rounded-2xl border border-cyan-500/40 bg-slate-950 p-6 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100 font-orbitron">PACE 通訊先鋒 · 遊戲手冊與規則</h2>
              <p className="text-xs text-slate-400 font-mono">掌握應急通訊四重防線，成為頂尖應急指揮官</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs text-slate-300 leading-relaxed font-sans">
          {/* Section 1: Core Goal */}
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <h3 className="text-sm font-bold text-cyan-300 flex items-center gap-2 mb-1.5 font-mono">
              <Trophy className="w-4 h-4 text-amber-400" /> 1. 遊戲目標與獲勝條件
            </h3>
            <p>
              玩家扮演應急通訊指揮官。遊戲中將不斷出現突發危機任務（深山雪崩、電網癱瘓、核磁干擾、防空洞崩塌等）。
              率先獲得 <span className="text-amber-400 font-bold">18 點勝利積分 (VP)</span> 或在{' '}
              <span className="text-cyan-400 font-bold">8 回合</span> 結束時分數最高者贏得勝利！
            </p>
          </div>

          {/* Section 2: PACE Principle */}
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <h3 className="text-sm font-bold text-cyan-300 flex items-center gap-2 mb-2 font-mono">
              <Shield className="w-4 h-4 text-cyan-400" /> 2. 什麼是 PACE 通訊方案？
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono">
              <div className="p-2 rounded-lg bg-cyan-950/40 border border-cyan-500/30 text-cyan-300">
                <span className="font-bold block">[P] Primary (主要通訊)</span>
                日常首選。頻寬大、速度快（如 5G/衛星寬頻），但易受停電或風暴干擾。
              </div>
              <div className="p-2 rounded-lg bg-blue-950/40 border border-blue-500/30 text-blue-300">
                <span className="font-bold block">[A] Alternate (備用通訊)</span>
                標準替代。主要管道斷線時的戰術跳頻無線電或短波電台。
              </div>
              <div className="p-2 rounded-lg bg-amber-950/40 border border-amber-500/30 text-amber-300">
                <span className="font-bold block">[C] Contingency (應急通訊)</span>
                惡劣防線。手搖野戰電話、地底震動聲學或信差無人機。
              </div>
              <div className="p-2 rounded-lg bg-red-950/40 border border-red-500/30 text-red-300">
                <span className="font-bold block">[E] Emergency (緊急通訊)</span>
                最後底牌。全免疫的阿爾迪斯摩斯燈、物理騎士信差或軍用信鴿！
              </div>
            </div>
          </div>

          {/* Section 3: Fallback Mechanism */}
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <h3 className="text-sm font-bold text-cyan-300 flex items-center gap-2 mb-1.5 font-mono">
              <Radio className="w-4 h-4 text-emerald-400" /> 3. 智慧廣播與 Fallback 備援判定
            </h3>
            <p className="mb-2">
              當你點擊「發起廣播連通」時，系統會自動依照 <span className="text-cyan-400 font-bold">P ➔ A ➔ C ➔ E</span> 順序進行判定：
            </p>
            <div className="flex items-center justify-between p-2 rounded-lg bg-black/40 border border-white/5 text-[11px] font-mono">
              <span className="text-cyan-400">[P] 若受阻</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-blue-400">[A] 切換備用</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-amber-400">[C] 觸發應急 (+1 VP)</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-red-400">[E] 終極力挽狂瀾 (+2 VP)</span>
            </div>
          </div>

          {/* Section 4: Turn Actions */}
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <h3 className="text-sm font-bold text-cyan-300 flex items-center gap-2 mb-1.5 font-mono">
              <Zap className="w-4 h-4 text-amber-400" /> 4. 每回合行動點數 (3 AP)
            </h3>
            <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-300">
              <li><strong className="text-slate-100">採購與裝備設備 (1 AP)</strong>：從補給庫購入通訊卡並安裝至 P/A/C/E 槽位。</li>
              <li><strong className="text-slate-100">發起廣播連通 (1 AP)</strong>：針對現場危機任務進行通訊，成功即得 VP 與物資 💰。</li>
              <li><strong className="text-slate-100">購買 / 啟動戰術卡 (1 AP)</strong>：發電機充能、八木天線增益、無人機先遣偵察。</li>
              <li><strong className="text-slate-100">野戰充能 (1 AP)</strong>：手動為蓄電池補充 2 點電力 ⚡。</li>
            </ul>
          </div>
        </div>

        {/* Footer Button */}
        <div className="pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="py-2 px-5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-bold text-xs tracking-wider transition-all"
          >
            我瞭解了，開始作戰！
          </button>
        </div>
      </div>
    </div>
  );
};
