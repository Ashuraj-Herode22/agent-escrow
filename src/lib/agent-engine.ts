import { TaskContract, AgentMessage, SimulationPreset } from '@/types/escrow';

export const SIMULATION_PRESETS: Record<string, SimulationPreset> = {
  SUCCESS_FLOW: {
    id: 'SUCCESS_FLOW',
    name: 'Autonomous Microservice Build & Instant Payout',
    description: 'Buyer Agent commissions a high-performance Python FastAPI service. Worker delivers clean, tested code. Arbiter executes automated test suite -> 100% Pass -> PayPal releases escrow.',
    taskTitle: 'Build Scalable Sentiment Analysis REST Microservice',
    taskDescription: 'Create a standalone Python FastAPI service with /health and /analyze endpoints. Must achieve >90% test coverage and handle edge cases.',
    budgetUSD: 75.00,
    targetOutcome: '100% PASS -> PAYOUT',
  },
  DISPUTE_FLOW: {
    id: 'DISPUTE_FLOW',
    name: 'Security Flaw Detection & Automated Refund',
    description: 'Worker Agent delivers code with hardcoded credentials and an unchecked injection vulnerability. AI Arbiter intercepts flaw -> Rejects release -> PayPal voids authorization and refunds Buyer.',
    taskTitle: 'Build User Authentication & Token Service',
    taskDescription: 'Create JWT authentication middleware with password hashing and SQL injection safeguards.',
    budgetUSD: 120.00,
    targetOutcome: 'SECURITY FLAW -> REFUND',
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
User Authentication Service (Quarantined by Arbiter)
Submitted for AgentEscrow Contract #AG-8814
"""
import sqlite3
import jwt

# [SECURITY VIOLATION DETECTED: Hardcoded Credential Pattern]
# AI Arbiter Masked Sensitive Secret:
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

export function createInitialContract(presetId: 'SUCCESS_FLOW' | 'DISPUTE_FLOW'): {
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
    buyerAgentId: 'agent_buyer_alpha_9',
    workerAgentId: 'agent_synth_coder_x4',
    arbiterAgentId: 'agent_arbiter_sentinel_01',
    status: 'INITIALIZING',
    createdAt: '2026-11-01T12:00:00.000Z',
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

  const initialMessages: AgentMessage[] = [
    {
      id: 'msg-init-1',
      timestamp: '2026-11-01T12:00:00.000Z',
      sender: 'BUYER_AGENT',
      title: 'Contract Requisition Broadcasted',
      content: `I am commissioning autonomous task: "${preset.taskTitle}". Budget allocated: $${preset.budgetUSD.toFixed(2)} USD. Looking for a verified worker agent with Python/FastAPI capability.`,
      stepIndex: 1,
      type: 'TASK_SPEC',
      dataPayload: {
        budgetUSD: preset.budgetUSD,
        criteria: ['Zero critical vulnerabilities', 'Sub-50ms latency', '100% test suite pass'],
      },
    },
  ];

  return { contract, messages: initialMessages };
}

/**
 * Executes a simulated step in the multi-agent workflow
 */
export function getStepDetails(
  currentStep: number,
  presetId: 'SUCCESS_FLOW' | 'DISPUTE_FLOW',
  paypalData?: { orderId?: string; authId?: string; captureId?: string }
): {
  nextStatus: TaskContract['status'];
  message: AgentMessage;
  codeArtifact?: TaskContract['codeArtifact'];
  milestoneUpdates?: TaskContract['milestones'];
} {
  const isSuccess = presetId === 'SUCCESS_FLOW';
  const now = new Date().toISOString();

  switch (currentStep) {
    case 1: // Worker Agent Bids
      return {
        nextStatus: 'NEGOTIATING',
        message: {
          id: `msg-${Date.now()}-2`,
          timestamp: now,
          sender: 'WORKER_AGENT',
          title: 'Proposal & SLA Submitted',
          content: `I accept the specification for $${isSuccess ? '75.00' : '120.00'} USD. I commit to delivering within 5 minutes with automated PyTest coverage and OpenAPI documentation.`,
          stepIndex: 2,
          type: 'AGENT_BID',
          dataPayload: {
            workerId: 'agent_synth_coder_x4',
            slaMinutes: 5,
            bidAmountUSD: isSuccess ? 75.00 : 120.00,
          },
        },
      };

    case 2: // PayPal Escrow Hold Created
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
            orderId: paypalData?.orderId || 'ORD-98213',
            intent: 'AUTHORIZE',
            amount: isSuccess ? '$75.00 USD' : '$120.00 USD',
          },
        },
      };

    case 3: // Escrow Locked
      return {
        nextStatus: 'ESCROW_LOCKED',
        message: {
          id: `msg-${Date.now()}-4`,
          timestamp: now,
          sender: 'PAYPAL_ESCROW',
          title: 'Escrow Locked (Funds On Hold)',
          content: `Authorization confirmed: ${paypalData?.authId || 'AUTH-77312'}. Buyer funds are cryptographically locked in Escrow. Worker Agent is authorized to begin execution.`,
          stepIndex: 4,
          type: 'PAYPAL_AUTH_HOLD',
          dataPayload: {
            authorizationId: paypalData?.authId || 'AUTH-77312',
            status: 'AUTHORIZED',
            escrowHoldValidHours: 72,
          },
        },
      };

    case 4: // Code Delivered
      return {
        nextStatus: 'DELIVERED_AUDITING',
        codeArtifact: {
          filename: isSuccess ? 'sentiment_engine.py' : 'auth_service.py',
          language: 'python',
          code: isSuccess ? INITIAL_SUCCESS_CODE : INITIAL_DISPUTE_CODE,
          sha256Hash: isSuccess
            ? 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
            : '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4',
        },
        message: {
          id: `msg-${Date.now()}-5`,
          timestamp: now,
          sender: 'WORKER_AGENT',
          title: 'Digital Artifact Delivered to Sandbox',
          content: `Source code delivered (${isSuccess ? 'sentiment_engine.py' : 'auth_service.py'}). Deliverable signed with SHA-256 hash. Requesting AI Arbiter inspection.`,
          stepIndex: 5,
          type: 'CODE_SUBMITTED',
          dataPayload: {
            filename: isSuccess ? 'sentiment_engine.py' : 'auth_service.py',
            loc: isSuccess ? 42 : 21,
          },
        },
      };

    case 5: // Arbiter Inspection
      if (isSuccess) {
        return {
          nextStatus: 'ARBITRATION_PASSED',
          milestoneUpdates: [
            {
              id: 'M1',
              title: 'Core Architecture & Specification',
              description: 'Endpoint definitions, schema validation, zero-dependency runtime',
              amountUSD: 30.00,
              status: 'PASSED',
              testSuite: {
                total: 2,
                passed: 2,
                failed: 0,
                tests: [
                  { name: 'GET /health returns 200 OK', passed: true, durationMs: 14 },
                  { name: 'Schema validation rejects empty strings', passed: true, durationMs: 18 },
                ],
              },
            },
            {
              id: 'M2',
              title: 'Implementation & Automated Test Passing',
              description: 'Full code execution, security review, and performance benchmarks',
              amountUSD: 45.00,
              status: 'PASSED',
              testSuite: {
                total: 4,
                passed: 4,
                failed: 0,
                tests: [
                  { name: 'Positive sentiment classification score > 0.8', passed: true, durationMs: 22 },
                  { name: 'Negative sentiment classification score < 0.2', passed: true, durationMs: 19 },
                  { name: 'Static AST security scan (Bandit rules)', passed: true, durationMs: 45 },
                  { name: 'Sub-50ms benchmark load test (100 reqs)', passed: true, durationMs: 82 },
                ],
              },
            },
          ],
          message: {
            id: `msg-${Date.now()}-6`,
            timestamp: now,
            sender: 'ARBITER_AGENT',
            title: 'Arbiter Verdict: 100% Test Pass (Verified)',
            content: `Automated test suite completed. 6/6 tests passed (0 vulnerabilities, 0 regressions). Cryptographic release token signed. Escrow capture authorized.`,
            stepIndex: 6,
            type: 'ARBITER_AUDIT',
            dataPayload: {
              testsPassed: 6,
              testsFailed: 0,
              verdict: 'RELEASE_FUNDS_AUTHORIZED',
              confidenceScore: 0.998,
            },
          },
        };
      } else {
        // Dispute / Fail
        return {
          nextStatus: 'ARBITRATION_FAILED',
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
            title: 'Arbiter Verdict: Security Flaw Intercepted & Quarantined',
            content: `Inspection halted. 3 critical vulnerabilities detected (SQL Injection CWE-89 & Secret Exposure). Escrow release rejected. Initiating automatic buyer refund.`,
            stepIndex: 6,
            type: 'ARBITER_AUDIT',
            dataPayload: {
              testsPassed: 1,
              testsFailed: 3,
              verdict: 'PAYOUT_DENIED_VOID_ESCROW',
              cweDetected: ['CWE-89', 'CWE-798'],
            },
          },
        };
      }

    case 6: // Payout or Refund
      if (isSuccess) {
        return {
          nextStatus: 'PAYOUT_COMPLETED',
          message: {
            id: `msg-${Date.now()}-7`,
            timestamp: now,
            sender: 'PAYPAL_ESCROW',
            title: 'Capture & Instant Payout Executed',
            content: `Escrow Authorization captured (${paypalData?.captureId || 'CAP-88312'}). Payout of $75.00 USD disbursed to Worker Agent account. Transaction audited and finalized.`,
            stepIndex: 7,
            type: 'PAYPAL_PAYOUT',
            dataPayload: {
              captureId: paypalData?.captureId || 'CAP-88312',
              amountDisbursed: '$75.00 USD',
              payoutStatus: 'COMPLETED',
            },
          },
        };
      } else {
        return {
          nextStatus: 'DISPUTE_REFUNDED',
          message: {
            id: `msg-${Date.now()}-7`,
            timestamp: now,
            sender: 'PAYPAL_ESCROW',
            title: 'Void Authorization: 100% Refunded to Buyer',
            content: `Authorization voided. $120.00 USD escrow hold cancelled. 100% of funds returned to Buyer Agent account. Zero loss incurred due to AI Arbiter escrow protection.`,
            stepIndex: 7,
            type: 'DISPUTE_REFUND',
            dataPayload: {
              authorizationStatus: 'VOIDED',
              refundAmount: '$120.00 USD',
              buyerProtected: true,
            },
          },
        };
      }

    default:
      return {
        nextStatus: 'INITIALIZING',
        message: {
          id: `msg-${Date.now()}-0`,
          timestamp: now,
          sender: 'BUYER_AGENT',
          title: 'System Ready',
          content: 'Escrow protocol initialized.',
          stepIndex: 0,
          type: 'TASK_SPEC',
        },
      };
  }
}
