'use strict';


angular.module('questions').factory('QuestionService', ['$resource', function($resource){
	return $resource('quizzes/:quizId/q/', 
		{
			quizId: '@quizId'
		} 
		// actions
		);
}]);