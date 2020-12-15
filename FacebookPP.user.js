// ==UserScript==
// @name         Facebook++
// @namespace    maxhyt.fbpp
// @version      3.0.0
// @description  download vid & block ads
// @author       Maxhyt
// @match        https://www.facebook.com/*
// ==/UserScript==

(function() {
    'use strict';
    /*let url = window.location.href;
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
        }, 1000);
    })(false);*/

    // Block ads
    setInterval(function() {
        let storiesArray = document.body.querySelectorAll('div[data-pagelet^="FeedUnit_"]');
        
        let tasks = Array.from(storiesArray).map(ProcessArticle);
        Promise.all(tasks);
    }, 2000);
    
    function ProcessArticle(article)
    {
        return new Promise(resolve => {
            article.setAttribute("data-pagelet", "fbpp_" + article.getAttribute("data-pagelet"));
            
            let sponsoredLabel = article.querySelector("a[aria-label='Sponsored']");
            
            if (sponsoredLabel != null && sponsoredLabel.children.length > 0)
            {
                article.remove();

                resolve(true);
            }
            else
            {
                let specialSponsor = article.querySelector("div.oajrlxb2.g5ia77u1.qu0x051f.esr5mh6w.e9989ue4.r7d6kgcz.rq0escxv.nhd2j8a9.nc684nl6.p7hjln8o.kvgmc6g5.cxmmr5t8.oygrvhab.hcukyx3x.jb3vyjys.rz4wbd8a.qt6c0cv9.a8nywdso.i1ao9s8h.esuyzwwr.f1sip0of.lzcic4wl.gmql0nx0.gpro0wi8.b1v8xokw");

                if (specialSponsor != null)
                {
                    article.remove();
            
                    resolve(true);
                }
            }
            
            resolve(false);
        });
    }
})();
