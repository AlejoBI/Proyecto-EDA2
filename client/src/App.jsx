import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import { NavigationMenu, Footer } from "./components/index.jsx";

import {
  NotFoundPage,
  AdminDashboard,
  JobsPage,
  FreelancersPage,
  HomePage,
  LoginPage,
  RegisterPage,
  ProfilePage
} from "./pages/index.jsx";

import ProtectedRoute from "./utils/ProtectedRoute";
import PublicRoute from "./utils/PublicRoute";

// Layout component to include NavigationMenu and Footer
function Layout({ children }) {
  const location = useLocation();

  // Determine if NavigationMenu and Footer should be shown
  const showNavAndFooter = !["/login", "/register"].includes(location.pathname);

  return (
    <>
      {showNavAndFooter && <NavigationMenu />}
      {children}
      {showNavAndFooter && <Footer />}
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <Layout>
                <HomePage />
              </Layout>
            }
          />

          <Route element={<PublicRoute />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
              path="/jobs"
              element={
                <Layout>
                  <JobsPage />
                </Layout>
              }
            />
            <Route
              path="/freelancers"
              element={
                <Layout>
                  <FreelancersPage />
                </Layout>
              }
            />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route
              path="/user/profile"
              element={
                <Layout>
                  <ProfilePage />
                </Layout>
              }
            />
            <Route path="/admin/AdminDashboard" element={<AdminDashboard />} />
          </Route>

          <Route
            path="*"
            element={
              <Layout>
                <NotFoundPage />
              </Layout>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
