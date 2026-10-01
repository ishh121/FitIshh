const BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

export function getApiUrl(path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return BASE_URL ? `${BASE_URL}${cleanPath}` : cleanPath;
}

export function apiFetch(input: string, init?: RequestInit): Promise<Response> {
  const url = getApiUrl(input);
  return fetch(url, {
    ...init,
    credentials: 'include',
  });
}
