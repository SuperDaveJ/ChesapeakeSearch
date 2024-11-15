//global variables
var xmlDoc;
var linkTxtStart = "(??)";
var linkTxtEnd = "(%??)";
var hasGraphic = false;
var triesUser = 0;
var triesLimit = 2;
var stemHTML = "";
var ansCorrect = "";
var fdbkWrong1 = "";
var fdbkWrong2 = "";
var fdbkCorrect = "";
var fdbkWrong0 = "You have not made any selections.  Please try again.";
var arrColTitle = [];
var arrRowTitle = [];

/*********************** Open Popup Window **********************************/
function openWinCentered(myUrl, myTitle, myWidth, myHeight, scrollbar, resize ) {
	// open the window
	positionTop = (screen.height - myHeight)/2 - 25;
	positionLeft = (screen.width - myWidth)/2 - 5;
	newWin = window.open (myUrl,myTitle,"toolbar=no,location=no,width="+myWidth+",height="+myHeight+",menubar=no,resizable="+resize+",status=no,scrollbars="+scrollbar+",top="+positionTop+",left="+positionLeft+"");
	if (window.focus) newWin.focus();
	return newWin;
}

function judgeInteraction() {
	var ch = ""; 
	var strTemp = "";
	var ansUser = "";
	//NOTE: id=r#c#;
	for (var i=1; i<=nRows; i++) {
		ch = $("input[name='row"+i+"']:checked").attr("id");
		ansUser += (ch == undefined) ? " " : ch.substr(ch.length-1, 1);
	}
	if ( ($.trim(ansUser)).length == 0 ) {
		strTemp = fdbkWrong0;
	} else {
		triesUser += 1;
		if (ansUser == ansCorrect) {
			triesUser = triesLimit;
			strTemp = fdbkCorrect;
			disableQ();
		} else {
			if (triesUser == triesLimit) {
				for (var r=1; r<=nRows; r++) {
					$("input[name='row"+r+"']").attr("checked", function(i, value) {
						if ( parseInt(ansCorrect.charAt(r-1))-1 == i ) return "checked";
						//else return "";
					});
				}
				strTemp = fdbkWrong2;
				disableQ();
			} else {
				strTemp = fdbkWrong1;
			}
		}
	}

	showFeedback(strTemp);
}

function disableQ() {
	$("input:radio").attr("disabled", "disabled");
    $("input:radio").css("cursor", "default");
}

/********** disable context menu *************/
var message="This function is disabled!"; 
//document.oncontextmenu = new Function("alert(message); return false;");


function layoutPage(layout, txtHTML, imgHTML) {
	switch (layout) {
		case "full":
			$("#content").append("<div id='full_screen'></div>");
			if (hasGraphic) {
				//full screen graphic
				$("#full_screen").html(imgHTML);
			} else {
				//full screen text
				$("#full_screen").html(txtHTML);
			}
			break;
		case "h_txt_img":
			$("#content").append("<div id='text_left'></div>");
			$("#content").append("<div id='img_right'></div>");
			$("#text_left").html(txtHTML);
			$("#img_right").html(imgHTML);
			break;
		case "h_img_txt":
			$("#content").append("<div id='img_left'></div>");
			$("#content").append("<div id='text_right'></div>");
			$("#text_right").html(txtHTML);
			$("#img_left").html(imgHTML);
			break;
		case "v_txt_img":
			$("#content").append("<div id='text_top'></div>");
			$("#content").append("<div id='img_bottom'></div>");
			$("#text_top").html(txtHTML);
			$("#img_bottom").html(imgHTML);
			break;
		case "v_img_txt":
			$("#content").append("<div id='img_top'></div>");
			$("#content").append("<div id='text_bottom'></div>");
			$("#text_bottom").html(txtHTML);
			$("#img_top").html(imgHTML);
			break;
		default:
			break;
	}
}

function processText( rtNode ) {
	var txtHTML = lstHTML = nodeTxt = lstTxt = "";
	$(rtNode).children().each(function() {
		if (this.nodeName == "paragraph") {
			nodeTxt = $(this).text();
			if (nodeTxt.indexOf(linkTxtStart) != -1) {
				//has popup link
				txtHTML += "<p>" + transformText(nodeTxt) + "</p>";
			} else {
				txtHTML += "<p>" + nodeTxt + "</p>";
			}
		} else if (this.nodeName == "bullets") {
			$(this).find("li").each( function() {
				lstTxt = $(this).text();
				if (lstTxt.indexOf(linkTxtStart) != -1) {
					//has popup link
					lstHTML += "<li>" + transformText(lstTxt) + "</li>";
				} else {
					lstHTML += "<li>" + lstTxt + "</li>";
				}
			});
			if ($(this).attr("type") == "unordered") {
				//unordered list
				txtHTML += "<ul>" + lstHTML + "</ul>";
			} else {
				//ordered list
				txtHTML += "<ol>" + lstHTML + "</ol>";
			}
		} else {
			//something else
		}
	});

	return txtHTML;
}

