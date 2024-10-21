const express = require("express");
const app = express();

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
      args: [...chrome.args, "--hide-scrollbars", "--disable-web-security"],
      defaultViewport: chrome.defaultViewport,
      executablePath: await chrome.executablePath || '/usr/bin/chromium-browser', // Added fallback for executablePath
      headless: chrome.headless,
      ignoreHTTPSErrors: true,
    };
  }

  try {
    let browser = await puppeteer.launch(options);
    let page = await browser.newPage();
    await page.goto("https://www.google.com");
    res.send(await page.title());
  } catch (err) {
    console.error("Error launching Puppeteer:", err);
    res.status(500).send("Error occurred while launching browser.");
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server started");
});

module.exports = app;
