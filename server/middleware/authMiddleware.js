const getClerkUserId = (req) => {
  try {
    if (typeof req.auth !== "function") return null;

    const auth = req.auth();
    return auth?.userId || auth?.id || null;
  } catch (err) {
    return null;
  }
};

const getGuestId = (req) => {
  const bodyGuestId = req.body?.guestId;
  if (typeof bodyGuestId === "string" && bodyGuestId.trim()) {
    return bodyGuestId.trim();
  }

  const headerGuestId = req.headers["x-guest-id"] || req.headers["x-temp-user-id"];
  if (typeof headerGuestId === "string" && headerGuestId.trim()) {
    return headerGuestId.trim();
  }

  return null;
};

const resolveResumeUserId = (req, res, next) => {
  try {
    const clerkUserId = getClerkUserId(req);
    if (clerkUserId) {
      req.userId = clerkUserId;
      return next();
    }

    const guestId = getGuestId(req);
    if (guestId) {
      req.userId = guestId;
      return next();
    }

    return res.status(400).json({
      success: false,
      message: "guestId is required when not signed in",
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
      error: error.message,
    });
  }
};

const requireAuth = (req, res, next) => {
  try {
    const clerkUserId = getClerkUserId(req);
    if (!clerkUserId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }
    req.userId = clerkUserId;
    return next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
      error: error.message,
    });
  }
};

const requireAiAuth = (req, res, next) => {
  try {
    if (typeof req.auth !== "function") {
      return res.status(401).json({
        success: false,
        message: "Auth system not initialized",
      });
    }

    const auth = req.auth();
    const clerkUserId = auth?.userId || auth?.id;

    if (!clerkUserId) {
      return res.status(401).json({
        success: false,
        message: "Sign in to use AI features",
      });
    }

    req.userId = clerkUserId;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Auth error",
      error: error.message,
    });
  }
};

module.exports = { resolveResumeUserId, requireAuth, requireAiAuth, getClerkUserId };
