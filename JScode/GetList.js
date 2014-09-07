var allcon = new Array();
var showlist = new Array();
var titlesta = new Array();
var waittot = 0,showtot=0;
var alltot = 0;
var root = new container("root","根节点",'','','','',0,0,'');
var ico_id_suffix = "_ico";
var imager_id_suffix = "_imager";
var detail_id_suffix = "_detail";
var linker_id_suffix = "_linker";
var type_id_suffix = "_type";
var icon_address = "icon/";

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
container.prototype.add = function add(target){
	this.total++;
	this.all[this.total] = target.number;
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
	if (a==1 && this.ico)	title = title.replace("(","<br/>(");
	if (a==1){
		if (this.ico){
			$('#'+tid).append("<span class='level2_content_bottom_in_ico' id='"+this.number+"_bottom_inner' onmouseover='movetitle(this.id,128,1)' onmouseout='movetitle(this.id,128,-1)'>"
										+"<img class='level2_content_bottom_in_img' id='"+this.number+"_bottom_inner_img' src= '"+this.ico+"' alt= '"+this.title+"' width='128px' height='128px' style='cursor:pointer;' onclick='showit(this.id)'/>"
										+"<div class='level2_content_bottom_in_icotxt' id='"+this.number+"_bottom_inner_txt' onclick='showit(this.id)'>"+title+ "</div>"
								+"</span>");
			$('#'+this.number+'_bottom_inner_txt').css("opacity",0.75);
			var target = document.getElementById(this.number+'_bottom_inner_txt');
			var autoheight = (target.innerHeight || target.clientHeight || target.offsetHeight);
			target.style.height = autoheight + 'px';
			return 0;
		}else{
			return 1;
		}
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
container.prototype.showdown = function showdown(a,tid){
	var tou=-1,wei=0,i,temp;
	var list = new Array();
	var status = new Array();
	list[0] = this.number;
	while (tou<wei){
		tou++;
		temp = allcon[list[tou]];
		if (a==0 || a==1) status[tou] = temp.showself(a,tid);
		else status[tou] = 0;
		for (i=1;i <= temp.total;i++){
			list[++wei] = temp.all[i];
		}
	}
	tou = wei;
	while (a>1 && tou>=0){
		do{
			temp = Math.round(Math.random()*(tou+1));
		}while (temp<0 || temp>tou)
		if (allcon[list[temp]].level==3){
			status[temp] = allcon[list[temp]].showself(1,tid);
			a--;
		}
		i = status[temp]; status[temp] = status[tou]; status[tou] = i;
		i = list[temp]; list[temp] = list[tou]; list[tou] = i;
		tou--;
	}
	if (a>=1)
		for (i=0;i<=wei;i++)
			if (status[i]==1){
				allcon[list[i]].showself(0,tid);
			}	
	changewidhei();
}
function movetitle(s,len,i){
	var t = document.getElementById(s+"_txt");
	var autoheight = (t.innerHeight || t.clientHeight || t.offsetHeight);
	$("#"+s+'_txt').stop(true).animate({top:Math.max(0,len-i*autoheight)},100);
}
function predownload(src){
	var img = new Image();
	img.src = src;
	return img.complete;
}
$(document).ready(function(){
	$("#left").css("display",'none').remove();
	$("#root").css("display",'none').remove();
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