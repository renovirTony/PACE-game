import { CrisisMission, PACESlot, TransmissionResult, WorldviewType } from '../../types/game';
import { Radio, CheckCircle, XCircle, Award, Coins, BookOpen, X, MinusCircle } from 'lucide-react';

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

const PACE_ORDER: PACESlot[] = ['P', 'A', 'C', 'E'];

type SlotRow = TransmissionResult['slotEvaluations'][number] & { skipped?: boolean };

/**
 * 永遠列出完整的 P → A → C → E 四層路徑（S：讓玩家看到「接手之後的防線還在待命」）。
 * 引擎在成功時會提早結束，後面的槽位補成「未啟用」灰卡。
 */
function buildFullPath(result: TransmissionResult): SlotRow[] {
  return PACE_ORDER.map(slot => {
    const found = result.slotEvaluations.find(s => s.slot === slot);
    return found ?? { slot, card: null, passed: false, skipped: true };
  });
}

/** 手機與桌面共用的報告內容（只有外框與尺寸不同） */
function ReportBody({
  result,
  worldview,
  compact,
}: {
  result: TransmissionResult;
  worldview: WorldviewType;
  compact: boolean;
}) {
  const path = buildFullPath(result);
  // 受阻的防線各自的專家說明（做中學：告訴玩家「為什麼這道不行」）
  const blockedDetails = path.filter(s => s.card && !s.passed && !s.skipped && s.expertDetail);

  return (
    <>
      {/* 四層檢驗路徑 */}
      <div className="flex flex-col gap-1.5">
        <span className={`${compact ? 'text-[11px]' : 'text-xs'} font-bold text-slate-300`}>
          四重防線依序接手檢驗：
        </span>

        <div className={`grid ${compact ? 'grid-cols-2' : 'grid-cols-2 sm:grid-cols-4'} gap-2`}>
          {path.map((row) => {
            const isHit = result.successfulSlot === row.slot;
            const tone = isHit
              ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200 shadow-sm'
              : row.skipped
              ? 'bg-slate-900/40 border-slate-800 border-dashed text-slate-500'
              : !row.card
              ? 'bg-slate-900/60 border-slate-800 text-slate-500'
              : 'bg-red-950/30 border-red-500/30 text-red-300';

            return (
              <div key={row.slot} className={`p-2 rounded-xl border flex flex-col gap-1 text-xs ${tone}`}>
                <div className="flex items-center justify-between font-black text-[11px]">
                  <span>[{row.slot}] 防線</span>
                  {isHit ? (
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" aria-label="接手成功" />
                  ) : row.skipped ? (
                    <MinusCircle className="w-3.5 h-3.5 text-slate-600 shrink-0" aria-label="未啟用" />
                  ) : (
                    <XCircle className="w-3.5 h-3.5 text-red-400 shrink-0" aria-label="受阻" />
                  )}
                </div>

                <span className="text-[11px] font-bold truncate">
                  {row.skipped ? '待命（未啟用）' : row.card ? row.card.translations[worldview]?.name : '未配置裝備'}
                </span>

                {isHit && (
                  <span className="text-[10px] font-black text-emerald-300 bg-emerald-950 px-1 py-0.5 rounded text-center">
                    接手連通（收益 {Math.round(result.degradationRate * 100)}%）
                  </span>
                )}
                {row.skipped && (
                  <span className="text-[10px] text-slate-500 leading-tight">前一道已接手，不需動用</span>
                )}
                {!isHit && !row.skipped && row.card && row.failReason && (
                  <span className="text-[10px] text-red-400 leading-tight">{row.failReason}</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 獲得獎勵 */}
      {result.canTransmit && (
        <div className="p-2.5 rounded-2xl bg-gradient-to-r from-purple-950/50 via-slate-900 to-cyan-950/50 border border-purple-500/30 flex items-center justify-around text-center">
          <div>
            <span className="text-[10px] text-slate-400 block">獲得救災積分</span>
            <span className={`${compact ? 'text-base' : 'text-lg'} font-black text-purple-300 flex items-center justify-center gap-1`}>
              <Award className="w-4 h-4 text-purple-400" /> +{result.earnedVP} 分
            </span>
          </div>
          <div className="w-px h-6 bg-slate-800" />
          <div>
            <span className="text-[10px] text-slate-400 block">獲得物資</span>
            <span className={`${compact ? 'text-base' : 'text-lg'} font-black text-emerald-300 flex items-center justify-center gap-1`}>
              <Coins className="w-4 h-4 text-emerald-400" /> +{result.earnedCredits} 💰
            </span>
          </div>
        </div>
      )}

      {/* 專家復盤 */}
      <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col gap-1.5 text-xs">
        <div className="flex items-center gap-1.5 text-cyan-400 font-bold text-[11px]">
          <BookOpen className="w-3.5 h-3.5" />
          <span>通訊專家復盤講評</span>
        </div>
        <p className="text-[11px] sm:text-xs text-slate-300 leading-relaxed whitespace-pre-line">{result.expertDebrief}</p>

        {blockedDetails.length > 0 && (
          <ul className="mt-1 pt-1.5 border-t border-slate-800 flex flex-col gap-1">
            {blockedDetails.map(row => (
              <li key={row.slot} className="text-[11px] text-slate-400 leading-relaxed">
                <b className="text-red-300">為什麼 [{row.slot}] 不行：</b>
                {row.expertDetail}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
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
  const title = result.canTransmit ? '通訊成功連通！' : '通訊中斷，任務失敗';

  const header = (
    <div className="flex items-center gap-2.5">
      <div
        className={`p-2 rounded-xl border shrink-0 ${
          result.canTransmit
            ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-400'
            : 'bg-red-950/80 border-red-500/50 text-red-400'
        }`}
      >
        <Radio className={isMobile ? 'w-5 h-5' : 'w-7 h-7'} />
      </div>
      <div>
        <span className="text-[10px] sm:text-xs font-bold text-slate-400 block">通訊檢定報告</span>
        <h3 className={`${isMobile ? 'text-sm' : 'text-lg sm:text-xl'} font-black text-slate-100`}>
          {result.canTransmit ? '🎉 ' : '❌ '}
          {title}
        </h3>
      </div>
    </div>
  );

  const missionBox = (
    <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col gap-1 text-xs">
      <div className="flex items-center justify-between gap-2">
        <span className="font-bold text-cyan-400 truncate">任務：{content?.title}</span>
        <span className="text-[10px] text-slate-400 shrink-0">執行：{playerName}</span>
      </div>
      <p className="text-[11px] sm:text-xs text-slate-300">{result.reason}</p>
    </div>
  );

  const closeButton = (
    <button
      onClick={onClose}
      autoFocus
      className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-black text-xs sm:text-sm tracking-wider transition-all shadow-lg active:scale-98"
    >
      收到，繼續 ➔
    </button>
  );

  // 手機：由下而上的 BottomSheet
  if (isMobile) {
    return (
      <div className="fixed inset-0 z-[120] flex flex-col justify-end bg-black/85 backdrop-blur-md font-mono animate-fadeIn" role="dialog" aria-modal="true">
        <div onClick={onClose} className="flex-1" />
        <div className="w-full max-w-md mx-auto rounded-t-3xl border-t border-cyan-500/40 bg-slate-950 p-4 shadow-2xl flex flex-col gap-3 max-h-[88vh] overflow-y-auto animate-slideUp text-slate-100">
          <div className="w-12 h-1.5 rounded-full bg-slate-700 mx-auto -mt-1" />
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            {header}
            <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-100 rounded-xl hover:bg-slate-900" aria-label="關閉">
              <X className="w-4 h-4" />
            </button>
          </div>
          {missionBox}
          <ReportBody result={result} worldview={worldview} compact />
          {closeButton}
        </div>
      </div>
    );
  }

  // 桌面：置中視窗
  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md font-mono animate-fadeIn overflow-y-auto" role="dialog" aria-modal="true">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-slate-800 bg-slate-950 p-5 sm:p-7 shadow-2xl flex flex-col gap-3.5 text-slate-100 animate-scaleUp">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-100 rounded-xl hover:bg-slate-900 transition-all z-10"
          aria-label="關閉"
        >
          <X className="w-5 h-5" />
        </button>
        {header}
        {missionBox}
        <ReportBody result={result} worldview={worldview} compact={false} />
        {closeButton}
      </div>
    </div>
  );
}
