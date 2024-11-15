//This is for Chesapeake - single lesson courses
var isPilot = true;
var inLMS = false;
var bookmark = "";
var strPagesViewed = "";
var lessonStatus = "incomplete";
var strTemp = "";

function gotoPage(btnSelected, pgURL) {
	if ( (isPageViewed(getPage()) == false) && (btnSelected === "next") ) {
		strPagesViewed = strPagesViewed + "," + getPage();
	}
	if (contentFrame.blnLastPage) {
		lessonStatus = "completed";
		//contentFrame.exitConfirm();
	}
	contentFrame.location.href = pgURL;
}

function getPage() {
	//return current page file name in lower case without file extension.
	arrTemp = new Array();
	arrTemp2 = new Array();
	arrTemp = contentFrame.location.href.split("/");
	arrTemp2 = arrTemp[arrTemp.length-1].split("?");
	var strTemp = arrTemp2[0];
	var intTemp = strTemp.indexOf(".htm");
	return strTemp.substring(0,intTemp);
	//return strTemp.toLowerCase();
}

function isPageViewed(pageFile) {
	//pageFile = pageFile.toLowerCase();
	if ( lessonStatus == "completed" ) return true;
	if ( (strPagesViewed == undefined) || (strPagesViewed == "") ) return false;
	if (strPagesViewed.indexOf(pageFile) >= 0) return true; 
	else return false;
}

function startCourse() {
  if (inLMS == true) {
	loadPage();	
	var entryStatus = doLMSGetValue( "cmi.core.entry" );
	if (entryStatus == "ab-initio") {
		//first time in the course
		doLMSSetValue( "cmi.suspend_data", "" );
		doLMSSetValue("cmi.core.lesson_location", "");
		doLMSSetValue( "cmi.core.lesson_status", "incomplete" ); 
		doLMSCommit();
	} else {
		//reentry
		lessonStatus = doLMSGetValue( "cmi.core.lesson_status" );
		bookmark = doLMSGetValue("cmi.core.lesson_location");
		if (lessonStatus == "completed") {
			strPagesViewed = "";
		} else {
			strPagesViewed = doLMSGetValue("cmi.suspend_data");
		}
		if ( (bookmark == "301") || (bookmark == undefined) ) bookmark = "";
	}
  }
  //startPage = "splash.html";
  startPage = "lesson5/05_00_001.html";
  
  if ( bookmark != "" ) {
	  if (confirm("Do you wish to resume where you left?")==true) contentFrame.location.href = bookmark;
	  else contentFrame.location.href = startPage;
  } else {
	  contentFrame.location.href = startPage;
  }
}

function exitCourse() {
	if ( inLMS == true ) {
		doLMSSetValue( "cmi.core.lesson_status", lessonStatus );	//"completed" won't work for Plateau
		if (lessonStatus == "completed") {
			doLMSSetValue( "cmi.suspend_data", "");
		} else {
			doLMSSetValue( "cmi.suspend_data", strPagesViewed );
		}
		saveBookmark();		//relative path;
		unloadPage();
	}

	exitPageStatus = true;
	window.close();
}

function unloadCourse() {
	if (exitPageStatus != true) {
		exitCourse();
	}
}

function saveBookmark() {
  if ( inLMS == true ) {
	var strBookmark;

	if ( getPage().indexOf("11270") >= 0 ) {
		strBookmark = "";
	} else {
		if ( (contentFrame.$("#next").css("visibility") != "visible") && (contentFrame.backURL != "") ) {
			//current page is not completed, bookmark previous page
			strBookmark =  "lesson"+ getLesson() + "/" + contentFrame.backURL;
		} else {
			//bookmark current page
			strBookmark = "lesson"+ getLesson() + "/" + getPage() + ".html";
		}
	}
	doLMSSetValue( "cmi.core.lesson_location", strBookmark );
	doLMSCommit();
  }
}

function getLesson() {
	//Returns an integer as lesson ID
	arrTemp = new Array();
	arrTemp = contentFrame.location.href.split("/");
	var strTemp = arrTemp[arrTemp.length-2];
	return parseInt(strTemp.substring(6) );
}