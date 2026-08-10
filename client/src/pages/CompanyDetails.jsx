import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/api";
import toast from "react-hot-toast";

function CompanyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.role === "admin";

  const [company, setCompany] = useState(null);
  const [profile, setProfile] = useState(null);
  const [applications, setApplications] = useState([]);

  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);

  // =========================
  // Fetch Company + Student Data
  // =========================

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        // Fetch company
        const companyRes = await API.get(
          `/company/${id}`,
          config
        );

        setCompany(companyRes.data.company);

        // Student-specific data
        if (!isAdmin) {
          // Fetch profile
          const profileRes = await API.get(
            "/profile",
            config
          );

          setProfile(profileRes.data);

          // Fetch student's applications
          const applicationRes = await API.get(
            "/application/my-applications",
            config
          );

          setApplications(applicationRes.data);
        }
      } catch (error) {
        console.log(error);
        toast.error("Failed to load company");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, isAdmin]);

  // =========================
  // Check Already Applied
  // =========================

  const alreadyApplied = applications.some(
    (application) =>
      application.company?._id === id
  );

  // =========================
  // Check Eligibility
  // =========================

  const isEligible =
    profile &&
    company &&
    Number(profile.cgpa) >= Number(company.eligibilityCGPA);

  // =========================
  // Check Deadline
  // =========================

  const deadlinePassed = (() => {
    if (!company?.deadline) return false;

    const deadline = new Date(company.deadline);
    deadline.setHours(23, 59, 59, 999);
    
    return new Date() > deadline;
  })();

  // =========================
  // Apply
  // =========================

  const handleApply = async () => {
    if (isAdmin) return;

    if (!isEligible) {
      toast.error(
        "You are not eligible for this company"
      );
      return;
    }

    if (deadlinePassed) {
      toast.error("Application deadline has passed");
      return;
    }

    if (alreadyApplied) {
      toast.error("You have already applied");
      return;
    }

    try {
      setApplying(true);

      const token = localStorage.getItem("token");

      await API.post(
        "/application/apply",
        {
          companyId: id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Application Submitted");

      navigate("/applications");
    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data?.message ||
          "Application Failed"
      );
    } finally {
      setApplying(false);
    }
  };

  // =========================
  // Loading
  // =========================

  if (loading) {
    return (
      <div>
        <h1 className="text-4xl font-bold mb-8">
          Company Details
        </h1>

        <div className="bg-white rounded-xl shadow p-8 text-center">
          <p className="text-gray-500">
            Loading company...
          </p>
        </div>
      </div>
    );
  }

  // =========================
  // Company Not Found
  // =========================

  if (!company) {
    return (
      <div>
        <h1 className="text-4xl font-bold mb-8">
          Company Details
        </h1>

        <div className="bg-white rounded-xl shadow p-8 text-center">
          <p className="text-gray-500">
            Company not found.
          </p>

          <button
            onClick={() => navigate("/companies")}
            className="mt-5 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
          >
            Back to Companies
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>

      {/* =========================
          HEADER
      ========================= */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

        <div>
          <h1 className="text-4xl font-bold">
            Company Details
          </h1>

          <p className="text-gray-500 mt-2">
            View complete company information
          </p>
        </div>

        <button
          onClick={() => navigate("/companies")}
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-5 py-2 rounded-lg"
        >
          Back to Companies
        </button>

      </div>


      {/* =========================
          COMPANY CARD
      ========================= */}

      <div className="bg-white rounded-xl shadow p-8">

        {/* Company Header */}

        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8">

          <div>

            <h2 className="text-3xl font-bold">
              {company.companyName}
            </h2>

            <p className="text-gray-500 mt-2 text-lg">
              {company.role}
            </p>

          </div>

          <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-semibold">
            Hiring
          </span>

        </div>


        {/* =========================
            COMPANY INFORMATION
        ========================= */}

        <div>

          <h3 className="text-2xl font-semibold mb-5">
            Company Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div>
              <p className="text-sm text-gray-500">
                Location
              </p>

              <p className="font-medium mt-1">
                {company.location || "Not provided"}
              </p>
            </div>


            <div>
              <p className="text-sm text-gray-500">
                Package
              </p>

              <p className="font-medium mt-1">
                ₹{company.package} LPA
              </p>
            </div>


            <div>
              <p className="text-sm text-gray-500">
                Minimum CGPA
              </p>

              <p className="font-medium mt-1">
                {company.eligibilityCGPA}
              </p>
            </div>


            <div>
              <p className="text-sm text-gray-500">
                Application Deadline
              </p>

              <p
                className={`font-medium mt-1 ${
                  deadlinePassed
                    ? "text-red-600"
                    : "text-green-600"
                }`}
              >
                {company.deadline
                  ? new Date(
                      company.deadline
                    ).toLocaleDateString()
                  : "Not provided"}

                {deadlinePassed && (
                  <span className="ml-2">
                    (Expired)
                  </span>
                )}
              </p>
            </div>

          </div>

        </div>


        {/* =========================
            JOB DESCRIPTION
        ========================= */}

        <div className="mt-8">

          <h3 className="text-2xl font-semibold mb-4">
            Job Description
          </h3>

          <p className="text-gray-600 leading-relaxed">
            {company.description ||
              "No description provided."}
          </p>

        </div>


        {/* =========================
            STUDENT ELIGIBILITY
        ========================= */}

        {!isAdmin && profile && (

          <div className="mt-8 border-t pt-8">

            <h3 className="text-2xl font-semibold mb-5">
              Your Eligibility
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

              {/* Your CGPA */}

              <div className="border rounded-xl p-5">

                <p className="text-sm text-gray-500">
                  Your CGPA
                </p>

                <p className="text-2xl font-bold mt-2">
                  {profile.cgpa || 0}
                </p>

              </div>


              {/* Required CGPA */}

              <div className="border rounded-xl p-5">

                <p className="text-sm text-gray-500">
                  Required CGPA
                </p>

                <p className="text-2xl font-bold mt-2">
                  {company.eligibilityCGPA}
                </p>

              </div>


              {/* Eligibility */}

              <div
                className={`border rounded-xl p-5 ${
                  isEligible
                    ? "border-green-300 bg-green-50"
                    : "border-red-300 bg-red-50"
                }`}
              >

                <p className="text-sm text-gray-500">
                  Eligibility
                </p>

                <p
                  className={`text-xl font-bold mt-2 ${
                    isEligible
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {isEligible
                    ? "Eligible"
                    : "Not Eligible"}
                </p>

              </div>

            </div>

          </div>
        )}


        {/* =========================
            ACTIONS
        ========================= */}

        <div className="mt-8 border-t pt-6 flex flex-wrap gap-4">

          {/* =========================
              STUDENT
          ========================= */}

          {!isAdmin && (

            <button
              onClick={handleApply}
              disabled={
                applying ||
                alreadyApplied ||
                !isEligible ||
                deadlinePassed
              }
              className={`px-6 py-3 rounded-lg font-semibold text-white transition ${
                alreadyApplied
                  ? "bg-green-600"
                  : !isEligible || deadlinePassed
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >

              {applying
                ? "Applying..."
                : alreadyApplied
                ? "Already Applied"
                : deadlinePassed
                ? "Applications Closed"
                : !isEligible
                ? "Not Eligible"
                : "Apply Now"}

            </button>

          )}


          {/* =========================
              ADMIN
          ========================= */}

          {isAdmin && (
            <>
              <button
                onClick={() =>
                  navigate("/companies")
                }
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg font-semibold"
              >
                Edit Company
              </button>

              <button
                onClick={() =>
                  navigate("/companies")
                }
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg font-semibold"
              >
                Back to Companies
              </button>
            </>
          )}

        </div>

      </div>

    </div>
  );
}

export default CompanyDetails;