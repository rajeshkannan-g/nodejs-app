var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

var User = require('./models/user');
var configAuth = require('./config/auth_config');

module.exports = function (passport) {
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });

    passport.use('local-signup', new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true
    },
        function (req, username, password, done) {
            process.nextTick(function () {
                User.findOne({ 'local.username': username }, function (err, user) {
                    if (err)
                        return done(err);
                    if (user) {
                        return done(null, false, req.flash('signupMessage', 'That username already taken'));
                    }
                    if (!req.user) {
                        var newUser = new User();
                        newUser.local.username = username;
                        newUser.local.password = password;
                        newUser.local.email = req.body.mail;
                        newUser.local.displayname = req.body.displayname;

                        newUser.save(function (err) {
                            if (err)
                                throw err;
                            return done(null, newUser);
                        })
                    } else {
                        var user = req.user;
                        user.local.username = username;
                        user.local.password = password;

                        user.save(function (err) {
                            if (err)
                                throw err;
                            return done(null, user);
                        })
                    }
                })

            });
        }
    ));

    passport.use('local-login', new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true
    },
        function (req, username, password, done) {
            process.nextTick(function () {
                User.findOne({ 'local.username': username }, function (err, user) {
                    if (err)
                        return done(err);
                    if (!user)
                        return done(null, false, req.flash('loginMessage', 'No user found'));
                    if (!user.validatePassword(password)) {
                        return done(null, false, req.flash('loginMessage', 'Invalid password'));
                    }
                    return done(null, user);

                });
            });
        }
    ));

    passport.use(new FacebookStrategy({
        clientID: configAuth.facebookAuth.clientID,
        clientSecret: configAuth.facebookAuth.clientSecret,
        callbackURL: configAuth.facebookAuth.callbackURL,
        passReqToCallback: true
    },
        function (req, accessToken, refreshToken, profile, done) {
            process.nextTick(function () {
                if (!req.user) {
                    User.findOne({ 'facebook.id': profile.id }, function (err, user) {
                        if (err)
                            return done(err);
                        if (user) {
                            if (!user.facebook.token) {
                                user.facebook.token = accessToken;
                                user.facebook.displayname = profile.name.givenName + ' ' + profile.name.familyName;
                                user.facebook.email = profile.email ? profile.email : '';
                                user.save(function (err) {
                                    if (err)
                                        throw err;
                                });

                            }
                            return done(null, user);
                        }
                        else {
                            var newUser = new User();
                            console.log(profile);
                            newUser.facebook.id = profile.id;
                            newUser.facebook.token = accessToken;
                            newUser.facebook.displayname = profile.displayName;
                            newUser.facebook.email = profile.email ? profile.email : '';

                            newUser.save(function (err) {
                                if (err)
                                    throw err;
                                return done(null, newUser);
                            })
                        }
                    });
                }
                else {
                    var user = req.user;
                    user.facebook.id = profile.id;
                    user.facebook.token = accessToken;
                    user.facebook.displayname = profile.name.givenName + ' ' + profile.name.familyName;
                    user.facebook.email = profile.email ? profile.email : '';

                    user.save(function (err) {
                        if (err)
                            throw err
                        return done(null, user);
                    })
                }

            });
        }

    ));

    passport.use(new GoogleStrategy({
        clientID: configAuth.googleAuth.clientID,
        clientSecret: configAuth.googleAuth.clientSecret,
        callbackURL: configAuth.googleAuth.callbackURL,
        passReqToCallback: true
    },
        function (req, accessToken, refreshToken, profile, done) {
            process.nextTick(function () {

                if (!req.user) {
                    User.findOne({ 'google.id': profile.id }, function (err, user) {
                        if (err)
                            return done(err);
                        if (user) {
                            if (!user.google.token) {
                                user.google.token = accessToken;
                                user.google.displayname = profile.displayName;
                                user.google.email = profile.emails[0].value;
                                user.save(function (err) {
                                    if (err)
                                        throw err;
                                });
                            }
                            return done(null, user);
                        }
                        else {
                            var newUser = new User();
                            newUser.google.id = profile.id;
                            newUser.google.token = accessToken;
                            newUser.google.displayname = profile.displayName;
                            newUser.google.email = profile.emails[0].value;

                            newUser.save(function (err) {
                                if (err)
                                    throw err;
                                return done(null, newUser);
                            })
                        }
                    });
                } else {
                    var user = req.user;
                    user.google.id = profile.id;
                    user.google.token = accessToken;
                    user.google.displayname = profile.displayName;
                    user.google.email = profile.emails[0].value;

                    user.save(function (err) {
                        if (err)
                            throw err;
                        return done(null, user);
                    });
                }
            });
        }
    ))
};