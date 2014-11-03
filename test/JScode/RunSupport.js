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