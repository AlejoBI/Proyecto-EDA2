import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { JobsProvider } from "./context/JobsContext";
import { AdminProvider } from "./context/AdminContext";
import { ChatProvider } from "./context/ChatContext";

import { NavigationMenu, Footer } from "./components/index.jsx";

import {
  NotFoundPage,
  AdminDashboard,
  JobsPage,
  FreelancersPage,
  HomePage,
  LoginPage,
  RegisterPage,
  ProfilePage,
  ChatPage,
} from "./pages/index.jsx";

import ProtectedRoute from "./utils/ProtectedRoute";
import PublicRoute from "./utils/PublicRoute";

function Layout({ children }) {
  const location = useLocation();

  const showNavAndFooter = !["/login", "/register", "/admin/dashboard"].includes(location.pathname);

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
      <AdminProvider>
        <ChatProvider>
          <JobsProvider>
            <BrowserRouter>
              <Routes>
                <Route element={<PublicRoute />}>
                  <Route
                    path="/"
                    element={
                      <Layout>
                        <HomePage />
                      </Layout>
                    }
                  />
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
                  <Route
                    path="/user/chat"
                    element={
                      <Layout>
                        <ChatPage />
                      </Layout>
                    }
                  />
                  <Route
                    path="/admin/dashboard"
                    element={
                      <Layout>
                        <AdminDashboard />
                      </Layout>
                    }
                  />
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
          </JobsProvider>
        </ChatProvider>
      </AdminProvider>
    </AuthProvider>
  );
}

export default App;
