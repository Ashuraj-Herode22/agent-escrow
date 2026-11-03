'use client';

import React from 'react';
import { TaskContract } from '@/types/escrow';
import { Lock, Unlock, ShieldAlert, CheckCircle, Zap, RefreshCw, Check } from 'lucide-react';

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
  const isRevision = contract.status === 'REVISION_REQUESTED';

  const attempt = contract.revisionAttempt || 1;
  const maxAttempts = contract.maxRevisions || 3;

  const releasedAmount = contract.milestones
    .filter((m) => m.status === 'PASSED')
    .reduce((sum, m) => sum + m.amountUSD, 0);
  const refundedAmount = contract.milestones
    .filter((m) => m.status === 'FAILED')
    .reduce((sum, m) => sum + m.amountUSD, 0);

  const getActiveStage = () => {
    switch (contract.status) {
      case 'INITIALIZING':
      case 'NEGOTIATING':
        return 1;
      case 'WAITING_DEPOSIT':
        return 2;
      case 'ESCROW_LOCKED':
      case 'WORK_IN_PROGRESS':
        return 2;
      case 'DELIVERED_AUDITING':
      case 'REVISION_REQUESTED':
        return 3;
      case 'ARBITRATION_PASSED':
      case 'ARBITRATION_FAILED':
      case 'PAYOUT_COMPLETED':
      case 'DISPUTE_REFUNDED':
        return 4;
      default:
        return 1;
    }
  };

  const activeStage = getActiveStage();

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-[0_4px_25px_-5px_rgba(0,48,135,0.07),0_2px_8px_-2px_rgba(0,0,0,0.04)]">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        
        {/* Left: Contract Title, Amount & Vault Status */}
        <div className="flex flex-col gap-2.5 min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-lg font-black text-slate-900 tracking-tight truncate">
              {contract.title}
            </h1>
            <div className="flex items-baseline gap-1.5 bg-slate-50 border border-slate-200/80 px-2.5 py-0.5 rounded-lg">
              <span className="text-lg font-black text-[#003087]">
                ${contract.totalBudgetUSD.toFixed(2)}
              </span>
              <span className="text-[11px] font-bold text-[#0070BA]">USD</span>
            </div>

            {/* Live Vault Badge */}
            {isCompleted && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1.5 shadow-2xs">
                <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" /> Payout Settled to Worker
              </span>
            )}
            {isRefunded && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-800 border border-rose-200 flex items-center gap-1.5 shadow-2xs">
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                  {releasedAmount > 0
                    ? `$${refundedAmount.toFixed(2)} Refunded to Buyer (${((refundedAmount / contract.totalBudgetUSD) * 100).toFixed(0)}% • M2 Voided)`
                    : `100% Refunded ($${contract.totalBudgetUSD.toFixed(2)} to Buyer)`}
                </span>
                {releasedAmount > 0 && (
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1.5 shadow-2xs">
                    <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" />
                    ${releasedAmount.toFixed(2)} Paid to Worker (M1 Cleared)
                  </span>
                )}
              </div>
            )}
            {isRevision && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-800 border border-indigo-200 flex items-center gap-1.5 shadow-2xs">
                <RefreshCw className="w-3.5 h-3.5 text-indigo-600 animate-spin" /> Cure Period: Attempt {attempt} of {maxAttempts}
              </span>
            )}
            {isLocked && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#F0F5FA] text-[#003087] border border-[#D0E2F2] flex items-center gap-1.5 shadow-2xs">
                <Lock className="w-3.5 h-3.5 text-[#0070BA]" /> Funds Secured in Vault
              </span>
            )}
            {isWaitingDeposit && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-900 border border-amber-200 flex items-center gap-1.5 shadow-2xs">
                <Unlock className="w-3.5 h-3.5 text-amber-600" /> Awaiting Deposit Authorization
              </span>
            )}
          </div>

          {/* Subtitle & Protocol Linkage Chips */}
          <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-600 font-mono">
            <span className="bg-slate-100/80 px-2 py-0.5 rounded border border-slate-200/60 font-sans">
              Buyer: <strong className="text-slate-900 font-mono">{contract.buyerAgentId}</strong>
            </span>
            <span className="bg-slate-100/80 px-2 py-0.5 rounded border border-slate-200/60 font-sans">
              Worker: <strong className="text-slate-900 font-mono">{contract.workerAgentId}</strong>
            </span>
            {meta.orderId && (
              <span className="bg-[#F0F5FA] text-[#003087] px-2 py-0.5 rounded border border-[#D0E2F2]">
                Order: <span className="font-bold">{meta.orderId}</span>
              </span>
            )}
            {meta.authorizationId && (
              <span className="bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Auth: {meta.authorizationId}
              </span>
            )}
          </div>
        </div>

        {/* Right: 4-Stage Visual Progress Stepper with PayPal Navy & Semantic Accents */}
        <div className="w-full lg:w-auto flex items-center justify-between lg:justify-end gap-2 sm:gap-4 shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
          
          {/* Stage 1 */}
          <div className="flex items-center gap-2">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
              activeStage > 1
                ? 'bg-[#003087] text-white'
                : activeStage === 1
                ? 'bg-[#003087] text-white ring-4 ring-blue-100'
                : 'bg-slate-100 text-slate-400 border border-slate-200'
            }`}>
              {activeStage > 1 ? <Check className="w-3.5 h-3.5 stroke-[2.5]" /> : '1'}
            </div>
            <span className={`text-xs hidden sm:inline ${activeStage === 1 ? 'font-bold text-[#003087]' : activeStage > 1 ? 'text-slate-700 font-semibold' : 'text-slate-500 font-medium'}`}>
              Requisition
            </span>
          </div>

          <div className={`w-4 sm:w-6 h-0.5 shrink-0 transition-colors ${activeStage > 1 ? 'bg-[#003087]' : 'bg-slate-200'}`} />

          {/* Stage 2 */}
          <div className="flex items-center gap-2">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
              activeStage > 2
                ? 'bg-[#003087] text-white'
                : activeStage === 2
                ? 'bg-[#003087] text-white ring-4 ring-blue-100'
                : 'bg-slate-100 text-slate-400 border border-slate-200'
            }`}>
              {activeStage > 2 ? <Check className="w-3.5 h-3.5 stroke-[2.5]" /> : '2'}
            </div>
            <span className={`text-xs hidden sm:inline ${activeStage === 2 ? 'font-bold text-[#003087]' : activeStage > 2 ? 'text-slate-700 font-semibold' : 'text-slate-500 font-medium'}`}>
              Escrow Hold
            </span>
          </div>

          <div className={`w-4 sm:w-6 h-0.5 shrink-0 transition-colors ${activeStage > 2 ? 'bg-[#003087]' : 'bg-slate-200'}`} />

          {/* Stage 3 */}
          <div className="flex items-center gap-2">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
              activeStage > 3
                ? 'bg-[#003087] text-white'
                : activeStage === 3
                ? 'bg-[#003087] text-white ring-4 ring-blue-100'
                : 'bg-slate-100 text-slate-400 border border-slate-200'
            }`}>
              {activeStage > 3 ? <Check className="w-3.5 h-3.5 stroke-[2.5]" /> : '3'}
            </div>
            <span className={`text-xs hidden sm:inline ${activeStage === 3 ? 'font-bold text-[#003087]' : activeStage > 3 ? 'text-slate-700 font-semibold' : 'text-slate-500 font-medium'}`}>
              Worker Build
            </span>
          </div>

          <div className={`w-4 sm:w-6 h-0.5 shrink-0 transition-colors ${activeStage > 3 ? 'bg-[#003087]' : 'bg-slate-200'}`} />

          {/* Stage 4 */}
          <div className="flex items-center gap-2">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
              isCompleted
                ? 'bg-emerald-600 text-white'
                : isRefunded
                ? 'bg-rose-600 text-white'
                : activeStage === 4
                ? 'bg-[#003087] text-white ring-4 ring-blue-100'
                : 'bg-slate-100 text-slate-400 border border-slate-200'
            }`}>
              {isCompleted ? <Check className="w-3.5 h-3.5 stroke-[2.5]" /> : isRefunded ? '✕' : '4'}
            </div>
            <span className={`text-xs hidden sm:inline ${
              isCompleted
                ? 'font-bold text-emerald-700'
                : isRefunded
                ? 'font-bold text-rose-700'
                : activeStage === 4
                ? 'font-bold text-[#003087]'
                : 'text-slate-500 font-medium'
            }`}>
              Settlement
            </span>
          </div>

          {/* Deposit Action Button if Awaiting */}
          {isWaitingDeposit && (
            <button
              onClick={onSimulateApproveDeposit}
              className="ml-2 px-3.5 py-1.5 rounded-full bg-[#003087] hover:bg-[#002266] text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all cursor-pointer active:scale-98"
            >
              <Zap className="w-3.5 h-3.5 fill-[#FFC439] text-[#FFC439]" />
              <span>Authorize Hold</span>
            </button>
          )}

        </div>

      </div>
    </div>
  );
};
