var AppDivs = {};
AppDivs.numsUsed = [];
AppDivs.amntUsed = [];

var AppGraph = {};
AppGraph.dom = document.getElementById("graph");
AppGraph.g = AppGraph.dom.getContext('2d');
AppGraph.pointSize = 1;
AppGraph.g.fillText("Bruh, like, bruh",30,30)
AppGraph.size = {w:Number(AppGraph.dom.width),h:Number(AppGraph.dom.height)};

AppGraph.clear = function() {
    AppGraph.g.fillStyle = "white";
    AppGraph.g.fillRect(0,0,AppGraph.size.w,AppGraph.size.h);
}

AppGraph.draw = function(data,mode) {
    if(typeof(data)!="object")
        return;
    if(data.length==0)
        return;
    if(typeof(data.x)=="number"&&typeof(data.y)=="number") {//Just one point
        AppGraph.point(data.x,data.y);
    } else {
        for(p of data) {
            if(typeof(p.x)=="number"&&typeof(p.y)=="number") {
                if(mode=="point")
                    AppGraph.point(p.x,p.y);
                if(mode=="line") {
                    AppGraph.g.moveTo(p.x,p.y);
                    mode = "line2";
                }
                if(mode=="line2") {
                    AppGraph.g.lineTo(p.x,p.y);
                }
            }
        }
        switch(mode) {
            case "line2":
                AppGraph.g.stroke();
                break;
        }
    }
}
AppGraph.point = function(x,y) {
    with(AppGraph) {
        g.beginPath();
        g.arc(x,y,pointSize,0,Math.PI*2);
        g.fill();
    }
}

AppDivs.getDivs = function(n) {
    AppDivs.numsUsed = [];
    AppDivs.primes = [];
    if(n==0)return 0;
    if(n==1)return 1;
    if(n==2)return 2;
    /*if(n==1)return 1;
    if(n==2)return 2;*/
    AppDivs.factorize(n);
    res = AppDivs.numsUsed.length;
    console.log("%i has %i divs",n,res);
    return res;
}

AppDivs.factorize = function(n) {//40
    var limit = Math.sqrt(n);
    //console.log("Limiting search to %1.23f",limit);
    for(var i=1;i<=limit;i++) {
        if(n%i==0) {
            AppDivs.numsUsed.push(i);
            //console.log("%1.f is divisor of %1.f",i,n);
        }
    }
    AppDivs.numsUsed.push(n);
    var arrLength = AppDivs.numsUsed.length-1;
    var last = AppDivs.numsUsed[arrLength];
    for(var i=0;i<arrLength;i++) {
        var nNum = n/AppDivs.numsUsed[i];
        //console.log("%i / %i = %i",n,AppDivs.numsUsed[i],n);
        if(AppDivs.numsUsed.lastIndexOf(nNum)==-1)
            AppDivs.numsUsed.push(nNum);
    }
    //AppDivs.numsUsed.push(1);
    //AppDivs.numsUsed.push(n);
    if(AppDivs.numsUsed.indexOf(n)!=AppDivs.numsUsed.lastIndexOf(n))
        AppDivs.numsUsed.pop();
}

var domD = document.getElementById("d");
var domN = document.getElementById("n");
var divs = [];
var por = 0;//0-1
function process() {
    AppGraph.clear();
    divs = [];
    var max = 0;
    var min = 0;
    var lim = Number(document.getElementById("lim").value);
    var ini = Number(document.getElementById("ini").value);
    var rng = Math.max(lim-ini,2);
    /*min = AppDivs.getDivs(ini);
    max = min;*/
    divs.ini = ini;
    divs.lim = lim;
    divs.rng = rng;
    for(var n=ini,i=0;n<=lim;n++,i++) {
        var d = AppDivs.getDivs(i);
        if(d>max||i==0)
            max = d;
        if(d<min||i==0)
            min = d;
        divs[i] = {};
        divs[i].x = AppGraph.size.w/rng*i;
        divs[i].d = d;
        por = i/rng;
    }
    divs.max = max;
    divs.min = min;
    for(var i=0;i<divs.length;i++) {
        divs[i].y = AppGraph.size.h-AppGraph.size.h/max*divs[i].d;
        console.log("(%i;%i)",divs[i].x,divs[i].y);
    }
    console.log("Biggest: %i\nSmallest: %i",max,min);
    AppGraph.draw(divs,'point');
    console.log("Range: %i > %i",min,max);
}

function h() {
    var rect = AppGraph.dom.getBoundingClientRect();
    var mouse = {x:event.clientX-rect.left,y:event.clientY-rect.top};
    i = Math.floor(mouse.x/(AppGraph.size.w/divs.rng));
    console.log("N: %i has %i",Number(document.getElementById("ini").value)+i,divs[i].d);
    domD.innerText = divs[i].d;
    domN.innerText = divs.ini+i;
    /*
    X = W/R*i
    X = i*W/R
    X/(W/R) = i
    32 = 800/40*i
    32 = i*(20/1)
    32/20 = i
    16/10 = i
    1,6 = i
    X/(W/R) = i
    */
}