import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import MainLayout from "./components/layout/MainLayout";
import HomePage from "./pages/HomePage";
import QuestionDetailPage from "./pages/QuestionDetailPage";
import AskQuestionPage from "./pages/AskQuestionPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import TagsPage from "./pages/TagsPage";
import SavedPage from "./pages/SavedPage";
import UsersPage from "./pages/UsersPage";

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="questions/:id" element={<QuestionDetailPage />} />
        <Route path="tags" element={<TagsPage />} />
        <Route path="saved" element={<SavedPage />} />
        <Route path="users" element={<UsersPage />} />
        <Route
          path="ask"
          element={
            <ProtectedRoute>
              <AskQuestionPage />
            </ProtectedRoute>
          }
        />
      </Route>
      <Route path="login" element={<LoginPage />} />
      <Route path="register" element={<RegisterPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
