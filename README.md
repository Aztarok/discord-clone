# 🚀 Next.js + Supabase Auth Starter By Aztarok

A clean, modern authentication starter built with:

- **Next.js (App Router)**
- **Supabase Auth**
- **Server Actions**
- **Email + Password authentication**
- **Production-ready structure** (server/client separation)

Perfect for quickly bootstrapping new projects with authentication from day one.

---

## ✨ Features

- 🔐 Email & password sign up
- 🔑 Email & password sign in
- 🚪 Secure sign out
- 🧠 Server Actions (no API routes needed)
- 🔄 Session handling via Supabase
- 📦 Clean project structure
- 🎨 Modern, minimal auth UI
- 🛡️ Ready for protected routes

---

## 📂 Project Structure

- app/
    - sign-in/
        - page.tsx
    - sign-up/
        - page.tsx
    - dashboard/
        - page.tsx
    - actions/
        - auth.ts

- lib/
    - supabase/
        - client.ts
        - server.ts
        - proxy.ts

---

## 🛠️ Setup Instructions

1️⃣ **Clone the repo**

```bash
git clone https://github.com/aztarok/Next16AuthStarter.git
cd Next16AuthStarter
```

2️⃣ **Install dependencies**

```
npm install
# or
yarn install
```

3️⃣ **Create a Supabase project**
Go to [Supabase](https://supabase.com/) and create a new project.
Copy your Project URL and Anon Public Key.

Copy your:

- Project URL
- Anon Public Key

4️⃣ **Add environment variables**
Create a .env.local file:

```
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

5️⃣ **Enable Email Auth in Supabase**
In the Supabase dashboard:

- Go to Authentication → Providers
- Make sure Email is enabled
- (Optional for development) Disable email confirmation

🗄️ **Optional: Create a Profiles Table**
Run this in the Supabase SQL Editor:

```
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  username text unique,
  age int,
  created_at timestamp with time zone default timezone('utc', now())
);

alter table profiles enable row level security;

create policy "Users can view their own profile"
on profiles
for select
using (auth.uid() = id);

create policy "Users can insert their own profile"
on profiles
for insert
with check (auth.uid() = id);

create policy "Users can update their own profile"
on profiles
for update
using (auth.uid() = id);
```

🔐 **How Auth Works**
**Sign Up**

- Calls supabase.auth.signUp
- Creates a user in auth.users
- Redirects to /dashboard

**Sign In**

- Calls supabase.auth.signInWithPassword
- Returns error state cleanly
- Redirects on success

**Sign Out**

- Calls supabase.auth.signOut
- Redirects to /sign-in

🧠 **Architecture Notes**
This starter uses:

- Server Actions instead of API routes
- createServer() for secure server-side Supabase access
- createClient() for client usage
- proxy.ts for session handling
- useFormState() for clean error handling
- No unnecessary complexity — just modern, production-ready patterns.

🚀 **Using This as a Starter**
When starting a new project:

- Duplicate this repo
- Rename it
- Add new Supabase project keys
- Start building immediately

Authentication is already wired up.

🔒 **Protecting Routes**
Inside a server component:

```
const supabase = await createServer();
const { data: { user } } = await supabase.auth.getUser();

if (!user) {
  redirect("/sign-in");
}
```

🧩 **Extend It**
You can easily add:

- OAuth providers (Google, GitHub)
- Email confirmation flow
- Password reset
- Role-based access control
- Admin dashboards
- Profile editing
- Avatar uploads

📌 **Why This Starter Exists**
Setting up authentication repeatedly is time-consuming.
This starter lets you:

- Skip setup time
- Avoid common TypeScript + Server Action mistakes
- Use clean, modern patterns
- Focus on building features instead of wiring auth

📄 **License**
MIT — use it however you like.
