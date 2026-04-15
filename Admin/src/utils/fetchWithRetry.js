/**
 * Fetch wrapper with automatic retry for Render cold-start 502s and network errors.
 *
 * Retries up to `maxRetries` times with exponential back-off.
 * Automatically attaches the admin Bearer token when available.
 */
export async function fetchWithRetry(url, options = {}, maxRetries = 3) {
  const token = localStorage.getItem("admin_token");

  // Merge Authorization header if token exists and not already provided
  const headers = { ...options.headers };
  if (token && !headers.Authorization) {
    headers.Authorization = `Bearer ${token}`;
  }

  const mergedOptions = { ...options, headers };

  let lastError;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const res = await fetch(url, mergedOptions);

      // 502/503/504 = server not ready (Render cold start) → retry
      if ([502, 503, 504].includes(res.status) && attempt < maxRetries) {
        const delay = Math.min(1000 * 2 ** attempt, 8000); // 1s, 2s, 4s, 8s
        await new Promise((r) => setTimeout(r, delay));
        continue;
      }

      return res;
    } catch (err) {
      lastError = err;

      // Network error (fetch itself failed) → retry
      if (attempt < maxRetries) {
        const delay = Math.min(1000 * 2 ** attempt, 8000);
        await new Promise((r) => setTimeout(r, delay));
        continue;
      }
    }
  }

  throw lastError || new Error("Request failed after retries");
}

/**
 * Convenience: fetch JSON with retry + safe parsing.
 * Returns { ok, status, data } so callers never crash on non-JSON 502 pages.
 */
export async function fetchJSON(url, options = {}) {
  const res = await fetchWithRetry(url, options);

  let data;
  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    data = await res.json();
  } else {
    // Non-JSON response (e.g. Render/Vercel error HTML page)
    const text = await res.text();
    data = { message: text.slice(0, 200) };
  }

  return { ok: res.ok, status: res.status, data };
}
