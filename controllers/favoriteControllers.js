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

//showing all favorites 
router.get('/all', (req, res) =>{
    const {user} = req.session.passport

    Favorite.find({owner: user})
        .then(ownerFavs =>{
            
            res.render('favorite/all', {imageVideo: ownerFavs})
        })
        .catch(err =>{
            res.redirect(`/error?error=${err}`)
        })

})

//Adding a favorite to the list and displaying it
router.post('/add', async (req, res) =>{
    const {user} = req.session.passport
    const favorite = new Favorite;

    const ivl = req.body
    favorite.owner = user
    favorite.favorite = true
    
    favorite.imageVideoLib.push(ivl)
        try {
            await favorite.save()
        }catch (err){
            res.redirect(`/error?error=${err}`)
        }   
            
        Favorite.find({owner: user})
        .then(ownerFavs =>{
            res.render('favorite/all', {imageVideo: ownerFavs})
        })
        .catch(err =>{
            res.redirect(`/error?error=${err}`)
        })

})

//Deleting Favorite Item
router.delete('/delete/:id', (req,res, next) =>{
const {user} = req.session.passport
const id = req.params.id

    Favorite.find({owner: user})
        .then(ownerFavs =>{
            for(let i = 0; i<ownerFavs.length; i++){
            if(ownerFavs[i].imageVideoLib[0].nasa_id === id ){
                if(ownerFavs[i].owner == user){
                    return ownerFavs[i].deleteOne()
                }else{
                    res.redirect(`/error?error=You%20Are%20Not%20Allowed%20to%20Delete%20this%20Favorite`)
                }
            }else{
                
            }
        }
        })
        .then(deletedFavorite => {
            res.redirect('/favorite/all')
        })
        .catch(err => {
            res.redirect(`/error?error=${err}`)
        })
})

router.post('/videoIndex', (req, res) =>{
    const {search} = req.body

    axios(`${imageVideoLib}/search?q=${search}&media_type=video&page_size=50`) //<-- add "/search?q={'KEYWORD HERE'}"
        .then(apiRes =>{
            const foundData = apiRes.data 
            res.render('imageVideoLib/videoIndex', {imageVideo: foundData})
            
        })
})

//Showing the video or image and able to favorite and save to users list
router.get('/:id', (req,res)=>{
const {user} = req.session.passport
const id = req.params.id
    
    Favorite.find({owner: user})
        .then(ownerFavs =>{
            for(let i = 0; i<ownerFavs.length; i++){
            if(ownerFavs[i].imageVideoLib[0].nasa_id === id ){
                
                res.render('favorite/show', {imageVideo: ownerFavs[i]})
                return
            }
        }
        })
        .catch(err => {
            res.redirect(`/error?error=${err}`)
        })
})

//Updating Favorite
router.put('/update/:id', async (req,res, next) => {
    const {user} = req.session.passport
    const id = req.params.id

    const updatedFav = req.body
    
    delete updatedFav.owner
    updatedFav.owner = user

    updatedFav.date = !!updatedFav.date
    updatedFav.description = !!updatedFav.description

    if(updatedFav.date === true){
        try{
        const apiRes = await axios(`${imageVideoLib}/search?nasa_id=${id}`) 
        
            const foundData = apiRes.data 
            updatedFav.date = foundData.collection.items[0].data[0].date_created
        } catch (err){
            return res.redirect(`/error?error=${err}`)
        }
           
    }

    if(updatedFav.description === true){
        try{
            const apiRes = await axios(`${imageVideoLib}/search?nasa_id=${id}`) 
                const foundData = apiRes.data 
                updatedFav.description = foundData.collection.items[0].data[0].description
            } catch (err){
                return res.redirect(`/error?error=${err}`)
            }
    }

    Favorite.find({owner: user})
        .then(async ownerFavs =>{
            for(let i = 0; i<ownerFavs.length; i++){
            if(ownerFavs[i].imageVideoLib[0].nasa_id === id ){
                if(ownerFavs[i].owner == user){
                    
                    await ownerFavs[i].updateOne({$set: {"imageVideoLib": updatedFav}})
                    return
                }else{
                    res.redirect(`/error?error=You%20Are%20Not%20Allowed%20to%20Delete%20this%20Favorite`)
                }
                
            }else{
                
            }
            
        }
        
        })
        .then(updatedFavorite => {
            res.redirect(`/favorite/${id}`)
        })
        .catch(err => {
            res.redirect(`/error?error=${err}`)
        })
        
})

//********************* Export **********************//
module.exports = router