
//controller for enhancing a resume's professional summary
//POST: /api/ai/enhance-summary

import openai from "../config/ai.js";

export const enhanceSummary = async (req, res) => {
  try {
    const { userContent } = req.body;

    if (!userContent || typeof userContent !== "string" || !userContent.trim()) {
      return res.status(400).json({
        message: "Missing or invalid userContent",
      });
    }

    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL,
      // reasoning_effort: "low",
      messages: [
        {
          role: "system",
          content:
            "You are an expert in resume writing. Enhance the summary in 1-2 sentences, ATS-friendly. Return only text.",
        },
        {
          role: "user",
          content: userContent,
        },
      ],
    });

    const enhancedContent =
      response?.choices?.[0]?.message?.content;

    if (!enhancedContent) {
      return res.status(500).json({
        message: "AI returned empty response",
      });
    }

    return res.status(200).json({ enhancedContent });
  } catch (error) {
    console.error("AI ERROR:", error);

    return res.status(500).json({
      message: error.message || "Internal server error",
    });
  }
};

export const generateCoverLetter = async (req, res) => {
  try {
    const { jobDescription, resumeContext } = req.body;

    if (!jobDescription?.trim()) {
      return res.status(400).json({ message: "jobDescription is required" });
    }

    const ctx = resumeContext || {};
    const userPrompt = [
      "Job description / prompt:",
      jobDescription.trim(),
      "",
      "Candidate:",
      `Name: ${ctx.name || "Candidate"}`,
      `Title: ${ctx.title || "N/A"}`,
      `Summary: ${ctx.summary || "N/A"}`,
      `Skills: ${ctx.skills || "N/A"}`,
      `Experience:\n${ctx.experience || "N/A"}`,
      "",
      "Write a professional cover letter (3–4 paragraphs) tailored to this role. Match the resume tone. Return only the letter body.",
    ].join("\n");

    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL,
      messages: [
        {
          role: "system",
          content:
            "You are an expert cover letter writer. Be concise, professional, and specific to the job. No markdown or subject line.",
        },
        { role: "user", content: userPrompt },
      ],
    });

    const coverLetter = response?.choices?.[0]?.message?.content?.trim();
    if (!coverLetter) {
      return res.status(500).json({ message: "AI returned empty response" });
    }

    return res.status(200).json({ coverLetter });
  } catch (error) {
    console.error("AI ERROR:", error);
    return res.status(500).json({ message: error.message || "Internal server error" });
  }
};
