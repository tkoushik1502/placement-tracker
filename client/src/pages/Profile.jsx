import { useEffect, useState } from "react";
import API from "../services/api";
import toast from "react-hot-toast";

function Profile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statsLoading, setStatsLoading] = useState(true);

  const storedUser = JSON.parse(
    localStorage.getItem("user")
  );

  const isAdmin = storedUser?.role === "admin";

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    college: "",
    branch: "",
    cgpa: "",
    graduationYear: "",
    skills: [],
    resumeUrl: "",
    role: "",
  });

  const [skillsInput, setSkillsInput] = useState("");

  const [adminStats, setAdminStats] = useState({
    totalStudents: 0,
    totalCompanies: 0,
    totalApplications: 0,
    selectedApplications: 0,
  });

  // =========================
  // FETCH PROFILE
  // =========================

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await API.get("/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = res.data;

        setProfile({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          college: data.college || "",
          branch: data.branch || "",
          cgpa: data.cgpa || "",
          graduationYear:
            data.graduationYear || "",
          skills: data.skills || [],
          resumeUrl: data.resumeUrl || "",
          role: data.role || storedUser?.role || "",
        });

        setSkillsInput(
          (data.skills || []).join(", ")
        );
      } catch (error) {
        console.log(error);

        toast.error(
          error.response?.data?.message ||
            "Failed to load profile"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // =========================
  // FETCH ADMIN STATISTICS
  // =========================

  useEffect(() => {
    if (!isAdmin) {
      setStatsLoading(false);
      return;
    }

    const fetchAdminStats = async () => {
      try {
        setStatsLoading(true);

        const token = localStorage.getItem("token");

        const res = await API.get(
          "/dashboard",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = res.data;

        setAdminStats({
          totalStudents:
            data.totalStudents || 0,

          totalCompanies:
            data.totalCompanies || 0,

          totalApplications:
            data.totalApplications || 0,

          selectedApplications:
            data.selectedApplications || 0,
        });
      } catch (error) {
        console.log(
          "ADMIN STATS ERROR:",
          error
        );
      } finally {
        setStatsLoading(false);
      }
    };

    fetchAdminStats();
  }, [isAdmin]);

  // =========================
  // HANDLE INPUT
  // =========================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================
  // UPDATE PROFILE
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const token = localStorage.getItem("token");

      let updatedData;

      // =========================
      // ADMIN UPDATE
      // =========================

      if (isAdmin) {
        updatedData = {
          name: profile.name,
        };
      }

      // =========================
      // STUDENT UPDATE
      // =========================

      else {
        const skills = skillsInput
          .split(",")
          .map((skill) => skill.trim())
          .filter((skill) => skill !== "");

        updatedData = {
          name: profile.name,
          phone: profile.phone,
          college: profile.college,
          branch: profile.branch,
          cgpa: Number(profile.cgpa),
          graduationYear: Number(
            profile.graduationYear
          ),
          skills,
          resumeUrl: profile.resumeUrl,
        };
      }

      const res = await API.put(
        "/profile",
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedUser = res.data.user;

      setProfile((prev) => ({
        ...prev,
        name: updatedUser.name || "",
        email: updatedUser.email || "",
        phone: updatedUser.phone || "",
        college: updatedUser.college || "",
        branch: updatedUser.branch || "",
        cgpa: updatedUser.cgpa || "",
        graduationYear:
          updatedUser.graduationYear || "",
        skills: updatedUser.skills || [],
        resumeUrl:
          updatedUser.resumeUrl || "",
        role:
          updatedUser.role ||
          prev.role ||
          storedUser?.role ||
          "",
      }));

      setSkillsInput(
        (updatedUser.skills || []).join(", ")
      );

      // Update localStorage
      const currentStoredUser =
        JSON.parse(
          localStorage.getItem("user")
        ) || {};

      localStorage.setItem(
        "user",
        JSON.stringify({
          ...currentStoredUser,
          name: updatedUser.name,
          email:
            updatedUser.email ||
            currentStoredUser.email,
          role:
            updatedUser.role ||
            currentStoredUser.role,
        })
      );

      toast.success(
        "Profile Updated Successfully"
      );
    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data?.message ||
          "Failed to update profile"
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // VIEW RESUME
  // =========================

  const handleViewResume = () => {
    if (!profile.resumeUrl) {
      toast.error("Resume not available");
      return;
    }

    window.open(
      profile.resumeUrl,
      "_blank",
      "noopener,noreferrer"
    );
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="p-4 sm:p-8">

        <h1 className="text-4xl font-bold mb-6">
          My Profile
        </h1>

        <div className="bg-white rounded-xl shadow-md p-10 text-center max-w-4xl">

          <div className="flex justify-center mb-4">
            <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          </div>

          <p className="text-gray-500">
            Loading profile...
          </p>

        </div>

      </div>
    );
  }

  // =====================================================
  // ADMIN PROFILE
  // =====================================================

  if (isAdmin) {
    return (
      <div className="p-4 sm:p-8">

        {/* =========================
            HEADER
        ========================= */}

        <div className="mb-8">

          <h1 className="text-4xl font-bold">
            Admin Profile
          </h1>

          <p className="text-gray-500 mt-2">
            Manage your administrator account
          </p>

        </div>


        {/* =========================
            ADMIN PROFILE CARD
        ========================= */}

        <div className="bg-white rounded-xl shadow-md p-6 sm:p-8 max-w-4xl">

          {/* Admin Header */}

          <div className="flex flex-col sm:flex-row sm:items-center gap-5 mb-8">

            <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center">

              <span className="text-3xl font-bold text-blue-600">
                {profile.name
                  ? profile.name
                      .charAt(0)
                      .toUpperCase()
                  : "A"}
              </span>

            </div>

            <div>

              <h2 className="text-3xl font-bold">
                {profile.name ||
                  "Administrator"}
              </h2>

              <p className="text-gray-500 mt-1">
                {profile.email}
              </p>

              <span className="inline-block mt-3 bg-purple-100 text-purple-700 px-4 py-1.5 rounded-full text-sm font-semibold">
                Administrator
              </span>

            </div>

          </div>


          {/* =========================
              ACCOUNT INFORMATION
          ========================= */}

          <div className="border-t pt-6">

            <h3 className="text-2xl font-semibold mb-6">
              Account Information
            </h3>

            <form onSubmit={handleSubmit}>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Name */}

                <div>

                  <label className="block font-medium mb-2">
                    Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={profile.name}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your name"
                    required
                  />

                </div>


                {/* Email */}

                <div>

                  <label className="block font-medium mb-2">
                    Email
                  </label>

                  <input
                    type="email"
                    value={profile.email}
                    disabled
                    className="w-full border rounded-lg px-4 py-3 bg-gray-100"
                  />

                  <p className="text-sm text-gray-500 mt-1">
                    Email cannot be changed.
                  </p>

                </div>

              </div>


              {/* Save */}

              <div className="mt-8">

                <button
                  type="submit"
                  disabled={saving}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-6 py-3 rounded-lg font-medium"
                >
                  {saving
                    ? "Saving..."
                    : "Save Profile"}
                </button>

              </div>

            </form>

          </div>

        </div>


        {/* =========================
            ADMIN STATISTICS
        ========================= */}

        <div className="mt-8 max-w-5xl">

          <h2 className="text-2xl font-semibold mb-5">
            Placement Overview
          </h2>

          {statsLoading ? (

            <div className="bg-white rounded-xl shadow-md p-8 text-center">

              <div className="flex justify-center mb-3">
                <div className="w-7 h-7 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              </div>

              <p className="text-gray-500">
                Loading statistics...
              </p>

            </div>

          ) : (

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

              {/* Students */}

              <div
                onClick={() =>
                  (window.location.href =
                    "/students")
                }
                className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500 cursor-pointer hover:shadow-lg transition"
              >

                <p className="text-gray-500">
                  Students
                </p>

                <p className="text-3xl font-bold mt-2">
                  {adminStats.totalStudents}
                </p>

                <p className="text-sm text-blue-600 mt-2">
                  View Students →
                </p>

              </div>


              {/* Companies */}

              <div
                onClick={() =>
                  (window.location.href =
                    "/companies")
                }
                className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500 cursor-pointer hover:shadow-lg transition"
              >

                <p className="text-gray-500">
                  Companies
                </p>

                <p className="text-3xl font-bold mt-2">
                  {adminStats.totalCompanies}
                </p>

                <p className="text-sm text-green-600 mt-2">
                  View Companies →
                </p>

              </div>


              {/* Applications */}

              <div
                onClick={() =>
                  (window.location.href =
                    "/applications")
                }
                className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-500 cursor-pointer hover:shadow-lg transition"
              >

                <p className="text-gray-500">
                  Applications
                </p>

                <p className="text-3xl font-bold mt-2">
                  {adminStats.totalApplications}
                </p>

                <p className="text-sm text-yellow-600 mt-2">
                  View Applications →
                </p>

              </div>


              {/* Selected */}

              <div
                onClick={() =>
                  (window.location.href =
                    "/applications?status=Selected")
                }
                className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500 cursor-pointer hover:shadow-lg transition"
              >

                <p className="text-gray-500">
                  Selected
                </p>

                <p className="text-3xl font-bold mt-2">
                  {
                    adminStats.selectedApplications
                  }
                </p>

                <p className="text-sm text-purple-600 mt-2">
                  View Selected →
                </p>

              </div>

            </div>

          )}

        </div>


        {/* =========================
            ADMIN PERMISSIONS
        ========================= */}

        <div className="mt-8 bg-white rounded-xl shadow-md p-6 sm:p-8 max-w-5xl">

          <h2 className="text-2xl font-semibold mb-5">
            Administrator Access
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <div className="border rounded-lg p-4">

              <h3 className="font-semibold">
                Student Management
              </h3>

              <p className="text-gray-500 text-sm mt-1">
                View student profiles, academic
                information and applications.
              </p>

            </div>


            <div className="border rounded-lg p-4">

              <h3 className="font-semibold">
                Company Management
              </h3>

              <p className="text-gray-500 text-sm mt-1">
                Add, edit and remove placement
                companies.
              </p>

            </div>


            <div className="border rounded-lg p-4">

              <h3 className="font-semibold">
                Application Management
              </h3>

              <p className="text-gray-500 text-sm mt-1">
                Review applications and update
                application status.
              </p>

            </div>


            <div className="border rounded-lg p-4">

              <h3 className="font-semibold">
                Placement Analytics
              </h3>

              <p className="text-gray-500 text-sm mt-1">
                Monitor applications, selections
                and placement statistics.
              </p>

            </div>

          </div>

        </div>

      </div>
    );
  }

  // =====================================================
  // STUDENT PROFILE
  // =====================================================

  return (
    <div className="p-4 sm:p-8">

      {/* =========================
          HEADER
      ========================= */}

      <div className="mb-8">

        <h1 className="text-4xl font-bold">
          My Profile
        </h1>

        <p className="text-gray-500 mt-2">
          Manage your personal and academic
          information
        </p>

      </div>


      {/* =========================
          PROFILE FORM
      ========================= */}

      <div className="bg-white rounded-xl shadow-md p-6 sm:p-8 max-w-4xl">

        <form onSubmit={handleSubmit}>

          {/* =========================
              BASIC INFORMATION
          ========================= */}

          <h2 className="text-2xl font-semibold mb-6">
            Personal Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Name */}

            <div>

              <label className="block font-medium mb-2">
                Name
              </label>

              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your name"
                required
              />

            </div>


            {/* Email */}

            <div>

              <label className="block font-medium mb-2">
                Email
              </label>

              <input
                type="email"
                value={profile.email}
                disabled
                className="w-full border rounded-lg px-4 py-3 bg-gray-100"
              />

              <p className="text-sm text-gray-500 mt-1">
                Email cannot be changed.
              </p>

            </div>


            {/* Phone */}

            <div>

              <label className="block font-medium mb-2">
                Phone
              </label>

              <input
                type="text"
                name="phone"
                value={profile.phone}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter phone number"
              />

            </div>


            {/* College */}

            <div>

              <label className="block font-medium mb-2">
                College
              </label>

              <input
                type="text"
                name="college"
                value={profile.college}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter college"
              />

            </div>


            {/* Branch */}

            <div>

              <label className="block font-medium mb-2">
                Branch
              </label>

              <input
                type="text"
                name="branch"
                value={profile.branch}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter branch"
              />

            </div>


            {/* CGPA */}

            <div>

              <label className="block font-medium mb-2">
                CGPA
              </label>

              <input
                type="number"
                name="cgpa"
                value={profile.cgpa}
                onChange={handleChange}
                step="0.01"
                min="0"
                max="10"
                className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter CGPA"
              />

            </div>


            {/* Graduation Year */}

            <div>

              <label className="block font-medium mb-2">
                Graduation Year
              </label>

              <input
                type="number"
                name="graduationYear"
                value={profile.graduationYear}
                onChange={handleChange}
                min="2020"
                max="2100"
                className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="2027"
              />

            </div>

          </div>


          {/* =========================
              SKILLS
          ========================= */}

          <div className="mt-8">

            <label className="block font-medium mb-2">
              Skills
            </label>

            <input
              type="text"
              value={skillsInput}
              onChange={(e) =>
                setSkillsInput(
                  e.target.value
                )
              }
              className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Python, Java, React, MongoDB"
            />

            <p className="text-sm text-gray-500 mt-1">
              Separate skills using commas.
            </p>

          </div>


          {/* =========================
              RESUME
          ========================= */}

          <div className="mt-8">

            <h2 className="text-2xl font-semibold mb-4">
              Resume
            </h2>

            <label className="block font-medium mb-2">
              Resume URL
            </label>

            <input
              type="url"
              name="resumeUrl"
              value={profile.resumeUrl}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com/resume.pdf"
            />

            <p className="text-sm text-gray-500 mt-2">
              Paste a publicly accessible link to
              your resume PDF.
            </p>


            {/* Resume Preview */}

            <div className="mt-4 flex flex-wrap items-center gap-4">

              {profile.resumeUrl ? (
                <>

                  <button
                    type="button"
                    onClick={handleViewResume}
                    className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg font-medium"
                  >
                    View Resume
                  </button>

                  <span className="text-sm text-green-600">
                    ✓ Resume link added
                  </span>

                </>
              ) : (

                <p className="text-gray-500 text-sm">
                  No resume added yet.
                </p>

              )}

            </div>

          </div>


          {/* =========================
              SAVE BUTTON
          ========================= */}

          <div className="mt-8">

            <button
              type="submit"
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-6 py-3 rounded-lg font-medium"
            >
              {saving
                ? "Saving..."
                : "Save Profile"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default Profile;