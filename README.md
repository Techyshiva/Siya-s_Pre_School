# Siya's Pre-school — Static Website

A complete responsive 5-page website built with **HTML5, CSS3, vanilla JavaScript and Bootstrap 5**.

## 📂 Folder structure
```
siya-preschool-site/
├── index.html         # Home page
├── about.html         # About Us
├── programs.html      # Programs & Facilities
├── admissions.html    # Admissions (with form & FAQ)
├── contact.html       # Contact Us (with map & form)
├── css/
│   └── style.css      # Global stylesheet (design system)
├── js/
│   └── main.js        # Site interactions
└── assets/            # Images & logo
```

## 🚀 Deployment
This is a 100% static site — drop the entire folder onto any static host:

- **Netlify** — drag-and-drop the folder at https://app.netlify.com/drop
- **Vercel** — `vercel deploy` from the folder
- **GitHub Pages** — push to a repo and enable Pages
- **Any traditional web host** — upload via FTP

No build step required.

## ✏️ Customisation

### Forms (Formspree)
The Inquiry and Contact forms use a placeholder action URL:
```html
<form action="https://formspree.io/f/YOUR_FORM_ID" method="POST" ...>
```
1. Sign up free at https://formspree.io
2. Create a new form, copy your form ID
3. Replace `YOUR_FORM_ID` in `admissions.html` and `contact.html`

### Design tokens
All colors, shadows, radii and spacing are defined as CSS variables at the top of `css/style.css`:
```css
:root {
  --navy: #0e2148;
  --gold: #f5b301;
  --cream: #fdfaf2;
  /* ... */
}
```

### Map
The Contact page embeds a Google Maps iframe centered on Ashti.
Replace the `src` URL with the embed URL of your exact campus location.

### Images
All images live in `/assets/`. Replace them with your own (keep the same filenames or update the references).

## 🎨 Design language
- **Primary**: Deep Navy `#0e2148`
- **Accent**: Warm Gold `#f5b301`
- **Surfaces**: Cream `#fdfaf2`, Light Grey `#f4f6fa`
- **Fonts**: Fredoka (display) + Nunito (body) — loaded from Google Fonts
- **Icons**: Bootstrap Icons (CDN)

Built with ❤️ for little learners.
