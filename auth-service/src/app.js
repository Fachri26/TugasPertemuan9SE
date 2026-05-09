require('dotenv').config();
const express = require('express');

const authRoutes = require('./routes/authRoutes');
const session = require('express-session');
const passport = require('passport');
const helmet = require('helmet');

require('./config/passport');

const app = express();

app.use(express.json());

app.use(helmet());

app.use(
  session({
    secret: 'oauth_secret',
    resave: false,
    saveUninitialized: false
  })
);

app.use('/auth', authRoutes);
app.use(passport.initialize());
app.use(passport.session());

app.get('/health', (req, res) => {
  res.json({
    service: 'auth-service',
    status: 'running'
  });
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Auth Service running on port ${PORT}`);
});