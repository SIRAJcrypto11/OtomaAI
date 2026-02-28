# NEXUS AI — Agent Orchestrator v2.1

![NEXUS AI Banner](https://via.placeholder.com/1200x400/0f172a/ffffff?text=NEXUS+AI+Agent+Orchestrator)

**NEXUS AI Agent Orchestrator** is an enterprise-grade AI-as-a-Service orchestration platform. It is designed to act as the autonomous brain for businesses, capable of seamlessly connecting LLMs (Large Language Models) like Google Gemini and Groq with real-world communication channels (WhatsApp, Telegram) through a powerful visual and programmatic interface.

## 🚀 Key Features

### 1. The Autonomous Orchestrator Brain
- **BYOK (Bring Your Own Key) Architecture:** Securely connect and switch between leading LLM providers (Google Gemini, Groq/Mixtral) on the fly without changing core logic.
- **ReAct Planning Framework:** Agents don't just reply; they *Reason* and *Act*, following complex multi-step workflows.
- **Dual-Layer Memory System:**
  - **Edge Cache:** Upstash Redis for ultra-fast, sub-millisecond conversation context retrieval.
  - **Permanent Archive:** Vercel Postgres for robust, structured history tracking and long-term analytics.

### 2. Multi-Channel Connectivity
- **WhatsApp Headless Integration:** Powered by `@whiskeysockets/baileys`, allowing your agents to interact directly with WhatsApp users natively.
- **Telegram Bot API:** Secure Webhook routing capable of handling thousands of simultaneous user interactions.
- **Cloudinary AI Vision Pipeline:** Built-in media handling for processing images securely under tight infrastructure costs.

### 3. Premium Operator Dashboards
- **Visual Workflow Builder:** A React Flow (`@xyflow/react`) powered drag-and-drop canvas to orchestrate AI agent pipelines without writing code.
- **Role-Based Access Control (RBAC):** NextAuth.js v5 protected routes.
  - **Super Admin:** Global platform analytics, cross-workspace monitoring.
  - **Workspace Owner:** Tenant-level billing estimates, team management, and agent deployment limits.
  - **Operator:** Locked-in views for monitoring specific active agent logs and handling recent conversation history.
- **Real-Time Data Analytics:** Server-side SQL aggregations fetching precise data from Vercel Postgres for active performance insights.

## 🏗️ Architecture Stack

- **Framework:** Next.js 14 (App Router, Server Components, Server Actions)
- **Styling:** Tailwind CSS + shadcn/ui (Google-Standard Premium Aesthetics)
- **Database:** Vercel Postgres (SQL)
- **Caching:** Upstash Redis
- **Authentication:** NextAuth.js v5 (Google OAuth + Credentials)
- **Visuals/Routing:** `@xyflow/react`, `lucide-react`
- **Infrastructure:** Designed for Vercel Edge & Serverless Deployment

---

## 🌐 Credits & Acknowledgments

This project was built with ❤️ by the team at **[SNISHOP](https://snishop.com/)**.

### Lead Architect
**Siraj Nur Ihrom**
- Portfolio: [https://sirajnurihrom.vercel.app/](https://sirajnurihrom.vercel.app/)
- GitHub: [SIRAJcrypto11](https://github.com/SIRAJcrypto11/OtomaAI)

## 🛠️ Usage

1. Clone the repository: `git clone https://github.com/SIRAJcrypto11/OtomaAI.git`
2. Install dependencies: `npm install`
3. Configure Environment Variables: Copy `.env.example` to `.env.local` and fill in your Vercel Postgres URL, Auth Secret, and LLM API Keys.
4. Run the development server: `npm run dev`
5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---
© 2026 OtomaAI (NEXUS AI). All rights reserved.
