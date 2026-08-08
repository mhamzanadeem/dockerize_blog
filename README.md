# Medium Blog App (DevOps Essentials)

A full-stack blog application with a **React (Vite + Tailwind)** frontend and **Node.js/Express JSON API** backend. Users can sign up, write stories with a rich text editor, upload cover images, comment on posts, and manage their profile.

> **DevOps delivery:** the app is **fully containerized** (frontend + backend Docker images), deployed as containers on **Render** free tier, connected to a **MongoDB Atlas M0** free cluster, and shipped through a **GitHub Actions CI/CD pipeline**.

| Service | URL |
|---|---|
| **Frontend** (React SPA + nginx) | https://blog-web-latest-dpx6.onrender.com |
| **Backend** (Express JSON API) | https://blog-api-latest-ltrs.onrender.com |
| **Backend health check** | https://blog-api-latest-ltrs.onrender.com/api/health |
| **Database** | MongoDB Atlas — free `M0` cluster |

---

## Features

- User authentication (sign up / sign in / sign out) with HTTP-only cookies
- Create, edit, and delete blog posts with a rich text editor (Quill)
- Upload cover images and avatar photos
- Comment on posts with threaded replies
- Responsive design with collapsible sidebar (desktop) and drawer navigation (mobile)
- Account deletion with all associated data
- Cloud database (MongoDB Atlas) — no local installation needed
- Security headers, rate limiting, password hashing with SHA-256 + salt
- Server status indicator with wake-up button (for Render/free-tier deployments)

---

## Prerequisites

**Node.js** (LTS v22+) — download from https://nodejs.org

Verify installation:
```bash
node --version
npm --version
```

---

## Running Locally

### 1. Install dependencies

```bash
cd backend
npm install
cd ../frontend
npm install
```

### 2. Configure environment variables

The backend reads a `.env` file at the **project root**:

```
MONGO_URL=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/medium-clone?retryWrites=true&w=majority
JWT_SECRET=your-strong-random-secret-here
COOKIE_SECRET=another-strong-random-secret
PORT=8000
NODE_ENV=development
```

The frontend uses `frontend/.env`:

```
VITE_API_URL=http://localhost:8000/api
```

For production builds, `VITE_API_URL` is baked into the bundle (see the Docker/CI section below).

### 3. Run the backend

```bash
cd backend
npm start
```

Expected output:
```
Server Started at PORT:8000
MongoDB Connected
```

### 4. Run the frontend

In a separate terminal:

```bash
cd frontend
npm run dev
```

Opens at `http://localhost:5173`.

---

## Project Structure

```
.
├── .github/workflows/ci-cd.yml     # GitHub Actions CI/CD pipeline
├── render.yaml                     # Render blueprint reference (IaC)
├── README.md
├── backend/                        # Node.js + Express JSON API
│   ├── app.js                      # Entry point
│   ├── Dockerfile                  # Multi-stage node:22-alpine image
│   ├── .dockerignore
│   ├── package.json
│   ├── middlewares/                # authentication, requireApiAuth
│   ├── models/                     # blog, comment, user (password hashing)
│   ├── routes/api/                 # user, blog, comment
│   ├── services/authentication.js  # JWT create/validate
│   └── public/uploads/             # Uploaded images (ephemeral)
├── frontend/                       # React + Vite + Tailwind SPA
│   ├── index.html
│   ├── vite.config.js
│   ├── Dockerfile                  # Multi-stage: Vite build → nginx
│   ├── nginx.conf                  # Static nginx config (SPA fallback)
│   ├── .dockerignore
│   ├── package.json
│   └── src/
│       ├── main.jsx                # Entry point
│       ├── App.jsx                 # Root layout, sidebar context
│       ├── routes.jsx              # Lazy-loaded route definitions
│       ├── api/                    # Axios client (axiosConfig, auth, blog, comment)
│       ├── components/             # auth, blogs, common, profile
│       ├── context/                # AuthContext, BlogContext
│       ├── hooks/                  # useAuth, useBlog, useToast
│       ├── pages/                  # Page wrappers for each route
│       ├── styles/globals.css      # Design tokens, fonts, Quill styles
│       └── utils/                  # constants, formatters, validators
├── .env                            # Backend environment variables (local only)
└── .gitignore
```

