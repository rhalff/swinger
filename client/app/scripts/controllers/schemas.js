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
      controller: 'SchemasCtrl'
    })
    .state('app.schemas.edit', {
      url: '/:id/edit',
      templateUrl: 'views/schemas/form.html',
      controller: 'SchemasCtrl'
    })
    .state('app.schemas.view', {
      url: '/:id',
      templateUrl: 'views/schemas/view.html',
      controller: 'SchemasCtrl'
    });
  })

.controller('SchemasCtrl', function($scope, $state, $stateParams, toasty, Schema) {

  var id = $stateParams.id;

  if (id) {
    $scope.schemaModel = Schema.findById({
      id: id
    }, function() {}, function(err) {
      console.log(err);
    });
  } else {
    $scope.schemaModel = {};
  }

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

 // Load the schema, this schema should come from the database.
 // We are creating a schema with this form
 // thus, we start with an array, then a common form to add
 // simple types.
 // type options should be tabbed.
 // e.g enum indicates something.
 // pattern
 // minLength, maxLength
 // ok recap. Schema, Form, Loopback model, swagger
 // hoe bewaar ik en van wat laad ik. het resultaat is een nieuw loopback model
 // bedoeling is dus, wat nu plat als json staat vanuit de database te halen.
 // loopback model is vrij beperkt, laat ik het eerst zo maken
 // dat ik een loopback model can saven. een object is eigenlijk altijd een nieuwe
 // model. welke gerelateerd wordt.
  $scope.schema = {
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
        'maxItems': 20,
        'minItems': 1,
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
              'enum': ['string', 'integer', 'number', 'boolean', 'null', 'array', 'object']
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

  $scope.form = [
  {
    type: 'fieldset',
    key: 'info',
    items: [
      {
        'type': 'help',
          'helpvalue': '<p>Try adding a couple of forms, reorder by dragndrop.</p>'
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

  $scope.onSubmit = function(form) {

    $scope.$broadcast('schemaFormValidate');

    if(form.$valid) {

      Model.upsert($scope.schemaModel, function() {
        toasty.pop.success({title: 'model saved', msg: 'Your model is safe with us!', sound: false});
        $state.go('^.list');
      }, function(err) {
        toasty.pop.error({title: 'Error', msg: err, sound: true });
      });

    }

  };


});
