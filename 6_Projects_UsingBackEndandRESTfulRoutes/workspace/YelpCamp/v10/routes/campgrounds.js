var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware") // dont have to do index.js

//INDEX - show all campgrounds       
router.get('/', function(req,res){
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        } else{
            res.render("campgrounds/index",{campgrounds:allCampgrounds})
        }
        
    });
});

//CREATE - add new campground to DB
router.post("/", middleware.isLoggedIn, function(req,res){
    var name = req.body.name;
    var img = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username //// ask
    }
    var newCampground = {name:name, image:img, description:desc, author:author };
    Campground.create(newCampground, function(err,newlyCreated ){
        if(err){
            console.log(err);
        }else{
        res.redirect('/campgrounds');
            
        }
        
    });
      //why can't i use render?
    // get data from form and add to camground array
    // rediret back to camground oage
    
});


//NEW - show form to create new campground
router.get("/new", middleware.isLoggedIn, function(req,res){
    res.render("campgrounds/new");
});


// SHOW - shows more info about one campground
router.get("/:id", function(req, res){
    //find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            console.log(foundCampground);
            //render show template with that campground
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
})

//edit campground route
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req,res){

        Campground.findById(req.params.id, function(err,foundCampground){
                 res.render("campgrounds/edit", {campground: foundCampground});
            });

});


//update campground route
router.put("/:id", middleware.checkCampgroundOwnership, function(req,res){
    // find and update correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
        
    });
});

// destroy campground route
router.delete("/:id", middleware.checkCampgroundOwnership, function(req,res){
    // console.log("AAAAA");
    // console.log(req);
    // console.log("BBBBB");
    // console.log(req.body);
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    })
})

//middleware
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}



module.exports = router;