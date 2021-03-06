var Campground = require("../models/campground");
var Comment = require("../models/comment");
// all of the middleware goes shere
var middlewareObj = {};

middlewareObj.checkCampgroundOwnership= function(req,res, next){
        if(req.isAuthenticated()){

        Campground.findById(req.params.id, function(err,foundCampground){
        if(err){
            req.flash("error", "Campground not found" )
            res.redirect("back");
        } else {
            // does the user own the campground
            //if(foundCampground.author.id.equals(req.user._id)){
            if(foundCampground.author.id.equals(req.user._id)){
                 next();
            }else {
                req.flash("error", "You don't have permission to do that" )
                res.redirect("back");
            }
            
           
        }
    });
    } else {
        req.flash("error", "You don't have permission to do that" )
       res.redirect("back");
    }

}

middlewareObj.checkCommentOwnership=  function(req, res, next){
        if(req.isAuthenticated()){

        Comment.findById(req.params.comment_id, function(err,foundComment){
        if(err){
            req.flash("error", "comment not found" )
            res.redirect("back");
        } else {
            // does the user own the comment
            //if(foundCampground.author.id.equals(req.user._id)){
            if(foundComment.author.id.equals(req.user._id)){
                 next();
            }else {
                req.flash("error", "You don't have permission to do that" )
                res.redirect("back");
            }
            
           
        }
    });
    } else {
       req.flash("error", "You need to be logged in to do that");  
       res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function(req,res,next){
    
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that");  // flash on the next page; key error, value is please log in first!
                                                // need it before redirect - still need to handle it on route. 
    res.redirect("/login");

}



module.exports = middlewareObj;