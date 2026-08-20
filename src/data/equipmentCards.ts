import { CommsCard } from '../types/game';

export const STARTER_PRIMARY_CARDS: CommsCard[] = [
  {
    id: 'start_p_5g',
    name: '5G 行動專網基地站 (5G Mesh Cell)',
    slot: 'P',
    category: 'Cellular/Internet',
    cost: 0,
    powerCost: 2,
    bandwidth: 'High',
    range: 'Local',
    resilience: {
      empShield: false,
      weatherResistant: false,
      subterranean: false
    },
    effectDesc: '日常高傳輸主要管道。頻寬極大，但在雷暴或斷電時脆弱。',
    iconName: 'Wifi',
    flavorText: '提供極致頻寬與即時影像回傳，為標準戰術前進基地首選。',
    tags: ['5G', '高速圖傳', '市電依賴']
  },
  {
    id: 'start_p_starlink',
    name: '低軌衛星終端機 (LEO Sat Terminal)',
    slot: 'P',
    category: 'Satellite',
    cost: 0,
    powerCost: 3,
    bandwidth: 'High',
    range: 'Global',
    resilience: {
      empShield: false,
      weatherResistant: false,
      subterranean: false
    },
    effectDesc: '全球高頻寬連線。無視陸地地形阻隔，但在重度雲層或地底受限。',
    iconName: 'Satellite',
    flavorText: '只要能望見天空，就能與全球指揮部維持千兆寬頻連線。',
    tags: ['衛星', '全球覆蓋', '視線要求']
  }
];

