# BloodLink – Smart Blood Donor Network 🩸

A modern, responsive, healthcare-grade frontend application connecting voluntary blood donors directly with emergency patients and partner hospital networks.

Built with **React.js, Vite, Tailwind CSS, Lucide React, and React Router DOM**, strictly matching the client's design theme reference and aesthetic guidelines.

---

## 🎨 Design Theme & Aesthetics

BloodLink faithfully follows the visual theme reference images provided:
- **Primary Color Palette:** Deep Crimson / Maroon (`#841725`, `#6E131E`, `#47080F`), warm light surfaces (`#FCF9F9`, `#FAF5F5`), and pristine white cards with subtle border accents (`#F3E8E9`).
- **Announcement Strip:** Top dark maroon bar with real-time location selector (`New Delhi`), 24/7 emergency hotline (`Call 108`), social links, and an instant **Demo Role Switcher**.
- **Hero & Action Cards:** Hero headline *"Every Drop Counts. Every Donor Matters"*, dual pill CTAs, 4 quick feature cards, and the signature **Crimson Statistics Banner** with ECG waveform.
- **Card Aesthetics:** 2px rounded crimson border accents on Auth modals (`rounded-[32px]`), pill buttons, soft warm diffuse shadows, and medical-grade readability.
- **Visual Milestones:** Interactive horizontal timeline tracker (*My Donation Journey* & *My Treatment Journey*) and rosette impact badges (*Life Saver*, *Regular Donor*).

---

## 🚀 Key Pages & Features

### 1. Landing Page (`/`)
- Brand header with animated ECG blood droplet logo.
- Hero section with live search widget and dual CTAs.
- 4 Feature Quick Cards: *Find Nearby Donors*, *Become a Donor*, *Real-Time Updates*, *Save Lives*.
- Crimson Statistics Banner with 10,000+ Lives Impacted, 50,000+ Registered Donors, 500+ Hospitals, 24x7 Support.
- Blood Group Availability Matrix for all 8 blood groups with live stock percentages and instant match search.
- 3-step *How BloodLink Works* guide.
- User Testimonials slider and *Give Blood. Give Hope.* promotional card.
- Emergency blood request hotline banner.

### 2. Find Donors (`/find-donors`)
- Multi-criteria filter: Blood Group (A+, A-, B+, B-, AB+, AB-, O+, O-), City/Location, Availability only, and text search.
- Interactive **Blood Compatibility Guide** modal.
- Donor cards featuring verification seals, last donation dates, total donations, lives impacted, and direct request modal.
- Live matching counter badge.

### 3. Emergency Blood Request (`/emergency-request`)
- High-priority emergency broadcast form.
- Critical priority selector: *Critical (Golden Hour)*, *High (Within 6h)*, *Medium (24h)*, *Normal*.
- Live matching donor calculator that counts nearby compatible donors in real-time.
- Immediate broadcast confirmation with tracking ID and link to Requester Dashboard.

### 4. Authentication (`/login` & `/register`)
- Matches reference image with dark burgundy rounded border styling.
- Donor vs. Requester account registration toggle.
- Form validation and instant feedback toasts.
- **One-Click Quick Test Accounts** for evaluators:
  - `Donor (Amit Kumar)`
  - `Requester (Maria Rodriguez)`
  - `System Administrator`

### 5. Donor Dashboard (`/donor-dashboard`)
- Recreates Reference Image 2:
  - Welcome greeting: *Welcome Back, Amit! (O+)*.
  - Interactive **Available to Donate** toggle.
  - 4 Stat Cards: *Last Donated (12 Oct 2026)*, *Total Donations (4 Times)*, *Lives Impacted (12 Lives)*, *Next Eligible Date (Eligible Now!)*.
  - *Upcoming Donation Appointment* card with reschedule and directions modals.
  - *Active Blood Requests Nearby* card with instant *Donate Now* interaction.
  - *My Donation Journey* horizontal milestone tracker.
  - *Impact Badge* rosette display (*Life Saver*, *Regular Donor*).
  - Incoming requests queue with accept/decline actions.

### 6. Requester Dashboard (`/requester-dashboard`)
- Recreates Reference Image 3:
  - Welcome greeting: *Welcome Back, Maria! (A+)*.
  - 4 Stat Cards: *Blood Received*, *Total Transfusions*, *Health Progress*, *Next Scheduled Checkup*.
  - *Current Request Status* with live multi-stage progress bar.
  - *My Requests History* with completed badges.
  - *My Treatment Journey* horizontal milestone timeline.
  - *Care Team & Contact* card featuring Dr. A. Khan.

### 7. Admin Control Center (`/admin`)
- Operations KPI overview: Total Donors, Active Requests, Fulfilled Requests, Critical Cases.
- Blood Group Distribution & Inventory Index.
- Donor Management Table with search and one-click verification toggle.
- Blood Request Management Table with approve, mark completed, or flag actions.

### 8. Notifications Center (`/notifications`)
- Categorized notifications: Emergency Alerts, Matching Requests, Eligibility Reminders.
- Filter by All, Unread, and Emergency.
- Mark all as read and delete actions.

---

## 🛠 Tech Stack
- **Framework:** React 18
- **Build Tool:** Vite 6
- **Styling:** Tailwind CSS 3
- **Icons:** Lucide React
- **Routing:** React Router DOM v6
- **Persistence:** LocalStorage synchronization
- **Backend Readiness:** `src/services/firebase.js` architectural stub

---

## 💻 Running the Application

```bash
# Navigate to the project directory
cd bloodlink

# Install dependencies (already pre-installed)
npm install

# Run the development server
npm run dev

# Open your browser at
http://localhost:5173
```
