document.addEventListener("DOMContentLoaded", function () {
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
  };

  const generateBtn = document.getElementById("generateBtn");
  const countdownMsg = document.getElementById("countdownMessage");

  let downloadZip = document.getElementById("downloadZip");
  if (!downloadZip) {
    downloadZip = document.createElement("a");
    downloadZip.id = "downloadZip";
    downloadZip.className = "downloadBtn";
    downloadZip.style.display = "none";
    document.getElementById("qrcode").after(downloadZip);
  }

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
        field.offsetHeight;
        field.value = clean;
        field.dispatchEvent(new Event("input", { bubbles: true }));
        field.dispatchEvent(new Event("change", { bubbles: true }));
      }
    }
  }

  window.addEventListener("load", normalizeFields);

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

    vcard += `\nNOTE:Connections made easy by https://QRvCard.io
END:VCARD`;

    return vcard;
  }

  generateBtn.addEventListener("click", function () {
    normalizeFields();
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
        countdownMsg.textContent = "Something went wrong. Please try again.";
        generateBtn.disabled = false;
      }
    }, 7000);
  });

  function proceedToGenerate() {
    const qrcodeContainer = document.getElementById("qrcode");
    qrcodeContainer.innerHTML = "";

    const vCardData = generateVCard();
    const foreground = document.querySelector('input[name="foreground"]').value;
    const background = document.querySelector('input[name="background"]').value;
    const labelText = document.getElementById("qrLabelText").value.trim();
    const fontFamily = document.getElementById("qrLabelFont").value;
    const logoInput = document.getElementById("logoUpload");

    // Force canvas rendering
    const canvas = document.createElement("canvas");
    const qrDiv = document.createElement("div");
    qrDiv.appendChild(canvas);
    qrcodeContainer.appendChild(qrDiv);

    const qr = new QRCode(canvas, {
      text: vCardData,
      width: 256,
      height: 256,
      colorDark: foreground,
      colorLight: background,
      correctLevel: QRCode.CorrectLevel.H,
    });

    setTimeout(() => {
      const originalCanvas = qrDiv.querySelector("canvas");
      if (!originalCanvas) return;

      const size = originalCanvas.width * 0.25;
      const leftMargin = 40;
      const bottomLabelHeight = labelText ? 30 : 0;

      const labelCanvas = document.createElement("canvas");
      labelCanvas.width = originalCanvas.width + leftMargin;
      labelCanvas.height = originalCanvas.height + bottomLabelHeight;

      const ctx = labelCanvas.getContext("2d");
      ctx.fillStyle = background;
      ctx.fillRect(0, 0, labelCanvas.width, labelCanvas.height);
      ctx.drawImage(originalCanvas, leftMargin, 0);

      // Vertical label
      ctx.save();
      ctx.fillStyle = foreground;
      ctx.font = "bold 18px 'Courier New', monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "top";

      const label = "BY QRVCARD.IO";
      const x = 20;
      const lineHeight = 16;
      const totalHeight = label.length * lineHeight;
      const y = (labelCanvas.height - bottomLabelHeight - totalHeight) / 2;

      for (let i = 0; i < label.length; i++) {
        const char = label[i];
        if (char !== " ") ctx.fillText(char, x, y + i * lineHeight);
      }
      ctx.restore();

      // Bottom label (if set)
      if (labelText) {
        ctx.fillStyle = foreground;
        ctx.font = `bold 18px ${fontFamily}`;
        ctx.textAlign = "center";
        ctx.textBaseline = "bottom";
        ctx.fillText(labelText, leftMargin + originalCanvas.width / 2, labelCanvas.height - 10);
      }

      function finalize() {
        const vcfBlob = new Blob([vCardData], { type: "text/vcard" });
        labelCanvas.toBlob((qrBlob) => {
          const zip = new JSZip();
          zip.file("qrcode.png", qrBlob);
          zip.file("contact.vcf", vcfBlob);

          const fullName = getFieldValue(fields.fullName);
          const email = getFieldValue(fields.email);

          const readme = `This QR code contains the contact information for:\n\nName: ${fullName}\nEmail: ${email}\n\nTo import, scan the QR or open the .vcf file on your device.`;

          zip.file("README.txt", readme);

          zip.generateAsync({ type: "blob" }).then((zipFile) => {
            const url = URL.createObjectURL(zipFile);
            downloadZip.href = url;
            downloadZip.download = "QRvCard_Package.zip";
            downloadZip.style.display = "inline-block";
            countdownMsg.textContent = "Ready! Download your ZIP below.";
            generateBtn.disabled = false;
          });
        }, "image/png");
      }

      if (logoInput.files.length > 0) {
        const logo = new Image();
        logo.onload = function () {
          ctx.drawImage(logo, labelCanvas.width / 2 - size / 2, (originalCanvas.height - size) / 2, size, size);
          finalize();
        };
        logo.src = URL.createObjectURL(logoInput.files[0]);
      } else {
        finalize();
      }
    }, 200);
  }
});
