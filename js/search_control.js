function isShiftEngineCommand(t){
	if(!t.endsWith(" ")){
		return false
	}
	t=t.trim()
	if(!t.length){
		return false
	}
	if(t=="A"){
		return true
	}
	for(var c of t){
		if(c!=" "&&(!ENGINES.short_index[c])){
			return false
		}
	}
	return true
}

function cleanEngineCommand(t){
	t=t.trim()
	if(t=="A"){
		var defaultShortname=ENGINES.index[CONFIG.default_search_engine].short_name
		var ans=defaultShortname
		for(var i in ENGINES.short_index){
			if(i!=defaultShortname){
				ans+=i
			}
		}
		return ans
	}else{
		return t
	}
}

var hoverIndex=-1

function showKeyword(keywordList){
	var box=$("#keyword_list")
	box.css("height",box.height())//先固定高度，后面再放开，避免闪烁
	box.empty()
	hoverIndex=-1
	var n=keywordList.length
	var engine=ENGINES.enabled[0]
	for(var index in keywordList){
		var keyword=keywordList[index]
		var searchKey=cleanSearchText(keyword)
		var html="<a class=\"keyword_link\" href=\""+engine.search_url+searchKey+"\" target=\"_blank\" _index_=\""+index+"\">"+keyword+"</a>"
		box.append(html)
	}
	box.css("height","fit-content")
	if(!n){
		return
	}
	$(".keyword_link").click(function(e){
		openSearch($(this).text())
		e.preventDefault()
	})
	$(".keyword_link").mouseenter(function(e){
		var thisObj=$(this)
		hoverIndex=parseInt(thisObj.attr("_index_"))
		thisObj.addClass('keyword_link_hover').siblings().removeClass('keyword_link_hover')
	})
}

function applySearchEngines(shortEngineName){
	shortEngineName=cleanEngineCommand(shortEngineName)
	var enabled=[]
	for(var c of shortEngineName){
		if(ENGINES.short_index[c]){
		    enabled.push(ENGINES.short_index[c])
		}
	}
	var n=enabled.length
	if(!n){
		return
	}
	ENGINES.enabled=enabled
	var engineIconDiv=$("#search_icon_box")
	engineIconDiv.empty()
	if(n==1){
		var html="<img class=\"search_icon\" src=\"" + ENGINES.enabled[0].icon +"\" />"
		engineIconDiv.append(html)
	}else{
		var html="<div id=\"search_icon_animation\" style=\"height:50px;width:"+(50*(n+1))+"px;animation:engine_icon_switch "+(n*3)+"s cubic-bezier(0.66,-0.4, 0.32, 1.47) infinite;\">"
		for(var engine of enabled){
			html+="<img class=\"search_icon\" src=\""+ engine.icon +"\"/>"
		}
		html+="<img class=\"search_icon\" src=\""+ ENGINES.enabled[0].icon +"\"/>"
		html+="</div>"
		var stepStop=100.0/3*2/n
		var stepMove=100.0/3/n
		var _s1=0.0
		var _s2=0.0
		var keyframesText="@keyframes engine_icon_switch {"
		for(var i in enabled){
			_s2=_s1+stepStop
			keyframesText+=" "+_s1.toFixed(2)+"%,"+_s2.toFixed(2)+"% {margin-left: -"+(i*50)+"px;} "
			_s1=_s2+stepMove
		}
		keyframesText+=" 99.9%,100.0% {margin-left: -"+(n*50)+"px;}}"
		replaceStyle("engine_icon_switch",keyframesText)
		engineIconDiv.append(html)
	}
}

function openSearch(searchText){
	if (searchText.length > 0) {
		for(var engine of ENGINES.enabled){
			window.open(engine.search_url + cleanSearchText(searchText))
		}
	}
}