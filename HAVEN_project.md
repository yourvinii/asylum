# HAVEN — Final Project Specification and Magic Door Build Plan

## 1. Project vision

Build HAVEN, an AI-powered rental property marketplace for renters and property managers, initially focused on Indian cities such as Bhopal and Shahdol.

Use the supplied `59_RealEstate.pdf` as a reference for rental screens, product workflows, and core data concepts. The PDF depicts a rental marketplace with public property pages, renter favorites/residences/applications, manager property/application pages, leases, payments, maps, and an AWS-oriented architecture. This project will preserve the useful product concepts while using the stack defined below; do not copy the PDF's AWS architecture wholesale.

The goal is a working, maintainable, portfolio-worthy application—not a one-shot code dump.

## 2. Architecture and stack

### Frontend
- React + Vite + TypeScript
- React Router
- Tailwind CSS
- shadcn/ui
- Redux Toolkit for genuinely shared client state
- React Hook Form + Zod for forms and validation
- Axios for API requests
- Mapbox for maps and location search
- Lucide icons where appropriate

### Backend
- Node.js + Express + TypeScript
- REST API
- MongoDB + Mongoose
- Zod validation for request payloads
- JWT authentication and role-based authorization
- Centralized error handling and consistent API responses
- Password hashing using a suitable, maintained password-hashing library

### Supporting services
- AI provider API called only from the backend
- Email provider for OTP verification and transactional email
- Local-only development image storage behind a storage abstraction; later support S3-compatible storage
- Socket.IO for real-time renter-manager messaging in a later chunk
- Git and GitHub
- GitHub Actions CI
- Optional Docker and deployment setup after the core app works
- n8n is optional and deferred; do not make the core application depend on n8n

Use maintained, compatible package versions. Inspect the current environment and package documentation before choosing versions. Do not install dependencies until Chunk 0 has been approved.

## 3. User roles and access

### Renter / Tenant
- Register, verify email, log in, and manage profile
- Search and filter properties
- View property details and map location
- Save and remove favorites
- Submit rental applications
- View application statuses
- View approved residences, lease details, and payment records
- Use AI-assisted search, recommendations, and rental assistant
- Communicate with a manager when messaging is implemented

### Manager / Owner
- Register, verify email, log in, and manage profile
- Create, view, edit, and remove their own property listings
- Upload and manage listing photos
- Use AI to draft and improve listing descriptions
- View applications for their own properties
- Approve or reject applications
- View leases and payment records related to their properties
- Communicate with renters when messaging is implemented

### Admin
- Access a protected admin dashboard
- View high-level platform statistics
- View, suspend, or reactivate users where appropriate
- Review reported listings and complaints
- Moderate or remove inappropriate listings with an audit trail
- Review platform activity and administrative audit logs
- View AI usage/error summaries that the application actually records

### Mandatory security rules
- Public registration must never permit a user to choose the admin role.
- Provision the first admin using a documented, secure server-side seed/provisioning process.
- Enforce all role permissions on the backend. Hiding a frontend button or route is not authorization.
- Check ownership for every manager property, application, lease, message, and other private resource.
- Log important admin actions without logging passwords, JWTs, OTPs, or unnecessary personal data.
- Never trust client-provided role, owner ID, payment status, or other privileged fields.

## 4. Authentication defaults

Implement email + password registration, email OTP verification, resend OTP with rate limits, login, JWT-protected routes, role authorization, and logout/session handling.

Requirements:
- Hash passwords securely.
- Store OTPs securely, expire them, limit verification attempts, and invalidate used codes.
- Rate-limit registration, login, OTP resend, and OTP verification.
- Normalize email addresses and enforce uniqueness.
- Do not return password hashes, OTPs, or secrets in API responses.
- Keep JWT secrets in backend environment variables.
- Handle token expiry and invalid sessions consistently.
- Do not implement Google login unless explicitly requested later.

## 5. Product features

