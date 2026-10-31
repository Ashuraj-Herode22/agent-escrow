import { NextRequest, NextResponse } from 'next/server';
import { createEscrowOrder } from '@/lib/paypal';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { amountUSD = 75, description = 'AgentEscrow Milestone Authorization' } = body;

    const order = await createEscrowOrder(Number(amountUSD), description);
    return NextResponse.json(order);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error creating PayPal escrow order:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
