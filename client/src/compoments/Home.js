import React, { useState, useEffect } from 'react';
import './Home.css'; // Import the new CSS file
import { useNavigate } from 'react-router-dom';

function Home() {
    const [jobs, setJobs] = useState([]);
    const [appliedStatus, setAppliedStatus] = useState({});
    const [message, setMessage] = useState('');
    const [sidebarOpen, setSidebarOpen] = useState(true); // State for sidebar visibility
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        // Fetch jobs from your API (MongoDB)
        const fetchJobs = async () => {
            try {
                const response = await fetch('http://localhost:5001/jobs', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });

                const data = await response.json();
                if (response.ok) {
                    setJobs(data);
                    // After fetching jobs, check if user has applied
                    data.forEach(job => {
                        checkIfApplied(job.jobId);
                    });
                } else {
                    setMessage(data.message || 'Failed to load jobs');
                }
            } catch (error) {
                setMessage('An error occurred: ' + error.message);
            }
        };
        const checkIfApplied = async (jobId) => {
            console.log("got into checkIfApplied")
            try {
                const response = await fetch(`http://localhost:5001/jobs/${jobId}/applied`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await response.json();
                console.log("got data")
                setAppliedStatus((prevState) => ({
                    ...prevState,
                    [jobId]: data.applied
                }));
            } catch (error) {
                console.error("Error checking application status:", error);
            }
        };
        fetchJobs();
    }, [token]);

    const handleAddJob = () => {
        navigate('/add-job'); // Assuming you have an "add job" page
    };

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen); // Toggle sidebar visibility
    };
    const toggleDropdown = () => {
        setDropdownOpen((prev) => !prev); // Toggle the dropdown menu
    };
    const handleLogOut = () => {
        localStorage.removeItem('token'); // Remove token from localStorage
        navigate('/'); // Redirect to login screen
    };
    const handleApplyJob = async (jobId) => {
        // Logic to apply for the job (create an application in the DB)
        // You can call an API endpoint that creates an application
        console.log("getting into apply job")
        console.log(jobId)
        try {
            const response = await fetch(`http://localhost:5001/jobs/${jobId}/apply`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    jobId
                }),
            });

            const data = await response.json();
            if (data.success) {
                setAppliedStatus(prev => ({ ...prev, [jobId]: true }));
            }
        } catch (error) {
            console.error('Failed to apply:', error);
        }
    };


    return (
        <div className="home-page">
            {/* Sidebar */}
            <div className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
                <h2>Job Tracker</h2>
                <ul>
                    <li>Dashboard</li>
                    <li>Jobs</li>
                    <li>Settings</li>
                </ul>
            </div>

            {/* Main Content */}
            <div className="main-content">
                <button onClick={toggleSidebar} className="toggle-sidebar-btn">
                    <img src="https://img.icons8.com/material-outlined/24/ffffff/menu.png" alt="menu"/>
                </button>
                {/* Top Bar */}
                <div className="top-bar">
                    <div className="profile">
                        <span>Profile</span>
                    </div>
                    <div className="settings" onClick={toggleDropdown}>
                        <span>Settings</span>
                    </div>
                    {/* Dropdown Menu */}
                    {dropdownOpen && (
                        <div className="dropdown-menu">
                            <button onClick={handleLogOut}>Log Out</button>
                        </div>
                    )}
                </div>

                {/* Jobs List */}
                <div className="jobs-list">
                    <h1>Your Jobs</h1>
                    {jobs.length > 0 ? (
                        <ul>
                            {jobs.map((job, index) => (
                                <li key={index} className="job-item">
                                    <h2>{job.title}</h2>
                                    <p>{job.details}</p>
                                    <div className="status">
                                        {appliedStatus[job.jobId] ? (
                                            <span className="applied">You applied</span>
                                        ) : (
                                            <button onClick={() => handleApplyJob(job.linkedinLink)}
                                                    className="apply-btn">Apply</button>
                                        )}
                                    </div>
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
