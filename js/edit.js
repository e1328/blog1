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
