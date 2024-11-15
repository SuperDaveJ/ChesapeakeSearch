//global variables
var blnLastPage = false;
var iPop = 0;
var xmlDoc;
var linkTxtStart = "(??)";
var linkTxtEnd = "(%??)";
var ccText = "";
var popups = [];
var firstAudioFile = "";
var sndAudioFile = "";
var hasGraphic = false;
var hasAudio = false;
var nextPg = "";
var backPg = "";
var hasDlink = false;

/************************** Comments Functions ********************************/
var vpPath = "http://www.c2survey.com/virtualPilot/";	//path to Virtual Pilot site
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

function loadFlash(fID, fFilename, width, height) { 
	flashHTML = "<object id='" + fID + "' data='" + fFilename + "' type='application/x-shockwave-flash' width='" + width + "' height='" + height + "' title='Text description of animation.' ><param name='movie' value='" + fFilename + "' /><param name='quality' value='high'/><param name='PLAY' value='true'/><param name='allowScriptAccess' value='always' > </object>"; 
}
/*********************** End of Page Functions **********************************/

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
	openWinCentered("popup.html?pid="+popId, "Popup", 445, 339, "no", "yes");
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
/***************** End of popup window functions ***********************/

/********************** XML process functions **************************/
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
		  newTxt += "<a href='javascript:showPopup(" + iPop + ")'>" + linkTxt + "</a>";
	  } else if ( urlTxt.indexOf("/") != -1 ) {
		  //wet site
		  newTxt += "<a href='" + urlTxt + "' target='_blank'>" + linkTxt + "</a>";
	  } else {
		  //document
		  newTxt += "<a href='assets/" + urlTxt + "' target='_blank'>" + linkTxt + "</a>";
	  }
	  
	  strTemp1 = textIn.substring(0,intTemp1);
	  strTemp2 = textIn.substring(intTemp4 + urlEnd.length);
	  
	  textIn = strTemp1 + newTxt + strTemp2;
	  iStart = intTemp4 + urlEnd.length;
	}
	
	return strTemp1 + newTxt + strTemp2;
}

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
			$("#content").prepend("<div id='text_left'></div>");
			$("#content").append("<div id='img_right'></div>");
			$("#text_left").html(txtHTML);
			$("#img_right").html(imgHTML);
			break;
		case "h_img_txt":
			$("#content").append("<div id='img_left'></div>");
			$("#content").prepend("<div id='text_right'></div>");
			$("#text_right").html(txtHTML);
			$("#img_left").html(imgHTML);
			break;
		case "v_txt_img":
			$("#content").prepend("<div id='text_top'></div>");
			$("#content").append("<div id='img_bottom'></div>");
			$("#text_top").html(txtHTML);
			$("#img_bottom").html(imgHTML);
			$("#img_bottom").css("top", function() {
				return parseInt($("#text_top").css("height")) + 10 + "px";
			});
			break;
		case "v_img_txt":
			$("#content").append("<div id='img_top'></div>");
			$("#content").prepend("<div id='text_bottom'></div>");
			$("#text_bottom").html(txtHTML);
			$("#img_top").html(imgHTML);
			break;
		default:
			break;
	}
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
				strRow += "<td>" + $(this).text() + "</td>";
			});
		}
		strHTML += strRow + "</tr>";
	});
	
	strHTML += "</table>";
	return strHTML;
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
		} else if (this.nodeName == "table") {
			//table data
			txtHTML = processTable( this );
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

function processPopup( pgNode ) {
	// Get information for all popups and put them in an array
	$(pgNode).find("popups").children().each( function() {
		var thisPop = {};
		thisPop.popTitle = $(this).find("popTitle").text();
		thisPop.popTxt = processText($(this).find("popText"));
		if ($(this).attr("has_image") == "yes") {
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
	if ( linkType == "508page" ) {
		linkURL = parent.getPage() + "_508.html";
		dlinkHTML = "<a href='" + linkURL + "' title='d-link'>" + linkTxt + "</a>"
		$("#content").append("<div id='dlink'></div>");
		$("#dlink").html( dlinkHTML );
	} else if ( linkType == "file" ) {
		linkURL = $(dNode).find("linkTo").text();
		$("#content").append("<div id='dlink'></div>");
		$("#dlink").html("<a href='../assets/" + linkURL + "' target='_blank'>" + linkTxt + "</a>");
	} else {
		//something else
	}
}

function processAudio( pgNode ) {
	var autoPlay = ($(pgNode).find("audios").attr("autoplay") == "yes") ? true : false;
	
	var nAudio = $(pgNode).find("audios").children().length;
	var firstAudio = $(pgNode).find("audios").children().first();
	firstAudioFile = firstAudio.find("filename").text();

	if (autoPlay) {
	  	$("#jp_container").css("display", "block");
		
		$("#jquery_jplayer").jPlayer({
			ready: function () {
				$(this).jPlayer("setMedia", {
					mp3:"audios/" + firstAudioFile + ".mp3",
					oga:"audios/" + firstAudioFile + ".ogg"
				}).jPlayer("play");
			},
			swfPath: "../scripts",
			supplied: "mp3, oga",
			cssSelectorAncestor: "#jp_container",
			wmode: "window"
		});
	} else {
		$("#jquery_jplayer").jPlayer({
			ready: function () {
				$(this).jPlayer("setMedia", {
					mp3:"audios/" + firstAudioFile + ".mp3",
					oga:"audios/" + firstAudioFile + ".ogg"
				});
			},
			swfPath: "../scripts",
			supplied: "mp3, oga",
			cssSelectorAncestor: "#jp_container",
			wmode: "window"
		});
	}

	ccNode = $(firstAudio).find("cc_text");
	
	ccText = processText( ccNode );
	
	//second audio
	if ( nAudio > 1 ) {
		var sndAudio = firstAudio.next("audio");
		sndAudioFile = sndAudio.find("filename").text();
		ccText += "<p>" + sndAudio.find("cc_text").text() + "</p>";
	}
}

function listenToExpert() {
	$("#jquery_jplayer").jPlayer("setMedia", {
		mp3: "audios/" + sndAudioFile + ".mp3",
		oga: "audios/" + sndAudioFile + ".ogg"
	}).jPlayer("play");
}

function parseXML(xmlData) {
	var txtHTML = imgHTML = "";
	var pgNode = $(xmlData).find("page");
	
	// Custom page - do NOT process XML
	if ($(pgNode).attr("skip") == "yes") { return; }
	
	var layout = $(pgNode).attr("layout");
	var pgNum = $(pgNode).attr("pg_num");

	hasDlink = ($(pgNode).attr("dlink") == "yes") ? true : false;
	hasGraphic = ($(pgNode).attr("has_graphic") == "yes") ? true : false;
	hasAudio = ($(pgNode).attr("has_audio") == "yes") ? true : false;
	var hasPopup = ($(pgNode).attr("has_popup") == "yes") ? true : false;

	backPg = $(pgNode).find("nav").attr("prev_page");
	nextPg = $(pgNode).find("nav").attr("next_page");
	if (backPg == "") { $("#back").hide(); }
	if (nextPg == "") { 
		blnLastPage = true;
		$("#next").click( function() {exitConfirm()});
		//nextPg = "../courseMenu.html"; 
	}
	
	$("h1").html($(pgNode).find("title").text());

	txt_root = $(pgNode).find("text_content");
	
	txtHTML = processText( txt_root );

	if ( hasGraphic ) {
	  	//process image if there is one
	  	imgNode = $(pgNode).find("graphic");
		imgHTML = processImg( imgNode );
	}

	layoutPage(layout, txtHTML, imgHTML);

	$("#prompt").html($(pgNode).find("prompt").text());
	$("span.pgNumber").html(pgNum);

	if ( hasAudio ) {
		//process audio and CC
		processAudio( pgNode );
	} else {
		$("#jp_container.jp-audio").css("display", "none");
		$("#cc").css("display", "none");
	}
	
	if ( hasPopup ) {
		// process popup if there is any
		processPopup( pgNode );
	}
	
	if ( hasDlink ) {
		processDlink( $(pgNode).find("dlink") );
	}
}
/********************** End of XML process functions **************************/

$(document).ready(function() {
	$.ajax({
	  type: "GET",
	  url: parent.getPage() + ".xml",
	  dataType: "xml",
	  success: parseXML
	});
});
