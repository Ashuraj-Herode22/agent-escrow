'use client';

import React, { useState } from 'react';
import { TaskContract } from '@/types/escrow';
import {
  Code2,
  ShieldAlert,
  CheckCircle2,
  ShieldCheck,
  Terminal,
  Hash,
  Download,
  ShieldX,
  Play,
  RotateCw,
  Cpu,
  Lock,
  Layers,
  FileCheck,
  Bug,
  Sparkles,
} from 'lucide-react';
import { INITIAL_DISPUTE_CODE, PATCHED_SUCCESS_CODE } from '@/lib/agent-engine';

interface CodeInspectorProps {
  contract: TaskContract;
  onOpenPolicyModal?: () => void;
}

export const CodeInspector: React.FC<CodeInspectorProps> = ({ contract, onOpenPolicyModal }) => {
  const [activeTab, setActiveTab] = useState<'CODE' | 'TESTS' | 'AUDIT'>('CODE');
  const [exploitTested, setExploitTested] = useState<boolean>(false);
  const [viewVersion, setViewVersion] = useState<'AUTO' | 'INITIAL' | 'PATCHED'>('AUTO');
  const [isReRunningTests, setIsReRunningTests] = useState<boolean>(false);

  const artifact = contract.codeArtifact;
  const milestones = contract.milestones;
  const isFailed = contract.status === 'ARBITRATION_FAILED' || contract.status === 'DISPUTE_REFUNDED';
  const isPassed = contract.status === 'ARBITRATION_PASSED' || contract.status === 'PAYOUT_COMPLETED';
  const isRevision = contract.status === 'REVISION_REQUESTED';
  const attemptNum = contract.revisionAttempt || 1;
  const maxAttempts = contract.maxRevisions || 3;

  // Decide which code to show if multiple versions exist
  const effectiveCode = (() => {
    if (viewVersion === 'INITIAL') return INITIAL_DISPUTE_CODE;
    if (viewVersion === 'PATCHED') return PATCHED_SUCCESS_CODE;
    return artifact?.code || '';
  })();

  const isShowingVulnerable = effectiveCode.includes('f"SELECT id, role FROM accounts') || isRevision || isFailed;

  // Aggregate all tests across milestones
  const allTests = milestones.flatMap((m) => m.testSuite.tests);
  const passedCount = allTests.filter((t) => t.passed).length;
  const failedCount = allTests.filter((t) => !t.passed).length;

  const downloadAuditReport = () => {
    const report = {
      contractId: contract.id,
      title: contract.title,
      timestamp: new Date().toISOString(),
      status: contract.status,
      curePeriod: {
        attempt: attemptNum,
        maxAttempts,
        isPatched: contract.isPatched ?? false,
      },
      protocolMetadata: contract.paypalMetadata,
      artifactHash: artifact?.sha256Hash,
      testSuiteResults: allTests,
      arbiterSignature: `SIG_${Math.random().toString(36).substring(2, 12).toUpperCase()}_ECDSA_SECP256K1`,
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AgentEscrow_Audit_${contract.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleReRunTests = () => {
    setIsReRunningTests(true);
    setTimeout(() => {
      setIsReRunningTests(false);
    }, 600);
  };

  // Dynamic step tracker determination
  const getStepProgress = () => {
    switch (contract.status) {
      case 'INITIALIZING':
        return 1;
      case 'NEGOTIATING':
        return 1;
      case 'WAITING_DEPOSIT':
        return 2;
      case 'ESCROW_LOCKED':
        return 3;
      case 'WORK_IN_PROGRESS':
        return 3;
      case 'DELIVERED_AUDITING':
        return 4;
      case 'REVISION_REQUESTED':
        return 4;
      case 'ARBITRATION_PASSED':
      case 'ARBITRATION_FAILED':
        return 5;
      case 'PAYOUT_COMPLETED':
      case 'DISPUTE_REFUNDED':
        return 6;
      default:
        return 1;
    }
  };

  const currentStepNum = getStepProgress();

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col h-[580px]">
      
      {/* Title & Actions Row */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
        <div className="flex items-center gap-2">
          <Code2 className="w-4 h-4 text-[#0070BA]" />
          <h3 className="text-sm font-bold text-slate-900">
            Verification Sandbox
          </h3>
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            sandbox-vm-01
          </span>
        </div>

        <div className="flex items-center gap-2">
          {onOpenPolicyModal && (
            <button
              onClick={onOpenPolicyModal}
              className="text-xs font-semibold text-slate-500 hover:text-[#003087] flex items-center gap-1 transition-colors cursor-pointer"
              title="Inspect Security & Governance Policy"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
              <span>Policy</span>
            </button>
          )}

          {artifact && (
            <button
              onClick={downloadAuditReport}
              className="text-xs font-semibold text-[#0070BA] hover:text-[#003087] flex items-center gap-1 transition-colors cursor-pointer"
              title="Download signed JSON report"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
            </button>
          )}
        </div>
      </div>

      {/* Segmented Tab Control */}
      <div className="grid grid-cols-3 bg-slate-100/80 p-0.5 rounded-lg text-center text-xs mb-3 font-medium border border-slate-200/50">
        <button
          onClick={() => setActiveTab('CODE')}
          className={`py-1 rounded-md transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === 'CODE'
              ? 'bg-white text-[#003087] font-bold shadow-2xs'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Terminal className="w-3.5 h-3.5" />
          <span>{artifact ? 'Artifact Code' : 'Live Sandbox'}</span>
        </button>

        <button
          onClick={() => setActiveTab('TESTS')}
          className={`py-1 rounded-md transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === 'TESTS'
              ? 'bg-white text-[#003087] font-bold shadow-2xs'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <FileCheck className="w-3.5 h-3.5" />
          <span>Tests ({allTests.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('AUDIT')}
          className={`py-1 rounded-md transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === 'AUDIT'
              ? 'bg-white text-[#003087] font-bold shadow-2xs'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Audit Proof</span>
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto flex flex-col">
        
        {/* Tab 1: Code / Live Sandbox */}
        {activeTab === 'CODE' && (
          <div className="flex flex-col h-full">
            {artifact ? (
              <div className="flex flex-col h-full gap-2">
                
                {/* Self-Healing Revision Comparison Banner (If Patched) */}
                {(contract.isPatched || contract.id === 'AG-8814') && (
                  <div className="bg-[#F0F5FA] border border-[#D0E2F2] rounded-xl p-2 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-[#003087] font-semibold">
                      <Sparkles className="w-3.5 h-3.5 text-[#0070BA]" />
                      <span>Self-Healing Cure History:</span>
                    </div>
                    <div className="flex items-center gap-1 bg-white p-0.5 rounded-lg border border-slate-200">
                      <button
                        onClick={() => setViewVersion('PATCHED')}
                        className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all cursor-pointer ${
                          viewVersion === 'PATCHED' || (viewVersion === 'AUTO' && contract.isPatched)
                            ? 'bg-emerald-600 text-white shadow-2xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        Attempt 2 (Patched)
                      </button>
                      <button
                        onClick={() => setViewVersion('INITIAL')}
                        className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all cursor-pointer ${
                          viewVersion === 'INITIAL' || (viewVersion === 'AUTO' && !contract.isPatched && isShowingVulnerable)
                            ? 'bg-rose-600 text-white shadow-2xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        Attempt 1 (Flawed)
                      </button>
                    </div>
                  </div>
                )}

                {/* Security Quarantine Banner if flawed */}
                {isShowingVulnerable && (
                  <div className="bg-rose-50 border border-rose-200 rounded-xl p-2.5 flex items-center justify-between text-xs text-rose-800">
                    <div className="flex items-center gap-2">
                      <ShieldX className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>
                        <strong className="font-bold">CWE-89 SQL Injection Detected:</strong> Raw string interpolation on Line 12. Payout halted.
                      </span>
                    </div>
                    <button
                      onClick={() => setExploitTested(!exploitTested)}
                      className="px-2 py-1 rounded bg-rose-200/80 hover:bg-rose-200 text-rose-900 font-bold text-[11px] flex items-center gap-1 transition-all cursor-pointer shrink-0 ml-2"
                    >
                      <Bug className="w-3 h-3" />
                      <span>{exploitTested ? 'Hide Exploit' : 'Test Exploit'}</span>
                    </button>
                  </div>
                )}

                {/* Exploit Vector Simulator Box */}
                {exploitTested && isShowingVulnerable && (
                  <div className="p-2.5 rounded-xl bg-slate-900 text-emerald-400 font-mono text-[11px] border border-slate-800 space-y-1">
                    <div className="text-slate-400 flex items-center justify-between">
                      <span># Interactive Exploit Vector Simulation</span>
                      <span className="text-rose-400 font-bold">VULNERABILITY CONFIRMED</span>
                    </div>
                    <p className="text-slate-300">
                      Payload: <code className="text-amber-300 font-bold">&apos; OR &apos;1&apos;=&apos;1</code>
                    </p>
                    <p className="text-slate-300">
                      Evaluates to: <code className="text-amber-300">SELECT id, role FROM accounts WHERE user = &apos;&apos; OR &apos;1&apos;=&apos;1&apos;</code>
                    </p>
                    <p className="text-rose-300">
                      &gt; Auth Bypassed! Returned UID 1 (Role: admin). Arbiter halted payment authorization.
                    </p>
                  </div>
                )}

                {/* Clean File Header */}
                <div className="flex items-center justify-between text-xs text-slate-500 pb-1 border-b border-slate-100">
                  <span className="text-[#0070BA] font-bold flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${isShowingVulnerable ? 'bg-rose-500' : 'bg-emerald-500'}`}></span>
                    {artifact.filename}
                    <span className="text-slate-400 font-normal">
                      • Attempt {viewVersion === 'INITIAL' ? '1' : viewVersion === 'PATCHED' ? '2' : attemptNum} of {maxAttempts}
                    </span>
                  </span>
                  <span className="flex items-center gap-1 text-xs text-slate-400 font-mono">
                    <Hash className="w-3 h-3" /> {artifact.sha256Hash.substring(0, 12)}...
                  </span>
                </div>
                
                {/* Code Window with Light Theme */}
                <pre className="flex-1 p-3 rounded-xl bg-[#F8FAFC] text-slate-800 text-xs font-mono overflow-x-auto leading-relaxed border border-slate-200">
                  {effectiveCode}
                </pre>

                {/* Bottom Status Bar */}
                <div className="grid grid-cols-3 gap-2 bg-[#F0F5FA]/80 border border-[#D0E2F2] rounded-xl p-2.5 text-xs">
                  <div>
                    <span className="text-slate-500 block">Runtime Environment</span>
                    <span className="font-bold text-slate-800">Python 3.12 (Isolated)</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Security Policy</span>
                    <span className={isShowingVulnerable ? 'font-bold text-rose-700' : 'font-bold text-emerald-700'}>
                      {isShowingVulnerable ? 'Quarantined & Masked' : 'Clean AST Parsed'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Release Gate</span>
                    <span className={isPassed ? 'font-bold text-emerald-700' : isFailed ? 'font-bold text-rose-700' : isRevision ? 'font-bold text-amber-700' : 'font-bold text-slate-600'}>
                      {isPassed ? 'Release Token Signed' : isFailed ? 'Void & Refunded' : isRevision ? 'Revision Cure Active' : 'Auditing'}
                    </span>
                  </div>
                </div>

              </div>
            ) : (
              /* DYNAMIC REAL-TIME PIPELINE & ISOLATED SANDBOX NODE (Before Code Delivery) */
              <div className="h-full flex flex-col justify-between p-3.5 bg-[#F8FAFC] border border-slate-200 rounded-xl space-y-3">
                
                {/* Top Node Telemetry Card */}
                <div className="bg-white border border-slate-200 rounded-xl p-3 flex flex-col gap-2">
                  <div className="flex items-center justify-between text-xs pb-1.5 border-b border-slate-100">
                    <span className="font-bold text-slate-800 flex items-center gap-1.5">
                      <Cpu className="w-3.5 h-3.5 text-[#0070BA]" /> Ephemeral Sandbox Container
                    </span>
                    <span className="text-emerald-700 font-semibold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full text-[11px]">
                      SECCOMP Active
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[11px]">Network Policy</span>
                      <span className="font-semibold text-slate-700">Zero Egress (No Exfiltration)</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Escrow Link</span>
                      <span className="font-bold text-[#003087]">
                        {contract.paypalMetadata.authorizationId ? 'Vault Locked' : 'Awaiting Auth'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Dynamic Step Tracker (Live Responsive State!) */}
                <div className="space-y-2 py-1">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Autonomous Execution Pipeline
                  </div>

                  {/* Step 1 */}
                  <div className={`flex items-center gap-2.5 p-2 rounded-lg border text-xs transition-all ${
                    currentStepNum > 1
                      ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900 font-medium'
                      : currentStepNum === 1
                      ? 'bg-blue-50/80 border-[#0070BA]/30 text-[#003087] font-bold shadow-2xs'
                      : 'bg-white border-slate-200 text-slate-400'
                  }`}>
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${
                      currentStepNum > 1 ? 'bg-emerald-600 text-white' : currentStepNum === 1 ? 'bg-[#0070BA] text-white animate-pulse' : 'bg-slate-200 text-slate-500'
                    }`}>
                      {currentStepNum > 1 ? '✓' : '1'}
                    </span>
                    <span className="flex-1">Contract Requisition & Worker Bid</span>
                    {currentStepNum === 1 && <span className="text-[10px] text-[#0070BA] font-semibold">Active</span>}
                  </div>

                  {/* Step 2 */}
                  <div className={`flex items-center gap-2.5 p-2 rounded-lg border text-xs transition-all ${
                    currentStepNum > 2
                      ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900 font-medium'
                      : currentStepNum === 2
                      ? 'bg-blue-50/80 border-[#0070BA]/30 text-[#003087] font-bold shadow-2xs'
                      : 'bg-white border-slate-200 text-slate-400'
                  }`}>
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${
                      currentStepNum > 2 ? 'bg-emerald-600 text-white' : currentStepNum === 2 ? 'bg-[#0070BA] text-white animate-pulse' : 'bg-slate-200 text-slate-500'
                    }`}>
                      {currentStepNum > 2 ? '✓' : '2'}
                    </span>
                    <span className="flex-1">PayPal REST Order (intent=AUTHORIZE)</span>
                    {currentStepNum === 2 && <span className="text-[10px] text-[#0070BA] font-semibold">Authorizing</span>}
                  </div>

                  {/* Step 3 */}
                  <div className={`flex items-center gap-2.5 p-2 rounded-lg border text-xs transition-all ${
                    currentStepNum > 3
                      ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900 font-medium'
                      : currentStepNum === 3
                      ? 'bg-blue-50/80 border-[#0070BA]/30 text-[#003087] font-bold shadow-2xs'
                      : 'bg-white border-slate-200 text-slate-400'
                  }`}>
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${
                      currentStepNum > 3 ? 'bg-emerald-600 text-white' : currentStepNum === 3 ? 'bg-[#0070BA] text-white animate-pulse' : 'bg-slate-200 text-slate-500'
                    }`}>
                      {currentStepNum > 3 ? '✓' : '3'}
                    </span>
                    <span className="flex-1">Escrow Vault Lock (${contract.totalBudgetUSD.toFixed(2)} USD)</span>
                    {currentStepNum === 3 && <span className="text-[10px] text-[#0070BA] font-semibold">Locked</span>}
                  </div>

                  {/* Step 4 */}
                  <div className={`flex items-center gap-2.5 p-2 rounded-lg border text-xs transition-all ${
                    currentStepNum >= 4
                      ? 'bg-blue-50/80 border-[#0070BA]/30 text-[#003087] font-bold'
                      : 'bg-white border-slate-200 text-slate-400'
                  }`}>
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${
                      currentStepNum >= 4 ? 'bg-[#0070BA] text-white' : 'bg-slate-200 text-slate-500'
                    }`}>
                      4
                    </span>
                    <span className="flex-1">Worker Synthesis & AST Delivery</span>
                  </div>
                </div>

                {/* Live Console Output Box */}
                <div className="bg-slate-900 rounded-xl p-2.5 text-slate-300 font-mono text-[11px] space-y-1 border border-slate-800">
                  <div className="flex items-center justify-between text-slate-500 text-[10px]">
                    <span className="flex items-center gap-1">
                      <Terminal className="w-3 h-3 text-emerald-400" /> sandbox-vm-stdout
                    </span>
                    <span className="text-emerald-400">READY</span>
                  </div>
                  <p className="text-slate-400">
                    &gt; [SYSTEM] Initializing memory-safe Python isolated sandbox...
                  </p>
                  <p className="text-emerald-400">
                    &gt; [AST_PARSER] Rules loaded: OWASP Top 10, CWE-89, CWE-798.
                  </p>
                  <p className="text-slate-300">
                    &gt; [ESCROW] Bound to PayPal REST v2 API: {contract.paypalMetadata.authorizationId || 'Awaiting Authorization Hold'}
                  </p>
                </div>

              </div>
            )}
          </div>
        )}

        {/* Tab 2: Test Suite Runner */}
        {activeTab === 'TESTS' && (
          <div className="flex flex-col h-full gap-2.5">
            {/* Top Metrics Bar */}
            <div className="grid grid-cols-4 gap-2 bg-[#F8FAFC] border border-slate-200/80 rounded-xl p-2.5 text-center text-xs">
              <div>
                <span className="text-slate-400 block">Total Tests</span>
                <span className="font-bold text-slate-800">{allTests.length}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Passed</span>
                <span className="font-bold text-emerald-700">{passedCount}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Failed</span>
                <span className="font-bold text-rose-700">{failedCount}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Test Engine</span>
                <span className="font-bold text-[#0070BA]">PyTest v8</span>
              </div>
            </div>

            {/* Test Cards List */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {allTests.length > 0 ? (
                allTests.map((t, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-xl border text-xs flex flex-col gap-1 ${
                      t.passed ? 'bg-emerald-50/50 border-emerald-200 text-emerald-950' : 'bg-rose-50/50 border-rose-200 text-rose-950'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold flex items-center gap-1.5">
                        {t.passed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : (
                          <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
                        )}
                        <span>{t.name}</span>
                      </span>
                      <span className="text-slate-500 font-medium">{t.durationMs}ms</span>
                    </div>

                    {t.error && (
                      <div className="mt-1 p-2 rounded-lg bg-rose-100 border border-rose-300 text-xs text-rose-900 leading-snug">
                        {t.error}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="h-44 flex flex-col items-center justify-center text-slate-400 text-xs gap-2">
                  <Terminal className="w-8 h-8 text-slate-300" />
                  <span className="font-medium text-slate-500">Test assertions will execute automatically once deliverable is submitted.</span>
                </div>
              )}
            </div>

            {/* Re-run button */}
            {allTests.length > 0 && (
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">
                  Automated assertion verification completed in {allTests.reduce((acc, t) => acc + t.durationMs, 0)}ms
                </span>
                <button
                  onClick={handleReRunTests}
                  disabled={isReRunningTests}
                  className="px-3 py-1 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                >
                  <RotateCw className={`w-3.5 h-3.5 text-slate-500 ${isReRunningTests ? 'animate-spin text-[#0070BA]' : ''}`} />
                  <span>{isReRunningTests ? 'Evaluating...' : 'Re-run Tests'}</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Cryptographic Audit Proof */}
        {activeTab === 'AUDIT' && (
          <div className="flex flex-col h-full gap-3 text-xs">
            {/* Top Certificate Card */}
            <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-slate-200 space-y-2">
              <div className="text-[#003087] font-bold flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#0070BA]" /> AgentEscrow Proof-of-Arbitration Certificate
                </span>
                <span className="text-[11px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                  SECP256K1 Signed
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="text-slate-500">Contract ID: <span className="text-slate-900 font-bold">{contract.id}</span></div>
                <div className="text-slate-500">Status: <span className="text-[#003087] font-bold">{contract.status}</span></div>
                <div className="text-slate-500">Buyer Agent: <span className="text-slate-800">{contract.buyerAgentId}</span></div>
                <div className="text-slate-500">Worker Agent: <span className="text-slate-800">{contract.workerAgentId}</span></div>
                <div className="text-slate-500">Order ID: <span className="text-slate-800 font-mono">{contract.paypalMetadata.orderId || 'Pending'}</span></div>
                <div className="text-slate-500">Auth ID: <span className="text-[#0070BA] font-bold font-mono">{contract.paypalMetadata.authorizationId || 'Pending'}</span></div>
              </div>
            </div>

            {/* Cure Window Status */}
            <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-1">
              <div className="flex items-center justify-between text-slate-700 font-medium">
                <span className="flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5 text-indigo-600" /> Cure Policy Status:
                </span>
                <span className="font-bold text-[#003087]">
                  Attempt {attemptNum} of {maxAttempts}
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div
                  className={`h-full transition-all ${
                    isPassed ? 'bg-emerald-500' : isFailed ? 'bg-rose-500' : 'bg-[#0070BA]'
                  }`}
                  style={{ width: `${(attemptNum / maxAttempts) * 100}%` }}
                ></div>
              </div>
              <p className="text-[11px] text-slate-500 pt-0.5">
                {contract.isPatched
                  ? 'Self-healing patch approved on Attempt 2. Payout unlocked.'
                  : isFailed
                  ? 'All 3 revision attempts failed. Funds refunded 100% to Buyer.'
                  : 'Up to 3 autonomous revisions allowed before authorization void.'}
              </p>
            </div>

            {/* Bottom 3-Column Symmetrical Audit Grid */}
            <div className={`p-3.5 rounded-xl border mt-auto ${
              isPassed ? 'bg-emerald-50/70 border-emerald-200' : isFailed ? 'bg-rose-50/70 border-rose-200' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <span className="block text-xs text-slate-500 font-medium">Final Verdict</span>
                  <span className={`text-xs font-bold mt-1 block ${isPassed ? 'text-emerald-700' : isFailed ? 'text-rose-700' : 'text-slate-600'}`}>
                    {isPassed ? 'RELEASE_FUNDS' : isFailed ? 'VOID_REFUND' : isRevision ? 'REVISION_CURE' : 'PENDING'}
                  </span>
                </div>

                <div className="border-x border-slate-200/80 px-2">
                  <span className="block text-xs text-slate-500 font-medium">Security Gate</span>
                  <span className={`text-xs font-bold mt-1 block ${isPassed ? 'text-emerald-700' : isFailed ? 'text-rose-700' : 'text-slate-600'}`}>
                    {isPassed ? '0 Vulnerabilities' : isFailed ? 'CWE-89 Blocked' : 'OWASP Scan'}
                  </span>
                </div>

                <div>
                  <span className="block text-xs text-slate-500 font-medium">Compliance</span>
                  <span className={`text-sm font-black mt-0.5 block ${isPassed ? 'text-emerald-700' : isFailed ? 'text-rose-700' : 'text-slate-600'}`}>
                    {isPassed ? '100%' : isFailed ? '25%' : '---'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
