// script.js — QRvCard.io generator (complete)

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

  // --- ZIP state ---
  let zipBlob = null;
  let zipFilename = "QRvCard.zip";

  // Expose for download click handler
  window.__qrvc_zip_state__ = { get blob() { return zipBlob; }, get name() { return zipFilename; } };

  // --- Helpers ---
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
        // force reflow so mobile keyboards commit autofill properly
        // eslint-disable-next-line no-unused-expressions
        field.offsetHeight;
        field.value = clean;
        field.dispatchEvent(new Event("input", { bubbles: true }));
        field.dispatchEvent(new Event("change", { bubbles: true }));
      }
    }
  }

  function buildVCard() {
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
    if (bluesky) {
      // Add BlueSky as generic URL; many readers treat numbered items as extra URLs
      v += `\nitem5.URL:${bluesky}`;
    }
    v += `\nNOTE:Connections made easy by https://QRvCard.io
END:VCARD`;
    return v;
  }

  // Create a QR code using qrcodejs, then return a CANVAS with optional label + logo applied
  function makeQRCanvas({ text, size = 512, colorDark = "#000000", colorLight = "#ffffff", label, labelFontFamily, logoImage }) {
    return new Promise((resolve) => {
      // 1) Generate QR into a temporary element
      const temp = document.createElement("div");
      // Clean any prior children just in case
      while (temp.firstChild) temp.removeChild(temp.firstChild);

      // qrcodejs sometimes renders <canvas>, sometimes <img> (older forks). Handle both.
      // Correct level H for better logo placement tolerance.
      // eslint-disable-next-line no-undef
      const qr = new QRCode(temp, {
        text,
        width: size,
        height: size,
        colorDark,
        colorLight,
        correctLevel: QRCode.CorrectLevel.H,
      });

      // Wait one frame so qrcodejs can append its element
      requestAnimationFrame(() => {
        let qrCanvas = temp.querySelector("canvas");
        let img = temp.querySelector("img");

        const finishWithCanvas = (sourceCanvas) => {
          // 2) Prepare final canvas with optional label area
          const padding = 24; // outer padding
          const labelMargin = label ? 20 : 0;
          const labelHeight = label ? 48 : 0; // will be adjusted by font size
          const finalWidth = size + padding * 2;
          const finalHeight = size + padding * 2 + labelMargin + labelHeight;

          const out = document.createElement("canvas");
          out.width = finalWidth;
          out.height = finalHeight;
          const ctx = out.getContext("2d");

          // Fill background with page background color to avoid transparent PNG on some apps
          ctx.fillStyle = "#ffffff";
          // If you want the background to reflect selected bg color behind label too, use colorLight
          ctx.fillStyle = colorLight || "#ffffff";
          ctx.fillRect(0, 0, out.width, out.height);

          // Draw QR
          const qrX = padding;
          const qrY = padding;
          ctx.drawImage(sourceCanvas, qrX, qrY);

          // Optional logo overlay: draw in center of QR (15–20% of QR size)
          if (logoImage) {
            const logoMax = Math.floor(size * 0.2);
            let w = logoImage.naturalWidth || logoImage.width;
            let h = logoImage.naturalHeight || logoImage.height;
            if (!w || !h) { w = logoMax; h = logoMax; }

            // scale to fit
            const scale = Math.min(logoMax / w, logoMax / h);
            const drawW = Math.floor(w * scale);
            const drawH = Math.floor(h * scale);
            const cx = qrX + Math.floor(size / 2) - Math.floor(drawW / 2);
            const cy = qrY + Math.floor(size / 2) - Math.floor(drawH / 2);

            // Optional white behind logo for contrast
            ctx.fillStyle = "#ffffff";
            const pad = 6;
            ctx.fillRect(cx - pad, cy - pad, drawW + pad * 2, drawH + pad * 2);

            ctx.drawImage(logoImage, cx, cy, drawW, drawH);
          }

          // Optional label below
          if (label) {
            const font = `${24}px ${labelFontFamily || "Arial"}`;
            ctx.font = font;
            ctx.fillStyle = "#000000";
            ctx.textAlign = "center";
            ctx.textBaseline = "top";

            const textY = padding + size + labelMargin;
            const textX = Math.floor(out.width / 2);

            ctx.fillText(label, textX, textY);
          }

          resolve(out);
        };

        if (qrCanvas) {
          // Already have canvas
          finishWithCanvas(qrCanvas);
        } else if (img) {
          // Convert IMG to canvas once it's loaded
          const c = document.createElement("canvas");
          c.width = size;
          c.height = size;
          const ctx = c.getContext("2d");

          if (img.complete) {
            ctx.drawImage(img, 0, 0, size, size);
            finishWithCanvas(c);
          } else {
            img.onload = () => {
              ctx.drawImage(img, 0, 0, size, size);
              finishWithCanvas(c);
            };
            img.onerror = () => {
              // Fallback: make empty canvas to avoid complete failure
              finishWithCanvas(c);
            };
          }
        } else {
          // Fallback (shouldn't happen)
          const c = document.createElement("canvas");
          c.width = size;
          c.height = size;
          const ctx = c.getContext("2d");
          ctx.fillStyle = "#ccc";
          ctx.fillRect(0, 0, size, size);
          finishWithCanvas(c);
        }
      });
    });
  }

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
        // toBlob polyfill via dataURL
        const dataURL = canvas.toDataURL(type, quality);
        const byteString = atob(dataURL.split(",")[1]);
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
        resolve(new Blob([ab], { type }));
      }
    });
  }

  async function proceedToGenerate() {
    try {
      // Clear old preview & hide download
      qrcodeContainer.innerHTML = "";
      downloadZipBtn.style.display = "none";
      zipBlob = null;

      // Build vCard text
      const vcard = buildVCard();

      // Get customisation inputs
      const colorDark = (colorInputs.fg && colorInputs.fg.value) || "#000000";
      const colorLight = (colorInputs.bg && colorInputs.bg.value) || "#ffffff";
      const label = labelText ? labelText.value.trim() : "";
      const labelFontFamily = labelFont ? labelFont.value : "Arial";

      // Load optional logo
      const logoFile = logoUpload && logoUpload.files && logoUpload.files[0] ? logoUpload.files[0] : null;
      const logoImg = await readLogoFile(logoFile);

      // Make QR canvas (text = vCard content)
      const canvas = await makeQRCanvas({
        text: vcard,
        size: 512,
        colorDark,
        colorLight,
        label,
        labelFontFamily,
        logoImage: logoImg,
      });

      // Show preview
      const preview = document.createElement("img");
      preview.alt = "QR code preview";
      preview.style.maxWidth = "100%";
      preview.style.height = "auto";
      preview.src = canvas.toDataURL("image/png");
      qrcodeContainer.appendChild(preview);

      // Convert to blob
      const pngBlob = await canvasToBlob(canvas, "image/png");

      // Bundle into ZIP: QRCode.png + Contact.vcf (+ README.txt)
      // eslint-disable-next-line no-undef
      const zip = new JSZip();
      zip.file("QRCode.png", pngBlob);
      zip.file("Contact.vcf", vcard);
      const readme = `QRvCard.io bundle

Files:
- QRCode.png  : Your QR code image
- Contact.vcf : vCard contact file

Tip: On iOS, open Contact.vcf to add to Contacts. On Android, open with Contacts app.`;
      zip.file("README.txt", readme);

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

    // Show download button
    downloadZipBtn.style.display = "inline-block";
    countdownMsg.textContent = "Your QR & vCard are ready.";
    generateBtn.disabled = false;

    // Optional: stop pulse on download btn after first click
    // (keeps pulsing until user downloads once)
    downloadZipBtn.addEventListener(
      "click",
      () => {
        downloadZipBtn.classList.remove("pulse");
      },
      { once: true }
    );
  }

  // --- UI events ---
  generateBtn.addEventListener("click", function () {
    normalizeFields();
    downloadZipBtn.style.display = "none";

    if (!getFieldValue(fields.fullName) || !getFieldValue(fields.email)) {
      alert("Please fill in both Full Name and Email before generating your QR code.");
      return;
    }

    let countdown = 3;
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

    // Safety timeout
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
      // revoke after a tick
      setTimeout(() => URL.revokeObjectURL(a.href), 1500);
    }
  });

  // Normalize once UI is ready
  window.addEventListener("load", normalizeFields);
});