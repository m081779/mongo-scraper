$(document).ready(function () {
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
    $('#submitNote').attr('data-id', id)
    $.ajax({
      url: '/getNotes/'+id,
      type: 'GET',
      success: function (data){
        console.log(data)
        $.each(data, function (i, item){
          let p = $('<p>').text(item);

          $('#noteArea').append(p);
        });
        $('#noteModal').modal('show');
      }
    });
  });//end of #viewSaved click event

  $('#submitNote').on('click', function (e) {
    e.preventDefault();
    let note = {};
    note.id = $(this).data('id'),
    note.text = $('#note').val().trim();
    $.ajax({
      url: '/createNote',
      type: 'POST',
      data: note,
      success: function (response){
        $('#note').val('');
      }
    });
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
  })

});//end of document ready function
