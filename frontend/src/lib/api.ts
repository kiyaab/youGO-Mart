const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1';

function getToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('yougo_token');
  }
  return null;
}

export async function apiRequest<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Token ${token}`;
  }

  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

  const res = await fetch(url, {
    ...options,
    headers,
  });

  if (!res.ok) {
    let errMessage = `Error ${res.status}: ${res.statusText}`;
    try {
      const errData = await res.json();
      if (typeof errData === 'object' && errData !== null) {
        if (errData.error) errMessage = errData.error;
        else if (errData.detail) errMessage = errData.detail;
        else if (errData.message) errMessage = errData.message;
        else errMessage = JSON.stringify(errData);
      }
    } catch {
      // ignore json parse error
    }
    throw new Error(errMessage);
  }

  return res.json();
}

export const api = {
  auth: {
    login: (data: { email: string; password: string }) =>
      apiRequest('/auth/login/', { method: 'POST', body: JSON.stringify(data) }),
    register: (data: any) =>
      apiRequest('/auth/register/', { method: 'POST', body: JSON.stringify(data) }),
    logout: () =>
      apiRequest('/auth/logout/', { method: 'POST' }),
    getCurrentUser: () =>
      apiRequest('/auth/me/'),
  },
  categories: {
    getAll: () => apiRequest('/categories/'),
    getBySlug: (slug: string) => apiRequest(`/categories/${slug}/`),
    getLocations: () => apiRequest('/categories/locations/'),
  },
  listings: {
    getAll: (params: Record<string, any> = {}) => {
      const query = new URLSearchParams();
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== '') {
          query.append(key, String(val));
        }
      });
      const qStr = query.toString();
      return apiRequest(`/listings/${qStr ? `?${qStr}` : ''}`);
    },
    getFeatured: () => apiRequest('/listings/featured/'),
    getRecent: () => apiRequest('/listings/recent/'),
    getRelated: (id: number) => apiRequest(`/listings/${id}/related/`),
    getBySlugOrId: (identifier: string | number) => apiRequest(`/listings/${identifier}/`),
    create: (data: any) =>
      apiRequest('/listings/', { method: 'POST', body: JSON.stringify(data) }),
    update: (identifier: string | number, data: any) =>
      apiRequest(`/listings/${identifier}/`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (identifier: string | number) =>
      apiRequest(`/listings/${identifier}/`, { method: 'DELETE' }),
    toggleFavorite: (id: number) =>
      apiRequest(`/listings/${id}/favorite/`, { method: 'POST' }),
    recordContactClick: (id: number, method: 'call' | 'whatsapp' | 'message' | 'email') =>
      apiRequest(`/listings/${id}/contact-click/`, { method: 'POST', body: JSON.stringify({ method }) }),
    updateStatus: (id: number, status: string) =>
      apiRequest(`/listings/${id}/status/`, { method: 'PATCH', body: JSON.stringify({ status }) }),
    report: (id: number, data: { reason: string; description: string; email?: string }) =>
      apiRequest(`/listings/${id}/report/`, { method: 'POST', body: JSON.stringify(data) }),
  },
  seller: {
    getMyProfile: () => apiRequest('/sellers/profile/'),
    updateMyProfile: (data: any) =>
      apiRequest('/sellers/profile/', { method: 'PUT', body: JSON.stringify(data) }),
    getPublicProfile: (id: number) => apiRequest(`/sellers/${id}/`),
    getAnalytics: () => apiRequest('/sellers/analytics/'),
    applyVerification: (data: any) =>
      apiRequest('/sellers/verification/', { method: 'POST', body: JSON.stringify(data) }),
  },
  favorites: {
    getAll: () => apiRequest('/favorites/'),
    getSavedSearches: () => apiRequest('/favorites/saved-searches/'),
    createSavedSearch: (data: any) =>
      apiRequest('/favorites/saved-searches/', { method: 'POST', body: JSON.stringify(data) }),
    deleteSavedSearch: (id: number) =>
      apiRequest(`/favorites/saved-searches/${id}/`, { method: 'DELETE' }),
  },
  messaging: {
    getConversations: () => apiRequest('/conversations/'),
    getConversation: (id: number) => apiRequest(`/conversations/${id}/`),
    sendMessage: (convId: number, content: string) =>
      apiRequest(`/conversations/${convId}/messages/`, { method: 'POST', body: JSON.stringify({ content }) }),
    startConversation: (listingId: number, message: string) =>
      apiRequest('/conversations/', { method: 'POST', body: JSON.stringify({ listing_id: listingId, message }) }),
  },
  notifications: {
    getAll: () => apiRequest('/notifications/'),
    markRead: (id: number) => apiRequest(`/notifications/${id}/read/`, { method: 'PATCH' }),
    markAllRead: () => apiRequest('/notifications/read-all/', { method: 'POST' }),
  },
  cart: {
    get: () => apiRequest('/cart/'),
    addItem: (listingId: number, quantity = 1) =>
      apiRequest('/cart/items/', { method: 'POST', body: JSON.stringify({ listing_id: listingId, quantity }) }),
    updateQuantity: (itemId: number, quantity: number) =>
      apiRequest(`/cart/items/${itemId}/`, { method: 'PATCH', body: JSON.stringify({ quantity }) }),
    removeItem: (itemId: number) =>
      apiRequest(`/cart/items/${itemId}/`, { method: 'DELETE' }),
    clear: () =>
      apiRequest('/cart/clear/', { method: 'POST' }),
  },
  orders: {
    checkout: (data: any) =>
      apiRequest('/orders/checkout/', { method: 'POST', body: JSON.stringify(data) }),
    getMyOrders: () =>
      apiRequest('/orders/'),
    getOrderDetail: (orderNumber: string) =>
      apiRequest(`/orders/detail/${orderNumber}/`),
    getSellerOrders: () =>
      apiRequest('/orders/seller/'),
    updateFulfillment: (itemId: number, status: string) =>
      apiRequest(`/orders/seller/items/${itemId}/`, { method: 'PATCH', body: JSON.stringify({ fulfillment_status: status }) }),
  },
  admin: {
    getMetrics: () => apiRequest('/admin/metrics/'),
    getPendingListings: () => apiRequest('/admin/listings/pending/'),
    moderateListing: (id: number, action: 'approve' | 'reject', reason?: string) =>
      apiRequest(`/admin/listings/${id}/moderate/`, { method: 'POST', body: JSON.stringify({ action, reason }) }),
    getVerifications: () => apiRequest('/admin/verifications/'),
    moderateVerification: (id: number, action: 'approve' | 'reject', notes?: string) =>
      apiRequest(`/admin/verifications/${id}/moderate/`, { method: 'POST', body: JSON.stringify({ action, notes }) }),
    getReports: () => apiRequest('/admin/reports/'),
    resolveReport: (id: number, action: 'remove_listing' | 'dismiss', notes?: string) =>
      apiRequest(`/admin/reports/${id}/resolve/`, { method: 'POST', body: JSON.stringify({ action, notes }) }),
    getUsers: () => apiRequest('/admin/users/'),
    toggleUserStatus: (id: number) => apiRequest(`/admin/users/${id}/toggle-status/`, { method: 'POST' }),
  },
};
