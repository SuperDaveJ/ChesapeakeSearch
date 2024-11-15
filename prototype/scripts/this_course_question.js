//global variables
var xmlDoc;
var linkTxtStart = "(??)";
var linkTxtEnd = "(%??)";
var hasGraphic = false;
var distracters = [];
var q_type = "";
var triesUser = 0;
var triesLimit = 2;
var letters = new Array("A", "B", "C", "D", "E", "F", "G", "H");
var stemHTML = "";
var ansCorrect = "";
var nItems = 0;
var fdbkWrong1;
var fdbkWrong2 = "";
var fdbkCorrect = "";
var fdbkWrong0 = "You have not made any selections.  Please try again.";

/*********************** Open Popup Window **********************************/
function openWinCentered(myUrl, myTitle, myWidth, myHeight, scrollbar, resize ) {
	// open the window
	positionTop = (screen.height - myHeight)/2 - 25;
	positionLeft = (screen.width - myWidth)/2 - 5;
	newWin = window.open (myUrl,myTitle,"toolbar=no,location=no,width="+myWidth+",height="+myHeight+",menubar=no,resizable="+resize+",status=no,scrollbars="+scrollbar+",top="+positionTop+",left="+positionLeft+"");
	if (window.focus) newWin.focus();
	return newWin;
}

function judgeInteraction_MC() {
	var strTemp;
	ansUser = $("input:radio:checked").attr("id");
	if (ansUser == undefined) {
		strTemp = fdbkWrong0;
	} else {
		triesUser += 1;
		if (ansUser == ansCorrect) {
			triesUser = triesLimit;
			strTemp = fdbkCorrect;
			disableQ();
		} else {
			if (triesUser == triesLimit) {
				$("input:radio").attr("checked", function(i, value) {
					if ( i == (ansCorrect.charCodeAt(0)-65) ) return "checked";
					//else return "";
				});
				strTemp = fdbkWrong2;
				disableQ();
			} else {
				strTemp = fdbkWrong1[ansUser.charCodeAt(0)-65];
			}
		}
	}
	showFeedback(strTemp);
}

function judgeInteraction_MA() {
	var strTemp;
	
	ansUser = $("input:checkbox").map( function() {
		return (this[checked="checked"]) ? this.id : "";
	}).get().join("");
	
	if (ansUser == "") {
		strTemp = fdbkWrong0;
	} else {
		triesUser += 1;
		if (ansUser == ansCorrect) {
			triesUser = triesLimit;
			//if (parent.inQuiz) parent.quiz[qID] = 1;	//set question status
			strTemp = fdbkCorrect;
			disableQ();
		} else {
			if (triesUser == triesLimit) {
				for (var i=0; i<nItems; i++) {
					$("input:checkbox[id='" + letters[i] + "']").attr("checked", false);
				}
				for (var i=0; i<ansCorrect.length; i++) {
					$("input:checkbox[id='" + ansCorrect.charAt(i) + "']").attr("checked", true);
				}
				//if (parent.inQuiz) parent.quiz[qID] = 0;	//set question status
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
	if (q_type == "MA") {
		$("input:checkbox").attr("disabled", "disabled");
	} else {
		$("input:radio").attr("disabled", "disabled");
	}
    $("input[name='quest']").css("cursor", "default");
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

function processFeedback( fNode ) {
	if (q_type == "MC") {
	  fdbkWrong1 = [];
	  $(fNode).children().each(function(i) {
		  if ($(this).attr("correct") == "yes") {
			  //Correct
			  fdbkCorrect = $(this).text();
			  fdbkWrong1.push("");
		  } else if ($(this).attr("correct") == "no2") {
			  //Final incorrect
			  fdbkWrong2 = $(this).text();
		  } else {
			  //First try distractor specific
			  fdbkWrong1.push($(this).text());
		  }
	  });
	} else if (q_type == "MA") {
	  fdbkWrong1 = "";
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
	} else {
		//true/fasle
	  triesLimit = 1;
	  $(fNode).children().each(function(i) {
		  if ($(this).attr("correct") == "yes") {
			  //Correct
			  fdbkCorrect = $(this).text();
		  } else {
			  //Incorrect
			  fdbkWrong2 = $(this).text();
		  }
	  });
	}
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

	//dist = $(q_stem).next();
	dist = $(pgNode).find("distractors");
	nItems = $(dist).children().length;
	
	$(dist).children().each(function(i) {
		distracters.push($(this).text());
		if ($(this).attr("correct") == "yes") {
			ansCorrect += letters[i];
		}
	});


	fdbk = $(pgNode).find("feedbacks");
	//process feedback text
	processFeedback( fdbk );
	
	//layoutPage(layout, txtHTML, imgHTML);

	writeQuestion();

	$("#prompt").html($(pgNode).find("prompt").text());

}

function writeQuestion() {
  $("div.stem").html(stemHTML);
  
  $("#qForm").append("<table id='qTable' width='97%' cellspacing='0' cellpadding='8' border=0></table>");
  for (var i=0; i<nItems; i++) {
	  myTr = "<tr><td class='rdck'>";
	  if (q_type == "MA") {
		  myTr += "<input name='quest' id='" + letters[i] + "' type='checkbox' /></td>";
	  } else {
		  myTr += "<input name='quest' id='" + letters[i] + "' type='radio' /></td>";
	  }
	  myTr += "<td class='letter'>" + letters[i] + ".</td>";
	  myTr += "<td class='disTxt'><label for='" + letters[i] + "'>" + distracters[i] + "</label></td></tr>";
	  $("#qTable").append(myTr);
  }
  $("input[name='quest']").css("cursor", "pointer");
  
  //add submit button
  //$("<div id='submit'/>").appendTo($("#qForm"));
  $("#qForm").append("<div id='submit'/>");
  var txtHTML = "";
  if (q_type == "MA") {
  	txtHTML = "<a href='javascript:judgeInteraction_MA()' title='submit'>";
  } else {
  	txtHTML = "<a href='javascript:judgeInteraction_MC()' title='submit'>";
  }
  txtHTML += "<img class='button' src='sysimages/submit_0.jpg' onmouseover='this.src=&quot;sysimages/submit_2.jpg&quot;' onmouseout='this.src=&quot;sysimages/submit_0.jpg&quot;' alt='submit' id='done' name='done' border='0' />";
  txtHTML += "</a>";
  
  $("#submit").html(txtHTML);
}

//dynamically get this file name
var xmlFile = "page_tf.xml";

$(document).ready(function() {
	$.ajax({
	  type: "GET",
	  url: xmlFile,
	  dataType: "xml",
	  success: parseXML
	});
});
