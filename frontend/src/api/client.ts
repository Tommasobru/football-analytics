const BASE_URL = "/api";

export async function apiFetch<T>(
  path: string,
  params?: Record<string, string | number | undefined>,
): Promise<T> {
  const url = new URL(`${BASE_URL}${path}`, window.location.origin);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== "") {
        url.searchParams.set(key, String(value));
      }
    }
  }
  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }
  return res.json();
}
