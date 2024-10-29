import React, { useState, useEffect } from "react";
import {
  getUserChatsRequest,
  sendMessageRequest,
  getMessagesRequest,
} from "../api/chat";
import { useAuth } from "../context/AuthContext";
import "../assets/css/Chat.css";

const ChatApp = () => {
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [error, setError] = useState("");
  const { user } = useAuth();
  const currentUserId = user ? user.id : null;

  useEffect(() => {
    const fetchChats = async () => {
      try {
        setError("");
        const fetchedChats = await getUserChatsRequest(currentUserId);
        setChats(fetchedChats);
      } catch (err) {
        setError("Failed to load chats. Please try again later.");
      }
    };
    fetchChats();
  }, [currentUserId]);

  useEffect(() => {
    if (activeChat) {
      const fetchMessages = async () => {
        try {
          setError("");
          const fetchedMessages = await getMessagesRequest(activeChat);
          setMessages(fetchedMessages);
        } catch (err) {
          setError("Failed to load messages. Please try again later.");
        }
      };

      fetchMessages();

      const intervalId = setInterval(fetchMessages, 5000);

      return () => clearInterval(intervalId);
    }
  }, [activeChat]);

  const handleSendMessage = async () => {
    if (newMessage.trim() && activeChat) {
      try {
        setError("");
        await sendMessageRequest({
          chatId: activeChat,
          senderId: currentUserId,
          message: newMessage,
        });
        setNewMessage("");
      } catch (err) {
        setError("Failed to send message. Please try again.");
      }
    }
  };

  return (
    <div className="chat-app">
      {error && <div className="chat-error">{error}</div>}

      <div className="chat-sidebar">
        <div className="chat-header">
          <h2>Messages</h2>
          <input
            type="text"
            placeholder="Search Chat"
            className="chat-search"
          />
        </div>
        <div className="chat-list">
          {chats.map((chat) => (
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
                  {chat.users.filter((u) => u !== currentUserId).join(", ")}
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
                  .users.filter((u) => u !== currentUserId)
                  .join(", ")
              : "Select a chat"}
          </span>
        </div>

        <div className="chat-messages">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`message ${
                msg.senderId === currentUserId ? "self" : "other"
              }`}
            >
              <div className="message-content">{msg.message}</div>
              <span className="message-time">
                {msg.timestamp
                  ? new Date(msg.timestamp.seconds * 1000).toLocaleString()
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
            <button onClick={handleSendMessage} className="send-button">
              Send
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatApp;
