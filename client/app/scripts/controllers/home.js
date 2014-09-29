'use strict';

/**
 * @ngdoc function
 * @name swingerApp.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of the swingerApp
 */
angular.module('swingerApp')
  .config(function($stateProvider) {
    $stateProvider.state('app.home', {
      url: '',
      templateUrl: 'views/home.html',
      controller: 'HomeCtrl'
    });
  })
  .controller('HomeCtrl', function($scope, $http, Post, Product) {

    $scope.count = {};

    Post.find(function(posts) {
      $scope.count.posts = posts.length;
    });

    Product.find(function(products) {
      $scope.count.products = products.length;
    });

    $scope.count.events = 0;
    $scope.count.files = 0;


    $http.get('http://localhost:3000/api/containers/container1/files').success(function(data) {
      $scope.count.files = data.length;
    });

    // Event.find(function(events){
    // $scope.count.events = events.length;
    // });

    // Post.find(function(posts){
    //   $scope.count.posts = posts.length;
    // });

  });
