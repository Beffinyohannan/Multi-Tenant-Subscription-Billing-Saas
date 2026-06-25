# Multi-Tenant Subscription Billing SaaS

A multi-tenant subscription billing management system with admin dashboard, plan management, user management, and automated billing cycle processing.

## Tech Stack

### Backend
- **Runtime:** Node.js (ES Modules)
- **Framework:** Express 4
- **ORM:** Sequelize 6
- **Database:** PostgreSQL
- **Validation:** Zod
- **Auth:** JWT (access + refresh tokens)
- **Logging:** Pino
- **Password:** bcryptjs

### Frontend
- **Framework:** React 19
- **Build Tool:** Vite 8
- **Routing:** React Router 7
- **State:** Zustand
- **HTTP Client:** Axios
- **Charts:** Recharts
- **Styling:** Tailwind CSS 4

---

## Setup Instructions

### Prerequisites
- Node.js 18+
- PostgreSQL 14+ (or a Neon serverless Postgres account)

### 1. Clone & Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Configure Environment Variables

Copy the example env file and edit it:

```bash
cp backend/.env.example backend/.env
```

See [Environment Variables](#environment-variables) section below for details.

### 3. Database Setup

#### Option A — Local PostgreSQL
```bash
cd backend
npm run db:create
npm run db:migrate
```

#### Option B — Neon (Serverless PostgreSQL)
Set `DATABASE_URL` in `.env` and run only migrations:
```bash
cd backend
npm run db:migrate
```

---

## Running the Application

### Backend

```bash
cd backend

# Development (with auto-reload)
npm run dev

# Production
npm start
```

Server starts at `http://localhost:5000` by default.

### Frontend

```bash
cd frontend

# Development
npm run dev

# Production build
npm run build
npm run preview
```

Server starts at `http://localhost:5173` with API requests proxied to the backend.

---

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `NODE_ENV` | `development` | Environment mode |
| `PORT` | `5000` | API server port |
| `HOST` | `localhost` | API server host |
| `DATABASE_URL` | — | PostgreSQL connection string (Neon/preferred) |
| `DB_HOST` | `localhost` | Database host (fallback) |
| `DB_PORT` | `5432` | Database port (fallback) |
| `DB_NAME` | `subscription_billing` | Database name (fallback) |
| `DB_USER` | `postgres` | Database user (fallback) |
| `DB_PASSWORD` | `postgres` | Database password (fallback) |
| `JWT_SECRET` | — | JWT signing secret (min 32 chars) |
| `JWT_EXPIRES_IN` | `7d` | Access token expiry |
| `JWT_REFRESH_SECRET` | — | Refresh token signing secret (min 32 chars) |
| `JWT_REFRESH_EXPIRES_IN` | `30d` | Refresh token expiry |
| `BCRYPT_SALT_ROUNDS` | `12` | Password hashing rounds |
| `LOG_LEVEL` | `info` | Pino log level |

---

## API Endpoints

All endpoints are prefixed with `/api`.

### Health
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/health` | — | Health check |

### Auth
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/auth/register` | — | Register a new company (creates tenant + admin user) |
| POST | `/api/auth/login` | — | Login |
| POST | `/api/auth/refresh` | — | Refresh access token |
| POST | `/api/auth/logout` | — | Logout (clears cookie) |
| GET | `/api/auth/me` | User | Get current user profile |

### Tenants
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/tenants` | — | Create a tenant |
| GET | `/api/tenants` | — | List all tenants |
| GET | `/api/tenants/:id` | — | Get tenant by ID |

### Users
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/users` | Admin | Create a user within tenant |
| GET | `/api/users` | Admin | List users in tenant |
| GET | `/api/users/me` | User | Get current user |
| GET | `/api/users/:id` | Admin | Get user by ID |
| DELETE | `/api/users/:id` | Admin | Delete a user |

### Plans
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/plans` | Admin | Create a plan |
| GET | `/api/plans` | Admin | List plans in tenant |
| GET | `/api/plans/:id` | Admin | Get plan by ID |
| DELETE | `/api/plans/:id` | Admin | Delete a plan |

### Subscriptions
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/subscriptions` | Admin | Assign a plan to a user |
| GET | `/api/subscriptions` | Admin | List subscriptions in tenant |
| GET | `/api/subscriptions/:id` | Admin | Get subscription by ID |

### Billing
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/billing/run` | Admin | Run the billing cycle |

### Billing Logs
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/billing-logs` | Admin | Manually create a billing log |
| GET | `/api/billing-logs` | Admin | List billing logs in tenant |
| GET | `/api/billing-logs/:id` | Admin | Get billing log by ID |

### Dashboard
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/dashboard/admin` | Admin | Get dashboard stats |

### Audit Logs
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/audit-logs` | Admin | List audit logs in tenant |

---

## How to Run a Billing Cycle

The billing cycle processes all active subscriptions for the current month and is triggered manually via API or the frontend UI.

### Via Frontend
1. Log in as an Admin
2. Navigate to **Billing** in the sidebar
3. Click **Run Billing**

### Via API
```bash
curl -X POST http://localhost:5000/api/billing/run \
  -H "Authorization: Bearer <admin-token>"
```

### What Happens During a Billing Run
1. Fetches all **ACTIVE** subscriptions within the admin's tenant
2. For each subscription:
   - If **end_date** is past → marks status as `EXPIRED`, skips billing
   - If a billing log already exists for this subscription + period → skips (prevents duplicates)
   - Otherwise → inserts a billing log with `SUCCESS` status for the current `YYYY-MM` period
3. Returns a summary: `{ processed, generated, expired, skipped }`

### Idempotency
The billing run is idempotent:
- Wrapped in a **database transaction** — all-or-nothing execution
- **UNIQUE constraint** on `(subscription_id, billing_period)` prevents duplicate logs
- Concurrent runs are safe — the unique constraint + transaction handle race conditions
