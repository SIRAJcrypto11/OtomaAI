<div align="center">
  <img alt="NEXUS AI Logo" src="https://via.placeholder.com/150x150/0f172a/ffffff?text=NEXUS" width="120" />
  <h1>NEXUS AI Agent Orchestrator</h1>
  <p><strong>Enterprise-Grade Autonomous AI Orchestration Platform</strong></p>

  <p>
    <a href="#about"><img src="https://img.shields.io/badge/Next.js-14.2%2B-black?style=flat-square&logo=next.js" alt="Next.js" /></a>
    <a href="#about"><img src="https://img.shields.io/badge/Database-PostgreSQL-336791?style=flat-square&logo=postgresql" alt="PostgreSQL" /></a>
    <a href="#about"><img src="https://img.shields.io/badge/Auth-NextAuth-purple?style=flat-square&logo=next.js" alt="NextAuth" /></a>
    <a href="#license"><img src="https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square" alt="License" /></a>
  </p>
</div>

## 📑 Table of Contents
- [About the Project](#-about-the-project)
- [Core Architecture & Features](#-core-architecture--features)
  - [The Orchestrator Brain](#1-the-orchestrator-brain-react)
  - [Omnichannel Integrations](#2-omnichannel-integrations)
  - [Enterprise Dashboards](#3-enterprise-level-dashboards--ui)
- [Technology Stack](#-technology-stack)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Database Setup](#database-setup)
- [Deployment](#-deployment)
- [Credits & Acknowledgments](#-credits--acknowledgments)
- [License](#-license)

---

## 🚀 About the Project

**NEXUS AI** is a production-ready, multi-tenant AI Agent Orchestration platform. It empowers businesses to deploy autonomous AI agents that can reason, remember, and act across various communication channels like WhatsApp and Telegram. 

Unlike basic chatbot wrappers, NEXUS AI operates on a robust **ReAct (Reason + Act)** framework, allowing agents to execute complex workflows, query databases, and utilize customized toolsets. Built on the Next.js App Router, the platform features a visually stunning, role-based dashboard for managing workspaces, tracking advanced analytics, and architecting agent behaviors via a drag-and-drop workflow builder.

---

## ✨ Core Architecture & Features

### 1. The Orchestrator Brain (ReAct)
*   **BYOK (Bring Your Own Key) Engine:** Seamlessly toggle between top-tier Language Models. Built-in, natively secure support for **Google Gemini 1.5 Pro** and high-speed **Groq (Llama 3 / Mixtral)** inference.
*   **True Autonomous ReAct Loop:** Agents do not merely stream text; they parse intents, decide on actions (tool calling), execute tasks, observe the results, and formulate optimized responses.
*   **Dual-Layer Memory Architecture:**
    *   **Hot Memory (Edge Cache):** Utilizes **Upstash Redis** for sub-millisecond conversation context retrieval, preventing latency bottlenecks during heavy I/O.
    *   **Cold Storage (Archive):** Persists all granular conversation metadata, execution logs, and token usage into **Vercel Postgres** for historical auditing and compliance.

### 2. Omnichannel Integrations
*   **WhatsApp Native (Baileys):** Fully integrated `@whiskeysockets/baileys` headless worker capable of translating WhatsApp matrix protocols directly into Agent intents.
*   **Telegram Webhooks:** Enterprise-grade secure webhooks capable of load-balancing thousands of simultaneous bot interactions.
*   **Cloudinary Vision Pipeline:** Built-in AI media handlers for interpreting images and returning vision-based context directly into the agent's memory stream.

### 3. Enterprise-Level Dashboards & UI
*   **Singularity Design Standard:** A jaw-dropping, premium aesthetic utilizing Tailwind CSS, custom animations, and Radix UI composites (`shadcn/ui`).
*   **Role-Based Access Control (RBAC):** NextAuth v5 enforced JWT sessions.
    *   **Super Admin:** Unrestricted global visibility across all tenants.
    *   **Workspace Owner:** Total control over tenant limits, billing estimates, and deployed agent models.
    *   **Operator:** Locked, distraction-free views focusing strictly on agent supervision and human-handoff logs.
*   **Visual Workflow Builder:** A no-code, drag-and-drop canvas powered by `React Flow` to map out conditional agent logic and tool chains.
*   **Live SQL Analytics:** Real-time data aggregations mapping latency trajectories, success rates, and active token expenditures entirely server-side.

---

## 🛠️ Technology Stack

| Category | Technology | Description |
| :--- | :--- | :--- |
| **Framework** | Next.js 14+ | App Router, Server Components, Server Actions |
| **Language** | TypeScript | Strictly typed end-to-end |
| **Styling** | Tailwind CSS | Utility-first css framework |
| **UI Components** | shadcn/ui | Accessible, customizable components |
| **Database** | Vercel Postgres | Scalable Serverless SQL |
| **Cache & Queue** | Upstash Redis | Low-latency memory and state management |
| **Authentication**| NextAuth.js (v5) | Secure Credentials & OAuth integration |
| **Visual Node Editor**| React Flow | For rendering the no-code Agent Builder |
| **Security** | AES-256-GCM | Encrypted storage for sensitive BYOK API Keys |

---

## 🏁 Getting Started

Follow these instructions to set up the project locally.

### Prerequisites
*   Node.js (v18.17 or newer)
*   npm, pnpm, or yarn
*   A [Vercel](https://vercel.com) account (for Postgres DB)
*   An [Upstash](https://upstash.com) account (for Redis)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/SIRAJcrypto11/OtomaAI.git
   cd OtomaAI
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   pnpm install
   ```

### Environment Variables

Create a `.env.local` file in the root directory. You will need to provision the following keys from your respective providers.

```env
# Authentication (NextAuth)
AUTH_SECRET="your-32-character-secure-random-string"

# Database (Vercel Postgres)
POSTGRES_URL="postgresql://user:password@host/database"

# Memory Layer (Upstash Redis)
UPSTASH_REDIS_REST_URL="https://your-upstash-url.upstash.io"
UPSTASH_REDIS_REST_TOKEN="your-upstash-token"

# Default LLM Providers (BYOK overrides these later)
GEMINI_API_KEY="your-google-gemini-key"
GROQ_API_KEY="your-groq-api-key"

# Media Pipeline (Cloudinary)
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

### Database Setup

The platform utilizes Vercel Postgres. Ensure your `POSTGRES_URL` is set, and the system's dynamic Server Actions will automatically build the necessary schemas (`users`, `agents`, `messages`, `usage_logs`, `templates`) upon first execution or sign-up.

### Running the Application

```bash
npm run dev
# or
pnpm dev
```
The application will be available at `http://localhost:3000`.

---

## 🌩️ Deployment

NEXUS AI is specifically optimized for Edge and Serverless architectures. The recommended deployment platform for the Dashboard and Orchestrator core is **Vercel**.

### Standard Vercel Deployment
1. Push your code to your GitHub repository.
2. Import the project into your Vercel Dashboard.
3. Attach the **Vercel Postgres** add-on directly to the project.
4. Add all environment variables listed above to the Vercel Project Settings.
5. Deploy! Next.js Turbopack will compile and optimize the production build.

### ⚠️ Critical Production Considerations (Serverless Limits)

While the Next.js Dashboard, Postgres Database, and RESTful Agents run perfectly on Vercel, there is a known architectural limitation regarding the **WhatsApp Web integration (`@whiskeysockets/baileys`)**:

*   **The Limitation**: Baileys requires a persistent, always-on WebSocket connection to maintain the WhatsApp Web session. Vercel Serverless Functions execute on-demand and are killed strictly after 10-60 seconds of inactivity to save costs.
*   **The Result**: If you run the Baileys worker directly inside Vercel, the WhatsApp connection will constantly drop and require re-authentication (QR code scanning) every few minutes.
*   **The Enterprise Solution**: Deploy the Next.js Dashboard on **Vercel** for the UI and DB logic, but extract and deploy the WhatsApp Baileys worker script to an always-on server environment such as a **VPS, Render, or Railway**. The persistent worker can then communicate with your Vercel Orchestrator via REST API or standard Webhooks.

### Mandatory Environment Keys for First Deploy
Before hitting "Deploy" on Vercel, if you omit these keys from the Vercel Settings, the app will crash with an HTTP `500` error:
- `POSTGRES_URL` (Auto-generated if using Vercel Postgres Add-on)
- `AUTH_SECRET` (Run `npx auth secret` locally or generate a 32-char string)
- `GEMINI_API_KEY` (Or `GROQ_API_KEY`, otherwise agents cannot generate responses)

---

## 🌐 Credits & Acknowledgments

This project was built with ❤️ by the team at **[SNISHOP](https://snishop.com/)**.

### Lead Architect
**Siraj Nur Ihrom**
- Portfolio: [https://sirajnurihrom.vercel.app/](https://sirajnurihrom.vercel.app/)
- GitHub: [SIRAJcrypto11](https://github.com/SIRAJcrypto11/Converthub)

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for specifics.

---
<div align="center">
  <p>© 2026 ConvertHub (NEXUS AI). Built for the future of automation.</p>
</div>
