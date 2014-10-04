'use strict';

/* global hljs */

/**
 * @ngdoc overview
 * @name swingerApp
 * @description
 * # swingerApp
 *
 * Main module of the application.
 */
angular.module('swingerApp', [
  'ngAnimate',
  'ngCookies',
  'ngResource',
  'ngRoute',
  'ngSanitize',
  'ngTouch',
  'ui.router',
  'lbServices',
  'formly',
  'toasty',
  'hc.marked',
  'ngTagsInput',
  'schemaForm',
  'angularFileUpload'
])

.controller('LayoutCtrl', function ($scope, Setting) {

  $scope.appName = 'LB-NG-BS';

  $scope.settings = {};

  Setting.find(function(settings){
    settings.forEach(function(item){
      console.log('item');
      console.log(item);
      $scope.settings[item.key] = item.value;
    });


    console.log($scope.settings);
  });


})

.config(['markedProvider', function(markedProvider) {

  markedProvider.setOptions({
    gfm: true,
    tables: true,
    highlight: function(code) {
      return hljs.highlightAuto(code).value;
    }
  });

}])

.config(function($stateProvider, $urlRouterProvider) {


  $stateProvider.state('login', {
    url: '/login',
    template: '<login></login>',
    controller: 'LoginCtrl'
  })
    .state('register', {
      url: '/register',
      template: '<register></register>',
      controller: 'LoginCtrl'
    });

  $urlRouterProvider.otherwise('/app');

})

.config(function($routeProvider, $httpProvider) {

  // Intercept 401 responses and redirect to login screen
  $httpProvider.interceptors.push(function($q, $location, AppAuth, toasty) {
    return {
      responseError: function(rejection) {
        console.log('intercepted rejection of ', rejection.config.url, rejection.status);

        if (rejection.status === 401) {
          AppAuth.currentUser = null;
          // save the current location so that login can redirect back
          $location.nextAfterLogin = $location.path();

          if ($location.path() !== '/register') {
            $location.path('/login');
          }

          toasty.pop.warning({title: 'Error 401 received', msg: 'We received a 401 error from the API! Redirecting to login', sound: false});
        } else {
          // If the server is down what to do.
          toasty.pop.warning({
            title: 'Error ' + rejection.status + ' received',
            msg: 'We received a ' + rejection.status + ' error from the API!',
            sound: false
          });
        }
        return $q.reject(rejection);
      }
    };
  });
});
