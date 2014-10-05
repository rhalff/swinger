'use strict';

/**
 * @ngdoc function
 * @name swingerApp.controller:ModelCtrl
 * @description
 * # ModelCtrl
 * Controller of the swingerApp
 */
angular.module('swingerApp')
  .config(function($stateProvider) {
    $stateProvider.state('app.models', {
      abstract: true,
      url: '/models',
      templateUrl: 'views/models/main.html',
      controller: 'ModelsCtrl'
    })
    .state('app.models.list', {
      url: '',
      templateUrl: 'views/models/list.html',
      controller: 'ModelsCtrl'
    })
    .state('app.models.add', {
      url: '/add',
      templateUrl: 'views/models/form.html',
      controller: 'ModelsCtrl'
    })
    .state('app.models.edit', {
      url: '/:id/edit',
      templateUrl: 'views/models/form.html',
      controller: 'ModelsCtrl'
    })
    .state('app.models.view', {
      url: '/:id',
      templateUrl: 'views/models/view.html',
      controller: 'ModelsCtrl'
    });
  })

.controller('ModelsCtrl', function($scope, $state, $stateParams, toasty, model) {

  var modelId = $stateParams.id;

  if (modelId) {
    $scope.model = model.findById({
      id: modelId
    }, function() {}, function(err) {
      console.log(err);
    });
  } else {
    $scope.model = {};
  }

  function loadmodels() {
    $scope.models = model.find();
  }

  loadmodels();

  $scope.delete = function(id) {
    // if (confirm('Are you sure?') === false) {
      // return false;
    // }
    model.deleteById(id, function() {
      toasty.pop.success({title: 'model deleted', msg: 'Your model is deleted!', sound: false});
      loadmodels();
      $state.go('app.models.list');
      console.log();
    }, function(err) {
      toasty.pop.error({title: 'Error deleting model', msg: 'Your model is not deleted: ' + err, sound: false});
    });

  };

 $scope.schema = {
    type: 'object',
    properties: {
      name: { type: 'string', minLength: 2, title: 'Name', description: 'Name or alias' },
      title: {
        type: 'string',
        enum: ['dr','jr','sir','mrs','mr','NaN','dj']
      }
    }
  };

  $scope.form = [
    '*',
    {
      type: 'submit',
      title: 'Save'
    }
  ];

  $scope.model = {};

  $scope.onSubmit = function() {

    model.upsert($scope.model, function() {
      toasty.pop.success({title: 'model saved', msg: 'Your model is safe with us!', sound: false});
      $state.go('^.list');
    }, function(err) {
      console.log(err);
    });

  };


});
