# 🤖 AI Development Rules

This document defines the mandatory development standards, coding conventions, architecture rules, and implementation guidelines that every AI coding assistant must follow while contributing to TrendPilot AI.

These rules are mandatory.

Do not violate them.

---

# 1. General Rules

- Follow the Software Requirements Specification (SRS).
- Follow the Database Design document.
- Follow the API Specification.
- Follow the UI/UX Specification.
- Follow the System Architecture.
- Follow the Development Roadmap.
- Never modify the project architecture unless explicitly requested.
- Build the project incrementally, one phase at a time.
- Never skip any feature defined in the documentation.

---

# 2. Tech Stack Rules

## Frontend

Use

- React 19
- Vite
- Tailwind CSS
- shadcn/ui
- React Router
- Axios
- Zustand
- React Hook Form
- Zod

Do not introduce unnecessary frontend libraries.

---

## Backend

Use

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT Authentication

Use modern ES Modules only.

Never use CommonJS (`require`).

---

# 3. Folder Structure Rules

Always follow the existing folder structure.

Frontend

```
client/

components/

pages/

layouts/

hooks/

services/

routes/

context/

utils/

lib/
```

Backend

```
server/

controllers/

models/

routes/

middleware/

services/

jobs/

config/

database/

utils/

prompts/
```

Do not create unnecessary folders.

---

# 4. Coding Standards

- Use reusable components.
- Use reusable services.
- Use async/await.
- Never duplicate logic.
- Follow clean architecture.
- Follow REST API principles.
- Keep business logic inside services.
- Keep controllers lightweight.
- Validate every request.
- Write readable code.
- Use meaningful variable names.
- Write modular code.

---

# 5. AI Integration Rules

Use only

```
@google/generative-ai
```

Store prompts inside

```
server/prompts/
```

Never hardcode prompts inside controllers or routes.

Always

- Retry failed AI requests
- Handle rate limits
- Validate AI output
- Return structured JSON

Never trust AI responses without validation.

---

# 6. Content Collection Rules

Website Monitoring Priority

```
RSS Feed

↓

Sitemap

↓

HTML Scraper
```

YouTube Monitoring

- Official YouTube Data API
- Fetch latest uploads
- Fetch metadata
- Fetch transcript if available

Avoid duplicate content.

Always compare

- URL
- Video ID
- Published Date

before saving.

---

# 7. Database Rules

Use Mongoose.

Always

- Index searchable fields.
- Validate schemas.
- Use timestamps.
- Avoid duplicate records.
- Reference related collections.

Never store sensitive information.

---

# 8. Security Rules

Always

- Hash passwords using bcrypt.
- Use JWT Authentication.
- Validate every request.
- Sanitize user input.
- Protect environment variables.
- Enable CORS.
- Use Helmet.
- Use Rate Limiting.

Never expose

- API Keys
- JWT Secrets
- MongoDB URI

---

# 9. UI Rules

Every page must be

- Responsive
- Accessible
- Mobile Friendly

Use

- Tailwind CSS
- shadcn/ui
- Lucide Icons

Support

- Dark Mode
- Light Mode

Every page must include

- Loading State
- Empty State
- Error State

---

# 10. API Rules

Follow REST principles.

Every API should return

Success

```json
{
  "success": true,
  "message": "...",
  "data": {}
}
```

Failure

```json
{
  "success": false,
  "message": "...",
  "error": {}
}
```

Always use proper HTTP status codes.

---

# 11. Scheduler Rules

Use

```
node-cron
```

Run every

```
4–6 Hours
```

Flow

```
Load Sources

↓

Check Website

↓

Check YouTube

↓

Detect New Content

↓

Run Gemini

↓

Save Results
```

---

# 12. Performance Rules

- Lazy load frontend pages.
- Use pagination.
- Cache expensive queries where appropriate.
- Avoid unnecessary API calls.
- Optimize MongoDB indexes.
- Minimize bundle size.

---

# 13. Git Rules

Commit format

```
feat:

fix:

docs:

refactor:

chore:
```

One feature per commit.

Never commit

- node_modules
- .env
- build files

---

# 14. Development Workflow

Always follow

```
Planning

↓

Backend

↓

Frontend

↓

Integration

↓

Testing

↓

Deployment
```

Never implement multiple major features simultaneously.

Complete one phase before moving to the next.

---

# 15. AI Behavior Rules

The AI assistant must

- Never change the architecture.
- Never rename folders without permission.
- Never replace libraries without permission.
- Never remove existing features.
- Never generate placeholder code.
- Never leave incomplete functions.
- Never use deprecated packages.
- Always generate production-ready code.
- Always generate complete files.
- Always explain important implementation decisions.
- Ask for confirmation before moving to the next development phase.

These rules must be followed throughout the entire project.