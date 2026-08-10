import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import toast from "react-hot-toast";

function Students() {
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [branchFilter, setBranchFilter] = useState("");
  const [cgpaFilter, setCgpaFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================
  // Fetch Students
  // =========================

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const res = await API.get("/student", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setStudents(res.data.students);
    } catch (err) {
      console.log(err);

      const message =
        err.response?.data?.message ||
        "Failed to load students";

      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // =========================
  // Get Unique Branches
  // =========================

  const branches = [
    ...new Set(
      students
        .map((student) => student.branch)
        .filter(Boolean)
    ),
  ];

  // =========================
  // Get Graduation Years
  // =========================

  const graduationYears = [
    ...new Set(
      students
        .map((student) => student.graduationYear)
        .filter(Boolean)
    ),
  ].sort((a, b) => a - b);

  // =========================
  // Filter Students
  // =========================

  const filteredStudents = students.filter(
    (student) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        student.name
          ?.toLowerCase()
          .includes(searchText) ||
        student.email
          ?.toLowerCase()
          .includes(searchText) ||
        student.college
          ?.toLowerCase()
          .includes(searchText) ||
        student.branch
          ?.toLowerCase()
          .includes(searchText);

      const matchesBranch =
        !branchFilter ||
        student.branch === branchFilter;

      const matchesCgpa =
        !cgpaFilter ||
        Number(student.cgpa) >=
          Number(cgpaFilter);

      const matchesYear =
        !yearFilter ||
        Number(student.graduationYear) ===
          Number(yearFilter);

      return (
        matchesSearch &&
        matchesBranch &&
        matchesCgpa &&
        matchesYear
      );
    }
  );

  // =========================
  // Clear Filters
  // =========================

  const clearFilters = () => {
    setSearch("");
    setBranchFilter("");
    setCgpaFilter("");
    setYearFilter("");
  };

  // =========================
  // Loading
  // =========================

  if (loading) {
    return (
      <div>

        <div className="mb-8">
          <h1 className="text-4xl font-bold">
            Students
          </h1>

          <p className="text-gray-500 mt-2">
            Manage registered students
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-10 text-center">

          <div className="flex justify-center mb-4">
            <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          </div>

          <h2 className="text-xl font-semibold text-gray-700">
            Loading students...
          </h2>

          <p className="text-gray-500 mt-2">
            Please wait while we fetch registered students.
          </p>

        </div>

      </div>
    );
  }

  // =========================
  // Error
  // =========================

  if (error) {
    return (
      <div>

        <div className="mb-8">
          <h1 className="text-4xl font-bold">
            Students
          </h1>

          <p className="text-gray-500 mt-2">
            Manage registered students
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-10 text-center">

          <h2 className="text-2xl font-semibold text-red-600">
            Unable to load students
          </h2>

          <p className="text-gray-500 mt-2">
            {error}
          </p>

          <button
            onClick={fetchStudents}
            className="mt-5 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
          >
            Try Again
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

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">

        <div>

          <h1 className="text-4xl font-bold">
            Students
          </h1>

          <p className="text-gray-500 mt-2">
            Manage registered students
          </p>

        </div>

        <div className="text-gray-600">
          {filteredStudents.length} student
          {filteredStudents.length !== 1
            ? "s"
            : ""}
        </div>

      </div>


      {/* =========================
          SEARCH & FILTERS
      ========================= */}

      <div className="bg-white p-6 rounded-xl shadow mb-6">

        {/* Search */}

        <input
          type="text"
          placeholder="Search by name, email, college or branch..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 mb-5"
        />


        {/* Filters */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* Branch */}

          <div>

            <label className="block text-sm font-medium text-gray-600 mb-2">
              Branch
            </label>

            <select
              value={branchFilter}
              onChange={(e) =>
                setBranchFilter(
                  e.target.value
                )
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white outline-none focus:ring-2 focus:ring-blue-500"
            >

              <option value="">
                All Branches
              </option>

              {branches.map((branch) => (
                <option
                  key={branch}
                  value={branch}
                >
                  {branch}
                </option>
              ))}

            </select>

          </div>


          {/* CGPA */}

          <div>

            <label className="block text-sm font-medium text-gray-600 mb-2">
              Minimum CGPA
            </label>

            <select
              value={cgpaFilter}
              onChange={(e) =>
                setCgpaFilter(
                  e.target.value
                )
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white outline-none focus:ring-2 focus:ring-blue-500"
            >

              <option value="">
                Any CGPA
              </option>

              <option value="7">
                7.0+
              </option>

              <option value="7.5">
                7.5+
              </option>

              <option value="8">
                8.0+
              </option>

              <option value="8.5">
                8.5+
              </option>

              <option value="9">
                9.0+
              </option>

            </select>

          </div>


          {/* Graduation Year */}

          <div>

            <label className="block text-sm font-medium text-gray-600 mb-2">
              Graduation Year
            </label>

            <select
              value={yearFilter}
              onChange={(e) =>
                setYearFilter(
                  e.target.value
                )
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white outline-none focus:ring-2 focus:ring-blue-500"
            >

              <option value="">
                All Years
              </option>

              {graduationYears.map(
                (year) => (
                  <option
                    key={year}
                    value={year}
                  >
                    {year}
                  </option>
                )
              )}

            </select>

          </div>

        </div>


        {/* Clear Filters */}

        <div className="mt-5">

          <button
            onClick={clearFilters}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-5 py-2 rounded-lg font-medium"
          >
            Clear Filters
          </button>

        </div>

      </div>


      {/* =========================
          STUDENTS
      ========================= */}

      {filteredStudents.length === 0 ? (

        <div className="bg-white rounded-xl shadow p-10 text-center">

          <h2 className="text-2xl font-semibold text-gray-700">
            No students found
          </h2>

          <p className="text-gray-500 mt-2">
            Try changing your search or filters.
          </p>

          <button
            onClick={clearFilters}
            className="mt-5 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
          >
            Clear Filters
          </button>

        </div>

      ) : (

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

          {filteredStudents.map(
            (student) => (

              <div
                key={student._id}
                className="bg-white rounded-xl shadow p-6"
              >

                {/* =========================
                    STUDENT HEADER
                ========================= */}

                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-5">

                  <div>

                    <h2 className="text-2xl font-bold">
                      {student.name}
                    </h2>

                    <p className="text-gray-500">
                      {student.email}
                    </p>

                  </div>

                  <div className="self-start bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                    Student
                  </div>

                </div>


                {/* =========================
                    STUDENT DETAILS
                ========================= */}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                  <div>

                    <p className="text-sm text-gray-500">
                      Phone
                    </p>

                    <p className="font-medium">
                      {student.phone ||
                        "Not provided"}
                    </p>

                  </div>


                  <div>

                    <p className="text-sm text-gray-500">
                      College
                    </p>

                    <p className="font-medium">
                      {student.college ||
                        "Not provided"}
                    </p>

                  </div>


                  <div>

                    <p className="text-sm text-gray-500">
                      Branch
                    </p>

                    <p className="font-medium">
                      {student.branch ||
                        "Not provided"}
                    </p>

                  </div>


                  <div>

                    <p className="text-sm text-gray-500">
                      CGPA
                    </p>

                    <p className="font-medium">
                      {student.cgpa ||
                        "Not provided"}
                    </p>

                  </div>


                  <div>

                    <p className="text-sm text-gray-500">
                      Graduation Year
                    </p>

                    <p className="font-medium">
                      {student.graduationYear ||
                        "Not provided"}
                    </p>

                  </div>

                </div>


                {/* =========================
                    SKILLS
                ========================= */}

                <div className="mt-5">

                  <p className="text-sm text-gray-500 mb-2">
                    Skills
                  </p>

                  <div className="flex flex-wrap gap-2">

                    {student.skills?.length > 0 ? (

                      student.skills.map(
                        (skill, index) => (
                          <span
                            key={index}
                            className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                          >
                            {skill}
                          </span>
                        )
                      )

                    ) : (

                      <span className="text-gray-400">
                        No skills added
                      </span>

                    )}

                  </div>

                </div>


                {/* =========================
                    ACTIONS
                ========================= */}

                <div className="mt-6 flex flex-wrap gap-3">

                  <button
                    onClick={() =>
                      navigate(
                        `/students/${student._id}`
                      )
                    }
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                  >
                    View Details
                  </button>

                  {student.resumeUrl && (
                    <a
                      href={student.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg"
                    >
                      View Resume
                    </a>
                  )}

                </div>

              </div>

            )
          )}

        </div>

      )}

    </div>
  );
}

export default Students;