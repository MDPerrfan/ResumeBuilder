const join = (parts) => parts.filter(Boolean).join(" ");

const collectStrings = (value, out) => {
  if (!value) return;
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (trimmed) out.push(trimmed);
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item) => collectStrings(item, out));
    return;
  }
  if (typeof value === "object") {
    Object.values(value).forEach((item) => collectStrings(item, out));
  }
};

/** Flatten resume document into searchable plain text (read-only helper). */
export function resumeToPlainText(resume) {
  if (!resume) return "";
  const parts = [];
  collectStrings(resume.personal_info, parts);
  collectStrings(resume.professional_summary, parts);
  collectStrings(resume.skills, parts);
  collectStrings(resume.experience, parts);
  collectStrings(resume.education, parts);
  collectStrings(resume.project, parts);
  collectStrings(resume.languages, parts);
  collectStrings(resume.custom_sections, parts);
  return join(parts);
}

/** Compact resume context for AI prompts (token-friendly). */
export function resumeToAiContext(resume) {
  const pi = resume?.personal_info || {};
  const exp = (resume?.experience || [])
    .slice(0, 4)
    .map((e) => `${e.position || ""} at ${e.company || ""}: ${(e.description || "").slice(0, 200)}`)
    .join("\n");
  return {
    name: pi.full_name || "",
    title: pi.profession || "",
    summary: (resume?.professional_summary || "").slice(0, 500),
    skills: (resume?.skills || []).slice(0, 15).join(", "),
    experience: exp,
  };
}