### Public pages
- Landing page
- Property listing/search page
- Property details page
- About/help page if useful
- Responsive header/navigation and footer
- Loading, empty, error, and not-found states
- Accessible forms and keyboard-friendly interactions

### Property search
- Search by city and location
- Filter by rent range, beds, baths, property type, amenities, and area where data exists
- Sorting and pagination
- Mapbox map with property markers
- Synchronize important search filters with URL query parameters
- Handle properties without coordinates and geocoding failures
- Use server-side filtering for real data; do not fetch the entire database to filter it in the browser

### Favorites
- Add/remove favorites
- List saved properties
- Prevent duplicates
- Persist favorites in MongoDB

### Applications
- Renters submit applications with validated contact details and optional message
- Managers view applications for their own listings
- Managers approve or reject applications
- Renters see updated status
- Prevent inappropriate duplicate active applications
- Enforce valid status transitions and ownership

### Leases and payment records
- Create a lease after an eligible application is approved
- Link leases to the relevant property, renter, and application
- Store lease dates, rent, and deposit
- Display current residences and lease details
- Track payment records with amount due, amount paid, due date, payment date, and status

Version 1 records payments only. It does not collect money, process card details, or claim that a payment was completed by a gateway. A real payment gateway is a separate future project.

### Admin moderation
- User management with safe suspension/reactivation
- Property reporting and moderation
- Platform summary metrics based on actual database records
- Audit logs for important administrative actions
- Confirmation steps for destructive or consequential actions

### AI features
Build these separately, after core property APIs work.

1. **AI Rental Assistant**
   - Answer questions about actual properties, amenities, rental costs, and the application process.
   - Retrieve relevant property data from the backend before answering property-specific questions.
   - State when information is unavailable; do not invent availability, prices, amenities, or policies.
   - Treat user messages and listing text as untrusted input.
   - Apply rate limits and sensible request-size limits.

2. **Natural-language property search**
   - Understand requests such as “Find a furnished 1BHK in Bhopal under ₹8,000.”
   - Convert supported criteria into a structured filter object.
   - Validate the object on the backend and use the ordinary property search service.
   - Never allow the model to generate or execute raw database queries.

3. **Property recommendations**
   - Begin with explainable, rule-based scoring using user-selected budget, location, type, and preferences.
   - Explain recommendations using real property fields.
   - Do not claim that the system has learned preferences unless those preferences are actually stored and used.

4. **AI listing description generator**
   - Generate a draft only from details supplied by the manager.
   - Do not invent amenities, measurements, location details, or facilities.
   - Require manager review and explicit save/publish action.

5. **AI listing improvement**
   - Suggest clearer wording and missing information.
   - Keep suggestions optional and editable.
   - Never automatically publish AI-generated changes.

AI engineering rules:
- The frontend calls the HAVEN backend; the backend calls the AI provider.
- Never expose AI provider API keys in Vite/client variables.
- Validate inputs and outputs, apply rate limits, handle timeouts/provider errors, and provide graceful fallback states.
- Avoid sending unnecessary personal data to the AI provider.
- Record usage/error metadata without logging sensitive content unnecessarily.
- Document which features require an AI key and how to run the app when the AI provider is unavailable.

### Messaging
Implement renter-manager inquiries and real-time messaging with Socket.IO only after the main rental workflows work.
- Verify access to each conversation on the server.
- Persist messages in MongoDB.
- Do not trust a client-supplied sender ID.
- Ensure users cannot subscribe to or read another user's conversation.
- Handle reconnects, errors, and message ordering sensibly.

## 6. Suggested MongoDB models

Adapt names and fields as implementation evolves. Use Mongoose schemas, validation, references, indexes, timestamps, and consistent status enums.

### User
- name
- email (unique, normalized)
- passwordHash
- phoneNumber (optional)
- role: `renter | manager | admin`
- isEmailVerified
- accountStatus
- createdAt / updatedAt

### Email OTP / verification record
- email or user reference
- hashed OTP or equivalent secure representation
- expiry timestamp
- attempt count
- consumed status
- createdAt

