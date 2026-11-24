import React, { lazy, Suspense } from "react";
import PropTypes from "prop-types";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import NavigationMenu from "./components/ui/NavigationMenu.jsx";
import Footer from "./components/ui/Footer.jsx";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import ProtectedRoute from "./utils/ProtectedRoute";
import PublicRoute from "./utils/PublicRoute";

const AdminDashboard = lazy(() => import("./pages/AdminDashboard.jsx"));
const ChatPage = lazy(() => import("./pages/ChatPage.jsx"));
const ProfilePage = lazy(() => import("./pages/ProfilePage.jsx"));
const JobsPage = lazy(() => import("./pages/JobsPage.jsx"));
const FreelancersPage = lazy(() => import("./pages/FreelancersPage.jsx"));
const AdminProvider = lazy(() => import("./context/AdminContext.jsx").then((module) => ({ default: module.AdminProvider })));
const JobsProvider = lazy(() => import("./context/JobsContext.jsx").then((module) => ({ default: module.JobsProvider })));
const ChatProvider = lazy(() => import("./context/ChatContext.jsx").then((module) => ({ default: module.ChatProvider })));

class ChunkErrorBoundary extends React.Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    if (this.state.failed) return <div role="alert"><p>This page could not be loaded.</p><button onClick={() => window.location.reload()}>Reload page</button></div>;
    return this.props.children;
  }
}
ChunkErrorBoundary.propTypes = { children: PropTypes.node.isRequired };

function Page({ children }) {
  return <ChunkErrorBoundary><Suspense fallback={<div role="status" aria-live="polite">Loading page…</div>}>{children}</Suspense></ChunkErrorBoundary>;
}

function Layout({ children }) {
  const location = useLocation();
  const showNavAndFooter = !["/login", "/register", "/admin/dashboard"].includes(location.pathname);
  return <>{showNavAndFooter && <NavigationMenu />}<main>{children}</main>{showNavAndFooter && <Footer />}</>;
}
Layout.propTypes = { children: PropTypes.node.isRequired };
Page.propTypes = { children: PropTypes.node.isRequired };

function App() {
  return <AuthProvider><BrowserRouter><Routes>
    <Route element={<PublicRoute />}>
      <Route path="/" element={<Layout><HomePage /></Layout>} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/jobs" element={<Layout><Page><JobsProvider><ChatProvider><JobsPage /></ChatProvider></JobsProvider></Page></Layout>} />
      <Route path="/freelancers" element={<Layout><Page><ChatProvider><FreelancersPage /></ChatProvider></Page></Layout>} />
    </Route>
    <Route element={<ProtectedRoute />}>
      <Route path="/user/profile" element={<Layout><Page><ProfilePage /></Page></Layout>} />
      <Route path="/user/chat" element={<Layout><Page><ChatProvider><ChatPage /></ChatProvider></Page></Layout>} />
      <Route path="/admin/dashboard" element={<Page><AdminProvider><JobsProvider><Layout><AdminDashboard /></Layout></JobsProvider></AdminProvider></Page>} />
    </Route>
    <Route path="*" element={<Layout><NotFoundPage /></Layout>} />
  </Routes></BrowserRouter></AuthProvider>;
}

export default App;
