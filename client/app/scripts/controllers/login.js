'use strict';

/**
 * @ngdoc function
 * @name swingerApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the swingerApp
 */
angular.module('swingerApp')
  .controller('LoginCtrl', function ($scope, $routeParams, $location, toasty, User, AppAuth) {
    $scope.credentials = {
      email: 'admin@admin.com',
      password: 'admin',
      rememberMe: true
    };

    $scope.login = function() {
      $scope.loginResult = User.login({
          include: 'user',
          rememberMe: $scope.credentials.rememberMe
        }, $scope.credentials,
        function() {
          var next = $location.nextAfterLogin || '/';
          $location.nextAfterLogin = null;
          AppAuth.currentUser = $scope.loginResult.user;
          toasty.pop.success({title: 'Logged in', msg: 'You are logged in!', sound: false});
          if(next === '/login') {
            next = '/';
          }
          $location.path(next);
        },
        function(res) {
          $scope.loginError = res.data.error;
        }
      );
    };

    $scope.registration = {
      firstName: 'me',
      lastName: 'me',
      email: 'me@me.me',
      password: 'meme'
    };

    $scope.confirmPassword = 'meme';

    $scope.register = function() {

      console.log('reg');

      $scope.user = User.save($scope.registration,
        function() {

          $scope.loginResult = User.login({
              include: 'user',
              rememberMe: true
            }, $scope.registration,
            function() {
              AppAuth.currentUser = $scope.loginResult.user;
              toasty.pop.success({title: 'Registered', msg: 'You are registered!', sound: false});
              $location.path('/');
            },
            function(res) {
              toasty.pop.warning({title: 'Error signin in after registration!', msg: res.data.error.message, sound: false});
              $scope.loginError = res.data.error;
            }
          );

        },
        function(res) {
          toasty.pop.error({title: 'Error registering!', msg: res.data.error.message, sound: false});
          $scope.registerError = res.data.error;
        }
      );
    };

  });
