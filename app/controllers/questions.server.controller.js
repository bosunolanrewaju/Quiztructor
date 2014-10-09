'use strict';

/*
 * Load Module Dependencies
 */
var mongoose = require('mongoose'),
    Quiz = mongoose.model('Quiz'),
    errorHandler = require('./errors'),
    _ = require('lodash');


// Create a new Question
exports.addQuestion = function(req, res){
    var quiz = req.quiz;
    var question = req.body;
        quiz.questions.push(question);
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

// exports.list = function(req, res){
//     Question.find().exec(function(err, questions){
//         if(err){
//             return res.status(400).send({
//                 message: errorHandler.getErrorMessage(err)
//             });
//         } else {
//             res.jsonp(questions);
//         }
//     });
// };

exports.retrieve = function(req, res){
    res.jsonp(req.question);
};

// exports.update = function(req, res){
//     var question = req.question;
//         question = _.extend(question, req.body);

//         question.save(function(err){
//             if (err){
//                 return res.status(400).send({
//                     message: errorHandler.getErrorMessage(err)
//                 });
//             } else {
//                 res.jsonp(question);
//             }
//         });
// };

exports.delete = function(req, res){
    var quiz = req.quiz;

        quiz.questions.id(req.params.questionId).remove();
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

// Middleware
exports.fetchById = function(req, res, next, id){
    req.question = req.quiz.questions.id(id);
    next();
};