import { api } from './client';
import type { Catalog, Paginated } from '../types/domain';

export interface CatalogListParams {
  page?: number;
  pageSize?: number;
  search?: string;
}

function build(path: string) {
  return {
    list: (params: CatalogListParams = {}) =>
      api.get<Paginated<Catalog>>(path, { params }).then((r) => r.data),
    getById: (id: number) => api.get<Catalog>(`${path}/${id}`).then((r) => r.data),
  };
}

export const suppliersApi = {
  ...build('/suppliers'),
  create: (body: { code: string; name: string }) =>
    api.post<Catalog>('/suppliers', body).then((r) => r.data),
  update: (id: number, body: { code?: string; name?: string }) =>
    api.put<Catalog>(`/suppliers/${id}`, body).then((r) => r.data),
  remove: (id: number) => api.delete<void>(`/suppliers/${id}`).then((r) => r.data),
};

export const landsApi = build('/lands');
export const productsApi = build('/products');
