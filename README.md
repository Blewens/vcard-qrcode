![QRvCard.io Preview](assets/screenshot.png)

# QRvCard.io — QR vCard Generator

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![Privacy-First](https://img.shields.io/badge/Privacy-Client--side%20only-2bb673.svg)](#-privacy-first)
[![Cookie Consent](https://img.shields.io/badge/Consent-Opt--in%20analytics%2Fads-8a63d2.svg)](#-consent--cookies)
[![Built with JS](https://img.shields.io/badge/Built%20with-HTML%20%7C%20CSS%20%7C%20JS-000000.svg)](#-technologies)

Create and download a **digital business card as a QR code** — fast, simple, and privacy-first.  
Everything happens securely **in your browser**; no contact details are stored or shared.

---

## 🔐 Privacy First

QRvCard uses a strict **client-side only** model.  
Your details are processed locally in your browser, not sent to any server.

We **don’t store, sell, or share** your contact information.  
Optional tools (like analytics or ads) only run **after you give consent** via the on-site cookie banner.

**Responsible monetisation** — minimal, transparent, and privacy-respecting.

---

## 📂 Pages Included

- `index.html` – Home and introduction  
- `how-to.html` – Step-by-step usage guide  
- `generate.html` – The main QR vCard generator tool  
- `privacy.html` – Privacy Policy & Terms of Use  
- `contact.html` – Contact and feedback form  

---

## 🚀 Usage

1. Go to [generate.html](./generate.html)  
2. Enter your details (minimum: Full Name & Email)  
3. Customise your QR code (colors, logo, label)  
4. Click **Generate**  
5. Download your ZIP (includes QR image and vCard file)

---

## 🍪 Consent & Cookies

QRvCard includes a lightweight consent bar that:
- Appears on first visit  
- Lets users choose whether to enable **analytics** and/or **ads**  
- Only then “releases” any held third-party scripts  
- Remembers preferences locally (no server storage)

After AdSense approval, enable Google’s **Privacy & Messaging (CMP)** and place their snippet in the `ads` placeholder; EU/UK/CH visitors will see a certified consent prompt.

You can reset your choice anytime via **Cookie settings** in the footer.

---

## 🧱 Technologies

- **HTML / CSS / JavaScript** (no framework)  
- **QRCode.js** – Generate QR codes  
- **JSZip** – Bundle QR + vCard files for download  
- **Formspree** – Optional contact form handler

---

## 🖼️ Screenshot

The preview image at the top is `assets/screenshot.png`.  
If you update the UI, replace that file to refresh the README thumbnail.

---

## 📄 License

MIT License — free to reuse or remix with attribution.  
© 2025 [QRvCard.io](https://qrvcard.io)