// ==UserScript==
// @name         MegaUp.net Direct Link Grabber
// @version      1.3
// @description  MegaUp မှ direct download link ကိုသာ မျက်နှာပြင်ပေါ်တွင် ထုတ်ပြပေးသည် (Auto-download မဆွဲပါ)
// @author       Elxss (Modified)
// @match        *://*.megaup.net/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function() {
    'use strict';

    console.log("[LINK-GRABBER] Loaded!");

    // မျက်နှာပြင်ပေါ်တွင် Link ပြသရန် UI အကွက် ဖန်တီးခြင်း
    const displayBox = document.createElement('div');
    displayBox.id = 'megaup-direct-box';
    displayBox.style.position = 'fixed';
    displayBox.style.top = '15px';
    displayBox.style.left = '50%';
    displayBox.style.transform = 'translateX(-50%)';
    displayBox.style.width = '90%';
    displayBox.style.maxWidth = '500px';
    displayBox.style.padding = '12px 16px';
    displayBox.style.backgroundColor = '#0f172a';
    displayBox.style.border = '2px solid #0284c7';
    displayBox.style.borderRadius = '12px';
    displayBox.style.zIndex = '9999999';
    displayBox.style.boxShadow = '0 8px 24px rgba(0,0,0,0.5)';
    displayBox.style.textAlign = 'center';
    displayBox.style.fontFamily = 'system-ui, -apple-system, sans-serif';
    displayBox.innerHTML = '<span style="font-size: 13px; color: #38bdf8;">Timer စောင့်ဆိုင်းနေပါသည်...</span>';

    document.body.appendChild(displayBox);

    // Direct Link ရရှိပါက UI ပေါ်တွင် ပြသပေးမည့် Function
    function showDirectLink(link) {
        displayBox.innerHTML = `
            <div style="font-size: 13px; color: #4ade80; font-weight: bold; margin-bottom: 8px;">Direct Link ရရှိပါပြီ!</div>
            <input id="directUrlInput" type="text" value="${link}" readonly 
                   style="width: 100%; padding: 8px; font-size: 11px; background: #020617; color: #38bdf8; border: 1px solid #334155; border-radius: 6px; box-sizing: border-box; margin-bottom: 10px;">
            <div style="display: flex; gap: 8px; justify-content: center;">
                <button id="copyDirectBtn" style="background: #0284c7; color: #fff; border: none; padding: 6px 14px; border-radius: 6px; font-size: 12px; font-weight: bold; cursor: pointer;">
                    Copy Link
                </button>
            </div>
        `;

        document.getElementById('copyDirectBtn').addEventListener('click', function() {
            const input = document.getElementById('directUrlInput');
            input.select();
            input.setSelectionRange(0, 99999);
            navigator.clipboard.writeText(input.value);
            this.innerText = 'Copied!';
            this.style.background = '#16a34a';
        });
    }

    let Confirmed = false;

    // Stage 1 စစ်ဆေးခြင်း (Download-timer div နှင့် a.btn)
    const checkButtonGenerateLink = setInterval(() => {
        let TimerDiv = document.querySelector("div[class='download-timer']");

        if (TimerDiv) {
            if (Confirmed === false) {
                Confirmed = true;
                clearInterval(checkButtonDownload);
            }

            let AExist = TimerDiv.querySelector("a[class='btn btn--primary']");
            if (AExist) {
                let waiting_stage1_check = setInterval(() => {
                    let href = AExist.getAttribute("href");
                    if (href && href !== "#") {
                        clearInterval(waiting_stage1_check);
                        clearInterval(checkButtonGenerateLink);

                        console.log("[LINK-GRABBER] Direct Link Found:", href);
                        // Auto-download မခေါ်ဘဲ Link ကိုသာ ထုတ်ပြခြင်း
                        showDirectLink(href);
                    }
                }, 500);
            }
        }
    }, 1000);

    // Stage 2 စစ်ဆေးခြင်း (btndownload ခလုတ် သို့မဟုတ် direct link ရှိပါက)
    const checkButtonDownload = setInterval(() => {
        let DownloadDiv = document.querySelector("div[id='download']");

        if (DownloadDiv) {
            if (Confirmed === false) {
                Confirmed = true;
                clearInterval(checkButtonGenerateLink);
            }

            let btn = DownloadDiv.querySelector("button[id='btndownload'], a#btn-download");
            if (btn && !btn.classList.contains("disable") && !btn.classList.contains("disabled")) {
                clearInterval(checkButtonDownload);

                let directHref = btn.getAttribute("href") || btn.dataset.url || btn.closest("form")?.action;
                if (directHref && directHref !== "#") {
                    showDirectLink(directHref);
                } else {
                    displayBox.innerHTML = '<span style="font-size: 13px; color: #fbbf24;">ခလုတ် အဆင်သင့်ဖြစ်ပါပြီ (Direct Link ကို Page မှ extract လုပ်၍ မရသေးပါ)</span>';
                }
            }
        }
    }, 1000);

})();
