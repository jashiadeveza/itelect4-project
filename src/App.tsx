import { Routes, Route } from "react-router";
import Layout from "./components/Layout";
import ProtectedRoute from "./ProtectedRoute";
import DashboardPage from "./pages/DashboardPage";
import AiReviewPage from "./pages/AiReviewPage";
import ApplicantsPage from "./pages/ApplicantsPage";
import ApplicantDetailPage from "./pages/ApplicantDetailPage";
import InternshipsPage from "./pages/InternshipsPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route element={<ProtectedRoute />}>
          <Route index element={<DashboardPage />} />
          <Route path="ai-review" element={<AiReviewPage />} />
          <Route path="applicants" element={<ApplicantsPage />} />
          <Route path="applicants/:id" element={<ApplicantDetailPage />} />
        </Route>

        <Route path="internships" element={<InternshipsPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;
