'use client';

import React from 'react';
import { TaskContract } from '@/types/escrow';
import { Lock, Unlock, ShieldAlert, CheckCircle, ExternalLink, Zap } from 'lucide-react';

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
    <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-sm shadow-xl flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-900/40 border border-blue-500/30 flex items-center justify-center">
            <span className="font-bold text-blue-400 text-sm">PP</span>
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">PayPal Escrow Vault</h3>
            <p className="text-[11px] text-slate-400">Programmable Conditional Escrow</p>
          </div>
        </div>

        {/* Vault State Icon */}
        <div className="flex items-center gap-2">
          {isCompleted && (
            <span className="flex items-center gap-1 text-xs text-emerald-400 font-semibold bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-800/60">
              <CheckCircle className="w-3.5 h-3.5" /> Released & Paid
            </span>
          )}
          {isRefunded && (
            <span className="flex items-center gap-1 text-xs text-rose-400 font-semibold bg-rose-950/60 px-2.5 py-1 rounded-full border border-rose-800/60">
              <ShieldAlert className="w-3.5 h-3.5" /> Voided & Refunded
            </span>
          )}
          {isLocked && (
            <span className="flex items-center gap-1 text-xs text-cyan-400 font-semibold bg-cyan-950/60 px-2.5 py-1 rounded-full border border-cyan-800/60 animate-pulse">
              <Lock className="w-3.5 h-3.5" /> Escrow Locked
            </span>
          )}
          {isWaitingDeposit && (
            <span className="flex items-center gap-1 text-xs text-amber-400 font-semibold bg-amber-950/60 px-2.5 py-1 rounded-full border border-amber-800/60">
              <Unlock className="w-3.5 h-3.5" /> Awaiting Auth
            </span>
          )}
        </div>
      </div>

      {/* Vault Balance Display */}
      <div className="bg-gradient-to-br from-slate-950 to-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
        <div>
          <span className="text-[11px] text-slate-400 block uppercase tracking-wider font-medium">Vault Lock Amount</span>
          <div className="text-2xl font-black text-white mt-0.5 flex items-baseline gap-1.5">
            <span>${contract.totalBudgetUSD.toFixed(2)}</span>
            <span className="text-xs font-normal text-slate-400">USD</span>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[11px] text-slate-400 block uppercase tracking-wider font-medium">Smart Condition</span>
          <span className="text-xs font-mono text-cyan-400">AI Arbiter ≥ 95% Pass</span>
        </div>
      </div>

      {/* PayPal Telemetry Info */}
      <div className="space-y-1.5 text-xs font-mono bg-slate-950/50 rounded-xl p-3 border border-slate-800/60">
        <div className="flex items-center justify-between text-slate-400">
          <span>PayPal Order ID:</span>
          <span className="text-slate-200">{meta.orderId || 'PENDING_CREATION'}</span>
        </div>
        <div className="flex items-center justify-between text-slate-400">
          <span>Authorization ID:</span>
          <span className="text-cyan-400 font-semibold">{meta.authorizationId || 'AWAITING_AUTH'}</span>
        </div>
        <div className="flex items-center justify-between text-slate-400">
          <span>Capture / Settlement:</span>
          <span className={isCompleted ? 'text-emerald-400' : isRefunded ? 'text-rose-400' : 'text-slate-500'}>
            {meta.captureId || (isRefunded ? 'VOIDED_UNRELEASED' : 'LOCKED_IN_ESCROW')}
          </span>
        </div>
      </div>

      {/* Interactive Trigger if awaiting deposit */}
      {isWaitingDeposit && (
        <button
          onClick={onSimulateApproveDeposit}
          className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-900/40 transition-all active:scale-98"
        >
          <Zap className="w-3.5 h-3.5" />
          <span>Authorize Escrow via PayPal Sandbox</span>
        </button>
      )}

      {/* Developer note */}
      <div className="text-[10px] text-slate-500 flex items-center justify-between pt-1 border-t border-slate-800/40">
        <span>PayPal REST v2 Orders & Payouts Engine</span>
        <span className="flex items-center gap-1 text-blue-400/80">
          Sandbox Node <ExternalLink className="w-2.5 h-2.5" />
        </span>
      </div>
    </div>
  );
};
