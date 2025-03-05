import React, { useState, useEffect } from 'react';

// Replace with your credentials
const accountId = 'ebb1acf7-378e-46e5-b696-2d35477b3cba';  // Your Account ID
const token = 'dal:-MABL_FxWPc8CPYH8wc-TgeyYfk'; // Your Token

const inactivityLimit = 3 * 60 * 1000; // 3 minutes inactivity time limit

const App = () => {
    const [chats, setChats] = useState({});
    const [lastActivityTime, setLastActivityTime] = useState(Date.now());

    // Function to handle inactivity
    const handleInactivity = () => {
        const now = Date.now();
        if (now - lastActivityTime >= inactivityLimit) {
            alert("Chat has been inactive for 3 minutes!");
        }
    };

    // Periodically check for inactivity every 30 seconds
    useEffect(() => {
        const interval = setInterval(handleInactivity, 30000);
        return () => clearInterval(interval); // Clean up when component unmounts
    }, [lastActivityTime]);

    // Reset inactivity timer when a new event occurs (e.g., new message)
    const resetInactivityTimer = () => {
        setLastActivityTime(Date.now());
    };

    // Simulate receiving a new message (you would use LiveChat events here)
    const onNewMessage = () => {
        resetInactivityTimer();
        console.log("New message received, inactivity timer reset.");
    };

    return (
        <div>
            <h1>LiveChat Inactivity Timer</h1>
            <button onClick={onNewMessage}>Simulate New Message</button>
            <p>Last activity time: {new Date(lastActivityTime).toLocaleTimeString()}</p>
        </div>
    );
};

export default App;
