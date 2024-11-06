import React from 'react';
import { FaBars, FaPhone, FaVideo } from 'react-icons/fa'
import { Head } from './elements'

const ChatHead = ({ user, onToggleSidebar, onStartCall, onStartVideoCall }) => (
    <Head>
        <div className="user-info">
            <img src={user.avatar} alt={user.name} className="avatar" />
            <div className="name-status">
                <span className="name">{user.name}</span>
                <span className="status">{user.status}</span>
            </div>
        </div>
        <div className="actions">
            <FaPhone onClick={onStartCall} />
            <FaVideo onClick={onStartVideoCall} />
            <FaBars onClick={onToggleSidebar} />
        </div>
    </Head>
);

export default ChatHead;

