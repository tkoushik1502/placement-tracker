const User = require("../models/User");

// =========================
// Get Logged-in User Profile
// =========================

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(
      req.user.id
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(
      "GET PROFILE ERROR:",
      error.message
    );

    res.status(500).json({
      message: "Failed to load profile",
    });
  }
};


// =========================
// Update Logged-in User
// =========================

const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(
      req.user.id
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }


    // =========================
    // ADMIN PROFILE
    // =========================

    if (user.role === "admin") {

      const { name } = req.body;

      if (name !== undefined) {

        if (
          typeof name !== "string" ||
          name.trim().length === 0
        ) {
          return res.status(400).json({
            message: "Name is required",
          });
        }

        user.name = name.trim();
      }

    }


    // =========================
    // STUDENT PROFILE
    // =========================

    else {

      const {
        name,
        phone,
        college,
        branch,
        cgpa,
        graduationYear,
        skills,
        resumeUrl,
      } = req.body;


      // Name

      if (name !== undefined) {

        if (
          typeof name !== "string" ||
          name.trim().length === 0
        ) {
          return res.status(400).json({
            message: "Name is required",
          });
        }

        user.name = name.trim();
      }


      // Phone

      if (phone !== undefined) {
        user.phone = phone;
      }


      // College

      if (college !== undefined) {
        user.college = college;
      }


      // Branch

      if (branch !== undefined) {
        user.branch = branch;
      }


      // CGPA

      if (cgpa !== undefined) {

        const numericCgpa =
          Number(cgpa);

        if (
          Number.isNaN(numericCgpa) ||
          numericCgpa < 0 ||
          numericCgpa > 10
        ) {
          return res.status(400).json({
            message:
              "CGPA must be between 0 and 10",
          });
        }

        user.cgpa = numericCgpa;
      }


      // Graduation Year

      if (
        graduationYear !== undefined
      ) {

        const numericYear =
          Number(graduationYear);

        if (
          Number.isNaN(numericYear) ||
          numericYear < 2020 ||
          numericYear > 2100
        ) {
          return res.status(400).json({
            message:
              "Invalid graduation year",
          });
        }

        user.graduationYear =
          numericYear;
      }


      // Skills

      if (skills !== undefined) {

        if (!Array.isArray(skills)) {
          return res.status(400).json({
            message:
              "Skills must be an array",
          });
        }

        user.skills = skills
          .filter(
            (skill) =>
              typeof skill === "string"
          )
          .map((skill) =>
            skill.trim()
          )
          .filter(
            (skill) =>
              skill.length > 0
          );
      }


      // Resume URL

      if (resumeUrl !== undefined) {

        if (
          resumeUrl !== "" &&
          typeof resumeUrl !== "string"
        ) {
          return res.status(400).json({
            message:
              "Resume URL must be text",
          });
        }

        user.resumeUrl = resumeUrl;
      }
    }


    // =========================
    // SAVE
    // =========================

    const updatedUser =
      await user.save();


    // =========================
    // RESPONSE
    // =========================

    res.status(200).json({
      message:
        "Profile Updated Successfully",

      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        phone: updatedUser.phone,
        college: updatedUser.college,
        branch: updatedUser.branch,
        cgpa: updatedUser.cgpa,
        graduationYear:
          updatedUser.graduationYear,
        skills: updatedUser.skills,
        resumeUrl:
          updatedUser.resumeUrl,
      },
    });

  } catch (error) {

    console.error(
      "UPDATE PROFILE ERROR:",
      error.message
    );

    res.status(500).json({
      message: "Failed to update profile",
    });
  }
};


module.exports = {
  getProfile,
  updateProfile,
};