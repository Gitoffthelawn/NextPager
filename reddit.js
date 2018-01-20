// a content script for finding next page link from reddit
/*
	TODO:
	1. Implement a message passing system so that I can
		use this script for many more websites
*/

var span = document.getElementsByClassName("next-button")[0];
var nextlink = span.getElementsByTagName("a")[0].href;

// return the next page link to caller?
(function() {
	return nextlink;
})();