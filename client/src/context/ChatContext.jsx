import { useCallback, useState } from "react";
import PropTypes from "prop-types";
import ChatContext from "./ChatContextInstance.js";

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

const getErrorMessage = (error, fallback) => {
  try {
    const message = error?.message;
    return typeof message === "string" && message.trim() ? message : fallback;
  } catch {
    return fallback;
  }
};

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
        throw new Error("User not found");
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
      const message = getErrorMessage(error, "Error creating chat");
      setErrors(message);
      throw new Error(message);
    }
  };

  const getUserChats = useCallback((userId) => {
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
      }, (error) => {
        setErrors(getErrorMessage(error, "Error fetching user chats"));
      });
      return unsubscribe;
    } catch (error) {
      setErrors(getErrorMessage(error, "Error fetching user chats"));
      return undefined;
    }
  }, []);

  const listenToMessages = useCallback((chatId) => {
    try {
      const messagesRef = collection(fireStore, `chats/${chatId}/messages`);
      const messagesQuery = query(messagesRef, orderBy("timestamp", "asc"));

      const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
        const fetchedMessages = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMessages(fetchedMessages);
      }, (error) => {
        setErrors(getErrorMessage(error, "Error fetching messages"));
      });
      return unsubscribe;
    } catch (error) {
      setErrors(getErrorMessage(error, "Error fetching messages"));
      return undefined;
    }
  }, []);

  const sendMessage = async (chatId, senderId, message) => {
    try {
      await addDoc(collection(fireStore, `chats/${chatId}/messages`), {
        senderId,
        message,
        timestamp: new Date(),
      });
      return { success: true };
    } catch (error) {
      const message = getErrorMessage(error, "Error sending message");
      setErrors(message);
      return { success: false, error: message };
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

ChatProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