function processImg( imgNode ) {
	imgHTML += "<img src='images/" + $(imgNode).find('filename').text() + "' alt='" + $(imgNode).find('alt').text() + "' />";
	if ( $(imgNode).attr("selectable") == "yes" ) {
		var linkType = $(imgNode).find("linkto").attr("type");
		if ( linkType == "popup" ) {
			imgHTML = "<a href='javascript:showPopup(" + (iPop+1) + ")'>" +imgHTML + "</a>";
		} else {
			lnkTxt = $(imgNode).find('linkto').text();
			if ( linkType == "website" ) { 
			  imgHTML = "<a href='" + lnkTxt + "' target='_blank'>" + imgHTML + "</a>";
			} else {
				//local file in images folder
			  imgHTML = "<a href='images/" + lnkTxt + "' target='_blank'>" + imgHTML + "</a>";
			}
		}
	}
	return imgHTML;
}

function processHeading( rtNode ) {
	//nCols = $(rtNode).find("column_titles").children().length;
	
	arrColTitle.push($(rtNode).find("first_cell").text());
	$(rtNode).find("column_titles").children().each( function() {
		arrColTitle.push($(this).text());
	});
	arrRowTitle.push("");
	$(rtNode).find("row_text").children().each( function() {
		arrRowTitle.push($(this).text());
		ansCorrect += $(this).attr("match_column");
	});
}

function processFeedback( fNode ) {
	$(fNode).children().each(function(i) {
		if ($(this).attr("correct") == "yes") {
			//Correct
			fdbkCorrect = $(this).text();
		} else if ($(this).attr("correct") == "no2") {
			//Final incorrect
			fdbkWrong2 = $(this).text();
		} else {
			//First try
			fdbkWrong1 = $(this).text();
		}
	});
}

function parseXML(xmlData) {
	var imgHTML = "";
	var pgNode = $(xmlData).find("page");
	var layout = $(pgNode).attr("layout");
	hasGraphic = ($(pgNode).attr("has_graphic") == "yes") ? true : false;
	q_type = $(pgNode).attr("q_type");
	
	$("h1").html($(pgNode).find("title").text());

	q_stem = $(pgNode).find("stem");
	
	stemHTML = processText( q_stem );

	if (hasGraphic) {
	  	//process image if there is one
	  	imgNode = $(pgNode).find("graphic");
		imgHTML = processImg( imgNode );
	}

	processHeading(pgNode);
	
	fdbk = $(pgNode).find("feedbacks");
	//process feedback text
	processFeedback( fdbk );
	
	//layoutPage(layout, txtHTML, imgHTML);

	writeQuestion();

	$("#prompt").html($(pgNode).find("prompt").text());

}

function writeQuestion() {
  $("div.stem").html(stemHTML);
  
  $("#qForm").append("<table id='qTable' width='" + widthTable + "px' cellspacing='0' cellpadding='3' border=0></table>");
  myTr = "<tr><td width='" + widthCol0 + "px' class='gridFirstCell' align='center'>" + arrColTitle[0] + "</td>";
  for (j=1; j<=nCols; j++) {
	  myTr += "<td width='" + arrColWidth[j-1] + "' align='center' class='gridTop'>" + arrColTitle[j] + "</td>";
  }
  myTr += "</tr>";
  $("#qTable").append(myTr);
  
  for (i=1; i<=nRows; i++) {
	  myTr = "<tr><td class='gridLeft'>" + arrRowTitle[i] + "</td>";
	  //get rid of the punctuation at the end if there is one
	  chrTemp = arrRowTitle[i].substr(arrRowTitle[i].length-1,1);
	  if ( (chrTemp == ".") || (chrTemp == "!") || (chrTemp == "?") ) 
		  strTemp = arrRowTitle[i].substring(0, arrRowTitle[i].length-1);
	  else strTemp = arrRowTitle[i];
	  for (j=1; j<=nCols; j++) {
		  myTr += "<td align='center' valign='middle' class='gridStyle'>";
		  myTr += "<input name='row" + i + "' id='r"+i+"c"+j+"' type='radio' title='Match " + strTemp + " with " + arrColTitle[j] + ".";
		  myTr += "' tabindex='" + ((i-1)*nCols + j) + "' /></td>";
	  }
	  myTr += "</tr>";
      $("#qTable").append(myTr);
  }

  $("input:radio").css("cursor", "pointer");
  
  //add submit button
  //$("<div id='submit'/>").appendTo($("#qForm"));
  $("#qForm").append("<div id='submit'/>");
  var txtHTML = "";
  txtHTML = "<a href='javascript:judgeInteraction()' title='submit'>";
  txtHTML += "<img class='button' src='sysimages/submit_0.jpg' onmouseover='this.src=&quot;sysimages/submit_2.jpg&quot;' onmouseout='this.src=&quot;sysimages/submit_0.jpg&quot;' alt='submit' id='done' name='done' border='0' />";
  txtHTML += "</a>";
  
  $("#submit").html(txtHTML);
}

//dynamically get this file name
var xmlFile = "page_grid.xml";

$(document).ready(function() {
	$.ajax({
	  type: "GET",
	  url: xmlFile,
	  dataType: "xml",
	  success: parseXML
	});
});
