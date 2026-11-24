/* eslint react/prop-types: off */
import { useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const firebaseMocks = vi.hoisted(() => ({
  getAuth: vi.fn(),
  onAuthStateChanged: vi.fn(),
  createUserWithEmailAndPassword: vi.fn(),
  signInWithEmailAndPassword: vi.fn(),
  signOut: vi.fn(),
  GoogleAuthProvider: vi.fn(),
  GithubAuthProvider: vi.fn(),
  signInWithPopup: vi.fn(),
  getFirestore: vi.fn(),
  doc: vi.fn(),
  addDoc: vi.fn(),
  setDoc: vi.fn(),
  getDoc: vi.fn(),
  collection: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
  orderBy: vi.fn(),
  onSnapshot: vi.fn(),
  getDocs: vi.fn(),
  updateDoc: vi.fn(),
  deleteDoc: vi.fn(),
  getFirebaseServices: vi.fn(),
}));

vi.mock("firebase/auth", () => ({
  getAuth: firebaseMocks.getAuth,
  onAuthStateChanged: firebaseMocks.onAuthStateChanged,
  createUserWithEmailAndPassword: firebaseMocks.createUserWithEmailAndPassword,
  signInWithEmailAndPassword: firebaseMocks.signInWithEmailAndPassword,
  signOut: firebaseMocks.signOut,
  GoogleAuthProvider: firebaseMocks.GoogleAuthProvider,
  GithubAuthProvider: firebaseMocks.GithubAuthProvider,
  signInWithPopup: firebaseMocks.signInWithPopup,
}));
vi.mock("firebase/firestore", () => ({
  getFirestore: firebaseMocks.getFirestore,
  doc: firebaseMocks.doc,
  setDoc: firebaseMocks.setDoc,
  getDoc: firebaseMocks.getDoc,
  collection: firebaseMocks.collection,
  query: firebaseMocks.query,
  getDocs: firebaseMocks.getDocs,
  updateDoc: firebaseMocks.updateDoc,
  deleteDoc: firebaseMocks.deleteDoc,
  addDoc: firebaseMocks.addDoc,
  where: firebaseMocks.where,
  orderBy: firebaseMocks.orderBy,
  onSnapshot: firebaseMocks.onSnapshot,
}));
vi.mock("../firebase/credentials.js", () => ({ default: {} }));
vi.mock("../firebase/firebaseServices.js", () => ({
  getFirebaseServices: firebaseMocks.getFirebaseServices,
}));
vi.mock("../components/index.jsx", async () => {
  const { createElement: h } = await import("react");
  return {
    NavigationMenu: () => h("nav", null, "Public navigation"),
    Footer: () => h("footer", null, "Footer"),
    CustomSpinner: () => h("p", null, "Loading"),
    CustomToast: () => null,
    CustomLabelLanding: ({ text }) => h("div", null, text),
    SearchServiceLanding: () => h("section", null, "Search services"),
    TestimonialLanding: () => null,
    BecomePartLanding: () => null,
  };
});
vi.mock("../pages/index.jsx", async () => {
  const [{ default: HomePage }, { default: LoginPage }, { default: RegisterPage }, { default: NotFoundPage }] =
    await Promise.all([
      import("../pages/HomePage.jsx"),
      import("../pages/LoginPage.jsx"),
      import("../pages/RegisterPage.jsx"),
      import("../pages/NotFoundPage.jsx"),
    ]);
  const { createElement: h } = await import("react");
  return {
    HomePage,
    LoginPage,
    RegisterPage,
    NotFoundPage,
    AdminDashboard: () => h("main", null, "Private admin page"),
    JobsPage: () => h("main", null, "Jobs page"),
    FreelancersPage: () => h("main", null, "Freelancers page"),
    ProfilePage: () => h("main", null, "Private profile page"),
    ChatPage: () => h("main", null, "Private chat page"),
  };
});

import App from "../App.jsx";
import { AuthProvider } from "./AuthContext.jsx";
import { useAuth } from "../hooks/useAuth.js";

const authFailure = Object.assign(new Error("invalid key simulated"), {
  code: "auth/invalid-api-key",
});

function renderAt(path) {
  window.history.replaceState({}, "", path);
  return render(<App />);
}

function AuthMethodProbe() {
  const { authStatus, isAuthenticated, loading, user, signin } = useAuth();
  const [methodError, setMethodError] = useState("");

  return (
    <>
      <output aria-label="auth-state">{JSON.stringify({ authStatus, isAuthenticated, loading, user })}</output>
      <output aria-label="method-error">{methodError}</output>
      <button onClick={async () => {
        const result = await signin({ email: "test@example.test", password: "not-used" });
        setMethodError(result.error);
      }}>Call sign in</button>
    </>
  );
}

describe("Firebase unavailable fallback", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    firebaseMocks.getFirebaseServices.mockRejectedValue(authFailure);
    firebaseMocks.getDocs.mockResolvedValue({ docs: [] });
  });

  it("renders the actual Home page after auth initialization fails", async () => {
    renderAt("/");

    expect(await screen.findByText("Discover the right expert for your needs")).toBeInTheDocument();
    expect(firebaseMocks.getDocs).not.toHaveBeenCalled();
  });

  it("renders NotFound when Firebase Auth is unavailable", async () => {
    renderAt("/route-that-does-not-exist");

    expect(await screen.findByText("404 - Page Not Found")).toBeInTheDocument();
  });

  it("does not expose a private route when Auth is unavailable", async () => {
    renderAt("/user/profile");

    expect(await screen.findByRole("alert")).toHaveTextContent("Private pages cannot be opened");
    expect(screen.queryByText("Private profile page")).not.toBeInTheDocument();
  });

  it("shows the unavailable state and disables Login actions", async () => {
    renderAt("/login");

    expect(await screen.findByRole("alert")).toHaveTextContent("Authentication is currently unavailable");
    expect(screen.getByRole("button", { name: "Sign in with Google" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Sign in with GitHub" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Login" })).toBeDisabled();
  });

  it("shows the unavailable state and disables Register", async () => {
    renderAt("/register");

    expect(await screen.findByRole("alert")).toHaveTextContent("Registration is currently unavailable");
    expect(screen.getByRole("button", { name: "Register" })).toBeDisabled();
  });

  it("settles Auth state and returns a controlled error from methods", async () => {
    const user = userEvent.setup();
    render(
      <AuthProvider>
        <AuthMethodProbe />
      </AuthProvider>
    );

    expect(await screen.findByLabelText("auth-state")).toHaveTextContent(
      '"authStatus":"unavailable","isAuthenticated":false,"loading":false,"user":null'
    );
    await user.click(screen.getByRole("button", { name: "Call sign in" }));
    expect(await screen.findByLabelText("method-error")).toHaveTextContent(
      "Authentication is currently unavailable."
    );
  });

  it("does not invoke Firebase SDK methods or eager getAuth in JobsContext", async () => {
    renderAt("/");
    await screen.findByText("Discover the right expert for your needs");

    for (const method of [
      firebaseMocks.getAuth,
      firebaseMocks.onAuthStateChanged,
      firebaseMocks.createUserWithEmailAndPassword,
      firebaseMocks.signInWithEmailAndPassword,
      firebaseMocks.signOut,
      firebaseMocks.signInWithPopup,
      firebaseMocks.setDoc,
      firebaseMocks.addDoc,
      firebaseMocks.updateDoc,
      firebaseMocks.deleteDoc,
    ]) {
      expect(method).not.toHaveBeenCalled();
    }
  });
});
