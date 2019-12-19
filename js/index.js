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

    //博客文章
    $.ajax({
        type: "get",
        url: "http://localhost:8080/article",
        success: function (res) {
            console.log(res);
            let arr = res.data;
            let contentLeft = $(".content-left");
            for(let i = 0; i < arr.length; i++) {
                let div = $("<div class='common'></div>");
                let h4 = $("<h4></h4>");
                let a = $("<a href='#'></a>");
                a.text(arr[i].title);
                a.prop("id", arr[i].articleId);
                a.prop("href", "detail.html?id=" + arr[i].articleId);
                h4.append(a);
                let br = $("<br/>");
                let p = $("<p></p>");
                p.append(`发布于 <a href=\"#\">${arr[i].createTime.substring(0, 10)}</a>。`);
                p.append(`属于 <a href=\"#\">${arr[i].catalog.catalogName}</a> 分类`);
                if(arr[i].labelList.length > 0) {
                    p.append("，被贴了 ");
                    for(let j = 0; j < arr[i].labelList.length - 1; j++) {
                        let a = $("<a href='#'></a>");
                        a.text(arr[i].labelList[j].labelName);
                        p.append(a);
                        p.append(" - ");
                    }
                    p.append(`<a href="#">${arr[i].labelList[arr[i].labelList.length - 1].labelName}</a>`);
                    p.append(" 标签");
                }
                div.append(h4);
                div.append(br);
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
