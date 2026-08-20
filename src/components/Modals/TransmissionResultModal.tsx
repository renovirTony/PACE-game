import React from 'react';
import { CrisisMission, TransmissionResult } from '../../types/game';
import { X, CheckCircle2, AlertCircle, ArrowRight, Award, Zap, Shield, Radio } from 'lucide-react';

interface TransmissionResultModalProps {
  data: {
    result: TransmissionResult;
    mission: CrisisMission;
    playerName: string;
  } | null;
  onClose: () => void;
}

export const TransmissionResultModal: React.FC<TransmissionResultModalProps> = ({ data, onClose }) => {
  if (!data) return null;
  const { result, mission, playerName } = data;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg rounded-3xl border border-cyan-500/40 bg-slate-950 p-5 sm:p-6 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            {result.canTransmit ? (
              <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <CheckCircle2 className="w-5 h-5 animate-pulse" />
              </div>
            ) : (
              <div className="p-2 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30">
                <AlertCircle className="w-5 h-5 animate-pulse" />
              </div>
            )}
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-100 font-mono">
                廣播傳輸診斷報告 · {playerName}
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                {result.canTransmit ? '✅ 通訊連通成功' : '❌ 四重防線皆未能接通'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-900 text-slate-400 hover:text-white border border-slate-800 transition-all active:scale-95"
            title="關閉報告"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mission Title Box */}
        <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 mb-3 shadow-inner">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-[10px] text-slate-400 font-mono block">目標危機任務:</span>
            <span className="text-xs font-mono font-bold text-amber-400">+{mission.vp} VP 基礎分</span>
          </div>
          <h4 className="text-sm font-bold text-cyan-300 mb-1">{mission.title}</h4>
          <p className="text-xs text-slate-300 leading-relaxed break-words">{result.reason}</p>
        </div>

        {/* Step-by-Step Fallback Trace (S - Step-by-Step) */}
        <div className="space-y-2 mb-4 font-mono text-xs">
          <span className="text-[10px] text-slate-400 block mb-1">PACE 四重防線逐級檢驗進程:</span>
          {result.slotDetails.map((slotInfo) => {
            const isHit = slotInfo.slot === result.successfulSlot;

            return (
              <div
                key={slotInfo.slot}
                className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 transition-all ${
                  isHit
                    ? 'bg-emerald-950/70 border-emerald-500/70 text-emerald-200 shadow-md shadow-emerald-500/20'
                    : slotInfo.available
                    ? 'bg-slate-900/80 border-slate-800 text-slate-400'
                    : 'bg-red-950/30 border-red-500/30 text-red-300/90'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className={`font-black px-2 py-0.5 rounded-lg border text-xs shrink-0 ${
                    isHit 
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-mono' 
                      : 'bg-black/50 border-white/10 text-slate-300 font-mono'
                  }`}>
                    [{slotInfo.slot}]
                  </span>
                  <span className="text-slate-100 font-bold truncate text-xs">
                    {slotInfo.card ? slotInfo.card.name : '(未裝備設備)'}
                  </span>
                </div>

                <div className="text-right text-[11px] shrink-0 font-sans">
                  {isHit ? (
                    <span className="font-bold text-emerald-300 flex items-center gap-1 font-mono">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> 連通命中 (Active)
                    </span>
                  ) : slotInfo.blockedReason ? (
                    <span className="text-red-300/90">{slotInfo.blockedReason}</span>
                  ) : (
                    <span className="text-slate-500">已略過</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Rewards Breakdown */}
        {result.canTransmit && (
          <div className="p-3.5 rounded-2xl bg-amber-950/40 border border-amber-500/40 flex items-center justify-between mb-4 font-mono text-xs shadow-inner">
            <div>
              <span className="text-amber-300 font-bold block">通訊獎勵核算:</span>
              <span className="text-[10px] text-slate-400">
                任務 {mission.vp} VP {result.bonusPoints > 0 ? `+ 備援/戰術加成 ${result.bonusPoints} VP` : ''}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-amber-400 font-black text-sm">
                <Award className="w-4 h-4 text-amber-400" /> +{mission.vp + result.bonusPoints} VP
              </span>
              <span className="text-cyan-300 font-bold text-sm">+{mission.creditReward} 💰</span>
            </div>
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-black font-mono text-xs sm:text-sm tracking-wider transition-all shadow-md shadow-cyan-500/25 active:scale-95"
        >
          確認並繼續作戰
        </button>
      </div>
    </div>
  );
};
