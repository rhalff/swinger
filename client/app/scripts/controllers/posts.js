'use strict';

/**
 * @ngdoc function
 * @name loopbackApp.controller:PostsCtrl
 * @description
 * # PostsCtrl
 * Controller of the loopbackApp
 */
angular.module('loopbackApp')

  .config(function($stateProvider) {
    $stateProvider.state('app.posts', {
      abstract: true,
      url: '/posts',
      templateUrl: 'views/posts/main.html',
      controller: 'PostsCtrl'
    })
    .state('app.posts.list', {
      url: '',
      templateUrl: 'views/posts/list.html',
      controller: 'PostsCtrl'
    })
    .state('app.posts.add', {
      url: '/add',
      templateUrl: 'views/posts/form.html',
      controller: 'PostsCtrl'
    })
    .state('app.posts.edit', {
      url: '/:id/edit',
      templateUrl: 'views/posts/form.html',
      controller: 'PostsCtrl'
    })
    .state('app.posts.view', {
      url: '/:id',
      templateUrl: 'views/posts/view.html',
      controller: 'PostsCtrl'
    });
  })

  .controller('PostsCtrl', function($scope, $state, $stateParams, toasty, Post, Tag) {

  var postId = $stateParams.id;

  if (postId) {
    $scope.post = Post.findById({
      id: postId
    }, function() {}, function(err) {
      console.log(err);
    });
  } else {
    $scope.post = {
      tags: []
    };
  }

  // Make sure tags are send like this with text:
  /*
  $scope.tags = [
     { text: 'just' },
     { text: 'some' },
     { text: 'cool' },
     { text: 'tags' }
    ];
  */

  function loadItems() {
    $scope.posts = Post.find();
  }

  $scope.loadTags = function(/*query*/) {
    return Tag.find();
  };

  loadItems();

  $scope.delete = function(id) {
    // if (confirm('Are you sure?') === false) {
    //   return false;
    // }
    Post.deleteById(id, function() {
      toasty.pop.success({title: 'Post deleted', msg: 'Your post is deleted!', sound: false});
      loadItems();
      $state.go('app.posts.list');
      console.log();
    }, function(err) {
      toasty.pop.error({title: 'Error deleting post', msg: 'Your post is not deleted: ' + err, sound: false});
    });

  };

  /**
   *
   * I would prefer these fields where generated by some kind of filter.
   *
   */
  $scope.formFields = [{
    key: 'title',
    type: 'text',
    label: 'Title',
    placeholder: 'Enter a title for your post',
    required: true
  }, {
    key: 'content',
    type: 'textarea',
    lines: 14,
    label: 'Content',
    placeholder: 'Write some content!',
    required: true
  }, {
    key: 'handle',
    type: 'text',
    label: 'Handle'
  }, {
    key: 'author',
    type: 'text',
    label: 'Author'
  }, {
    key: 'description',
    type: 'textarea',
    lines: 4,
    label: 'Description',
    required: true
  }, {
    key: 'tags',
    // ok this does work. post.tags is filled, but unfortunately the wrong
    // scope.
    templateUrl: 'views/elements/tags.html',
    //template: '<tags-input display-property="name" ng-model="result[options.key]"><auto-complete source="loadTags($query)"></auto-complete></tags-input>',
    //type: 'tagsInput',
    label: 'Tags'
  }, {
    key: 'image',
    type: 'text',
    label: 'image'
  }];

  $scope.formOptions = {
    uniqueFormId: true,
    hideSubmit: false,
    submitCopy: 'Save'
  };

  $scope.onSubmit = function() {

    // server should do creation and updated etc.
    $scope.post.contentType = 'text/x-markdown';

    Post.upsert($scope.post, function() {
      toasty.pop.success({title: 'Post saved', msg: 'Your post is safe with us!', sound: false});
      $state.go('^.list');
    }, function(err) {
      console.log(err);
    });
  };

  });
