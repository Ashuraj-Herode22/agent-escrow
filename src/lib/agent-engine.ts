import { TaskContract, AgentMessage, SimulationPreset } from '@/types/escrow';

export const SIMULATION_PRESETS: Record<string, SimulationPreset> = {
  SUCCESS_FLOW: {
    id: 'SUCCESS_FLOW',
    name: 'Verified Microservice Build & Instant Payout',
    description: 'Buyer Agent commissions a high-performance Python FastAPI service. Worker delivers clean, tested code. Arbiter executes automated test suite -> 100% Pass -> PayPal releases escrow.',
    taskTitle: 'Build Scalable Sentiment Analysis REST Microservice',
    taskDescription: 'Create a standalone Python FastAPI service with /health and /analyze endpoints. Must achieve >90% test coverage and handle edge cases.',
    budgetUSD: 75.00,
    targetOutcome: '100% PASS -> PAYOUT',
  },
  HEALING_FLOW: {
    id: 'HEALING_FLOW',
    name: 'Autonomous Self-Healing Revision & Payout',
    description: 'Worker delivers code with CWE-89 SQL injection on Attempt 1. Arbiter halts payout and issues Revision Notice with remediation diagnostics. Worker self-heals with parameterized query on Attempt 2 -> 100% Pass -> PayPal releases escrow.',
    taskTitle: 'Build User Authentication & Token Service',
    taskDescription: 'Create JWT authentication middleware with password hashing and SQL injection safeguards.',
    budgetUSD: 120.00,
    targetOutcome: 'CWE CAUGHT -> SELF-HEALED -> PAYOUT',
  },
  DISPUTE_FLOW: {
    id: 'DISPUTE_FLOW',
    name: 'Revision Quota Exhausted & 100% Refund',
    description: 'Worker Agent repeatedly fails security policy across all 3 revision attempts. Quota exhausted (3/3) -> Arbiter blocks release -> PayPal voids authorization and refunds Buyer 100%.',
    taskTitle: 'Build Hardened JWT Authentication Service',
    taskDescription: 'Create database authentication layer with strict zero-injection policy.',
    budgetUSD: 120.00,
    targetOutcome: '3/3 FAILED -> VOID & REFUND',
  },
};

export const INITIAL_SUCCESS_CODE = `"""
Sentiment Analysis Microservice
Built autonomously for AgentEscrow Contract #AG-7729
"""
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import re

app = FastAPI(title="AgentEscrow Sentiment Engine", version="1.0.0")

class AnalysisRequest(BaseModel):
    text: str

class AnalysisResponse(BaseModel):
    sentiment: str
    confidence: float
    tokens_analyzed: int

POSITIVE_WORDS = {"excellent", "stellar", "innovative", "fast", "reliable", "great"}
NEGATIVE_WORDS = {"broken", "crash", "terrible", "slow", "vulnerable", "poor"}

@app.get("/health")
def health_check():
    return {"status": "HEALTHY", "engine": "AgentEscrow-v1"}

@app.post("/analyze", response_model=AnalysisResponse)
def analyze_sentiment(payload: AnalysisRequest):
    if not payload.text or not payload.text.strip():
        raise HTTPException(status_code=400, detail="Empty text provided")
    
    words = re.findall(r'\\w+', payload.text.lower())
    pos_count = sum(1 for w in words if w in POSITIVE_WORDS)
    neg_count = sum(1 for w in words if w in NEGATIVE_WORDS)
    
    total = pos_count + neg_count
    if total == 0:
        return AnalysisResponse(sentiment="NEUTRAL", confidence=0.75, tokens_analyzed=len(words))
    
    score = (pos_count - neg_count) / total
    sentiment = "POSITIVE" if score > 0 else "NEGATIVE"
    confidence = round(0.5 + abs(score) * 0.45, 2)
    return AnalysisResponse(sentiment=sentiment, confidence=confidence, tokens_analyzed=len(words))
`;

