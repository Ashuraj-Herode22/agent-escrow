/**
 * AgentEscrow TypeScript SDK
 * Drop-in programmable escrow client for LangChain, Vercel AI SDK, and multi-agent workflows.
 */

export interface CreateContractParams {
  task: string;
  bountyUSD: number;
  description?: string;
  autoSettle?: boolean;
  criteria?: string[];
}

export interface ContractResponse {
  contractId: string;
  orderId: string;
  authorizationId: string;
  bountyUSD: number;
  task: string;
  verdict?: string;
  complianceScore?: string;
  settlementStatus?: string;
}

export class AgentEscrowClient {
  private endpointUrl: string;

  constructor(config?: { endpointUrl?: string }) {
    this.endpointUrl = (config?.endpointUrl || 'http://localhost:3000').replace(/\/$/, '');
  }

  /**
   * Commission a new contract and lock funds in PayPal Escrow Authorization
   */
  async createContract(params: CreateContractParams): Promise<EscrowContract> {
    const res = await fetch(`${this.endpointUrl}/api/v1/escrow/requisition`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        task: params.task,
        description: params.description || params.task,
        bountyUSD: params.bountyUSD,
        autoSettle: params.autoSettle ?? false,
      }),
    });

    if (!res.ok) {
      throw new Error(`Failed to create escrow contract: ${res.statusText}`);
    }

    const data = await res.json();
    return new EscrowContract(this, data);
  }
}

export class EscrowContract {
  private client: AgentEscrowClient;
  public contractId: string;
  public orderId: string;
  public authorizationId: string;
  public bountyUSD: number;
  public task: string;
  public status: string;

  constructor(client: AgentEscrowClient, data: ContractResponse) {
    this.client = client;
    this.contractId = data.contractId;
    this.orderId = data.orderId;
    this.authorizationId = data.authorizationId;
    this.bountyUSD = data.bountyUSD;
    this.task = data.task;
    this.status = 'AUTHORIZED_LOCKED';
  }

  /**
   * Submit synthesized artifact for AI Arbiter verification and conditional payout
   */
  async submitArtifactAndArbitrate(code: string): Promise<Record<string, unknown>> {
    const res = await fetch(`${(this.client as unknown as { endpointUrl: string }).endpointUrl}/api/agent/custom-task`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        taskTitle: this.task,
        budgetUSD: this.bountyUSD,
        taskDescription: this.task,
      }),
    });

    if (!res.ok) {
      throw new Error(`Arbitration request failed: ${res.statusText}`);
    }

    return await res.json();
  }
}
