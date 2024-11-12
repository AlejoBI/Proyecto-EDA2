import React, { useState, useEffect } from "react";
import useChatApp from "../../hooks/useChatApp";
import { CustomToast } from "../index";
import "../../assets/css/Chat.css";

const ChatApp = () => {
  const {
    chats,
    filteredChats,
    activeChat,
    messages,
    newMessage,
    searchTerm,
    error,
    user,
    setActiveChat,
    setNewMessage,
    setSearchTerm,
    handleSendMessage,
  } = useChatApp();

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastColor, setToastColor] = useState("green");
  const [indexImage, setIndexImage] = useState(null);

  useEffect(() => {
    if (error) {
      handleShowToast(error, "white");
    }
  }, [error]);

  const handleShowToast = (message, color) => {
    setToastMessage(message);
    setToastColor(color);
    setShowToast(true);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape" && activeChat) {
      setActiveChat(null);
      setNewMessage("");
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeChat]);

  const handleSetActiveChat = (chatId, chatUsernames) => {
    setActiveChat(chatId);
    const userIndex = chatUsernames.findIndex((u) => u !== user.username);
    setIndexImage(userIndex >= 0 ? userIndex : 0);
  };

  useEffect(() => {
    if (filteredChats.length > 0 && indexImage === null) {
      const initialChat = filteredChats[0];
      const initialUserIndex = initialChat.usernames.findIndex(
        (u) => u !== user.username
      );
      setIndexImage(initialUserIndex >= 0 ? initialUserIndex : 0);
    }
  }, [filteredChats, indexImage, user.username]);

  return (
    <div className="chat-app">
      <div className="chat-sidebar">
        <div className="chat-header">
          <h2>Messages</h2>
          <input
            type="text"
            placeholder="Search Chat"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="chat-search"
          />
        </div>
        <div className="chat-list">
          {filteredChats.map((chat) => (
            <div
              key={chat.id}
              className="chat-item"
              onClick={() => handleSetActiveChat(chat.id, chat.usernames)}
            >
              <div className="chat-avatar-container">
                <img
                  src={
                    chat.images.filter((i) => i !== user.image)[indexImage] ||
                    "https://via.placeholder.com/50"
                  }
                  alt="Profile"
                  className="chat-avatar"
                />
              </div>
              <div className="chat-info">
                <span className="chat-name">
                  {chat.usernames.filter((u) => u !== user.username).join(", ")}
                </span>
                <span className="chat-time">Last message</span>
              </div>
              <span className="chat-status"></span>
            </div>
          ))}
        </div>
      </div>

      <div className="chat-window">
        <div className="chat-header-window">
          <div className="chat-avatar-container">
            {activeChat ? (
              <img
                src={
                  chats
                    .find((chat) => chat.id === activeChat)
                    .images.filter((i) => i !== user.image)[indexImage] ||
                  "https://via.placeholder.com/50"
                }
                alt="Profile"
                className="chat-avatar"
              />
            ) : (
              <img
                src="https://via.placeholder.com/50"
                alt="Profile"
                className="chat-avatar"
              />
            )}
          </div>
          <span className="chat-window-name">
            {activeChat
              ? chats
                  .find((chat) => chat.id === activeChat)
                  .usernames.filter((u) => u !== user.username)
                  .join(", ")
              : "Select a chat"}
          </span>
        </div>

        <div className="chat-messages">
          {activeChat ? (
            messages.length > 0 ? (
              messages.map((msg, index) => (
                <div
                  key={index}
                  className={`message ${
                    msg.senderId === user.id ? "self" : "other"
                  }`}
                >
                  <div className="message-content">{msg.message}</div>
                  <span className="message-time">
                    {msg.timestamp
                      ? new Date(
                          msg.timestamp.seconds * 1000
                        ).toLocaleTimeString()
                      : "Loading..."}
                  </span>
                </div>
              ))
            ) : (
              <p>No messages</p>
            )
          ) : (
            <p>Select a chat</p>
          )}
        </div>

        {activeChat && (
          <div className="chat-input-container">
            <input
              type="text"
              placeholder="Write a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              className="chat-input"
            />
            <button
              onClick={handleSendMessage}
              className="send-button"
              disabled={!newMessage.trim()}
            >
              Send
            </button>
          </div>
        )}
      </div>

      <CustomToast
        show={showToast}
        message={toastMessage}
        color={toastColor}
        position={{ top: "0", right: "0" }}
        duration={3000}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
};

export default ChatApp;
