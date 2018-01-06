// functions to handle different urls
var neogaf_pageless = function(url) {
    // this will return url of next page for sites that use neogaf
    // style page linking
    return url + "&page=2";
}
var neogaf_withpage = function(url) {
    // return url of next page
    var currPage = /^(.*?\?t=\d+&page=)(\d+)$/.exec(url);
    var pageNum = parseInt(currPage[2], 10);
    var baseUrl = currPage[1];
    return baseUrl + (pageNum + 1).toString();
}
var gamespot_pageless = function(url) {
    // for urls that use gamespot forum style linking
    var baseUrl = /^(.*?)\/#\d+$/.exec(url);
    return baseUrl[1] + "/?page=2";
}
var gamespot_withpage = function(url) {
    // for urls that use gamesport style linking
    // and has a page tag
    var currPage = /^(.*?\/?page=)(\d+)$/.exec(url);
    var baseUrl = currPage[1];
    var pageNum = parseInt(currPage[2], 10);
    return baseUrl + (pageNum + 1).toString();
}
var google_search = function(url) {
    var currPage = /^(.*?google\.com\/search\?q=.*?&start=)(\d+)(&.*)$/.exec(url);
    var pageNum = parseInt(currPage[2]);
    return currPage[1] + (pageNum + 10).toString() + currPage[3];
}
// -------------------------------------------------------


// array holding url pattern and function to handle url
var handler = [
    {
        "pattern": /^.*?\?t=\d+$/,
        "function": neogaf_pageless
    },
    {
        "pattern": /^.*?\?t=\d+&page=\d+$/,
        "function": neogaf_withpage
    },
    {
        "pattern": /^.*?\/#\d+$/,
        "function": gamespot_pageless
    },
    {
        "pattern": /^.*?\/?page=\d+$/,
        "function": gamespot_withpage
    },
    {
        "pattern": /^.*?google\.com\/search\?q=.*?&start=\d+&.*$/,
        "function": google_search
    }
];
// ------------------------------------------------------



function updTab(tbs) {
    var tabUrl = tbs.url;
    var updUrl = tabUrl;
    var len = handler.length;
    for (var i=0; i<len; i++) {
        if (handler[i]["pattern"].test(tabUrl) == true) {
            updUrl = handler[i]["function"](tabUrl);
            break;
        }
    }
    browser.tabs.update(tbs.id, {url: updUrl});
}
function getCurTab(tbs) {
    var curTab = browser.tabs.get(tbs[0].id);
    curTab.then(updTab, logError);
}
function buttonClicked()
{
    // query tabs to get current tab
    var tabs = browser.tabs.query({currentWindow: true, active:true});
    tabs.then(getCurTab, logError);
}
function logError(err) {
    //console.log(err);
}

// attaching function to listen to click in toolbar icon
browser.browserAction.onClicked.addListener(buttonClicked);