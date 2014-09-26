var loopback = require('loopback');
var boot     = require('loopback-boot');
var path     = require('path');
var file = [ './config',
    process.env.NODE_ENV ? process.env.NODE_ENV : 'development'
    ].join('.');

var config   = require('confert')(file);

var app = module.exports = loopback();

// Set up the /favicon.ico
app.use(loopback.favicon());

// request pre-processing middleware
app.use(loopback.compress());

// -- Add your pre-processing middleware here --

// Set app root dir (expects boot to be present there)
config.appRootDir = __dirname;

// boot scripts mount components like REST API
boot(app, config);

if(!app.get('storage')) {
  throw Error('Storage not set');
}

// Setup storage, can actually put this in boot/ I guess
var storage = app.get('storage');
storage.connector = require('loopback-component-storage');

var ds = loopback.createDataSource(storage);
var container = ds.createModel('container');
app.model(container);

// -- Mount static files here--
// All static middleware should be registered at the end, as all requests
// passing the static middleware are hitting the file system
// Example:
// app.use(loopback.static(path.resolve(__dirname', '../client')));
app.use(loopback.static(path.resolve(__dirname, '../client/app')));

// Requests that get this far won't be handled
// by any middleware. Convert them into a 404 error
// that will be handled later down the chain.
app.use(loopback.urlNotFound());

// The ultimate error handler.
app.use(loopback.errorHandler());

app.start = function() {
  // start the web server
  return app.listen(function() {
    app.emit('started');
    console.log('Web server listening at: %s', app.get('url'));
  });
};

// start the server if `$ node server.js`
if (require.main === module) {
  app.start();
}
