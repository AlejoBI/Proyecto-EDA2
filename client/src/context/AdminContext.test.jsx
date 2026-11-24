import { useState } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const firestoreMocks = vi.hoisted(() => ({
  getFirestore: vi.fn(() => "mock-firestore"),
  doc: vi.fn((_database, collectionName, userId) => ({ database: _database, collectionName, userId })),
  deleteDoc: vi.fn(),
  collection: vi.fn((database, collectionName) => ({ database, collectionName })),
  getDocs: vi.fn(),
  updateDoc: vi.fn(),
}));
const servicesMock = vi.hoisted(() => ({ getFirebaseServices: vi.fn(async () => ({ fireStore: "mock-firestore" })) }));

vi.mock("../firebase/credentials.js", () => ({ default: {} }));
vi.mock("firebase/firestore", () => firestoreMocks);
vi.mock("../firebase/firebaseServices.js", () => servicesMock);

import { AdminProvider } from "./AdminContext.jsx";
import { useAdmin } from "../hooks/useAdmin.js";

const initialUser = {
  id: "user-1",
  username: "Original",
  email: "original@example.test",
  role: "professional",
};

const userDocument = {
  id: initialUser.id,
  data: () => ({
    username: initialUser.username,
    email: initialUser.email,
    role: initialUser.role,
  }),
};

function AdminHarness() {
  const { users, editUser, deleteUser, getAllUsers, errors } = useAdmin();
  const [mutationError, setMutationError] = useState("");

  const runMutation = async (mutation) => {
    setMutationError("");
    try {
      await mutation();
    } catch (error) {
      setMutationError(error.message);
    }
  };

  return (
    <>
      <output aria-label="users">{JSON.stringify(users)}</output>
      <output aria-label="load-error">{errors}</output>
      <output aria-label="mutation-error">{mutationError}</output>
      <button onClick={() => runMutation(() => editUser("user-1", { username: "Updated" }))}>
        Edit user
      </button>
      <button onClick={() => runMutation(() => deleteUser("user-1"))}>Delete user</button>
      <button onClick={getAllUsers}>Reload users</button>
    </>
  );
}

function renderAdmin() {
  return render(
    <AdminProvider>
      <AdminHarness />
    </AdminProvider>
  );
}

async function expectInitialUser() {
  await waitFor(() => {
    expect(screen.getByLabelText("users")).toHaveTextContent('"username":"Original"');
  });
}

describe("AdminProvider mutations", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    firestoreMocks.getDocs.mockResolvedValue({ docs: [userDocument] });
    firestoreMocks.updateDoc.mockResolvedValue(undefined);
    firestoreMocks.deleteDoc.mockResolvedValue(undefined);
    firestoreMocks.collection.mockImplementation((database, collectionName) => ({ database, collectionName }));
    firestoreMocks.doc.mockImplementation((database, collectionName, userId) => ({ database, collectionName, userId }));
  });

  it("updates the local user only after edit succeeds", async () => {
    const user = userEvent.setup();
    renderAdmin();
    await expectInitialUser();

    await user.click(screen.getByRole("button", { name: "Edit user" }));

    await waitFor(() => {
      expect(screen.getByLabelText("users")).toHaveTextContent('"username":"Updated"');
    });
    expect(firestoreMocks.updateDoc).toHaveBeenCalledWith(
      { database: "mock-firestore", collectionName: "users", userId: "user-1" },
      { username: "Updated" }
    );
  });

  it("propagates edit rejection and preserves the local user", async () => {
    const user = userEvent.setup();
    const failure = new Error("edit rejected");
    firestoreMocks.updateDoc.mockRejectedValue(failure);
    renderAdmin();
    await expectInitialUser();

    await user.click(screen.getByRole("button", { name: "Edit user" }));

    await waitFor(() => expect(screen.getByLabelText("users")).toHaveTextContent('"username":"Original"'));
    expect(screen.getByLabelText("users")).not.toHaveTextContent('"username":"Updated"');
    expect(await screen.findByLabelText("mutation-error")).toHaveTextContent("edit rejected");
  });

  it("removes the local user only after deletion succeeds", async () => {
    const user = userEvent.setup();
    renderAdmin();
    await expectInitialUser();

    await user.click(screen.getByRole("button", { name: "Delete user" }));

    await waitFor(() => expect(screen.getByLabelText("users")).toHaveTextContent("[]"));
    expect(firestoreMocks.deleteDoc).toHaveBeenCalledWith({
      database: "mock-firestore",
      collectionName: "users",
      userId: "user-1",
    });
  });

  it("loads from the explicit users collection and surfaces collection construction errors", async () => {
    renderAdmin();
    await expectInitialUser();
    expect(firestoreMocks.collection).toHaveBeenCalledWith("mock-firestore", "users");
    expect(firestoreMocks.getDocs).toHaveBeenCalledWith({ database: "mock-firestore", collectionName: "users" });

    const failure = new Error("collection construction failed");
    firestoreMocks.collection.mockImplementationOnce(() => { throw failure; });
    await userEvent.click(screen.getByRole("button", { name: "Reload users" }));
    expect(await screen.findByLabelText("load-error")).toHaveTextContent(failure.message);
  });

  it("preserves the local user when deletion is rejected", async () => {
    const user = userEvent.setup();
    firestoreMocks.deleteDoc.mockRejectedValue(new Error("delete rejected"));
    renderAdmin();
    await expectInitialUser();

    await user.click(screen.getByRole("button", { name: "Delete user" }));

    expect(screen.getByLabelText("users")).toHaveTextContent('"username":"Original"');
    expect(await screen.findByLabelText("mutation-error")).toHaveTextContent("delete rejected");
  });
});
