import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Layout from "./layouts/Layout";
import Companies from "./pages/Companies";
import Students from "./pages/Students";
import Applications from "./pages/Applications";
import ApplicationDetails from "./pages/ApplicationDetails";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleProtectedRoute from "./components/RoleProtectedRoute";
import StudentDetails from "./pages/StudentDetails";
import CompanyDetails from "./pages/CompanyDetails";

function App() {
  return (
    <Routes>

      {/* =========================
          PUBLIC ROUTES
      ========================= */}

      <Route path="/" element={<Login />} />

      <Route path="/register" element={<Register />} />


      {/* =========================
          AUTHENTICATED ROUTES
      ========================= */}

      <Route element={<ProtectedRoute />}>

        <Route element={<Layout />}>

          {/* Dashboard */}
          <Route
            path="/dashboard"
            element={<Dashboard />}
          />


          {/* =========================
              COMPANIES
          ========================= */}

          <Route
            path="/companies"
            element={<Companies />}
          />

          <Route
            path="/companies/:id"
            element={<CompanyDetails />}
          />


          {/* =========================
              APPLICATIONS
          ========================= */}

          <Route
            path="/applications"
            element={<Applications />}
          />

          <Route
            path="/applications/:id"
            element={<ApplicationDetails />}
          />


          {/* =========================
              PROFILE
          ========================= */}

          <Route
            path="/profile"
            element={<Profile />}
          />


          {/* =========================
              ADMIN ONLY
          ========================= */}

          <Route
            element={<RoleProtectedRoute role="admin" />}
          >

            <Route
              path="/students"
              element={<Students />}
            />

            <Route
              path="/students/:id"
              element={<StudentDetails />}
            />

          </Route>

        </Route>

      </Route>

    </Routes>
  );
}

export default App;