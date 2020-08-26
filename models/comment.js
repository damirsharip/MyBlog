var mongoose = require("mongoose")

var commentSchema = new mongoose.Schema({
	text: String,
	author1: String
})

module.exports = mongoose.model("Comment", commentSchema)