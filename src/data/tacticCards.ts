import { TacticCard } from '../types/game';

export const TACTIC_CARDS: TacticCard[] = [
  {
    id: 'tac_power_generator',
    name: '機動柴油發電機 (Mobile Generator)',
    type: 'Support',
    cost: 2,
    effectType: 'GAIN_ENERGY',
    value: 3,
    description: '立即補充 3 點電量 (Energy)，為高耗電設備注入動力。',
    iconName: 'Zap',
    flavorText: '轟鳴的柴油引擎，是電子通訊裝備的心臟跳動聲。'
  },
  {
    id: 'tac_supply_airdrop',
    name: '後勤補給空投 (Supply Airdrop)',
    type: 'Support',
    cost: 1,
    effectType: 'GAIN_CREDITS',
    value: 3,
    description: '立即獲得 3 點物資資金 (Credits)，加速升級通訊裝備。',
    iconName: 'Package',
    flavorText: '精準空投降落傘徐徐落下，帶來了最緊缺的電池與晶片。'
  },
  {
    id: 'tac_yagi_antenna',
    name: '八木定向天線校準 (Directional Yagi Boost)',
    type: 'Upgrade',
    cost: 2,
    effectType: 'SIGNAL_BOOST',
    value: 1,
    description: '本回合下次廣播任務若成功，額外獲得 +1 VP 訊號增益積分！',
    iconName: 'Radio',
    flavorText: '精準對準遠方反射點，將雜訊降低 20 分貝。'
  },
  {
    id: 'tac_overclock_amp',
    name: '高功率射頻超頻 (RF Power Overdrive)',
    type: 'Upgrade',
    cost: 2,
    effectType: 'OVERCLOCK',
    value: 1,
    description: '發動時消耗 1 點電量，本回合所有無線電通訊設備覆蓋範圍提升一階（近距 Local 可支援 戰術 Tactical；戰術 Tactical 可支援 全球 Global）。',
    iconName: 'Flame',
    flavorText: '將發射功率推至極限紅線，突破強烈干擾霧靄！'
  },
  {
    id: 'tac_emp_shield_patch',
    name: '法拉第抗干擾遮蔽 (Faraday Cage Armor)',
    type: 'Upgrade',
    cost: 2,
    effectType: 'SECURE_CHANNEL',
    value: 1,
    description: '使你當前 [P] 主要 與 [A] 備用 槽位的設備在本回合獲得「抗 EMP 防護」，免疫高空電磁脈衝爆震 (EMP) 癱瘓與相關任務限制！',
    iconName: 'Shield',
    flavorText: '多層銅箔與接地編織網，將致命電磁脈衝導向大地。'
  },
  {
    id: 'tac_drone_scout',
    name: '前進偵蒐先遣隊 (Recon UAV Scout)',
    type: 'Intel',
    cost: 1,
    effectType: 'SCOUT_AHEAD',
    value: 1,
    description: '探查下回合危機任務，並獲得 1 點物資與 1 點電量。',
    iconName: 'Eye',
    flavorText: '高空偵察機將戰場電磁頻譜情報一覽無遺回傳。'
  }
];
