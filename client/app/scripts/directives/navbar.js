'use strict';

/**
 * @ngdoc directive
 * @name swingerApp.directive:navbar
 * @description
 * # navbar
 */
angular.module('swingerApp')
  .directive('navbar', function () {
    return {
      templateUrl: 'views/elements/navbar.html',
      restrict: 'E'
    };
  });
