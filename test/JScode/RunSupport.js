// 全局变量及函数
var isIE = document.all ? true : false;
var preinwidth,preinheight;
var x,y;	//鼠标当前在页面上的位置
var inwidth = 1;
var inheight = 1;
var sleft=0,stop=0; //文档滚动条位置
var delaytime = 41;
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
function scrollxy(){
	sleft = window.pageXOffset  //用于FF
		|| document.documentElement.scrollLeft
		|| document.body.scrollTop
		|| 0;
	stop = window.pageYOffset  //用于FF
		|| document.documentElement.scrollTop  
		|| document.body.scrollTop  
		|| 0;
}
function innerpx(){
	GetInnerLength();
	if (preinwidth != inwidth || preinheight != inheight) {
		preinwidth = inwidth;
		preinheight = inheight;
		resizedwindow();
	}
	//wid = sleft + inwidth;
	//hei = stop + inheight;
}
$(document).ready(function(){
	setInterval(function(){
		//scrollxy();
		innerpx();
	},41);
});
$(document).mousemove(function MouseXY(e) { //从事件得到鼠标光标在页面上的位置
	e=e||window.event;
	x = isIE ? sleft + e.clientX : e.pageX;
	y = isIE ? stop + e.clientY : e.pageY ;
});
function getCookie(c_name) {
	if (document.cookie.length>0) { 
		c_start=document.cookie.indexOf(c_name + "=");
		if (c_start!=-1) { 
			c_start=c_start + c_name.length+1 ;
			c_end=document.cookie.indexOf(";",c_start);
			if (c_end==-1) c_end=document.cookie.length;
			return unescape(document.cookie.substring(c_start,c_end));
		} 
	}
	return "-";
}
function setCookie(c_name,value,expiredays) {
	var exdate=new Date();
	exdate.setDate(exdate.getDate()+expiredays);
	document.cookie=c_name+ "=" +escape(value) + 
		((expiredays==null) ? "" : ";expires="+exdate.toGMTString());
}
function setallCookies(){
	setCookie("nowlevel",nowlevel);
	setCookie("nowl1num",nowl1num);
	setCookie("nowl2num",nowl2num);
	setCookie("nowl3num",nowl3num);
}
function getallCookies(){
	nowlevel = parseInt(getCookie("nowlevel"));
	nowl1num = parseInt(getCookie("nowl1num"));
	nowl2num = parseInt(getCookie("nowl2num"));
	nowl3num = parseInt(getCookie("nowl3num"));
}

	//控制层抓取函数

var dragging = false,mouseinselectbar=false;
var iX, iY;
var oX, oY;
var setbartop=0;
var bartop=-60,barleft=-40,barfloatout=-50;
function bartotop(){
	dragging = false;
	$("#selectbar").stop(true).animate({top:bartop,left:barleft},"fast");
	$("#selectbar").siblings().stop(true).animate({top:'0',left:'0'},"fast");
	setbartop = 1;
}
function bartobottom(){
	dragging = false;
	$("#selectbar").stop(true).animate({top:inheight+bartop+'',left:barleft},"fast");
	$("#selectbar").siblings().stop(true).animate({top:inheight+"",left:'0'},"fast");
	setbartop = 0;
}
$(function(){
	/*--------------拖曳效果----------------
	*原理：标记拖曳状态dragging ,坐标位置iX, iY
	*         mousedown:fn(){dragging = true, 记录起始坐标位置，设置鼠标捕获}
	*         mouseover:fn(){判断如果dragging = true, 则当前坐标位置 - 记录起始坐标位置，绝对定位的元素获得差值}
	*         mouseup:fn(){dragging = false, 释放鼠标捕获，防止冒泡}
	*/
	$("#selectbar").mousedown(function(e) {
		if (e.which == 3) return false;
		dragging = true && !$.fx.off;
		iX = x - this.offsetLeft;
		iY = y - this.offsetTop;
		oX = oY = 0;
		this.setCapture && this.setCapture();
		return false;
	});
	$("#uplayout").mousedown(function(e) {
		if (e.which == 3) return false;
		dragging = true  && !$.fx.off;
		iX = x - this.offsetLeft;
		iY = y - this.offsetTop;
		oX = oY = 0;
	});
	$("#selectbar").mouseenter(function(e) {
		mouseinselectbar=true;
		$("#selectbar").stop(true).animate({left:'0',top:((inheight+barfloatout)*(1-setbartop)+bartop)},100);
		if (!setbartop && !dragging && !$.fx.off){
		$("#selectbar").siblings().stop(true).animate({top:inheight+barfloatout+"",left:'0'},100);
		}
	});
	$("#selectbar").mouseleave(function(e) {
		mouseinselectbar=false;
		this.releaseCapture && this.releaseCapture();
		$("#selectbar").delay(2000).animate({left:barleft,top:((inheight)*(1-setbartop)+bartop)},100);
		if (!setbartop && !dragging  && !$.fx.off){
			$("#selectbar").siblings().delay(2000).animate({top:inheight+"",left:'0'},100);
		}
	});
	$(document).mouseup(function(e) {
		if (oY<5 && mouseinselectbar) setbartop = 1-setbartop;
		if (setbartop==1)	bartotop();
		else	bartobottom();
			e.cancelBubble = true;
		this.releaseCapture && this.releaseCapture();
		mouseupfloatdiv();
	});
});
$(document).mousemove(function MouseXY(e) { //从事件得到鼠标光标在页面上的位置
	if (dragging) {
		var e = e || window.event;
		oX = x - iX; oY = y - iY;
		if ((oY<inheight/3.5*2 && setbartop==0)){
			bartotop(); return;
		}
		if ((oY>inheight/3.5 && setbartop==1)){
			bartobottom(); return;
		}
		if (setbartop==1 && oY<0) oY = oY /2.5;
		$("#selectbar").css({"top":oY +bartop+30 + "px"});
		$("#selectbar").siblings().css({"top":oY +bartop+90+ "px"});
	}
});		
$(document).ready(function (){
	$("#uplayout").css("opacity",0.85).css("zIndex",299).css("display","block");
	$("#selectbar").css("float","left").css("left",barleft).css("zIndex",300).css("display","block");
	$("#selector").css("float","left").css("zIndex",301).css("display","block");
	$("#ch_effects").bind('change',function(e){
		if ($(this).attr("checked")=='checked')
			$.fx.off = false;
		else $.fx.off = true;
	});
});