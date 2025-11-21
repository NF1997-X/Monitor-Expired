import { useState } from "react";
import { format, isToday } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getCalendarDays } from "@/lib/date-utils";

interface MiniCalendarProps {
  selectedDate?: Date;
  onDateSelect?: (date: Date) => void;
}

export default function MiniCalendar({ selectedDate, onDateSelect }: MiniCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right' | ''>('');
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const days = getCalendarDays(year, month);
  
  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe) {
      navigateMonth('next');
    } else if (isRightSwipe) {
      navigateMonth('prev');
    }
  };
  
  const navigateMonth = (direction: 'prev' | 'next') => {
    setIsTransitioning(true);
    setSlideDirection(direction === 'prev' ? 'right' : 'left');
    
    setTimeout(() => {
      setCurrentDate(prev => {
        const newDate = new Date(prev);
        if (direction === 'prev') {
          newDate.setMonth(prev.getMonth() - 1);
        } else {
          newDate.setMonth(prev.getMonth() + 1);
        }
        return newDate;
      });
      
      setTimeout(() => {
        setIsTransitioning(false);
        setSlideDirection('');
      }, 400);
    }, 400);
  };

  const weekdays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  
  return (
    <div 
      className="glass rounded-lg p-3 transform transition-all duration-300 hover:scale-105" 
      data-testid="mini-calendar"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium" style={{ fontSize: '11px' }} data-testid="current-month">
          {format(currentDate, 'MMMM yyyy')}
        </h3>
        <div className="flex space-x-1">
          <button 
            className="p-1 hover:bg-white/10 rounded text-xs transition-colors"
            onClick={() => navigateMonth('prev')}
            data-testid="prev-month"
          >
            <ChevronLeft className="w-3 h-3" />
          </button>
          <button 
            className="p-1 hover:bg-white/10 rounded text-xs transition-colors"
            onClick={() => navigateMonth('next')}
            data-testid="next-month"
          >
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>
      
      <div 
        className={`calendar-grid transform transition-all duration-[800ms] ${
          isTransitioning 
            ? slideDirection === 'left' 
              ? '-translate-x-full opacity-0' 
              : 'translate-x-full opacity-0'
            : 'translate-x-0 opacity-100'
        }`}
        style={{ transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)', fontSize: '10px' }}
      >
        {weekdays.map((day, index) => (
          <div key={`weekday-${index}`} className="text-center text-muted-foreground py-1">
            {day}
          </div>
        ))}
        
        {days.map((day, index) => {
          const isSelected = selectedDate && 
            day.date.toDateString() === selectedDate.toDateString();
          const isTodayDate = isToday(day.date);
          
          return (
            <button
              key={index}
              className={`text-center py-1 hover:bg-white/10 rounded cursor-pointer transition-colors ${
                !day.isCurrentMonth ? 'text-muted-foreground/50' : ''
              } ${isSelected ? 'bg-primary/20 text-primary' : ''} ${
                isTodayDate && !isSelected ? 'bg-primary/10 text-primary font-semibold border border-primary/30' : ''
              }`}
              onClick={() => onDateSelect?.(day.date)}
              data-testid={`calendar-day-${day.day}`}
            >
              {day.day}
            </button>
          );
        })}
      </div>
    </div>
  );
}
