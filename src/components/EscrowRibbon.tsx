'use client';

import React from 'react';
import { TaskContract } from '@/types/escrow';
import { Lock, Unlock, ShieldAlert, CheckCircle, Zap } from 'lucide-react';

interface EscrowRibbonProps {
  contract: TaskContract;
  onSimulateApproveDeposit: () => void;
}

export const EscrowRibbon: React.FC<EscrowRibbonProps> = ({ contract, onSimulateApproveDeposit }) => {
  const meta = contract.paypalMetadata;
  const isLocked = contract.status === 'ESCROW_LOCKED' || contract.status === 'WORK_IN_PROGRESS' || contract.status === 'DELIVERED_AUDITING';
  const isCompleted = contract.status === 'PAYOUT_COMPLETED';
  const isRefunded = contract.status === 'DISPUTE_REFUNDED';
  const isWaitingDeposit = contract.status === 'WAITING_DEPOSIT';

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
        
        {/* Metric 1: Vault Status (Tier 2: 14px title, Tier 1: 12px text) */}
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <div className="w-9 h-9 rounded-xl bg-[#F0F5FA] border border-[#D0E2F2] flex items-center justify-center text-[#003087] shrink-0">
            {isCompleted ? (
              <CheckCircle className="w-5 h-5 text-emerald-600" />
            ) : isRefunded ? (
              <ShieldAlert className="w-5 h-5 text-rose-600" />
            ) : isLocked ? (
              <Lock className="w-5 h-5 text-[#0070BA]" />
            ) : (
              <Unlock className="w-5 h-5 text-amber-600" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900">Escrow Vault</span>
              {isCompleted && (
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Released & Settled
                </span>
              )}
              {isRefunded && (
                <span className="text-xs font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                  Voided & Refunded
                </span>
              )}
              {isLocked && (
                <span className="text-xs font-semibold text-[#003087] bg-[#F0F5FA] px-2 py-0.5 rounded-full border border-[#D0E2F2]">
                  Funds Secured
                </span>
              )}
              {isWaitingDeposit && (
                <span className="text-xs font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  Awaiting Auth
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {isCompleted
                ? 'Full payout disbursed to Worker Agent'
                : isRefunded
                ? '100% of funds returned to Buyer Agent'
                : isLocked
                ? 'Cryptographically locked under REST v2 Authorization'
                : 'Awaiting buyer cryptographic deposit signature'}
            </p>
          </div>
        </div>

        {/* Metric 2: Escrow Locked Amount (Tier 3: 18px amount, Tier 1: 12px label) */}
        <div className="flex items-center gap-6 w-full lg:w-auto justify-between lg:justify-start border-t lg:border-t-0 lg:border-l border-slate-200 lg:pl-6 pt-3 lg:pt-0">
          <div>
            <span className="text-xs font-medium text-slate-500 block">
              Locked Balance
            </span>
            <div className="text-lg font-extrabold text-[#003087] mt-0.5 flex items-baseline gap-1">
              <span>${contract.totalBudgetUSD.toFixed(2)}</span>
              <span className="text-xs font-medium text-slate-500">USD</span>
            </div>
          </div>

          <div>
            <span className="text-xs font-medium text-slate-500 block">
              Release Gate
            </span>
            <span className="text-xs font-semibold text-[#0070BA] bg-[#F0F5FA] px-2.5 py-1 rounded-md border border-[#D0E2F2] mt-0.5 inline-block">
              Arbiter Score ≥ 95%
            </span>
          </div>
        </div>

        {/* Metric 3: Live Protocol Telemetry (Tier 1: 12px labels & values) */}
        <div className="flex items-center gap-6 w-full lg:w-auto justify-between lg:justify-start border-t lg:border-t-0 lg:border-l border-slate-200 lg:pl-6 pt-3 lg:pt-0 text-xs">
          <div>
            <span className="text-xs font-medium text-slate-400 block">Order ID</span>
            <span className="font-semibold text-slate-800">{meta.orderId || 'Pending'}</span>
          </div>

          <div>
            <span className="text-xs font-medium text-slate-400 block">Auth ID</span>
            <span className="font-bold text-[#0070BA]">{meta.authorizationId || 'Awaiting Auth'}</span>
          </div>

          <div>
            <span className="text-xs font-medium text-slate-400 block">Settlement</span>
            <span className={isCompleted ? 'text-emerald-700 font-bold' : isRefunded ? 'text-rose-700 font-bold' : 'text-slate-500'}>
              {meta.captureId || (isRefunded ? 'Voided' : 'Held')}
            </span>
          </div>
        </div>

        {/* Action Button: When Awaiting Deposit */}
        {isWaitingDeposit && (
          <div className="w-full lg:w-auto shrink-0 border-t lg:border-t-0 pt-3 lg:pt-0">
            <button
              onClick={onSimulateApproveDeposit}
              className="w-full lg:w-auto px-5 py-2.5 rounded-full bg-[#FFC439] hover:bg-[#F4B41A] text-[#003087] font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all active:scale-98 cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>Authorize Escrow Hold</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
