import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import DashboardCard from "../components/DashboardCard";

function Dashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.role === "admin";

  // =========================
  // Fetch Dashboard
  // =========================

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await API.get("/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setStats(res.data);
      } catch (err) {
        console.log("Dashboard Error:", err);

        setError(
          err.response?.data?.message ||
            "Failed to load dashboard"
        );
      }
    };

    fetchDashboard();
  }, []);

  // =========================
  // Error State
  // =========================

  if (error) {
    return (
      <div className="p-8">

        <h1 className="text-4xl font-bold mb-4">
          {isAdmin
            ? "Admin Dashboard"
            : "Student Dashboard"}
        </h1>

        <div className="bg-white rounded-xl shadow-md p-8 text-center">

          <h2 className="text-2xl font-semibold text-red-600">
            Unable to load dashboard
          </h2>

          <p className="text-gray-500 mt-2">
            {error}
          </p>

          <button
            onClick={() => window.location.reload()}
            className="mt-5 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
          >
            Try Again
          </button>

        </div>

      </div>
    );
  }

  // =========================
  // Loading State
  // =========================

  if (!stats) {
    return (
      <div className="p-8">

        <h1 className="text-4xl font-bold mb-4">
          {isAdmin
            ? "Admin Dashboard"
            : "Student Dashboard"}
        </h1>

        <div className="bg-white rounded-xl shadow-md p-8 text-center">

          <div className="flex justify-center mb-4">
            <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          </div>

          <h2 className="text-xl font-semibold text-gray-700">
            Loading dashboard...
          </h2>

          <p className="text-gray-500 mt-2">
            Please wait while we fetch your dashboard.
          </p>

        </div>

      </div>
    );
  }

  // =========================
  // Status Badge
  // =========================

  const getStatusClass = (status) => {
    switch (status) {
      case "Selected":
        return "bg-green-100 text-green-700";

      case "Rejected":
        return "bg-red-100 text-red-700";

      case "Interview":
        return "bg-purple-100 text-purple-700";

      case "Shortlisted":
        return "bg-orange-100 text-orange-700";

      default:
        return "bg-blue-100 text-blue-700";
    }
  };

  // =========================
  // Status Bar
  // =========================

  const getStatusBarClass = (status) => {
    switch (status) {
      case "Selected":
        return "bg-green-500";

      case "Rejected":
        return "bg-red-500";

      case "Interview":
        return "bg-purple-500";

      case "Shortlisted":
        return "bg-orange-500";

      default:
        return "bg-blue-500";
    }
  };

  // =========================
  // Navigate to Applications
  // =========================

  const goToStatus = (status) => {
    navigate(`/applications?status=${status}`);
  };

  return (
    <div>

      {/* =====================================================
          DASHBOARD HEADING
      ===================================================== */}

      <div className="mb-8">

        <h1 className="text-4xl font-bold">
          {isAdmin
            ? "Admin Dashboard"
            : "Student Dashboard"}
        </h1>

        <p className="text-gray-500 mt-2">
          {isAdmin
            ? "Overview of students, companies and placement applications."
            : "Track your placement applications and progress."}
        </p>

      </div>


      {/* =====================================================
          ADMIN DASHBOARD
      ===================================================== */}

      {isAdmin ? (
        <>

          {/* =========================
              MAIN STATISTICS
          ========================= */}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

            <DashboardCard
              title="Students"
              value={stats.totalStudents}
              color="border-blue-500"
              onClick={() =>
                navigate("/students")
              }
            />

            <DashboardCard
              title="Companies"
              value={stats.totalCompanies}
              color="border-green-500"
              onClick={() =>
                navigate("/companies")
              }
            />

            <DashboardCard
              title="Applications"
              value={stats.totalApplications}
              color="border-yellow-500"
              onClick={() =>
                navigate("/applications")
              }
            />

            <DashboardCard
              title="Selected"
              value={stats.selectedApplications}
              color="border-purple-500"
              onClick={() =>
                navigate(
                  "/applications?status=Selected"
                )
              }
            />

            <DashboardCard
              title="Shortlisted"
              value={stats.shortlistedApplications}
              color="border-orange-500"
              onClick={() =>
                navigate(
                  "/applications?status=Shortlisted"
                )
              }
            />

            <DashboardCard
              title="Interview"
              value={stats.interviewApplications}
              color="border-blue-500"
              onClick={() =>
                navigate(
                  "/applications?status=Interview"
                )
              }
            />

            <DashboardCard
              title="Rejected"
              value={stats.rejectedApplications}
              color="border-red-500"
              onClick={() =>
                navigate(
                  "/applications?status=Rejected"
                )
              }
            />

            <DashboardCard
              title="Placement Rate"
              value={`${stats.placementRate || 0}%`}
              color="border-green-500"
            />

          </div>


          {/* =========================
              PLACEMENT RATE
          ========================= */}

          <div className="mt-10 bg-white rounded-xl shadow-md p-6">

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

              <div>

                <h2 className="text-2xl font-bold">
                  Placement Rate
                </h2>

                <p className="text-gray-500 mt-1">
                  Percentage of students selected
                </p>

              </div>

              <div className="text-4xl font-bold text-green-600">
                {stats.placementRate || 0}%
              </div>

            </div>


            <div className="mt-6">

              <div className="w-full bg-gray-200 rounded-full h-4">

                <div
                  className="bg-green-500 h-4 rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(
                      stats.placementRate || 0,
                      100
                    )}%`,
                  }}
                />

              </div>

            </div>

          </div>


          {/* =====================================================
              APPLICATION OVERVIEW
          ===================================================== */}

          <div className="mt-10 bg-white rounded-xl shadow-md p-6">

            <div className="mb-6">

              <h2 className="text-2xl font-bold">
                Application Overview
              </h2>

              <p className="text-gray-500 mt-1">
                Current application status breakdown
              </p>

            </div>


            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">

              {/* Applied */}

              <div
                onClick={() =>
                  goToStatus("Applied")
                }
                className="border rounded-xl p-5 cursor-pointer hover:shadow-md hover:border-blue-400 transition"
              >

                <div className="flex items-center justify-between">

                  <p className="text-gray-500">
                    Applied
                  </p>

                  <span className="w-3 h-3 rounded-full bg-blue-500" />

                </div>

                <p className="text-3xl font-bold mt-3">
                  {stats.statusBreakdown?.Applied || 0}
                </p>

              </div>


              {/* Shortlisted */}

              <div
                onClick={() =>
                  goToStatus("Shortlisted")
                }
                className="border rounded-xl p-5 cursor-pointer hover:shadow-md hover:border-orange-400 transition"
              >

                <div className="flex items-center justify-between">

                  <p className="text-gray-500">
                    Shortlisted
                  </p>

                  <span className="w-3 h-3 rounded-full bg-orange-500" />

                </div>

                <p className="text-3xl font-bold mt-3">
                  {stats.statusBreakdown?.Shortlisted || 0}
                </p>

              </div>


              {/* Interview */}

              <div
                onClick={() =>
                  goToStatus("Interview")
                }
                className="border rounded-xl p-5 cursor-pointer hover:shadow-md hover:border-purple-400 transition"
              >

                <div className="flex items-center justify-between">

                  <p className="text-gray-500">
                    Interview
                  </p>

                  <span className="w-3 h-3 rounded-full bg-purple-500" />

                </div>

                <p className="text-3xl font-bold mt-3">
                  {stats.statusBreakdown?.Interview || 0}
                </p>

              </div>


              {/* Selected */}

              <div
                onClick={() =>
                  goToStatus("Selected")
                }
                className="border rounded-xl p-5 cursor-pointer hover:shadow-md hover:border-green-400 transition"
              >

                <div className="flex items-center justify-between">

                  <p className="text-gray-500">
                    Selected
                  </p>

                  <span className="w-3 h-3 rounded-full bg-green-500" />

                </div>

                <p className="text-3xl font-bold mt-3">
                  {stats.statusBreakdown?.Selected || 0}
                </p>

              </div>


              {/* Rejected */}

              <div
                onClick={() =>
                  goToStatus("Rejected")
                }
                className="border rounded-xl p-5 cursor-pointer hover:shadow-md hover:border-red-400 transition"
              >

                <div className="flex items-center justify-between">

                  <p className="text-gray-500">
                    Rejected
                  </p>

                  <span className="w-3 h-3 rounded-full bg-red-500" />

                </div>

                <p className="text-3xl font-bold mt-3">
                  {stats.statusBreakdown?.Rejected || 0}
                </p>

              </div>

            </div>

          </div>


          {/* =====================================================
              RECENT APPLICATIONS
          ===================================================== */}

          <div className="mt-10 bg-white rounded-xl shadow-md p-6">

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">

              <div>

                <h2 className="text-2xl font-bold">
                  Recent Applications
                </h2>

                <p className="text-gray-500 mt-1">
                  Latest student applications
                </p>

              </div>

              <button
                onClick={() =>
                  navigate("/applications")
                }
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                View All →
              </button>

            </div>


            {stats.recentApplications?.length > 0 ? (

              <div className="space-y-4">

                {stats.recentApplications.map(
                  (application) => (

                    <div
                      key={application._id}
                      onClick={() =>
                        navigate(
                          `/applications/${application._id}`
                        )
                      }
                      className="border rounded-xl p-5 hover:shadow-md hover:border-blue-300 transition cursor-pointer"
                    >

                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                        {/* Company + Student */}

                        <div>

                          <h3 className="text-xl font-semibold">
                            {application.company?.companyName ||
                              "Unknown Company"}
                          </h3>

                          <p className="text-gray-500">
                            {application.company?.role ||
                              "Role not provided"}
                          </p>

                          <p className="text-sm text-gray-500 mt-2">
                            Student:{" "}

                            <span className="font-medium text-gray-700">
                              {application.student?.name ||
                                "Unknown Student"}
                            </span>
                          </p>

                          <p className="text-sm text-gray-500">
                            {application.student?.email ||
                              "No email"}
                          </p>

                        </div>


                        {/* Status + Package + Date */}

                        <div className="text-left md:text-right">

                          <span
                            className={`inline-block px-4 py-2 rounded-full font-medium ${getStatusClass(
                              application.status
                            )}`}
                          >
                            {application.status}
                          </span>

                          <p className="text-sm text-gray-500 mt-3">
                            Package:{" "}

                            <span className="font-medium text-gray-700">
                              ₹
                              {application.company?.package ??
                                0}{" "}
                              LPA
                            </span>
                          </p>

                          <p className="text-sm text-gray-400 mt-1">
                            Applied{" "}

                            {application.createdAt
                              ? new Date(
                                  application.createdAt
                                ).toLocaleDateString()
                              : "N/A"}
                          </p>

                        </div>

                      </div>

                    </div>

                  )
                )}

              </div>

            ) : (

              <div className="text-center py-10 text-gray-500">
                No applications yet.
              </div>

            )}

          </div>


          {/* =====================================================
              TOP COMPANIES
          ===================================================== */}

          {stats.companyApplications?.length > 0 && (

            <div className="mt-10 bg-white rounded-xl shadow-md p-6">

              <div className="mb-6">

                <h2 className="text-2xl font-bold">
                  Top Companies
                </h2>

                <p className="text-gray-500 mt-1">
                  Companies receiving the most applications
                </p>

              </div>


              <div className="space-y-5">

                {stats.companyApplications.map(
                  (company) => (

                    <div
                      key={company.companyId}
                      onClick={() =>
                        navigate(
                          `/companies/${company.companyId}`
                        )
                      }
                      className="border rounded-xl p-5 hover:shadow-md hover:border-blue-300 transition cursor-pointer"
                    >

                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">

                        <div>

                          <h3 className="font-semibold text-lg">
                            {company.companyName}
                          </h3>

                          <p className="text-gray-500">
                            {company.role}
                          </p>

                        </div>


                        <div className="text-left md:text-right">

                          <p className="text-2xl font-bold">
                            {company.applications}
                          </p>

                          <p className="text-sm text-gray-500">
                            Applications
                          </p>

                        </div>

                      </div>


                      {/* Application Bar */}

                      <div className="mt-4">

                        <div className="w-full bg-gray-200 rounded-full h-2">

                          <div
                            className="bg-blue-500 h-2 rounded-full transition-all"
                            style={{
                              width: `${Math.min(
                                ((company.applications /
                                  (stats.totalApplications || 1)) *
                                  100),
                                100
                              )}%`,
                            }}
                          />

                        </div>

                      </div>

                    </div>

                  )
                )}

              </div>

            </div>

          )}

        </>

      ) : (

        /* =====================================================
           STUDENT DASHBOARD
        ===================================================== */

        <>

          {/* =========================
              STUDENT STATISTICS
          ========================= */}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

            <DashboardCard
              title="My Applications"
              value={stats.myApplications}
              color="border-blue-500"
              onClick={() =>
                navigate("/applications")
              }
            />

            <DashboardCard
              title="Applied"
              value={stats.appliedApplications}
              color="border-blue-500"
              onClick={() =>
                navigate(
                  "/applications?status=Applied"
                )
              }
            />

            <DashboardCard
              title="Shortlisted"
              value={stats.shortlistedApplications}
              color="border-orange-500"
              onClick={() =>
                navigate(
                  "/applications?status=Shortlisted"
                )
              }
            />

            <DashboardCard
              title="Interview"
              value={stats.interviewApplications}
              color="border-purple-500"
              onClick={() =>
                navigate(
                  "/applications?status=Interview"
                )
              }
            />

            <DashboardCard
              title="Selected"
              value={stats.selectedApplications}
              color="border-green-500"
              onClick={() =>
                navigate(
                  "/applications?status=Selected"
                )
              }
            />

            <DashboardCard
              title="Rejected"
              value={stats.rejectedApplications}
              color="border-red-500"
              onClick={() =>
                navigate(
                  "/applications?status=Rejected"
                )
              }
            />

          </div>


          {/* =========================
              SUCCESS RATE
          ========================= */}

          <div className="mt-10 bg-white rounded-xl shadow-md p-6">

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

              <div>

                <h2 className="text-2xl font-bold">
                  Application Success Rate
                </h2>

                <p className="text-gray-500 mt-1">
                  Percentage of your applications that resulted in selection
                </p>

              </div>

              <div className="text-4xl font-bold text-green-600">
                {stats.successRate || 0}%
              </div>

            </div>


            {/* Progress Bar */}

            <div className="mt-6">

              <div className="w-full bg-gray-200 rounded-full h-4">

                <div
                  className="bg-green-500 h-4 rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(
                      stats.successRate || 0,
                      100
                    )}%`,
                  }}
                />

              </div>

            </div>

          </div>


          {/* =====================================================
              RECENT STUDENT APPLICATIONS
          ===================================================== */}

          <div className="mt-10 bg-white rounded-xl shadow-md p-6">

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">

              <div>

                <h2 className="text-2xl font-bold">
                  My Recent Applications
                </h2>

                <p className="text-gray-500 mt-1">
                  Your latest placement applications
                </p>

              </div>

              <button
                onClick={() =>
                  navigate("/applications")
                }
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                View All →
              </button>

            </div>


            {stats.recentApplications?.length > 0 ? (

              <div className="space-y-4">

                {stats.recentApplications.map(
                  (application) => (

                    <div
                      key={application._id}
                      onClick={() =>
                        navigate(
                          `/applications/${application._id}`
                        )
                      }
                      className="border rounded-xl p-5 hover:shadow-md hover:border-blue-300 transition cursor-pointer"
                    >

                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                        <div>

                          <h3 className="text-xl font-semibold">
                            {application.company?.companyName ||
                              "Unknown Company"}
                          </h3>

                          <p className="text-gray-500">
                            {application.company?.role ||
                              "Role not provided"}
                          </p>

                          <p className="text-sm text-gray-500 mt-2">
                            Location:{" "}

                            <span className="font-medium text-gray-700">
                              {application.company?.location ||
                                "Not provided"}
                            </span>
                          </p>

                        </div>


                        <div className="text-left md:text-right">

                          <span
                            className={`inline-block px-4 py-2 rounded-full font-medium ${getStatusClass(
                              application.status
                            )}`}
                          >
                            {application.status}
                          </span>

                          <p className="text-sm text-gray-500 mt-3">
                            Package:{" "}

                            <span className="font-medium text-gray-700">
                              ₹
                              {application.company?.package ??
                                0}{" "}
                              LPA
                            </span>
                          </p>

                          <p className="text-sm text-gray-400 mt-1">
                            Applied{" "}

                            {application.createdAt
                              ? new Date(
                                  application.createdAt
                                ).toLocaleDateString()
                              : "N/A"}
                          </p>

                        </div>

                      </div>


                      <div className="mt-4 text-right">

                        <span className="text-blue-600 text-sm font-medium">
                          View Application →
                        </span>

                      </div>

                    </div>

                  )
                )}

              </div>

            ) : (

              <div className="text-center py-10 text-gray-500">

                <p>
                  No applications yet.
                </p>

                <button
                  onClick={() =>
                    navigate("/companies")
                  }
                  className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
                >
                  Browse Companies
                </button>

              </div>

            )}

          </div>

        </>

      )}

    </div>
  );
}

export default Dashboard;