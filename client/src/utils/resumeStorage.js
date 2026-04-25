const GUEST_ID_KEYS = ["guestId", "tempUserId"];
const GUEST_RESUMES_KEY = "guestResumes";

export const getGuestId = () => {
  for (const key of GUEST_ID_KEYS) {
    const localValue = localStorage.getItem(key);
    if (localValue) return localValue;
    const sessionValue = sessionStorage.getItem(key);
    if (sessionValue) return sessionValue;
  }

  const generated = `temp_${Date.now()}`;
  localStorage.setItem("guestId", generated);
  sessionStorage.setItem("guestId", generated);
  return generated;
};

export const getGuestResumes = () => {
  try {
    const raw = localStorage.getItem(GUEST_RESUMES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
};

export const saveGuestResumes = (resumes) => {
  localStorage.setItem(GUEST_RESUMES_KEY, JSON.stringify(resumes));
  sessionStorage.setItem(GUEST_RESUMES_KEY, JSON.stringify(resumes));
};

export const upsertGuestResume = (resume) => {
  const current = getGuestResumes();
  const exists = current.some((item) => item._id === resume._id);
  const updated = exists
    ? current.map((item) => (item._id === resume._id ? { ...item, ...resume } : item))
    : [resume, ...current];
  saveGuestResumes(updated);
  return updated;
};

export const removeGuestResume = (resumeId) => {
  const current = getGuestResumes();
  const updated = current.filter((item) => item._id !== resumeId);
  saveGuestResumes(updated);
  return updated;
};

export const clearGuestResumes = () => {
  localStorage.removeItem(GUEST_RESUMES_KEY);
  sessionStorage.removeItem(GUEST_RESUMES_KEY);
};
