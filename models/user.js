const bcrypt = require('bcrypt-nodejs');
const uuidV4 = require('uuid/v4');
const db  = require('./db');
const admins = require('../config/admin');

// Set up User class
var User = function(user) {
  var that = Object.create(User.prototype);

  that.id       = user.id;
  that.email    = user.email;
  that.password = user.password;

  return that;
};

// Gets a random id for this user
var generateUserId = function() {
  return uuidV4();
};

// Hash and salt the password with bcrypt
var hashPassword = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// Check if password is correct
var validPassword = function(password, savedPassword) {
  return bcrypt.compareSync(password, savedPassword);
};

// Add new user to db
async function addUser (id, email, password) {
  if (admins.indexOf(email) >= 0) {
    return await db.query('INSERT INTO users ( id, email, password ) values (?,?,?)',
      [id, email, password]
    )
      .then((users) => {
        if (users) {
          return true
        }
      })
      .catch((error) => {throw (error)});
  } else {
    throw ("This account can't be as an admin")
  }
}

// Create a new user
async function createUser (email, password) {
  const newUser = {
    id: generateUserId(),
    email: email,
    password: hashPassword(password)
  };
  const user = await addUser(newUser.id, newUser.email, newUser.password);
  if (user) {
    return newUser;
  }
};

async function getUserByEmail (email) {
  return await db.query('SELECT * FROM users WHERE email = ?', [email]).then((users) => {
    if (users[0]) {
      return users[0]
    }
  });
}

// Check if a user exists and create them if they do not
const signup = function (req, email, password, done) {
  process.nextTick(async function () {
    // Check if there's already a user with that email
    try {
      const user = await getUserByEmail(email);
      if (user) {
        return done(null, false, req.flash('signupMessage', 'An account with that email address already exists.'));
      } else {
        const createdUser = await createUser(email, password);
        if (createdUser) {
          return done(null, createdUser)
        }
      }
    } catch (e) {
      return done(null, false, req.flash('signupMessage', 'This account can\'t be as an admin'));
    }
  });
};

// Log in a user
const login = async function (req, email, password, done) {
  try {
    const user = await getUserByEmail(email);
      if (!user) {
        return done(null, false, req.flash('loginMessage', 'Can not find user by this name.'));
      }
      if (!validPassword(password, user.password)) {
        return done(null, false, req.flash('loginMessage', 'Wrong password.'));

      }
      return done(null, user);
  } catch (e) {
    return done(null, false, req.flash('loginMessage', 'Something went wrong.'));
  }
};


exports.signup = signup;
exports.login = login;
