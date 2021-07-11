// ==UserScript==
// @name         Facebook++
// @namespace    maxhyt.fbpp
// @version      3.1.3
// @description  download vid & block ads
// @author       Maxhyt
// @match        https://www.facebook.com/*
// @updateURL    https://ducng99.github.io/FacebookPP/FacebookPP.meta.js
// @downloadURL  https://ducng99.github.io/FacebookPP/FacebookPP.user.js
// ==/UserScript==

(function() {
    'use strict';
    
    // Download video
    setTimeout(function() {
        if (/(\/groups\/(\w|\.)+\/(permalink|posts)\/\d+)|(\/watch\/\?v=)/.test(window.location.href))
        {
            new Promise(resolve => {
                let scripts = document.querySelectorAll('script');
                let foundScript = false;
                let src = "javascript:alert('Link not found!')";

                for (let i = 0; i < scripts.length && !foundScript; i++)
                {
                    let HD_src_pos = scripts[i].innerText.indexOf('playable_url_quality_hd":"https');

                    if (HD_src_pos !== -1)
                    {
                        foundScript = true;

                        let src_end_pos = scripts[i].innerText.indexOf('","', HD_src_pos + 1);
                        src = scripts[i].innerText.substring(HD_src_pos + 'playable_url_quality_hd":"'.length, src_end_pos).replaceAll("\\", "");
                    }
                    else
                    {
                        let SD_src_pos = scripts[i].innerText.indexOf('playable_url":"https');
                        
                        if (SD_src_pos !== -1)
                        {
                            foundScript = true;
                            
                            let src_end_pos = scripts[i].innerText.indexOf('","', SD_src_pos + 1);
                            
                            src = scripts[i].innerText.substring(SD_src_pos + 'playable_url":"'.length, src_end_pos).replaceAll("\\", "");
                        }
                    }
                }

                let playerControls = document.body.querySelector('div.bp9cbjyn.i09qtzwb.jeutjz8y.j83agx80.btwxx1t3.pmk7jnqg.dpja2al7.pnx7fd3z.e4zzj2sf.k4urcfbm.tghn160j');
                let downloadDiv = document.createElement('div');
                downloadDiv.innerHTML = '<a class="q9uorilb qjjbsfad fv0vnmcu w0hvl6rk ggphbty4 jb3vyjys qt6c0cv9 a8nywdso i1ao9s8h esuyzwwr f1sip0of jnigpg78" href="' + src + '" target="_blank"><svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="white" class="bi bi-cloud-arrow-down-fill" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M8 2a5.53 5.53 0 0 0-3.594 1.342c-.766.66-1.321 1.52-1.464 2.383C1.266 6.095 0 7.555 0 9.318 0 11.366 1.708 13 3.781 13h8.906C14.502 13 16 11.57 16 9.773c0-1.636-1.242-2.969-2.834-3.194C12.923 3.999 10.69 2 8 2zm2.354 6.854l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 1 1 .708-.708L7.5 9.293V5.5a.5.5 0 0 1 1 0v3.793l1.146-1.147a.5.5 0 0 1 .708.708z"/></svg></a>';
                playerControls.appendChild(downloadDiv);
                
                resolve();
            });
        }
    }, 3000);

    // Block ads
    setInterval(function() {
        let articlesArray = Array.from(document.body.querySelectorAll('div[data-pagelet^="FeedUnit_"]'));
        
        let tasks = articlesArray.map(ProcessArticle);
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
