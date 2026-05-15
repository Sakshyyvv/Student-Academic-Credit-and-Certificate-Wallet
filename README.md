# SACC Wallet: MITS Gwalior PDC Evaluation System

**SACC Wallet** is a high-fidelity digital credentialing and Professional Development Credit (PDC) management platform specifically designed for the academic ecosystem of MITS Gwalior. It streamlines the lifecycle of extracurricular achievement—from student submission and AI-guided career pathing to administrative verification and institutional reporting.

## 🎓 The Vision
The platform bridges the gap between student extracurricular effort and formal academic recognition. By unifying Academic Credits and PDC points into a single "Credit Wallet," students gain a 360-degree view of their progress toward graduation and professional readiness.

---

## 🚀 Key Features

### 👨‍🎓 For Students (e.g., Shourya Dubey, Aditi Verma)
*   **Digital Wallet**: Securely upload and store certificates as persistent digital assets (Base64 encoding).
*   **Unified Scorecard**: Real-time calculation of combined progress: `Academic (Sem 1-8) + Extra (PDC)`.
*   **AI Smart Path**: Personalized activity recommendations powered by **Genkit & Gemini 2.5 Flash** to bridge specific credit gaps in C1-C6 categories.
*   **Real-time Activity Hub**: A live dashboard of campus seminars, internships, and hackathons with direct registration links.
*   **Digital Persistence**: High-fidelity simulation with a "DB" that survives page refreshes and syncs across browser tabs.

### 🛡️ For Administrators (e.g., Mr. Vivek Sharma)
*   **Evaluation Workspace**: A streamlined verification queue with auto-calculation of credits based on institutional rules.
*   **Student Lookup**: Instant profile retrieval by Roll Number (e.g., `0901CS231129`) to view comprehensive scores.
*   **Rule Management**: Centralized configuration of PDC category caps (C1-C6) and point weightages.
*   **Campus Broadcasting**: Ability to post and manage real-time activities directly to the student dashboard.

---

## 🛠️ Technology Stack

| Technology | Purpose | Rationale |
|:---|:---|:---|
| **Next.js 15 (App Router)** | Framework | Provides high performance, server-side rendering, and clean routing. |
| **Genkit 1.x** | AI Orchestration | Handles structured LLM interactions with robust type safety. |
| **Gemini 2.5 Flash** | Large Language Model | Extremely fast and intelligent for real-time advisory logic. |
| **ShadCN UI** | UI Components | High-quality, accessible, and professionally themed interface elements. |
| **Tailwind CSS** | Styling | Rapid, responsive design with semantic utility classes. |
| **LocalStorage DB** | Data Layer | Sophisticated cross-tab synchronization to simulate real-world database behavior. |

---

## 📊 PDC Scoring Architecture (C1-C6)
The system enforces the strict institutional scoring rules of MITS Gwalior:

1.  **C1 (Institute Level)**: Quizzes, Debates, Volunteering (Max: 8 pts)
2.  **C2 (State Level)**: Hackathons, Coding Challenges, Cultural Fests (Max: 9 pts)
3.  **C3 (National Level)**: Workshops, Conferences, Model Making, GATE/CAT (Max: 10 pts)
4.  **C4 (Dept. Committees)**: OBE Coordinators, CRs, Placement Committees (Max: 5 pts)
5.  **C5 (Inst. Committees)**: Anti-Ragging, IQAC, Student Mentors (Max: 6 pts)
6.  **C6 (MOOCS)**: NPTEL, Coursera, SWAYAM, EdX (Max: 12 pts)

---

## 📁 Project Structure

*   `src/app`: Application pages (Login, Dashboards, Presentation).
*   `src/components`: Reusable UI modules (AI Path, Score Cards, Upload Panels).
*   `src/ai`: Genkit flows and Gemini prompt templates.
*   `src/lib`: Core logic for PDC calculations and the LocalStorage data store.
*   `docs/`: Detailed integration, development, and maintenance reports.

---

## 📝 Getting Started

1.  **Installation**: Run `npm install` to install all dependencies.
2.  **AI Setup**: Ensure your `.env` contains a valid `GEMINI_API_KEY`.
3.  **Development**: Run `npm run dev` to start the dashboard on `http://localhost:9002`.
4.  **Presentation**: Access the interactive project presentation at `/presentation`.

## 🛡️ Security & Integrity
The prototype implements institutional security simulations, including role-based access control (Student vs. Admin) and session persistence, ensuring that student records are protected and administrative actions are logged.

---
**Developed by Shourya Dubey & Sakshi Verma for College Digital Initiatives.**