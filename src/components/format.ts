const moneyFmt = new Intl.NumberFormat('es-GT', {
  style: 'currency',
  currency: 'GTQ',
  minimumFractionDigits: 2,
});

export function formatMoney(value: string | number | null | undefined): string {
  if (value == null) return '';
  const n = typeof value === 'string' ? Number(value) : value;
  if (!Number.isFinite(n)) return String(value);
  return moneyFmt.format(n);
}

export function formatQty(value: number): string {
  return new Intl.NumberFormat('es-GT').format(value);
}

export function formatDate(iso: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat('es-GT', { dateStyle: 'medium' }).format(d);
}
