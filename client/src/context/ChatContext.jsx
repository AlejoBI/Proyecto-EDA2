import { useCallback, useRef, useState } from "react";
import PropTypes from "prop-types";
import ChatContext from "./ChatContextInstance.js";
import { getFirebaseServices } from "../firebase/firebaseServices.js";
import { collection, addDoc, query, where, getDocs, doc, getDoc, orderBy, onSnapshot } from "firebase/firestore";

const errorMessage = (error, fallback) => typeof error?.message === "string" && error.message.trim() ? error.message : fallback;

export const ChatProvider = ({ children }) => {
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [errors, setErrors] = useState(null);
  const servicesRef = useRef(null);
  const getServices = () => servicesRef.current || getFirebaseServices().then((services) => (servicesRef.current = services));

  const createChat = async (data) => {
    try {
      const { fireStore } = await getServices();
      const q = query(collection(fireStore, "chats"), where("users", "array-contains", data.userId));
      const snapshot = await getDocs(q);
      const existing = snapshot.docs.find((item) => item.data().users.includes(data.participantId));
      if (existing) return { chatId: existing.id };
      const [userDoc, participantDoc] = await Promise.all([getDoc(doc(fireStore, "users", data.userId)), getDoc(doc(fireStore, "users", data.participantId))]);
      if (!userDoc.exists() || !participantDoc.exists()) throw new Error("User not found");
      const chat = await addDoc(collection(fireStore, "chats"), { users: [data.userId, data.participantId], usernames: [userDoc.data().username, participantDoc.data().username], images: [userDoc.data().profileImage, participantDoc.data().profileImage], createdAt: new Date() });
      return { chatId: chat.id };
    } catch (error) { const message = errorMessage(error, "Error creating chat"); setErrors(message); throw new Error(message); }
  };

  const listen = useCallback((buildQuery, setter, fallback) => {
    let cancelled = false;
    let unsubscribe;
    getServices().then(({ fireStore }) => {
      if (cancelled) return;
      unsubscribe = onSnapshot(buildQuery(fireStore), (snapshot) => setter(snapshot.docs.map((item) => ({ id: item.id, ...item.data() }))), (error) => setErrors(errorMessage(error, fallback)));
      if (cancelled) unsubscribe();
    }).catch((error) => { if (!cancelled) setErrors(errorMessage(error, fallback)); });
    return () => { cancelled = true; unsubscribe?.(); };
  }, []);
  const getUserChats = useCallback((userId) => listen((db) => query(collection(db, "chats"), where("users", "array-contains", userId)), setChats, "Error fetching user chats"), [listen]);
  const listenToMessages = useCallback((chatId) => listen((db) => query(collection(db, `chats/${chatId}/messages`), orderBy("timestamp", "asc")), setMessages, "Error fetching messages"), [listen]);
  const sendMessage = async (chatId, senderId, message) => {
    try { const { fireStore } = await getServices(); await addDoc(collection(fireStore, `chats/${chatId}/messages`), { senderId, message, timestamp: new Date() }); return { success: true }; }
    catch (error) { const messageText = errorMessage(error, "Error sending message"); setErrors(messageText); return { success: false, error: messageText }; }
  };
  return <ChatContext.Provider value={{ chats, messages, errors, createChat, sendMessage, getUserChats, listenToMessages }}>{children}</ChatContext.Provider>;
};
ChatProvider.propTypes = { children: PropTypes.node.isRequired };
