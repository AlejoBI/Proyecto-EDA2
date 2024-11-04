import { useState, useEffect } from "react";
import {
  getUserChatsRequest,
  sendMessageRequest,
  getMessagesRequest,
} from "../api/chat";
import { useAuth } from "../context/AuthContext";

const useChat = () => {
  const [chats, setChats] = useState([]);
  const [filteredChats, setFilteredChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const { user } = useAuth();
  const currentUserId = user ? user.id : null;

  useEffect(() => {
    const fetchChats = async () => {
      try {
        setError("");
        const fetchedChats = await getUserChatsRequest(currentUserId);
        setChats(fetchedChats);
        setFilteredChats(fetchedChats);
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
    } else {
      setError("Message cannot be empty.");
    }
  };

  return {
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
  };
};

export default useChat;
