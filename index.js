require('dotenv').config();
const express = require('express');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const { connectDB } = require('./config/db');
const { initModels } = require('./models');
const { initSystemUser } = require('./config/systemUser');

// Route imports
const userRoute = require('./routes/user');
const urlRoute = require('./routes/url');
const projectRoute = require('./routes/project');
const domainRoute = require('./routes/domain');
const dashboardRoute = require('./routes/dashboard');
const redirectRoute = require('./routes/redirect');
// const redirectRoute = require('./routes/redirect'); // To be created

const app = express();
const PORT = process.env.PORT || 8000;

// Database Connection & Initialization
const startServer = async () => {
    try {
        await connectDB();
        await initModels();
        await initSystemUser();
        console.log('✅ System initialized successfully.');
    } catch (error) {
        console.error('Initialization failed:', error);
    }
};
startServer();

// View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layouts/main');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/user', userRoute);
app.use('/api/url', urlRoute);
app.use('/api/project', projectRoute);
app.use('/api/domain', domainRoute);
app.use('/api/dashboard', dashboardRoute);

app.get('/', (req, res) => {
    res.render('index', { title: 'URL Shortener Pro' });
});

app.get('/login', (req, res) => {
    res.render('login', { title: 'Login - Shorten.io' });
});

app.get('/register', (req, res) => {
    res.render('register', { title: 'Register - Shorten.io' });
});

app.get('/dashboard', (req, res) => {
    res.render('dashboard', { title: 'Dashboard - Shorten.io' });
});

app.get('/profile', (req, res) => {
    res.render('profile', { title: 'Profile - Shorten.io' });
});

app.get('/terms', (req, res) => {
    res.render('terms', { title: 'Terms of Brutality - Shorten.io' });
});

app.get('/privacy', (req, res) => {
    res.render('privacy', { title: 'Privacy Policy - Shorten.io' });
});

app.use('/', redirectRoute); // REDIRECTION MUST BE LAST

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
