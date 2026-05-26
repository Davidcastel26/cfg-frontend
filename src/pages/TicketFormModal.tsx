import { useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { ticketsActions } from '../slices/ticketsSlice';
import { suppliersActions } from '../slices/suppliersSlice';
import { landsSlice, productsSlice } from '../slices/catalogReadSlice';
import { Modal } from '../components/Modal';
import { formatMoney } from '../components/format';
import type { TicketItemInput } from '../types/domain';

interface DraftItem extends TicketItemInput {
  uid: string;
}

const blankItem = (): DraftItem => ({
  uid: crypto.randomUUID(),
  productId: 0,
  landId: 0,
  totalQty: 0,
  price: '',
});

export function TicketFormModal() {
  const dispatch = useAppDispatch();
  const form = useAppSelector((s) => s.tickets.form);
  const suppliers = useAppSelector((s) => s.suppliers.items);
  const lands = useAppSelector((s) => s.lands.items);
  const products = useAppSelector((s) => s.products.items);

  const isOpen = form.mode !== 'idle';
  const isEdit = form.mode === 'edit';

  const [code, setCode] = useState('');
  const [date, setDate] = useState('');
  const [supplierId, setSupplierId] = useState<number>(0);
  const [items, setItems] = useState<DraftItem[]>([blankItem()]);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    dispatch(suppliersActions.fetchListRequested(undefined));
    dispatch(landsSlice.actions.fetchListRequested(undefined));
    dispatch(productsSlice.actions.fetchListRequested(undefined));
  }, [isOpen, dispatch]);

  useEffect(() => {
    setSubmitted(false);
    if (isEdit && form.draft) {
      setCode(form.draft.code);
      setDate(form.draft.date);
      setSupplierId(form.draft.supplierId);
      setItems(
        form.draft.items.map((i) => ({
          uid: crypto.randomUUID(),
          productId: i.productId,
          landId: i.landId,
          totalQty: i.totalQty,
          price: i.price,
        })),
      );
    } else if (form.mode === 'create') {
      setCode('');
      setDate(new Date().toISOString().slice(0, 10));
      setSupplierId(0);
      setItems([blankItem()]);
    }
  }, [form.mode, form.draft, isEdit]);

  const grandTotal = useMemo(
    () =>
      items.reduce((acc, i) => {
        const price = Number(i.price) || 0;
        return acc + price * (i.totalQty || 0);
      }, 0),
    [items],
  );

  const setItem = (uid: string, patch: Partial<DraftItem>) => {
    setItems((cur) => cur.map((i) => (i.uid === uid ? { ...i, ...patch } : i)));
  };

  const close = () => dispatch(ticketsActions.formClosed());

  const submit = () => {
    setSubmitted(true);
    if (!code.trim() || !date || !supplierId || items.length === 0) return;
    if (items.some((i) => !i.productId || !i.landId || !i.totalQty || !i.price)) return;

    const payload = {
      code: code.trim(),
      date,
      supplierId,
      items: items.map((i) => ({
        productId: i.productId,
        landId: i.landId,
        totalQty: Number(i.totalQty),
        price: i.price,
      })),
    };

    if (isEdit && form.draft) {
      dispatch(ticketsActions.updateRequested({ id: form.draft.id, input: payload }));
    } else {
      dispatch(ticketsActions.createRequested(payload));
    }
  };

  return (
    <Modal
      open={isOpen}
      onClose={close}
      title={isEdit ? `Editar ticket ${form.draft?.code ?? ''}` : 'Nuevo ticket'}
      size="xl"
      footer={
        <>
          <div className="mr-auto text-sm text-slate-600">
            Total: <span className="font-semibold text-slate-900">{formatMoney(grandTotal)}</span>
          </div>
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

      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="label">Código</label>
          <input
            className="input"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            disabled={isEdit}
          />
        </div>
        <div>
          <label className="label">Fecha</label>
          <input
            className="input"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div>
          <label className="label">Proveedor</label>
          <select
            className="input"
            value={supplierId}
            onChange={(e) => setSupplierId(Number(e.target.value))}
          >
            <option value={0}>— Seleccionar —</option>
            {suppliers.map((s) => (
              <option key={s.id} value={s.id}>
                {s.code} · {s.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-700">Líneas</h3>
          <button
            className="btn-secondary"
            onClick={() => setItems((cur) => [...cur, blankItem()])}
          >
            + Agregar línea
          </button>
        </div>

        <div className="card overflow-hidden">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-2 py-2 text-left">Producto</th>
                <th className="px-2 py-2 text-left">Terreno</th>
                <th className="px-2 py-2 text-right">Cantidad</th>
                <th className="px-2 py-2 text-right">Precio</th>
                <th className="px-2 py-2 text-right">Total</th>
                <th className="px-2 py-2" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((it) => {
                const lineTotal = (Number(it.price) || 0) * (it.totalQty || 0);
                const invalid =
                  submitted && (!it.productId || !it.landId || !it.totalQty || !it.price);
                return (
                  <tr key={it.uid} className={invalid ? 'bg-red-50' : ''}>
                    <td className="px-2 py-1.5">
                      <select
                        className="input"
                        value={it.productId}
                        onChange={(e) =>
                          setItem(it.uid, { productId: Number(e.target.value) })
                        }
                      >
                        <option value={0}>—</option>
                        {products.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.code} · {p.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-2 py-1.5">
                      <select
                        className="input"
                        value={it.landId}
                        onChange={(e) => setItem(it.uid, { landId: Number(e.target.value) })}
                      >
                        <option value={0}>—</option>
                        {lands.map((l) => (
                          <option key={l.id} value={l.id}>
                            {l.code} · {l.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-2 py-1.5">
                      <input
                        type="number"
                        min={0}
                        className="input text-right"
                        value={it.totalQty || ''}
                        onChange={(e) =>
                          setItem(it.uid, { totalQty: Number(e.target.value) })
                        }
                      />
                    </td>
                    <td className="px-2 py-1.5">
                      <input
                        type="number"
                        min={0}
                        step="0.0001"
                        className="input text-right"
                        value={it.price}
                        onChange={(e) => setItem(it.uid, { price: e.target.value })}
                      />
                    </td>
                    <td className="px-2 py-1.5 text-right text-slate-700">
                      {formatMoney(lineTotal)}
                    </td>
                    <td className="px-2 py-1.5 text-right">
                      <button
                        className="btn-ghost text-red-600"
                        onClick={() =>
                          setItems((cur) =>
                            cur.length > 1 ? cur.filter((x) => x.uid !== it.uid) : cur,
                          )
                        }
                        disabled={items.length === 1}
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </Modal>
  );
}
