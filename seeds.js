var mongoose = require("mongoose"),
	Comment  = require("./models/comment"),
	Blog = require("./models/blog")

var seeds = [
	{
	title: "blog1",
	author: "damirsharip",
	image: "https://images.pexels.com/photos/2820885/pexels-photo-2820885.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
	body: "blah blah blah"
	},
	{
	title: "blog2",
	author: "damirsharip",
	image: "https://images.pexels.com/photos/4717879/pexels-photo-4717879.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
	body: "blah blah blah"
	},
	{
	title: "blog3",
	author: "damirsharip",
	image: "https://images.pexels.com/photos/3028448/pexels-photo-3028448.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
	body: "blah blah blah"
	}
]

async function seedDB(){
   //Remove all campgrounds
	await Blog.remove({});
	console.log("Blogs removed");
	await Comment.remove({});
	console.log("Comments removed");
	for(const seed of seeds) {
		 let blog = await Blog.create(seed)
		 console.log("Blog created");
		 let comment = await Comment.create(
                {
					text: "This place is great, but I wish there were an internet",
					author1: "Homer"
				}
			)
		console.log("comment created");
		blog.comments.push(comment);
        blog.save();
        console.log("Comment added to blog");
       }
	}
//              //add a few campgrounds
//             seeds.forEach(function(seed){
//                 Blog.create(seed, function(err, Blog){
//                     if(err){
//                         console.log(err)
//                     } else {
//                         console.log("added a campground");
//                         //create a comment
//                         Comment.create(
//                             {
//                                 text: "This place is great, but I wish there were an internet",
//                                 author1: "Homer"
//                             }, function(err, comment){
//                                 if(err){
//                                     console.log(err);
//                                 } else {
//                                     Blog.comments.push(comment);
//                                     Blog.save();
//                                     console.log("Created new comment");
//                                 }
//                             });
//                     }
//                 });
//             });
//         });
// //     }); 
//  }


module.exports = seedDB;
