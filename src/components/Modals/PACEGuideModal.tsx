import React from 'react';
import { X, Shield, Radio, CheckCircle2, AlertTriangle, Layers, Zap, Wifi, PhoneCall, Flame, Compass } from 'lucide-react';

interface PACEGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PACEGuideModal: React.FC<PACEGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl rounded-3xl border border-blue-500/40 bg-slate-950 p-5 sm:p-7 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
              <Shield className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base sm:text-xl font-black text-slate-100 font-orbitron">
                實務通訊應急架構：<span className="text-blue-400">PACE 原理指南</span>
              </h2>
              <p className="text-xs text-slate-400 font-mono mt-0.5">美軍戰術通訊、FEMA 防災與現代企業韌性的黃金準則</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white border border-slate-800 transition-all active:scale-95"
            title="關閉 (ESC)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
            <h3 className="text-sm sm:text-base font-bold text-cyan-300 mb-1.5 font-mono flex items-center gap-2">
              <Compass className="w-4 h-4 text-cyan-400" /> 什麼是 PACE 原則？
            </h3>
            <p className="text-slate-300 leading-relaxed text-xs sm:text-sm">
              PACE 是由美國國防部（DoD）、特種作戰司令部與緊急應變機構（FEMA）共同遵循的通訊計畫標準（Primary, Alternate, Contingency, Emergency）。
              其哲學核心在於：<strong className="text-amber-300">「任何依賴單一通訊媒介的系統，必將在關鍵浩劫中發生災難性中斷」</strong>。
              建立具備<strong>實體介質隔離、抗干擾差異化</strong>的四重防線，才能確保全天候作戰指揮暢通。
            </p>
          </div>

          {/* 4 PACE Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 font-mono">
            {/* P */}
            <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-500/40 shadow-inner flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-black text-cyan-300 text-sm flex items-center gap-1.5">
                    <Wifi className="w-4 h-4" /> [P] Primary · 主要通訊
                  </span>
                  <span className="text-[10px] bg-cyan-900/80 px-2 py-0.5 rounded-full text-cyan-200">最高效能 / 寬頻</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed mb-2">
                  日常首選通訊手段。具備最高傳輸速率與多媒體傳輸能力。
                </p>
                <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 text-[11px] text-cyan-200/90 space-y-0.5">
                  <div><strong>實務案例：</strong>商用 5G 行動專網、低軌星鏈 (Starlink)、光纖寬頻</div>
                  <div><strong>致命弱點：</strong>高度依賴電網、易受大氣暴風雪衰減、無抗 EMP 能力</div>
                </div>
              </div>
            </div>

            {/* A */}
            <div className="p-4 rounded-2xl bg-blue-950/40 border border-blue-500/40 shadow-inner flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-black text-blue-300 text-sm flex items-center gap-1.5">
                    <Radio className="w-4 h-4" /> [A] Alternate · 備用通訊
                  </span>
                  <span className="text-[10px] bg-blue-900/80 px-2 py-0.5 rounded-full text-blue-200">軍規戰術 / 跳頻</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed mb-2">
                  公網中斷時的軍規替代無線網路。具備跳頻防電子干擾與惡劣天候防護。
                </p>
                <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 text-[11px] text-blue-200/90 space-y-0.5">
                  <div><strong>實務案例：</strong>SINCGARS VHF/UHF 跳頻電台、超長距 HF 高頻短波、LoRa Mesh</div>
                  <div><strong>致命弱點：</strong>頻寬較低、易受局部電子反制干擾</div>
                </div>
              </div>
            </div>

            {/* C */}
            <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/40 shadow-inner flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-black text-amber-300 text-sm flex items-center gap-1.5">
                    <PhoneCall className="w-4 h-4" /> [C] Contingency · 應急通訊
                  </span>
                  <span className="text-[10px] bg-amber-900/80 px-2 py-0.5 rounded-full text-amber-200">物理強韌 / 有線/震波</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed mb-2">
                  無線電頻譜遭全頻壓制時的物理應急手段。不依賴市電與複雜數位晶片。
                </p>
                <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 text-[11px] text-amber-200/90 space-y-0.5">
                  <div><strong>實務案例：</strong>TA-312 手搖野戰雙絞有線電話、地底震波聲學傳輸儀、光纖專線</div>
                  <div><strong>致命弱點：</strong>鋪設需耗費實體人力、線路易受機械開挖損毀</div>
                </div>
              </div>
            </div>

            {/* E */}
            <div className="p-4 rounded-2xl bg-red-950/40 border border-red-500/40 shadow-inner flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-black text-red-300 text-sm flex items-center gap-1.5">
                    <Flame className="w-4 h-4" /> [E] Emergency · 緊急通訊
                  </span>
                  <span className="text-[10px] bg-red-900/80 px-2 py-0.5 rounded-full text-red-200">終極保命 / 全免疫</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed mb-2">
                  核電磁脈衝爆震、現代所有電子儀器徹底燒毀時的最後一道生命防線。
                </p>
                <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 text-[11px] text-red-200/90 space-y-0.5">
                  <div><strong>實務案例：</strong>阿爾迪斯摩斯信號燈、日光反射鏡 (Heliograph)、戰術信差、軍用信鴿</div>
                  <div><strong>致命弱點：</strong>傳輸速度極慢、距離視距受限，但 100% 免疫任何 EMP 與網攻</div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
            <h4 className="font-bold text-slate-100 text-xs sm:text-sm mb-2 font-mono flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 指揮官實戰金律 (Golden Rules)
            </h4>
            <ul className="list-disc list-inside space-y-1.5 text-xs text-slate-300">
              <li><strong className="text-slate-100">獨立性原則：</strong>四重防線切勿共用相同的底層基礎設施（若 P 與 A 都依賴同一座公網基地台，停電時將同時中斷）。</li>
              <li><strong className="text-slate-100">逆向複雜度：</strong>越往後面的防線（C 與 E），耗電量應越低、機械構造應越極簡、抗電磁脈衝能力應越強。</li>
              <li><strong className="text-slate-100">定期演練測試：</strong>平時定期進行備援切換演習，方能在危機爆發時迅速無縫接軌。</li>
            </ul>
          </div>
        </div>

        {/* Footer Button */}
        <div className="pt-3 border-t border-slate-800 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-mono font-bold text-xs tracking-wider transition-all shadow-md shadow-blue-500/25 active:scale-95"
          >
            我瞭解了
          </button>
        </div>
      </div>
    </div>
  );
};
