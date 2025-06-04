export type RentPeriod = 'HOURLY' | 'DAILY' | 'WEEKLY' | 'MONTHLY';

export function calculateRentalTotal(
  fromDate: Date | string | null,
  toDate: Date | string | null,
  rentPrice: number,
  rentPeriod: RentPeriod,
): number {
  try {
    if (!fromDate || !toDate) return 0;

    const start = typeof fromDate === 'string' ? new Date(fromDate) : fromDate;
    const end = typeof toDate === 'string' ? new Date(toDate) : toDate;

    if (isNaN(start.getTime()) || isNaN(end.getTime())) return 0;

    const diffMs = end.getTime() - start.getTime();
    if (diffMs <= 0) return 0;

    const oneHour = 1000 * 60 * 60;
    const oneDay = oneHour * 24;
    const oneWeek = oneDay * 7;
    const oneMonth = oneDay * 30;

    let units = 1;

    switch (rentPeriod) {
      case 'HOURLY':
        units = Math.max(1, Math.ceil(diffMs / oneHour));
        break;
      case 'DAILY':
        units = Math.max(1, Math.ceil(diffMs / oneDay));
        break;
      case 'WEEKLY':
        units = Math.max(1, Math.ceil(diffMs / oneWeek));
        break;
      case 'MONTHLY':
        units = Math.max(1, Math.ceil(diffMs / oneMonth));
        break;
    }

    return parseFloat((units * rentPrice).toFixed(2));
  } catch (err) {
    console.error('Error calculating rental total:', err);
    return 0;
  }
}
