// script.js — restored generator with brand strip, BlueSky, ZIP

document.addEventListener("DOMContentLoaded", function () {
  // --- Fields (your IDs) ---
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

  // --- Helpers (your originals) ---
  function getFieldValue(field) {
    if (!field || field.offsetParent === null) return "";
    return field.value.trim().replace(/\r?\n|\r/g, " ").replace(/,/g, "\\,").replace(/;/g, "\\;");
  }

  function normalizeFields() {
    for (const key in fields) {
      const field = fields[key];
      if (field) {
        const clean = field.value.trim();
        field.value = "";
        field.offsetHeight; // Force reflow (mobile autofill commit)
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

    let vcard = `BEGIN:VCARD
VERSION:3.0
FN:${fullName}
EMAIL:${email}`;
    if (phone) vcard += `\nTEL:${phone}`;
    if (organization) vcard += `\nORG:${organization}`;
    if (jobTitle) vcard += `\nTITLE:${jobTitle}`;
    if (website) vcard += `\nURL:${website}`;
    if (linkedin) vcard += `\nitem1.URL:${linkedin}`;
    if (twitter) vcard += `\nitem2.URL:${twitter}`;
    if (facebook) vcard += `\nitem3.URL:${facebook}`;
    if (instagram) vcard += `\nitem4.URL:${instagram}`;
    if (bluesky) vcard += `\nitem5.URL:${bluesky}`;
    vcard += `\nNOTE:Connections made easy by https://QRvCard.io
END:VCARD`;
    return vcard;
  }

  // --- QR drawing: label, logo, and right-side QRVCARD.IO strip baked into PNG ---
  function makeQRCanvas({
    text,
    size = 512,
    colorDark = "#000000",
    colorLight = "#ffffff",
    label,
    labelFontFamily,
    logoImage,
    brandText = "QRVCARD.IO",
    brandStripWidth = 84,
    brandBg = "#111111",
    brandColor = "#ffffff",
    brandLeft = false
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
          const labelMargin = label ? 20 : 0;
          const labelHeight = label ? 48 : 0;
          const strip = brandText ? brandStripWidth : 0;

          const finalWidth  = size + padding * 2 + strip;
          const finalHeight = size + padding * 2 + labelMargin + labelHeight;

          const out = document.createElement("canvas");
          out.width = finalWidth;
          out.height = finalHeight;
          const ctx = out.getContext("2d");

          // Background
          ctx.fillStyle = colorLight || "#ffffff";
          ctx.fillRect(0, 0, out.width, out.height);

          // QR position (shift if strip on left)
          const qrX = brandLeft ? padding + strip : padding;
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

          // Optional label
          if (label) {
            ctx.font = `24px ${labelFontFamily || "Arial"}`;
            ctx.fillStyle = "#000000";
            ctx.textAlign = "center";
            ctx.textBaseline = "top";
            const textY = padding + size + labelMargin;
            const textX = Math.floor(out.width / 2);
            ctx.fillText(label, textX, textY);
          }

          // Brand strip (right side by default)
          if (strip) {
            const sx = brandLeft ? 0 : out.width - strip;
            ctx.fillStyle = brandBg;
            ctx.fillRect(sx, 0, strip, out.height);

            ctx.save();
            ctx.fillStyle = brandColor;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            const cx = sx + strip / 2;
            const cy = out.height / 2;
            ctx.translate(cx, cy);
            ctx.rotate(-Math.PI / 2);
            const fontSize = Math.max(14, Math.min(22, Math.floor(strip * 0.24)));
            ctx.font = `600 ${fontSize}px ${labelFontFamily || "Arial"}`;
            ctx.fillText(brandText, 0, 0);
            ctx.restore();
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

  async function proceedToGenerate() {
    try {
      qrcodeContainer.innerHTML = "";
      downloadZipBtn.style.display = "none";
      zipBlob = null;

      const vcard = buildVCard();

      const colorDark = (colorInputs.fg && colorInputs.fg.value) || "#000000";
      const colorLight = (colorInputs.bg && colorInputs.bg.value) || "#ffffff";
      const label = labelText ? labelText.value.trim() : "";
      const labelFontFamily = labelFont ? labelFont.value : "Arial";

      const logoFile = logoUpload && logoUpload.files && logoUpload.files[0] ? logoUpload.files[0] : null;
      const logoImg = await readLogoFile(logoFile);

      const canvas = await makeQRCanvas({
        text: vcard,
        size: 512,
        colorDark,
        colorLight,
        label,
        labelFontFamily,
        logoImage: logoImg,
        brandText: "QRVCARD.IO",
        brandStripWidth: 84,
        brandBg: "#111111",
        brandColor: "#ffffff",
        brandLeft: false
      });

      // Preview image
      const preview = document.createElement("img");
      preview.alt = "QR code preview";
      preview.style.maxWidth = "100%";
      preview.style.height = "auto";
      preview.src = canvas.toDataURL("image/png");
      qrcodeContainer.appendChild(preview);

      // Build ZIP
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

  // --- Your original click logic (with countdown) ---
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