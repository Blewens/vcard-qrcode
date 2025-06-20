document.addEventListener("DOMContentLoaded", function () {
  const fullName = document.getElementById("fullName");
  const email = document.getElementById("email");
  const organization = document.getElementById("organization");
  const phone = document.getElementById("phone");
  const website = document.getElementById("website");
  const jobTitle = document.getElementById("jobTitle");
  const address = document.getElementById("address");
  const linkedin = document.getElementById("linkedin");
  const twitter = document.getElementById("twitter");
  const facebook = document.getElementById("facebook");
  const instagram = document.getElementById("instagram");

  const generateBtn = document.getElementById("generateBtn");
  const countdownMsg = document.getElementById("countdownMessage");

  function generateVCard() {
    return `BEGIN:VCARD
VERSION:3.0
FN:${fullName.value}
ORG:${organization.value}
TEL:${phone.value}
EMAIL:${email.value}
URL:${website.value}
TITLE:${jobTitle.value}
ADR:${address.value}
item1.URL:${linkedin.value}
item2.URL:${twitter.value}
item3.URL:${facebook.value}
item4.URL:${instagram.value}
NOTE:Connections made easy by QRvCard.io
END:VCARD`;
  }

  generateBtn.addEventListener("click", function () {
    if (!fullName.value.trim() || !email.value.trim()) {
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
        generateBtn.disabled = false;

        proceedToGenerate();
        countdownMsg.textContent = "";
      }
    }, 1000);
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
      const bottomLabelHeight = labelText ? 40 : 0;
      const verticalPadding = labelText ? 10 : 0;

      const labelCanvas = document.createElement("canvas");
      const ctx = labelCanvas.getContext("2d");

      labelCanvas.width = canvas.width + leftMargin;
      labelCanvas.height = canvas.height + bottomLabelHeight + verticalPadding;

      // Background
      ctx.fillStyle = background;
      ctx.fillRect(0, 0, labelCanvas.width, labelCanvas.height);

      // Draw QR code
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
      let y = (labelCanvas.height - bottomLabelHeight - totalHeight) / 2;

      for (let i = 0; i < label.length; i++) {
        const char = label[i];
        if (char !== " ") {
          ctx.fillText(char, x, y + i * lineHeight);
        }
      }
      ctx.restore();

      // Bottom optional label
      if (labelText) {
        ctx.fillStyle = foreground;
        ctx.font = `bold 18px ${fontFamily}`;
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        ctx.fillText(labelText, labelCanvas.width / 2, labelCanvas.height - 10);
      }

      // Optional logo
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
      }
    }, 200);
  }
});
