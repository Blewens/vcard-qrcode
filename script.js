document.getElementById("vcard-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const phone = document.getElementById("phone").value;
  const email = document.getElementById("email").value;
  const fgColor = document.getElementById("fgColor").value;
  const bgColor = document.getElementById("bgColor").value;
  const qrSize = parseInt(document.getElementById("qrSize").value);
  const logoInput = document.getElementById("logo");

  const vCardData = `BEGIN:VCARD
VERSION:3.0
FN:${name}
TEL:${phone}
EMAIL:${email}
END:VCARD`;

  const blob = new Blob([vCardData], { type: "text/vcard" });
  const url = URL.createObjectURL(blob);
  document.getElementById("download-link").href = url;

  const canvas = document.getElementById("qrcode");
  QRCode.toCanvas(canvas, vCardData, {
    width: qrSize,
    color: {
      dark: fgColor,
      light: bgColor
    }
  }, function (error) {
    if (error) console.error(error);
    else {
      if (logoInput.files && logoInput.files[0]) {
        const ctx = canvas.getContext("2d");
        const img = new Image();
        img.onload = function () {
          const logoSize = qrSize * 0.2;
          const x = (canvas.width - logoSize) / 2;
          const y = (canvas.height - logoSize) / 2;
          ctx.drawImage(img, x, y, logoSize, logoSize);
        };
        img.src = URL.createObjectURL(logoInput.files[0]);
      }
    }
  });
});
