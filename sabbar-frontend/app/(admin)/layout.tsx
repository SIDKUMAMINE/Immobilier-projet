'use client';

import { AdminProtectedLayout } from '@/components/layout/AdminProtectedLayout';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminProtectedLayout>
      {children}
    </AdminProtectedLayout>
  );
}