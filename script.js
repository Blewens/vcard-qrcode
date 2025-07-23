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
  const downloadZipBtn = document.getElementById("downloadZip");
  let zipBlob = null;
  let zipFilename = "QRvCard.zip";

  function getFieldValue(field) {
    if (!field || field.offsetParent === null) return "";
    return field.value.trim()
      .replace(/\r?\n|\r/g, " ")
      .replace(/,/g, "\\,")
      .replace(/;/g, "\\;");
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

    const fullName = getFieldValue(fields.fullName);
    const email = getFieldValue(fields.email);

    if (!fullName || !email) {
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
  });

  async function proceedToGenerate() {
    const qrcodeContainer = document.getElementById("qrcode");
    qrcodeContainer.innerHTML = "";

    const vCardData = generateVCard();
    const foreground = document.getElementById("foreground").value || "#000000";
    const background = document.getElementById("background").value || "#ffffff";
    const labelText = document.getElementById("qrLabelText").value.trim();
    const fontFamily = document.getElementById("qrLabelFont").value;
    const logoInput = document.getElementById("logoUpload");

    const qrDiv = document.createElement("div");
    qrcodeContainer.appendChild(qrDiv);

    const qr = new QRCode(qrDiv, {
      text: vCardData,
      width: 256,
      height: 256,
      colorDark: foreground,
      colorLight: background,
      correctLevel: QRCode.CorrectLevel.H,
    });

    setTimeout(() => {
      const canvas = qrDiv.querySelector("canvas");
      if (!canvas) return;

      const size = canvas.width * 0.25;
      const leftMargin = 40;
      const bottomLabelHeight = labelText ? 30 : 0;

      const labelCanvas = document.createElement("canvas");
      const ctx = labelCanvas.getContext("2d");

      labelCanvas.width = canvas.width + leftMargin;
      labelCanvas.height = canvas.height + bottomLabelHeight;

      ctx.fillStyle = background;
      ctx.fillRect(0, 0, labelCanvas.width, labelCanvas.height);
      ctx.drawImage(canvas, leftMargin, 0);

      // Vertical text
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
        if (char !== " ") {
          ctx.fillText(char, x, y + i * lineHeight);
        }
      }
      ctx.restore();

      if (labelText) {
        ctx.fillStyle = foreground;
        ctx.font = `bold 18px ${fontFamily}`;
        ctx.textAlign = "center";
        ctx.textBaseline = "bottom";
        ctx.fillText(labelText, leftMargin + canvas.width / 2, labelCanvas.height - 10);
      }

      if (logoInput.files.length > 0) {
        const logo = new Image();
        logo.onload = function () {
          ctx.drawImage(
            logo,
            labelCanvas.width / 2 - size / 2,
            (canvas.height - size) / 2,
            size,
            size
          );
          finalize(labelCanvas, vCardData);
        };
        logo.src = URL.createObjectURL(logoInput.files[0]);
      } else {
        finalize(labelCanvas, vCardData);
      }
    }, 500);
  }

  function finalize(canvas, vCardData) {
    const fullName = getFieldValue(fields.fullName);
    canvas.toBlob(async function (qrBlob) {
      const vcfBlob = new Blob([vCardData], { type: "text/vcard" });

      const zip = new JSZip();
      zip.file("QRCode.png", qrBlob);
      zip.file("Contact.vcf", vcfBlob);
      zip.file("README.txt", `This ZIP contains:\n- A QR code image for ${fullName}\n- A vCard file (Contact.vcf)\n\nScan or import to save the contact.`);

      zipBlob = await zip.generateAsync({ type: "blob" });
      zipFilename = `${fullName.replace(/\s+/g, "_") || "QRvCard"}_Files.zip`;

      const qrcodeContainer = document.getElementById("qrcode");
      qrcodeContainer.innerHTML = "";
      qrcodeContainer.appendChild(canvas);

      countdownMsg.textContent = "";
      generateBtn.disabled = false;
      downloadZipBtn.style.display = "inline-block";
    }, "image/png");
  }

  // Download on user click
  downloadZipBtn.addEventListener("click", function () {
    if (!zipBlob) {
      alert("Please generate a QR code first.");
      return;
    }

    const link = document.createElement("a");
    link.href = URL.createObjectURL(zipBlob);
    link.download = zipFilename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });
});
