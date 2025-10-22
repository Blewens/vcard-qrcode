// QR generator with LEFT white strip, stacked "BY QRVCARD.IO",
// and bottom label centered under the QR (not whole canvas)

document.addEventListener("DOMContentLoaded", function () {
  // --- DOM refs ---
  const fields = {
    fullName: document.getElementById("fullName"),
    phone: document.getElementById("phone"),
    email: document.getElementById("email"),
    jobTitle: document.getElementById("jobTitle"),
    organization: document.getElementById("organization"),
    website: document.getElementById("website"),
    linkedin: document.getElementById("linkedin"),
    twitter: document.getElementById("twitter"),
    facebook: document.getElementById("facebook"),
    instagram: document.getElementById("instagram"),
    bluesky: document.getElementById("bluesky"),
  };

  const colorInputs = {
    fg: document.getElementById("foreground"),
    bg: document.getElementById("background"),
  };

  const logoUpload = document.getElementById("logoUpload");
  const labelText = document.getElementById("qrLabelText");
  const labelFont = document.getElementById("qrLabelFont");

  const generateBtn = document.getElementById("generateBtn");
  const countdownMsg = document.getElementById("countdownMessage");
  const downloadZipBtn = document.getElementById("downloadZip");
  const qrcodeContainer = document.getElementById("qrcode");

  let zipBlob = null;
  let zipFilename = "QRvCard.zip";

  // ---- helpers ----
  function getFieldValue(el) {
    if (!el || el.offsetParent === null) return "";
    return el.value.trim().replace(/\r?\n|\r/g, " ").replace(/,/g, "\\,").replace(/;/g, "\\;");
  }

  function normalizeFields() {
    for (const key in fields) {
      const field = fields[key];
      if (field) {
        const clean = field.value.trim();
        field.value = "";
        // force reflow for mobile autofill commit
        // eslint-disable-next-line no-unused-expressions
        field.offsetHeight;
        field.value = clean;
        field.dispatchEvent(new Event("input", { bubbles: true }));
        field.dispatchEvent(new Event("change", { bubbles: true }));
      }
    }
  }

  function generateVCard() {
    const fullName = getFieldValue(fields.fullName);
    const email = getFieldValue(fields.email);
    const phone = getFieldValue(fields.phone);
    const jobTitle = getFieldValue(fields.jobTitle);
    const organization = getFieldValue(fields.organization);
    const website = getFieldValue(fields.website);
    const linkedin = getFieldValue(fields.linkedin);
    const twitter = getFieldValue(fields.twitter);
    const facebook = getFieldValue(fields.facebook);
    const instagram = getFieldValue(fields.instagram);
    const bluesky = getFieldValue(fields.bluesky);

    let v = `BEGIN:VCARD
VERSION:3.0
FN:${fullName}
EMAIL:${email}`;
    if (phone) v += `\nTEL:${phone}`;
    if (organization) v += `\nORG:${organization}`;
    if (jobTitle) v += `\nTITLE:${jobTitle}`;
    if (website) v += `\nURL:${website}`;
    if (linkedin) v += `\nitem1.URL:${linkedin}`;
    if (twitter) v += `\nitem2.URL:${twitter}`;
    if (facebook) v += `\nitem3.URL:${facebook}`;
    if (instagram) v += `\nitem4.URL:${instagram}`;
    if (bluesky) v += `\nitem5.URL:${bluesky}`;
    v += `\nNOTE:Connections made easy by https://QRvCard.io
END:VCARD`;
    return v;
  }

  // ---- canvas builder (LEFT white strip + centered bottom label under QR) ----
  function makeQRCanvas({
    text,
    size = 512,
    colorDark = "#000000",
    colorLight = "#ffffff",
    label,
    labelFontFamily,
    logoImage,
    brandText = "BY QRVCARD.IO",
    brandStripWidth = 96,    // adjust to taste
    brandBg = null,          // null => use colorLight (white)
    brandColor = "#000000"   // black text on white strip
  }) {
    return new Promise((resolve) => {
      const temp = document.createElement("div");

      // eslint-disable-next-line no-undef
      new QRCode(temp, {
        text,
        width: size,
        height: size,
        colorDark,
        colorLight,
        correctLevel: QRCode.CorrectLevel.H,
      });

      requestAnimationFrame(() => {
        let qrCanvas = temp.querySelector("canvas");
        let img = temp.querySelector("img");

        const finishWithCanvas = (sourceCanvas) => {
          const padding = 24;

          // Bottom label sizing to feel similar to side characters
          const baseSideFont = Math.floor(brandStripWidth * 0.9);
          const bottomLabelFontSize = label ? Math.max(22, Math.min(40, baseSideFont)) : 0;
          const labelMargin = label ? 20 : 0;
          const labelHeight = label ? bottomLabelFontSize + 16 : 0;

          // Final canvas (LEFT strip)
          const strip = brandStripWidth;
          const finalWidth  = size + padding * 2 + strip;
          const finalHeight = size + padding * 2 + labelMargin + labelHeight;

          const out = document.createElement("canvas");
          out.width = finalWidth;
          out.height = finalHeight;
          const ctx = out.getContext("2d");

          // Background
          const bg = colorLight || "#ffffff";
          ctx.fillStyle = bg;
          ctx.fillRect(0, 0, out.width, out.height);

          // Left strip (fills full height)
          const stripX = 0;
          const stripW = strip;
          const stripH = out.height;
          ctx.fillStyle = brandBg || bg; // white to match bottom area
          ctx.fillRect(stripX, 0, stripW, stripH);

          // Draw QR shifted right of strip
          const qrX = padding + stripW;
          const qrY = padding;
          ctx.drawImage(sourceCanvas, qrX, qrY);

          // Optional center logo
          if (logoImage) {
            const logoMax = Math.floor(size * 0.2);
            let w = logoImage.naturalWidth || logoImage.width || logoMax;
            let h = logoImage.naturalHeight || logoImage.height || logoMax;
            const scale = Math.min(logoMax / w, logoMax / h);
            const drawW = Math.floor(w * scale);
            const drawH = Math.floor(h * scale);
            const cx = qrX + Math.floor(size / 2) - Math.floor(drawW / 2);
            const cy = qrY + Math.floor(size / 2) - Math.floor(drawH / 2);
            ctx.fillStyle = "#ffffff";
            const pad = 6;
            ctx.fillRect(cx - pad, cy - pad, drawW + pad * 2, drawH + pad * 2);
            ctx.drawImage(logoImage, cx, cy, drawW, drawH);
          }

          // Bottom label centered under QR (not whole canvas)
          if (label) {
            ctx.font = `${bottomLabelFontSize}px ${labelFontFamily || "Arial"}`;
            ctx.fillStyle = "#000000";
            ctx.textAlign = "center";
            ctx.textBaseline = "top";
            const textX = qrX + size / 2;                     // center under QR
            const textY = padding + size + labelMargin;
            ctx.fillText(label, textX, textY);
          }

          // Left stacked text: "BY QRVCARD.IO" (one char per line; blank for space)
          const chars = [];
          for (const ch of brandText) chars.push(ch === " " ? "" : ch);

          // Fit to width/height of strip
          let fontSize = Math.floor(stripW * 0.75);
          let lineHeight = Math.floor(fontSize * 1.05);
          const topPad = 16, bottomPad = 16;
          const totalNeeded = chars.length * lineHeight;
          const scaleH = Math.min(1, (stripH - topPad - bottomPad) / totalNeeded);
          fontSize = Math.floor(fontSize * scaleH);
          lineHeight = Math.floor(lineHeight * scaleH);

          ctx.fillStyle = brandColor;
          ctx.textAlign = "center";
          ctx.textBaseline = "alphabetic";
          ctx.font = `600 ${fontSize}px ${labelFontFamily || "Arial"}`;

          const centerX = stripX + Math.floor(stripW / 2);
          let y = topPad + fontSize; // first baseline
          for (let i = 0; i < chars.length; i++) {
            const ch = chars[i];
            if (ch) ctx.fillText(ch, centerX, y);
            y += lineHeight;
          }

          resolve(out);
        };

        if (qrCanvas) {
          finishWithCanvas(qrCanvas);
        } else if (img) {
          const c = document.createElement("canvas");
          c.width = size; c.height = size;
          const ctx = c.getContext("2d");
          const drawAndFinish = () => { ctx.drawImage(img, 0, 0, size, size); finishWithCanvas(c); };
          img.complete ? drawAndFinish() : (img.onload = drawAndFinish, img.onerror = drawAndFinish);
        } else {
          const c = document.createElement("canvas");
          c.width = size; c.height = size;
          const ctx = c.getContext("2d");
          ctx.fillStyle = "#ccc"; ctx.fillRect(0, 0, size, size);
          finishWithCanvas(c);
        }
      });
    });
  }

  // ---- file helpers ----
  function readLogoFile(file) {
    return new Promise((resolve) => {
      if (!file) return resolve(null);
      const img = new Image();
      const reader = new FileReader();
      reader.onload = (e) => {
        img.onload = () => resolve(img);
        img.onerror = () => resolve(null);
        img.src = e.target.result;
      };
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(file);
    });
  }

  function canvasToBlob(canvas, type = "image/png", quality) {
    return new Promise((resolve) => {
      if (canvas.toBlob) {
        canvas.toBlob((blob) => resolve(blob), type, quality);
      } else {
        const dataURL = canvas.toDataURL(type, quality);
        const byteString = atob(dataURL.split(",")[1]);
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
        resolve(new Blob([ab], { type }));
      }
    });
  }

  // ---- main flow ----
  async function proceedToGenerate() {
    try {
      qrcodeContainer.innerHTML = "";
      downloadZipBtn.style.display = "none";
      zipBlob = null;

      const vcard = generateVCard();

      const colorDark = (colorInputs.fg && colorInputs.fg.value) || "#000000";
      const colorLight = (colorInputs.bg && colorInputs.bg.value) || "#ffffff";
      const label = labelText ? labelText.value.trim() : "";
      const labelFontFamily = labelFont ? labelFont.value : "Arial";

      const logoFile = logoUpload?.files?.[0] || null;
      const logoImg = await readLogoFile(logoFile);

      const canvas = await makeQRCanvas({
        text: vcard,
        size: 512,
        colorDark,
        colorLight,
        label,
        labelFontFamily,
        logoImage: logoImg,
        brandText: "BY QRVCARD.IO",
        brandStripWidth: 96,
        brandBg: null,
        brandColor: "#000000",
      });

      // Preview
      const preview = document.createElement("img");
      preview.alt = "QR code preview";
      preview.style.maxWidth = "100%";
      preview.style.height = "auto";
      preview.src = canvas.toDataURL("image/png");
      qrcodeContainer.appendChild(preview);

      // ZIP: QRCode.png + Contact.vcf + README.txt
      // eslint-disable-next-line no-undef
      const zip = new JSZip();
      const pngBlob = await canvasToBlob(canvas, "image/png");
      zip.file("QRCode.png", pngBlob);
      zip.file("Contact.vcf", vcard);
      zip.file("README.txt", `QRvCard.io bundle

Files:
- QRCode.png  : Your QR code image
- Contact.vcf : vCard contact file

Tip: On iOS, open Contact.vcf to add to Contacts. On Android, open with Contacts app.`);

      const blob = await zip.generateAsync({ type: "blob" });
      finalize(blob);
    } catch (err) {
      console.error(err);
      countdownMsg.textContent = "Sorry! Something went wrong. Please try again.";
      generateBtn.disabled = false;
    }
  }

  function finalize(zipBlobResult) {
    zipBlob = zipBlobResult;
    zipFilename = "QRvCard.zip";
    downloadZipBtn.style.display = "inline-block";
    countdownMsg.textContent = "Your QR & vCard are ready.";
    generateBtn.disabled = false;

    downloadZipBtn.addEventListener("click", () => {
      if (zipBlob && zipFilename) {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(zipBlob);
        a.download = zipFilename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(a.href), 1500);
      }
      downloadZipBtn.classList.remove("pulse");
    }, { once: true });
  }

  // ---- UI events ----
  generateBtn.addEventListener("click", function () {
    normalizeFields();
    downloadZipBtn.style.display = "none";

    if (!getFieldValue(fields.fullName) || !getFieldValue(fields.email)) {
      alert("Please fill in both Full Name and Email before generating your QR code.");
      return;
    }

    let countdown = 5;
    countdownMsg.textContent = `Generating in ${countdown}...`;
    generateBtn.disabled = true;

    const interval = setInterval(() => {
      countdown--;
      if (countdown > 0) {
        countdownMsg.textContent = `Generating in ${countdown}...`;
      } else {
        clearInterval(interval);
        countdownMsg.textContent = "Generating your QR code...";
        proceedToGenerate();
      }
    }, 1000);

    setTimeout(() => {
      if (countdownMsg.textContent.includes("Generating your QR code")) {
        countdownMsg.textContent = "Sorry! Something went wrong. Please try again.";
        generateBtn.disabled = false;
      }
    }, 10000);
  });

  downloadZipBtn.addEventListener("click", function () {
    if (zipBlob && zipFilename) {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(zipBlob);
      a.download = zipFilename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(a.href), 1500);
    }
  });

  window.addEventListener("load", normalizeFields);
});