'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

export default function DashboardRedirectPage() {
  const router = useRouter();
  const { user, isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated || !user) {
      router.replace('/auth/login?redirect=/dashboard');
      return;
    }

    if (user.role === 'admin') {
      router.replace('/admin-portal');
    } else if (user.role === 'seller') {
      router.replace('/seller/dashboard');
    } else {
      router.replace('/buyer/dashboard');
    }
  }, [user, isAuthenticated, loading, router]);

  return (
    <div className="container py-5 text-center" style={{ minHeight: '60vh' }}>
      <div className="spinner-border text-warning" role="status">
        <span className="visually-hidden">Routing to your workspace...</span>
      </div>
      <p className="text-muted small mt-3">Connecting to your personalized portal...</p>
    </div>
  );
}
