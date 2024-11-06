import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import ChatList from './ChatList';
import Chat from './Chat';
import NewChatModal from './NewChatModal';
import ProfileMenu from './ProfileMenu';
import apiClient from '../contexts/AuthContext';

function ChatLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [chats, setChats] = useState([]);
   const [loading, setLoading] = useState(true);
  const [selectedChat, setSelectedChat] = useState(null);
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      fetchChats();
    }
  }, [user]);

useEffect(() => {
  if (!user) {
    navigate('/login');
    return;
  }

  fetchChats().finally(() => setLoading(false));
}, [user, navigate]);

if (!user) {
  return null;
}

  const fetchChats = async () => {
    try {
      const response = await apiClient.get('/chats/');
      setChats(response.data);
    } catch (error) {
      console.error('Error fetching chats:', error);
      handleApiError(error);
    }
  };



  const startNewChat = async (phoneNumber) => {
    try {
      const response = await apiClient.get(`/chats/one-to-one/${phoneNumber}`);
      setChats(prevChats => [response.data, ...prevChats]);
      setSelectedChat(response.data.id);
      setIsNewChatModalOpen(false);
      setError(null);
    } catch (error) {
      console.error('Error starting new chat:', error);
      handleApiError(error);
    }
  };

  const handleNewMessage = (chatId, message) => {
    setChats(prevChats => {
      const updatedChats = prevChats.map(chat => {
        if (chat.id === chatId) {
          return {
            ...chat,
            last_message: message,
          };
        }
        return chat;
      });

      const updatedChat = updatedChats.find(chat => chat.id === chatId);
      const otherChats = updatedChats.filter(chat => chat.id !== chatId);
      return [updatedChat, ...otherChats];
    });
  };

  const handleApiError = (error) => {
    if (error.response && error.response.status === 401) {
      setError('Your session has expired. Please log in again.');
      logout();
    } else {
      setError('An error occurred. Please try again later.');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      {error && (
        <div className="bg-red-500 text-white p-2 text-center">
          {error}
        </div>
      )}
      <div className="flex flex-grow overflow-hidden">
        <div className="w-1/3 border-r border-gray-700">
          <div className="flex justify-between items-center p-4 border-b border-gray-700">
            <h1 className="text-xl font-bold">Chats</h1>
            <ProfileMenu user={user} />
          </div>
          <ChatList
            chats={chats}
            selectedChat={selectedChat}
            onSelectChat={setSelectedChat}
            onNewChat={() => setIsNewChatModalOpen(true)}
          />
        </div>
        <div className="w-2/3">
          {selectedChat ? (
            <Chat chatId={selectedChat} onNewMessage={handleNewMessage} />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              Select a chat or start a new conversation
            </div>
          )}
        </div>
      </div>
      <NewChatModal
        isOpen={isNewChatModalOpen}
        onClose={() => setIsNewChatModalOpen(false)}
        onStartChat={startNewChat}
      />
    </div>
  );
}

export default ChatLayout;
