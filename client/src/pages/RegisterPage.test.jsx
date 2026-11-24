/* eslint react/prop-types: off */
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";

const authMocks = vi.hoisted(() => ({
  signup: vi.fn(),
  state: { authStatus: "ready", loading: false, errors: null, isAuthenticated: false },
}));

vi.mock("../hooks/useAuth.js", () => ({ useAuth: () => ({ ...authMocks.state, signup: authMocks.signup }) }));
vi.mock("../components/index", () => ({ CustomToast: ({ show, message }) => show ? <div role="status">{message}</div> : null }));

import RegisterPage from "./RegisterPage.jsx";

function renderPage() {
  return render(<MemoryRouter initialEntries={["/register"]}><RegisterPage /></MemoryRouter>);
}

describe("RegisterPage authentication", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    authMocks.state = { authStatus: "ready", loading: false, errors: null, isAuthenticated: false };
  });

  it("submits registration values, including the selected role", async () => {
    const user = userEvent.setup();
    renderPage();
    await user.type(screen.getByLabelText("Username"), "Taylor");
    await user.type(screen.getByLabelText("Email address"), "taylor@example.test");
    await user.type(screen.getByLabelText("Password"), "secret123");
    await user.selectOptions(screen.getByLabelText("Role"), "professional");
    await user.click(screen.getByRole("button", { name: "Register" }));
    expect(authMocks.signup).toHaveBeenCalledWith({ username: "Taylor", email: "taylor@example.test", password: "secret123", role: "professional" });
  });

  it("does not submit when required fields are empty", async () => {
    const user = userEvent.setup();
    renderPage();
    await user.click(screen.getByRole("button", { name: "Register" }));
    expect(await screen.findByText("Username is required")).toBeInTheDocument();
    expect(screen.getByText("Email is required")).toBeInTheDocument();
    expect(screen.getByText("Password is required")).toBeInTheDocument();
    expect(authMocks.signup).not.toHaveBeenCalled();
  });

  it("shows unavailability and disables submission", () => {
    authMocks.state = { ...authMocks.state, authStatus: "unavailable" };
    renderPage();
    expect(screen.getByRole("alert")).toHaveTextContent("Registration is currently unavailable");
    expect(screen.getByRole("button", { name: "Register" })).toBeDisabled();
  });
});
