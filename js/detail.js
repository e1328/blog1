$(function () {

    //是否有登录的cookie
    console.log(document.cookie);
    if(document.cookie.length > 0) {
        let role = document.cookie.split(";")[0].split("=")[1];
        let name = document.cookie.split(";")[1].split("=")[1];
        $("#login").css("display", "none");
        $("#register").css("display", "none");
        $("#username").css("display", "inline");
        $("#logout").css("display", "inline");
        $("#username").text(name);
        if(role === "user") {
            $("#username").css("color", "orange");
        }else if(role === "admin") {
            $("#username").css("color", "red");
        }
    }

    //热门标签
    $.ajax({
        type: "get",
        url: "http://localhost:8080/label",
        dataType: "json",
        success: function (res) {
            console.log(res);
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
            if(res.data.labelList.length > 0) {
                p.append("，被贴了 ");
                for(let i = 0; i < res.data.labelList.length - 1; i++) {
                    let a = $("<a href='#'></a>");
                    a.text(res.data.labelList[i].labelName);
                    p.append(a);
                    p.append(" - ");
                }
                p.append(`<a href="#">${res.data.labelList[res.data.labelList.length - 1].labelName}</a>`);
                p.append(" 标签");
            }
            div.after(p);
        }
    });

    //格式化date时间
    function getNowFormatDate() {
        var date = new Date();
        var seperator1 = "-";
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        var currentdate = year + seperator1 + month + seperator1 + strDate;
        return currentdate;
    }

    //文章评论
    let btn = $("#btn");
    btn.click(function () {
        let userId = 0;
        if(document.cookie.length > 0) {
            let role = document.cookie.split(";")[0].split("=")[1];
            let name = document.cookie.split(";")[1].split("=")[1];
            $.ajax({
                type: "get",
                url: "http://localhost:8080/user/search",
                data: "username=" + name,
                success: function (res) {
                    console.log(res);
                    userId = res.data.userId;
                    let content = $("#content").val();
                    $.ajax({
                        type: "post",
                        url: "http://localhost:8080/comment",
                        data: JSON.stringify({
                            "userId": userId,
                            "articleId": id,
                            "content": content,
                            "createTime": getNowFormatDate()
                        }),
                        dataType: "json",
                        contentType: "application/json;charset=UTF-8",
                        success: function (res) {
                            console.log(res);
                            window.location.reload();
                        }
                    })
                }
            });
        }else{
            alert("请先登录");
        }
    });

    //遍历评论
    $.ajax({
        type: "get",
        url: "http://localhost:8080/comment/" + id,
        success: function (res) {
            console.log(res);
            let div = $("#comment-bottom");
            let ul = $("<ul></ul>");
            for(let i = 0; i < res.data.length; i++) {
                let li = $("<li></li>");
                let p1 = $("<p></p>");
                let label1 = $("<label>评论内容：</label>");
                let span1 = $("<span></span>");
                span1.text(res.data[i].content);
                p1.append(label1);
                p1.append(span1);
                let p2 = $("<p></p>");
                let label2 = $("<label>评论人：</label>");
                let span2 = $("<span></span>");
                span2.text(res.data[i].user.username);
                p2.append(label2);
                p2.append(span2);
                let p3 = $("<p></p>");
                let label3 = $("<label>评论时间：</label>");
                let span3 = $("<span></span>");
                span3.text(res.data[i].createTime);
                p3.append(label3);
                p3.append(span3);
                li.append(p1);
                li.append(p2);
                li.append(p3);
                ul.append(li);
            }
            div.append(ul);
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
        console.log(document.cookie);
        //有admin信息直接跳转
        if(document.cookie.length > 0) {
            let role = document.cookie.split(";")[0].split("=")[1];
            let name = document.cookie.split(";")[1].split("=")[1];
            if(role === "admin") {
                window.location.href = "admin.html";
                return;
            }
        }

        oMaskDiv.css("display", "block");
        oAdminDiv.css("display", "block");
    });
    oCloseBtn3.click(function () {
        oMaskDiv.css("display", "none");
        oAdminDiv.css("display", "none");
    });

    //注册
    let registerBtn = $(".register>form>table>tbody>tr:nth-child(5)>td>input[type=button]");
    registerBtn.click(function () {
        let username = $(".register>form>table>tbody>tr:nth-child(1)>td>input[type=text]").val();
        let telephone = $(".register>form>table>tbody>tr:nth-child(2)>td>input[type=text]").val();
        let password = $(".register>form>table>tbody>tr:nth-child(3)>td>input[type=password]").val();
        $.ajax({
            type: "post",
            url: "http://localhost:8080/user",
            data: JSON.stringify({
                "username": username,
                "telephone": telephone,
                "password": password,
                "createTime": new Date()
            }),
            dataType: "json",
            contentType: "application/json;charset=UTF-8",
            success: function (res) {
                console.log(res);
                if(res.flag === true) {
                    window.location.href = "index.html";
                }else {
                    alert("注册失败！");
                }
            }
        })
    });

    //登录
    let loginBtn = $(".login>form>input[type=button]");
    loginBtn.click(function () {
        let username = $(".login>form>input[type=text]").val();
        let password = $(".login>form>input[type=password]").val();
        $.ajax({
            type: "post",
            url: "http://localhost:8080/user/login",
            data: JSON.stringify({
                "username": username,
                "password": password
            }),
            dataType: "json",
            contentType: "application/json;charset=UTF-8",
            success: function (res) {
                console.log(res);
                if(res.flag === true) {
                    let date = new Date();
                    date.setTime(date.getTime() + 3600 * 1000);
                    document.cookie = "role=user;path=/;expires=" + date;
                    document.cookie = "name=" + res.data.username +";path=/;expires=" + date;
                    window.location.href = "index.html";
                }else{
                    alert("用户名或密码错误！");
                }
            }
        })
    });

    //注销
    let logoutBtn = $("#logout");
    logoutBtn.click(function () {
        let name = document.cookie.split(";")[1].split("=")[1];
        let date = new Date();
        date.setTime(date.getTime() - 24 * 3600 * 1000);
        document.cookie = "role=user;path=/;expires=" + date;
        document.cookie = "name=" + name + ";path=/;expires=" + date;
        window.location.href = "index.html";
    });

    //管理员登录
    let adminBtn = $(".admin>form>input[type=button]");
    adminBtn.click(function () {
        let username = $(".admin>form>input[type=text]").val();
        let password = $(".admin>form>input[type=password]").val();
        $.ajax({
            type: "post",
            url: "http://localhost:8080/admin/login",
            data: JSON.stringify({
                "username": username,
                "password": password
            }),
            dataType: "json",
            contentType: "application/json;charset=UTF-8",
            success: function (res) {
                console.log(res);
                if(res.flag === true) {
                    let date = new Date();
                    date.setTime(date.getTime() + 3600 * 1000);
                    document.cookie = "role=admin;path=/;expires=" + date;
                    document.cookie = "name=" + res.data.username +";path=/;expires=" + date;
                    window.location.href = "admin.html";
                }else{
                    alert("账号或密码错误！");
                }
            }
        })
    })

});
