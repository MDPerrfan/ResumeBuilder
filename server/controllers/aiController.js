const { GoogleGenerativeAI } = require("@google/generative-ai");

const getClient = () => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is missing");
  }
  return new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
};

const generateText = async (prompt) => {
  const genAI = getClient();
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const result = await model.generateContent(prompt);
  return result.response.text();
};

const enhanceSummary = async (req, res) => {
  try {
    const { summary = "" } = req.body || {};
    if (!summary.trim()) {
      return res.status(400).json({ success: false, message: "summary is required" });
    }

    const enhanced = await generateText(
      `Enhance the professional summary below for a resume. Keep it concise and impactful.\n\nSummary:\n${summary}`
    );
    return res.status(200).json({ success: true, data: { text: enhanced.trim() } });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to enhance summary", error: error.message });
  }
};

const enhanceExperience = async (req, res) => {
  try {
    const { experience = "" } = req.body || {};
    if (!experience.trim()) {
      return res.status(400).json({ success: false, message: "experience is required" });
    }

    const enhanced = await generateText(
      `Rewrite the resume work experience text below with stronger action verbs and measurable outcomes.\n\nExperience:\n${experience}`
    );
    return res.status(200).json({ success: true, data: { text: enhanced.trim() } });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to enhance experience", error: error.message });
  }
};

const suggestSkills = async (req, res) => {
  try {
    const { summary = "", experience = "" } = req.body || {};
    if (!summary.trim() && !experience.trim()) {
      return res.status(400).json({ success: false, message: "summary or experience is required" });
    }

    const suggested = await generateText(
      `Based on the resume context, suggest 10 relevant skills as a comma-separated list.\n\nSummary:\n${summary}\n\nExperience:\n${experience}`
    );
    const skills = suggested
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    return res.status(200).json({ success: true, data: { skills } });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to suggest skills", error: error.message });
  }
};

const tailorResume = async (req, res) => {
  try {
    const { jobDescription = "", resumeText = "" } = req.body || {};
    if (!jobDescription.trim()) {
      return res.status(400).json({ success: false, message: "jobDescription is required" });
    }

    const tailored = await generateText(
      `You are an ATS reviewer. Analyze this resume against the job description and return JSON only with shape:
{"atsScore": number, "suggestions": string[]}

Job Description:
${jobDescription}

Resume:
${resumeText}`
    );

    let parsed = null;
    try {
      parsed = JSON.parse(tailored);
    } catch (error) {
      parsed = {
        atsScore: 65,
        suggestions: [tailored.trim()],
      };
    }

    return res.status(200).json({ success: true, data: parsed });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to tailor resume", error: error.message });
  }
};

const generateCoverLetter = async (req, res) => {
  try {
    const { jobDescription = "", summary = "", fullName = "Candidate" } = req.body || {};
    if (!jobDescription.trim()) {
      return res.status(400).json({ success: false, message: "jobDescription is required" });
    }

    const letter = await generateText(
      `Write a professional cover letter for ${fullName}. Keep it concise, specific, and aligned to the job description.

Job Description:
${jobDescription}

Resume Summary:
${summary}`
    );

    return res.status(200).json({ success: true, data: { text: letter.trim() } });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to generate cover letter", error: error.message });
  }
};

module.exports = {
  enhanceSummary,
  enhanceExperience,
  suggestSkills,
  tailorResume,
  generateCoverLetter,
};
