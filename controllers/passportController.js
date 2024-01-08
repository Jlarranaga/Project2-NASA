const express = require("express");
const router = express.Router();
const passport = require("passport");

router.get("/", function (req, res, next) {
  res.render("home");
});

//Logging in
router.get(
  "/auth/google",
  passport.authenticate(
    //Which passport strategu to use
    "google",
    {
      scope: ["profile", "email"],
      //Optional
      prompt: "select_account", //<-- this will allow the user to selecet account if they have many gmail
    }
  )
);

router.get(
  "/oauth2callback",
  passport.authenticate("google", {
    successRedirect: "/",
    failureRedirect: "/",
  })
);

router.get("/logout", function (req, res) {
  req.logout(function () {
    res.redirect("/");
  });
});

module.exports = router;
