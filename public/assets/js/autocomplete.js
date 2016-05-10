$(function() {
    function log( message ) {
      $( "<div>" ).text( message ).prependTo( "#log" );
      $( "#log" ).scrollTop( 0 );
    }

$.ui.autocomplete.prototype._renderItem = function (ul, item) {
    var re = new RegExp($.trim(this.term));
    var t = item.label.replace(re, "<span style='font-weight:600;color:#5C5C5C;'>" + $.trim(this.term) +
        "</span>");
    return $("<li></li>")
        .data("item.autocomplete", item)
        .append("<a>" + t + "</a>")
        .appendTo(ul);
};
});

