# ⚡ SHORTEN.IO — The Cyber-Brutalist URL Shortener Pro

[![System Status](https://img.shields.io/badge/System_Status-All_Systems_Operational-10b981?style=flat-square&logo=statuspage)](http://localhost:8001)
[![Node version](https://img.shields.io/badge/Node.js-%3E%3D_18.0.0-blue?style=flat-square&logo=node.js)](https://nodejs.org)
[![Database](https://img.shields.io/badge/Database-PostgreSQL_/_Sequelize-336791?style=flat-square&logo=postgresql)](https://www.postgresql.org)
[![Aesthetic](https://img.shields.io/badge/Aesthetic-Cyber--Brutalist-FF00E5?style=flat-square&logo=css3)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/License-Proprietary_/_Restricted-red?style=flat-square&logo=keycdn)](LICENSE)

> **"Short Links, Big Impact."** 
> Welcome to the world's most aggressive URL shortener. No boring designs. No bloated trackers. Pure speed, real-time analytics, folder organization, and custom domain mapping wrapped in a high-voltage Cyber-Brutalist aesthetic.

---

## 📖 Table of Contents
1. [🌟 Core Features](#-core-features)
2. [🛠️ Tech Stack](#%EF%B8%8F-tech-stack)
3. [🔌 API Reference](#-api-reference)
4. [📂 System Architecture](#-system-architecture)
5. [⚙️ Installation & Database Setup](#%EF%B8%8F-installation--database-setup)
6. [🧩 Configuration (.env)](#-configuration-env)
7. [🚀 Running the Application](#-running-the-application)
8. [📈 Advanced Analytics Details](#-advanced-analytics-details)
9. [🤝 Contributing](#-contributing)
10. [🧑‍💻 Developer](#-developer)

---

## 🌟 Core Features

| Feature | Description |
| :--- | :--- |
| 🔥 **Ghost Link Engine** | Shorten URLs instantly without creating an account. These links automatically "self-destruct" in **48 hours**! |
| 📊 **Real-Time Analytics** | Track total clicks, bot filters, devices (Mobile/Desktop), browsers, and geolocations (Country/City) in real time. |
| 📁 **Project Directories** | Group and isolate your shortened links inside logical directories/folders. |
| 🌐 **Custom Branded Domains** | Route shortened links through your own verified custom domain names. |
| ⚡ **Instant Redirection** | High-performance redirect router checks expiry, limits, and executes redirects in under **50ms**. |
| 🌓 **Dual-Theme Aesthetic** | Switch dynamically between a bright Neo-Brutalist and a dark glowing Cyberpunk theme. |
| 🔏 **QR Code Engine** | Each shortened link automatically compiles a clean high-resolution QR Code for physical print. |

---

## 🛠️ Tech Stack

### Backend & Database
* **Runtime:** Node.js (v18+) & Express Framework
* **ORM:** Sequelize (Auto-synchronization & Alteration enabled)
* **Database:** PostgreSQL (with `pg` & `pg-hstore`)
* **Security:** JWT (`jsonwebtoken`) & `bcryptjs` password hashing

### Frontend
* **Templating Engine:** EJS (Embedded JavaScript) with `express-ejs-layouts`
* **Styling CSS:** Tailwind CSS (CDN-injected, custom configurations inside EJS layout)
* **Typography:** `Lexend` (Google Fonts)
* **Visual Components:** Neon Brutalist borders, retro-skew elements, blocky shadows, responsive navigation drawer, and animated marquee footer.

### Tracking Utilities
* **Geolocation:** `geoip-lite` (Offline Country & City lookup)
* **Browser Parsing:** `useragent` (Extract OS, Browser, Device details)
* **Short IDs:** `nanoid` & `shortid`
* **QR Codes:** `qrcode`

---

## 🔌 API Reference

### 1. User Authentication (`/api/user`)
| Method | Endpoint | Access | Body Parameters | Description |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/user/register` | Public | `name`, `email`, `password` | Register a new developer account |
| `POST` | `/api/user/login` | Public | `email`, `password` | Login to fetch JWT access token |
| `GET` | `/api/user/profile` | Private | *None* | Retrieve verified user details |

### 2. URL Management (`/api/url`)
| Method | Endpoint | Access | Body/Query Parameters | Description |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/url` | Semi-Public | `redirectUrl`, `customId`?, `projectId`?, `expiresAt`?, `clickLimit`?, `domainId`? | Create a shortened URL |
| `POST` | `/api/url/burner` | Public | `url` | Create a guest link (Expires in 48 hrs) |
| `GET` | `/api/url/my-urls` | Private | `projectId`?, `page`? | Paginated retrieval of user's shortened links |
| `GET` | `/api/url/:id` | Private | *Path Variable* | Retrieve specific link details with visitor logs |

### 3. Folder/Project Management (`/api/project`)
| Method | Endpoint | Access | Body Parameters | Description |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/project` | Private | `name`, `description` | Create a new project directory |
| `GET` | `/api/project` | Private | *None* | List all user's projects with URL counts |
| `DELETE` | `/api/project/:id` | Private | *Path Variable* | Delete project (sets URLs to null project) |

### 4. Custom Domains (`/api/domain`)
| Method | Endpoint | Access | Body Parameters | Description |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/domain` | Private | `domainName` | Register custom domain (Auto-verified) |
| `GET` | `/api/domain` | Private | *None* | List registered custom domains |
| `DELETE` | `/api/domain/:id` | Private | *Path Variable* | Delete domain registration |

---

## 📂 System Architecture

```text
url-shortner/
├── config/
│   ├── db.js                 # PostgreSQL Sequelize client setup
│   └── systemUser.js         # Seeds GHOST_SYSTEM account for guest links
├── controllers/
│   ├── authController.js     # User registration, login, JWT issuance
│   ├── dashboardController.js# Assembles comprehensive global metrics & analytics
│   ├── domainController.js    # Logic for custom domain registration
│   ├── projectController.js   # Project workspace directories manager
│   ├── redirectController.js  # Main redirect processor, click constraints, visitor capture
│   └── urlController.js      # Creates custom links, burner links, and QR codes
├── middleware/
│   └── authMiddleware.js     # Validates JWT tokens in request headers
├── models/
│   ├── index.js              # Models aggregator & relationship definitions
│   ├── user.js               # UUID-based User schema with bcrypt hooks
│   ├── url.js                # Core link model (expiry, click limits, custom domains)
│   ├── visit.js              # Visitor records (Immutable click history logs)
│   ├── project.js            # Workspace groups schema
│   └── domain.js             # Verified custom domains registration
├── public/
│   └── favicon.png           # Cool brutalist brand asset
├── routes/
│   ├── user.js, url.js, project.js, domain.js, dashboard.js
│   └── redirect.js           # Wildcard redirection routing (MUST BE INJECTED LAST)
├── views/
│   ├── layouts/
│   │   └── main.ejs          # Master HTML template (Tailwind, Dark Mode script)
│   ├── index.ejs             # Cyberpunk Landing Page with Ghost Link input
│   ├── login.ejs, register.ejs, dashboard.ejs, profile.ejs, privacy.ejs, terms.ejs, 404.ejs
├── index.js                  # Main server entrypoint (Engine setup, middleware, startup sequence)
├── .env                      # Application secret configuration (gitignore)
├── package.json              # Dependency manifests
└── README.md                 # This magnificent documentation
```

---

## ⚙️ Installation & Database Setup

Follow these exact steps to deploy and run this application on your local workspace.

### Prerequisites
Make sure you have the following installed on your machine:
* **Node.js** (v18.0.0 or higher)
* **PostgreSQL Database Server**

---

### Step 1: Database Setup

Ensure PostgreSQL is running on your machine. Start a PostgreSQL shell or GUI editor (e.g., pgAdmin, Postico) and execute:

```sql
CREATE DATABASE url_shortener;
```

---

### Step 2: Clone and Install Dependencies

Navigate to your workspace directory and install all node modules:

```bash
# Navigate to project directory
cd url-shortner

# Install package dependencies
npm install
```

---

### Step 3: Setup Configuration Files

Create a file named `.env` in the root of the project directory and populate it with your local postgres server parameters:

```env
PORT=8001
DATABASE_URL=postgres://YOUR_POSTGRES_USER:YOUR_POSTGRES_PASSWORD@localhost:5432/url_shortener
JWT_SECRET=YOUR_SUPER_SECRET_JWT_KEY_99
```

> [!TIP]
> * Ensure you replace `YOUR_POSTGRES_USER` and `YOUR_POSTGRES_PASSWORD` with your actual Postgres credentials!
> * If your database is listening on a port other than `5432`, adjust the connection string accordingly.

---

### Step 4: Database Auto-Migrations

You do **NOT** need to write or run database migrations! On startup, Sequelize automatically checks database state, builds tables, creates required columns, and establishes associations:

* **Sync Mode:** `{ alter: true }` — Synchronizes models without erasing existing data.
* **Auto-Seeding:** The application checks and automatically creates a `GHOST_SYSTEM` account (`system@shorten.io`) during boot to manage public guest links.

---

## 🧩 Configuration (.env)

Here is a full breakdown of the environment configurations:

| Parameter | Type | Required | Default Value | Description |
| :--- | :--- | :--- | :--- | :--- |
| `PORT` | Number | Yes | `8000` | The local port your Express server will bind to. |
| `DATABASE_URL` | String | Yes | *None* | Connection URI `postgres://user:pass@host:5432/db` |
| `JWT_SECRET` | String | Yes | *None* | Cryptographic salt used to sign user web-tokens. |
| `DEFAULT_HOST` | String | No | `localhost:8001` | The default application hostname used to isolate custom domain redirection routing. |

---

## 🚀 Running the Application

### Development Mode (with Live Reloading)
To run the server in development environment using `nodemon`:

```bash
npm run dev
```

On successful boot, you will receive these logs in your terminal:
```text
[nodemon] starting `node index.js`
🚀 Server running on http://localhost:8001
✅ PostgreSQL connected successfully.
✅ Models synchronized with Database.
✅ Ghost System User Created.
✅ System initialized successfully.
```

Open [http://localhost:8001](http://localhost:8001) in your browser to experience the brutalist UI in full effect!

### Production Mode
To run the application in a production environment:

```bash
npm start
```

---

## 📈 Advanced Analytics Details

This application features an incredibly detailed and asynchronous tracker built inside `redirectController.js`. The moment a link is hit, the application extracts the following information:

1. **IP Resolving:** Fetches client IP address. On local development (`127.0.0.1` or `::1`), it automatically mocks a public IP (`1.1.1.1`) to ensure geo charts contain visual details.
2. **GeoIP Extraction:** Translates the client IP offline into `Country` and `City` codes using `geoip-lite`.
3. **Agent Parsing:** Parses User-Agent header using `useragent` to identify the specific `browser family`, `os family`, and classified `device` type (Desktop, Mobile, etc.).
4. **Bot Classification:** Inspects the request headers for common spiders, crawlers, and search engines, storing an `isBot: true` status flag.

```mermaid
sequenceDiagram
    participant User as Visitor
    participant Server as Shorten Server
    participant DB as Postgres Database
    participant Target as Target Destination

    User->>Server: HTTP GET /shortId
    rect rgb(20, 10, 40)
        Note over Server: Read Custom Domain Context
        Note over Server: Check Expiry & Click Cap Limits
    end
    
    alt Link Expired or Capped
        Server-->>User: 410 Expired Page (Brutalist style)
    else Link Valid
        par Async Analytics Capture
            Server->>Server: Extract User Agent, OS, Device & IP
            Server->>Server: Geolocation Country/City mapping
            Server->>DB: INSERT INTO "Visits"
        and Main Thread Redirect
            Server-->>User: 302 Found Redirection
            User->>Target: Land on target page
        end
    end
```

---

## ⚖️ License

> [!CAUTION]
> **PROPRIETARY & CONFIDENTIAL — ALL RIGHTS RESERVED**
> This application, its source code, design system (UI/UX), data structures, and database schemas are strictly proprietary.
>
> * **Zero Unauthorized Usage:** No one else is permitted to run, compile, distribute, or utilize this software or any derivatives.
> * **Zero UI/UX Replication:** Cloning or copying the unique cyber-brutalist theme layout, aesthetic designs, styles, or animation sequences is strictly prohibited.
> * **Zero Data Harvesting:** All schemas and analytics data generated or stored by this software are private and confidential. Unauthorized scraping, extraction, or mapping is fully restricted.
>
> Refer to the full [LICENSE](LICENSE) file in the root directory for legal particulars.

---

## 🧑‍💻 Developer

**Devang Sethi**
* Portfolio: [devangsethi.vercel.app](https://devangsethi.vercel.app)
* GitHub: [@sethidevang](https://github.com/sethidevang)

---
*Built with adrenaline, heavy styling borders, and pure speed.* 🚀
