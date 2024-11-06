import React, { useState } from 'react';
import { Search, Plus } from 'lucide-react';

function ChatList({ chats, selectedChat, onSelectChat, onNewChat }) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredChats = chats.filter(chat =>
    chat.name && chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search chats..."
            className="flex-grow p-2 rounded-l bg-gray-700 text-white"
          />
          <button className="bg-gray-700 text-white p-2 rounded-r">
            <Search size={20} />
          </button>
        </div>
        <button
          onClick={onNewChat}
          className="w-full bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 flex items-center justify-center"
        >
          <Plus size={20} className="mr-2" /> New Chat
        </button>
      </div>
      <div className="flex-grow overflow-y-auto">
        {filteredChats.map(chat => (
          <div
            key={chat.id}
            className={`p-4 border-b border-gray-700 hover:bg-gray-800 cursor-pointer ${
              chat.id === selectedChat ? 'bg-gray-800' : ''
            }`}
            onClick={() => onSelectChat(chat.id)}
          >
            <div className="flex justify-between items-center mb-1">
              <div className="font-semibold">{chat.name || `Chat ${chat.id}`}</div>
              {chat.last_message && (
                <div className="text-xs text-gray-400">
                  {formatTimestamp(chat.last_message.timestamp)}
                </div>
              )}
            </div>
            <div className="text-sm text-gray-400 truncate">
              {chat.last_message ? chat.last_message.content : 'No messages yet'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ChatList;
