import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/api";
import toast from "react-hot-toast";

function ApplicationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);

  // =========================
  // Fetch Application
  // =========================

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const token = localStorage.getItem("token");

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const response = await API.get(
          `/application/${id}`,
          config
        );

        setApplication(response.data.application);
      } catch (error) {
        console.error(
          "GET APPLICATION ERROR:",
          error
        );

        toast.error(
          error.response?.data?.message ||
            "Failed to load application"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, [id]);

  // =========================
  // Loading
  // =========================

  if (loading) {
    return (
      <div className="p-8">

        <h1 className="text-4xl font-bold">
          Application Details
        </h1>

        <div className="bg-white rounded-xl shadow p-8 mt-6 text-center">

          <div className="flex justify-center mb-4">
            <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          </div>

          <p className="text-gray-500">
            Loading application...
          </p>

        </div>

      </div>
    );
  }

  // =========================
  // Not Found
  // =========================

  if (!application) {
    return (
      <div className="p-8">

        <div className="bg-white rounded-xl shadow p-10 text-center">

          <h1 className="text-3xl font-bold text-gray-700">
            Application Not Found
          </h1>

          <p className="text-gray-500 mt-2">
            This application could not be found.
          </p>

          <button
            onClick={() =>
              navigate("/applications")
            }
            className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
          >
            Back to Applications
          </button>

        </div>

      </div>
    );
  }

  // =========================
  // Status Styling
  // =========================

  const getStatusStyle = (status) => {
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
  // Timeline Dot Styling
  // =========================

  const getTimelineDotStyle = (status) => {
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

  return (
    <div>

      {/* =========================
          HEADER
      ========================= */}

      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8">

        <div>

          <h1 className="text-4xl font-bold">
            Application Details
          </h1>

          <p className="text-gray-500 mt-2">
            Track your application progress
          </p>

        </div>

        <button
          onClick={() =>
            navigate("/applications")
          }
          className="self-start bg-gray-200 hover:bg-gray-300 text-gray-700 px-5 py-2 rounded-lg"
        >
          Back to Applications
        </button>

      </div>


      {/* =========================
          COMPANY INFORMATION
      ========================= */}

      <div className="bg-white rounded-xl shadow p-6 sm:p-8">

        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">

          <div>

            <h2 className="text-3xl font-bold">
              {application.company?.companyName ||
                "Unknown Company"}
            </h2>

            <p className="text-gray-500 mt-2 text-lg">
              {application.company?.role ||
                "Role not specified"}
            </p>

          </div>

          <span
            className={`self-start px-5 py-2 rounded-full font-semibold ${getStatusStyle(
              application.status
            )}`}
          >
            {application.status}
          </span>

        </div>


        {/* =========================
            COMPANY DETAILS
        ========================= */}

        <div className="border-t mt-8 pt-6">

          <h3 className="text-xl font-semibold mb-5">
            Company Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">

            <div>

              <p className="text-sm text-gray-500">
                Location
              </p>

              <p className="font-medium mt-1">
                {application.company?.location ||
                  "Not provided"}
              </p>

            </div>


            <div>

              <p className="text-sm text-gray-500">
                Package
              </p>

              <p className="font-medium mt-1">
                {application.company?.package !==
                undefined
                  ? `₹${application.company.package} LPA`
                  : "Not provided"}
              </p>

            </div>


            <div>

              <p className="text-sm text-gray-500">
                Application Date
              </p>

              <p className="font-medium mt-1">
                {application.createdAt
                  ? new Date(
                      application.createdAt
                    ).toLocaleDateString()
                  : "N/A"}
              </p>

            </div>

          </div>

        </div>


        {/* =========================
            CURRENT REMARKS
        ========================= */}

        <div className="border-t mt-8 pt-6">

          <h3 className="text-xl font-semibold mb-4">
            Latest Admin Remarks
          </h3>

          <div className="bg-gray-50 border rounded-lg p-5">

            {application.remarks ? (
              <p className="text-gray-700">
                {application.remarks}
              </p>
            ) : (
              <p className="text-gray-400">
                No remarks added yet.
              </p>
            )}

          </div>

        </div>

      </div>


      {/* =========================
          APPLICATION TIMELINE
      ========================= */}

      <div className="bg-white rounded-xl shadow p-6 sm:p-8 mt-8">

        <h2 className="text-2xl font-semibold">
          Application Timeline
        </h2>

        <p className="text-gray-500 mt-1 mb-8">
          Track the progress of your application
        </p>


        <div className="space-y-0">

          {application.history &&
          application.history.length > 0 ? (

            [...application.history]
              .reverse()
              .map((entry, index) => (

                <div
                  key={index}
                  className="relative pl-10 pb-8"
                >

                  {/* Timeline line */}

                  {index !==
                    application.history.length - 1 && (
                    <div className="absolute left-[7px] top-4 w-0.5 h-full bg-gray-200" />
                  )}


                  {/* Timeline dot */}

                  <div
                    className={`absolute left-0 top-1 w-4 h-4 rounded-full ${getTimelineDotStyle(
                      entry.status
                    )}`}
                  />


                  {/* Timeline content */}

                  <div>

                    <div className="flex flex-wrap items-center gap-3">

                      <h3 className="font-semibold text-lg">
                        {entry.status}
                      </h3>

                      <span className="text-sm text-gray-400">
                        {entry.changedAt
                          ? new Date(
                              entry.changedAt
                            ).toLocaleDateString()
                          : ""}
                      </span>

                    </div>


                    {entry.remarks && (
                      <p className="text-gray-600 mt-2">
                        {entry.remarks}
                      </p>
                    )}

                  </div>

                </div>

              ))

          ) : (

            <p className="text-gray-400">
              No application history available.
            </p>

          )}

        </div>

      </div>

    </div>
  );
}

export default ApplicationDetails;