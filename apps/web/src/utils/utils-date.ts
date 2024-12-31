export function getDateRanges() {
  const today = new Date();
  const ranges: Record<string, { startDate: Date; endDate: Date }> = {};

  // Bugün
  let startDate = new Date(today.setHours(0, 0, 0, 0)); // Bugün 00:00
  let endDate = new Date(today.setHours(23, 59, 59, 999)); // Bugün 23:59
  ranges.today = { startDate, endDate };

  // Dün
  startDate = new Date(today.setDate(today.getDate() - 1));
  startDate.setHours(0, 0, 0, 0); // Dün 00:00
  endDate = new Date(today.setHours(23, 59, 59, 999)); // Dün 23:59
  ranges.yesterday = { startDate, endDate };

  // Bu Hafta
  const dayOfWeek = today.getDay();
  startDate = new Date(today.setDate(today.getDate() - dayOfWeek)); // Bu haftanın ilk günü (Pazar)
  startDate.setHours(0, 0, 0, 0);
  endDate = new Date(today.setDate(today.getDate() - dayOfWeek + 6)); // Bu haftanın son günü (Cumartesi)
  endDate.setHours(23, 59, 59, 999);
  ranges.thisWeek = { startDate, endDate };

  // Geçen Hafta
  startDate = new Date(today.setDate(today.getDate() - dayOfWeek - 7)); // Geçen hafta başlangıç
  startDate.setHours(0, 0, 0, 0);
  endDate = new Date(today.setDate(today.getDate() - dayOfWeek - 1)); // Geçen hafta bitiş
  endDate.setHours(23, 59, 59, 999);
  ranges.lastWeek = { startDate, endDate };

  // Bu Ay
  startDate = new Date(today.setDate(1)); // Bu ayın ilk günü
  startDate.setHours(0, 0, 0, 0);
  endDate = new Date(today.setMonth(today.getMonth() + 1, 0)); // Bu ayın son günü
  endDate.setHours(23, 59, 59, 999);
  ranges.thisMonth = { startDate, endDate };

  // Geçen Ay
  startDate = new Date(today.setMonth(today.getMonth() - 1, 1)); // Geçen ayın ilk günü
  startDate.setHours(0, 0, 0, 0);
  endDate = new Date(today.setMonth(today.getMonth(), 0)); // Geçen ayın son günü
  endDate.setHours(23, 59, 59, 999);
  ranges.lastMonth = { startDate, endDate };

  // Son 3 Ay
  startDate = new Date(today.setMonth(today.getMonth() - 3)); // Son 3 ay
  startDate.setHours(0, 0, 0, 0);
  endDate = new Date(today.setHours(23, 59, 59, 999)); // Bugün son
  ranges.last3Months = { startDate, endDate };

  // Bu Yıl
  startDate = new Date(today.setMonth(0, 1)); // Bu yılın ilk günü
  startDate.setHours(0, 0, 0, 0);
  endDate = new Date(today.setMonth(11, 31)); // Bu yılın son günü
  endDate.setHours(23, 59, 59, 999);
  ranges.thisYear = { startDate, endDate };

  // Geçen Yıl
  startDate = new Date(today.setFullYear(today.getFullYear() - 1, 0, 1)); // Geçen yılın ilk günü
  startDate.setHours(0, 0, 0, 0);
  endDate = new Date(today.setFullYear(today.getFullYear() - 1, 11, 31)); // Geçen yılın son günü
  endDate.setHours(23, 59, 59, 999);
  ranges.lastYear = { startDate, endDate };

  return { ranges, rangeItems: Object.keys(ranges) };
}
