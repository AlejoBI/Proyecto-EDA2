import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import "./index.css";

import NavigationMenu from "./components/NavigationMenu";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import ProtectedRoute from "./ProtectedRoute";

// Layout component to include NavigationMenu and Footer
function Layout({ children }) {
  const location = useLocation();

  // Determine if NavigationMenu and Footer should be shown
  const showNavAndFooter = !['/login', '/register'].includes(location.pathname);

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
          <Route path="/" element={<Layout><HomePage /></Layout>} />
          <Route path="/login" element={<Layout><LoginPage /></Layout>} />
          <Route path="/register" element={<Layout><RegisterPage /></Layout>} />
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<Layout><ProfilePage /></Layout>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
