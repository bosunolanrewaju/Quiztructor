'use strict';

/*
 *  Loading Module Dependencies
 */
var mongoose = require('mongoose'),
    Quiz = mongoose.model('Quiz'),
    errorHandler = require('./errors'),
    _ = require('lodash');


/*
 * Create Quiz
 */
exports.create = function(req, res, next){
    
    var quiz = new Quiz(req.body);
        quiz.user = req.user;
    quiz.save(function(err){
        if(err){
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(quiz);
        }
    });
        

};

exports.list = function(req, res){
    Quiz.find().populate('user', 'displayName').select('quizName category description questions _id user').exec(function(err, Quizzes){
        if(err){
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(Quizzes);
        }
    });
};

exports.retrieve = function(req, res){
    res.jsonp(req.quiz);
};

exports.edit =function(req, res){
    var quiz = req.quiz;

    quiz = _.extend(quiz, req.body);

    quiz.save(function(err){
        if(err){
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(quiz);
        }
    });
};


exports.delete = function(req, res){
    var quiz = req.quiz;

        quiz.remove(function(err){
            if(err){
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                res.jsonp(quiz);
            }
        });
};


exports.processResult = function(req, res){
    var userAnswers = req.body.userAnswer,
        id = req.body.quizId,
        correct = 0;

    Quiz.findById(id).select('questions.answer').exec(function(err, ans){
        if(userAnswers.length !== ans.questions.length){
            return new Error('Something went wrong is processing your result');
        } else {
            for(var i = 0; i < userAnswers.length; i++){
                if(userAnswers[i] === ans.questions[i].answer){
                    correct++;
                }
            }

            var response = {
                correctAnswer: correct,
                totalQuestion: userAnswers.length
            };
            res.jsonp(response);
        }
    });
};

// Middleware for fetching quiz by findById
exports.fetchById = function(req, res, next, id){
    Quiz.findById(id).populate('user', 'displayName').select('quizName category description questions.question questions.questionOptions questions._id user').exec(function(err, quiz){
        if(err) return next(err);
        if(!quiz) return next(new Error('No quiz found with the id: ' + id));
        req.quiz = quiz;
        next();
    });
};
exports.fetchByCategory = function(req, res, next, description){
    Quiz.find().populate('user', 'displayName').where('description').equals(description).select('quizName user').exec(function(err, quiz){
        if(err) return next(err);
        if(!quiz) return next(new Error('No quiz found with the description: ' + description));
        req.quiz = quiz;
        next();
    });
};

