const express = require('express');
const app = express();
const mongoose = require('mongoose');
const session = require('express-session');
const bcrypt = require('bcrypt');
const cors = require('cors');


const  SECRET_KEY = process.env.SECRET_KEY;
app.use(express.json());
app.use(cors());

// MongoDB Connection
const mongoURI = 'mongodb://localhost:27017/job-tracker';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));


// Define the /api route
app.get('/', (req, res) => {
    res.send("Job Tracker API"); // This response will be sent to the client
});



const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});
const User = mongoose.model('User', UserSchema);


////////////////////////////////////////////////////////////////////////////////////////////
// Job schema
const JobSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    title: String,
    company: String,
    status: String
});
const Job = mongoose.model('Job', JobSchema);

app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, password: hashedPassword });
        await user.save();

        // Generate a JWT token upon successful registration
        const token = jwt.sign({ id: user._id }, secretKey, { expiresIn: '1h' });


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

        // Find the user by username
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        // Verify password
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id }, secretKey, { expiresIn: '1h' });

        // Return token and success message
        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ message: 'Login failed', error: error.message });
    }
});




app.use(session({ secret: '123456', resave: false, saveUninitialized: true }));

// Get all jobs for the logged-in user
app.get('/jobs', async (req, res) => {
    if (!req.session.userId) return res.status(401).send('Unauthorized');
    const jobs = await Job.find({ userId: req.session.userId });
    res.json(jobs);
});

// Add a new job
app.post('/jobs', async (req, res) => {
    if (!req.session.userId) return res.status(401).send('Unauthorized');
    const job = new Job({ userId: req.session.userId, ...req.body });
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