---

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/health` | No | Server health check |
| POST | `/api/users/signup` | No | Create account |
| POST | `/api/users/signin` | No | Sign in |
| POST | `/api/users/signout` | No | Sign out |
| GET | `/api/users/profile` | Yes | Get profile |
| PUT | `/api/users/profile` | Yes | Update profile |
| POST | `/api/users/avatar` | Yes | Upload avatar |
| PUT | `/api/users/password` | Yes | Change password |
| DELETE | `/api/users/account` | Yes | Delete account |
| GET | `/api/blogs` | No | List blogs (paginated, searchable) |
| GET | `/api/blogs/mine` | Yes | Get user's blogs |
| GET | `/api/blogs/:id` | No | Get single blog |
| POST | `/api/blogs` | Yes | Create blog |
| PUT | `/api/blogs/:id` | Yes | Update blog |
| DELETE | `/api/blogs/:id` | Yes | Delete blog |
| POST | `/api/blogs/:id/upload` | Yes | Upload cover image |
| GET | `/api/blogs/:blogId/comments` | No | Get comments (with replies) |
| POST | `/api/blogs/:blogId/comments` | Yes | Add comment |
| POST | `/api/blogs/:blogId/comments/:commentId/reply` | Yes | Reply to comment |
| DELETE | `/api/comments/:id` | Yes | Delete comment |

---

## Tech Stack

| Technology | Purpose |
|---|---|
| **Node.js** | JavaScript runtime |
| **Express** | Web framework |
| **MongoDB Atlas** | Cloud database |
| **Mongoose** | MongoDB ODM |
| **React 19** | Frontend UI library |
| **Vite** | Frontend build tool |
| **Tailwind CSS v4** | Utility CSS framework |
| **React Quill** | Rich text editor |
| **React Router v7** | Client-side routing |
| **Axios** | HTTP client |
| **JWT** | Authentication tokens |
| **Multer** | File upload handling |
| **Helmet** | Security headers |
| **express-rate-limit** | Rate limiting |
| **Docker** | Containerization |
| **GitHub Actions** | CI/CD pipeline |
| **Render** | Container hosting (free) |

---

## Dockerization & CI/CD (DevOps delivery)

Both services are **containerized** and deployed as Docker containers on **Render**, with CI/CD fully driven by **GitHub Actions**. Render's built-in auto-deploy is intentionally turned **off** — deploys happen only through the pipeline.

```
GitHub repo (mhamzanadeem/dockerize_blog)
  ├── frontend/Dockerfile ──► Vite build (VITE_API_URL baked) ──► nginx:alpine
  ├── backend/Dockerfile  ──► node:22-alpine (non-root) ──► Express API
  ├── .github/workflows/ci-cd.yml ──► CI checks ► build+push ghcr.io ► Render deploy hooks
  └── render.yaml ──► IaC reference (2 services, auto-deploy OFF)

MongoDB Atlas M0 (free)
  ▲ MONGO_URL
Render (free)
  ▲ pulls prebuilt images from ghcr.io/mhamzanadeem/dockerize_blog/{blog-api,blog-web}
