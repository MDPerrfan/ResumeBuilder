const express = require("express");
const { clerkRequireAuth, attachUserId } = require("../middleware/authMiddleware");
const {
  getAllResumes,
  getResumeById,
  createResume,
  updateResume,
  deleteResume,
} = require("../controllers/resumeController");

const router = express.Router();

router.use(clerkRequireAuth, attachUserId);

router.get("/", getAllResumes);
router.get("/:id", getResumeById);
router.post("/", createResume);
router.put("/:id", updateResume);
router.delete("/:id", deleteResume);

module.exports = router;
