import { useEffect } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { useAppDispatch, useAppSelector } from '../store';
import { landsSlice, productsSlice } from '../slices/catalogReadSlice';
import type { Catalog } from '../types/domain';
import { PageHeader } from '../components/PageHeader';
import { DataTable } from '../components/DataTable';
import { Pagination } from '../components/Pagination';

type Key = 'lands' | 'products';

const labels: Record<Key, { title: string; description: string }> = {
  lands: { title: 'Terrenos', description: 'Catálogo de terrenos (solo lectura)' },
  products: { title: 'Productos', description: 'Catálogo de productos (solo lectura)' },
};

const slices = { lands: landsSlice, products: productsSlice };

export function CatalogReadPage({ kind }: { kind: Key }) {
  const dispatch = useAppDispatch();
  const slice = slices[kind];
  const state = useAppSelector((s) => s[kind]);

  useEffect(() => {
    dispatch(slice.actions.fetchListRequested(undefined));
  }, [dispatch, slice]);

  const columns: ColumnDef<Catalog>[] = [
    { header: 'Código', accessorKey: 'code' },
    { header: 'Nombre', accessorKey: 'name' },
  ];

  return (
    <>
      <PageHeader title={labels[kind].title} description={labels[kind].description} />

      <div className="mb-3 max-w-sm">
        <input
          className="input"
          placeholder="Buscar…"
          value={state.search}
          onChange={(e) => dispatch(slice.actions.searchChanged(e.target.value))}
        />
      </div>

      <DataTable
        data={state.items}
        columns={columns}
        loading={state.status === 'loading'}
        emptyMessage="Sin registros"
      />
      <div className="mt-3">
        <Pagination
          page={state.page}
          totalPages={state.pagination.totalPages}
          onChange={(p) => dispatch(slice.actions.pageChanged(p))}
        />
      </div>
    </>
  );
}
