
var textContent = {
    spic:null,
    bf:null,
    sf:null,
    bpic:null,
    init: function () {
        this.spic=$("#spic")
        this.bf= $("#bf")
        this.bpic=$("#bpic")
        this.sf=$("#sf")
        this.bind()
    },
    bind:function () {
        var this_=this
        this.spic.on("mouseover",function(){
            this_.Bgmoseover()
            this_.boxsize()
            this_.spic.on("Sfmoseover",function (ev) {

            })
        })
    },
    Bgmoseover:function () {
        console.log(this.sf)
        this.sf.css({"visibility":"visible"});
        this.bf.css({"visibility":"visible"});
    },
    boxsize:function () {
        console.log(this.spic)
        this.sf.css({"width":this.spic.get(0).offsetWidth*this.bf.get(0).offsetWidth/this.bpic.get(0).offsetWidth+'px'})
        this.sf.css({"height":this.spic.get(0).offsetHeight*this.bf.get(0).offsetHeight/this.bpic.get(0).offsetHeight+'px'})

    },
    Sfmoseover:function (e) {
        console.log(e)
    }
}
$(function () {
   textContent.init()
})
