import { CrisisMission } from '../types/game';

export const CRISIS_MISSIONS: CrisisMission[] = [
  {
    id: 'mis_high_res_recon',
    title: '高解析度空拍情資回傳',
    description: '前線偵察機拍攝到極具價值的空照圖組，需要高頻寬通道將數 GB 的影像即時上傳至總部。',
    vp: 4,
    creditReward: 3,
    requiredBandwidth: 'High',
    requiredRange: ['Local', 'Tactical', 'Global'],
    urgency: 'High',
    iconName: 'Image',
    flavor: '「每一像素都關乎前線數百人的安全，立刻開啟高頻寬鏈路！」',
    claimedBy: []
  },
  {
    id: 'mis_mountain_avalanche',
    title: '暴風雪雪崩搜救呼叫',
    description: '巡邏小隊在阿爾卑斯山脈遭雪崩圍困，基地台已被壓垮，急需戰術無線電或衛星備用通訊指引直升機。',
    vp: 3,
    creditReward: 2,
    requiredRange: ['Tactical', 'Global'],
    requiresWeatherResist: true,
    urgency: 'Critical',
    iconName: 'Compass',
    flavor: '零下二十度的暴風雪中，求救訊號在群山之間迴盪。',
    claimedBy: []
  },
  {
    id: 'mis_cyber_emp_strike',
    title: '電磁脈衝打擊後的緊急聯絡',
    description: '前進基地遭遇突發 EMP 武器襲擊，所有未加固的電子晶片燒毀！必須使用抗 EMP 設備或物理/應急手段。',
    vp: 5,
    creditReward: 3,
    restrictedSlots: ['P'],
    requiresEmpShield: true,
    urgency: 'Critical',
    iconName: 'ZapOff',
    flavor: '焦黑的電路板散發著青煙，唯有古老的手搖有線電話與信號彈能刺破死寂。',
    claimedBy: []
  },
  {
    id: 'mis_deep_bunker_evac',
    title: '地下指揮坑道崩塌救援',
    description: '地下三層防空掩體入口被瓦礫封死，常規無線電無法穿透數公尺厚的鋼筋混凝土，需要穿透型或有線通訊！',
    vp: 4,
    creditReward: 2,
    requiredRange: ['Penetrating'],
    requiresSubterranean: true,
    urgency: 'High',
    iconName: 'Layers',
    flavor: '「我們在地下二十米！這裡氧氣只剩四小時，收到請敲擊岩壁回覆！」',
    claimedBy: []
  },
  {
    id: 'mis_global_summit_briefing',
    title: '全球緊急安全峰會連線',
    description: '國防總部召開跨國戰略視訊會議，需要全球覆蓋（Global）等級的衛星或短波天空波通訊。',
    vp: 4,
    creditReward: 3,
    requiredRange: ['Global'],
    urgency: 'Medium',
    iconName: 'Globe',
    flavor: '各大洲指揮官的面孔出現在多分割螢幕上，等待最新戰情簡報。',
    claimedBy: []
  },
  {
    id: 'mis_foggy_coastal_rendezvous',
    title: '濃霧海港特戰接應',
    description: '巡邏艇在濃霧中引導特戰小隊撤離，濃霧封鎖了光學信號，需要強韌的戰術無線電或聲學信號定位。',
    vp: 3,
    creditReward: 2,
    requiredRange: ['Local', 'Tactical'],
    urgency: 'Medium',
    iconName: 'Ship',
    flavor: '白茫茫的霧氣中，發動機的低鳴伴隨著無線電靜電聲悄然接近。',
    claimedBy: []
  },
  {
    id: 'mis_hostile_jamming_breakthrough',
    title: '敵方電子戰干擾區突圍',
    description: '主要頻道被全功率雜訊壓制（Primary 失效），必須依靠 A 備用跳頻無線電或 C/E 應急方案完成指揮中繼。',
    vp: 5,
    creditReward: 3,
    restrictedSlots: ['P'],
    urgency: 'Critical',
    iconName: 'ShieldAlert',
    flavor: '「主頻率全部被白雜訊淹沒！立即切換至 Alternate 戰術備用頻道！」',
    claimedBy: []
  },
  {
    id: 'mis_disaster_medical_triage',
    title: '震災前線醫療物資調度',
    description: '震央野戰醫院需要緊急調配血漿與抗生素，中等頻寬即可完成物資清單與傷患數據傳輸。',
    vp: 3,
    creditReward: 3,
    requiredRange: ['Local', 'Tactical', 'Global'],
    urgency: 'Medium',
    iconName: 'HeartPulse',
    flavor: '搶救生命的黃金 72 小時，精準的物資調度即是生與死的界線。',
    claimedBy: []
  },
  {
    id: 'mis_forest_fire_airdrop',
    title: '森林大火空投阻隔引導',
    description: '大火產生的滾滾濃煙與高溫遮蔽了光學偵測，需要具備天候耐受力的通訊設備指引空中消防機投水。',
    vp: 4,
    creditReward: 2,
    requiresWeatherResist: true,
    requiredRange: ['Tactical'],
    urgency: 'High',
    iconName: 'Flame',
    flavor: '火龍在樹冠間跳躍，熱浪翻滾中，無線電傳來投水機的進場倒數。',
    claimedBy: []
  },
  {
    id: 'mis_extreme_last_resort',
    title: '全防線崩潰——終極代碼傳遞',
    description: '所有常規通訊完全癱瘓！唯有依靠 Emergency [E] 槽位的終極手段（信鴿/信差/阿爾迪斯燈）傳遞最後密令！',
    vp: 6,
    creditReward: 4,
    minSlotRequirement: 'E',
    urgency: 'Critical',
    iconName: 'Award',
    flavor: '「當一切科技歸於塵土，唯有指揮官的智慧與堅毅信念屹立不倒。」',
    claimedBy: []
  }
];
