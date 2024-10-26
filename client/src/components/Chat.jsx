import React, { useState } from 'react';
import '../assets/css/Chat.css';

const ChatApp = () => {
  const [messages, setMessages] = useState([
    { sender: 'Jessica', content: 'Lorem Ipsum has been the industry\'s standard dummy text.', time: '8:00 PM', self: false },
    { sender: 'You', content: 'Lorem Ipsum has been the industry\'s standard dummy text.', time: '8:00 PM', self: true },
  ]);

  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      setMessages([...messages, { sender: 'You', content: newMessage, time: currentTime, self: true }]);
      setNewMessage('');
    }
  };

  return (
    <div className="chat-app">
      <div className="chat-sidebar">
        <div className="chat-header">
          <h2>Messages</h2>
          <input type="text" placeholder="Search Chat" className="chat-search" />
        </div>
        <div className="chat-list">
          {Array(6).fill().map((_, index) => (
            <div key={index} className="chat-item">
              <img src="https://via.placeholder.com/50" alt="Profile" className="chat-avatar" />
              <div className="chat-info">
                <span className="chat-name">Example</span>
                <span className="chat-time">10 mins ago</span>
              </div>
              <span className="chat-status"></span>
            </div>
          ))}
        </div>
      </div>

      <div className="chat-window">
        <div className="chat-header-window">
          <img src="https://via.placeholder.com/50" alt="Profile" className="chat-window-avatar" />
          <span className="chat-window-name">Example</span>
        </div>

        <div className="chat-messages">
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.self ? 'self' : 'other'}`}>
              <div className="message-content">
                {msg.content}
              </div>
              <span className="message-time">{msg.time}</span>
            </div>
          ))}
        </div>

        <div className="chat-input-container">
          <input 
            type="text" 
            placeholder="Write a Message..." 
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            className="chat-input"
          />
          <button onClick={handleSendMessage} className="send-button">Send</button>
        </div>
      </div>
    </div>
  );
};

export default ChatApp;