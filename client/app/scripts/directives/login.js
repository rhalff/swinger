'use strict';

/**
 * @ngdoc directive
 * @name swingerApp.directive:login
 * @description
 * # login
 */
angular.module('swingerApp')
  .directive('login', function () {
    return {
      templateUrl: 'views/elements/login.html',
      restrict: 'E'
    };
  });
