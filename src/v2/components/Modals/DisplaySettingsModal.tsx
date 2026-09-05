import React from 'react';
import { X, Sliders, Type, Palette, Check, Eye, Globe } from 'lucide-react';
import { WorldviewType } from '../../types/game';

export type FontSizeMode = 'normal' | 'large' | 'xlarge';
export type ThemeMode = 'tactical-dark' | 'soft-muted' | 'daylight';

interface DisplaySettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  fontSize: FontSizeMode;
  onChangeFontSize: (size: FontSizeMode) => void;
  theme: ThemeMode;
  onChangeTheme: (theme: ThemeMode) => void;
  worldview?: WorldviewType;
  onChangeWorldview?: (wv: WorldviewType) => void;
}

export interface ThemeOptionDef {
  id: ThemeMode;
  name: string;
  tag: string;
  desc: string;
  icon: string;
  previewBg: string;
  previewBorder: string;
  previewAccent: string;
}

export const THEME_OPTIONS: ThemeOptionDef[] = [
  {
    id: 'tactical-dark',
    name: '經典戰術藍',
    tag: '預設風格',
    desc: '原汁原味深空藍黑底色與青藍微光，具備現代戰術指揮儀表科技感。',
    icon: '🌌',
    previewBg: '#070a13',
    previewBorder: '#06b6d4',
    previewAccent: '#38bdf8',
  },
  {
    id: 'soft-muted',
    name: '色調柔和版本',
    tag: '舒緩護眼',
    desc: '柔和中性深灰底色，大幅降低對比度與刺眼霓虹眩光，長時間作戰眼睛最不酸澀。',
    icon: '🍵',
    previewBg: '#161922',
    previewBorder: '#475569',
    previewAccent: '#94a3b8',
  },
  {
    id: 'daylight',
    name: '日間模式 (白底版本)',
    tag: '淨白高對比',
    desc: '白底黑字高對比，專為明亮環境打造，乾淨柔和如紙本戰術卡般易讀。',
    icon: '☀️',
    previewBg: '#f8fafc',
    previewBorder: '#cbd5e1',
    previewAccent: '#0284c7',
  },
];

export const WORLDVIEW_OPTIONS = [
  {
    id: 'CivilDefense' as WorldviewType,
    name: '社區民防自救',
    icon: '🏠',
    desc: '平時里民巡守與互助網絡，震災與風災中的避難所通訊自救體系。',
  },
  {
    id: 'IslandResilience' as WorldviewType,
    name: '海島極端天災',
    icon: '🌊',
    desc: '面臨強烈颱風、土石流與孤島效應，驗證異質通訊防線的生存演習。',
  },
  {
    id: 'CyberDisconnect' as WorldviewType,
    name: '大斷網廢土',
    icon: '⚡',
    desc: '網際網路與衛星全域中斷後的近未來生存，探索非電化與短波通訊。',
  },
];

