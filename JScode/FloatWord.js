$(function(){		
	var step = 15; //字符显示间距，为了好看，step=0则字符显示没有间距
	var charhei = 20,charwid = 15;
	var timesx = step * 2,timesy = step * 2;
	var delaytime = 41;
	var message;
	var xpos = new Array(),ypos = new Array(); 		//存储每个字符位置的数组
	var inwidth=1,inheight=1,sleft=1,stop=1,mousex=1,mousey=1;
	var isIE = document.all ? true : false;
	
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
	$(document).mousemove(function MouseXY(e) { //从事件得到鼠标光标在页面上的位置
		e=e||window.event;
		mousex = isIE ? sleft + e.clientX : e.pageX;
		mousey = isIE ? stop + e.clientY : e.pageY ;
	});
	$(document).ready(function addmessage(){
		message = $("#FloatWordDiv").text();
		message = message.replace(/^\s+|\s+$/g,"");
		if (!message.length)	return;
		$("#FloatWordDiv").empty().css({"display":"block"});;
		message = message.split("");
		for (var i = 0; i < message.length; i++) {
			//动态生成显示每个字符span标记,
			//使用span来标记字符，是为了方便使用CSS，并可以自由的绝对定位
			$("#FloatWordDiv").append("<span id='FloatWordspan" + i + "' class='FloatWordspan'>" + message[i] + "</span>");
			//$("#FloatWordspan"+i)
			xpos[i] = 0; ypos[i] = 0;
		}
		window.setInterval(function(){
			scrollxy();
			GetInnerLength();
			makesnake();
		},delaytime);
	});
	function makesnake() {
		// 该算法显示字符串就有点象人类的游行队伍一样， 
		var i;
		for (i = message.length - 1; i >= 1; i--) {
			if (xpos[i - 1] + timesx < inwidth+sleft)
				xpos[i] = xpos[i - 1] + step;
			else
				xpos[i] = xpos[i - 1] + timesx - inwidth;
			ypos[i] = ypos[i - 1];
		}
		//从尾向头确定字符的位置，每个字符为前一个字符“历史”水平坐标+step间隔，
		if (inwidth>charwid)
			xpos[0] = sleft + (mousex + timesx - sleft) % (inwidth-charwid);
		else xpos[0] = 0; 
		if (inheight>charhei)
			ypos[0] = stop + (mousey + timesy - stop) % (inheight-charhei);
		else ypos[0] = 0;
		for (i = 0; i < message.length; i++) {
			$("#FloatWordspan"+i).css({"left":xpos[i],top:ypos[i]});
		}
	}
});