# PACE 通訊先鋒 (PACE: Comms Protocol) - 開發與交付驗證規範

本檔案為 Antigravity AI 助手的專案級通用規則（Project Rules），在後續的所有對話與實作中皆須嚴格遵守。

---

## 🛠️ 開發與交付驗證工作流 (Verification Workflow)

### 1. 雙端同步原則 (Dual-Platform Synchronization)
* 本專案同時支援**桌面全景版**與**行動端直式版**。
* **任何 UI、互動或功能修改，必須同時考量並同步更新桌面端與手機端**，嚴禁只修改單一版本而導致另一版本功能遺漏、不同步或破版。

### 2. 本地驗證流程 (Local Verification)
* 每次完成功能開發或介面修改，必須在兩個檢驗端點進行確認：
  * **桌面全景版**：`http://localhost:3000/`
  * **手機直向模擬版**：`http://localhost:3000/?mobile=1`
* 必須檢查文字排版（防止大字體下單字成行破行）、按鈕點擊狀態、資訊對齊與無遮擋。

### 3. 編譯健康度檢查 (Build Health Check)
* 每次交付程式碼或提交 Git 之前，必須在終端執行編譯指令：
  ```bash
  cmd /c "npm run build"
  ```
* 確保 **0 TypeScript compilation errors** 與 **0 Vite bundling errors**。

### 4. 版本相容性與語系原則 (Compatibility & Localization)
* **經典版保留**：`src/v1/`（進入點 `?v=1`）為核心參考基準，**嚴禁刪除或破壞其可運行性**。所有全新功能與介面重構均在 `src/v2/` 中實作。
* **語系規範**：所有使用者可見文字、說明手冊、介面標籤與提示訊息，一律使用**繁體中文（台灣習慣用語）**，避免生硬或不通順之翻譯詞彙。

### 5. M.A.P.S 認知減負設計原則 (UI/UX Guidelines)
* **M (Minimal - 極簡降噪)**：減少螢幕無謂的固定遮蔽（特別是手機直向畫面），留出最大的中央盤面空間。
* **A (Applicable - 行動導向)**：高頻點擊與作戰資源集中於拇指熱區（畫面下 1/3）。
* **P (Patterns - 一致模型)**：次級資訊與詳細戰況統一採用由下而上的抽屜（BottomSheet）或對齊的心智模型。
* **S (Step-by-Step - 漸進揭露)**：資訊分層呈現，日常狀態輕量簡短，點擊後才展開完整數據。