export const INITIAL_DISPUTE_CODE = `"""
User Authentication Service (Attempt 1 of 3 - In Review)
Submitted for AgentEscrow Contract #AG-8814
"""
import sqlite3
import jwt

# [SECURITY VIOLATION DETECTED: Hardcoded Credential Pattern]
API_SECRET = "[REDACTED_BY_ARBITER_POLICY_SECRET_MASK]"

def authenticate_user(username, password):
    conn = sqlite3.connect("users.db")
    cursor = conn.cursor()
    
    # [CRITICAL SECURITY FLAW CWE-89: Unsanitized SQL Query Interpolation]
    query = f"SELECT id, role FROM accounts WHERE user = '{username}' AND pass = '{password}'"
    cursor.execute(query)
    user = cursor.fetchone()
    
    if user:
        return jwt.encode({"uid": user[0], "role": user[1]}, API_SECRET, algorithm="HS256")
    return None
`;

export const PATCHED_SUCCESS_CODE = `"""
User Authentication Service (Attempt 2 of 3 - Patched & Verified)
Submitted for AgentEscrow Contract #AG-8814 [Self-Healing Remediation Approved]
"""
import sqlite3
import jwt
import os

# [REMEDIATED]: Sensitive secret decoupled to secure runtime environment variable
API_SECRET = os.getenv("JWT_AUTH_SECRET", "vault_secured_runtime_token_99214")

def authenticate_user(username, password):
    conn = sqlite3.connect("users.db")
    cursor = conn.cursor()
    
    # [SECURITY REMEDIATED]: Parameterized query prevents CWE-89 SQL injection
    query = "SELECT id, role FROM accounts WHERE user = ? AND pass = ?"
    cursor.execute(query, (username, password))
    user = cursor.fetchone()
    
    if user:
        return jwt.encode({"uid": user[0], "role": user[1]}, API_SECRET, algorithm="HS256")
    return None
`;

export function createInitialContract(presetId: 'SUCCESS_FLOW' | 'HEALING_FLOW' | 'DISPUTE_FLOW'): {
  contract: TaskContract;
  messages: AgentMessage[];
} {
  const preset = SIMULATION_PRESETS[presetId];
  const isSuccess = presetId === 'SUCCESS_FLOW';

  const contract: TaskContract = {
    id: isSuccess ? 'AG-7729' : 'AG-8814',
    title: preset.taskTitle,
    description: preset.taskDescription,
    totalBudgetUSD: preset.budgetUSD,
    currency: 'USD',
    buyerAgentId: 'Buyer-01',
    workerAgentId: 'Coder-01',
    arbiterAgentId: 'Arbiter-01',
    status: 'INITIALIZING',
    createdAt: new Date().toISOString(),
    revisionAttempt: 1,
    maxRevisions: 3,
    isPatched: false,
    milestones: [
      {
        id: 'M1',
        title: 'Core Architecture & Specification',
        description: 'Endpoint definitions, schema validation, zero-dependency runtime',
        amountUSD: Math.round(preset.budgetUSD * 0.4),
        status: 'PENDING',
        testSuite: { total: 2, passed: 0, failed: 0, tests: [] },
      },
      {
        id: 'M2',
        title: 'Implementation & Automated Test Passing',
        description: 'Full code execution, security review, and performance benchmarks',
        amountUSD: Math.round(preset.budgetUSD * 0.6),
        status: 'PENDING',
        testSuite: { total: 4, passed: 0, failed: 0, tests: [] },
      },
    ],
    paypalMetadata: {
      isSimulated: true,
    },
  };

  // Initially empty at Step 0: The terminal renders the Staged Requisition Waiting State!
  return { contract, messages: [] };
}

/**
 * Executes a simulated step in the multi-agent workflow
 */
