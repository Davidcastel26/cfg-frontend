import { useEffect, useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { useAppDispatch, useAppSelector } from '../store';
import { suppliersActions } from '../slices/suppliersSlice';
import type { Catalog } from '../types/domain';
import { PageHeader } from '../components/PageHeader';
import { DataTable } from '../components/DataTable';
import { Pagination } from '../components/Pagination';
import { Modal } from '../components/Modal';
import { ConfirmDialog } from '../components/ConfirmDialog';

export function SuppliersPage() {
  const dispatch = useAppDispatch();
  const { items, pagination, page, search, status } = useAppSelector(
    (s) => s.suppliers,
  );

  const [pendingDelete, setPendingDelete] = useState<Catalog | null>(null);

  useEffect(() => {
    dispatch(suppliersActions.fetchListRequested(undefined));
  }, [dispatch]);

  const columns: ColumnDef<Catalog>[] = [
    { header: 'Código', accessorKey: 'code' },
    { header: 'Nombre', accessorKey: 'name' },
    {
      header: '',
      id: 'actions',
      cell: ({ row }) => (
        <div className="flex justify-end gap-1">
          <button
            className="btn-ghost"
            onClick={() =>
              dispatch(suppliersActions.formOpened({ mode: 'edit', draft: row.original }))
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
        title="Proveedores"
        description="Catálogo de proveedores"
        actions={
          <button
            className="btn-primary"
            onClick={() =>
              dispatch(suppliersActions.formOpened({ mode: 'create', draft: null }))
            }
          >
            + Nuevo proveedor
          </button>
        }
      />

      <div className="mb-3 max-w-sm">
        <input
          className="input"
          placeholder="Buscar por código o nombre…"
          value={search}
          onChange={(e) => dispatch(suppliersActions.searchChanged(e.target.value))}
        />
      </div>

      <DataTable
        data={items}
        columns={columns}
        loading={status === 'loading'}
        emptyMessage="Sin proveedores"
      />
      <div className="mt-3">
        <Pagination
          page={page}
          totalPages={pagination.totalPages}
          onChange={(p) => dispatch(suppliersActions.pageChanged(p))}
        />
      </div>

      <SupplierFormModal />
      <ConfirmDialog
        open={!!pendingDelete}
        title="Eliminar proveedor"
        message={`¿Eliminar "${pendingDelete?.name}"? Si tiene tickets asociados la operación será rechazada.`}
        onConfirm={() => pendingDelete && dispatch(suppliersActions.deleteRequested(pendingDelete.id))}
        onClose={() => setPendingDelete(null)}
      />
    </>
  );
}

function SupplierFormModal() {
  const dispatch = useAppDispatch();
  const form = useAppSelector((s) => s.suppliers.form);
  const isOpen = form.mode !== 'idle';

  const [code, setCode] = useState('');
  const [name, setName] = useState('');

  useEffect(() => {
    if (form.mode === 'edit' && form.draft) {
      setCode(form.draft.code);
      setName(form.draft.name);
    } else if (form.mode === 'create') {
      setCode('');
      setName('');
    }
  }, [form.mode, form.draft]);

  const close = () => dispatch(suppliersActions.formClosed());
  const submit = () => {
    if (!code.trim() || !name.trim()) return;
    if (form.mode === 'edit' && form.draft) {
      dispatch(
        suppliersActions.updateRequested({
          id: form.draft.id,
          body: { code: code.trim(), name: name.trim() },
        }),
      );
    } else {
      dispatch(suppliersActions.createRequested({ code: code.trim(), name: name.trim() }));
    }
  };

  return (
    <Modal
      open={isOpen}
      onClose={close}
      title={form.mode === 'edit' ? 'Editar proveedor' : 'Nuevo proveedor'}
      footer={
        <>
          <button className="btn-secondary" onClick={close} disabled={form.saving}>
            Cancelar
          </button>
          <button className="btn-primary" onClick={submit} disabled={form.saving}>
            {form.saving ? 'Guardando…' : 'Guardar'}
          </button>
        </>
      }
    >
      {form.error && (
        <div className="mb-3 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {form.error}
        </div>
      )}
      <div className="space-y-3">
        <div>
          <label className="label">Código</label>
          <input className="input" value={code} onChange={(e) => setCode(e.target.value)} />
        </div>
        <div>
          <label className="label">Nombre</label>
          <input className="input" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
      </div>
    </Modal>
  );
}
