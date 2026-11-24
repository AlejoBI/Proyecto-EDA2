import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ state: {}, retry: vi.fn() }));
vi.mock("../../hooks/useFreelancersList", () => ({ default: () => ({
  user: null, isAuthenticated: false, currentPage: 1, itemsPerPage: 8,
  filteredUsers: [], selectedCountry: "All", setSelectedCountry: vi.fn(),
  selectedCity: "All", setSelectedCity: vi.fn(), selectedArea: "All", setSelectedArea: vi.fn(),
  selectedSkill: "All", setSelectedSkill: vi.fn(), showToast: false, setShowToast: vi.fn(),
  toastMessage: "", toastType: "success", currentItems: [], handleStartChat: vi.fn(),
  setCurrentPage: vi.fn(), freelancersCount: 0, skillsCount: 0, loading: false, errors: null,
  retryUsers: mocks.retry, ...mocks.state,
}) }));
vi.mock("../../hooks/useParentComponentData", () => ({ default: () => ({ countriesAndCities: {}, professionalAreas: [], professionalAreasAndSkills: {} }) }));
vi.mock("../index", () => ({ CustomToast: () => null, CustomSpinner: () => null }));

import FreelancersList from "./FreelancersList.jsx";

describe("FreelancersList UI states", () => {
  beforeEach(() => { mocks.state = {}; mocks.retry.mockClear(); });

  it("renders synthetic freelancer data and accessible filters", () => {
    const person = { id: "user-1", username: "Example Designer", email: "designer@portfolio.example.test", city: "Testville", country: "Exampleland", professionalArea: "Design", skills: ["Illustration"] };
    mocks.state = { filteredUsers: [person], currentItems: [person], freelancersCount: 1, skillsCount: 1 };
    render(<FreelancersList />);
    expect(screen.getByRole("heading", { name: "Example Designer" })).toBeInTheDocument();
    expect(screen.getByText("designer@portfolio.example.test")).toBeInTheDocument();
    expect(screen.getByText("Illustration")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Filter freelancers by country" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Filter freelancers by city" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Filter freelancers by professional area" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Filter freelancers by skill" })).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "Freelancer pages" })).toBeInTheDocument();
  });

  it("renders the empty state without pagination", () => {
    render(<FreelancersList />);
    expect(screen.getByText("No freelancers available")).toBeInTheDocument();
    expect(screen.queryByRole("navigation", { name: "Freelancer pages" })).not.toBeInTheDocument();
  });

  it("renders an error and invokes retry", () => {
    mocks.state = { errors: "Freelancers unavailable" };
    render(<FreelancersList />);
    expect(screen.getByRole("alert")).toHaveTextContent("Freelancers unavailable");
    fireEvent.click(screen.getByRole("button", { name: "Retry" }));
    expect(mocks.retry).toHaveBeenCalledOnce();
  });

  it("announces loading status", () => {
    mocks.state = { loading: true };
    render(<FreelancersList />);
    expect(screen.getByRole("status")).toHaveTextContent("Loading freelancers");
  });
});
