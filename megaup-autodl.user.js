// ==UserScript==
// @name         MegaUp Real Direct Link Extractor
// @version      2.0
// @description  MegaUp direct token link (megadl.boats/...) ကို ဖမ်းယူပြီး UI ပေါ်တွင် ထုတ်ပြပေးသည်
// @match        *://*.megaup.net/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    // ကြော်ငြာ Popup များ ပိတ်ခြင်း
    window.open = function() {
        console.log("[BLOCKED] Ad popup blocked!");
        return null;
    };

    // UI Box ပြုလုပ်ခြင်း
    function setupUI() {
        if (document.getElementById('direct-token-box')) return;

        const box = document.createElement('div');
        box.id = 'direct-token-box';
        box.style.cssText = `
            position: fixed;
            top: 10px;
            left: 5%;
            width: 90%;
            padding: 12px;
            background-color: #0b132b;
            border: 2px solid #00b4d8;
            border-radius: 10px;
            z-index: 2147483647;
            box-shadow: 0 8px 20px rgba(0,0,0,0.8);
            text-align: center;
            font-family: sans-serif;
            color: #fff;
        `;
        box.innerHTML = '<span style="font-size: 13px; color: #90e0ef;">Timer စောင့်ဆိုင်းနေပါသည်...</span>';
        document.body.appendChild(box);
    }

    // Direct Token Link ပေါ်လာပါက UI ပေါ်တွင် ထည့်သွင်းပြသခြင်း
    function displayLink(realLink) {
        const box = document.getElementById('direct-token-box');
        if (!box) return;

        box.innerHTML = `
            <div style="font-size: 13px; color: #4ade80; font-weight: bold; margin-bottom: 6px;">Direct Token Link ရရှိပါပြီ!</div>
            <textarea id="realDirectUrl" readonly rows="3"
                style="width: 100%; padding: 6px; font-size: 11px; background: #000814; color: #48cae4; border: 1px solid #1c2541; border-radius: 6px; box-sizing: border-box; word-break: break-all; margin-bottom: 8px;">${realLink}</textarea>
            <div style="display: flex; gap: 8px; justify-content: center;">
                <button id="copyRealBtn" style="background: #0077b6; color: #fff; border: none; padding: 7px 16px; border-radius: 6px; font-size: 12px; font-weight: bold; cursor: pointer;">
                    Copy Direct Link
                </button>
            </div>
        `;

        document.getElementById('copyRealBtn').addEventListener('click', function() {
            const textarea = document.getElementById('realDirectUrl');
            textarea.select();
            textarea.setSelectionRange(0, 99999);
            navigator.clipboard.writeText(textarea.value);
            this.innerText = 'Copied!';
            this.style.background = '#2b9348';
        });
    }

    // Network Request / Fetch များကို Intercept လုပ်၍ download link ဖမ်းယူခြင်း
    const originalFetch = window.fetch;
    window.fetch = async function(...args) {
        const response = await originalFetch.apply(this, args);
        try {
            const clone = response.clone();
            const text = await clone.text();
            // megadl.boats သို့မဟုတ် download_token ပါသော url ကို ရှာဖွေခြင်း
            const match = text.match(/https?:\/\/[a-zA-Z0-9.-]*megadl\.[a-z0-9.]+\/download\/[^"'<>\s]+/i);
            if (match) {
                displayLink(match[0].replace(/\\/g, ''));
            }
        } catch (e) {}
        return response;
    };

    window.addEventListener('DOMContentLoaded', setupUI);

    // Countdown ပြီးဆုံးပါက ခလုတ်ကို simulate click လုပ်ပြီး Link ထုတ်ယူခြင်း
    const interval = setInterval(() => {
        const btn = document.querySelector('a#btn-download, a.btn-download, button#btndownload');
        if (btn) {
            const href = btn.getAttribute('href');
            
            // Link ပေါ်နေပါက
            if (href && href.includes('megadl.') && href.includes('download_token')) {
                clearInterval(interval);
                displayLink(href);
                return;
            }

            // Countdown timer ပြီးသွား၍ ခလုတ်နှိပ်ရန် အဆင်သင့်ဖြစ်ပါက
            if (!btn.classList.contains('disabled') && !btn.classList.contains('disable')) {
                clearInterval(interval);
                
                // Form submit ဖြစ်ပါက action url စစ်ဆေးခြင်း
                const form = btn.closest('form');
                if (form && form.action && form.action.includes('megadl.')) {
                    displayLink(form.action);
                } else if (href && href.startsWith('http')) {
                    displayLink(href);
                }
            }
        }
    }, 500);

})();
