import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store';
import { ticketsActions } from '../slices/ticketsSlice';
import { PageHeader } from '../components/PageHeader';
import { formatDate, formatMoney, formatQty } from '../components/format';

export function TicketDetailPage() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { selected, selectedStatus } = useAppSelector((s) => s.tickets);

  useEffect(() => {
    if (id) dispatch(ticketsActions.fetchByIdRequested(Number(id)));
  }, [id, dispatch]);

  if (selectedStatus === 'loading') return <p className="text-slate-500">Cargando…</p>;
  if (!selected) return <p className="text-slate-500">Ticket no encontrado.</p>;

  return (
    <>
      <PageHeader
        title={`Ticket ${selected.code}`}
        description={`${formatDate(selected.date)} · Semana ISO ${selected.isoYear}-W${String(selected.isoWeek).padStart(2, '0')}`}
        actions={
          <Link to="/tickets" className="btn-secondary">
            ← Volver
          </Link>
        }
      />

      <div className="card mb-5 p-4 grid grid-cols-3 gap-4 text-sm">
        <div>
          <p className="text-xs uppercase text-slate-500">Proveedor</p>
          <p className="font-medium text-slate-900">{selected.supplier?.name ?? '—'}</p>
          <p className="text-xs text-slate-500">{selected.supplier?.code}</p>
        </div>
        <div>
          <p className="text-xs uppercase text-slate-500">Líneas</p>
          <p className="font-medium text-slate-900">{selected.items.length}</p>
        </div>
        <div>
          <p className="text-xs uppercase text-slate-500">Total</p>
          <p className="text-lg font-semibold text-slate-900">{formatMoney(selected.total)}</p>
        </div>
      </div>

      <div className="card overflow-hidden">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-2 text-left">Producto</th>
              <th className="px-4 py-2 text-left">Terreno</th>
              <th className="px-4 py-2 text-right">Cantidad</th>
              <th className="px-4 py-2 text-right">Precio</th>
              <th className="px-4 py-2 text-right">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {selected.items.map((i) => (
              <tr key={i.id}>
                <td className="px-4 py-2">
                  <span className="font-medium text-slate-900">{i.product?.name}</span>
                  <span className="ml-2 text-xs text-slate-500">{i.product?.code}</span>
                </td>
                <td className="px-4 py-2">
                  <span className="font-medium text-slate-900">{i.land?.name}</span>
                  <span className="ml-2 text-xs text-slate-500">{i.land?.code}</span>
                </td>
                <td className="px-4 py-2 text-right">{formatQty(i.totalQty)}</td>
                <td className="px-4 py-2 text-right">{formatMoney(i.price)}</td>
                <td className="px-4 py-2 text-right font-medium text-slate-900">
                  {formatMoney(i.total)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
