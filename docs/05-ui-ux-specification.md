# 🎨 UI/UX Specification

This document defines the complete user interface, user experience, design system, layouts, navigation, and interaction patterns for TrendPilot AI.

The application follows a premium SaaS design inspired by Vercel, Linear, Notion, and Supabase.

---

# 1. Design Philosophy

The interface should be

- Clean
- Minimal
- Fast
- Responsive
- Accessible
- Dark Mode First

Every screen should focus on readability and productivity.

---

# 2. Design System

## Theme

Dark First

Light mode supported

---

## Color Palette

Primary

```
#6366F1
```

Success

```
#10B981
```

Danger

```
#EF4444
```

Warning

```
#F59E0B
```

Background

```
#09090B
```

Card

```
#18181B
```

Border

```
#27272A
```

---

## Typography

Heading

- Outfit

Body

- Inter

---

## Icons

Lucide React

---

## Animation

- Fade
- Slide
- Scale
- Hover Glow
- Skeleton Loading

---

# 3. Navigation

Sidebar

- Dashboard
- Sources
- Content Library
- Recommendations
- Settings
- Profile

Navbar

- Search
- Notifications
- Theme Switch
- User Menu

---

# 4. Application Pages

## Authentication

- Login
- Register

---

## Dashboard

Components

- Statistics Cards
- Trend Score
- Latest Recommendations
- Recent Sources
- Activity Timeline
- Charts

---

## Sources

Features

- Table
- Search
- Filter
- Pagination
- Add Source
- Edit Source
- Delete Source
- Pause Source

---

## Content Library

Shows

- Articles
- Videos
- AI Summary
- Keywords
- Topics

---

## Recommendation Page

Every recommendation should display

- Opportunity Score
- Confidence Score
- Suggested Title
- Hook
- Outline
- Platform
- Content Type
- CTA
- Hashtags

---

## Settings

- Gemini API
- Scheduler
- Theme
- Profile

---

# 5. Dashboard Layout

```
+------------------------------------------------------+

Navbar

+----------+-------------------------------------------+

Sidebar | Dashboard

| Statistics

| Charts

| Recommendations

| Activity

+----------+-------------------------------------------+
```

---

# 6. Modals

## Add Source

Fields

- Name
- Type
- URL
- Category

---

## Recommendation Modal

Tabs

Summary

Topics

Keywords

Hooks

Outline

Social Posts

---

# 7. States

Loading

- Skeleton

Empty

- Empty Illustration

Error

- Error Card

Success

- Toast Notification

---

# 8. Responsive Design

Desktop

≥1280px

Tablet

768–1279px

Mobile

<768px

Sidebar becomes Drawer on Mobile.

---

# 9. Accessibility

- Keyboard Navigation
- Screen Reader Support
- Focus States
- High Contrast
- Proper Labels

---

# 10. Future Screens

- Analytics
- Team Workspace
- Notifications
- Competitor Analysis
- Trend Calendar
- AI Prompt Studio

---

# 11. Design Guidelines

- Use shadcn/ui
- Tailwind CSS only
- Reusable Components
- Consistent Spacing
- Rounded Cards
- Soft Shadows
- Glassmorphism
- Responsive Layout
- Dark Mode First
- Modern SaaS Design