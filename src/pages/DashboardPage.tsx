import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store';
import { ticketsActions } from '../slices/ticketsSlice';
import { suppliersActions } from '../slices/suppliersSlice';
import { paymentsActions } from '../slices/paymentsSlice';
import { PageHeader } from '../components/PageHeader';
import { formatDate, formatMoney } from '../components/format';

export function DashboardPage() {
  const dispatch = useAppDispatch();
  const tickets = useAppSelector((s) => s.tickets);
  const suppliers = useAppSelector((s) => s.suppliers);
  const payments = useAppSelector((s) => s.payments);

  useEffect(() => {
    dispatch(ticketsActions.fetchListRequested({ page: 1, pageSize: 10 }));
    dispatch(suppliersActions.fetchListRequested(undefined));
    if (payments.weeksStatus === 'idle') dispatch(paymentsActions.weeksRequested());
  }, [dispatch, payments.weeksStatus]);

  useEffect(() => {
    if (payments.weeks.length > 0 && !payments.selectedWeek) {
      const last = payments.weeks[payments.weeks.length - 1];
      dispatch(paymentsActions.weekSelected({ isoYear: last.isoYear, isoWeek: last.isoWeek }));
    }
  }, [payments.weeks, payments.selectedWeek, dispatch]);

  return (
    <>
      <PageHeader title="Dashboard" description="Resumen general" />

      <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        <Card to="/tickets" label="Tickets" value={tickets.pagination.total} />
        <Card to="/suppliers" label="Proveedores" value={suppliers.pagination.total} />
        <Card
          to="/payments"
          label="Semana actual"
          value={
            payments.selectedWeek
              ? `${payments.selectedWeek.isoYear}-W${String(payments.selectedWeek.isoWeek).padStart(2, '0')}`
              : '—'
          }
        />
        <Card
          to="/payments"
          label="Total semana"
          value={payments.summary ? formatMoney(payments.summary.totals.grandTotal) : '—'}
          accent
        />
      </div>

      <div className="card overflow-hidden">
        <header className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
          <h2 className="text-sm font-semibold text-slate-700">Últimos tickets</h2>
          <Link to="/tickets" className="text-sm text-brand-700 hover:underline">
            Ver todos →
          </Link>
        </header>
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-2 text-left">Código</th>
              <th className="px-4 py-2 text-left">Fecha</th>
              <th className="px-4 py-2 text-left">Proveedor</th>
              <th className="px-4 py-2 text-right">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {tickets.items.slice(0, 10).map((t) => (
              <tr key={t.id}>
                <td className="px-4 py-2 font-medium text-slate-900">
                  <Link to={`/tickets/${t.id}`} className="hover:underline">
                    {t.code}
                  </Link>
                </td>
                <td className="px-4 py-2">{formatDate(t.date)}</td>
                <td className="px-4 py-2">{t.supplier?.name ?? '—'}</td>
                <td className="px-4 py-2 text-right">{formatMoney(t.total)}</td>
              </tr>
            ))}
            {tickets.items.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-slate-500">
                  Sin tickets aún.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

function Card({
  to,
  label,
  value,
  accent,
}: {
  to: string;
  label: string;
  value: string | number;
  accent?: boolean;
}) {
  return (
    <Link to={to} className="card p-4 transition-shadow hover:shadow-md">
      <p className="text-xs uppercase text-slate-500">{label}</p>
      <p
        className={`mt-1 text-2xl font-semibold ${accent ? 'text-brand-700' : 'text-slate-900'}`}
      >
        {value}
      </p>
    </Link>
  );
}
