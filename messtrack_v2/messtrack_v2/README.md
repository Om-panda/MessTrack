# MessTrack — Smart Hostel Mess Portal

A full-featured React frontend for the RFID Hostel Mess Management backend.

## Tech Stack
- **React 18** + Vite
- **React Router v6** (client-side routing)
- **Axios** (API calls with JWT interceptor)
- Custom CSS design system (no UI library needed)

---

## Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Configure backend URL
Edit `src/api/index.js` and update `BASE_URL` if your backend runs on a different port:
```js
const BASE_URL = 'http://localhost:3000/api'
```

### 3. Start the dev server
```bash
npm run dev
```
Runs on **http://localhost:5173**

---

## Features by Role

### 🛡️ Admin
| Feature | Route |
|---|---|
| Dashboard (meal stats + revenue by month) | `/admin` |
| Student list (filter by 12 hostels, search, card/meal status) | `/admin/students` |
| Caterer list | `/admin/caterers` |
| Add student (name, reg no, password, hostel, RFID) | `/admin/add-student` |
| Delete student (search by reg no → confirm) | `/admin/delete-student` |
| Set meal pricing (meal type, price, effective date) | `/admin/pricing` |
| Student report (by reg no + month/year) | `/admin/report` |

### 🎓 Student
| Feature | Route |
|---|---|
| Dashboard (my meals this month, quick actions) | `/student` |
| Block meal (date range + meal type selection) | `/student/block` |
| My report (consumed meals + blocked periods by month) | `/student/report` |

### 👨‍🍳 Caterer
| Feature | Route |
|---|---|
| Dashboard (today's counts, hostel summary) | `/caterer` |
| My hostel students (same hostel only, card & meal status) | `/caterer/students` |
| Monthly report (meal counts + billing by month) | `/caterer/report` |

---

## API Endpoints Used

| Method | Endpoint | Used by |
|---|---|---|
| POST | `/api/auth/login` | All |
| POST | `/api/students/add` | Admin |
| POST | `/api/students/my-report` | Student |
| POST | `/api/admin/dashboard` | Admin |
| GET | `/api/admin/students-dashboard` | Admin |
| POST | `/api/admin/search-student` | Admin |
| PUT | `/api/admin/update-student` | Admin |
| DELETE | `/api/admin/delete-student` | Admin |
| POST | `/api/admin/student-report` | Admin |
| POST | `/api/pricing/set` | Admin |
| GET | `/api/pricing/all` | Admin |
| POST | `/api/block/block` | Student |
| GET | `/api/caterer/today-meals` | Caterer |
| POST | `/api/caterer/monthly-report` | Caterer |
| GET | `/api/caterer/students-dashboard` | Caterer |

---

## Project Structure

```
src/
├── api/
│   └── index.js          ← All axios API calls + JWT interceptor
├── components/
│   ├── Sidebar.jsx        ← Role-aware navigation sidebar
│   └── Topbar.jsx         ← Top header bar
├── context/
│   └── AuthContext.jsx    ← Auth state (user, token, login/logout)
├── pages/
│   ├── auth/
│   │   └── Login.jsx
│   ├── admin/
│   │   ├── AdminLayout.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Students.jsx
│   │   ├── Caterers.jsx
│   │   ├── AddStudent.jsx
│   │   ├── DeleteStudent.jsx
│   │   ├── Pricing.jsx
│   │   └── StudentReport.jsx
│   ├── student/
│   │   ├── StudentLayout.jsx
│   │   ├── Dashboard.jsx
│   │   ├── BlockMeal.jsx
│   │   └── MyReport.jsx
│   └── caterer/
│       ├── CatererLayout.jsx
│       ├── Dashboard.jsx
│       ├── Students.jsx
│       └── MonthlyReport.jsx
├── App.jsx                ← Routes + protected route wrapper
├── index.css              ← Full design system (CSS variables)
└── main.jsx
```

---

## Notes

- **JWT** is stored in `localStorage` and auto-attached to every request
- **401 responses** auto-redirect to login
- **Hostel blocks**: A, B, C, D, E, F, G, H, I, J, K, L (12 blocks)
- The Caterer list page calls `/api/admin/caterers` — add this route to your backend if needed, returning students with `role='caterer'`
- Meal dots (✓/✗) on student tables show today's attendance — requires backend to return `breakfast`, `lunch`, `snacks`, `dinner` boolean columns from the `students-dashboard` endpoint
