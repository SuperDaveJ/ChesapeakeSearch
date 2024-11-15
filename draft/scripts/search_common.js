// Common functions for all pages
var blnLastPage = false;
var enableNext = "yes";
var xmlDoc;
var linkTxtStart = "(??)";
var linkTxtEnd = "(%??)";
var hasGraphic = false;
var hasPopImg = false;
var hasAudio = false;
var nextPg = "";
var backPg = "";
var hasDlink = false;
var popups = [];
var imgTop = 0;

/************************** Comments Functions ********************************/
var vpPath = "http://prod.c2ti.com/CommentTool/";	//path to Virtual Pilot site

var cID = "Chesapeake_Search";
var lID = parent.getLesson();

function addComment() {
	comWin = window.open(vpPath + 'addComment.asp?uID=NA&cID='+cID+'&mID=1&lID='+lID+'&pID='+parent.getPage(), "Comments", "width=800,height=600,scrollbars=no");
}

function viewComment() {
	viewWin = window.open(vpPath + 'reviewComments.asp?uID=NA&cID='+cID+'&mID=1&lID='+lID+'&pID='+parent.getPage(), "Comments", "width=800,height=600,scrollbars=yes");
}
/************************** End of Comments Functions ********************************/

/*********************** Page Functions **********************************/
function exitConfirm(){
	if (confirm("Do you wish to exit the lesson?") == true) { parent.exitCourse(); }
}

function goNext() {
	parent.gotoPage("next", nextPg);
}

function goBack() {
	parent.gotoPage("back", backPg);
}

/*********************** Open Popup Window **********************************/
function openWinCentered(myUrl, myTitle, myWidth, myHeight, scrollbar, resize ) {
	// open the window
	positionTop = (screen.height - myHeight)/2 - 25;
	positionLeft = (screen.width - myWidth)/2 - 5;
	newWin = window.open (myUrl,myTitle,"toolbar=no,location=no,width="+myWidth+",height="+myHeight+",menubar=no,resizable="+resize+",status=no,scrollbars="+scrollbar+",top="+positionTop+",left="+positionLeft+"");
	if (window.focus) newWin.focus();
	return newWin;
}

function showPopup(popId) {
	openWinCentered("popup.html?pid="+popId, "Popup", 706, 443, "no", "yes");
}

function showCC() {
	openWinCentered("../audio_transcript.html", "Transcript", 706, 443, "no", "no");
}

function openHelp() {
	openWinCentered("../help.html", "Help",  706, 443, "no", "yes" );
}

function openGlossary() {
	openWinCentered("../glossary.html", "Glossary",  706, 443, "no", "yes" );
}

function openResources() {
	openWinCentered("../resources.html", "Resources",  706, 443, "no", "yes" );
}

function openShadowbox(popID) {
	Shadowbox.open({
		content: "popup.html?pid=" + popID,
		player: "iframe",
		width: 706,
		height: 443
	});
}

/***************** End of popup window functions ***********************/

