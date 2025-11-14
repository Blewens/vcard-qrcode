![QRvCard.io Preview](screenshot.png)

# QRvCard.io — Privacy-First QR vCard Generator

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![Privacy-First](https://img.shields.io/badge/Privacy-Client--side%20only-2bb673.svg)](#-privacy-first)
[![Cookie Consent](https://img.shields.io/badge/Consent-Opt--in%20analytics%2Fads-8a63d2.svg)](#-consent--cookies)
[![Built with JS](https://img.shields.io/badge/Built%20with-HTML%20%7C%20CSS%20%7C%20JS-000000.svg)](#-technologies)

QRvCard.io lets you **generate and download a digital business card as a QR code** — fast, simple, and privacy-first.  
All contact details are processed **locally in your browser**, never uploaded or stored.

---

## 🔐 Privacy First

QRvCard.io is built on a clear principle: **your contact details belong to you**.

- 100% **client-side processing**  
- **No accounts or sign-ups**  
- **No server-side storage**  
- **No tracking by default**  
- Optional analytics/ads load **only after explicit consent**

Your vCard is generated directly inside your device’s browser and never sent anywhere.

---

## 📄 Pages Included

QRvCard.io is a static, self-contained website consisting of:

- `index.html` — Homepage & introduction  
- `about.html` — Mission, how it works, roadmap  
- `how-to.html` — Step-by-step guide  
- `generate.html` — Interactive QR vCard generator  
- `privacy.html` — Privacy Policy & Terms  
- `contact.html` — Contact & feedback form  
- `ads.txt` — Required for authorised ads (if enabled)  
- `sitemap.xml` — Search engine indexing  
- `robots.txt` — Crawl rules  

---

## 🚀 Usage

1. Open **generate.html**  
2. Enter your details  
   - *Full Name* and *Email* are required  
   - All other fields are optional  
3. Customise your QR code  
   - Colour options  
   - Logo upload  
   - Optional label text  
4. Click **Generate QR vCard**  
5. Download the ZIP file containing:
   - `QRCode.png` — your QR image  
   - `Contact.vcf` — your vCard contact file  

All generation is done locally. Nothing is sent to any server.

---

## 🍪 Consent & Cookies

QRvCard.io includes a lightweight, privacy-respecting consent system:

- Shown on first visit  
- Allows enabling **analytics** and/or **ads**  
- Keeps third-party scripts blocked until consent is provided  
- Stores preferences using localStorage  

When Google AdSense is approved, you can replace the banner with Google’s **Privacy & Messaging (CMP)**.  
EU/UK/CH visitors will automatically see a certified consent prompt.

Users can reset their choices anytime via **Cookie settings** in the footer.

---

## 🧱 Technologies

QRvCard.io is built without frameworks using small, reliable libraries:

- **HTML5 / CSS3 / Vanilla JavaScript**  
- **QRCode.js** — QR code generation  
- **JSZip** — Bundles contact + QR into a zip  
- **Formspree** — Handles the contact form  
- **LocalStorage** — Saves consent preferences  

All processing happens client-side.

---

## 📁 Project Structure

/
├── index.html
├── about.html
├── how-to.html
├── generate.html
├── privacy.html
├── contact.html
├── style.css
├── script.js
├── favicon-32x32.png
├── favicon-16x16.png
├── apple-touch-icon.png
├── site.webmanifest
├── ads.txt
├── robots.txt
├── sitemap.xml
└── screenshot.jpg

---

## 🖼️ Screenshot

`screenshot.jpg` is displayed at the top of this README.  
Update it whenever the UI changes to keep this page current.

---

## 📄 License

This project is open-source under the **MIT License**.  
You’re free to use, adapt, or remix it with attribution.

© 2025 [QRvCard.io](https://qrvcard.io)

---

QRvCard.io is built to make contact sharing simple, fast, and truly private — without compromises.

