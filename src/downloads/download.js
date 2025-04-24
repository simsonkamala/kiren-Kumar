const express = require("express");
const router = express.Router();
const chromium = require("chrome-aws-lambda");

router.post("/generate", async (req, res) => {
  const { html } = req.body;

  // Step 1: Early exit on invalid input
  if (!html || typeof html !== "string" || html.trim().length < 10) {
    return res.status(400).json({ error: "Invalid or missing HTML content" });
  }

  let browser;

  try {
    const executablePath = await chromium.executablePath;
    console.log("✅ Chromium path resolved:", executablePath);

    // Step 2: Launch the browser
    browser = await chromium.puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath,
      headless: chromium.headless,
      ignoreDefaultArgs: ["--enable-automation"],
    });

    const page = await browser.newPage();

    // Step 3: Set HTML content
    await page.setContent(html, { waitUntil: "networkidle0" });

    // Step 4: Optional media emulation
    await page.emulateMediaType("screen");

    // Step 5: Generate PDF buffer
    const pdfBuffer = await page.pdf({
      format: "A3",
      printBackground: true,
      scale: 1,
      margin: { top: "30px", right: "30px", bottom: "30px", left: "30px" },
      landscape: false,
    });

    // Step 6: Send PDF as response
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