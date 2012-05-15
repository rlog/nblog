var ArticleProvider = require('./../Articleprovider').ArticleProvider,
    markdown = require('markdown'),
    articleProvider = new ArticleProvider('localhost', 27017);

exports.index = function(req, res){
	articleProvider.findAll(function(error, docs){
		res.render('default/list.jade', {
      tag_name: '',
			articles: docs
		});
	});
};

exports.tag = function(req, res){
	var tag = req.params.tag;
  if (tag){
    articleProvider.findByTag(tag, function(error, docs){
      res.render('default/list.jade', {
        tag_name: tag,
        articles: docs
      });
    });
  }
};

exports.tags = function(req, res){
  res.render('default/tags.jade');
};

exports.single = function(req, res){
	var id = req.params.id;
	articleProvider.findById(id, function(error, article){
		res.render('default/single.jade', {locals: {
      _id: article._id,
      tit: article.title,
      article: article.body,
      tags: article.tags,
      formatDate: article.formatDate,
      comments: article.comments
		}})
	});
};

exports.addComment = function(req, res){
	articleProvider.addComment(req.param('_id'), {
		person: req.param('person'),
		site: req.param('site'),
		comment: req.param('comment'),
    created_at: new Date()
	}, function(error, docs){
		res.redirect('/post/' + req.param('_id') + "#comment")
	});
};

exports.admin = function(req, res){
  res.render('admin/index.jade', {
    title: 'Dashboard'
  });
};

exports.admin_post_list = function(req, res){
	articleProvider.findAll(function(error, docs){
		res.render('admin/list.jade', {
			title: 'Posts List',
			articles: docs
		});
	});
};

exports.admin_post_new = function(req, res){
	articleProvider.findAllTags(function(tags){
    res.render('admin/editer.jade', {
      title: 'New Post',
      post_id :  '', 
      post_tit:  '',
      post_body: '',
      post_tags: '',
      post_action: "addNew",
      all_tags: tags
    });
  })
};

exports.admin_post_editer = function(req, res){
	var id = req.params.id;

	articleProvider.findAllTags(function(tags){
    articleProvider.findById(id, function(error, article){
      res.render('admin/editer.jade', {locals: {
        title: 'Edit Post',
        post_id : article._id, 
        post_tit:  article.title,
        post_body: article.body,
        post_tags: article.tags,
        post_action: "editOld",
        all_tags: tags
      }})
    });
  });


};

exports.admin_post_save = function(req, res){
	var post_act = req.body.action;
  var tags_str = req.param('tags');
  if (tags_str.substr(-1,1) === ",") {
    tags_str = tags_str.substr(0, tags_str.length-1);
  }
  var tags_arr = tags_str.split(",");
	if (post_act === "addNew"){
		articleProvider.save({
			title: req.param('title'),
			body: req.param('body'),
			tags: tags_arr
		}, function(error, docs){
			res.redirect('/admin/post/list');
		});
	} else if (post_act === "editOld"){
		articleProvider.update({
			id: req.param('id'),
			title: req.param('title'),
			body: req.param('body'),
			tags: tags_arr 
		}, function(error){
			res.redirect('/admin/post/list');
		});
	} else {
		console.log(post_act);
	}
};

exports.admin_post_del = function(req, res){
	var id = req.params.id;
	articleProvider.del(id, function(error){
		res.redirect('/admin/post/list');
	});
};

exports.admin_help = function(req, res){
  res.render('admin/help.jade', {
    title: 'Help'
  });
};

exports.admin_setting = function(req, res){
  res.render('admin/setting.jade', {
    title: 'Setting'
  });
};