export function DisplaySettingsModal({
  isOpen,
  onClose,
  fontSize,
  onChangeFontSize,
  theme,
  onChangeTheme,
  worldview,
  onChangeWorldview,
}: DisplaySettingsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-fadeIn font-mono">
      <div className="max-w-2xl w-full rounded-3xl border border-cyan-500/40 bg-slate-950/95 p-5 sm:p-7 shadow-2xl flex flex-col gap-5 text-slate-100 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black tracking-wide text-slate-100 flex items-center gap-2">
                <span>視覺偏好與文本世界觀設定</span>
              </h2>
              <p className="text-[11px] text-slate-400">
                可隨時切換世界觀情境、調整文字大小與護眼配色，即時生效並自動儲存
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 transition-all"
            title="關閉設定"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section 0: Worldview Selection (if provided) */}
        {worldview && onChangeWorldview && (
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm font-black text-slate-200 flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-cyan-400" />
                <span>故事世界觀切換 (Worldview Narrative)</span>
              </span>
              <span className="text-[10px] text-slate-400">
                即時切換所有卡牌、天災與任務的文本情境
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {WORLDVIEW_OPTIONS.map((wv) => (
                <button
                  key={wv.id}
                  onClick={() => onChangeWorldview(wv.id)}
                  className={`p-3 rounded-2xl border text-left flex flex-col justify-between gap-1.5 transition-all relative ${
                    worldview === wv.id
                      ? 'border-cyan-400 bg-cyan-950/40 text-cyan-200 shadow-md shadow-cyan-500/20 ring-1 ring-cyan-400'
                      : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xl">{wv.icon}</span>
                    {worldview === wv.id && (
                      <div className="p-0.5 rounded-full bg-cyan-500 text-slate-950">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>
                  <div>
                    <span className="text-xs font-black text-slate-100 block">{wv.name}</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5 leading-relaxed">{wv.desc}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Section 1: Font Size Controls */}
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-black text-slate-200 flex items-center gap-1.5">
              <Type className="w-4 h-4 text-cyan-400" />
              <span>系統文字大小 (Font Scaling)</span>
            </span>
            <span className="text-[10px] text-slate-400">
              全介面卡牌與數值等比縮放，杜絕不當折行
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            {[
              { id: 'normal', label: '標準 (14px)', desc: '緊湊高密度佈局', scale: 'text-xs' },
              { id: 'large', label: '放大 (16px)', desc: '推薦 · 電腦螢幕最舒適', scale: 'text-sm' },
              { id: 'xlarge', label: '特大 (17.5px)', desc: '大字體清晰不破版', scale: 'text-base' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => onChangeFontSize(item.id as FontSizeMode)}
                className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                  fontSize === item.id
                    ? 'border-cyan-400 bg-cyan-950/40 text-cyan-200 shadow-md shadow-cyan-500/20 ring-1 ring-cyan-400'
                    : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`font-black ${item.scale} text-slate-100`}>A</span>
                  {fontSize === item.id && (
                    <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                  )}
                </div>
                <div>
                  <span className="text-xs font-black block">{item.label}</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">{item.desc}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Section 2: Color Themes (3 Clean Modes) */}
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-black text-slate-200 flex items-center gap-1.5">
              <Palette className="w-4 h-4 text-cyan-400" />
              <span>配色主題模式 (3 種核心風格)</span>
            </span>
            <span className="text-[10px] text-slate-400">
              精選 3 款最具實用性之介面色調
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {THEME_OPTIONS.map((t) => (
              <button
                key={t.id}
                onClick={() => onChangeTheme(t.id)}
                className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between gap-3 transition-all relative overflow-hidden ${
                  theme === t.id
                    ? 'border-cyan-400 bg-cyan-950/30 text-slate-100 shadow-md shadow-cyan-500/20 ring-1 ring-cyan-400'
                    : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700 hover:text-slate-100'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <div
                    className="w-8 h-8 rounded-xl border flex items-center justify-center shrink-0 text-sm shadow-inner"
                    style={{
                      backgroundColor: t.previewBg,
                      borderColor: t.previewBorder,
                    }}
                  >
                    <span>{t.icon}</span>
                  </div>

                  <span
                    className="text-[9px] font-bold px-1.5 py-0.5 rounded border shrink-0"
                    style={{
                      borderColor: t.previewBorder,
                      color: t.previewAccent,
                    }}
                  >
                    {t.tag}
                  </span>
                </div>

                <div className="flex flex-col flex-1">
                  <span className="text-xs font-black text-slate-100 block">
                    {t.name}
                  </span>
                  <p className="text-[10px] text-slate-400 leading-relaxed mt-1">
                    {t.desc}
                  </p>
                </div>

                {theme === t.id && (
                  <div className="absolute top-2 right-2 p-0.5 rounded-full bg-cyan-500 text-slate-950">
                    <Check className="w-3 h-3" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Section 3: Live Preview Box (M.A.P.S Applicable Principle) */}
        <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col gap-2">
          <span className="text-[11px] font-black text-slate-400 flex items-center gap-1.5 uppercase">
            <Eye className="w-3.5 h-3.5 text-cyan-400" />
            即時效果預覽 (Live Component Preview)
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {/* Card Snippet Preview */}
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-700 flex flex-col gap-2 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-950/60 text-amber-300 border border-amber-500/40">
                  📻 無線電波
                </span>
                <span className="text-[10px] font-bold text-emerald-300">
                  💰 2 物資
                </span>
              </div>
              <span className="text-xs font-black text-slate-100">
                免執照對講機 (FRS 無線電)
              </span>
              <p className="text-[10px] text-slate-300 leading-tight">
                短距離通聯基石，不依賴電力網路與電信基地台。
              </p>
              <div className="grid grid-cols-3 gap-1 pt-1.5 text-[9px] border-t border-white/10 text-center">
                <div className="p-1 rounded bg-black/40">
                  <span className="text-slate-500 block">頻寬門檻</span>
                  <span className="font-black text-amber-400">Medium</span>
                </div>
                <div className="p-1 rounded bg-black/40">
                  <span className="text-slate-500 block">通訊距離</span>
                  <span className="font-bold text-slate-200">視距</span>
                </div>
                <div className="p-1 rounded bg-black/40">
                  <span className="text-slate-500 block">運作耗電</span>
                  <span className="font-bold text-amber-300">1⚡</span>
                </div>
              </div>
            </div>

            {/* Mission Snippet Preview */}
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-700 flex flex-col gap-2 justify-between shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/40">
                  CRISIS · 突發通訊檢驗
                </span>
                <span className="text-[10px] font-bold text-purple-300">
                  🏆 5 分
                </span>
              </div>
              <div>
                <span className="text-xs font-black text-slate-100 block">
                  受困長者醫療急救轉送
                </span>
                <span className="text-[10px] text-slate-300 leading-tight block mt-0.5">
                  頻寬需求：Medium 頻寬 · 視距通聯
                </span>
              </div>
              <div className="p-1.5 rounded-lg bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 text-[10px] font-bold text-center">
                ✓ 防線連通檢定成功率：100%
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          <button
            onClick={() => {
              onChangeFontSize('large');
              onChangeTheme('tactical-dark');
            }}
            className="text-xs text-slate-400 hover:text-slate-200 transition-all underline"
          >
            重設回預設設定
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs transition-all shadow-lg shadow-cyan-500/25 active:scale-95"
          >
            完成並儲存偏好
          </button>
        </div>
      </div>
    </div>
  );
}
