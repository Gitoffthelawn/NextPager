var DEBUG = false;

// functions to handle different urls
// most of the forums use 2 different url patterns.
// 1 is for the first page and 1 for later pages
// So, there's 2 handler functions for a forum
// <forum>_pageless  --->   handle "First page"
// <forum>-withpage  --->   handle "Later pages"

var neogaf_pageless = function(tab) {
    // this will return url of next page for sites that use neogaf
    // style page linking
    return tab.url + "&page=2";
}
var neogaf_withpage = function(tab) {
    // return url of next page
    var currPage = /(^.*?\?(?:s=\w+?&)?t=\d+&page=)(\d+)$/.exec(tab.url);
    var pageNum = parseInt(currPage[2], 10);
    var baseUrl = currPage[1];
    return baseUrl + (pageNum + 1).toString();
}
var gamespot_pageless = function(tab) {
    // for urls that use gamespot forum style linking
    var baseUrl = /^(.*?)\/#\d+$/.exec(tab.url);
    return baseUrl[1] + "/?page=2";
}
var gamespot_withpage = function(tab) {
    // for urls that use gamesport style linking
    // and has a page tag
    var currPage = /^(.*?\/?page=)(\d+)$/.exec(tab.url);
    var baseUrl = currPage[1];
    var pageNum = parseInt(currPage[2], 10);
    return baseUrl + (pageNum + 1).toString();
}
var resetera_pageless = function(tab) {
    return tab.url + "page-2";
}
var resetera_withpage = function(tab) {
    var currPage = /^(.*?\/page-)(\d+)$/.exec(tab.url);
    var baseUrl = currPage[1];
    var pageNum = parseInt(currPage[2], 10);
    return baseUrl + (pageNum + 1).toString();
}
var somethingawful_withpage = function(tab) {
    var currPage = /^(.*?threadid=\d+&userid=\d+&perpage=\d+&pagenumber=)(\d+)$/.exec(tab.url);
    var baseUrl = currPage[1];
    var pageNum = parseInt(currPage[2], 10);
    return baseUrl + (pageNum + 1).toString();
}
var d2jsp_pageless = function(tab) {
    return tab.url + "&o=10";
}
var d2jsp_withpage = function(tab) {
    var currPage = /^(.*\?t=\d+&f=\d+&o=)(\d+)$/.exec(tab.url);
    var baseUrl = currPage[1];
    var pageNum = parseInt(currPage[2], 10);
    return baseUrl + (pageNum + 10).toString();
}
var fourchan_pageless = function(tab) {
    return tab.url + "2";
}
var fourchan_withpage = function(tab) {
    var currPage = /^(.*?boards\.4chan\.org\/\w+\/)(\d+)$/.exec(tab.url);
    var baseUrl = currPage[1];
    var pageNum = parseInt(currPage[2], 10);
    return baseUrl + (pageNum + 1).toString();
}
var phpbb_pageless = function(tab) {
    return tab.url + "&sid=abcde12345&start=15";
}
var phpbb_withpage = function(tab) {
    var currPage = /^([^\?]+\?f=\d+&t=\d+(?:&sid=\w+)?&start=)(\d+)$/.exec(tab.url);
    var baseUrl = currPage[1];
    var pageNum = parseInt(currPage[2], 10);
    return baseUrl + (pageNum + 15).toString();
}

