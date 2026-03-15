# 🎯 CareerCoach — Frontend

<div align="center">

![CareerCoach](https://img.shields.io/badge/CareerCoach-AI%20Powered-black?style=for-the-badge&logo=react)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)
![Vercel](https://img.shields.io/badge/Deployed-Vercel-black?style=for-the-badge&logo=vercel)

**The AI-powered career mentor that analyzes your CV, finds skill gaps, conducts mock interviews, and builds ATS-friendly CVs — completely free.**

[🌐 Live Demo](https://careercoach-one.vercel.app) · [📹 Demo Video](https://drive.google.com/file/d/1WiuW_TjeFPRltJBahFV5ypGXcFcs2lba/view?usp=drive_link) · [⚙️ Backend Repo](https://github.com/rahman2220510189/career-coach-backend)

</div>

---

## 🚀 Why CareerCoach is Better Than Others

| Feature | CareerCoach | LinkedIn | Resume.io | ChatGPT |
|---------|-------------|----------|-----------|---------|
| CV Analysis vs Job Post | ✅ | ❌ | ❌ | ⚠️ Manual |
| Mock Interview + Scoring | ✅ | ❌ | ❌ | ⚠️ Manual |
| ATS Score | ✅ | ❌ | ✅ | ❌ |
| Bangladesh Education Format | ✅ | ❌ | ❌ | ❌ |
| Job-Specific CV Builder | ✅ | ❌ | ❌ | ❌ |
| 100% Free | ✅ | ⚠️ | ❌ | ⚠️ |
| All-in-One Platform | ✅ | ❌ | ❌ | ❌ |

> Most AI tools make you do everything manually. CareerCoach automates the entire job preparation process — from analyzing your CV against a real job posting to practicing your interview with AI feedback.

---

## ✨ Features

### 🔍 CV Analysis
- Upload your PDF CV + paste any job URL
- AI analyzes skill gaps in seconds
- Match score (0–100%)
- Strengths, missing skills, experience gap
- Interview topics to prepare

### 🎤 Mock Interview Bot
- AI asks real interview questions based on the job
- Scores every answer (0–10)
- Gives detailed feedback — what was good, what to improve
- Tracks progress across sessions

### 📝 ATS-Friendly CV Builder
- Multi-step form with Bangladesh education format (SSC, HSC, University)
- AI generates ATS-optimized content
- Supports: Work Experience, Skills, Projects, Certificates, Languages, Volunteer, Awards, References
- ATS score + improvement tips
- PDF download

### 🎯 Job-Specific CV Builder *(New Feature)*
- Enter your information + paste a Job URL
- AI tailors your CV specifically for that job
- Keywords optimized for the exact role

### 👤 Auth System
- Register / Login / Logout
- JWT authentication
- Forgot password via email
- Protected routes

### 👑 Admin Panel
- Dashboard with stats
- Manage all users (promote/delete)
- View all CV analyses, interviews, CVs
- Read contact messages

---

## 🛠️ Tech Stack

```
React 18          — UI Framework
React Router v6   — Client-side routing
Tailwind CSS      — Styling (no inline CSS)
Axios             — HTTP requests
Context API       — Global state (Auth)
```

---

## 📁 Project Structure

```
src/
├── components/
│   ├── Navbar.jsx
│   └── Footer.jsx
├── context/
│   └── AuthContext.jsx
├── Layout/
│   └── Main.jsx
├── pages/
│   ├── Home.jsx
│   ├── About.jsx
│   ├── Login.jsx
│   ├── Signup.jsx
│   ├── ForgotPassword.jsx
│   ├── ResetPassword.jsx
│   ├── Dashboard.jsx
│   ├── Interview.jsx
│   ├── CVBuilder.jsx
│   └── Admin.jsx
├── router/
│   └── router.jsx
└── utils/
    └── axios.js
```

---

## ⚙️ Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repo
git clone https://github.com/rahman2220510189/career_coach.git
cd career_coach

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

### Environment Variables

```env
REACT_APP_API_URL=http://localhost:5000/api
```

### Run Development Server

```bash
npm start
```

Open [http://localhost:5173](http://localhost:5173)

---

## 🌐 Deployment

Deployed on **Vercel** with automatic GitHub integration.

```json
// vercel.json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

---

## 🔐 Demo Account

```
Email:    naymur@gmail.com
Password: naymur#1gmail.com
```

---

## 📸 Screenshots

| Home Page | Dashboard | Mock Interview |
|-----------|-----------|----------------|
| Premium dark UI | CV upload + analysis | Real-time AI feedback |

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first.

---

## 📄 License

MIT © 2026 [MD. Naymur Rahman](https://github.com/rahman2220510189)

---

<div align="center">
  Built with ❤️ in Dhaka, Bangladesh
  <br/>
  <a href="https://careercoach-one.vercel.app">careercoach-one.vercel.app</a>
</div>
