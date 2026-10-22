# EduMentor AI — Enterprise Multi-Agent Learning & Academic SaaS

[![Next.js 16](https://img.shields.io/badge/Next.js-16.2.6-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.2-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Drizzle_ORM-336791?style=for-the-badge&logo=postgresql)](https://orm.drizzle.team/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4.1-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-Gemma_AI-4285F4?style=for-the-badge&logo=google)](https://ai.google.dev/)
[![Vercel Deployed](https://img.shields.io/badge/Deploy-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/)

> **EduMentor AI** is an advanced, production-grade Educational SaaS platform engineered with Next.js 16, PostgreSQL (Drizzle ORM), and Google Gemini Agentic AI. It replaces passive e-learning with an active, dialectical **Multi-Agent Socratic Debate Arena**, real-time peer study pods, cross-role institution management, and automated university exam rubric evaluation.

---

## 🌐 Live Deployment & Project Links

* **Live Web Application:** [https://edumentor-ai-saas.vercel.app](https://edumentor-ai-saas.vercel.app) *(Replace with your live Vercel URL)*
* **GitHub Repository:** [https://github.com/sanskarr28/edumentor-ai-saas](https://github.com/sanskarr28/edumentor-ai-saas)
* **API Health Status:** `/api/health`

---

## 🔑 Testing Credentials for Evaluators & Reviewers

The system implements strict **Role-Based Access Control (RBAC)** across four user tiers. Evaluators can test each perspective using the pre-seeded credentials below:

| Role | Name | Email Address | Password | Key Permissions & Portals |
| :--- | :--- | :--- | :--- | :--- |
| **Platform Administrator** | Alex Morgan | `admin@edumentor.ai` | `password123` | Full system oversight, user creation, course management, system audits, institution settings |
| **Faculty / Teacher** | Sarah Chen | `teacher@edumentor.ai` | `password123` | Course creation, syllabus file uploads, assignment authoring, grading & feedback, roster tracking |
| **Student (Primary)** | Jordan Lee | `student@edumentor.ai` | `password123` | Socratic Study Pod, Story Mode, assignment submission, peer invites, live study chat |
| **Student (Peer Collaborator)** | Maya Patel | `maya.patel@edumentor.ai` | `password123` | Receive study pod invites, accept/decline notifications, live peer chat, co-op defense scoring |
| **Parent / Guardian** | Linda Lee | `parent@edumentor.ai` | `password123` | Student academic tracking, attendance records, progress reports, automated AI behavioral insights |

---

## ⚡ Core Innovations & Features

### 1. Multi-Agent Synthetic Study Pod ("The AI Peer Group")
Instead of passive Q&A chat, any topic (e.g., *Bohr's Atomic Model*, *CAP Theorem*, *Heisenberg Uncertainty*) triggers a live Socratic debate between three autonomous AI personas:
* **Elena Rostova (`The Visualizer`):** Develops intuitive mental models, mechanical analogies, and physical intuition.
* **Alex Vance (`The Skeptic`):** Attacks the analogies, testing asymptotic edge cases, non-linear limits, and mathematical boundary breakdowns.
* **Dr. Marcus Chen (`The Examiner`):** Exposes university exam traps and challenges the student to reconcile the conflict.
* **Student Synthesis Sandbox:** The student submits their defense, receiving an automated **0–100% Mastery Score**, formal verdict, and persona-specific feedback.
* **Executive PDF Exporter:** Generates a professional Socratic Briefing PDF using `jspdf` for exam revision.

### 2. Live Peer Study Collaboration & In-App Chat Room
* **Email Invitations:** Students invite classmates by registered email with instant duplicate & self-invite safeguards.
* **Interactive Notifications:** The invited friend receives an in-app notification with one-click **[Accept & Join Pod]** and **[Decline]** options.
* **Live Socratic Chat:** Connected peers can chat in real time inside a docked discussion drawer while debating or writing defenses.
* **Peer Defense Leaderboard:** Students can inspect each other's synthesis defenses and Dr. Marcus's grading to learn from peer approaches.

### 3. Agentic Story Mode (EduLearn)
* Transforms dense textbooks, lecture slides, and PDFs into vivid, step-by-step narrative stories that contextualize difficult STEM concepts.
* Multi-model fallback (`gemma-4-26b-a4b-it` $\rightarrow$ `gemini-3.1-flash-lite`) with offline synthesis failsafes ensuring 100% presentation uptime.

### 4. Enterprise Institutional Management
* **Courses & Materials:** Faculty can upload lecture notes, slides, and syllabi via AWS S3 presigned URLs.
* **Assignment Workflow:** Submissions with optional document attachments, automated rubric evaluations, and AI feedback.
* **Attendance & Analytics:** Automated attendance rolls, student performance analytics, and predictive AI intervention insights.
* **Luxury Obsidian Interface:** Dark mode palette (`#080C14` / `#0F172A`) with precision vector SVG icons and high-contrast typography.

---

## 🏗️ System Architecture

```
                                  ┌───────────────────────────────┐
                                  │      Client Web Browser       │
                                  │   Next.js 16 (React 19, SSR)  │
                                  └───────────────┬───────────────┘
                                                  │ HTTPS / JSON
                                                  ▼
                                  ┌───────────────────────────────┐
                                  │      Next.js App Router       │
                                  │  (API Routes, RBAC Middleware)│
                                  └───────┬───────────────┬───────┘
                                          │               │
                     ┌────────────────────┴──┐         ┌──┴────────────────────┐
                     ▼                       ▼         ▼                       ▼
          ┌─────────────────────┐ ┌────────────────┐ ┌────────────────┐ ┌─────────────────┐
          │  PostgreSQL (Drizzle)│ │ Google GenAI   │ │  AWS S3 Bucket │ │ In-App Realtime │
          │  Users, Courses,    │ │ Gemma / Gemini │ │  Course Notes, │ │ Peer Chat &     │
          │  Submissions, Pods  │ │ Socratic Debate│ │  Submissions   │ │ Notifications   │
          └─────────────────────┘ └────────────────┘ └────────────────┘ └─────────────────┘
```

---

## 🛠️ Technology Stack

* **Frontend Framework:** Next.js 16.2.6 (App Router, Turbopack, React 19)
* **Styling & Design System:** Tailwind CSS v4, Vector SVG icon library, Custom Dark Mode Obsidian Theme
* **Backend Runtime:** Node.js 20+ LTS, Next.js Serverless Functions
* **Database & ORM:** PostgreSQL, Drizzle ORM, Drizzle Kit
* **Authentication:** Stateless signed JWT sessions (`jose`), `bcryptjs` password hashing, HTTP-only security cookies
* **AI Engine:** Google GenAI SDK (`gemma-4-26b-a4b-it`, `gemini-3.1-flash-lite`, `gemini-3.5-flash-lite`) with streaming latency under 1.8s
* **File Storage:** AWS S3 (`@aws-sdk/client-s3`, `@aws-sdk/s3-request-presigner`)
* **Document Generation:** `jspdf` for client-side briefing generation
* **Deployment Target:** Vercel (Edge Network & Serverless Compute)

---

## 🚀 Local Development Setup

### 1. Prerequisites
* Node.js 20.x or higher
* PostgreSQL database instance running locally or in the cloud (Neon / Supabase)

### 2. Clone and Install
```bash
git clone https://github.com/sanskarr28/edumentor-ai-saas.git
cd edumentor-ai-saas
npm install
```

### 3. Environment Variables
Create a `.env` file in the project root:
```ini
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/edumentor
AUTH_SECRET=your-random-32-char-secret-key
GEMINI_API_KEY=your-google-ai-studio-gemini-key

# Optional AWS S3 credentials for document attachments
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-aws-access-key-id
AWS_SECRET_ACCESS_KEY=your-aws-secret-access-key
AWS_S3_BUCKET=your-s3-bucket-name
```

### 4. Database Setup & Seeding
```bash
# 1. Initialize tables (study pod, peer chat, courses, users)
node scripts/create_study_pod_tables.js

# 2. Seed realistic demo data and accounts
npx tsx src/db/seed.ts
```

### 5. Launch Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🚢 Production Deployment to Vercel

1. **Push your code to GitHub:**
   ```bash
   git add .
   git commit -m "Deploy EduMentor AI to Vercel"
   git push origin main
   ```
2. **Import to Vercel:**
   * Go to [vercel.com/new](https://vercel.com/new).
   * Connect your GitHub repository `edumentor-ai-saas`.
3. **Configure Environment Variables in Vercel:**
   * `DATABASE_URL`: Your cloud PostgreSQL URL (e.g. from Neon.tech or Supabase)
   * `AUTH_SECRET`: A secure random string
   * `GEMINI_API_KEY`: Your Google Gemini API key
   * `AWS_REGION`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_S3_BUCKET`
4. **Deploy:** Click **Deploy**. Vercel will build the application and issue a public HTTPS domain.
5. **Initialize Database:** Run `node scripts/create_study_pod_tables.js` and `npx tsx src/db/seed.ts` pointing to the cloud `DATABASE_URL` so all testing credentials function immediately.

---

## 👥 Authors & Academic Context

* **Project Name:** EduMentor AI SaaS
* **Course / Submission:** Advanced Full-Stack Software Engineering & AI Applications
* **License:** MIT License
