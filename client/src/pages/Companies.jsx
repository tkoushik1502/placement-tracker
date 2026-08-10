import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import AddCompanyModal from "../components/AddCompanyModal";
import toast from "react-hot-toast";

function Companies() {
  const navigate = useNavigate();

  const [companies, setCompanies] = useState([]);
  const [appliedCompanies, setAppliedCompanies] = useState([]);

  // Loading / applying states
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Delete modal
  const [deleteCompany, setDeleteCompany] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.role === "admin";

  // =========================
  // Fetch Companies
  // =========================

  const fetchCompanies = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await API.get("/company", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCompanies(res.data.companies);
    } catch (err) {
      console.log(err);

      toast.error(
        err.response?.data?.message ||
          "Failed to fetch companies"
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // Fetch Student Applications
  // =========================

  const fetchApplications = async () => {
    try {
      if (isAdmin) return;

      const token = localStorage.getItem("token");

      const res = await API.get(
        "/application/my-applications",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAppliedCompanies(
        res.data
          .filter((app) => app.company)
          .map((app) => app.company._id)
      );
    } catch (err) {
      console.log(err);
    }
  };

  // =========================
  // Initial Load
  // =========================

  useEffect(() => {
    fetchCompanies();

    if (!isAdmin) {
      fetchApplications();
    }
  }, []);

  // =========================
  // View Company Details
  // =========================

  const handleViewDetails = (companyId) => {
    navigate(`/companies/${companyId}`);
  };

  // =========================
  // Add Company
  // =========================

  const handleAddCompany = async (companyData) => {
    try {
      const token = localStorage.getItem("token");

      await API.post(
        "/company",
        companyData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Company Added Successfully");

      setIsModalOpen(false);

      await fetchCompanies();
    } catch (err) {
      console.log(err);

      toast.error(
        err.response?.data?.message ||
          "Failed to add company"
      );
    }
  };

  // =========================
  // Open Delete Modal
  // =========================

  const handleDeleteClick = (company) => {
    setDeleteCompany(company);
  };

  // =========================
  // Confirm Delete
  // =========================

  const handleConfirmDelete = async () => {
    if (!deleteCompany || isDeleting) return;

    try {
      setIsDeleting(true);

      const token = localStorage.getItem("token");

      await API.delete(
        `/company/${deleteCompany._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Company Deleted Successfully");

      setDeleteCompany(null);

      await fetchCompanies();
    } catch (err) {
      console.log(err);

      toast.error(
        err.response?.data?.message ||
          "Delete Failed"
      );
    } finally {
      setIsDeleting(false);
    }
  };

  // =========================
  // Open Edit Modal
  // =========================

  const handleEdit = (company) => {
    setSelectedCompany(company);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  // =========================
  // Update Company
  // =========================

  const handleUpdateCompany = async (companyData) => {
    try {
      const token = localStorage.getItem("token");

      await API.put(
        `/company/${selectedCompany._id}`,
        companyData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Company Updated Successfully");

      setIsModalOpen(false);
      setSelectedCompany(null);
      setIsEditing(false);

      await fetchCompanies();
    } catch (err) {
      console.log(err);

      toast.error(
        err.response?.data?.message ||
          "Update Failed"
      );
    }
  };

  // =========================
  // Apply Company
  // =========================

  const handleApply = async (companyId) => {
    if (applying) return;

    try {
      setApplying(true);

      const token = localStorage.getItem("token");

      await API.post(
        "/application/apply",
        {
          companyId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Application Submitted");

      await fetchApplications();
    } catch (err) {
      console.log(err);

      toast.error(
        err.response?.data?.message ||
          "Application Failed"
      );
    } finally {
      setApplying(false);
    }
  };

  // =========================
  // UI
  // =========================

  return (
    <div>

      {/* =========================
          PAGE HEADER
      ========================= */}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">

        <h1 className="text-4xl font-bold">
          Companies
        </h1>

        {isAdmin && (
          <button
            onClick={() => {
              setSelectedCompany(null);
              setIsEditing(false);
              setIsModalOpen(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
          >
            + Add Company
          </button>
        )}

      </div>


      {/* =========================
          COMPANY LIST
      ========================= */}

      <div className="grid gap-6">

        {/* =========================
            LOADING
        ========================= */}

        {loading ? (

          <div className="bg-white rounded-xl shadow p-10 text-center">

            <div className="flex justify-center mb-4">
              <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            </div>

            <h2 className="text-xl font-semibold text-gray-700">
              Loading companies...
            </h2>

            <p className="text-gray-500 mt-2">
              Please wait while we fetch available companies.
            </p>

          </div>

        ) : companies.length === 0 ? (

          /* =========================
              NO COMPANIES
          ========================= */

          <div className="bg-white rounded-xl shadow p-10 text-center">

            <p className="text-gray-500">
              No companies found.
            </p>

            {isAdmin && (
              <button
                onClick={() => {
                  setSelectedCompany(null);
                  setIsEditing(false);
                  setIsModalOpen(true);
                }}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
              >
                + Add Company
              </button>
            )}

          </div>

        ) : (

          /* =========================
              COMPANIES
          ========================= */

          companies.map((company) => (

            <div
              key={company._id}
              className="bg-white rounded-xl shadow-md p-6"
            >

              {/* Company Name */}

              <h2 className="text-3xl font-bold">
                {company.companyName}
              </h2>


              {/* Role */}

              <p className="mt-4">
                <span className="font-semibold">
                  Role:
                </span>{" "}
                {company.role}
              </p>


              {/* Package */}

              <p>
                <span className="font-semibold">
                  Package:
                </span>{" "}
                {company.package} LPA
              </p>


              {/* Location */}

              <p>
                <span className="font-semibold">
                  Location:
                </span>{" "}
                {company.location || "Not provided"}
              </p>


              {/* Eligibility */}

              <p>
                <span className="font-semibold">
                  Eligibility:
                </span>{" "}
                {company.eligibilityCGPA} CGPA
              </p>


              {/* Deadline */}

              <p>
                <span className="font-semibold">
                  Deadline:
                </span>{" "}
                {company.deadline
                  ? new Date(
                      company.deadline
                    ).toLocaleDateString()
                  : "Not provided"}
              </p>


              {/* Description */}

              <p className="mt-4 text-gray-600">
                {company.description ||
                  "No description provided."}
              </p>


              {/* =========================
                  BUTTONS
              ========================= */}

              <div className="flex flex-wrap gap-3 mt-6">

                {/* View Details */}

                <button
                  onClick={() =>
                    handleViewDetails(company._id)
                  }
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
                >
                  View Details
                </button>


                {/* Student Apply */}

                {!isAdmin && (
                  <button
                    onClick={() =>
                      handleApply(company._id)
                    }
                    disabled={
                      appliedCompanies.includes(
                        company._id
                      ) || applying
                    }
                    className={`px-5 py-2 rounded-lg text-white ${
                      appliedCompanies.includes(
                        company._id
                      ) || applying
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-green-600 hover:bg-green-700"
                    }`}
                  >
                    {appliedCompanies.includes(
                      company._id
                    )
                      ? "Applied"
                      : applying
                      ? "Applying..."
                      : "Apply"}
                  </button>
                )}


                {/* Admin Edit */}

                {isAdmin && (
                  <button
                    onClick={() =>
                      handleEdit(company)
                    }
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2 rounded-lg"
                  >
                    Edit
                  </button>
                )}


                {/* Admin Delete */}

                {isAdmin && (
                  <button
                    onClick={() =>
                      handleDeleteClick(company)
                    }
                    className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg"
                  >
                    Delete
                  </button>
                )}

              </div>

            </div>

          ))

        )}

      </div>


      {/* =========================
          ADD / EDIT MODAL
      ========================= */}

      {isAdmin && (
        <AddCompanyModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedCompany(null);
            setIsEditing(false);
          }}
          onAdd={handleAddCompany}
          onUpdate={handleUpdateCompany}
          company={selectedCompany}
          isEditing={isEditing}
        />
      )}


      {/* =========================
          DELETE CONFIRMATION MODAL
      ========================= */}

      {deleteCompany && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">

          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">

            {/* Header */}

            <div className="flex items-start gap-4">

              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">

                <span className="text-red-600 text-2xl">
                  !
                </span>

              </div>

              <div>

                <h2 className="text-2xl font-bold text-gray-900">
                  Delete Company?
                </h2>

                <p className="text-gray-500 mt-1">
                  This action cannot be undone.
                </p>

              </div>

            </div>


            {/* Company Information */}

            <div className="mt-6 bg-gray-50 border rounded-lg p-4">

              <p className="font-semibold text-gray-900">
                {deleteCompany.companyName}
              </p>

              <p className="text-gray-500 mt-1">
                {deleteCompany.role}
              </p>

            </div>


            {/* Warning */}

            <p className="text-gray-600 mt-5 leading-relaxed">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-gray-900">
                {deleteCompany.companyName}
              </span>
              ? This company will be permanently removed
              from the placement tracker.
            </p>


            {/* Actions */}

            <div className="flex justify-end gap-3 mt-7">

              <button
                onClick={() =>
                  setDeleteCompany(null)
                }
                disabled={isDeleting}
                className="bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 text-gray-800 px-5 py-2 rounded-lg font-medium"
              >
                Cancel
              </button>

              <button
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white px-5 py-2 rounded-lg font-medium"
              >
                {isDeleting
                  ? "Deleting..."
                  : "Delete Company"}
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default Companies;