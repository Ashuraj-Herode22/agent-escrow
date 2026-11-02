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
          <div className="w-8 h-8 rounded-lg bg-[#003087] flex items-center justify-center text-white shadow-xs">
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
            <span className="flex items-center gap-1.5 text-xs text-emerald-800 font-semibold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 shadow-2xs">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Released & Settled
            </span>
          )}
          {isRefunded && (
            <span className="flex items-center gap-1.5 text-xs text-rose-800 font-semibold bg-rose-50 px-3 py-1 rounded-full border border-rose-200 shadow-2xs">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-600" /> Voided & Refunded
            </span>
          )}
          {isLocked && (
            <span className="flex items-center gap-1.5 text-xs text-[#003087] font-semibold bg-[#F0F5FA] px-3 py-1 rounded-full border border-[#D0E2F2] shadow-2xs">
              <Lock className="w-3.5 h-3.5 text-[#0070BA]" /> Funds Secured
            </span>
          )}
          {isWaitingDeposit && (
            <span className="flex items-center gap-1.5 text-xs text-amber-800 font-semibold bg-amber-50 px-3 py-1 rounded-full border border-amber-200 shadow-2xs">
              <Unlock className="w-3.5 h-3.5 text-amber-600" /> Awaiting Auth
            </span>
          )}
        </div>
      </div>

      {/* Vault Balance Display (Clean Navy Theme) */}
      <div className="bg-gradient-to-r from-[#F0F5FA] to-white border border-[#D0E2F2] rounded-xl p-4 flex items-center justify-between">
        <div>
          <span className="text-[11px] text-[#0070BA] block uppercase tracking-wider font-bold">
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
          <span className="text-xs font-mono font-bold text-[#003087] bg-white px-2.5 py-1 rounded border border-[#D0E2F2] mt-0.5 inline-block shadow-2xs">
            Arbiter Score ≥ 95%
          </span>
        </div>
      </div>

      {/* Protocol Telemetry Info */}
      <div className="space-y-2 text-xs font-mono bg-[#F8FAFC] rounded-xl p-3.5 border border-slate-200">
        <div className="flex items-center justify-between text-slate-600">
          <span className="font-sans font-medium text-slate-500">Order ID:</span>
          <span className="text-slate-800 font-semibold">{meta.orderId || 'PENDING_CREATION'}</span>
        </div>
        <div className="flex items-center justify-between text-slate-600">
          <span className="font-sans font-medium text-slate-500">Authorization ID:</span>
          <span className="text-[#003087] font-bold">{meta.authorizationId || 'AWAITING_AUTH'}</span>
        </div>
        <div className="flex items-center justify-between text-slate-600">
          <span className="font-sans font-medium text-slate-500">Settlement Status:</span>
          <span className={`font-bold ${isCompleted ? 'text-emerald-700' : isRefunded ? 'text-rose-700' : 'text-[#003087]'}`}>
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
          <Zap className="w-3.5 h-3.5 fill-[#FFC439] text-[#FFC439]" />
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
