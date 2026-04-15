/**
 * Fetch wrapper with automatic retry for Render cold-start 502s.
 *
 * Retries up to `maxRetries` times with exponential back-off.
 * 502/503/504 → server not yet warm (Render cold start).
 */
export async function fetchWithRetry(url, options = {}, maxRetries = 3) {
  let lastError;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const res = await fetch(url, options);

      // Gateway errors → server waking up → retry
      if ([502, 503, 504].includes(res.status) && attempt < maxRetries) {
        const delay = Math.min(1000 * 2 ** attempt, 8000); // 1s, 2s, 4s, 8s
        await new Promise((r) => setTimeout(r, delay));
        continue;
      }

      return res;
    } catch (err) {
      lastError = err;
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
 * Fetch JSON with retry + safe parsing.
 * Returns { ok, status, data }.
 */
export async function fetchJSON(url, options = {}) {
  const res = await fetchWithRetry(url, options);

  let data;
  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    data = await res.json();
  } else {
    const text = await res.text();
    data = { message: text.slice(0, 200) };
  }

  return { ok: res.ok, status: res.status, data };
}
