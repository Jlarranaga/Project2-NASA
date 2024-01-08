//************************* Import Dependencies ***********************//
const express = require('express')
const axios = require('axios')
const Favorite = require('../models/favorite')
const apod = process.env.APOD_API_URL  
const imageVideoLib = process.env.IMAGE_VIDEO_LIBRARY
const apiKey = process.env.API_KEY 



//************************* Create Router *****************************//
const router = express.Router()

//************************* Routers & Controllers *********************//

router.get('/show', (req, res)=>{
    let onFavList = false

    axios(`${apod}?api_key=${apiKey}`)
        .then(apiRes => {
            const foundData = apiRes.data
    
    if(req.session.passport !== undefined){
        const {user} = req.session.passport
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
}
            console.log('APOD DATA: ', foundData)
            res.render('apod/show', {apod: foundData, favorite: onFavList})
        })
})

//********************* Export **********************//
module.exports = router