'use strict';

// Load module dependencies
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;


var ScoreSchema = new Schema({
	quiz: {
		type: Schema.ObjectId,
		ref: 'Quiz'
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	score: {
		type: Number,
		default: '',
		required: 'Score has not been cumputed'
	}
});

mongoose.model('Score', ScoreSchema);