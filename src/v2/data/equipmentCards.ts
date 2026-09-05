import { CommsCard } from '../types/game';

export const V2_STARTER_CARDS: CommsCard[] = [
  {
    id: 'start_cellular_phone',
    medium: 'Cellular',
    bandwidth: 'High',
    range: 'Local',
    cost: 0,
    powerCost: 1,
    resilience: {
      empShield: false,
      weatherResistant: false,
      subterranean: false,
    },
    translations: {
      CivilDefense: {
        name: '智慧型手機與家用 Wi-Fi',
        desc: '平常用最順手，能傳影片和大量照片，但大停電或基地台倒塌時最先失效。',
        flavor: '每個人口袋裡都有的日常工具，平常最方便，只要停電就失去作用。',
        icon: 'Smartphone',
      },
      IslandResilience: {
        name: '5G 行動寬頻基地台',
        desc: '都會與沿海高頻寬骨幹，傳輸量大，但停電或光纖斷裂時即刻中斷。',
        flavor: '提供前進指揮所極致頻寬，需市電與光纖中繼支援。',
        icon: 'Wifi',
      },
      CyberDisconnect: {
        name: '公眾神經光纖終端',
        desc: '城市中心高頻網絡，傳輸海量數據，極易受網格斷電影響。',
        flavor: '舊時代的繁華遺跡，一旦主伺服器斷電便歸於沉寂。',
        icon: 'Cpu',
      },
    },
    tags: ['手機網路', '高速度', '停電即斷'],
  },
  {
    id: 'start_frs_walkie',
    medium: 'Radio',
    bandwidth: 'Medium',
    range: 'LineOfSight',
    cost: 0,
    powerCost: 1,
    resilience: {
      empShield: false,
      weatherResistant: true,
      subterranean: false,
    },
    translations: {
      CivilDefense: {
        name: '免執照對講機 (戶外手持)',
        desc: '不用基地台就能直接對話！隨開即用，但訊號會被大山與高樓大廈擋住。',
        flavor: '里長、巡守隊與家庭必備，裝電池就能通，不怕大停電。',
        icon: 'Radio',
      },
      IslandResilience: {
        name: 'VHF 戰術手持電台',
        desc: '點對點戰術語音鏈路，抗天候耐磨損，適合視距內小隊通聯。',
        flavor: '山野巡邏小隊標準語音配備，視距通訊穩定。',
        icon: 'Radio',
      },
      CyberDisconnect: {
        name: '類比短波收發機',
        desc: '不經由雲端節點的純類比射頻廣播，耐候防塵。',
        flavor: '在荒原中轉動旋鈕，尋找同伴微弱的調頻訊號。',
        icon: 'Radio',
      },
    },
    tags: ['無線電', '免基地台', '語音對講'],
  },
];

