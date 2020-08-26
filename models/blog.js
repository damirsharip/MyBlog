var mongoose = require("mongoose")

// MONGOOSE/MODEL CONFIG
var BlogSchema = new mongoose.Schema({
	title: String,
	author: String,
	image: String,
	body: String,
	created: [
		{
		type: Date,
		default: Date.now
		}
	],
	comments: [
		{
		type: mongoose.Schema.Types.ObjectId,
		ref: "Comment"
		}
	]
})

module.exports = mongoose.model("Blog", BlogSchema)