// ==UserScript==
// @name         Facebook++
// @namespace    maxhyt.fbpp
// @version      1.0
// @description  try to take over the world!
// @author       Maxhyt
// @match        https://www.facebook.com/*
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// ==/UserScript==

(function() {
    'use strict';
    var url = window.location.href;
    var theScript;
    var vidURL = "#";

    setTimeout(function() {
        var scriptTags = jQuery("script");

        for (var i = 0; i < scriptTags.length; i++)
        {
            if (scriptTags[i].innerHTML.includes(".mp4"))
            {
                theScript = scriptTags[i].innerHTML;
                break;
            }
        }

        if (theScript.indexOf("hd_src\":null") != -1)
        {
            vidURL = theScript.substring(theScript.indexOf("sd_src") + 9, theScript.indexOf("\",\"hd_tag"));
            vidURL = vidURL.replace(/\\\//g, "/");
        }
        else if (theScript.indexOf("hd_src\":\"") != -1)
        {
            vidURL = theScript.substring(theScript.indexOf("hd_src") + 9, theScript.indexOf("\",\"sd_src"));
            vidURL = vidURL.replace(/\\\//g, "/");
        }
        else if (theScript.indexOf(",hd_src:") != -1)
        {
            vidURL = theScript.substring(theScript.indexOf("hd_src") + 8, theScript.indexOf("\",sd_src:"));
        }
        
        (function FindMenu(found)
        {
            setTimeout(function() {
                if (jQuery(".uiContextualLayer").length)
                {
                    found = true;
        
                    var DownloadButton = jQuery("<li class=\"_54ni __MenuItem\" role=\"presentation\"><a class=\"_54nc\" href=\"" + vidURL + "\" role=\"menuitem\"><span><span class=\"_54nh\">Download</span></span></a></li>");
                    jQuery("._54nf").append(DownloadButton);
                }
                
                if (!found)
                    FindMenu(found);
            }, 200);
        })(false);
    }, 5000);
})();
