/**
 * Module dependencies.
 */

var express = require('express')
  , markdown = require('markdown')
  , routes = require('./routes')
  , ArticleProvider = require('./Articleprovider').ArticleProvider;

var app = module.exports = express.createServer();

/**
 * Configuration
 */
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set('view options', {'layout': false}); //不需要layout模版
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

var articleProvider = new ArticleProvider('localhost', 27017);

/**
 * Routes
 */

app.get('/', function(req, res){
	articleProvider.findAll(function(error, docs){
		res.render('default/index.jade', {
			articles: docs
		});
	});
});

app.get('/post/:id', function(req, res){
	var id = req.params.id;
	articleProvider.findById(id, function(error, article){
		res.render('default/single.jade', {locals: {
		    _id: article._id,
			tit: article.title,
			article: article.body,
			time: article.created_at,
		    comments: article.comments
		}})
	});
});

app.post('/post/addComment', function(req, res){
	articleProvider.addComment(req.param('_id'), {
		person: req.param('person'),
		comment: req.param('comment'),
    created_at: new Date()
	}, function(error, docs){
		res.redirect('/post/' + req.param('_id'))
	});
});

app.get('/admin', function(req, res){
	articleProvider.findAll(function(error, docs){
		res.render('admin/index.jade', {
			title: '管理首页'
		});
	});
});

app.get('/admin/list', function(req, res){
	articleProvider.findAll(function(error, docs){
		res.render('admin/list.jade', {
			title: '文章列表',
			articles: docs
		});
	});
});

app.get('/admin/new', function(req, res){
	res.render('admin/new.jade', {
		title: '撰写文章'
	});
});

app.post('/admin/new', function(req, res){
	articleProvider.save({
		title: req.param('title'),
		body: markdown.toHTML(req.param('body'))	
	}, function(error, docs){
		res.redirect('/admin/list');
	});
});

app.get('/admin/help', function(req, res){
	articleProvider.findAll(function(error, docs){
		res.render('admin/help.jade', {
			title: '帮助',
			articles: docs
		});
	});
});

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
