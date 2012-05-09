/**
 * Module dependencies.
 */

var express = require('express')
  , markdown = require('markdown')
  , fs = require('fs')
  , routes = require('./routes');

var app = module.exports = express.createServer();

/*
 * Configuration
 */
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set('view options', {'layout': false, 'pretty': false}); //不需要layout模版
  app.use(express.bodyParser({uploadDir: __dirname + '/public/uploads'}));
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.helpers({
  md: function (str){
        var content = markdown.parse(str);
        return content.replace(/<pre><code>([\w\W]*?)<\/code><\/pre>/g, '<pre class="prettyprint">$1</pre>');
      }
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});


/**
 * Routes
 */

app.get('/', function(req, res){
  routes.index(req, res);
});

app.get('/post/:id', function(req, res){
  routes.single(req, res);
});

app.post('/post/addComment', function(req, res){
  routes.addComment(req, res);
});

app.get('/tag/:tag', function(req, res){
  routes.tag(req, res);
});

app.get('/tags', function(req, res){
  routes.tags(req, res);
});

app.get('/admin', function(req, res){
  routes.admin(req, res);
});

app.post('/admin/fileupload', function(req, res){
  var tmp_path = req.files.thumbnail.path;
  var target_path = __dirname + '/public/uploads/' + req.files.thumbnail.name; 

  fs.rename(tmp_path, target_path, function(err){
    if (err) throw err;
    res.send(JSON.stringify({
      'r': 'success',
      'uri' : '/uploads/' + req.files.thumbnail.name
    }));
    /*
    fs.unlink(tmp_path, function (err) {
      if (err) throw err;
      res.send({'r': 'success'});
    })
    */
  });
});

app.get('/admin/post/list', function(req, res){
  routes.admin_post_list(req, res);
});

app.get('/admin/post/new', function(req, res){
  routes.admin_post_new(req, res);
});

app.get('/admin/post/edit/:id', function(req, res){
  routes.admin_post_editer(req, res);
});

app.post('/admin/post/editer', function(req, res){
  routes.admin_post_save(req, res);
});


app.get('/admin/post/del/:id', function(req, res){
  routes.admin_post_del(req, res);
});

app.get('/admin/help', function(req, res){
  routes.admin_help(req, res);
});

app.get('/admin/setting', function(req, res){
  routes.admin_setting(req, res);
});

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
