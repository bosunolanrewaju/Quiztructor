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
]).factory('AddOption', function(){
    return {
        addOption: function(scope, compile){
            scope.index++;
            console.log(scope.index);
            angular.element(document.getElementById('optionDiv')).append(compile('<tr><td><div class="form-group"><div class="col-md-12"><input class="form-control" type="text" name="option" data-ng-model="questionOptions[' + scope.index + ']" placeholder="option ' + (scope.index + 1) + '"></div></div></td><td><input type="radio" name="optionanswer" value="{{questionOptions[' + scope.index + ']}}" data-ng-model="answer"><br></td></tr>')(scope));
        }
    };
});