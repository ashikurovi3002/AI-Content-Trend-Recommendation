# 🔌 API Specification

This document defines all REST API endpoints for TrendPilot AI.

The backend follows RESTful API principles using Express.js and JWT Authentication.

---

# Base URL

```
Development

http://localhost:5000/api
```

```
Production

https://api.trendpilot.ai/api
```

---

# Authentication

All protected routes require JWT.

```
Authorization: Bearer <JWT_TOKEN>
```

---

# Standard API Response

Success

```json
{
  "success": true,
  "message": "Request successful",
  "data": {}
}
```

Error

```json
{
  "success": false,
  "message": "Validation failed",
  "error": {}
}
```

---

# Authentication APIs

## Register

POST

```
/api/auth/register
```

Request

```json
{
  "name": "Mahfuz",
  "email": "mahfuz@gmail.com",
  "password": "12345678"
}
```

Response

```json
{
  "success": true,
  "message": "User registered successfully"
}
```

---

## Login

POST

```
/api/auth/login
```

Response

```json
{
  "success": true,
  "token": "...",
  "user": {}
}
```

---

## Profile

GET

```
/api/auth/profile
```

---

# Dashboard APIs

## Dashboard Statistics

GET

```
/api/dashboard
```

Returns

- Total Sources
- Active Sources
- Total Content
- AI Recommendations
- Latest Activities

---

# Source Management APIs

## Get Sources

GET

```
/api/sources
```

---

## Create Source

POST

```
/api/sources
```

---

## Update Source

PUT

```
/api/sources/:id
```

---

## Delete Source

DELETE

```
/api/sources/:id
```

---

## Pause Source

PATCH

```
/api/sources/:id/pause
```

---

## Resume Source

PATCH

```
/api/sources/:id/resume
```

---

# Content APIs

## Get Contents

GET

```
/api/content
```

Supports

- Pagination
- Search
- Filter
- Sort

---

## Get Content Details

GET

```
/api/content/:id
```

Returns

- Original Content
- Summary
- Keywords
- Topics
- Recommendation

---

# Recommendation APIs

## Get Recommendations

GET

```
/api/recommendations
```

Supports

- Pagination
- Score Filter
- Platform Filter

---

## Generate Recommendation

POST

```
/api/recommendations/:contentId/generate
```

---

# Scheduler APIs

## Run Manual Scan

POST

```
/api/scan
```

Immediately scans every active source.

---

## Scan Single Source

POST

```
/api/scan/:sourceId
```

---

## Scheduler Status

GET

```
/api/jobs
```

Returns

- Running Jobs
- Failed Jobs
- Last Scan
- Next Scan

---

# Settings APIs

## Get Settings

GET

```
/api/settings
```

---

## Update Settings

PUT

```
/api/settings
```

---

# Health Check

GET

```
/api/health
```

Response

```json
{
  "status": "OK",
  "database": "Connected",
  "server": "Running",
  "version": "1.0.0"
}
```

---

# Pagination Standard

```
?page=1

&limit=10

&search=AI

&sort=publishedAt

&order=desc
```

---

# HTTP Status Codes

| Code | Meaning |
|------|----------|
|200|Success|
|201|Created|
|400|Bad Request|
|401|Unauthorized|
|403|Forbidden|
|404|Not Found|
|409|Conflict|
|422|Validation Error|
|500|Internal Server Error|

---

# Security

- JWT Authentication
- Password Hashing
- Request Validation
- CORS Protection
- Environment Variables
- Rate Limiting
- Helmet Security Middleware

---

# Future APIs

- Google Trends
- Competitor Monitoring
- Analytics
- Notifications
- Team Workspace
- Content Calendar
- Export Reports