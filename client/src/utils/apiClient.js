import { getGuestId } from "./resumeStorage";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const parseJson = async (response) => {
  try {
    return await response.json();
  } catch (error) {
    return {};
  }
};

export const apiRequest = async (path, { method = "GET", body, token, requireAuth = false } = {}) => {
  if (requireAuth && !token) {
    throw new Error("Sign in to use AI features");
  }

  const headers = { "Content-Type": "application/json" };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  } else {
    headers["x-guest-id"] = getGuestId();
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(token ? body : { ...body, guestId: getGuestId() }) : undefined,
  });

  const result = await parseJson(response);
  if (!response.ok) {
    throw new Error(result.message || "Request failed");
  }
  return result;
};

export const resumeApi = {
  list: (token) => apiRequest("/api/resume", { token }),
  get: (id, token) => apiRequest(`/api/resume/${id}`, { token }),
  create: (payload, token) => apiRequest("/api/resume", { method: "POST", body: payload, token }),
  update: (id, payload, token) => apiRequest(`/api/resume/${id}`, { method: "PUT", body: payload, token }),
  remove: (id, token) => apiRequest(`/api/resume/${id}`, { method: "DELETE", token }),
  getPublic: (id) => apiRequest(`/api/resume/public/${id}`),
  uploadImage: (image, token) => apiRequest("/api/resume/upload-image", { method: "POST", body: { image }, token }),
  migrateGuest: (guestId, token) =>
    apiRequest("/api/resume/migrate-guest", { method: "POST", body: { guestId }, token, requireAuth: true }),
};

export const aiApi = {
  enhanceSummary: (summary, token) =>
    apiRequest("/api/ai/enhance-summary", { method: "POST", body: { summary }, token, requireAuth: true }),
  enhanceExperience: (experience, token) =>
    apiRequest("/api/ai/enhance-experience", { method: "POST", body: { experience }, token, requireAuth: true }),
  suggestSkills: (jobTitle, token) =>
    apiRequest("/api/ai/suggest-skills", { method: "POST", body: { summary: jobTitle }, token, requireAuth: true }),
  tailorResume: (jobDescription, resumeText, token) =>
    apiRequest("/api/ai/tailor-resume", {
      method: "POST",
      body: { jobDescription, resumeText },
      token,
      requireAuth: true,
    }),
  generateCoverLetter: (payload, token) =>
    apiRequest("/api/ai/generate-cover-letter", { method: "POST", body: payload, token, requireAuth: true }),
};

export const userApi = {
  sync: (payload, token) => apiRequest("/api/users/sync", { method: "POST", body: payload, token, requireAuth: true }),
};
