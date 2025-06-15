function generateVCard() {
  const fullName = document.getElementById("fullName").value;
  const organization = document.getElementById("organization").value;
  const phone = document.getElementById("phone").value;
  const email = document.getElementById("email").value;
  const website = document.getElementById("website").value;
  const jobTitle = document.getElementById("jobTitle").value;
  const address = document.getElementById("address").value;
  const linkedin = document.getElementById("linkedin").value;
  const twitter = document.getElementById("twitter").value;
  const facebook = document.getElementById("facebook").value;
  const instagram = document.getElementById("instagram").value;

  return `BEGIN:VCARD
VERSION:3.0
FN:${fullName}
ORG:${organization}
TEL:${phone}
EMAIL:${email}
URL:${website}
TITLE:${jobTitle}
ADR:${address}
item1.URL:${linkedin}
item2.URL:${twitter}
item3.URL:${facebook}
item4.URL:${instagram}
END:VCARD`;
}

document.getElementById("generateBtn").addEventListener("click", function () {
  const fullName = document.getElementById("fullName").value.trim();
  const email = document.getElementById("email").value.trim();

  if (!fullName || !email) {
    alert("Please fill in both Full Name and Email before generating your QR code.");
    return;
  }

  const qrcodeContainer = document.getElementById("qrcode");
  qrcodeContainer.innerHTML = "";

  const vCardData = generateVCard();
  const foreground = document.querySelector('input[name="foreground"]').value;
  const background = document.querySelector('input[name="background"]').value;
  const labelText = document.getElementById("qrLabelText").value.trim();
  const fontFamily = document.getElementById("qrLabelFont").value;

  const qr = new QRCode(qrcodeContainer, {
    text: vCardData,
    width: 256,
    height: 256,
    colorDark: foreground,
    colorLight: background,
    correctLevel: QRCode.CorrectLevel.H,
  });

  setTimeout(() => {
    const canvas = qrcodeContainer.querySelector("canvas");

    // Draw logo if provided
    const logoInput = document.getElementById("logoUpload");
    if (canvas && logoInput.files.length > 0) {
      const ctx = canvas.getContext("2d");
      const logo = new Image();
      const size = canvas.width * 0.25;
      logo.onload = function () {
        ctx.drawImage(logo, (canvas.width - size) / 2, (canvas.height - size) / 2, size, size);
      };
      logo.src = URL.createObjectURL(logoInput.files[0]);
    }

    // Draw label below QR if provided
    if (canvas && labelText) {
      const labelCanvas = document.createElement("canvas");
      const labelCtx = labelCanvas.getContext("2d");
      const padding = 10;
      const width = canvas.width;
      const height = canvas.height + 40;

      labelCanvas.width = width;
      labelCanvas.height = height;

      // Fill background
      labelCtx.fillStyle = background;
      labelCtx.fillRect(0, 0, width, height);

      // Draw QR onto new canvas
      labelCtx.drawImage(canvas, 0, 0);

      // Add label
      labelCtx.fillStyle = foreground;
      labelCtx.font = `16px '${fontFamily}'`;
      labelCtx.textAlign = "center";
      labelCtx.fillText(labelText, width / 2, height - padding);

      // Replace QR canvas
      qrcodeContainer.innerHTML = "";
      qrcodeContainer.appendChild(labelCanvas);
    }

    // Download Buttons
    const downloadQR = document.getElementById("downloadQR");
    const downloadVCF = document.getElementById("downloadVCF");

    const finalCanvas = qrcodeContainer.querySelector("canvas");
    if (finalCanvas) {
      downloadQR.href = finalCanvas.toDataURL("image/png");
      downloadQR.download = "qrcode.png";
      downloadQR.style.display = "block";
    }

    const vcfBlob = new Blob([vCardData], { type: "text/vcard" });
    downloadVCF.href = URL.createObjectURL(vcfBlob);
    downloadVCF.download = "contact.vcf";
    downloadVCF.style.display = "block";
  }, 600);
});
