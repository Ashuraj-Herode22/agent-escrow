import { NextRequest, NextResponse } from 'next/server';
import { authorizeEscrowOrder } from '@/lib/paypal';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId } = body;

    if (!orderId) {
      return NextResponse.json({ error: 'orderId is required' }, { status: 400 });
    }

    const authResult = await authorizeEscrowOrder(orderId);
    return NextResponse.json(authResult);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error authorizing PayPal order:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

