const passport = require("passport");

module.exports = app => {
  //route for login, invoke passport
  //GoogleStrategy is known internally as "google"
  //scope - we want access to profile and email
  app.get(
    "/auth/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
  );

  //route for authentication callback
  app.get("/auth/google/callback", passport.authenticate("google"));

  app.get("/api/logout", (req, res) => {
    req.logout();
    res.send(req.user);
  });

  //test the current user (the oauth process)
  app.get("/api/current_user", (req, res) => {
    res.send(req.session);
  });
};
