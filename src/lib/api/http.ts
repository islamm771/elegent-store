export class ApiError extends Error {
  constructor(public status: number, public code: string, public data?: any) { super(code); }
}

export async function http<T>(url: string, init: RequestInit & { json?: unknown } = {}): Promise<T> {
  const { json, headers, ...rest } = init;
  const res = await fetch(url, {
    ...rest,
    headers: { ...(json !== undefined && { "content-type": "application/json" }), ...headers },
    body: json !== undefined ? JSON.stringify(json) : rest.body,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(res.status, data.error ?? "unknown", data);
  return data as T;
}


export const errorText = (e: unknown, map: Record<number, string>, fallback = "Something went wrong.") =>
  e instanceof ApiError ? map[e.status] ?? fallback : "Network problem. Please try again.";