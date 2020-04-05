function applyConfig(){
	$("body").css("background-image","url(" + CONFIG.backgroundImg + ")")
	applySearchEngines(ENGINES.index[CONFIG.default_search_engine].short_name)
	initBookmarks(CONFIG.bookmarks)
}

function createBookmarksRowObj(){
	return $("<div class=\"bookmarks_row\"></div>")
}

function createBookmarkObj(b){
	var html='<a class="bookmarks_cell" href="'+b.url+'" target="_blank">'
	html+='<div class="bookmarks_img_box">'
	var icoUrl=getIcoUrl(b.url)
	if(icoUrl){
		html+='<img class="bookmarks_img_ico" src="'+icoUrl+'"/>'
	}else{
		html+='<div class="bookmarks_img_ABC">'+b.name[0].toUpperCase()+'</div>'
	}
	html+='</div>'
	html+='<div class="bookmarks_name">'+b.name+'</div>'
	html+='</a>'
	return $(html)
}

function initBookmarks(bookmarks){
	console.log(bookmarks)
	var bookmarksList=bookmarks.list
	var bookmarksLayout=Array.from(bookmarks.layout)
	var bookmarksLayoutIndex=0
	var bookmarksRowObj=createBookmarksRowObj()
	var bookmarksBox=$("#bookmarks_box")
	bookmarksBox.empty()
	for(var b of bookmarksList){
		if(!bookmarksLayout[bookmarksLayoutIndex]){
			bookmarksBox.append(bookmarksRowObj)
			bookmarksRowObj=createBookmarksRowObj()
			bookmarksLayoutIndex+=1
		}
		bookmarksRowObj.append(createBookmarkObj(b))
		bookmarksLayout[bookmarksLayoutIndex]-=1
	}
	if(bookmarksRowObj.children().length){
		bookmarksBox.append(bookmarksRowObj)
	}
}

function initSearchListening(){
	var oSearch = $("#search")
	oSearch.focus()
	var notSearchKeyupRes=new Set([39,40,37,38,13])
	oSearch.keyup(function(event){
		var searchText=oSearch.val()
		if(isShiftEngineCommand(searchText)){
			applySearchEngines(searchText)
			oSearch.val("")
			showKeyword([])
			return
		}
		searchText=searchText.trim()
		if(searchText==""){
			showKeyword([])
			return;
		}
		if(!notSearchKeyupRes.has(event.which)){
			var engine=ENGINES.enabled[0]
			$.ajax({
				url:engine.keyword_url,
				type:"GET",
				timeout: 5000,
				dataType: 'jsonp',
				data:{
					[engine.keyword_query_key]:searchText
				},
				success: function (json) {
					var keywordList=engine.keyword_parser(json)
					showKeyword(keywordList)
				},
				error: function (xhr) {
					console.log(xhr)
					return
				}
			})
		}
	})
	oSearch.keydown(function(event){
		if(event.which!=40&&event.which!=38){
			return
		}
		var keywordChildren=$("#keyword_list").children()
		var n=keywordChildren.length
		if(!n){
			return
		}
		if(hoverIndex<0||(keywordChildren.eq(hoverIndex).text()==oSearch.val())){
			if(event.which==40){
				hoverIndex=(hoverIndex+1)%n
			}else{
				hoverIndex=(Math.max(-1,hoverIndex-1)+n)%n
			}
		}
		var selectObj=keywordChildren.eq(hoverIndex)
		oSearch.val(selectObj.text())
		selectObj.mouseenter()
		event.preventDefault()
	})
	$("#search_box").submit(function(e){
		var searchText=oSearch.val().trim()
		openSearch(searchText)
		e.preventDefault()
	})
}

$(document).ready(function(){
	applyConfig()
	initSearchListening()
})