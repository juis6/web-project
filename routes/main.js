/* modules */

const express = require('express');
const router = express.Router();
const main = '../views/layouts/main.ejs';

const User = require('../models/User.js');
const Task = require('../models/Task.js');

const auth = require('../configs/auth.js');

const taskQueue = require('../configs/queue.js');

/* index method GET */

router.get('/home', auth, async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        const locals = { title: 'home.ejs', username: user.username }
        res.render('home.ejs', { locals, layout: main });
    } catch (error) {
        console.error(error.message);
    }
});

/* create method GET */

router.get('/create', auth, async (req, res) => {
    try {
        const locals = { title: 'create.ejs' }
        res.render('create.ejs', { locals, layout: main });
    } catch (error) {
        console.error(error.message);
    }
});

/* create method POST */

router.post('/create', auth, async (req, res) => {
    try {
        const { request, delay } = req.body;
        const task = await Task.create({
            request: request,
            userId: req.userId
        });
        await taskQueue.add({
            taskId: task._id,
            request: request,
            delay: delay
        }, {
            jobId: task._id.toString()
        });
        res.redirect('/manage');
    } catch (error) {
        console.error(error.message);
    }
});

/* manage method GET */

router.get('/manage', auth, async (req, res) => {
    try {
        const locals = { title: 'manage.ejs' }
        const data = await Task.find({ userId: req.userId }).sort({ createdAt: -1 });
        res.render('manage.ejs', { locals, data, layout: main });
    } catch (error) {
        console.error(error.message);
    }
});

/* cancel-task method POST */

router.post('/cancel-task/:id', auth, async (req, res) => {
    try {
        await Task.findByIdAndUpdate(req.params.id, { status: 'canceled' });
        res.redirect('/manage');
    } catch (error) {
        console.error(error.message);
    }
});

/* delete-task method DELETE */

router.delete('/delete-task/:id', auth, async (req, res) => {
    try {
        await Task.deleteOne({ _id: req.params.id });
        res.redirect('/manage');
    } catch (error) {
        console.error(error);
    }
});

/* review-task method GET */

router.get('/review-task/:id', auth, async (req, res) => {
    try {
        const locals = { title: 'review.ejs' }
        const task = await Task.findById(req.params.id)
        res.render('review.ejs', { locals, task, layout: main });
    } catch (error) {
        console.error(error);
    }
});

/* logout method GET */

router.get('/logout', async (req, res) => {
    try {
        res.clearCookie('token');
        res.redirect('/login');
    } catch (error) {
        console.error(error.message);
    }
});

module.exports = router;