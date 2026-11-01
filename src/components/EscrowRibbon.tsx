'use client';

import React from 'react';
import { TaskContract } from '@/types/escrow';
import { Lock, Unlock, ShieldAlert, CheckCircle, Zap, RefreshCw, Check, ArrowRight } from 'lucide-react';

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

  // Determine which step in the 4-stage visual journey is active
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
    <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        
        {/* Left: Contract Title, Amount & Vault Status */}
        <div className="flex flex-col gap-2 min-w-0">
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-base font-extrabold text-slate-900 tracking-tight truncate">
              {contract.title}
            </h1>
            <span className="text-base font-extrabold text-[#003087]">
              ${contract.totalBudgetUSD.toFixed(2)} <span className="text-xs font-semibold text-slate-500">USD</span>
            </span>

            {/* Live Vault Badge */}
            {isCompleted && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> Payout Settled to Worker
              </span>
            )}
            {isRefunded && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5" /> 100% Refunded to Buyer
              </span>
            )}
            {isRevision && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-1">
                <RefreshCw className="w-3.5 h-3.5" /> Cure Period: Attempt {attempt} of {maxAttempts}
              </span>
            )}
            {isLocked && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#F0F5FA] text-[#003087] border border-[#D0E2F2] flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-[#0070BA]" /> Funds Secured in Vault
              </span>
            )}
            {isWaitingDeposit && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
                <Unlock className="w-3.5 h-3.5 text-amber-600" /> Awaiting Deposit Authorization
              </span>
            )}
          </div>

          {/* Subtitle & Protocol Linkage */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
            <span>
              Buyer: <strong className="text-slate-700">{contract.buyerAgentId}</strong>
            </span>
            <span>•</span>
            <span>
              Worker: <strong className="text-slate-700">{contract.workerAgentId}</strong>
            </span>
            {meta.orderId && (
              <>
                <span>•</span>
                <span className="font-mono text-[11px] text-slate-400">
                  Order: {meta.orderId}
                </span>
              </>
            )}
            {meta.authorizationId && (
              <>
                <span>•</span>
                <span className="font-mono text-[11px] text-[#0070BA] font-semibold">
                  Auth: {meta.authorizationId}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Right: 4-Stage Visual Progress Stepper (Dumb-Simple to Understand!) */}
        <div className="w-full lg:w-auto flex items-center justify-between lg:justify-end gap-2 sm:gap-4 shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
          
          {/* Stage 1 */}
          <div className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
              activeStage > 1
                ? 'bg-emerald-600 text-white'
                : activeStage === 1
                ? 'bg-[#0070BA] text-white shadow-xs animate-pulse'
                : 'bg-slate-100 text-slate-400'
            }`}>
              {activeStage > 1 ? <Check className="w-4 h-4" /> : '1'}
            </div>
            <span className={`text-xs hidden sm:inline ${activeStage === 1 ? 'font-bold text-[#003087]' : 'text-slate-500'}`}>
              Requisition
            </span>
          </div>

          <div className="w-4 sm:w-6 h-0.5 bg-slate-200 shrink-0" />

          {/* Stage 2 */}
          <div className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
              activeStage > 2
                ? 'bg-emerald-600 text-white'
                : activeStage === 2
                ? 'bg-[#0070BA] text-white shadow-xs animate-pulse'
                : 'bg-slate-100 text-slate-400'
            }`}>
              {activeStage > 2 ? <Check className="w-4 h-4" /> : '2'}
            </div>
            <span className={`text-xs hidden sm:inline ${activeStage === 2 ? 'font-bold text-[#003087]' : 'text-slate-500'}`}>
              Escrow Hold
            </span>
          </div>

          <div className="w-4 sm:w-6 h-0.5 bg-slate-200 shrink-0" />

          {/* Stage 3 */}
          <div className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
              activeStage > 3
                ? 'bg-emerald-600 text-white'
                : activeStage === 3
                ? 'bg-[#0070BA] text-white shadow-xs animate-pulse'
                : 'bg-slate-100 text-slate-400'
            }`}>
              {activeStage > 3 ? <Check className="w-4 h-4" /> : '3'}
            </div>
            <span className={`text-xs hidden sm:inline ${activeStage === 3 ? 'font-bold text-[#003087]' : 'text-slate-500'}`}>
              Worker Build
            </span>
          </div>

          <div className="w-4 sm:w-6 h-0.5 bg-slate-200 shrink-0" />

          {/* Stage 4 */}
          <div className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
              isCompleted
                ? 'bg-emerald-600 text-white shadow-xs'
                : isRefunded
                ? 'bg-rose-600 text-white shadow-xs'
                : activeStage === 4
                ? 'bg-[#0070BA] text-white shadow-xs animate-pulse'
                : 'bg-slate-100 text-slate-400'
            }`}>
              {isCompleted ? <Check className="w-4 h-4" /> : isRefunded ? '✕' : '4'}
            </div>
            <span className={`text-xs hidden sm:inline ${activeStage === 4 ? 'font-bold text-[#003087]' : 'text-slate-500'}`}>
              Settlement
            </span>
          </div>

          {/* Deposit Action Button if Awaiting */}
          {isWaitingDeposit && (
            <button
              onClick={onSimulateApproveDeposit}
              className="ml-2 px-3 py-1.5 rounded-full bg-[#FFC439] hover:bg-[#F4B41A] text-[#003087] font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all cursor-pointer active:scale-98"
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>Authorize</span>
            </button>
          )}

        </div>

      </div>
    </div>
  );
};
