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
var viewChangeWidth=new Array(0,640,1024,10000);
var viewModesSuffix=new Array(" mobile"," pad"," computer");
var viewmode = 0;
var classSuffix=' mobile';

function debugit(x,name){
	$("#debugger").append("<p>" + name + ' ' + x + "</p>");
}
function timage(id,url,alt,width,height,align){
	width = width || "auto";
	height = height || "auto";
	return "<img id='"+id+"' src='"+url+"' alt='"+alt+"' width='"+width+"px' height='"+height+"px' align='"+align+"'/>";
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
		searchboxmaker();
		return;
	}
	if (t.value=="search" && searchmode==1){
		searchmode = 0;
		searchboxmaker();
		return;
	}
	if (searchmode==0){
		$("#"+target).empty().append("搜索中..... 请稍候....<br/>");
		allcon[0].finddown(t.value,0);
		$("#"+target).empty();
		for (i=0;i< listcon.length;i++){
			allcon[listcon[i]].showself(0,target,'sch');
			//bottom.innerHTML += "&nbsp;&nbsp;&nbsp;&nbsp;" + listscore[i] +"&nbsp;&nbsp;&nbsp;&nbsp;" + i +"&nbsp;&nbsp;&nbsp;&nbsp;" + listcon[i] +"&nbsp;&nbsp;&nbsp;&nbsp;" + allcon[listcon[i]].id ;
		}
		showtagup(target,"span");
	}
	else{
		$("#"+target).append("<hr/><pre>"+t.value+"</pre><br/>");
		var result;
		if (t.value=="help"){
			result = "<br/>"+target+" 表示当前的窗口<br/> "+get+" 表示编辑窗口 <br/> root 为根节点<br/> ";
		}else{
			result = eval(t.value);
		}
		$("#"+target).append(result+"<br/>");
	}
	$(window).resize();
}
var EnterSubmit = function(evt){
	evt = window.event || evt;
	if (evt.keyCode == 13)
	{
		if (nowsection==root.total-2){
			var target = document.getElementById("searchboxtext");
			if (target && (!target.value || searchmode)){
				target.focus();
				return;
			}
			var target = document.getElementById("searchboxsubmit");
			if (target && !searchmode){
				target.click();
			}
		}
		else{
			var target = document.getElementById("searchboxtext");
			if (target)
				$.fn.fullpage.moveTo(root.total);
		}
	}
}
function clrsearchboxtext(){
	var target = document.getElementById("searchboxtext");
	if (!target) return;
	target.value = '';
	target.focus();
}
function resizedwindow(){
	var nowViewMode=0;
	while (viewChangeWidth[nowViewMode+1]<inwidth) nowViewMode++;
	if (nowViewMode!=viewmode){
		viewmode = nowViewMode;
		classSuffix = viewModesSuffix[viewmode];
		$("#header").remove();
		$("#content").remove();
		viewstart();
	}
}

function searchboxmaker(){
	var inhtml = '';
	if (searchmode == 0){
		if (!isIE) {
			inhtml = "<input type='text' id='searchboxtext' class='searchboxinput"+classSuffix+"'/>";
			inhtml+= "<span class='searchboxclr"+classSuffix+"' onclick='clrsearchboxtext();'>X</span>";
		}
		else
			inhtml =  "<input rows='auto' cols='20' type='text' id='searchboxtext' class='searchboxtextie"+classSuffix+"' value=''/>";
		inhtml+= "<input type='button' id='searchboxsubmit' class='searchboxsubmit"+classSuffix+"' value='搜索' onclick='findit(\"searchboxtext\",\"content_bottom\");'/>";
	}else{
		if (!isIE) {
			inhtml = "<textarea id='searchboxtext' class='searchboxcode"+classSuffix+"' value=''></textarea>";
		}
		else{
			inhtml = "<textarea rows='5' id='searchboxtext' class='searchboxtextie"+classSuffix+"'></textarea>";
			inhtml+= "<span class='searchboxclr"+classSuffix+"' onclick='clrsearchboxtext();'>X</span>";
		}
		inhtml+= " <input type='button' id='searchboxsubmit' class='searchboxsubmit"+classSuffix+"' value='运行' onclick='findit(\"searchboxtext\",\"content_bottom\");'/>";
	}
	$("#content_up").html('').append(inhtml);
	$("#content_bottom").html('');
	$(window).resize();
}

