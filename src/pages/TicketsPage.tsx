import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { ColumnDef } from '@tanstack/react-table';
import { useAppDispatch, useAppSelector } from '../store';
import { ticketsActions } from '../slices/ticketsSlice';
import { suppliersActions } from '../slices/suppliersSlice';
import type { Ticket } from '../types/domain';
import { PageHeader } from '../components/PageHeader';
import { DataTable } from '../components/DataTable';
import { Pagination } from '../components/Pagination';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { TicketFormModal } from './TicketFormModal';
import { formatDate, formatMoney } from '../components/format';

export function TicketsPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { items, pagination, filters, status } = useAppSelector((s) => s.tickets);
  const suppliers = useAppSelector((s) => s.suppliers.items);

  const [codeInput, setCodeInput] = useState(filters.code ?? '');
  const [pendingDelete, setPendingDelete] = useState<Ticket | null>(null);

  useEffect(() => {
    dispatch(ticketsActions.fetchListRequested(undefined));
    dispatch(suppliersActions.fetchListRequested(undefined));
  }, [dispatch]);

  useEffect(() => {
    const id = setTimeout(() => {
      if (codeInput !== (filters.code ?? '')) {
        dispatch(ticketsActions.filtersChanged({ code: codeInput || undefined }));
      }
    }, 300);
    return () => clearTimeout(id);
  }, [codeInput, filters.code, dispatch]);

  const columns: ColumnDef<Ticket>[] = [
    { header: 'Código', accessorKey: 'code' },
    {
      header: 'Fecha',
      accessorKey: 'date',
      cell: ({ row }) => formatDate(row.original.date),
    },
    {
      header: 'Proveedor',
      cell: ({ row }) => row.original.supplier?.name ?? '—',
    },
    {
      header: 'Líneas',
      cell: ({ row }) => row.original.items.length,
    },
    {
      header: 'Semana ISO',
      cell: ({ row }) => `${row.original.isoYear}-W${String(row.original.isoWeek).padStart(2, '0')}`,
    },
    {
      header: 'Total',
      cell: ({ row }) => (
        <span className="font-medium text-slate-900">{formatMoney(row.original.total)}</span>
      ),
    },
    {
      header: '',
      id: 'actions',
      cell: ({ row }) => (
        <div className="flex justify-end gap-1" onClick={(e) => e.stopPropagation()}>
          <button
            className="btn-ghost"
            onClick={() =>
              dispatch(ticketsActions.formOpened({ mode: 'edit', draft: row.original }))
            }
          >
            Editar
          </button>
          <button
            className="btn-ghost text-red-600"
            onClick={() => setPendingDelete(row.original)}
          >
            Eliminar
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Tickets"
        description="Registros de tickets con sus líneas"
        actions={
          <>
            <Link to="/import" className="btn-secondary">
              Importar Excel
            </Link>
            <button
              className="btn-primary"
              onClick={() =>
                dispatch(ticketsActions.formOpened({ mode: 'create', draft: null }))
              }
            >
              + Nuevo ticket
            </button>
          </>
        }
      />

      <div className="card mb-4 p-4">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
          <div>
            <label className="label">Código</label>
            <input
              className="input"
              value={codeInput}
              onChange={(e) => setCodeInput(e.target.value)}
              placeholder="Buscar…"
            />
          </div>
          <div>
            <label className="label">Proveedor</label>
            <select
              className="input"
              value={filters.supplierId ?? 0}
              onChange={(e) =>
                dispatch(
                  ticketsActions.filtersChanged({
                    supplierId: Number(e.target.value) || undefined,
                  }),
                )
              }
            >
              <option value={0}>Todos</option>
              {suppliers.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Desde</label>
            <input
              type="date"
              className="input"
              value={filters.dateFrom ?? ''}
              onChange={(e) =>
                dispatch(
                  ticketsActions.filtersChanged({ dateFrom: e.target.value || undefined }),
                )
              }
            />
          </div>
          <div>
            <label className="label">Hasta</label>
            <input
              type="date"
              className="input"
              value={filters.dateTo ?? ''}
              onChange={(e) =>
                dispatch(
                  ticketsActions.filtersChanged({ dateTo: e.target.value || undefined }),
                )
              }
            />
          </div>
          <div className="flex items-end">
            <button
              className="btn-secondary w-full"
              onClick={() => {
                setCodeInput('');
                dispatch(
                  ticketsActions.filtersChanged({
                    code: undefined,
                    supplierId: undefined,
                    dateFrom: undefined,
                    dateTo: undefined,
                  }),
                );
              }}
            >
              Limpiar
            </button>
          </div>
        </div>
      </div>

      <DataTable
        data={items}
        columns={columns}
        loading={status === 'loading'}
        emptyMessage="Sin tickets. Importa un Excel o crea uno nuevo."
        onRowClick={(t) => navigate(`/tickets/${t.id}`)}
      />
      <div className="mt-3 flex items-center justify-between">
        <p className="text-sm text-slate-500">{pagination.total} resultados</p>
        <Pagination
          page={pagination.page}
          totalPages={pagination.totalPages}
          onChange={(p) => dispatch(ticketsActions.pageChanged(p))}
        />
      </div>

      <TicketFormModal />
      <ConfirmDialog
        open={!!pendingDelete}
        title="Eliminar ticket"
        message={`¿Eliminar el ticket ${pendingDelete?.code}? Esta acción no se puede deshacer.`}
        onConfirm={() => pendingDelete && dispatch(ticketsActions.deleteRequested(pendingDelete.id))}
        onClose={() => setPendingDelete(null)}
      />
    </>
  );
}
