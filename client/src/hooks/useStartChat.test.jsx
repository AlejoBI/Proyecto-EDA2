import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  createChat: vi.fn(),
  useJobs: vi.fn(),
  useAuth: vi.fn(),
  getAllUsers: vi.fn(),
  navigate: vi.fn(),
}));

vi.mock("./useChat.js", () => ({ useChat: () => ({ createChat: mocks.createChat }) }));
vi.mock("./useJobs.js", () => ({ useJobs: () => mocks.useJobs() }));
vi.mock("./useAuth.js", () => ({ useAuth: () => mocks.useAuth() }));
vi.mock("react-router-dom", () => ({ useNavigate: () => mocks.navigate }));

import useJobsList from "./useJobsList.jsx";
import useFreelancersList from "./useFreelancersList.jsx";

const hooks = [
  ["jobs", useJobsList],
  ["freelancers", useFreelancersList],
];

beforeEach(() => {
  vi.clearAllMocks();
  vi.useFakeTimers();
  mocks.useJobs.mockReturnValue({ jobs: [], deleteJob: vi.fn() });
  mocks.getAllUsers.mockResolvedValue([]);
  mocks.useAuth.mockReturnValue({ user: { id: "me" }, isAuthenticated: true, getAllUsers: mocks.getAllUsers });
  mocks.createChat.mockResolvedValue({ chatId: "chat-1" });
});
afterEach(() => vi.useRealTimers());

describe.each(hooks)("%s useStartChat", (_name, useList) => {
  it("shows success and navigates after 3000ms only for a chat id", async () => {
    const { result } = renderHook(() => useList());
    await act(async () => result.current.handleStartChat("them"));
    expect(result.current.toastType).toBe("success");
    expect(result.current.toastMessage).toContain("éxito");
    expect(mocks.navigate).not.toHaveBeenCalled();
    await act(async () => vi.advanceTimersByTime(2999));
    expect(mocks.navigate).not.toHaveBeenCalled();
    await act(async () => vi.advanceTimersByTime(1));
    expect(mocks.navigate).toHaveBeenCalledWith("/user/chat");
  });

  it("shows rejection message without scheduling navigation", async () => {
    mocks.createChat.mockRejectedValue(new Error("Firestore offline"));
    const { result } = renderHook(() => useList());
    await act(async () => result.current.handleStartChat("them"));
    expect(result.current.toastType).toBe("error");
    expect(result.current.toastMessage).toBe("Firestore offline");
    await act(async () => vi.advanceTimersByTime(3000));
    expect(mocks.navigate).not.toHaveBeenCalled();
  });

  it("shows a controlled toast for non-Error rejection without redirecting", async () => {
    mocks.createChat.mockRejectedValue(null);
    const { result } = renderHook(() => useList());
    await act(async () => result.current.handleStartChat("them"));
    expect(result.current.toastType).toBe("error");
    expect(result.current.toastMessage).toBe("Error al iniciar el chat");
    await act(async () => vi.advanceTimersByTime(3000));
    expect(mocks.navigate).not.toHaveBeenCalled();
  });

  it("uses a fallback for a rejection with a throwing message getter", async () => {
    const rejection = Object.defineProperty({}, "message", {
      get() { throw new Error("message getter failed"); },
    });
    mocks.createChat.mockImplementationOnce(() => Promise.reject(rejection));
    const { result } = renderHook(() => useList());
    await act(async () => result.current.handleStartChat("them"));
    expect(result.current.toastType).toBe("error");
    expect(result.current.toastMessage).toBe("Error al iniciar el chat");
    await act(async () => vi.advanceTimersByTime(3000));
    expect(mocks.navigate).not.toHaveBeenCalled();
  });

  it("treats a missing chat id as an error without redirect", async () => {
    mocks.createChat.mockResolvedValue({});
    const { result } = renderHook(() => useList());
    await act(async () => result.current.handleStartChat("them"));
    expect(result.current.toastType).toBe("error");
    expect(result.current.toastMessage).toBe("Error al iniciar el chat");
    await act(async () => vi.advanceTimersByTime(3000));
    expect(mocks.navigate).not.toHaveBeenCalled();
  });
});

it("keeps the freelancers authentication guard", async () => {
  mocks.useAuth.mockReturnValue({ user: null, isAuthenticated: false, getAllUsers: mocks.getAllUsers });
  const { result } = renderHook(() => useFreelancersList());
  expect(mocks.getAllUsers).toHaveBeenCalled();
  await act(async () => result.current.handleStartChat("them"));
  expect(mocks.createChat).not.toHaveBeenCalled();
  expect(mocks.navigate).not.toHaveBeenCalled();
});
