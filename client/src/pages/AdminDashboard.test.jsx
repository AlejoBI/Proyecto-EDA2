/* eslint react/prop-types: off */
import { createElement } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const dashboardMocks = vi.hoisted(() => ({
  editUser: vi.fn(),
  deleteUser: vi.fn(),
  getAllUsers: vi.fn(async () => [{ id: "user-1", username: "Before", email: "before@example.test", role: "professional" }]),
}));

vi.mock("../hooks/useAdmin.js", () => ({
  useAdmin: () => ({
    errors: null,
    editUser: dashboardMocks.editUser,
    deleteUser: dashboardMocks.deleteUser,
    getAllUsers: dashboardMocks.getAllUsers,
  }),
}));
vi.mock("../hooks/useJobs.js", () => ({ useJobs: () => ({ errors: null }) }));
vi.mock("../components/index", async () => {
  const { default: UserList } = await import("../components/AdminDashboard/UserList.jsx");
  return {
  Sidebar: () => null,
  SearchBar: () => null,
  JobsList: () => null,
  UserList: (props) => createElement(UserList, props),
  EditUserModal: ({ show, handleClose, handleConfirm }) => show
    ? createElement(
      "section",
      { role: "dialog", "aria-label": "Edit user" },
      createElement("button", {
        onClick: async () => {
          if (await handleConfirm("user-1", { username: "After" })) handleClose();
        },
      }, "Confirm edit"),
      createElement("button", { onClick: handleClose }, "Cancel edit")
    )
    : null,
  ConfirmModal: ({ show, handleClose, handleConfirm, message }) => show
    ? createElement(
      "section",
      { role: "dialog", "aria-label": message },
      createElement("button", { onClick: handleConfirm }, "Confirm delete"),
      createElement("button", { onClick: handleClose }, "Cancel delete")
    )
    : null,
  CustomToast: ({ show, message }) => show
    ? createElement("div", { role: "status" }, message)
    : null,
  };
});

import AdminDashboard from "./AdminDashboard.jsx";

function deferred() {
  let resolve;
  let reject;
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

describe("AdminDashboard administration flows", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    dashboardMocks.editUser.mockResolvedValue(undefined);
    dashboardMocks.deleteUser.mockResolvedValue(undefined);
    dashboardMocks.getAllUsers.mockResolvedValue([
      { id: "user-1", username: "Before", email: "before@example.test", role: "professional" },
    ]);
  });

  it("shows edit success only after the mutation resolves", async () => {
    const user = userEvent.setup();
    const operation = deferred();
    dashboardMocks.editUser.mockReturnValue(operation.promise);
    render(<AdminDashboard />);

    await user.click(await screen.findByRole("button", { name: "Edit" }));
    await user.click(screen.getByRole("button", { name: "Confirm edit" }));
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    expect(screen.getByRole("dialog", { name: "Edit user" })).toBeInTheDocument();

    operation.resolve();

    expect(await screen.findByRole("status")).toHaveTextContent("User edited successfully");
    await waitFor(() => expect(screen.queryByRole("dialog", { name: "Edit user" })).not.toBeInTheDocument());
  });

  it("keeps the edit modal open after a rejected mutation and shows one error toast", async () => {
    const user = userEvent.setup();
    dashboardMocks.editUser.mockRejectedValue(new Error("edit rejected"));
    render(<AdminDashboard />);

    await user.click(await screen.findByRole("button", { name: "Edit" }));
    await user.click(screen.getByRole("button", { name: "Confirm edit" }));

    expect(await screen.findByRole("status")).toHaveTextContent("Failed to edit user");
    expect(screen.getByRole("dialog", { name: "Edit user" })).toBeInTheDocument();
    expect(screen.getAllByRole("status")).toHaveLength(1);
    expect(screen.queryByText("User edited successfully")).not.toBeInTheDocument();
  });

  it("keeps delete confirmation open after rejection and shows one error toast", async () => {
    const user = userEvent.setup();
    dashboardMocks.deleteUser.mockRejectedValue(new Error("delete rejected"));
    render(<AdminDashboard />);

    await user.click(await screen.findByRole("button", { name: "Delete Before" }));
    expect(screen.getByRole("dialog", { name: "Are you sure you want to delete this user?" })).toBeInTheDocument();
    expect(dashboardMocks.deleteUser).not.toHaveBeenCalled();
    await user.click(screen.getByRole("button", { name: "Confirm delete" }));

    expect(await screen.findByRole("status")).toHaveTextContent("Failed to delete user");
    expect(screen.getByRole("dialog", { name: "Are you sure you want to delete this user?" })).toBeInTheDocument();
    expect(screen.getAllByRole("status")).toHaveLength(1);
    expect(screen.queryByText("User deleted successfully")).not.toBeInTheDocument();
  });

  it("does not invoke mutations when editing or deleting is canceled", async () => {
    const user = userEvent.setup();
    render(<AdminDashboard />);

    await user.click(await screen.findByRole("button", { name: "Edit" }));
    await user.click(screen.getByRole("button", { name: "Cancel edit" }));
    await user.click(await screen.findByRole("button", { name: "Delete Before" }));
    await user.click(screen.getByRole("button", { name: "Cancel delete" }));

    expect(dashboardMocks.editUser).not.toHaveBeenCalled();
    expect(dashboardMocks.deleteUser).not.toHaveBeenCalled();
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("renders the empty user state with fixture data and no backend", async () => {
    dashboardMocks.getAllUsers.mockResolvedValueOnce([]);
    render(<AdminDashboard />);

    expect(await screen.findByRole("heading", { name: "No users yet" })).toBeInTheDocument();
    expect(screen.getByText("User accounts will appear here when available.")).toBeInTheDocument();
  });
});
