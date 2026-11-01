'use client';

import React from 'react';
import { TaskContract } from '@/types/escrow';
import {
  Code2,
  ShieldCheck,
  Cpu,
  ExternalLink,
  Check,
  Sparkles,
  FileCheck,
} from 'lucide-react';

interface CodeInspectorProps {
  contract: TaskContract;
  onOpenPolicyModal?: () => void;
  onOpenArtifactModal: (tab?: 'CODE' | 'TESTS' | 'AUDIT') => void;
}

export const CodeInspector: React.FC<CodeInspectorProps> = ({
  contract,
  onOpenPolicyModal,
  onOpenArtifactModal,
}) => {
  const artifact = contract.codeArtifact;
  const isFailed = contract.status === 'ARBITRATION_FAILED' || contract.status === 'DISPUTE_REFUNDED';
  const isPassed = contract.status === 'ARBITRATION_PASSED' || contract.status === 'PAYOUT_COMPLETED';
  const isRevision = contract.status === 'REVISION_REQUESTED';
  const attemptNum = contract.revisionAttempt || 1;
  const maxAttempts = contract.maxRevisions || 3;

  // Dynamic step tracker determination (1 through 6/7/8)
  const getPipelineStage = () => {
    switch (contract.status) {
      case 'INITIALIZING':
      case 'NEGOTIATING':
        return 1;
      case 'WAITING_DEPOSIT':
        return 2;
      case 'ESCROW_LOCKED':
      case 'WORK_IN_PROGRESS':
        return 3;
      case 'DELIVERED_AUDITING':
        return contract.isPatched ? 5 : 4;
      case 'REVISION_REQUESTED':
        return 5;
      case 'ARBITRATION_PASSED':
      case 'ARBITRATION_FAILED':
        return 6;
      case 'PAYOUT_COMPLETED':
      case 'DISPUTE_REFUNDED':
        return 7;
      default:
        return 1;
    }
  };

  const currentStage = getPipelineStage();
  const isHealing = contract.id === 'AG-8814';

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex flex-col h-[600px]">
      
      {/* Title & Quick Actions Row */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[#003087] to-[#0070BA] flex items-center justify-center text-white">
            <Code2 className="w-3.5 h-3.5 text-white" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">
            Verification Engine
          </h3>
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            runtime-node-01
          </span>
        </div>

        <div className="flex items-center gap-2">
          {artifact && (
            <button
              onClick={() => onOpenArtifactModal('CODE')}
              className="text-xs font-bold px-3 py-1 rounded-full bg-[#003087] hover:bg-[#002060] text-white flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs active:scale-98"
              title="Open full Deliverable Code & Tests Inspection modal"
            >
              <ExternalLink className="w-3.5 h-3.5 text-white" />
              <span>Inspect Code & Tests</span>
            </button>
          )}

          {onOpenPolicyModal && (
            <button
              onClick={onOpenPolicyModal}
              className="text-xs font-semibold px-2.5 py-1 rounded-full text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 flex items-center gap-1 transition-colors cursor-pointer"
              title="Inspect Security & Governance Policy"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-slate-600" />
              <span>Policy</span>
            </button>
          )}
        </div>
      </div>

      {/* Top Telemetry Card with subtle blue background gradient */}
      <div className="bg-gradient-to-r from-[#F0F5FA] to-[#F8FAFC] border border-[#D0E2F2] rounded-xl p-3.5 flex flex-col gap-2 mb-3">
        <div className="flex items-center justify-between text-xs pb-1 border-b border-[#D0E2F2]/60">
          <span className="font-bold text-slate-900 flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-slate-700" /> Isolated Execution Environment
          </span>
          <span className="text-slate-800 font-semibold bg-white border border-slate-200 px-2 py-0.5 rounded-full text-[10px]">
            SECCOMP Active
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-slate-500 block text-[11px]">Network Isolation</span>
            <span className="font-semibold text-slate-900">Zero Egress (No Exfiltration)</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[11px]">Escrow Link</span>
            <span className="font-bold text-slate-900">
              {contract.paypalMetadata.authorizationId ? 'Vault Locked' : 'Awaiting Auth'}
            </span>
          </div>
        </div>
      </div>

      {/* The Complete Lifecycle Pipeline (Runs continuously till the very end!) */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1 flex flex-col justify-between">
        
        {/* Step 1: Spec & Requisition */}
        <div className={`p-2.5 rounded-xl border text-xs transition-all flex items-center justify-between gap-3 ${
          currentStage > 1
            ? 'bg-emerald-50/50 border-emerald-200 text-slate-900 font-medium'
            : currentStage === 1
            ? 'bg-blue-50/80 border-[#0070BA]/40 text-slate-900 font-bold shadow-2xs'
            : 'bg-white border-slate-200 text-slate-400'
        }`}>
          <div className="flex items-center gap-2.5 min-w-0">
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${
              currentStage > 1 ? 'bg-emerald-600 text-white' : currentStage === 1 ? 'bg-[#003087] text-white animate-pulse' : 'bg-slate-200 text-slate-500'
            }`}>
              {currentStage > 1 ? <Check className="w-3.5 h-3.5" /> : '1'}
            </span>
            <span className="truncate text-slate-900 font-semibold">1. Requisition & Worker Bid Accepted</span>
          </div>
          {currentStage === 1 && <span className="text-[10px] text-slate-700 font-bold shrink-0">Active</span>}
        </div>

        {/* Step 2: PayPal Order Created */}
        <div className={`p-2.5 rounded-xl border text-xs transition-all flex items-center justify-between gap-3 ${
          currentStage > 2
            ? 'bg-emerald-50/50 border-emerald-200 text-slate-900 font-medium'
            : currentStage === 2
            ? 'bg-blue-50/80 border-[#0070BA]/40 text-slate-900 font-bold shadow-2xs'
            : 'bg-white border-slate-200 text-slate-400'
        }`}>
          <div className="flex items-center gap-2.5 min-w-0">
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${
              currentStage > 2 ? 'bg-emerald-600 text-white' : currentStage === 2 ? 'bg-[#003087] text-white animate-pulse' : 'bg-slate-200 text-slate-500'
            }`}>
              {currentStage > 2 ? <Check className="w-3.5 h-3.5" /> : '2'}
            </span>
            <span className="truncate text-slate-900 font-semibold">2. PayPal REST Order (intent=AUTHORIZE)</span>
          </div>
          {currentStage === 2 && <span className="text-[10px] text-slate-700 font-bold shrink-0">Authorizing</span>}
        </div>

        {/* Step 3: Vault Hold Locked */}
        <div className={`p-2.5 rounded-xl border text-xs transition-all flex items-center justify-between gap-3 ${
          currentStage > 3
            ? 'bg-emerald-50/50 border-emerald-200 text-slate-900 font-medium'
            : currentStage === 3
            ? 'bg-blue-50/80 border-[#0070BA]/40 text-slate-900 font-bold shadow-2xs'
            : 'bg-white border-slate-200 text-slate-400'
        }`}>
          <div className="flex items-center gap-2.5 min-w-0">
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${
              currentStage > 3 ? 'bg-emerald-600 text-white' : currentStage === 3 ? 'bg-[#003087] text-white animate-pulse' : 'bg-slate-200 text-slate-500'
            }`}>
              {currentStage > 3 ? <Check className="w-3.5 h-3.5" /> : '3'}
            </span>
            <span className="truncate text-slate-900 font-semibold">3. Escrow Vault Locked (${contract.totalBudgetUSD.toFixed(2)} USD)</span>
          </div>
          {currentStage === 3 && <span className="text-[10px] text-slate-700 font-bold shrink-0">Locked</span>}
        </div>

        {/* Step 4: Worker Code Delivery */}
        <div className={`p-2.5 rounded-xl border text-xs transition-all flex items-center justify-between gap-2 ${
          currentStage > 4
            ? 'bg-emerald-50/50 border-emerald-200 text-slate-900 font-medium'
            : currentStage === 4
            ? 'bg-blue-50/80 border-[#0070BA]/40 text-slate-900 font-bold shadow-2xs'
            : 'bg-white border-slate-200 text-slate-400'
        }`}>
          <div className="flex items-center gap-2.5 min-w-0">
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${
              currentStage > 4 ? 'bg-emerald-600 text-white' : currentStage === 4 ? 'bg-[#003087] text-white animate-pulse' : 'bg-slate-200 text-slate-500'
            }`}>
              {currentStage > 4 ? <Check className="w-3.5 h-3.5" /> : '4'}
            </span>
            <span className="truncate text-slate-900 font-semibold">
              4. Worker Artifact Delivery ({artifact ? artifact.filename : 'source_code.py'})
            </span>
          </div>

          {artifact && (
            <button
              onClick={() => onOpenArtifactModal('CODE')}
              className="px-2.5 py-1 rounded-md bg-white hover:bg-slate-50 border border-slate-300 text-slate-900 font-bold text-[11px] flex items-center gap-1 transition-all cursor-pointer shadow-2xs shrink-0"
            >
              <ExternalLink className="w-3 h-3 text-slate-700" />
              <span>View Code</span>
            </button>
          )}
        </div>

        {/* Step 5: Arbiter Audit */}
        <div className={`p-2.5 rounded-xl border text-xs transition-all flex items-center justify-between gap-2 ${
          currentStage > 5
            ? isFailed
              ? 'bg-rose-50/50 border-rose-200 text-slate-900 font-medium'
              : 'bg-emerald-50/50 border-emerald-200 text-slate-900 font-medium'
            : currentStage === 5
            ? isRevision
              ? 'bg-amber-50/80 border-amber-300 text-slate-900 font-bold shadow-2xs'
              : 'bg-blue-50/80 border-[#0070BA]/40 text-slate-900 font-bold shadow-2xs'
            : 'bg-white border-slate-200 text-slate-400'
        }`}>
          <div className="flex items-center gap-2.5 min-w-0">
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${
              currentStage > 5
                ? isFailed ? 'bg-rose-600 text-white' : 'bg-emerald-600 text-white'
                : currentStage === 5
                ? isRevision ? 'bg-amber-600 text-white animate-pulse' : 'bg-[#003087] text-white animate-pulse'
                : 'bg-slate-200 text-slate-500'
            }`}>
              {currentStage > 5 ? (isFailed ? '✕' : <Check className="w-3.5 h-3.5" />) : '5'}
            </span>
            <span className="truncate text-slate-900 font-semibold">
              {isRevision
                ? `5. Arbiter Alert: CWE-89 Caught (Revision ${attemptNum}/${maxAttempts})`
                : '5. AI Arbiter Inspection & PyTest Assertions'}
            </span>
          </div>

          {currentStage >= 5 && (
            <button
              onClick={() => onOpenArtifactModal('TESTS')}
              className="px-2.5 py-1 rounded-md bg-white hover:bg-slate-50 border border-slate-300 text-slate-900 font-bold text-[11px] flex items-center gap-1 transition-all cursor-pointer shadow-2xs shrink-0"
            >
              <FileCheck className="w-3 h-3 text-slate-700" />
              <span>View Tests</span>
            </button>
          )}
        </div>

        {/* Step 6: Self-Healing Patch (If healing flow) */}
        {isHealing && (
          <div className={`p-2.5 rounded-xl border text-xs transition-all flex items-center justify-between gap-2 ${
            currentStage > 6
              ? 'bg-emerald-50/50 border-emerald-200 text-slate-900 font-medium'
              : currentStage === 6
              ? 'bg-blue-50/80 border-[#0070BA]/40 text-slate-900 font-bold shadow-2xs'
              : 'bg-white border-slate-200 text-slate-400'
          }`}>
            <div className="flex items-center gap-2.5 min-w-0">
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${
                currentStage > 6 ? 'bg-emerald-600 text-white' : currentStage === 6 ? 'bg-[#003087] text-white animate-pulse' : 'bg-slate-200 text-slate-500'
              }`}>
                {currentStage > 6 ? <Check className="w-3.5 h-3.5" /> : '6'}
              </span>
              <span className="truncate text-slate-900 font-semibold">
                {contract.isPatched
                  ? '6. Self-Healing Patch Applied (Attempt 2 - Clean AST)'
                  : '6. Autonomous Cure Remediation Loop'}
              </span>
            </div>

            {contract.isPatched && (
              <button
                onClick={() => onOpenArtifactModal('CODE')}
                className="px-2.5 py-1 rounded-md bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-950 font-bold text-[11px] flex items-center gap-1 transition-all cursor-pointer shadow-2xs shrink-0"
              >
                <Sparkles className="w-3 h-3 text-emerald-700" />
                <span>Compare Patch</span>
              </button>
            )}
          </div>
        )}

        {/* Final Step: Settlement */}
        <div className={`p-2.5 rounded-xl border text-xs transition-all flex items-center justify-between gap-2 ${
          isPassed
            ? 'bg-emerald-50/70 border-emerald-300 text-slate-900 font-bold'
            : isFailed
            ? 'bg-rose-50/70 border-rose-300 text-slate-900 font-bold'
            : 'bg-white border-slate-200 text-slate-400'
        }`}>
          <div className="flex items-center gap-2.5 min-w-0">
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${
              isPassed ? 'bg-emerald-600 text-white' : isFailed ? 'bg-rose-600 text-white' : 'bg-slate-200 text-slate-500'
            }`}>
              {isPassed ? <Check className="w-3.5 h-3.5" /> : isFailed ? '✕' : (isHealing ? '7' : '6')}
            </span>
            <span className="truncate text-slate-900 font-semibold">
              {isPassed
                ? 'Final Settlement: PayPal Capture & Worker Payout'
                : isFailed
                ? 'Final Settlement: Authorization Voided & 100% Refunded'
                : 'Final Arbitrated Settlement (Capture or Void)'}
            </span>
          </div>

          {(isPassed || isFailed) && (
            <button
              onClick={() => onOpenArtifactModal('AUDIT')}
              className="px-2.5 py-1 rounded-md bg-white hover:bg-slate-50 border border-slate-300 text-slate-900 font-bold text-[11px] flex items-center gap-1 transition-all cursor-pointer shadow-2xs shrink-0"
            >
              <ShieldCheck className="w-3 h-3 text-slate-700" />
              <span>Proof</span>
            </button>
          )}
        </div>

      </div>

    </div>
  );
};
