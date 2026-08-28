import { Routes, Route } from "react-router";
import Layout from "./components/Layout";
import ProtectedRoute from "./ProtectedRoute";
import DashboardPage from "./pages/DashboardPage";
import ApplicantsPage from "./pages/ApplicantsPage";
import ApplicantDetailPage from "./pages/ApplicantDetailPage";
import InternshipsPage from "./pages/InternshipsPage";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route element={<ProtectedRoute />}>
          <Route path="applicants" element={<ApplicantsPage />} />
        </Route>

        <Route index element={<DashboardPage />} />
        <Route path="applicants/:id" element={<ApplicantDetailPage />} />
        <Route path="internships" element={<InternshipsPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;
