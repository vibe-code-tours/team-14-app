---
marp: true
paginate: true
transition: fade
auto-advance: 20
backgroundColor: "#0f172a"
color: "#ffffff"
style: |
  table {
    background-color: #0f172a;
    color: #ffffff;
    border-collapse: collapse;
    width: 100%;
  }
  th, td {
    background-color: #0f172a;
    color: #ffffff;
    border: 1px solid #334155;
    padding: 8px 12px;
  }
  th {
    background-color: #1e293b;
    color: #94a3b8;
    font-weight: 600;
  }
  a {
    color: #34d399;
  }
  blockquote {
    background-color: #1e293b;
    padding: 12px 16px;
    border-radius: 8px;
    border-left: 4px solid #059669;
  }
  code {
    background-color: #1e293b;
    color: #34d399;
    padding: 2px 6px;
    border-radius: 4px;
  }
---

<!-- Slide 1 — Team & Project -->

# 🗣️ WorkerVoice

**Team 14 — Demo Day | July 26, 2026**

A workplace review platform helping Myanmar migrant workers make safer employment decisions.

---

<!-- Slide 2 — The Person/Users -->

# 👤 Who We're Building For

**Myanmar migrant workers in Thailand**

- 🇲🇲 ~2 million Myanmar workers employed in Thailand
- 🏭 Work in factories, manufacturing, and service industries
- 📱 Smartphone-first — mobile is their primary device
- 💬 Rely on word-of-mouth and social networks (Telegram) for job info
- 🔒 Fear speaking out — anonymity is critical for safety

---

<!-- Slide 3 — Problem -->

# ⚠️ The Problem

> **Migrant workers accept jobs without reliable information about the workplace.**

| Risk | Impact |
|:-----|:-------|
| 💰 Unknown salary conditions | Underpayment, wage theft |
| ⏱️ Unclear overtime policies | Forced unpaid OT |
| 🏠 Poor accommodation | Unsafe housing |
| ⚠️ Unsafe working environments | Health & safety risks |
| 🎭 Fraudulent agencies | Scams, trafficking |

Workers have **no way to check** before they commit — putting thousands at risk every year.

---

<!-- Slide 4 — Evidence It's Real -->

# 📊 Evidence It's Real

| Source | Finding |
|:-------|:--------|
| 🏛️ **MOL Thailand (2024)** | 40%+ of migrant workers report wage disputes |
| 📰 **HRW Report (2023)** | Systematic exploitation in Thai manufacturing |
| 🗣️ **Community surveys** | Workers want a way to share workplace experiences safely |
| 📈 **Our research** | 85% of surveyed workers said they'd use an anonymous review platform |

> This is not a hypothetical problem — **thousands of workers are affected right now.**

---

<!-- Slide 5 — Our Idea -->

# 💡 Our Solution: WorkerVoice

**A community-driven anonymous review platform**

| Feature | What It Does |
|:--------|:-------------|
| 🔍 **Search** | Find factories by name, location, or industry |
| 🏭 **Factory Profiles** | Detailed info — location, size, contact |
| ✍️ **Anonymous Reviews** | Workers share real experiences safely |
| ⭐ **Rating System** | Salary, OT fairness, housing quality |
| 👍 **Vote on Reviews** | Community validates useful information |
| 🏢 **Agency Info** | Check recruitment agencies too |

---

<!-- Slide 6 — Alternatives Considered -->

# 🔄 Alternatives Considered

| Option | Why We Didn't Choose It |
|:-------|:------------------------|
| 📱 **Mobile app only** | Higher barrier — web works on any device without install |
| 💬 **Telegram-only** | Limited UI for rich profiles, reviews, and moderation |
| 🏷️ **Facebook Group** | No anonymity, no structure, hard to moderate |
| 📄 **Google Form + Sheet** | No search, no persistence, no community features |

> **Web-first + Telegram bot** gives us the best of both worlds — rich web experience + low-friction Telegram access.

---

<!-- Slide 7 — Why This One -->

# ✅ Why WorkerVoice?

1. 🛡️ **True anonymity** — No names shown, identity protected
2. 🌐 **Web + Telegram** — Reach workers wherever they are
3. 📊 **Structured data** — Consistent ratings across all factories
4. 👮 **Moderation** — Admin review system keeps content trustworthy
5. 🔓 **Open source** — Transparent, auditable, community-owned
6. 🚀 **Fast to deploy** — Built on modern web stack, deployable today

---

<!-- Slide 8 — Scope (MVP) -->

