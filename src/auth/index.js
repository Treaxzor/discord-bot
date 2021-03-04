const passport = require('passport');
const config = require('config');
const LocalAuthentication = require('./local');


const initializeMiddleware = passport.initialize();
const sessionMiddleware = passport.session();
// authentications
passport.use(LocalAuthentication);

// used to serialize the user for the session
passport.serializeUser((id, done) => {
  done(null, id);
});

// used to deserialize the user
passport.deserializeUser(async (id, done) => {
  done(null, id);
});

const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.sendStatus(401);
  }
};

const authenticate = (req, res, next) => {
  if (!req.body.username || !req.body.password) {
    return res.json({ errors: ['Fill all the fields'] });
  }

  passport.authenticate('local', async (err, user) => {
    if (user.username == config.authentication.username && user.password == config.authentication.password) {
      req.logIn(new Date().getTime(), () => { });
      return res.json({
        isValid: true,
      })
    }

    return res.json({
      isValid: false,
      errors: ['Invalid username or password']
    })
  })(req, res, next);
};

module.exports = {
  middlewares: [initializeMiddleware, sessionMiddleware],
  isAuthenticated,
  authenticate,
};