// special functions: link extractor defined in [findLink.js] 
var reddit = function(tab) {
    // this is a special function
    // reddit uses token for page linking
    // So I have to dig up next page link from current page source
    // but the problem is the api for executing script returns promise
    // So I have to update the page in this function
    // So the return value to the updUrl func will be undefined
    function updateUrl(url) {
        logError("new url: " + url["nextLink"]);
        browser.tabs.update({"url": url["nextLink"]});
    }
    function sender(tid) {
        logError("Id of tab: " + tid);
        
        // injecting the script for the first time requires
        // some time. without delay next page does not get 
        // loaded in the first click. subsequent clicks work fine
        // find a better way to deal with first click 
        setTimeout(sendMessage, 100);
        function sendMessage() {
            browser.tabs.sendMessage(tid, {
                "site": "reddit"
            }).then(updateUrl, logError);
        }
    }

    var exec = browser.tabs.executeScript(tab.id, {
        file: "/findLink.js"
    });
    exec.then(sender(tab.id), logError);
}
var google_search = function(tab) {
    // handle  google search page navigation
    function updateUrl(url) {
        logError(url);
        browser.tabs.update({"url": url["nextLink"]});
    }
    function sender(tid) {
        logError(tid);
        setTimeout(sendMessage, 100);
        function sendMessage() {
            browser.tabs.sendMessage(tid, {
                "site": "google"
            }).then(updateUrl, logError);
        }
    }
    var exec = browser.tabs.executeScript({
        file: "findLink.js"
    });
    exec.then(sender(tab.id), logError);
}
var bing_search = function(tab) {
    function updateUrl(url) {
        logError(url);
        browser.tabs.update({"url": url["nextLink"]});
    }
    function sender(tid) {
        logError(tid);
        setTimeout(sendMessage, 100);
        function sendMessage() {
            browser.tabs.sendMessage(tid, {
                "site": "bing"
            }).then(updateUrl, logError);
        }
    }
    var exec = browser.tabs.executeScript({
        file: "findLink.js"
    });
    exec.then(sender(tab.id), logError);
}
// -------------------------------------------------------


// array holding url pattern and function to handle url
var handler = [
    {
        // pattern for neogaf, xossip
        "pattern": /^.*?\?(?:s=\w+?&)?t=\d+$/,
        "function": neogaf_pageless
    },
    {
        "pattern": /^.*?\?(?:s=\w+?&)?t=\d+&page=\d+$/,
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
        // pattern for resetera, anandtech, ign...
        "pattern": /^.*?\/(threads|forums)\/.*?\.\d+\/$/,
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
    },
    {
        // pattern for phpBB
        "pattern": /^[^\?]+\?f=\d+&t=\d+$/,
        "function": phpbb_pageless
    },
    {
        // pattern for phpBB
        "pattern": /^[^\?]+\?f=\d+&t=\d+(?:&sid=\w+)?&start=\d+$/,
        "function": phpbb_withpage
    },
    {
        // pattern to handle reddit
        "pattern": /^.*?reddit\.com\/?(?:r\/[^\/]+\/?)?\??(?:count=\d+&after=[\w_]+)?$/,
        "function": reddit
    },
    {
        // pattern for google search
        // supports google.(com|de|nl|....)
        "pattern": /^.*?google\.\w+?\/search\?.*$/,
        "function": google_search
    },
    {
        // pattern for bing
        "pattern": /^.*?bing\.com\/search\?.*$/,
        "function": bing_search
    }
];
// ------------------------------------------------------



function updateTab(tbs) {
    var tabUrl = tbs.url;
    var updUrl = null;
    var len = handler.length;
    for (var i=0; i<len; i++) {
        if (handler[i]["pattern"].test(tabUrl) == true) {
            logError(handler[i]["pattern"]);
            updUrl = handler[i]["function"](tbs);
            break;
        }
    }
    logError("updated url: " + updUrl);
    if(updUrl == null) {
        logError("Error in URL: " + updUrl);
    }
    else {
        browser.tabs.update(tbs.id, {url: updUrl});
    }
}

function logError(err) {
    // function to handle error during execution
    // firefox doesn't allow (or atleast discourages) console logging
    // in addons. So this is not really used in production
    if (DEBUG === true) {
        var stack = new Error().stack,
            caller = stack.split('\n')[1].split('@')[0];

        console.log(`[${caller}]`);
        console.log(`LOG=> ${err}`);
    }
}

// attaching function to listen to click in toolbar icon
browser.browserAction.onClicked.addListener(updateTab);