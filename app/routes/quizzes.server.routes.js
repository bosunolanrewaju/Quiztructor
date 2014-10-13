'use strict';

/*
 *  Load Module Dependencies
 */
var user = require('../../app/controllers/users'),
    quizzes = require('../../app/controllers/quizzes'),
    questions = require('../../app/controllers/questions'),
    score = require('../../app/controllers/score');

    module.exports = function(app){

        app.route('/quizzes')
            .get(quizzes.list)
            .post(quizzes.create);

        app.route('/quizzes/:quizId')
            .get(quizzes.retrieve)
            .put(quizzes.edit)
            .delete(quizzes.delete);

        app.route('/quizzes/cat/:category')
            .get(quizzes.retrieve);

        app.route('/quizzes/:quizId/q')
            .get(questions.retrieve)
            .post(questions.addQuestion);

        app.route('/quizzes/:quizId/q/:questionId')
           .get(questions.retrieve)
          //  .put(questions.update)
            .delete(questions.delete);

        app.route('/quizzes/:quizId/score')
            .get(score.getScore)
            .post(score.create);

        app.route('/quizzes/:quizId/process')
            .post(quizzes.processResult);

        app.param('quizId', quizzes.fetchById);
        app.param('category', quizzes.fetchByCategory);
        app.param('questionId', questions.fetchById);
    };