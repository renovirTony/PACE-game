import { TacticCard } from '../types/game';

export const V2_TACTIC_CARDS: TacticCard[] = [
  {
    id: 'tac_mobile_generator',
    cost: 2,
    effectType: 'RECHARGE_BATTERY',
    value: 3,
    translations: {
      CivilDefense: {
        name: '向工廠借用柴油發電機',
        desc: '立即獲得 ⚡3 點電量，為高耗電設備（如基地台或充電座）注滿電力。',
        flavor: '轟鳴的柴油引擎是停電時電子通訊的心臟跳動聲。',
        icon: 'Zap',
      },
      IslandResilience: {
        name: '野戰機動發電機',
        desc: '立即獲得 ⚡3 點電量，確保關鍵戰術設備電力無虞。',
        flavor: '隨車攜帶的靜音柴油發電機，驅散了黑暗。',
        icon: 'Zap',
      },
      CyberDisconnect: {
        name: '微型核聚變電池包',
        desc: '立即注入 ⚡3 點能量，重啟停擺的重型節點。',
        flavor: '藍色微光在電池芯中流轉，高能粒子瞬間充盈電容。',
        icon: 'Zap',
      },
    },
  },
  {
    id: 'tac_emergency_supplies',
    cost: 1,
    effectType: 'AIRDROP_CREDITS',
    value: 3,
    translations: {
      CivilDefense: {
        name: '民間救災物資調配',
        desc: '立即獲得 💰3 點物資資金，加速採購應急通訊工具。',
        flavor: '熱心民眾與民間企業送來了最緊缺的對講機電池與線材。',
        icon: 'Package',
      },
      IslandResilience: {
        name: '後勤補給快速空投',
        desc: '立即獲得 💰3 點物資資金，充實前線採購經費。',
        flavor: '降落傘緩緩落地，帶來了最新通訊組件與備用電池。',
        icon: 'Package',
      },
      CyberDisconnect: {
        name: '廢墟黑市資源補給',
        desc: '立即獲得 💰3 點物資，交換關鍵零件與硬體。',
        flavor: '在暗巷中完成晶片交易，換取最後的通訊模組。',
        icon: 'Package',
      },
    },
  },
  {
    id: 'tac_yagi_antenna_boost',
    cost: 2,
    effectType: 'DEPLOY_ANTENNA',
    value: 1,
    translations: {
      CivilDefense: {
        name: '架設自製八木定向天線',
        desc: '本回合所有【無線電 Radio】設備覆蓋範圍提升一階（近距 Local ➔ 視距 LineOfSight；視距 ➔ 長距離 LongRange）。',
        flavor: '利用鐵絲衣架與木棒自製八木天線，訊號強度立刻暴增 10 倍！',
        icon: 'Radio',
      },
      IslandResilience: {
        name: '八木高增益定向天線校準',
        desc: '本回合所有【無線電 Radio】通訊距離提升一階。',
        flavor: '將定向天線對準遠方山頂中繼站，將信噪比推至極限。',
        icon: 'Radio',
      },
      CyberDisconnect: {
        name: '高功率射頻聚焦透鏡',
        desc: '本回合所有【無線電 Radio】射程提升一階。',
        flavor: '聚焦電磁波束，將微弱的射頻信號如光束般打向天際。',
        icon: 'Radio',
      },
    },
  },
  {
    id: 'tac_faraday_shield_bag',
    cost: 2,
    effectType: 'FARADAY_SHIELD',
    value: 1,
    translations: {
      CivilDefense: {
        name: '法拉第屏蔽袋防護',
        desc: '本回合你所有的電子設備獲得「抗 EMP 防護」，免疫高空電磁脈衝 (EMP) 的過載癱瘓！',
        flavor: '平時將備用對講機收在多層鋁箔法拉第袋中，EMP 來襲時完好如初！',
        icon: 'Shield',
      },
      IslandResilience: {
        name: '戰術法拉第防護籠',
        desc: '本回合所有電子設備獲得「抗 EMP 防護」。',
        flavor: '嚴密的金屬屏蔽網將致命高能電磁脈衝迅速導向大地。',
        icon: 'Shield',
      },
      CyberDisconnect: {
        name: '超導電磁偏轉護盾',
        desc: '本回合所有設備免疫電磁爆震。',
        flavor: '超導線圈激發抗磁場，將高能微波完全彈開。',
        icon: 'Shield',
      },
    },
  },
  {
    id: 'tac_community_relay_node',
    cost: 2,
    effectType: 'COMMUNITY_RELAY',
    value: 1,
    translations: {
      CivilDefense: {
        name: '啟動社區志願者中繼台',
        desc: '本回合因 Fallback 退入 [C] 或 [E] 的任務，獲得「志願者中繼加持」，通訊降級損失減半（C 獲得 85% 收益，E 獲得 75% 收益）！',
        flavor: '山頂熱心的業餘無線電玩家幫忙人工轉發，讓簡陋的訊號也能完整送達！',
        icon: 'Users',
      },
      IslandResilience: {
        name: '建立前進中繼指揮節點',
        desc: '本回合 [C] 與 [E] 應急通訊降級損失減半。',
        flavor: '在高處設立中繼哨，銜接前線與後方的情報斷層。',
        icon: 'Users',
      },
      CyberDisconnect: {
        name: '廢土地下信差網絡',
        desc: '本回合 [C] 與 [E] 應急手段收益大幅提升。',
        flavor: '潛伏在廢墟中的信差們開始接力，傳遞最後的信息。',
        icon: 'Users',
      },
    },
  },
  {
    id: 'tac_recon_scout',
    cost: 1,
    effectType: 'SCOUT_AHEAD',
    value: 1,
    translations: {
      CivilDefense: {
        name: '派出社區巡守偵察隊',
        desc: '探查前線最新災情，並立即獲得 💰1 點物資與 ⚡1 點電量。',
        flavor: '巡守隊員騎車繞行全村，第一時間回報道路與橋樑受損狀況。',
        icon: 'Eye',
      },
      IslandResilience: {
        name: '先遣無人機偵察掃描',
        desc: '探查戰場頻譜狀況，獲得 💰1 物資與 ⚡1 電量。',
        flavor: '高空偵察機繪製出最新的電磁干擾熱區圖。',
        icon: 'Eye',
      },
      CyberDisconnect: {
        name: '神經探針前導掃描',
        desc: '探測周邊頻譜波動，獲得 💰1 資源與 ⚡1 能量。',
        flavor: '探針刺入虛空，捕捉電磁風暴移動的微弱軌跡。',
        icon: 'Eye',
      },
    },
  },
];
