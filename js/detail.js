$(function () {
    //显示文章内容
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
            let p = $("<p></p>");
            p.append(`发布于 <a href=\"#\">${res.data.createTime.substring(0, 10)}</a>。`);
            p.append(`属于 <a href=\"#\">${res.data.catalog.catalogName}</a> 分类`);
            p.append("，被贴了 ");
            for(let i = 0; i < res.data.labelList.length - 1; i++) {
                let a = $("<a href='#'></a>");
                a.text(res.data.labelList[i].labelName);
                p.append(a);
                p.append(" - ");
            }
            p.append(`<a href="#">${res.data.labelList[res.data.labelList.length - 1].labelName}</a>`);
            p.append(" 标签");
            div.after(p);
        }
    })
});
