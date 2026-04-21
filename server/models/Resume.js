const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    title: { type: String, required: true, trim: true },
    personal_info: { type: Object, default: {} },
    professional_summary: { type: String, default: "" },
    experience: { type: Array, default: [] },
    education: { type: Array, default: [] },
    languages: { type: Array, default: [] },
    custom_sections: { type: Array, default: [] },
    skills: { type: Array, default: [] },
    project: { type: Array, default: [] },
    section_order: { type: Array, default: ["experience", "education", "project", "skills", "languages", "custom_sections"] },
    template: { type: String, default: "classic" },
    accent_color: { type: String, default: "#000000" },
    public: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Resume", resumeSchema);
