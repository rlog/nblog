/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , ArticleProvider = require('./Articleprovider').ArticleProvider;

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'html'); //使用html模版
  app.register('.html', require('ejs')); //指定模版扩展名为.html, ejs模版引擎
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
// Routes
app.get('/', function(req, res){
	articleProvider.findAll(function(error, docs){
		res.render('index.html', {
			tit: 'Blog List',
			articles: docs
		});
	});
});

app.get('/new', function(req, res){
	res.render('new.html', {
		tit: 'New Post'
	});
});

app.post('/new', function(req, res){
	articleProvider.save({
		title: req.param('title'),
		body: req.param('body')	
	}, function(error, docs){
		res.redirect('/')
	});
});

app.get('/:id', function(req, res){
	var id = req.params.id;
	articleProvider.findById(id, function(error, article){
		res.render('post.html', {locals: {
			title: article.title,
			article: article.body,
			time: article.created_at 
		}})
	})
})

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
