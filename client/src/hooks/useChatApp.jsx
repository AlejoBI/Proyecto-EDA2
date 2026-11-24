import { useState, useEffect } from "react";
import { useChat } from "./useChat.js";
import { useAuth } from "./useAuth.js";

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
  }, [currentUserId, getUserChats]);

  useEffect(() => {
    if (activeChat) {
      const unsubscribeMessages = listenToMessages(activeChat);
      return () => unsubscribeMessages && unsubscribeMessages();
    }
  }, [activeChat, listenToMessages]);

  useEffect(() => {
    setFilteredChats(
      chats.filter((chat) =>
        chat.usernames
          .filter((u) => u !== user?.username)
          .join(", ")
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, chats, user?.username]);

  const handleSendMessage = async () => {
    if (newMessage.trim() && activeChat) {
      try {
        const result = await sendMessage(activeChat, currentUserId, newMessage);
        if (result?.success) {
          setNewMessage("");
        }
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
