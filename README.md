# 🚀 Aztarok Chat – Discord Clone

A modern, real-time chat application inspired by Discord, built with:

- **Next.js 16+ (App Router)**
- **Supabase** (Auth + PostgreSQL Realtime)
- **Server Actions** & Server Components
- **Email + Password authentication**
- **Real-time messaging** (via Supabase Realtime)
- **Production-ready** structure with clean server/client separation

Perfect as a foundation for building your own community platform, team chat, gaming server hub, or study group app.

**[Live Demo](#)** (coming soon) · **[Report Bug](https://github.com/aztarok/discord-clone/issues)** · **[Request Feature](https://github.com/aztarok/discord-clone/issues)**

---

## ✨ Features

- 🔐 Secure email & password sign up / sign in
- 🚪 Protected routes & session management
- 🗂️ Servers (guilds) – create & join communities
- 📢 Text channels inside servers
- 💬 Real-time messaging (Supabase Realtime subscriptions)
- 👥 User profiles (username, avatar placeholder, status)
- 🎨 Modern, responsive UI (minimal & clean – dark mode ready)
- 🛡️ Row Level Security (RLS) on all tables
- ⚡ Server Actions for mutations (no separate API routes)
- 📱 Mobile-friendly layout

Planned / extendable:

- Voice & video channels (LiveKit integration)
- Direct messages (DMs)
- Role-based permissions
- Message reactions & embeds
- Notifications
- Pinned messages & threads

---

## 📂 Project Structure

```text
app/
├── (auth)/
│   ├── sign-in/          # sign-in page
│   └── sign-up/          # sign-up page
├── dashboard/            # protected home / server list
├── server/[serverId]/    # dynamic server page
│   └── channel/[channelId]/
│       └── page.tsx
├── actions/
│   └── auth.ts           # auth server actions
│   └── chat.ts           # message/server actions (future)
lib/
├── supabase/
│   ├── client.ts         # browser client
│   ├── server.ts         # server-only client
│   └── proxy.ts          # session helper
components/
├── ui/                   # shadcn/ui or custom components
├── chat/                 # message bubbles, input, etc.
└── layout/               # sidebar, server sidebar, etc.
```
