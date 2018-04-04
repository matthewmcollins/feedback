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
  //after they log in, send them to the surveys page
  app.get(
    "/auth/google/callback",
    passport.authenticate("google"),
    (req, res) => {
      res.redirect("/surveys");
    }
  );

  app.get("/api/logout", (req, res) => {
    req.logout();
    res.redirect("/");
  });

  //test the current user (the oauth process)
  app.get("/api/current_user", (req, res) => {
    res.send(req.user);
  });
};
