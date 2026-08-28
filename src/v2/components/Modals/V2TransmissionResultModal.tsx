import React from 'react';
import { CrisisMission, PACESlot, TransmissionResult, WorldviewType } from '../../types/game';
import { Radio, CheckCircle, XCircle, Award, Coins, BookOpen, X, AlertTriangle } from 'lucide-react';

interface V2TransmissionResultModalProps {
  data: {
    result: TransmissionResult;
    mission: CrisisMission;
    playerName: string;
  } | null;
  worldview: WorldviewType;
  onClose: () => void;
}

export function V2TransmissionResultModal({
  data,
  worldview,
  onClose,
}: V2TransmissionResultModalProps) {
  if (!data) return null;

  const { result, mission, playerName } = data;
  const content = mission.translations[worldview];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md font-mono animate-fadeIn">
      <div className="relative w-full max-w-2xl rounded-3xl border border-slate-800 bg-slate-950 p-6 sm:p-8 shadow-2xl flex flex-col gap-5 text-slate-100">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-100 rounded-xl hover:bg-slate-900 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-2xl border ${
            result.canTransmit
              ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-400'
              : 'bg-red-950/80 border-red-500/50 text-red-400'
          }`}>
            <Radio className="w-7 h-7 animate-pulse" />
          </div>

          <div>
            <span className="text-xs font-bold text-slate-400 block uppercase">
              PACE 通訊檢驗報告 (Transmission Debrief)
            </span>
            <h3 className="text-lg sm:text-xl font-black text-slate-100">
              {result.canTransmit ? '通訊成功連通！' : '通訊中斷宣告失敗！'}
            </h3>
          </div>
        </div>

        {/* Mission Title & Status */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-cyan-400">
              任務項目：{content?.title}
            </span>
            <span className="text-[10px] text-slate-400">
              執行指揮官：{playerName}
            </span>
          </div>
          <p className="text-xs text-slate-300">
            {result.reason}
          </p>
        </div>

        {/* PACE Slot Fallback Path Visualization */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-bold text-slate-300">
            四重防線 Fallback 檢驗路徑：
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
            {result.slotEvaluations.map((evalItem) => {
              const isHit = result.successfulSlot === evalItem.slot;
              return (
                <div
                  key={evalItem.slot}
                  className={`p-2.5 rounded-xl border flex flex-col justify-between gap-1 text-xs ${
                    isHit
                      ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200 shadow-md shadow-emerald-500/20'
                      : evalItem.passed
                      ? 'bg-slate-900 border-slate-800 text-slate-400'
                      : 'bg-red-950/30 border-red-500/30 text-red-300'
                  }`}
                >
                  <div className="flex items-center justify-between font-black">
                    <span>[{evalItem.slot}] 防線</span>
                    {isHit ? (
                      <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : evalItem.passed ? (
                      <span className="text-[10px] text-slate-500">備用</span>
                    ) : (
                      <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                    )}
                  </div>

                  <span className="text-[11px] font-bold truncate">
                    {evalItem.card ? evalItem.card.translations[worldview]?.name : '未配置裝備'}
                  </span>

                  {!evalItem.passed && evalItem.failReason && (
                    <span className="text-[9px] text-red-400 leading-tight">
                      {evalItem.failReason}
                    </span>
                  )}

                  {isHit && (
                    <span className="text-[10px] font-black text-emerald-400 bg-emerald-950 px-1.5 py-0.5 rounded text-center">
                      命中連通 ({Math.round(result.degradationRate * 100)}% 收益)
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Earned Rewards Summary */}
        {result.canTransmit && (
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-purple-950/50 via-slate-900 to-cyan-950/50 border border-purple-500/30 flex items-center justify-around text-center">
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">獲得救災積分</span>
              <span className="text-lg font-black text-purple-300 flex items-center justify-center gap-1">
                <Award className="w-5 h-5 text-purple-400" /> +{result.earnedVP} VP
              </span>
            </div>

            <div className="w-px h-8 bg-slate-800" />

            <div>
              <span className="text-[10px] text-slate-400 block uppercase">獲得物資資金</span>
              <span className="text-lg font-black text-emerald-300 flex items-center justify-center gap-1">
                <Coins className="w-5 h-5 text-emerald-400" /> +{result.earnedCredits} 💰
              </span>
            </div>
          </div>
        )}

        {/* Module B Integration: Expert Debriefing Report */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs">
            <BookOpen className="w-4 h-4" />
            <span>通訊專家復盤與教育講評 (Expert Debriefing)</span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
            {result.expertDebrief}
          </p>
        </div>

        {/* Acknowledge Button */}
        <button
          onClick={onClose}
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-slate-950 font-black text-sm tracking-wider transition-all shadow-lg active:scale-98"
        >
          確認並繼續作戰 (Roger That)
        </button>
      </div>
    </div>
  );
}
