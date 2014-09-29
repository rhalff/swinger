'use strict';

/**
 * @ngdoc function
 * @name swingerApp.controller:UsersCtrl
 * @description
 * # UsersCtrl
 * Controller of the swingerApp
 */
angular.module('swingerApp')
  .config(function($stateProvider) {
    $stateProvider.state('app.users', {
      abstract: true,
      url: '/users',
      templateUrl: 'views/users.html',
      controller: 'UsersCtrl'
    });
  })
  .controller('UsersCtrl', function() {

  });
