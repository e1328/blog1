$(function () {
    let str = window.location.search;
    let start = str.indexOf("=");
    let res = str.substr(start + 1);
    let id = parseInt(res);
    $.ajax({
        type: "get",
        url: "http://localhost:8080/article/" + id,
        dataType: "json",
        success: function (res) {
            let a = $("#article>h4>a");
            a.text(res.data.title);
            let div = $("#article>.article-main");
            div.html(res.data.content);
        }
    })
});
