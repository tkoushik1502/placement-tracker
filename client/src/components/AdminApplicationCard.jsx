import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminApplicationCard({ application, updateStatus }) {
  const navigate = useNavigate();

  const [status, setStatus] = useState(application.status);
  const [remarks, setRemarks] = useState(
    application.remarks || ""
  );

  const [saving, setSaving] = useState(false);

  // =========================
  // Save Status + Remarks
  // =========================

  const handleSave = async () => {
    if (saving) return;

    try {
      setSaving(true);

      await updateStatus(
        application._id,
        status,
        remarks
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // Status Styling
  // =========================

  const getStatusStyle = () => {
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

  return (
    <div className="bg-white rounded-xl shadow-md p-6">

      {/* =========================
          COMPANY HEADER
      ========================= */}

      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">

        <div>

          {/* Company */}

          <button
            onClick={() =>
              application.company?._id &&
              navigate(
                `/companies/${application.company._id}`
              )
            }
            className="text-2xl font-bold hover:text-blue-600 transition text-left"
          >
            {application.company?.companyName ||
              "Unknown Company"}
          </button>

          {/* Role */}

          <p className="text-gray-500 mt-1">
            {application.company?.role ||
              "Role not specified"}
          </p>

          {/* Package */}

          {application.company?.package !== undefined && (
            <p className="text-gray-500 mt-2">
              Package:{" "}
              <span className="font-semibold text-gray-700">
                ₹{application.company.package} LPA
              </span>
            </p>
          )}

        </div>


        {/* =========================
            STATUS BADGE
        ========================= */}

        <span
          className={`inline-block w-fit px-4 py-2 rounded-full font-semibold ${getStatusStyle()}`}
        >
          {status}
        </span>

      </div>


      {/* =========================
          STUDENT INFORMATION
      ========================= */}

      <div className="mt-6 border-t pt-5">

        <h3 className="text-lg font-semibold mb-4">
          Student Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          {/* Student Name */}

          <div>

            <p className="text-sm text-gray-500">
              Name
            </p>

            {application.student?._id ? (
              <button
                onClick={() =>
                  navigate(
                    `/students/${application.student._id}`
                  )
                }
                className="font-medium text-blue-600 hover:text-blue-800 hover:underline mt-1"
              >
                {application.student.name}
              </button>
            ) : (
              <p className="font-medium mt-1">
                N/A
              </p>
            )}

          </div>


          {/* Student Email */}

          <div>

            <p className="text-sm text-gray-500">
              Email
            </p>

            <p className="font-medium mt-1">
              {application.student?.email ||
                "N/A"}
            </p>

          </div>

        </div>

      </div>


      {/* =========================
          APPLICATION DATE
      ========================= */}

      <div className="mt-5">

        <p className="text-sm text-gray-400">
          Applied on{" "}
          {application.createdAt
            ? new Date(
                application.createdAt
              ).toLocaleDateString()
            : "N/A"}
        </p>

      </div>


      {/* =========================
          UPDATE APPLICATION
      ========================= */}

      <div className="mt-6 border-t pt-5">

        <h3 className="text-lg font-semibold mb-4">
          Update Application
        </h3>


        {/* =========================
            STATUS
        ========================= */}

        <div className="mb-5">

          <label className="block text-sm text-gray-500 mb-2">
            Status
          </label>

          <select
            value={status}
            onChange={(e) =>
              setStatus(e.target.value)
            }
            disabled={saving}
            className="w-full sm:w-auto border border-gray-300 rounded-lg px-4 py-2 bg-white outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          >

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

        </div>


        {/* =========================
            REMARKS
        ========================= */}

        <div className="mb-5">

          <label className="block text-sm text-gray-500 mb-2">
            Remarks
          </label>

          <textarea
            value={remarks}
            onChange={(e) =>
              setRemarks(e.target.value)
            }
            disabled={saving}
            placeholder="Add notes about this application..."
            rows={4}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 resize-none"
          />

        </div>


        {/* =========================
            SAVE
        ========================= */}

        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-5 py-2 rounded-lg font-medium transition"
        >
          {saving
            ? "Saving..."
            : "Save Changes"}
        </button>

      </div>


      {/* =========================
          QUICK ACTIONS
      ========================= */}

      <div className="mt-5 flex flex-wrap gap-3">

        {application.student?._id && (
          <button
            onClick={() =>
              navigate(
                `/students/${application.student._id}`
              )
            }
            className="border border-gray-300 hover:bg-gray-100 px-4 py-2 rounded-lg text-sm font-medium"
          >
            View Student
          </button>
        )}

        {application.company?._id && (
          <button
            onClick={() =>
              navigate(
                `/companies/${application.company._id}`
              )
            }
            className="border border-gray-300 hover:bg-gray-100 px-4 py-2 rounded-lg text-sm font-medium"
          >
            View Company
          </button>
        )}

      </div>

    </div>
  );
}

export default AdminApplicationCard;