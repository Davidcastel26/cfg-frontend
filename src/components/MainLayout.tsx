import { NavLink, Outlet } from 'react-router-dom';
import { Toasts } from './Toasts';

const nav = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/tickets', label: 'Tickets' },
  { to: '/suppliers', label: 'Proveedores' },
  { to: '/lands', label: 'Terrenos' },
  { to: '/products', label: 'Productos' },
  { to: '/payments', label: 'Pagos semanales' },
  { to: '/import', label: 'Importar Excel' },
];

export function MainLayout() {
  return (
    <div className="flex h-full">
      <aside className="flex w-60 flex-col border-r border-slate-200 bg-white">
        <div className="px-5 py-4 border-b border-slate-200">
          <h1 className="text-lg font-semibold text-slate-900">CFG · Admin</h1>
          <p className="text-xs text-slate-500">Prueba técnica</p>
        </div>
        <nav className="flex-1 px-2 py-3">
          {nav.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.end}
              className={({ isActive }) =>
                `block rounded-md px-3 py-2 text-sm transition-colors ${
                  isActive
                    ? 'bg-brand-50 text-brand-700 font-medium'
                    : 'text-slate-600 hover:bg-slate-100'
                }`
              }
            >
              {n.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <Outlet />
        </div>
      </main>

      <Toasts />
    </div>
  );
}
