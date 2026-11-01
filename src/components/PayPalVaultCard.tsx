'use client';

import React from 'react';
import { TaskContract } from '@/types/escrow';
import { Lock, Unlock, ShieldAlert, CheckCircle, ExternalLink, Zap, Shield } from 'lucide-react';

interface PayPalVaultCardProps {
  contract: TaskContract;
  onSimulateApproveDeposit: () => void;
}

export const PayPalVaultCard: React.FC<PayPalVaultCardProps> = ({ contract, onSimulateApproveDeposit }) => {
  const meta = contract.paypalMetadata;
  const isLocked = contract.status === 'ESCROW_LOCKED' || contract.status === 'WORK_IN_PROGRESS' || contract.status === 'DELIVERED_AUDITING';
  const isCompleted = contract.status === 'PAYOUT_COMPLETED';
  const isRefunded = contract.status === 'DISPUTE_REFUNDED';
  const isWaitingDeposit = contract.status === 'WAITING_DEPOSIT';

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col gap-4">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#003087] flex items-center justify-center text-white">
            <Shield className="w-4 h-4 fill-white/20 stroke-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Conditional Escrow Vault</h3>
            <p className="text-[11px] text-slate-500 font-medium">Programmable Milestone Release</p>
          </div>
        </div>

        {/* Vault State Indicator */}
        <div className="flex items-center gap-2">
          {isCompleted && (
            <span className="flex items-center gap-1.5 text-xs text-slate-900 font-semibold bg-slate-100 px-3 py-1 rounded-full border border-slate-300">
              <CheckCircle className="w-3.5 h-3.5" /> Released & Settled
            </span>
          )}
          {isRefunded && (
            <span className="flex items-center gap-1.5 text-xs text-slate-900 font-semibold bg-slate-100 px-3 py-1 rounded-full border border-slate-300">
              <ShieldAlert className="w-3.5 h-3.5" /> Voided & Refunded
            </span>
          )}
          {isLocked && (
            <span className="flex items-center gap-1.5 text-xs text-slate-900 font-semibold bg-slate-100 px-3 py-1 rounded-full border border-slate-300">
              <Lock className="w-3.5 h-3.5 text-slate-800" /> Funds Secured
            </span>
          )}
          {isWaitingDeposit && (
            <span className="flex items-center gap-1.5 text-xs text-slate-900 font-semibold bg-slate-100 px-3 py-1 rounded-full border border-slate-300">
              <Unlock className="w-3.5 h-3.5 text-slate-800" /> Awaiting Auth
            </span>
          )}
        </div>
      </div>

      {/* Vault Balance Display (Clean Neutral Box) */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between">
        <div>
          <span className="text-[11px] text-slate-500 block uppercase tracking-wider font-semibold">
            Escrow Locked Balance
          </span>
          <div className="text-2xl font-black text-slate-900 mt-0.5 flex items-baseline gap-1.5">
            <span>${contract.totalBudgetUSD.toFixed(2)}</span>
            <span className="text-xs font-semibold text-slate-500">USD</span>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[11px] text-slate-500 block uppercase tracking-wider font-semibold">
            Release Gate
          </span>
          <span className="text-xs font-mono font-bold text-slate-900 bg-white px-2.5 py-1 rounded border border-slate-200 mt-0.5 inline-block shadow-2xs">
            Arbiter Score ≥ 95%
          </span>
        </div>
      </div>

      {/* Protocol Telemetry Info */}
      <div className="space-y-2 text-xs font-mono bg-slate-50/80 rounded-xl p-3.5 border border-slate-200/80">
        <div className="flex items-center justify-between text-slate-600">
          <span className="font-sans font-medium text-slate-500">Order ID:</span>
          <span className="text-slate-800 font-semibold">{meta.orderId || 'PENDING_CREATION'}</span>
        </div>
        <div className="flex items-center justify-between text-slate-600">
          <span className="font-sans font-medium text-slate-500">Authorization ID:</span>
          <span className="text-slate-900 font-bold">{meta.authorizationId || 'AWAITING_AUTH'}</span>
        </div>
        <div className="flex items-center justify-between text-slate-600">
          <span className="font-sans font-medium text-slate-500">Settlement Status:</span>
          <span className="text-slate-900 font-bold">
            {meta.captureId || (isRefunded ? 'VOIDED_AUTHORIZATION' : 'LOCKED_IN_ESCROW')}
          </span>
        </div>
      </div>

      {/* Action Button Styled in PayPal Deep Navy */}
      {isWaitingDeposit && (
        <button
          onClick={onSimulateApproveDeposit}
          className="w-full py-2.5 px-4 rounded-full bg-[#003087] hover:bg-[#002266] text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-xs transition-all active:scale-98 cursor-pointer"
        >
          <Zap className="w-3.5 h-3.5 fill-current" />
          <span>Authorize Conditional Escrow Hold</span>
        </button>
      )}

      {/* Developer note */}
      <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1 border-t border-slate-200/60 font-medium">
        <span>Orders & Authorizations Engine</span>
        <span className="flex items-center gap-1 text-slate-700 hover:underline cursor-pointer">
          Sandbox Node <ExternalLink className="w-2.5 h-2.5" />
        </span>
      </div>

    </div>
  );
};
