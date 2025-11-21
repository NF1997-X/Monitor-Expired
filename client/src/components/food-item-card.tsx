import { Edit, Trash, Undo2, X, ChevronDown } from "lucide-react";
import { FoodItem } from "@shared/schema";
import { getDaysUntilExpiry, getHoursUntilExpiry, getCountdownStatus, formatExpiryDate, formatUploadDate, getDaysUntilTrashClear, isExpired } from "@/lib/date-utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useState } from "react";

interface FoodItemCardProps {
  item: FoodItem;
  isDeleted?: boolean;
  onEdit?: (item: FoodItem) => void;
  onDelete?: (id: string) => void;
  onRestore?: (id: string) => void;
  onPermanentDelete?: (id: string) => void;
}


export default function FoodItemCard({ 
  item, 
  isDeleted = false, 
  onEdit, 
  onDelete, 
  onRestore, 
  onPermanentDelete 
}: FoodItemCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeletedOpen, setIsDeletedOpen] = useState(false);
  const daysRemaining = getDaysUntilExpiry(item.expiryDate);
  const hoursRemaining = getHoursUntilExpiry(item.expiryDate);
  const status = getCountdownStatus(daysRemaining);
  
  // Determine display text
  const getCountdownText = () => {
    if (daysRemaining < 0) return 'Expired';
    if (daysRemaining === 0) {
      if (hoursRemaining <= 0) return 'Expired';
      return `${hoursRemaining} hour${hoursRemaining !== 1 ? 's' : ''}`;
    }
    return `${daysRemaining} day${daysRemaining !== 1 ? 's' : ''}`;
  };
  
  if (isDeleted) {
    const daysUntilClear = item.deletedAt ? getDaysUntilTrashClear(item.deletedAt) : 0;
    const itemExpired = isExpired(item.expiryDate);
    
    return (
      <Collapsible open={isDeletedOpen} onOpenChange={setIsDeletedOpen}>
        <div className="glass rounded-lg p-3 opacity-70 animate-fade-in" data-testid={`deleted-item-${item.id}`}>
          <CollapsibleTrigger asChild>
            <button className="w-full flex items-center justify-between hover:opacity-80 transition-opacity">
              <h3 className="font-medium line-through" style={{ fontSize: '9px' }} data-testid="item-name">
                {item.name}
              </h3>
              <ChevronDown className={`w-3 h-3 text-muted-foreground transition-transform duration-200 ${isDeletedOpen ? 'rotate-180' : ''}`} />
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2 pt-2 border-t border-white/10">
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground">Deleted:</span>
                <span className="text-foreground">{item.deletedAt ? formatExpiryDate(item.deletedAt) : 'Unknown'}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-orange-400" data-testid="trash-countdown">
                  {daysUntilClear > 0 
                    ? `Auto-clear in ${daysUntilClear} day${daysUntilClear !== 1 ? 's' : ''}`
                    : 'Ready for auto-clear'
                  }
                </span>
              </div>
              <div className="flex items-center space-x-2 pt-2">
                {!itemExpired && (
                  <button 
                    className="flex-1 p-2 hover:bg-green-500/20 rounded text-xs transition-colors duration-200 flex items-center justify-center space-x-1"
                    onClick={() => onRestore?.(item.id)}
                    data-testid={`restore-item-${item.id}`}
                  >
                    <Undo2 className="w-3 h-3 text-green-400" />
                    <span className="text-green-400">Restore</span>
                  </button>
                )}
                <button 
                  className="flex-1 p-2 hover:bg-red-500/20 rounded text-xs transition-colors duration-200 flex items-center justify-center space-x-1"
                  onClick={() => onPermanentDelete?.(item.id)}
                  data-testid={`permanent-delete-${item.id}`}
                >
                  <X className="w-3 h-3 text-destructive" />
                  <span className="text-destructive">Delete</span>
                </button>
              </div>
            </div>
          </CollapsibleContent>
        </div>
      </Collapsible>
    );
  }
  
  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="glass rounded-lg p-3 animate-fade-in" data-testid={`food-item-${item.id}`}>
        <CollapsibleTrigger asChild>
          <button className="w-full flex items-center justify-between hover:opacity-80 transition-opacity">
            <h3 className="font-medium" style={{ fontSize: '9px' }} data-testid="item-name">
              {item.name}
            </h3>
            <div className="flex items-center space-x-2">
              <span 
                className={`countdown-badge ${status}`}
                data-testid="countdown-badge"
              >
                {getCountdownText()}
              </span>
              <ChevronDown className={`w-3 h-3 text-muted-foreground transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </div>
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-2 pt-2 border-t border-white/10">
          <div className="space-y-2">
            <div className="flex justify-between items-center" style={{ fontSize: '10px' }}>
              <span className="text-muted-foreground">Expires:</span>
              <span className="text-foreground">{formatExpiryDate(item.expiryDate)}</span>
            </div>
            {item.createdAt && (
              <div className="flex justify-between items-center" style={{ fontSize: '10px' }}>
                <span className="text-muted-foreground">Added:</span>
                <span className="text-foreground">{formatUploadDate(item.createdAt)}</span>
              </div>
            )}
            {item.notes && (
              <div style={{ fontSize: '10px' }}>
                <span className="text-muted-foreground">Notes:</span>
                <p className="text-foreground mt-1 leading-relaxed">{item.notes}</p>
              </div>
            )}
            <div className="flex items-center space-x-2 pt-2">
              <button 
                className="flex-1 p-2 hover:bg-white/10 rounded transition-colors duration-200 flex items-center justify-center space-x-1"
                onClick={() => onEdit?.(item)}
                data-testid={`edit-item-${item.id}`}
                style={{ fontSize: '10px' }}
              >
                <Edit className="w-3 h-3" />
                <span>Edit</span>
              </button>
              <button 
                className="flex-1 p-2 hover:bg-red-500/20 rounded transition-colors duration-200 flex items-center justify-center space-x-1"
                onClick={() => onDelete?.(item.id)}
                data-testid={`delete-item-${item.id}`}
                style={{ fontSize: '10px' }}
              >
                <Trash className="w-3 h-3 text-destructive" />
                <span className="text-destructive">Delete</span>
              </button>
            </div>
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}
