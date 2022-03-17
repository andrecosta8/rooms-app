const express = require('express');
const User = require('../models/User.model');
const router = express.Router();
const saltRound = 10;
const bcrypt = require('bcrypt');

const requireLogOut = require("../middleware/isLoggedOut");
const isLoggedIn = require('../middleware/isLoggedIn');
const isLoggedOut = require('../middleware/isLoggedOut');


router.get("/signup", isLoggedOut, (req, res, next) => {
    res.render("signup");
});

router.post("/signup", isLoggedOut, async (req, res, next) => {
    //console.log(req.body);
    const { email, password, fullName } = req.body;
    const salt = await bcrypt.genSalt(saltRound);
    const hash = await bcrypt.hash(password, salt);
    const user = {
        email,
        password: hash,
        fullName,
    };
    //console.log(user);
    await User.create(user);
    res.render('login');
});
router.use("/login", requireLogOut);
router.get("/login",  (req, res) => {
    res.render("login");
});

router.post("/login",isLoggedOut, async (req, res) => {
    try {
        //console.log(req.body);
        const user = await User.findOne({ email: req.body.email });
        console.log(user);
        const hashFromDb = user.password;
        const passwordCorrect = await bcrypt.compare(req.body.password, hashFromDb);
        console.log(passwordCorrect ? "Yes" : "No");
        if (!passwordCorrect) {
            throw Error("Password incorrect");
        }
        res.redirect("/user-profile");
        req.session.currentUser = user;
    } catch (err) {
        res.render("login", { error: "Wrong username or password" });
    }
});

router.post("/logout",isLoggedIn, (req, res) => {
    req.session.destroy((err) => {
        if (err) return next(err);
        res.redirect("/login");
    });
});

module.exports = router;

