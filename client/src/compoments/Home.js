import React, { useState, useEffect } from 'react';

function Home() {
    const [jobs, setJobs] = useState([]);
    const [newJob, setNewJob] = useState('');

    // Fetch jobs from MongoDB when the component mounts
    useEffect(() => {
        async function fetchJobs() {
            try {
                const response = await fetch('http://localhost:5001/jobs');
                const data = await response.json();
                setJobs(data);
            } catch (error) {
                console.error('Error fetching jobs:', error);
            }
        }
        fetchJobs();
    }, []);

    const handleAddJob = async () => {
        if (!newJob) return;

        try {
            const response = await fetch('http://localhost:5001/jobs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title: newJob }),
            });

            if (response.ok) {
                const job = await response.json();
                setJobs([...jobs, job]);
                setNewJob('');
            } else {
                console.error('Failed to add job');
            }
        } catch (error) {
            console.error('Error adding job:', error);
        }
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.header}>Welcome to Your Job Tracker</h1>
            <div style={styles.jobsContainer}>
                {jobs.map((job) => (
                    <div key={job._id} style={styles.jobCard}>
                        <p>{job.title}</p>
                    </div>
                ))}
            </div>
            <div style={styles.newJobContainer}>
                <input
                    type="text"
                    placeholder="New job title"
                    value={newJob}
                    onChange={(e) => setNewJob(e.target.value)}
                    style={styles.input}
                />
                <button onClick={handleAddJob} style={styles.button}>Add Job</button>
            </div>
        </div>
    );
}

// Inline styling for simplicity; adjust as needed
const styles = {
    container: {
        backgroundImage: 'url("your-background-image.jpg")',  // Add your own image URL
        backgroundSize: 'cover',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px',
        height: '100vh',
        color: '#fff',
    },
    header: {
        fontSize: '2em',
        marginBottom: '20px',
    },
    jobsContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '20px',
        maxHeight: '50vh',
        overflowY: 'auto',
        width: '80%',
    },
    jobCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        padding: '15px',
        borderRadius: '5px',
        width: '100%',
        textAlign: 'center',
    },
    newJobContainer: {
        display: 'flex',
        gap: '10px',
        marginTop: '20px',
    },
    input: {
        padding: '10px',
        fontSize: '1em',
        borderRadius: '5px',
        border: 'none',
        outline: 'none',
    },
    button: {
        padding: '10px 20px',
        fontSize: '1em',
        borderRadius: '5px',
        backgroundColor: '#4CAF50',
        color: '#fff',
        border: 'none',
        cursor: 'pointer',
    },
};

export default Home;
