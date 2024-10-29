import appFirebase from "../firebase/credentials.js";
import { getFirestore, collection, addDoc, query, where, getDocs, doc, getDoc, orderBy, onSnapshot } from "firebase/firestore";
const fireStore = getFirestore(appFirebase);

// Crear un nuevo chat entre dos usuarios
export const createChat = async (req, res) => {
    const { userId, participantId } = req.body;
    try {
        // Verificar si ya existe un chat entre estos dos usuarios
        const q = query(
            collection(fireStore, "chats"),
            where("users", "array-contains", userId)
        );
        const chatsSnapshot = await getDocs(q);

        // Buscar entre los chats existentes si los usuarios ya están en uno juntos
        const existingChat = chatsSnapshot.docs.find(
            (doc) => doc.data().users.includes(participantId)
        );

        if (existingChat) {
            return res.status(200).json({ chatId: existingChat.id });
        }

        // Crear un nuevo chat si no existe
        const newChat = await addDoc(collection(fireStore, "chats"), {
            users: [userId, participantId],
            createdAt: new Date()
        });

        return res.status(201).json({ chatId: newChat.id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Enviar un mensaje en un chat existente
export const sendMessage = async (req, res) => {
    const { chatId, senderId, message } = req.body;
    try {
        const chatRef = doc(fireStore, "chats", chatId);
        const chatDoc = await getDoc(chatRef);

        if (!chatDoc.exists()) {
            return res.status(404).json({ message: "Chat not found" });
        }

        // Añadir un nuevo mensaje a la colección de mensajes del chat
        await addDoc(collection(fireStore, `chats/${chatId}/messages`), {
            senderId,
            message,
            timestamp: new Date(),
        });

        return res.status(200).json({ message: "Message sent" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtener los mensajes de un chat
export const getMessages = async (req, res) => {
    const { chatId } = req.params;
    try {
        const messagesRef = collection(fireStore, `chats/${chatId}/messages`);
        const messagesQuery = query(messagesRef, orderBy("timestamp", "asc"));

        const messagesSnapshot = await getDocs(messagesQuery);
        const messages = messagesSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        return res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtener todos los chats de un usuario
export const getUserChats = async (req, res) => {
    const { userId } = req.params;
    try {
        const q = query(collection(fireStore, "chats"), where("users", "array-contains", userId));
        const chatsSnapshot = await getDocs(q);

        const chats = chatsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        return res.status(200).json(chats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
