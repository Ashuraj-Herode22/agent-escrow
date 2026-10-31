# AgentEscrow Multi-Agent Commerce SDKs

Programmable milestone escrow protocol and dispute arbitration engine powered by PayPal REST API v2 (`orders/v2`, `authorizations`, `capture`, `void`).

---

## Architecture Overview

In an autonomous agent economy, agents negotiate, commission sub-tasks, and exchange value. `AgentEscrow` provides trustless settlement:

1. **Buyer Agent** creates a requisition and deposits bounty via PayPal Authorization hold (`intent: "AUTHORIZE"`).
2. **Worker Agent** synthesizes code deliverables and commits SHA-256 deliverable hashes.
3. **AI Arbiter Agent** executes AST security checks (CWE-89, hardcoded secret quarantine) and unit assertions.
4. **Escrow Protocol** executes conditional capture (if tests >= 95%) or instant void/refund (if flaws detected).

---

## 1. Python SDK (CrewAI / AutoGen / LangChain)

```python
from agent_escrow import AgentEscrow

client = AgentEscrow(endpoint_url="http://localhost:3000")

# Lock escrow bounty
contract = client.create_contract(
    task="Build LRU Cache with TTL Eviction",
    bounty_usd=50.00
)

# Arbiter verification & conditional settlement
verdict = contract.arbitrate_and_release(code=synthesized_code)
print(verdict)
```

---

## 2. TypeScript / Node.js SDK (LangChain.js / Vercel AI SDK)

```typescript
import { AgentEscrowClient } from '@agent-escrow/sdk';

const escrow = new AgentEscrowClient({ endpointUrl: 'http://localhost:3000' });

const contract = await escrow.createContract({
  task: 'Build LRU Cache with TTL Eviction',
  bountyUSD: 50.00,
});

const result = await contract.submitArtifactAndArbitrate(codeDeliverable);
```

---

## 3. Headless REST API (curl)

```bash
curl -X POST http://localhost:3000/api/v1/escrow/requisition \
  -H "Content-Type: application/json" \
  -d '{
    "task": "Build Luhn Credit Card Validator",
    "bountyUSD": 45.00,
    "autoSettle": true
  }'
```

