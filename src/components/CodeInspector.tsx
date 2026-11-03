'use client';

import React from 'react';
import { TaskContract } from '@/types/escrow';
import {
  Code2,
  ShieldCheck,
  Cpu,
  ExternalLink,
  Check,
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
    <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-[0_4px_25px_-5px_rgba(0,48,135,0.06),0_2px_8px_-2px_rgba(0,0,0,0.04)] flex flex-col h-[640px]">
      
      {/* Title & Quick Actions Row */}
      <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 mb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#003087] to-[#001f54] flex items-center justify-center text-white shadow-xs">
            <Code2 className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900 tracking-tight">
              Verification Engine
            </h3>
            <span className="text-[10px] font-mono text-slate-400">Deterministic AST Arbitrator</span>
          </div>
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 flex items-center gap-1.5 ml-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            sandbox-node-01
          </span>
        </div>

        <div className="flex items-center gap-2">
          {artifact && (
            <button
              onClick={() => onOpenArtifactModal('CODE')}
              className="text-xs font-bold px-3 py-1.5 rounded-full bg-[#003087] hover:bg-[#002266] text-white flex items-center gap-1.5 transition-all cursor-pointer shadow-[0_2px_10px_rgba(0,48,135,0.2)] active:scale-98"
              title="Open deliverable code and test review modal"
            >
              <ExternalLink className="w-3.5 h-3.5 text-white" />
              <span>Inspect Code & Tests</span>
            </button>
          )}

          {onOpenPolicyModal && (
            <button
              onClick={onOpenPolicyModal}
              className="text-xs font-semibold px-2.5 py-1.5 rounded-full text-slate-700 hover:text-[#003087] bg-slate-100 hover:bg-[#F0F5FA] border border-slate-200 hover:border-[#D0E2F2] flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Inspect Security & Governance Policy"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#0070BA]" />
              <span>Policy</span>
            </button>
          )}
        </div>
      </div>

      {/* Top Telemetry Card: High-Tech Deep Navy Gradient */}
      <div className="bg-gradient-to-r from-[#001f54] via-[#003087] to-[#0040a8] text-white rounded-xl p-4 flex flex-col gap-2.5 mb-3.5 shadow-xs border border-[#0070BA]/30">
        <div className="flex items-center justify-between text-xs pb-1.5 border-b border-white/10">
          <span className="font-bold text-white flex items-center gap-1.5 tracking-tight">
            <Cpu className="w-3.5 h-3.5 text-sky-300" /> Isolated Execution Environment
          </span>
          <span className="text-emerald-300 bg-emerald-950/80 border border-emerald-500/40 font-mono font-bold px-2 py-0.5 rounded-full text-[10px]">
            SECCOMP ACTIVE
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <span className="text-slate-300 block text-[10px] uppercase font-mono tracking-wider">Network Isolation</span>
            <span className="font-semibold text-white text-xs">Zero Egress (No Exfiltration)</span>
          </div>
          <div>
            <span className="text-slate-300 block text-[10px] uppercase font-mono tracking-wider">Escrow Link</span>
            <span className="font-mono font-bold text-sky-300 text-xs">
              {contract.paypalMetadata.authorizationId ? 'Vault Locked (Authorized)' : 'Awaiting Auth Hold'}
            </span>
          </div>
        </div>
      </div>

      {/* The Complete Lifecycle Pipeline with Sleek Semantic Badges */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1 flex flex-col justify-between">
        
        {/* Step 1: Spec & Requisition */}
        <div className={`p-2.5 rounded-xl border text-xs transition-all flex items-center justify-between gap-3 ${
          currentStage >= 1
            ? 'bg-white border-slate-200/90 shadow-2xs'
            : 'bg-slate-50 border-slate-200 text-slate-400'
        }`}>
          <div className="flex items-center gap-2.5 min-w-0">
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${
              currentStage > 1
                ? 'bg-[#003087] text-white'
                : currentStage === 1
                ? 'bg-[#003087] text-white ring-2 ring-blue-100'
                : 'bg-slate-200 text-slate-500'
            }`}>
              {currentStage > 1 ? <Check className="w-3.5 h-3.5 stroke-[2.5]" /> : '1'}
            </span>
            <span className="truncate text-slate-900 font-semibold">1. Requisition & Worker Bid Accepted</span>
          </div>
          {currentStage === 1 && <span className="text-[10px] text-[#0070BA] font-bold shrink-0 bg-[#F0F5FA] px-2 py-0.5 rounded border border-[#D0E2F2]">Active</span>}
        </div>

        {/* Step 2: PayPal Order Created */}
        <div className={`p-2.5 rounded-xl border text-xs transition-all flex items-center justify-between gap-3 ${
          currentStage >= 2
            ? 'bg-white border-slate-200/90 shadow-2xs'
            : 'bg-slate-50 border-slate-200 text-slate-400'
        }`}>
          <div className="flex items-center gap-2.5 min-w-0">
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${
              currentStage > 2
                ? 'bg-[#003087] text-white'
                : currentStage === 2
                ? 'bg-[#003087] text-white ring-2 ring-blue-100'
                : 'bg-slate-200 text-slate-500'
            }`}>
              {currentStage > 2 ? <Check className="w-3.5 h-3.5 stroke-[2.5]" /> : '2'}
            </span>
            <span className="truncate text-slate-900 font-semibold">2. PayPal Protocol Order (intent=AUTHORIZE)</span>
          </div>
          {currentStage === 2 && <span className="text-[10px] text-[#003087] font-bold shrink-0 bg-[#F0F5FA] px-2 py-0.5 rounded border border-[#D0E2F2]">Authorizing</span>}
        </div>

        {/* Step 3: Vault Hold Locked */}
        <div className={`p-2.5 rounded-xl border text-xs transition-all flex items-center justify-between gap-3 ${
          currentStage >= 3
            ? 'bg-white border-slate-200/90 shadow-2xs'
            : 'bg-slate-50 border-slate-200 text-slate-400'
        }`}>
          <div className="flex items-center gap-2.5 min-w-0">
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${
              currentStage > 3
                ? 'bg-[#003087] text-white'
                : currentStage === 3
                ? 'bg-[#003087] text-white ring-2 ring-blue-100'
                : 'bg-slate-200 text-slate-500'
            }`}>
              {currentStage > 3 ? <Check className="w-3.5 h-3.5 stroke-[2.5]" /> : '3'}
            </span>
            <span className="truncate text-slate-900 font-semibold">3. Escrow Vault Locked (${contract.totalBudgetUSD.toFixed(2)} USD)</span>
          </div>
          {currentStage === 3 && <span className="text-[10px] text-emerald-700 font-bold shrink-0 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">Locked</span>}
        </div>

        {/* Step 4: Worker Code Delivery */}
        <div className={`p-2.5 rounded-xl border text-xs transition-all flex items-center justify-between gap-2 ${
          currentStage >= 4
            ? 'bg-white border-slate-200/90 shadow-2xs'
            : 'bg-slate-50 border-slate-200 text-slate-400'
        }`}>
          <div className="flex items-center gap-2.5 min-w-0">
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${
              currentStage > 4
                ? 'bg-[#003087] text-white'
                : currentStage === 4
                ? 'bg-[#003087] text-white ring-2 ring-blue-100'
                : 'bg-slate-200 text-slate-500'
            }`}>
              {currentStage > 4 ? <Check className="w-3.5 h-3.5 stroke-[2.5]" /> : '4'}
            </span>
            <span className="truncate text-slate-900 font-semibold">
              4. Worker Artifact Delivery ({artifact ? artifact.filename : 'source_code.py'})
            </span>
          </div>

          {artifact && (
            <button
              onClick={() => onOpenArtifactModal('CODE')}
              className="px-2.5 py-1 rounded-md bg-white hover:bg-[#F0F5FA] border border-slate-300 hover:border-[#D0E2F2] text-[#003087] font-bold text-[11px] flex items-center gap-1 transition-all cursor-pointer shadow-2xs shrink-0"
            >
              <ExternalLink className="w-3 h-3 text-[#0070BA]" />
              <span>View Code</span>
            </button>
          )}
        </div>

        {/* Step 5: Arbiter Audit */}
        <div className={`p-2.5 rounded-xl border text-xs transition-all flex items-center justify-between gap-2 ${
          isRevision
            ? 'bg-rose-50/70 border-rose-200/90 shadow-2xs'
            : currentStage >= 5
            ? 'bg-white border-slate-200/90 shadow-2xs'
            : 'bg-slate-50 border-slate-200 text-slate-400'
        }`}>
          <div className="flex items-center gap-2.5 min-w-0">
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${
              isRevision
                ? 'bg-rose-600 text-white'
                : currentStage > 5
                ? 'bg-[#003087] text-white'
                : currentStage === 5
                ? 'bg-[#003087] text-white ring-2 ring-blue-100'
                : 'bg-slate-200 text-slate-500'
            }`}>
              {isRevision ? '!' : currentStage > 5 ? <Check className="w-3.5 h-3.5 stroke-[2.5]" /> : '5'}
            </span>
            <span className={`truncate font-semibold ${isRevision ? 'text-rose-950' : 'text-slate-900'}`}>
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
            contract.isPatched
              ? 'bg-indigo-50/70 border-indigo-200/90 shadow-2xs'
              : currentStage >= 6
              ? 'bg-white border-slate-200/90 shadow-2xs'
              : 'bg-slate-50 border-slate-200 text-slate-400'
          }`}>
            <div className="flex items-center gap-2.5 min-w-0">
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${
                contract.isPatched
                  ? 'bg-indigo-600 text-white'
                  : currentStage > 6
                  ? 'bg-[#003087] text-white'
                  : currentStage === 6
                  ? 'bg-[#003087] text-white ring-2 ring-blue-100'
                  : 'bg-slate-200 text-slate-500'
              }`}>
                {contract.isPatched ? <Check className="w-3.5 h-3.5 stroke-[2.5]" /> : currentStage > 6 ? <Check className="w-3.5 h-3.5 stroke-[2.5]" /> : '6'}
              </span>
              <span className={`truncate font-semibold ${contract.isPatched ? 'text-indigo-950' : 'text-slate-900'}`}>
                {contract.isPatched
                  ? '6. Self-Healing Patch Applied (Attempt 2 - Clean AST)'
                  : '6. Autonomous Cure Remediation Loop'}
              </span>
            </div>

            {contract.isPatched && (
              <button
                onClick={() => onOpenArtifactModal('CODE')}
                className="px-2.5 py-1 rounded-md bg-white hover:bg-indigo-50 border border-indigo-200 text-indigo-900 font-bold text-[11px] flex items-center gap-1 transition-all cursor-pointer shadow-2xs shrink-0"
              >
                <span>Compare Patch</span>
              </button>
            )}
          </div>
        )}

        {/* Final Step: Settlement */}
        <div className={`p-2.5 rounded-xl border text-xs transition-all flex items-center justify-between gap-2 ${
          isPassed
            ? 'bg-emerald-50/70 border-emerald-300 shadow-2xs'
            : isFailed
            ? 'bg-rose-50/70 border-rose-300 shadow-2xs'
            : 'bg-slate-50 border-slate-200 text-slate-400'
        }`}>
          <div className="flex items-center gap-2.5 min-w-0">
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${
              isPassed
                ? 'bg-emerald-600 text-white'
                : isFailed
                ? 'bg-rose-600 text-white'
                : 'bg-slate-200 text-slate-500'
            }`}>
              {isPassed ? <Check className="w-3.5 h-3.5 stroke-[2.5]" /> : isFailed ? '✕' : (isHealing ? '7' : '6')}
            </span>
            <span className={`truncate font-semibold ${isPassed ? 'text-emerald-950 font-bold' : isFailed ? 'text-rose-950 font-bold' : 'text-slate-900'}`}>
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
              className={`px-2.5 py-1 rounded-md bg-white border font-bold text-[11px] flex items-center gap-1 transition-all cursor-pointer shadow-2xs shrink-0 ${
                isPassed
                  ? 'border-emerald-200 text-emerald-800 hover:bg-emerald-50'
                  : 'border-rose-200 text-rose-800 hover:bg-rose-50'
              }`}
            >
              <span>Proof</span>
            </button>
          )}
        </div>

      </div>

    </div>
  );
};
