/**
 * ==============================================================================
 * GALLERY & TESTIMONIALS DATA - PERFECT COMPUTER EDUCATION
 * ==============================================================================
 */

const GALLERY_DATA = [
  {
    id: 1,
    title: "Air-Conditioned Computer Lab",
    category: "lab",
    categoryLabel: "Computer Lab",
    description: "Modern high-speed computer systems equipped with latest software and individual 1:1 workstations.",
    image: "images/gallery/gallery-lab-1.svg"
  },
  {
    id: 2,
    title: "Interactive Classroom Session",
    category: "classroom",
    categoryLabel: "Classroom",
    description: "Smart digital projector and white-board training for clear conceptual understanding.",
    image: "images/gallery/gallery-class-1.svg"
  },
  {
    id: 3,
    title: "Practical Tally & Accounting Lab",
    category: "lab",
    categoryLabel: "Computer Lab",
    description: "Students solving live GST billing cases and balance sheet reconciliations under trainer guidance.",
    image: "images/gallery/gallery-lab-2.svg"
  },
  {
    id: 4,
    title: "Certificate Distribution Day",
    category: "certificates",
    categoryLabel: "Certificates",
    description: "Proud batch graduates receiving their course completion certificates.",
    image: "images/gallery/gallery-cert-1.svg"
  },
  {
    id: 5,
    title: "Graphic Design Creative Workshop",
    category: "activities",
    categoryLabel: "Workshops & Activities",
    description: "Students designing creative social media posters and vector logos in Photoshop & CorelDRAW.",
    image: "images/gallery/gallery-design-1.svg"
  },
  {
    id: 6,
    title: "High-Speed Typing Practice Center",
    category: "lab",
    categoryLabel: "Computer Lab",
    description: "Specialized speed tests and accuracy drills for government exam aspirants.",
    image: "images/gallery/gallery-typing-1.svg"
  },
  {
    id: 7,
    title: "Individual 1:1 Doubt Solving Session",
    category: "classroom",
    categoryLabel: "Classroom",
    description: "Trainers providing step-by-step assistance to ensure no student is left behind.",
    image: "images/gallery/gallery-doubt-1.svg"
  },
  {
    id: 8,
    title: "Student Project Presentation Day",
    category: "activities",
    categoryLabel: "Workshops & Activities",
    description: "Students presenting real-world website and Excel dashboard projects.",
    image: "images/gallery/gallery-presentation-1.svg"
  }
];

const TESTIMONIALS_DATA = [
  {
    id: 1,
    name: "Rahul Sharma",
    course: "Tally Prime with GST",
    rating: 5,
    avatar: "images/avatars/avatar-1.svg",
    review: "The practical GST billing training at Perfect Computer Education gave me huge confidence. The trainer explained every entry and ledger step by step. I got a job as an Accounts Assistant within 2 weeks of completing my course!",
    badge: "Verified Student"
  },
  {
    id: 2,
    name: "Priya Patel",
    course: "Advanced Excel & MIS",
    rating: 5,
    avatar: "images/avatars/avatar-2.svg",
    review: "I joined to learn VLOOKUP, XLOOKUP and Pivot Dashboards. The trainers are extremely patient and provide individual attention. The practice sheets were based on real corporate data. Highly recommended for working professionals!",
    badge: "Verified Student"
  },
  {
    id: 3,
    name: "Amit Solanki",
    course: "Graphic Design & Photoshop",
    rating: 5,
    avatar: "images/avatars/avatar-3.svg",
    review: "From zero Photoshop experience to designing logos, social media banners, and flyers for real clients. The 1:1 computer lab practice and portfolio reviews were top-notch. Thank you Perfect Computer Education!",
    badge: "Verified Student"
  },
  {
    id: 4,
    name: "Neha Joshi",
    course: "Basic Computer & MS Office",
    rating: 5,
    avatar: "images/avatars/avatar-4.svg",
    review: "As a beginner, I was nervous about operating a computer. But the teachers here are so friendly and encourage you every day. Now I can comfortably work on Word, Excel, and browse the internet for all my daily work.",
    badge: "Verified Student"
  },
  {
    id: 5,
    name: "Bhavik Parmar",
    course: "Computer Typing (English & Gujarati)",
    rating: 5,
    avatar: "images/avatars/avatar-5.svg",
    review: "Joined to prepare for state government clerk typing exam. The daily speed drills and accuracy checks improved my speed from 18 WPM to 42 WPM in just 45 days. The environment is disciplined and focused.",
    badge: "Verified Student"
  },
  {
    id: 6,
    name: "Sneha Dave",
    course: "DCA (Diploma in Computer Applications)",
    rating: 5,
    avatar: "images/avatars/avatar-6.svg",
    review: "The DCA course covered everything from hardware basics to Excel, Tally and Web Design. The certificate helped me enhance my resume, and the flexible batch timings suited my college schedule perfectly.",
    badge: "Verified Student"
  }
];

if (typeof window !== "undefined") {
  window.GALLERY_DATA = GALLERY_DATA;
  window.TESTIMONIALS_DATA = TESTIMONIALS_DATA;
}
