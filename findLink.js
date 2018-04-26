// a content script for finding next page link from reddit

// function definitions
var reddit = function(url) {
	var span = document.getElementsByClassName("next-button")[0];
	var nextLink = span.getElementsByTagName("a")[0].href;
	return nextLink;
}
var google = function(url) {
	var nextLink = document.getElementById("pnnext").href;
	return nextLink;
}
var bing = function(url) {
	var nextLink = document.getElementsByClassName("sb_pagN")[0].href;
	return nextLink;
}


// object containing site name and their handler function
var handler = {
	"reddit": reddit,
	"google": google,
	"bing": bing
};


/*
  handler for receiving message
	PARAMS:
	message 		object
		the message sent by the sender
	sender 			sender object
	sendResponse	function
		a function to send a reply (as Promise) to the sender

*/
var messageHandler = function(message, sender, sendResponse) {
	//console.log("received message");
	var siteName = message.site;
	var nextLink = handler[siteName]();
	//console.log(nextLink);
	sendResponse({
		"nextLink": nextLink
	});
	return true;		// indicates that response will be sent by sendResponse
}

// attach handler to message onReceive event
browser.runtime.onMessage.addListener(messageHandler);
