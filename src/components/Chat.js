import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Send, Paperclip } from 'lucide-react';
import apiClient from '../contexts/AuthContext';

function Chat({ chatId, onNewMessage }) {
  const { user, logout } = useAuth();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [otherUser, setOtherUser] = useState(null);
  const messagesEndRef = useRef(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const fileInputRef = useRef(null);
  const socketRef = useRef(null);

  const getProfilePictureUrl = (picturePath) => {
    if (!picturePath) return "/default-avatar.png";

    // If the path starts with 'static/' or 'media/', prepend the server URL
    if (picturePath.startsWith('static/') || picturePath.startsWith('media/')) {
      return `http://localhost:8000/${picturePath}`;
    }

    // If it's already a full URL, return as is
    if (picturePath.startsWith('http')) {
      return picturePath;
    }

    // For other cases, assume it's a relative path and prepend the server URL
    return `http://localhost:8000/${picturePath}`;
  };

  useEffect(() => {
    if (user && chatId) {
      fetchMessages();
      fetchChatInfo();
      setupWebSocket();
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [chatId, user]);


  const setupWebSocket = () => {
    const token = localStorage.getItem('token');
    socketRef.current = new WebSocket(`ws://localhost:8000/ws/${chatId}?token=${token}`);

    socketRef.current.onopen = () => {
      console.log('WebSocket connection established');
    };

    socketRef.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setMessages(prev => [...prev, message]);
      onNewMessage(chatId, message);
    };

    socketRef.current.onclose = () => {
      console.log('WebSocket connection closed');
    };
  };

  const fetchMessages = async () => {
    if (!chatId) return;
    try {
      const response = await apiClient.get(`/chats/${chatId}/messages/?page=${page}&limit=50`);
      if (response.data.length < 50) setHasMore(false);
      setMessages(prev => [...response.data.reverse(), ...prev]);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching messages:', err);
      handleApiError(err);
    }
  };

  const fetchChatInfo = async () => {
    try {
      const chatResponse = await apiClient.get(`/chats/${chatId}`);
      const chatData = chatResponse.data;
      // Find the other user's ID
      const otherUserId = chatData.participants.find(participant => participant.id !== user.id)?.id;
      if (otherUserId) {
        const userResponse = await apiClient.get(`/users/${otherUserId}`);
        setOtherUser(userResponse.data);
      } else {
        console.error('Other user not found in chat participants');
      }
    } catch (err) {
      console.error('Error fetching chat info:', err);
      handleApiError(err);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await apiClient.post(`/upload/${chatId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setMessages(prev => [...prev, response.data]);
    } catch (error) {
      console.error('Error uploading file:', error);
      handleApiError(error);
    }
  };

     const sendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    try {
      const messageData = { content: inputMessage, message_type: 'text' };

      // Send via WebSocket
      if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        socketRef.current.send(JSON.stringify(messageData));
      }

      setInputMessage('');

      // Optimistically add the message to the UI
      const optimisticMessage = {
        ...messageData,
        sender_id: user.id,
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, optimisticMessage]);
      onNewMessage(chatId, optimisticMessage);

    } catch (err) {
      console.error('Error sending message:', err);
      handleApiError(err);
    }
  };

  const handleApiError = (error) => {
    if (error.response && error.response.status === 401) {
      setError('Your session has expired. Please log in again.');
      logout();
    } else {
      setError('An error occurred. Please try again later.');
    }
    setLoading(false);
  };

  if (loading) {
    return <div className="p-4 text-gray-300">Loading messages...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

   const renderMessageContent = (message) => {
    switch (message.message_type) {
      case 'text':
        return <p>{message.content}</p>;
      case 'image':
        return (
          <img
            src={`http://localhost:8000/${message.media_file}`}
            alt="Shared image"
            className="max-w-xs max-h-64 rounded"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/placeholder-image.png";
            }}
          />
        );
      case 'file':
        return (
          <a
            href={`http://localhost:8000/${message.media_file}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline"
          >
            {message.content}
          </a>
        );
      default:
        return <p>{message.content}</p>;
    }
  };
  return (
    <div className="flex flex-col h-full bg-gray-900">
      {otherUser && (
        <div className="bg-gray-800 p-4 flex items-center">
          <img
            src={getProfilePictureUrl(otherUser.profile_picture)}
            alt={`${otherUser.firstname} ${otherUser.lastname}`}
            className="w-10 h-10 rounded-full mr-3 object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/default-avatar.png";
            }}
          />
          <span className="text-white font-semibold">{`${otherUser.firstname} ${otherUser.lastname}`}</span>
        </div>
      )}
      <div className="flex-grow overflow-y-auto p-4">
        {hasMore && (
          <button onClick={fetchMessages} className="text-purple-500 hover:text-purple-400 mb-4">
            Load more messages
          </button>
        )}
        {messages.map((message, index) => (
          <div key={index} className={`mb-4 flex ${message.sender_id === user.id ? 'justify-end' : 'justify-start'}`}>
            {message.sender_id !== user.id && (
              <img
                src={getProfilePictureUrl(otherUser?.profile_picture)}
                alt={`${otherUser?.firstname} ${otherUser?.lastname}`}
                className="w-8 h-8 rounded-full mr-2 object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/default-avatar.png";
                }}
              />
            )}
            <div
              className={`inline-block p-3 rounded-3xl ${
                message.sender_id === user.id
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-700 text-white'
              }`}
            >
              {renderMessageContent(message)}
            </div>
            {message.sender_id === user.id && (
              <img
                src={getProfilePictureUrl(user.profile_picture)}
                alt={`${user.firstname} ${user.lastname}`}
                className="w-8 h-8 rounded-full ml-2 object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/default-avatar.png";
                }}
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
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current.click()}
            className="bg-gray-700 text-white p-2 rounded mr-2 hover:bg-gray-600"
          >
            <Paperclip size={20} />
          </button>
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

