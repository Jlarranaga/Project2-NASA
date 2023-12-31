//************************ Import Dependencies *********************//
const express = require("express");
const bodyParser = require("body-parser");
const { appendFile } = require("fs");
const path = require("path");
const middleware = require("./utils/middleware");
const session = require("express-session");
const passport = require("passport");
const serveIndex = require("serve-index");

require("dotenv").config();
require("./utils/connection");
require("./utils/middleware");
require("./utils/passport");

//************************ Create App Object ***********************//
const app = express();

//************************ Set Up View Engine **********************//
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

//************************ Import Routers **************************//
const apodRouter = require("./controllers/apodControllers");
const imageVideoLib = require("./controllers/imageVidLibControllers");
const favoriteRouter = require("./controllers/favoriteControllers");
const passportRouter = require("./controllers/passportController");

//************************ Middleware ******************************//
middleware(app);
app.use(passport.initialize());
app.use(passport.session());
app.use("/public/videos", express.static(__dirname + "/public/videos"));
app.use("/public/audio", express.static(__dirname + "/public/audio"));
app.use(express.static(path.join(__dirname, "public")));

//************************ Routes **********************************//

app.use(function (req, res, next) {
  res.locals.user = req.user;
  next();
});
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.use("/", passportRouter);
app.use("/apod", apodRouter);
app.use("/imageVideoLib", imageVideoLib);
app.use("/favorite", favoriteRouter);

//************************ Server Listener *************************//
const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log("server running");
});
