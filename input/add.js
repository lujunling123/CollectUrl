var inputData=[], inputval=[]
var renzheng=false
$(function () {
    $('.add_yy').click(function () {
        addChilde()
    })
    function addChilde () {
        var addyy = $('.yy_add div')
        $('.yy_add').append('<div id="add" class="add">'+addyy[1].innerHTML+'</div>')
    }
    function fabuACtion () {
        var dutttt=false
        var butdiv= $('.yy_add .add')
        for (var i=0; i<butdiv.length;i++) {
            var item = $(butdiv[i]).children()
            for (var j=1;j<item.length;j++) {
                inputval.push(item[j].value)
                if(j>=3){
                    dutttt=true
                }
            }
            if(dutttt){
                inputData.push(inputval)
                inputval=[]
            }
        }
        console.log(inputData)
        renzheng=true
        deleted()
    }
    function deleted () {
        if (renzheng) {
            inputData=[]
        }
    }
    function addBut () {
        var p = '<p id="button">发布</p>'
        $('.two_add').after(p)
        $('#button').click(function () {
            fabuACtion()
        })
    }
    addBut()
});
function deleteRow (item) {
    console.log($(item).parent().prev())
    // $(item).parent().remove()
}
