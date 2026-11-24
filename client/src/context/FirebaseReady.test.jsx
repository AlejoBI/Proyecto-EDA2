/* eslint react/prop-types: off */
import { act, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getFirebaseServices: vi.fn(),
  onAuthStateChanged: vi.fn(),
  unsubscribe: vi.fn(),
  createUserWithEmailAndPassword: vi.fn(),
  signInWithEmailAndPassword: vi.fn(),
  signOut: vi.fn(),
  signInWithPopup: vi.fn(),
  setDoc: vi.fn(),
  addDoc: vi.fn(),
  updateDoc: vi.fn(),
  deleteDoc: vi.fn(),
  getDoc: vi.fn(),
  getDocs: vi.fn(),
  getAuth: vi.fn(),
  getFirestore: vi.fn(),
  doc: vi.fn(),
  collection: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
  orderBy: vi.fn(),
  onSnapshot: vi.fn(),
  fakeAuth: { name: "inert-auth", currentUser: null },
  fakeDb: { name: "inert-db" },
}));

vi.mock("../firebase/credentials.js", () => ({ default: {} }));
vi.mock("../firebase/firebaseServices.js", () => ({ getFirebaseServices: mocks.getFirebaseServices }));
vi.mock("firebase/auth", () => ({
  getAuth: mocks.getAuth,
  onAuthStateChanged: mocks.onAuthStateChanged,
  createUserWithEmailAndPassword: mocks.createUserWithEmailAndPassword,
  signInWithEmailAndPassword: mocks.signInWithEmailAndPassword,
  signOut: mocks.signOut,
  signInWithPopup: mocks.signInWithPopup,
  GoogleAuthProvider: vi.fn(),
  GithubAuthProvider: vi.fn(),
}));
vi.mock("firebase/firestore", () => ({
  getFirestore: mocks.getFirestore,
  doc: mocks.doc,
  collection: mocks.collection,
  query: mocks.query,
  where: mocks.where,
  orderBy: mocks.orderBy,
  onSnapshot: mocks.onSnapshot,
  getDoc: mocks.getDoc,
  getDocs: mocks.getDocs,
  setDoc: mocks.setDoc,
  addDoc: mocks.addDoc,
  updateDoc: mocks.updateDoc,
  deleteDoc: mocks.deleteDoc,
}));

vi.mock("../components/index.jsx", async () => {
  const { createElement: h } = await import("react");
  const { useAuth: authHook } = await import("../hooks/useAuth.js");
  return {
    NavigationMenu: () => h("nav", null, "Navigation"), Footer: () => null,
    CustomSpinner: () => h("p", null, "Loading"), CustomToast: () => null,
    CustomLabelLanding: ({ text }) => h("div", null, text),
    SearchServiceLanding: () => {
      const auth = authHook();
      return h("section", null,
        h("output", { "aria-label": "auth-probe" }, JSON.stringify({ authStatus: auth.authStatus, isAuthenticated: auth.isAuthenticated, user: auth.user })));
    }, TestimonialLanding: () => null,
    BecomePartLanding: () => null,
    ProfileInformation: () => {
      const auth = authHook();
      return h("div", null, h("span", null, "ProfileInformation marker"),
        h("output", { "aria-label": "auth-probe" }, JSON.stringify({ authStatus: auth.authStatus, isAuthenticated: auth.isAuthenticated, user: auth.user })));
    },
  };
});
vi.mock("../pages/index.jsx", async () => {
  const [{ default: HomePage }, { default: ProfilePage }] = await Promise.all([
    import("../pages/HomePage.jsx"), import("../pages/ProfilePage.jsx"),
  ]);
  const { createElement: h } = await import("react");
  return {
    HomePage, ProfilePage,
    NotFoundPage: () => h("div", null, "Not found"),
    AdminDashboard: () => null, JobsPage: () => null, FreelancersPage: () => null,
    LoginPage: () => null, RegisterPage: () => null, ChatPage: () => null,
  };
});
vi.mock("../pages/JobsPage.jsx", async () => {
  const [{ createElement: h }, { useJobs }] = await Promise.all([import("react"), import("../hooks/useJobs.js")]);
  function JobsRouteProbe() { const { jobs, loading, errors } = useJobs(); return h("div", { "data-testid": "jobs-route-probe" }, loading ? h("p", { role: "status" }, "Loading jobs") : errors ? h("p", { role: "alert" }, errors) : jobs.length ? h("ul", null, jobs.map((job) => h("li", { key: job.id }, job.title))) : h("p", null, "No jobs available")); }
  return { default: JobsRouteProbe };
});

import App from "../App.jsx";

function renderRoute(path) {
  window.history.replaceState({}, "", path);
  return render(<App />);
}

