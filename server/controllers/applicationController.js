const Application = require("../models/Application");
const Company = require("../models/Company");
const User = require("../models/User");

// =========================
// Student - Apply for Company
// =========================
const applyCompany = async (req, res) => {
  try {
    // =========================
    // Admins cannot apply
    // =========================

    if (req.user.role === "admin") {
      return res.status(403).json({
        message: "Admins cannot apply for companies",
      });
    }

    const { companyId } = req.body;

    // =========================
    // Validate company ID
    // =========================

    if (!companyId) {
      return res.status(400).json({
        message: "Company ID is required",
      });
    }

    // =========================
    // Find company
    // =========================

    const company = await Company.findById(companyId);

    if (!company) {
      return res.status(404).json({
        message: "Company not found",
      });
    }

    // =========================
    // Find student
    // =========================

    const student = await User.findById(req.user.id);

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    // =========================
    // Check duplicate application
    // =========================

    const alreadyApplied = await Application.findOne({
      student: req.user.id,
      company: companyId,
    });

    if (alreadyApplied) {
      return res.status(400).json({
        message: "Already Applied",
      });
    }

    // =========================
    // Check application deadline
    // =========================

    if (company.deadline) {
      const now = new Date();

      const deadline = new Date(company.deadline);

      // Allow applications throughout the deadline date
      deadline.setHours(23, 59, 59, 999);

      if (now > deadline) {
        return res.status(400).json({
          message: "Application deadline has passed",
        });
      }
    }

    // =========================
    // Check CGPA eligibility
    // =========================

    if (
      student.cgpa < company.eligibilityCGPA
    ) {
      return res.status(403).json({
        message: `You are not eligible. Minimum CGPA required is ${company.eligibilityCGPA}`,
      });
    }

    // =========================
    // Create application
    // =========================

    const application = await Application.create({
      student: req.user.id,
      company: companyId,

      status: "Applied",

      remarks: "",

      history: [
        {
          status: "Applied",
          remarks: "",
          changedAt: new Date(),
        },
      ],
    });

    // =========================
    // Populate response
    // =========================

    await application.populate("company");

    res.status(201).json({
      message: "Application Submitted",
      application,
    });

  } catch (error) {
    console.error(
      "APPLY COMPANY ERROR:",
      error
    );

    // =========================
    // Duplicate index protection
    // =========================

    if (error.code === 11000) {
      return res.status(400).json({
        message: "Already Applied",
      });
    }

    // =========================
    // Mongoose validation errors
    // =========================

    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: error.message,
      });
    }

    res.status(500).json({
      message: error.message,
    });
  }
};


// =========================
// Student - Get My Applications
// =========================

const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({
      student: req.user.id,
    })
      .populate(
        "company",
        "companyName role package location eligibilityCGPA deadline description"
      )
      .sort({
        createdAt: -1,
      });

    res.status(200).json(applications);

  } catch (error) {
    console.error(
      "GET MY APPLICATIONS ERROR:",
      error
    );

    res.status(500).json({
      message: error.message,
    });
  }
};


// =========================
// Admin - Get All Applications
// =========================

const getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate(
        "student",
        "name email phone college branch cgpa graduationYear skills resumeUrl"
      )
      .populate(
        "company",
        "companyName role package location eligibilityCGPA deadline"
      )
      .sort({
        createdAt: -1,
      });

    res.status(200).json(applications);

  } catch (error) {
    console.error(
      "GET ALL APPLICATIONS ERROR:",
      error
    );

    res.status(500).json({
      message: error.message,
    });
  }
};


// =========================
// Admin - Get Applications
// of One Student
// =========================

const getStudentApplications = async (
  req,
  res
) => {
  try {
    const applications = await Application.find({
      student: req.params.studentId,
    })
      .populate(
        "company",
        "companyName role package location eligibilityCGPA deadline"
      )
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });

  } catch (error) {
    console.error(
      "GET STUDENT APPLICATIONS ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =========================
// Admin - Update Application
// Status + Remarks + History
// =========================

const updateApplicationStatus = async (
  req,
  res
) => {
  try {
    const { status, remarks } = req.body;

    // =========================
    // Validate status
    // =========================

    const allowedStatuses = [
      "Applied",
      "Shortlisted",
      "Interview",
      "Selected",
      "Rejected",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid application status",
      });
    }

    // =========================
    // Validate remarks
    // =========================

    if (
      remarks !== undefined &&
      typeof remarks !== "string"
    ) {
      return res.status(400).json({
        message: "Remarks must be text",
      });
    }

    if (
      typeof remarks === "string" &&
      remarks.length > 1000
    ) {
      return res.status(400).json({
        message:
          "Remarks cannot exceed 1000 characters",
      });
    }

    // =========================
    // Find application
    // =========================

    const application =
      await Application.findById(
        req.params.id
      );

    if (!application) {
      return res.status(404).json({
        message: "Application not found",
      });
    }

    // =========================
    // Determine new remarks
    // =========================

    const newRemarks =
      remarks !== undefined
        ? remarks.trim()
        : application.remarks;

    // =========================
    // Check whether anything changed
    // =========================

    const statusChanged =
      application.status !== status;

    const remarksChanged =
      application.remarks !== newRemarks;

    // =========================
    // Update application
    // =========================

    application.status = status;
    application.remarks = newRemarks;

    // =========================
    // Add history only when
    // something actually changes
    // =========================

    if (
      statusChanged ||
      remarksChanged
    ) {
      application.history.push({
        status,
        remarks: newRemarks,
        changedAt: new Date(),
      });
    }

    // =========================
    // Save
    // =========================

    await application.save();

    // =========================
    // Populate response
    // =========================

    await application.populate([
      {
        path: "student",
        select:
          "name email phone college branch cgpa graduationYear skills resumeUrl",
      },
      {
        path: "company",
        select:
          "companyName role package location eligibilityCGPA deadline",
      },
    ]);

    res.status(200).json({
      message:
        "Application Updated Successfully",
      application,
    });

  } catch (error) {
    console.error(
      "UPDATE APPLICATION ERROR:",
      error
    );

    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: error.message,
      });
    }

    res.status(500).json({
      message: error.message,
    });
  }
};


// =========================
// Get Single Application
// =========================

const getApplicationById = async (
  req,
  res
) => {
  try {
    const application =
      await Application.findById(
        req.params.id
      )
        .populate(
          "company",
          "companyName role package location eligibilityCGPA deadline"
        )
        .populate(
          "student",
          "name email phone college branch cgpa graduationYear skills resumeUrl"
        );

    if (!application) {
      return res.status(404).json({
        message: "Application not found",
      });
    }

    // =========================
    // Student ownership check
    // =========================

    if (
      req.user.role !== "admin" &&
      application.student._id.toString() !==
        req.user.id
    ) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    res.status(200).json({
      application,
    });

  } catch (error) {
    console.error(
      "GET APPLICATION ERROR:",
      error
    );

    res.status(500).json({
      message: error.message,
    });
  }
};


module.exports = {
  applyCompany,
  getMyApplications,
  getApplicationById,
  getAllApplications,
  getStudentApplications,
  updateApplicationStatus,
};