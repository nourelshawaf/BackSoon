I am designing the UI/UX for an MVP startup called BackSoon.

BackSoon is a temporary work coverage marketplace.

The initial MVP focuses ONLY on:

Businesses that need temporary workers
+
Students who are available to temporarily cover work shifts.

The goal is to create a polished, modern UI/UX that can be used as the actual design reference for the website implementation.

The design will eventually be given to Claude for implementation.

==================================================
IMPORTANT — DO NOT INVENT PRODUCT FEATURES
==========================================

Do NOT invent new product features, business models, user types, or workflows.

You are designing the UI/UX for the defined MVP, not redefining the startup.

If you think a feature is necessary for good UX but it has not been specified, flag it as a recommendation instead of silently adding it.

Clearly distinguish:

* Required screen
* Optional UX recommendation
* Feature that requires product approval

Do not add:

* Rooms
* Pet sitting
* Childcare
* Cryptocurrency
* AI assistants
* Social feeds
* Complex messaging systems
* Unnecessary gamification
* Premium subscriptions
* Complex payment systems

unless explicitly requested later.

==================================================
CORE PRODUCT
============

BackSoon helps businesses find temporary student workers to cover shifts.

Example:

A café needs someone to cover:

Café Assistant
Budapest VII
September 25
16:00–22:00
2,500 HUF/hour

Suitable students can apply.

The employer reviews applicants and selects the worker.

The student then sees the confirmed shift.

==================================================
PRIMARY USER TYPES
==================

USER TYPE 1 — STUDENT

The student should be able to:

* Create a profile
* Add skills/experience
* Set availability
* Browse available shifts
* View shift details
* Apply
* See application status
* See confirmed shifts
* Manage their profile

USER TYPE 2 — BUSINESS

The business should be able to:

* Create a business profile
* Post a temporary shift
* View applicants
* Review candidate profiles
* Select a candidate
* Manage open/confirmed shifts

==================================================
CORE USER FLOWS
===============

STUDENT:

Landing page
→ Sign up
→ Student profile
→ Browse shifts
→ Shift details
→ Apply
→ Application status
→ Confirmed shift

BUSINESS:

Landing page
→ Sign up
→ Business profile
→ Create shift
→ View applicants
→ Candidate profile
→ Select worker
→ Confirmed shift

Keep these flows extremely clear.

==================================================
SCREENS TO DESIGN
=================

Design the essential screens first.

PUBLIC:

1. Landing page
2. How it works
3. Login
4. Sign up / choose account type

STUDENT:

5. Student dashboard
6. Browse shifts
7. Shift details
8. Application confirmation/status
9. Student profile
10. Availability
11. Confirmed shifts

BUSINESS:

12. Business dashboard
13. Create shift
14. Manage shifts
15. Applicants
16. Candidate profile
17. Confirm/select candidate
18. Confirmed shift

Do not automatically create additional screens unless they are necessary.

If you believe another screen is required, identify it separately as a recommendation.

==================================================
LANDING PAGE
============

The landing page should immediately communicate the value proposition.

Possible direction:

"Going away? Your shift doesn't have to."

Supporting message:

"BackSoon connects businesses with verified students who can temporarily cover work shifts when regular workers are away."

Primary CTAs:

"I need someone to cover a shift"

"I want to cover shifts"

The exact wording can be improved, but do not change the core meaning.

The landing page should include:

* Strong hero section
* Clear CTA
* Simple explanation of how BackSoon works
* Student/business value proposition
* Trust/verification concept
* Example shift
* Simple final CTA

Keep it concise.

==================================================
VISUAL STYLE
============

Create a design that feels like a real venture-backed startup product.

Design characteristics:

* Modern
* Clean
* Minimal
* Professional
* Trustworthy
* Friendly
* Strong typography
* Excellent spacing
* Clear hierarchy
* High-quality cards
* Subtle interaction states
* Strong responsive behavior

Avoid:

* Generic templates
* Excessive gradients
* Excessive glassmorphism
* Overuse of rounded cards
* Too many colors
* Excessive animations
* Clutter
* Huge text everywhere
* Stock-photo-heavy design

The design should look credible when presented to startup judges.

==================================================
BRAND
=====

Brand name:

BACKSOON

Core concept:

Temporary coverage while you're away.

The brand should communicate:

* Trust
* Reliability
* Temporary
* Speed
* Simplicity
* Opportunity

Create a simple visual identity that can realistically be implemented in a web application.

If you propose colors, typography, icons, or logo concepts, document them clearly so Claude can reproduce the design.

==================================================
DESIGN SYSTEM
=============

Create a reusable design system containing:

* Primary colors
* Secondary colors
* Background colors
* Typography
* Heading styles
* Body text
* Buttons
* Inputs
* Selects
* Cards
* Badges
* Navigation
* Status indicators
* Avatars
* Rating components
* Empty states
* Error states
* Success states
* Loading states

Keep the system consistent.

==================================================
IMPORTANT MVP UX PRINCIPLE
==========================

Every screen should answer:

"What does the user need to do next?"

Avoid unnecessary complexity.

For example, a student should be able to understand a shift card immediately:

JOB
Café Assistant

LOCATION
Budapest VII

DATE
25 September

TIME
16:00–22:00

PAY
2,500 HUF/hour

MATCH
92%

CTA
Apply

The exact information can be adjusted if necessary, but the hierarchy should remain extremely clear.

==================================================
TRUST
=====

Trust is an important part of BackSoon.

Where appropriate, design UI concepts for:

* Verified profile
* Student verification
* Employer verification
* Rating
* Completed shifts
* Experience

Do not invent a complicated verification system.

The UI should communicate trust without overwhelming the user.

==================================================
COMPETITION DEMO
================

Optimize the design for a live startup competition demo.

A judge should be able to understand the product quickly.

The ideal demo should visually show:

1. Business creates a shift.
2. BackSoon shows suitable students.
3. Business reviews applicants.
4. Business selects one.
5. Student sees the confirmed shift.

Use realistic fictional DEMO data.

Do NOT claim that fictional users, companies, ratings, statistics, or partnerships are real.

==================================================
DELIVERABLE
===========

Create the complete UI/UX concept for the MVP.

Provide:

1. Information architecture
2. User flows
3. Desktop designs
4. Mobile-responsive designs
5. Component/design system
6. Important interaction states
7. Empty states
8. Error states
9. Loading states
10. Prototype flow for the competition demo

For every major screen, explain:

* Purpose
* User
* Primary action
* Secondary actions
* Important information
* Navigation

==================================================
HANDOFF TO CLAUDE
=================

The final design should be structured so another developer/AI can implement it accurately.

Document:

* Component names
* Typography
* Spacing
* Colors
* Button styles
* Card styles
* Navigation
* Responsive behavior
* States
* Interactions

Do not rely only on visual appearance.

The design should communicate enough information for Claude to reproduce the website.

==================================================
FINAL RULE
==========

Do not redesign BackSoon into a different startup.

Do not expand the scope without approval.

Make the MVP look extremely polished, but keep the underlying product simple.

The priority is:

CLEAR PRODUCT
+
SIMPLE USER FLOW
+
STRONG UI/UX
+
TRUST
+
CONVINCING COMPETITION DEMO
