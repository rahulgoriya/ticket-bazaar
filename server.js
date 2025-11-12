const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// ✅ Static files serve karein (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Main route - frontend serve karein
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'sign_in.html'));
});

// Test API route
app.get('/api', (req, res) => {
    res.json({ 
        message: "🎬 Movie Booking API Server Running Successfully!",
        timestamp: new Date().toISOString(),
        status: "Active"
    });
});

// User Authentication Routes
const users = [];

// Sign Up Route
app.post('/api/signup', (req, res) => {
    const { name, email, password, confirmPassword } = req.body;
    
    // Validation
    if (!name || !email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    
    if (password !== confirmPassword) {
        return res.status(400).json({ error: 'Passwords do not match' });
    }
    
    // Check if user already exists
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
    }
    
    // Create new user
    const newUser = {
        id: users.length + 1,
        name,
        email,
        password // In real app, hash this password
    };
    
    users.push(newUser);
    
    res.status(201).json({ 
        message: 'User created successfully',
        user: { id: newUser.id, name: newUser.name, email: newUser.email }
    });
});

// Sign In Route
app.post('/api/signin', (req, res) => {
    const { email, password } = req.body;
    
    // Validation
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }
    
    // Find user
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
        return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    res.json({ 
        message: 'Login successful',
        user: { id: user.id, name: user.name, email: user.email }
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📁 Serving frontend from public directory`);
});