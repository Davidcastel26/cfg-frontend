import { useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store';
import { paymentsActions } from '../slices/paymentsSlice';
import { PageHeader } from '../components/PageHeader';
import { formatDate, formatMoney, formatQty } from '../components/format';
import type { WeeklySupplier } from '../types/domain';

export function WeeklyPaymentsPage() {
  const dispatch = useAppDispatch();
  const [params, setParams] = useSearchParams();
  const { weeks, weeksStatus, summary, summaryStatus, expandedSuppliers, selectedWeek } =
    useAppSelector((s) => s.payments);

  useEffect(() => {
    if (weeksStatus === 'idle') dispatch(paymentsActions.weeksRequested());
  }, [dispatch, weeksStatus]);

  const urlYear = Number(params.get('isoYear'));
  const urlWeek = Number(params.get('isoWeek'));

  useEffect(() => {
    if (weeksStatus !== 'succeeded' || weeks.length === 0) return;
    const target =
      urlYear && urlWeek
        ? { isoYear: urlYear, isoWeek: urlWeek }
        : { isoYear: weeks[weeks.length - 1].isoYear, isoWeek: weeks[weeks.length - 1].isoWeek };

    if (
      !selectedWeek ||
      selectedWeek.isoYear !== target.isoYear ||
      selectedWeek.isoWeek !== target.isoWeek
    ) {
      dispatch(paymentsActions.weekSelected(target));
      setParams(
        { isoYear: String(target.isoYear), isoWeek: String(target.isoWeek) },
        { replace: true },
      );
    }
  }, [weeksStatus, weeks, urlYear, urlWeek, selectedWeek, dispatch, setParams]);

  const selectWeek = (isoYear: number, isoWeek: number) => {
    dispatch(paymentsActions.weekSelected({ isoYear, isoWeek }));
    setParams({ isoYear: String(isoYear), isoWeek: String(isoWeek) });
  };

  const weekKey = useMemo(
    () => (selectedWeek ? `${selectedWeek.isoYear}-${selectedWeek.isoWeek}` : ''),
    [selectedWeek],
  );

  return (
    <>
      <PageHeader
        title="Pagos semanales"
        description="Resumen agregado por semana ISO con desglose por proveedor."
      />

      <div className="card mb-4 p-4">
        {weeksStatus === 'loading' && <p className="text-sm text-slate-500">Cargando semanas…</p>}
        {weeksStatus === 'succeeded' && weeks.length === 0 && (
          <p className="text-sm text-slate-500">No hay semanas con datos.</p>
        )}
        {weeksStatus === 'succeeded' && weeks.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {weeks.map((w) => {
              const active = `${w.isoYear}-${w.isoWeek}` === weekKey;
              return (
                <button
                  key={`${w.isoYear}-${w.isoWeek}`}
                  onClick={() => selectWeek(w.isoYear, w.isoWeek)}
                  className={`rounded-md border px-3 py-1.5 text-xs font-medium transition-colors ${
                    active
                      ? 'border-brand-500 bg-brand-50 text-brand-700'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                  title={`${formatDate(w.weekStart)} — ${formatDate(w.weekEnd)} · ${w.ticketCount} tickets`}
                >
                  {w.isoYear} · W{String(w.isoWeek).padStart(2, '0')}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {summaryStatus === 'loading' && (
        <p className="text-sm text-slate-500">Cargando resumen…</p>
      )}

      {summaryStatus === 'succeeded' && summary && (
        <>
          <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-4">
            <KpiCard label="Tickets" value={summary.totals.ticketCount} />
            <KpiCard label="Líneas" value={summary.totals.itemCount} />
            <KpiCard label="Proveedores" value={summary.totals.supplierCount} />
            <KpiCard
              label="Total"
              value={formatMoney(summary.totals.grandTotal)}
              accent
            />
          </div>
          <p className="mb-3 text-sm text-slate-500">
            Semana {summary.isoYear}-W{String(summary.isoWeek).padStart(2, '0')} ·{' '}
            {formatDate(summary.weekStart)} — {formatDate(summary.weekEnd)}
          </p>

          <div className="space-y-3">
            {summary.suppliers.map((s) => (
              <SupplierCard
                key={s.supplier.id}
                supplier={s}
                expanded={!!expandedSuppliers[s.supplier.id]}
                onToggle={() => dispatch(paymentsActions.supplierToggled(s.supplier.id))}
              />
            ))}
            {summary.suppliers.length === 0 && (
              <div className="card p-8 text-center text-slate-500">
                Sin pagos para esta semana.
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}

function KpiCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: string | number;
  accent?: boolean;
}) {
  return (
    <div className="card p-4">
      <p className="text-xs uppercase text-slate-500">{label}</p>
      <p
        className={`mt-1 text-2xl font-semibold ${accent ? 'text-brand-700' : 'text-slate-900'}`}
      >
        {value}
      </p>
    </div>
  );
}

function SupplierCard({
  supplier,
  expanded,
  onToggle,
}: {
  supplier: WeeklySupplier;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="card overflow-hidden">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-slate-50"
      >
        <div>
          <p className="font-semibold text-slate-900">{supplier.supplier.name}</p>
          <p className="text-xs text-slate-500">
            {supplier.supplier.code} · {supplier.ticketCount} tickets · {supplier.itemCount}{' '}
            líneas
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-lg font-semibold text-slate-900">
            {formatMoney(supplier.subtotal)}
          </span>
          <span className="text-slate-400">{expanded ? '▾' : '▸'}</span>
        </div>
      </button>

      {expanded && (
        <div className="border-t border-slate-200 bg-slate-50/40 px-4 py-3">
          {supplier.tickets.map((t) => (
            <div key={t.id} className="mb-3 last:mb-0">
              <div className="flex justify-between text-sm font-medium text-slate-700">
                <span>
                  Ticket {t.code} · {formatDate(t.date)}
                </span>
                <span>{formatMoney(t.total)}</span>
              </div>
              <table className="mt-1 w-full text-xs text-slate-600">
                <tbody>
                  {t.items.map((i) => (
                    <tr key={i.id}>
                      <td className="py-1">
                        {i.product.code} · {i.product.name}
                      </td>
                      <td className="py-1">{i.land.code}</td>
                      <td className="py-1 text-right">{formatQty(i.totalQty)}</td>
                      <td className="py-1 text-right">{formatMoney(i.price)}</td>
                      <td className="py-1 text-right font-medium text-slate-800">
                        {formatMoney(i.total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
