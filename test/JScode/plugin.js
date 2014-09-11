/* tzCheckBox 相关函数 */
(function($){
	$.fn.tzCheckbox = function(options){
		
		// Default On / Off labels:
		
		options = $.extend({
			labels : ['ON','OFF']
		},options);
		
		return this.each(function(){
			var originalCheckBox = $(this),
				labels = [];

			// Checking for the data-on / data-off HTML5 data attributes:
			if(originalCheckBox.data('on')){
				labels[0] = originalCheckBox.data('on');
				labels[1] = originalCheckBox.data('off');
			}
			else labels = options.labels;

			// Creating the new checkbox markup:
			var checkBox = $('<span>',{
				'class'	: 'tzCheckBox '+(this.checked?'checked':''),
				'html':	'<span class="tzCBContent" id="'+$(this).attr('id')+'_content">'+labels[this.checked?0:1]+
						'</span><span class="tzCBPart"></span>'
			});

			// Inserting the new checkbox, and hiding the original:
			checkBox.insertAfter(originalCheckBox.hide());

			checkBox.click(function(){
				checkBox.toggleClass('checked');
				
				var isChecked = checkBox.hasClass('checked');
				
				// Synchronizing the original checkbox:
				originalCheckBox.attr('checked',isChecked);
				originalCheckBox.change();
				checkBox.find('.tzCBContent').html(labels[isChecked?0:1]);
			});
			
			// Listening for changes on the original and affecting the new one:
			originalCheckBox.bind('click',function(){
				checkBox.click();
			});
		});
	};
	$(document).ready(function(){
		$('input[type=checkbox]').tzCheckbox({labels:['Enable','Disable']});
		// To use tzCheckbox
	});
})(jQuery);

/* 文字跟随鼠标 */

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

/* 时间跳动函数 */

$(function(){
	var TimeTikerId="TimeTicker";
	var TimeTiker_Time=507;
	function UpdateTime() {
		var dq = new Date();
		var hq, mq, sq, strq, yyq, mmq, ddq;
		yyq = dq.getFullYear();
		mmq = dq.getMonth() + 1;
		ddq = dq.getDate();
		hq = dq.getHours();
		mq = dq.getMinutes();
		sq = dq.getSeconds();
		strq = "&nbsp;" + yyq + "年" + mmq + "月" + ddq + "日<br>&nbsp;";
		if (hq < 10) strq += "0"; strq += hq; strq += ":";
		if (mq < 10) strq += "0"; strq += mq; strq += ":";
		if (sq < 10) strq += "0"; strq += sq;
		$("#"+TimeTikerId).html("<table border=0 cellSpacing=0 cellPadding=0 ><tr><td nowrap><font color=#110033 size=2><b>" + (strq) + "</b></font></td></tr></table>");
		//setTimeout("UpdateTime()", 507); //设置过1000毫秒就是1秒，调用UpdataTime方法
	}
	function showdata() {
		var date = new Date(); //日期对象
		var now = "";
		now = date.getFullYear() + "-"; //读英文就行了
		now = now + (date.getMonth() + 1) + "-"; //取月的时候取的是当前月-1如果想取当前月+1就可以了
		now = now + date.getDate() + " ";
		now = now + date.getHours() + ":";
		now = now + date.getMinutes() + ":";
		now = now + date.getSeconds() + "";
		$("#"+TimeTikerId).text("<table border=1 cellSpacing=0 cellPadding=0 width=100% borderColorDark=#ffcccc borderColorLight=whitesmoke height=100% style='BORDER-RIGHT-COLOR: #cccccc;BORDER-LEFT-COLOR: #cccccc;BORDER-TOP-COLOR: #cccccc;BORDER-BOTTOM-COLOR: #cccccc;'><tr><td valign=middle align=left nowrap><font color=#110033 size=3><b>" + (now) + "</b></font></td></tr></table>"); //div的html是now这个字符串
		setTimeout("showdata()", 507); //设置过1000毫秒就是1秒，调用show方法
	}
	$(document).ready(function(){
		window.setInterval(function(){UpdateTime()},TimeTiker_Time);
	});
});