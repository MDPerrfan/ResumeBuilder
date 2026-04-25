const User = require("../models/User");

// Sync signed-in Clerk user with local database
// POST: /api/users/sync
const syncUser = async (req, res) => {
  try {
    const clerkId = req.auth?.userId || req.auth?.id;

    if (!clerkId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const { email, name, imageUrl } = req.body || {};

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const payload = {
      clerkId,
      email: email.toLowerCase().trim(),
      name: (name || "").trim() || "User",
      imageUrl: imageUrl || "",
    };

    const user = await User.findOneAndUpdate({ clerkId }, payload, {
      upsert: true,
      new: true,
      runValidators: true,
      setDefaultsOnInsert: true,
    });

    return res.status(200).json({
      success: true,
      message: "User synced successfully",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to sync user",
      error: error.message,
    });
  }
};

// Get currently authenticated Clerk user from local database
// GET: /api/users/me
const getCurrentUser = async (req, res) => {
  try {
    const clerkId = req.auth?.userId || req.auth?.id;

    if (!clerkId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const user = await User.findOne({ clerkId });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found. Sync user first.",
      });
    }

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch user",
      error: error.message,
    });
  }
};

module.exports = {
  syncUser,
  getCurrentUser,
};
