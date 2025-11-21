import { useEffect, useRef } from "react";
import type { FoodItem } from "@shared/schema";
import { format, parseISO } from "date-fns";
import { getDaysUntilExpiry, getHoursUntilExpiry } from "@/lib/date-utils";

interface NotificationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  expiringItems: FoodItem[];
  triggerRef?: React.RefObject<HTMLButtonElement>;
}

export function NotificationModal({
  open,
  onOpenChange,
  expiringItems,
  triggerRef,
}: NotificationModalProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        triggerRef?.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        onOpenChange(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, onOpenChange, triggerRef]);

  const getExpiryInfo = (item: FoodItem) => {
    const expiryDate = typeof item.expiryDate === 'string' ? parseISO(item.expiryDate) : item.expiryDate;
    const formattedDate = format(expiryDate, "d MMM yyyy");
    const daysUntil = getDaysUntilExpiry(expiryDate);
    
    let countdown = "";
    if (daysUntil === 0) {
      const hoursUntil = getHoursUntilExpiry(expiryDate);
      countdown = `${hoursUntil}h left`;
    } else if (daysUntil > 0) {
      countdown = `${daysUntil}d left`;
    } else {
      countdown = "Expired";
    }
    
    return { formattedDate, countdown };
  };

  if (!open) return null;

  return (
    <div 
      ref={dropdownRef}
      className="fixed top-16 right-4 w-80 max-w-[calc(100vw-2rem)] z-50 animate-fade-in"
    >
      <div className="glass-dark rounded-lg shadow-2xl border border-white/10 overflow-hidden">
        <div className="p-3 border-b border-white/10">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <span>🔔</span>
            <span>Expiring Items</span>
          </h3>
        </div>
        
        <div className="max-h-96 overflow-y-auto custom-scrollbar">
          {expiringItems.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-3xl mb-2">🎉</p>
              <p className="text-xs text-muted-foreground">
                No items expiring in the next 3 days!
              </p>
            </div>
          ) : (
            <div className="p-2 space-y-2">
              {expiringItems.map((item) => {
                const { formattedDate, countdown } = getExpiryInfo(item);
                const isExpired = countdown === "Expired";
                const isUrgent = countdown.includes("h") || countdown === "1d left";
                
                return (
                  <div
                    key={item.id}
                    className="glass rounded-lg p-2.5 border-l-4 transition-all duration-200 hover:scale-[1.01] hover:shadow-md"
                    style={{
                      borderLeftColor: isExpired 
                        ? '#ef4444' 
                        : isUrgent 
                        ? '#f97316' 
                        : '#3b82f6'
                    }}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-xs truncate">
                          {item.name}
                        </h4>
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                          {item.category}
                        </p>
                        <p className="text-[10px] mt-1 flex items-center gap-1">
                          <span className="opacity-70">📅</span>
                          <span>{formattedDate}</span>
                        </p>
                      </div>
                      <div
                        className="text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm whitespace-nowrap"
                        style={{
                          backgroundColor: isExpired 
                            ? '#ef4444' 
                            : isUrgent 
                            ? '#f97316' 
                            : '#3b82f6',
                          color: 'white'
                        }}
                      >
                        {countdown}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