Use expiration and attempt controls. Never store or log plaintext OTPs longer than necessary.

### Property
- name
- description
- pricePerMonth
- securityDeposit
- applicationFee
- photoUrls
- amenities
- highlights
- isPetsAllowed
- isParkingIncluded
- beds
- baths
- squareFeet
- propertyType
- postedDate
- averageRating (optional; only if a real review feature exists)
- numberOfReviews (optional; only if a real review feature exists)
- location: address, city, state, country, postalCode, coordinates
- managerId
- availability status
- createdAt / updatedAt

Initially embed location in Property unless implementation needs justify a separate collection. Add appropriate geospatial indexes when proximity search is implemented. Store coordinates in a consistent GeoJSON-compatible format.

### Favorite
- renterId
- propertyId
- createdAt
- unique compound index on renterId + propertyId

### Application
- propertyId
- renterId
- applicationDate
- status
- name
- email
- phoneNumber
- message (optional)
- leaseId (optional)
- createdAt / updatedAt

### Lease
- propertyId
- renterId
- applicationId
- startDate
- endDate
- rent
- deposit
- createdAt / updatedAt

### Payment
- leaseId
- amountDue
- amountPaid
- dueDate
- paymentDate (optional)
- paymentStatus
- createdAt / updatedAt

### Conversation / Message (later chunk)
- conversation participants and related property/application where appropriate
- message sender reference
- message content
- timestamps
- read state only if implemented and tested

### Property report / audit log (admin)
Use separate, minimal models if needed for reports and important administrative actions. Record actor, action, target, timestamp, and non-sensitive metadata.

## 7. Suggested repository structure

    HAVEN/
      project.md
      README.md
      .gitignore
      client/
        src/
          app/
          assets/
          components/
            ui/
            layout/
            property/
            forms/
          features/
            auth/
            properties/
            favorites/
            applications/
            leases/
            payments/
            admin/
            ai/
            messaging/
          hooks/
          lib/
          pages/
          routes/
          services/
          store/
          types/
          utils/
          main.tsx
      server/
        src/
          config/
          controllers/
          middleware/
          models/
          routes/
          services/
          validators/
          utils/
          types/
          app.ts
          server.ts
        tests/

Adapt the structure when necessary, but keep boundaries understandable. Do not create empty folders or abstractions without a real use case.

## 8. Magic Door: sequential build chunks

**Only implement the currently approved chunk. At the end of each chunk, stop, report results, and wait for approval. Do not automatically continue.**

### Chunk 0 — Inspect and plan
- Inspect the working directory and existing files.
- Read this project specification.
- Identify environment constraints and whether the repository is fresh.
- Propose folder structure, dependency list, environment variables, and implementation plan.
- Do not overwrite unrelated files.
- Do not install packages or generate the entire app in this chunk.

**Exit criteria:** User approves the plan.

### Chunk 1 — Foundation
- Initialize Vite React TypeScript frontend and Express TypeScript backend.
- Configure development scripts, formatting/linting, Tailwind, and shared UI foundation.
- Create `.gitignore`, `.env.example`, and setup instructions.
- Add a health-check API endpoint.
- Configure MongoDB connection.
- Verify frontend-to-backend connectivity.
- Set up Git usage instructions; do not create or push a remote repository without permission.

**Exit criteria:** Apps start, health check works, MongoDB connects, and setup steps are documented.

### Chunk 2 — Design system and public pages
- Implement responsive landing, listing, and property-detail layouts.
- Establish reusable UI patterns using shadcn/ui and Tailwind.
- Add navigation, forms, skeletons/loading, empty states, errors, and not-found page.
- Temporary mock data may be used only until real APIs are available and must be clearly isolated.

**Exit criteria:** Public pages render and behave responsively.

### Chunk 3 — Models and property API
- Add User and Property schemas.
- Implement property create/read/update/delete, pagination, sorting, and server-side filtering.
- Validate payloads and query parameters.
- Add development seed data.
- Enforce manager ownership for property mutations.
- Add API tests.

