const express = require("express");
const { resolveResumeUserId, requireAuth } = require("../middleware/authMiddleware");
const {
  getAllResumes,
  getResumeById,
  getPublicResumeById,
  createResume,
  updateResume,
  deleteResume,
  uploadResumeImage,
  migrateGuestResumes,
} = require("../controllers/resumeController");

const router = express.Router();

router.get("/public/:id", getPublicResumeById);
router.post("/upload-image", resolveResumeUserId, uploadResumeImage);
router.post("/migrate-guest", requireAuth, migrateGuestResumes);
router.use(resolveResumeUserId);

router.get("/", getAllResumes);
router.get("/:id", getResumeById);
router.post("/", createResume);
router.put("/:id", updateResume);
router.delete("/:id", deleteResume);

module.exports = router;
