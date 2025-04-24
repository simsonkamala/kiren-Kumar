const express = require("express");
const router = express.Router();
const puppeteer = require("puppeteer"); // ✅ Use only puppeteer

router.post("/generate", async (req, res) => {
  const { html } = req.body;

  if (!html || typeof html !== "string" || html.trim().length < 10) {
    return res.status(400).json({ error: "Invalid or missing HTML content" });
  }

  let browser;

  try {
    // ✅ You already know the Chrome path
    browser = await puppeteer.launch({
      executablePath: "/usr/bin/google-chrome",
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });
    await page.emulateMediaType("screen");

    const pdfBuffer = await page.pdf({
      format: "A3",
      printBackground: true,
      scale: 1,
      margin: { top: "30px", right: "30px", bottom: "30px", left: "30px" },
      landscape: false,
    });

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=invoice.pdf",
      "Content-Length": pdfBuffer.length,
    });

    res.send(pdfBuffer);
    console.log("✅ PDF generated and sent successfully");
  } catch (err) {
    console.error("❌ Error during PDF generation:", err.message);
    res.status(500).json({ error: "Server error while generating PDF" });
  } finally {
    if (browser) {
      try {
        await browser.close();
      } catch (closeErr) {
        console.warn("⚠️ Failed to close browser cleanly:", closeErr.message);
      }
    }
  }
});

module.exports = router;
