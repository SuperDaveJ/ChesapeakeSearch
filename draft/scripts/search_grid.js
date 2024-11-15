//global variables
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

/*********************** Click Grid questions **********************************/
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
	
	processCommon( pgNode );
	
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
	
	writeQuestion();
}

/********** disable context menu *************/
var message="This function is disabled!"; 
document.oncontextmenu = new Function("alert(message); return false;");
