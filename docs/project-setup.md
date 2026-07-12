# 🚀 Project Setup

This guide explains how to set up and run **TrendPilot AI** on your local machine.

---

# Prerequisites

Before starting, make sure the following tools are installed.

* Node.js (v20 or later)
* npm
* Git
* MongoDB Atlas Account
* Google Gemini API Key
* VS Code

---

# Clone Repository

```bash
git clone https://github.com/<your-username>/trendpilot-ai.git
cd trendpilot-ai
```

---

# Project Structure

```text
trendpilot-ai/
│
├── client/          # React Frontend
├── server/          # Express Backend
├── docs/
├── assets/
├── README.md
└── .env.example
```

---

# Frontend Setup

Navigate to the client folder.

```bash
cd client
```

Install dependencies.

```bash
npm install
```

Start the development server.

```bash
npm run dev
```

Frontend will run at:

```text
http://localhost:5173
```

---

# Backend Setup

Open another terminal.

```bash
cd server
```

Install dependencies.

```bash
npm install
```

Start the server.

```bash
npm run dev
```

Backend will run at:

```text
http://localhost:5000
```

---

# Environment Variables

Create a `.env` file inside the `server` folder.

```env
PORT=5000

NODE_ENV=development

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key

GEMINI_API_KEY=your_gemini_api_key

CLIENT_URL=http://localhost:5173
```

---

# Install Required Packages

## Frontend

```bash
npm install react-router-dom axios
```

```bash
npm install @tanstack/react-query
```

```bash
npm install react-hot-toast
```

```bash
npm install lucide-react
```

```bash
npm install clsx tailwind-merge
```

---

## Backend

```bash
npm install express mongoose cors dotenv jsonwebtoken bcryptjs
```

```bash
npm install node-cron
```

```bash
npm install axios
```

```bash
npm install cheerio
```

```bash
npm install rss-parser
```

```bash
npm install google-generative-ai
```

Development dependencies

```bash
npm install -D nodemon
```

---

# Recommended Folder Structure

```text
client/
└── src/
    ├── assets/
    ├── components/
    ├── layouts/
    ├── pages/
    ├── routes/
    ├── hooks/
    ├── services/
    ├── context/
    ├── utils/
    ├── lib/
    ├── App.jsx
    └── main.jsx

server/
├── config/
├── controllers/
├── middleware/
├── models/
├── routes/
├── services/
├── jobs/
├── prompts/
├── utils/
├── app.js
└── server.js
```

---

# Available Scripts

## Client

```bash
npm run dev
```

Starts the React development server.

```bash
npm run build
```

Creates the production build.

```bash
npm run preview
```

Runs the production preview.

---

## Server

```bash
npm run dev
```

Starts the Express server with Nodemon.

```bash
npm start
```

Starts the production server.

---

# Verify Installation

Everything is configured correctly if:

* Frontend opens at `http://localhost:5173`
* Backend responds at `http://localhost:5000`
* MongoDB Atlas connects successfully
* Environment variables load correctly
* No errors appear in the terminal

---

# Development Workflow

1. Create a new feature branch.
2. Implement the feature.
3. Test locally.
4. Commit changes with a meaningful message.
5. Push the branch.
6. Create a Pull Request.

---

# Next Development Steps

* Project Initialization
* Authentication
* Dashboard UI
* Source Management
* Website Monitoring
* YouTube Monitoring
* AI Summarization
* Recommendation Engine
* Deployment

---

# Tech Stack

| Layer          | Technology                  |
| -------------- | --------------------------- |
| Frontend       | React + Vite + Tailwind CSS+typescript |
| Backend        | Node.js + Express.js+typescript       |
| Database       | MongoDB Atlas + Mongoose    |
| AI             | Google Gemini API           |
| Authentication | JWT                         |
| Scheduler      | node-cron                   |
| Deployment     | Vercel + Render             |
