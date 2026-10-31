# AgentEscrow 🛡️⚡
### *Autonomous Multi-Agent Commerce Protocol with Programmable Milestones, AI Arbitration & PayPal Escrow*

Built for the **PayPal AI Hackathon 2026** (Devpost).  
Targeting **1st Place ($12,000)** & **Best Use of Agentic Commerce ($5,000)**.

---

## 💡 The Problem: The Agent Economy's Trust Deficit

In 2026, autonomous AI agents (OpenAI Swarm, CrewAI, AutoGen, Claude Computer Use) are capable of writing software, analyzing datasets, auditing contracts, and running workflows. 

However, **autonomous AI agents cannot safely transact with other agents or human freelancers without severe risk of fraud, hallucination, or abandonment**:
* If a Buyer Agent pays upfront, the Worker Agent might hallucinate or produce broken, insecure code.
* If a Worker Agent works first without an upfront guarantee, the Buyer Agent might refuse to pay or disappear.
* Handing an autonomous AI an unconstrained corporate credit card is an unacceptable liability.

---

## ⚡ The Solution: `AgentEscrow`

**AgentEscrow is the programmable financial backbone for the Autonomous Agent Economy.**

It connects **PayPal Orders v2 (intent: AUTHORIZE)**, **Captures**, **Disputes**, and **Payouts APIs** with a tripartite Multi-Agent state machine:

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
                                 - Funds locked via Orders v2 (AUTH)
                                 - Conditional release gate active
                                                  │
                                                  ▼
                                      [4. AI ARBITER AGENT]
                                 - Static AST security analysis
                                 - Automated sandbox test suite
                                 - Verifies zero CWE vulnerabilities
                                                  │
                                 ┌────────────────┴────────────────┐
                                 ▼                                 ▼
                         [CASE A: 100% PASS]               [CASE B: FLAW FOUND]
                   - PayPal Captures Authorization   - Triggers Automated Dispute
                   - Instant Payout to Worker        - 100% Refunded to Buyer
                   - Signed Cryptographic Proof      - Zero Loss Incurred
```

---

## 🚀 Key Features

* **Real-Time Multi-Agent Orchestration:** Watch Buyer, Worker, and Arbiter agents negotiate, exchange SHA-256 deliverables, and sign cryptographic release tokens in real time.
* **Dual-Scenario Interactive Demonstrator:**
  * **Scenario 1 (Autonomous Microservice Pass & Payout):** Worker Agent builds a Python FastAPI service. Arbiter runs 6 automated unit tests. 100% pass -> PayPal triggers instantaneous authorization capture and dispatches payout.
  * **Scenario 2 (Security Flaw & Automated Refund):** Worker Agent delivers code with hardcoded credentials and a CWE-89 SQL injection vulnerability. Arbiter intercepts the flaw, blocks release, and PayPal voids the authorization, refunding 100% to the Buyer.
* **PayPal REST v2 Integration:**
  * `POST /v2/checkout/orders` with `intent: 'AUTHORIZE'`.
  * `POST /v2/checkout/orders/{id}/authorize` for escrow lock.
  * `POST /v2/payments/authorizations/{id}/capture` for verified release.
  * `POST /v2/payments/authorizations/{id}/void` for dispute refund.
  * `POST /v1/payments/payouts` for batch disbursement.
* **Zero-Config Sandbox Simulator:** Runs out-of-the-box in simulated sandbox mode with realistic PayPal IDs, or effortlessly connects to live PayPal Sandbox credentials with a `.env.local` toggle.

---

## 🛠️ Tech Stack

* **Framework:** Next.js 15 (App Router, React 19, TypeScript)
* **Styling:** Tailwind CSS v4, Glassmorphism UI
* **Icons & Polish:** Lucide React, Canvas Confetti
* **Payments Engine:** PayPal Server REST v2 & `@paypal/react-paypal-js`
* **Agent Engine:** Deterministic State Machine with AST code evaluation & vulnerability scanner

---

## 📦 Getting Started (Local Development)

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/<your-username>/agent-escrow.git
cd agent-escrow
npm install
```

### 2. Configure Environment (Optional)
The project works immediately in **Zero-Config Simulator Mode**.  
To connect your real PayPal Sandbox credentials:
```bash
cp .env.example .env.local
```
Fill in your credentials from [developer.paypal.com](https://developer.paypal.com):
```env
PAYPAL_CLIENT_ID=your_sandbox_client_id
PAYPAL_CLIENT_SECRET=your_sandbox_client_secret
```

### 3. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Demonstration Walkthrough

1. **Step 1:** Select **"Scenario 1: Code Pass & Payout ($75)"** in the top navigation.
2. **Step 2:** Click **"Run Auto Flow"** or step through with **"Next Step"**.
3. **Step 3:** Watch the **Agent Thought Stream** as the task is negotiated, funds are placed on hold in the **PayPal Escrow Vault**, code is delivered to the sandbox, and the **AI Arbiter** executes the test suite.
4. **Step 4:** Observe the instant **PayPal Capture & Payout** release with celebratory confetti!
5. **Step 5:** Switch to **"Scenario 2: Flaw Detected & Auto-Refund"** to see the AI Arbiter intercept a CWE-89 vulnerability and trigger an automated PayPal void authorization refund.

---

## 📜 License

MIT License — free for open-source development and hackathon evaluation. Built for the **PayPal AI Hackathon 2026**.
