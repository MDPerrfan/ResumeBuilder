const express = require("express");
const { requireAiAuth } = require("../middleware/authMiddleware");
const {
  enhanceSummary,
  enhanceExperience,
  suggestSkills,
  tailorResume,
  generateCoverLetter,
} = require("../controllers/aiController");

const router = express.Router();

router.use(requireAiAuth);
router.post("/enhance-summary", enhanceSummary);
router.post("/generate-cover-letter", generateCoverLetter);
// router.post("/enhance-experience", enhanceExperience);
// router.post("/suggest-skills", suggestSkills);
// router.post("/tailor-resume", tailorResume);

module.exports = router;
