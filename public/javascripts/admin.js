$(function(){
	//publish
	$("#post-publist").click(function(){
		$("#new-post").submit();
	})

  //uploader
  $("#newfile").change(function(){
    $(this).upload('/admin/fileupload', function(res) {
        $(res).insertAfter(this);
        console.log($(res));
        $("#file_list").append('<img src="http://img1.douban.com/lpic/s9014462.jpg" width="130" />');
    }, 'json');
  })
})
