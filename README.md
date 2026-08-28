# 📡 PACE 通訊先鋒 (PACE: Comms Protocol)

> **戰術民防與應急通訊網頁桌遊 · 現代防災與 PACE 通訊備援架構模擬**  
> 融合真實 **PACE (Primary, Alternate, Contingency, Emergency)** 四重備援規劃準則，考驗指揮官在極端災害、大斷電與電磁干擾環境下的應變決策！

---

## 🎮 線上直接遊玩 (Live Demo)

- 🌟 **【全新重構版 v2.0 (預設推薦)】：[https://renovirtony.github.io/PACE-game/](https://renovirtony.github.io/PACE-game/)**  
  *(自組防線、5 大實體物理媒介、三大世界觀一鍵切換、WebRTC P2P 遠端多人連線)*
- 🏛️ **【經典原版 v1.0 (歷史對照)】：[https://renovirtony.github.io/PACE-game/?v=1](https://renovirtony.github.io/PACE-game/?v=1)**  
  *(軍規模擬、固定槽位經典版)*

> 💡 *支援電腦、平板與手機瀏覽器，免安裝即開即玩！雙版本可在遊戲內隨時一鍵無縫對照。*

---

## 🕹️ 遊戲核心教育理念 (Core Pedagogical Concepts)

**PACE 原則** 是美軍與各國災害防救組織的核心準則。在極端災難中，**沒有任何單一科技是萬能的**：

*   **[P] Primary (主要防線)**：日常最高頻寬、最便捷工具（如 5G 手機、家用 Wi-Fi、光纖寬頻）。負責日常大量數據與視訊，但極度依賴市電與地面基地台。
*   **[A] Alternate (備用防線)**：主要手段受阻時的標準替代方案（如對講機、短波電台、低軌衛星）。功能相近但必須使用獨立物理媒介。
*   **[C] Contingency (應急防線)**：前兩道全毀時的強韌防線（如野戰手搖有線電話 TA-312、地底震波儀）。具備抗 EMP 與斷電耐受力，降級獲得 70% 止血收益。
*   **[E] Emergency (緊急防線)**：電磁與科技全滅時的終極保命手段（如信差騎士、手電筒摩斯光碼、哨子）。完全免電，降級獲得 50% 保命救援收益。

---

## 🌟 v2.0 全新重構特色 (V2 Features)

1.  **自由自組 PACE 防線 (Custom Defense Board)**：
    *   裝備工具卡不再鎖死槽位，玩家可根據戰術策略自由指派至 `[P]`、`[A]`、`[C]` 或 `[E]`。
    *   隨時可 **0 AP 自由對調槽位**，或將裝備收存至 **備用裝備倉庫**。
2.  **5 大實體物理媒介與共因失效防範 (Media Diversity)**：
    *   涵蓋 **公眾網 🏙️、衛星 🛰️、無線電 📻、實體有線 🔌、人力/光學 🏃** 五大媒介。
    *   若 P 與 A 同時依賴同種媒介，系統將即時發出 **共因失效警示 (Common-Mode Failure)**，提醒大停電時將連鎖崩潰。
3.  **真實物理天災打擊**：
    *   天災直接摧毀物理媒介（如大停電中斷基地台、暴風雨散射衛星、EMP 燒毀無線電晶片、強震扯斷地底光纜）。
    *   面板與市場會以**紅色警示燈即時標註當回合失效之裝備**。
4.  **頻寬門檻 (Bandwidth Gates) 與階梯降級機制**：
    *   高畫質空拍任務強制要求 `High` 頻寬；突發 SOS 求救任務僅需 `Low` 頻寬即可通聯。
    *   真實呈現 Fallback 降級回報率（P/A: 100%、C: 70%、E: 50%），消除故意將現代高頻工具放 E 刷分的漏洞。
5.  **三大文本世界觀一鍵切換**：
    *   🏠 **【社區民防與自救組長】（預設）**：智慧型手機、對講機、手搖電話、機車巡守隊。
    *   🌊 **【海島韌性與極端天災】**：5G專網基地台、海纜登陸站、花東微波塔、低軌衛星、HAM 電台。
    *   ⚡ **【大斷網時代：通訊拓荒者】**：公眾神經光纖、軌道星鏈、類比短波、生化機車信使。
6.  **🌐 WebRTC P2P 遠端多人連線 (GitHub Pages 靜態環境支援)**：
    *   基於 PeerJS 打造純前端 WebRTC 點對點連線，生成 4 碼房號或專屬邀請連結，免伺服器負擔！
7.  **通訊專家復盤講評 (Module B 教育回饋)**：
    *   每次任務後生成「專家復盤報告」，從做中學剖析各槽位成敗原因。
8.  **全卡牌圖鑑、PACE 作戰手冊與 8 步驟實戰新手教學**。

---

## 🚀 本地開發與啟動 (Local Development)

### 1. 安裝相依套件
```bash
npm install
```

### 2. 本地啟動開發伺服器
```bash
npm run dev
```
*(Windows PowerShell 若受限制，可執行 `cmd /c npm run dev`)*  
瀏覽器打開 `http://localhost:3000` 即可暢玩！

### 3. 編譯正式版本
```bash
npm run build
```
編譯產物將輸出至 `dist/` 目錄，支援直接部署至 GitHub Pages。

---

## 🛠️ 技術棧 (Tech Stack)

*   **前端框架**：React 18 + TypeScript + Vite
*   **多人連線**：PeerJS (WebRTC P2P 點對點即時同步)
*   **UI 樣式與動效**：TailwindCSS + Lucide Icons + Canvas-Confetti
*   **音訊系統**：Web Audio API 原生音頻合成技術
*   **核心引擎**：自研 PACE 狀態機、物理媒介檢定演算法與啟發式 AI

---

## 📜 專案授權 (License)

本專案採用 [MIT License](LICENSE) 授權開源。
