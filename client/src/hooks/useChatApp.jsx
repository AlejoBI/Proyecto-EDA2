import { useState, useEffect } from "react";
import { useChat } from "../context/ChatContext";
import { useAuth } from "../context/AuthContext";

const useChatApp = () => {
  const {
    chats,
    messages,
    errors,
    getUserChats,
    listenToMessages,
    sendMessage,
  } = useChat();
  const { user } = useAuth();

  const [filteredChats, setFilteredChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const currentUserId = user ? user.id : null;

  useEffect(() => {
    if (currentUserId) {
      const unsubscribeChats = getUserChats(currentUserId);
      return () => unsubscribeChats && unsubscribeChats();
    }
  }, [currentUserId]);

  useEffect(() => {
    if (activeChat) {
      const unsubscribeMessages = listenToMessages(activeChat);
      return () => unsubscribeMessages && unsubscribeMessages();
    }
  }, [activeChat]);

  useEffect(() => {
    setFilteredChats(
      chats.filter((chat) =>
        chat.usernames
          .filter((u) => u !== currentUserId)
          .join(", ")
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, chats, currentUserId]);

  const handleSendMessage = async () => {
    if (newMessage.trim() && activeChat) {
      try {
        await sendMessage(activeChat, currentUserId, newMessage);
        setNewMessage("");
      } catch {
        console.error(errors || "Failed to send message.");
      }
    } else {
      console.error("Message cannot be empty.");
    }
  };

  return {
    chats,
    filteredChats,
    activeChat,
    messages,
    newMessage,
    searchTerm,
    error: errors,
    user,
    setActiveChat,
    setNewMessage,
    setSearchTerm,
    handleSendMessage,
  };
};

export default useChatApp;
