// ==UserScript==
// @name         MegaUp Direct Link Extractor (Mobile)
// @namespace    https://github.com/
// @version      2.0
// @description  MegaUp မှ direct download link ကိုသာ မျက်နှာပြင်ပေါ်တွင် ထုတ်ပြပေးသည်
// @match        *://*.megaup.net/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function() {
    'use strict';

    // မျက်နှာပြင် အပေါ်ပိုင်းတွင် Link ပြသမည့် UI အကွက်တစ်ခု ဖန်တီးခြင်း
    const box = document.createElement('div');
    box.style.position = 'fixed';
    box.style.top = '10px';
    box.style.left = '5%';
    box.style.width = '90%';
    box.style.padding = '12px';
    box.style.backgroundColor = '#111827';
    box.style.border = '2px solid #06b6d4';
    box.style.borderRadius = '10px';
    box.style.zIndex = '999999';
    box.style.boxShadow = '0 4px 15px rgba(0,0,0,0.6)';
    box.style.textAlign = 'center';
    box.style.color = '#fff';
    box.style.fontFamily = 'sans-serif';
    box.innerHTML = '<span style="font-size: 13px; color: #38bdf8;">MegaUp Timer စောင့်ဆိုင်းနေပါသည်...</span>';

    document.body.appendChild(box);

    // Timer ပြီးဆုံးပြီး Link ပေါ်လာသည်အထိ ၁ စက္ကန့်တစ်ကြိမ် စစ်ဆေးခြင်း
    const checkTimer = setInterval(() => {
        const btn = document.querySelector('a#btn-download, a.btn-download');

        if (btn && btn.getAttribute('href') && !btn.getAttribute('href').startsWith('#')) {
            clearInterval(checkTimer);
            const directUrl = btn.href;

            // Link ရပါက Copy ကူးနိုင်သော Box အဖြစ် ပြောင်းလဲပြသခြင်း
            box.innerHTML = `
                <div style="font-size: 13px; color: #4ade80; margin-bottom: 8px; font-weight: bold;">Direct Link ရရှိပါပြီ!</div>
                <input id="directInput" type="text" value="${directUrl}" readonly 
                       style="width: 95%; padding: 8px; font-size: 11px; background: #000; color: #4ade80; border: 1px solid #374151; border-radius: 5px; margin-bottom: 8px;">
                <br>
                <button id="copyBtn" style="background: #0284c7; color: white; border: none; padding: 6px 16px; border-radius: 6px; font-size: 13px; font-weight: bold;">
                    Copy Link
                </button>
            `;

            // Copy Button နှိပ်ပါက Clipboard ထဲ ထည့်ခြင်း
            document.getElementById('copyBtn').addEventListener('click', () => {
                const input = document.getElementById('directInput');
                input.select();
                input.setSelectionRange(0, 99999); // Mobile အတွက်
                navigator.clipboard.writeText(input.value);
                document.getElementById('copyBtn').innerText = 'Copied!';
                document.getElementById('copyBtn').style.background = '#16a34a';
            });
        }
    }, 1000);
})();
