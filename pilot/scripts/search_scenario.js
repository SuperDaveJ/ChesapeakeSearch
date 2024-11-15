//global variables
var fdbkDoc = "";
var textHTML = "";
var imgHTML = "";

/*********************** Scenario Exercise **********************************/
function addButton() {
  //add submit button
  $("#content").append("<div id='submit'/>");
  var txtHTML = "";
  txtHTML = "<a href='javascript:judgeInteraction()' title='submit'>";
  txtHTML += "<img class='button' src='../sysimages/submit_0.png' onmouseover='this.src=&quot;../sysimages/submit_2.png&quot;' onmouseout='this.src=&quot;../sysimages/submit_0.png&quot;' alt='submit' id='done' name='done' border='0' />";
  txtHTML += "</a>";
  
  $("#submit").html(txtHTML);
}

function processFileList() {
}

function judgeInteraction() {
	openWinCentered(fdbkDoc, 'Feedback', 900, 720, 'yes', 'yes' );
	$("#next").show();
}

function parseXML(xmlData) {
	var imgHTML = "";
	var pgNode = $(xmlData).find("page");
	var layout = $(pgNode).attr("layout");
	hasGraphic = ($(pgNode).attr("has_graphic") == "yes") ? true : false;
	q_type = $(pgNode).attr("q_type");
	
	processCommon( pgNode );
	
	txt_root = $(pgNode).find("steps");
	file_list = $(pgNode).find("file_list");
	
	txtHTML = processText( txt_root );
	
	jaHTML = "<p class='title'>Exercise Files</p>" + processText(file_list);
	
	if (hasGraphic) {
	  	//process image if there is one
	  	imgNode = $(pgNode).find("graphic");
		imgHTML = processImg( imgNode );
	}

	fdbkDoc = $(pgNode).find("feedback").attr("file");

	layoutPage(layout, txtHTML, jaHTML);
	addButton();
}
