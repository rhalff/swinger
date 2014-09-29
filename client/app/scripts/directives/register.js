'use strict';

/**
 * @ngdoc directive
 * @name swingerApp.directive:register
 * @description
 * # register
 */
angular.module('swingerApp')
  .directive('register', function () {
    return {
      templateUrl: 'views/elements/register.html',
      restrict: 'E'
    };
  });
