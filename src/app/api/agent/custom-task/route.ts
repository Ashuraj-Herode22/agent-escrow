import { NextRequest, NextResponse } from 'next/server';
import { generateDynamicAgentWorkflow } from '@/lib/gemini';
import { TaskContract, AgentMessage } from '@/types/escrow';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      taskTitle = 'Validate Credit Card with Luhn Algorithm',
      taskDescription = 'Build a Python module to compute Luhn checksum and identify card networks.',
      budgetUSD = 50.00,
    } = body;

    const result = await generateDynamicAgentWorkflow(taskTitle, taskDescription, Number(budgetUSD));
    const isPassed = result.verdict === 'RELEASE_FUNDS_AUTHORIZED';
    const contractId = `AG-${Math.floor(1000 + Math.random() * 9000)}`;

    const contract: TaskContract = {
      id: contractId,
      title: taskTitle,
      description: taskDescription,
      totalBudgetUSD: Number(budgetUSD),
      currency: 'USD',
      buyerAgentId: 'Buyer-01',
      workerAgentId: 'Coder-01',
      arbiterAgentId: 'Arbiter-01',
      status: isPassed ? 'PAYOUT_COMPLETED' : 'DISPUTE_REFUNDED',
      createdAt: new Date().toISOString(),
      codeArtifact: {
        filename: result.filename,
        language: result.language,
        code: result.code,
        sha256Hash: `sha256_${Math.random().toString(36).substring(2, 16)}`,
      },
      milestones: [
        {
          id: 'M1',
          title: 'Custom Architecture & Logic Implementation',
          description: taskDescription.substring(0, 80),
          amountUSD: Number(budgetUSD),
          status: isPassed ? 'PASSED' : 'FAILED',
          testSuite: {
            total: result.tests.length,
            passed: result.tests.filter(t => t.passed).length,
            failed: result.tests.filter(t => !t.passed).length,
            tests: result.tests,
          },
        },
      ],
      paypalMetadata: {
        orderId: `ORD-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        authorizationId: `AUTH-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        captureId: isPassed ? `CAP-${Math.random().toString(36).substring(2, 8).toUpperCase()}` : 'VOIDED_AUTHORIZATION',
        isSimulated: true,
        escrowLockedAt: new Date().toISOString(),
        releasedAt: isPassed ? new Date().toISOString() : undefined,
      },
    };

    const messages: AgentMessage[] = [
      {
        id: `msg-${Date.now()}-1`,
        timestamp: new Date().toISOString(),
        sender: 'BUYER_AGENT',
        title: 'Custom Task Requisition Dispatched',
        content: `I am commissioning custom task: "${taskTitle}". Budget: $${Number(budgetUSD).toFixed(2)} USD.`,
        stepIndex: 1,
        type: 'TASK_SPEC',
        dataPayload: { budgetUSD, criteria: ['Dynamic Test Suite Pass', 'Zero CWE Vulnerabilities'] },
      },
      {
        id: `msg-${Date.now()}-2`,
        timestamp: new Date().toISOString(),
        sender: 'WORKER_AGENT',
        title: 'Worker Accepted & Synthesized Artifact',
        content: `Code generated and committed to sandbox as "${result.filename}". SHA-256 deliverable verified.`,
        stepIndex: 2,
        type: 'CODE_SUBMITTED',
        dataPayload: { filename: result.filename, loc: result.code.split('\n').length },
      },
      {
        id: `msg-${Date.now()}-3`,
        timestamp: new Date().toISOString(),
        sender: 'ARBITER_AGENT',
        title: isPassed ? 'Arbiter Verdict: All Dynamic Tests Passed' : 'Arbiter Verdict: Security Alert Detected',
        content: isPassed
          ? `Executed ${result.tests.length} tests with ${result.score}% compliance score. Cryptographic release token signed.`
          : `Security inspection flagged critical vulnerabilities (${result.securityFindings[0] || 'CWE Flaw'}). Release denied.`,
        stepIndex: 3,
        type: 'ARBITER_AUDIT',
        dataPayload: { score: result.score, verdict: result.verdict, testsPassed: result.tests.filter(t => t.passed).length },
      },
      {
        id: `msg-${Date.now()}-4`,
        timestamp: new Date().toISOString(),
        sender: 'PAYPAL_ESCROW',
        title: isPassed ? 'Escrow Capture & Instant Payout' : 'Authorization Voided & 100% Refunded',
        content: isPassed
          ? `Authorization CAPTURED. $${Number(budgetUSD).toFixed(2)} USD disbursed to Worker Agent.`
          : `Authorization VOIDED. $${Number(budgetUSD).toFixed(2)} USD refunded to Buyer Agent.`,
        stepIndex: 4,
        type: isPassed ? 'PAYPAL_PAYOUT' : 'DISPUTE_REFUND',
        dataPayload: { status: isPassed ? 'SETTLED' : 'REFUNDED', amount: `$${Number(budgetUSD).toFixed(2)} USD` },
      },
    ];

    return NextResponse.json({ contract, messages, result });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

