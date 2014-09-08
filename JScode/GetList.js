var allcon = new Array();
var showlist = new Array();
var titlesta = new Array();		
var listcon=new Array(),listscore=new Array();
var docost=7.0,limit = 7;
var waittot = 0,showtot=0;
var alltot = 0;
var listtot = 0;
var root = new container("root","根节点",'','','','',0,0,'');
var ico_id_suffix = "_ico";
var imager_id_suffix = "_imager";
var detail_id_suffix = "_detail";
var linker_id_suffix = "_linker";
var type_id_suffix = "_type";
var icon_address = "icon/";

function predownload(src){
	var img = new Image();
	img.src = src;
	return img.complete;
}
function container(id,title,detail,linker,ico,imager,level,number,type,father){
	this.id = id;
	this.title = title;
	this.detail = detail;
	this.linker = linker;
	this.imager = imager;
	if (ico)
		this.ico = icon_address + ico;
	else this.ico = '';
	this.type = type;
	predownload(imager);
	predownload(this.ico);
	this.level = level;
	this.number = number;
	this.father = father;
	this.all = new Array();
	this.total = 0;
}
function Trim(str){
	return str.replace(/(^\s*)|(\s*$)/g, ""); 
}
container.prototype.toJson = function toJson(){
	var str = '';
	str += '{\n';
	str += '\t"title":"'+this.title+'",\n';
	str += '\t"ico":"'+this.ico+'",\n';
	str += '\t"imager":"'+this.imager+'",\n';
	str += '\t"level":'+this.level+',\n';
	str += '\t"number":'+this.number+',\n';
	str += '\t"father":'+this.father+',\n';
	str += '\t"detail":[\n';
	var det = this.detail.split("<br>");
	for (var i=0; i< det.length;i++){
		str+= '\t\t"'+Trim(det[i])+'"';
		if (i+1!=det.length) str += ',\n';
		else str += '\n';
	}
	str += '\t],\n';
	var lnk = this.linker.split("<a href=");
	str += '\t"linker":[\n';
	for (var i=1; i< lnk.length;i++){
		var tmp = lnk[i].split("\">")
		str+= '\t\t{"name":"'+Trim(tmp[1])+'","src":'+tmp[0]+'"}';
		if (i+1!=lnk.length) str += ',\n';
		else str += '\n';
	}
	str += '\t]\n';
	str += '},\n';
	return str;
}
container.prototype.showself = function showself(a,tid){
	if ($('#'+tid)==null) return;
	var title;
	if (!this.ico || a==0)
		if (this.level==3) title = "→ " + this.title;
		else if (this.level==2) title = "√ " + this.title;
		else if (this.level==1) title = "「 "+this.title+" 」";
		else title = this.title;
	else title = this.title;
	if (a==1 && this.ico){
		title = title.replace("(","<br/>(");
		$('#'+tid).append("<span class='level2_content_bottom_in_ico' id='"+this.number+"_bottom_inner' onmouseover='movetitle(this.id,128,1)' onmouseout='movetitle(this.id,128,-1)'>"
									+"<img class='level2_content_bottom_in_img' id='"+this.number+"_bottom_inner_img' src= '"+this.ico+"' alt= '"+this.title+"' width='128px' height='128px' style='cursor:pointer;' onclick='showit(this.id)'/>"
									+"<div class='level2_content_bottom_in_icotxt' id='"+this.number+"_bottom_inner_txt' onclick='showit(this.id)'>"+title+ "</div>"
								+"</span>");
		$('#'+this.number+'_bottom_inner_txt').css("opacity",0.75);
		var target = document.getElementById(this.number+'_bottom_inner_txt');
		var autoheight = (target.innerHeight || target.clientHeight || target.offsetHeight);
		target.style.height = autoheight + 'px';
	}else{
		$('#'+tid).append("<br/><span id='"+this.number+"_bottom_outer' class='level2_content_bottom_in_txt'>"
							+"<span id='"+this.number+"_bottom_inner_txt' style='cursor:pointer; width:auto;' onclick='showit(this.id)'>"+title+ "</span>"
						+"</span>");
		$("#"+this.number+"_bottom_inner_txt").css({"font-size":"+=5","lineHeight":"1.5"});
		$("#"+this.number+"_bottom_inner_txt").mouseenter(function(){
			$(this).animate({'paddingLeft':'+='+20* !$.fx.off},100);
		});
		$("#"+this.number+"_bottom_inner_txt").mouseleave(function(){
			$(this).animate({'paddingLeft':'-='+20* !$.fx.off},100);
		});
		return 0;
	}
}
container.prototype.showdown = function showdown(a,tid,mode){
	var list = new Array(),status= new Array();
	tou = -1; wei = 0; list[wei] = this.number;
	while (tou!=wei){
		tou ++;
		if (allcon[list[tou]].total){
			for (var i=0;i<allcon[list[tou]].total;i++)
				list[++wei] = allcon[allcon[list[tou]].all[i]].number;
		}
	}
	if (a=='all'){
		for (var i=0;i<=wei;i++)
			allcon[list[i]].showself(mode,tid);
	}else{
		tc = 1; tw = wei;
		while (tc<=tw){
			var i=Math.round(Math.random()*(tw-tc+1)+0.5)+tc-1;
			if (allcon[list[i]].ico){
				var t = list[tc]; list[tc] = list[i]; list[i] = t;
				tc++;
			}else{
				var t = list[tw]; list[tw] = list[i]; list[i] = t;
				tw--;
			}
			if (--a==0) break;
		}
		for (var i=1;i<tc;i++) allcon[list[i]].showself(mode,tid);
		for (var i=tw+1;i<=wei;i++) allcon[list[i]].showself(mode,tid);
	}
}
		
