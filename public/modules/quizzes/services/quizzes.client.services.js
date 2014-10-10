'use strict';

angular.module('quizzes').factory('QuizService', ['$resource', 
    function($resource){
        return $resource('quizzes/:quizId', 
            { 
                quizId: '@_id'
            }, 
            {
                update: {
                    method: 'PUT'
                }
            });
    }
]);