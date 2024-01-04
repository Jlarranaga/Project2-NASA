//************************ Import Dependencies *********************//
const express = require('express')
const bodyParser = require('body-parser')
const {appendFile} = require('fs')
const path = require('path')
const middleware = require('./utils/middleware')
const session = require('express-session')
const passport = require('passport')

require('dotenv').config()
require('./utils/connection')
require('./utils/middleware')
require('./utils/passport')

//************************ Create App Object ***********************//
const app = express()

//************************ Set Up View Engine **********************//
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

//************************ Import Routers **************************//
const apodRouter = require('./controllers/apodControllers')
const imageVideoLib = require('./controllers/imageVidLibControllers')
const favoriteRouter = require('./controllers/favoriteControllers')

//************************ Middleware ******************************//
middleware(app);

//************************ Routes **********************************//
app.get('/', (req, res) =>{ //<-- Home Page
    //TODO Add user verfication here
    res.render('home.ejs')
})

app.use('/apod', apodRouter)
app.use('/imageVideoLib', imageVideoLib)
app.use('/favorite', favoriteRouter)
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true
  }));
app.use(passport.initialize());
app.use(passport.session());

//************************ Server Listener *************************//
const PORT = process.env.PORT

app.listen(PORT, ()=>{
    console.log('server running')
})