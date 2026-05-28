# VEG HRM Indonesia

Human Resource Management System for the Indonesian Mining Industry.

Built with Next.js 16, Supabase, and Tailwind CSS.

## Tech Stack
- **Frontend**: Next.js 16 + Tailwind CSS v4
- **Backend/Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Deployment**: Vercel
- **AI Providers**: DeepSeek, Claude, Gemini (configurable)

## Local Setup

1. Clone the repo
2. Copy `.env.local.example` to `.env.local` and fill in Supabase credentials
3. Run `npm install`
4. Run `npm run dev`

## Project Structure

```
src/
  app/
    (auth)/        — Login, registration pages
    (dashboard)/   — Main app modules
  components/
    ui/            — Reusable UI components
    layout/        — Sidebar, header
  lib/
    supabase/      — Client, server, middleware
```
