/* eslint react/prop-types: off */
import { createElement } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("./context/AuthContext", () => ({
  AuthProvider: ({ children }) => children,
}));
vi.mock("./utils/ProtectedRoute", async () => {
  const { Outlet } = await import("react-router-dom");
  return { default: () => createElement(Outlet) };
});
vi.mock("./context/AdminContext.jsx", () => ({
  AdminProvider: ({ children }) => createElement("div", { "data-testid": "admin-provider" }, children),
}));
vi.mock("./context/JobsContext.jsx", () => ({
  JobsProvider: ({ children }) => createElement("div", { "data-testid": "jobs-provider" }, children),
}));
vi.mock("./pages/AdminDashboard.jsx", () => ({ default: () => createElement("h1", null, "Admin dashboard") }));
vi.mock("./firebase/firebaseServices.js", () => ({
  getFirebaseServices: vi.fn(async () => ({ auth: {}, fireStore: {} })),
}));

import App from "./App.jsx";

describe("admin dashboard route providers", () => {
  it("renders the dashboard inside both admin and jobs providers", async () => {
    window.history.replaceState({}, "", "/admin/dashboard");
    render(createElement(App));

    expect(await screen.findByRole("heading", { name: "Admin dashboard" })).toBeInTheDocument();
    const jobsProvider = screen.getByTestId("jobs-provider");
    const adminProvider = screen.getByTestId("admin-provider");
    expect(adminProvider).toContainElement(jobsProvider);
  });
});
