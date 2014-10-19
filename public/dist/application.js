'use strict';
// Init the application configuration module for AngularJS application
var ApplicationConfiguration = function () {
    // Init module configuration options
    var applicationModuleName = 'quiztructor';
    var applicationModuleVendorDependencies = [
        'ngResource',
        'ngCookies',
        'ngAnimate',
        'ngTouch',
        'ngSanitize',
        'ui.router',
        'ui.bootstrap',
        'ui.utils'
      ];
    // Add a new vertical module
    var registerModule = function (moduleName, dependencies) {
      // Create angular module
      angular.module(moduleName, dependencies || []);
      // Add the module to the AngularJS configuration file
      angular.module(applicationModuleName).requires.push(moduleName);
    };
    return {
      applicationModuleName: applicationModuleName,
      applicationModuleVendorDependencies: applicationModuleVendorDependencies,
      registerModule: registerModule
    };
  }();'use strict';
//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);
// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config([
  '$locationProvider',
  function ($locationProvider) {
    $locationProvider.hashPrefix('!');
  }
]);
//Then define the init function for starting up the application
angular.element(document).ready(function () {
  //Fixing facebook bug with redirect
  if (window.location.hash === '#_=_')
    window.location.hash = '#!';
  //Then init the app
  angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});'use strict';
// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('core');'use strict';
ApplicationConfiguration.registerModule('questions');'use strict';
// Register a new module using Application Configuration module
ApplicationConfiguration.registerModule('quizzes');'use strict';
// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('users');'use strict';
// Setting up route
angular.module('core').config([
  '$stateProvider',
  '$urlRouterProvider',
  function ($stateProvider, $urlRouterProvider) {
    // Redirect to home view when route not found
    $urlRouterProvider.otherwise('/');
    // Home state routing
    $stateProvider.state('home', {
      url: '/',
      templateUrl: 'modules/core/views/home.client.view.html'
    });
  }
]);'use strict';
window.fbAsyncInit = function () {
  FB.init({
    appId: '351073508400675',
    xfbml: true,
    version: 'v2.1'
  });
  FB.login(function () {
    FB.api('/me/feed', 'post', { message: 'Hey guys! I just posted a quiz on quiztructor online quiz app' });
  }, { scope: 'publish_actions' });
};
(function (d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) {
    return;
  }
  js = d.createElement(s);
  js.id = id;
  js.src = '//connect.facebook.net/en_US/sdk.js';
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));'use strict';
angular.module('core').controller('HeaderController', [
  '$scope',
  'Authentication',
  'Menus',
  '$location',
  function ($scope, Authentication, Menus, $location) {
    $scope.authentication = Authentication;
    $scope.isCollapsed = false;
    $scope.menu = Menus.getMenu('topbar');
    $scope.toggleCollapsibleMenu = function () {
      $scope.isCollapsed = !$scope.isCollapsed;
    };
    // Collapsing the menu after navigation
    $scope.$on('$stateChangeSuccess', function () {
      $scope.isCollapsed = false;
    });
    // Check if page is not home
    $scope.isNotHome = function (route) {
      return route !== $location.path();
    };
  }
]);'use strict';
angular.module('core').controller('HomeController', [
  '$scope',
  'Authentication',
  '$window',
  '$location',
  function ($scope, Authentication, $window, $location) {
    // This provides Authentication context.
    $scope.authentication = Authentication;
    // Gets the height of the screen
    $scope.screenHeight = function () {
      return $window.innerHeight + 'px';
    };
  }
]);'use strict';
//Menu service used for managing  menus
angular.module('core').service('Menus', [function () {
    // Define a set of default roles
    this.defaultRoles = ['*'];
    // Define the menus object
    this.menus = {};
    // A private function for rendering decision 
    var shouldRender = function (user) {
      if (user) {
        if (!!~this.roles.indexOf('*')) {
          return true;
        } else {
          for (var userRoleIndex in user.roles) {
            for (var roleIndex in this.roles) {
              if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
                return true;
              }
            }
          }
        }
      } else {
        return this.isPublic;
      }
      return false;
    };
    // Validate menu existance
    this.validateMenuExistance = function (menuId) {
      if (menuId && menuId.length) {
        if (this.menus[menuId]) {
          return true;
        } else {
          throw new Error('Menu does not exists');
        }
      } else {
        throw new Error('MenuId was not provided');
      }
      return false;
    };
    // Get the menu object by menu id
    this.getMenu = function (menuId) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Return the menu object
      return this.menus[menuId];
    };
    // Add new menu object by menu id
    this.addMenu = function (menuId, isPublic, roles) {
      // Create the new menu
      this.menus[menuId] = {
        isPublic: isPublic || false,
        roles: roles || this.defaultRoles,
        items: [],
        shouldRender: shouldRender
      };
      // Return the menu object
      return this.menus[menuId];
    };
    // Remove existing menu object by menu id
    this.removeMenu = function (menuId) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Return the menu object
      delete this.menus[menuId];
    };
    // Add menu item object
    this.addMenuItem = function (menuId, menuItemTitle, menuItemURL, menuItemType, menuItemUIRoute, isPublic, roles, position) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Push new menu item
      this.menus[menuId].items.push({
        title: menuItemTitle,
        link: menuItemURL,
        menuItemType: menuItemType || 'item',
        menuItemClass: menuItemType,
        uiRoute: menuItemUIRoute || '/' + menuItemURL,
        isPublic: isPublic === null || typeof isPublic === 'undefined' ? this.menus[menuId].isPublic : isPublic,
        roles: roles === null || typeof roles === 'undefined' ? this.menus[menuId].roles : roles,
        position: position || 0,
        items: [],
        shouldRender: shouldRender
      });
      // Return the menu object
      return this.menus[menuId];
    };
    // Add submenu item object
    this.addSubMenuItem = function (menuId, rootMenuItemURL, menuItemTitle, menuItemURL, menuItemUIRoute, isPublic, roles, position) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Search for menu item
      for (var itemIndex in this.menus[menuId].items) {
        if (this.menus[menuId].items[itemIndex].link === rootMenuItemURL) {
          // Push new submenu item
          this.menus[menuId].items[itemIndex].items.push({
            title: menuItemTitle,
            link: menuItemURL,
            uiRoute: menuItemUIRoute || '/' + menuItemURL,
            isPublic: isPublic === null || typeof isPublic === 'undefined' ? this.menus[menuId].items[itemIndex].isPublic : isPublic,
            roles: roles === null || typeof roles === 'undefined' ? this.menus[menuId].items[itemIndex].roles : roles,
            position: position || 0,
            shouldRender: shouldRender
          });
        }
      }
      // Return the menu object
      return this.menus[menuId];
    };
    // Remove existing menu object by menu id
    this.removeMenuItem = function (menuId, menuItemURL) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Search for menu item to remove
      for (var itemIndex in this.menus[menuId].items) {
        if (this.menus[menuId].items[itemIndex].link === menuItemURL) {
          this.menus[menuId].items.splice(itemIndex, 1);
        }
      }
      // Return the menu object
      return this.menus[menuId];
    };
    // Remove existing menu object by menu id
    this.removeSubMenuItem = function (menuId, submenuItemURL) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Search for menu item to remove
      for (var itemIndex in this.menus[menuId].items) {
        for (var subitemIndex in this.menus[menuId].items[itemIndex].items) {
          if (this.menus[menuId].items[itemIndex].items[subitemIndex].link === submenuItemURL) {
            this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
          }
        }
      }
      // Return the menu object
      return this.menus[menuId];
    };
    //Adding the topbar menu
    this.addMenu('topbar');
  }]);'use strict';
