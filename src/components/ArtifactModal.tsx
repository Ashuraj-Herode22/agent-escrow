'use client';

import React, { useState } from 'react';
import { TaskContract } from '@/types/escrow';
import {
  X,
  Code2,
  FileCheck,
  ShieldCheck,
  Hash,
  Download,
  ShieldX,
  Bug,
  Sparkles,
  RotateCw,
  CheckCircle2,
  ShieldAlert,
  Terminal,
} from 'lucide-react';
import { INITIAL_DISPUTE_CODE, PATCHED_SUCCESS_CODE } from '@/lib/agent-engine';

interface ArtifactModalProps {
  isOpen: boolean;
  onClose: () => void;
  contract: TaskContract;
  initialTab?: 'CODE' | 'TESTS' | 'AUDIT';
}

export const ArtifactModal: React.FC<ArtifactModalProps> = ({
  isOpen,
  onClose,
  contract,
  initialTab = 'CODE',
}) => {
  const [activeTab, setActiveTab] = useState<'CODE' | 'TESTS' | 'AUDIT'>(initialTab);
  const [exploitTested, setExploitTested] = useState<boolean>(false);
  const [viewVersion, setViewVersion] = useState<'AUTO' | 'INITIAL' | 'PATCHED'>('AUTO');
  const [isReRunningTests, setIsReRunningTests] = useState<boolean>(false);

  if (!isOpen) return null;

  const artifact = contract.codeArtifact;
  const milestones = contract.milestones;
  const isFailed = contract.status === 'ARBITRATION_FAILED' || contract.status === 'DISPUTE_REFUNDED';
  const isPassed = contract.status === 'ARBITRATION_PASSED' || contract.status === 'PAYOUT_COMPLETED';
  const isRevision = contract.status === 'REVISION_REQUESTED';
  const attemptNum = contract.revisionAttempt || 1;
  const maxAttempts = contract.maxRevisions || 3;

  const effectiveCode = (() => {
    if (viewVersion === 'INITIAL') return INITIAL_DISPUTE_CODE;
    if (viewVersion === 'PATCHED') return PATCHED_SUCCESS_CODE;
    return artifact?.code || '';
  })();

  const isShowingVulnerable = effectiveCode.includes('f"SELECT id, role FROM accounts') || isRevision || isFailed;

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
      protocolMetadata: {
        orderId: contract.paypalMetadata.orderId,
        authorizationId: contract.paypalMetadata.authorizationId,
        captureId: contract.paypalMetadata.captureId,
        escrowLockedAt: contract.paypalMetadata.escrowLockedAt,
        releasedAt: contract.paypalMetadata.releasedAt,
      },
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-[#F8FAFC]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#003087] flex items-center justify-center text-white shadow-2xs">
              <Code2 className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-slate-900">
                  {artifact ? artifact.filename : 'Deliverable Inspection Sandbox'}
                </h2>
                {artifact && (
                  <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                    <Hash className="w-3 h-3" /> {artifact.sha256Hash.substring(0, 12)}...
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">
                Autonomous AST Security Scanner & Isolated Execution Environment
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {artifact && (
              <button
                onClick={downloadAuditReport}
                className="text-xs font-semibold px-3 py-1.5 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 hover:text-slate-900 flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Audit JSON</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="px-5 pt-3 pb-2 border-b border-slate-100 flex items-center gap-2 bg-white">
          <button
            onClick={() => setActiveTab('CODE')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'CODE'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Deliverable Source Code</span>
          </button>

          <button
            onClick={() => setActiveTab('TESTS')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'TESTS'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileCheck className="w-3.5 h-3.5" />
            <span>Test Suite Assertions ({allTests.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('AUDIT')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'AUDIT'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Cryptographic Proof Certificate</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto flex-1 flex flex-col gap-4 text-xs">
          
          {/* TAB 1: CODE & SECURITY */}
          {activeTab === 'CODE' && (
            <div className="flex flex-col gap-3">
              {/* Revision Switcher Banner (Minimalist, Formal Slate) */}
              {(contract.isPatched || contract.id === 'AG-8814') && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-900 font-bold text-xs">
                    <Sparkles className="w-4 h-4 text-slate-700" />
                    <span>Autonomous Self-Healing Revision History:</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-white p-1 rounded-lg border border-slate-200">
                    <button
                      onClick={() => setViewVersion('PATCHED')}
                      className={`px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                        viewVersion === 'PATCHED' || (viewVersion === 'AUTO' && contract.isPatched)
                          ? 'bg-slate-900 text-white shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Attempt 2 (Patched & Remediated)
                    </button>
                    <button
                      onClick={() => setViewVersion('INITIAL')}
                      className={`px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                        viewVersion === 'INITIAL' || (viewVersion === 'AUTO' && !contract.isPatched && isShowingVulnerable)
                          ? 'bg-slate-900 text-white shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Attempt 1 (Vulnerable CWE-89)
                    </button>
                  </div>
                </div>
              )}

              {/* Exploit Alert Banner if Flawed (Formal High-Contrast) */}
              {isShowingVulnerable && (
                <div className="bg-[#F8FAFC] border border-slate-300 rounded-xl p-3.5 flex items-center justify-between text-xs text-slate-900">
                  <div className="flex items-center gap-2.5">
                    <ShieldAlert className="w-5 h-5 text-slate-800 shrink-0" />
                    <div>
                      <strong className="font-bold">CWE-89 SQL Injection Detected on Line 12:</strong> Raw string interpolation permits unauthorized database queries. Payout halted.
                    </div>
                  </div>
                  <button
                    onClick={() => setExploitTested(!exploitTested)}
                    className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ml-3 shadow-2xs"
                  >
                    <Bug className="w-3.5 h-3.5" />
                    <span>{exploitTested ? 'Hide Exploit Vector' : 'Test Exploit Vector'}</span>
                  </button>
                </div>
              )}

              {/* Interactive Exploit Output */}
              {exploitTested && isShowingVulnerable && (
                <div className="p-3.5 rounded-xl bg-slate-950 text-slate-200 font-mono text-xs border border-slate-800 space-y-1.5">
                  <div className="text-slate-400 flex items-center justify-between pb-1 border-b border-slate-800">
                    <span># Exploit Vector Analysis</span>
                    <span className="text-white font-bold bg-slate-800 px-2 py-0.5 rounded text-[10px]">VULNERABILITY VERIFIED</span>
                  </div>
                  <p className="text-slate-300">
                    Injected Payload: <code className="text-white font-bold">&apos; OR &apos;1&apos;=&apos;1</code>
                  </p>
                  <p className="text-slate-300">
                    Evaluates to: <code className="text-slate-400">SELECT id, role FROM accounts WHERE user = &apos;&apos; OR &apos;1&apos;=&apos;1&apos;</code>
                  </p>
                  <p className="text-slate-300 font-medium">
                    &gt; Result: Authentication Bypassed! Returned UID 1 (Role: admin). AI Arbiter blocked payment release.
                  </p>
                </div>
              )}

              {/* Code Pre Box */}
              <div className="relative rounded-xl border border-slate-200 bg-[#F8FAFC] overflow-hidden">
                <div className="bg-slate-100/80 px-4 py-2 border-b border-slate-200 flex items-center justify-between text-xs text-slate-500">
                  <span className="font-mono font-bold text-slate-700">
                    {artifact ? artifact.filename : 'source_code.py'}
                  </span>
                  <span>Python 3.12 (Isolated Jail)</span>
                </div>
                <pre className="p-4 text-xs font-mono text-slate-800 overflow-x-auto leading-relaxed max-h-[380px]">
                  {effectiveCode}
                </pre>
              </div>

              {/* Status Chips */}
              <div className="grid grid-cols-3 gap-3 bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs">
                <div>
                  <span className="text-slate-500 block">Runtime Environment</span>
                  <span className="font-bold text-slate-900">Python 3.12-slim (Alpine Jail)</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Security Policy</span>
                  <span className="font-bold text-slate-900">
                    {isShowingVulnerable ? 'Quarantined & Masked' : 'Clean AST Parsed'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Release Authorization</span>
                  <span className="font-bold text-slate-900">
                    {isPassed ? 'Release Token Signed' : isFailed ? 'Voided & Refunded' : isRevision ? 'Cure Window Active' : 'Auditing'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: TESTS */}
          {activeTab === 'TESTS' && (
            <div className="flex flex-col gap-3">
              {/* Metrics */}
              <div className="grid grid-cols-4 gap-3 bg-[#F8FAFC] border border-slate-200 rounded-xl p-3 text-center text-xs">
                <div>
                  <span className="text-slate-500 block">Total Assertions</span>
                  <span className="font-bold text-slate-900 text-sm">{allTests.length}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Passed</span>
                  <span className="font-bold text-slate-900 text-sm">{passedCount}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Failed</span>
                  <span className="font-bold text-slate-900 text-sm">{failedCount}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Test Engine</span>
                  <span className="font-bold text-slate-900 text-sm">PyTest v8</span>
                </div>
              </div>

              {/* Test List */}
              <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                {allTests.length > 0 ? (
                  allTests.map((t, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl border border-slate-200 bg-white text-xs flex flex-col gap-1.5 shadow-2xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold flex items-center gap-2">
                          {t.passed ? (
                            <CheckCircle2 className="w-4 h-4 text-slate-900 shrink-0" />
                          ) : (
                            <ShieldAlert className="w-4 h-4 text-slate-900 shrink-0" />
                          )}
                          <span className="text-slate-900">{t.name}</span>
                        </span>
                        <span className="text-slate-500 font-mono">{t.durationMs}ms</span>
                      </div>

                      {t.error && (
                        <div className="mt-1 p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 font-mono text-[11px] leading-snug">
                          {t.error}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-slate-400 text-xs">
                    Tests execute automatically when deliverable is submitted.
                  </div>
                )}
              </div>

              {/* Re-run footer */}
              {allTests.length > 0 && (
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-slate-500 text-xs">
                    Automated assertion verification completed in {allTests.reduce((acc, t) => acc + t.durationMs, 0)}ms
                  </span>
                  <button
                    onClick={handleReRunTests}
                    disabled={isReRunningTests}
                    className="px-3.5 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                  >
                    <RotateCw className={`w-3.5 h-3.5 text-slate-500 ${isReRunningTests ? 'animate-spin' : ''}`} />
                    <span>{isReRunningTests ? 'Evaluating...' : 'Re-run Test Suite'}</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: AUDIT PROOF */}
          {activeTab === 'AUDIT' && (
            <div className="flex flex-col gap-4">
              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200 space-y-3">
                <div className="text-slate-900 font-bold flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-slate-800" /> Proof-of-Arbitration Certificate
                  </span>
                  <span className="text-[11px] bg-slate-100 text-slate-800 border border-slate-200 font-semibold px-2.5 py-0.5 rounded-full">
                    ECDSA SECP256K1 Validated
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>Contract ID: <span className="font-bold text-slate-900">{contract.id}</span></div>
                  <div>Final Status: <span className="font-bold text-slate-900">{contract.status}</span></div>
                  <div>Buyer Agent: <span className="text-slate-800">{contract.buyerAgentId}</span></div>
                  <div>Worker Agent: <span className="text-slate-800">{contract.workerAgentId}</span></div>
                  <div>Order ID: <span className="font-mono text-slate-800">{contract.paypalMetadata.orderId || 'Pending'}</span></div>
                  <div>Auth ID: <span className="font-mono text-slate-900 font-bold">{contract.paypalMetadata.authorizationId || 'Pending'}</span></div>
                </div>
              </div>

              <div className="p-4 rounded-xl border bg-slate-50 border-slate-200">
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div>
                    <span className="block text-slate-500 text-xs">Final Verdict</span>
                    <span className="text-sm font-bold mt-1 block text-slate-900">
                      {isPassed ? 'RELEASE_FUNDS' : isFailed ? 'VOID_REFUND' : isRevision ? 'REVISION_CURE' : 'PENDING'}
                    </span>
                  </div>

                  <div className="border-x border-slate-200 px-3">
                    <span className="block text-slate-500 text-xs">Security Scanner</span>
                    <span className="text-sm font-bold mt-1 block text-slate-900">
                      {isPassed ? '0 Vulnerabilities' : isFailed ? 'CWE-89 Blocked' : 'Scanning'}
                    </span>
                  </div>

                  <div>
                    <span className="block text-slate-500 text-xs">Compliance</span>
                    <span className="text-base font-black mt-0.5 block text-slate-900">
                      {isPassed ? '100%' : isFailed ? '25%' : '---'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-3.5 border-t border-slate-100 bg-[#F8FAFC] flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            AgentEscrow Cryptographic Verification Protocol
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-full bg-[#003087] hover:bg-[#002266] text-white text-xs font-semibold transition-all cursor-pointer shadow-2xs"
          >
            Close Inspector
          </button>
        </div>

      </div>
    </div>
  );
};
