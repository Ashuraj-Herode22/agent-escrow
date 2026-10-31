import { NextRequest, NextResponse } from 'next/server';
import { generateDynamicAgentWorkflow } from '@/lib/gemini';
import { createEscrowOrder, authorizeEscrowOrder, captureEscrowPayment } from '@/lib/paypal';

/**
 * Public REST v1 Requisition API
 * Allows external AI agents (CrewAI, LangChain, AutoGen) or curl commands to trigger AgentEscrow.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      task = 'Sample Autonomous Work',
      description = 'Headless execution via public API',
      bountyUSD = 50.00,
      autoSettle = true,
    } = body;

    const order = await createEscrowOrder(Number(bountyUSD), task);
    const auth = await authorizeEscrowOrder(order.id);
    const workflow = await generateDynamicAgentWorkflow(task, description, Number(bountyUSD));

    let settlement = null;
    if (autoSettle && workflow.verdict === 'RELEASE_FUNDS_AUTHORIZED') {
      settlement = await captureEscrowPayment(auth.authorizationId, Number(bountyUSD));
    }

    return NextResponse.json({
      success: true,
      protocol: 'AgentEscrow v2.4 (REST v2 Engine)',
      contractId: `AG-${Math.floor(1000 + Math.random() * 9000)}`,
      orderId: order.id,
      authorizationId: auth.authorizationId,
      verdict: workflow.verdict,
      complianceScore: `${workflow.score}%`,
      settlementStatus: settlement ? 'CAPTURED_AND_PAID' : 'VOIDED_OR_HELD',
      artifactGenerated: {
        filename: workflow.filename,
        language: workflow.language,
        testsPassed: `${workflow.tests.filter(t => t.passed).length}/${workflow.tests.length}`,
      },
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'ONLINE',
    protocol: 'AgentEscrow Public Gateway',
    version: '2.4.0',
    documentation: 'Send POST with { "task": string, "bountyUSD": number } to dispatch autonomous escrow.',
  });
}

