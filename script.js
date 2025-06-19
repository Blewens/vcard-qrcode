/* Reset & Base Styles */
*,
*::before,
*::after {
  box-sizing: border-box;
}

body {
  background: #111;
  color: #2dd4bf;
  font-family: 'Inter', sans-serif;
  text-align: center;
  margin: 0;
  padding: 0;
}

/* Header */
header {
  padding: 20px;
}

.logo {
  width: 120px;
  margin: 0 auto 10px;
  display: block;
}

h1 {
  margin: 0;
  font-size: 24px;
}

.intro {
  font-size: 16px;
  margin-bottom: 10px;
  color: #ccc;
}

.nav-buttons {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 20px;
}

.navBtn {
  background: #2dd4bf;
  color: #111;
  text-align: center;
  padding: 12px 20px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: bold;
  transition: background 0.3s ease;
  white-space: nowrap;
}

.navBtn:hover {
  background: #26b4a3;
}

/* Main Container */
main {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
}

/* Unified Form Block */
.form-block {
  width: 100%;
}

/* Input, Button, Select */
input,
select,
button,
a.downloadBtn {
  width: 100%;
  margin: 15px 0;
  padding: 12px;
  border-radius: 8px;
  border: none;
  font-size: 16px;
  background: #333;
  color: #fff;
}

/* Color Inputs */
input[type="color"] {
  height: 44px;
  padding: 8px;
}

/* Details Accordion */
details {
  margin: 15px 0;
  background: #222;
  padding: 10px;
  border-radius: 8px;
  width: 100%;
}

details input {
  width: 100%;
  margin: 10px 0;
  background: #333;
  color: #fff;
  padding: 12px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
}

summary {
  cursor: pointer;
  font-weight: bold;
  color: #ddd;
  margin-bottom: 10px;
}

/* Buttons */
#generateBtn {
  background: #000;
  color: #fff;
  font-weight: bold;
  cursor: pointer;
}

.downloadBtn {
  background: #2dd4bf;
  color: #111;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  padding: 12px 20px;
  margin: 10px;
  border-radius: 8px;
  font-weight: bold;
  transition: background 0.3s ease;
}

.downloadBtn:hover {
  background: #26b4a3;
}

#qrLabelPreview {
  text-align: center;
  margin-top: 10px;
  font-size: 1.2em;
}

/* QR Display Area */
.qrcode-preview,
.downloadBtn {
  text-align: center;
}

#qrcode {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px 0;
  width: 100%;
  text-align: center;
}

#qrcode canvas {
  display: block;
  margin: 0 auto;
}

/* Countdown Message */
#countdownMessage {
  font-size: 18px;
  font-weight: bold;
  color: #2dd4bf;
  margin: 10px 0;
  text-align: center;
  animation: pulse 1s ease-in-out infinite alternate;
}

/* Animation for Countdown */
@keyframes pulse {
  from {
    opacity: 1;
  }
  to {
    opacity: 0.6;
  }
}

/* Footer */
footer {
  margin-top: 40px;
  font-size: 14px;
  color: #888;
}

footer a {
  color: #888;
  text-decoration: underline;
}

.footer-ad {
  margin-top: 20px;
}
