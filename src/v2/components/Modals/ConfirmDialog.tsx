import { AlertTriangle } from 'lucide-react';

export interface ConfirmDialogState {
  title: string;
  message: string;
  /** 確認按鈕文字，需寫出具體動作（例：「返回主選單」） */
  confirmLabel: string;
  onConfirm: () => void;
}

interface ConfirmDialogProps {
  dialog: ConfirmDialogState | null;
  onCancel: () => void;
}

/**
 * 會中斷戰局的操作（返回主選單、切換 v1、重開教學）共用的確認對話框，桌面與手機一致。
 * 注意：必須渲染在任何帶 backdrop-blur 的容器之外，否則 fixed 定位會相對於該容器。
 */
export function ConfirmDialog({ dialog, onCancel }: ConfirmDialogProps) {
  if (!dialog) return null;

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn font-mono"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
    >
      <div className="max-w-md w-full rounded-3xl border border-red-500/40 bg-slate-950 p-6 shadow-2xl flex flex-col gap-4 text-slate-100 animate-scaleUp">
        <div className="flex items-center gap-3 text-red-400">
          <div className="p-2.5 rounded-2xl bg-red-950/60 border border-red-500/40">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h3 id="confirm-dialog-title" className="text-base font-black text-slate-100">
            {dialog.title}
          </h3>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">{dialog.message}</p>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
          <button
            onClick={onCancel}
            autoFocus
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-xs transition-all"
          >
            取消，繼續遊戲
          </button>
          <button
            onClick={dialog.onConfirm}
            className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs transition-all shadow-md active:scale-95"
          >
            {dialog.confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

/** 三種會中斷戰局的操作的確認文案（桌面與手機共用，避免兩端說法不一致） */
export const DESTRUCTIVE_CONFIRM_COPY = {
  returnToMenu: {
    title: '確定返回主選單？',
    message: '返回主選單會結束這場演習，目前的進度不會保留。',
    confirmLabel: '返回主選單',
  },
  switchToV1: {
    title: '切換至經典 v1.0？',
    message: '切換到經典原版後，這場 v2 演習的進度會重置。',
    confirmLabel: '切換至 v1.0',
  },
  startTutorial: {
    title: '開始新手教學？',
    message: '開始教學會重置這場演習，並進入 8 步驟手把手引導。',
    confirmLabel: '開始教學',
  },
} as const;
