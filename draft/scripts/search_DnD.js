/***************** Flash Drag and Drop Question **********************/
var q_type = "";
var stemHTML = "";

function parseXML(xmlData) {
	var imgHTML = "";
	var pgNode = $(xmlData).find("page");
	var layout = $(pgNode).attr("layout");
	hasGraphic = ($(pgNode).attr("has_graphic") == "yes") ? true : false;
	//q_type = $(pgNode).attr("q_type");
	
	processCommon( pgNode );
	
	//this is also in flash
	/*
	q_stem = $(pgNode).find("stem");
	stemHTML = processText( q_stem );
  	$("div.stem").html(stemHTML);
	*/
	
	hasDlink = ($(pgNode).attr("dlink") == "yes") ? true : false;
	if ( hasDlink ) {
		processDlink( $(pgNode).find("dlink") );
	}
}

/********** disable context menu *************/
var message="This function is disabled!"; 
document.oncontextmenu = new Function("alert(message); return false;");
