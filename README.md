# 🎯 Goal Tracking & Performance Management Portal

An enterprise-grade Goal Tracking and Performance Management Portal built using Next.js, Supabase, Tailwind CSS, and TypeScript.

The platform enables organizations to manage employee goals, approvals, progress tracking, shared departmental KPIs, audit logs, and role-based workflows.

---

# 🚀 Live Demo

Add your deployed URL here:

```txt
https://your-vercel-url.vercel.app
```

---

# 📦 Tech Stack

- Next.js 16
- TypeScript
- Tailwind CSS
- Supabase
- PostgreSQL
- Vercel
- Lucide Icons

---

# ✨ Features

## 🔐 Authentication & Role Management

- Secure login system
- Role-based dashboards
- Employee
- Manager
- Admin

---

# 👨‍💼 Employee Features

- Create Goal Sheets
- Add quarterly goals
- Select Thrust Areas
- Define Goal Title & Description
- Set Targets and Weightage
- Unit of Measurement (UoM)
  - Numeric
  - %
  - Timeline
  - Zero-based

---

# ✅ Validation Rules

System-enforced validations:

- Total weightage across all goals must equal 100%
- Minimum weightage per goal: 10%
- Maximum goals per employee: 8

---

# 📈 Quarterly Check-ins

Employees can:

- Update achievements
- Track progress
- Update goal completion status
- View performance analytics

---

# 👨‍💻 Manager Features

Managers can:

- Review submitted goals
- Edit targets and weightage inline
- Add manager comments
- Approve goal sheets
- Return goals for rework

---

# 🔒 Goal Locking

Once approved:

- Goal sheets become locked
- Employees cannot edit approved goals
- Further modification requires Admin intervention

---

# 🏢 Shared Department KPI

Managers/Admins can:

- Create shared departmental KPIs
- Assign goals to multiple employees
- Select primary owner

Employees can:

- Adjust only weightage
- View synced progress updates

Shared goal synchronization automatically updates all linked goals when the primary owner updates achievement progress.

---

# 🛡️ Audit Logs

System tracks:

- Goal approvals
- Goal updates
- Progress updates
- Comments
- Rework actions
- Shared KPI actions

---

# 🎨 UI Highlights

- Modern enterprise UI
- Dark theme
- Responsive layout
- Animated success popups
- Role-based sidebars
- Dashboard analytics
- Professional SaaS-style design

---

# 📂 Project Structure

```txt
app/
│
├── admin/
├── employee/
├── manager/
├── login/
├── dashboard/
│
components/
│
lib/
│
supabase/
```

---

# ⚙️ Environment Variables

Create:

```txt
.env.local
```

Add:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

---

# 🛠️ Installation

Clone repository:

```bash
git clone https://github.com/your-username/goal-portal.git
```

Move into project:

```bash
cd goal-portal
```

Install dependencies:

```bash
npm install
```

Run development server:

```bash
npm run dev
```

---

# 🌐 Deployment

Recommended deployment platform:

- Vercel

Deploy Steps:

1. Push project to GitHub
2. Import repository into Vercel
3. Add environment variables
4. Deploy

---

# 👥 Demo Credentials

## Employee

```txt
employee@example.com
password123
```

---

## Manager

```txt
manager@example.com
password123
```

---

## Admin

```txt
admin@example.com
password123
```

---

# 📌 Future Enhancements

- Email notifications
- AI goal suggestions
- Analytics dashboard
- KPI trend charts
- PDF exports
- Multi-department hierarchy
- Real-time collaboration

---

# 📄 License

This project is developed for educational, hackathon, and enterprise demonstration purposes.

---

# 👨‍💻 Developed By

Hirdesh Meena
