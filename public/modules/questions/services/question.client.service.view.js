'use strict';


angular.module('questions').factory('QuestionService', ['$resource', function($resource){
	return $resource('quizzes/:quizId/q/:questionId', 
		{
			quizId: '@quizId',
			questionId: '@questionId'
		} 
		// actions
		);
}]).factory('ProcessQuiz', ['$resource', function($resource){
	return $resource('quizzes/:quizId/process/', 
		{
			quizId: '@quizId'
		} 
		// actions
		);
}]);