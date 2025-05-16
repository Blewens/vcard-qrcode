document.getElementById("generateBtn").addEventListener("click", () => {
  const name = document.getElementById("fullName").value.trim();
  const org = document.getElementById("organization").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const email = document.getElementById("email").value.trim();

  if (!name || !email) {
    alert("Full Name and Email are required.");
    return;
  }

  const fields = {
    website: "URL",
    jobTitle: "TITLE",
    birthday: "BDAY",
    address: "ADR",
    linkedin: "URL",
    twitter: "URL",
    facebook: "URL",
    instagram: "URL"
  };

  let vcard = `BEGIN:VCARD\nVERSION:3.0\nN:${name}\nORG:${org}\nTEL:${phone}\nEMAIL:${email}\n`;

  for (let id in fields) {
    const val = document.getElementById(id)?.value.trim();
    if (val) {
      vcard += `${fields[id]}:${val}\n`;
    }
  }

  vcard += `END:VCARD`;

  const qrContainer = document.getElementById("qrcode");
  qrContainer.innerHTML = "";

  const fgColor = document.getElementById("fgColor").value;
  const bgColor = document.getElementById("bgColor").value;

  new QRCode(qrContainer, {
    text: vcard,
    width: 256,
    height: 256,
    colorDark: fgColor,
    colorLight: bgColor,
    correctLevel: QRCode.CorrectLevel.H
  });

  // Generate file name
  const now = new Date();
  const filenameBase = `${name.replace(/\s+/g, '_')}_${org.replace(/\s+/g, '_')}_${now.toISOString().slice(0,10)}`;

  // Prepare vCard file
  const blob = new Blob([vcard], { type: "text/vcard" });
  const vcfUrl = URL.createObjectURL(blob);
  const vcfLink = document.getElementById("downloadVCF");
  vcfLink.href = vcfUrl;
  vcfLink.download = `${filenameBase}.vcf`;
  vcfLink.style.display = "block";

  // Prepare QR code image
  setTimeout(() => {
    const canvas = qrContainer.querySelector("canvas");
    if (canvas) {
      const qrLink = document.getElementById("downloadQR");
      qrLink.href = canvas.toDataURL("image/png");
      qrLink.download = `${filenameBase}.png`;
      qrLink.style.display = "block";
    }
  }, 300);
});
