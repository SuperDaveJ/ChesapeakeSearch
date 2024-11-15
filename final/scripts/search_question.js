//global variables
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

/*********************** MC/MA/TF questions **********************************/
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
  txtHTML += "<img class='button' src='../sysimages/submit_0.png' onmouseover='this.src=&quot;../sysimages/submit_2.png&quot;' onmouseout='this.src=&quot;../sysimages/submit_0.png&quot;' alt='submit' id='done' name='done' border='0' />";
  txtHTML += "</a>";
  
  $("#submit").html(txtHTML);
}

function parseXML(xmlData) {
	var imgHTML = "";
	var pgNode = $(xmlData).find("page");
	var layout = $(pgNode).attr("layout");
	hasGraphic = ($(pgNode).attr("has_graphic") == "yes") ? true : false;
	q_type = $(pgNode).attr("q_type");
	
	q_stem = $(pgNode).find("stem");
	
	processCommon( pgNode );
	
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
}

/********** disable context menu *************/
var message="This function is disabled!"; 
document.oncontextmenu = new Function("alert(message); return false;");

//dynamically get this file name
//var xmlFile = "page_tf.xml";

$(document).ready(function() {
	$.ajax({
	  type: "GET",
	  url: parent.getPage() + ".xml",
	  dataType: "xml",
	  success: parseXML
	});
});
