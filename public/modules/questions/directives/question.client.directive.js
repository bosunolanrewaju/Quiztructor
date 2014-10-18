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
    	            		if($scope.questionOptions[i] === undefined){
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
	.directive('theQuestions', function($timeout, $modal, ProcessQuiz, $stateParams){
		return {
			restrict: 'E',
			templateUrl: 'modules/questions/views/view-question.client.view.html',
			controller: function($scope){
				
				$scope.markQuiz = function(){
					$scope.userAnswerArray.push(this.userAnswer);

					var result = new ProcessQuiz({
						quizId: $stateParams.quizId,
						userAnswer: $scope.userAnswerArray
					});

					result.$save(function(response){
		    			$scope.response = response;
		    			
		    			var modalInstance = $modal.open({
			                templateUrl: 'modules/quizzes/views/show-quiz-result.client.view.html',
			                controller: 'ShowResultCtrl',
			                size: 'sm',
			                backdrop: 'static',
			                keyboard: false,
			                resolve: {
			                	scores: function(){
			                		return $scope.response ;
			                	}
			                }
			            });	

		    		}, function(error){
		    			console.log(error);
		    		});									
				};
			},
			link: function (scope, element, attr){
				scope.count = 0;
				scope.userAnswer = '';
				scope.done = false;
				scope.userAnswerArray = [];
				
				scope.selected = function(){
					if(scope.count === scope.quiz.questions.length){
						scope.done = true;
					}
				};
				
				scope.getNextQuestion =  function(){

					if(this.userAnswer !== ''){
						scope.userAnswerArray.push(this.userAnswer);
					} else {

					}

					$timeout(function(){
						scope.currentQuestion = scope.quiz.questions[scope.count];
						scope.count++;
					}, 500);
				};

				scope.getNextQuestion(0);
			}
		};
	}).controller('ShowResultCtrl', ['$scope', '$modalInstance', 'scores', '$location', function($scope, $modalInstance, scores, $location ){
		$scope.response = scores;

		$scope.cancel = function () {
        	$modalInstance.dismiss('cancel');
        	$location.path('/quizzes');
   		}; 
	}]);