function min(q,w,e){
	var temp =q;
	if (temp>w) temp = w;
	if (temp>e) temp = e;
	return temp;
}
function between(c1,c2){
	if (c1 == c2) return docost / 73.0;
	if (c1.toUpperCase()==c2.toUpperCase()) return docost / 71.0;
	return docost;
}
function editdistance(s1,s2){
	var f = new Array();
	var i,ti,t,j,l1=s1.length,l2=s2.length;
	if (!l1 || !l2) return 10000;
	for (i=0;i<=1;i++){
		f[i] = new Array();
	}
	for (i=0;i<=l2;i++){
		f[0][i] = i*docost+limit;
	}
	for (i=1;i<=l1;i++){
		ti = i & 1; f[ti][0] = i*docost+limit;
		for (j=1;j<=l2;j++){
			t = between(s1[i-1],s2[j-1]);
			if (t<1 && i-1>0 && j-1>0 && between(s1[i-2],s2[j-2])<1) t -= 1;
			f[ti][j] = min(f[1-ti][j-1]+t,f[1-ti][j]+docost, f[ti][j-1]+docost);
		}
	}
	return f[l1 & 1][l2];
}
function qsort(q,w){
	var e=q,r=w,t=listscore[(q+w)>>1],y,u;
	do{
		while (listscore[e]<t) e++;
		while (listscore[r]>t) r--;
		if (e<=r){
			y = listcon[e]; listcon[e] = listcon[r]; listcon[r] = y;
			u = listscore[e]; listscore[e] = listscore[r]; listscore[r] = u;
			e++; r--;
		}
	}while(e<r);
	if (e< w) qsort(e,w);
	if (q< r) qsort(q,r);
}
container.prototype.score = function score(s){
	var scoretitle = editdistance(this.title,s) - Math.abs(this.title.length-s.length)*docost+0.001;
	var scoredetail = 201;
	if (this.detail.length){
		for (var i=0;i<this.detail.length;i++)
			if (this.detail[i].length)
				scoredetail = Math.min(scoredetail,editdistance(this.detail[i],s) - Math.abs(this.detail[i].length-s.length)*docost+0.001);
	}
	return scoretitle*scoretitle*scoretitle * scoredetail /1.0 /(this.level);
}
container.prototype.finddown = function finddown(s,a){
	if (a==0) listtot = 0;
	for (var i=0;i<this.total;i++)
		allcon[this.all[i]].finddown(s,a+1);
	if (this.level>0){
		listcon[listtot] = this.number;
		listscore[listtot]	= this.score(s);
		listtot ++;
	}
	if (a==0){
		qsort(0,listtot-1);
	}
}
function movetitle(s,len,i){
	var t = document.getElementById(s+"_txt");
	var autoheight = (t.innerHeight || t.clientHeight || t.offsetHeight);
	$("#"+s+'_txt').stop(true).animate({top:Math.max(0,len-i*autoheight)},100);
}
container.prototype.add = function add(target){
	this.all[this.total++] = target.number;
}
$(document).ready(function(){
	$.getJSON("data/list.json", function(res){
		allcon[0] = root; alltot = 1;
		for (var i=1;i<res.all.length;i++){
			title = res.all[i].title.replace(new RegExp('_', 'g')," ");
			id = title;
			tot = res.all[i].level;
			detail = res.all[i].detail;
			linker = res.all[i].linker;
			ico = res.all[i].ico;
			imager = res.all[i].imager;
			type = 0;
			number = res.all[i].number;
			father = res.all[i].father;
			allcon[i] = new container(id,title,detail,linker,ico,imager,tot,number,type,father);
			allcon[allcon[i].father].add(allcon[i]);
			alltot ++;
		}
		viewstart();
	});
});