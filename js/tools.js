function cleanSearchText(t){
	return encodeURI(t.replace(/%/g, "%25").replace(/#/g, "%23").replace(/\+/g, "%2B"))
}

function replaceStyle(name,cssText){
	var styleSheet = document.styleSheets[0]
	var n=styleSheet.rules.length
	for(var i=0;i<n;i++){
		if(styleSheet.rules[i].name==name){
			styleSheet.deleteRule(i)
			break
		}
	}
	styleSheet.insertRule(cssText)
}

function getIcoUrl(url){
	var re=/[^\s]+\.[^\s]+/i;
	if(!re.test(url)){
		return undefined;
	}
	var urlSplit=url.split('/');
	return urlSplit[0]+'/'+ urlSplit[1]+'/'+urlSplit[2]+'/' + "favicon.ico"
}