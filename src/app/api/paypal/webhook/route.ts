import { NextRequest, NextResponse } from 'next/server';

/**
 * PayPal Webhook Listener Endpoint
 * Receives live asynchronous webhook notifications from PayPal Sandbox:
 * - CHECKOUT.ORDER.APPROVED
 * - PAYMENT.AUTHORIZATION.CREATED
 * - PAYMENT.CAPTURE.COMPLETED
 * - PAYMENT.AUTHORIZATION.VOIDED
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const eventType = body.event_type || 'UNKNOWN_EVENT';
    const eventId = body.id || 'EVT_UNKNOWN';
    const resourceId = body.resource?.id || 'RES_UNKNOWN';

    console.log(`[PayPal Webhook Received] ID: ${eventId} | Type: ${eventType} | Resource: ${resourceId}`);

    // Return 200 OK immediately to satisfy PayPal Webhook delivery verification
    return NextResponse.json({
      status: 'SUCCESS',
      received: true,
      eventId,
      eventType,
      resourceId,
      timestamp: new Date().toISOString(),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error processing PayPal webhook:', error);
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'ONLINE',
    endpoint: '/api/paypal/webhook',
    protocol: 'AgentEscrow Webhook Telemetry Listener',
    supportedEvents: [
      'CHECKOUT.ORDER.APPROVED',
      'PAYMENT.AUTHORIZATION.CREATED',
      'PAYMENT.CAPTURE.COMPLETED',
      'PAYMENT.AUTHORIZATION.VOIDED',
    ],
  });
}
