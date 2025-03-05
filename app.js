import React, { useState, useEffect } from 'react';
import { init } from '@livechat/customer-sdk';

const licenseId = YOUR_LIVECHAT_LICENSE_ID; // Replace with your actual license ID

const App = () => {
    const [chats, setChats] = useState({});

    const inactivityTime = 3 * 60 * 1000; // 3 minutes inactivity limit

    useEffect(() => {
        const client = init({ licenseId });

        // Load active chats on app load (optional if you want to check existing chats at startup)
        client.listChats({}).then(response => {
            const initialChats = {};
            response.chats.forEach(chat => {
                initialChats[chat.id] = { 
                    lastActivity: Date.now(), 
                    messages: [], 
                    inactiveCount: 0 
                };
            });
            setChats(initialChats);
        });

        // New chat handler
        client.on('incoming_chat', (chat) => {
            setChats(prev => ({
                ...prev,
                [chat.id]: { lastActivity: Date.now(), messages: [], inactiveCount: 0 }
            }));
        });

        // Message handler (from agent or customer)
        client.on('incoming_event', (event) => {
            if (event.chat_id) {
                setChats(prev => ({
                    ...prev,
                    [event.chat_id]: {
                        ...prev[event.chat_id],
                        lastActivity: Date.now(),
                        messages: [...prev[event.chat_id].messages, event]
                    }
                }));
            }
        });

        // Inactivity checker (runs every 30 seconds)
        const interval = setInterval(() => {
            const now = Date.now();
            setChats(prev => {
                const updatedChats = { ...prev };
                Object.keys(updatedChats).forEach(chatId => {
                    const chat = updatedChats[chatId];
                    if (now - chat.lastActivity >= inactivityTime) {
                        if (chat.inactiveCount === 0) {
                            playAlertSound();
                        }
                        updatedChats[chatId].inactiveCount += 1;
                    }
                });
                return updatedChats;
            });
        }, 30000);

        return () => clearInterval(interval); // Cleanup on unmount
    }, []);

    // Play sound on inactivity
    const playAlertSound = () => {
        const audio = new Audio('/alert-sound.mp3'); // Place sound file in public folder
        audio.play();
    };

    // Handle chat closure
    const handleCloseChat = (chatId) => {
        const { inactiveCount, messages } = chats[chatId];
        alert(`Chat ${chatId} closed.\nInactivity Warnings: ${inactiveCount}\nTotal Messages: ${messages.length}`);
        setChats(prev => {
            const updated = { ...prev };
            delete updated[chatId];
            return updated;
        });
    };

    return (
        <div>
            <h1>LiveChat Inactivity Timer</h1>
            {Object.keys(chats).map(chatId => {
                const chat = chats[chatId];
                return (
                    <div key={chatId} style={{ padding: '10px', border: '1px solid #ddd', marginBottom: '10px' }}>
                        <h3>Chat ID: {chatId}</h3>
                        <p>Last Activity: {new Date(chat.lastActivity).toLocaleTimeString()}</p>
                        <p>Inactivity Alerts: {chat.inactiveCount}</p>
                        <p>Messages Exchanged: {chat.messages.length}</p>
                        <button onClick={() => handleCloseChat(chatId)}>Close Chat</button>
                    </div>
                );
            })}
        </div>
    );
};

export default App;
