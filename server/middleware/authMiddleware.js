const getClerkUserId = (req) => req.auth?.userId || req.auth?.id || null;

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
  const clerkUserId = getClerkUserId(req);
  if (!clerkUserId) {
    return res.status(401).json({
      success: false,
      message: "Sign in to use AI features",
    });
  }

  req.userId = clerkUserId;
  return next();
};

module.exports = { resolveResumeUserId, requireAuth, requireAiAuth, getClerkUserId };
