const Resume = require("../models/Resume");
const { v2: cloudinary } = require("cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const getAllResumes = (req, res) => {
  Resume.find({ userId: req.userId })
    .sort({ updatedAt: -1 })
    .then((resumes) =>
      res.status(200).json({
        success: true,
        count: resumes.length,
        data: resumes,
      })
    )
    .catch((error) =>
      res.status(500).json({
        success: false,
        message: "Failed to fetch resumes",
        error: error.message,
      })
    );
};

const getResumeById = (req, res) => {
  Resume.findOne({ _id: req.params.id, userId: req.userId })
    .then((resume) => {
      if (!resume) {
        return res.status(404).json({
          success: false,
          message: "Resume not found",
        });
      }

      return res.status(200).json({
        success: true,
        data: resume,
      });
    })
    .catch((error) =>
      res.status(500).json({
        success: false,
        message: "Failed to fetch resume",
        error: error.message,
      })
    );
};

const createResume = (req, res) => {
  const payload = req.body;

  if (!payload || typeof payload !== "object" || !Object.keys(payload).length) {
    return res.status(400).json({
      success: false,
      message: "Request body is required",
    });
  }

  const isGuestUser = typeof req.userId === "string" && req.userId.startsWith("temp_");

  const createWithLimitCheck = async () => {
    if (isGuestUser) {
      const resumeCount = await Resume.countDocuments({ userId: req.userId });
      if (resumeCount >= 2) {
        return res.status(403).json({
          success: false,
          code: "GUEST_LIMIT_REACHED",
          message: "Guest users can create up to 2 resumes. Please sign in to continue.",
        });
      }
    }

    const resume = await Resume.create({
      userId: req.userId,
      ...payload,
    });

    return res.status(201).json({
      success: true,
      message: "Resume created successfully",
      data: resume,
    });
  };

  createWithLimitCheck()
    .catch((error) =>
      res.status(500).json({
        success: false,
        message: "Failed to create resume",
        error: error.message,
      })
    );
};

const updateResume = (req, res) => {
  const payload = req.body;
  Resume.findOneAndUpdate({ _id: req.params.id, userId: req.userId }, payload, { new: true, runValidators: true })
    .then((resume) => {
      if (!resume) {
        return res.status(404).json({
          success: false,
          message: "Resume not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Resume updated successfully",
        data: resume,
      });
    })
    .catch((error) =>
      res.status(500).json({
        success: false,
        message: "Failed to update resume",
        error: error.message,
      })
    );
};

const deleteResume = (req, res) => {
  Resume.findOneAndDelete({ _id: req.params.id, userId: req.userId })
    .then((resume) => {
      if (!resume) {
        return res.status(404).json({
          success: false,
          message: "Resume not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Resume deleted successfully",
      });
    })
    .catch((error) =>
      res.status(500).json({
        success: false,
        message: "Failed to delete resume",
        error: error.message,
      })
    );
};

const getPublicResumeById = (req, res) => {
  Resume.findOne({ _id: req.params.id, public: true })
    .then((resume) => {
      if (!resume) {
        return res.status(404).json({
          success: false,
          message: "Public resume not found",
        });
      }

      return res.status(200).json({
        success: true,
        data: resume,
      });
    })
    .catch((error) =>
      res.status(500).json({
        success: false,
        message: "Failed to fetch public resume",
        error: error.message,
      })
    );
};

const uploadResumeImage = async (req, res) => {
  try {
    const { image } = req.body || {};

    if (!image || typeof image !== "string") {
      return res.status(400).json({
        success: false,
        message: "Base64 image is required",
      });
    }

    const uploaded = await cloudinary.uploader.upload(image, {
      folder: "resume-builder/profile-images",
      resource_type: "image",
    });

    return res.status(201).json({
      success: true,
      message: "Image uploaded successfully",
      data: {
        url: uploaded.secure_url,
        publicId: uploaded.public_id,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to upload image",
      error: error.message,
    });
  }
};

const migrateGuestResumes = async (req, res) => {
  try {
    const clerkUserId = req.auth?.userId || req.auth?.id;
    const { guestId } = req.body || {};

    if (!clerkUserId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (!guestId || typeof guestId !== "string") {
      return res.status(400).json({
        success: false,
        message: "guestId is required",
      });
    }

    const result = await Resume.updateMany({ userId: guestId.trim() }, { $set: { userId: clerkUserId } });

    return res.status(200).json({
      success: true,
      message: "Guest resumes migrated successfully",
      data: {
        matchedCount: result.matchedCount || 0,
        modifiedCount: result.modifiedCount || 0,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to migrate guest resumes",
      error: error.message,
    });
  }
};

module.exports = {
  getAllResumes,
  getResumeById,
  getPublicResumeById,
  createResume,
  updateResume,
  deleteResume,
  uploadResumeImage,
  migrateGuestResumes,
};
