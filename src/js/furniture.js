 //button load more

const btnLoadMore = $('#loadMore');

$('.furniture__box').slice(0, 9).removeClass('furniture__box_hidden');
if ($('.furniture__box.furniture__box_hidden').length !== 0) {
    $(btnLoadMore ).show();
}

$(btnLoadMore ).on('click', function (event) {
    event.preventDefault();
    $('.furniture__box.furniture__box_hidden').slice(0, 3).removeClass('furniture__box_hidden');
    if ($('.furniture__box.furniture__box_hidden').length === 0) {
        $(btnLoadMore).fadeOut('slow');
    }
});
