var ENGINES={
	list:[],
	index:{},
	short_index:{},
	enabled:[]
}

ENGINES.list.push(
	{
		name:"baidu",
		short_name:"b",
		icon:"./resources/baiduicon.png",
		keyword_parser:function(json){
				if(json.g){
					return json.g.map(i=>{return i.q})
				}else{
					return []
				}
			},
		keyword_url:"https://www.baidu.com/sugrec?ie=utf-8&json=1&prod=pc&from=pc_web",
		keyword_query_key:"wd",
		search_url:"https://www.baidu.com/s?wd="
	}
)
ENGINES.list.push(
	{
		name:"bing",
		short_name:"i",
		icon:"./resources/bingicon.png",
		keyword_parser:function(json){
				if(json.AS&&json.AS.Results&&json.AS.Results[0]&&json.AS.Results[0].Suggests){
					return json.AS.Results[0].Suggests.map(i=>{return i.Txt})
				}else{
					return []
				}
			},
		keyword_url:"http://api.bing.com/qsonhs.aspx?type=cb&cb=?",
		keyword_query_key:"q",
		search_url:"https://cn.bing.com/search?q="
	}
)
ENGINES.list.push(
	{
		name:"google",
		short_name:"g",
		icon:"./resources/googleicon.png",
		keyword_parser:function(json){
				return json[1].map(i=>{return i[0]})
			},
		keyword_url:"http://suggestqueries.google.com/complete/search?client=psy-ab&jsonp=?",
		keyword_query_key:"q",
		search_url:"https://www.google.com/search?q="
	}
)

for(var _e of ENGINES.list){
	ENGINES.index[_e.name]=_e
	ENGINES.short_index[_e.short_name]=_e
}