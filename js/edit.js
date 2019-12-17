$(function () {

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

    //标签数据
    $.ajax({
        type: "get",
        url: "http://localhost:8080/label",
        success: function (res) {
            console.log(res);
            let select = $(".edit>.edit-main>.label>select");
            for(let i = 0; i < res.data.length; i++) {
                let option = $("<option value=\"\"></option>");
                option.prop("value", res.data[i].labelName);
                option.text(res.data[i].labelName);
                select.append(option);
            }
        }
    });

    //分类目录数据
    $.ajax({
        type: "get",
        url: "http://localhost:8080/catalog",
        success: function (res) {
            console.log(res);
            let select = $(".edit>.edit-main>.catalog>select");
            for(let i = 0; i < res.data.length; i++) {
                let option = $("<option value=\"\"></option>");
                option.prop("value", res.data[i].catalogName);
                option.text(res.data[i].catalogName);
                select.append(option);
            }
        }
    });

    let addLabelBtn = $(".edit>.edit-main>.label>button");
    addLabelBtn.click(function () {
        let input = $("<input type=\"text\" style='width: 80px;text-indent: 1em'><span>-</span>");
        addLabelBtn.before(input);
    });

    $("body").delegate(".edit>.edit-main>.label>span", "click", function () {
        $(this).click(function () {
            $(this).prev().remove();
            $(this).remove();
        })
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
        input.css("display", "none");
        $(this).css("display", "none");
        addCatalogBtn.css("display", "inline");
    });

    //发布博客
    let putBtn = $("#put");
    putBtn.click(function () {
        let title = $("#title").val();
        let content = editor.txt.html();
        let obj = {
            "title": title,
            "content": content,
            "catalogId": 1,
            "createTime": new Date(),
            "isTop": 1
        };
        $.ajax({
            type: "post",
            url: "http://localhost:8080/article",
            data: JSON.stringify(obj),
            contentType: "application/json;charset=UTF-8",
            success: function (data) {
                console.log(data);
            },
            error: function (xhr) {
                console.log("请求失败");
            }
        })
    });

});
