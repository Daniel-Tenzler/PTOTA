import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import type { ItemCategory } from './housingIcons';
import { CATEGORY_ICONS, CATEGORY_COLORS, CATEGORY_LABELS } from './housingIcons';

interface ItemCategoryGroupProps {
  category: ItemCategory;
  items: React.ReactNode[];
  defaultExpanded?: boolean;
}

export function ItemCategoryGroup({ category, items, defaultExpanded = true }: ItemCategoryGroupProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const CategoryIcon = CATEGORY_ICONS[category];
  const colorClass = CATEGORY_COLORS[category];

  return (
    <div className="mb-2">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 w-full p-2 rounded hover:bg-gray-700/50 transition-colors text-left"
      >
        {isExpanded ? (
          <ChevronDown className="w-4 h-4 text-gray-400" />
        ) : (
          <ChevronRight className="w-4 h-4 text-gray-400" />
        )}
        <CategoryIcon className={`w-4 h-4 ${colorClass}`} />
        <span className="font-medium">{CATEGORY_LABELS[category]}</span>
        <span className="text-gray-500 text-sm">({items.length})</span>
      </button>
      {isExpanded && <div className="flex flex-col bg-gray-800 rounded">{items}</div>}
    </div>
  );
}
