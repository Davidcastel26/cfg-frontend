import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <p className="text-5xl font-semibold text-slate-300">404</p>
      <p className="mt-3 text-slate-600">Página no encontrada.</p>
      <Link to="/" className="btn-primary mt-5">
        Volver al inicio
      </Link>
    </div>
  );
}
