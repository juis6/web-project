/* modules */

const express = require('express');
const router = express.Router();

const User = require('../models/User.js');
const bcrypt = require('bcrypt');

const auth = require('../configs/auth.js');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

/* root method GET */

router.get('/', async (req, res) => {
    try {
        const locals = { title: 'root.ejs' }
        res.render('root.ejs', { locals });
    } catch (error) {
        console.error(error.message);
    }
});

/* login method GET */

router.get('/login', async (req, res) => {
    try {
        const locals = { title: 'login.ejs' }
        res.render('login.ejs', { locals });
    } catch (error) {
        console.error(error.message);
    }
});

/* login method POST */

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials!' });
        }
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
            return res.status(401).json({ message: 'Invalid credentials!' });
        }
        const token = jwt.sign({ userId: user._id }, JWT_SECRET);
        res.cookie('token', token, { httpOnly: true });
        res.redirect('/home');
    } catch (error) {
        console.error(error.message);
    }
});

/* register method GET */

router.get('/register', async (req, res) => {
    try {
        const locals = { title: 'register.ejs' }
        res.render('register.ejs', { locals });
    } catch (error) {
        console.error(error.message);
    }
});

/* register method POST */

router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const hash = await bcrypt.hash(password, 10);
        await User.create({
            username: username,
            password: hash
        });
        res.redirect('/login');
    } catch (error) {
        console.error(error.message);
    }
});

module.exports = router;