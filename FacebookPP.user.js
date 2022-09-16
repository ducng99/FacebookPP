// ==UserScript==
// @name         Facebook++
// @namespace    maxhyt.fbpp
// @version      3.6.1
// @description  download vid & block ads
// @author       Maxhyt
// @match        https://www.facebook.com/*
// @run-at       document-start
// ==/UserScript==

(function () {
    'use strict';

    const config = { childList: true, subtree: true };

    const callback = function (mutationsList, observer) {
        mutationsList.forEach(mutation => {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(node => {
                    RemoveSponsoredArticle(node);
                });
            }
        });
    };

    const observer = new MutationObserver(callback);
    observer.observe(document.documentElement, config);

    window.addEventListener('load', () => {
        // Download video
        if (/(\/(groups\/)?(\w|\.)+\/(permalink|posts)\/\d+)|(\/watch\/\?v=)/.test(window.location.href)) {
            let playerControls;

            let PlayerControlsInt = setInterval(() => {
                playerControls = document.body.querySelector('div.bp9cbjyn.i09qtzwb.jeutjz8y.j83agx80.btwxx1t3.pmk7jnqg.dpja2al7.pnx7fd3z.e4zzj2sf.k4urcfbm.tghn160j');

                if (playerControls) {
                    clearInterval(PlayerControlsInt);

                    let downloadDiv = document.createElement('div');
                    downloadDiv.style.cursor = "pointer";
                    downloadDiv.setAttribute("id", "DownloadVidButton");
                    downloadDiv.innerHTML = '<div class="q9uorilb qjjbsfad fv0vnmcu w0hvl6rk ggphbty4 jb3vyjys qt6c0cv9 a8nywdso i1ao9s8h esuyzwwr f1sip0of jnigpg78"><svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="white" class="bi bi-cloud-arrow-down-fill" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M8 2a5.53 5.53 0 0 0-3.594 1.342c-.766.66-1.321 1.52-1.464 2.383C1.266 6.095 0 7.555 0 9.318 0 11.366 1.708 13 3.781 13h8.906C14.502 13 16 11.57 16 9.773c0-1.636-1.242-2.969-2.834-3.194C12.923 3.999 10.69 2 8 2zm2.354 6.854l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 1 1 .708-.708L7.5 9.293V5.5a.5.5 0 0 1 1 0v3.793l1.146-1.147a.5.5 0 0 1 .708.708z"/></svg></div>';
                    downloadDiv.addEventListener("click", DownloadVideo);

                    playerControls.appendChild(downloadDiv);
                }
            }, 1000);
        }
    });

    function DownloadVideo() {
        let scripts = document.querySelectorAll('script');
        let foundScript = false;
        let src = null;

        for (let i = scripts.length - 1; i >= 0 && !foundScript; i--) {
            let SD_src_pos = scripts[i].innerText.indexOf('playable_url":"https');

            if (SD_src_pos !== -1) {
                foundScript = true;

                let src_end_pos = scripts[i].innerText.indexOf('","', SD_src_pos + 1);

                src = scripts[i].innerText.substring(SD_src_pos + 'playable_url":"'.length, src_end_pos).replaceAll("\\", "");

                if (scripts[i].innerText.substring(src_end_pos + '","playable_url_quality_hd":'.length, src_end_pos + '","playable_url_quality_hd":'.length + 4) !== "null") {
                    let HD_src_pos = src_end_pos + '","'.length;

                    if (HD_src_pos !== -1) {
                        src_end_pos = scripts[i].innerText.indexOf('","', HD_src_pos + 1);
                        src = scripts[i].innerText.substring(HD_src_pos + 'playable_url_quality_hd":"'.length, src_end_pos).replaceAll("\\", "");
                    }
                }
            }
        }

        if (src)
            window.open(src, "_blank");
        else
            alert('Link not found!');
    }

    function RemoveSponsoredArticle(article) {
        if (article.getAttribute && article.getAttribute("class") == "b6ax4al1") {
            const sponsorLettersDOM = [...article.querySelectorAll('span.rrjlc0n4.rse6dlih.no6h3tfh.jwegzro5.t9luyltp.om3e55n1.szd3m19j.bl8g0zk3 > span')].filter(d => {
                const styles = window.getComputedStyle(d, null);
                return styles.top === "0px" && styles.display !== "none";
            }).map(d => d.textContent);

            const sponsorTextToCheck = ['S', 'p', 'o', 'n', 's', 'e', 'r', 'e', 'd'];
            let isSponsored = false;

            sponsorTextToCheck.forEach((c, i) => {
                let charIndex = sponsorLettersDOM.indexOf(c);

                if (charIndex > -1) {
                    sponsorLettersDOM.splice(charIndex, 1);
                }
                else {
                    return;
                }

                if (i == sponsorTextToCheck.length - 1) {
                    isSponsored = true;
                }
            });

            if (isSponsored) {
                article.remove();
            }
        }
    }
})();
