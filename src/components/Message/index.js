import React from 'react';
import { MessageContainer, MessageWrapper, ProfilePic, MessageBubble, Timestamp } from './elements';


function Message({ messages, currentUser }) {
  return (
    <div>
      {messages.map((msg, index) => {
        const isSent = msg.sender.id === currentUser.id;
        return (
          <MessageContainer key={index} sent={isSent}>
            <MessageWrapper>
              {!isSent && <ProfilePic src={msg.sender.profile_picture || '/default-avatar.png'} alt={msg.sender.username} />}
              <MessageBubble sent={isSent}>
                {msg.content}
                {msg.media_file && (
                  <div className="media-container">
                    {msg.message_type === 'image' && <img src={msg.media_file} alt="Shared image" style={{maxWidth: '100%', height: 'auto'}} />}
                    {msg.message_type === 'video' && <video src={msg.media_file} controls style={{maxWidth: '100%', height: 'auto'}} />}
                    {msg.message_type === 'audio' && <audio src={msg.media_file} controls />}
                  </div>
                )}
              </MessageBubble>
              {isSent && <ProfilePic src={currentUser.profile_picture || '/default-avatar.png'} alt={currentUser.username} />}
            </MessageWrapper>
            <Timestamp>{new Date(msg.timestamp).toLocaleString()}</Timestamp>
          </MessageContainer>
        );
      })}
    </div>
  );
}

export default Message;