var prox;
var floatdivprewid=601;
var floatdivprehei=601;
var widlowlimit=301; heilowlimit=110;
var dx,dy,mx=0,my=0,breakx=0,breaky=0,mouseD=0,mouseout=1;
var mousedown_opacity = 0.6;
var mouseup_opacity = 0.9;
var border = 4;
var outtimer;
var divshowdelaytime = 13;
var divshowperdec = 11;
var opacitydelaytime = 41;
var floatdivprehei = 0;
var SupportsTouches = ("createTouch" in document);
var mouseover = 0;

/* 动画 */

function GetInnerLength(){
	inwidth = window.innerWidth
			|| document.documentElement.clientWidth
			|| document.body.clientWidth
			+1;
	inheight = window.innerHeight
			|| document.documentElement.clientHeight
			|| document.body.clientHeight
			+1;
}
function moveto(s,x,y){
	var object = document.getElementById(s+"");
	if (!object) return;
	var nowx = parseInt(object.style.pixelLeft || object.style.left);
	var nowy = parseInt(object.style.pixelTop || object.style.top);
	var width = (object.innerWidth || object.clientWidth || object.offsetWidth);
	var height = (object.innerHeight || object.clientHeight || object.offsetHeight);
	var nowr = nowx+x;
	var nowb = nowy+y;
	if (nowr+width+border>=inwidth) nowr=inwidth-width-border;
	if (nowb+height+border>=inheight) nowb=inheight-height-border;
	if (nowr<1) nowr=0;
	if (nowb<1) nowb=0;
	object.style.pixelLeft = nowr+'px';
	object.style.pixelTop = nowb+'px';
	object.style.left = nowr+'px';
	object.style.top = nowb+'px';
}
function closeed(id){/*--关闭--*/
	o = $("#floatdiv");
	if (!o) return;
	mouseupfloatdiv();
	nowl3num = -1;
	setallCookies();
	if(o.css("display") == "block")
	{
		o.css("cursor","default").stop(true).fadeOut(300,function(){
			$(this).css("display","none");
		});
	}
}
function outfloatdiv(){
	mouseD = 0; mouseover = 0;
	mouseupfloatdiv();
}
function mouseupfloatdiv(){
	$("#floatdiv").css("opacity",mouseup_opacity);
	//$("#floatdiv").fadeTo(50,mouseup_opacity);
	mouseD = 0;
}
function mouseoutfloatdiv(){
	outtimer = setTimeout(function(){outfloatdiv()},delaytime*7);
}
function mouseoverfloatdiv(){
	clearTimeout(outtimer);
	mouseover = 1;
}
function mousedownfloatdiv(id){
	var od = document.getElementById("floatdiv");
	if (!od) return;
	$("#floatdiv").fadeTo(50,mousedown_opacity);
	mouseD = id;
	mx = x; my = y;
	od.style.left = od.offsetLeft + "px";
	od.style.top = od.offsetTop + "px";
	floatdivprehei = od.offsetHeight-border;
	floatdivprewid = od.offsetWidth-border;
	moveto(od.id,0,0);
}
function changefloatinnerheight(){
	var title = document.getElementById("floatdiv_title");
	var linker = document.getElementById("floatdiv_linker");
	var detail = document.getElementById("floatdiv_detail");
	var htitle = 0;
	if (title && title.offsetHeight) htitle = title.offsetHeight;
	var hlinker = 0;
	if (linker && linker.offsetHeight) hlinker = linker.offsetHeight;
	var hdetail = floatdivprehei - htitle - hlinker;
	if (hdetail<=0) hdetail = 0;
	changeheight(detail.id,hdetail);
	if (detail) detail.innerHTML = hdetail;
}
function floatdivmove(){
	var od = document.getElementById("floatdiv");
	if (!od) return;
	if (!od || mouseD==0 || mouseover==0) return;
	var xinc=0,yinc=0;
	var temp,out=0;
	yinc = y-my;  xinc = x-mx;
	mx = x; my = y;
	var nowx = parseInt(od.style.pixelLeft || od.style.left);
	var nowy = parseInt(od.style.pixelTop || od.style.top);
	switch (mouseD){
		case 7: case 8: case 9:		
			temp = floatdivprehei+yinc;
			if ((yinc<0 || temp+nowy<inheight-border ) && (heilowlimit<temp || yinc>0))
				$("#"+od.id).css("height",floatdivprehei=temp);
	}
	switch (mouseD){
		case 3: case 6: case 9:	
			temp = floatdivprewid+xinc;
			if ((xinc <0 || temp+nowx<inwidth-border )&& (widlowlimit<temp || xinc>0))
				$("#"+od.id).css("width",floatdivprewid=temp);
	}
	switch (mouseD){
		case 5: case 1: case 2: case 3:
		if (nowy + yinc<=0) yinc = -nowy; 
		if (nowy + yinc>=inheight-border) yinc = inheight-border-nowy; 
		if (mouseD!=5){
			temp = floatdivprehei-yinc;
			if (heilowlimit<temp)
				$("#"+od.id).css("height",floatdivprehei=temp);
			else yinc = 0;
		}
		moveto(od.id,0,yinc);
	}
	switch (mouseD){
		case 5: case 1: case 4: case 7:
		if (nowx + xinc<=0) xinc = -nowx;
		if (nowx + xinc>=inwidth-border) xinc = inwidth-border-nowx;
		if (mouseD!=5){
			temp = floatdivprewid-xinc;
			if (widlowlimit<temp)
				$("#"+od.id).css("width",floatdivprewid=temp);
			else xinc = 0;
		}
		moveto(od.id,xinc,0);
	}
}
$(document).mousemove(function(){
	floatdivmove();
});

