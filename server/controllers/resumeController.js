const Resume = require("../models/Resume");

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

  Resume.create({
    userId: req.userId,
    ...payload,
  })
    .then((resume) =>
      res.status(201).json({
        success: true,
        message: "Resume created successfully",
        data: resume,
      })
    )
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

module.exports = {
  getAllResumes,
  getResumeById,
  createResume,
  updateResume,
  deleteResume,
};
