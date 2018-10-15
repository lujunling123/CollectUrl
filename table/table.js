window.onload=function(){
  var json=[{id:'1',name:'张三',age:20},{id:'1',name:'李四',age:20},{id:'1',name:'王五',age:20}]
  createTable();
  function createTable () {
    var table = document.createElement('table')
    for (var i=0; i<json.length; i++){
      var tr =document.createElement('tr')
      table.appendChild(tr)
      var item = json[i]
      var n = 0;
      for(var j in item){
        n++;
        var td =document.createElement('td')
        td.setAttribute('class','td_class')
        td.innerHTML=item[j]
        tr.appendChild(td)
      }
    }
    var aaa = document.getElementById('aaa')
    aaa.appendChild(table)
    addClickEvent('td_class')
  }
  function addClickEvent (value) {
    var item = document.getElementsByClassName(value)
    for (var i=0;i<item.length;i++) {
      var itemval= item[i]
      itemval.onclick=overEvent
    }
  }
  function overEvent () {
    if (this.style.background=='') {
      this.style.background='pink'
    }else{
      this.style.background=''
    }
    console.log(value)
    // 想进行的操作
  }
}
