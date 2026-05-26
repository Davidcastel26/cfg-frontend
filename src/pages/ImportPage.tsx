import { useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { importActions } from '../slices/importSlice';
import { PageHeader } from '../components/PageHeader';

export function ImportPage() {
  const dispatch = useAppDispatch();
  const { status, progress, result, error } = useAppSelector((s) => s.import);
  const [drag, setDrag] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const accept = (file: File | undefined) => {
    if (!file) return;
    if (!/\.xlsx?$/i.test(file.name)) {
      alert('Selecciona un archivo .xlsx');
      return;
    }
    dispatch(importActions.uploadRequested(file));
  };

  return (
    <>
      <PageHeader
        title="Importar Excel"
        description="Sube el archivo de tickets para ingerirlo en la base de datos."
        actions={
          status !== 'idle' && (
            <button className="btn-secondary" onClick={() => dispatch(importActions.reset())}>
              Reiniciar
            </button>
          )
        }
      />

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          accept(e.dataTransfer.files?.[0]);
        }}
        className={`card flex flex-col items-center justify-center gap-3 border-2 border-dashed p-12 text-center transition-colors ${
          drag ? 'border-brand-500 bg-brand-50' : 'border-slate-200'
        }`}
      >
        <p className="text-slate-600">Arrastra el archivo .xlsx aquí, o</p>
        <button className="btn-primary" onClick={() => fileRef.current?.click()}>
          Seleccionar archivo
        </button>
        <input
          ref={fileRef}
          type="file"
          accept=".xlsx,.xls"
          hidden
          onChange={(e) => accept(e.target.files?.[0] ?? undefined)}
        />
      </div>

      {status === 'uploading' && (
        <div className="card mt-4 p-4">
          <p className="mb-2 text-sm text-slate-600">Subiendo… {progress}%</p>
          <div className="h-2 w-full overflow-hidden rounded bg-slate-200">
            <div className="h-full bg-brand-500 transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      {status === 'error' && (
        <div className="card mt-4 border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error ?? 'Error al importar'}
        </div>
      )}

      {status === 'success' && result && (
        <div className="card mt-4 p-4">
          <div className="grid grid-cols-4 gap-4 text-center">
            <Metric label="Filas" value={result.totalRows} />
            <Metric label="Creados" value={result.created} tone="success" />
            <Metric label="Actualizados" value={result.updated} tone="info" />
            <Metric label="Omitidos" value={result.skipped} tone="warn" />
          </div>
          {result.errors.length > 0 && (
            <div className="mt-4">
              <h3 className="mb-2 text-sm font-semibold text-slate-700">
                Errores ({result.errors.length})
              </h3>
              <div className="card overflow-hidden">
                <table className="min-w-full text-sm">
                  <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-3 py-2 text-left">Fila</th>
                      <th className="px-3 py-2 text-left">Mensaje</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {result.errors.map((e, idx) => (
                      <tr key={idx}>
                        <td className="px-3 py-2">{e.rowNumber}</td>
                        <td className="px-3 py-2 text-slate-700">{e.message}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}

function Metric({
  label,
  value,
  tone = 'default',
}: {
  label: string;
  value: number;
  tone?: 'default' | 'success' | 'info' | 'warn';
}) {
  const colors = {
    default: 'text-slate-900',
    success: 'text-green-700',
    info: 'text-brand-700',
    warn: 'text-amber-700',
  };
  return (
    <div>
      <p className="text-xs uppercase text-slate-500">{label}</p>
      <p className={`text-2xl font-semibold ${colors[tone]}`}>{value}</p>
    </div>
  );
}
