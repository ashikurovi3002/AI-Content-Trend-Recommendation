# 📊 Database Design

## Overview

TrendPilot AI uses **MongoDB** as the primary database.

The database is designed to support content monitoring, AI summarization, and intelligent content recommendations.

---

# Database Collections

```text
users
sources
contents
summaries
recommendations
jobs
```

---

# Entity Relationship

```text
┌────────────┐
│   Users    │
└─────┬──────┘
      │
      │ creates
      ▼
┌────────────┐
│  Sources   │
└─────┬──────┘
      │
      │ monitors
      ▼
┌────────────┐
│  Contents  │
└─────┬──────┘
      │
 ┌────┴────────────┐
 ▼                 ▼
Summaries   Recommendations
```

---

# 1. users

Stores application users.

| Field     | Type     | Description     |
| --------- | -------- | --------------- |
| _id       | ObjectId | Primary Key     |
| name      | String   | User name       |
| email     | String   | Unique email    |
| password  | String   | Hashed password |
| role      | String   | admin / member  |
| createdAt | Date     | Created time    |
| updatedAt | Date     | Last updated    |

Example

```json
{
  "name": "Mahfuz",
  "email": "mahfuz@gmail.com",
  "role": "admin"
}
```

---

# 2. sources

Stores all monitored websites and YouTube channels.

| Field       | Type     | Description                     |
| ----------- | -------- | ------------------------------- |
| _id         | ObjectId | Primary Key                     |
| name        | String   | Source name                     |
| type        | String   | website / youtube               |
| url         | String   | Source URL                      |
| category    | String   | Programming, AI, Marketing etc. |
| description | String   | Optional description            |
| isActive    | Boolean  | Enable or Disable monitoring    |
| lastChecked | Date     | Last monitoring time            |
| createdBy   | ObjectId | User reference                  |
| createdAt   | Date     | Created time                    |
| updatedAt   | Date     | Updated time                    |

Example

```json
{
  "name": "Programming Hero",
  "type": "youtube",
  "url": "https://youtube.com/@ProgrammingHero",
  "category": "Programming",
  "isActive": true
}
```

---

# 3. contents

Stores every detected blog or YouTube video.

| Field       | Type     | Description         |
| ----------- | -------- | ------------------- |
| _id         | ObjectId | Primary Key         |
| sourceId    | ObjectId | Reference to Source |
| title       | String   | Blog or Video title |
| url         | String   | Original URL        |
| thumbnail   | String   | Thumbnail URL       |
| author      | String   | Author name         |
| publishedAt | Date     | Publish date        |
| contentType | String   | blog / video        |
| rawText     | String   | Extracted text      |
| createdAt   | Date     | Stored time         |

Example

```json
{
  "title": "Top 10 AI Tools",
  "contentType": "video",
  "author": "Programming Hero"
}
```

---

# 4. summaries

Stores AI generated summaries.

| Field       | Type     | Description                        |
| ----------- | -------- | ---------------------------------- |
| _id         | ObjectId | Primary Key                        |
| contentId   | ObjectId | Related Content                    |
| summary     | String   | AI Summary                         |
| keywords    | Array    | Important keywords                 |
| topics      | Array    | Extracted topics                   |
| audience    | String   | Target audience                    |
| sentiment   | String   | Positive / Neutral                 |
| difficulty  | String   | Beginner / Intermediate / Advanced |
| generatedAt | Date     | AI generation time                 |

Example

```json
{
  "summary": "This video explains the latest AI coding tools.",
  "keywords": [
    "AI",
    "Cursor",
    "Claude"
  ],
  "topics": [
    "AI Tools",
    "Programming"
  ]
}
```

---

# 5. recommendations

Stores AI-generated content recommendations.

| Field            | Type     | Description                     |
| ---------------- | -------- | ------------------------------- |
| _id              | ObjectId | Primary Key                     |
| contentId        | ObjectId | Related Content                 |
| suggestedTitle   | String   | Suggested content title         |
| hook             | String   | Recommended hook                |
| outline          | Array    | Suggested outline               |
| platform         | String   | Facebook / LinkedIn / YouTube   |
| contentType      | String   | Post / Reel / Shorts / Carousel |
| opportunityScore | Number   | Trend score                     |
| confidenceScore  | Number   | AI confidence                   |
| status           | String   | pending / published             |
| generatedAt      | Date     | Generated time                  |

Example

```json
{
  "suggestedTitle": "5 AI Tricks Every Developer Should Know",
  "platform": "Facebook",
  "opportunityScore": 94,
  "confidenceScore": 91
}
```

---

# 6. jobs

Tracks background monitoring jobs.

| Field      | Type     | Description                  |
| ---------- | -------- | ---------------------------- |
| _id        | ObjectId | Primary Key                  |
| sourceId   | ObjectId | Related Source               |
| status     | String   | running / completed / failed |
| startedAt  | Date     | Start time                   |
| finishedAt | Date     | Finish time                  |
| error      | String   | Error message                |

---

# Database Workflow

```text
User

↓

Add Website / YouTube Channel

↓

Source Saved

↓

Scheduler (Every 4-6 Hours)

↓

Detect New Blog / Video

↓

Save Content

↓

Generate AI Summary

↓

Extract Topics & Keywords

↓

Generate Recommendations

↓

Display on Dashboard
```

---

# Recommended Indexes

## users

* email (Unique)

## sources

* type
* isActive
* lastChecked

## contents

* sourceId
* publishedAt
* contentType

## summaries

* contentId

## recommendations

* contentId
* opportunityScore

## jobs

* sourceId
* status

---

# Future Collections

As the project grows, additional collections can be added.

```text
analytics
notifications
trend_history
competitors
activity_logs
content_calendar
team_members
```

---

# Design Goals

* Modular architecture
* Easy to scale
* Fast querying with indexes
* Supports AI workflows
* Easy integration with Express.js and Mongoose
* Optimized for future SaaS features
