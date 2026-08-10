const User = require("../models/User");
const Company = require("../models/Company");
const Application = require("../models/Application");

// =========================
// Get Dashboard Statistics
// =========================

const getDashboardStats = async (req, res) => {
  try {

    // =========================
    // ADMIN DASHBOARD
    // =========================

    if (req.user.role === "admin") {

      const totalStudents = await User.countDocuments({
        role: "student",
      });

      const totalCompanies =
        await Company.countDocuments();

      const totalApplications =
        await Application.countDocuments();

      const appliedApplications =
        await Application.countDocuments({
          status: "Applied",
        });

      const shortlistedApplications =
        await Application.countDocuments({
          status: "Shortlisted",
        });

      const interviewApplications =
        await Application.countDocuments({
          status: "Interview",
        });

      const selectedApplications =
        await Application.countDocuments({
          status: "Selected",
        });

      const rejectedApplications =
        await Application.countDocuments({
          status: "Rejected",
        });


      // =========================
      // PLACEMENT RATE
      // =========================

      const placementRate =
        totalStudents > 0
          ? Number(
              (
                (selectedApplications / totalStudents) *
                100
              ).toFixed(2)
            )
          : 0;


      // =========================
      // RECENT APPLICATIONS
      // =========================

      const recentApplications =
        await Application.find()
          .populate(
            "student",
            "name email"
          )
          .populate(
            "company",
            "companyName role package"
          )
          .sort({
            createdAt: -1,
          })
          .limit(5);


      // =========================
      // APPLICATION STATUS
      // =========================

      const statusBreakdown = {
        Applied: appliedApplications,
        Shortlisted: shortlistedApplications,
        Interview: interviewApplications,
        Selected: selectedApplications,
        Rejected: rejectedApplications,
      };


      // =========================
      // COMPANY-WISE APPLICATIONS
      // =========================

      const companyApplications =
        await Application.aggregate([

          {
            $group: {
              _id: "$company",
              applications: {
                $sum: 1,
              },
            },
          },

          {
            $sort: {
              applications: -1,
            },
          },

          {
            $limit: 10,
          },

          {
            $lookup: {
              from: "companies",
              localField: "_id",
              foreignField: "_id",
              as: "company",
            },
          },

          {
            $unwind: "$company",
          },

          {
            $project: {
              _id: 0,
              companyId: "$company._id",
              companyName:
                "$company.companyName",
              role: "$company.role",
              applications: 1,
            },
          },

        ]);


      // =========================
      // ADMIN RESPONSE
      // =========================

      return res.status(200).json({

        role: "admin",

        totalStudents,

        totalCompanies,

        totalApplications,

        appliedApplications,

        shortlistedApplications,

        interviewApplications,

        selectedApplications,

        rejectedApplications,

        placementRate,

        statusBreakdown,

        companyApplications,

        recentApplications,

      });
    }


    // =========================
    // STUDENT DASHBOARD
    // =========================

    const studentId = req.user.id;


    const myApplications =
      await Application.countDocuments({
        student: studentId,
      });


    const appliedApplications =
      await Application.countDocuments({
        student: studentId,
        status: "Applied",
      });


    const shortlistedApplications =
      await Application.countDocuments({
        student: studentId,
        status: "Shortlisted",
      });


    const interviewApplications =
      await Application.countDocuments({
        student: studentId,
        status: "Interview",
      });


    const selectedApplications =
      await Application.countDocuments({
        student: studentId,
        status: "Selected",
      });


    const rejectedApplications =
      await Application.countDocuments({
        student: studentId,
        status: "Rejected",
      });


    // =========================
    // STUDENT SUCCESS RATE
    // =========================

    const successRate =
      myApplications > 0
        ? Number(
            (
              (selectedApplications /
                myApplications) *
              100
            ).toFixed(2)
          )
        : 0;


    // =========================
    // STUDENT RECENT APPLICATIONS
    // =========================

    const recentApplications =
      await Application.find({
        student: studentId,
      })
        .populate(
          "company",
          "companyName role package location"
        )
        .sort({
          createdAt: -1,
        })
        .limit(5);


    // =========================
    // STUDENT RESPONSE
    // =========================

    return res.status(200).json({

      role: "student",

      myApplications,

      appliedApplications,

      shortlistedApplications,

      interviewApplications,

      selectedApplications,

      rejectedApplications,

      successRate,

      recentApplications,

    });

  } catch (error) {

    console.error(
      "Dashboard Error:",
      error
    );

    res.status(500).json({
      message: error.message,
    });
  }
};


module.exports = {
  getDashboardStats,
};