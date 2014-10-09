'use strict';

// Loading modules dependencies
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;


	/*
	 *	Question (children) Schema
	 */
var QuestionSchema = new Schema({
	question: {
		type: String,
		trim: true,
		default: '',
		required: 'Question field cannot be empty'
	},
	questionOptions: [{
		type: String,
		required: 'At least, one option must be filled'
	}],
	answer: {
		type: String,
		trim: true,
		default: '',
		required: 'You have to supply an answer as option to the question'
	}
});


	/*
	 *	Quiz(parent) Schema
	 */
var QuizSchema = new Schema({
	quizName: {
		type: String,
		default: '',
		trim: true,
		required: 'Quiz title cannot be empty',
	},
	category: {
		type: String,
		default: 'Uncategorized',
		trim: true
	},
	questions: [QuestionSchema],

	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}

});

mongoose.model('Quiz', QuizSchema);