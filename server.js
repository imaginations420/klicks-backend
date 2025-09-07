const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth');

const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(cookieParser());
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // set to true if using HTTPS
}));

app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

app.use(cors({
  origin: 'https://kclicks-frontend.netlify.app/',
  credentials: true
}));