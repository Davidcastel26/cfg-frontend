import { api } from './client';
import type { Paginated, Ticket, TicketFilters, TicketInput } from '../types/domain';

function cleanParams(f: TicketFilters): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(f)) {
    if (v !== undefined && v !== null && v !== '') out[k] = v;
  }
  return out;
}

export const ticketsApi = {
  list: (filters: TicketFilters) =>
    api.get<Paginated<Ticket>>('/tickets', { params: cleanParams(filters) }).then((r) => r.data),

  getById: (id: number) => api.get<Ticket>(`/tickets/${id}`).then((r) => r.data),

  create: (body: TicketInput) => api.post<Ticket>('/tickets', body).then((r) => r.data),

  replace: (id: number, body: TicketInput) =>
    api.put<Ticket>(`/tickets/${id}`, body).then((r) => r.data),

  remove: (id: number) => api.delete<void>(`/tickets/${id}`).then((r) => r.data),
};
