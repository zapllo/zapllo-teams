'use client';

import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { useState, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Check, X, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface CustomDatePickerProps {
  selectedDate: Date | null;
  onDateChange: (date: Date) => void;
  onCloseDialog?: () => void;
  onBackToDatePicker?: () => void;
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  selectedDate,
  onDateChange,
  onCloseDialog,
  onBackToDatePicker
}) => {
  const [selectedDateValue, setSelectedDateValue] = useState<Dayjs>(
    selectedDate ? dayjs(selectedDate) : dayjs(new Date())
  );

  const [currentDate, setCurrentDate] = useState(dayjs());
  const [isYearPickerOpen, setIsYearPickerOpen] = useState(false);
  const [viewTransition, setViewTransition] = useState<'in' | 'out' | null>(null);

  // When the selectedDate prop changes, update the local selectedDateValue state
  useEffect(() => {
    if (selectedDate) {
      setSelectedDateValue(dayjs(selectedDate));
    }
  }, [selectedDate]);

  const years = Array.from({ length: 120 }, (_, i) => currentDate.year() - 60 + i);

  const handleDateClick = (day: number) => {
    const newDate = currentDate.date(day);
    setSelectedDateValue(newDate);
  };

  const handleAccept = () => {
    onDateChange(selectedDateValue.toDate());
    if (onCloseDialog) {
      onCloseDialog();
    }
  };

  const daysInMonth = currentDate.daysInMonth();
  const firstDayOfMonth = currentDate.startOf('month').day();

  const handlePrevMonth = () => {
    setViewTransition('out');
    setTimeout(() => {
      setCurrentDate(currentDate.subtract(1, 'month'));
      setViewTransition('in');
    }, 150);
    setTimeout(() => setViewTransition(null), 300);
  };

  const handleNextMonth = () => {
    setViewTransition('out');
    setTimeout(() => {
      setCurrentDate(currentDate.add(1, 'month'));
      setViewTransition('in');
    }, 150);
    setTimeout(() => setViewTransition(null), 300);
  };

  const handleYearChange = (year: number) => {
    setCurrentDate(currentDate.year(year));
    setIsYearPickerOpen(false);
  };

  const toggleYearPicker = () => {
    setIsYearPickerOpen(!isYearPickerOpen);
  };

  // Jump to current month
  const goToToday = () => {
    setCurrentDate(dayjs());
    if (isYearPickerOpen) {
      setIsYearPickerOpen(false);
    }
  };

  const isToday = (day: number) => {
    const today = dayjs();
    return currentDate.month() === today.month() &&
           currentDate.year() === today.year() &&
           day === today.date();
  };

  const renderDays = () => {
    const days = [];

    // Add empty cells for days from previous month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-9 w-9"></div>);
    }

    // Add days of the current month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = currentDate.date(day);
      const isSelected = selectedDateValue.format('YYYY-MM-DD') === date.format('YYYY-MM-DD');
      const dayIsToday = isToday(day);

      days.push(
        <Button
          key={day}
          type="button"
          variant="ghost"
          onClick={() => handleDateClick(day)}
          className={cn(
            "h-9 w-9 p-0 font-normal aria-selected:opacity-100",
            isSelected && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
            dayIsToday && !isSelected && "border border-primary text-primary dark:text-primary"
          )}
        >
          {day}
        </Button>
      );
    }

    return days;
  };

  return (
    <div className="flex flex-col p-4 bg-background rounded-lg w-full max-w-md">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-medium">Select Date</h3>
          <p className="text-sm text-muted-foreground">
            Click to select a date
          </p>
        </div>
        <Calendar className="h-5 w-5 text-muted-foreground" />
      </div>

      <div className="border rounded-md p-4 mb-4">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-1">
            <span className="text-lg font-medium">
              {isYearPickerOpen ? "Select Year" : currentDate.format('MMMM YYYY')}
            </span>
            {!isYearPickerOpen && (
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleYearPicker}
                className="h-6 w-6 rounded-full"
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
            )}
          </div>
          <div className="flex items-center space-x-1">
            {!isYearPickerOpen && (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handlePrevMonth}
                  className="h-7 w-7 rounded-full"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleNextMonth}
                  className="h-7 w-7 rounded-full"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={goToToday}
              className="text-xs h-7 px-2"
            >
              Today
            </Button>
          </div>
        </div>

        {isYearPickerOpen ? (
          <ScrollArea className="h-[240px] rounded-md">
            <div className="grid grid-cols-4 gap-1">
              {years.map((year) => (
                <Button
                  key={year}
                  variant={currentDate.year() === year ? "default" : "ghost"}
                  onClick={() => handleYearChange(year)}
                  className="text-center py-1.5"
                >
                  {year}
                </Button>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className={cn(
            "transition-opacity duration-150",
            viewTransition === 'out' && "opacity-0",
            viewTransition === 'in' && "opacity-100"
          )}>
            <div className="grid grid-cols-7 gap-1 text-center mb-1">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day) => (
                <div key={day} className="text-xs text-muted-foreground h-9 flex items-center justify-center">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {renderDays()}
            </div>
          </div>
        )}
      </div>

      <div className="p-3 bg-muted/40 rounded-md mb-4">
        <h4 className="text-sm font-medium mb-1">Selected Date</h4>
        <p className="text-xl font-semibold">
          {selectedDateValue.format('ddd, MMM D, YYYY')}
        </p>
      </div>

      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          onClick={onCloseDialog}
        >
          <X className="h-4 w-4 mr-2" />
          Cancel
        </Button>
        <Button onClick={handleAccept}>
          <Check className="h-4 w-4 mr-2" />
          Confirm
        </Button>
      </div>
    </div>
  );
};

export default CustomDatePicker;