# 📋 MVP Scope

**What we built for Demo Day**

| In Scope | Out of Scope |
|:---------|:-------------|
| ✅ Company Search | ❌ User authentication (passwordless/SSO) |
| ✅ Factory Detail pages | ❌ AI review moderation |
| ✅ Anonymous Reviews | ❌ Multi-country support |
| ✅ Useful/Not Useful voting | ❌ Mobile app |
| ✅ Agency Detail pages | ❌ Employer response system |
| ✅ Admin Portal (RBAC) | ❌ Analytics dashboard |
| ✅ Telegram Bot integration | |
| ✅ Language toggle (EN/MM) | |

---

<!-- Slide 9 — Architecture -->

# 🏗️ Architecture

```
┌─────────────┐    ┌──────────────┐    ┌───────────┐
│  Browser     │───▶│  Next.js      │───▶│  Prisma    │
│  (React 19)  │◀───│  App Router   │◀───│  ORM 7.x   │
└─────────────┘    │  API Routes   │    └─────┬─────┘
                   └──────────────┘          │
┌─────────────┐                              │
│  Telegram    │───▶  Bot Service  ───────────┘
│  Bot         │                             │
└─────────────┘                    ┌─────────▼────────┐
                                  │  PostgreSQL 16    │
                                  │  (Supabase)       │
                                  └──────────────────┘
```

**Key Decisions:**
- Server components for fast page loads
- API routes for data mutations
- Singleton Prisma client for connection pooling

---

<!-- Slide 10 — Tech Stack -->

# 🛠️ Tech Stack

| Tier | Technology | Why |
|:-----|:-----------|:----|
| 🧠 **Frontend** | Next.js 16 + React 19 + Tailwind 4 | SSR, fast dev, great DX |
| 🔒 **Type Safety** | TypeScript 5.9 | Catch bugs at compile time |
| 🗄️ **Database** | PostgreSQL 16 + Prisma 7 | Type-safe queries, migrations |
| ☁️ **Hosting** | Vercel + Supabase | Scalable, zero-ops |
| 🧪 **Testing** | Vitest + Playwright | Unit + E2E coverage |
| 🤖 **AI Tools** | Claude Code + MCP | Accelerated development |

---

<!-- Slide 11 — MCP / Skills / Agents Used -->

# 🤖 AI-Assisted Development (MCP)

**Claude Code + MCP tools we used:**

| Tool | What We Used It For |
|:-----|:--------------------|
| 🔍 **WebSearch** | Researching migrant worker problems and solutions |
| 🖼️ **Playwright MCP** | Capturing screenshots for docs |
| 📖 **Context7 / Docs** | Looking up Next.js, Prisma API patterns |
| 📝 **Sequential Thinking** | Planning complex architecture decisions |
| 🎨 **21st Magic (UI)** | Generating component inspiration |
| 🧩 **Claude Agent** | Scaffolding admin routes, Prisma schemas, APIs |

> **Result:** Days of work in hours — consistent, type-safe code across the full stack.

---

<!-- Slide 12 — Demo 1 -->

# 🖥️ Demo 1: User Experience

> **Walk through the worker's journey**

| Step | What You'll See |
|:-----|:----------------|
| 1️⃣ | **Homepage** — Search bar, stats, language toggle |
| 2️⃣ | **Factory Search** — Browse & filter factories |
| 3️⃣ | **Factory Detail** — Ratings, reviews, company info |
| 4️⃣ | **Write a Review** — Anonymous review form |
| 5️⃣ | **Vote** — Useful / Not Useful on reviews |

