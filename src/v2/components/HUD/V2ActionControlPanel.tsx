import { Player, TacticCard, WorldviewType } from '../../types/game';
import { Zap, Play, ArrowRight, Shield } from 'lucide-react';

type GoToTab = (tab: 'defense' | 'missions' | 'market' | 'tactics') => void;

/** 單一 buff 徽章；有 onGo 時附上「前往 ➔」捷徑（手機版用來切分頁） */
function BuffChip({
  label,
  colorClass,
  pulse,
  goLabel,
  goTitle,
  onGo,
}: {
  label: string;
  colorClass: string;
  pulse?: boolean;
  goLabel?: string;
  goTitle?: string;
  onGo?: () => void;
}) {
  return (
    <div className="flex items-center gap-1 shrink-0">
      <span className={`px-2 py-0.5 rounded-full border font-black ${colorClass} ${pulse ? 'animate-pulse' : ''}`}>{label}</span>
      {onGo && goLabel && (
        <button
          onClick={onGo}
          className="px-2 py-0.5 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-200 text-[10px] font-bold border border-slate-600/60 transition-all active:scale-95 shadow-sm"
          title={goTitle}
        >
          {goLabel}
        </button>
      )}
    </div>
  );
}

/**
 * 本回合生效中的戰術增益（手機戰術頁與桌面指揮官行動區共用）。
 * 沒有任何 buff 時不渲染。
 */
export function ActiveBuffsBanner({ player, onGoToTab }: { player: Player; onGoToTab?: GoToTab }) {
  const buffs = player.activeBuffs;
  if (!buffs || !Object.values(buffs).some(Boolean)) return null;

  return (
    <div className="p-2.5 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 flex items-center gap-2 flex-wrap text-[11px]">
      <span className="text-cyan-400 font-bold shrink-0">⚡ 本回合戰術增益：</span>
      {buffs.agileProtocolActive && (
        <BuffChip
          label="🔄 敏捷防線 (調換 0 AP)"
          colorClass="bg-purple-950 text-purple-300 border-purple-500/40"
          pulse
          goLabel="前往防線 ➔"
          goTitle="前往防線面板執行對調"
          onGo={onGoToTab && (() => onGoToTab('defense'))}
        />
      )}
      {buffs.freeMarketPurchaseActive && (
        <BuffChip
          label="🛒 綠色後勤 (採購 0 AP)"
          colorClass="bg-emerald-950 text-emerald-300 border-emerald-500/40"
          pulse
          goLabel="前往市場 ➔"
          goTitle="前往市場執行免 AP 採購"
          onGo={onGoToTab && (() => onGoToTab('market'))}
        />
      )}
      {buffs.freeTransmissionActive && (
        <BuffChip
          label="📡 突發通訊令 (通訊 0 AP)"
          colorClass="bg-amber-950 text-amber-300 border-amber-500/40"
          pulse
          goLabel="前往任務 ➔"
          goTitle="前往危機任務發起通訊檢定 (免 AP)"
          onGo={onGoToTab && (() => onGoToTab('missions'))}
        />
      )}
      {buffs.communityRelayActive && (
        <BuffChip label="👥 志願者中繼 (C/E 滿額 100%)" colorClass="bg-cyan-950 text-cyan-300 border-cyan-500/40" />
      )}
      {buffs.faradayEmpArmor && (
        <BuffChip label="🛡️ 法拉第屏蔽 (免疫 EMP)" colorClass="bg-blue-950 text-blue-300 border-blue-500/40" />
      )}
      {buffs.antennaBoostRange && (
        <BuffChip label="📡 八木增益 (無線電距離 +1)" colorClass="bg-blue-950 text-blue-300 border-blue-500/40" />
      )}
    </div>
  );
}

interface V2ActionControlPanelProps {
  player: Player;
  isCurrentPlayer: boolean;
  isAI: boolean;
  worldview: WorldviewType;
  onPlayTactic: (card: TacticCard) => boolean;
  onRecharge: () => boolean;
  onRequisition: () => boolean;
  onEndTurn: () => void;
  onGoToTab?: GoToTab;
}

