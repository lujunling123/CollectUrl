"use strict";
/*JavaScript写法指南*/
/*匿名函数写法
1.他叫做立即运行的匿名函数(也叫立即调用函数)
2.当一个匿名函数被括起来，然后再在后面加一个括号，这个匿名函数就能立即运行起来！*/
(function(){})();
!function(){}();
+function(){}();
-function(){}();
~function(){}();
~(function(){})();
void function(){}();
(function(){}());

// if_else使用!!符号代替
var isValid = !!(value && value !== 'error');

(function( factory ) {
    if ( typeof define === "function" && define.amd ) {
        // AMD. Register as an anonymous module.
        define( [ "jquery" ], factory );
    } else {
        // Browser globals
        factory( jQuery );
    }
}(function( $ ) {
    // 这里放模块代码
    return $.widget;
}));

/*Function构造函数*/
var f = new Function('a', 'alert(a)');
f('test'); // 将会弹出窗口显示test


// 解决ajax不能指甲上传图片的问题
var item = {}
var form = new FormData();
item.file= $("#uploadFile")[0].files[0]
item.enctype = "multipart/form-data";  //重要
for(var p in item) {
    form.append( p , item[p])
}
$.ajax({
    url: 'upload.url', //用于文件上传的服务器端请求地址
    type:'post',
    data:form,
    processData:false,//用于对data参数进行序列化处理 这里必须false
    contentType: false,//必须
    dataType: 'json', //返回值类型一般设置为json
    success: function (data)  //服务器成功响应处理函数
    {
        if(data){
            alert('上传成功！')
        }else{
            alert("上传失败！");
        }
    }
})

//循环体：筛选出数组中符合条件的数据(相同从数组中去除，不同加入数组中)
var retur = [{id_:1},{id_:2},{id_:3}]
var row = {id_:5}
var has = false;
for (var i = 0; i < retur.length; i++) {
    var item = retur[i];
    if (item.id_ === row.id_){
        retur.splice(i, 1);
        has = true;
    }
}
if (!has){
    retur.push(row);
}

/*图片编码格式有三种三者皆可相互转换
1.base64
2.formdata
3.二进制*/


// 使用var _this = this
// 问题一:
//     不知道楼主有没有接触过jquery jquery里边有一个特别典型的例子能说明用_this的作用
// $("#btn").click(function(){
//     var _this = this;//这里this和_this都代表了"#btn"这个对象
//     $(".tr").each(function(){
//         this;//在这里this代表的是每个遍历到的".tr"对象
//         _this;//仍代表"#btn"对象
//     })
// })
// 这种情况就是在一个代码片段里this有可能代表不同的对象,而编码者希望_this代表最初的对象
// 问题2:
    // 其实并没有全部使用_this
    // 但是据我所看,应该没有任何区别的,楼主的代码里用_this可能只是为了编码规范吧
