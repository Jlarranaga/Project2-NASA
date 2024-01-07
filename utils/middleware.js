//************** Import Dependencies ***********************//
const express = require('express') //<-- express framework
const morgan = require('morgan') //<-- morgan logger for request info
const session = require('express-session')
const MongoStore = require('connect-mongo') //<-- onnect mongo for session
require('dotenv').config()
const methodOverride = require('method-override') //<-- forms and CRUD

//**************** Middleware Functions *********************//
const middleware = (app) => {
    //Middleware runs BEFORE ALL ROUTES! 
    //EVERY request is first processed through middlware
    //Middlware allows us to use forms to their full potential
    
    app.use(methodOverride('_method'))

    //This will allow us to get data from forms (HTML Pages) req.body
    app.use(express.urlencoded({extended: true}))

    //Morgan logs request to console
    app.use(morgan('tiny')) //<-- tiny is a qualifier, says to be short

    //To serve stylesheets we use static public
    app.use(express.static('public'))
    
    //Utilize JSON:
    app.use(express.json())

    //Utilizing session function, pass a function argument, a configuration object
    //config obj needs several keys to work
    //Keys: secret (top secret code for indv. session from app that calls function)
    //store: tells connect mongo where to save session (our DB)
    app.use(
        session({
            secret: process.env.SECRET,
            store: MongoStore.create({
                mongoUrl: process.env.DATABASE_URL
            }),
            saveUninitialized: true,
            resave: false
        })
    )
}

//***************** Export Middleware Function *************//
module.exports = middleware