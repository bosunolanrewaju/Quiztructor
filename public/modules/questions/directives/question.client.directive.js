'use strict';

angular.module('questions')
	.directive('question', function(){
		return{
			restrict: 'E',
			templateUrl: 'modules/questions/views/create-question.client.view.html',
			link: function(scope, element, attr){
				// element
			}
		};
	})
	.directive('questionForm', function($compile, AddOption){
		return{
			restrict: 'E',
			templateUrl: 'modules/questions/views/_create-question-form.client.view.html',
			controller: function($scope){
				$scope.index = 1;
            	$scope.questionOptions = [];

            	$scope.$watch(function(){
            		for (var i = 0; i < $scope.questionOptions.length; i++) {
    	            		if($scope.questionOptions[i] === ''){
    	            			$scope.questionOptions.splice(i, 1);
    	            		}
    	            }
    	        });
				$scope.questionArray = [];
				$scope.answer = '';

        	    $scope.addQuestion = function(){
        	    	if($scope.answer !== ''){
	        	    	var question = {
	        	    		question: $scope.question,
	        	    		questionOptions: $scope.questionOptions,
	        	    		answer: $scope.answer
	        	    	};
	        	    	$scope.questionArray.push(question);
	        	    	$scope.question = '';
	        	    	$scope.questionOptions = [];
	        	    	$scope.answer = '';
        	    	} else {
        	    		alert('You have to select an answer');
        	    	}
        	    };
			},
			link: function(scope, element, attr){
				scope.addOption = function(){
					return AddOption.addOption(scope, $compile);
				};
				scope.removeQuestion = function(index){
					if(confirm('Are you sure you want to delete this question? This action cannot be undone')){
						scope.questionArray.splice(index, 1);
					}
				};
			}
		};
	})
	.directive('theQuestions', function($timeout, $stateParams, ProcessQuiz){
		return {
			restrict: 'E',
			templateUrl: 'modules/questions/views/view-question.client.view.html',
			controller: function($scope){
				$scope.userAnswer = '';
			},
			link: function(scope, element, attr){
				scope.count = 0;
				scope.userAnswerArray = [];
				
				scope.getNextQuestion =  function(){
					if(scope.userAnswer !== ''){
						scope.userAnswerArray.push(scope.userAnswer);
					}

					$timeout(function(){
						scope.currentQuestion = scope.quiz.questions[scope.count];
						scope.count++;
					}, 500);
				};

				scope.getNextQuestion(0);

				scope.markQuiz = function(){
					scope.userAnswerArray.push(scope.userAnswer);
					var result = new ProcessQuiz({
						quizId: $stateParams.quizId,
						userAnswer: scope.userAnswerArray
					});

					result.$save(function(result){
						console.log(result);
					});
				};


			}
		};
	});