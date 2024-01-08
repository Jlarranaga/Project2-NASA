//************************* Import Dependencies ***********************//
const express = require('express')
const axios = require('axios')
const Favorite = require('../models/favorite')
const apod = process.env.APOD_API_URL  
const imageVideoLib = process.env.IMAGE_VIDEO_LIBRARY
const apiKey = process.env.API_KEY 

//const Place = require('../models/place')

//************************* Create Router *****************************//
const router = express.Router()

//************************* Routers & Controllers *********************//
//TODO Add date search functionality to search different days APOD
// ** APOD */
router.get('/show', (req, res)=>{
    const {user} = req.session.passport
    let onFavList = false

    console.log("USER: ",user)

    axios(`${apod}?api_key=${apiKey}`)
        .then(apiRes => {
            const foundData = apiRes.data

    Favorite.find({owner: user})
    .then(ownerFavs =>{
    if(ownerFavs.length !== 0){
        
        for(i=0; i<ownerFavs.length; i++){
        if(ownerFavs[i].apods.length !== 0){

            for(let i = 0; i<ownerFavs.length; i++){
                if(ownerFavs[i].apods[0].url === foundData.url){
                    onFavList = true
                    break
                }else{
                    onFavList = false
                }
            }
        }
    }
    }
    })
            console.log('APOD DATA: ', foundData)
            res.render('apod/show', {apod: foundData, favorite: onFavList})
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