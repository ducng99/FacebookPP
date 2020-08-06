// ==UserScript==
// @name         Facebook++
// @namespace    maxhyt.fbpp
// @version      2.4
// @description  download vid & block ads
// @author       Maxhyt
// @match        https://www.facebook.com/*
// @require      https://code.jquery.com/jquery-3.5.1.min.js
// ==/UserScript==

(function() {
    'use strict';
    var $ = jQuery;
    let url = window.location.href;
    let theScript;
    let vidURL = "#";

    (function CheckLoop(foundScript) {
        setTimeout(function()
        {
            var scriptTags = $("script");

            for (var i = 0; i < scriptTags.length; i++)
            {
                if (scriptTags[i].innerHTML.includes(".mp4"))
                {
                    foundScript = true;
                    theScript = scriptTags[i].innerHTML;
                    break;
                }
            }

            if (!foundScript)
            {
                CheckLoop(foundScript);
            }
            else
            {
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
                        if ($(".uiContextualLayer").length)
                        {
                            found = true;

                            var DownloadButton = $("<li class=\"_54ni __MenuItem\" role=\"presentation\"><a class=\"_54nc\" href=\"" + vidURL + "\" role=\"menuitem\"><span><span class=\"_54nh\">Download</span></span></a></li>");
                            $("._54nf").append(DownloadButton);
                        }

                        if (!found)
                        {
                            FindMenu(found);
                        }
                    }, 200);
                })(false);
            }
        }, 100);
    })(false);

    // Block ads
    setInterval(function() {
        let storiesArray = $('div[id^="hyperfeed_story_id_"]');

        if (storiesArray.length == 0)
        {
            storiesArray = $('div[data-pagelet^="FeedUnit_"]');
        }

        for (let story of storiesArray)
        {
            let spanSponsoredArray = $(story).find(".t_18c362n6vw .m_18c362n6vr");
            if (spanSponsoredArray.length == 0)
            {
                // New facebook
                let sponsoredLabel = $(story).find("span[aria-label='Sponsored']");
                
                if (sponsoredLabel.length > 0 && sponsoredLabel.children().length > 0)
                {
                    $(story).remove();
                }
            }
            else
            {   
                // Old facebook
                let textFound = "";

                for (let spanSponsored of spanSponsoredArray)
                {
                    textFound += $(spanSponsored).html();
                }

                if (textFound.includes("Sponsored"))
                {
                    $(story).remove();
                }
            }
        }
    }, 2000);
})();