import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ChatList from './ChatList';
import Chat from './Chat';
import { useAuth } from '../contexts/AuthContext';

function MainLayout() {
  const [selectedChat, setSelectedChat] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
    navigate(`/chat/${chat.id}`);
  };

  const handleNewChat = () => {

    console.log("Create new chat");
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <div className="w-1/3 bg-gray-800 border-r border-gray-700">
        <ChatList onChatSelect={handleChatSelect} onNewChat={handleNewChat} selectedChatId={selectedChat?.id} />
      </div>
      <div className="w-2/3">
        {selectedChat ? (
          <Chat chatId={selectedChat.id} />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-400">
            Select a chat or start a new conversation
          </div>
        )}
      </div>
    </div>
  );
}

export default MainLayout;
