export type AgentRole = 'BUYER_AGENT' | 'WORKER_AGENT' | 'ARBITER_AGENT' | 'PAYPAL_ESCROW';

export type ContractStatus = 
  | 'INITIALIZING'
  | 'NEGOTIATING'
  | 'WAITING_DEPOSIT'
  | 'ESCROW_LOCKED'
  | 'WORK_IN_PROGRESS'
  | 'DELIVERED_AUDITING'
  | 'REVISION_REQUESTED'
  | 'ARBITRATION_PASSED'
  | 'ARBITRATION_FAILED'
  | 'PAYOUT_COMPLETED'
  | 'DISPUTE_REFUNDED';

export interface Milestone {
  id: string;
  title: string;
  description: string;
  amountUSD: number;
  status: 'PENDING' | 'IN_REVIEW' | 'PASSED' | 'FAILED';
  testSuite: {
    total: number;
    passed: number;
    failed: number;
    tests: Array<{ name: string; passed: boolean; durationMs: number; error?: string }>;
  };
}

export type DeliverableCategory = 
  | 'SOFTWARE_CODE'        // AST Security Scan + PyTest Deterministic Assertions
  | 'STRUCTURED_DATA'      // JSON Schema Validation + Integrity & Null Check Rate
  | 'ANALYTICAL_RESEARCH'  // Source Citations + Hallucination Audit + Factual Precision
  | 'CREATIVE_MEDIA';      // Semantic Alignment + Brand Safety & Tone Rubric

export interface TaskContract {
  id: string;
  title: string;
  description: string;
  deliverableCategory?: DeliverableCategory;
  totalBudgetUSD: number;
  currency: string;
  buyerAgentId: string;
  workerAgentId: string;
  arbiterAgentId: string;
  status: ContractStatus;
  createdAt: string;
  revisionAttempt?: number;
  maxRevisions?: number;
  isPatched?: boolean;
  milestones: Milestone[];
  codeArtifact?: {
    filename: string;
    language: string;
    code: string;
    sha256Hash: string;
  };
  paypalMetadata: {
    orderId?: string;
    authorizationId?: string;
    captureId?: string;
    payoutBatchId?: string;
    isSimulated: boolean;
    escrowLockedAt?: string;
    releasedAt?: string;
    auditLogRef?: string;
  };
}

export interface AgentMessage {
  id: string;
  timestamp: string;
  sender: AgentRole;
  title: string;
  content: string;
  stepIndex: number;
  type: 
    | 'TASK_SPEC'
    | 'AGENT_BID'
    | 'PAYPAL_ORDER_CREATED'
    | 'PAYPAL_AUTH_HOLD'
    | 'CODE_SUBMITTED'
    | 'ARBITER_AUDIT'
    | 'PAYPAL_CAPTURE'
    | 'PAYPAL_PAYOUT'
    | 'DISPUTE_REFUND';
  dataPayload?: Record<string, unknown>;
}

export interface SimulationPreset {
  id: 'SUCCESS_FLOW' | 'HEALING_FLOW' | 'DISPUTE_FLOW';
  name: string;
  description: string;
  taskTitle: string;
  taskDescription: string;
  budgetUSD: number;
  targetOutcome: string;
}

