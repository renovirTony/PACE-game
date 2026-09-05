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
  isMobile?: boolean;
}

export function V2TransmissionResultModal({
  data,
  worldview,
  onClose,
  isMobile = false,
}: V2TransmissionResultModalProps) {
  if (!data) return null;

  const { result, mission, playerName } = data;
  const content = mission.translations[worldview];

  // Mobile BottomSheet Mode
  if (isMobile) {
    return (
      <div className="fixed inset-0 z-[120] flex flex-col justify-end bg-black/85 backdrop-blur-md font-mono animate-fadeIn">
        <div onClick={onClose} className="flex-1" />
        <div className="w-full max-w-md mx-auto rounded-t-3xl border-t border-cyan-500/40 bg-slate-950 p-4 shadow-2xl flex flex-col gap-3 max-h-[88vh] overflow-y-auto animate-slideUp text-slate-100">
          {/* Mobile Pull Handle */}
          <div className="w-12 h-1.5 rounded-full bg-slate-700 mx-auto -mt-1" />

          {/* Modal Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2.5">
              <div className={`p-2 rounded-xl border shrink-0 ${
                result.canTransmit
                  ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-400'
                  : 'bg-red-950/80 border-red-500/50 text-red-400'
              }`}>
                <Radio className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 block uppercase">
                  通訊檢驗報告 (Debrief)
                </span>
                <h3 className="text-sm font-black text-slate-100">
                  {result.canTransmit ? '🎉 通訊成功連通！' : '❌ 通訊宣告中斷失敗！'}
                </h3>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-100 rounded-xl hover:bg-slate-900"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Mission Title & Status */}
          <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col gap-1 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-cyan-400 truncate">
                {content?.title}
              </span>
              <span className="text-[10px] text-slate-400 shrink-0">
                {playerName}
              </span>
            </div>
            <p className="text-[11px] text-slate-300">
              {result.reason}
            </p>
          </div>

          {/* PACE Slot Fallback Path (Grid 2 Cols on Mobile) */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[11px] font-bold text-slate-300">
              四重防線 Fallback 檢驗路徑：
            </span>

            <div className="grid grid-cols-2 gap-2">
              {result.slotEvaluations.map((evalItem) => {
                const isHit = result.successfulSlot === evalItem.slot;
                return (
                  <div
                    key={evalItem.slot}
                    className={`p-2 rounded-xl border flex flex-col justify-between gap-1 text-xs ${
                      isHit
                        ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200 shadow-sm'
                        : evalItem.passed
                        ? 'bg-slate-900 border-slate-800 text-slate-400'
                        : 'bg-red-950/30 border-red-500/30 text-red-300'
                    }`}
                  >
                    <div className="flex items-center justify-between font-black text-[11px]">
                      <span>[{evalItem.slot}] 防線</span>
                      {isHit ? (
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      ) : evalItem.passed ? (
                        <span className="text-[9px] text-slate-500">備用</span>
                      ) : (
                        <XCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                      )}
                    </div>

                    <span className="text-[10px] font-bold truncate">
                      {evalItem.card ? evalItem.card.translations[worldview]?.name : '未配置'}
                    </span>

                    {!evalItem.passed && evalItem.failReason && (
                      <span className="text-[9px] text-red-400 leading-tight">
                        {evalItem.failReason}
                      </span>
                    )}

                    {isHit && (
                      <span className="text-[9px] font-black text-emerald-300 bg-emerald-950 px-1 py-0.5 rounded text-center">
                        命中連通 ({Math.round(result.degradationRate * 100)}%)
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Earned Rewards Summary */}
          {result.canTransmit && (
            <div className="p-2.5 rounded-2xl bg-gradient-to-r from-purple-950/50 via-slate-900 to-cyan-950/50 border border-purple-500/30 flex items-center justify-around text-center">
              <div>
                <span className="text-[10px] text-slate-400 block">救災積分</span>
                <span className="text-base font-black text-purple-300 flex items-center justify-center gap-1">
                  <Award className="w-4 h-4 text-purple-400" /> +{result.earnedVP} VP
                </span>
              </div>

              <div className="w-px h-6 bg-slate-800" />

              <div>
                <span className="text-[10px] text-slate-400 block">物資資金</span>
                <span className="text-base font-black text-emerald-300 flex items-center justify-center gap-1">
                  <Coins className="w-4 h-4 text-emerald-400" /> +{result.earnedCredits} 💰
                </span>
              </div>
            </div>
          )}

          {/* Expert Debriefing Report */}
          <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col gap-1.5 text-xs">
            <div className="flex items-center gap-1.5 text-cyan-400 font-bold text-[11px]">
              <BookOpen className="w-3.5 h-3.5" />
              <span>通訊專家復盤講評：</span>
            </div>

            <p className="text-[11px] text-slate-300 leading-relaxed whitespace-pre-line">
              {result.expertDebrief}
            </p>
          </div>

          {/* Acknowledge Button */}
          <button
            onClick={onClose}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-black text-xs tracking-wider transition-all shadow-lg active:scale-98 mt-1"
          >
            確認並繼續作戰 (Roger That) ➔
          </button>
        </div>
      </div>
    );
  }

  // Desktop Centered Modal Mode

  return (
    <div className="fixed inset-0 z-[120] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-md font-mono animate-fadeIn overflow-y-auto">
      <div className="relative w-full sm:max-w-2xl max-h-[88vh] sm:max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl border-t sm:border border-cyan-500/40 sm:border-slate-800 bg-slate-950 p-4 sm:p-7 shadow-2xl flex flex-col gap-3.5 text-slate-100 my-0 sm:my-auto animate-slideUp sm:animate-scaleUp">
        {/* Mobile Pull Handle Bar */}
        <div className="w-12 h-1.5 rounded-full bg-slate-700 mx-auto sm:hidden -mt-1" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-100 rounded-xl hover:bg-slate-900 transition-all z-10"
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
          <div className="transmission-rewards-banner p-3.5 rounded-2xl bg-gradient-to-r from-purple-950/50 via-slate-900 to-cyan-950/50 border border-purple-500/30 flex items-center justify-around text-center">
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
