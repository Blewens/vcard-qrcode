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

  // Delay canvas handling to allow QR code to render
  setTimeout(() => {
    const canvas = qrDiv.querySelector("canvas");
    if (!canvas) {
      console.error("QR code canvas not found.");
      return;
    }

    const logoInput = document.getElementById("logoUpload");
    const size = canvas.width * 0.25;

    const labelCanvas = document.createElement("canvas");
    const ctx = labelCanvas.getContext("2d");

    const labelHeight = labelText ? 40 : 0;
    const leftMargin = 40;
    labelCanvas.width = canvas.width + leftMargin;
    labelCanvas.height = canvas.height + labelHeight;

    ctx.fillStyle = background;
    ctx.fillRect(0, 0, labelCanvas.width, labelCanvas.height);

    ctx.drawImage(canvas, leftMargin, 0);

    // Vertical stacked "BY QRVCARD.IO"
    ctx.fillStyle = foreground;
    ctx.font = "bold 18px 'Courier New', monospace";
    ctx.textAlign = "center";

    const label = "BY QRVCARD.IO";
    const startY = (labelCanvas.height - label.length * 18) / 2;
    for (let i = 0; i < label.length; i++) {
      ctx.fillText(label[i], 15, startY + i * 18);
    }

    // Bottom label
    if (labelText) {
      ctx.fillStyle = foreground;
      ctx.font = `16px ${fontFamily}`;
      ctx.textAlign = "center";
      ctx.fillText(labelText, labelCanvas.width / 2, labelCanvas.height - 10);
    }

    function finalize() {
      qrcodeContainer.innerHTML = "";
      qrcodeContainer.appendChild(labelCanvas);

      labelCanvas.style.cursor = "pointer";
      labelCanvas.addEventListener("click", () => {
        window.open("https://qrvcard.io", "_blank");
      });

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
  }, 0); // Allow QR code to render before proceeding
}
