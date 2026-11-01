# AgentEscrow 🛡️⚡
### *The Autonomous Multi-Agent Commerce & Settlement Protocol*

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel%20Production-0070BA?style=for-the-badge&logo=vercel&logoColor=white)](https://agent-escrow-seven.vercel.app/)
[![GitHub Repository](https://img.shields.io/badge/GitHub-Ashuraj--Herode22%2Fagent--escrow-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Ashuraj-Herode22/agent-escrow)
[![PayPal REST v2](https://img.shields.io/badge/PayPal-Orders%20v2%20%7C%20Two--Phase%20Auth-003087?style=for-the-badge&logo=paypal&logoColor=white)](https://developer.paypal.com)
[![Next.js 16](https://img.shields.io/badge/Next.js-16%20Turbopack-black?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![TypeScript 5](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald?style=for-the-badge)](https://opensource.org/licenses/MIT)

*An open-source financial protocol enabling trustless milestone escrow, AST security arbitration, and deterministic settlement for autonomous multi-agent economies.*

---

## 📌 Executive Summary

> **"Autonomous multi-agent milestone escrow on PayPal: locks funds, halts exploits via AI Arbiter AST scans, enables 3-attempt self-healing cure loops, and releases payouts with zero counterparty risk."**

In 2026, autonomous AI agent swarms (CrewAI, AutoGen, LangChain, Claude Computer Use) are capable of writing software, auditing contracts, and procuring services across the open internet. However, **they cannot safely pay one another**. 

If a buyer agent pays upfront, a hallucinating or malicious worker can abscond with funds. If a worker delivers upfront, a rogue buyer agent can harvest the code and refuse settlement. Traditional human escrow takes 3 to 5 business days and requires manual KYC paperwork—completely unviable for autonomous agentic micro-economies operating in milliseconds.

**AgentEscrow bridges this trust deficit.** By combining **PayPal Orders v2 two-phase authorizations (`intent: 'AUTHORIZE'`)**, **deterministic Abstract Syntax Tree (AST) cyber-defense arbitration**, and **autonomous self-healing cure loops**, AgentEscrow guarantees zero-loss settlement for every autonomous agent requisition.

---

## 🌐 Live Deployments & Key Links

| Resource | Direct Link | Description |
| :--- | :--- | :--- |
| **🚀 Production Web App** | [https://agent-escrow-seven.vercel.app/](https://agent-escrow-seven.vercel.app/) | Live interactive protocol dashboard running on Vercel Edge |
| **📦 GitHub Repository** | [https://github.com/Ashuraj-Herode22/agent-escrow](https://github.com/Ashuraj-Herode22/agent-escrow) | Complete open-source codebase, SDKs, and sandbox configs |
| **📜 Devpost Submission Story** | [DEVPOST_SUBMISSION_READY.md](./DEVPOST_SUBMISSION_READY.md) | Full project narrative with LaTeX mathematical release model |
| **📬 Postman Collection** | [postman_collection.json](./postman_collection.json) | Verified Postman collection documenting all REST endpoints |
| **🐍 Python SDK** | [sdk/python/](./sdk/python/) | Drop-in escrow client for CrewAI, AutoGen, and LangChain |
| **⚡ TypeScript SDK** | [sdk/typescript/](./sdk/typescript/) | Drop-in client for LangChain.js, Vercel AI SDK, and Node.js |

---

## 🏗️ Protocol Architecture & State Machine

```
                                    +------------------------------------------------+
                                    |         AGENTESCROW PROTOCOL LIFECYCLE         |
                                    +------------------------------------------------+
                                                           |
                          +--------------------------------+--------------------------------+
                          |                                                                 |
                          v                                                                 v
              +-----------------------+                                         +-----------------------+
              |    1. BUYER AGENT     |                                         |    2. WORKER AGENT    |
              |  - Requisitions Task  |                                         |  - Submits SLA & Bid  |
              |  - Deposits Milestones|                                         |  - Synthesizes Code   |
              +-----------+-----------+                                         +-----------+-----------+
                          |                                                                 |
                          v                                                                 |
         +----------------------------------+                                               |
         |  PAYPAL TWO-PHASE ESCROW VAULT   |                                               |
         |  Orders v2 (intent: AUTHORIZE)   |<----------------------------------------------+
         |  Funds locked in escrow vault    |
         +----------------+-----------------+
                          |
                          v
         +----------------------------------+
         |      3. AI ARBITER AGENT         |
         |  - SHA-256 deliverable audit     |
         |  - Deterministic AST analyzer    |
         |  - Scans for CWE-89 & CWE-798    |
         +----------------+-----------------+
                          |
             +------------+------------+
             |                         |
    [Policy Passes]            [Exploit / Bug Detected]
             |                         |
             v                         v
+-------------------------+   +------------------------------------+
| DETERMINISTIC CAPTURE   |   | AUTONOMOUS CURE REMEDIATION LOOP   |
| - PayPal Capture v2     |   | - Intercepts CWE-89 injection      |
| - Funds disbursed       |   | - Issues diagnostic diff to Worker |
| - Settlement finalized  |   | - Attempt counter increments (≤ 3) |
+-------------------------+   +-----------------+------------------+
                                                |
                               +----------------+----------------+
                               |                                 |
                     [Worker Auto-Patches]             [Quota Exhausted (3/3)]
                               |                                 |
                               v                                 v
                  +-------------------------+       +-------------------------+
                  | Re-scan passes gate     |       | DETERMINISTIC VOID      |
                  | Funds released cleanly  |       | - PayPal Void Auth v2   |
                  | Zero counterparty risk  |       | - 100% Refunded to Buyer|
                  +-------------------------+       +-------------------------+
```

---

## 📐 Formal Mathematical Release Model

The protocol enforces mathematical certainty over deliverable acceptance. A deliverable $\mathcal{D}$ can trigger PayPal authorization capture if and only if the logical release predicate evaluates to true:

$$\text{Release}(\mathcal{D}) = \left(\bigwedge_{i=1}^n T_i(\mathcal{D}) == 1\right) \wedge \left(\text{AST\_Flaws}(\mathcal{D}) == \emptyset\right) \wedge \left(\text{Attempts} \le 3\right)$$

Where:
* $T_i(\mathcal{D}) \in \{0, 1\}$ represents the deterministic binary outcome of test assertion $i \in \{1, \dots, n\}$.
* $\text{AST\_Flaws}(\mathcal{D})$ is the set of intercepted security violations:
  $$\text{AST\_Flaws}(\mathcal{D}) = \left\{ c \in \text{CWE} \mid c \in \{\text{CWE-89 (SQLi)}, \text{CWE-798 (Hardcoded Keys)}\} \right\}$$
* $\text{Attempts} \le 3$ guarantees finite termination of the self-healing cure window, preventing infinite billing loops.

---

## 🛡️ Core Pillars & Innovations

### 1. Programmable Milestone Escrow (PayPal Orders v2)
Unlike naive architectures that charge a credit card immediately, AgentEscrow utilizes PayPal's two-phase settlement:
* **Authorization Phase:** The Buyer Agent issues `POST /v2/checkout/orders` with `intent: 'AUTHORIZE'`. Funds are reserved and verified on PayPal's balance sheet without charging intermediate merchant fees.
* **Capture Phase:** Upon verified milestone completion, the AI Arbiter issues `POST /v2/payments/authorizations/{id}/capture` to disburse funds.
* **Dispute Void:** If arbitration fails, `POST /v2/payments/authorizations/{id}/void` releases the hold instantly with zero manual dispute overhead.

### 2. Deterministic AST Cyber Defense
Deliverables are parsed into Abstract Syntax Trees before execution:
* **CWE-89 Interception:** Catches unparameterized string concatenations inside database query drivers (`sqlite3.execute(f"SELECT ...")`).
* **CWE-798 Secret Leakage:** Regex and entropy filters flag exposed API keys, private tokens, and credentials (`paypal_client_secret_live_...`).

### 3. Autonomous 3-Attempt Self-Healing Cure Loop
When an exploit or regression is detected, the protocol does not immediately collapse:
1. The Arbiter generates a structured JSON diagnostic report with line numbers and security rubrics.
2. The Worker Agent reads the diagnostic remediation guidelines and produces an automated patch.
3. If repaired on Attempt 2 or 3, funds release normally. If all 3 attempts fail, the authorization is automatically voided and the buyer is 100% refunded.

### 4. Zero-Counterparty Risk Settlement
Neither party can cheat:
* The Worker Agent cannot steal the deposit without passing test suites.
* The Buyer Agent cannot cancel the authorization once clean code is submitted.
* Settlement is executed on PayPal's FDIC-insured banking rails.

---

## 🎮 Built-in Scenarios & Custom Requisition

The web application includes 3 interactive built-in flows plus a dynamic live synthesizer:

| Scenario | Flow Type | Milestone | Mechanism & Result |
| :--- | :--- | :--- | :--- |
| **1. Verified Payout** | `SUCCESS_FLOW` | $75.00 USD | Clean code passes 6/6 tests on Attempt 1 $\rightarrow$ instant PayPal capture & release. |
| **2. Self-Healing Patch** | `HEALING_FLOW` | $120.00 USD | CWE-89 SQL injection caught on Attempt 1 $\rightarrow$ Worker auto-patches on Attempt 2 $\rightarrow$ release verified. |
| **3. Quota Exhausted Refund** | `DISPUTE_FLOW` | $120.00 USD | Flawed deliverable fails all 3 cure attempts $\rightarrow$ authorization voided $\rightarrow$ 100% refund to Buyer. |
| **✨ Custom Task Requisition** | `CUSTOM_FLOW` | Dynamic | Commission any bespoke task; invokes Google Gemini 1.5 Flash for live code synthesis and live sandbox hold creation. |

---

## 💻 Developer SDKs & Integration

AgentEscrow provides native SDKs in Python and TypeScript for drop-in integration into multi-agent frameworks.

### Python SDK (`sdk/python/`)
Ideal for **CrewAI**, **AutoGen**, and **LangChain**:

```python
from agent_escrow import AgentEscrowClient

# Initialize client
client = AgentEscrowClient(base_url="https://agent-escrow-seven.vercel.app")

# 1. Buyer Agent initiates escrow hold
hold = client.create_requisition(
    task_name="Distributed Vector Cache",
    budget_usd=150.00,
    milestones=["FastAPI Endpoint", "Redis Cache Adapter", "100% Test Coverage"],
    auto_authorize=True
)
print(f"PayPal Order Authorized: {hold.order_id} (Status: {hold.status})")

# 2. Worker Agent delivers code
result = client.submit_deliverable(
    order_id=hold.order_id,
    source_code="def query(sql, params): return db.execute(sql, params)",
    sha256_hash="e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
)

# 3. Inspect AI Arbiter verdict
if result.passed:
    print(f"Funds captured! PayPal Capture ID: {result.capture_id}")
else:
    print(f"Cure loop triggered. Diagnostic: {result.diagnostic}")
```

### TypeScript SDK (`sdk/typescript/`)
Ideal for **LangChain.js**, **Vercel AI SDK**, and Next.js backend workers:

```typescript
import { AgentEscrowClient } from './sdk/typescript/agent-escrow';

const escrow = new AgentEscrowClient({
  baseUrl: 'https://agent-escrow-seven.vercel.app',
});

// Commission autonomous task with PayPal escrow protection
const contract = await escrow.createContract({
  title: 'Microservice JWT Verifier',
  amountUSD: 75.00,
  buyerAgentId: 'agent-buyer-001',
  workerAgentId: 'agent-worker-python',
  securityPolicy: 'OWASP_TOP_10_STRICT',
});

console.log('Contract active in PayPal Vault:', contract.orderId);
```

### Headless REST API (`cURL`)
Any autonomous microservice can interact directly via HTTP:

```bash
# Authorize a new milestone hold
curl -X POST https://agent-escrow-seven.vercel.app/api/v1/escrow/requisition \
  -H "Content-Type: application/json" \
  -d '{
    "taskName": "Autonomous PyTest Suite",
    "budgetUSD": 120.00,
    "milestones": ["AST Validation", "Zero Vulnerabilities"]
  }'
```

---

## ⚡ PayPal Webhook Listener

AgentEscrow includes an enterprise webhook receiver at `/api/paypal/webhook` to handle asynchronous events dispatched by PayPal's sandbox:

* `CHECKOUT.ORDER.APPROVED` $\rightarrow$ Transitions escrow contract to `ESCROW_LOCKED`.
* `PAYMENT.AUTHORIZATION.CREATED` $\rightarrow$ Triggers Arbiter AST verification.
* `PAYMENT.CAPTURE.COMPLETED` $\rightarrow$ Finalizes payout to Worker Agent.
* `PAYMENT.AUTHORIZATION.VOIDED` $\rightarrow$ Confirms 100% refund back to Buyer Agent.

---

## 🛠️ Tech Stack & 100% Free Tier Architecture

* **Framework:** Next.js 16 (Turbopack, App Router, React 19)
* **Language:** TypeScript 5.0 (Strict mode, zero `any`)
* **Styling:** Tailwind CSS v4, Executive Slate & Deep Navy palette
* **Payments Engine:** PayPal Orders & Authorizations REST API v2
* **Webhooks:** Next.js Route Handler with sub-10ms response time
* **AI Engine:** Google Gemini 1.5 Flash (100% Free Tier) with offline procedural fallback
* **Arbitration:** Deterministic AST parser with CWE-89 & CWE-798 rulesets
* **Hosting:** Vercel Edge Network (Global CDN)

---

## 🚀 Local Development Setup (60 Seconds)

### 1. Clone & Install
```bash
git clone https://github.com/Ashuraj-Herode22/agent-escrow.git
cd agent-escrow
npm install
```

### 2. Configure Environment
Create a `.env.local` file in the root directory:
```bash
cp .env.example .env.local
```

Populate with your credentials (or leave defaults for offline simulated mode):
```env
# PayPal Sandbox Credentials (get yours at developer.paypal.com)
PAYPAL_CLIENT_ID=AYGEq0MD2P_g_r9a4Hw2F7Wk4X6yM5s8b8n3v2
PAYPAL_CLIENT_SECRET=EOrN_B8c9_sample_secret_key_here
PAYPAL_MODE=sandbox

# Gemini AI (Free Tier from aistudio.google.com)
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Repository Structure

```
agent-escrow/
├── DEVPOST_SUBMISSION_READY.md    # Ready-to-paste Devpost submission story
├── DEMO_VIDEO_SCRIPT.md           # 3-minute video recording script
├── postman_collection.json        # Verified REST API test collection
├── public/
│   ├── devpost_thumbnail.png      # 1200x800 crisp 3:2 Devpost thumbnail
│   └── thumbnail_3d.jpg           # 1200x800 3D cryptographic escrow vault
├── sdk/
│   ├── python/                    # Python SDK for CrewAI / AutoGen / LangChain
│   └── typescript/                # TypeScript SDK for Vercel AI SDK
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── agent/custom-task/ # Gemini 1.5 Flash task synthesis endpoint
│   │   │   ├── paypal/orders/     # PayPal v2 Order hold & capture handlers
│   │   │   ├── paypal/webhook/    # Asynchronous webhook event listener
│   │   │   └── v1/escrow/         # Headless microservice REST API
│   │   ├── page.tsx               # Primary protocol dashboard
│   │   └── layout.tsx             # Root layout & font configuration
│   ├── components/                # Minimalist, executive UI components
│   │   ├── Header.tsx             # Protocol selector & action ribbon
│   │   ├── EscrowRibbon.tsx       # PayPal balance vault & financial metrics
│   │   ├── LiveAgentWorkspace.tsx # Multi-agent terminal & code inspector
│   │   └── ArbiterInspector.tsx   # AST vulnerability analysis modal
│   ├── lib/
│   │   ├── agent-engine.ts        # Finite State Machine & scenario presets
│   │   ├── paypal-client.ts       # Official PayPal REST v2 client
│   │   └── ast-analyzer.ts        # Static analysis & CWE exploit interceptor
│   └── types/
│       └── escrow.ts              # Strict TypeScript domain interfaces
└── README.md                      # Enterprise documentation
```

---

## 🔒 Security & Custody Assurance

* **Non-Custodial Escrow:** AgentEscrow never holds user or agent funds on intermediate servers. 100% of escrow balances reside inside PayPal's FDIC-insured banking infrastructure.
* **Deterministic Termination:** Every transaction is governed by a finite state machine that guarantees resolution in $\le 3$ attempts, eliminating hanging authorizations or zombie funds.
* **Cryptographic Release Tokens:** Payouts require dual SHA-256 signatures from the Buyer's spec hash and the Arbiter's audit receipt.

---

## 📄 License & Credits

Distributed under the **MIT License**. See `LICENSE` for details.

Engineered by **[Ashuraj Herode](https://github.com/Ashuraj-Herode22)** for the **PayPal AI Hackathon 2026**.
