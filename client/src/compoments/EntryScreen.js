// src/components/EntryScreen.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './EntryScreen.css';

function EntryScreen() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            // console.log("enter handle login entry screen")
            // Logic for login validation can be added here
            const response = await fetch('http://localhost:5001/login', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({username, password}),
            });

            // console.log(response)
            const data = await response.json()

            if (response.ok) {
                // console.log("user logged in");
                // console.log(response)
                localStorage.setItem("token", data.token)
                navigate('/home')
            } else {
                console.log(data.message)
                setMessage(data.message || 'Registration failed');
            }
        }catch (error){
            // console.log('error');
            console.log(error.message)
            // setMessage('An error occurred: ' + error.message);

        }

    };

    const goToRegister = () => {
        navigate('/register');
    };

    return (
        <div className="entry-screen">
            <div className="content">
                <h1>Job Tracker</h1>
                <form onSubmit={handleLogin}>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Username"
                        required
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        required
                    />
                    <button type="submit">Login</button>
                </form>
                <button onClick={goToRegister} className="switch-btn">Register</button>
            </div>
        </div>
    );
}

export default EntryScreen;
