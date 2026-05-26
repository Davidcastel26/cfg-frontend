import { createBrowserRouter, Navigate } from 'react-router-dom';
import { MainLayout } from './components/MainLayout';
import { DashboardPage } from './pages/DashboardPage';
import { TicketsPage } from './pages/TicketsPage';
import { TicketDetailPage } from './pages/TicketDetailPage';
import { SuppliersPage } from './pages/SuppliersPage';
import { CatalogReadPage } from './pages/CatalogReadPage';
import { WeeklyPaymentsPage } from './pages/WeeklyPaymentsPage';
import { ImportPage } from './pages/ImportPage';
import { NotFoundPage } from './pages/NotFoundPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'tickets', element: <TicketsPage /> },
      { path: 'tickets/:id', element: <TicketDetailPage /> },
      { path: 'suppliers', element: <SuppliersPage /> },
      { path: 'lands', element: <CatalogReadPage kind="lands" /> },
      { path: 'products', element: <CatalogReadPage kind="products" /> },
      { path: 'payments', element: <WeeklyPaymentsPage /> },
      { path: 'payments/weekly', element: <Navigate to="/payments" replace /> },
      { path: 'import', element: <ImportPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