describe("Firebase disponible completamente simulado", () => {
  const professional = { uid: "professional-1", email: "pro@example.test" };
  const profile = { username: "Ada", email: "pro@example.test", role: "professional" };
  const localJobs = [{ id: "job-local-1", title: "Local simulated job" }];

  beforeEach(() => {
    vi.clearAllMocks();
    mocks.unsubscribe = vi.fn();
    mocks.fakeAuth.currentUser = null;
    mocks.getFirebaseServices.mockResolvedValue({ auth: mocks.fakeAuth, fireStore: mocks.fakeDb });
    mocks.onAuthStateChanged.mockImplementation((_auth, callback) => {
      mocks.authCallback = callback;
      return mocks.unsubscribe;
    });
    mocks.getDoc.mockResolvedValue({ exists: () => true, data: () => profile });
    mocks.collection.mockImplementation((_db, name) => ({ collection: name }));
    mocks.query.mockImplementation((ref) => ref);
    mocks.getDocs.mockResolvedValue({ docs: localJobs.map(({ id, ...data }) => ({ id, data: () => data })) });
  });

  it("unsubscribes from Auth when the tree unmounts with the subscription active", async () => {
    const { unmount } = renderRoute("/");
    await waitFor(() => expect(mocks.onAuthStateChanged).toHaveBeenCalled());

    unmount();

    expect(mocks.unsubscribe).toHaveBeenCalledOnce();
  });

  it("sets auth ready on Home without querying jobs", async () => {
    renderRoute("/");
    await waitFor(() => expect(mocks.authCallback).toBeTypeOf("function"));
    await act(async () => { await mocks.authCallback(professional); });

    expect(await screen.findByRole("heading", { name: "Discover the right expert for your needs" })).toBeInTheDocument();
    expect(screen.getByRole("main")).toContainElement(screen.getByRole("heading", { level: 1, name: "Discover the right expert for your needs" }));
    expect(screen.getByLabelText("auth-probe")).toHaveTextContent('"authStatus":"ready"');
    expect(screen.getByLabelText("auth-probe")).toHaveTextContent('"isAuthenticated":true');
    expect(screen.getByLabelText("auth-probe")).toHaveTextContent('"role":"professional"');
    expect(mocks.getFirebaseServices).toHaveBeenCalled();
    expect(mocks.onAuthStateChanged).toHaveBeenCalledWith(mocks.fakeAuth, expect.any(Function));
    expect(mocks.getDoc).toHaveBeenCalled();
    expect(mocks.getDocs).not.toHaveBeenCalled();
    expect(mocks.getAuth).not.toHaveBeenCalled();
    expect(mocks.getFirestore).not.toHaveBeenCalled();
    for (const method of [mocks.createUserWithEmailAndPassword, mocks.signInWithEmailAndPassword, mocks.signInWithPopup, mocks.signOut, mocks.setDoc, mocks.addDoc, mocks.updateDoc, mocks.deleteDoc]) {
      expect(method).not.toHaveBeenCalled();
    }
  });

  it("opens the real protected profile for the simulated professional", async () => {
    renderRoute("/user/profile");
    await waitFor(() => expect(mocks.authCallback).toBeTypeOf("function"));
    await act(async () => { await mocks.authCallback(professional); });

    expect(await screen.findByText("ProfileInformation marker")).toBeInTheDocument();
    expect(screen.getByLabelText("auth-probe")).toHaveTextContent('"role":"professional"');
    expect(screen.getByLabelText("auth-probe")).toHaveTextContent('"authStatus":"ready"');
    expect(mocks.getFirebaseServices).toHaveBeenCalled();
    expect(mocks.onAuthStateChanged).toHaveBeenCalled();
    expect(mocks.getDoc).toHaveBeenCalled();
    expect(mocks.getDocs).not.toHaveBeenCalled();
    for (const method of [mocks.createUserWithEmailAndPassword, mocks.signInWithEmailAndPassword, mocks.signInWithPopup, mocks.signOut, mocks.setDoc, mocks.addDoc, mocks.updateDoc, mocks.deleteDoc]) {
      expect(method).not.toHaveBeenCalled();
    }
  });

  it("loads simulated jobs only on the jobs route", async () => {
    renderRoute("/jobs");
    await waitFor(() => expect(mocks.authCallback).toBeTypeOf("function"));
    await act(async () => { await mocks.authCallback(null); });
    expect(await screen.findByText("Local simulated job")).toBeInTheDocument();
    await waitFor(() => expect(mocks.getDocs).toHaveBeenCalledOnce());
    expect(mocks.collection).toHaveBeenCalledWith(mocks.fakeDb, "jobs");
  });

  it("shows loading and then empty only after a successful empty response", async () => {
    let resolveJobs;
    mocks.getDocs.mockReturnValueOnce(new Promise((resolve) => { resolveJobs = resolve; }));
    renderRoute("/jobs");
    await waitFor(() => expect(mocks.authCallback).toBeTypeOf("function"));
    await act(async () => { await mocks.authCallback(null); });
    await screen.findByTestId("jobs-route-probe");
    expect(await screen.findByRole("status")).toHaveTextContent("Loading jobs");
    await act(async () => resolveJobs({ docs: [] }));
    expect(await screen.findByText("No jobs available")).toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("shows an error rather than empty when Firebase services are unavailable on /jobs", async () => {
    mocks.getFirebaseServices.mockRejectedValue(new Error("adapter unavailable"));
    renderRoute("/jobs");
    await screen.findByTestId("jobs-route-probe");
    expect(await screen.findByRole("alert")).toHaveTextContent("Jobs are currently unavailable.");
    expect(screen.queryByText("No jobs available")).not.toBeInTheDocument();
  });
});
