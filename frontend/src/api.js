const BASE_URL = import.meta.env.VITE_API_URL || "/api";

async function request(path, { method = "GET", body, token } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    // no JSON body (e.g. 204)
  }

  if (!res.ok) {
    throw new Error(data?.error || "Something went wrong. Please try again.");
  }
  return data;
}

export const api = {
  register: (payload) => request("/auth/register", { method: "POST", body: payload }),
  login: (payload) => request("/auth/login", { method: "POST", body: payload }),
  me: (token) => request("/auth/me", { token }),
  setLevel: (token, level) => request("/auth/level", { method: "PUT", body: { level }, token }),

  listLessons: (token, { level, skill } = {}) => {
    const params = new URLSearchParams();
    if (level) params.set("level", level);
    if (skill) params.set("skill", skill);
    const qs = params.toString();
    return request(`/lessons${qs ? `?${qs}` : ""}`, { token });
  },
  getLesson: (token, id) => request(`/lessons/${id}`, { token }),

  getProgress: (token) => request("/progress", { token }),
  saveProgress: (token, payload) => request("/progress", { method: "POST", body: payload, token })
};
