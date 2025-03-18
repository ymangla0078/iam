const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Disable Brotli (br) compression
app.use((req, res, next) => {
    res.setHeader("Content-Encoding", "identity"); // Forces uncompressed responses
    next();
});

// Mock users database
let users = [
    { email: "test@example.com", password: "password123", user_id: "abcd-1234", name: "John Doe" }
];

// 1️⃣ Login API
app.post('/auth/validate', (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        res.json({ user_id: user.user_id, email: user.email, name: user.name });
    } else {
        res.status(401).json({ error: "Invalid credentials" });
    }
});

// 2️⃣ Create New User API
app.post('/auth/create', (req, res) => {
    const { email, password, name } = req.body;

    // Check if the user already exists
    if (users.find(u => u.email === email)) {
        return res.status(400).json({ error: "User already exists" });
    }

    // Create new user
    const newUser = { email, password, user_id: `user-${Date.now()}`, name };
    users.push(newUser); // Add to mock database

    res.status(201).json(newUser);
});

// Start server on port 3001
app.listen(3001, () => console.log('Authentication API running on port 3001'));
