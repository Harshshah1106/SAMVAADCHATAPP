import React, { useState, useRef } from 'react';
import { FaPaperPlane } from 'react-icons/fa';
import { StyledFooter } from './elements';

const ChatFooter = ({ onSubmitMessage, currentUser }) => {
    const [message, setMessage] = useState('');
    const inputRef = useRef(null);

    const handleOnChange = (e) => setMessage(e.target.value);

    const handleSubmit = () => {
        if (message.trim()) {
            onSubmitMessage({
                text: message,
                sender: currentUser.username,
                timestamp: new Date().toISOString(),
            });
            setMessage('');
            inputRef.current.focus();
        }
    };

    const handleKeyUp = (e) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    };

    return (
        <StyledFooter>
            <input
                ref={inputRef}
                value={message}
                onChange={handleOnChange}
                onKeyUp={handleKeyUp}
                type="text"
                placeholder="Type a message..."
            />
            <button onClick={handleSubmit}>
                <FaPaperPlane color="white" />
            </button>
        </StyledFooter>
    );
};

export default ChatFooter;

