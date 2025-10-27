/*
    Load Balancer
    
    This is simple web project created with Node.js & MongoDB.
    Using Nginx for even distribution of requests between servers.

    Connected modules: bcrypt, connect-mongo, cookie-parser,
    dotenv, ejs, express, express-ejs-layouts, express-session,
    jsonwebtoken, method-override, mongoose, nodemon.
*/

/* .env conf */

require('dotenv').config();

const PORT = process.env.PORT;
const MONGODB_URI = process.env.MONGODB_URI;
const SESSION_SECRET = process.env.SESSION_SECRET;

/* express app */

const express = require('express');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.listen(PORT, () => {
    console.log(`App listening on PORT ${PORT}`);
});

/* connect & session DB */

const connectDB = require('./configs/db.js');

connectDB(MONGODB_URI);

const MongoStore = require('connect-mongo');
const session = require('express-session');
const cookie = require('cookie-parser');

app.use(cookie());
app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI
    }),
    cookie: { maxAge: 3600000 }
}));

/* static files */

app.use(express.static('public'));

/* layouts */

const layouts = require('express-ejs-layouts');

app.use(layouts);
app.set('view engine', 'ejs');
app.set('layout', './layouts/start.ejs');

/* routes */

const override = require('method-override');

app.use(override('_method'));
app.use('/', require('./routes/start.js'));
app.use('/', require('./routes/main.js'));