```

### Containers

- **backend/Dockerfile** — multi-stage `node:22-alpine`: installs production deps (`npm ci --omit=dev`), copies source, creates `public/uploads`, runs as the non-root `node` user, listens on `$PORT` (or defaults to 8000). `backend/.dockerignore` keeps `node_modules`, `.env`, uploads, and logs out of the image.

- **frontend/Dockerfile** — multi-stage: builds the production bundle with Vite (accepting `ARG VITE_API_URL`, baked into the JS payload), then serves it from `nginx:alpine` with a **static** `nginx.conf` (`listen 80`, SPA fallback, gzip, immutable asset caching).

### CI/CD pipeline (`.github/workflows/ci-cd.yml`)

Runs on every push to `main` (and on manual `workflow_dispatch`):

1. **CI — checks:** backend install + syntax check; frontend install + production build.
2. **CI — build & push:** both images are built and pushed to the **GitHub Container Registry** (ghcr.io) as `blog-api` and `blog-web`.
3. **CD — deploy:** the workflow `curl`s each service's **Render Deploy Hook**, then polls `GET /api/health` on the backend URL until the service is live.

Where each piece runs:

| Stage | Platform |
|---|---|
| Source code | GitHub (`dockerize_blog` repo) |
| Build + push images | GitHub Actions → GHCR |
| Runtime (containers) | Render free-tier Web Services |
| Database | MongoDB Atlas (M0) |

### Required GitHub Actions secrets

| Secret | Value |
|---|---|
| `VITE_API_URL` | `https://blog-api-latest-ltrs.onrender.com/api` |
| `RENDER_API_URL` | `https://blog-api-latest-ltrs.onrender.com` |
| `RENDER_HOOK_API` | Backend service Deploy Hook URL (service → Settings → Deploy Hook) |
| `RENDER_HOOK_WEB` | Frontend service Deploy Hook URL |

### Reproducing the deployment (steps)

1. **MongoDB Atlas** — create a free `M0` cluster, add a database user, and in **Network Access** allow all IPs (`0.0.0.0/0`). Copy the connection string.
2. **Render — backend:** `New + → Web Service → Existing image` → `ghcr.io/mhamzanadeem/dockerize_blog/blog-api:latest` → plan **Free** → env: `NODE_ENV=production`, `MONGO_URL`, `JWT_SECRET`, `COOKIE_SECRET` → health check path `/api/health`.
3. **Render — frontend:** same flow with `ghcr.io/mhamzanadeem/dockerize_blog/blog-web:latest` → health check path `/`.
4. **GitHub secrets** — add the four secrets from the table above.
5. **Push to `main`** — the workflow rebuilds both images and triggers both deploy hooks automatically.

---

## Known limitations (free tier)

- Render free web services **sleep after ~15 min of inactivity** (cold start ~1 min). The UI includes a “wake-up” button exactly for this.
- Uploaded images live on the container's **ephemeral disk** — they reset on every redeploy. Fine for a demo; for production, store uploads in S3 / Cloud Storage / GridFS.
- GHCR image `latest` tags were **made public** explicitly (Packages page → Change visibility) so Render can pull them anonymously.

---

## Troubleshooting

### MongoDB connection fails
Check `MONGO_URL`. Whitelist all IPs (`0.0.0.0/0`) in MongoDB Atlas **Network Access**.

### Port in use
Change `PORT` in `.env` (e.g., `PORT=3001`).

### Frontend can't reach backend
Ensure the backend URL is baked correctly: rebuild the frontend image with `ARG VITE_API_URL` set to the backend URL (`/api`), or verify the browser's network tab for the actual API call target.

### nginx deploy failed with `invalid port in "${PORT:-80}"`
That config happened when the nginx config used a shell-style `${PORT:-80}` template that Render's environment doesn't resolve. The fix already applied: the frontend image now ships a **static** `nginx.conf` with `listen 80;` — no env-var templating.

### GHCR image can't be pulled by Render (401 / “No public image”)
Anonymous access to GHCR works only for packages whose repo is public **and** whose package **image** visibility was changed to Public under GitHub → Packages → the package → **Settings → Change visibility**.

### Render deploy keeps the old image
Render services created from an image keep the tag pinned at creation. After pushing a new `:latest`, trigger **Manual Deploy → Deploy latest image** (or wire the Deploy Hook into GitHub Actions to redeploy automatically).

---

## Security

- Passwords hashed with SHA-256 + salt
- JWT tokens expire after 7 days
- HTTP-only, same-site cookies
- Login rate-limited (10 per 15 minutes)
- File uploads restricted to image types (JPEG, PNG, GIF, WebP, max 5MB)
- Files saved with random UUID filenames
- Helmet security headers
- Email addresses stored in lowercase
- `node_modules/`, `dist/`, and `.env` excluded from version control
- Backend container runs as the non-root `node` user