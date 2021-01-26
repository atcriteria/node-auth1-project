const express = require('express');
const session = require("express-session");

const KnexSessionStore = require('connect-session-knex')(session);

const usersRouter = require('./users/user-router');
const authRouter = require('./auth/auth-router');

const server = express();

server.use(express.json());
server.use(session({
    name: "donkey",
    secret: "say nothing sammy",
    cookie: {
        maxAge: 1000 * 60 * 60,
        secure: false,
        httpOnly: true,
    },
    resave: false,
    saveUninitialized: false,
    store: new KnexSessionStore({
        knex: require('../database/connection'),
        tablename: 'sessions',
        sidfieldname: 'sid',
        createtable: true,
        clearInterval: 1000*60*60,
    }),
}));

server.use("/api/users", usersRouter);
server.use("/api/auth", authRouter);

server.get('/', (req, res) => {
    res.json({api: "up"});
});

module.exports = server;