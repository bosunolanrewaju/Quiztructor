'use strict';

// Load module dependencies
var mongoose = require('mongoose'),
	Score = mongoose.model('Score'),
	errorHandler = require('./errors'),
	_ = require('lodash');

// Inserts Score into its schema
exports.create = function(req, res){
	var scoreEntry = new Score(req.body);
		scoreEntry.quiz = req.param.quizId;
		scoreEntry.user = req.user.id;

		scoreEntry.save(function(err){
			if(err){
				res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				res.jsonp(scoreEntry);
			}
		});
};

// Get the score to a quiz
exports.getScore = function(req, res){
	Score.find({quiz: req.quiz, user: req.user}).select('score').exec(function(err, score){
					if(err){
						res.status(400).send({
							message: errorHandler.getErrorMessage(err)
						});
					} else {
						res.jsonp(score);
					}
				});
};
