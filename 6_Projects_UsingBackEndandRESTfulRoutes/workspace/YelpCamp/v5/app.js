var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Campground = require("./models/campground"); // need module.exports for this to work
var Comment = require("./models/comment");
var seedDB = require("./seeds"); // the function will be stored in seedDB




mongoose.connect("mongodb://localhost/yelp_camp_v5");
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname+"/public"))
seedDB() ; // this will execute the seedDB function 


app.get("/", function(req,res){
    res.render("landing");
});
        
//INDEX - show all campgrounds       
app.get('/campgrounds', function(req,res){
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        } else{
            res.render("campgrounds/index",{campgrounds:allCampgrounds})
        }
        
    })
    // res.render("campgrounds", {campgrounds:campgrounds});
    
    
});

//CREATE - add new campground to DB

app.post("/campgrounds", function(req,res){
    var name = req.body.name;
    var img = req.body.image;
    var desc = req.body.description;
    var newCampground = {name:name, image:img, description:desc};
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
app.get("/campgrounds/new", function(req,res){
    res.render("campgrounds/new");
});


// SHOW - shows more info about one campground
app.get("/campgrounds/:id", function(req, res){
    //find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            // console.log(foundCampground);
            //render show template with that campground
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
})
///=================
//comments routes
//==================

app.get("/campgrounds/:id/comments/new", function(req,res){
    //find campground by id
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {campground: campground});
        }
    })
})

app.post("/campgrounds/:id/comments", function(req,res){
    //look up campground using id
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                } else {
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect('/campgrounds/'+campground._id);
                }
            })
        }
    });
})

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The YelpCamp server has started");
});