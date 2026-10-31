const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data: T;
  errors?: any;
}

const TOKEN_KEY = 'fq_access_token';

export function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setStoredToken(token: string | null): void {
  if (typeof window === 'undefined') return;
  try {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  } catch {
    // Ignore localStorage access errors
  }
}

export function clearStoredToken(): void {
  setStoredToken(null);
}

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = new Headers(options.headers || {});

  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  // Attach Bearer token if available and not explicitly provided
  const storedToken = getStoredToken();
  if (storedToken && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${storedToken}`);
  }

  const requestOptions: RequestInit = {
    ...options,
    headers,
    credentials: 'include',
  };

  let response = await fetch(url, requestOptions);

  // Attempt refresh if 401 on an authenticated endpoint
  if (
    response.status === 401 &&
    !['/auth/login', '/auth/register', '/auth/register-org', '/auth/refresh'].includes(endpoint)
  ) {
    try {
      const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });
      if (refreshResponse.ok) {
        const refreshData = await refreshResponse.json();
        if (refreshData?.data?.accessToken) {
          setStoredToken(refreshData.data.accessToken);
          headers.set('Authorization', `Bearer ${refreshData.data.accessToken}`);
        }
        response = await fetch(url, { ...requestOptions, headers });
      } else {
        clearStoredToken();
      }
    } catch {
      clearStoredToken();
    }
  }

  const data = await response.json().catch(() => ({
    success: false,
    message: 'Invalid JSON response from server',
  }));

  // Auto-persist access token if returned in response
  if (data?.data?.accessToken) {
    setStoredToken(data.data.accessToken);
  }

  if (!response.ok) {
    if (response.status === 401 && endpoint !== '/auth/login') {
      clearStoredToken();
    }
    throw new Error(data.message || `Request failed with status ${response.status}`);
  }

  return data;
}
