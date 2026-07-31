const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

async function request(path, { method = "GET", body, token, isFormData } = {}) {
  const headers = {};
  if (!isFormData) headers["Content-Type"] = "application/json";
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    // no JSON body (e.g. 204)
  }

  if (!res.ok) {
    throw new Error(data?.error || `Request failed (${res.status})`);
  }
  return data;
}

export const api = {
  health: () => request("/api/health"),

  login: (email, password) =>
    request("/api/auth/login", { method: "POST", body: { email, password } }),
  me: (token) => request("/api/auth/me", { token }),

  getPortfolio: () => request("/api/portfolio"),
  getPortfolioAdmin: (token) => request("/api/portfolio/admin", { token }),
  createPortfolio: (token, item) =>
    request("/api/portfolio", { method: "POST", body: item, token }),
  updatePortfolio: (token, id, item) =>
    request(`/api/portfolio/${id}`, { method: "PUT", body: item, token }),
  deletePortfolio: (token, id) =>
    request(`/api/portfolio/${id}`, { method: "DELETE", token }),
  uploadPortfolioImage: (token, file) => {
    const formData = new FormData();
    formData.append("image", file);
    return request("/api/portfolio/upload", {
      method: "POST",
      body: formData,
      token,
      isFormData: true,
    });
  },

  submitContact: (payload) =>
    request("/api/contact", { method: "POST", body: payload }),
  getContactSubmissions: (token, status) =>
    request(`/api/contact${status ? `?status=${status}` : ""}`, { token }),
  updateContactStatus: (token, id, status) =>
    request(`/api/contact/${id}`, { method: "PATCH", body: { status }, token }),
  deleteContactSubmission: (token, id) =>
    request(`/api/contact/${id}`, { method: "DELETE", token }),
};

export { BASE_URL };
