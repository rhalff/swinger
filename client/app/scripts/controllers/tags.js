'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:tagsCtrl
 * @description
 * # tagsCtrl
 * Controller of the clientApp
 */
angular.module('swingerApp')

  .config(function($stateProvider) {
    $stateProvider.state('app.tags', {
      abstract: true,
      url: '/tags',
      templateUrl: 'views/tags/main.html',
      controller: 'tagsCtrl'
    })
    .state('app.tags.list', {
      url: '',
      templateUrl: 'views/tags/list.html',
      controller: 'tagsCtrl'
    })
    .state('app.tags.add', {
      url: '/add',
      templateUrl: 'views/tags/form.html',
      controller: 'tagsCtrl'
    })
    .state('app.tags.edit', {
      url: '/:id/edit',
      templateUrl: 'views/tags/form.html',
      controller: 'tagsCtrl'
    })
    .state('app.tags.view', {
      url: '/:id',
      templateUrl: 'views/tags/view.html',
      controller: 'tagsCtrl'
    });
  })

  .controller('tagsCtrl', function($scope, $state, $stateParams, toasty, Tag) {

  var tagId = $stateParams.id;

  if (tagId) {
    $scope.tag = Tag.findById({
      id: tagId
    }, function() {}, function(err) {
      console.log(err);
    });
  } else {
    $scope.tag = {};
  }

  function loadItems() {
    $scope.tags = Tag.find();
  }

  loadItems();

  $scope.delete = function(id) {
    // if (confirm('Are you sure?') === false) {
    //   return false;
    // }
    Tag.deleteById(id, function() {
      toasty.pop.success({title: 'Tag deleted', msg: 'Your tag is deleted!', sound: false});
      loadItems();
      $state.go('app.tags.list');
      console.log();
    }, function(err) {
      toasty.pop.error({title: 'Error deleting tag', msg: 'Your Tag is not deleted: ' + err, sound: false});
    });

  };

  // this really should be generated, look at crud of angular-app
  $scope.formFields = [{
    key: 'name',
    type: 'text',
    label: 'Name',
    required: true
  }];

  $scope.formOptions = {
      uniqueFormId: true,
      hideSubmit: false,
      submitCopy: 'Save'
  };

  $scope.onSubmit = function() {
    Tag.upsert($scope.tag, function() {
      toasty.pop.success({title: 'Tag saved', msg: 'Your Tag is safe with us!', sound: false});
      $state.go('^.list');
    }, function(err) {
      console.log(err);
    });
  };

});
