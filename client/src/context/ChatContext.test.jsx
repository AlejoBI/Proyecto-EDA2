import { act, render, screen, waitFor } from "@testing-library/react";
import { useEffect, useState } from "react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const firestore = vi.hoisted(() => ({
  getFirestore: vi.fn(() => "mock-db"),
  collection: vi.fn(() => "mock-collection"),
  addDoc: vi.fn(),
  query: vi.fn(() => "mock-query"),
  where: vi.fn(),
  getDocs: vi.fn(),
  doc: vi.fn((_db, collectionName, id) => ({ collectionName, id })),
  getDoc: vi.fn(),
  orderBy: vi.fn(),
  onSnapshot: vi.fn(),
}));
const servicesMock = vi.hoisted(() => ({ getFirebaseServices: vi.fn(async () => ({ fireStore: "mock-db" })) }));

vi.mock("../firebase/credentials.js", () => ({ default: {} }));
vi.mock("firebase/firestore", () => firestore);
vi.mock("../firebase/firebaseServices.js", () => servicesMock);

import { ChatProvider } from "./ChatContext.jsx";
import { useChat } from "../hooks/useChat.js";

function Probe() {
  const { createChat, getUserChats, errors } = useChat();
  const [chatId, setChatId] = useState("");
  const run = async () => {
    try {
      const result = await createChat({ userId: "me", participantId: "them" });
      setChatId(result.chatId);
    } catch (error) {
      window.chatFailure = error.message;
    }
  };
  return <><button onClick={run}>Start</button><button onClick={() => getUserChats("me")}>Listen</button><output>{errors}</output><output aria-label="chat-id">{chatId}</output></>;
}

function ListenerProbe() {
  const { getUserChats } = useChat();
  useEffect(() => getUserChats("me"), [getUserChats]);
  return null;
}

function setup() {
  return render(<ChatProvider><Probe /></ChatProvider>);
}

describe("ChatProvider createChat", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    delete window.chatFailure;
  });

  it("returns an existing chat id", async () => {
    firestore.getDocs.mockResolvedValue({ docs: [{ id: "existing", data: () => ({ users: ["me", "them"] }) }] });
    setup();
    await userEvent.click(screen.getByRole("button", { name: "Start" }));
    await waitFor(() => expect(firestore.getDocs).toHaveBeenCalled());
    expect(firestore.collection).toHaveBeenCalledWith("mock-db", "chats");
    expect(firestore.where).toHaveBeenCalledWith("users", "array-contains", "me");
    expect(firestore.query).toHaveBeenCalledWith("mock-collection", undefined);
    expect(firestore.getDocs).toHaveBeenCalledWith("mock-query");
    expect(await screen.findByLabelText("chat-id")).toHaveTextContent("existing");
    expect(firestore.getDoc).not.toHaveBeenCalled();
  });

  it("creates a chat and resolves its id", async () => {
    firestore.getDocs.mockResolvedValue({ docs: [] });
    firestore.getDoc.mockResolvedValue({ exists: () => true, data: () => ({ username: "User", profileImage: "image" }) });
    firestore.addDoc.mockResolvedValue({ id: "new-chat" });
    setup();
    await userEvent.click(screen.getByRole("button", { name: "Start" }));
    await waitFor(() => expect(firestore.addDoc).toHaveBeenCalled());
    expect(firestore.doc).toHaveBeenNthCalledWith(1, "mock-db", "users", "me");
    expect(firestore.doc).toHaveBeenNthCalledWith(2, "mock-db", "users", "them");
    expect(firestore.addDoc).toHaveBeenCalledWith("mock-collection", expect.objectContaining({ users: ["me", "them"] }));
    expect(await screen.findByLabelText("chat-id")).toHaveTextContent("new-chat");
  });

  it("rejects for missing users and reports the error", async () => {
    firestore.getDocs.mockResolvedValue({ docs: [] });
    firestore.getDoc.mockResolvedValue({ exists: () => false });
    setup();
    await userEvent.click(screen.getByRole("button", { name: "Start" }));
    expect(await screen.findByText("User not found")).toBeInTheDocument();
    await waitFor(() => expect(window.chatFailure).toBe("User not found"));
  });

  it("preserves Firestore rejection and exposes its message", async () => {
    firestore.getDocs.mockRejectedValue(new Error("Firestore offline"));
    setup();
    await userEvent.click(screen.getByRole("button", { name: "Start" }));
    expect(await screen.findByText("Firestore offline")).toBeInTheDocument();
    await waitFor(() => expect(window.chatFailure).toBe("Firestore offline"));
  });

  it("does not attach a snapshot listener when services resolve after unmount", async () => {
    let resolveServices;
    servicesMock.getFirebaseServices.mockImplementation(() => new Promise((resolve) => { resolveServices = resolve; }));
    firestore.onSnapshot.mockReturnValue(vi.fn());
    const { unmount } = render(<ChatProvider><ListenerProbe /></ChatProvider>);
    unmount();

    await act(async () => {
      resolveServices({ fireStore: "mock-db" });
      await Promise.resolve();
    });

    expect(firestore.onSnapshot).not.toHaveBeenCalled();
  });

  it("does not report a services rejection after unmount", async () => {
    let rejectServices;
    servicesMock.getFirebaseServices.mockImplementation(() => new Promise((_resolve, reject) => { rejectServices = reject; }));
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    const { unmount } = render(<ChatProvider><ListenerProbe /></ChatProvider>);
    unmount();

    await act(async () => {
      rejectServices(new Error("Services unavailable"));
      await Promise.resolve();
    });

    expect(firestore.onSnapshot).not.toHaveBeenCalled();
    expect(consoleError).not.toHaveBeenCalled();
    consoleError.mockRestore();
  });

});
