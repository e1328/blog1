$(function () {

    //热门标签
    $.ajax({
        type: "get",
        url: "http://localhost:8080/label",
        success: function (res) {
            let arr = res.data;
            let ul = $(".hot-label>ul");
            for(let i = 0; i < arr.length; i++) {
                let li = $("<li></li>");
                let a = $("<a href='#'></a>");
                a.text(arr[i].labelName);
                li.append(a);
                ul.append(li);
            }
        }
    });

    //分类目录
    $.ajax({
        type: "get",
        url: "http://localhost:8080/catalog",
        success: function (res) {
            let arr = res.data;
            let ul = $(".catalog>ul");
            for(let i = 0; i < arr.length; i++) {
                let li = $("<li></li>");
                let a = $("<a href='#'></a>");
                a.text(arr[i].catalogName);
                li.append(a);
                ul.append(li);
            }
        }
    });

    //友情链接
    $.ajax({
        type: "get",
        url: "http://localhost:8080/link",
        success: function (res) {
            let arr = res.data;
            let ul = $(".friend-link>ul");
            for(let i = 0; i < arr.length; i++) {
                let li = $("<li></li>");
                let a = $("<a href='#'></a>");
                a.text(arr[i].linkName);
                a.prop("href", arr[i].linkUrl);
                li.append(a);
                ul.append(li);
            }
        }
    });

    //博客文章
    $.ajax({
        type: "get",
        url: "http://localhost:8080/article",
        success: function (res) {
            let arr = res.data;
            let contentLeft = $(".content-left");
            for(let i = 0; i < arr.length; i++) {
                let div = $("<div class='common'></div>");
                let span = $("<span></span>");
                span.text(arr[i].title);
                let br1 = $("<br/>");
                let br2 = $("<br/>");
                let p = $(`<p>发布于 <a href=\"#\">${arr[i].createTime.substring(0, 10)}</a>。 属于 <a href=\"#\">${arr[i].catalog.catalogName}</a> 分类，被贴了 <a href=\"#\">${arr[i].labelList[0].labelName}</a> - <a href=\"#\">${arr[i].labelList[0].labelName}</a> - <a href=\"#\">${arr[i].labelList[0].labelName}</a> 标签</p>`);
                div.append(span);
                div.append(br1);
                div.append(br2);
                div.append(p);
                contentLeft.append(div);
            }
        },
        error: function () {
            console.warn("请求失败");
        }
    });

    //登录、注册、管理员登录
    let oLoginBtn = $("#login");
    let oRegisterBtn = $("#register");
    let oAdminBtn = $("#admin");
    let oCloseBtn1 = $("#close1");
    let oCloseBtn2 = $("#close2");
    let oCloseBtn3 = $("#close3");
    let oMaskDiv = $(".mask");
    let oLoginDiv = $(".login");
    let oRegisterDiv = $(".register");
    let oAdminDiv = $(".admin");
    oLoginBtn.click(function () {
        oMaskDiv.css("display", "block");
        oLoginDiv.css("display", "block");
    });
    oCloseBtn1.click(function () {
        oMaskDiv.css("display", "none");
        oLoginDiv.css("display", "none");
    });
    oRegisterBtn.click(function () {
        oMaskDiv.css("display", "block");
        oRegisterDiv.css("display", "block");
    });
    oCloseBtn2.click(function () {
        oMaskDiv.css("display", "none");
        oRegisterDiv.css("display", "none");
    });
    oAdminBtn.click(function () {
        oMaskDiv.css("display", "block");
        oAdminDiv.css("display", "block");
    });
    oCloseBtn3.click(function () {
        oMaskDiv.css("display", "none");
        oAdminDiv.css("display", "none");
    });
});
