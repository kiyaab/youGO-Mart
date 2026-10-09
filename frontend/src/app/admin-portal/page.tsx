'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { useLanguage } from '@/lib/language-context';
import {
  ShieldAlert,
  Users,
  Tag,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Check,
  X,
  Eye,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  Lock,
  ArrowRight,
  LogOut,
  KeyRound,
} from 'lucide-react';

export default function AdminPortalPage() {
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading, login, logout } = useAuth();
  const { language, t } = useLanguage();

  // Admin Login Challenge State
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Admin Dashboard State
  const [activeTab, setActiveTab] = useState<'metrics' | 'listings' | 'verifications' | 'reports' | 'users' | 'orders'>('metrics');
  const [metrics, setMetrics] = useState<any>(null);
  const [pendingListings, setPendingListings] = useState<any[]>([]);
  const [verifications, setVerifications] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [adminOrders, setAdminOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Moderation state
  const [rejectReason, setRejectReason] = useState('Photos do not match description or price is unrealistic.');

  const loadAll = async () => {
    if (!user || user.role !== 'admin') return;
    setLoading(true);
    try {
      const [m, pl, v, r, u, ord] = await Promise.all([
        api.admin.getMetrics().catch(() => null),
        api.admin.getPendingListings().catch(() => []),
        api.admin.getVerifications().catch(() => []),
        api.admin.getReports().catch(() => []),
        api.admin.getUsers().catch(() => []),
        api.orders.getAdminOrders().catch(() => []),
      ]);
      setMetrics(m);
      setPendingListings(pl || []);
      setVerifications(v || []);
      setReports(r || []);
      setUsersList(u || []);
      setAdminOrders(ord || []);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role === 'admin') {
      loadAll();
    }
  }, [user]);

  // Handle Admin Direct Sign In Challenge
  const handleAdminAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setIsAuthenticating(true);
    try {
      await login({ email: adminEmail, password: adminPassword });
      // The auth state will update and trigger re-render
    } catch (err: any) {
      setAuthError(err.message || 'Invalid administrator credentials. Access strictly restricted.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  // STRICT ACCESS CONTROL: Only users with user.role === 'admin' can access!
  if (authLoading) {
    return (
      <div className="container py-5 text-center" style={{ minHeight: '60vh' }}>
        <div className="spinner-border text-danger" role="status">
          <span className="visually-hidden">Verifying credentials...</span>
        </div>
      </div>
    );
  }

  // Not authenticated OR not an administrator
  if (!isAuthenticated || !user || user.role !== 'admin') {
    return (
      <div className="py-5" style={{ backgroundColor: 'var(--bg-main)', minHeight: '80vh' }}>
        <div className="container" style={{ maxWidth: '480px' }}>
          <div className="glass-card p-4 p-md-5 rounded-4 shadow-lg border border-danger border-opacity-25 text-center">
            <div className="d-inline-flex p-3 rounded-circle bg-danger bg-opacity-10 text-danger mb-3">
              <ShieldAlert size={44} />
            </div>

            <h2 className="h4 fw-bold mb-2" style={{ color: 'var(--text-main)' }}>
              Administrator Console
            </h2>
            <p className="text-muted small mb-4" style={{ lineHeight: 1.6 }}>
              Restricted Area. Access is strictly granted to verified platform staff and marketplace administrators.
            </p>

            {/* If currently logged in as a non-admin role (e.g. buyer or seller) */}
            {isAuthenticated && user && user.role !== 'admin' && (
              <div className="alert alert-danger text-start small mb-4 py-2.5">
                <div className="d-flex align-items-center gap-2 fw-bold mb-1">
                  <AlertTriangle size={16} /> Access Denied
                </div>
                You are currently signed in as <strong>{user.email}</strong> ({user.role}). This account does not possess administrator credentials.
                <div className="mt-2 pt-2 border-top border-danger border-opacity-25 d-flex gap-2">
                  <button
                    onClick={() => logout()}
                    className="btn btn-sm btn-outline-danger py-1 px-2.5"
                  >
                    <LogOut size={13} className="me-1 inline" /> Sign Out & Switch
                  </button>
                  <Link
                    href={user.role === 'seller' ? '/seller/dashboard' : '/buyer/dashboard'}
                    className="btn btn-sm btn-neutral py-1 px-2.5"
                  >
                    Go to {user.role === 'seller' ? 'Seller Hub' : 'Buyer Portal'}
                  </Link>
                </div>
              </div>
            )}

            {/* Admin Credential Input Form */}
            {(!isAuthenticated || (user && user.role !== 'admin')) && (
              <form onSubmit={handleAdminAuth} className="text-start">
                {authError && (
                  <div className="alert alert-danger py-2 px-3 small mb-3">
                    {authError}
                  </div>
                )}

                <div className="mb-3">
                  <label className="form-label small fw-bold text-muted">
                    Admin Staff Email
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="admin@yougomart.et"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label small fw-bold text-muted">
                    Security Passkey / Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="••••••••••••"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isAuthenticating}
                  className="btn btn-danger w-100 py-2.5 fw-bold d-flex align-items-center justify-content-center gap-2 rounded-3 shadow-sm"
                >
                  {isAuthenticating ? (
                    <>Verifying Access...</>
                  ) : (
                    <>
                      <KeyRound size={17} /> Verify & Enter Console
                    </>
                  )}
                </button>
              </form>
            )}

            <div className="mt-4 pt-3 border-top text-center">
              <Link href="/" className="small text-muted text-decoration-none hover-orange">
                ← Return to Public Marketplace
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // USER IS VERIFIED ADMIN: Render Full Dashboard!
  const handleModerateListing = async (listingId: number, action: 'approve' | 'reject') => {
    try {
      await api.admin.moderateListing(listingId, action, rejectReason);
      setPendingListings(pendingListings.filter((l) => l.id !== listingId));
      alert(`Listing #${listingId} ${action === 'approve' ? 'approved and made live' : 'rejected'}.`);
    } catch {
      alert('Failed to moderate listing.');
    }
  };

  const handleModerateVerification = async (verifId: number, action: 'approve' | 'reject') => {
    try {
      await api.admin.moderateVerification(verifId, action, 'Approved by admin');
      setVerifications(verifications.filter((v) => v.id !== verifId));
      alert(`Seller verification ${action === 'approve' ? 'approved (badge granted)' : 'rejected'}.`);
    } catch {
      alert('Failed to process verification.');
    }
  };

  const handleResolveReport = async (reportId: number, action: 'remove_listing' | 'dismiss') => {
    try {
      await api.admin.resolveReport(reportId, action, 'Handled by moderator');
      setReports(reports.filter((r) => r.id !== reportId));
      alert(`Report #${reportId} resolved.`);
    } catch {
      alert('Failed to resolve report.');
    }
  };

  const handleToggleUserStatus = async (userId: number) => {
    try {
      const res = await api.admin.toggleUserStatus(userId);
      setUsersList(
        usersList.map((u) => (u.id === userId ? { ...u, is_active: res.is_active } : u))
      );
    } catch {
      alert('Failed to toggle user status.');
    }
  };

  return (
    <div className="py-4" style={{ backgroundColor: 'var(--bg-main)' }}>
      <div className="container">
        {/* Top Header */}
        <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4 pb-3 border-bottom">
          <div className="d-flex align-items-center gap-2">
            <div className="p-2 rounded-3 bg-danger bg-opacity-10 text-danger">
              <ShieldAlert size={26} />
            </div>
            <div>
              <div className="d-flex align-items-center gap-2">
                <h1 className="h3 fw-bold m-0" style={{ letterSpacing: '-0.02em', color: 'var(--text-main)' }}>
                  Admin & Moderation Portal
                </h1>
                <span className="badge bg-danger rounded-pill px-2.5 py-1 small">
                  Staff Verified
                </span>
              </div>
              <p className="text-muted small m-0 mt-0.5">
                Authorized staff workspace for youGO-mart marketplace quality, verifications, and trust across Ethiopia.
              </p>
            </div>
          </div>

          <div className="d-flex align-items-center gap-2">
            <button onClick={loadAll} className="btn btn-neutral btn-sm d-flex align-items-center gap-1">
              <RefreshCw size={14} /> Refresh Data
            </button>
            <Link href="/" className="btn btn-neutral btn-sm">
              Public Marketplace
            </Link>
          </div>
        </div>

        {/* Overview Stat Cards */}
        <div className="row g-3 mb-4">
          <div className="col-6 col-md-3">
            <div className="glass-card p-3 rounded-4">
              <span className="text-muted small fw-semibold">Total Users</span>
              <h3 className="fw-extrabold m-0 mt-1">{metrics?.total_users ?? usersList.length}</h3>
              <span className="text-muted small" style={{ fontSize: '0.75rem' }}>Registered buyers & sellers</span>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="glass-card p-3 rounded-4">
              <span className="text-muted small fw-semibold">Live Listings</span>
              <h3 className="fw-extrabold m-0 mt-1 text-success">{metrics?.active_listings ?? 12}</h3>
              <span className="text-muted small" style={{ fontSize: '0.75rem' }}>0% Commission active</span>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="glass-card p-3 rounded-4">
              <span className="text-muted small fw-semibold">Pending Verifications</span>
              <h3 className="fw-extrabold m-0 mt-1 text-warning">{metrics?.pending_verifications ?? verifications.length}</h3>
              <span className="text-muted small" style={{ fontSize: '0.75rem' }}>Kebele / License review</span>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="glass-card p-3 rounded-4">
              <span className="text-muted small fw-semibold">Open Reports</span>
              <h3 className="fw-extrabold m-0 mt-1 text-danger">{metrics?.open_reports ?? reports.length}</h3>
              <span className="text-muted small" style={{ fontSize: '0.75rem' }}>Flagged by community</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="d-flex align-items-center gap-2 border-bottom mb-4 overflow-x-auto pb-2">
          <button
            className={`btn border-0 py-2 px-3 fw-bold ${
              activeTab === 'metrics' ? 'text-danger border-bottom border-danger border-3' : 'text-muted'
            }`}
            onClick={() => setActiveTab('metrics')}
          >
            Overview & Activity
          </button>
          <button
            className={`btn border-0 py-2 px-3 fw-bold ${
              activeTab === 'verifications' ? 'text-danger border-bottom border-danger border-3' : 'text-muted'
            }`}
            onClick={() => setActiveTab('verifications')}
          >
            Seller Verifications ({verifications.length})
          </button>
          <button
            className={`btn border-0 py-2 px-3 fw-bold ${
              activeTab === 'reports' ? 'text-danger border-bottom border-danger border-3' : 'text-muted'
            }`}
            onClick={() => setActiveTab('reports')}
          >
            Reports & Abuse ({reports.length})
          </button>
          <button
            className={`btn border-0 py-2 px-3 fw-bold ${
              activeTab === 'users' ? 'text-danger border-bottom border-danger border-3' : 'text-muted'
            }`}
            onClick={() => setActiveTab('users')}
          >
            User Accounts ({usersList.length})
          </button>
          <button
            className={`btn border-0 py-2 px-3 fw-bold ${
              activeTab === 'orders' ? 'text-danger border-bottom border-danger border-3' : 'text-muted'
            }`}
            onClick={() => setActiveTab('orders')}
          >
            Order Oversight
          </button>
        </div>

        {/* TAB 1: Overview & Audit Logs */}
        {activeTab === 'metrics' && (
          <div className="glass-card p-4 rounded-4 shadow-sm">
            <h5 className="fw-bold mb-3">Recent Moderation & System Audit Trail</h5>
            <p className="text-muted small mb-4">
              Immutable security record of moderation decisions, verification approvals, and actions.
            </p>

            {metrics?.recent_logs && metrics.recent_logs.length > 0 ? (
              <div className="list-group list-group-flush">
                {metrics.recent_logs.map((log: any) => (
                  <div key={log.id} className="list-group-item px-0 py-3 d-flex align-items-start gap-3">
                    <div className="p-2 rounded bg-light border text-muted">
                      <Clock size={16} />
                    </div>
                    <div>
                      <div className="fw-semibold small">{log.action} on {log.target_type} #{log.target_id}</div>
                      <div className="text-muted small">{log.details}</div>
                      <div className="small text-secondary" style={{ fontSize: '0.72rem' }}>
                        By {log.actor_email || 'System'} • {new Date(log.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-muted small">No audit logs recorded yet.</div>
            )}
          </div>
        )}

        {/* TAB 2: Seller Verifications Queue */}
        {activeTab === 'verifications' && (
          <div className="glass-card p-4 rounded-4 shadow-sm">
            <h5 className="fw-bold mb-3">Pending Seller Verification Applications</h5>
            <p className="text-muted small mb-4">
              Review Ethiopian Kebele ID or Business Registration credentials to grant the Verified Seller badge.
            </p>

            {verifications.length > 0 ? (
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light small text-muted text-uppercase">
                    <tr>
                      <th>Seller Name</th>
                      <th>Document Type</th>
                      <th>Document / TIN</th>
                      <th>Notes</th>
                      <th>Submitted</th>
                      <th className="text-end">Decision</th>
                    </tr>
                  </thead>
                  <tbody>
                    {verifications.map((v) => (
                      <tr key={v.id}>
                        <td className="fw-bold">{v.seller_name}</td>
                        <td><span className="badge bg-light text-dark border">{v.document_type}</span></td>
                        <td><code>{v.document_number || 'N/A'}</code></td>
                        <td className="small text-muted">{v.seller_notes || 'None'}</td>
                        <td className="small text-muted">{new Date(v.created_at).toLocaleDateString()}</td>
                        <td className="text-end">
                          <button
                            className="btn btn-sm btn-success me-2 fw-semibold"
                            onClick={() => handleModerateVerification(v.id, 'approve')}
                          >
                            <Check size={14} /> Approve Badge
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleModerateVerification(v.id, 'reject')}
                          >
                            <X size={14} /> Reject
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-5 text-center text-muted small">
                <CheckCircle2 size={36} className="text-success mb-2" />
                <h6 className="fw-bold text-dark">No pending seller verifications</h6>
                <p className="m-0">All verification requests have been processed.</p>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: Reports Queue */}
        {activeTab === 'reports' && (
          <div className="glass-card p-4 rounded-4 shadow-sm">
            <h5 className="fw-bold mb-3">Community Flagged Reports</h5>
            <p className="text-muted small mb-4">
              Investigate scams, counterfeit claims, or offensive content reported by Ethiopian marketplace buyers.
            </p>

            {reports.length > 0 ? (
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light small text-muted text-uppercase">
                    <tr>
                      <th>Listing Item</th>
                      <th>Reason</th>
                      <th>Description</th>
                      <th>Reporter</th>
                      <th>Date</th>
                      <th className="text-end">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reports.map((r) => (
                      <tr key={r.id}>
                        <td>
                          <Link href={`/listings/${r.listing_id}`} className="fw-bold small text-reset hover-orange" target="_blank">
                            {r.listing_title} <ExternalLink size={12} />
                          </Link>
                        </td>
                        <td>
                          <span className="badge bg-danger">{r.reason}</span>
                        </td>
                        <td className="small text-muted">{r.description || 'No description provided.'}</td>
                        <td className="small text-muted">{r.reporter_name}</td>
                        <td className="small text-muted">{new Date(r.created_at).toLocaleDateString()}</td>
                        <td className="text-end">
                          <button
                            className="btn btn-sm btn-danger me-2"
                            onClick={() => handleResolveReport(r.id, 'remove_listing')}
                          >
                            Remove Listing
                          </button>
                          <button
                            className="btn btn-sm btn-neutral"
                            onClick={() => handleResolveReport(r.id, 'dismiss')}
                          >
                            Dismiss
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-5 text-center text-muted small">
                <CheckCircle2 size={36} className="text-success mb-2" />
                <h6 className="fw-bold text-dark">Zero open reports</h6>
                <p className="m-0">No active complaints or scams pending review.</p>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: User Accounts */}
        {activeTab === 'users' && (
          <div className="glass-card p-4 rounded-4 shadow-sm">
            <h5 className="fw-bold mb-3">Marketplace User Accounts</h5>
            <p className="text-muted small mb-4">
              Manage accounts, roles, and security standing across Ethiopia.
            </p>

            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light small text-muted text-uppercase">
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th className="text-end">Account Action</th>
                  </tr>
                </thead>
                <tbody>
                  {usersList.map((u) => (
                    <tr key={u.id}>
                      <td className="fw-bold small">{u.display_name || u.username}</td>
                      <td className="small text-muted">{u.email}</td>
                      <td className="small text-muted">{u.phone || 'N/A'}</td>
                      <td>
                        <span className="badge bg-light text-dark border text-uppercase" style={{ fontSize: '0.7rem' }}>
                          {u.role}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${u.is_active !== false ? 'bg-success' : 'bg-danger'}`}>
                          {u.is_active !== false ? 'Active' : 'Suspended'}
                        </span>
                      </td>
                      <td className="text-end">
                        <button
                          className={`btn btn-sm ${u.is_active !== false ? 'btn-outline-danger' : 'btn-outline-success'}`}
                          onClick={() => handleToggleUserStatus(u.id)}
                        >
                          {u.is_active !== false ? 'Suspend User' : 'Reinstate User'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: Order Oversight */}
        {activeTab === 'orders' && (
          <div className="glass-card p-4 rounded-4 shadow-sm">
            <h5 className="fw-bold mb-3">Platform Order Oversight & Records</h5>
            <p className="text-muted small mb-4">
              Real-time transaction oversight across all Ethiopian buyers and merchants.
            </p>

            {adminOrders.length > 0 ? (
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light small text-uppercase">
                    <tr>
                      <th>Order #</th>
                      <th>Buyer</th>
                      <th>Total</th>
                      <th>Payment</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {adminOrders.map((ord: any) => (
                      <tr key={ord.id}>
                        <td className="fw-bold small">{ord.order_number}</td>
                        <td className="small text-muted">{ord.buyer_email || ord.shipping_name}</td>
                        <td className="fw-bold small text-warning">{Number(ord.total_amount).toLocaleString()} {ord.currency}</td>
                        <td>
                          <span className="badge bg-light text-dark border small">{ord.payment_method}</span>
                        </td>
                        <td>
                          <span className="badge bg-primary text-capitalize">{ord.status}</span>
                        </td>
                        <td className="small text-muted">{new Date(ord.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-5 text-muted small">
                <p className="m-0">No marketplace orders recorded in database yet.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
