'use strict';


angular.module('quizzes').controller('QuizController', ['$scope', 'QuizService', '$stateParams', '$location', 'Authentication', 'QuestionService', function($scope, QuizService, $stateParams, $location, Authentication, QuestionService){
    $scope.user = Authentication.user;

        // Create Quiz Function
        $scope.createQuiz = function(){
            
            var quiz = new QuizService({
                quizName: this.quizName,
                category: this.category
            });
            quiz.$save(function(response){
                $scope.quizId = response._id;
                for (var j = 0; j < $scope.questionOptions.length; j++) {
                        if($scope.questionOptions[j] === undefined){
                            $scope.questionOptions.splice(j, 1);
                        }
                    }
            for (var i = 0; i < $scope.questionArray.length; i++) {
                var question =  new QuestionService({
                    quizId: response._id,
                    question: $scope.questionArray[i].question,
                    questionOptions: $scope.questionArray[i].questionOptions,
                    answer: $scope.questionArray[i].answer
                });
                question.$save();
                $scope.done = true;
            }
                
                $scope.$watch(function(){
                    if($scope.done){
                        $location.path('/quiz/' + $scope.quizId);
                    }
                });

                // question.$save(function(response){
                //     $location.path('/quiz/' + response._id);
                //     $scope.quizName = '';
                //     $scope.category = '';
                // });

                
            }, function(errorResponse){
                $scope.error = errorResponse.data.message;
            });
        };

        // Retrieves Quiz
        $scope.getQuiz = function(){
            $scope.quiz = QuizService.get({ quizId: $stateParams.quizId },
                function(response){
                    // Check if curent user is the quiz author
                    if($scope.quiz.user._id === $scope.user._id){
                        $scope.isAuthor = true;
                    }
                }, function(err){
                    console.log(err);
                });            
        };

        // Retrieves Quiz
        $scope.listQuizzes = function(){
            $scope.quizzes = QuizService.query();
        };

}]);