// const express = require("express");
// const router = express.Router();
// const puppeteer = require("puppeteer"); // ✅ Use only puppeteer

// router.post("/generate", async (req, res) => {
//   const { html } = req.body;

//   if (!html || typeof html !== "string" || html.trim().length < 10) {
//     return res.status(400).json({ error: "Invalid or missing HTML content" });
//   }

//   let browser;

//   try {
//     // ✅ You already know the Chrome path
//     browser = await puppeteer.launch({
//       executablePath: "/usr/bin/google-chrome",
//       headless: true,
//       args: ["--no-sandbox", "--disable-setuid-sandbox"],
//     });

//     const page = await browser.newPage();
//     await page.setContent(html, { waitUntil: "networkidle0" });
//     await page.emulateMediaType("screen");

//     const pdfBuffer = await page.pdf({
//       format: "A3",
//       printBackground: true,
//       scale: 1,
//       margin: { top: "30px", right: "30px", bottom: "30px", left: "30px" },
//       landscape: false,
//     });

//     res.set({
//       "Content-Type": "application/pdf",
//       "Content-Disposition": "attachment; filename=invoice.pdf",
//       "Content-Length": pdfBuffer.length,
//     });

//     res.send(pdfBuffer);
//     console.log("✅ PDF generated and sent successfully");
//   } catch (err) {
//     console.error("❌ Error during PDF generation:", err.message);
//     res.status(500).json({ error: "Server error while generating PDF" });
//   } finally {
//     if (browser) {
//       try {
//         await browser.close();
//       } catch (closeErr) {
//         console.warn("⚠️ Failed to close browser cleanly:", closeErr.message);
//       }
//     }
//   }
// });

// module.exports = router;





const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

// Use stealth mode
puppeteer.use(StealthPlugin());

const scrapeImages = async () => {
  const url = 'https://www.justdial.com/Bangalore/Kattige-Interiors-Near-Green-Valley-School-Jp-Nagar/080PXX80-XX80-160604112527-J2Z2_BZDET/gallery';

  const browser = await puppeteer.launch({
    headless: true,
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/google-chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  try {
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36');
    await page.setExtraHTTPHeaders({ 'Accept-Language': 'en-US,en;q=0.9' });

    // 🛑 Wait for page load and scroll before scraping
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 0 });

    await autoScroll(page);
    await page.waitForSelector('img', { timeout: 20000 }); // increased timeout

    const imgSrcs = await page.evaluate(() => {
      const imgs = Array.from(document.querySelectorAll('img'));
      return imgs
        .map(img =>
          img.getAttribute('data-src') ||
          img.getAttribute('srcset') ||
          img.getAttribute('src')
        )
        .filter(src => src && !src.startsWith('data:image'));
    });

    const formattedArray = imgSrcs.map(src => ({ src }));
    return formattedArray;
  } catch (err) {
    return { error: err.message };
  } finally {
    await browser.close();
  }
};

async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise(resolve => {
      let totalHeight = 0;
      const distance = 100;
      const timer = setInterval(() => {
        window.scrollBy(0, distance);
        totalHeight += distance;
        if (totalHeight >= document.body.scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 100);
    });
  });
}

module.exports = scrapeImages;