export const EQUIPMENT_CARDS: CommsCard[] = [
  // ==================== PRIMARY CARDS [P] ====================
  {
    id: 'p_geosat_hub',
    name: '同步軌道軍規衛星站 (GEO Satellite Uplink)',
    slot: 'P',
    category: 'Satellite',
    cost: 5,
    powerCost: 3,
    bandwidth: 'High',
    range: 'Global',
    resilience: {
      empShield: true,
      weatherResistant: true,
      subterranean: false
    },
    bonusVP: 1,
    effectDesc: '全球超高頻寬、防 EMP 加固。任務完成時額外 +1 VP。',
    iconName: 'Satellite',
    flavorText: '鎖定赤道上空 35,786 公里軍規衛星，具備加固抗輻射外殼。',
    tags: ['軍規衛星', 'EMP防護', '超高頻寬']
  },
  {
    id: 'p_microwave_relay',
    name: '定向微波中繼塔 (Microwave Relay Tower)',
    slot: 'P',
    category: 'Tactical Radio',
    cost: 4,
    powerCost: 2,
    bandwidth: 'High',
    range: 'Tactical',
    resilience: {
      empShield: false,
      weatherResistant: true,
      subterranean: false
    },
    effectDesc: '視距高頻寬中繼。抗風雨侵蝕，具備極低傳輸延遲。',
    iconName: 'Radio',
    flavorText: '點對點十吉比特微波鏈路，建立前線至前進基地的資料骨幹。',
    tags: ['微波', '低延遲', '視距']
  },
  {
    id: 'p_tactical_lte_van',
    name: '機動應急通訊車 (COW Tactical LTE)',
    slot: 'P',
    category: 'Cellular/Internet',
    cost: 4,
    powerCost: 2,
    bandwidth: 'High',
    range: 'Local',
    resilience: {
      empShield: false,
      weatherResistant: true,
      subterranean: false
    },
    effectDesc: '局部區域快速展開 4G/5G 覆蓋，兼具發電機整合供電。',
    iconName: 'Truck',
    flavorText: '車載升降桅杆能迅速為整個前進指揮所提供寬頻通訊氣泡。',
    tags: ['機動車載', '高頻寬', '快速展開']
  },
  {
    id: 'p_optical_laser_link',
    name: '自由空間光通訊機 (FSO Optical Laser)',
    slot: 'P',
    category: 'Optical/Visual',
    cost: 5,
    powerCost: 2,
    bandwidth: 'High',
    range: 'Tactical',
    resilience: {
      empShield: true,
      weatherResistant: false,
      subterranean: false
    },
    bonusVP: 1,
    effectDesc: '不可竊聽、防電磁干擾 (EMP)，但易受濃霧與沙塵暴阻斷。',
    iconName: 'Zap',
    flavorText: '利用聚焦紅外雷射進行十億位元傳輸，電磁靜默下的頂級高速通道。',
    tags: ['雷射光訊', '防EMP', '抗電磁干擾']
  },

  // ==================== ALTERNATE CARDS [A] ====================
  {
    id: 'a_vhf_sincgars',
    name: '戰術跳頻無線電 (SINCGARS VHF/UHF)',
    slot: 'A',
    category: 'Tactical Radio',
    cost: 3,
    powerCost: 1,
    bandwidth: 'Medium',
    range: 'Tactical',
    resilience: {
      empShield: true,
      weatherResistant: true,
      subterranean: false
    },
    effectDesc: '每秒數百次自動跳頻，具備極強電子抗干擾與天候耐受力。',
    iconName: 'Radio',
    flavorText: '步兵戰鬥排標準語音與戰術數據鏈，敵方干擾台的噩夢。',
    tags: ['抗跳頻', '軍規加固', '語音/數據']
  },
  {
    id: 'a_hf_skywave',
    name: '電離層反射高頻電台 (HF NVIS Skywave)',
    slot: 'A',
    category: 'HF/Shortwave',
    cost: 4,
    powerCost: 2,
    bandwidth: 'Medium',
    range: 'Global',
    resilience: {
      empShield: false,
      weatherResistant: true,
      subterranean: false
    },
    effectDesc: '藉由電離層反射實現超視距（BLOS）通訊，跨越山峰地形阻隔。',
    iconName: 'Activity',
    flavorText: '短波近垂直入射天空波，即使深處峽谷亦能與千里之外通話。',
    tags: ['超視距', '跨山谷', '全球覆蓋']
  },
  {
    id: 'a_lora_mesh_relay',
    name: 'LoRa 戰術網狀中繼節點 (LoRa Tactical Mesh)',
    slot: 'A',
    category: 'Mesh/LoRa',
    cost: 3,
    powerCost: 1,
    bandwidth: 'Medium',
    range: 'Tactical',
    resilience: {
      empShield: false,
      weatherResistant: true,
      subterranean: true
    },
    effectDesc: '自組織節點中繼網。可多跳傳輸，並穿透部分地下通道。',
    iconName: 'Network',
    flavorText: '多個小巧的低功耗節點互相轉發，任何單一節點損毀均不影響全局。',
    tags: ['網狀拓樸', '低功耗', '自癒網路']
  },
  {
    id: 'a_bgan_tactical_pack',
    name: '單兵便攜海事衛星包 (BGAN Explorer Pack)',
    slot: 'A',
    category: 'Satellite',
    cost: 4,
    powerCost: 2,
    bandwidth: 'Medium',
    range: 'Global',
    resilience: {
      empShield: false,
      weatherResistant: true,
      subterranean: false
    },
    effectDesc: '手提箱大小的備用衛星站，耐風雨且可迅速摺疊攜行。',
    iconName: 'Briefcase',
    flavorText: '極地探險與特戰小隊必備，隨開即用的穩定中速備援通道。',
    tags: ['可攜式', '衛星備用', '防潑水']
  },

  // ==================== CONTINGENCY CARDS [C] ====================
  {
    id: 'c_field_wire_ta312',
    name: '野戰雙絞有線電話 (TA-312 Field Phone)',
    slot: 'C',
    category: 'Wired/Field',
    cost: 2,
    powerCost: 0,
    bandwidth: 'Low',
    range: 'Local',
    resilience: {
      empShield: true,
      weatherResistant: true,
      subterranean: false
    },
    effectDesc: '手搖發電、零電池依賴！完全免疫 EMP 與電磁干擾，是核突擊與電子戰下的終極有線防線。',
    iconName: 'PhoneCall',
    flavorText: '銅線鋪到哪裡，聲音就能傳到哪裡。最原始卻最牢不可破的防線。',
    tags: ['手搖發電', '完全抗EMP', '實體雙絞線']
  },
  {
    id: 'c_drone_packet_courier',
    name: '自動尋航信差無人機 (Autonomous Data Drone)',
    slot: 'C',
    category: 'Physical/Courier',
    cost: 3,
    powerCost: 1,
    bandwidth: 'Medium',
    range: 'Tactical',
    resilience: {
      empShield: true,
      weatherResistant: false,
      subterranean: false
    },
    effectDesc: '攜帶實體加密硬碟飛越干擾區進行物理傳送，頻寬等效極高。',
    iconName: 'Send',
    flavorText: '「永遠不要低估一輛裝滿硬碟並在公路上疾馳的客貨車的頻寬。」',
    tags: ['物理信差', '抗電磁干擾', '硬碟轉移']
  },
  {
    id: 'c_seismic_thumper',
    name: '地底震動聲學通訊儀 (Seismic Acoustic Transceiver)',
    slot: 'C',
    category: 'Acoustic/Seismic',
    cost: 3,
    powerCost: 1,
    bandwidth: 'Low',
    range: 'Penetrating',
    resilience: {
      empShield: true,
      weatherResistant: true,
      subterranean: true
    },
    bonusVP: 1,
    effectDesc: '透過岩層敲擊振動傳遞莫斯碼，專門穿透崩塌掩體與深層礦坑。',
    iconName: 'Volume2',
    flavorText: '大地即是導體，在地底深處敲擊出希望的代碼。',
    tags: ['穿透地表', '地質震波', '崩塌搜救']
  },
  {
    id: 'c_flare_signal_kit',
    name: '多色戰術信號槍套組 (Tactical Flare & Smoke Kit)',
    slot: 'C',
    category: 'Optical/Visual',
    cost: 2,
    powerCost: 0,
    bandwidth: 'Low',
    range: 'Tactical',
    resilience: {
      empShield: true,
      weatherResistant: false,
      subterranean: false
    },
    effectDesc: '免電力！以紅/綠/白/煙霧預定代碼傳遞撤離與求援資訊。',
    iconName: 'Flame',
    flavorText: '一道紅光劃破夜空，所有單位心領神會：立即撤離！',
    tags: ['光學信號', '零耗能', '視覺識別']
  },

  // ==================== EMERGENCY CARDS [E] ====================
  {
    id: 'e_aldis_lamp',
    name: '阿爾迪斯信號燈 (Aldis High-Intensity Lamp)',
    slot: 'E',
    category: 'Optical/Visual',
    cost: 2,
    powerCost: 0,
    bandwidth: 'Low',
    range: 'Tactical',
    resilience: {
      empShield: true,
      weatherResistant: true,
      subterranean: false
    },
    bonusVP: 2,
    effectDesc: '手動快門發送摩斯光碼。若在 EMP 或斷電環境成功連通，額外 +2 VP！',
    iconName: 'Sun',
    flavorText: '海軍百年傳承的終極光學通訊，光芒所及之處，通訊絕不斷絕。',
    tags: ['摩斯光學', '終極抗EMP', '高額應變分']
  },
  {
    id: 'e_runner_motorcycle',
    name: '越野偵搜信差騎士 (Motorcycle Dispatch Runner)',
    slot: 'E',
    category: 'Physical/Courier',
    cost: 2,
    powerCost: 0,
    bandwidth: 'Medium',
    range: 'Tactical',
    resilience: {
      empShield: true,
      weatherResistant: true,
      subterranean: true
    },
    bonusVP: 1,
    effectDesc: '物理人力信差。免疫所有電子干擾、EMP、雷暴與衛星遮蔽！',
    iconName: 'Navigation',
    flavorText: '當天崩地裂、電磁全毀，只有血肉之軀與鋼鐵坐騎能將密令送達。',
    tags: ['物理傳遞', '全天候適應', '全免疫']
  },
  {
    id: 'e_heliograph_mirror',
    name: '日光日光反射儀 (Heliograph Solar Mirror)',
    slot: 'E',
    category: 'Optical/Visual',
    cost: 1,
    powerCost: 0,
    bandwidth: 'Low',
    range: 'Tactical',
    resilience: {
      empShield: true,
      weatherResistant: false,
      subterranean: false
    },
    bonusVP: 2,
    effectDesc: '反射日光閃爍莫斯密碼，零成本、零耗電、視距可達數十公里。',
    iconName: 'Sparkles',
    flavorText: '在萬籟俱寂的山脊上，一面小鏡子即是照亮黑夜的希望。',
    tags: ['零耗電', '極致輕便', '光學反射']
  },
  {
    id: 'e_homing_pigeon_box',
    name: '軍用信鴿應急籠 (Homing Pigeon Dispatch)',
    slot: 'E',
    category: 'Physical/Courier',
    cost: 2,
    powerCost: 0,
    bandwidth: 'Low',
    range: 'Tactical',
    resilience: {
      empShield: true,
      weatherResistant: true,
      subterranean: false
    },
    bonusVP: 2,
    effectDesc: '傳奇生物信差。不受任何電子戰雷達干擾，穿越封鎖線直接返巢。',
    iconName: 'Feather',
    flavorText: '「雪兒阿米」在凡爾登戰役中拯救了數百名戰士——傳統永遠值得敬畏。',
    tags: ['生物通訊', '無法被干擾', '高抗性']
  }
];
