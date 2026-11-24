import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ user: null, updateProfile: vi.fn(() => <div role="region" aria-label="Update profile form">Profile editor</div>) }));
vi.mock("../../hooks/useAuth.js", () => ({ useAuth: () => ({ user: mocks.user }) }));
vi.mock("../index", () => ({ UpdateProfile: () => mocks.updateProfile() }));

import ProfileInformation from "./ProfileInformation.jsx";

describe("ProfileInformation", () => {
  it("renders synthetic user details and transitions to the update component", () => {
    mocks.user = {
      username: "Example Member", role: "professional", age: 29,
      name: "Taylor", lastName: "Example", email: "taylor@member.example.test",
      phone: "+1-555-0100", city: "Testville", country: "Exampleland",
    };
    render(<ProfileInformation />);

    expect(screen.getByRole("heading", { name: "Example Member, 29" })).toBeInTheDocument();
    expect(screen.getByText("Professional")).toBeInTheDocument();
    expect(screen.getByText("Testville, Exampleland")).toBeInTheDocument();
    expect(screen.getByText("Taylor Example")).toBeInTheDocument();
    expect(screen.getByText("taylor@member.example.test")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Update Information" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Update Information" }));
    expect(screen.getByRole("region", { name: "Update profile form" })).toHaveTextContent("Profile editor");
    expect(mocks.updateProfile).toHaveBeenCalledOnce();
  });
});
