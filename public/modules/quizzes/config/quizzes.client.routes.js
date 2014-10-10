'use strict';


angular.module('quizzes').config(['$stateProvider',
	function($stateProvider) {
		$stateProvider
			.state('listQuizzes',{ 
				url: '/quizzes',
				templateUrl: '/modules/quizzes/views/list-quizzes.client.view.html'
			}).state('createQuiz',{ 
				url: '/quiz/create',
				templateUrl: '/modules/quizzes/views/create-quiz.client.view.html'
			}).state('showQuiz',{ 
				url: '/quiz/:quizId',
				templateUrl: '/modules/quizzes/views/view-quiz.client.view.html'
			});
	}
]);