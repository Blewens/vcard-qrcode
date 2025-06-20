document.addEventListener("DOMContentLoaded", function () {
  const fields = {
    fullName: document.getElementById("fullName"),
    email: document.getElementById("email"),
    organization: document.getElementById("organization"),
    phone: document.getElementById("phone"),
    website: document.getElementById("website"),
    jobTitle: document.getElementById("jobTitle"),
    address: document.getElementById("address"),
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

  function generateVCard() {
    return `BEGIN:VCARD
VERSION:3.0
FN:${getFieldValue(fields.fullName)}
ORG:${getFieldValue(fields.organization)}
TEL:${getFieldValue(fields.phone)}
EMAIL:${getFieldValue(fields.email)}
URL:${getFieldValue(fields.website)}
TITLE:${getFieldValue(fields.jobTitle)}
ADR:${getFieldValue(fields.address)}
item1.URL:${getFieldValue(fields.linkedin)}
item2.URL:${getFieldValue(fields.twitter)}
item3.URL:${getFieldValue(fields.facebook)}
item4.URL:${getFieldValue(fields.instagram)}
NOTE:Connections made easy by QRvCard.io
END:VCARD`;
  }

  generateBtn.addEventListener("click", function () {
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

    // Fail-safe timeout if generation silently fails
    setTimeout(() => {
      if (countdownMsg.textContent.includes("Generating your QR code")) {
        countdownMsg.textContent =
          "Something went wrong. If your browser autofilled hidden fields (like address), please clear them or reveal the section before generating.";
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
      const verticalPadding = 0;

      const labelCanvas = document.createElement("canvas");
      const ctx = labelCanvas.getContext("2d");

      labelCanvas.width = canvas.width + leftMargin;
      labelCanvas.height = canvas.height + bottomLabelHeight + verticalPadding;

      // Background fill
      ctx.fillStyle = background;
      ctx.fillRect(0, 0, labelCanvas.width, labelCanvas.height);

      // QR code draw
      ctx.drawImage(canvas, leftMargin, 0);

      // Left vertical stacked label
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

      // Bottom optional label centered to QR code
      if (labelText) {
        ctx.fillStyle = foreground;
        ctx.font = `bold 18px ${fontFamily}`;
        ctx.textAlign = "center";
        ctx.textBaseline = "bottom";
        ctx.fillText(labelText, leftMargin + canvas.width / 2, labelCanvas.height - 10);
      }

      // Optional logo overlay
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
