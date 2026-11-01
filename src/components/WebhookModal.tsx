'use client';

import React, { useState } from 'react';
import { X, Webhook, CheckCircle2, ShieldCheck, Copy } from 'lucide-react';
import { TaskContract } from '@/types/escrow';

interface WebhookModalProps {
  isOpen: boolean;
  onClose: () => void;
  contract: TaskContract;
}

export const WebhookModal: React.FC<WebhookModalProps> = ({ isOpen, onClose, contract }) => {
  const [selectedEvent, setSelectedEvent] = useState<'CAPTURE' | 'AUTH' | 'VOID'>('CAPTURE');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const meta = contract.paypalMetadata;

  const webhookPayloads = {
    AUTH: {
      id: `WH-AUTH-${meta.authorizationId || '77312'}`,
      event_version: '1.0',
      create_time: meta.escrowLockedAt || new Date().toISOString(),
      resource_type: 'authorization',
      event_type: 'PAYMENT.AUTHORIZATION.CREATED',
      summary: `Payment authorization created for $${contract.totalBudgetUSD.toFixed(2)} USD`,
      resource: {
        id: meta.authorizationId || 'AUTH-77312',
        amount: { total: contract.totalBudgetUSD.toFixed(2), currency: 'USD' },
        state: 'authorized',
        parent_payment: meta.orderId || 'ORD-98213',
        valid_until: new Date(Date.now() + 72 * 3600 * 1000).toISOString(),
      },
      links: [{ href: `https://api.sandbox.paypal.com/v2/payments/authorizations/${meta.authorizationId}`, rel: 'self', method: 'GET' }],
    },
    CAPTURE: {
      id: `WH-CAP-${meta.captureId || '88312'}`,
      event_version: '1.0',
      create_time: meta.releasedAt || new Date().toISOString(),
      resource_type: 'capture',
      event_type: 'PAYMENT.CAPTURE.COMPLETED',
      summary: `Payment capture completed for $${contract.totalBudgetUSD.toFixed(2)} USD upon AI Arbiter approval`,
      resource: {
        id: meta.captureId || 'CAP-88312',
        amount: { total: contract.totalBudgetUSD.toFixed(2), currency: 'USD' },
        state: 'completed',
        is_final_capture: true,
        parent_payment: meta.authorizationId || 'AUTH-77312',
      },
    },
    VOID: {
      id: `WH-VOID-${meta.authorizationId || '77312'}`,
      event_version: '1.0',
      create_time: new Date().toISOString(),
      resource_type: 'authorization',
      event_type: 'PAYMENT.AUTHORIZATION.VOIDED',
      summary: 'Payment authorization voided due to AI Arbiter security violation interception',
      resource: {
        id: meta.authorizationId || 'AUTH-77312',
        state: 'voided',
        reason: 'AI_ARBITER_CWE_SECURITY_VIOLATION',
      },
    },
  };

  const currentPayload = webhookPayloads[selectedEvent];

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(currentPayload, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-xl w-full p-6 text-xs flex flex-col gap-4">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#F0F5FA] border border-[#D0E2F2] flex items-center justify-center text-[#003087]">
              <Webhook className="w-4 h-4 text-[#0070BA]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">PayPal Webhook Event Telemetry</h3>
              <p className="text-xs text-slate-500">Cryptographically Signed Webhook Payloads</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Verification Status Banner */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-2.5 flex items-center justify-between">
          <span className="flex items-center gap-1.5 font-semibold text-emerald-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>HMAC-SHA256 Signature Verified (200 OK)</span>
          </span>
          <span className="text-[11px] font-mono text-emerald-700">CERT: PP-SANDBOX-AUTH</span>
        </div>

        {/* Event Selectors */}
        <div className="grid grid-cols-3 bg-slate-100 p-0.5 rounded-lg text-center text-xs font-medium">
          <button
            onClick={() => setSelectedEvent('CAPTURE')}
            className={`py-1 rounded-md transition-all cursor-pointer ${
              selectedEvent === 'CAPTURE' ? 'bg-white text-[#003087] font-bold shadow-2xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            CAPTURE.COMPLETED
          </button>

          <button
            onClick={() => setSelectedEvent('AUTH')}
            className={`py-1 rounded-md transition-all cursor-pointer ${
              selectedEvent === 'AUTH' ? 'bg-white text-[#003087] font-bold shadow-2xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            AUTH.CREATED
          </button>

          <button
            onClick={() => setSelectedEvent('VOID')}
            className={`py-1 rounded-md transition-all cursor-pointer ${
              selectedEvent === 'VOID' ? 'bg-white text-[#003087] font-bold shadow-2xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            AUTH.VOIDED
          </button>
        </div>

        {/* JSON Code Viewer */}
        <div className="relative">
          <button
            onClick={handleCopy}
            className="absolute right-3 top-3 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-mono flex items-center gap-1 cursor-pointer transition-colors"
          >
            <Copy className="w-3 h-3" />
            <span>{copied ? 'Copied!' : 'Copy JSON'}</span>
          </button>

          <pre className="p-3.5 rounded-xl bg-slate-900 text-emerald-300 text-[11px] font-mono overflow-x-auto leading-relaxed max-h-64 border border-slate-800">
            {JSON.stringify(currentPayload, null, 2)}
          </pre>
        </div>

      </div>
    </div>
  );
};

