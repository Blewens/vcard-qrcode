document.addEventListener("DOMContentLoaded", function () {
  const fields = {
    fullName: document.getElementById("fullName"),
    phone: document.getElementById("phone"),
    email: document.getElementById("email"),
    jobTitle: document.getElementById("jobTitle"),
    organization: document.getElementById("organization"),
    website: document.getElementById("website"),
    linkedin: document.getElementById("linkedin"),
    twitter: document.getElementById("twitter"),
    facebook: document.getElementById("facebook"),
    instagram: document.getElementById("instagram"),
    bluesky: document.getElementById("bluesky"), // ✅ already added by you
  };

  const generateBtn = document.getElementById("generateBtn");
  const countdownMsg = document.getElementById("countdownMessage");
  const downloadZipBtn = document.getElementById("downloadZip");

  let zipBlob = null;
  let zipFilename = "QRvCard.zip";

  function getFieldValue(field) {
    if (!field || field.offsetParent === null) return "";
    return field.value.trim().replace(/\r?\n|\r/g, " ").replace(/,/g, "\\,").replace(/;/g, "\\;");
  }

  function normalizeFields() {
    for (const key in fields) {
      const field = fields[key];
      if (field) {
        const clean = field.value.trim();
        field.value = "";
        field.offsetHeight; // Force reflow
        field.value = clean;
        field.dispatchEvent(new Event("input", { bubbles: true }));
        field.dispatchEvent(new Event("change", { bubbles: true }));
      }
    }
  }

  function generateVCard() {
    const fullName = getFieldValue(fields.fullName);
    const email = getFieldValue(fields.email);
    const phone = getFieldValue(fields.phone);
    const jobTitle = getFieldValue(fields.jobTitle);
    const organization = getFieldValue(fields.organization);
    const website = getFieldValue(fields.website);
    const linkedin = getFieldValue(fields.linkedin);
    const twitter = getFieldValue(fields.twitter);
    const facebook = getFieldValue(fields.facebook);
    const instagram = getFieldValue(fields.instagram);
    const bluesky = getFieldValue(fields.bluesky); // ✅ new line

    let vcard = `BEGIN:VCARD
VERSION:3.0
FN:${fullName}
EMAIL:${email}`;
    if (phone) vcard += `\nTEL:${phone}`;
    if (organization) vcard += `\nORG:${organization}`;
    if (jobTitle) vcard += `\nTITLE:${jobTitle}`;
    if (website) vcard += `\nURL:${website}`;
    if (linkedin) vcard += `\nitem1.URL:${linkedin}`;
    if (twitter) vcard += `\nitem2.URL:${twitter}`;
    if (facebook) vcard += `\nitem3.URL:${facebook}`;
    if (instagram) vcard += `\nitem4.URL:${instagram}`;
    if (bluesky) vcard += `\nitem5.URL:${bluesky}`; // ✅ appended
    vcard += `\nNOTE:Connections made easy by https://QRvCard.io
END:VCARD`;
    return vcard;
  }

  // The rest of your code remains unchanged...
  // proceedToGenerate, finalize, and other event handlers follow without modifications.

  generateBtn.addEventListener("click", function () {
    normalizeFields();
    downloadZipBtn.style.display = "none";

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

    setTimeout(() => {
      if (countdownMsg.textContent.includes("Generating your QR code")) {
        countdownMsg.textContent = "Sorry! Something went wrong. Please try again.";
        generateBtn.disabled = false;
      }
    }, 7000);
  });

  downloadZipBtn.addEventListener("click", function () {
    if (zipBlob && zipFilename) {
      const zipLink = document.createElement("a");
      zipLink.href = URL.createObjectURL(zipBlob);
      zipLink.download = zipFilename;
      document.body.appendChild(zipLink);
      zipLink.click();
      document.body.removeChild(zipLink);
    }
  });

  function proceedToGenerate() {
    // ... no change needed in this function
    // See your original logic — everything here remains compatible
  }

  function finalize(canvas, vCardData) {
    // ... also unchanged
  }

  window.addEventListener("load", normalizeFields);
});
