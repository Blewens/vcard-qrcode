<script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>
<script>
  document.getElementById("generateBtn").addEventListener("click", () => {
    const name = document.getElementById("name").value.trim();
    const org = document.getElementById("org").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const email = document.getElementById("email").value.trim();
    const title = document.getElementById("title").value.trim();
    const website = document.getElementById("website").value.trim();
    const address = document.getElementById("address").value.trim();
    const dob = document.getElementById("dob").value.trim();
    const linkedin = document.getElementById("linkedin").value.trim();
    const twitter = document.getElementById("twitter").value.trim();
    const facebook = document.getElementById("facebook").value.trim();
    const instagram = document.getElementById("instagram").value.trim();

    if (!name || !email) {
      alert("Please fill in at least Name and Email.");
      return;
    }

    const vCard = `
BEGIN:VCARD
VERSION:3.0
FN:${name}
ORG:${org}
TITLE:${title}
TEL:${phone}
EMAIL:${email}
URL:${website}
ADR:${address}
BDAY:${dob}
X-LINKEDIN:${linkedin}
X-TWITTER:${twitter}
X-FACEBOOK:${facebook}
X-INSTAGRAM:${instagram}
END:VCARD`.trim();

    // Create vCard blob
    const blob = new Blob([vCard], { type: "text/vcard" });
    const vCardURL = URL.createObjectURL(blob);
    const today = new Date().toISOString().split("T")[0];
    const safeName = name.replace(/\s+/g, "_");
    const safeOrg = org.replace(/\s+/g, "_");
    const filename = `vcard_${safeName}_${safeOrg}_${today}`;

    // Show and activate vCard download
    const downloadVCF = document.getElementById("downloadVCF");
    downloadVCF.style.display = "block";
    downloadVCF.onclick = () => {
      const a = document.createElement("a");
      a.href = vCardURL;
      a.download = `${filename}.vcf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    };

    // Generate QR code
    const qrSize = parseInt(document.getElementById("qrSize").value);
    const fgColor = document.getElementById("fgColor").value;
    const bgColor = document.getElementById("bgColor").value;

    const qrContainer = document.getElementById("qrcode");
    qrContainer.innerHTML = "";

    const qrCode = new QRCode(qrContainer, {
      text: vCard,
      width: qrSize,
      height: qrSize,
      colorDark: fgColor,
      colorLight: bgColor,
      correctLevel: QRCode.CorrectLevel.H,
    });

    // Download QR button
    const downloadQR = document.getElementById("downloadQR");
    downloadQR.style.display = "block";
    downloadQR.onclick = () => {
      setTimeout(() => {
        const canvas = qrContainer.querySelector("canvas");
        const image = canvas.toDataURL("image/png");
        const a = document.createElement("a");
        a.href = image;
        a.download = `${filename}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }, 500);
    };
  });
</script>
