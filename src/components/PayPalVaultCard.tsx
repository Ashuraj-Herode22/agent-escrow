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
          <div className="w-8 h-8 rounded-lg bg-[#F0F5FA] border border-[#D0E2F2] flex items-center justify-center text-[#003087]">
            <Shield className="w-4 h-4 fill-[#0070BA]/20 stroke-[#003087]" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Conditional Escrow Vault</h3>
            <p className="text-[11px] text-slate-500 font-medium">Programmable Milestone Release</p>
          </div>
        </div>

        {/* Vault State Indicator */}
        <div className="flex items-center gap-2">
          {isCompleted && (
            <span className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              <CheckCircle className="w-3.5 h-3.5" /> Released & Settled
            </span>
          )}
          {isRefunded && (
            <span className="flex items-center gap-1.5 text-xs text-rose-700 font-semibold bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
              <ShieldAlert className="w-3.5 h-3.5" /> Voided & Refunded
            </span>
          )}
          {isLocked && (
            <span className="flex items-center gap-1.5 text-xs text-[#003087] font-semibold bg-[#F0F5FA] px-3 py-1 rounded-full border border-[#D0E2F2]">
              <Lock className="w-3.5 h-3.5 text-[#0070BA]" /> Funds Secured
            </span>
          )}
          {isWaitingDeposit && (
            <span className="flex items-center gap-1.5 text-xs text-amber-800 font-semibold bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              <Unlock className="w-3.5 h-3.5 text-amber-600" /> Awaiting Auth
            </span>
          )}
        </div>
      </div>

      {/* Vault Balance Display (Clean Signature Blue Tint) */}
      <div className="bg-[#F0F5FA]/80 border border-[#D0E2F2] rounded-xl p-4 flex items-center justify-between">
        <div>
          <span className="text-[11px] text-slate-500 block uppercase tracking-wider font-semibold">
            Escrow Locked Balance
          </span>
          <div className="text-2xl font-black text-[#003087] mt-0.5 flex items-baseline gap-1.5">
            <span>${contract.totalBudgetUSD.toFixed(2)}</span>
            <span className="text-xs font-semibold text-slate-500">USD</span>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[11px] text-slate-500 block uppercase tracking-wider font-semibold">
            Release Gate
          </span>
          <span className="text-xs font-mono font-bold text-[#0070BA] bg-white px-2.5 py-1 rounded border border-[#D0E2F2] mt-0.5 inline-block shadow-2xs">
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
          <span className="text-[#0070BA] font-bold">{meta.authorizationId || 'AWAITING_AUTH'}</span>
        </div>
        <div className="flex items-center justify-between text-slate-600">
          <span className="font-sans font-medium text-slate-500">Settlement Status:</span>
          <span className={isCompleted ? 'text-emerald-700 font-bold' : isRefunded ? 'text-rose-700 font-bold' : 'text-slate-600'}>
            {meta.captureId || (isRefunded ? 'VOIDED_AUTHORIZATION' : 'LOCKED_IN_ESCROW')}
          </span>
        </div>
      </div>

      {/* High-Intent Action Button Styled in Classic Gold */}
      {isWaitingDeposit && (
        <button
          onClick={onSimulateApproveDeposit}
          className="w-full py-2.5 px-4 rounded-full bg-[#FFC439] hover:bg-[#F4B41A] text-[#003087] font-extrabold text-xs flex items-center justify-center gap-2 shadow-xs transition-all active:scale-98 cursor-pointer"
        >
          <Zap className="w-3.5 h-3.5 fill-current" />
          <span>Authorize Conditional Escrow Hold</span>
        </button>
      )}

      {/* Developer note */}
      <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1 border-t border-slate-200/60 font-medium">
        <span>REST v2 Orders & Authorizations Engine</span>
        <span className="flex items-center gap-1 text-[#0070BA] hover:underline cursor-pointer">
          Sandbox Node <ExternalLink className="w-2.5 h-2.5" />
        </span>
      </div>

    </div>
  );
};
