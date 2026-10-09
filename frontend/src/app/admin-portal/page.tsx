'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { useLanguage } from '@/lib/language-context';
import {
  ShieldAlert,
  Users,
  Tag,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Check,
  X,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  Lock,
  ArrowRight,
  LogOut,
  KeyRound,
  LayoutDashboard,
  Layers,
  PackageCheck,
  CreditCard,
  FileText,
  Settings,
  Store,
} from 'lucide-react';

type AdminTab =
  | 'overview'
  | 'users'
  | 'buyers'
  | 'verifications'
  | 'moderation'
  | 'categories'
  | 'orders'
  | 'reports'
  | 'audit'
  | 'settings';

function AdminPortalContent() {
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading, login, logout } = useAuth();
  const { language, t } = useLanguage();

  // Admin Credentials Sign-In Challenge
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Admin Dashboard State
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [metrics, setMetrics] = useState<any>(null);
  const [pendingListings, setPendingListings] = useState<any[]>([]);
  const [verifications, setVerifications] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Moderation state
  const [rejectReason, setRejectReason] = useState('Photos do not match description or price is unrealistic.');

  const loadAll = async () => {
    if (!user || user.role !== 'admin') return;
    setLoading(true);
    try {
      const [m, pl, v, r, u, cats] = await Promise.all([
        api.admin.getMetrics().catch(() => null),
        api.admin.getPendingListings().catch(() => []),
        api.admin.getVerifications().catch(() => []),
        api.admin.getReports().catch(() => []),
        api.admin.getUsers().catch(() => []),
        api.categories.getAll().catch(() => []),
      ]);
      setMetrics(m);
      setPendingListings(pl || []);
      setVerifications(v || []);
      setReports(r || []);
      setUsersList(u || []);
      setCategories(cats || []);
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

  const handleAdminAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setIsAuthenticating(true);
    try {
      await login({ email: adminEmail, password: adminPassword });
    } catch (err: any) {
      setAuthError(err.message || 'Invalid administrator credentials. Access restricted.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  // STRICT ACCESS CONTROL
  if (authLoading) {
    return (
      <div className="container py-5 text-center" style={{ minHeight: '60vh' }}>
        <div className="spinner-border text-danger" role="status" />
      </div>
    );
  }

  // Not authenticated OR not admin -> show Challenge Form
  if (!isAuthenticated || !user || user.role !== 'admin') {
    return (
      <div className="py-5" style={{ backgroundColor: 'var(--bg-soft)', minHeight: '85vh' }}>
        <div className="container" style={{ maxWidth: '480px' }}>
          <div className="glass-card p-4 p-md-5 rounded-4 shadow-lg border border-danger border-opacity-25 text-center">
            <div className="d-inline-flex p-3 rounded-circle bg-danger bg-opacity-10 text-danger mb-3">
              <ShieldAlert size={44} />
            </div>

            <h2 className="h4 fw-bold mb-2" style={{ color: 'var(--text-main)' }}>
              Administrator Console
            </h2>
            <p className="text-muted small mb-4" style={{ lineHeight: 1.6 }}>
              Restricted Area. Access is granted exclusively to verified platform staff with administrator credentials.
            </p>

            {isAuthenticated && user && user.role !== 'admin' && (
              <div className="alert alert-danger text-start small mb-4 py-2.5">
                <div className="d-flex align-items-center gap-2 fw-bold mb-1">
                  <AlertTriangle size={16} /> Access Denied
                </div>
                Signed in as <strong>{user.email}</strong> ({user.role}). This account does not possess administrator clearance.
                <div className="mt-2 pt-2 border-top border-danger border-opacity-25 d-flex gap-2">
                  <button onClick={() => logout()} className="btn btn-sm btn-outline-danger py-1 px-2.5">
                    <LogOut size={13} className="me-1 inline" /> Sign Out
                  </button>
                  <Link href={user.role === 'seller' ? '/seller/dashboard' : '/buyer/dashboard'} className="btn btn-sm btn-neutral py-1 px-2.5">
                    Back to {user.role === 'seller' ? 'Seller Hub' : 'Buyer Portal'}
                  </Link>
                </div>
              </div>
            )}

            <form onSubmit={handleAdminAuth} className="text-start">
              {authError && <div className="alert alert-danger py-2 px-3 small mb-3">{authError}</div>}

              <div className="mb-3">
                <label className="form-label small fw-bold text-muted">Admin Staff Email</label>
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
                <label className="form-label small fw-bold text-muted">Administrator Password</label>
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
                {isAuthenticating ? 'Verifying Credentials...' : <><KeyRound size={17} /> Verify & Enter Console</>}
              </button>
            </form>

            <div className="mt-4 pt-3 border-top text-center">
              <Link href="/" className="small text-muted hover-orange">
                ← Return to Public Marketplace
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // MODERATION ACTIONS
  const handleModerateVerification = async (verifId: number, action: 'approve' | 'reject') => {
    try {
      await api.admin.moderateVerification(verifId, action, 'Processed by admin');
      setVerifications(verifications.filter((v) => v.id !== verifId));
      alert(`Seller verification ${action === 'approve' ? 'approved (badge granted)' : 'rejected'}.`);
    } catch {
      alert('Failed to process verification.');
    }
  };

  const handleResolveReport = async (reportId: number, action: 'remove_listing' | 'dismiss') => {
    try {
      await api.admin.resolveReport(reportId, action, 'Moderated');
      setReports(reports.filter((r) => r.id !== reportId));
      alert(`Report #${reportId} resolved.`);
    } catch {
      alert('Failed to resolve report.');
    }
  };

  const handleToggleUserStatus = async (userId: number) => {
    try {
      const res = await api.admin.toggleUserStatus(userId);
      setUsersList(usersList.map((u) => (u.id === userId ? { ...u, is_active: res.is_active } : u)));
    } catch {
      alert('Failed to toggle user status.');
    }
  };

  const navItems = [
    { key: 'overview', label: 'Platform Overview', icon: LayoutDashboard },
    { key: 'users', label: 'User Management', icon: Users, count: usersList.length },
    { key: 'buyers', label: 'Buyer Accounts', icon: Users, count: usersList.filter((u) => u.role === 'buyer').length },
    { key: 'verifications', label: 'Seller Verification', icon: ShieldCheck, count: verifications.length },
    { key: 'categories', label: 'Category Management', icon: Layers, count: categories.length },
    { key: 'reports', label: 'Reports & Abuse', icon: AlertTriangle, count: reports.length },
    { key: 'audit', label: 'Audit Logs', icon: FileText },
    { key: 'settings', label: 'Admin Settings', icon: Settings },
  ];

  return (
    <div style={{ backgroundColor: 'var(--bg-soft)', minHeight: '90vh' }}>
      <div className="container-fluid px-lg-4 py-4">
        <div className="row g-4">
          {/* ADMIN SIDEBAR */}
          <div className="col-lg-3 col-xl-2">
            <div className="glass-card p-3 rounded-4 shadow-sm h-100">
              <div className="p-3 mb-3 rounded-3 text-center border bg-white">
                <div className="d-inline-flex p-2.5 rounded-circle bg-danger bg-opacity-10 text-danger mb-2">
                  <ShieldAlert size={26} />
                </div>
                <div className="fw-bold small text-truncate">{user.display_name || 'Admin'}</div>
                <span className="badge bg-danger rounded-pill px-2 py-0.5 mt-1 small">
                  Staff Clearance
                </span>
              </div>

              <nav className="d-flex flex-column gap-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.key;
                  return (
                    <button
                      key={item.key}
                      onClick={() => setActiveTab(item.key as AdminTab)}
                      className={`btn text-start border-0 py-2 px-3 rounded-3 d-flex align-items-center justify-content-between small fw-semibold transition-all ${
                        isActive ? 'bg-danger text-white' : 'text-stone-700 hover-orange'
                      }`}
                    >
                      <span className="d-flex align-items-center gap-2">
                        <Icon size={16} />
                        <span>{item.label}</span>
                      </span>
                      {typeof item.count === 'number' && item.count > 0 && (
                        <span className={`badge rounded-pill ${isActive ? 'bg-white text-danger' : 'bg-danger text-white'}`} style={{ fontSize: '0.68rem' }}>
                          {item.count}
                        </span>
                      )}
                    </button>
                  );
                })}

                <div className="border-top my-2" />

                <button
                  onClick={() => {
                    logout();
                    router.push('/');
                  }}
                  className="btn text-start border-0 py-2 px-3 rounded-3 d-flex align-items-center gap-2 text-danger small fw-semibold"
                >
                  <LogOut size={16} />
                  <span>Exit Console</span>
                </button>
              </nav>
            </div>
          </div>

          {/* MAIN ADMIN WORKSPACE */}
          <div className="col-lg-9 col-xl-10">
            {/* TAB 1: OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="d-flex flex-column gap-4">
                <div className="glass-card p-4 rounded-4 shadow-sm">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h3 className="fw-bold m-0" style={{ color: 'var(--text-main)' }}>Platform Control Center</h3>
                      <p className="text-muted small m-0 mt-0.5">Real-time marketplace monitoring across Ethiopia</p>
                    </div>
                    <button onClick={loadAll} className="btn btn-neutral btn-sm d-flex align-items-center gap-1">
                      <RefreshCw size={14} /> Refresh
                    </button>
                  </div>
                </div>

                <div className="row g-3">
                  <div className="col-6 col-md-3">
                    <div className="glass-card p-3.5 rounded-4 h-100">
                      <span className="text-muted small fw-semibold">Total Users</span>
                      <h3 className="fw-extrabold m-0 mt-1">{metrics?.total_users ?? usersList.length}</h3>
                      <span className="text-muted small" style={{ fontSize: '0.74rem' }}>Buyers & Merchants</span>
                    </div>
                  </div>
                  <div className="col-6 col-md-3">
                    <div className="glass-card p-3.5 rounded-4 h-100">
                      <span className="text-muted small fw-semibold">Active Listings</span>
                      <h3 className="fw-extrabold m-0 mt-1 text-success">{metrics?.active_listings ?? 0}</h3>
                      <span className="text-muted small" style={{ fontSize: '0.74rem' }}>Live on marketplace</span>
                    </div>
                  </div>
                  <div className="col-6 col-md-3">
                    <div className="glass-card p-3.5 rounded-4 h-100">
                      <span className="text-muted small fw-semibold">Pending Verifications</span>
                      <h3 className="fw-extrabold m-0 mt-1 text-warning">{metrics?.pending_verifications ?? verifications.length}</h3>
                      <span className="text-muted small" style={{ fontSize: '0.74rem' }}>Seller ID reviews</span>
                    </div>
                  </div>
                  <div className="col-6 col-md-3">
                    <div className="glass-card p-3.5 rounded-4 h-100">
                      <span className="text-muted small fw-semibold">Community Reports</span>
                      <h3 className="fw-extrabold m-0 mt-1 text-danger">{metrics?.open_reports ?? reports.length}</h3>
                      <span className="text-muted small" style={{ fontSize: '0.74rem' }}>Open flags</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: USER MANAGEMENT */}
            {activeTab === 'users' && (
              <div className="glass-card p-4 rounded-4 shadow-sm">
                <h4 className="fw-bold mb-3">User Directory ({usersList.length})</h4>
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light small text-muted">
                      <tr>
                        <th>User</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th className="text-end">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {usersList.map((u) => (
                        <tr key={u.id}>
                          <td className="fw-bold small">{u.display_name || u.username}</td>
                          <td className="small text-muted">{u.email}</td>
                          <td><span className="badge bg-light text-dark border text-uppercase">{u.role}</span></td>
                          <td><span className={`badge ${u.is_active !== false ? 'bg-success' : 'bg-danger'}`}>{u.is_active !== false ? 'Active' : 'Suspended'}</span></td>
                          <td className="text-end">
                            <button
                              className={`btn btn-sm ${u.is_active !== false ? 'btn-outline-danger' : 'btn-outline-success'}`}
                              onClick={() => handleToggleUserStatus(u.id)}
                            >
                              {u.is_active !== false ? 'Suspend' : 'Activate'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 3: BUYER ACCOUNTS */}
            {activeTab === 'buyers' && (
              <div className="glass-card p-4 rounded-4 shadow-sm">
                <h4 className="fw-bold mb-3">Registered Buyers</h4>
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light small text-muted">
                      <tr>
                        <th>Buyer Name</th>
                        <th>Email</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {usersList.filter((u) => u.role === 'buyer').map((b) => (
                        <tr key={b.id}>
                          <td className="fw-bold small">{b.display_name || b.username}</td>
                          <td className="small text-muted">{b.email}</td>
                          <td><span className="badge bg-success">Active</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 4: SELLER VERIFICATION */}
            {activeTab === 'verifications' && (
              <div className="glass-card p-4 rounded-4 shadow-sm">
                <h4 className="fw-bold mb-3">Pending Seller Verification Reviews</h4>
                {verifications.length > 0 ? (
                  <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                      <thead className="table-light small text-muted">
                        <tr>
                          <th>Seller Name</th>
                          <th>Doc Type</th>
                          <th>Number</th>
                          <th className="text-end">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {verifications.map((v) => (
                          <tr key={v.id}>
                            <td className="fw-bold small">{v.seller_name}</td>
                            <td><span className="badge bg-light text-dark border">{v.document_type}</span></td>
                            <td><code>{v.document_number || 'N/A'}</code></td>
                            <td className="text-end">
                              <button className="btn btn-sm btn-success me-2" onClick={() => handleModerateVerification(v.id, 'approve')}>
                                <Check size={14} /> Approve Badge
                              </button>
                              <button className="btn btn-sm btn-outline-danger" onClick={() => handleModerateVerification(v.id, 'reject')}>
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
                    <h6>No pending seller verification applications</h6>
                  </div>
                )}
              </div>
            )}

            {/* TAB 5: CATEGORIES */}
            {activeTab === 'categories' && (
              <div className="glass-card p-4 rounded-4 shadow-sm">
                <h4 className="fw-bold mb-3">Marketplace Categories ({categories.length})</h4>
                <div className="row g-2">
                  {categories.map((c) => (
                    <div key={c.id} className="col-md-4">
                      <div className="p-3 bg-white border rounded-3">
                        <div className="fw-bold small">{c.name}</div>
                        <div className="small text-muted">Slug: <code>{c.slug}</code></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 6: REPORTS & ABUSE */}
            {activeTab === 'reports' && (
              <div className="glass-card p-4 rounded-4 shadow-sm">
                <h4 className="fw-bold mb-3">Community Flagged Reports</h4>
                {reports.length > 0 ? (
                  <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                      <thead className="table-light small text-muted">
                        <tr>
                          <th>Listing</th>
                          <th>Reason</th>
                          <th>Reporter</th>
                          <th className="text-end">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reports.map((r) => (
                          <tr key={r.id}>
                            <td className="fw-bold small">{r.listing_title}</td>
                            <td><span className="badge bg-danger">{r.reason}</span></td>
                            <td className="small text-muted">{r.reporter_name}</td>
                            <td className="text-end">
                              <button className="btn btn-sm btn-danger me-2" onClick={() => handleResolveReport(r.id, 'remove_listing')}>
                                Remove Item
                              </button>
                              <button className="btn btn-sm btn-neutral" onClick={() => handleResolveReport(r.id, 'dismiss')}>
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
                    <h6>Zero open abuse reports</h6>
                  </div>
                )}
              </div>
            )}

            {/* TAB 7: AUDIT LOGS */}
            {activeTab === 'audit' && (
              <div className="glass-card p-4 rounded-4 shadow-sm">
                <h4 className="fw-bold mb-3">Immutable System Audit Trail</h4>
                {metrics?.recent_logs && metrics.recent_logs.length > 0 ? (
                  <div className="list-group list-group-flush">
                    {metrics.recent_logs.map((log: any) => (
                      <div key={log.id} className="list-group-item px-0 py-2.5 small">
                        <strong>{log.action}</strong> on {log.target_type} #{log.target_id} by {log.actor_email} • {new Date(log.timestamp).toLocaleString()}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-muted small">No audit logs recorded yet.</div>
                )}
              </div>
            )}

            {/* TAB 8: ADMIN SETTINGS */}
            {activeTab === 'settings' && (
              <div className="glass-card p-4 p-md-5 rounded-4 shadow-sm" style={{ maxWidth: '640px' }}>
                <h4 className="fw-bold mb-3">Administrator Account Settings</h4>
                <div className="mb-3">
                  <label className="form-label small fw-bold text-muted">Administrator Email</label>
                  <input type="email" className="form-control" value={user.email} readOnly />
                </div>
                <div className="p-3 bg-light rounded-3 border small text-muted">
                  Clearance level: Full Platform Administrator & Moderation Supervisor.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminPortalPage() {
  return (
    <Suspense fallback={<div className="container py-5 text-center"><div className="spinner-border text-danger" /></div>}>
      <AdminPortalContent />
    </Suspense>
  );
}
