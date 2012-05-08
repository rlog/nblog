var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

function zeroFill (s, n) {
    var zero = '';
    for (var i = 0; i < n; i++) {
        zero += '0';
    } 
    return (zero + s).slice(-n);
}

function convertMarkup (input) {
    return input.
        replace(/\r\n/gm, '\n').
        replace(/\r/gm, '\n');
}
// rfc3339
function formatDate (d, type) {
    var date = new Date(d),
        year = date.getFullYear(),
        month = zeroFill((date.getMonth() + 1), 2),
        day = zeroFill(date.getDate(), 2),
        hours = zeroFill(date.getHours(), 2),
        minutes = zeroFill(date.getMinutes(), 2),
        seconds = zeroFill(date.getSeconds(), 2),

        offset = date.getTimezoneOffset(),
        offsetSign = offset > 0 ? '-' : '+',
        offsetHours = zeroFill(Math.floor(Math.abs(offset) / 60), 2),
        offsetMinutes = zeroFill(Math.abs(offset) % 60, 2);

    if (type === 'rfc3339') {
        return year + '-' + month + '-' + day + 'T' + hours + ':' +
            minutes + ':' + seconds + offsetSign + offsetHours + ':' + offsetMinutes;
    } else {
        return year + '-' + month + '-' + day + ' ' + hours + ':' +
            minutes + ':' + seconds;
    }
}

ArticleProvider = function (host, port) {
	this.db = new Db('blog', new Server(host, port, {auto_reconnect: true}, {}));
	this.db.open(function(error){
		if(error){
        console.log(error);
        return;
		}
  });
};

ArticleProvider.prototype.getCollection = function(callback){
	this.db.collection('acticles', function(error, article_collection){
		if(error){
        console.log(error);
        return;
		} else {
			callback(null, article_collection);
		}
	});
};

ArticleProvider.prototype.findAll = function(callback) {
	this.getCollection(function(error, article_collection){
		if(error){
			callback(error);
		}else{
			article_collection.find().toArray(function(error, results){
				if(error){
					callback(error);
				} else {
					callback(null, results);
				}
			});
		}
	});
};

ArticleProvider.prototype.findById = function(id, callback){
	this.getCollection(function(error, article_collection){
		if(error){
			callback(error);
		} else {
			article_collection.findOne({_id: article_collection.db.bson_serializer.ObjectID.createFromHexString(id)}, function(error, result){
				if(error){
					callback(error);
				} else {
					callback(null, result);
				}
			});
		}
	});
};

ArticleProvider.prototype.findByTag = function(tag, callback){
  console.log(tag);
	this.getCollection(function(error, article_collection){
		if(error){
			callback(error);
		} else {
			article_collection.find({tags:tag}, function(error, results){
				if(error){
					callback(error);
				} else {
          console.log(results);
					callback(null, results);
				}
			});
		}
	});
};

ArticleProvider.prototype.save = function(articles, callback){
	this.getCollection(function(error, article_collection){
		if(error){
			callback(error);
		} else {
			if(typeof(articles.length)==="undefined"){
				articles = [articles];
		}

		for(var i=0; i<articles.length; i++){
      article = articles[i];
			article.created_at = new Date();
			article.formatDate = formatDate(new Date());
      
      article.body = convertMarkup(article.body);
			if(article.comments === undefined){
				article.comments = [];
			}

			for (var j=0; j<article.comments.length; j++){
				article.comments[j].created_at = new Date();
				article.comments[j].formatDate = formatDate(new Date());
			}
		}

		article_collection.insert(articles, function(){
			callback(null, articles);
		});
	}
	});
};

ArticleProvider.prototype.update = function(articles, callback){
	this.getCollection(function(error, article_collection){
		if(error){
			callback(error);
		} else {
			var articleId = articles.id;
			article_collection.update(
				{_id: article_collection.db.bson_serializer.ObjectID.createFromHexString(articleId)}, 
				{$set: {
					title: articles.title,
					body: convertMarkup(articles.body),
					tags: articles.tags
				}}, 
				function(error){
					if(error){
					  callback(error);
					} else {
						callback(null);
					}
				}
			);
		}
	});
};

ArticleProvider.prototype.del = function(articleId, callback){
	this.getCollection(function(error, article_collection){
		if(error){
			callback(error);
		} else {
			article_collection.remove({_id: article_collection.db.bson_serializer.ObjectID.createFromHexString(articleId)}, function(error){
				if(error){
				  callback(error);
				} else {
					callback(null);
				}
			});
		}
	});
};

ArticleProvider.prototype.addComment= function(articleId, comment, callback){
  comment.formatDate = formatDate(comment.created_at);
	this.getCollection(function(error, article_collection){
    if(error){
      callback(error);
    } else {
      article_collection.update(
        {_id: article_collection.db.bson_serializer.ObjectID.createFromHexString(articleId)},
        {"$push": {comments: comment}},
        function(error, acticle){
          if(error){
            callback(error);
          } else {
            callback(null);
          }
        }
      )
    }
  });
};

exports.ArticleProvider = ArticleProvider;
