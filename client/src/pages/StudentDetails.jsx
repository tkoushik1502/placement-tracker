import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/api";
import toast from "react-hot-toast";

function StudentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // =========================
  // Fetch Student Details
  // =========================

  useEffect(() => {
    const fetchStudentDetails = async () => {
      try {
        const token = localStorage.getItem("token");

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        // Fetch student details
        const studentRes = await API.get(
          `/student/${id}`,
          config
        );

        setStudent(studentRes.data.student);

        // Fetch student's applications
        const applicationRes = await API.get(
          `/application/student/${id}`,
          config
        );

        setApplications(
          applicationRes.data.applications || []
        );
      } catch (error) {
        console.log(
          "STUDENT DETAILS ERROR:",
          error
        );

        toast.error(
          error.response?.data?.message ||
            "Failed to load student"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStudentDetails();
  }, [id]);

  // =========================
  // Loading
  // =========================

  if (loading) {
    return (
      <div>

        <div className="mb-8">
          <h1 className="text-4xl font-bold">
            Student Details
          </h1>

          <p className="text-gray-500 mt-2">
            View complete student information
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-10 text-center">

          <div className="flex justify-center mb-4">
            <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          </div>

          <p className="text-gray-500">
            Loading student...
          </p>

        </div>

      </div>
    );
  }

  // =========================
  // Student Not Found
  // =========================

  if (!student) {
    return (
      <div>

        <div className="mb-8">
          <h1 className="text-4xl font-bold">
            Student Details
          </h1>

          <p className="text-gray-500 mt-2">
            View complete student information
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-8 text-center">

          <h2 className="text-2xl font-semibold text-gray-700">
            Student Not Found
          </h2>

          <p className="text-gray-500 mt-2">
            The requested student could not be found.
          </p>

          <button
            onClick={() =>
              navigate("/students")
            }
            className="mt-5 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
          >
            Back to Students
          </button>

        </div>

      </div>
    );
  }

  // =========================
  // Application Status Style
  // =========================

  const getStatusStyle = (status) => {
    switch (status) {
      case "Selected":
        return "bg-green-100 text-green-700";

      case "Rejected":
        return "bg-red-100 text-red-700";

      case "Shortlisted":
        return "bg-orange-100 text-orange-700";

      case "Interview":
        return "bg-purple-100 text-purple-700";

      default:
        return "bg-blue-100 text-blue-700";
    }
  };

  return (
    <div>

      {/* =========================
          HEADER
      ========================= */}

      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-8">

        <div>

          <h1 className="text-4xl font-bold">
            Student Details
          </h1>

          <p className="text-gray-500 mt-2">
            View complete student information
          </p>

        </div>

        <button
          onClick={() =>
            navigate("/students")
          }
          className="self-start bg-gray-200 hover:bg-gray-300 text-gray-700 px-5 py-2 rounded-lg"
        >
          Back to Students
        </button>

      </div>


      {/* =========================
          STUDENT CARD
      ========================= */}

      <div className="bg-white rounded-xl shadow p-6 sm:p-8">

        {/* =========================
            STUDENT HEADER
        ========================= */}

        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-8">

          <div>

            <h2 className="text-3xl font-bold">
              {student.name}
            </h2>

            <p className="text-gray-500 mt-1">
              {student.email}
            </p>

          </div>

          <span className="self-start bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-semibold">
            Student
          </span>

        </div>


        {/* =========================
            PERSONAL INFORMATION
        ========================= */}

        <div>

          <h3 className="text-2xl font-semibold mb-5">
            Personal Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Phone */}

            <div>

              <p className="text-sm text-gray-500">
                Phone
              </p>

              <p className="font-medium mt-1">
                {student.phone ||
                  "Not provided"}
              </p>

            </div>


            {/* College */}

            <div>

              <p className="text-sm text-gray-500">
                College
              </p>

              <p className="font-medium mt-1">
                {student.college ||
                  "Not provided"}
              </p>

            </div>


            {/* Branch */}

            <div>

              <p className="text-sm text-gray-500">
                Branch
              </p>

              <p className="font-medium mt-1">
                {student.branch ||
                  "Not provided"}
              </p>

            </div>


            {/* CGPA */}

            <div>

              <p className="text-sm text-gray-500">
                CGPA
              </p>

              <p className="font-medium mt-1">
                {student.cgpa ||
                  "Not provided"}
              </p>

            </div>


            {/* Graduation Year */}

            <div>

              <p className="text-sm text-gray-500">
                Graduation Year
              </p>

              <p className="font-medium mt-1">
                {student.graduationYear ||
                  "Not provided"}
              </p>

            </div>

          </div>

        </div>


        {/* =========================
            SKILLS
        ========================= */}

        <div className="mt-8">

          <h3 className="text-2xl font-semibold mb-4">
            Skills
          </h3>

          <div className="flex flex-wrap gap-2">

            {student.skills?.length > 0 ? (

              student.skills.map(
                (skill, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full"
                  >
                    {skill}
                  </span>
                )
              )

            ) : (

              <p className="text-gray-400">
                No skills added
              </p>

            )}

          </div>

        </div>


        {/* =========================
            RESUME
        ========================= */}

        <div className="mt-8">

          <h3 className="text-2xl font-semibold mb-4">
            Resume
          </h3>

          {student.resumeUrl ? (

            <a
              href={student.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
            >
              View Resume
            </a>

          ) : (

            <p className="text-gray-400">
              Resume not uploaded
            </p>

          )}

        </div>

      </div>


      {/* =========================
          APPLICATIONS
      ========================= */}

      <div className="bg-white rounded-xl shadow p-6 sm:p-8 mt-8">

        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">

          <div>

            <h3 className="text-2xl font-semibold">
              Applications
            </h3>

            <p className="text-gray-500 mt-1">
              Companies this student has applied to
            </p>

          </div>

          <span className="self-start sm:self-auto bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-semibold">
            {applications.length}{" "}
            {applications.length === 1
              ? "Application"
              : "Applications"}
          </span>

        </div>


        {/* =========================
            NO APPLICATIONS
        ========================= */}

        {applications.length === 0 ? (

          <div className="text-center py-10">

            <p className="text-gray-400">
              No applications found.
            </p>

          </div>

        ) : (

          /* =========================
             APPLICATION LIST
          ========================= */

          <div className="space-y-4">

            {applications.map(
              (application) => (

                <div
                  key={application._id}
                  className="border rounded-xl p-5 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4"
                >

                  {/* Company Information */}

                  <div>

                    <h4 className="text-xl font-semibold">
                      {application.company
                        ?.companyName ||
                        "Unknown Company"}
                    </h4>

                    <p className="text-gray-500 mt-1">
                      {application.company?.role ||
                        "Role not specified"}
                    </p>

                    {application.company
                      ?.package !== undefined && (

                      <p className="text-gray-500 mt-1">
                        Package: ₹
                        {
                          application.company
                            .package
                        }{" "}
                        LPA
                      </p>

                    )}

                  </div>


                  {/* Status + Date */}

                  <div className="text-left sm:text-right">

                    <span
                      className={`inline-block px-4 py-2 rounded-full font-semibold ${getStatusStyle(
                        application.status
                      )}`}
                    >
                      {application.status}
                    </span>

                    <p className="text-sm text-gray-400 mt-2">
                      Applied{" "}
                      {application.createdAt
                        ? new Date(
                            application.createdAt
                          ).toLocaleDateString()
                        : ""}
                    </p>

                    {/* View Application */}

                    <button
                      onClick={() =>
                        navigate(
                          `/applications/${application._id}`
                        )
                      }
                      className="mt-3 text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      View Application →
                    </button>

                  </div>

                </div>

              )
            )}

          </div>

        )}

      </div>

    </div>
  );
}

export default StudentDetails;