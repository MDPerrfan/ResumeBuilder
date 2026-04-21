const { requireAuth, getAuth } = require("@clerk/express");

const clerkRequireAuth = requireAuth();

const attachUserId = (req, res, next) => {
  const auth = getAuth(req);
  req.userId = auth?.userId || null;
  next();
};

module.exports = { clerkRequireAuth, attachUserId };
