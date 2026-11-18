import type { ReactNode } from 'react';
import { CommsCard, WorldviewType } from '../../types/game';
import { getCommsCardMediumInfo } from '../../data/terminology';
import { EquipCardSpecs } from './EquipCardSpecs';

interface UnifiedCommsCardContentProps {
  card: CommsCard;
  worldview: WorldviewType;
  showFlavor?: boolean;
  headerRightBadge?: ReactNode;
}

export function UnifiedCommsCardContent({
  card,
  worldview,
  showFlavor = false,
  headerRightBadge,
}: UnifiedCommsCardContentProps) {
  const content = card.translations[worldview];
  const mediumInfo = getCommsCardMediumInfo(card);

  return (
    <div className="flex flex-col gap-2 font-mono w-full">
      {/* Top Metadata Row: Medium Badge (Left) & Cost/Action Badge (Right) */}
      <div className="flex items-center justify-between gap-1.5 w-full flex-wrap">
        {mediumInfo && (
          <span className={`px-2 py-0.5 rounded-full text-xs font-bold border shrink-0 ${mediumInfo.bgColor} ${mediumInfo.borderColor} ${mediumInfo.color}`}>
            {mediumInfo.icon} {mediumInfo.label}
          </span>
        )}
        {headerRightBadge && (
          <div className="shrink-0 flex items-center">
            {headerRightBadge}
          </div>
        )}
      </div>

      {/* Full-Width Card Title */}
      <h4 className="text-sm font-black text-slate-100 leading-snug break-words">
        {content?.name || card.id}
      </h4>

      {/* Description */}
      <p className="text-xs text-slate-300 leading-relaxed">
        {content?.desc}
      </p>

      {showFlavor && content?.flavor && (
        <p className="text-xs text-slate-400 italic">
          "{content.flavor}"
        </p>
      )}

      {/* 規格矩陣與防護徽章：與防線、市場共用同一元件 */}
      <EquipCardSpecs card={card} />
    </div>
  );
}
