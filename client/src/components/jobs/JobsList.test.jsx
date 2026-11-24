/* eslint react/prop-types: off */
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ state: {}, retry: vi.fn(), next: vi.fn(), previous: vi.fn() }));
vi.mock("../../hooks/useJobsList", () => ({ default: () => ({
  currentPage: 1, itemsPerPage: 8, selectedCountry: "All", selectedCity: "All",
  filteredJobs: [], currentJob: null, handleCountryChange: vi.fn(), handleCityChange: vi.fn(),
  handleNextPage: mocks.next, handlePreviousPage: mocks.previous, handleEdit: vi.fn(),
  handleDelete: vi.fn(), confirmDelete: vi.fn(), setCurrentJob: vi.fn(), handleStartChat: vi.fn(),
  toggleModal: vi.fn(), showModal: false, showToast: false, setShowToast: vi.fn(),
  toastMessage: "", toastType: "success", JobsCount: 0, usersJobsCount: [], retryJobs: mocks.retry,
  ...mocks.state,
}) }));
vi.mock("../../hooks/useAuth.js", () => ({ useAuth: () => ({ user: null, isAuthenticated: false }) }));
vi.mock("../../hooks/useParentComponentData", () => ({ default: () => ({ countriesAndCities: {} }) }));
vi.mock("../index", () => ({ CreateJob: () => null, EditJob: () => null, ConfirmModal: () => null, CustomToast: () => null }));

import JobsList from "./JobsList.jsx";

describe("JobsList UI states", () => {
  beforeEach(() => { mocks.state = {}; mocks.retry.mockClear(); mocks.next.mockClear(); mocks.previous.mockClear(); });

  it("renders a populated job card and named pagination", () => {
    mocks.state = {
      filteredJobs: [{ id: "job-1", id_user: "customer-1", title: "Synthetic Designer", company: "Example Studio", city: "Testville", country: "Exampleland", salary: "1000", description: "*.example.test" }],
      JobsCount: 1,
    };
    render(<JobsList />);
    expect(screen.getByRole("heading", { name: "Synthetic Designer" })).toBeInTheDocument();
    expect(screen.getByText("Example Studio")).toBeInTheDocument();
    expect(screen.getByRole("region", { name: "Available jobs" })).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "Job pages" })).toBeInTheDocument();
  });

  it("renders the empty state and hides pagination", () => {
    render(<JobsList />);
    expect(screen.getByText("No jobs available")).toBeInTheDocument();
    expect(screen.queryByRole("navigation", { name: "Job pages" })).not.toBeInTheDocument();
  });

  it("renders errors and retries on request", () => {
    mocks.state = { errors: "Jobs unavailable" };
    render(<JobsList />);
    expect(screen.getByRole("alert")).toHaveTextContent("Jobs unavailable");
    fireEvent.click(screen.getByRole("button", { name: "Retry" }));
    expect(mocks.retry).toHaveBeenCalledOnce();
  });

  it("shows loading status without pagination", () => {
    mocks.state = { loading: true };
    render(<JobsList />);
    expect(screen.getByRole("status")).toHaveTextContent("Loading jobs");
    expect(screen.queryByRole("navigation", { name: "Job pages" })).not.toBeInTheDocument();
  });

  it("does not expose pagination actions while loading", () => {
    mocks.state = { loading: true };
    render(<JobsList />);
    expect(screen.queryByRole("button", { name: "Previous" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Next" })).not.toBeInTheDocument();
    expect(mocks.next).not.toHaveBeenCalled();
    expect(mocks.previous).not.toHaveBeenCalled();
  });
});