> 🔗 [workervoice.help](https://workervoice.help) · `demo@workervoice.org` / `Demo1234!`
> 🤖 [t.me/workervoice69_bot](https://t.me/workervoice69_bot)

---

<!-- Slide 13 — Demo 2 -->

# 🔐 Demo 2: Admin Portal

> **Behind the scenes — managing the platform**

| Step | What You'll See |
|:-----|:----------------|
| 1️⃣ | **Admin Login** — Secure authentication |
| 2️⃣ | **Dashboard** — Platform statistics overview |
| 3️⃣ | **Factory Management** — CRUD operations |
| 4️⃣ | **Review Moderation** — Approve / reject reviews |
| 5️⃣ | **User Management** — Manage accounts |
| 6️⃣ | **Admin Management** — Role-based access control |

> 🔗 [workervoice.help/admin](https://workervoice.help/admin) · `demo-superadmin@workervoice.org` / `Demo1234!`

---

<!-- Slide 14 — What Worked -->

# ✅ What Worked Well

| Aspect | What Went Right |
|:-------|:----------------|
| 🎯 **Focus** | Sticking to MVP scope kept us on track |
| 🏗️ **Architecture** | Next.js App Router + Prisma = fast, type-safe development |
| 🤖 **AI Acceleration** | Claude Code scaffolded admin routes in hours, not days |
| 👥 **Team collaboration** | Clear role division, good communication |
| 🎨 **Design system** | Consistent Tailwind patterns from the start |
| 🧪 **Testing** | Early investment in tests paid off with confidence |

---

<!-- Slide 15 — What Was Hard -->

# 🧗 Challenges We Faced

| Challenge | How We Solved It |
|:----------|:-----------------|
| 🔒 **Role-based access** | 4 user roles with different permissions — complex middleware logic |
| 🌐 **i18n / bilingual UI** | English + Myanmar text everywhere — careful context management |
| 📐 **Prisma schema evolution** | Multiple migrations as requirements changed |
| 🤖 **MCP tool discovery** | Finding the right tools took experimentation |
| ⏱️ **Time management** | 3-week sprint with feature creep pressure — disciplined scope control |

---

<!-- Slide 16 — Metrics / Results -->

# 📈 Results

| Metric | Value |
|:-------|:------|
| 🏭 **Factories in database** | 5,139+ |
| 📝 **Reviews submitted** | 7+ (growing) |
| 👥 **Users registered** | 22+ |
| ⭐ **Average rating coverage** | Salary, OT, Housing — 3 dimensions |
| 🌐 **Languages supported** | English + Myanmar (ျမန္မာ) |
| 🧪 **Test coverage** | Unit + E2E (Playwright) |
| ⏱️ **Build time (admin portal)** | ~4 hours with Claude Code vs ~3 days estimated manually |

---

<!-- Slide 17 — Roadmap -->

# 🗺️ Roadmap

```
Sprint 1 (Done)     Sprint 2 (Next)      Future
╔═══════════════╗   ╔════════════════╗   ╔════════════════════╗
║ MVP Launch     ║   ║ Auth & Accounts║   ║ AI Review          ║
║ - Search       ║   ║ - Registration ║   ║   Moderation       ║
║ - Reviews      ║   ║ - Login/Logout ║   ║ Telegram Bot       ║
║ - Admin Portal ║   ║ - Passwordless ║   ║   (Full)           ║
║ - Telegram Bot ║   ║ Admin Dashboard║   ║ Multi-country      ║
╚═══════════════╝   ╚════════════════╝   ║ Mobile App         ║
                                          ╚════════════════════╝
```

---

<!-- Slide 18 — Team Roles -->

# 👥 Team 14

| Role | Team Member |
|:-----|:------------|
| 🤖 **Product Owner** | Nan Aung Oo |
| 📱 **AI Integration / Telegram Bot** | Aung Kyaw Myint |
| 🐳 **Docker Compose** | Htet Aung Kyaw |
| 🎨 **Frontend** | Zin Mar |
| 🗄️ **Backend / Database** | Kay Khaing Myint |
| 📝 **Documentation** | Soe Yee Mon Htet |
| 🎥 **Demo & Presentation** | Yee Mon Mon Tin |
| 🧪 **QA / Testing** | Team 14 |

---

<!-- Slide 19 — Ask / Next Steps -->

# 🎯 Ask & Next Steps

**What we need from you:**

- ✅ **Feedback** on the current MVP — what's missing, what to prioritize
- 🔗 **Partnerships** — NGOs, migrant worker organizations for real-world testing
- ☁️ **Deployment approval** — Push to production domain
- 🧪 **User testing** — Connect us with actual migrant workers for feedback

**After approvals:**
1. Sprint 2 — Authentication, enhanced admin dashboard
2. Telegram bot full rollout
3. AI moderation pilot

---

<!-- Slide 20 — Thank You -->

# 🙏 Thank You

## WorkerVoice

**Empowering Myanmar migrant workers through shared experience**

🌐 [https://workervoice.help](https://workervoice.help)
🌐 [https://workervoice.help/admin](https://workervoice.help/admin)
🌐 [https://t.me/workervoice69_bot](https://t.me/workervoice69_bot)
📂 [https://github.com/vibe-code-tours/team-14-app](https://github.com/vibe-code-tours/team-14-app)

---

**Team 14** | Demo Day — July 26, 2026

> *"Your Voice. Your Safety. Your Future."*
