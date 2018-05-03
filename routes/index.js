var auth = require('../utils/auth');

// Main routes for app
module.exports = function(app) {

  app.get('/', function(req, res, next) {

    res.render('index');

  });

  app.get('/admin', auth.requireLogin, function(req, res, next) {

    res.render('admin', { user: req.user });

  });

};
