
//controller for enhancing a resume's professional summary
//POST: /api/ai/enhance-summary

import openai from "../config/ai.js";

export const enhanceSummary = async (req, res) => {

  console.log("BODY:", req.body);
  console.log("Model:",process.env.OPENAI_MODEL)
  
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