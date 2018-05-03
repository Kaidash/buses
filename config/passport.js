const LocalStrategy = require('passport-local').Strategy;
const user = require('../models/user');
const db  = require('../models/db');

module.exports = function(passport) {

  // Passport session setup, required for persistent login sessions
  // Used to serialize and unserialize users out of session
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    db.query('SELECT * FROM users WHERE id = ?', [id])
      .then((rows) => {
        console.log(rows);
        return done(null, rows[0]);
      })
  });

  // Local signup
  passport.use('local-signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true // Pass the entire request back to the callback
  }, user.signup));

  // Local login
  passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true // Pass the entire request back to the callback
  }, user.login));

};
