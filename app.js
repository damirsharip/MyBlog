var express = require("express"),
	bodyParser = require("body-parser"),
	mongoose = require("mongoose"),
	methodOverride = require("method-override"),
	moment = require('moment'),
	passport = require("passport"),
	LocalStrategy = require("passport-local"),
	Comment = require("./models/comment"),
	Blog = require("./models/blog"),
	expressSanitizer = require("express-sanitizer"),
	User = require("./models/user"),
	app = express(),
	seedDB = require("./seeds")

var dateTime = moment().format('YYYY-MM-DD');
var dateTime2 = moment().subtract(10, 'days').calendar()


// APP CONFIG
mongoose.connect('mongodb://localhost:27017/blogv1', { useNewUrlParser: true, useUnifiedTopology: true}); 
app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({extended: true}))
app.use(expressSanitizer())
app.use(express.static("public"))
app.use(methodOverride("_method"))
seedDB(); 

app.use(require("express-session")({
	secret: "once again dog in the world",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	next();
});

// RESTful routes 
app.get("/", function(req, res){
	res.redirect("/blogs/new")
})

// INDEX ROUTE
app.get("/blogs", function(req, res){
	Blog.find({}, function(err, blogs){
		if(err){
			console.log(err)
		} else {
			res.render("index", {blogs:blogs})
		}
	})
})

//NEW ROUTE 
app.get("/blogs/new", function(req,res){
	res.render("blogs/new")
})

//CREATE ROUTE
app.post("/blogs", function(req, res){
	// CREATE BLOG
	Blog.create(req.body.blog, function(err, newBlog){
		if (err){
			res.render("blogs/new")
		} else {
			// THEN REDIRECT
			res.redirect("/blogs/" + newBlog._id)
		}
	})
	
})

// SHOW ROUTE
app.get("/blogs/:id", function(req, res){
	Blog.findById(req.params.id).populate("comments").exec(function(err, foundblog){
		// if(err){
		// 	res.redirect("/blogs")
		// } else {
			console.log(foundblog)
			//render show template with that blog
			res.render("blogs/show", {blog: foundblog})
		}
	//}
					  )
})

// EDIT ROUTE
app.get("/blogs/:id/edit", function(req, res){
	Blog.findById(req.params.id, function(err,foundblog){
		if(err){
			res.redirect("/blogs/:id")
		} else {
			res.render("blogs/edit", {blog: foundblog})
		}
	})
})

// UPDATE ROUTE
app.put("/blogs/:id", function(req, res){
		console.log(req.body)
	req.body.blog.body = req.sanitize(req.body.blog.body)
	console.log("=====")
	console.log(req.body)
	Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
		if(err){
			console.log(err)
		} else {
			res.redirect("/blogs/" + req.params.id)
		}
	})
})

// DELETE ROUTE
app.delete("/blogs/:id", function(req, res){
	Blog.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/blogs")
		} else {
			res.redirect("/blogs")
		}
	})
})

//================
// COMMENTS ROUTES
//================

app.get("/blogs/:id/comments/new",isLoggedIn, function(req, res){
	Blog.findById(req.params.id, function(err, blog){
		if (err){
			console.log(err)
		} else {
			res.render("comments/new", {blog: blog})
		}
	})
})


app.post("/blogs/:id/comments",isLoggedIn, function(req, res){
   //lookup campground using ID
   Blog.findById(req.params.id, function(err, campground){
       if(err){
           console.log(err);
           res.redirect("/blogs");
       } else {
        Comment.create(req.body.comment, function(err, comment){
           if(err){
               console.log(err);
           } else {
               campground.comments.push(comment);
               campground.save();
               res.redirect('/blogs/' + campground._id);
           }
        });
       }
   });
   //create new comment
   //connect new comment to campground
   //redirect campground show page
});

//=============
//Auth route
//=============

	// shou register
app.get("/register", function(req, res){
	res.render("register")
})
//handling user to sign handling
app.post("/register", function(req, res){
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, function(err, user){
		if(err){
			console.log(err);
			return res.render("register")
		}
		passport.authenticate("local")(req, res, function(){
			res.redirect("/blogs")
		})
	})
})
// // LOGIN ROUTES
// // render login form
app.get("/login", function(req, res){
	res.render("login")
})
// // LOGIN LOGIC
// // middleware
app.post("/login", passport.authenticate("local", 
	{
		succesRedirect: "/blogs",
		failureRedirect: "/login"
	}), function(req, res){
	res.redirect("/blogs")
})

app.get("/logout", function(req, res){
	req.logout();
	res.redirect("/blogs")
})

function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login")
}




// app.post("blogs/:id/comments", function(req, res){
// 	Blog.findById(req.params.id, function(err, blog){
// 		if (err){
// 			console.log(err)
// 		} else {
// 			Comment.create(req.body.comments, function(err, comment){
// 				if(err){
// 					console.log(err)
// 				} else {
// 					blog.comments.push(comment)
// 					blog.save()
// 					res.redirect("/blogs/" + blog._id)
// 				}
// 			})
// 		}
// 	})
// })

app.listen(process.env.PORT || 3000, process.env.IP, function(){
	console.log("The server has started!!!");
})