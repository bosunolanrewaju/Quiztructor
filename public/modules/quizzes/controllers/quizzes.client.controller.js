'use strict';


angular.module('quizzes').controller('QuizController', ['$scope', 'QuizService', '$stateParams', '$location', function($scope, QuizService, $stateParams, $location){

		// Create Quiz Function
		$scope.createQuiz = function(){
			var quiz = new QuizService({
				quizName: this.quizName,
				category: this.category
			});
			quiz.$save(function(response){
				$location.path('/quiz/' + response._id);

				$scope.quizName = '';
				$scope.category = '';
			}, function(errorResponse){
				$scope.error = errorResponse.data.message;
			});
		};

		// Retrieves Quiz
		$scope.getQuiz = function(){
			$scope.quiz = QuizService.get({ quizId: $stateParams.quizId },
				function(response){
					console.log($scope.response);
				}, function(err){
					console.log(err);
				});
			
		};

		// Retrieves Quiz
		$scope.listQuizzes = function(){
			$scope.quizzes = QuizService.query();
		};
}]);