'use strict';

/*
 *  Load Module Dependencies
 */
var user = require('../../app/controllers/users'),
    quizzes = require('../../app/controllers/quizzes'),
    questions = require('../../app/controllers/questions'),
    score = require('../../app/controllers/score');

    module.exports = function(app){

        app.route('/quiz')
            .get(quizzes.list)
            .post(quizzes.create);

        app.route('/quiz/:quizId')
            .get(quizzes.retrieve)
            .put(quizzes.edit)
            .delete(quizzes.delete);

        app.route('/quiz/cat/:category')
            .get(quizzes.retrieve);

        app.route('/quiz/:quizId/q')
            .get(questions.retrieve)
            .post(questions.addQuestion);

        app.route('/quiz/:quizId/q/:questionId')
           .get(questions.retrieve)
          //  .put(questions.update)
            .delete(questions.delete);

        app.route('/quiz/:quizId/score')
            .get(score.getScore)
            .post(score.create);

        app.param('quizId', quizzes.fetchById);
        app.param('category', quizzes.fetchByCategory);
        app.param('questionId', questions.fetchById);
    };