// src/components/Register.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css';


function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const goToEntryScreen = () => {
        navigate('/');
    };
    const goHome = () => {
        navigate('/Home')
    }

    const handleRegister = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch('http://localhost:5001/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });
            const data = await response.json();
            console.log("fetched response", response)

            if (response.ok) {
                console.log("User registered successfully!");
                localStorage.setItem('token', data.token);
                navigate('/home'); // Redirect on success
            } else {
                console.log(data.message)
                setMessage(data.message || 'Registration failed');
            }
        } catch (error) {
            setMessage('An error occurred: ' + error.message);
        }
    };

    return (
        <div className="register-screen">
            <div className="content">
                <button onClick={goToEntryScreen}>Back</button>
                <h2>Register</h2>
                <form onSubmit={handleRegister}>
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
                    <button type="submit">Register</button>
                </form>
                {message && <p className="error-message">{message}</p>}
            </div>
        </div>
    );
}

export default Register;
