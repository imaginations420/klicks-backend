const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../db');

const router = express.Router();

// -------------------- REGISTER --------------------
router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    if (user) return res.status(400).json({ message: 'Email already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    db.run('INSERT INTO users (email, password) VALUES (?, ?)', [email, hashedPassword], function(err) {
      if (err) return res.status(500).json({ message: 'Error registering user' });
      res.status(201).json({ message: 'User registered successfully' });
    });
  });
});

// -------------------- LOGIN --------------------
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Invalid credentials' });

    // ✅ Store user info in session
    req.session.userId = user.id;
    req.session.email = user.email; // store email for easy access
    console.log("Session after login:", req.session);

    res.json({ message: 'Login successful', email: user.email });
  });
});

// -------------------- LOGOUT --------------------
router.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).json({ message: 'Logout failed' });
    res.clearCookie('connect.sid');
    res.json({ message: 'Logged out successfully' });
  });
});

// -------------------- CHECK SESSION --------------------
router.get('/check', (req, res) => {
  res.json({ loggedIn: !!req.session.userId });
});

// -------------------- DASHBOARD --------------------
// Minimal check: return email if logged in, else "Guest"
// -------------------- DASHBOARD --------------------
router.get('/dashboard', (req, res) => {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  res.json({
    message: `Welcome to your dashboard, ${req.session.email}!`,
    email: req.session.email
  });
});


module.exports = router;