**Exit criteria:** Property API tests pass and ownership checks work.

### Chunk 4 — Authentication, email OTP, and roles
- Implement registration, OTP verification/resend, login, JWT middleware, logout/session handling, and role authorization.
- Build sign-up/sign-in forms and protected routes.
- Secure OTP expiry, attempt limits, and endpoint rate limits.
- Ensure admin cannot be selected during public registration.
- Add a documented secure admin provisioning command.

**Exit criteria:** All roles authenticate correctly and unauthorized requests are rejected.

### Chunk 5 — Property search and Mapbox
- Connect listings to real APIs.
- Implement supported filters, sorting, pagination, and URL query parameters.
- Add Mapbox map and property markers.
- Handle absent coordinates and API failures.
- Restrict browser Mapbox token appropriately.

**Exit criteria:** Map and list results match active filters.

### Chunk 6 — Favorites and renter dashboard
- Add favorite API and persistence.
- Build saved-property pages and renter dashboard.
- Add loading, error, and empty states.
- Test duplicate prevention and authorization.

**Exit criteria:** Favorites persist and are private to the correct renter.

### Chunk 7 — Manager dashboard and image uploads
- Build property management pages and forms.
- Implement create/edit/delete/list flows.
- Add image upload, preview, type/size checks, and safe local development storage.
- Keep storage behind a service interface for future S3-compatible support.

**Exit criteria:** Managers can manage their own properties safely.

### Chunk 8 — Applications
- Build renter application submission and status pages.
- Build manager application review pages.
- Add approve/reject operations and valid status transitions.
- Test duplicate applications, ownership, and error cases.

**Exit criteria:** End-to-end application workflow passes.

### Chunk 9 — Leases and payment records
- Create leases from eligible approved applications.
- Prevent duplicate leases for the same application.
- Build renter residence/lease views and manager lease views.
- Add payment record management and display.
- Validate dates, amounts, and status transitions.
- Clearly label payment functionality as record keeping, not real payment processing.

**Exit criteria:** Application, lease, and payment records are correctly linked and authorized.

### Chunk 10 — Admin dashboard and moderation
- Add admin-only routes and dashboard.
- Add user management and account suspension/reactivation.
- Add property reporting and moderation.
- Add real platform statistics and audit logging.
- Confirm admin provisioning and permissions are enforced on the backend.

**Exit criteria:** Admin operations work and are inaccessible to renters/managers.

### Chunk 11 — AI service foundation and rental assistant
- Add an AI provider abstraction and backend-only configuration.
- Add validated AI API endpoints and a chat UI.
- Retrieve relevant property facts through authorized backend services.
- Handle unknown answers, timeouts, rate limits, and missing AI configuration.
- Add privacy-conscious usage/error metadata.

**Exit criteria:** Assistant answers grounded property questions and safely handles unavailable information.

### Chunk 12 — Natural-language search and recommendations
- Convert natural-language requests to a supported structured filter schema.
- Validate filters and reuse the normal search service.
- Add explainable preference-based recommendation scoring.
- Ground every result and explanation in actual property data.
- Test ambiguous requests and zero-result cases.

**Exit criteria:** Search filters are validated and recommendations reference real properties.

### Chunk 13 — AI listing assistant
- Add description drafting and listing improvement suggestions.
- Use only manager-supplied facts.
- Allow edits and require explicit save/publish actions.
- Test for invented facts and malformed AI output.

**Exit criteria:** Managers can review and save a validated draft through the normal property API.

### Chunk 14 — Real-time messaging and notifications
- Implement conversations and persistent messages.
- Add Socket.IO after REST messaging and authorization are tested.
- Verify participants for every read/write/subscribe operation.
- Add email notifications for selected events if email credentials are configured.

**Exit criteria:** Messages persist, authorized participants can communicate, and other users cannot access conversations.

