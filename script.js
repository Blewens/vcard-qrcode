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
    instagram: document.getElementById("instagram")
  };

  const generateBtn = document.getElementById("generateBtn");
  const countdownMsg = document.getElementById("countdownMessage");

  function getFieldValue(field) {
    return field && field.offsetParent !== null ? field.value.trim() : "";
  }

  function normalizeFields() {
    for (const key in fields) {
      const field = fields[key];
      if (field) {
        const clean = field.value.trim();
        field.value = "";     // Clear value to break autofill binding
        field.value = clean;  // Reset value as plain text
        field.dispatchEvent(new Event("input")); // Trigger any bound events
      }
    }
  }

  function generateVCard() {
    return `BEGIN:VCARD
VERSION:3.0
FN:${getFieldValue(fields.fullName)}
TEL:${getFieldValue(fields.phone)}
EMAIL:${getFieldValue(fields.email)}
ORG:${getFieldValue(fields.organization)}
TITLE:${getFieldValue(fields.jobTitle)}
URL:${getFieldValue(fields.website)}
item1.URL:${getFieldValue(fields.linkedin)}
item2.URL:${getFieldValue(fields.twitter)}
item3.URL:${getFieldValue(fields.facebook)}
item4.URL:${getFieldValue(fields.instagram)}
NOTE:Connections made easy by https://QRvCard.io
END:VCARD`;
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

    // Timeout safeguard
    setTimeout(() => {
      if (countdownMsg.textContent.includes("Generating your QR code")) {
        countdownMsg.textContent =
          "Something went wrong. If autofill added hidden data, please show all fields and check again.";
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

      const logoInput = document.getElementById("logoUpload");
      const size = canvas.width * 0.25;

      const leftMargin = 40;
      const bottomLabelHeight = labelText ? 30 : 0;

      const labelCanvas = document.createElement("canvas");
      const ctx = labelCanvas.getContext("2d");

      labelCanvas.width = canvas.width + leftMargin;
      labelCanvas.height = canvas.height + bottomLabelHeight;

      // Fill background
      ctx.fillStyle = background;
      ctx.fillRect(0, 0, labelCanvas.width, labelCanvas.height);

      // Draw QR code
      ctx.drawImage(canvas, leftMargin, 0);

      // Left vertical label
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

      // Bottom optional label centered
      if (labelText) {
        ctx.fillStyle = foreground;
        ctx.font = `bold 18px ${fontFamily}`;
        ctx.textAlign = "center";
        ctx.textBaseline = "bottom";
        ctx.fillText(labelText, leftMargin + canvas.width / 2, labelCanvas.height - 10);
      }

      // Logo overlay
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
          finalize();
        };
        logo.src = URL.createObjectURL(logoInput.files[0]);
      } else {
        finalize();
      }

      function finalize() {
        qrcodeContainer.innerHTML = "";
        qrcodeContainer.appendChild(labelCanvas);

        const downloadQR = document.getElementById("downloadQR");
        downloadQR.href = labelCanvas.toDataURL("image/png");
        downloadQR.download = "qrcode.png";
        downloadQR.style.display = "block";

        const downloadVCF = document.getElementById("downloadVCF");
        const vcfBlob = new Blob([vCardData], { type: "text/vcard" });
        downloadVCF.href = URL.createObjectURL(vcfBlob);
        downloadVCF.download = "contact.vcf";
        downloadVCF.style.display = "block";

        countdownMsg.textContent = "";
        generateBtn.disabled = false;
      }
    }, 200);
  }
});
