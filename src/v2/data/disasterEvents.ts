import { DisasterEvent } from '../types/game';

export const V2_DISASTER_EVENTS: DisasterEvent[] = [
  {
    id: 'evt_grid_blackout',
    duration: 1,
    targetedMedia: ['Cellular'],
    powerDrainBonus: 1,
    translations: {
      CivilDefense: {
        title: '全島大停電 (市電全面斷電)',
        desc: '電網完全停擺！所有【公眾網/基地台 Cellular】因備援電池耗盡而全面中斷！所有需電設備運作耗電 +1⚡。',
        flavor: '整座城市的燈火瞬間熄滅，手機信號格數歸零，黑夜降臨。',
        icon: 'BatteryLow',
      },
      IslandResilience: {
        title: '全島關鍵電網大停電',
        desc: '市電電網中斷！所有【公眾網基地台 Cellular】全面停擺，設備耗電 +1⚡。',
        flavor: '電網骨幹跳脫，所有未接發電機之基地台陷入靜默。',
        icon: 'BatteryLow',
      },
      CyberDisconnect: {
        title: '中央能源網格崩潰',
        desc: '都市能源矩陣熄滅，【公眾光纖終端 Cellular】離線，設備能耗加倍。',
        flavor: '巨型摩天大樓群失去光彩，霓虹都市淪為鋼鐵墓地。',
        icon: 'BatteryLow',
      },
    },
  },
  {
    id: 'evt_super_typhoon',
    duration: 1,
    targetedMedia: ['Satellite'],
    rangePenalty: true,
    translations: {
      CivilDefense: {
        title: '強烈颱風登陸 (暴風雨狂襲)',
        desc: '狂風暴雨肆虐！厚重雲層嚴重衰減【衛星通訊 Satellite】訊號，且所有【光學/信號燈】距離降為近距。',
        flavor: '傾盆大雨模糊了一切視線，雨衰效應讓衛星天線接收不到信號。',
        icon: 'CloudRain',
      },
      IslandResilience: {
        title: '五級超強颱風登陸',
        desc: '極端對流雨帶阻斷【衛星通訊 Satellite】，光學視距受到嚴重壓制。',
        flavor: '狂風呼嘯，大雨將低軌衛星的高頻微波散射得無影無蹤。',
        icon: 'CloudRain',
      },
      CyberDisconnect: {
        title: '強酸暴風雨與電漿雲',
        desc: '強腐蝕性雲層遮蔽天際，【軌道衛星 Satellite】信標完全失鎖。',
        flavor: '酸雨腐蝕著天線塗層，大氣層變成了一面無法穿透的鉛幕。',
        icon: 'CloudRain',
      },
    },
  },
  {
    id: 'evt_emp_strike',
    duration: 1,
    targetedMedia: ['Cellular', 'Radio'],
    translations: {
      CivilDefense: {
        title: '高空電磁脈衝爆震 (EMP 襲擊)',
        desc: '致命電磁衝擊！所有未做防護的【公眾網 Cellular】與【無線電 Radio】晶片過載失效！唯有實體有線、光學與人力手段能倖免！',
        flavor: '天空閃過一陣刺眼白光，所有通電的手機與電台同時發出焦味。',
        icon: 'ZapOff',
      },
      IslandResilience: {
        title: '高空電磁脈衝 (EMP) 攻擊',
        desc: '廣域強電磁衝擊！【基地台 Cellular】與【無線電 Radio】全線癱瘓，強制依賴有線與物理防線。',
        flavor: '強大電流感應燒毀了所有露天天線的射頻放大器。',
        icon: 'ZapOff',
      },
      CyberDisconnect: {
        title: '軌道高能電磁爆震',
        desc: '超高功率微波覆蓋，【網格與無線頻段】全面燒毀，僅存機械與光學通道。',
        flavor: '電弧在每根導線上跳躍，所有數位晶片化作一團廢鐵。',
        icon: 'ZapOff',
      },
    },
  },
  {
    id: 'evt_earthquake_landslide',
    duration: 1,
    targetedMedia: ['Wired'],
    translations: {
      CivilDefense: {
        title: '強烈大地震 (地下管線扯斷)',
        desc: '劇烈地牛翻身！山區土石流與地表撕裂扯斷了【實體有線 Wired】線路！需依靠無線電或衛星通訊！',
        flavor: '道路塌陷，深埋地下的電話銅線與光纖被巨石無情扯斷。',
        icon: 'Layers',
      },
      IslandResilience: {
        title: '強震與山區土石流災情',
        desc: '地殼錯動導致【地底光纖/實體有線 Wired】嚴重損毀中斷。',
        flavor: '中央山脈道路中斷，地底線路遭到地層錯位撕裂。',
        icon: 'Layers',
      },
      CyberDisconnect: {
        title: '地殼斷層劇烈撕裂',
        desc: '地下城通道坍塌，【地底超導線路 Wired】全數切斷。',
        flavor: '地底深處傳來崩解的轟鳴，實體電纜在岩層擠壓中化為齏粉。',
        icon: 'Layers',
      },
    },
  },
  {
    id: 'evt_broadband_jamming',
    duration: 1,
    targetedMedia: ['Radio'],
    translations: {
      CivilDefense: {
        title: '不明全頻段電子雜訊干擾',
        desc: '全頻段白雜訊覆蓋！所有【無線電 Radio】頻道充斥強烈嘶嘶聲，語音無法辨識！',
        flavor: '打開對講機，每個頻道都傳來震耳欲聾的雜音，無法聽清任何指令。',
        icon: 'ShieldAlert',
      },
      IslandResilience: {
        title: '敵方強功率電子戰干擾',
        desc: '強烈電子壓制使【戰術無線電 Radio】完全失靈，需依靠衛星或物理信差。',
        flavor: '干擾機在高空盤旋，用大功率雜訊將整個 VHF/UHF 頻譜徹底淹沒。',
        icon: 'ShieldAlert',
      },
      CyberDisconnect: {
        title: '失控 AI 頻譜白雜訊風暴',
        desc: '全頻段數據洪流壓制，【無線電波 Radio】徹底被亂碼淹沒。',
        flavor: '耳機中迴盪著無意義的數位噪音，頻譜空間已被惡意代碼佔領。',
        icon: 'ShieldAlert',
      },
    },
  },
  {
    id: 'evt_optimal_calm',
    duration: 1,
    targetedMedia: [],
    translations: {
      CivilDefense: {
        title: '天候晴朗與大氣穩定 (通訊黃金期)',
        desc: '天候極佳，電離層與無線電頻譜極度純淨！本回合所有成功完成的任務額外獲得 +1 💰 救災物資獎勵。',
        flavor: '萬里無雲的晴空，所有波段的訊號清晰無比，通訊效率達到頂峰。',
        icon: 'Sparkles',
      },
      IslandResilience: {
        title: '電磁靜默與最佳電離層天候',
        desc: '頻譜環境純淨，大氣傳播良好，成功通訊額外獲得 +1 💰 物資。',
        flavor: '微風徐徐，電離層反射條件絕佳，跨山通訊毫無阻礙。',
        icon: 'Sparkles',
      },
      CyberDisconnect: {
        title: '短暫的電磁風暴平息期',
        desc: '地表電磁場暫時平穩，所有連通任務額外產出 +1 💰 資源。',
        flavor: '廢土上空久違地露出了藍天，各庇護所抓緊時機進行數據交換。',
        icon: 'Sparkles',
      },
    },
  },
];