angular.module('questions').directive('question', function () {
  return {
    restrict: 'E',
    templateUrl: 'modules/questions/views/create-question.client.view.html',
    link: function (scope, element, attr) {
    }
  };
}).directive('questionForm', [
  '$compile',
  'AddOption',
  function ($compile, AddOption) {
    return {
      restrict: 'E',
      templateUrl: 'modules/questions/views/_create-question-form.client.view.html',
      controller: [
        '$scope',
        function ($scope) {
          $scope.index = 1;
          $scope.questionOptions = [];
          $scope.$watch(function () {
            for (var i = 0; i < $scope.questionOptions.length; i++) {
              if ($scope.questionOptions[i] === undefined) {
                $scope.questionOptions.splice(i, 1);
              }
            }
          });
          $scope.questionArray = [];
          $scope.answer = '';
          $scope.addQuestion = function () {
            if ($scope.answer !== '') {
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
        }
      ],
      link: function (scope, element, attr) {
        scope.addOption = function () {
          return AddOption.addOption(scope, $compile);
        };
        scope.removeQuestion = function (index) {
          if (confirm('Are you sure you want to delete this question? This action cannot be undone')) {
            scope.questionArray.splice(index, 1);
          }
        };
      }
    };
  }
]).directive('theQuestions', [
  '$timeout',
  '$modal',
  'ProcessQuiz',
  '$stateParams',
  function ($timeout, $modal, ProcessQuiz, $stateParams) {
    return {
      restrict: 'E',
      templateUrl: 'modules/questions/views/view-question.client.view.html',
      controller: [
        '$scope',
        function ($scope) {
          $scope.markQuiz = function () {
            $scope.userAnswerArray.push(this.userAnswer);
            var result = new ProcessQuiz({
                quizId: $stateParams.quizId,
                userAnswer: $scope.userAnswerArray
              });
            result.$save(function (response) {
              $scope.response = response;
              var modalInstance = $modal.open({
                  templateUrl: 'modules/quizzes/views/show-quiz-result.client.view.html',
                  controller: 'ShowResultCtrl',
                  size: 'sm',
                  backdrop: 'static',
                  keyboard: false,
                  resolve: {
                    scores: function () {
                      return $scope.response;
                    }
                  }
                });
            }, function (error) {
              console.log(error);
            });
          };
        }
      ],
      link: function (scope, element, attr) {
        scope.count = 0;
        scope.userAnswer = '';
        scope.done = false;
        scope.userAnswerArray = [];
        scope.selected = function () {
          if (scope.count === scope.quiz.questions.length) {
            scope.done = true;
          }
        };
        scope.getNextQuestion = function () {
          if (this.userAnswer !== '') {
            scope.userAnswerArray.push(this.userAnswer);
          } else {
          }
          $timeout(function () {
            scope.currentQuestion = scope.quiz.questions[scope.count];
            scope.count++;
          }, 500);
        };
        scope.getNextQuestion(0);
      }
    };
  }
]).controller('ShowResultCtrl', [
  '$scope',
  '$modalInstance',
  'scores',
  '$location',
  function ($scope, $modalInstance, scores, $location) {
    $scope.response = scores;
    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
      $location.path('/quizzes');
    };
  }
]);'use strict';
angular.module('questions').factory('QuestionService', [
  '$resource',
  function ($resource) {
    return $resource('quizzes/:quizId/q/:questionId', {
      quizId: '@quizId',
      questionId: '@questionId'
    });
  }
]).factory('ProcessQuiz', [
  '$resource',
  function ($resource) {
    return $resource('quizzes/:quizId/process', { quizId: '@quizId' });
  }
]);'use strict';
angular.module('quizzes').config([
  '$stateProvider',
  function ($stateProvider) {
    $stateProvider.state('listQuizzes', {
      url: '/quizzes',
      templateUrl: '/modules/quizzes/views/list-quizzes.client.view.html'
    }).state('createQuiz', {
      url: '/quiz/create',
      templateUrl: '/modules/quizzes/views/create-quiz.client.view.html'
    }).state('showQuiz', {
      url: '/quiz/:quizId',
      templateUrl: '/modules/quizzes/views/view-quiz.client.view.html'
    });
  }
]);'use strict';
angular.module('quizzes').controller('QuizController', [
  '$scope',
  'QuizService',
  '$stateParams',
  '$location',
  'Authentication',
  'QuestionService',
  '$modal',
  function ($scope, QuizService, $stateParams, $location, Authentication, QuestionService, $modal) {
    $scope.user = Authentication.user;
    // Create Quiz Function
    $scope.createQuiz = function () {
      var quiz = new QuizService({
          quizName: this.quizName,
          description: this.description
        });
      quiz.$save(function (response) {
        $scope.quizId = response._id;
        for (var j = 0; j < $scope.questionOptions.length; j++) {
          if ($scope.questionOptions[j] === undefined) {
            $scope.questionOptions.splice(j, 1);
          }
        }
        for (var i = 0; i < $scope.questionArray.length; i++) {
          var question = new QuestionService({
              quizId: response._id,
              question: $scope.questionArray[i].question,
              questionOptions: $scope.questionArray[i].questionOptions,
              answer: $scope.questionArray[i].answer
            });
          question.$save();
          $scope.done = true;
        }
        $scope.$watch(function () {
          if ($scope.done) {
            $location.path('/quiz/' + $scope.quizId);
          }
        });
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };
    // Retrieves Quiz
    $scope.getQuiz = function () {
      $scope.quiz = QuizService.get({ quizId: $stateParams.quizId }, function (response) {
        // Check if curent user is the quiz author
        if ($scope.quiz.user && $scope.user) {
          if ($scope.quiz.user._id === $scope.user._id) {
            $scope.isAuthor = true;
          }
        }
      }, function (err) {
        console.log(err);
      });
    };
    // Retrieves Quizzes
    $scope.listQuizzes = function () {
      $scope.quizzes = QuizService.query();
    };
    // Removes quiz and deletes from schema
    $scope.removeQuiz = function () {
      if (confirm('Are you sure you want to delete this quiz? This action cannot be undone!')) {
        $scope.quiz.$remove(function () {
          $location.path('quizzes');
        });
      }
    };
    // Removes question from quiz and also deletes from schema
    $scope.remove = function (quiz) {
      if (confirm('Are you sure you want to delete this question? This action cannot be undone!')) {
        var question = $scope.quiz.questions[this.$index];
        $scope.quiz.questions.splice(this.$index, 1);
        QuestionService.delete({
          quizId: $stateParams.quizId,
          questionId: question._id
        }, {}, function (response) {
        }, function (error) {
        });
      }
    };
    // Load add-question modal form
    $scope.loadForm = function () {
      var modalInstance = $modal.open({
          templateUrl: 'modules/questions/views/_add-question-form.client.view.html',
          controller: 'LoadFormCtrl',
          resolve: {
            question: function () {
              return {
                question: $scope.question,
                questionOptions: $scope.questionOptions,
                answer: $scope.answer
              };
            }
          }
        });
    };
    // Load edit-quiz modal form
    $scope.editQuiz = function () {
      var modalInstance = $modal.open({
          templateUrl: 'modules/quizzes/views/_edit-quiz-form.client.view.html',
          controller: 'LoadEditQuizFormCtrl',
          size: '',
          resolve: {
            question: function () {
              return {
                quizName: $scope.quizName,
                description: $scope.description
              };
            }
          }
        });
    };
    // Starts quiz
    $scope.takeQuiz = function () {
      $scope.takethequiz = true;
    };
    $scope.share = function () {
      FB.ui({
        method: 'share',
        href: 'https://developers.facebook.com/docs/'
      }, function (response) {
      });
    };
  }
]).controller('LoadFormCtrl', [
  '$scope',
  '$window',
  'AddOption',
  '$compile',
  '$stateParams',
  'QuestionService',
  '$modalInstance',
  function ($scope, $window, AddOption, $compile, $stateParams, QuestionService, $modalInstance) {
    $scope.index = 1;
    $scope.addOption = function () {
      return AddOption.addOption($scope, $compile);
    };
    $scope.questionOptions = [];
    $scope.postQuestion = function () {
      var questionObj = new QuestionService({
          quizId: $stateParams.quizId,
          question: $scope.question,
          questionOptions: $scope.questionOptions,
          answer: $scope.answer
        });
      questionObj.$save(function (response) {
        $window.location.reload();
      });
    };
    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  }
]).controller('LoadEditQuizFormCtrl', [
  '$scope',
  'QuizService',
  '$modalInstance',
  '$window',
  '$stateParams',
  function ($scope, QuizService, $modalInstance, $window, $stateParams) {
    $scope.quiz = QuizService.get({ quizId: $stateParams.quizId });
    $scope.postQuiz = function () {
      var quiz = $scope.quiz;
      quiz.$update(function () {
        $window.location.reload();
      }, function (error) {
      });
    };
    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  }
]);'use strict';
angular.module('quizzes').factory('QuizService', [
  '$resource',
  function ($resource) {
    return $resource('quizzes/:quizId', { quizId: '@_id' }, { update: { method: 'PUT' } });
  }
]).factory('AddOption', function () {
  return {
    addOption: function (scope, compile) {
      scope.index++;
      console.log(scope.index);
      angular.element(document.getElementById('optionDiv')).append(compile('<tr><td><div class="form-group"><div class="col-md-12"><input class="form-control" type="text" name="option" data-ng-model="questionOptions[' + scope.index + ']" placeholder="option ' + (scope.index + 1) + '" required></div></div></td><td><input type="radio" name="optionanswer" value="{{questionOptions[' + scope.index + ']}}" data-ng-model="answer"><br></td></tr>')(scope));
    }
  };
});'use strict';
// Config HTTP Error Handling
angular.module('users').config([
  '$httpProvider',
  function ($httpProvider) {
    // Set the httpProvider "not authorized" interceptor
    $httpProvider.interceptors.push([
      '$q',
      '$location',
      'Authentication',
      function ($q, $location, Authentication) {
        return {
          responseError: function (rejection) {
            switch (rejection.status) {
            case 401:
              // Deauthenticate the global user
              Authentication.user = null;
              // Redirect to signin page
              $location.path('signin');
              break;
            case 403:
              // Add unauthorized behaviour 
              break;
            }
            return $q.reject(rejection);
          }
        };
      }
    ]);
  }
]);'use strict';
// Setting up route
angular.module('users').config([
  '$stateProvider',
  function ($stateProvider) {
    // Users state routing
    $stateProvider.state('profile', {
      url: '/settings/profile',
      templateUrl: 'modules/users/views/settings/edit-profile.client.view.html'
    }).state('password', {
      url: '/settings/password',
      templateUrl: 'modules/users/views/settings/change-password.client.view.html'
    }).state('accounts', {
      url: '/settings/accounts',
      templateUrl: 'modules/users/views/settings/social-accounts.client.view.html'
    }).state('signup', {
      url: '/signup',
      templateUrl: 'modules/users/views/authentication/signup.client.view.html'
    }).state('signin', {
      url: '/signin',
      templateUrl: 'modules/users/views/authentication/signin.client.view.html'
    }).state('forgot', {
      url: '/password/forgot',
      templateUrl: 'modules/users/views/password/forgot-password.client.view.html'
    }).state('reset-invlaid', {
      url: '/password/reset/invalid',
      templateUrl: 'modules/users/views/password/reset-password-invalid.client.view.html'
    }).state('reset-success', {
      url: '/password/reset/success',
      templateUrl: 'modules/users/views/password/reset-password-success.client.view.html'
    }).state('reset', {
      url: '/password/reset/:token',
      templateUrl: 'modules/users/views/password/reset-password.client.view.html'
    });
  }
]);'use strict';
angular.module('users').controller('AuthenticationController', [
  '$scope',
  '$http',
  '$location',
  'Authentication',
  function ($scope, $http, $location, Authentication) {
    $scope.authentication = Authentication;
    // If user is signed in then redirect back home
    if ($scope.authentication.user)
      $location.path('/');
    $scope.signup = function () {
      $http.post('/auth/signup', $scope.credentials).success(function (response) {
        // If successful we assign the response to the global user model
        $scope.authentication.user = response;
        // And redirect to the index page
        $location.path('/');
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
    $scope.signin = function () {
      $http.post('/auth/signin', $scope.credentials).success(function (response) {
        // If successful we assign the response to the global user model
        $scope.authentication.user = response;
        // And redirect to the index page
        $location.path('/');
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
  }
]);'use strict';
angular.module('users').controller('PasswordController', [
  '$scope',
  '$stateParams',
  '$http',
  '$location',
  'Authentication',
  function ($scope, $stateParams, $http, $location, Authentication) {
    $scope.authentication = Authentication;
    //If user is signed in then redirect back home
    if ($scope.authentication.user)
      $location.path('/');
    // Submit forgotten password account id
    $scope.askForPasswordReset = function () {
      $scope.success = $scope.error = null;
      $http.post('/auth/forgot', $scope.credentials).success(function (response) {
        // Show user success message and clear form
        $scope.credentials = null;
        $scope.success = response.message;
      }).error(function (response) {
        // Show user error message and clear form
        $scope.credentials = null;
        $scope.error = response.message;
      });
    };
    // Change user password
    $scope.resetUserPassword = function () {
      $scope.success = $scope.error = null;
      $http.post('/auth/reset/' + $stateParams.token, $scope.passwordDetails).success(function (response) {
        // If successful show success message and clear form
        $scope.passwordDetails = null;
        // Attach user profile
        Authentication.user = response;
        // And redirect to the index page
        $location.path('/password/reset/success');
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
  }
]);'use strict';
angular.module('users').controller('SettingsController', [
  '$scope',
  '$http',
  '$location',
  'Users',
  'Authentication',
  function ($scope, $http, $location, Users, Authentication) {
    $scope.user = Authentication.user;
    // If user is not signed in then redirect back home
    if (!$scope.user)
      $location.path('/');
    // Check if there are additional accounts 
    $scope.hasConnectedAdditionalSocialAccounts = function (provider) {
      for (var i in $scope.user.additionalProvidersData) {
        return true;
      }
      return false;
    };
    // Check if provider is already in use with current user
    $scope.isConnectedSocialAccount = function (provider) {
      return $scope.user.provider === provider || $scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider];
    };
    // Remove a user social account
    $scope.removeUserSocialAccount = function (provider) {
      $scope.success = $scope.error = null;
      $http.delete('/users/accounts', { params: { provider: provider } }).success(function (response) {
        // If successful show success message and clear form
        $scope.success = true;
        $scope.user = Authentication.user = response;
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
    // Update a user profile
    $scope.updateUserProfile = function (isValid) {
      if (isValid) {
        $scope.success = $scope.error = null;
        var user = new Users($scope.user);
        user.$update(function (response) {
          $scope.success = true;
          Authentication.user = response;
        }, function (response) {
          $scope.error = response.data.message;
        });
      } else {
        $scope.submitted = true;
      }
    };
    // Change user password
    $scope.changeUserPassword = function () {
      $scope.success = $scope.error = null;
      $http.post('/users/password', $scope.passwordDetails).success(function (response) {
        // If successful show success message and clear form
        $scope.success = true;
        $scope.passwordDetails = null;
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
  }
]);'use strict';
// Authentication service for user variables
angular.module('users').factory('Authentication', [function () {
    var _this = this;
    _this._data = { user: window.user };
    return _this._data;
  }]);'use strict';
// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', [
  '$resource',
  function ($resource) {
    return $resource('users', {}, { update: { method: 'PUT' } });
  }
]);