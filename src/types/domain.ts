export interface CatalogRef {
  id: number;
  code: string;
  name: string;
}

export interface Catalog {
  id: number;
  code: string;
  name: string;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface TicketItem {
  id: number;
  productId: number;
  landId: number;
  product: CatalogRef | null;
  land: CatalogRef | null;
  totalQty: number;
  price: string;
  total: string;
  totalCalculated: boolean;
}

export interface Ticket {
  id: number;
  code: string;
  date: string;
  supplierId: number;
  supplier: CatalogRef | null;
  isoYear: number;
  isoWeek: number;
  total: string;
  items: TicketItem[];
}

export interface Pagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface Paginated<T> {
  data: T[];
  pagination: Pagination;
}

export interface TicketFilters {
  page?: number;
  pageSize?: number;
  supplierId?: number;
  productId?: number;
  landId?: number;
  dateFrom?: string;
  dateTo?: string;
  code?: string;
  sortBy?: 'date' | 'code' | 'createdAt';
  sortOrder?: 'ASC' | 'DESC';
}

export interface TicketItemInput {
  productId: number;
  landId: number;
  totalQty: number;
  price: number | string;
}

export interface TicketInput {
  code: string;
  date: string;
  supplierId: number;
  items: TicketItemInput[];
}

export interface WeeklyItem {
  id: number;
  product: { code: string; name: string };
  land: { code: string; name: string };
  totalQty: number;
  price: string;
  total: string;
}
export interface WeeklyTicket {
  id: number;
  code: string;
  date: string;
  total: string;
  items: WeeklyItem[];
}
export interface WeeklySupplier {
  supplier: { id: number; code: string; name: string };
  subtotal: string;
  ticketCount: number;
  itemCount: number;
  tickets: WeeklyTicket[];
}
export interface WeeklySummary {
  isoYear: number;
  isoWeek: number;
  weekStart: string;
  weekEnd: string;
  totals: { ticketCount: number; itemCount: number; grandTotal: string; supplierCount: number };
  suppliers: WeeklySupplier[];
}

export interface WeekEntry {
  isoYear: number;
  isoWeek: number;
  ticketCount: number;
  weekStart: string;
  weekEnd: string;
}

export interface ImportResult {
  sheetName: string;
  totalRows: number;
  created: number;
  updated: number;
  skipped: number;
  errors: Array<{ rowNumber: number; message: string }>;
}

export interface ApiError {
  status: number;
  message: string;
  details?: unknown;
}
