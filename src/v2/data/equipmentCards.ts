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
        desc: '日常最高速通訊，可傳視訊與大量相片，但極度依賴市電與周遭基地台。',
        flavor: '每個人口袋裡都有的日常工具，平常最便利，大斷電時最先失效。',
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
    tags: ['公眾網', '高頻寬', '市電依賴'],
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
        name: '免執照對講機 (FRS 無線電)',
        desc: '隨開即用之便攜對講機，免基地台直接對話，但距離受建築與山脈限制。',
        flavor: '里長、巡守隊與家庭必備，電池供電，不受市電停擺影響。',
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
    tags: ['無線電', '免基地台', '語音通聯'],
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
        desc: '自備柴油發電機的移動基地台，能迅速在大停電避難所展開 4G/5G 熱點。',
        flavor: '車載升降天線緩緩升起，為漆黑的收容所重新點亮訊號。',
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
    tags: ['公眾網', '機動車載', '高頻寬'],
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
        desc: '走地下共同管道的直通專線，完全免疫空中電磁脈衝與暴風雨，頻寬極高。',
        flavor: '埋設於地底一米深的專用光纜，連結公所與消防局的生命線。',
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
    tags: ['實體有線', '抗EMP', '高頻寬', '抗天候'],
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
        name: '低軌衛星接收盤 (如 Starlink)',
        desc: '只要能看見天空就能連上全球高速網路，無視陸地中斷，但厚重雲層暴雨會衰減。',
        flavor: '小巧的方形天線自動轉向天際，數百顆低軌衛星提供寬頻支援。',
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
    tags: ['衛星', '長距離', '高頻寬'],
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
        name: '手持海事/銥星衛星電話',
        desc: '單兵手持天線，全球直連同步軌道衛星，僅能通話與發送經緯座標，但極度可靠。',
        flavor: '厚重的粗天線指向南方天空，只要人在戶外就能打通最後電話。',
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
    tags: ['衛星', '長距離', '低功耗', '語音/座標'],
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
        name: 'HAM 業餘短波電台 (電離層反射)',
        desc: '利用天頂電離層反射短波 (HF NVIS)，訊號跨越中央山脈直達數百公里外，免任何中繼站。',
        flavor: '業餘火腿族拉起長線天線，在客廳裡與另一端的災區清晰對話。',
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
    tags: ['無線電', '長距離', '跨山谷', '電離層'],
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
        name: 'LoRa 社區網狀自癒節點 (Meshtastic)',
        desc: '多個小巧的低功耗小黑盒互相轉發文字訊息，任何一台壞了網路自動換路，還能穿透地下室。',
        flavor: '掛在各家陽台的小盒子，自動織成一張社區無死角文字網絡。',
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
    tags: ['無線電', '網狀自癒', '地下穿透', '超低功耗'],
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
        name: '手搖電話機 (TA-312 雙絞銅線)',
        desc: '零電池依賴！手搖轉柄直接發電發出鈴響，完全不怕 EMP 與任何無線電雜訊干擾。',
        flavor: '銅線鋪到哪裡，通話就到哪裡。看似古老，卻是核防護級的終極防線。',
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
    tags: ['實體有線', '手搖發電', '完全抗EMP', '零耗能'],
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
        name: '機車巡守隊信差 (USB隨身碟)',
        desc: '騎乘野狼機車攜帶隨身碟穿越封鎖區，頻寬等效驚人，完全免疫所有電子脈衝與斷電！',
        flavor: '「永遠不要低估一個載滿硬碟狂飆的機車信差的頻寬！」',
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
    tags: ['人力信差', '物理傳遞', '全免疫', '零耗電'],
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
        name: '強光手電筒與哨子 (摩斯光碼)',
        desc: '免電池手搖手電筒或高音哨，視距內閃爍 SOS 代碼，零成本、永遠不怕被干擾。',
        flavor: '三短三長三短，刺眼的光芒在黑夜的山頭閃爍，全村都知道有人生還。',
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
    tags: ['光學信號', '零耗能', '摩斯代碼', '視距'],
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
        name: '地下水管/岩壁敲擊震波儀',
        desc: '敲擊自來水管或防空地下室水泥牆壁傳遞代碼，專門穿透崩塌掩體與瓦礫堆。',
        flavor: '「收到請敲擊水管三聲！」大地與管道就是最堅固的導體。',
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
    tags: ['聲學震波', '地底穿透', '崩塌救援', '零耗能'],
  },
];
