const express = require("express");
const app = express();
const {join} = require('path');


{import("puppeteer").Configuration}
 
module.exports = {
  cacheDirectory: join(__dirname, '.cache', 'puppeteer'),
};
let chrome = {};
let puppeteer;

if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
  chrome = require("chrome-aws-lambda");
  puppeteer = require("puppeteer-core");
} else {
  puppeteer = require("puppeteer");
}

app.get("/api", async (req, res) => {
  let options = {};

  if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
    options = {
        args: [
          ...chrome.args,
          '--autoplay-policy=user-gesture-required',
          '--disable-background-networking',
          '--disable-background-timer-throttling',
          '--disable-backgrounding-occluded-windows',
          '--disable-breakpad',
          '--disable-client-side-phishing-detection',
          '--disable-component-update',
          '--disable-default-apps',
          '--disable-dev-shm-usage',
          '--disable-domain-reliability',
          '--disable-features=AudioServiceOutOfProcess',
          '--disable-hang-monitor',
          '--disable-ipc-flooding-protection',
          '--disable-notifications',
          '--disable-offer-store-unmasked-wallet-cards',
          '--disable-popup-blocking',
          '--disable-print-preview',
          '--disable-prompt-on-repost',
          '--disable-renderer-backgrounding',
          '--disable-setuid-sandbox',
          '--disable-speech-api',
          '--disable-sync',
          '--hide-scrollbars',
          '--ignore-gpu-blacklist',
          '--metrics-recording-only',
          '--mute-audio',
          '--no-default-browser-check',
          '--no-first-run',
          '--no-pings',
          '--no-sandbox',   // This is critical for serverless environments
          '--no-zygote',
          '--single-process',
          '--disable-gpu'
        ],
        defaultViewport: chrome.defaultViewport,
        executablePath: await chrome.executablePath || '/usr/bin/chromium-browser' || '/usr/bin/google-chrome-stable',
        headless: chrome.headless,
        ignoreHTTPSErrors: true,
      };
      
  }

  try {
    const browser = await puppeteer.launch({
        ignoreDefaultArgs: ['--disable-extensions'],
      });
    let page = await browser.newPage();
    await page.goto("https://www.google.com");
    res.send(await page.title());
  } catch (err) {
    console.error("Error launching Puppeteer:", err.stack); // Log full error stack
    res.status(500).send("Error occurred while launching browser: " + err.message);
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server started");
});

module.exports = app;
