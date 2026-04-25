const express = require("express");
const { protected } = require("../middleware/authMiddleware");
const { syncUser, getCurrentUser } = require("../controllers/userController");

const router = express.Router();

router.use(protected);

router.post("/sync", syncUser);
router.get("/me", getCurrentUser);

module.exports = router;
