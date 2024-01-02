//************************* Import Dependencies ***********************//
const express = require('express')
const axios = require('axios')
const Apod = require('../models/apod')
const apod = process.env.APOD_API_URL  //TODO <-------------
const apiKey = process.env.API_KEY //TODO <--------------
//const Place = require('../models/place')

//************************* Create Router *****************************//
const router = express.Router()

//************************* Routers & Controllers *********************//
router.get('/show', (req, res)=>{

    axios(`${apod}?${apiKey}`)
        .then(apiRes => {
            const foundData = apiRes.data
            res.render('apod/show', {apod: foundData})
        })
})

//********************* Export **********************//
module.exports = router

//TODO Ask Timm, would I have to have mulitple models? for each API? 
//Answer: You do not need a seperate model for each API. Schema is onlu used for saving data not displaying data. 

//Favorites model, add notes to fav image, owner field, favorites tab. 
//Parse how to get that data, build request body on API responses. 

//Data from API can be shown BUT doesnt have to be saved
//Saving data to mongoose database

//last router on places app, shows data from API but doesnt neccssary save that data unless we want. 
//... this allows us to show any data we want and only save what we need to users favorites. 

//TODO Work on ERD and WIREFRAME - later on. 