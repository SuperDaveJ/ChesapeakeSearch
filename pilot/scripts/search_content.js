//global variables
var iPop = 0;
var ccText = "";
var firstAudioFile = "";
var sndAudioFile = "";

/********************** XML process functions **************************/
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

	hasDlink = ($(pgNode).attr("dlink") == "yes") ? true : false;
	hasGraphic = ($(pgNode).attr("has_graphic") == "yes") ? true : false;
	hasAudio = ($(pgNode).attr("has_audio") == "yes") ? true : false;
	var hasPopup = ($(pgNode).attr("has_popup") == "yes") ? true : false;

	txt_root = $(pgNode).find("text_content");
	
	processCommon( pgNode );
	
	txtHTML = processText( txt_root );

	if ( hasGraphic ) {
	  	//process image if there is one
	  	imgNode = $(pgNode).find("graphic");
		imgHTML = processImg( imgNode );
	}

	layoutPage(layout, txtHTML, imgHTML);

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
