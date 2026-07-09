Product Requirements Document (PRD)

Project Name: WorkerVoice – Migrant Review Platform
Version: 1.0.0
Status: Draft
Owner: Product Team
Last Updated: 2026-07-07

⸻

1. Project Overview

WorkerVoice is a community-driven platform designed to help Myanmar migrant workers make informed employment decisions before joining a factory or recruitment agency.

The platform provides transparent workplace information and anonymous community reviews that allow workers to understand real working conditions, salaries, overtime, accommodation, welfare, and management experiences before accepting a job.

The system consists of two primary channels:

* Telegram Bot – Fast search and information access.
* WorkerVoice Web Platform – Complete workplace profiles, detailed reviews, user accounts, and administration.

⸻

2. Product Vision

To become the most trusted workplace review platform for Myanmar migrant workers by providing reliable, community-driven information that improves workplace transparency and helps workers choose safer employment opportunities.

⸻

3. Problem Statement

Many Myanmar migrant workers accept employment without having access to trustworthy information about the workplace.

Current information is often scattered across Facebook groups, messaging applications, and personal recommendations, making it difficult to search, verify, or compare workplaces.

Workers commonly face challenges such as:

* Unknown salary conditions
* Unclear overtime policies
* Poor accommodation
* Limited welfare benefits
* Unsafe working environments
* Fraudulent recruitment agencies
* Lack of structured workplace information

WorkerVoice addresses these problems by providing a centralized platform where workers can search companies, read anonymous reviews, and contribute their own experiences.

⸻

4. Business Goals

The project aims to:

* Help migrant workers make informed employment decisions.
* Increase transparency across factories and recruitment agencies.
* Build a trusted community knowledge base.
* Encourage responsible anonymous workplace reviews.
* Reduce misinformation and workplace-related risks.

⸻

5. Target Audience

Primary Users

* Myanmar migrant workers
* Job seekers
* Workers changing factories
* Workers searching for recruitment agencies

Secondary Users

* Platform administrators
* Content moderators

⸻

6. Primary User Journey

The primary user journey begins with the Telegram Bot.

Step 1

A worker opens the WorkerVoice Telegram Bot.

Step 2

The worker searches for a factory or recruitment agency.

Step 3

The Telegram Bot returns matching companies with:

* Company name
* Location
* Average rating
* Number of reviews
* Basic workplace summary

Step 4

The worker selects View Details.

Step 5

The Telegram Bot opens the WorkerVoice website.

Step 6

The worker views the complete company profile, including:

* Company information
* Salary information
* Overtime information
* Accommodation details
* Welfare information
* Anonymous worker reviews

Step 7

If the worker wants to contribute, they register an account, verify their email, and submit an anonymous review.

⸻

7. Product Scope

In Scope (MVP)

Telegram Bot

* Search companies
* Search recruitment agencies
* Display basic workplace information
* Display average ratings
* Display review counts
* Redirect users to the website

Web Platform

* Company search
* Company profile pages
* Agency profile pages
* Anonymous review system
* Salary and overtime ratings
* Accommodation and welfare ratings
* Pros and Cons
* Useful / Not Useful voting
* Email registration
* Email verification
* User profile
* Admin dashboard
* Review moderation
* Myanmar and English language support
* Informational articles for migrant workers

⸻

Out of Scope (Version 1)

The following features are intentionally excluded from the first release:

* Voice reviews
* Job application system
* Online payments
* Chat or messaging
* AI-generated review summaries
* Legal dispute resolution
* Location-based search
* Mobile application

⸻

8. Functional Requirements

The platform shall allow users to:

* Search factories and agencies.
* View workplace profiles.
* Read anonymous reviews.
* Submit anonymous reviews after authentication. (Note: authentication now exists —
  see docs/operations/security.md §4 — but the Review model/API is not yet gated
  behind login; this remains an open decision, out of scope for the auth feature
  itself.)
* Rate salary, overtime, accommodation, and welfare.
* Vote whether reviews are useful.
* Edit their own profile.
* View worker information articles.

Administrators shall be able to:

* Manage companies.
* Manage agencies.
* Moderate reviews.
* Manage reported content.
* View platform statistics.

⸻

9. Non-Functional Requirements

The system should provide:

* Responsive user interface
* Fast search performance
* Secure authentication
* Input validation
* Rate limiting
* High availability
* Scalable architecture
* Maintainable codebase
* Comprehensive documentation

⸻

10. MVP Success Criteria

Version 1.0 is considered successful when the following workflow is fully operational:

1. A worker opens the Telegram Bot.
2. The worker searches for a company or agency.
3. The bot displays search results.
4. The worker opens the company profile on the website.
5. The worker reads anonymous workplace reviews.
6. The worker creates an account.
7. The worker submits an anonymous review.
8. Other users can vote whether the review is useful.

⸻

11. Future Roadmap

Future releases may include:

* Mobile applications
* Push notifications
* AI-assisted review moderation
* Personalized recommendations
* Multi-country workplace support
* Advanced search and filtering
* Community reputation system
* Analytics dashboard
* Employer verification

⸻

12. Success Metrics

The project will measure success using:

* Number of registered users
* Number of workplace reviews
* Number of searchable companies
* Monthly active users
* Telegram Bot usage
* Website traffic
* Review engagement
* Useful vote ratio
* User retention
* Community growth

⸻

13. Assumptions

* Workers have internet access through mobile devices.
* Telegram is widely used by the target audience.
* Factory and agency data can be obtained from reliable sources.
* Users are willing to contribute anonymous workplace reviews.

⸻

14. Risks

Risk	Impact	Mitigation
Fake reviews	High	Moderation, reporting, rate limiting
Spam submissions	High	CAPTCHA, throttling, email verification
Inaccurate workplace information	Medium	Admin verification and update process
Low user participation	Medium	Simple onboarding and community engagement

⸻

15. Product Principles

WorkerVoice follows these principles:

* Protect worker privacy.
* Encourage honest and respectful reviews.
* Present information clearly and transparently.
* Keep the user experience simple.
* Build trust through moderation and data quality.
* Design for long-term scalability and maintainability.

⸻

16. References

* 00-project-overview.md
* 02-system-architecture.md
* 03-database-design.md
* 04-api-specification.md
* 05-development-guide.md