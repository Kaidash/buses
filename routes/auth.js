var auth = require('../utils/auth');

// Routes for authentication (signup, login, logout)
module.exports = function(app, passport) {

  app.get('/signup', auth.alreadyLoggedIn, (req, res) =>{

    res.render('signup', { message: req.flash('signupMessage') });

  });

  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/admin',
    failureRedirect: '/signup',
    failureFlash: true // Allow flash messages
  }));

  app.get('/login', auth.alreadyLoggedIn, (req, res) => {
    // console.log('HERE');
    res.render('login', { message: req.flash('loginMessage') });

  });

  app.post('/login', passport.authenticate('local', {
    successRedirect: '/admin',
    failureRedirect: '/login'
  }));

  app.get('/logout', async (req, res) => {

    req.logout();
    res.redirect('/');

  });

};
