$(document).ready(function () {

  function sendNote(element) {
    // console.log('Element passed into sendNote:',element)
    // console.log('$(element).attr("data-id") from sendNote:', $(element).attr("data-id"))
    let note = {};
    note.articleId = $(element).attr('data-id'),
    note.title = $('#noteTitleEntry').val().trim();
    note.body = $('#noteBodyEntry').val().trim();
    // console.log('note object created in sendNote:', note)
    $.ajax({
      url: '/createNote',
      type: 'POST',
      data: note,
      success: function (response){
        // console.log('response from success function in sendNote',response);
        showNote(response, note.articleId);
        $('#noteBodyEntry, #noteTitleEntry').val('');
      }
    });
  }

  function showNote(element, articleId){
    // console.log(element)
    // console.log('element.id to see if it exists:', element._id)
    let $title = $('<p>')
      .text(element.title)
      .addClass('noteTitle')
    let $deleteButton = $('<button>')
      .text('X')
      .addClass('btn btn-danger deleteNote');
    let $note = $('<div>')
      .append($title, $deleteButton)
      .attr('data-note-id', element._id)
      .attr('data-article-id', articleId)
      .addClass('note')
      .appendTo('#noteArea')
  }

  $('#alertModal').on('hide.bs.modal', function (e) {
    window.location.href = '/';
  });

  $('#scrape').on('click', function (e){
    e.preventDefault();
    $.ajax({
      url: '/scrape',
      type: 'GET'
    }).done(function (response){
      // console.log('Response from scrape:',response)
      $('#numArticles').text(response.length);
      $('#alertModal').modal('show');
    });
  });

  $('#saveArticle').on('click', function (e) {
    e.preventDefault();
    let id = $(this).data('id');
    $.ajax({
      url: '/save/'+id,
      type: 'GET',
      success: function (result) {
        window.location.href = '/';
      }
    });
  });//end of #saveArticle click preventDefault

  $('.addNote').on('click', function (e){
    $('#noteArea').empty();
    let id = $(this).data('id');
    $('#submitNote, #noteBodyEntry').attr('data-id', id)
    $.ajax({
      url: '/getNotes/'+id,
      type: 'GET',
      success: function (data){
        $.each(data.notes, function (i, item){
          // console.log('Item from each from .addNote click:',item)
          showNote(item, id)
        });
        $('#noteModal').modal('show');
      }
    });
  });//end of #viewSaved click event


  $('#submitNote').on('click', function (e) {
    e.preventDefault();
    console.log('$(this) from #submitNote:',$(this))
    sendNote($(this));
  });

  $('#noteBodyEntry').on('keypress', function (e) {
    if(e.keyCode == 13){
      console.log('$(this) from keypress:',$(this))
      sendNote($(this));
    }
  });

  $('.delete').on('click', function (e){
    e.preventDefault();
    let id = $(this).data('id');
    $.ajax({
      url: '/deleteArticle/'+id,
      type: 'GET',
      success: function (response) {
        window.location.href = '/viewSaved'
      }
    })
  });

  $(document).on('click', '.deleteNote', function (e){
    e.stopPropagation();
    let thisItem = $(this);
    let ids= {
      noteId: $(this).parent().data('note-id'),
      articleId: $(this).parent().data('article-id')
    }
    // console.log('ids from /deleteNote:', ids)
    $.ajax({
      url: '/deleteNote/',
      type: 'POST',
      data: ids,
      success: function (response) {
        // console.log('response from /deleteNote:', response)
        // window.location.href = '/viewSaved'
        thisItem.parent().remove();
      }
    });
  });

  $(document).on('click', '.note', function (e){
    e.stopPropagation();
    let id = $(this).data('note-id');
    console.log('id from getSingleNote:',id)
    $.ajax({
      url: '/getSingleNote/'+id,
      type: 'GET',
      success: function (note) {
        console.log(note)
        $('#noteTitleEntry').val(note.title);
        $('#noteBodyEntry').val(note.body);
      },
      fail: function (error) {
        console.log(error)
      }
    })
  })

});//end of document ready function