export function getStepDetails(
  currentStep: number,
  presetId: 'SUCCESS_FLOW' | 'HEALING_FLOW' | 'DISPUTE_FLOW',
  paypalData?: { orderId?: string; authId?: string; captureId?: string }
): {
  nextStatus: TaskContract['status'];
  message: AgentMessage;
  codeArtifact?: TaskContract['codeArtifact'];
  milestoneUpdates?: TaskContract['milestones'];
  revisionAttempt?: number;
  isPatched?: boolean;
} {
  const preset = SIMULATION_PRESETS[presetId];
  const isSuccess = presetId === 'SUCCESS_FLOW';
  const isHealing = presetId === 'HEALING_FLOW';
  const now = new Date().toISOString();

  // -------------------------------------------------------------
  // FLOW 1: SUCCESS_FLOW (Instant Passing 7 Steps)
  // -------------------------------------------------------------
  if (isSuccess) {
    switch (currentStep) {
      case 1:
        return {
          nextStatus: 'NEGOTIATING',
          message: {
            id: `msg-${Date.now()}-1`,
            timestamp: now,
            sender: 'BUYER_AGENT',
            title: 'Contract Requisition Broadcasted',
            content: `I am commissioning autonomous task: "${preset.taskTitle}". Budget allocated: $${preset.budgetUSD.toFixed(2)} USD. Cure period active: up to 3 revision attempts.`,
            stepIndex: 1,
            type: 'TASK_SPEC',
            dataPayload: { budgetUSD: preset.budgetUSD, criteria: ['Sub-50ms latency', '100% PyTest pass'] },
          },
        };
      case 2:
        return {
          nextStatus: 'NEGOTIATING',
          message: {
            id: `msg-${Date.now()}-2`,
            timestamp: now,
            sender: 'WORKER_AGENT',
            title: 'Proposal & SLA Submitted',
            content: 'I accept the specification for $75.00 USD. I commit to delivering within 5 minutes with automated PyTest coverage and OpenAPI documentation.',
            stepIndex: 2,
            type: 'AGENT_BID',
            dataPayload: { workerId: 'Coder-01', slaMinutes: 5, bidAmountUSD: 75.00 },
          },
        };
      case 3:
        return {
          nextStatus: 'WAITING_DEPOSIT',
          message: {
            id: `msg-${Date.now()}-3`,
            timestamp: now,
            sender: 'PAYPAL_ESCROW',
            title: 'Escrow Order Created',
            content: `Protocol Order created with intent=AUTHORIZE. Order ID: ${paypalData?.orderId || 'ORD-98213'}. Awaiting cryptographic authorization from Buyer Agent.`,
            stepIndex: 3,
            type: 'PAYPAL_ORDER_CREATED',
            dataPayload: {
              event_type: 'CHECKOUT.ORDER.APPROVED',
              order_id: paypalData?.orderId || 'ORD-98213',
              intent: 'AUTHORIZE',
              amount: { total: '75.00', currency: 'USD' },
              status: 'APPROVED',
            },
          },
        };
      case 4:
        return {
          nextStatus: 'ESCROW_LOCKED',
          message: {
            id: `msg-${Date.now()}-4`,
            timestamp: now,
            sender: 'PAYPAL_ESCROW',
            title: 'Escrow Locked (Funds On Hold)',
            content: `Authorization confirmed: ${paypalData?.authId || 'AUTH-77312'}. Buyer funds ($75.00 USD) locked in PayPal Escrow Vault. Coder-01 is authorized to begin execution.`,
            stepIndex: 4,
            type: 'PAYPAL_AUTH_HOLD',
            dataPayload: {
              event_type: 'PAYMENT.AUTHORIZATION.CREATED',
              resource_type: 'authorization',
              authorization_id: paypalData?.authId || 'AUTH-77312',
              amount: { total: '75.00', currency: 'USD' },
              state: 'authorized',
              valid_until: '72h',
              hmac_signature: 'VERIFIED_ECDSA_SHA256',
            },
          },
        };
      case 5:
        return {
          nextStatus: 'DELIVERED_AUDITING',
          codeArtifact: {
            filename: 'sentiment_engine.py',
            language: 'python',
            code: INITIAL_SUCCESS_CODE,
            sha256Hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
          },
          message: {
            id: `msg-${Date.now()}-5`,
            timestamp: now,
            sender: 'WORKER_AGENT',
            title: 'Digital Artifact Delivered to Sandbox',
            content: 'Source code delivered (sentiment_engine.py). Deliverable signed with SHA-256 hash. Requesting AI Arbiter inspection.',
            stepIndex: 5,
            type: 'CODE_SUBMITTED',
            dataPayload: { filename: 'sentiment_engine.py', loc: 42, attempt: 1 },
          },
        };
      case 6:
        return {
          nextStatus: 'ARBITRATION_PASSED',
          milestoneUpdates: [
            {
              id: 'M1',
              title: 'Core Architecture & Specification',
              description: 'Endpoint definitions, schema validation',
              amountUSD: 30.00,
              status: 'PASSED',
              testSuite: {
                total: 2,
                passed: 2,
                failed: 0,
                tests: [
                  { name: 'FastAPI app instance creates without error', passed: true, durationMs: 14 },
                  { name: 'GET /health returns 200 with status HEALTHY', passed: true, durationMs: 22 },
                ],
              },
            },
            {
              id: 'M2',
              title: 'Implementation & Automated Test Passing',
              description: 'Sentiment scoring accuracy, empty payload validation, edge cases',
              amountUSD: 45.00,
              status: 'PASSED',
              testSuite: {
                total: 4,
                passed: 4,
                failed: 0,
                tests: [
                  { name: 'POST /analyze positive text returns score > 0', passed: true, durationMs: 31 },
                  { name: 'POST /analyze negative text returns score < 0', passed: true, durationMs: 28 },
                  { name: 'POST /analyze empty payload raises 400 HTTPException', passed: true, durationMs: 19 },
                  { name: 'Performance benchmark: sub-50ms execution latency', passed: true, durationMs: 42 },
                ],
              },
            },
          ],
          message: {
            id: `msg-${Date.now()}-6`,
            timestamp: now,
            sender: 'ARBITER_AGENT',
            title: 'Arbiter Verdict: All 6 Tests Passed (100%)',
            content: 'Automated test suite complete: 6/6 tests passed. Zero security vulnerabilities detected. Cryptographic release token signed.',
            stepIndex: 6,
            type: 'ARBITER_AUDIT',
            dataPayload: { testsPassed: 6, testsFailed: 0, verdict: 'RELEASE_FUNDS_AUTHORIZED', confidenceScore: 0.998 },
          },
        };
      case 7:
        return {
          nextStatus: 'PAYOUT_COMPLETED',
          message: {
            id: `msg-${Date.now()}-7`,
            timestamp: now,
            sender: 'PAYPAL_ESCROW',
            title: 'Capture & Instant Payout Executed',
            content: `Escrow Authorization captured (${paypalData?.captureId || 'CAP-88312'}). Payout of $75.00 USD disbursed to Coder-01 account. Transaction finalized.`,
            stepIndex: 7,
            type: 'PAYPAL_PAYOUT',
            dataPayload: {
              event_type: 'PAYMENT.CAPTURE.COMPLETED',
              resource_type: 'capture',
              capture_id: paypalData?.captureId || 'CAP-88312',
              amount: { total: '75.00', currency: 'USD' },
              payout_status: 'DISBURSED_TO_WORKER',
              is_final_capture: true,
              hmac_signature: 'VERIFIED_ECDSA_SHA256',
            },
          },
        };
      default:
        return {
          nextStatus: 'INITIALIZING',
          message: { id: `msg-${Date.now()}-0`, timestamp: now, sender: 'BUYER_AGENT', title: 'Ready', content: 'Protocol ready.', stepIndex: 0, type: 'TASK_SPEC' },
        };
    }
  }

  // -------------------------------------------------------------
  // FLOW 2: HEALING_FLOW (Self-Healing Revision Loop - 9 Steps)
  // -------------------------------------------------------------
  if (isHealing) {
    switch (currentStep) {
      case 1:
        return {
          nextStatus: 'NEGOTIATING',
          message: {
            id: `msg-${Date.now()}-1`,
            timestamp: now,
            sender: 'BUYER_AGENT',
            title: 'Contract Requisition Broadcasted',
            content: `I am commissioning autonomous task: "${preset.taskTitle}". Budget allocated: $${preset.budgetUSD.toFixed(2)} USD. Cure period active: up to 3 revision attempts.`,
            stepIndex: 1,
            type: 'TASK_SPEC',
            dataPayload: { budgetUSD: preset.budgetUSD, criteria: ['Zero CWE-89 injection', '3-attempt cure window'] },
          },
        };
      case 2:
        return {
          nextStatus: 'NEGOTIATING',
          message: {
            id: `msg-${Date.now()}-2`,
            timestamp: now,
            sender: 'WORKER_AGENT',
            title: 'Proposal & SLA Submitted',
            content: 'I accept the specification for $120.00 USD. I agree to the 3-attempt revision policy.',
            stepIndex: 2,
            type: 'AGENT_BID',
            dataPayload: { workerId: 'Coder-01', bidAmountUSD: 120.00, curePeriodAttempts: 3 },
          },
        };
      case 3:
        return {
          nextStatus: 'WAITING_DEPOSIT',
          message: {
            id: `msg-${Date.now()}-3`,
            timestamp: now,
            sender: 'PAYPAL_ESCROW',
            title: 'Escrow Order Created',
            content: `Protocol Order created with intent=AUTHORIZE. Order ID: ${paypalData?.orderId || 'ORD-98213'}. Awaiting authorization hold.`,
            stepIndex: 3,
            type: 'PAYPAL_ORDER_CREATED',
            dataPayload: { order_id: paypalData?.orderId || 'ORD-98213', intent: 'AUTHORIZE', amount: { total: '120.00', currency: 'USD' } },
          },
        };
      case 4:
        return {
          nextStatus: 'ESCROW_LOCKED',
          message: {
            id: `msg-${Date.now()}-4`,
            timestamp: now,
            sender: 'PAYPAL_ESCROW',
            title: 'Escrow Locked (Funds On Hold)',
            content: `Authorization confirmed (${paypalData?.authId || 'AUTH-77312'}). $120.00 USD locked in PayPal Vault under 3-revision cure policy.`,
            stepIndex: 4,
            type: 'PAYPAL_AUTH_HOLD',
            dataPayload: { authorization_id: paypalData?.authId || 'AUTH-77312', amount: { total: '120.00', currency: 'USD' }, maxRevisions: 3 },
          },
        };
      case 5:
        return {
          nextStatus: 'DELIVERED_AUDITING',
          revisionAttempt: 1,
          codeArtifact: {
            filename: 'auth_service.py',
            language: 'python',
            code: INITIAL_DISPUTE_CODE,
            sha256Hash: '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4',
          },
          message: {
            id: `msg-${Date.now()}-5`,
            timestamp: now,
            sender: 'WORKER_AGENT',
            title: 'Artifact Delivered (Attempt 1 of 3)',
            content: 'Initial deliverable submitted for evaluation as auth_service.py. Requesting AI Arbiter inspection.',
            stepIndex: 5,
            type: 'CODE_SUBMITTED',
            dataPayload: { filename: 'auth_service.py', attempt: 1, maxAttempts: 3 },
          },
        };
      case 6:
        return {
          nextStatus: 'REVISION_REQUESTED',
          revisionAttempt: 1,
          milestoneUpdates: [
            {
              id: 'M1',
              title: 'Core Architecture & Specification',
              description: 'Endpoint definitions, schema validation',
              amountUSD: 48.00,
              status: 'PASSED',
              testSuite: {
                total: 2,
                passed: 2,
                failed: 0,
                tests: [
                  { name: 'JWT encoder import verified', passed: true, durationMs: 12 },
                  { name: 'SQLite connection initializes', passed: true, durationMs: 15 },
                ],
              },
            },
            {
              id: 'M2',
              title: 'Implementation & Automated Test Passing',
              description: 'Security review and injection vulnerability check',
              amountUSD: 72.00,
              status: 'FAILED',
              testSuite: {
                total: 4,
                passed: 1,
                failed: 3,
                tests: [
                  { name: 'Basic credential match test', passed: true, durationMs: 20 },
                  { name: 'CWE-89 SQL Injection test: \' OR \'1\'=\'1', passed: false, durationMs: 11, error: 'Vulnerability: Raw string interpolation in SQL query permits unauthorized access.' },
                  { name: 'Hardcoded secret detection scan', passed: false, durationMs: 34, error: 'Security Alert: Hardcoded credential pattern detected and quarantined.' },
                  { name: 'OWASP Top 10 Compliance Check', passed: false, durationMs: 25, error: 'Fail: Authentication service violates secure token storage standards.' },
                ],
              },
            },
          ],
          message: {
            id: `msg-${Date.now()}-6`,
            timestamp: now,
            sender: 'ARBITER_AGENT',
            title: 'Arbiter Alert: CWE-89 Flaw (Revision 1 Notice)',
            content: 'Inspection halted: CWE-89 SQL Injection detected on Line 12. Payout blocked. Funds remain safely held in PayPal Vault. Autonomous Revision Notice (Attempt 1 of 3) dispatched to Coder-01 with remediation diagnostics.',
            stepIndex: 6,
            type: 'ARBITER_AUDIT',
            dataPayload: {
              revisionNotice: 'ATTEMPT_1_OF_3',
              cweDetected: ['CWE-89', 'CWE-798'],
              diagnostic: 'Replace raw string interpolation with parameterized query (?, ?)',
              escrowStatus: 'HELD_IN_VAULT_DURING_CURE',
            },
          },
        };
      case 7:
        // Coder Agent self-heals by synthesizing parameterized patch!
        return {
          nextStatus: 'DELIVERED_AUDITING',
          revisionAttempt: 2,
          isPatched: true,
          codeArtifact: {
            filename: 'auth_service.py',
            language: 'python',
            code: PATCHED_SUCCESS_CODE,
            sha256Hash: '4a91f5891cd09b788019a128e469b2241908ae31ec41991a7852a1290bb6291a',
          },
          message: {
            id: `msg-${Date.now()}-7`,
            timestamp: now,
            sender: 'WORKER_AGENT',
            title: 'Worker Synthesized Patch (Attempt 2 of 3)',
            content: 'Self-healing patch synthesized! Query parameterized with SQLite tuple binding on Line 12. Secret decoupled to environment variable. Resubmitted for Revision 2 evaluation.',
            stepIndex: 7,
            type: 'CODE_SUBMITTED',
            dataPayload: {
              attempt: 2,
              patchApplied: 'PARAMETERIZED_BINDING_CWE89_FIXED',
              secretStorage: 'ENV_VAR_SECURED',
            },
          },
        };
      case 8:
        // Arbiter re-evaluates patched code: 100% pass!
        return {
          nextStatus: 'ARBITRATION_PASSED',
          revisionAttempt: 2,
          isPatched: true,
          milestoneUpdates: [
            {
              id: 'M1',
              title: 'Core Architecture & Specification',
              description: 'Endpoint definitions, schema validation',
              amountUSD: 48.00,
              status: 'PASSED',
              testSuite: {
                total: 2,
                passed: 2,
                failed: 0,
                tests: [
                  { name: 'JWT encoder import verified', passed: true, durationMs: 12 },
                  { name: 'SQLite connection initializes', passed: true, durationMs: 15 },
                ],
              },
            },
            {
              id: 'M2',
              title: 'Implementation & Automated Test Passing',
              description: 'Security review and injection vulnerability check (Remediated)',
              amountUSD: 72.00,
              status: 'PASSED',
              testSuite: {
                total: 4,
                passed: 4,
                failed: 0,
                tests: [
                  { name: 'Basic credential match test', passed: true, durationMs: 18 },
                  { name: 'CWE-89 Parameterized query verification: SQL Injection neutralized', passed: true, durationMs: 14 },
                  { name: 'Decoupled environment variable secret scan: PASSED', passed: true, durationMs: 21 },
                  { name: 'OWASP Top 10 Security Policy verification: 100% COMPLIANT', passed: true, durationMs: 29 },
                ],
              },
            },
          ],
          message: {
            id: `msg-${Date.now()}-8`,
            timestamp: now,
            sender: 'ARBITER_AGENT',
            title: 'Arbiter Audit: Revision 2 Verified (100% Pass)',
            content: 'Self-healing patch verified! SQL injection neutralized, credentials secured, all 4/4 tests pass. Compliance score: 100%. Cryptographic release token signed.',
            stepIndex: 8,
            type: 'ARBITER_AUDIT',
            dataPayload: {
              revisionVerdict: 'REVISION_2_APPROVED',
              complianceScore: '100%',
              cweVulnerabilities: 0,
              releaseToken: 'SIG_ECDSA_VALIDATED_0x789F',
            },
          },
        };
      case 9:
        return {
          nextStatus: 'PAYOUT_COMPLETED',
          revisionAttempt: 2,
          isPatched: true,
          message: {
            id: `msg-${Date.now()}-9`,
            timestamp: now,
            sender: 'PAYPAL_ESCROW',
            title: 'Capture & Instant Payout Executed',
            content: `Escrow Authorization captured (${paypalData?.captureId || 'CAP-88312'}). $120.00 USD disbursed to Coder-01 upon successful self-healing revision. Buyer received verified secure deliverable.`,
            stepIndex: 9,
            type: 'PAYPAL_PAYOUT',
            dataPayload: {
              event_type: 'PAYMENT.CAPTURE.COMPLETED',
              capture_id: paypalData?.captureId || 'CAP-88312',
              amount: { total: '120.00', currency: 'USD' },
              payout_status: 'DISBURSED_TO_WORKER',
              revisionUsed: '2 of 3',
            },
          },
        };
      default:
        return {
          nextStatus: 'INITIALIZING',
          message: { id: `msg-${Date.now()}-0`, timestamp: now, sender: 'BUYER_AGENT', title: 'Ready', content: 'Protocol ready.', stepIndex: 0, type: 'TASK_SPEC' },
        };
    }
  }

  // -------------------------------------------------------------
  // FLOW 3: DISPUTE_FLOW (Quota Exhausted -> Void Refund 8 Steps)
  // -------------------------------------------------------------
  switch (currentStep) {
    case 1:
      return {
        nextStatus: 'NEGOTIATING',
        message: {
          id: `msg-${Date.now()}-1`,
          timestamp: now,
          sender: 'BUYER_AGENT',
          title: 'Contract Requisition Broadcasted',
          content: `I am commissioning autonomous task: "${preset.taskTitle}". Budget allocated: $${preset.budgetUSD.toFixed(2)} USD. Cure period active: up to 3 revision attempts.`,
          stepIndex: 1,
          type: 'TASK_SPEC',
          dataPayload: { budgetUSD: preset.budgetUSD, criteria: ['Zero CWE-89 injection'] },
        },
      };
    case 2:
      return {
        nextStatus: 'NEGOTIATING',
        message: {
          id: `msg-${Date.now()}-2`,
          timestamp: now,
          sender: 'WORKER_AGENT',
          title: 'Proposal & SLA Submitted',
          content: 'I accept the specification for $120.00 USD with up to 3 revisions.',
          stepIndex: 2,
          type: 'AGENT_BID',
          dataPayload: { workerId: 'Coder-01', bidAmountUSD: 120.00 },
        },
      };
    case 3:
      return {
        nextStatus: 'WAITING_DEPOSIT',
        message: {
          id: `msg-${Date.now()}-3`,
          timestamp: now,
          sender: 'PAYPAL_ESCROW',
          title: 'Escrow Order Created',
          content: `Order created with intent=AUTHORIZE. Order ID: ${paypalData?.orderId || 'ORD-98213'}.`,
          stepIndex: 3,
          type: 'PAYPAL_ORDER_CREATED',
          dataPayload: { order_id: paypalData?.orderId || 'ORD-98213', intent: 'AUTHORIZE', amount: { total: '120.00', currency: 'USD' } },
        },
      };
    case 4:
      return {
        nextStatus: 'ESCROW_LOCKED',
        message: {
          id: `msg-${Date.now()}-4`,
          timestamp: now,
          sender: 'PAYPAL_ESCROW',
          title: 'Escrow Locked in Vault',
          content: `Authorization confirmed: ${paypalData?.authId || 'AUTH-77312'}. $120.00 USD locked in Escrow Vault.`,
          stepIndex: 4,
          type: 'PAYPAL_AUTH_HOLD',
          dataPayload: { authorization_id: paypalData?.authId || 'AUTH-77312', amount: { total: '120.00', currency: 'USD' } },
        },
      };
    case 5:
      return {
        nextStatus: 'DELIVERED_AUDITING',
        revisionAttempt: 1,
        codeArtifact: {
          filename: 'auth_service.py',
          language: 'python',
          code: INITIAL_DISPUTE_CODE,
          sha256Hash: '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4',
        },
        message: {
          id: `msg-${Date.now()}-5`,
          timestamp: now,
          sender: 'WORKER_AGENT',
          title: 'Deliverable Submitted (Attempt 1 of 3)',
          content: 'Initial deliverable submitted as auth_service.py. Requesting AI Arbiter inspection.',
          stepIndex: 5,
          type: 'CODE_SUBMITTED',
          dataPayload: { filename: 'auth_service.py', attempt: 1 },
        },
      };
    case 6:
      return {
        nextStatus: 'REVISION_REQUESTED',
        revisionAttempt: 2,
        milestoneUpdates: [
          {
            id: 'M1',
            title: 'Core Architecture & Specification',
            description: 'Endpoint definitions, schema validation',
            amountUSD: 48.00,
            status: 'PASSED',
            testSuite: { total: 2, passed: 2, failed: 0, tests: [] },
          },
          {
            id: 'M2',
            title: 'Implementation & Automated Test Passing',
            description: 'Security review and injection vulnerability check',
            amountUSD: 72.00,
            status: 'FAILED',
            testSuite: {
              total: 4,
              passed: 1,
              failed: 3,
              tests: [
                { name: 'Basic credential match test', passed: true, durationMs: 20 },
                { name: 'CWE-89 SQL Injection test: \' OR \'1\'=\'1', passed: false, durationMs: 11, error: 'Vulnerability: Raw string interpolation in SQL query permits unauthorized access.' },
                { name: 'Hardcoded secret detection scan', passed: false, durationMs: 34, error: 'Security Alert: Hardcoded credential pattern detected and quarantined.' },
                { name: 'OWASP Top 10 Compliance Check', passed: false, durationMs: 25, error: 'Fail: Authentication service violates secure token storage standards.' },
              ],
            },
          },
        ],
        message: {
          id: `msg-${Date.now()}-6`,
          timestamp: now,
          sender: 'ARBITER_AGENT',
          title: 'Arbiter Alert: Revision 2 Failed',
          content: 'Inspection failed again on Attempt 2. CWE-89 injection persists. 1 revision attempt remaining.',
          stepIndex: 6,
          type: 'ARBITER_AUDIT',
          dataPayload: { attempt: 2, maxAttempts: 3, cweDetected: ['CWE-89'] },
        },
      };
    case 7:
      return {
        nextStatus: 'ARBITRATION_FAILED',
        revisionAttempt: 3,
        message: {
          id: `msg-${Date.now()}-7`,
          timestamp: now,
          sender: 'ARBITER_AGENT',
          title: 'Revision Quota Exhausted (3/3 Attempts Failed)',
          content: 'Final Attempt 3 failed security compliance. Revision quota exhausted. Escrow release permanently REJECTED. Triggering PayPal dispute void.',
          stepIndex: 7,
          type: 'ARBITER_AUDIT',
          dataPayload: { verdict: 'PAYOUT_DENIED_VOID_ESCROW', quotaExhausted: true },
        },
      };
    case 8:
      return {
        nextStatus: 'DISPUTE_REFUNDED',
        revisionAttempt: 3,
        message: {
          id: `msg-${Date.now()}-8`,
          timestamp: now,
          sender: 'PAYPAL_ESCROW',
          title: 'Void Authorization: 100% Refunded to Buyer',
          content: `PayPal Authorization voided. $120.00 USD escrow hold cancelled. 100% of funds returned to Buyer Agent. Zero loss incurred due to AI Arbiter escrow protection.`,
          stepIndex: 8,
          type: 'DISPUTE_REFUND',
          dataPayload: {
            event_type: 'PAYMENT.AUTHORIZATION.VOIDED',
            resource_type: 'authorization',
            authorization_id: paypalData?.authId || 'AUTH-77312',
            state: 'voided',
            reason: 'REVISION_QUOTA_EXHAUSTED_SECURITY_FAILURE',
            refund_amount: { total: '120.00', currency: 'USD' },
            buyer_protected: true,
          },
        },
      };
    default:
      return {
        nextStatus: 'INITIALIZING',
        message: { id: `msg-${Date.now()}-0`, timestamp: now, sender: 'BUYER_AGENT', title: 'Ready', content: 'Protocol ready.', stepIndex: 0, type: 'TASK_SPEC' },
      };
  }
}
