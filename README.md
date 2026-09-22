# Pinnacle Tech — Modern Static Subscription Website

A premium, high-converting static website built for **Pinnacle Tech** using HTML5, CSS3, Bootstrap 5, and Vanilla JavaScript. Designed specifically to drive traffic from Instagram advertisements into recurring monthly subscriptions managed via **WHMCS**.

---

## 📁 File Structure

```text
pinnacle-tech/
│
├── index.html          # Homepage (Hero, Pricing, Benefits, How It Works, FAQ)
├── pricing.html        # Detailed Pricing & Plan Comparison Matrix
├── about.html          # About Pinnacle Tech, Mission & Values
├── how-it-works.html    # 4-Step Onboarding Process
├── faq.html            # Searchable FAQ Accordion
├── contact.html        # Contact Info & Formspree/Web3Forms Contact Form
├── privacy.html        # Privacy Policy Template
├── terms.html          # Terms of Service Template
├── robots.txt          # Search Engine Crawler Directives
├── sitemap.xml         # XML Sitemap for SEO
│
├── css/
│   └── style.css       # Custom CSS Stylesheet extending Bootstrap 5
│
├── js/
│   └── main.js         # WHMCS URL Redirect Config, Tracking & UI Logic
│
└── images/
    ├── logo.svg         # Clean Vector Brand Treatment
    ├── favicon.svg      # Favicon Icon
    └── hero-graphic.svg # High-Tech Website Management Dashboard Visual
```

---

## 🚀 1. How to Upload the Website to cPanel

This is a **pure static website** (HTML, CSS, JS, SVG assets). **No build tools or Node.js runtime are required** on your web server.

1. Compress all files in the project root into a `.zip` archive.
2. Log into your **cPanel Account**.
3. Open **File Manager** and navigate to your web root directory (usually `public_html/`).
4. Click **Upload** and upload your `.zip` file.
5. Right-click the uploaded `.zip` file and select **Extract**.
6. Ensure `index.html` is located directly in `public_html/index.html`.
7. Your website is now live!

---

## 🔗 2. Where to Add Your WHMCS Order URLs

All "Get Started" and "Choose Plan" CTA buttons throughout the site use the centralized configuration in `js/main.js`.

1. Open `js/main.js` in any code editor.
2. Locate the `WHMCS_URLS` object at the top of the file:

```javascript
const WHMCS_URLS = {
  basic: "https://whmcs.pinnacle-tech.com/cart.php?a=add&pid=1",
  advanced: "https://whmcs.pinnacle-tech.com/cart.php?a=add&pid=2",
  pro: "https://whmcs.pinnacle-tech.com/cart.php?a=add&pid=3",
  default: "https://whmcs.pinnacle-tech.com/cart.php"
};
```

3. Replace the placeholder strings with your actual WHMCS checkout cart URLs.
4. Save `js/main.js`. Every button on all pages will automatically use the updated URLs!

> **Note:** If a WHMCS URL is not yet configured, clicking a plan button displays a friendly notice modal rather than navigating to a broken link.

---

## 💵 3. Where to Change Package Pricing ($40 / $60 / $80)

To adjust monthly prices or package names:

1. Open `index.html` and `pricing.html`.
2. Locate the pricing cards section:
   - **BASIC Plan:** Search for `$40` and update the price or feature list.
   - **ADVANCED Plan:** Search for `$60` and update the price or feature list.
   - **PRO Plan:** Search for `$80` and update the price or feature list.
3. Update the corresponding text in `comparison-table` and `faq.html`.

---

## 📊 4. Where to Add Google Analytics & Meta Pixel IDs

1. Open any HTML file (e.g., `index.html`, `pricing.html`).
2. Search for `YOUR_GOOGLE_ANALYTICS_ID` in the `<head>` section and uncomment the script tag:

```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

3. Search for `YOUR_META_PIXEL_ID` in the `<head>` section and uncomment the Meta Pixel block.
4. Also update `TRACKING_CONFIG` in `js/main.js`.

---

## 🎨 5. How to Replace Logo & Images

- **Brand Logo:** Replace `images/logo.svg` with your own SVG or PNG image file. To update logo size or styling, edit `.navbar-brand-img` in `css/style.css`.
- **Favicon:** Replace `images/favicon.svg`.
- **Hero Graphic:** Replace `images/hero-graphic.svg` with your custom banner or dashboard screenshot.

---

## ✉️ 6. Configuring the Contact Form

`contact.html` contains a clean frontend contact form ready for any third-party form service (such as [Formspree](https://formspree.io) or [Web3Forms](https://web3forms.com)):

1. Open `contact.html`.
2. Replace `https://formspree.io/f/YOUR_FORMSPREE_ID` in the `<form action="...">` attribute with your form endpoint URL.

---

## ⚙️ Summary of Technologies Used

- **HTML5 & CSS3** (Semantic structure & custom styling)
- **Bootstrap 5.3.3** (Responsive layout & accordion UI)
- **Bootstrap Icons 1.11.3** (Vector interface icons)
- **Vanilla JavaScript** (Zero framework dependencies, cPanel ready)
