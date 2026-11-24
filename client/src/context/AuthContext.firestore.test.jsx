/* eslint react/prop-types: off */
import React from "react";
import { act, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getFirebaseServices: vi.fn(),
  onAuthStateChanged: vi.fn(),
  createUserWithEmailAndPassword: vi.fn(),
  signInWithEmailAndPassword: vi.fn(),
  signOut: vi.fn(),
  GoogleAuthProvider: vi.fn(),
  GithubAuthProvider: vi.fn(),
  signInWithPopup: vi.fn(),
  collection: vi.fn(),
  query: vi.fn(),
  getDocs: vi.fn(),
  doc: vi.fn(),
  getDoc: vi.fn(),
  setDoc: vi.fn(),
}));

vi.mock("../firebase/firebaseServices.js", () => ({ getFirebaseServices: mocks.getFirebaseServices }));
vi.mock("firebase/auth", () => ({
  onAuthStateChanged: mocks.onAuthStateChanged,
  createUserWithEmailAndPassword: mocks.createUserWithEmailAndPassword,
  signInWithEmailAndPassword: mocks.signInWithEmailAndPassword,
  signOut: mocks.signOut,
  GoogleAuthProvider: mocks.GoogleAuthProvider,
  GithubAuthProvider: mocks.GithubAuthProvider,
  signInWithPopup: mocks.signInWithPopup,
}));
vi.mock("firebase/firestore", () => ({
  collection: mocks.collection,
  query: mocks.query,
  getDocs: mocks.getDocs,
  doc: mocks.doc,
  getDoc: mocks.getDoc,
  setDoc: mocks.setDoc,
}));

import { AuthProvider } from "./AuthContext.jsx";
import AuthContext from "./AuthContextInstance.js";

function Probe() {
  const { getAllUsers, signin, profile } = React.useContext(AuthContext);
  return <>
    <button onClick={async () => { const users = await getAllUsers(); document.querySelector("output").textContent = JSON.stringify(users); }}>users</button>
    <button onClick={() => signin({ email: "local@example.test", password: "local-only" })}>signin</button>
    <button onClick={() => profile()}>profile</button>
    <output />
  </>;
}

const db = { name: "mock firestore" };
const auth = { currentUser: { uid: "uid-123" } };

async function mountReadyProvider() {
  mocks.getFirebaseServices.mockResolvedValue({ auth, fireStore: db });
  mocks.onAuthStateChanged.mockImplementation((_auth, callback) => {
    callback(null);
    return vi.fn();
  });
  render(<AuthProvider><Probe /></AuthProvider>);
  await act(async () => { await Promise.resolve(); await Promise.resolve(); });
}

describe("AuthContext Firestore calls", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("loads users from the users collection and maps document data", async () => {
    const usersCollection = { type: "collection ref" };
    const usersQuery = { type: "query" };
    mocks.collection.mockReturnValue(usersCollection);
    mocks.query.mockReturnValue(usersQuery);
    mocks.getDocs.mockResolvedValue({ docs: [
      { id: "user-1", data: () => ({ username: "Ada", role: "customer" }) },
      { id: "user-2", data: () => ({ username: "Lin", role: "admin" }) },
    ] });

    await mountReadyProvider();
    await act(async () => { screen.getByRole("button", { name: "users" }).click(); });

    expect(mocks.collection).toHaveBeenCalledOnce();
    expect(mocks.collection).toHaveBeenCalledWith(db, "users");
    expect(mocks.query).toHaveBeenCalledOnce();
    expect(mocks.query).toHaveBeenCalledWith(usersCollection);
    expect(mocks.getDocs).toHaveBeenCalledOnce();
    expect(mocks.getDocs).toHaveBeenCalledWith(usersQuery);
    expect(screen.getByText('[{"id":"user-1","username":"Ada","role":"customer"},{"id":"user-2","username":"Lin","role":"admin"}]')).toBeInTheDocument();
  });

  it("reads the signed-in user's document during sign in", async () => {
    const userRef = { type: "user doc" };
    mocks.doc.mockReturnValue(userRef);
    mocks.signInWithEmailAndPassword.mockResolvedValue({ user: { uid: "uid-123" } });
    mocks.getDoc.mockResolvedValue({ exists: () => true, data: () => ({ username: "Ada" }) });

    await mountReadyProvider();
    await act(async () => { screen.getByRole("button", { name: "signin" }).click(); });

    expect(mocks.doc).toHaveBeenCalledWith(db, "users", "uid-123");
    expect(mocks.getDoc).toHaveBeenCalledWith(userRef);
  });
});
