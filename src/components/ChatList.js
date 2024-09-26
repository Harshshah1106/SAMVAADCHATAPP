import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Search, Plus } from 'lucide-react';

function ChatList({ onChatSelect, selectedChatId }) {
  const { user } = useAuth();
  const [chats, setChats] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:8000/chats/', {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch chats');
        }
        const data = await response.json();
        setChats(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error fetching chats:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchContacts = async () => {
      try {
        const response = await fetch('http://localhost:8000/contacts/', {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch contacts');
        }
        const data = await response.json();
        setContacts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error fetching contacts:', err);
      }
    };

    fetchChats();
    fetchContacts();
  }, [user.token]);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8000/chats/one-to-one/${searchQuery}`, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to start chat');
      }
      const newChat = await response.json();
      onChatSelect(newChat);
      setSearchQuery('');
    } catch (err) {
      console.error('Error starting chat:', err);
      setError(err.message);
    }
  };

  const handleNewChat = () => {
    // This function can be used to open a modal or navigate to a new chat creation page
    console.log("Create new chat");
  };

  if (loading) {
    return <div className="p-4 text-gray-300">Loading chats...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="chat-list h-full flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-xl font-bold mb-4">Your Chats</h2>
        <form onSubmit={handleSearch} className="flex mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search contacts..."
            className="flex-grow p-2 rounded-l bg-gray-700 text-white"
          />
          <button type="submit" className="bg-purple-600 text-white p-2 rounded-r">
            <Search size={20} />
          </button>
        </form>
        <button
          onClick={handleNewChat}
          className="w-full bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 flex items-center justify-center"
        >
          <Plus size={20} className="mr-2" /> New Chat
        </button>
      </div>
      <div className="flex-grow overflow-y-auto">
        {chats.length === 0 ? (
          <p className="p-4 text-gray-400">No chats found. Start a new chat!</p>
        ) : (
          <ul>
            {chats.map(chat => (
              <li
                key={chat.id}
                className={`p-4 border-b border-gray-700 hover:bg-gray-700 cursor-pointer ${
                  chat.id === selectedChatId ? 'bg-gray-700' : ''
                }`}
                onClick={() => onChatSelect(chat)}
              >
                <div className="font-semibold">{chat.name || `Chat ${chat.id}`}</div>
                <div className="text-sm text-gray-400">
                  {chat.chat_type === 'ONE_TO_ONE' ? 'One-to-one' : 'Group'}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default ChatList;
