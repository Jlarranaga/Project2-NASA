//************************ Import Dependencies *********************//
const express = require('express')
const {appendFile} = require('fs')
require('dotenv').config()
const path = require('path')
const middleware = require('./utils/middleware')

//************************ Create App Object ***********************//
const app = express()

//************************ Set Up View Engine **********************//
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

//************************ Import Routers **************************//
const nasaRouter = require('./controllers/nasaControllers')

//************************ Middleware ******************************//
middleware(app);

//************************ Routes **********************************//
app.get('/', (req, res) =>{ //<-- Home Page
    //TODO Add user verfication here
    res.render('home.ejs')
})

app.use('/apod', nasaRouter)

//************************ Server Listener *************************//
const PORT = process.env.PORT

app.listen(PORT, ()=>{
    console.log('server running')
})