import { NextRequest, NextResponse } from 'next/server';
import { captureEscrowPayment, voidEscrowAuthorization } from '@/lib/paypal';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { authorizationId, amountUSD, action = 'CAPTURE', reason = 'AI Arbiter verification failed' } = body;

    if (!authorizationId) {
      return NextResponse.json({ error: 'authorizationId is required' }, { status: 400 });
    }

    if (action === 'VOID') {
      const voidResult = await voidEscrowAuthorization(authorizationId, reason);
      return NextResponse.json(voidResult);
    }

    const captureResult = await captureEscrowPayment(authorizationId, Number(amountUSD || 75));
    return NextResponse.json(captureResult);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error executing PayPal capture/void:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

