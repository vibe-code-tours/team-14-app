# WorkerVoice Project Report

## What is WorkerVoice?

WorkerVoice is a web platform that helps Myanmar migrant workers make safer employment decisions. Workers can anonymously review factories and recruitment agencies before joining a company. The platform is built to protect worker safety through transparent workplace information.

## Who built it?

The project was built by Team 14 with 6 contributors. Some team members had different git config names during the project, so some names appear twice in the git history:
- Aung Kyaw Myint (also appears as aungyephyo2215) — 24 commits
- NanAungOo (also appears as nanaungoo) — 19 commits
- Zin Mar — 19 commits
- Kay Khaing Myint — 14 commits
- Htet Aung Kyaw — 12 commits

The team completed this in 4 days, from July 9 to July 12, 2026, with about 25 commits per day.

## What technology was used?

The frontend is built with Next.js 16 (App Router), React 19, and TypeScript. The styling uses Tailwind CSS. The backend uses Next.js Route Handlers with Prisma ORM connecting to a PostgreSQL database. Authentication is handled by Auth.js with email verification and password reset flows. The app is deployed on Vercel with Supabase hosting the database.

## How big is the codebase?

The project contains 125 source files with 11,145 lines of TypeScript and React code. There are 36 reusable React components, 27 page routes, and 36 API endpoints. The database has 9 models: User, Account, Session, VerificationToken, PasswordResetToken, RateLimit, SuggestedOrganization, Factory, and Review.

## What features were built?

The core features include anonymous workplace reviews, factory and agency listings with search and filters, user registration and authentication, email verification, and password reset.

The admin portal includes a dashboard with statistics, factory management with approval workflows, user management with blocking and role assignment, review moderation, and suggestion management. There are four user roles: user, moderator, administrator, and super admin.

The UI supports responsive design for mobile, dark mode, multi-language localization, and a star rating system. Security features include password hashing, rate limiting, input validation, and admin route protection.

## What pages exist?

The public pages include the landing page, factory listing, factory detail with reviews, agency listing, and a contact page. Users can register, log in, verify email, and reset passwords. There is a user profile section and a public factory submission form.

The admin portal has 12 pages including a dashboard, factory management, user management, admin management, review moderation, and profile settings.

## What APIs are available?

There are 36 API endpoints covering authentication, public data like factories and regions, user profile management, and 18 admin endpoints for managing the platform.

## Where is it deployed?

The production site runs on Vercel using the live branch. The database is hosted on Supabase with PostgreSQL. Preview deployments are automatic on Vercel.

---

# Demo Video Specification

## What is the demo video?

Every team records one 6-minute demo video of their project. This is the video that gets kept, replayed, and shared. It is also a safety net if the live demo breaks on Demo Day (July 26). The video must be under 6 minutes. Anything over 6 minutes 30 seconds gets cut.

## What is the 6-minute structure?

The video has 7 segments in this order:

**Intro (0:00 to 0:05):** An optional intro animation or title card. Maximum 5 seconds. Do not spend time on this.

**Hook (0:05 to 0:35):** The problem in one sentence. The format is: "This group of people cannot do this thing, so we built this." State who is hurting and why it matters in 30 seconds.

**Solution (0:35 to 1:05):** What was built and who it is for. One breath. Keep it to 30 seconds.

**Live Demo (1:05 to 4:30):** The core flow shown on the live URL. This is the main part of the video at 3 minutes 25 seconds. Show the real user's one task from start to finish. This is the payoff moment.

**Tech Highlight (4:30 to 5:15):** The hardest thing the team built and which AI tool helped build it. This is 45 seconds.

**What's Next (5:15 to 5:45):** What comes next for the real user. This is 30 seconds.

**Outro (5:45 to 6:00):** Team name and thanks. This is 15 seconds.

## How do you script the demo?

Write exact words and exact clicks. Do not write "show the features." Write what you click, what the viewer sees, and what you say. Then read it out loud once. If a sentence is hard to say, it is too long.

## What should the script contain?

**Hook (30 seconds):** Write the problem in one sentence. Write who is hurting and why it matters.

**Solution (30 seconds):** Write what you built and for whom.

**Demo flow (3 minutes 30 seconds):** Write each step. For each step write: what you click or type, what the viewer sees, and what the payoff moment is.

**Tech highlight (45 seconds):** Write the hardest thing you built and which AI tool did it.

**What's next (30 seconds):** Write what you would build next for the real user.

**Outro (15 seconds):** Write "That's Team 14. Thanks for watching."

## What are the rules for recording?

You must demo from the live URL, not localhost. Every team member must speak at least once. Record in a clean browser with no personal tabs. Zoom the UI so text is readable on a phone screen. Show a visible timer. Show the real user's task from start to finish. Add captions because many people watch muted.

Do not show new features on recording day. Do not show secrets like API keys or real personal data. Do not have one person do the whole video. Do not go over 6 minutes 30 seconds. Do not upload a first take without reviewing it.

## What tools can record the video?

OBS Studio works on Windows, Mac, and Linux with full control over screen, mic, and webcam. QuickTime is built into Mac for simple screen recording. Xbox Game Bar is built into Windows. Loom is the easiest option and gives you a link instantly. Chrome has built-in screen recording extensions. Record at 1080p if possible. Speak close to the mic. Do one dry run first.

## How do you upload?

The primary option is YouTube unlisted. Sign into any Google account, upload the video, set visibility to Unlisted, and title it "Vibe Code Tours Team 14 WorkerVoice." Copy the share link. The fallback option is Google Drive. Upload the mp4 to the shared Demo Videos folder, set sharing to "Anyone with the link" as Viewer, and rename the file to "team-14-demo.mp4". Test the link in an incognito window before finishing.

## What editing tools are optional?

You do not need to edit. A clean single take is fine. If you want to trim or add captions, CapCut, DaVinci Resolve, Shotcut, iMovie, Clipchamp, and Descript are all free options. AI tools like Descript, CapCut, and Veed.io can auto-generate captions and clean up audio. AI is for polish, not fakery. The minimum useful edit is trim dead air, drop an intro stinger, and turn on auto-captions.
