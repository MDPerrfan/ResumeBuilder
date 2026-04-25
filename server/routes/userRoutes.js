const express = require("express");
const { requireAuth } = require("../middleware/authMiddleware");
const { syncUser, getCurrentUser } = require("../controllers/userController");

const router = express.Router();

router.use(requireAuth);

router.post("/sync", syncUser);
router.get("/me", getCurrentUser);

module.exports = router;
