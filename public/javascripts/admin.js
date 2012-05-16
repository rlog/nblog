$(function(){
      cursorMethod = {
        setCursorPosition: function (textarea, position) {
          this.selectTxt(textarea, position, position);
        },
        selectTxt: function (textarea, start, end) {
          textarea.setSelectionRange(start, end);
          textarea.focus();
        },
        insertAfterCursor: function (textarea, text) {
          var val = textarea.value;
          var cp = textarea.selectionStart,
              ubbLength = textarea.value.length;

          // insert txt
          textarea.value = textarea.value.slice(0, cp) + text +
              textarea.value.slice(cp, ubbLength);
          // reset cursor
          this.setCursorPosition(textarea, cp + text.length);
        } 
      };
	//publish
	$("#post-publist").click(function(){
		$("#new-post").submit();
	})

  //uploader
  $("#upload_form").iframePostForm({
    post: function(){},
    complete: function (o) {
      var data = $.parseJSON($.browser.msie ? o : $(o).text());
      if(data.type.indexOf('image/') !== -1){
        $("#file_list").append('<img class="file" data-path="'+data.path+'" data-name="'+data.name+'" src="'+data.path+'" />');
      } else {
        $("#file_list").append('<span class="file" data-path="'+data.path+'" data-name="'+data.name+'">'+data.name+'</span>');
      }
    }
  }).find("#newfile").change(function () {
    $(this).parent().submit();
  });

  $("#file_list").on('click', '.file', function (e) {
    var $this = $(this), 
        path = $this.data('path'),
        name = $this.data('name'),
        TMPL_IMG  = "!["+ name +"]("+ path +")",
        TMPL_LINK = "["+ name +"]("+ path +")",
        edit_area = $("textarea");
    if ($this.attr('src')){
      cursorMethod.insertAfterCursor(edit_area[0], TMPL_IMG);
    } else {
      cursorMethod.insertAfterCursor(edit_area[0], TMPL_LINK);
    }
});

})
