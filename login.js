const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
    clientID: 680225538265-inhdhrkotr87ms8hl5b3ddf69oe9gu5n.apps.googleusercontent.com,
    clientSecret: 4Z3YutRyHemqu7TyNWrcMPz6,
    callbackURL: "http://localhost:3000/login_done"
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));

app.get('/login',
  passport.authenticate('google', { scope: ['profile'] }));

app.get('/login_done', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/user');
  });