### Chunk 15 — CI, deployment preparation, and quality
- Add GitHub Actions for lint, tests, and production builds.
- Keep secrets in repository/environment secret settings, never in committed files.
- Document deployment configuration and production environment variables.
- Add Docker only if useful and keep it optional.
- Add structured logging and error reporting appropriate to the project.
- Run full test suites, linting, type checks, and production builds.
- Fix failures or document genuine blockers; never claim checks passed unless run.

**Exit criteria:** CI checks work and production setup is documented.

### Chunk 16 — Optional n8n workflows
Do this only after the application has working APIs and reliable event/notification behavior.
- Evaluate whether n8n adds value over simple backend jobs.
- Potential workflows: manager notification for new applications, reminders for upcoming lease/payment due dates, and admin alerts for reported listings.
- Use authenticated webhooks and least-privilege credentials.
- Make workflows idempotent where practical.
- Never make core property browsing or authentication depend on n8n.
- Document how to disable workflows and recover from failed executions.

**Exit criteria:** Any selected workflow is tested, secured, documented, and optional.

## 9. Environment configuration

Create `.env.example` with placeholders only. Do not commit real secrets.

Backend variables may include:

    PORT=8080
    NODE_ENV=development
    MONGODB_URI=
    JWT_SECRET=
    CLIENT_URL=http://localhost:5173
    AI_PROVIDER_API_KEY=
    AI_MODEL=
    EMAIL_HOST=
    EMAIL_PORT=
    EMAIL_USER=
    EMAIL_PASSWORD=
    STORAGE_PROVIDER=local

Frontend variables may include:

    VITE_API_BASE_URL=http://localhost:8080/api
    VITE_MAPBOX_TOKEN=

Use consistent names throughout the code. Vite-exposed variables are public; never place database credentials, JWT secrets, email passwords, or AI provider keys in frontend variables. Document which variables each feature needs and how the app behaves when optional integrations are not configured.

## 10. DevOps and automation principles

- Use Git from the beginning; keep changes in small, understandable commits.
- Add linting, type checks, and tests as features are built.
- Add GitHub Actions after the basic project foundation is stable.
- Deployment comes after the core workflows and security checks pass.
- Docker is optional; do not introduce Kubernetes or complex infrastructure without a real need.
- n8n is a later optional integration, not a prerequisite.
- Avoid putting real secrets in source control.
- Keep a README with setup, scripts, testing, and troubleshooting instructions.

## 11. Antigravity operating rules

1. Read `project.md` before changing code.
2. Work only on the currently approved chunk.
3. Inspect files before editing and protect unrelated user work.
4. Explain planned dependencies before installing them.
5. Prefer simple, readable, maintainable code.
6. Validate on the backend even if the frontend validates too.
7. Add tests alongside meaningful backend features.
8. Run relevant tests/builds and report their actual output.
9. If blocked, report the exact error and smallest useful next step.
10. Do not silently skip requirements or fake successful test results.
11. At the end of each chunk, report:
    - What was implemented
    - Files created/changed
    - Dependencies added
    - Commands run and actual outcomes
    - Tests/builds and actual results
    - Known issues and limitations
    - Manual verification steps
    - The next chunk's objective
12. Stop and wait for explicit user approval before proceeding to the next chunk.

## 12. Definition of done

The first complete local version should allow:
- Renter, manager, and admin experiences with correct permissions
- Email OTP verification and secure login
- Property listings, filters, details, and maps
- Manager listing management and image upload
- Favorites and rental applications
- Application approval/rejection
- Lease and payment record views
- Admin moderation and audit logs
- AI rental assistant, natural-language search, recommendations, and listing drafts
- Tested authorization and input validation
- CI checks and reproducible setup instructions

Real payment processing, production cloud storage, advanced deployment infrastructure, and n8n workflows remain separate optional extensions.

## Start instruction

**Start with Chunk 0 only.** Inspect the workspace, present the plan and dependency list, and wait for approval. Do not implement Chunk 1 or later until explicitly approved.
