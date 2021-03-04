const LocalStrategy = require('passport-local').Strategy;

module.exports = new LocalStrategy(
  (async (username, password, done) => {
    done(null, {
      username,
      password,
    });
  }),
);
