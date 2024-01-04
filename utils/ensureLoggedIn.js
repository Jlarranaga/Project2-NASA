module.exports = function(req, res, next){ //<-- exporting function directly 
    if(req.isAuthenticated()){ //<-- if the user is logged in they can continue
        return next();
    }else{
        res.redirect('/auth/google'); //<-- if user is not logged in, redirect to log in page
    }
}