export function formatEventDate(dateString: string): string {
  const date = new Date(dateString);
  
  // Format: "Oct 25" or "Today" if it's today
  const today = new Date();
  const isToday = date.getDate() === today.getDate() && 
                 date.getMonth() === today.getMonth() && 
                 date.getFullYear() === today.getFullYear();
  
  if (isToday) {
    return 'Today';
  }
  
  // Format month and day
  const month = date.toLocaleString('default', { month: 'short' });
  const day = date.getDate();
  
  return `${month} ${day}`;
}

export function formatEventTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString('default', { hour: '2-digit', minute: '2-digit' });
}

export function formatFullEventDate(startDate: string, endDate: string): string {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  const startMonth = start.toLocaleString('default', { month: 'short' });
  const startDay = start.getDate();
  const startYear = start.getFullYear();
  
  // If same day event
  if (start.getDate() === end.getDate() && 
      start.getMonth() === end.getMonth() && 
      start.getFullYear() === end.getFullYear()) {
    const startTime = start.toLocaleTimeString('default', { hour: '2-digit', minute: '2-digit' });
    const endTime = end.toLocaleTimeString('default', { hour: '2-digit', minute: '2-digit' });
    return `${startMonth} ${startDay}, ${startYear} · ${startTime} - ${endTime}`;
  }
  
  // Multi-day event
  const endMonth = end.toLocaleString('default', { month: 'short' });
  const endDay = end.getDate();
  const endYear = end.getFullYear();
  
  // If same year
  if (startYear === endYear) {
    return `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${startYear}`;
  }
  
  // Different years
  return `${startMonth} ${startDay}, ${startYear} - ${endMonth} ${endDay}, ${endYear}`;
}