"use client";

import { useState } from "react";
import { Calendar } from "@/components/ui/client-calendar";
import { useRouter } from "next/navigation";

interface ScheduleCalendarProps {
  defaultDate: Date;
}

export function ScheduleCalendar({ defaultDate }: ScheduleCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    defaultDate,
  );
  const router = useRouter();

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      // Format date as YYYY-MM-DD for URL
      const formattedDate = date.toISOString().split("T")[0];
      // Refresh the page with the new date parameter
      router.push(`/schedule?date=${formattedDate}`);
    }
  };

  return (
    <Calendar
      mode="single"
      selected={selectedDate}
      onSelect={handleDateSelect}
      className="rounded-md border"
    />
  );
}
