import axios from './axios';

export const createChatRequest = async (chatData) => {
  const res = await axios.post("/create-chat", chatData);
  return res.data;
};

export const getUserChatsRequest = async (userId) => {
    const res = await axios.get(`/chats/${userId}`);
    return res.data; 
};

export const sendMessageRequest = async (messageData) => {
    const res = await axios.post('/send-message', messageData);
    return res.data;
};

export const getMessagesRequest = async (chatId) => {
    const res = await axios.get(`/chats/${chatId}/messages`);
    return res.data;
};
