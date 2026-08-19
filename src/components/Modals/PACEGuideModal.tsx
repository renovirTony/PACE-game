import React from 'react';
import { X, Shield, Radio, CheckCircle2, AlertTriangle, Layers } from 'lucide-react';

interface PACEGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PACEGuideModal: React.FC<PACEGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-3xl rounded-2xl border border-cyan-500/40 bg-slate-950 p-6 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100 font-orbitron">實務通訊應急架構：PACE 原理指南</h2>
              <p className="text-xs text-slate-400 font-mono">美軍戰術通訊與現代防災應變的核心準則</p>
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
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs text-slate-300 leading-relaxed">
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <h3 className="text-sm font-bold text-cyan-300 mb-1 font-mono">什麼是 PACE 原則？</h3>
            <p>
              PACE 是由美國軍方通訊與特種作戰部隊所建立的應急通訊規劃準則（Primary, Alternate, Contingency, Emergency）。
              其核心精神在於：<strong>「單一通訊手段必然會在最關鍵的時刻失效」</strong>。建立相互獨立、互不依賴的四重備援，才能在任何天災人禍中維持生命線。
            </p>
          </div>

          <div className="space-y-3 font-mono">
            {/* P */}
            <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/30">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-cyan-300 text-xs">[P] Primary - 主要通訊</span>
                <span className="text-[10px] text-cyan-400">日常最佳效能</span>
              </div>
              <p className="text-[11px] text-slate-300">
                平時作業中最快速、頻寬最大、最方便的手段。例如：公網 4G/5G、星鏈衛星（Starlink）、光纖寬頻網路。
              </p>
            </div>

            {/* A */}
            <div className="p-3 rounded-xl bg-blue-950/30 border border-blue-500/30">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-blue-300 text-xs">[A] Alternate - 備用通訊</span>
                <span className="text-[10px] text-blue-400">標準替代方案</span>
              </div>
              <p className="text-[11px] text-slate-300">
                與主要手段技術路徑不同之替代手段。例如：VHF/UHF 戰術跳頻手持無線電、長距離 HF 短波電台、LoRa 網狀中繼。
              </p>
            </div>

            {/* C */}
            <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/30">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-amber-300 text-xs">[C] Contingency - 應急通訊</span>
                <span className="text-[10px] text-amber-400">極端惡劣環境</span>
              </div>
              <p className="text-[11px] text-slate-300">
                主備皆斷時的強韌方案。通常不依賴市電與複雜晶片，如手搖野戰有線電話（TA-312）、地底震動聲學儀、信號槍。
              </p>
            </div>

            {/* E */}
            <div className="p-3 rounded-xl bg-red-950/30 border border-red-500/30">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-red-300 text-xs">[E] Emergency - 緊急通訊</span>
                <span className="text-[10px] text-red-400">最後的生命防線</span>
              </div>
              <p className="text-[11px] text-slate-300">
                所有現代電子設備完全癱瘓時的終極手段。例如：日光反射鏡（Heliograph）、阿爾迪斯摩斯信號燈、摩托車信差、軍用信鴿。
              </p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <h4 className="font-bold text-slate-200 text-xs mb-1 font-mono">💡 指揮官實戰金律：</h4>
            <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-400">
              <li>四個手段切忌共用相同的基礎設施（例如：若 P 與 A 都依賴同一座行動基地台，停電時將同時陣亡）。</li>
              <li>越往後面的防線（C 與 E），耗電量應越低、機械結構應越單純、抗電磁干擾應越強。</li>
            </ul>
          </div>
        </div>

        {/* Footer Button */}
        <div className="pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="py-2 px-5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-mono font-bold text-xs tracking-wider transition-all"
          >
            關閉指南
          </button>
        </div>
      </div>
    </div>
  );
};
