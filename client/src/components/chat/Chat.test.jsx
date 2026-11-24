/* eslint-disable react/prop-types */
import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";

const mockChat = vi.hoisted(() => ({
  chats: [], filteredChats: [], activeChat: null, messages: [], newMessage: "",
  searchTerm: "", error: null, user: { id: "local-user", username: "local", image: "" },
  setActiveChat: vi.fn(), setNewMessage: vi.fn(), setSearchTerm: vi.fn(), handleSendMessage: vi.fn(),
}));

vi.mock("../../hooks/useChatApp", () => ({ default: () => mockChat }));
vi.mock("../index", () => ({ CustomToast: ({ show, message }) => show ? <div role="alert">{message}</div> : null }));

import Chat from "./Chat";

describe("Chat UI", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Object.assign(mockChat, { chats: [], filteredChats: [], activeChat: null, messages: [], newMessage: "", searchTerm: "", error: null });
  });

  it("keeps the current chat error visible through the toast", async () => {
    mockChat.error = "Unable to load chats";
    render(<Chat />);
    expect(await screen.findByRole("alert")).toHaveTextContent("Unable to load chats");
  });

  it("exposes labeled search and keyboard-focusable conversation controls", () => {
    mockChat.chats = [{ id: "chat-1", usernames: ["local", "Taylor"], images: [] }];
    mockChat.filteredChats = mockChat.chats;
    render(<Chat />);
    expect(screen.getByRole("textbox", { name: "Search conversations" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Open chat with Taylor" })).toBeInTheDocument();
  });

  it("uses a full-width conversation list when no chat is selected", () => {
    const { container } = render(<Chat />);
    expect(container.querySelector(".chat-app")).toHaveClass("no-active-chat");
    expect(container.querySelector(".chat-app")).toHaveAttribute("data-active-chat", "false");
    expect(screen.queryByRole("button", { name: "Back to conversations" })).not.toBeInTheDocument();
  });

  it("returns from a selected chat to conversations and clears the composer", () => {
    mockChat.chats = [{ id: "chat-1", usernames: ["local", "Taylor"], images: [] }];
    mockChat.filteredChats = mockChat.chats;
    mockChat.activeChat = "chat-1";
    mockChat.newMessage = "draft";
    const { container } = render(<Chat />);
    expect(container.querySelector(".chat-app")).toHaveClass("has-active-chat");
    const backButton = screen.getByRole("button", { name: "Back to conversations" });
    expect(backButton).toBeInTheDocument();
    fireEvent.click(backButton);
    expect(mockChat.setActiveChat).toHaveBeenCalledWith(null);
    expect(mockChat.setNewMessage).toHaveBeenCalledWith("");
  });

  it("keeps message sending and error toast contracts", () => {
    mockChat.chats = [{ id: "chat-1", usernames: ["local", "Taylor"], images: [] }];
    mockChat.filteredChats = mockChat.chats;
    mockChat.activeChat = "chat-1";
    mockChat.newMessage = "Hello";
    mockChat.error = "Unable to send";
    render(<Chat />);
    expect(screen.getByRole("alert")).toHaveTextContent("Unable to send");
    fireEvent.click(screen.getByRole("button", { name: "Send message" }));
    expect(mockChat.handleSendMessage).toHaveBeenCalled();
  });
});