export const V2_EQUIPMENT_CARDS: CommsCard[] = [
  // ==================== 1. 公眾網 / 基地台 (Cellular) ====================
  {
    id: 'eq_mesh_cell_truck',
    medium: 'Cellular',
    bandwidth: 'High',
    range: 'LineOfSight',
    cost: 4,
    powerCost: 2,
    resilience: {
      empShield: false,
      weatherResistant: true,
      subterranean: false,
    },
    translations: {
      CivilDefense: {
        name: '機動應急通訊車 (自備發電機)',
        desc: '開到哪裡訊號就到哪裡！自備柴油發電機，在大停電的收容所重新提供手機上網。',
        flavor: '車頂的天線緩緩升起，為漆黑的避難所重新點亮手機訊號。',
        icon: 'Truck',
      },
      IslandResilience: {
        name: '機動微波/LTE 通訊車',
        desc: '抗風雨之應急通訊車輛，提供大範圍視距高頻寬中繼。',
        flavor: '迅速開赴斷網災區，建立前進指揮所區域數據氣泡。',
        icon: 'Truck',
      },
      CyberDisconnect: {
        name: '重裝裝甲信號車',
        desc: '自備核能微電池的行動節點，可為區域提供短暫高頻覆蓋。',
        flavor: '履帶碾過瓦礫，在荒原核心建立數據庇護所。',
        icon: 'Truck',
      },
    },
    tags: ['行動基地台', '自備發電', '高傳輸量'],
  },
  {
    id: 'eq_fiber_hotline',
    medium: 'Wired',
    bandwidth: 'High',
    range: 'LongRange',
    cost: 4,
    powerCost: 1,
    resilience: {
      empShield: true,
      weatherResistant: true,
      subterranean: true,
    },
    translations: {
      CivilDefense: {
        name: '防災地下光纖專線',
        desc: '埋在地底下的直通線路，完全不怕強風暴雨或電磁波干擾，傳輸速度超快。',
        flavor: '地底一米深的專用線路，連結避難所與救災指揮中心的生命線。',
        icon: 'Cable',
      },
      IslandResilience: {
        name: '軍規加固地底光纖',
        desc: '抗 EMP 防護地底光纜，穿透掩體，傳輸極低延遲高畫質情報。',
        flavor: '穿過中央山脈的加固光纖，不受地表天候與電磁干擾。',
        icon: 'Cable',
      },
      CyberDisconnect: {
        name: '地底深埋超導光纜',
        desc: '免疫地表電磁風暴的古老光纜，頻寬極致。',
        flavor: '在地殼下靜靜發光的玻璃纖維，連接最後的地下城。',
        icon: 'Cable',
      },
    },
    tags: ['實體有線', '不怕干擾', '超高速度', '不怕暴雨'],
  },

  // ==================== 2. 衛星通訊 (Satellite) ====================
  {
    id: 'eq_leo_satellite_dish',
    medium: 'Satellite',
    bandwidth: 'High',
    range: 'LongRange',
    cost: 5,
    powerCost: 3,
    resilience: {
      empShield: false,
      weatherResistant: false,
      subterranean: false,
    },
    translations: {
      CivilDefense: {
        name: '低軌衛星接收盤 (如星鏈)',
        desc: '天線只要能看見天空就能連上高速網路，無視地面基地台全毀，但遇到厚重暴雨雲層收訊會變差。',
        flavor: '方形天線自動對準天際，透過數百顆低軌衛星提供緊急寬頻支援。',
        icon: 'Satellite',
      },
      IslandResilience: {
        name: '低軌衛星寬頻終端',
        desc: '長距離超視距寬頻鏈路，避開受損海纜，但易受暴風雨與高空 EMP 影響。',
        flavor: '直接與軌道星座握手，跨越封鎖海峽的高速天路。',
        icon: 'Satellite',
      },
      CyberDisconnect: {
        name: '軌道星鏈自動追蹤器',
        desc: '鎖定軌道上殘存衛星的高速陣列天線，高耗電但頻寬驚人。',
        flavor: '對準蒼穹盲區，捕捉千公里外的下行數據微光。',
        icon: 'Satellite',
      },
    },
    tags: ['衛星網路', '超遠距離', '超高速度'],
  },
  {
    id: 'eq_satellite_phone',
    medium: 'Satellite',
    bandwidth: 'Low',
    range: 'LongRange',
    cost: 3,
    powerCost: 1,
    resilience: {
      empShield: false,
      weatherResistant: true,
      subterranean: false,
    },
    translations: {
      CivilDefense: {
        name: '手持衛星電話 (海事/銥星)',
        desc: '人在戶外就能直接連上外太空衛星通話，只能通話與傳送座標，但極度可靠。',
        flavor: '拉出粗天線指向天空，在所有基地台全毀時撥出求救電話。',
        icon: 'PhoneCall',
      },
      IslandResilience: {
        name: '海事應急衛星通話儀',
        desc: '全球低頻寬保命語音終端，全天候防雨，適合偏鄉孤島求救。',
        flavor: '跨洋遠洋漁船與搜救直升機必備的應急語音神器。',
        icon: 'PhoneCall',
      },
      CyberDisconnect: {
        name: '軌道應急信標機',
        desc: '低功耗軌道語音發射器，發射脈衝式求救代碼。',
        flavor: '當所有屏幕熄滅，只有它還在對著虛空播報生還者坐標。',
        icon: 'PhoneCall',
      },
    },
    tags: ['衛星電話', '超遠距離', '低耗電', '語音與座標'],
  },

  // ==================== 3. 無線電波 / 射頻 (Radio) ====================
  {
    id: 'eq_ham_hf_radio',
    medium: 'Radio',
    bandwidth: 'Medium',
    range: 'LongRange',
    cost: 3,
    powerCost: 2,
    resilience: {
      empShield: false,
      weatherResistant: true,
      subterranean: false,
    },
    translations: {
      CivilDefense: {
        name: '業餘短波無線電台 (空中彈射)',
        desc: '利用高空大氣層把電波反彈到數百公里外，跨過高山峻嶺直達外縣市，免任何轉播站。',
        flavor: '拉起長長的天線，在停電的客廳裡直接連上遠方的災區。',
        icon: 'Activity',
      },
      IslandResilience: {
        name: '電離層反射高頻短波電台',
        desc: '超視距 (BLOS) 戰術短波通訊，跨越深山峽谷與離島屏障。',
        flavor: '短波仰射天線朝天發射，天空即是我們的大型轉播塔。',
        icon: 'Activity',
      },
      CyberDisconnect: {
        name: '大氣電離層反射站',
        desc: '利用擾動大氣層彈射電波的長程電台，不受實體電網制約。',
        flavor: '在寂靜的夜空中，短波雜音如同浪潮般拍打著耳膜。',
        icon: 'Activity',
      },
    },
    tags: ['長程無線電', '跨越高山', '免基地台'],
  },
  {
    id: 'eq_lora_mesh_node',
    medium: 'Radio',
    bandwidth: 'Low',
    range: 'LineOfSight',
    cost: 2,
    powerCost: 1,
    resilience: {
      empShield: false,
      weatherResistant: true,
      subterranean: true,
    },
    translations: {
      CivilDefense: {
        name: '社區無線自癒小黑盒 (低功耗)',
        desc: '掛在各家陽台的小盒子，能一台傳一台把文字送出去，壞了一台自動換路，還能穿透地下室。',
        flavor: '不用插電能撐好幾天，各家陽台的小黑盒串起整座社區的求救簡訊。',
        icon: 'Network',
      },
      IslandResilience: {
        name: 'LoRa 戰術網狀中繼節點',
        desc: '自組織多跳中繼網絡，穿透部分地下掩體，抗單點損毀。',
        flavor: '分散式節點鏈路，無中央伺服器，死了一台還有十台。',
        icon: 'Network',
      },
      CyberDisconnect: {
        name: '蜂巢自癒節點陣列',
        desc: '多跳微功率節點，傳送加密文字封包，穿透掩體深處。',
        flavor: '無數微光節點在廢墟中彼此呼應，編織成最後的自癒之網。',
        icon: 'Network',
      },
    },
    tags: ['無線跳接', '穿透地下室', '超省電'],
  },

  // ==================== 4. 實體有線 (Wired) ====================
  {
    id: 'eq_hand_crank_phone',
    medium: 'Wired',
    bandwidth: 'Low',
    range: 'Local',
    cost: 2,
    powerCost: 0,
    resilience: {
      empShield: true,
      weatherResistant: true,
      subterranean: false,
    },
    translations: {
      CivilDefense: {
        name: '手搖有線電話 (拉銅線通話)',
        desc: '完全不用電池！手搖把手自己發電發出鈴響，拉一條銅線就能通話，完全不怕任何干擾。',
        flavor: '銅線拉到哪就能講到哪。看似古老，卻是關鍵時刻最穩的救命電話。',
        icon: 'Phone',
      },
      IslandResilience: {
        name: '野戰手搖有線電話',
        desc: '手搖磁石發電，完全免疫高空電磁脈衝 (EMP)，極端環境絕對暢通。',
        flavor: '用力搖動把手，電流直接通過銅線喚醒另一端的值班哨。',
        icon: 'Phone',
      },
      CyberDisconnect: {
        name: '手搖磁石銅線終端',
        desc: '純機械發電的純銅線路，不受任何電子戰武器影響。',
        flavor: '齒輪旋轉的摩擦聲，是這片電磁死寂中唯一的生命心跳。',
        icon: 'Phone',
      },
    },
    tags: ['實體有線', '手搖發電', '完全免電池', '不怕干擾'],
  },

  // ==================== 5. 人力 / 光學 / 聲波 (Physical/Optical) ====================
  {
    id: 'eq_motorcycle_runner',
    medium: 'PhysicalOptical',
    bandwidth: 'Medium',
    range: 'LineOfSight',
    cost: 2,
    powerCost: 0,
    resilience: {
      empShield: true,
      weatherResistant: true,
      subterranean: true,
    },
    translations: {
      CivilDefense: {
        name: '機車巡守隊信差 (隨身碟)',
        desc: '騎機車帶著隨身碟穿過封鎖區，能一口氣送出幾十萬張照片與資料，完全不怕斷網停電！',
        flavor: '「不要小看一個背包裝滿隨身碟的機車信差，傳送量比光纖還驚人！」',
        icon: 'Bike',
      },
      IslandResilience: {
        name: '越野偵搜信差騎士',
        desc: '人力物理傳遞，全天候全地形適應，免疫一切電磁干擾與衛星遮蔽。',
        flavor: '天崩地裂之際，只有血肉之軀與鋼鐵坐騎能將密令送達。',
        icon: 'Bike',
      },
      CyberDisconnect: {
        name: '廢土重裝機車信使',
        desc: '攜帶物理記憶體穿梭廢墟的生化信差，無視任何電子防線。',
        flavor: '引擎咆哮穿過黑夜，他是唯一能突破數據封鎖的活體鏈路。',
        icon: 'Bike',
      },
    },
    tags: ['人力信差', '專人送達', '完全免用電', '資料量巨大'],
  },
  {
    id: 'eq_aldis_light_mirror',
    medium: 'PhysicalOptical',
    bandwidth: 'Low',
    range: 'LineOfSight',
    cost: 1,
    powerCost: 0,
    resilience: {
      empShield: true,
      weatherResistant: false,
      subterranean: false,
    },
    translations: {
      CivilDefense: {
        name: '強光手電筒與高音哨子',
        desc: '免電池手搖手電筒或高音哨，在看得到的地方閃爍光碼或吹哨，零成本、永遠不怕故障。',
        flavor: '三短三長三短，刺眼的光芒在黑夜的山頭閃爍，讓對岸知道這裡有人生還。',
        icon: 'Sun',
      },
      IslandResilience: {
        name: '阿爾迪斯戰術信號燈',
        desc: '手動快門發送摩斯光碼，視距可達數公里，極限環境下的終極光學保命手段。',
        flavor: '海軍百年光學傳承，只要有光，通訊就永遠不會斷絕。',
        icon: 'Sun',
      },
      CyberDisconnect: {
        name: '聚焦高能光學信號儀',
        desc: '手動快門的光學信號裝置，穿透電子靜默。',
        flavor: '一道刺破黑暗的光束，在末世的山脊上點亮希望。',
        icon: 'Sun',
      },
    },
    tags: ['光與聲音', '完全免電', '求救信號', '視距可見'],
  },
  {
    id: 'eq_acoustic_thumper',
    medium: 'PhysicalOptical',
    bandwidth: 'Low',
    range: 'Penetrating',
    cost: 3,
    powerCost: 0,
    resilience: {
      empShield: true,
      weatherResistant: true,
      subterranean: true,
    },
    translations: {
      CivilDefense: {
        name: '水管與水泥牆敲擊敲聽器',
        desc: '敲擊自來水管或防空地下室牆壁傳遞聲音，能穿透崩塌的瓦礫堆與深層地底。',
        flavor: '「收到請敲水管三聲！」厚重的泥土與管道就是聲音的最佳導體。',
        icon: 'Volume2',
      },
      IslandResilience: {
        name: '地底震動聲學通訊儀',
        desc: '專門穿透崩塌地下掩體與礦坑隧道，完全免疫電磁干擾與天候阻隔。',
        flavor: '在地下二十米深處，每一次敲擊都宣告著生命的堅持。',
        icon: 'Volume2',
      },
      CyberDisconnect: {
        name: '地殼聲學共振器',
        desc: '利用地質岩層共振傳遞低頻脈衝，直達最深處的掩體。',
        flavor: '大地在震顫，聲波沿著斷層將代碼傳遞至地下避難所。',
        icon: 'Volume2',
      },
    },
    tags: ['敲擊聲音', '穿透瓦礫堆', '地底求救', '完全免電'],
  },
];
