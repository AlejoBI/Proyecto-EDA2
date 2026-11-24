/* eslint react/prop-types: off */
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";

const authMocks = vi.hoisted(() => ({
  signin: vi.fn(),
  signinWithGoogle: vi.fn(),
  signinWithGithub: vi.fn(),
  state: { authStatus: "ready", loading: false, errors: null, isAuthenticated: false },
}));

vi.mock("../hooks/useAuth.js", () => ({ useAuth: () => ({ ...authMocks.state, signin: authMocks.signin, signinWithGoogle: authMocks.signinWithGoogle, signinWithGithub: authMocks.signinWithGithub }) }));
vi.mock("../components/index", () => ({ CustomToast: ({ show, message }) => show ? <div role="status">{message}</div> : null }));

import LoginPage from "./LoginPage.jsx";

function renderPage() {
  return render(<MemoryRouter initialEntries={["/login"]}><LoginPage /></MemoryRouter>);
}

describe("LoginPage authentication", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    authMocks.state = { authStatus: "ready", loading: false, errors: null, isAuthenticated: false };
  });

  it("submits email and password to signin", async () => {
    const user = userEvent.setup();
    renderPage();
    await user.type(screen.getByLabelText("Email address"), "person@example.test");
    await user.type(screen.getByLabelText("Password"), "secret123");
    await user.click(screen.getByRole("button", { name: "Login" }));
    expect(authMocks.signin).toHaveBeenCalledWith({ email: "person@example.test", password: "secret123" });
  });

  it("does not submit when required fields are empty", async () => {
    const user = userEvent.setup();
    renderPage();
    await user.click(screen.getByRole("button", { name: "Login" }));
    expect(await screen.findByText("Email is required")).toBeInTheDocument();
    expect(screen.getByText("Password is required")).toBeInTheDocument();
    expect(authMocks.signin).not.toHaveBeenCalled();
  });

  it("shows unavailability and disables all auth actions", () => {
    authMocks.state = { ...authMocks.state, authStatus: "unavailable" };
    renderPage();
    expect(screen.getByRole("alert")).toHaveTextContent("Authentication is currently unavailable");
    expect(screen.getByRole("button", { name: /Sign in with Google/ })).toBeDisabled();
    expect(screen.getByRole("button", { name: /Sign in with GitHub/ })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Login" })).toBeDisabled();
  });

  it("calls the Google and GitHub sign-in callbacks", async () => {
    const user = userEvent.setup();
    renderPage();
    await user.click(screen.getByRole("button", { name: /Sign in with Google/ }));
    await user.click(screen.getByRole("button", { name: /Sign in with GitHub/ }));
    expect(authMocks.signinWithGoogle).toHaveBeenCalledOnce();
    expect(authMocks.signinWithGithub).toHaveBeenCalledOnce();
  });
});
