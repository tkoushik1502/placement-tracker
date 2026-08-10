const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    // Student who should receive the notification
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Notification message
    message: {
      type: String,
      required: true,
      trim: true,
    },

    // Related application
    application: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application",
      default: null,
    },

    // Notification type
    type: {
      type: String,
      enum: [
        "application_status",
        "general",
      ],
      default: "general",
    },

    // Whether student has seen it
    read: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Notification",
  notificationSchema
);