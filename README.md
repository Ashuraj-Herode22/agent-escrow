# AgentEscrow 🛡️⚡
### *Autonomous Multi-Agent Commerce Protocol with Programmable Milestones, AI Arbitration & PayPal Escrow*

Built for the **PayPal AI Hackathon 2026** (Devpost).  
Targeting **Grand Prize ($12,000)**, **Best Use of Agentic Commerce ($5,000)**, and **Postman Sponsor Prize**.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![PayPal REST v2](https://img.shields.io/badge/PayPal-REST%20v2%20(Orders%20%26%20Auth)-003087.svg)](https://developer.paypal.com)
[![Next.js 15](https://img.shields.io/badge/Next.js-15%20(Turbopack)-black.svg)](https://nextjs.org)
[![Postman Collection](https://img.shields.io/badge/Postman-Verified%20Collection-FF6C37.svg)](./postman_collection.json)

---

## 💡 The Problem: The Trust Deficit in Autonomous Agent Commerce

In 2026, autonomous AI agents (CrewAI, AutoGen, LangChain, Claude Computer Use) are capable of writing software, auditing contracts, and running business workflows. Soon, they will autonomously hire each other across the internet.

However, **autonomous AI agents have no safe way to transact with other agents**:
* **If a Buyer Agent pays upfront:** The Worker Agent might hallucinate, produce broken code, leak database passwords, or disappear entirely. The buyer loses 100% of their money.
* **If a Worker Agent delivers first:** The Buyer Agent can copy the output and vanish without paying.
* **Why traditional escrow fails:** Traditional escrow services take 3 business days, require human KYC, and manual wire approvals. Autonomous AI agents operating at millisecond speeds cannot wait days for human bureaucracy.

---

## ⚡ The Solution: `AgentEscrow`

**AgentEscrow is the programmable financial backbone for the Autonomous Multi-Agent Economy.**

It connects **PayPal Orders v2 (`intent: AUTHORIZE`)**, **Conditional Captures**, **Security Voids**, and **Disbursements** with a multi-agent finite state machine:

```
+----------------------------------------------------------------------------------------------------+
|                                    AGENTESCROW PROTOCOL FLOW                                       |
+----------------------------------------------------------------------------------------------------+
                                                  │
                 ┌────────────────────────────────┴────────────────────────────────┐
                 ▼                                                                 ▼
        [1. BUYER AGENT]                                                  [2. WORKER AGENT]
  - Broadcasts Task Spec & Milestones                               - Bids with SLA & Price
  - Approves PayPal Escrow Hold                                     - Delivers Digitally Signed Code
                 │                                                                 │
                 └────────────────────────────────┬────────────────────────────────┘
                                                  ▼
                                  [3. PAYPAL PROGRAMMABLE ESCROW]
                                 - Funds locked via Orders v2 (intent: AUTHORIZE)
                                 - Conditional release gate active
                                                  │
                                                  ▼
                                      [4. AI ARBITER AGENT]
                                 - Static AST security analysis
                                 - Automated sandbox test suite
                                 - Verifies CWE-89 & credential safety
                                                  │
                                 ┌────────────────┴────────────────┐
                                 ▼                                 ▼
                         [CASE A: 100% PASS]               [CASE B: FLAW FOUND]
                   - PayPal Captures Authorization   - Triggers Instant Void
                   - Payout Disbursed to Worker      - 100% Refunded to Buyer
                   - Cryptographic Proof Issued      - Zero Loss Incurred
```

---

## 🚀 Key Features

* **Real-Time Multi-Agent Orchestration:** Watch Buyer, Worker, and Arbiter agents negotiate, exchange SHA-256 deliverables, and sign cryptographic release tokens in real time.
* **Dual-Scenario Interactive Demonstrator:**
  * **Scenario 1 (Autonomous Microservice Pass & Payout):** Worker Agent builds a Python FastAPI service. Arbiter runs 6 automated unit tests. 100% pass -> PayPal triggers instantaneous authorization capture and dispatches payout.
  * **Scenario 2 (Security Flaw & Automated Refund):** Worker Agent delivers code with hardcoded credentials and a CWE-89 SQL injection vulnerability. Arbiter intercepts the flaw, blocks release, and PayPal voids the authorization, refunding 100% to the Buyer.
* **Live `+ Custom Task` Requisition:** Type any prompt (or choose presets) to trigger live AI code synthesis (Gemini 1.5 Flash Free Tier) and real-time arbitration.
* **Interactive Developer SDKs (`sdk/`):**
  * **Python SDK:** Drop-in client for CrewAI, AutoGen, and LangChain.
  * **TypeScript SDK:** Drop-in client for LangChain.js and Vercel AI SDK.
  * **Headless REST API (`curl`):** Public requisition endpoint responding in sub-5ms.
* **Postman Collection (`postman_collection.json`):** Verified Postman collection documenting all endpoints for testing.
* **Official PayPal REST v2 Engine:** Native integration with `checkout/orders`, `payments/authorizations`, conditional `capture`, and instant `void`.
* **Zero-Config Sandbox Simulator:** Runs out-of-the-box in simulated sandbox mode with realistic PayPal IDs, or effortlessly connects to live PayPal Sandbox credentials with a `.env.local` toggle.

---

## 🛠️ Tech Stack & 100% Free Tier Architecture

* **Framework:** Next.js 15 (App Router, Turbopack, TypeScript)
* **Styling:** Tailwind CSS v4, Enterprise Light Palette (Navy `#003087`, Vibrant Blue `#0070BA`)
* **Payments Engine:** PayPal Server REST v2 & `@paypal/react-paypal-js`
* **AI Engine:** Google Gemini 1.5 Flash (100% Free Tier) with offline procedural AST fallback
* **Security & Testing Engine:** Deterministic AST parser with CWE-89 SQL injection detection & secret masking
* **Developer SDKs:** Python 3 (`requests`) & TypeScript (`fetch`)

---

## 📦 Getting Started (Local Development in 60 Seconds)

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/<your-username>/agent-escrow.git
cd agent-escrow
npm install
```

### 2. Run the Development Server (Zero-Config, No Keys Needed!)
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

> [!NOTE]
> The application runs immediately in **Zero-Config Simulator Mode** without requiring any paid API keys or sandbox accounts. If you want to connect your live PayPal Developer sandbox credentials, simply copy `.env.example` to `.env.local` and add your `PAYPAL_CLIENT_ID` and `PAYPAL_CLIENT_SECRET`.

---

## 🧪 Demonstration Walkthrough for Judges

1. **Step 1:** In the top navbar, select **"Scenario 1: Verified Payout ($75)"**.
2. **Step 2:** Click **"Run Flow"** and watch the agents execute step-by-step. Notice the funds locked in the **Escrow Vault**, code delivered to the **Verification Sandbox**, and the instant **PayPal Capture Payout** with victory confetti!
3. **Step 3:** Switch to **"Scenario 2: Flaw Refund ($120)"** and click **"Run Flow"**. Observe the AI Arbiter intercept a **CWE-89 SQL Injection**, quarantine the deliverable, and trigger an automated PayPal **Void Authorization** refunding 100% of the funds to the buyer.
4. **Step 4:** Click **"+ Custom Task"** to dispatch your own custom prompt to the AI agent network.
5. **Step 5:** Click **"SDK & API"** to inspect the 3-line Python/TypeScript SDK snippets and copy the live `curl` test command.

---

## 📜 License

MIT License — free for open-source development and hackathon evaluation. Copyright (c) 2026 Ashuraj Herode.
