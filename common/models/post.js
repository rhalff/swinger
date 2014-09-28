'use strict';

module.exports = function(Post) {

  Post.definition.properties.dateCreated.default = Date.now;

};