var clickcolor = "#0000FF";
var notitle = "无名";
var nodetail = "没有介绍。"
var	nolinker = "无下载。";

/* 内容 */

function buildtitle(number){
	var s = allcon[number].title;
	var pretext = "<div id='floatdiv_title' class='floatdiv_title'>";
	if (s=='') return pretext+notitle+"</div>";
	return pretext+s+"<hr/></div>";
}
function inserter(string,pointer,inser,times){
	var ts = string.split(pointer);
	var i;
	var txt = '';
	for (i=0;i<times;i++){
		txt += inser;
	}
	for (i=0;i<ts.length;i++){
		ts[i] = txt + ts[i];
	}
	string = ts.join(pointer);
	return string;
}
function builddetail(number){
	var s='';
	for (var i=0;i<allcon[number].detail.length;i++){
		s += "<p>" + allcon[number].detail[i] + "</p>";
	}
	var pretxt = "<div id='floatdiv_detail' class='floatdiv_detail'><b style='font-size:1.5em'>介绍:</b><br/>"
	if (s=='') return pretxt+nodetail+"</div>";
	return pretxt+s+"</div>";
}
function buildlinker(number){
	var s='';
	for (var i=0;i<allcon[number].linker.length;i++){
		s += "<a href='"+allcon[number].linker[i].src+"'>"+allcon[number].linker[i].name+"</a> ";
	}
	var pretxt = "<div id='floatdiv_linker' class='floatdiv_linker'><b style='font-size:1.5em'><hr/>链接:</b><br/>";
	if (s=='') return pretxt+nolinker+"</div>";
	s = inserter(s,"<br>","&nbsp;",3);
	return pretxt+s+"</div>";
}
function creatfloatdiv(){
	if ($("#floatdiv").text()) return;
	$("body").append("<div id='floatdiv' class='floatdiv' onDblClick='closeed(\"floatdiv\")' onmouseover='mouseoverfloatdiv()' onmouseout='mouseoutfloatdiv()'>"+
							"<div id='floatdiv_button' onclick='closeed(\"floatdiv\")' class='floatdiv_button'>关闭</div>"+
							"<div id='floatdiv_t_l' class='t_l' onmousedown='mousedownfloatdiv(1)' onmouseup='mouseupfloatdiv()'></div>"+
							"<div id='floatdiv_t_m' class='t_m' onmousedown='mousedownfloatdiv(2)' onmouseup='mouseupfloatdiv()'></div>"+
							"<div id='floatdiv_t_r' class='t_r' onmousedown='mousedownfloatdiv(3)' onmouseup='mouseupfloatdiv()'></div>"+
							"<div id='floatdiv_m_l' class='m_l' onmousedown='mousedownfloatdiv(4)' onmouseup='mouseupfloatdiv()'></div>"+
							"<div id='floatdiv_m_m' class='m_m' onmousedown='mousedownfloatdiv(5)' onmouseup='mouseupfloatdiv()'>"+
							"</div>"+
							"<div id='floatdiv_m_r' class='m_r' onmousedown='mousedownfloatdiv(6)' onmouseup='mouseupfloatdiv()'></div>"+
							"<div id='floatdiv_b_l' class='b_l' onmousedown='mousedownfloatdiv(7)' onmouseup='mouseupfloatdiv()'></div>"+
							"<div id='floatdiv_b_m' class='b_m' onmousedown='mousedownfloatdiv(8)' onmouseup='mouseupfloatdiv()'></div>"+
							"<div id='floatdiv_b_r' class='b_r' onmousedown='mousedownfloatdiv(9)' onmouseup='mouseupfloatdiv()'></div>"+
						"</div>");
	var target = document.getElementById("floatdiv");
	try{
		document.addEventListener('touchmove',function(e){
			x = e.touches[0].pageX;
			y = e.touches[0].pageY;
		});  
		target.addEventListener('touchend',function(){
			mouseupfloatdiv();
		});
		target.addEventListener('touchstart',function(){
			mousedownfloatdiv(5);
		});
		target.addEventListener('touchmove',function(){
			floatdivmove();
		});
	}catch(e){};
	mouseupfloatdiv();
	width=floatdivprewid;
	if (inwidth<floatdivprewid) width = inwidth;
	target.style.display = "none";
	target.style.width = width+ 'px';
	target.style.left = "0px";
	target.style.top = "0px";
	moveto(target.id,(inwidth-width)/2,inheight/2-200);
	floatdivprehei = 300;
	$("#floatdiv").css("height",floatdivprehei).css("overflow","hidden");
}
function changefloatdivinner(number){
	$('#'+number+"_bottom_inner_img").fadeTo(200,0.20);
	$("#"+number+"_bottom_outer").css({color:clickcolor});
	var target = document.getElementById("floatdiv_m_m");
	if (!target) return;
	$("#floatdiv_m_m").empty().append(buildtitle(number) + builddetail(number) + buildlinker(number));
	var linker=document.getElementById("floatdiv_linker");
	var target=document.getElementById("floatdiv");
	target.style.height = "auto";
	target.style.display = "block";
	floatdivprehei = (target.innerHeight || target.clientHeight || target.offsetHeight) + linker.offsetHeight;
	target.style.display = "none";
	$("#floatdiv").css("height",floatdivprehei);
}
function iframein(src){
	var target = document.getElementById("floatdiv_m_m");
	if (!target) return;
	target.innerHTML = '';
	target.innerHTML += "<iframe src='"+src+"' style='width:96%; height:96%; position:absolute; top:2%; left:2%;'></iframe>";
}
function showit(id){
	var number = parseInt(id);
	if (nowl3num==number) return;
	nowl3num = number;
	setallCookies();
	var o = document.getElementById("floatdiv");
	if (!o){
		creatfloatdiv();
	}
	o = $("#floatdiv");
	moveto("floatdiv",0,0);
	if (o.css("display")=="block"){
		o.slideUp(150,function(){
			changefloatdivinner(number);
			$(this).css("overflow","hidden").css("height",floatdivprehei);
			$(this).slideDown(250,function(){
				moveto("floatdiv",0,0);
			});
		});
	}else{
		changefloatdivinner(number);
		prox = setInterval(function(){
				moveto("floatdiv",0,0);
		},20)
		o.fadeIn(400,function(){
			clearInterval(prox);
		});
	}
}