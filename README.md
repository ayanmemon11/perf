# 🎓 PERFECT COMPUTER EDUCATION - Portal & Admin Panel Guide

Welcome to the complete, professional Computer & Accounting Education Web Portal with a **Secure Admin Panel** and **Online Certificate Verification System** for **Perfect Computer Education** (*“Learn Today • Grow Tomorrow”*).

---

## 🚀 Live System Quick Links

- 🌐 **Public Website**: [http://localhost:8080/](http://localhost:8080/)
- 🔒 **Secure Admin Panel**: [http://localhost:8080/admin](http://localhost:8080/admin) *(Default Demo PIN: `1234`)*
- 📜 **Student Certificate Verification**: [http://localhost:8080/verify-certificate](http://localhost:8080/verify-certificate)

---

## 📁 Project Architecture & Files

```text
perfect-computer-education/
├── index.html                  # Public website (6 Core Courses, Accounting focus, Verification link)
├── verify.html                 # Public Certificate Verification Portal
├── admin.html                  # Secure Admin Panel Single Page Application
├── print-receipt.html          # Official printable Fee Receipt layout
├── print-certificate.html      # High-resolution printable Certificate of Completion
├── server.js                   # Node.js + Express backend with JWT auth & REST endpoints
├── server.ps1                  # Native Windows PowerShell .NET REST server (Zero dependency)
├── package.json                # Node.js package configuration
├── .env                        # Environment secrets & configuration
├── data/
│   └── database.json           # Persistent database (Students, Courses, Payments, Certificates, PIN hash)
├── css/
│   ├── style.css               # Main styling & practical accounting section
│   ├── components.css          # Cards, modals, buttons, toasts
│   ├── responsive.css          # Mobile & tablet responsiveness
│   └── admin.css               # Modern admin dashboard & sidebar styles
├── js/
│   ├── config.js               # Central frontend configuration
│   ├── courses-data.js         # Offline fallback data for the 6 core courses
│   ├── gallery-data.js         # Gallery photos & student testimonials
│   ├── main.js                 # Public website interactive scripts
│   ├── verify.js               # Certificate verification search script
│   └── admin.js                # Full admin dashboard & management engine
└── images/
    ├── logo.svg                # Institute brand logo
    ├── cert-badge.svg          # Verified certificate seal
    ├── courses/                # SVG icons for CCC, Tally Prime, GST, etc.
    ├── gallery/                # Institute lab, classroom, and activity photos
    └── avatars/                # Student profile avatars
```

---

## 🔑 Comprehensive Administration Manual

### 1. Where I Set My Private Admin PIN
Your private Admin PIN is hashed on the server using **SHA-256 / HMAC** cryptographic protection. It is never stored as plain text and is never exposed to the frontend.

- **Initial / Environment File**: In [`.env`](file:///C:/Users/DELL/.gemini/antigravity/scratch/perfect-computer-education/.env), `ADMIN_PIN_HASH` contains the hashed secret.
- **Database Storage**: In [`data/database.json`](file:///C:/Users/DELL/.gemini/antigravity/scratch/perfect-computer-education/data/database.json), `adminAuth.pinHash` stores the active hash.
- **Default Out-of-the-Box PIN**: `1234`

---

### 2. How I Change My Admin PIN
You can change your PIN directly from inside the Admin Panel without editing code:
1. Log into the Admin Panel at [http://localhost:8080/admin](http://localhost:8080/admin).
2. Click **Settings & PIN** in the left sidebar.
3. In the **🔐 Change Admin PIN** card:
   - Enter your **Current PIN** (e.g. `1234`).
   - Enter your **New PIN** (minimum 4 digits).
   - Re-enter to confirm and click **Update Admin PIN**.
4. The server instantly hashes your new PIN and updates `database.json`. Next time you log in, only your new PIN will work.

---

### 3. How I Add a Student
1. Open the Admin Panel > Click **Students** (or Dashboard > **Add New Student**).
2. Click **+ Add Student**.
3. Fill in the student information:
   - Full Name, Father's Name, Date of Birth, Gender
   - Mobile Number (10 digits), Email, Residential Address
   - Selected Course (choose from the 6 courses: *CCC, Tally Prime, Tally with GST, Full Accounting, Basic Computer, All About Computer*)
   - Total Fees (auto-fills based on course, but fully editable)
   - Paid Amount (if student paid an admission advance)
   - Admission Date & Batch timing notes
4. Click **Save Student**. The system automatically computes `Pending Fees = Total Fees - Paid Fees`, generates a unique Student ID (`STU-2026-XXX`), and records the payment receipt if an advance was paid.

---

### 4. How I Edit a Student
1. In the **Students** tab, search for the student by Name, ID, or Mobile number.
2. Click the **Edit (Pencil icon)** button on their row.
3. Update any information (e.g. change course, update phone number, change status to *Active / Completed / Inactive*, or update fees).
4. Click **Save Student**.

---

### 5. How I Add / Change Courses
1. In the Admin Panel, click **Courses (6)** in the sidebar.
2. **To Change Course Details (Fees, Duration, Syllabus, Description)**:
   - Click **Edit Details** on any course card.
   - Update the Fee amount, Duration, Description, or syllabus topics (one per line).
   - Click **Save Course**. The updated fees and duration reflect on the public website.
3. **To Activate / Deactivate a Course**:
   - Click the **Deactivate** button on any course card to temporarily hide it from the public website without deleting it.
4. **To Add a Custom Course**:
   - Click **+ Add Custom Course** at the top-right.

---

### 6. How I Maintain Fees & Print Receipts
1. In the Admin Panel, click **Fees & Receipts** (or click the **₹ / Payment icon** directly on any student row).
2. Click **+ Record Fee Payment**.
3. Select the Student from the dropdown:
   - The system automatically loads their course and pending dues.
4. Enter the **Amount Paid** (₹), select **Payment Date**, and choose **Payment Method** (*Cash, UPI / Google Pay, Bank Transfer, Cheque*).
5. Click **Generate Receipt & Save**.
6. The system automatically:
   - Deducts the amount from the student's pending fees.
   - Generates an official receipt number (`RCP-2026-XXXX`).
   - Opens the printable **Fee Receipt** in a new tab.
   - You can click **Print / Save PDF** or press `Ctrl + P`.

---

### 7. How I Generate Certificates
1. In the Admin Panel, click **Certificates** in the sidebar.
2. Click **+ Generate Certificate**.
3. Select the graduated Student:
   - The system auto-populates their course and completion date.
4. Select their **Grade** (*Grade A+, Grade A, Grade B+, Certified*).
5. Enter custom Certificate Number or leave blank to auto-generate (`PCE-2026-XXX`).
6. Click **Generate Certificate**.
7. The certificate is issued, the student's status is updated to **Completed**, and the certificate appears in the system.
8. Click **Print / PDF** to view the gold-bordered certificate and print or download as PDF.

---

### 8. How I Verify Certificates
Anyone (students, employers, government verifiers) can verify a certificate without logging into the admin panel:
1. Go to the public verification page: [http://localhost:8080/verify-certificate](http://localhost:8080/verify-certificate) (or click *Verify Certificate* in the top bar).
2. Enter the Certificate Number (e.g. `PCE-2026-101`).
3. Click **Verify Now**.
4. The system securely queries the database and displays:
   - ✅ **Certificate Verified Successfully** badge
   - Student Full Name
   - Course Name
   - Completion Date & Issue Date
   - Grade / Performance
   - Authorized Signature Authority
5. **Data Protection Guarantee**: Private personal data (student phone number, email, fees, home address) is **never** shown on the public verification page.

---

### 9. How I Backup the Database
All student records, courses, payments, certificates, and settings are stored in standard structured JSON format:
- **Database File**: [`data/database.json`](file:///C:/Users/DELL/.gemini/antigravity/scratch/perfect-computer-education/data/database.json)

**To Backup**:
1. Simply copy the `data/database.json` file to your Google Drive, USB drive, or email.
2. To restore, replace `data/database.json` with your backup copy.

**To Export Reports to Excel / CSV**:
1. In the Admin Panel > Click **Reports & Export**.
2. Select your report type (*All Students, Active, Completed, Pending Fees Defaulters, Certificates Issued*).
3. Click **Export CSV** to download an instant spreadsheet file.

---

### 10. How to Publish the Complete Website Online

#### Option A: Free Hosting on Render / Railway / Vercel (Node.js Fullstack)
1. Push this project folder to a GitHub repository.
2. Sign up at [render.com](https://render.com) or [railway.app](https://railway.app).
3. Select **New Web Service** > Connect your GitHub repository.
4. Set:
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Environment Variables**: Add `JWT_SECRET` and `ADMIN_PIN_HASH` from your `.env`.
5. Your website and secure Admin Panel will be live on a custom URL with free SSL HTTPS.

#### Option B: VPS / Cloud Server (Ubuntu / Windows Server / cPanel with Node.js)
1. Upload the project folder to your server.
2. Run:
   ```bash
   npm install
   node server.js
   ```
3. Use `pm2` or Windows Service to keep it running continuously:
   ```bash
   pm2 start server.js --name "perfect-computer-education"
   ```
4. Point your domain (e.g. `www.perfectcomputereducation.com`) to the server port `8080`.
