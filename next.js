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
var resetera_pageless = function(url) {
    return url + "page-2";
}
var resetera_withpage = function(url) {
    var currPage = /^(.*?\/page-)(\d+)$/.exec(url);
    var baseUrl = currPage[1];
    var pageNum = parseInt(currPage[2], 10);
    return baseUrl + (pageNum + 1).toString();
}
var somethingawful_withpage = function(url) {
    var currPage = /^(.*?threadid=\d+&userid=\d+&perpage=\d+&pagenumber=)(\d+)$/.exec(url);
    var baseUrl = currPage[1];
    var pageNum = parseInt(currPage[2], 10);
    return baseUrl + (pageNum + 1).toString();
}
var d2jsp_pageless = function(url) {
    return url + "&o=10";
}
var d2jsp_withpage = function(url) {
    var currPage = /^(.*\?t=\d+&f=\d+&o=)(\d+)$/.exec(url);
    var baseUrl = currPage[1];
    var pageNum = parseInt(currPage[2], 10);
    return baseUrl + (pageNum + 10).toString();
}
var fourchan_pageless = function(url) {
    return url + "2";
}
var fourchan_withpage = function(url) {
    var currPage = /^(.*?boards\.4chan\.org\/\w+\/)(\d+)$/.exec(url);
    var baseUrl = currPage[1];
    var pageNum = parseInt(currPage[2], 10);
    return baseUrl + (pageNum + 1).toString();
}
// -------------------------------------------------------


// array holding url pattern and function to handle url
var handler = [
    {
        // pattern for neogaf..
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
    },
    {
        // pattern for resetera, anandtech, ign...
        "pattern": /^.*?\/threads\/.*?\.\d+\/$/,
        "function": resetera_pageless
    },
    {
        // pattern for resetera, anandtech, ign...
        "pattern": /^.*?\/page-\d+$/,
        "function": resetera_withpage
    },
    {
        // TODO: add handler for first page
        // pattern for somethingawful.com..
        "pattern": /^.*?threadid=\d+&userid=\d+&perpage=\d+&pagenumber=\d+$/,
        "function": somethingawful_withpage
    },
    {
        // pattern for d2jsp forum first page
        "pattern": /^.*\?t=\d+&f=\d+$/,
        "function": d2jsp_pageless
    },
    {
        // pattern for d2jsp forum subsequent pages
        "pattern": /^.*\?t=\d+&f=\d+&o=\d+$/,
        "function": d2jsp_withpage
    },
    {
        // pattern for 4chan
        "pattern": /^.*?boards\.4chan\.org\/\w+\/$/,
        "function": fourchan_pageless
    },
    {
        // pattern for 4chan
        "pattern": /^.*?boards\.4chan\.org\/\w+\/\d+$/,
        "function": fourchan_withpage
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