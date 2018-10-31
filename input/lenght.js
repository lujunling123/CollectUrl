var textContent1 = {
    input : null,
    init : function (config) {
        this.input = $(config.id)
        this.bind()
        return this
    },
    bind : function () {
        var self = this
        this.input.on('keyup',function(){
            self.render();
        });
    },
    gitNum : function(){
        return this.input.val().length
    },
    render : function () {
        var num = this.gitNum()
        if ($('#J_input_count').length == 0) {
            this.input.after('<span id="J_input_count"></span>');
        }
        $('#J_input_count').html(num+'个字')
    }
}
var textContent2 = (function(){
    var _bind = function (that) {
        that.input.on('keyup',function () {
            that.render()
        })
    }
    var _getNum = function(that){
        return that.input.val().length
    }
    var TextCountFun = function(config){

    }
    TextCountFun.prototype.init = function (config) {
        this.input = $(config.id)
        _bind(this)
        return this
    }
    TextCountFun.prototype.render = function () {
        var num = _getNum(this)
        if ($('#J_input_count').length == 0) {
            this.input.after('<span id="J_input_count"></span>');
        }
        $('#J_input_count').html(num+'个字');
    }
    return TextCountFun;
})();

jQuery(function() {
    //在domready后调用textContent1第一种写法 作用域隔离
    /*textContent1.init({id:'#J_input'}).render();*/

    /*函数闭包  写法 textContent2*/
    new textContent2().init({id:'#J_input'}).render();
})


