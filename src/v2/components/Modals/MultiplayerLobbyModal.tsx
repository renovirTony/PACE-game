import React, { useState } from 'react';
import { RoomPeer } from '../../types/game';
import { Users, Globe, Copy, Check, X, Sparkles, LogIn, Plus } from 'lucide-react';

interface MultiplayerLobbyModalProps {
  isOpen: boolean;
  onClose: () => void;
  roomCode: string;
  isHost: boolean;
  peers: RoomPeer[];
  connectionStatus: 'disconnected' | 'connecting' | 'connected' | 'error';
  connectionMsg: string;
  onCreateRoom: (name: string) => Promise<string>;
  onJoinRoom: (code: string, name: string) => Promise<void>;
  onStartGame: () => void;
}

export function MultiplayerLobbyModal({
  isOpen,
  onClose,
  roomCode,
  isHost,
  peers,
  connectionStatus,
  connectionMsg,
  onCreateRoom,
  onJoinRoom,
  onStartGame,
}: MultiplayerLobbyModalProps) {
  const [playerName, setPlayerName] = useState('指揮官');
  const [inputRoomCode, setInputRoomCode] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'create' | 'join'>('create');

  if (!isOpen) return null;

  const handleCopyLink = () => {
    const url = `${window.location.origin}${window.location.pathname}?v=2&room=${roomCode}`;
    navigator.clipboard.writeText(url);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleCreate = async () => {
    if (!playerName.trim()) return;
    await onCreateRoom(playerName.trim());
  };

  const handleJoin = async () => {
    if (!playerName.trim() || !inputRoomCode.trim()) return;
    await onJoinRoom(inputRoomCode.trim(), playerName.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md font-mono animate-fadeIn">
      <div className="relative w-full max-w-lg rounded-3xl border border-cyan-500/40 bg-slate-950 p-6 sm:p-8 shadow-2xl flex flex-col gap-5 text-slate-100">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-100 rounded-xl hover:bg-slate-900 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Globe className="w-7 h-7 animate-pulse" />
          </div>
          <div>
            <span className="text-xs font-bold text-cyan-400 block uppercase">
              WebRTC P2P 免伺服器連線
            </span>
            <h3 className="text-lg sm:text-xl font-black text-slate-100">
              遠端多人連線大廳 (Multiplayer)
            </h3>
          </div>
        </div>

        {/* Connection Status Banner */}
        {connectionMsg && (
          <div className={`p-3 rounded-2xl text-xs font-bold border ${
            connectionStatus === 'connected'
              ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-300'
              : connectionStatus === 'error'
              ? 'bg-red-950/50 border-red-500/40 text-red-300'
              : 'bg-cyan-950/50 border-cyan-500/40 text-cyan-300 animate-pulse'
          }`}>
            {connectionMsg}
          </div>
        )}

        {/* If Not in Room Yet */}
        {!roomCode ? (
          <div className="flex flex-col gap-4">
            {/* Player Name Input */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-300">
                你的指揮官暱稱：
              </label>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="例如：第一線搜救組長"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs font-bold focus:outline-none focus:border-cyan-400"
              />
            </div>

            {/* Tab Selector: Create vs Join */}
            <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-slate-900 border border-slate-800">
              <button
                onClick={() => setActiveTab('create')}
                className={`py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'create'
                    ? 'bg-cyan-500 text-slate-950 shadow-sm font-black'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Plus className="w-4 h-4" /> 建立新房間
              </button>

              <button
                onClick={() => setActiveTab('join')}
                className={`py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'join'
                    ? 'bg-cyan-500 text-slate-950 shadow-sm font-black'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <LogIn className="w-4 h-4" /> 輸入代碼加入
              </button>
            </div>

            {activeTab === 'create' ? (
              <button
                onClick={handleCreate}
                disabled={connectionStatus === 'connecting'}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-slate-950 font-black text-sm tracking-wider transition-all shadow-lg active:scale-98"
              >
                {connectionStatus === 'connecting' ? '正在建立房間...' : '🚀 立即建立 4 碼房間'}
              </button>
            ) : (
              <div className="flex flex-col gap-3">
                <input
                  type="text"
                  value={inputRoomCode}
                  onChange={(e) => setInputRoomCode(e.target.value.toUpperCase())}
                  placeholder="輸入 4 碼房號 (如 PACE)"
                  maxLength={6}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-sm font-black tracking-widest text-center focus:outline-none focus:border-cyan-400 uppercase font-orbitron"
                />

                <button
                  onClick={handleJoin}
                  disabled={connectionStatus === 'connecting' || !inputRoomCode.trim()}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-slate-950 font-black text-sm tracking-wider transition-all shadow-lg active:scale-98 disabled:opacity-50"
                >
                  {connectionStatus === 'connecting' ? '連線中...' : '📡 加入此房間'}
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Room Connected Info View */
          <div className="flex flex-col gap-4">
            {/* Room Code Box */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-cyan-500/40 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">房間專屬代碼</span>
                <span className="text-2xl font-black text-cyan-300 font-orbitron tracking-widest">
                  {roomCode}
                </span>
              </div>

              <button
                onClick={handleCopyLink}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-500/50 text-xs font-bold transition-all active:scale-95"
              >
                {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{isCopied ? '已複製連結！' : '複製邀請連結'}</span>
              </button>
            </div>

            {/* Connected Peers List */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-cyan-400" /> 已連線成員 ({peers.length + 1} 人)：
              </span>

              <div className="flex flex-col gap-1.5">
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-200">📡 {playerName} (你 - {isHost ? '房主' : '成員'})</span>
                  <span className="text-[10px] text-emerald-400 font-bold">● 在線</span>
                </div>

                {peers.map((peer) => (
                  <div
                    key={peer.peerId}
                    className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs"
                  >
                    <span className="font-bold text-slate-200">{peer.avatar} {peer.name}</span>
                    <span className="text-[10px] text-emerald-400 font-bold">● 在線</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Start Game Action */}
            {isHost && (
              <button
                onClick={onStartGame}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-slate-950 font-black text-sm tracking-wider transition-all shadow-lg active:scale-98"
              >
                🎮 全員就緒，開始連線作戰！
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
