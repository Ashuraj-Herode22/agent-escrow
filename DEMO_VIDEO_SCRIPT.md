# AgentEscrow: 2-Minute Winning Hackathon Video Pitch Script

**Target Time:** 1:55 - 2:05 (Optimal for Devpost judges)  
**Tone:** Confident, crisp, technical, visionary.

---

### [0:00 - 0:25] The Problem Hook
* **Visual:** Full-screen title or screen recording of the AgentEscrow UI (`http://localhost:3000`).
* **Voiceover:**  
  *"We are on the verge of the autonomous agent economy. Multi-agent frameworks like CrewAI and AutoGen allow AI agents to browse, code, and hire other agents.*  
  *But there is a fatal flaw in agent commerce: **Trust**.*  
  *If Agent A pays Agent B in advance, Agent B can hallucinate, fail, or inject malicious code. If Agent B delivers first, Agent A can steal the deliverable without paying.*  
  *Meet **AgentEscrow** — the autonomous multi-agent commerce protocol with programmable milestones, AI arbitration, and instant PayPal escrow settlement."*

---

### [0:25 - 0:55] Scenario 1: Successful Verified Payout
* **Visual:** Click **Scenario 1: Verified Payout ($75)** and click **Run Flow**.
* **Voiceover:**  
  *"Here’s how it works. A Buyer Agent commissions a sentiment analysis REST microservice with a $75 bounty.*  
  *Notice our top ribbon: funds are immediately secured inside PayPal's escrow vault using REST v2 Authorizations (`intent: AUTHORIZE`). No funds leave the buyer’s account yet.*  
  *In the middle column, the agents communicate in real time. The Worker Agent synthesizes the Python code, commits it to the sandbox with a SHA-256 hash, and triggers the AI Arbiter.*  
  *The Arbiter runs unit tests, verifies the AST syntax, and issues a 100% compliance score.*  
  *Instantly, the PayPal Authorization is captured, and funds are disbursed to the worker. Complete zero-fraud execution."*

---

### [0:55 - 1:25] Scenario 2: Flaw Intercepted & 100% Buyer Refund
* **Visual:** Toggle to **Scenario 2: Flaw Refund ($120)** and click **Run Flow**.
* **Voiceover:**  
  *"Now let’s look at the real magic: what happens when an agent delivers flawed or malicious work?*  
  *In Scenario 2, an authentication service is commissioned with a $120 bounty.*  
  *The Worker Agent generates code, but attempts to include a raw SQL query and exposed API secrets.*  
  *Our AI Arbiter intercepts this immediately! It flags **CWE-89 SQL Injection**, automatically masks the exposed credential, and blocks the release gate.*  
  *AgentEscrow instantly triggers a PayPal **Void Authorization**. 100% of the funds are refunded to the buyer’s balance with zero loss."*

---

### [1:25 - 1:45] Live Dynamic Custom Task & Developer SDKs
* **Visual:** Click **+ Custom Task**, pick a preset or type a prompt, then click **SDK & API**.
* **Voiceover:**  
  *"This isn't a canned mockup. Anyone can click `+ Custom Task` to dispatch real-time AI prompts powered by Gemini 1.5 Flash.*  
  *And for developers, AgentEscrow includes drop-in Python and TypeScript SDKs and a public headless REST endpoint, allowing any CrewAI, AutoGen, or LangChain agent to create escrow contracts with just 3 lines of code."*

---

### [1:45 - 2:00] Closing & Call to Action
* **Visual:** Hover over the Export Proof certificate or show the clean architecture diagram.
* **Voiceover:**  
  *"Built with 100% free-tier technology, enterprise PayPal REST API v2 architecture, and zero-compromise security.*  
  *AgentEscrow is the financial foundation for the autonomous AI economy. Thank you."*

