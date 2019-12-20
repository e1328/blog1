$(function () {

    //验证管理员登录
    let role = localStorage.getItem("role");
    console.log(role);
    if(role !== "admin") {
        window.location.href = "index.html";
    }

    //富文本编辑器
    var E = window.wangEditor;
    var editor = new E('#div1', '#div2'); // 两个参数也可以传入 elem 对象，class 选择器
    editor.create();
    // document.getElementById('btn1').addEventListener('click', function () {
    //     // 读取 html
    //     alert(editor.txt.html());
    // }, false);
    // document.getElementById('btn2').addEventListener('click', function () {
    //     // 读取 text
    //     alert(editor.txt.text());
    // }, false);

    let labelArr = [];

    //标签数据
    // $.ajax({
    //     type: "get",
    //     url: "http://localhost:8080/label",
    //     success: function (res) {
    //         console.log(res);
    //         let select = $(".edit>.edit-main>.label>select");
    //         for(let i = 0; i < res.data.length; i++) {
    //             let option = $("<option value=\"\"></option>");
    //             option.prop("value", res.data[i].labelName);
    //             option.text(res.data[i].labelName);
    //             select.append(option);
    //         }
    //     }
    // });

    //分类目录数据
    let catalogGet = function() {
        $.ajax({
            type: "get",
            url: "http://localhost:8080/catalog",
            success: function (res) {
                console.log(res);
                let select = $(".edit>.edit-main>.catalog>select");
                select.empty();
                for(let i = 0; i < res.data.length; i++) {
                    let option = $("<option value=\"\"></option>");
                    option.prop("value", res.data[i].catalogId);
                    option.text(res.data[i].catalogName);
                    select.append(option);
                }
            }
        });
    };

    catalogGet();

    let addLabelBtn = $(".edit>.edit-main>.label>button");
    addLabelBtn.click(function () {
        let input = $("<input type=\"text\" style='width: 80px;text-indent: 1em'><button class='del'>-</button>");
        addLabelBtn.before(input);
    });

    //删除标签
    $("body").delegate(".edit>.edit-main>.label>.del", "click", function () {
        let value = $(this).prev().val();
        let index = labelArr.indexOf(value);
        labelArr.splice(index, 1);
        // console.log(labelArr);
        $(this).prev().remove();
        $(this).remove();
    });

    //获取焦点
    $("body").delegate(".edit>.edit-main>.label>input", "focus", function () {
        let value = $(this).val();
        let index = labelArr.indexOf(value);
        console.log(index);
        if(index !== -1) {
            labelArr.splice(index, 1);
        }
        console.log(labelArr);
    });

    //失去焦点
    $("body").delegate(".edit>.edit-main>.label>input", "blur", function () {
        labelArr.push($(this).val());
        console.log(labelArr);
    });

    let addCatalogBtn = $(".edit>.edit-main>.catalog>button:nth-of-type(1)");
    let saveCatalogBtn = $(".edit>.edit-main>.catalog>button:nth-of-type(2)");
    let input = $(".edit>.edit-main>.catalog>input");

    addCatalogBtn.click(function () {
        input.css("display", "inline");
        $(this).css("display", "none");
        saveCatalogBtn.css("display", "inline");
    });

    saveCatalogBtn.click(function () {
        //保存目录
        let catalogName = input.val();
        $.ajax({
            type: "post",
            url: "http://localhost:8080/catalog",
            data: JSON.stringify({
                "catalogName": catalogName,
                "is_top": 0
            }),
            dataType: "json",
            contentType: "application/json;charset=UTF-8",
            success: function (res) {
                console.log(res);
                catalogGet();
            }
        });

        // console.log(catalogName);
        input.val("");
        input.css("display", "none");
        $(this).css("display", "none");
        addCatalogBtn.css("display", "inline");
    });

    //显示要修改的文章内容
    let str = window.location.search;
    let start = str.indexOf("=");
    let res = str.substr(start + 1);
    let id = parseInt(res);
    console.log(id);

    $.ajax({
        type: "get",
        url: "http://localhost:8080/article/" + id,
        success: function (res) {
            console.log(res);
            $("#title").val(res.data.title);
            editor.txt.html(res.data.content);
            let options = $(".edit>.edit-main>.catalog>select>option");
            console.log(res.data.catalog.catalogName);
            for(let i = 0; i < options.length; i++) {
                // console.log(options[i].innerText);
                if(options[i].innerText === res.data.catalog.catalogName) {
                    options[i].selected = true;
                }
            }
            let label = $(".edit>.edit-main>.label>label");
            for(let i = 0; i < res.data.labelList.length; i++) {
                let input = $("<input type=\"text\" style='text-indent: 1em'>");
                input.val(res.data.labelList[i].labelName);
                let button = $("<button class='del'>-</button>");
                label.after(input);
                input.after(button);
                console.log(res.data.labelList[i].labelName);
                labelArr.push(res.data.labelList[i].labelName);
            }
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

    //修改博客
    let select = $(".edit>.edit-main>.catalog>select");
    let putBtn = $("#put");
    putBtn.click(function () {
        let title = $("#title").val();
        let content = editor.txt.html();
        let obj = {
            "articleId": id,
            "title": title,
            "content": content,
            "catalogId": select.val(),
            "createTime": getNowFormatDate(),
            "isTop": 0
        };
        console.log(title);
        console.log(content);
        console.log(select.val());
        console.log(labelArr);
        // return false;
        $.ajax({
            type: "put",
            url: "http://localhost:8080/article?labelArr=" + labelArr,
            data: JSON.stringify(obj),
            contentType: "application/json;charset=UTF-8",
            success: function (res) {
                console.log(res);
                if(res.flag === true) {
                    window.location.href = "index.html";
                } else {
                    alert("修改失败");
                }
            },
            error: function (xhr) {
                console.log("请求失败");
            }
        })
    });

});
