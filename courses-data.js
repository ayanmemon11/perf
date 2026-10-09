/**
 * ==============================================================================
 * COURSES CATALOG DATA - PERFECT COMPUTER EDUCATION
 * Official 6 Core Courses with Full Practical Syllabus
 * ==============================================================================
 */

const COURSES_DATA = [
  {
    id: "ccc",
    name: "CCC",
    title: "CCC",
    fullName: "Course on Computer Concepts",
    category: "Basic & Office",
    categoryLabel: "Office & Concepts",
    badge: "Govt. Recognized Concept",
    duration: "3 Months",
    fees: 3500,
    eligibility: "Open to all (Students, Job Seekers, Govt. Exam Aspirants)",
    shortDesc: "Essential foundation course covering computer fundamentals, Windows OS, MS Word, Excel, PowerPoint, internet services, and digital financial literacy.",
    features: [
      "Introduction to Computers & Windows OS",
      "MS Word: Letter Typing, Formatting & Tables",
      "MS Excel: Formulas, Charts & Data Entry",
      "MS PowerPoint: Presentations",
      "Internet, Email, Cyber Security & Digital Banking"
    ],
    fullSyllabus: [
      {
        module: "Module 1: Computer Fundamentals & OS",
        topics: [
          "Introduction to Computers, Hardware, CPU, Memory & Storage",
          "Windows Operating System navigation, File Explorer, Folders",
          "Control Panel settings, shortcuts, and peripheral devices"
        ]
      },
      {
        module: "Module 2: Word Processing & Spreadsheets",
        topics: [
          "MS Word: Formatting, Styles, Page Setup, Printing, Tables",
          "MS Excel: Worksheets, Cell Referencing, SUM/AVERAGE/IF formulas",
          "Data Sorting, Filtering, and Chart Creation"
        ]
      },
      {
        module: "Module 3: Presentations & Internet Skills",
        topics: [
          "MS PowerPoint: Slide layouts, SmartArt, animations, transitions",
          "Web Browsers, Search Engines, Email Creation & Drive Sharing",
          "Online banking, UPI, Utility bill payments, cyber safety guidelines"
        ]
      }
    ],
    careerOpportunities: [
      "Office Assistant / Junior Clerk",
      "Data Entry Operator",
      "Front Desk Executive",
      "Computer Operator"
    ],
    status: "Active"
  },
  {
    id: "tally-prime",
    name: "TALLY PRIME",
    title: "TALLY PRIME",
    fullName: "Tally Prime Professional Accounting",
    category: "Accounting",
    categoryLabel: "Accounting",
    badge: "Core Accounting",
    duration: "2 Months",
    fees: 4500,
    eligibility: "10th / 12th Pass or Any Graduate",
    shortDesc: "Hands-on computerized accounting training with Tally Prime, covering company setup, ledger groups, vouchers, inventory management, and financial reporting.",
    features: [
      "Accounting Principles & Golden Rules",
      "Company Creation & Group Configuration",
      "Day-to-Day Voucher Entries (Payment, Receipt, Contra, Journal)",
      "Inventory Management & Stock Items",
      "Trial Balance, Profit & Loss, Balance Sheet"
    ],
    fullSyllabus: [
      {
        module: "Module 1: Accounting Foundations & Setup",
        topics: [
          "Manual Accounting rules, Debit and Credit mechanics",
          "Company Creation, Grouping of Ledgers & Chart of Accounts",
          "Voucher entry workflows (Payment, Receipt, Contra, Journal)"
        ]
      },
      {
        module: "Module 2: Inventory & Stock Keeping",
        topics: [
          "Stock Groups, Units of Measure, Godown / Warehouse setup",
          "Purchase & Sales Orders, Invoicing, Stock valuation reports"
        ]
      },
      {
        module: "Module 3: Bank Reconciliation & Final Reports",
        topics: [
          "Bank Reconciliation Statement (BRS)",
          "Generating Trial Balance, Profit & Loss Statement, Balance Sheet",
          "Practical accounting case studies"
        ]
      }
    ],
    careerOpportunities: [
      "Junior Accountant",
      "Accounts Executive",
      "Billing Assistant",
      "Inventory Manager"
    ],
    status: "Active"
  },
  {
    id: "tally-with-gst",
    name: "TALLY WITH GST",
    title: "TALLY WITH GST",
    fullName: "Tally Prime with Practical GST",
    category: "Accounting",
    categoryLabel: "Accounting & GST",
    badge: "100% Practical GST",
    duration: "3 Months",
    fees: 6000,
    eligibility: "Commerce / Non-Commerce Students & Accountants",
    shortDesc: "Comprehensive practical GST training in Tally Prime covering CGST, SGST, IGST invoicing, HSN codes, tax computation, E-Way Bill generation, and GST returns preparation.",
    features: [
      "GST Concepts & Tax Rates Framework",
      "GST Setup in Tally Prime (Intra & Inter-State)",
      "GST Tax Invoices, Debit/Credit Notes",
      "HSN / SAC Code Mapping & Purchase Entries",
      "GSTR-1, GSTR-3B Computation & Tax Liability"
    ],
    fullSyllabus: [
      {
        module: "Module 1: GST Concepts & Software Configuration",
        topics: [
          "Overview of GST Law, CGST, SGST, IGST calculation",
          "Enabling GST in Tally Prime & Setting Up Company Tax Details",
          "Ledger creation with Tax Classifications and HSN/SAC codes"
        ]
      },
      {
        module: "Module 2: Invoicing & Returns Processing",
        topics: [
          "Creating GST Compliant Sales and Purchase Invoices",
          "Recording Debit Notes, Credit Notes, and Expense Vouchers",
          "E-Way Bill and E-Invoicing portal workflows"
        ]
      },
      {
        module: "Module 3: GST Returns & Reconciliation",
        topics: [
          "GSTR-1 (Outward Supplies) generation & error correction",
          "GSTR-3B monthly summary return calculation",
          "Input Tax Credit (ITC) reconciliation and tax payment challans"
        ]
      }
    ],
    careerOpportunities: [
      "Tally Accountant",
      "GST Billing Executive",
      "Taxation Assistant",
      "Audit Assistant"
    ],
    status: "Active"
  },
  {
    id: "full-accounting-course",
    name: "FULL ACCOUNTING COURSE",
    title: "FULL ACCOUNTING COURSE",
    fullName: "Master Diploma in Practical Business Accounting",
    category: "Accounting",
    categoryLabel: "Complete Accounting",
    badge: "Master Program",
    duration: "6 Months",
    fees: 9500,
    eligibility: "12th / B.Com / M.Com or Working Professionals",
    shortDesc: "All-in-one professional accounting program covering manual accounting concepts, advanced Tally Prime, complete GST returns, TDS, Payroll, and Advanced Excel for accountants.",
    features: [
      "Financial Accounting Fundamentals & Journal Entries",
      "Complete Tally Prime Masterclass",
      "Comprehensive GST (Invoicing, RCM, Returns)",
      "TDS (Tax Deducted at Source) & Challans",
      "Advanced Excel for Financial Reporting & MIS"
    ],
    fullSyllabus: [
      {
        module: "Semester 1: Foundation & Tally Prime Mastery",
        topics: [
          "Double Entry Bookkeeping, Journal, Ledger, Trial Balance",
          "Complete Tally Prime: Company, Ledgers, Vouchers, Inventory, BRS",
          "Cash Flow, Fund Flow, Ratio Analysis, Balance Sheet"
        ]
      },
      {
        module: "Semester 2: Direct & Indirect Taxation (GST & TDS)",
        topics: [
          "GST Mastery: Intra/Inter-state, RCM, E-way bill, GSTR-1, GSTR-3B",
          "TDS: Sections, Rates, Deductions, Challan 281 & Form 26Q basics",
          "Payroll Management: Salary structures, Attendance, Pay-slips"
        ]
      },
      {
        module: "Semester 3: Financial Analytics in Excel & Live Projects",
        topics: [
          "Advanced Excel: VLOOKUP, XLOOKUP, Pivot Dashboards, Financial modeling",
          "Live business case studies, Audit file preparation",
          "Practical final examination and certification"
        ]
      }
    ],
    careerOpportunities: [
      "Senior Accountant",
      "Tax Consultant Assistant",
      "MIS & Financial Executive",
      "Accounts Manager"
    ],
    status: "Active"
  },
  {
    id: "basic-knowledge-of-computer",
    name: "BASIC KNOWLEDGE OF COMPUTER",
    title: "BASIC KNOWLEDGE OF COMPUTER",
    fullName: "Basic Knowledge of Computer for Beginners",
    category: "Basic",
    categoryLabel: "Beginner Friendly",
    badge: "100% Beginner Friendly",
    duration: "2 Months",
    fees: 2500,
    eligibility: "Open to all age groups (No prior knowledge needed)",
    shortDesc: "Beginner-friendly step-by-step introduction to operating a computer, managing files, browsing the internet safely, creating emails, and using basic word processing.",
    features: [
      "Computer Hardware, CPU, Memory & Storage Basics",
      "Windows Desktop, Files, Folders & Control Panel",
      "Keyboard Mastery & English Typing Drills",
      "Internet Browsing, Google Search & Safety",
      "Notepad, WordPad & Basic MS Word Practice"
    ],
    fullSyllabus: [
      {
        module: "Module 1: Operating the Computer",
        topics: [
          "Starting up, shutting down, mouse handling, keyboard layout",
          "Creating folders, renaming, copying, deleting files",
          "Using USB flash drives, printers, and scanners"
        ]
      },
      {
        module: "Module 2: Essential Typing & Writing",
        topics: [
          "10-finger touch typing practice for speed and accuracy",
          "Writing notes in Notepad and WordPad",
          "Creating simple documents and printing in MS Word"
        ]
      },
      {
        module: "Module 3: Internet & Email Essentials",
        topics: [
          "Opening websites, safe browsing tips, Google searches",
          "Creating personal Gmail, writing emails, attaching files",
          "Government form filling & online utility payments"
        ]
      }
    ],
    careerOpportunities: [
      "Office Assistant",
      "Data Entry Operator",
      "Computer Operator",
      "Personal Digital Confidence"
    ],
    status: "Active"
  },
  {
    id: "all-about-computer",
    name: "ALL ABOUT COMPUTER",
    title: "ALL ABOUT COMPUTER",
    fullName: "All About Computer - Complete Comprehensive Program",
    category: "Comprehensive",
    categoryLabel: "All-in-One Diploma",
    badge: "Complete IT Skills",
    duration: "6–12 Months",
    fees: 12000,
    eligibility: "10th / 12th / College Students / Job Seekers",
    shortDesc: "Extensive all-round computer proficiency course combining Computer Fundamentals, Advanced MS Office Suite, Internet Tools, Accounting basics, and Design fundamentals.",
    features: [
      "Computer Architecture & Operating Systems",
      "Advanced MS Word, Excel (Dashboards) & PowerPoint",
      "Tally Prime Accounting Overview",
      "Graphic Design & Canva Basics",
      "Speed Typing Drills & Comprehensive Project"
    ],
    fullSyllabus: [
      {
        module: "Semester 1: Fundamentals & Office Productivity Suite",
        topics: [
          "Hardware architecture, OS configuration, troubleshooting basics",
          "Advanced MS Word (Corporate documentation, Mail Merge)",
          "Advanced MS Excel (Formulas, Pivot Tables, Interactive KPI charts)",
          "MS PowerPoint (Professional animated presentations)"
        ]
      },
      {
        module: "Semester 2: Computerized Accounting & Creative Tools",
        topics: [
          "Tally Prime: Ledger creation, voucher entry, invoicing",
          "Graphic Design: Canva Pro, Social media banners, Photoshop basics",
          "Web & Cloud tools: Google Workspace, online collaboration"
        ]
      },
      {
        module: "Semester 3: Practical Projects & Diploma Evaluation",
        topics: [
          "Typing speed certification (English & Regional)",
          "End-to-end office capstone project",
          "Final Diploma assessment and verified certification"
        ]
      }
    ],
    careerOpportunities: [
      "Senior Computer Operator",
      "Office Administrator",
      "Administrative Coordinator",
      "Executive Assistant"
    ],
    status: "Active"
  }
];

if (typeof window !== "undefined") {
  window.COURSES_DATA = COURSES_DATA;
}
