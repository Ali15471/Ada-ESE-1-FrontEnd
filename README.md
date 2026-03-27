# Blog App – Frontend (React)

A React single-page application for a blogging platform. This is the presentation layer of a three-tier enterprise application, communicating exclusively with the Django REST API backend.

## Tech Stack

- React 19
- React Router DOM 7 (client-side routing)
- Axios (HTTP client with JWT interceptor)
- Vite (build tool)

## Architecture

This frontend sits in front of the Django REST API and never connects to the database directly. All data is fetched and mutated through the API middleware layer.

Authentication state is managed globally via React Context (`AuthContext`), with JWT access and refresh tokens stored in `localStorage`. An Axios interceptor automatically attaches the token to every request and silently refreshes it on a 401 response.

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

Frontend unit tests are not currently implemented. API integration is validated through the backend test suite — see the backend repository for test coverage details.

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

## AI Usage
Claude Code (Anthropic) was used to assist with debugging, code review, and deployment configuration. All code was reviewed, understood, and integrated manually.

