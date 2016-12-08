$("#wrapper").append("<div id='debug'><p></p></div>");
console.original = console.log;//上書き前に退避して
console.log = function() {
    var texts = [];
    for (var i in arguments) 
    {
        texts.push(arguments[i]);
    }
    var html = texts.join("<br>");
    var p = $("#debug p").html();
    $("#debug p").html(p + "<br>"+ html);
};
