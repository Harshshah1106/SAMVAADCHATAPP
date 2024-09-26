import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Send, Paperclip } from 'lucide-react';
import axios from 'axios';

const API_URL = 'http://localhost:8000';

function Chat({ chatId }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [otherUser, setOtherUser] = useState(null);
  const messagesEndRef = useRef(null);
const [page, setPage] = useState(1);
const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
  const ws = new WebSocket(`ws://localhost:8000/ws/${chatId}`);
  ws.onmessage = (event) => {
    const message = JSON.parse(event.data);
    setMessages(prev => [...prev, message]);
  };
  return () => ws.close();
}, [chatId]);

    const fetchChatInfo = async () => {
      try {
        const chatResponse = await axios.get(`${API_URL}/chats/${chatId}`, {
          headers: { 'Authorization': `Bearer ${user.token}` }
        });
        const chatData = chatResponse.data;
        const otherUserId = chatData.participants.find(id => id !== user.id);
        if (otherUserId) {
          const userResponse = await axios.get(`${API_URL}/users/${otherUserId}`, {
            headers: { 'Authorization': `Bearer ${user.token}` }
          });
          setOtherUser(userResponse.data);
        }
      } catch (err) {
        console.error('Error fetching chat info:', err);
        setError('Failed to fetch chat information. Please try again.');
      }
    };


  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);


  const handleFileUpload = async (event) => {
  const file = event.target.files[0];
  const formData = new FormData();
  formData.append('file', file);
  try {
    const response = await axios.post(`${API_URL}/upload/${chatId}`, formData, {
      headers: {
        'Authorization': `Bearer ${user.token}`,
        'Content-Type': 'multipart/form-data'
      }
    });
    // Handle the response (e.g., add the file message to the chat)
  } catch (error) {
    console.error('Error uploading file:', error);
  }
};

const loadMoreMessages = async () => {
  if (!hasMore) return;
  const response = await axios.get(`${API_URL}/chats/${chatId}/messages/?page=${page}&limit=50`);
  if (response.data.length < 50) setHasMore(false);
  setMessages(prev => [...response.data, ...prev]);
  setPage(prev => prev + 1);
};

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    try {
      const response = await axios.post(`${API_URL}/chats/${chatId}/messages/`,
        { content: inputMessage, message_type: 'text' },
        { headers: { 'Authorization': `Bearer ${user.token}` } }
      );
      setMessages(prev => [...prev, response.data]);
      setInputMessage('');
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message. Please try again.');
    }
  };

  if (loading) {
    return <div className="p-4 text-gray-300">Loading messages...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="flex flex-col h-full bg-gray-900">
      {otherUser && (
        <div className="bg-gray-800 p-4 flex items-center">
          <img
            src={otherUser.profile_picture || "/default-avatar.png"}
            alt={`${otherUser.firstname} ${otherUser.lastname}`}
            className="w-10 h-10 rounded-full mr-3"
          />
          <span className="text-white font-semibold">{`${otherUser.firstname} ${otherUser.lastname}`}</span>
        </div>
      )}
      <div className="flex-grow overflow-y-auto p-4">
        {messages.map((message, index) => (
          <div key={index} className={`mb-4 flex ${message.sender_id === user.id ? 'justify-end' : 'justify-start'}`}>
            {message.sender_id !== user.id && (
              <img
                src={otherUser?.profile_picture || "/default-avatar.png"}
                alt={`${otherUser?.firstname} ${otherUser?.lastname}`}
                className="w-8 h-8 rounded-full mr-2"
              />
            )}
            <div
              className={`inline-block p-3 rounded-3xl ${
                message.sender_id === user.id
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-700 text-white'
              }`}
            >
              {message.content}
            </div>
            {message.sender_id === user.id && (
              <img
                src={user.profile_picture || "/default-avatar.png"}
                alt={`${user.firstname} ${user.lastname}`}
                className="w-8 h-8 rounded-full ml-2"
              />
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="bg-gray-800 p-4">
        <form onSubmit={sendMessage} className="flex items-center">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            className="flex-grow mr-2 p-2 rounded bg-gray-700 text-white"
            placeholder="Type a message..."
          />
          <button
            type="submit"
            className="bg-purple-600 text-white p-2 rounded hover:bg-purple-700"
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
}

export default Chat;
