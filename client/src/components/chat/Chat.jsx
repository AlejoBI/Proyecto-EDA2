import { useState, useEffect } from "react";
import useChatApp from "../../hooks/useChatApp";
import { CustomToast } from "../index";
import "../../assets/css/Chat.css";
import logo from "../../assets/images/logo.png";

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
  const [chatImageIndices, setChatImageIndices] = useState({});

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

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && activeChat) {
        setActiveChat(null);
        setNewMessage("");
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeChat, setActiveChat, setNewMessage]);

  const handleSetActiveChat = (chatId, chatUsernames) => {
    setActiveChat(chatId);
    const userIndex = chatUsernames.findIndex((u) => u !== user.username);

    setChatImageIndices((prevIndices) => ({
      ...prevIndices,
      [chatId]: userIndex >= 0 ? userIndex : 0,
    }));
  };

  useEffect(() => {
    const initialImageIndices = {};
    filteredChats.forEach((chat) => {
      const userIndex = chat.usernames.findIndex((u) => u !== user.username);
      initialImageIndices[chat.id] = userIndex >= 0 ? userIndex : 0;
    });
    setChatImageIndices(initialImageIndices);
  }, [filteredChats, user.username]);

  return (
    <div className={`chat-app ${activeChat ? "has-active-chat" : "no-active-chat"}`} data-active-chat={activeChat ? "true" : "false"}>
      <div className="chat-sidebar">
        <div className="chat-header">
          <h2>Messages</h2>
          <label className="chat-search-label" htmlFor="chat-search">Search conversations</label>
          <input
            id="chat-search"
            type="text"
            placeholder="Search chats"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="chat-search"
          />
        </div>
        <div className="chat-list">
          {filteredChats.map((chat) => (
            <button
              key={chat.id}
              className="chat-item"
              onClick={() => handleSetActiveChat(chat.id, chat.usernames)}
              aria-pressed={activeChat === chat.id}
              aria-label={`Open chat with ${chat.usernames.filter((u) => u !== user.username).join(", ")}`}
            >
                  <div className="chat-avatar-container">
                <img
                  src={
                    chat.images?.filter((i) => i !== user.image)[
                      chatImageIndices[chat.id]
                    ] || logo
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
            </button>
          ))}
        </div>
      </div>

      <div className="chat-window">
        <div className="chat-header-window">
          {activeChat && (
            <button
              type="button"
              className="chat-back-button"
              onClick={() => { setActiveChat(null); setNewMessage(""); }}
              aria-label="Back to conversations"
            >
              Back to conversations
            </button>
          )}
          <div className="chat-avatar-container">
            {activeChat ? (
              (() => {
                const activeChatData = chats.find((chat) => chat.id === activeChat);
                if (!activeChatData) {
                  return <img src={logo} alt="Profile" className="chat-avatar" />;
                }
                return (
                  <img
                    src={
                      activeChatData.images?.filter((i) => i !== user.image)[
                        chatImageIndices[activeChat]
                      ] || logo
                    }
                    alt="Profile"
                    className="chat-avatar"
                  />
                );
              })()
            ) : (
              <img src={logo} alt="Profile" className="chat-avatar" />
            )}
          </div>
          <span className="chat-window-name">
            {activeChat
              ? (() => {
                  const activeChatData = chats.find((chat) => chat.id === activeChat);
                  if (!activeChatData) return "Unknown";
                  return activeChatData.usernames.filter((u) => u !== user.username).join(", ");
                })()
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
            <label className="chat-composer-label" htmlFor="chat-message">Message</label>
            <input
              id="chat-message"
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
              aria-label="Send message"
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
