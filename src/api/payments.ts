import { api } from './client';
import type { WeekEntry, WeeklySummary } from '../types/domain';

export const paymentsApi = {
  weekly: (isoYear: number, isoWeek: number) =>
    api.get<WeeklySummary>('/payments/weekly', { params: { isoYear, isoWeek } }).then((r) => r.data),

  weeks: (from?: string, to?: string) =>
    api
      .get<WeekEntry[]>('/payments/weeks', { params: { from, to } })
      .then((r) => r.data),
};
