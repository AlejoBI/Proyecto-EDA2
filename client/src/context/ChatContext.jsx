import { createContext, useContext, useState } from "react";

import appFirebase from "../firebase/credentials.js";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  orderBy,
  onSnapshot,
} from "firebase/firestore";

const fireStore = getFirestore(appFirebase);

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [errors, setErrors] = useState(null);

  const createChat = async (data) => {
    try {
      const q = query(
        collection(fireStore, "chats"),
        where("users", "array-contains", data.userId)
      );

      const chatsSnapshot = await getDocs(q);

      const existingChat = chatsSnapshot.docs.find((doc) =>
        doc.data().users.includes(data.participantId)
      );

      if (existingChat) {
        return { chatId: existingChat.id };
      }

      const userRef = doc(fireStore, "users", data.userId);
      const participantRef = doc(fireStore, "users", data.participantId);

      const [userDoc, participantDoc] = await Promise.all([
        getDoc(userRef),
        getDoc(participantRef),
      ]);

      if (!userDoc.exists() || !participantDoc.exists()) {
        setErrors("User not found");
        return;
      }

      const userName = userDoc.data().username;
      const participantName = participantDoc.data().username;

      const userImage = userDoc.data().profileImage;
      const participantImage = participantDoc.data().profileImage;

      const newChat = await addDoc(collection(fireStore, "chats"), {
        users: [data.userId, data.participantId],
        usernames: [userName, participantName],
        images: [userImage, participantImage],
        createdAt: new Date(),
      });

      return { chatId: newChat.id };
    } catch (error) {
      setErrors(error.message || "Error creating chat");
      return null;
    }
  };

  const getUserChats = (userId) => {
    try {
      const q = query(
        collection(fireStore, "chats"),
        where("users", "array-contains", userId)
      );
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const fetchedChats = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setChats(fetchedChats);
      });
      return unsubscribe;
    } catch (error) {
      setErrors(error.message || "Error fetching user chats");
    }
  };

  const listenToMessages = (chatId) => {
    try {
      const messagesRef = collection(fireStore, `chats/${chatId}/messages`);
      const messagesQuery = query(messagesRef, orderBy("timestamp", "asc"));

      const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
        const fetchedMessages = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMessages(fetchedMessages);
      });
      return unsubscribe;
    } catch (error) {
      setErrors(error.message || "Error fetching messages");
    }
  };

  const sendMessage = async (chatId, senderId, message) => {
    try {
      await addDoc(collection(fireStore, `chats/${chatId}/messages`), {
        senderId,
        message,
        timestamp: new Date(),
      });
    } catch (error) {
      setErrors(error.message || "Error sending message");
    }
  };

  return (
    <ChatContext.Provider
      value={{
        chats,
        messages,
        errors,
        createChat,
        sendMessage,
        getUserChats,
        listenToMessages,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
