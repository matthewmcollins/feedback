const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const mongoose = require("mongoose");
const keys = require("../config/keys");

//pull schema out
const User = mongoose.model("users");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

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
      callbackURL: "/auth/google/callback",
      proxy: true
    },
    async (accessToken, refreshToken, profile, done) => {
      //done is what we call to tell passport we are done, proceed with the authentication flow
      const existingUser = await User.findOne({ googleId: profile.id });
      if (existingUser) {
        //exists (null means no error)
        return done(null, existingUser);
      }
      //does not exist, create
      //new User is going down to the database, the promise then user is what comes back
      //(might have more info)
      const user = await new User({ googleId: profile.id }).save();
      done(null, user);
    }
  )
);
