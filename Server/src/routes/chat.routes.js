import { Router } from 'express';
import { createChat, sendMessage, getMessages, getUserChats } from '../controllers/chat.controller.js';

const router = Router();

router.post('/create-chat', createChat);

router.post('/send-message', sendMessage);

router.get('/chats/:userId', getUserChats);

router.get('/chats/:chatId/messages', getMessages);

export default router;