//global variables
var distracters = [];
var q_type = "";
var stemHTML = "";
var nItems = 0;

/*********************** Statement Confirm **********************************/
function writeQuestion() {
  $("div.stem").html(stemHTML);
  
  $("#qForm").append("<table id='qTable' width='97%' cellspacing='0' cellpadding='8' border=0></table>");
  
  myTr = "<tr><td class='rdck'>";
  myTr += "<input name='quest' id='a' type='checkbox' onclick='goNext()' /></td>";
  myTr += "<td>&nbsp;</td>";
  myTr += "<td class='disTxt'><label for='a'>" + distracters[0] + "</label></td></tr>";
  $("#qTable").append(myTr);
	  
  $("input[name='quest']").css("cursor", "pointer");
}

function parseXML(xmlData) {
	var imgHTML = "";
	var pgNode = $(xmlData).find("page");
	var layout = $(pgNode).attr("layout");
	hasGraphic = ($(pgNode).attr("has_graphic") == "yes") ? true : false;
	q_type = $(pgNode).attr("q_type");
	
	processCommon( pgNode );
	
	q_stem = $(pgNode).find("stem");
	
	stemHTML = processText( q_stem );

	if (hasGraphic) {
	  	//process image if there is one
	  	imgNode = $(pgNode).find("graphic");
		imgHTML = processImg( imgNode );
	}

	//dist = $(q_stem).next();
	dist = $(pgNode).find("distractors");
	nItems = $(dist).children().length;

	$(dist).children().each(function(i) {
		distracters.push($(this).text());
	});

	writeQuestion();
}

/********** disable context menu *************/
var message="This function is disabled!"; 
document.oncontextmenu = new Function("alert(message); return false;");
