import { GlobalEvent } from '../types/game';

export const GLOBAL_EVENTS: GlobalEvent[] = [
  {
    id: 'evt_solar_storm',
    title: 'X級強烈太陽閃焰 (Solar Flare Radiation)',
    duration: 1,
    effectDescription: '強烈帶電粒子轟擊！所有【衛星 Satellite】與【高頻短波 HF】通訊全面癱瘓中斷！',
    blockedCategories: ['Satellite', 'HF/Shortwave'],
    iconName: 'Sun',
    flavor: '赤紅極光覆蓋夜空，人造衛星感測器過載，電離層擾動嚴重。'
  },
  {
    id: 'evt_emp_strike',
    title: '高空電磁脈衝爆震 (High-Altitude EMP Shock)',
    duration: 1,
    effectDescription: '致命電磁衝擊波！所有無 EMP 防護的電子設備（P/A 槽位）暫時失效，必須依靠 C 或 E 應急手段！',
    jammedSlots: ['P', 'A'],
    bandwidthPenalty: true,
    iconName: 'ZapOff',
    flavor: '天空閃過一陣白光，所有未加固的電晶體同時發出劈啪焦味。'
  },
  {
    id: 'evt_severe_typhoon',
    title: '超強颱風與暴雨 (Cat-5 Super Typhoon)',
    duration: 1,
    effectDescription: '狂風暴雨肆虐！所有【光學 Optical】與【無人機信差 Drone】無法運作！',
    blockedCategories: ['Optical/Visual', 'Physical/Courier'],
    iconName: 'CloudRain',
    flavor: '傾盆大雨模糊了一切視線，狂風將輕型無人機狠狠摔碎在山坡上。'
  },
  {
    id: 'evt_grid_blackout',
    title: '全區域電網大停電 (Grid-Wide Total Blackout)',
    duration: 1,
    effectDescription: '市電全面切斷！所有通訊設備本回合運作額外多消耗 1 點電量！',
    powerDrainBonus: 1,
    iconName: 'BatteryLow',
    flavor: '整座城市的霓虹燈瞬間熄滅，陷入深沉的黑暗與靜默。'
  },
  {
    id: 'evt_electronic_jamming',
    title: '敵方全頻段雜訊干擾 (Broadband Noise Jamming)',
    duration: 1,
    effectDescription: '強大白雜訊覆蓋！【P 主要通訊槽位】被強烈干擾，強制啟用 A/C/E 備援方案！',
    jammedSlots: ['P'],
    iconName: 'ShieldAlert',
    flavor: '耳機裡只剩下震耳欲聾的嘶嘶粉紅雜音，主頻率完全被覆蓋。'
  },
  {
    id: 'evt_clear_skies',
    title: '電磁靜默與晴空 (Optimal Ionospheric Conditions)',
    duration: 1,
    effectDescription: '天候極佳，大氣電離層穩定。所有成功通訊的玩家額外獲得 +1 Credits 獎勵。',
    iconName: 'Sparkles',
    flavor: '乾淨純淨的無線電頻譜，所有波段信號傳播效率達到年度巔峰。'
  }
];
