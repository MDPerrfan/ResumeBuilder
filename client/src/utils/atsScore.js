const STOP = new Set([
  "a", "an", "the", "and", "or", "but", "in", "on", "at", "to", "for", "of", "with",
  "by", "from", "as", "is", "are", "was", "were", "be", "been", "being", "have", "has",
  "had", "do", "does", "did", "will", "would", "should", "could", "may", "might", "must",
  "can", "this", "that", "these", "those", "it", "its", "we", "you", "your", "our", "they",
  "them", "their", "he", "she", "his", "her", "who", "which", "what", "when", "where",
  "how", "all", "any", "both", "each", "few", "more", "most", "other", "some", "such",
  "no", "not", "only", "own", "same", "so", "than", "too", "very", "just", "also", "able",
  "work", "working", "role", "team", "company", "experience", "years", "year", "including",
  "using", "use", "used", "within", "across", "through", "about", "into", "over", "under",
]);

const tokenize = (text) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9+#.\-\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP.has(w));

const uniqueKeywords = (text) => {
  const seen = new Set();
  const out = [];
  for (const word of tokenize(text)) {
    if (!seen.has(word)) {
      seen.add(word);
      out.push(word);
    }
  }
  return out;
};

const scoreBucket = (keywords, resumeLower) => {
  const matched = [];
  const missing = [];
  for (const kw of keywords) {
    (resumeLower.includes(kw) ? matched : missing).push(kw);
  }
  const total = keywords.length;
  const pct = total ? Math.round((matched.length / total) * 100) : 0;
  return { matched, missing, total, pct };
};

/**
 * Lightweight ATS-style keyword score (client-side, no API).
 * Returns overall score plus breakdown by resume section text.
 */
export function computeAtsScore(resume, jobDescription) {
  const jd = (jobDescription || "").trim();
  if (!jd) {
    return { score: 0, matched: [], missing: [], total: 0, breakdown: [] };
  }

  const keywords = uniqueKeywords(jd);
  if (!keywords.length) {
    return { score: 0, matched: [], missing: [], total: 0, breakdown: [] };
  }

  const resumeLower = resumeToSectionText(resume).all.toLowerCase();
  const overall = scoreBucket(keywords, resumeLower);

  const sections = [
    { id: "skills", label: "Skills", text: resumeToSectionText(resume).skills },
    { id: "summary", label: "Summary", text: resumeToSectionText(resume).summary },
    { id: "experience", label: "Experience", text: resumeToSectionText(resume).experience },
    { id: "education", label: "Education", text: resumeToSectionText(resume).education },
  ];

  const breakdown = sections.map(({ id, label, text }) => {
    const lower = text.toLowerCase();
    const matched = keywords.filter((kw) => lower.includes(kw));
    return {
      id,
      label,
      matched: matched.length,
      total: keywords.length,
      pct: keywords.length ? Math.round((matched.length / keywords.length) * 100) : 0,
    };
  });

  return {
    score: overall.pct,
    matched: overall.matched,
    missing: overall.missing,
    total: overall.total,
    breakdown,
    suggestions: generateAtsSuggestions(overall, breakdown, resume, resumeLower),
  };
}

/** Actionable improvement tips based on score + resume content. */
export function generateAtsSuggestions(overall, breakdown, resume, resumeLower) {
  const tips = [];
  const sections = resumeToSectionText(resume);

  if (overall.pct < 70 && overall.missing.length) {
    tips.push({
      priority: "high",
      title: "Add missing job keywords",
      detail: `Weave these into your summary, skills, or experience: ${overall.missing.slice(0, 10).join(", ")}.`,
    });
  }

  if (!sections.summary || sections.summary.length < 80) {
    tips.push({
      priority: "high",
      title: "Expand your professional summary",
      detail: "Write 2–3 sentences that mirror the job title and top requirements from the posting.",
    });
  }

  const skillRow = breakdown.find((r) => r.id === "skills");
  if (skillRow && skillRow.pct < 40) {
    tips.push({
      priority: "high",
      title: "Strengthen the skills section",
      detail: "Add a dedicated skills list with exact terms from the job description (tools, frameworks, certifications).",
    });
  } else if (!sections.skills || sections.skills.split(/\s+/).filter(Boolean).length < 4) {
    tips.push({
      priority: "medium",
      title: "Add a skills section",
      detail: "List 8–12 relevant hard skills separated by commas for better ATS parsing.",
    });
  }

  const expRow = breakdown.find((r) => r.id === "experience");
  if (expRow && expRow.pct < 40) {
    tips.push({
      priority: "high",
      title: "Tailor experience bullet points",
      detail: "Rewrite role descriptions to include action verbs and keywords from the job posting.",
    });
  } else if (!sections.experience || sections.experience.length < 40) {
    tips.push({
      priority: "medium",
      title: "Add work experience details",
      detail: "Include company, title, dates, and bullet points with measurable outcomes.",
    });
  }

  if (resumeLower && !/\d/.test(resumeLower)) {
    tips.push({
      priority: "medium",
      title: "Add quantifiable results",
      detail: "Include numbers (%, revenue, team size, users) to strengthen impact statements.",
    });
  }

  if (resumeLower && resumeLower.length < 400) {
    tips.push({
      priority: "medium",
      title: "Resume content looks thin",
      detail: "ATS systems favor complete profiles — add education, projects, or certifications if applicable.",
    });
  }

  const pi = resume?.personal_info || {};
  if (!pi.email || !pi.phone) {
    tips.push({
      priority: "low",
      title: "Complete contact information",
      detail: "Ensure email and phone are clearly listed at the top for recruiter parsing.",
    });
  }

  if (overall.pct >= 80) {
    tips.push({
      priority: "low",
      title: "Strong keyword match",
      detail: "Focus on formatting consistency and tailoring the summary opening line to this specific role.",
    });
  }

  return tips.slice(0, 6);
}

function resumeToSectionText(resume) {
  const pi = resume?.personal_info || {};
  const skills = (resume?.skills || []).join(" ");
  const summary = resume?.professional_summary || "";
  const experience = (resume?.experience || [])
    .map((e) => [e.position, e.company, e.description].join(" "))
    .join(" ");
  const education = (resume?.education || [])
    .map((e) => [e.degree, e.field, e.institution].join(" "))
    .join(" ");
  const all = [pi.full_name, pi.profession, skills, summary, experience, education].join(" ");
  return { all, skills, summary, experience, education };
}
