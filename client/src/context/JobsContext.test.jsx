/* eslint react/prop-types: off */
import { act, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ getFirebaseServices: vi.fn(), getDocs: vi.fn(), collection: vi.fn(), query: vi.fn() }));
vi.mock("../firebase/firebaseServices.js", () => ({ getFirebaseServices: mocks.getFirebaseServices }));
vi.mock("firebase/firestore", () => ({
  collection: mocks.collection,
  query: mocks.query,
  getDocs: mocks.getDocs,
  doc: vi.fn(), setDoc: vi.fn(), getDoc: vi.fn(), updateDoc: vi.fn(), deleteDoc: vi.fn(),
}));

import { JobsProvider } from "./JobsContext.jsx";
import JobsContext from "./JobsContextInstance.js";

function Probe() {
  const { jobs, loading, errors, getAllJobs } = React.useContext(JobsContext);
  return <div><output data-testid="jobs">{jobs.map((job) => job.title).join(",")}</output>
    <output data-testid="state">{`${loading}:${errors || ""}`}</output>
    <button onClick={() => getAllJobs()}>refresh</button></div>;
}

import React from "react";

describe("JobsProvider request concurrency", () => {
  it("keeps the newest overlapping response and ignores updates after unmount", async () => {
    const db = { marker: "explicit jobs database" };
    const jobsCollection = { path: "jobs collection" };
    const jobsQuery = { path: "jobs query" };
    mocks.collection.mockReturnValue(jobsCollection);
    mocks.query.mockReturnValue(jobsQuery);
    const services = { fireStore: db, auth: { currentUser: null } };
    mocks.getFirebaseServices.mockResolvedValue(services);
    let resolveInitial;
    let resolveFirst;
    let resolveSecond;
    mocks.getDocs
      .mockReturnValueOnce(new Promise((resolve) => { resolveInitial = resolve; }))
      .mockReturnValueOnce(new Promise((resolve) => { resolveFirst = resolve; }))
      .mockReturnValueOnce(new Promise((resolve) => { resolveSecond = resolve; }));
    const view = render(<JobsProvider><Probe /></JobsProvider>);
    await act(async () => { await Promise.resolve(); });
    expect(mocks.collection).toHaveBeenCalledWith(db, "jobs");
    expect(mocks.query).toHaveBeenCalledWith(jobsCollection);
    expect(mocks.getDocs).toHaveBeenCalledWith(jobsQuery);
    await act(async () => { screen.getByText("refresh").click(); screen.getByText("refresh").click(); });
    await act(async () => resolveSecond({ docs: [{ id: "new", data: () => ({ title: "newest" }) }] }));
    await act(async () => resolveFirst({ docs: [{ id: "old", data: () => ({ title: "stale" }) }] }));
    expect(screen.getByTestId("jobs")).toHaveTextContent("newest");
    expect(screen.getByTestId("jobs")).not.toHaveTextContent("stale");
    view.unmount();
    await act(async () => resolveInitial({ docs: [{ id: "initial", data: () => ({ title: "initial" }) }] }));
  });
});
