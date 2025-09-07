const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth');

const cors = require('cors');

const app = express();
const PORT = 5000;

const allowedOrigins = [
  "https://kclicks-frontend2.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));


app.use(express.json());
app.use(cookieParser());
app.use(session({
  secret: '157a79e613c12c8eae618a04ed5baca4',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true,       
    httpOnly: true,    
    sameSite: 'none'   
  }
}));


app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});