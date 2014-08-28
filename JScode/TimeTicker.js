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