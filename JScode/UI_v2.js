  //主界面相关函数
var leftimgwidth = 65;
var leftimgheight = 65;
var searchmode = 0;
var posincer = 4;
var rightlimit=71,bottomlimit=10;
var nowlevel = 0;
var nowl1num = -1;
var nowl2num = -1;
var nowl3num = -1;
var viewmode = 1;
var viewChangeWidth=new Array(0,650,10000);
var viewModesSuffix=new Array("_s","_n");
var classSuffix='_n';

function timage(id,url,alt,width,height,event,align){
	width = width || "auto";
	height = height || "auto";
	event = event || '';
	return "<img id='"+id+"' src= '"+url+"' alt= '"+alt+"' width='"+width+"px' height='"+height+"px' align='"+align+"' "+event+"/>";
}
function changewidhei(){
	if (setbartop==0) bartobottom();
	else bartotop();
	$("#selector").css("left",Math.max(0,(inwidth-600)/2)).css("paddingTop",Math.max(0,(inheight-300)/2));
	if (viewmode){
		$("#selectcontainer").css("display","block");
		$("#FloatWordDiv").css("display","block");
		$("#left").children().css({"position":"relative"});
	}else{
		$("#selectcontainer").css("display","none");
		$("#FloatWordDiv").css("display","none");
		$("#left").children().css({"position":"relative"});
	}
	if (nowlevel==1){
		var h = 350;
		$("#logodiv").css({"paddingTop":Math.max(0,(inheight - h*2) / 2)});
		$("#content_mid").css({"paddingTop":Math.max(0,(inheight - h*1.5) / 2)});
	}else{
		var h = 0,up = document.getElementById("content_up");
		var hl = 0,left = document.getElementById("left");
		if (up && up.offsetHeight>0) h = up.offsetHeight;
		if (left && left.offsetHeight>0) hl = left.offsetHeight;
		$("#content_bottom").css("height",inheight -bottomlimit - 10 - h - (1-viewmode)*25);
		$("#floatdiv").css({"width":Math.min(inwidth,floatdivprewid),
			"height":Math.min(inheight,floatdivprehei)});
		moveto("floatdiv",0,0);
	}
}
function killall(level){
	$("#content").remove();
	$("#left").remove();
	$("#right").remove();
	if (level==1){
		$("body").prepend("<div class='level1_out"+classSuffix+"' id='content'>"+
								"<div id='logodiv'>"+
									"<h1 id='logo"+classSuffix+"' class='logo'>LM&nbsp;share</h1>"+
								"</div>"+
							"</div>");
		$("#logo"+classSuffix).lettering();
	}
	if (level==2){
		$("body").prepend("<div class='level2_left"+classSuffix+"' id='left'></div>"+
							"<div class='level2_right"+classSuffix+"' id='right'><div class='level2_content"+classSuffix+"' id='content'>"+
								"<div id='content_up' class='level2_content_up"+classSuffix+"'>"+
								"</div>"+
								"<div id='content_bottom' class='level2_content_bottom"+classSuffix+"'>"+
									"<span style='font-size:3em; cursor:default;'>欢迎！</span>"+
								"</div>"+
							"</div></div>");
	}
	closeed("floatdiv");
}
function showtagup(id,tagname){
	var target = document.getElementById(id+'');
	if (!target) return;
	target = target.getElementsByTagName(tagname+'');
	if (target.length==0) return;
	var deltime = Math.max(7,(300+target.length*delaytime*7)/target.length/target.length);
	for (i=0;i<target.length;i++){
		$("#"+target[i].id).css("opacity",0).delay(i*deltime*!$.fx.off).fadeTo(10*delaytime,1,function(){
			$(this).css("opacity","");
		});
	}
}
function findit(get,target){
	var bottom = document.getElementById(target);
	var t = document.getElementById(get);
	if (!t || !t.value || !bottom) return;
	var i=0;
	if (t.value=="textarea" && searchmode==0){
		searchmode = 1;
		showlevel2(alltot-2,-1);
		return;
	}
	if (t.value=="search" && searchmode==1){
		searchmode = 0;
		showlevel2(alltot-2,-1);
		return;
	}
	if (searchmode==0){
		$("#"+target).empty().append("搜索中..... 请稍候....<br/>");
		allcon[0].finddown(t.value,0);
		$("#"+target).empty();
		for (i=0;i< listcon.length;i++){
			allcon[listcon[i]].showself(0,target);
			//bottom.innerHTML += "&nbsp;&nbsp;&nbsp;&nbsp;" + listscore[i] +"&nbsp;&nbsp;&nbsp;&nbsp;" + i +"&nbsp;&nbsp;&nbsp;&nbsp;" + listcon[i] + ' ' + allcon[listcon[i]].id ;
		}
		showtagup(target,"span");
	}
	else{
		$("#"+target).append("<hr/><pre>"+t.value+"</pre><br/>");
		var result;
		if (t.value=="help"){
			result = "<br/>bottom 表示当前的窗口<br/> target 表示编辑窗口 <br/> root 为根节点<br/> ";
		}else{
			result = eval(t.value);
		}
		$("#"+target).append(result+"<br/>");
	}
	changewidhei();
}
var EnterSubmit = function(evt)
{
	evt = window.event || evt;
	if (evt.keyCode == 13)
	{
		if (nowlevel==2){
			var target = document.getElementById("searchboxtext");
			if (target && (!target.value || searchmode)){
				target.focus(); return;
			}
			var target = document.getElementById("searchboxsubmit");
			if (target && !searchmode) target.click();
		}
		else if (nowlevel==1){
			showlevel2(alltot-2,-1);
			var target = document.getElementById("searchboxtext");
			if (target) target.focus();
		}
　    }
}
function clrsearchboxtext(){
	var target = document.getElementById("searchboxtext");
	if (!target) return;
	target.value = '';
	target.focus();
}
function showlevel2(l1num,l2num){
	l1num = parseInt(l1num);
	l2num = parseInt(l2num);
	if (l1num==alltot-1) {
		showlevel1();
		return ;
	}
	var i,moveevent;
	killall(2);
	nowlevel = 2; nowl1num = l1num;
	nowl2num = l2num; nowl3num = -1;
	setallCookies();
	for (i=0;i<root.total;i++) {
		var moveevent = '';
		if (viewmode){
			if (root.all[i]!=l1num) moveevent = "onmouseover='movetitle(this.id,60,1)' onmouseout='movetitle(this.id,60,-1)'";
			else moveevent = '';
			$("#left").append("<span class='level2_left_in"+classSuffix+"' id='"+root.all[i]+"_left_inner'"+moveevent+">"
									+"<img class='level2_left_in_img"+classSuffix+"' id='"+root.all[i]+"_left_inner_img' src= '"+allcon[root.all[i]].ico+"' alt= '"+allcon[root.all[i]].title+"' width='60px' height='60px' style='cursor:pointer;' onclick='showlevel2(this.id,-1)'/>"
									+"<span class='level2_left_in_txt"+classSuffix+"' id='"+root.all[i]+"_left_inner_txt' onclick='showlevel2(this.id,-1)'>"+allcon[root.all[i]].title+ "</span>"
								+"</span>");
			if (root.all[i]==l1num) movetitle(root.all[i]+'_left_inner',60,1);
			$('#'+root.all[i]+'_left_inner_txt').css("opacity",0.5);
		}else{
			var classname='';
			if (root.all[i]!=l1num) classname = 'level2_left_in_small';
			else classname = 'level2_left_in_small_choose';
			classname += classSuffix;
			$("#left").append("<span class='"+classname+"' id='"+root.all[i]+"_left_inner'"+moveevent+">"
									+"<span class='level2_left_in_txt"+classSuffix+"' id='"+root.all[i]+"_left_inner_txt' onclick='showlevel2(this.id,-1)'>"+allcon[root.all[i]].title+ "</span>"
								+"</span>");
			movetitle(root.all[i]+'_left_inner',i*60,-1);
		}
	}
	changewidhei();
	var inhtml = '';
	if (l1num==(alltot-2).toString()) {
		if (searchmode == 0){
			if (!isIE) {
				inhtml = "<input type='text' id='searchboxtext' class='level2_content_up_searchboxinput"+classSuffix+"'/>";
				inhtml+= "<span class='level2_content_up_searchboxclr"+classSuffix+"' onclick='clrsearchboxtext();'>X</span>";
			}
			else
				inhtml =  "<input rows='auto' cols='20' type='text' id='searchboxtext' class='level2_content_up_searchboxtextie"+classSuffix+"' value=''/>";
			inhtml+= "<input type='button' id='searchboxsubmit' class='level2_content_up_searchboxsubmit"+classSuffix+"' value='搜索' onclick='findit(\"searchboxtext\",\"content_bottom\");'/>";
		}else{
			if (!isIE) {
				inhtml = "<textarea id='searchboxtext' class='level2_content_up_searchboxcode"+classSuffix+"' value=''></textarea>";
			}
			else{
				inhtml = "<textarea rows='5' id='searchboxtext' class='level2_content_up_searchboxtextie"+classSuffix+"'></textarea>";
				inhtml+= "<span class='level2_content_up_searchboxclr"+classSuffix+"' onclick='clrsearchboxtext();'>X</span>";
			}
			inhtml+= " <input type='button' id='searchboxsubmit' class='level2_content_up_searchboxsubmit"+classSuffix+"' value='运行' onclick='findit(\"searchboxtext\",\"content_bottom\");'/>";
		}
		$("#content_up").append(inhtml);
		document.getElementById("searchboxtext").focus();
		showtagup("content_up","input");
	}else{
		var now = allcon[l1num];
		var inhtml = "";
		var classname='';
		for (i=0;i<now.total;i++){
			if (now.all[i]!=l2num) classname = 'level2_content_up_in';
			else classname = 'level2_content_up_in_choose';
			classname += classSuffix;
			$("#content_up").append("<span id='" + now.all[i]+ "_content_up' class='"+classname+"' onclick='showlevel2("+l1num+",this.id)'>"+ allcon[now.all[i]].title +"</span>");
		}
		if (now.total==0)	$("#content_up").append("<span class='level2_content_up_in' style='cursor:default;'>什么都没有哦！</span>");
		if (l2num!=-1){
			$("#content_bottom").empty();
			allcon[l2num].showdown('all',"content_bottom",viewmode);
		}else{
			$("#content_bottom").empty().append("<span class='havealook"+classSuffix+"'>随便看看：</span><br/>");
			allcon[l1num].showdown(10,"content_bottom",viewmode);
			showtagup("content_up","span");
		}
		showtagup("content_bottom","img");
		showtagup("content_bottom","span");
	}
	$("#content_up").append("<br/><div style='width:100%; height:0; position:absolute; top:0;'>&nbsp;</div>");
	changewidhei();
}
function level1image(number,width){
	var coner = allcon[number];
	if (coner.ico=='') return;
	var target = document.getElementById(coner.number.toString());
	if (!target) return;
	var height = width;
	var align = viewmode ? "bottom" : "top";
	$("#"+coner.number).prepend(timage(coner.id+'_ico',coner.ico,coner.title,width,height,"",align));
}
function showlevel1(){
	killall(1);
	nowlevel = 1;
	nowl1num = -1; nowl2num = -1; nowl3num = -1;
	setallCookies();
	$("#content").append("<div class='level1_out"+classSuffix+"' id='content_mid'></div>");
	var target = $("#content_mid");
	for (i=0;i<root.total;i++) { 
		if (root.all[i]!=alltot-1){
			target.append("<span id='" + root.all[i]+ "' class='level1_in"+classSuffix+"' onclick='showlevel2(this.id,-1)'><span>"+ allcon[root.all[i]].title +"</span></span>");
			$("#"+root.all[i]).mouseenter(function(){
				$(this).css({"color":"#777777"}).animate({"paddingLeft":"+="+15* !$.fx.off,"paddingRight":"+="+15* !$.fx.off,"letterSpacing":'+=4'},500);
			});
			$("#"+root.all[i]).mouseleave(function(){
				$(this).css({"color":"#000000"}).animate({"paddingLeft":"-="+15* !$.fx.off,"paddingRight":"-="+15* !$.fx.off,"letterSpacing":'-=4'},500,function(){
					$(this).removeAttr("style");
				});
			});
		}
		level1image(root.all[i],100);
	}
	changewidhei();
	showtagup("content_mid","span");
}
function reshowlevel(){
	switch(nowlevel){
		default: showlevel1(); break;
		case 2:
			showit(nowl3num);
			showlevel2(nowl1num,nowl2num);
			break;
	}
}
function resizedwindow(){
	var nowViewMode=0;
	while (viewChangeWidth[nowViewMode+1]<inwidth) nowViewMode++;
	if (nowViewMode!=viewmode){
		viewmode = nowViewMode;
		classSuffix = viewModesSuffix[viewmode];
		reshowlevel();
	}
	changewidhei();
}
function viewstart(){
	innerpx();
	getallCookies();
	resizedwindow();
	reshowlevel();
	changewidhei();
}
//背景缓存载入
var bg = new Image();
var bgimg= new Array();
var bgnum = 0;
bgimg[0] = 'http://www.pp3.cn/uploads/allimg/111110/14010AU3-0.jpg';
bgimg[bgimg.length] = 'http://www.kole8.com/desktop/desk_file-11/2/2/2012/10/201210314361319.jpg';
bgimg[bgimg.length] = 'http://desktop.inlishui.com/DesktopFiles/设计/桌面精选壁纸 2010-01-21/desktop.inlishui.com_060.jpg';
bgimg[bgimg.length] = 'http://www2.ppdesk.com/file/20100120/desk/2009/10/16/keai200910_73_1920x1440.jpg';
bgimg[bgimg.length] = 'http://dl.bizhi.sogou.com/images/2013/12/06/437033.jpg';
bgimg[bgimg.length] = 'http://dl.bizhi.sogou.com/images/2013/12/05/435145.jpg';
bgimg[bgimg.length] = 'http://dl.bizhi.sogou.com/images/2012/10/12/312777.jpg';
bgimg[bgimg.length] = 'http://dl.bizhi.sogou.com/images/2012/02/09/96359.jpg';
bgimg[bgimg.length] = 'http://dl.bizhi.sogou.com/images/2012/10/12/312805.jpg';
bgimg[bgimg.length] = 'http://dl.bizhi.sogou.com/images/2012/10/12/312825.jpg';
bgimg[bgimg.length] = 'http://dl.bizhi.sogou.com/images/2012/10/12/311223.jpg';

function bgimager() {
	if (!bg.complete){
		bg.src = bgimg[bgnum];
		setTimeout("bgimager()", 2000);
	}else{
		$("#bgdiv").css({"opacity":"0"}).fadeTo(2000,0.5);
		$("#bgdiv").css("background","#94BFCA url('"+bgimg[bgnum]+"') center fixed no-repeat");
		$("#uplayout").css("background","#66CCFF url('"+bgimg[bgnum]+"') center fixed no-repeat");
	}
}
$(document).ready(function loader() {
	setbartop = 0;
	$("body").css("overflow",'hidden');
	do
		bgnum= Math.round(Math.random()*(bgimg.length-0.5));
	while (bgnum<0 || bgnum>=bgimg.length);
	bgimager();
	$(document).keydown(EnterSubmit);
	if (document.layers) {
		document.captureEvents(Event.MOUSEMOVE);
	}
	bartobottom();
	$("body").css("overflow",'hidden');
});