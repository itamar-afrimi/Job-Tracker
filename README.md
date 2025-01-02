

# Job Tracker Web App 📊

A responsive job-tracking web app that helps users track their job applications, store details of jobs, and stay organized in their job search journey. Users can view all jobs they’ve applied for, and new job postings, and also manage applications with an intuitive interface.



## Table of Contents
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Folder Structure](#folder-structure)
- [Contributing](#contributing)
- [License](#license)

---

## Features 🚀

- **User Authentication**: Sign-up and log in securely with JWT-based authentication.
- **Job Application Management**: Track company names, job titles, descriptions, application dates, and whether you've applied.
- **Dynamic Job List**: See a list of jobs with real-time updates on your application status.
- **Responsive Design**: Fully responsive, optimized for both desktop and mobile devices.
- **User-Friendly UI**: Elegant, simple UI with sidebar navigation and intuitive components.
  
---

## Technologies Used 🛠️

- **Frontend**: React.js, CSS3 (Flexbox, Media Queries)
- **Backend**: Node.js, Express.js, Mongoose
- **Database**: MongoDB (NoSQL)
- **Authentication**: JWT (JSON Web Token)
- **CSS Framework**: Custom CSS with Flexbox and CSS transitions

---

## Installation ⚙️

To get a local copy up and running, follow these steps:

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/job-tracker.git
   cd job-tracker
   ```

2. **Install Dependencies**:
   - For both frontend and backend:
   ```bash
   npm install
   cd client
   npm install
   ```

3. **Environment Variables**:
   - Create a `.env` file in the root and add the following:
     ```
     PORT=5001
     MONGODB_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret
     ```

4. **Run the Application**:
   - In the root directory:
   ```bash
   npm run dev
   ```
   - Visit `http://localhost:3000` in your browser to see the app.

---

## Usage 📖

1. **Sign Up/Login** to access your account.
2. **View All Jobs** in the job list and track each application status.
3. **Add New Jobs** by navigating to the 'Add New Job' button.
4. **Apply for Jobs** and see the application status and applied date update dynamically.

---

## API Endpoints 🌐

| Method | Endpoint                | Description                                      |
|--------|--------------------------|--------------------------------------------------|
| POST   | `/auth/signup`           | Register a new user                              |
| POST   | `/auth/login`            | Login a user                                     |
| GET    | `/jobs`                  | Fetch all jobs                                   |
| POST   | `/jobs`                  | Add a new job                                    |
| POST   | `/jobs/:jobId/apply`     | Apply to a specific job                          |

### Example of Applying to a Job

**Endpoint**: `POST /jobs/:jobId/apply`

**Headers**:
```json
{
    "Authorization": "Bearer <JWT_TOKEN>"
}
```

**Response**:
```json
{
    "success": true,
    "message": "Application successful",
    "application": {
        "_id": "appId123",
        "jobId": "jobId123",
        "userId": "userId123",
        "appliedAt": "2024-11-08T10:20:30Z"
    }
}
```

---

## Folder Structure 📁

```
job-tracker
├── client                   # Frontend files
│   ├── src
│   │   ├── components       # React components
│   │   ├── App.js           # Main App component
│   │   ├── index.js         # React entry point
│   │   └── Home.css         # Styling for the home page
├── server                   # Backend files
│   ├── models               # Mongoose schemas
│   ├── routes               # API route handlers
│   ├── index.js             # Main backend server
│   └── middleware           # Authentication middleware
└── .env                     # Environment variables
```

---

## Contributing 🤝

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/your-username/job-tracker/issues).

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## License 📜

Distributed under the MIT License. See `LICENSE` for more information.

---

## Contact 📬

- **Itamar Afrimi** - [afrimi2000@gmail.com](mailto:your-email@example.com)
- **Project Link**: [https://github.com/your-username/job-tracker](https://github.com/your-username/job-tracker)

---

### Screenshots 📷

1. **Job List Page**
   ![Job List Screenshot](https://via.placeholder.com/600x400) <!-- Replace with actual screenshot -->

2. **Job Application Page**
   ![Job Application Screenshot](https://via.placeholder.com/600x400) <!-- Replace with actual screenshot -->

Feel free to reach out for suggestions, bug reports, or contributions! 🙌

---

