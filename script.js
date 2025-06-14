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

  const vCardData = generateVCard();
  const foreground = document.querySelector('input[name="foreground"]').value;
  const background = document.querySelector('input[name="background"]').value;
  const labelText = document.getElementById("qrLabelText").value.trim();
  const labelFont = document.getElementById("qrLabelFont").value;

  const tempDiv = document.createElement("div");
  new QRCode(tempDiv, {
    text: vCardData,
    width: 256,
    height: 256,
    colorDark: foreground,
    colorLight: background,
    correctLevel: QRCode.CorrectLevel.H,
  });

  setTimeout(() => {
    const qrImg = tempDiv.querySelector("img") || tempDiv.querySelector("canvas");
    if (!qrImg) return;

    const canvas = document.createElement("canvas");
    const qrSize = 256;
    const labelHeight = labelText ? 40 : 0;
    canvas.width = qrSize;
    canvas.height = qrSize + labelHeight;

    const ctx = canvas.getContext("2d");

    // Fill background
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw QR code
    const img = new Image();
    img.onload = function () {
      ctx.drawImage(img, 0, 0, qrSize, qrSize);

      // Add logo if available
      const logoInput = document.getElementById("logoUpload");
      if (logoInput.files.length > 0) {
        const logo = new Image();
        const logoSize = qrSize * 0.25;
        logo.onload = function () {
          ctx.drawImage(
            logo,
            (qrSize - logoSize) / 2,
            (qrSize - logoSize) / 2,
            logoSize,
            logoSize
          );
        };
        logo.src = URL.createObjectURL(logoInput.files[0]);
      }

      // Draw label
      if (labelText) {
        ctx.fillStyle = foreground;
        ctx.font = `16px ${labelFont}`;
        ctx.textAlign = "center";
        ctx.fillText(labelText, qrSize / 2, qrSize + 25);
      }

      // Display QR
      const qrcodeContainer = document.getElementById("qrcode");
      qrcodeContainer.innerHTML = "";
      qrcodeContainer.appendChild(canvas);

      // Enable downloads
      const downloadQR = document.getElementById("downloadQR");
      const downloadVCF = document.getElementById("downloadVCF");

      downloadQR.href = canvas.toDataURL("image/png");
      downloadQR.download = "qrcode.png";
      downloadQR.style.display = "block";

      const vcfBlob = new Blob([vCardData], { type: "text/vcard" });
      downloadVCF.href = URL.createObjectURL(vcfBlob);
      downloadVCF.download = "contact.vcf";
      downloadVCF.style.display = "block";
    };
    img.src = qrImg.src || qrImg.toDataURL();
  }, 500);
});
