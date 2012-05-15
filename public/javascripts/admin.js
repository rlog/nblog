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

  //select tag
  $(".lab_list").delegate("a", "click", function(){
    var $this = $(this);
    var $tag_input = $("#tag_input");
    var $tag_input_val = $.trim($($tag_input).val());
    if ($tag_input_val===""){
      $tag_input.val($.trim($this.text()));
    } else {
      $tag_input.val($tag_input_val +","+ $.trim($this.text()));
    }
    return false;
  })

})
