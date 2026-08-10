import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import API from "../services/api";
import ApplicationList from "../components/ApplicationList";
import AdminApplicationList from "../components/AdminApplicationList";
import toast from "react-hot-toast";

function Applications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchParams, setSearchParams] = useSearchParams();

  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.role === "admin";

  // =========================
  // Get status from URL
  // =========================

  const urlStatus = searchParams.get("status") || "All";

  const [statusFilter, setStatusFilter] = useState(urlStatus);
  const [search, setSearch] = useState("");

  // =========================
  // Fetch Applications
  // =========================

  const fetchApplications = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const endpoint = isAdmin
        ? "/application/all"
        : "/application/my-applications";

      const res = await API.get(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setApplications(res.data);
    } catch (err) {
      console.log(err);

      toast.error(
        err.response?.data?.message ||
          "Failed to load applications"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  // =========================
  // Update Application Status
  // =========================

  const updateStatus = async (id, status, remarks) => {
    try {
      const token = localStorage.getItem("token");

      await API.put(
        `/application/${id}/status`,
        {
          status,
          remarks,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Application Updated");

      await fetchApplications();
    } catch (err) {
      console.log(err);

      toast.error(
        err.response?.data?.message ||
          "Update Failed"
      );

      throw err;
    }
  };

  // =========================
  // Handle Status Filter
  // =========================

  const handleStatusChange = (status) => {
    setStatusFilter(status);

    if (status === "All") {
      searchParams.delete("status");
      setSearchParams(searchParams);
    } else {
      setSearchParams({ status });
    }
  };

  // =========================
  // Clear Filters
  // =========================

  const clearFilters = () => {
    setStatusFilter("All");
    setSearch("");
    setSearchParams({});
  };

  // =========================
  // Filter Applications
  // =========================

  const filteredApplications = applications.filter(
    (application) => {
      // Status filter
      const matchesStatus =
        statusFilter === "All" ||
        application.status === statusFilter;

      // Search text
      const searchText = search.toLowerCase();

      const companyName =
        application.company?.companyName?.toLowerCase() ||
        "";

      const studentName =
        application.student?.name?.toLowerCase() ||
        "";

      const studentEmail =
        application.student?.email?.toLowerCase() ||
        "";

      const matchesSearch =
        companyName.includes(searchText) ||
        studentName.includes(searchText) ||
        studentEmail.includes(searchText);

      return matchesStatus && matchesSearch;
    }
  );

  return (
    <div>

      {/* =========================
          PAGE HEADER
      ========================= */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

        <h1 className="text-4xl font-bold">
          Applications
        </h1>

        <div className="text-gray-500">
          {loading
            ? "Loading..."
            : `${filteredApplications.length} application${
                filteredApplications.length !== 1
                  ? "s"
                  : ""
              }`}
        </div>

      </div>


      {/* =========================
          FILTER SECTION
      ========================= */}

      <div className="bg-white rounded-xl shadow-md p-5 mb-8">

        <div className="flex flex-col md:flex-row gap-4">

          {/* Search */}

          <input
            type="text"
            placeholder={
              isAdmin
                ? "Search student or company..."
                : "Search company..."
            }
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            disabled={loading}
            className="flex-1 border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          />


          {/* Status */}

          <select
            value={statusFilter}
            onChange={(e) =>
              handleStatusChange(e.target.value)
            }
            disabled={loading}
            className="border border-gray-300 rounded-lg px-4 py-3 bg-white outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          >

            <option value="All">
              All Statuses
            </option>

            <option value="Applied">
              Applied
            </option>

            <option value="Shortlisted">
              Shortlisted
            </option>

            <option value="Interview">
              Interview
            </option>

            <option value="Selected">
              Selected
            </option>

            <option value="Rejected">
              Rejected
            </option>

          </select>


          {/* Clear */}

          {(statusFilter !== "All" || search) && (
            <button
              onClick={clearFilters}
              disabled={loading}
              className="bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 text-gray-800 px-5 py-3 rounded-lg font-medium"
            >
              Clear Filters
            </button>
          )}

        </div>


        {/* Current Filter */}

        {statusFilter !== "All" && !loading && (
          <div className="mt-4 text-gray-600">

            Showing:

            <span className="ml-2 inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-lg font-medium">
              {statusFilter}
            </span>

          </div>
        )}

      </div>


      {/* =========================
          LOADING / RESULTS
      ========================= */}

      {loading ? (

        <div className="bg-white rounded-xl shadow-md p-10 text-center">

          <div className="flex justify-center mb-4">

            <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>

          </div>

          <h2 className="text-xl font-semibold text-gray-700">
            Loading applications...
          </h2>

          <p className="text-gray-500 mt-2">
            Please wait while we fetch your applications.
          </p>

        </div>

      ) : filteredApplications.length === 0 ? (

        <div className="bg-white rounded-xl shadow-md p-10 text-center">

          <h2 className="text-2xl font-semibold text-gray-700">
            No applications found
          </h2>

          <p className="text-gray-500 mt-2">
            Try changing your search or status filter.
          </p>

          {(statusFilter !== "All" || search) && (
            <button
              onClick={clearFilters}
              className="mt-5 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
            >
              Clear Filters
            </button>
          )}

        </div>

      ) : (

        isAdmin ? (

          <AdminApplicationList
            applications={filteredApplications}
            updateStatus={updateStatus}
          />

        ) : (

          <ApplicationList
            applications={filteredApplications}
          />

        )

      )}

    </div>
  );
}

export default Applications;