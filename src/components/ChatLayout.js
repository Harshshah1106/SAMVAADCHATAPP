import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import ChatList from './ChatList';
import Chat from './Chat';
import axios from 'axios';

const API_URL = 'http://localhost:8000';

function ChatLayout() {
  const { user } = useAuth();
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);

  useEffect(() => {
    if (user && user.token) {
      fetchChats();
    }
  }, [user]);

  const fetchChats = async () => {
    try {
      const response = await axios.get(`${API_URL}/chats/`, {
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      setChats(response.data);
    } catch (error) {
      console.error('Error fetching chats:', error);
    }
  };

  const startNewChat = async () => {
    const phoneNumber = prompt('Enter the phone number of the user you want to chat with:');
    if (phoneNumber) {
      try {
        const response = await axios.get(`${API_URL}/chats/one-to-one/${phoneNumber}`, {
          headers: { 'Authorization': `Bearer ${user.token}` }
        });
        setChats([...chats, response.data]);
        setSelectedChat(response.data.id);
      } catch (error) {
        console.error('Error starting new chat:', error);
        alert('Failed to start new chat. Please try again.');
      }
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-1/4 bg-white border-r">
        <div className="p-4">
          <button
            onClick={startNewChat}
            className="w-full bg-purple-600 text-white p-2 rounded hover:bg-purple-700"
          >
            Start New Chat
          </button>
        </div>
        <ChatList
          chats={chats}
          selectedChat={selectedChat}
          onSelectChat={setSelectedChat}
        />
      </div>
      <div className="w-3/4">
        {selectedChat ? (
          <Chat chatId={selectedChat} />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select a chat or start a new conversation
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatLayout;
