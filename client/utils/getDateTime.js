import { formatTime } from './formatters'

export function getTodaysDay() {
  const everyHolidays = [
    "0101", "0301", "0501", "0505", "0606",
    "0717", "0815", "1003", "1009", "1225"
  ];

  const specialHolidays = [
    "20260525", "20260603", "20260817",
    "20260924", "20260925", "20260926", "20261005"
  ];

  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const date = String(today.getDate()).padStart(2, "0");
  const dayOfWeek = today.getDay();

  if (everyHolidays.includes(month + date)) return "일요일/공휴일";
  if (specialHolidays.includes(`${year}${month}${date}`)) return "일요일/공휴일";
  if (dayOfWeek === 0) return "일요일/공휴일";
  if (dayOfWeek === 6) return "토요일";
  return "평일";
}

export function getTodayOperationTime(locker) {
  const todaysDay = getTodaysDay();

  if (todaysDay === "평일") {
    const ikil = 
      Number(locker.wkdyOperBgngTm.slice(0, 2)) > Number(locker.wkdyOperEndTm.slice(0, 2)) ? "익일 " : ""
    return {
      label: "평일",
      start: formatTime(locker.wkdyOperBgngTm),
      end: ikil + formatTime(locker.wkdyOperEndTm),
    };
  }

  if (todaysDay === "토요일") {
    const ikil = 
      Number(locker.satOperBgngTm.slice(0, 2)) > Number(locker.satOperEndTm.slice(0, 2)) ? "익일 " : ""
    return {
      label: "토요일",
      start: formatTime(locker.satOperBgngTm),
      end: ikil + formatTime(locker.satOperEndTm),
    };
  }

  const ikil = 
      Number(locker.lhldyOperBgngTm.slice(0, 2)) > Number(locker.lhldyOperEndTm.slice(0, 2)) ? "익일 " : ""
  return {
    label: "일요일/공휴일",
    start: formatTime(locker.lhldyOperBgngTm),
    end: ikil + formatTime(locker.lhldyOperEndTm),
  };
}