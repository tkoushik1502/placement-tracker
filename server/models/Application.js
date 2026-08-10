const mongoose = require("mongoose");

// =========================
// APPLICATION HISTORY
// =========================

const applicationHistorySchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: [
        "Applied",
        "Shortlisted",
        "Interview",
        "Selected",
        "Rejected",
      ],
      required: true,
    },

    remarks: {
      type: String,
      trim: true,
      maxlength: [
        1000,
        "Remarks cannot exceed 1000 characters",
      ],
      default: "",
    },

    changedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    _id: false,
  }
);


// =========================
// APPLICATION
// =========================

const applicationSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },

    status: {
      type: String,
      enum: [
        "Applied",
        "Shortlisted",
        "Interview",
        "Selected",
        "Rejected",
      ],
      default: "Applied",
    },

    remarks: {
      type: String,
      trim: true,
      maxlength: [
        1000,
        "Remarks cannot exceed 1000 characters",
      ],
      default: "",
    },

    // =========================
    // APPLICATION HISTORY
    // =========================

    history: {
      type: [applicationHistorySchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);


// =========================
// PREVENT DUPLICATE APPLICATIONS
// =========================
//
// One student can apply to a company only once.
//

applicationSchema.index(
  {
    student: 1,
    company: 1,
  },
  {
    unique: true,
  }
);


module.exports = mongoose.model(
  "Application",
  applicationSchema
);