var loopback = require('loopback');
var fs = require('fs');
var client = loopback();

var model = function(name, path) {

  var fname = [path, name].join('/');
  var definition = require(fname + '.json');
  var model = loopback.createModel(definition);

  if(fs.existsSync(fname + '.js')) {
    require(fname + '.js')(model);
  }

  return model;

};

// hm ok what is received by the post.js is not
// just only the json.
// So what is received ?

var post = model('post', './common/models');

var remote = loopback.createDataSource({
  connector: loopback.Remote,
  url: 'http://swinger-chix.rhcloud.com/api'
});

client.model(post);

post.attachTo(remote);

/*
// call the remote method
post.sum(1, function(err, total) {
  console.log('result:', err || total);
});
*/

var now = Date.now();

console.log(post.modelName);

//post.modelName = 'bogus';
post.changes(now, function() {


});

post.modelName = 'post';

// call a built in remote method
post.find(function(err, items) {
  if(err) {
    console.log(err);
  } else {
    console.log(items);
  }
});
