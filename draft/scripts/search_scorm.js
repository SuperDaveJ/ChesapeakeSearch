//This is for Chesapeake - course SCO
var isPilot = true;
var inLMS = false;
var bookmark = "";
var strPagesViewed = "";
var nModules = 6;
var moduleStatus = "000000";
var courseStatus = "incomplete";	// course status
var strTemp = "";

function toMenu() {
	if (contentFrame.blnLastPage) {
		updateModuleStatus('2');
	}
	if (inLMS) { updateSuspendData(); }
	contentFrame.location.href = "../course_menu.html";
}

function gotoPage(btnSelected, pgURL) {
	if ( (isPageViewed(getPage()) == false) && (btnSelected === "next") ) {
		strPagesViewed = strPagesViewed + "," + getPage();
	}
	if (contentFrame.blnLastPage) {
		toMenu();
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
	if ( courseStatus == "completed" ) return true;
	if (getModuleStatus(getModule()) == 2) return true;
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
		courseStatus = doLMSGetValue( "cmi.core.lesson_status" );
		bookmark = doLMSGetValue("cmi.core.lesson_location");
		if (courseStatus == "completed") {
			moduleStatus = "222222";
			strPagesViewed = "";
		} else {
			strPagesViewed = doLMSGetValue("cmi.suspend_data");
		}
		if ( (bookmark == "301") || (bookmark == undefined) ) bookmark = "";
	}
  }
  //startPage = "splash.html";
  startPage = "course_menu.html";
  
  if ( bookmark != "" ) {
	  if (confirm("Do you wish to resume where you left?")==true) contentFrame.location.href = bookmark;
	  else contentFrame.location.href = startPage;
  } else {
	  contentFrame.location.href = startPage;
  }
}

function exitCourse() {
	if ( inLMS == true ) {
		checkCourseStatus();
		doLMSSetValue( "cmi.core.lesson_status", courseStatus );	//"completed" won't work for Plateau
		if (courseStatus == "completed") {
			doLMSSetValue( "cmi.suspend_data", "");
		} else {
			updateSuspendData();
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
			strBookmark =  "module" + getModule() + "/" + contentFrame.backURL;
		} else {
			//bookmark current page
			strBookmark = "module" + getModule() + "/" + getPage() + ".html";
		}
	}
	doLMSSetValue( "cmi.core.lesson_location", strBookmark );
	doLMSCommit();
  }
}

function checkCourseStatus() {
	var nCompleted = 0;
	for (var i=0; i<nModules; ++i) {
		if ( getModuleStatus(i) == 2 ) {
			nCompleted += 1;
		}
	}
	if ( nCompleted == nModules ) {
		courseStatus = "completed";
		return true;
	} else {
		courseStatus = "incomplete";
		return false;
	}
}

function updateModuleStatus(cStatus) {
	var iMod = getModule();
	moduleStatus = moduleStatus.substr(0,iMod-1) + cStatus + moduleStatus.substr(iMod);
	if (cStatus == "2") cleanSuspendData();
	else updateSuspendData();
}

function getModuleStatus(iMod) { //return an integer 0, 1, or 2
	var intTemp;
	intTemp = parseInt(moduleStatus.substr(iMod,1));
	if ( (intTemp < 0) || (intTemp > 2) ) return 0;
	else return intTemp;
}

function getModule() {
	//Returns an integer as module ID
	arrTemp = new Array();
	arrTemp = contentFrame.location.href.split("/");
	var strTemp = arrTemp[arrTemp.length-2];
	return parseInt(strTemp.substring(6) );
}

function getLesson() {
	//Returns an integer as lesson ID
	arrTemp = new Array();
	arrTemp = contentFrame.location.href.split("/");
	var strTemp = arrTemp[arrTemp.length-2];
	return parseInt(strTemp.substring(6) );
}


function getSuspendData() {
	strTemp = "";
	if (inLMS == true) {
		strTemp = doLMSGetValue("cmi.suspend_data");
	}
	if ( (strTemp == 301) || (strTemp == undefined) ) {
		moduleStatus = "000000";
		strPagesViewed = "";
	} else if (strTemp == "") {
		//for non-LMS version. do nothing
	} else {
		arrTemp = new Array();
		arrTemp = strTemp.split("~");
		moduleStatus = arrTemp[0];		// a stream of 0, 1, and 2
		strPagesViewed = arrTemp[1];
	}
}

function updateSuspendData() {
	//SuspendData format:
	//moduleStatus + "~" + preScore + "~" + postScore + "~" + strPagesViewed;
	if (strPagesViewed == undefined) {
		strPagesViewed = "";
	}
	var iMod = getModule();
	if ( (iMod > 0) && (iMod < nModules-1) && (!contentFrame.blnLastPage) ) { 
		//NOT on the menu or last page
		if ( (strPagesViewed.indexOf(getPage()) == -1) && (contentFrame.enableNext == "yes") ) {
			strPagesViewed = strPagesViewed + "," + getPage();
		}
	}
	strTemp = moduleStatus + "~" + strPagesViewed;
	if ( inLMS == true ) {
		doLMSSetValue("cmi.suspend_data", strTemp);
		doLMSCommit();
	}
}

function cleanSuspendData() {
	var strTemp = strPagesViewed.toLowerCase();
	arrTemp = strTemp.split(",");
	for (var i=1; i<nModules-1; i++) {
		if (getModuleStatus(i) == 2) {
			for (var k=0; k<arrTemp.length; k++) {
				if ( parseInt(arrTemp[k].substr(1,1))==i ) arrTemp[k] = ""
			}
		}
	}
	strTemp = arrTemp.join();
	var re = /,{2,}/g;	//2 or more commas
	strTemp = strTemp.replace(re, ",");
	if (strTemp.substr(0,1) == ",") strTemp = strTemp.substr(1);
	//after cleaned
	strPagesViewed = strTemp;
	updateSuspendData();
}