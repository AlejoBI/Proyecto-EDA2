import React, { useState, useEffect } from "react";
import useChat from "../hooks/useChat";
import { CustomToast } from "./index";
import "../assets/css/Chat.css";

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
  } = useChat();

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastColor, setToastColor] = useState("green");

  useEffect(() => {
    if (error) {
      handleShowToast(error, "red");
    }
  }, [error]);

  const handleShowToast = (message, color) => {
    setToastMessage(message);
    setToastColor(color);
    setShowToast(true);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape" && activeChat) {
      setActiveChat(null); // Desactiva el chat activo
      setNewMessage(""); // Limpia el campo de nuevo mensaje
    }
  };

  useEffect(() => {
    // Añadir el event listener al montar el componente
    window.addEventListener("keydown", handleKeyDown);

    // Limpiar el event listener al desmontar el componente
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeChat]); // Solo se ejecuta cuando activeChat cambia

  return (
    <div className="chat-app">
      {error && <div className="chat-error">{error}</div>}

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
              onClick={() => setActiveChat(chat.id)}
            >
              <img
                src="https://via.placeholder.com/50"
                alt="Profile"
                className="chat-avatar"
              />
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
          <img
            src="https://via.placeholder.com/50"
            alt="Profile"
            className="chat-window-avatar"
          />
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
          {activeChat &&
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
            ))}
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
