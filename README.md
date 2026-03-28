# Blog App – Frontend (React)

A React single-page application for a blogging platform. This is the presentation layer of a three-tier enterprise application, communicating exclusively with the Django REST API backend.

## Tech Stack

- React 19
- React Router DOM 7 (client-side routing)
- Axios (HTTP client with JWT interceptor)
- Vite (build tool)

## Architecture

This frontend sits in front of the Django REST API and never connects to the database
directly. All data is fetched and mutated through the API middleware layer.

Authentication state is managed globally via React Context (`AuthContext`), with JWT access
and refresh tokens stored in `localStorage`. A single `useAuth` hook exposes this state to
all components, avoiding prop drilling.

An Axios interceptor handles token management transparently:
- **Request interceptor** — attaches the `Authorization: Bearer <token>` header to every
  outgoing request automatically
- **Response interceptor** — on a 401 response, silently requests a new access token using
  the refresh token and retries the original request; if the refresh also fails, the user
  is redirected to `/login`

This means components never handle token logic directly — they call the API and the
interceptor manages auth transparently.

## Technical Decisions

- **React Context for auth state** — avoids prop drilling and keeps token management centralised; all components access auth state through a single `useAuth` hook
- **JWT stored in localStorage** — persists sessions across page refreshes; the Axios interceptor handles silent token refresh automatically on 401 responses, so users stay logged in without re-authenticating
- **Client-side image resizing before upload** — reduces bandwidth and upload time; profile images are resized in the browser before being sent to Cloudinary
- **Vite over Create React App** — significantly faster dev server and build times; native ES module support

## Features

- User registration and login
- JWT authentication with automatic token refresh
- Password reset via email link
- View all published posts
- Create, edit, and delete your own posts
- Save posts as drafts (only visible to you)
- Comment on posts, delete your own comments
- Edit profile — username, bio, and profile picture (client-side image resizing before upload)
- Protected routes redirect unauthenticated users to login

## Routes

| Path | Page | Protected |
|---|---|---|
| `/` | Home – all published posts | No |
| `/login` | Login | No |
| `/register` | Register | No |
| `/password-reset-request` | Request password reset email | No |
| `/reset-password/:uidb64/:token` | Confirm password reset | No |
| `/posts/:id` | Post detail with comments | No |
| `/create-post` | Create a new post | Yes |
| `/posts/:id/edit` | Edit a post | Yes |
| `/my-posts` | Your posts (published + drafts) | Yes |
| `/profile` | View and edit your profile | Yes |

## Local Setup

### Prerequisites

- Node.js 18+
- npm

### Steps

```bash
git clone <repo-url>
cd Ada-ESE-1-FrontEnd
npm install
cp .env.example .env
npm run dev
```

The app will be available at `http://localhost:5173`.

### Environment Variables
| Variable | Description |
|---|---|
| VITE_API_URL | Base URL of the Django backend API |

See .env.example for reference. If not set, defaults to http://127.0.0.1:8000.

## Testing

Frontend unit tests are not currently implemented. All API endpoints are validated through
the backend test suite, which achieves 90%+ coverage across authentication, posts, and
comments — including success paths, authorisation rules, and edge cases. See the backend
repository for the full test suite and coverage report.

## Deployment

Deployed on Render as a static site. All routes are rewritten to `/index.html` via a `_redirects` file to support client-side routing.

**Build command:** `npm run build`  
**Publish directory:** `dist`

`VITE_API_URL` is set in the Render dashboard to point to the live backend API.

Live site: https://ada-ese-1-frontend.onrender.com  
Backend repository: https://github.com/Ali15471/Ada-ESE-1-BackEnd

## Security

- JWT tokens stored in `localStorage`; access token attached to every API request via Axios interceptor
- Refresh token used to silently renew expired access tokens; user is redirected to login only if refresh also fails
- Protected routes redirect unauthenticated users to `/login` before any authenticated content renders
- Passwords never stored or logged client-side

## AI Declaration

**Tool used:** Claude Code (Anthropic)

Claude Code was used in the following specific ways during development:

- **Axios interceptor logic** — used to discuss and refine the token refresh interceptor pattern (queuing failed requests during token refresh); the logic was reviewed, understood, and adapted to fit this project's auth flow
- **Client-side image resizing** — used to explain the `Canvas` API approach for resizing images before upload; the implementation was written and tested manually
- **Deployment configuration** — assisted with the Render static site setup and the `_redirects` file needed for client-side routing
- **Debugging** — used to diagnose issues with protected route behaviour and token persistence across page refreshes; fixes were understood and applied manually
- **README drafting** — used to help structure and draft this documentation, which was reviewed and edited to accurately reflect the actual implementation

All core application logic — routing, context, components, and API integration — was written independently. AI-assisted content was critically evaluated before inclusion. Any code generated or suggested by AI was read, understood, and manually integrated; nothing was accepted without review.
