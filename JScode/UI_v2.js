  //主界面相关函数
var leftimgwidth = 65;
var leftimgheight = 65;
var searchmode = 0;
var posincer = 4;

function killall(level){
	$("#content").remove();
	$("#left").remove();
	$("#right").remove();
	if (level==1){
		$("#body").prepend("<div class='level1_out' id='content'>"+
								"<div id='logodiv'>"+
									"<h1 id='logo'>LM&nbsp;share</h1>"+
								"</div>"+
							"</div>");
		$("#logo").lettering();
	}
	if (level==2){
		$("#body").prepend("<div class='level2_left' id='left'></div>"+
							"<div class='level2_right' id='right'><div class='level2_content' id='content'>"+
								"<div id='content_up' class='level2_content_up'>"+
								"</div>"+
								"<div id='content_bottom' class='level2_content_bottom'>"+
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
	for (i=1;i<=root.total;i++) {
		if (root.all[i]!=l1num) moveevent = "onmouseover='movetitle(this.id,60,1)' onmouseout='movetitle(this.id,60,-1)'";
		else moveevent = '';
		$("#left").append("<span class='level2_left_in' id='"+root.all[i]+"_left_inner'"+moveevent+">"
								+"<img class='level2_left_in_img' id='"+root.all[i]+"_left_inner_img' src= '"+allcon[root.all[i]].ico+"' alt= '"+allcon[root.all[i]].title+"' width='60px' height='60px' style='cursor:pointer;' onclick='showlevel2(this.id,-1)'/>"
								+"<div class='level2_left_in_txt' id='"+root.all[i]+"_left_inner_txt' onclick='showlevel2(this.id,-1)'>"+allcon[root.all[i]].title+ "</div>"
							+"</span><br/>");
		if (root.all[i]==l1num) movetitle(root.all[i]+'_left_inner',60,1);
		$('#'+root.all[i]+'_left_inner_txt').css("opacity",0.5);
	}
	changewidhei();
	var inhtml = '';
	if (l1num==(alltot-2).toString()) {
		if (searchmode == 0){
			if (!isIE) {
				inhtml = '<input type="text" id="searchboxtext" class="level2_content_up_searchboxinput"/>';
				inhtml+= '<span class="level2_content_up_searchboxclr" onclick="clrsearchboxtext();">X</span>';
			}
			else
				inhtml =  '<input rows="auto" cols="20" type="text" id="searchboxtext" class="level2_content_up_searchboxtextie" value=""/>';
			inhtml+= '<input type="button" id="searchboxsubmit" class="level2_content_up_searchboxsubmit" value="搜索" onclick="findit();"/>';
		}else{
			if (!isIE) {
				inhtml = '<textarea id="searchboxtext" class="level2_content_up_searchboxcode" value=""></textarea>';
			}
			else{
				inhtml = '<textarea rows="5" id="searchboxtext" class="level2_content_up_searchboxtextie"></textarea>';
				inhtml+= '<span class="level2_content_up_searchboxclr" onclick="clrsearchboxtext();">X</span>';
			}
			inhtml+= ' <input type="button" id="searchboxsubmit" class="level2_content_up_searchboxsubmit" value="运行" onclick="findit();"/>';
		}
		$("#content_up").append(inhtml);
		document.getElementById("searchboxtext").focus();
		showtagup("content_up","input");
	}else{
		var now = allcon[l1num];
		var inhtml = '';
		var classname='';
		for (i=1;i<=now.total;i++){
			if (now.all[i]!=l2num) classname = 'level2_content_up_in';
			else classname = 'level2_content_up_in_choose';
			$("#content_up").append("<span id='" + now.all[i]+ "_content_up' class='"+classname+"' onclick='showlevel2("+l1num+",this.id)'>"+ allcon[now.all[i]].title +"</span>");
		}
		if (now.total==0)	$("#content_up").append("<span class='level2_content_up_in' style='cursor:default;'>什么都没有哦！</span>");
		if (l2num!=-1){
			$("#content_bottom").empty();
			allcon[l2num].showdown(1,"content_bottom");
		}else{
			$("#content_bottom").empty().append("<span id='havealook'>随便看看：</span><br/>");
			allcon[l1num].showdown(11,"content_bottom");
			showtagup("content_up","span");
		}
		showtagup("content_bottom","img");
		showtagup("content_bottom","span");
	}
	$("#content_up").append("<br/><div style='width:100%; height:1px; position:absolute; top:0;'>&nbsp;</div>");
	changewidhei();
}
function level1image(number,width){
	var coner = allcon[number];
	if (coner.ico=='') return;
	var target = document.getElementById(coner.number.toString());
	if (!target) return;
	var height = width;
	target.innerHTML = joininimage(coner.id+'_ico',coner.ico,coner.title,width,height);
	target.innerHTML += coner.title;
}
function showlevel1(){
	killall(1);
	nowlevel = 1;
	nowl1num = -1; nowl2num = -1; nowl3num = -1;
	setallCookies();
	$("#content").append("<div class='level1_out' id='content_mid'></div>");
	var target = $("#content_mid");
	for (i=1;i<=root.total;i++) { 
		if (root.all[i]!=alltot-1){
			target.append("<span id='" + root.all[i]+ "' class='level1_in' onclick='showlevel2(this.id,-1)'>"+ allcon[root.all[i]].title +"</span>");
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
	if (nowlevel!=2) showlevel1();
	else {
		if (nowl3num!=-1) {
			setTimeout("showit("+nowl3num+")",300);
		}
		showlevel2(nowl1num,nowl2num);
	}
}
function viewstart(){
	getallCookies();
	reshowlevel();
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
	$("#body").css("overflow",'hidden');
	do
		bgnum= Math.round(Math.random()*(bgimg.length-0.5));
	while (bgnum<0 || bgnum>=bgimg.length);
	bgimager();
});