// src/components/Home.js
import React, { useState, useEffect } from 'react';
import './Home.css'; // Import the new CSS file
import { useNavigate } from 'react-router-dom';

function Home() {
    const [jobs, setJobs] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch jobs from your API (MongoDB)
        const fetchJobs = async () => {
            const response = await fetch('http://localhost:5001/jobs');
            const data = await response.json();
            setJobs(data);
        };
        fetchJobs();
    }, []);

    const handleAddJob = () => {
        navigate('/add-job'); // Assuming you have an "add job" page
    };

    return (
        <div className="home-page">
            {/* Sidebar */}
            <div className="sidebar">
                <h2>Job Tracker</h2>
                <ul>
                    <li>Dashboard</li>
                    <li>Jobs</li>
                    <li>Settings</li>
                </ul>
            </div>

            {/* Main Content */}
            <div className="main-content">
                {/* Top Bar */}
                <div className="top-bar">
                    <div className="profile">
                        <span>Profile</span>
                    </div>
                    <div className="settings">
                        <span>Settings</span>
                    </div>
                </div>

                {/* Jobs List */}
                <div className="jobs-list">
                    <h1>Your Jobs</h1>
                    {jobs.length > 0 ? (
                        <ul>
                            {jobs.map((job, index) => (
                                <li key={index} className="job-item">
                                    <h2>{job.title}</h2>
                                    <p>{job.description}</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No jobs found</p>
                    )}
                </div>

                <button className="add-job-btn" onClick={handleAddJob}>
                    Add New Job
                </button>
            </div>
        </div>
    );
}

export default Home;
