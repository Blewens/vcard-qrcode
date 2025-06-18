document.addEventListener("DOMContentLoaded", function () {
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
NOTE:Connections made easy by QRvCard.io
END:VCARD`;
  }

  const generateBtn = document.getElementById("generateBtn");
  if (generateBtn) {
    generateBtn.addEventListener("click", function () {
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

        if (canvas) {
          const labelCanvas = document.createElement("canvas");
          const labelCtx = labelCanvas.getContext("2d");

          const padding = 10;
          const originalWidth = canvas.width;
          const labelHeight = labelText ? 40 : 0;
          const brandWidth = 40;

          const totalWidth = originalWidth + brandWidth;
          const totalHeight = originalWidth + labelHeight;

          labelCanvas.width = totalWidth;
          labelCanvas.height = totalHeight;

          labelCtx.fillStyle = background;
          labelCtx.fillRect(0, 0, totalWidth, totalHeight);
          labelCtx.drawImage(canvas, brandWidth, 0);

          labelCtx.save();
          labelCtx.translate(10, totalHeight / 2);
          labelCtx.rotate(-Math.PI / 2);
          labelCtx.fillStyle = foreground;
          labelCtx.font = "bold 12px 'Segoe UI', sans-serif";
          labelCtx.textAlign = "center";
          labelCtx.fillText("BY QRVCARD.IO", 0, 0);
          labelCtx.restore();

          if (labelText) {
            labelCtx.fillStyle = foreground;
            labelCtx.font = `16px '${fontFamily}', sans-serif`;
            labelCtx.textAlign = "center";
            labelCtx.fillText(labelText, totalWidth / 2, totalHeight - padding);
          }

          qrcodeContainer.innerHTML = "";
          qrcodeContainer.appendChild(labelCanvas);

          const downloadQR = document.getElementById("downloadQR");
          downloadQR.href = labelCanvas.toDataURL("image/png");
          downloadQR.download = "qrcode.png";
          downloadQR.style.display = "block";
        }

        const downloadVCF = document.getElementById("downloadVCF");
        const vcfBlob = new Blob([vCardData], { type: "text/vcard" });
        downloadVCF.href = URL.createObjectURL(vcfBlob);
        downloadVCF.download = "contact.vcf";
        downloadVCF.style.display = "block";
      }, 600);
    });
  }
});
