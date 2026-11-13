PORTFOLIO OS — SETUP & DEPLOYMENT

FILES (keep all in one folder)
  index.html       Public portfolio website
  admin.html       Authenticated content editor (open /admin.html)
  content.js       Default content, Firebase web config and admin email
  resume.js        Browser-side ATS-friendly PDF generator
  firestore.rules  Firestore access-control rules

FIREBASE SETUP
  1. In Firebase Authentication, enable Email/Password sign-in.
  2. Create the administrator account using the email configured as ADMIN_EMAIL in content.js.
  3. In Firestore Database > Rules, publish the contents of firestore.rules.
  4. Confirm that the UID in firestore.rules belongs to the intended administrator account.
  5. Firebase Storage is not required for resume generation or portfolio content. Certificate photos are compressed in the browser and stored as Base64 in the existing Firestore content document.

SECURITY NOTES
  - The Firebase web API key is a public client configuration value, not an admin secret.
  - Firestore rules are the actual write-access boundary. Keep the UID rule restricted to the intended administrator.
  - The email check in the admin UI is an additional user-experience check; it does not replace Firestore rules.
  - If the admin cannot load the saved Firestore document, Save is disabled to prevent defaults from overwriting live content.
  - The public site sanitizes the small supported inline-markup subset (bold, italic and line breaks) before rendering editable text.
  - Contact-form throttling in the browser is best-effort only. FormSubmit's CAPTCHA is left enabled; use a server-side endpoint and server-side rate limiting if stronger abuse protection is required.
  - Only publish contact details you are comfortable making public. The phone number configured for the resume is included in a visitor-generated PDF.

GO LIVE
  Deploy this folder to a static host such as Netlify, Vercel or GitHub Pages.
  The admin page requires HTTPS or localhost; it will not work reliably from a file:// URL.

FIRST USE
  1. Open https://your-domain.example/admin.html and sign in.
  2. Review the loaded content before saving. If no Firestore document exists yet, the first save asks for confirmation.
  3. Add verified project case-study details in the optional Challenge, Contribution, Approach and Outcome fields.
  4. Add project screenshots using publicly accessible HTTPS image URLs. No placeholder screenshots or fabricated links are included by default.
  5. Add your real GitHub and other profile URLs in the Links section; empty links remain hidden.
  6. Use Preview PDF to inspect the resume before publishing changes.
  7. Test the contact form on the deployed site and complete any FormSubmit activation step sent to the configured email address.

CONTENT GUIDANCE
  - Use accurate dates, individual contributions and measurable outcomes only when verified.
  - Do not enter private client data or credentials in project case studies.
  - Resume PDFs are generated on the visitor's device when they click Resume; no PDF is uploaded to Firebase Storage.
  - Certificate photos are resized and compressed to JPEG in the admin browser, then stored as Base64 data URLs in the `certs` array in Firestore. Each photo is limited to about 110 KiB and all certificate image data together is limited to 430,000 characters to leave headroom under Firestore's 1 MiB document limit.
  - Certificate photos are optional. Upload them in Admin > Certifications; remove a photo with its Remove photo button. Click Save changes to publish. Images are displayed beside the relevant certificate on the public portfolio.

RESUME PROJECT LINKS
- When a project has a Source code link configured in the Admin panel, the generated resume displays a clickable "Link to Source Code" label instead of exposing the domain.
- Preview links retain their configured label and visible URL format.
