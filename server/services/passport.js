const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const keys = require('../config/keys');

const User = mongoose.model('users');

// Take user id token to the cookie
passport.serializeUser((user, done) => {
  done(null, user.id); // user.id is user internal id (from MongoDB)
});

// Take the user id token from cookie to Mongoose Model
passport.deserializeUser((id, done) => {
  User.findById(id).then(user => {
    done(null, user);
  });
});


passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: '/auth/google/callback',
      proxy: true
    }, 
    async (accessToken, refreshToken, profile, done) => {
      const existingUser = await User.findOne({ googleId: profile.id });
      // user already exist
      if (existingUser) { 
        done(null, existingUser);
      } 
      // create new user
      const user = await new User({ googleId: profile.id }).save();
      done(null, user);
    }
  )
);