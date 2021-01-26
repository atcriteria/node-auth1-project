const express = require("express");
const User = require("../users/user-model");
const bcrypt = require("bcryptjs");
// const session = require("express-session");
const router = express.Router();

router.post('/register', (req, res) => {
    const { username, password } = req.body;
    const hashed = bcrypt.hashSync(password, 10);

    User.add({ username, password: hashed, role: 1 })
        .then(user => {
            res.status(201).json(user)
        })
        .catch(err => {
            res.status(500).json(err.message)
        })
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const possibleUser = await User.findBy({ username }).first();
        if (possibleUser && bcrypt.compareSync(password, possibleUser.password)) {
            req.session.user = possibleUser;
            res.json(`Welcome, ${username}`)
        } else {
            res.status(401).json("Invalid Credentials >:(((")
        }
    } catch (err){
        res.status(500).json(err.message)
    }
});

router.get('/logout', (req, res) => {
    if (req.session && req.session.user) {
        req.session.destroy(err => {
            if (err){
                res.json("Whoops, something broke. Try again")
            } else {
                res.json("You have been successfully logged out.")
            }
        }) 
    } else {
        res.end();
    }
})

module.exports = router;