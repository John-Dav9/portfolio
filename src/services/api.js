// Same-origin API (nginx proxies /api to the Node service; Vite proxies it in dev).
export class ApiError extends Error {
  constructor(message, status, issues) {
    super(message);
    this.status = status;
    this.issues = issues;
  }
}

export async function api(path, { method = "GET", body, form } = {}) {
  const init = { method, credentials: "same-origin", headers: {} };
  if (form) init.body = form;
  else if (body !== undefined) {
    init.headers["Content-Type"] = "application/json";
    init.body = JSON.stringify(body);
  }
  const res = await fetch(`/api${path}`, init);
  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = null;
  }
  if (!res.ok) throw new ApiError(data?.error || `Erreur ${res.status}`, res.status, data?.issues);
  return data;
}
