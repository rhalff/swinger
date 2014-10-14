'use strict';

/**
 * @ngdoc function
 * @name swingerApp.controller:SchemaCtrl
 * @description
 * # SchemaCtrl
 * Controller of the swingerApp
 */
angular.module('swingerApp')
  .config(function($stateProvider) {
    $stateProvider.state('app.schemas', {
      abstract: true,
      url: '/schemas',
      templateUrl: 'views/schemas/main.html',
      controller: 'SchemasCtrl'
    })
    .state('app.schemas.list', {
      url: '',
      templateUrl: 'views/schemas/list.html',
      controller: 'SchemasCtrl'
    })
    .state('app.schemas.add', {
      url: '/add',
      templateUrl: 'views/schemas/form.html',
      controller: 'SchemaCtrl'
    })
    .state('app.schemas.edit', {
      url: '/:id/edit',
      templateUrl: 'views/schemas/form.html',
      controller: 'SchemaCtrl'
    })
    .state('app.schemas.view', {
      url: '/:id',
      templateUrl: 'views/schemas/view.html',
      controller: 'SchemasCtrl'
    });
  })

.controller('SchemasCtrl', function($scope, $state, $stateParams, toasty, Schema) {

  function loadSchemas() {
    $scope.schemas = Schema.find();
  }

  loadSchemas();

  $scope.delete = function(id) {
    // if (confirm('Are you sure?') === false) {
      // return false;
    // }
    Schema.deleteById(id, function() {
      toasty.pop.success({title: 'model deleted', msg: 'Your model is deleted!', sound: false});
      loadSchemas();
      $state.go('app.schemas.list');
      console.log();
    }, function(err) {
      toasty.pop.error({title: 'Error deleting model', msg: 'Your model is not deleted: ' + err, sound: false});
    });

  };

})

.controller('SchemaCtrl', function($scope, $state, $stateParams, toasty, Schema) {

  var id = $stateParams.id;

  var schema = {
    'type': 'object',
    'title': 'Model',
    required: [
      'name',
      'title',
      'properties'
    ],
    'properties': {
      'name': {
        'title': 'Name',
        'type': 'string',
        pattern: '^[a-z-]+$'
      },
      'plural': {
        'title': 'Plural',
        'type': 'string'
      },
      'title': {
        'title': 'Title',
        'type': 'string'
      },
      'properties': {
        'type': 'array',
        'items': {
          'type': 'object',
          'properties': {
            'name': {
              'title': 'Name',
              'type': 'string',
              pattern: '^[a-z-]+$'
            },
            'title': {
              'title': 'Title',
              'type': 'string'
            },
            'type': {
              'title': 'Type',
              'type': 'string',
              // these types could also be links to existing schema's
              // this way you could in theory link deeply nested schema's
              'enum': ['string', 'integer', 'number', 'boolean', 'null', 'array', 'object']
            },
            'format': {
              'title': 'Format',
              'type': 'string',
              'enum': ['date', 'datetime', 'email', 'search', 'tel', 'time', 'url']
            },
            'minLength': {
              'title': 'Minimum length',
              'type': 'number'
            },
            'maxLength': {
              'title': 'Maximum length',
              'type': 'number'
            },
            'pattern': {
              'title': 'Pattern',
              'type': 'string'
            },
            'enum': {
              'title': 'Possible values',
              'type': 'string'
            }
          },
          'required': [ 'name', 'title', 'type' ]
        }
      }
    }
  };

  var form = [
  {
    type: 'fieldset',
    key: 'info',
    items: [
      {
        'type': 'help',
          'helpvalue': '<p>Manage your schema\'s.</p>'
      }, {
        'key': 'name',
        onChange: function(modelValue, form) {
          console.log(modelValue, form);
        }
      }, {
        'key': 'title'
      }, {
        'key': 'plural'
      }
    ]
  },
  {
    'key': 'properties',
    'type': 'tabarray',
    'add': 'New property',
    'title': 'value.title || value.name || "Property " + ($index + 1)',
    'remove': 'Delete',
    'tabType': 'left',
    'style': {
      'add': 'btn-success',
      'remove': 'btn-danger'
    },
    'items': [
      {
        'type': 'help',
        'helpvalue': '<p>Use the form below to add properties to your model. There must be at least one property,</p><p> click <code>New property</code> to add additional properties.</p>'
      },
      'properties[].name',
      'properties[].title',
      'properties[].type',
      {
        'type': 'conditional',
        'condition': '["null", ""].indexOf(model.properties[arrayIndex].type) === -1',
        'items': [
          {
            'key': 'properties[].minLength'
          }, {
            'key': 'properties[].maxLength'
          }
        ]
      },
      'properties[].enum',
      'properties[].pattern'
    ]
  },
  {
    'type': 'submit',
    'style': 'btn-info',
    'title': 'OK'
  }
  ];


  $scope.schemaModel = {};
  if (id) {

    Schema.findById({ id: id })
    .$promise
    .then(function(model) {
       // somehow tabs will not update, no clue why
       $scope.schemaModel = model;
       $scope.schema = schema;
       $scope.form   = form;
    });

  } else {
    $scope.schemaModel = {};
    $scope.schema = schema;
    $scope.form   = form;

  }


  $scope.delete = function(id) {
    // if (confirm('Are you sure?') === false) {
      // return false;
    // }
    Schema.deleteById(id, function() {
      toasty.pop.success({title: 'model deleted', msg: 'Your model is deleted!', sound: false});
      loadSchemas();
      $state.go('app.schemas.list');
      console.log();
    }, function(err) {
      toasty.pop.error({title: 'Error deleting model', msg: 'Your model is not deleted: ' + err, sound: false});
    });

  };

  $scope.onSubmit = function(form) {

    $scope.$broadcast('schemaFormValidate');

    if(form.$valid) {

      Schema.upsert($scope.schemaModel, function() {
        toasty.pop.success({title: 'model saved', msg: 'Your model is safe with us!', sound: false});
        $state.go('^.list');
      }, function(err) {
        toasty.pop.error({title: 'Error', msg: err, sound: true });
      });

    }

  };


});
