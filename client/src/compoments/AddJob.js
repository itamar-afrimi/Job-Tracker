// src/components/AddJob.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AddJob.css'; // Import CSS for styling

function AddJob() {
    const [title, setTitle] = useState('');
    const [jobId, setJobId] = useState('');
    const [company, setCompany] = useState('');
    const [userId, setUserId] = useState('');
    const [details, setDetails] = useState('');
    const [location, setLocation] = useState('');
    const [linkedinLink, setLinkedinLink] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        if (!token) {
            setMessage('No token found. Please log in.');
            return;
        }
        console.log("try to add job")
        try {
            const response = await fetch('http://localhost:5001/jobs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    company,
                    title,
                    details,
                    location,
                    linkedinLink

                }),
            });
            console.log("Got response from add job")
            const data = await response.json();
            if (response.ok) {
                console.log('Job added successfully');
                navigate('/home');
            } else {
                setMessage(data.message || 'Failed to add job');
            }
        } catch (error) {
            setMessage('An error occurred: ' + error.message);
        }
    };

    return (
        <div className="add-job">
            <div className="form-container">
                <h1>Add a New Job</h1>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="title">Company</label>
                        <input
                            type="text"
                            id="company"
                            value={company}
                            onChange={(e) => setCompany(e.target.value)}
                            required
                            placeholder="Enter company name"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="title">Job Title</label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            placeholder="Enter job title"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="details">Job Details</label>
                        <textarea
                            id="details"
                            value={details}
                            onChange={(e) => setDetails(e.target.value)}
                            required
                            placeholder="Enter job details"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="location">Location</label>
                        <input
                            type="text"
                            id="location"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            required
                            placeholder="Enter job location"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="linkedinLink">LinkedIn Job Link</label>
                        <input
                            type="url"
                            id="linkedinLink"
                            value={linkedinLink}
                            onChange={(e) => setLinkedinLink(e.target.value)}
                            required
                            placeholder="Enter LinkedIn job URL"
                        />
                    </div>

                    <button type="submit" className="submit-btn">Add Job</button>
                </form>

                {message && <p className="error-message">{message}</p>}
            </div>
        </div>
    );
}

export default AddJob;
