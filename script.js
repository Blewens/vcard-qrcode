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
  const qrcodeContainer = document.getElementById("qrcode");
  qrcodeContainer.innerHTML = ""; // Clear previous QR

  const vCardData = generateVCard();
  const foreground = document.querySelector('input[name="foreground"]').value;
  const background = document.querySelector('input[name="background"]').value;

  const qr = new QRCode(qrcodeContainer, {
    text: vCardData,
    width: 256,
    height: 256,
    colorDark: foreground,
    colorLight: background,
    correctLevel: QRCode.CorrectLevel.H,
  });

  // Wait a moment for QR to be generated before adding logo
  setTimeout(() => {
    const canvas = qrcodeContainer.querySelector("canvas");
    const logoInput = document.getElementById("logoUpload");
    if (canvas && logoInput.files.length > 0) {
      const ctx = canvas.getContext("2d");
      const logo = new Image();
      const size = canvas.width * 0.25; // 25% of QR code
      logo.onload = function () {
        ctx.drawImage(
          logo,
          (canvas.width - size) / 2,
          (canvas.height - size) / 2,
          size,
          size
        );
      };
      logo.src = URL.createObjectURL(logoInput.files[0]);
    }
  }, 500);

  // Show download buttons
  const downloadQR = document.getElementById("downloadQR");
  const downloadVCF = document.getElementById("downloadVCF");

  setTimeout(() => {
    const canvas = qrcodeContainer.querySelector("canvas");
    if (canvas) {
      downloadQR.href = canvas.toDataURL("image/png");
      downloadQR.download = "qrcode.png";
      downloadQR.style.display = "block";
    }

    const vcfBlob = new Blob([vCardData], { type: "text/vcard" });
    downloadVCF.href = URL.createObjectURL(vcfBlob);
    downloadVCF.download = "contact.vcf";
    downloadVCF.style.display = "block";
  }, 600);
});
