import { getGuestId } from "./resumeStorage";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

// -----------------------------
// Helpers
// -----------------------------
const parseJson = async (response) => {
  try {
    return await response.json();
  } catch {
    return null;
  }
};

const buildHeaders = ({ token, isGuest = false }) => {
  const headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  } else if (isGuest) {
    headers["x-guest-id"] = getGuestId();
  }

  return headers;
};

// -----------------------------
// Core request function
// -----------------------------
const request = async ({
  path,
  method = "GET",
  body,
  token,
  requireAuth = false,
  useGuest = false,
}) => {
  // 🚨 Strict auth check
  if (requireAuth && !token) {
    throw new Error("Authentication required");
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: buildHeaders({ token, isGuest: useGuest && !token }),
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await parseJson(response);

  if (!response.ok) {
    throw new Error(data?.message || `Request failed (${response.status})`);
  }

  return data;
};

// -----------------------------
// Resume API
// -----------------------------
export const resumeApi = {
  list: (token) =>
    request({
      path: "/api/resume",
      token,
      useGuest: !token,
    }),

  get: (id, token) =>
    request({
      path: `/api/resume/${id}`,
      token,
      useGuest: !token,
    }),

  create: (payload, token) =>
    request({
      path: "/api/resume",
      method: "POST",
      body: payload,
      token,
      useGuest: !token,
    }),

  update: (id, payload, token) =>
    request({
      path: `/api/resume/${id}`,
      method: "PUT",
      body: payload,
      token,
      useGuest: !token,
    }),

  remove: (id, token) =>
    request({
      path: `/api/resume/${id}`,
      method: "DELETE",
      token,
      requireAuth: true,
    }),

  getPublic: (id) =>
    request({
      path: `/api/resume/public/${id}`,
    }),

  uploadImage: (image, token) =>
    request({
      path: "/api/resume/upload-image",
      method: "POST",
      body: { image },
      token,
      requireAuth: true,
    }),

  migrateGuest: (guestId, token) =>
    request({
      path: "/api/resume/migrate-guest",
      method: "POST",
      body: { guestId },
      token,
      requireAuth: true,
    }),
};

// -----------------------------
// AI API
// -----------------------------
export const aiApi = {
  enhanceSummary: (summary, token) =>
    request({
      path: "/api/ai/enhance-summary",
      method: "POST",
      body: { userContent: summary },
      token,
      requireAuth: true,
    }),

  enhanceExperience: (experience, token) =>
    request({
      path: "/api/ai/enhance-experience",
      method: "POST",
      body: { experience },
      token,
      requireAuth: true,
    }),

  suggestSkills: (jobTitle, token) =>
    request({
      path: "/api/ai/suggest-skills",
      method: "POST",
      body: { summary: jobTitle },
      token,
      requireAuth: true,
    }),

  tailorResume: (jobDescription, resumeText, token) =>
    request({
      path: "/api/ai/tailor-resume",
      method: "POST",
      body: { jobDescription, resumeText },
      token,
      requireAuth: true,
    }),

  generateCoverLetter: (payload, token) =>
    request({
      path: "/api/ai/generate-cover-letter",
      method: "POST",
      body: payload,
      token,
      requireAuth: true,
    }),
};

// -----------------------------
// User API
// -----------------------------
export const userApi = {
  sync: (payload, token) =>
    request({
      path: "/api/users/sync",
      method: "POST",
      body: payload,
      token,
      requireAuth: true,
    }),
};