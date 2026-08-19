import React from 'react';
import { CrisisMission, TransmissionResult } from '../../types/game';
import { X, CheckCircle2, AlertCircle, ArrowRight, Award, Zap } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg rounded-2xl border border-cyan-500/40 bg-slate-950 p-5 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            {result.canTransmit ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-400" />
            )}
            <h3 className="text-sm font-bold text-slate-100 font-mono">
              廣播傳輸診斷報告 · {playerName}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mission Title */}
        <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 mb-3">
          <span className="text-[10px] text-slate-400 font-mono block">目標任務:</span>
          <h4 className="text-sm font-bold text-cyan-300">{mission.title}</h4>
          <p className="text-xs text-slate-300 mt-1">{result.reason}</p>
        </div>

        {/* Step-by-Step Fallback Trace */}
        <div className="space-y-1.5 mb-4 font-mono text-xs">
          <span className="text-[10px] text-slate-400 block mb-1">PACE 四重防線檢驗進程:</span>
          {result.slotDetails.map((slotInfo, index) => {
            const isHit = slotInfo.slot === result.successfulSlot;

            return (
              <div
                key={slotInfo.slot}
                className={`p-2 rounded-lg border flex items-center justify-between ${
                  isHit
                    ? 'bg-emerald-950/60 border-emerald-500/60 text-emerald-300 shadow'
                    : slotInfo.available
                    ? 'bg-slate-900 border-slate-800 text-slate-400'
                    : 'bg-red-950/20 border-red-500/30 text-red-400'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="font-bold px-1.5 py-0.5 rounded bg-black/40 border border-white/10 text-[10px]">
                    [{slotInfo.slot}]
                  </span>
                  <span className="text-slate-200">
                    {slotInfo.card ? slotInfo.card.name : '(未裝備)'}
                  </span>
                </div>

                <div className="text-right text-[10px]">
                  {isHit ? (
                    <span className="font-bold text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> 連通成功 (命中)
                    </span>
                  ) : slotInfo.blockedReason ? (
                    <span className="text-red-400">{slotInfo.blockedReason}</span>
                  ) : (
                    <span className="text-slate-500">跳過</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Rewards Breakdown */}
        {result.canTransmit && (
          <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/40 flex items-center justify-between mb-4 font-mono text-xs">
            <span className="text-amber-300 font-bold">通訊獎勵核算:</span>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-amber-400 font-bold">
                <Award className="w-3.5 h-3.5" /> +{mission.vp + result.bonusPoints} VP
              </span>
              <span className="text-cyan-300 font-bold">+{mission.creditReward} 💰</span>
            </div>
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold font-mono text-xs tracking-wider transition-all"
        >
          確認
        </button>
      </div>
    </div>
  );
};
