$(function () {

    //是否有登录的cookie
    console.log(document.cookie);
    if(document.cookie.length > 0) {
        let role = document.cookie.split(";")[0].split("=")[1];
        let name = document.cookie.split(";")[1].split("=")[1];
        $("#username").text(name);
        $("#username").css("color", "red");
    }

    //左侧导航栏切换
    let lis = document.querySelectorAll(".admin-main-left>ul>li");
    let divs = document.querySelectorAll(".admin-main-right>.table");
    let index = 0;
    divs[index].style.display = "block";
    lis[index].style.backgroundColor = "#fff";
    lis[index].style.borderLeft = "2px solid orange";
    for(let i = 0; i < lis.length; i++) {
        lis[i].onmouseenter = function () {
            lis[index].style.borderLeft = "none";
            lis[i].style.borderLeft = "2px solid orange";
            lis[index].style.backgroundColor = "#f4f8f9";
            lis[i].style.backgroundColor = "#fff";
            divs[index].style.display = "none";
            divs[i].style.display = "block";
            index = i;
        }
    }

    //标签数据获取
    let labelPageEvent = function(page) {
        $.ajax({
            type: "get",
            url: "http://localhost:8080/label/search/" + page + "/15",
            success: function (res) {
                console.log(res);
                let table = $("#label_table>table");
                let tbody = $("#label_table>table>tbody");
                tbody.empty();
                for(let i = 0; i < res.data.rows.length; i++) {
                    let tr = $("<tr style=\"font-size: 13px;\" align=\"center\" bgcolor=\"white\"></tr>");
                    let td1 = $("<td style=\"height: 30px;\"></td>");
                    td1.text(res.data.rows[i].labelId);
                    let td2 = $("<td></td>");
                    let input = $("<input type=\"text\" value=\"\" style=\"width: 100%;height: 30px;border: 1px solid #fff;box-sizing: border-box;text-align: center\">");
                    input.val(res.data.rows[i].labelName);
                    td2.append(input);
                    let td3 = $("<td></td>");
                    td3.text("Y");
                    let td4 = $("<td></td>");
                    let button1 = $("<button style=\"font-size: 13px;\">更新</button>");
                    td4.append(button1);
                    let td5 = $("<td></td>");
                    let button2 = $("<button style=\"font-size: 13px;\">删除</button>");
                    td5.append(button2);
                    tr.append(td1);
                    tr.append(td2);
                    tr.append(td3);
                    tr.append(td4);
                    tr.append(td5);
                    tbody.append(tr);
                }
            }
        });
    };
    let label_current_page = 1;
    $("#label_current_page").text(label_current_page);
    labelPageEvent(label_current_page);
    let label_lis = $(".admin>.admin-main>.admin-main-right>#label_table>.page>ul>li>a");
    //上一页
    label_lis.eq(0).click(function () {
        label_current_page = label_current_page - 1;
        $("#label_current_page").text(label_current_page);
        labelPageEvent(label_current_page);
    });
    //下一页
    label_lis.eq(1).click(function () {
        label_current_page = label_current_page + 1;
        $("#label_current_page").text(label_current_page);
        labelPageEvent(label_current_page);
    });
    //页面跳转
    label_lis.eq(2).click(function () {
        label_current_page = parseInt($("#label_turn_page").val());
        $("#label_current_page").text(label_current_page);
        labelPageEvent(label_current_page);
    });

    //更新标签
    $("body").delegate("#label_table>table>tbody>tr>td:nth-child(4)>button", "click", function () {
        let labelId = $(this).parent().parent().find("td:nth-child(1)").text();
        let labelName = $(this).parent().parent().find("td>input").val();
        $.ajax({
            type: "put",
            url: "http://localhost:8080/label/" + labelId,
            data: JSON.stringify({
                "labelName": labelName
            }),
            contentType: "application/json;charset=UTF-8",
            success: function (res) {
                console.log(res);
            }
        })
    });

    //删除标签
    $("body").delegate("#label_table>table>tbody>tr>td:nth-child(5)>button", "click", function () {
        // console.log($(this));
        let labelId = $(this).parent().parent().find("td:nth-child(1)").text();
        $.ajax({
            type: "delete",
            url: "http://localhost:8080/label/" + labelId,
            success: function (res) {
                console.log(res);
                labelPageEvent(label_current_page);
            }
        })
    });

    //添加标签
    let btn = $("#label_table>.page>.add>input[type=button]");
    btn.click(function () {
        let labelName = $("#label_table>.page>.add>input[type=text]").val();
        $.ajax({
            type: "post",
            url: "http://localhost:8080/label",
            data: JSON.stringify({
                "labelName": labelName
            }),
            contentType: "application/json;charset=UTF-8",
            success: function (res) {
                console.log(res);
                labelPageEvent(label_current_page);
            }
        })
    });

    //文章数据获取
    let articlePageEvent = function(page) {
        $.ajax({
            type: "get",
            url: "http://localhost:8080/article/search/" + page + "/15",
            success: function (res) {
                console.log(res);
                let table = $("#article_table>table");
                let tbody = $("#article_table>table>tbody");
                tbody.empty();
                for(let i = 0; i < res.data.rows.length; i++) {
                    let tr = $("<tr style=\"font-size: 13px;\" align=\"center\" bgcolor=\"white\"></tr>");
                    let td1 = $("<td style=\"height: 30px;\"></td>");
                    td1.text(res.data.rows[i].articleId);
                    let td2 = $("<td></td>");
                    td2.text(res.data.rows[i].title);
                    let td3 = $("<td></td>");
                    td3.text(res.data.rows[i].catalog.catalogName);
                    let td4 = $("<td></td>");
                    let label = "";
                    if(res.data.rows[i].labelList.length > 0) {
                        for(let j = 0; j < res.data.rows[i].labelList.length - 1; j++) {
                            label = label + res.data.rows[i].labelList[j].labelName + " - ";
                        }
                        label = label + res.data.rows[i].labelList[res.data.rows[i].labelList.length - 1].labelName;
                    }
                    td4.text(label);
                    let td5 = $("<td></td>");
                    td5.text(res.data.rows[i].createTime);
                    let td6 = $("<td></td>");
                    td6.text("Y");
                    let td7 = $("<td><button style=\"font-size: 13px;\">修改</button>&nbsp;&nbsp;<button style=\"font-size: 13px;\">删除</button></td>");
                    tr.append(td1);
                    tr.append(td2);
                    tr.append(td3);
                    tr.append(td4);
                    tr.append(td5);
                    tr.append(td6);
                    tr.append(td7);
                    tbody.append(tr);
                }
            }
        });
    };

    //修改
    $("body").delegate("#article_table>table>tbody>tr>td>button:nth-child(1)", "click", function () {
        let articleId = $(this).parent().parent().children().eq(0).text();
        console.log(articleId);
        window.location.href = "modify.html?id=" + articleId;
    });

    //删除
    $("body").delegate("#article_table>table>tbody>tr>td>button:nth-child(2)", "click", function () {
        let articleId = $(this).parent().parent().children().eq(0).text();
        $.ajax({
            type: "delete",
            url: "http://localhost:8080/article/" + articleId,
            success: function (res) {
                console.log(res);
                articlePageEvent(article_current_page);
            }
        })
    });

    let article_current_page = 1;
    $("#article_current_page").text(article_current_page);
    articlePageEvent(article_current_page);

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

});
