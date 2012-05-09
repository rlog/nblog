$(function(){
	//publish
	$("#post-publist").click(function(){
		$("#new-post").submit();
	})

  //uploader
  $("#fileupload").iframePostForm({
    post: function(){},
    complete: function (o) {
        var imgData = $.parseJSON($.browser.msie ? o : $(o).text());
        //$("#file_list").append('<img src="' + imgData['src'].replace('public', '') + '" />');
        $("#file_list").append('<img src="http://img1.douban.com/lpic/s9014462.jpg" width="130" />');
    }
  })
})