export function V2ActionControlPanel({
  player,
  isCurrentPlayer,
  isAI,
  worldview,
  onPlayTactic,
  onRecharge,
  onRequisition,
  onEndTurn,
  onGoToTab,
}: V2ActionControlPanelProps) {
  const canActWithAP = isCurrentPlayer && !isAI && player.actionPoints > 0;
  const canPlayTactic = isCurrentPlayer && !isAI;
  const canRecharge = canActWithAP && player.energy < player.maxEnergy;

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-4 sm:p-5 shadow-2xl backdrop-blur-md font-mono flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-400" />
          行動與手牌戰術
        </h3>
        <span className="text-xs text-slate-400">
          剩餘 AP: <span className="font-bold text-cyan-400">{player.actionPoints}</span>
        </span>
      </div>

      <ActiveBuffsBanner player={player} onGoToTab={onGoToTab} />

      {/* Quick Field Actions：整補雙雄同列 */}
      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Recharge Action */}
          <button
            data-tutorial="recharge-btn"
            onClick={onRecharge}
            disabled={!canRecharge}
            className={`p-3 rounded-2xl border font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm active:scale-95 ${
              canRecharge
                ? 'bg-amber-950/40 hover:bg-amber-900/60 border-amber-500/40 text-amber-300'
                : 'bg-slate-900 border-slate-800 text-slate-600 opacity-50 cursor-not-allowed'
            }`}
          >
            <Zap className="w-4 h-4 text-amber-400" />
            <span>野戰充電 (+2⚡ / 1 AP)</span>
          </button>

          {/* Emergency Requisition Action */}
          <button
            data-tutorial="requisition-btn"
            onClick={onRequisition}
            disabled={!canActWithAP}
            className={`p-3 rounded-2xl border font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm active:scale-95 ${
              canActWithAP
                ? 'bg-emerald-950/40 hover:bg-emerald-900/60 border-emerald-500/40 text-emerald-300'
                : 'bg-slate-900 border-slate-800 text-slate-600 opacity-50 cursor-not-allowed'
            }`}
            title="向應變中心申請緊急後勤調撥 (+2💰 | 消耗 1 AP)"
          >
            <span className="text-sm">💰</span>
            <span>後勤調撥 (+2💰 / 1 AP)</span>
          </button>
        </div>

        {/* End Turn Action：獨立整行，避免誤觸旁邊的整補鍵 */}
        <button
          data-tutorial="end-turn-btn"
          onClick={onEndTurn}
          disabled={!isCurrentPlayer || isAI}
          className="w-full p-3 rounded-2xl border text-xs flex items-center justify-center gap-2 transition-all active:scale-95 shadow-sm bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-200 font-bold"
        >
          <span>結束回合</span>
          <ArrowRight className="w-4 h-4 text-cyan-400" />
        </button>
      </div>

      {/* Hand Tactics Section */}
      <div className="flex flex-col gap-2 pt-2 border-t border-slate-800 rounded-2xl p-2 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-purple-400" /> 手牌戰術卡 ({player.handTactics.length} 張)
          </span>
          <span className="text-[10px] text-purple-400 font-bold">
            ⚡ 戰術卡使用不消耗AP
          </span>
        </div>

        {player.handTactics.length === 0 ? (
          <div className="py-4 text-center text-xs text-slate-500 border border-dashed border-slate-800 rounded-2xl">
            手牌無戰術卡（可至右側市場採購）
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-2.5">
            {player.handTactics.map((tactic, idx) => {
              const content = tactic.translations[worldview];
              return (
                <div
                  key={`${tactic.id}-${idx}`}
                  data-tutorial={idx === 0 ? 'tactic-card-0' : undefined}
                  className="p-3 rounded-2xl bg-slate-900/90 border border-purple-500/30 hover:border-purple-500/60 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md"
                >
                  <div className="flex flex-col gap-1 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-black text-purple-300">
                        {content?.name}
                      </span>
                      {tactic.effectType === 'RECHARGE_BATTERY' && (
                        <span className="px-1.5 py-0.5 rounded-full text-[9px] font-black bg-amber-950 text-amber-300 border border-amber-500/30">
                          ⚡ +{tactic.value || 3} 電力
                        </span>
                      )}
                      {tactic.effectType === 'AIRDROP_CREDITS' && (
                        <span className="px-1.5 py-0.5 rounded-full text-[9px] font-black bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                          💰 +{tactic.value || 3} 物資
                        </span>
                      )}
                      {tactic.effectType === 'DEPLOY_ANTENNA' && (
                        <span className="px-1.5 py-0.5 rounded-full text-[9px] font-black bg-blue-950 text-blue-300 border border-blue-500/30">
                          📡 距離 +1
                        </span>
                      )}
                      {tactic.effectType === 'FARADAY_SHIELD' && (
                        <span className="px-1.5 py-0.5 rounded-full text-[9px] font-black bg-blue-950 text-blue-300 border border-blue-500/30">
                          🛡️ 免疫 EMP
                        </span>
                      )}
                      {tactic.effectType === 'COMMUNITY_RELAY' && (
                        <span className="px-1.5 py-0.5 rounded-full text-[9px] font-black bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                          👥 C/E 滿額 100%
                        </span>
                      )}
                      {tactic.effectType === 'AGILE_PROTOCOL' && (
                        <span className="px-1.5 py-0.5 rounded-full text-[9px] font-black bg-purple-950 text-purple-300 border border-purple-500/30">
                          🔄 調換 0 AP
                        </span>
                      )}
                      {tactic.effectType === 'FREE_MARKET_PURCHASE' && (
                        <span className="px-1.5 py-0.5 rounded-full text-[9px] font-black bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                          🛒 採購 0 AP
                        </span>
                      )}
                      {tactic.effectType === 'FREE_TRANSMISSION' && (
                        <span className="px-1.5 py-0.5 rounded-full text-[9px] font-black bg-amber-950 text-amber-300 border border-amber-500/30">
                          📡 通訊 0 AP
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      {content?.desc}
                    </p>
                  </div>

                  <button
                    onClick={() => onPlayTactic(tactic)}
                    disabled={!canPlayTactic}
                    className={`px-3.5 py-2 rounded-xl text-xs font-black shrink-0 transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5 ${
                      canPlayTactic
                        ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-500/20'
                        : 'bg-slate-900 text-slate-600 opacity-50 cursor-not-allowed border border-slate-800'
                    }`}
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>即時發動 (0 AP)</span>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
