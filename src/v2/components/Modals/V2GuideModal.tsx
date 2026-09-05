import React, { useState } from 'react';
import { 
  BookOpen, 
  Shield, 
  CheckCircle, 
  AlertTriangle, 
  Zap, 
  X, 
  Award,
  Compass
} from 'lucide-react';

interface V2GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function V2GuideModal({ isOpen, onClose }: V2GuideModalProps) {
  const [activeSection, setActiveSection] = useState<'all' | 'goal' | 'resources' | 'pace' | 'media' | 'actions' | 'transmission'>('all');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md font-mono animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[92vh] rounded-3xl border border-cyan-500/40 bg-slate-950 p-4 sm:p-7 shadow-2xl flex flex-col gap-4 text-slate-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="p-2 sm:p-2.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-xl font-black text-slate-100 font-orbitron">
                  《PACE 通訊先鋒》遊戲玩法說明手冊
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/40 font-bold hidden sm:inline">
                  白話新手版
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">
                從做中學：理解日常通訊為何失靈，以及如何建立四重備用防線！
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 text-slate-400 hover:text-slate-100 rounded-xl hover:bg-slate-900 transition-all"
            title="關閉手冊"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chapter Filter Quick Navigation */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 shrink-0 no-scrollbar text-xs">
          <button
            onClick={() => setActiveSection('all')}
            className={`px-3 py-1 rounded-xl font-bold whitespace-nowrap transition-all ${
              activeSection === 'all'
                ? 'bg-cyan-500 text-slate-950 shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            全部章節
          </button>
          <button
            onClick={() => setActiveSection('goal')}
            className={`px-2.5 py-1 rounded-xl font-bold whitespace-nowrap transition-all ${
              activeSection === 'goal'
                ? 'bg-cyan-500 text-slate-950 shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            一、遊戲目標
          </button>
          <button
            onClick={() => setActiveSection('resources')}
            className={`px-2.5 py-1 rounded-xl font-bold whitespace-nowrap transition-all ${
              activeSection === 'resources'
                ? 'bg-cyan-500 text-slate-950 shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            二、四項資源
          </button>
          <button
            onClick={() => setActiveSection('pace')}
            className={`px-2.5 py-1 rounded-xl font-bold whitespace-nowrap transition-all ${
              activeSection === 'pace'
                ? 'bg-cyan-500 text-slate-950 shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            三、PACE 防線
          </button>
          <button
            onClick={() => setActiveSection('media')}
            className={`px-2.5 py-1 rounded-xl font-bold whitespace-nowrap transition-all ${
              activeSection === 'media'
                ? 'bg-cyan-500 text-slate-950 shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            四、5種傳輸方式
          </button>
          <button
            onClick={() => setActiveSection('actions')}
            className={`px-2.5 py-1 rounded-xl font-bold whitespace-nowrap transition-all ${
              activeSection === 'actions'
                ? 'bg-cyan-500 text-slate-950 shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            五、每回合操作
          </button>
          <button
            onClick={() => setActiveSection('transmission')}
            className={`px-2.5 py-1 rounded-xl font-bold whitespace-nowrap transition-all ${
              activeSection === 'transmission'
                ? 'bg-cyan-500 text-slate-950 shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            六、任務判定與接手
          </button>
        </div>

        {/* Scrollable Guide Content */}
        <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-4 text-xs leading-relaxed text-slate-300">
          
          {/* Chapter 1: Goal */}
          {(activeSection === 'all' || activeSection === 'goal') && (
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col gap-2.5">
              <h4 className="text-sm sm:text-base font-black text-cyan-300 flex items-center gap-2">
                <Compass className="w-4 h-4 text-cyan-400" /> 一、 遊戲目標：怎麼才算贏？
              </h4>
              <p>
                這是一款模擬<b>真實災害通訊救援</b>的策略桌遊。在極端災難中，日常的手機基地台隨時可能倒塌斷網。你扮演通訊指揮官，要在前線佈署 4 道備用防線，維持通訊順暢並搶救生命！
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30">
                  <b className="text-cyan-300 block text-xs mb-1">🏆 方式一：搶先達標獲勝</b>
                  <span className="text-[11px] text-slate-400 leading-normal">
                    任何一位玩家率先累積達到 <b>20 分救援積分</b>，演習立即結束並宣告獲勝！
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-500/30">
                  <b className="text-purple-300 block text-xs mb-1">⏱️ 方式二：回合結束結算</b>
                  <span className="text-[11px] text-slate-400 leading-normal">
                    若進行完 <b>第 6 輪天災</b> 仍無人達標，則由<b>總救援積分最高</b>的玩家獲勝。
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Chapter 2: Resources */}
          {(activeSection === 'all' || activeSection === 'resources') && (
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col gap-2.5">
              <h4 className="text-sm sm:text-base font-black text-amber-300 flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" /> 二、 四項重要資源
              </h4>
              <p>
                在你的指揮面板上方，隨時展示著以下四個關鍵數值：
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-1">
                <div className="p-2.5 rounded-xl bg-cyan-950/30 border border-cyan-500/20 flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-cyan-300 font-black text-xs">
                    <span className="p-1 rounded-lg bg-cyan-500/20">⚡</span> 行動點數 (AP)
                  </div>
                  <span className="text-[11px] text-slate-400">
                    每回合固定回滿 <b>3 點</b>。買裝備、執行通訊、充電、調整防線通常各花 1 AP；打出手牌戰術則是 <b>0 AP 完全免費</b>。
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-amber-950/30 border border-amber-500/20 flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-amber-300 font-black text-xs">
                    <span className="p-1 rounded-lg bg-amber-500/20">🔋</span> 設備電量
                  </div>
                  <span className="text-[11px] text-slate-400">
                    設備發送訊號都需要用電（上限 6 格，開局 3 格）。如果電量不夠，高耗能設備就<b>開不了機</b>！
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-500/20 flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-emerald-300 font-black text-xs">
                    <span className="p-1 rounded-lg bg-emerald-500/20">💰</span> 應急物資
                  </div>
                  <span className="text-[11px] text-slate-400">
                    你的資金（開局 3 點）。用來在市場採購新設備與戰術卡；成功完成救災任務即可賺取物資。
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-purple-950/30 border border-purple-500/20 flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-purple-300 font-black text-xs">
                    <span className="p-1 rounded-lg bg-purple-500/20">🏆</span> 救援積分
                  </div>
                  <span className="text-[11px] text-slate-400">
                    成功傳送訊息救人所獲得的分數，率先累積滿 20 分就能贏得勝利！
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Chapter 3: PACE Slots */}
          {(activeSection === 'all' || activeSection === 'pace') && (
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col gap-2.5">
              <h4 className="text-sm sm:text-base font-black text-cyan-300 flex items-center gap-2">
                <Shield className="w-4 h-4 text-cyan-400" /> 三、 什麼是 PACE 四重防線？
              </h4>
              <p>
                PACE 是國際通用的應急通訊規劃順序，也就是<b>「主要 ➔ 備用 ➔ 應急 ➔ 緊急」</b>四道防線：
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30">
                  <div className="flex items-center justify-between mb-1">
                    <b className="text-cyan-300 text-xs">[P] 主要防線 (Primary)</b>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-900/80 text-cyan-200 font-bold">100% 滿分</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    <b>平時主力</b>：日常最快、最方便的工具（如智慧手機、家用光纖）。能傳送大量檔案與視訊。<br />
                    ⚠️ <b>安裝限制</b>：只能放傳輸量較大（中/高）的設備，不可放哨子等低階純應急工具。
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-500/30">
                  <div className="flex items-center justify-between mb-1">
                    <b className="text-blue-300 text-xs">[A] 備用防線 (Alternate)</b>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-900/80 text-blue-200 font-bold">100% 滿分</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    <b>第一後備</b>：主要手段故障時，第一個跳出來頂替的工具（如對講機、衛星電話）。可自由配置任何設備。
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/30">
                  <div className="flex items-center justify-between mb-1">
                    <b className="text-amber-300 text-xs">[C] 應急防線 (Contingency)</b>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-900/80 text-amber-200 font-bold">70% 止血分</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    <b>抗災止血</b>：前兩道全毀時的強韌裝備（如不怕暴雨的設備、地底專線）。接手連通成功時，分數打 7 折。
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/30">
                  <div className="flex items-center justify-between mb-1">
                    <b className="text-red-300 text-xs">[E] 緊急防線 (Emergency)</b>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-900/80 text-red-200 font-bold">50% 保命分</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    <b>最後希望</b>：電網與科技全滅時的保命手段（如吹哨、手電筒照光碼、信差）。完全免用電，接手連通時分數打 5 折。
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Chapter 4: 5 Media & Common Failure */}
          {(activeSection === 'all' || activeSection === 'media') && (
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col gap-2.5">
              <h4 className="text-sm sm:text-base font-black text-amber-300 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" /> 四、 5 種傳輸方式，與「別把雞蛋放在同一個籃子」
              </h4>
              <p>
                備援最重要的原則，就是<b>「傳輸方式不能全都一樣」</b>。遊戲中有 5 種傳輸方式：
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-[11px] text-slate-300">
                <li>📱 <b>行動網路/基地台 (Cellular)</b>：平常速度最快，但停電或基地台受損就會瞬間失靈。</li>
                <li>🛰️ <b>衛星通訊 (Satellite)</b>：收訊不受高山地形阻擋，但遇到極端暴風雨時微波會被干擾。</li>
                <li>📻 <b>無線電波 (Radio)</b>：對講機直接對話、免基地台，但訊號會被中央山脈或高樓大廈擋住。</li>
                <li>☎️ <b>實體有線 (Wired)</b>：通話最清晰穩定、不怕空中電磁干擾，但地震或土石流可能扯斷線路。</li>
                <li>🏃 <b>人力/光學/聲音 (Physical/Optical)</b>：吹哨、照手電筒、信差。完全免用電、不怕任何干擾，但距離很短，起大霧就看不見。</li>
              </ul>
              <div className="p-3 rounded-xl bg-red-950/50 border border-red-500/40 text-red-200 text-xs mt-1 leading-relaxed">
                <b className="text-red-300 flex items-center gap-1 mb-1">
                  <AlertTriangle className="w-4 h-4 text-red-400" /> 大忌：小心「同類設備同時壞掉」
                </b>
                如果你的 [P] 和 [A] 都使用手機網路，一旦遇到大停電，前兩道防線會<b>在同一瞬間全部癱瘓</b>！因此，請務必替防線搭配不同的傳輸方式。
              </div>
            </div>
          )}

          {/* Chapter 5: Actions (1 AP vs 0 AP) */}
          {(activeSection === 'all' || activeSection === 'actions') && (
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col gap-2.5">
              <h4 className="text-sm sm:text-base font-black text-purple-300 flex items-center gap-2">
                <Award className="w-4 h-4 text-purple-400" /> 五、 你的回合可以做什麼？（1 AP 動作 vs 0 AP 免費動作）
              </h4>
              <p>
                每回合輪到你時，只要 AP 還夠，你可以自由執行以下動作：
              </p>
              
              <div className="flex flex-col gap-2 mt-1">
                <div className="p-3 rounded-xl bg-slate-950/80 border border-cyan-500/30">
                  <b className="text-cyan-300 text-xs block mb-1">⚡ 消耗 1 AP 的動作：</b>
                  <ol className="list-decimal pl-4 space-y-1 text-[11px] text-slate-300">
                    <li><b>在市場購買裝備</b>（花費 1 AP + 卡片 💰 物資）：買下裝備裝到防線上。<b>原位置若有舊設備，會自動安全收進【備用裝備倉庫】，隨時能換回，絕對不會被丟棄！</b></li>
                    <li><b>購買戰術卡加入手牌</b>（花費 1 AP + 卡片 💰 物資）：購買一張強大的戰術卡收在手牌中隨時待命。</li>
                    <li><b>對調防線位置 (Swap)</b>（花費 1 AP）：調換防線上任兩個設備的順序（例如預知即將大停電，提早把對講機調到最前面）。</li>
                    <li><b>從備用倉庫拿裝備裝上</b>（花費 1 AP）：把剛才收在倉庫裡的裝備重新裝回防線上。</li>
                    <li><b>緊急野戰充電</b>（花費 1 AP）：為指揮部補充 <b>⚡ 2 格電量</b>。</li>
                    <li><b>執行任務通訊檢定</b>（花費 1 AP）：點擊場上的救災任務卡，發動通訊防線嘗試連通救人！</li>
                  </ol>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/80 border border-purple-500/30">
                  <b className="text-purple-300 text-xs block mb-1">✨ 完全免費（0 AP）的動作：</b>
                  <ol className="list-decimal pl-4 space-y-1 text-[11px] text-slate-300">
                    <li><b>打出手牌戰術卡</b>：<b>不消耗任何 AP</b>！隨時想用就用，能瞬間帶來免 AP 行動、直接補電補錢、或者短暫抵擋天災等強力效果。</li>
                    <li><b>將防線裝備卸下存入倉庫</b>：隨時可以把暫時用不到的裝備卸下收到備用倉庫騰出空位，<b>不花費 AP</b>。</li>
                  </ol>
                </div>
              </div>
            </div>
          )}

          {/* Chapter 6: Transmission & Fallback */}
          {(activeSection === 'all' || activeSection === 'transmission') && (
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col gap-2.5">
              <h4 className="text-sm sm:text-base font-black text-emerald-300 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" /> 六、 執行任務時，系統是怎麼判定的？（後備自動接手）
              </h4>
              <p>
                當你對一項救援任務發起通訊時，系統會自動依照 <b>[P] ➔ [A] ➔ [C] ➔ [E]</b> 的順序幫你逐層檢查：
              </p>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] flex flex-col gap-1.5">
                <b className="text-slate-200">🔍 檢查這 4 個條件：</b>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-slate-400">
                  <div>🔋 <b>電量夠不夠？</b>（開這台設備的電量是否充足？）</div>
                  <div>🌪️ <b>有沒有被天災打斷？</b>（傳輸方式是否正好遭天災中斷？）</div>
                  <div>📊 <b>傳輸量夠不夠？</b>（若需傳影片，低階文字工具無法支援）</div>
                  <div>📡 <b>通訊距離夠不夠遠？</b>（能否穿透高山、地底或長距離？）</div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-center text-[11px] mt-1">
                <div className="p-2.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30 flex flex-col justify-between">
                  <b className="text-cyan-300 block mb-1">由 [P] 或 [A] 成功連通</b>
                  <span className="text-slate-400">獲得 <b>100% 滿額</b> 分數與物資！</span>
                </div>
                <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-500/30 flex flex-col justify-between">
                  <b className="text-amber-300 block mb-1">前兩道失靈，退入 [C] 救回</b>
                  <span className="text-slate-400">成功救人！獲得 <b>70%</b> 止血分數。</span>
                </div>
                <div className="p-2.5 rounded-xl bg-red-950/40 border border-red-500/30 flex flex-col justify-between">
                  <b className="text-red-300 block mb-1">全線告急，退入 [E] 保命</b>
                  <span className="text-slate-400">絕境生還！獲得 <b>50%</b> 保命分數。</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 mt-1">
                ❌ <b>若四道防線全都不合格</b>：通訊全數中斷，失去這 1 AP，系統會彈出【專家檢討報告】告訴你哪裡出了問題。<br />
                💡 <i>每張設備與戰術卡的詳細數值，可以隨時點擊遊戲內的【卡片全圖鑑】查看！</i>
              </p>
            </div>
          )}

        </div>

        {/* Footer Close Button */}
        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-slate-950 font-black text-xs sm:text-sm tracking-wider transition-all shadow-lg shadow-cyan-500/20 active:scale-[0.99] shrink-0"
        >
          我已讀懂規則，進入演習！
        </button>
      </div>
    </div>
  );
}

export default V2GuideModal;

