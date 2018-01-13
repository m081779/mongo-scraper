$(document).ready(function () {

  function sendNote(element) {
    let note = {};
    note.articleId = $(element).attr('data-id'),
    note.title = $('#noteTitleEntry').val().trim();
    note.body = $('#noteBodyEntry').val().trim();
    if (note.title && note.body){
      $.ajax({
        url: '/createNote',
        type: 'POST',
        data: note,
        success: function (response){
          showNote(response, note.articleId);
          $('#noteBodyEntry, #noteTitleEntry').val('');
        },
        error: function (error) {
          showErrorModal(error);
        }
      });
    }
  }//end of sendNote function

  function showErrorModal(error) {
    $('#error').modal('show')
  }

  function showNote(element, articleId){
    let $title = $('<p>')
      .text(element.title)
      .addClass('noteTitle')
    let $deleteButton = $('<button>')
      .text('X')
      .addClass('deleteNote');
    let $note = $('<div>')
      .append($deleteButton, $title)
      .attr('data-note-id', element._id)
      .attr('data-article-id', articleId)
      .addClass('note')
      .appendTo('#noteArea')
  }//end of showNote function

  $('#alertModal').on('hide.bs.modal', function (e) {
    window.location.href = '/';
  });

  $('#scrape').on('click', function (e){
    e.preventDefault();
    $.ajax({
      url: '/scrape/newArticles',
      type: 'GET',
      success: function (response) {
        console.log('Response from scrape:',response)
        $('#numArticles').text(response.count);
        $('#alertModal').modal('show');
      },
      error: function (error) {
        showErrorModal(error);
      }
    });
  });//end of #scrape click event

  $(document).on('click', '#saveArticle', function (e) {
    // e.preventDefault();
    console.log('firing inside click');
    let articleId = $(this).data('id');
    $.ajax({
      url: '/save/'+articleId,
      type: 'GET',
      success: function (response) {
        console.log('firing inside success');
        window.location.href = '/';
      },
      error: function (error) {
        showErrorModal(error);
      }
    });
  });//end of #saveArticle click event

  $('.addNote').on('click', function (e){
    $('#noteArea').empty();
    $('#noteTitleEntry, #noteBodyEntry').val('');
    let id = $(this).data('id');
    $('#submitNote, #noteBodyEntry').attr('data-id', id)
    $.ajax({
      url: '/getNotes/'+id,
      type: 'GET',
      success: function (data){
        $.each(data.notes, function (i, item){
          showNote(item, id)
        });
        $('#noteModal').modal('show');
      },
      error: function (error) {
        showErrorModal(error);
      }
    });
  });//end of .addNote click event


  $('#submitNote').on('click', function (e) {
    e.preventDefault();
    sendNote($(this));
  });//end of #submitNote click event

  $('#noteBodyEntry').on('keypress', function (e) {
    if(e.keyCode == 13){
      sendNote($(this));
    }
  });//end of #noteBodyEntry keypress(enter) event

  $('.deleteArticle').on('click', function (e){
    e.preventDefault();
    let id = $(this).data('id');
    $.ajax({
      url: '/deleteArticle/'+id,
      type: 'GET',
      success: function (response) {
        window.location.href = '/viewSaved'
      },
      error: function (error) {
        showErrorModal(error);
      }
    })
  });//end of .deleteArticle click event

  $(document).on('click', '.deleteNote', function (e){
    e.stopPropagation();
    let thisItem = $(this);
    let ids= {
      noteId: $(this).parent().data('note-id'),
      articleId: $(this).parent().data('article-id')
    }

    $.ajax({
      url: '/deleteNote',
      type: 'POST',
      data: ids,
      success: function (response) {
        thisItem.parent().remove();
      },
      error: function (error) {
        showErrorModal(error);
      }
    });
  });//end of .deleteNote click event

  $(document).on('click', '.note', function (e){
    e.stopPropagation();
    let id = $(this).data('note-id');
    $.ajax({
      url: '/getSingleNote/'+id,
      type: 'GET',
      success: function (note) {
        $('#noteTitleEntry').val(note.title);
        $('#noteBodyEntry').val(note.body);
      },
      error: function (error) {
        showErrorModal(error);
      }
    })
  })//end of .note click event

});//end of document ready function
