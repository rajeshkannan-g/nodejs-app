var express = require('express');
var path = require('path');
var passport = require('passport');
var router = express.Router();

router.use(function (req, res, next) {
    if (req.isAuthenticated() || req.url.startsWith('/login') || 
        req.url.startsWith('/signup') || req.url.startsWith('/auth/') ||
        req.url.startsWith('/static/img/') || req.url.startsWith('/hi'))
        next();
    else
        res.render('login.ejs', { message: req.flash('loginMessage'), signup: false });
});

//handle error
router.use(function (err, req, res, next) {
    if (process.env.NODE_ENV != 'production') {
        res.render('error.ejs', { message: '', error: err });
    }
    else {
        res.status(500);
        res.render('error.ejs', { message: err.message, error: '' });
    }
});

router.use('/static', express.static('views/public'));

router.get('/', function (req, res) {
    res.render('public/index.ejs', { username: (req.user.local.name || req.user.facebook.name || req.user.google.name) });
});

router.post('/login', passport.authenticate('local-login', {
    successRedirect: '/',
    failureRedirect: '/',
    failureFlash: true
}));


router.get('/signup', function (req, res) {
    res.render('login.ejs', { message: req.flash('signupMessage'), signup: true });
});

router.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/',
    failureRedirect: '/signup',
    failureFlash: true
}));


router.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email'] }));

router.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
        successRedirect: '/',
        failureRedirect: '/'
    }));

router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/auth/google/callback',
    passport.authenticate('google', {
        successRedirect: '/',
        failureRedirect: '/'
    }));

router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
})

module.exports = router;