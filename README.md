# MessTrack – Edge-Based RFID Hostel Meal Attendance System

MessTrack is a smart hostel meal attendance management system built using RFID technology, ESP32 edge devices, React.js, Node.js, and MySQL. The system provides fast, secure, and offline-capable attendance tracking for hostel meal management.

---

## 🚀 Features

* RFID-based hostel meal attendance system
* Edge-based local authentication using ESP32
* Offline attendance storage with auto synchronization
* Admin, Student, and Caterer dashboards
* Duplicate meal prevention
* Meal-time validation system
* Monthly attendance reports
* Responsive modern UI
* Real-time attendance monitoring

---

## 🛠️ Tech Stack

### Frontend

* React.js
* CSS
* JavaScript

### Backend

* Node.js
* Express.js

### Database

* MySQL

### Hardware

* ESP32
* RC522 RFID Reader
* RFID Cards

---

## 📌 System Workflow

1. Student scans RFID card
2. RFID Reader sends UID to ESP32
3. ESP32 verifies attendance locally
4. Attendance gets marked instantly
5. Data stores locally during offline mode
6. Data synchronizes automatically when internet reconnects
7. Backend stores records in MySQL database
8. Dashboard displays attendance reports

---

## ⚡ Advantages

* Fast authentication (10–50 ms)
* Works even without internet
* Reduces server dependency
* Prevents duplicate attendance
* Low-cost and scalable solution
* Suitable for real hostel environments


## 📂 Installation

### Clone Repository

```bash
git clone https://github.com/your-username/MessTrack.git
```

### Install Frontend Dependencies

```bash
cd frontend
npm install
npm run dev
```

### Install Backend Dependencies

```bash
cd backend
npm install
npm start
```

---

## 🔮 Future Improvements

* Mobile application support
* Face recognition integration
* Cloud analytics dashboard
* Smart campus automation
* AI-based attendance analysis

---

## 👨‍💻 Developer

Om Suryakanta Panda

---

## 📜 License

This project is developed for educational and research purposes.
