import { Navigate } from 'react-router-dom';
import { useAdminStore } from '@/store/adminStore';

interface Props {
  children: React.ReactNode;
}

export function AdminProtectedRoute({ children }: Props) {
  const adminToken = useAdminStore((s) => s.adminToken);
  if (!adminToken) return <Navigate to="/admin/login" replace />;
  return <>{children}</>;
}
