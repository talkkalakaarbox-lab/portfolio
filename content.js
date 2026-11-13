/* =====================================================================
   SHARED SETTINGS. Used by index.html and admin.html.
   The live site shows what you save in the admin panel. The values
   below are the starting content, and the fallback if Firebase is
   unreachable.
   ===================================================================== */

// Firebase web config (safe to be public; access is controlled by Firestore rules)
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyANHt-dlUgN7qA4ouYp3mbK4vDTYFgIk58",
  authDomain: "portfolio-eda21.firebaseapp.com",
  projectId: "portfolio-eda21",
  storageBucket: "portfolio-eda21.firebasestorage.app",
  messagingSenderId: "916296828054",
  appId: "1:916296828054:web:6ce4e24888bf386acdaeb7"
};

// Only this email can use the admin panel (the real lock is the UID in your Firestore rules).
const ADMIN_EMAIL = "dkjoshi.3008@gmail.com";

const SITE = {
  firstName: "Devansh",
  lastName:  "Joshi",
  status:    "Open to internships",
  city:      "Ahmedabad",

  // Hero line. You can use <b>bold</b> here.
  intro: "Full-stack developer and IT engineering student building <b>practical software products</b>, business applications and automation systems — from concept to deployment.",

  email:     "dkjoshi.3008@gmail.com",
  linkedin:  "https://linkedin.com/in/devansh-k-joshi",
  github:    "",
  instagram: "",

  // Resume PDF (generated on the Resume button click from the data on this page).
  cv: {
    title:    "Full-Stack Developer | IT Engineering Student",
    phone:    "+91 92271 07633",          // leave empty to hide the phone on the PDF
    location: "Ahmedabad, Gujarat",
    summary:  "Information Technology engineering student at L.J. Institute of Engineering and Technology, Ahmedabad, with hands-on experience developing web applications, business workflows and automation tools. Works with JavaScript, Python, Java, Firebase, SQLite and API integrations, with an interest in building reliable software that solves practical problems.",
    showBullets:  false,                  // true = also print each project's bullet points
    showLinks:    true,                   // true = print each project's source/preview links
    achievements: []                      // extra lines under Certifications & Achievements
  },

  // Shown only on the resume PDF
  experience: [
    { role: "Freelancer", org: "Web apps, WhatsApp bots and automation for clients", when: "",
      points: ["Built and delivered web applications, WhatsApp bots and automations for local businesses and an international client in Brazil"] },
    { role: "Event Management Team", org: "AWS Student Builder Group, LJIET", when: "", points: [] }
  ],

  // Contact form. Works out of the box with FormSubmit (no account, no domain).
  // OPTIONAL: fill these 4 values to use EmailJS instead. (Code only, not in admin.)
  emailjs: {
    publicKey:       "",
    serviceId:       "",
    notifyTemplate:  "",
    replyTemplate:   ""
  },

  about: {
    big:   "I build software for <em>real-world workflows</em> — from customer-facing applications to internal tools and automation.",
    paras: [
      "I am pursuing a B.E. in Information Technology at L.J. Institute of Engineering and Technology, Ahmedabad, and bring a practical, product-focused approach to software development.",
      "I'm also on the event management team of the AWS Student Builder Group at my college."
    ]
  },

  projects: [
    { title: "Goodslice Pizza", tag: "In production",
      desc: "A complete delivery platform for a pizza business in Palanpur: ordering, kitchen, riders and billing in one system.",
      points: ["Customer, admin and rider apps, plus built-in POS", "Razorpay payments and OTP login", "Rider daily-activation swipe system"],
      stack: "Next.js 14 · Firebase · Razorpay · 2Factor OTP",
      // Optional. Leave empty to hide. previews: one per line "Label | URL", as many as you like.
      source: "", previews: [], challenge: "", contribution: "", solution: "", outcome: "", image: "" },   // Add verified case-study details and image URLs in Admin

    { title: "DiningOS", tag: "Multi-tenant SaaS",
      desc: "QR ordering for restaurants. Guests scan at the table and order; owners manage everything from one dashboard.",
      points: ["Each restaurant isolated by Firestore security rules", "Menus, modifiers and subscription plans", "No framework and no build step"],
      stack: "HTML · CSS · JavaScript · Firebase", challenge: "", contribution: "", solution: "", outcome: "", image: "" },

    { title: "FRC Management System", tag: "Complete · 142 tests",
      desc: "Field equipment returns used to run on forms and email chains. This replaces them with a tracked, step-by-step workflow.",
      points: ["Technicians and vendors act through signed email links, no accounts", "Dynamic form builder, offline drafts, SLA timers", "Audit trail and injection-safe CSV export"],
      stack: "JavaScript · Firebase · Cloud Functions · Node.js", challenge: "", contribution: "", solution: "", outcome: "", image: "" },

    { title: "Automations", tag: "Client work",
      desc: "Workflows that replace repetitive manual work, from spreadsheets to WhatsApp.",
      points: ["Excel VBA automation for a client in Brazil", "WhatsApp bots on n8n with an LLM", "Checks run before the AI step to keep costs low"],
      stack: "Excel VBA · n8n · WhatsApp Cloud API · Firestore", challenge: "", contribution: "", solution: "", outcome: "", image: "" },

    { title: "Smart Examroom Workstation", tag: "IoT",
      desc: "An ESP32-based workstation that sends sensor data to the cloud and shows it live on a web dashboard.",
      points: ["ESP32 with multiple sensors", "Data stored in Firebase", "Built with a teammate under faculty guidance"],
      stack: "ESP32 · Sensors · Firebase · Web dashboard", challenge: "", contribution: "", solution: "", outcome: "", image: "" }
  ],

  skills: [
    { name: "Programming Languages", items: "Java (Intermediate), Python, JavaScript" },
    { name: "Web Development",       items: "HTML5, CSS3 (Intermediate), React.js, Tailwind CSS" },
    { name: "Backend & Databases",   items: "Firebase (Intermediate), SQLite, API Integration" },
    { name: "Tools & Platforms",     items: "Capacitor, Git, GitHub, Visual Studio Code, n8n, Vercel" }
  ],

  education: [
    // detail = optional second line, used on the resume PDF only
    { when: "2025 – 2029", title: "Bachelor of Engineering (B.E.) – Information Technology", place: "L.J. Institute of Engineering and Technology (LJIET), Ahmedabad", note: "In progress",
      detail: "Expected Graduation: August 2029  |  Currently in Semester 3" },
    { when: "2025", title: "Higher Secondary Certificate (Class 12), GSEB", place: "Shree Ram Vidhyalaya Sundaram High School, Palanpur", note: "72%", detail: "" },
    { when: "2023", title: "Secondary School Certificate (Class 10), GSEB", place: "Shree Ram Vidhyalaya Shivam Secondary School, Palanpur", note: "83%", detail: "" }
  ],

  certs: [
    { when: "Jul 2026", title: "Inheritance and Data Structures in Java", place: "University of Pennsylvania", note: "Java", image: "" },
    { when: "Jan 2026", title: "Introduction to Java",                    place: "LearnQuest",                note: "Java", image: "" }
  ]
};