/********************** XML process functions **************************/
function layoutPage(layout, txtHTML, imgHTML) {
	switch (layout) {
		case "full_screen":
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
			if (imgHTML != "") {
				$("#img_bottom").html(imgHTML);
				$("#img_bottom").css("top", function () {
					return parseInt($("#text_top").css("height")) + imgTop + "px";
				});
			}
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

function processCommon(pgNode) {
	var enableNext = $(pgNode).attr("enable_next");
	if (enableNext == "no") { $("#next").hide(); };
	
	backPg = $(pgNode).find("nav").attr("prev_page");
	nextPg = $(pgNode).find("nav").attr("next_page");
	if (backPg == "") { $("#back").hide(); }
	if (nextPg == "") { 
		blnLastPage = true;
		//$("#next").click( function() {exitConfirm()});
		nextPg = "../course_menu.html"; 
	}
	
	modNum = "Module " + $(pgNode).find("mod_title").attr("id") + ": ";
	$("span.modNum").html( modNum );
	$("span.modText").html($(pgNode).find("mod_title").text());
	$("h2").html($(pgNode).find("pg_title").text());

	$("#prompt").html($(pgNode).find("prompt").text());
	$("span.pgNumber").html($(pgNode).attr("pg_num"));
}
	
function transformText(textIn) {
	var linkTxt = "";
	var urlStart = "[##link=";
	var urlEnd = "##]";
	var urlTxt = "";
	var newTxt = "";
	var iStart = 0;

	//determine what type of popup (wetsite, document, detail info., etc.)
	while ( textIn.indexOf(linkTxtStart, iStart) != -1 ) {
	  //loop through all links in case there are more than one
	  newTxt = "";
	  intTemp1 = textIn.indexOf(linkTxtStart, iStart);
	  intTemp2 = textIn.indexOf(linkTxtEnd, iStart);
	  intTemp3 = textIn.indexOf(urlStart, iStart);
	  intTemp4 = textIn.indexOf(urlEnd, iStart);
	  linkTxt = textIn.substring(intTemp1+linkTxtStart.length, intTemp2);
	  urlTxt = textIn.substring(intTemp3+urlStart.length, intTemp4);
	
	  if ( urlTxt.indexOf("popup") != -1 ) {
		  //popup text
		  iPop += 1;
		  //newTxt += "<a href='javascript:showPopup(" + iPop + ")'>" + linkTxt + "</a>";
		  newTxt += "<a href='javascript:openShadowbox(" + iPop + ");'>" + linkTxt + "</a>";
	  } else if ( urlTxt.indexOf("/") != -1 ) {
		  //wet site
		  newTxt += "<a href='" + urlTxt + "' target='_blank'>" + linkTxt + "</a>";
	  } else {
		  //document
		  newTxt += "<a href='../assets/" + urlTxt + "' target='_blank'>" + linkTxt + "</a>";
	  }
	  
	  strTemp1 = textIn.substring(0,intTemp1);
	  strTemp2 = textIn.substring(intTemp4 + urlEnd.length);
	  
	  textIn = strTemp1 + newTxt + strTemp2;
	  iStart = intTemp4 + urlEnd.length;
	}
	
	return strTemp1 + newTxt + strTemp2;
}

function processBullets( rtNode ) {
	var lstType = $(rtNode).attr("type");
	var lstStyle = $(rtNode).attr("lstyle");
	var txtHTML = lstTxt = "";
	if ( lstType == "ordered" ) {
		txtHTML += "<ol";
		if (lstStyle == "lower_alpha") {
			txtHTML += " class='lowerAlpha'>";
		} else {
			txtHTML += ">";
		}
	} else {
		txtHTML += "<ul>";
	}
	for (var i=0; i<$(rtNode).children().length; ++i) {
		if ( $(rtNode).children().eq(i).children().length > 0 ) {
			lstTxt = $(rtNode).children().eq(i).attr("txt");
			if ( lstTxt.indexOf(linkTxtStart) != -1 ) {
				//has popup link
				txtHTML += "<li>" + transformText(lstTxt);
			} else {
				txtHTML += "<li>" + lstTxt;
			}
			txtHTML += processBullets( $(rtNode).children().eq(i).children().eq(0) );
			txtHTML +=  "</li>";
		} else {
			lstTxt = $(rtNode).children().eq(i).text();
			if ( lstTxt.indexOf(linkTxtStart) != -1 ) {
				//has popup link
				txtHTML += "<li>" + transformText(lstTxt) + "</li>";
			} else {
				txtHTML += "<li>" + lstTxt + "</li>";
			}
		}
	}
	if ( lstType == "ordered" ) {
		txtHTML += "</ol>";
	} else {
		txtHTML += "</ul>";
	}

	return txtHTML;
}

function processText( rtNode ) {
	var txtHTML = "";
	$(rtNode).children().each(function() {
		var nodeTxt = lstTxt = lstHTML = "";
		if (this.nodeName == "paragraph") {
			nodeTxt = $(this).text();
			if (nodeTxt.indexOf(linkTxtStart) != -1) {
				//has popup link
				txtHTML += "<p>" + transformText(nodeTxt) + "</p>";
			} else {
				txtHTML += "<p>" + nodeTxt + "</p>";
			}
		} else if (this.nodeName == "bullets") {
			if ($(this).attr("columns") == "2") {
				//2-column bullets - NO popup links
				nBullets = ($(this).children().length);
				nC1 = Math.floor(nBullets/2) + nBullets%2;
				nC2 = Math.floor(nBullets/2);
				txtHTML += "<div id='bulletHolder'>";
				txtHTML += "<div class='bullet2'><ul>";
				for (i=0; i<nC1; ++i) {
				  txtHTML += "<li>" + $(this).children().eq(i).text() + "</li>";
				}
				txtHTML += "</ul></div></div>";
				txtHTML += "<div class='bullet2'><ul>";
				for (i=nC1; i<nC1+nC2; ++i) {
				  txtHTML += "<li>" + $(this).children().eq(i).text() + "</li>";
				}
				txtHTML += "</ul></div></div>";
				txtHTML += "</div>";
			} else if ($(this).attr("columns") == "3") {
				//3-column bullets - NO popup links
				nBullets = ($(this).children().length);
				if (nBullets%3 == 1) {
					nC1 = Math.floor(nBullets/3) + 1;
					nC2 = Math.floor(nBullets/3);
					nC3 = nC2;
				} else if (nBullets%3 == 2) {
					nC1 = Math.floor(nBullets/3) + 1;
					nC2 = nC1
					nC3 = Math.floor(nBullets/3);
				} else {
					nC1 = Math.floor(nBullets/3);
					nC2 = nC1;
					nC3 = nC1;
				}
				txtHTML += "<div id='bulletHolder'>";
				txtHTML += "<div class='bullet3'><ul>";
				for (i=0; i<nC1; ++i) {
				  txtHTML += "<li>" + $(this).children().eq(i).text() + "</li>";
				}
				txtHTML += "</ul></div></div>";
				txtHTML += "<div class='bullet3'><ul>";
				for (i=nC1; i<nC1+nC2; ++i) {
				  txtHTML += "<li>" + $(this).children().eq(i).text() + "</li>";
				}
				txtHTML += "</ul></div></div>";
				txtHTML += "<div class='bullet3'><ul>";
				for (i=nC1+nC2; i<nC1+nC2+nC3; ++i) {
				  txtHTML += "<li>" + $(this).children().eq(i).text() + "</li>";
				}
				txtHTML += "</ul></div></div>";
				txtHTML += "</div>";
			} else {
				//1-column bullets - with popup links built-in
				txtHTML += processBullets( this );
			}
		} else if (this.nodeName == "table") {
			//table data
			txtHTML = processTable( this );
		}
	});

	return txtHTML;
}

function processTable( tNode ) {
	var strHTML = "";
	strHTML = "<table class='c508' summary='" + $(tNode).attr('summary') + "'>";
	$(tNode).children().each( function() {
		var strRow = "<tr>";
		if ( $(this).attr("header") == "yes" ) {
			$(this).children().each( function() {
				strRow += "<th>" + $(this).text() + "</th>";
			});
		} else {
			$(this).children().each( function() {
				if ( $(this).children().length == 0 ) {
					strRow += "<td valign='top'><p>" + $(this).text() + "<p></td>";
				} else {
					//for columns that have more than 1 paragraph of text
					strRow += "<td valign='top'>";
					$(this).children().each( function() {
						strRow += "<p>" + $(this).text() + "</p>";
					});
					strRow += "</td>";
				}
			});
		}
		strHTML += strRow + "</tr>";
	});
	
	strHTML += "</table>";
	return strHTML;
}

function processImg( imgNode ) {
	imgHTML = "<img src='images/" + $(imgNode).find('filename').text() + "' alt='" + $(imgNode).find('alt').text() + "' />";
	if ( $(imgNode).attr("selectable") == "yes" ) {
		var linkType = $(imgNode).find("linkto").attr("type");
		if ( linkType == "popup" ) {
			//imgHTML = "<a href='javascript:showPopup(" + (iPop+1) + ")'>" + imgHTML + "</a>";
		  	imgHTML = "<a href='javascript:openShadowbox(1);'>" + imgHTML + "</a>";
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
	//position the image in exact location specified in XML file.
	imgTop = $(imgNode).attr("top_position");
	if ( imgTop == undefined ) {
		imgTop = 10;
	} else {
		imgTop = parseInt(imgTop);
	}

	return imgHTML;
}

function processPopup( pgNode ) {
	// Get information for all popups and put them in an array
	$(pgNode).find("popups").children().each( function() {
		var thisPop = {};
		thisPop.popTitle = $(this).find("popTitle").text();
		thisPop.popTxt = processText($(this).find("popText"));
		hasPopImg = $(this).attr("has_image");
		if (hasPopImg == "yes") {
			thisPop.imgFile = $(this).find("popImg").children("filename").text();
			thisPop.imgAlt = $(this).find("popImg").children("alt").text();
		} else {
			thisPop.imgFile = "";
			thisPop.imgAlt = "";
		}
		popups.push(thisPop);
	});
}

function processDlink( dNode ) {
	var linkURL = "";
	var linkType = $(dNode).attr("link_type");
	var linkTxt = $(dNode).find("linkTxt").text();
	var pos = $(dNode).attr("position");
	if ( linkType == "508page" ) {
		linkURL = parent.getPage() + "_508.html";
		dlinkHTML = "<a href='" + linkURL + "' title='d-link'>" + linkTxt + "</a>"
	} else if ( linkType == "file" ) {
		linkURL = $(dNode).find("linkTo").text();
		dlinkHTML = "<a href='../assets/" + linkURL + "' target='_blank'>" + linkTxt + "</a>"
	} else {
		//something else
	}
	if ( pos == "center" ) {
		$("#content").append("<div id='dlink_center'></div>");
		$("#dlink_center").html( dlinkHTML );
	} else {
		$("#content").append("<div id='dlink'></div>");
		$("#dlink").html(dlinkHTML);
	}
}
/********************** End of XML process functions **************************/

/************** Start the page ***************/
$(document).ready(function() {
	$.ajax({
	  type: "GET",
	  url: parent.getPage() + ".xml",
	  dataType: "xml",
	  success: parseXML
	});
});
