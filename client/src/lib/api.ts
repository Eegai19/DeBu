import { API_URL } from './config';

export class ApiRequestError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly details?: { field: string; message: string }[],
  ) {
    super(message);
  }
}

/** Thrown when the API is not configured or cannot be reached at all. */
export class ApiUnavailableError extends Error {}

export async function postJson<T>(path: string, body: unknown): Promise<T> {
  if (!API_URL) throw new ApiUnavailableError('API not configured');
  let res: Response;
  try {
    res = await fetch(`${API_URL}/api${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(10000),
    });
  } catch {
    throw new ApiUnavailableError('Network error');
  }
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    if (res.status >= 500) throw new ApiUnavailableError(json.message ?? 'Server error');
    throw new ApiRequestError(json.message ?? 'Request failed', res.status, json.details);
  }
  return json as T;
}
