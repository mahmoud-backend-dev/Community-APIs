const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GoogleAccount = require('../models/GoogleAccount');



exports.configPassport = () => {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser(async(id, done) => {
    const user = await GoogleAccount.findById(id);
    done(null,user);
  });
  passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: process.env.CALL_BACK_URL,
    scope: ['profile', 'email'],// Add the email scope
    passReqToCallback:true,
  }, async function (req,accessToken, refreshToken, profile, done) {
    let user = await GoogleAccount.findOne({ googleId: profile.id });
    if (!user) {
          user  = await GoogleAccount.create({
                googleId: profile.id,
                email: profile.emails[0].value,
                firstName: profile.name.givenName,
                lastName: profile.name.familyName,
                image: profile.photos[0].value,
          })
      
      req.token= user.createJWT()
      return done(null,user);
    }
    req.token= user.createJWT()
    return done(null, user);
  }))
}



