// Knowledge Check Question and Assessment Question Feedback
function showFeedback(fdbkText) {
	if (triesUser == triesLimit) {
		$("#next").removeClass();
		//There is no submit button for drag to trash can.
		if ($("#submit").length > 0) $("#submit").hide();
	}
	newWin = openWinCentered("", "Feedback", 445, 339, "no" );
	
	//feedback title. this added when making modifications
	if (arguments.length == 2) {
		strTitle = "Assessment Question Feedback";
	} else {
		strTitle = "Knowledge Check Question Feedback";
	}
	
	newWin.focus();
	if (newWin != null) {
		var strTemp = "";	
		strTemp	= strTemp + "<!DOCTYPE html><html><title>" + strTitle + "</title>";
		strTemp	= strTemp + "<link rel='stylesheet' type='text/css' href='styles/q_feedback.css' />";
		strTemp	= strTemp + "</head> <body>";
		strTemp	= strTemp + "<div id='popTitle'><h1 class='title'>" + strTitle + "</h1></div>";
		strTemp	= strTemp + "<div id='popText'>";
		strTemp	= strTemp + fdbkText;
		strTemp	+= "</div> <div id='close'><a href='javascript:self.close();' title='close'>";
		strTemp += "<img src='sysimages/close_0.png' onmouseover=&quot;this.src='sysimages/close_1.png'&quot; onmouseout=&quot;this.src='sysimages/close_0.png'&quot; alt='close' /></a>";
		strTemp	= strTemp + "</div></body></html>";
	
		newWin.document.write(strTemp);
		newWin.document.close();
	}
}