var nowsection = 0;
var nowslide = 0;
var willslide = 0;
var befslide = new Array();
var showed = new Array();
function showoutline(index,slideIndex){
	if (slideIndex<0 || slideIndex >= (tmp = allcon[root.all[nowsection]]).total) return;
	if (showed[nowsection][slideIndex]) return;
	showed[nowsection][slideIndex] = true;
	var j = slideIndex;
	debugit(index + ' ' + slideIndex + ' ' + tmp.total + ' ' + nowsection + ' ' + root.all[nowsection]);
	allcon[tmp.all[j]].showdown("all","content_"+tmp.all[j],viewmode);
}
function fullpagemaker(){
	var colorlist=[];
	var maxlen = 6, opac = 0.75;
	for (var i=0;i<=maxlen;i++){
		var tmp = 255 - (maxlen-i-1)*10;
		colorlist[i] =	 "rgba("+tmp+','+tmp+','+tmp+','+opac+')';
	}
	$("#content").fullpage({
		sectionsColor: colorlist,
		resize: false,
		scrollingSpeed:300,
		css3:true,
		loopBottom: false,
		normalScrollElements: "#searchboxtext",
        keyboardScrolling: false,
		loopTop: false,
		easing: 'easeInQuart',
		autoScrolling: true,
		animateAnchor: true,
		navigation: false,
		slidesNavigation: true,
        slidesNavPosition: 'top',
        loopHorizontal: false,
		scrollOverflow: true,
		afterLoad: function(anchorLink, index){
			//using index
			if(index == "3"){
			//        alert("Section 3 ended loading");
			}
			//using anchorLink
			if(anchorLink == 'secondPage'){
			//        alert("Section 2 ended loading");
			}
		},
		afterRender: function(){
		},
		onLeave: function(index, nextIndex, direction){
            //after leaving section 2
			if (nextIndex == 1)
				$("#header").fadeOut();
			else
				$("#header").fadeIn();
			index-=2; nextIndex-=2;
			if (index==-1) index = root.total-1;
			if (nextIndex==-1) nextIndex = root.total-1;
			$("#header_"+root.all[index]).removeClass("active");
			$("#header_"+root.all[nextIndex]).addClass("active");
			befslide[index] = nowslide;
			nowslide = befslide[nextIndex];
			nowsection = nextIndex;
			debugit(nowsection + ' ' + nowslide,"section & slide:");
			$("#sectionselector").text(allcon[root.all[nowsection]].title);
        },
		onSlideLeave: function( anchorLink, index, slideIndex, direction){
			if (direction!='none'){
				var beg = Math.min(slideIndex, willslideto);
				var end = Math.max(slideIndex, willslideto);
				debugit(beg + ' ' + end, "beg and end");
				for (var i=beg;i<=end;i++)
					showoutline(index, i-1);
				$.fn.fullpage.reBuild();
			}
		},
		afterResize: function(){
			for (var i=0;i<root.total-1;i++){
				var tmp = allcon[root.all[i]];
				var slidebar = $("#section_"+tmp.number).find('.fp-slidesNav');
				var paddingheight = slidebar.height()+$("#header").height()+'px';
				$("#section_"+tmp.number).css("paddingTop",paddingheight);
			}
			$(".slimScrollBar").css("right","10px");
		}
	});	
	for (var i=0;i<root.total-1;i++){
		var tmp = allcon[root.all[i]];
		showed[i] = new Array();
		var f = $("#section_"+tmp.number).find('.fp-slidesNav').removeAttr("style").find('a').toArray();
		$(f[0]).html("<span>"+"随便看看"+"</span>").attr("id",0+"_Nav_"+i).click(function(){
			nowslide = willslideto = parseInt(this.id);
		});
		if (i+2<root.total){
			for (var j=0;j<tmp.total;j++){
				showed[i][j] = false;
-				$(f[j+1]).html("<span>"+allcon[tmp.all[j]].title+"</span>").attr("id",(j+1)+'_Nav_'+i).click(function(){
					nowslide = willslideto = parseInt(this.id);
				});
			}
		}
	}
	$(".fp-controlArrow").remove();
	$("#section_"+root.all[root.total-2]).prepend("<div id='content_up' class='fp-slidesNav top'></div>");
	searchboxmaker();
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
function showpage(index){
	index = parseInt(index);
	$.fn.fullpage.moveTo(index);
	$("#sectionselector").text(allcon[root.all[nowsection]].title);
	if ($("#sectionmain").hasClass("mobile") || $("#sectionmain").hasClass("pad")){
	}
}
function viewstart(){
	try{
		$.fn.fullpage.destroy("all");
	} catch(e){};
	$("#body").prepend("<div id='content'></div>");
	$("#body").prepend("<div id='header'></div>");
	$("#header").fadeOut(1);
//	$("#header").append("<div id='debugger' style='float:left; height:34px; width:100px; color:green;'>Debugger</div>");
	$("#header").append("<div id='logodiv' style='font-size:1em; float:left;'></div>")
				.append("<div id='section'></div>");
	$("#section").append("<div id='sectionselector' class='sectionselector"+classSuffix+"'>asdfjklasdfjklsd</div>")
				.append("<div id='sectionmain' class='sectionmain"+classSuffix+"'></div>");
	$("#logodiv").append("<div id='logo' class='logo "+classSuffix+"'>LM&nbsp;share</div>");
	$("#content").append("<div class='section' id='section_0'>"+
					//			"<div class='mid first' id='level1'></div>"+
							"</div>");
	$("#section_0").append("<div id='logoMain' class='logo "+classSuffix+"'>LM&nbsp;share</div>")
				.append("<div class='level1_out"+classSuffix+"' id='content_mid'></div>");
	var target = $("#content_mid");
	var i = root.total-1;
	$("#sectionmain").append("<div id='header_"+root.all[i]+"' class='sectioninner'  onclick='showpage("+1+")'>"+allcon[root.all[i]].title+"</div>");
	for (i=0;i<root.total;i++) {
		if (root.all[i]!=alltot-1){
			$("#sectionmain").append("<div id='header_"+root.all[i]+"' class='sectioninner'  onclick='showpage("+(i+2)+")'>"+allcon[root.all[i]].title+"</div>");
			target.append("<span id='" + root.all[i]+ "' class='level1_in"+classSuffix+"' onclick='showpage("+(i+2)+")'><span>"+ allcon[root.all[i]].title +"</span></span>");
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
	var menulist = [];
	var last = allcon[root.all[root.total-1]];
	$(".logo").lettering();
	for (var i=0;i<root.total-1;i++){
		var tmp = allcon[root.all[i]];
		if (i+2<root.total){
			$("#content").append("<div class='section' id='section_"+tmp.number+"'>"+
							"<div class='slide' id='slide_"+tmp.number+"'>"+
							"<div class='mid' id='content_"+tmp.number+"'></div>"+
							"</div>"+
						"</div>");
			tmp.showdown(10,"content_"+tmp.number,viewmode);
			for (var j=0;j<tmp.total;j++){
				$("#section_"+tmp.number).append("<div class='slide' id='slide_"+tmp.all[j]+"'>"+
									"<div class='mid' id='content_"+tmp.all[j]+"'></div>"+
								"</div>");
			}
		}else if (i==root.total-2){
			$("#content").append("<div class='section' id='section_"+tmp.number+"'>"+
									"<div class='mid' id='content_bottom'></div>"+
								"</div>");
		}
	}
	fullpagemaker();
	$(window).resize();
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
	$("body").css("overflow",'hidden');
});