const express = require('express');
const app = express();
const mongoose = require('mongoose');
const session = require('express-session');
const bcrypt = require('bcrypt');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config(); // Load environment variables from the .env file

const  SECRET_KEY = process.env.SECRET_KEY;
app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

// MongoDB Connection
const mongoURI = 'mongodb://localhost:27017/job-tracker';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Middleware to check if the user is authenticated (using JWT)
const authenticateJWT = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Get token from Authorization header
    if (!token) return res.status(401).json({ message: 'Access denied' });

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid token' });
        req.user = user;
        next();
    });
};
// Define the /api route
app.get('/', (req, res) => {
    res.send("Job Tracker API"); // This response will be sent to the client
});



const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    jobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job', default: [] }]
});
const User = mongoose.model('User', UserSchema);


// Job Schema (Model)
const jobSchema = new mongoose.Schema({
    company: {type: String, required: true},
    title: { type: String, required: true },
    details: { type: String, required: true },
    location: { type: String, required: true },
    linkedinLink: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }

});

const Job = mongoose.model('Job', jobSchema);

app.post('/register', async (req, res) => {
    console.log("entered endpoint")
    const { username, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, password: hashedPassword, jobs: []});
        console.log("created user")
        await user.save();

        console.log("user saved")

        const token = jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: '1h' });

        // Generate a JWT token upon successful registration

        console.log("created token")
        // Send the token along with a success message
        res.status(201).json({ message: 'User created', token });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user' });
    }
});



// User Login
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log("enterd login post request server")
        // Find the user by username
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }
        console.log("we have user named", username)
        // Verify password
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        console.log("Right password")

        // Generate JWT token
        const token = jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: '1h' });

        // Return token and success message
        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ message: 'Login failed', error: error.message });
    }
});




app.use(session({ secret: '123456', resave: false, saveUninitialized: true }));

// Get all jobs for the logged-in user
app.get('/jobs', authenticateJWT, async (req, res) => {
    // Only retrieve jobs that belong to the authenticated user
    const jobs = await Job.find({ userId: req.user.id }).populate('userId');
    res.json(jobs);
});

// Add a new job
app.post('/jobs', authenticateJWT, async (req, res) => {
    if (!req.session.userId) return res.status(401).send('Unauthorized');
    const job = new Job({
        userId: req.user.id, // req.user.id is the logged-in user's ID from the JWT
        company: req.body.company,
        title: req.body.title,
        details: req.body.details,
        location: req.body.location,
        linkedinLink: req.body.linkedinLink
    });
    await job.save();
    res.status(201).json(job);
});

// Edit a job
app.put('/jobs/:id', async (req, res) => {
    if (!req.session.userId) return res.status(401).send('Unauthorized');
    const { id } = req.params;
    const job = await Job.findById(id);
    if (!job || job.userId.toString() !== req.session.userId) return res.status(404).send('Job not found');
    Object.assign(job, req.body);
    await job.save();
    res.json(job);
});

// Delete a job
app.delete('/jobs/:id', async (req, res) => {
    if (!req.session.userId) return res.status(401).send('Unauthorized');
    const { id } = req.params;
    const job = await Job.findById(id);
    if (!job || job.userId.toString() !== req.session.userId) return res.status(404).send('Job not found');
    await job.remove();
    res.status(204).send();
});




const PORT = process.env.PORT || 5001;

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});