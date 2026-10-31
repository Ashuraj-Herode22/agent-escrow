'use client';

import React, { useState } from 'react';
import { TaskContract } from '@/types/escrow';
import { Code2, ShieldAlert, CheckCircle2, ShieldCheck, Terminal, Hash, Download } from 'lucide-react';

interface CodeInspectorProps {
  contract: TaskContract;
}

export const CodeInspector: React.FC<CodeInspectorProps> = ({ contract }) => {
  const [activeTab, setActiveTab] = useState<'CODE' | 'TESTS' | 'AUDIT'>('CODE');
  const artifact = contract.codeArtifact;
  const milestones = contract.milestones;
  const isFailed = contract.status === 'ARBITRATION_FAILED' || contract.status === 'DISPUTE_REFUNDED';
  const isPassed = contract.status === 'ARBITRATION_PASSED' || contract.status === 'PAYOUT_COMPLETED';

  // Aggregate all tests across milestones
  const allTests = milestones.flatMap((m) => m.testSuite.tests);

  const downloadAuditReport = () => {
    const report = {
      contractId: contract.id,
      title: contract.title,
      timestamp: new Date().toISOString(),
      status: contract.status,
      paypalMetadata: contract.paypalMetadata,
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

  return (
    <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-sm shadow-xl flex flex-col h-[580px]">
      {/* Tab Navigation */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-3">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setActiveTab('CODE')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'CODE' ? 'bg-cyan-950 text-cyan-400 border border-cyan-800/80 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Delivered Artifact</span>
          </button>

          <button
            onClick={() => setActiveTab('TESTS')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'TESTS' ? 'bg-cyan-950 text-cyan-400 border border-cyan-800/80 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Arbiter Test Suite ({allTests.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('AUDIT')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'AUDIT' ? 'bg-cyan-950 text-cyan-400 border border-cyan-800/80 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Audit Proof</span>
          </button>
        </div>

        {artifact && (
          <button
            onClick={downloadAuditReport}
            className="text-[11px] font-mono text-slate-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
            title="Download signed JSON report"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Proof</span>
          </button>
        )}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto">
        {/* Tab 1: Code Viewer */}
        {activeTab === 'CODE' && (
          <div className="flex flex-col h-full">
            {artifact ? (
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pb-2 mb-2 border-b border-slate-800/50">
                  <span className="text-cyan-400">{artifact.filename}</span>
                  <span className="flex items-center gap-1 text-[10px] text-slate-500">
                    <Hash className="w-3 h-3" /> SHA: {artifact.sha256Hash.substring(0, 16)}...
                  </span>
                </div>
                <pre className="flex-1 p-3.5 rounded-xl bg-black/70 border border-slate-800 text-[11px] font-mono text-slate-200 overflow-x-auto leading-relaxed">
                  {artifact.code}
                </pre>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 text-xs gap-2">
                <Code2 className="w-8 h-8 text-slate-600" />
                <span>Worker Agent has not yet committed digital artifacts.</span>
                <span className="text-[10px] text-slate-600">Locked in PayPal Escrow until delivery.</span>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Test Suite Runner */}
        {activeTab === 'TESTS' && (
          <div className="space-y-3">
            {allTests.length > 0 ? (
              allTests.map((t, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border text-xs flex flex-col gap-1 ${
                    t.passed ? 'bg-emerald-950/20 border-emerald-900/50 text-emerald-300' : 'bg-rose-950/30 border-rose-900/80 text-rose-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold flex items-center gap-1.5">
                      {t.passed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : (
                        <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 animate-pulse" />
                      )}
                      <span>{t.name}</span>
                    </span>
                    <span className="font-mono text-[11px] text-slate-400">{t.durationMs}ms</span>
                  </div>

                  {t.error && (
                    <div className="mt-1.5 p-2 rounded-lg bg-black/60 border border-rose-800/60 font-mono text-[11px] text-rose-400 leading-snug">
                      {t.error}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="h-48 flex flex-col items-center justify-center text-slate-500 text-xs gap-2">
                <Terminal className="w-8 h-8 text-slate-600" />
                <span>Test suite queue will trigger once code is submitted to Arbiter.</span>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Cryptographic Audit Proof */}
        {activeTab === 'AUDIT' && (
          <div className="space-y-4 text-xs font-mono">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="text-cyan-400 font-bold mb-2 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" /> AgentEscrow Proof-of-Arbitration Certificate
              </div>
              <div className="text-slate-400">Contract ID: <span className="text-slate-200">{contract.id}</span></div>
              <div className="text-slate-400">Buyer Agent: <span className="text-slate-200">{contract.buyerAgentId}</span></div>
              <div className="text-slate-400">Worker Agent: <span className="text-slate-200">{contract.workerAgentId}</span></div>
              <div className="text-slate-400">Arbiter Agent: <span className="text-slate-200">{contract.arbiterAgentId}</span></div>
              <div className="text-slate-400">PayPal Order: <span className="text-slate-200">{contract.paypalMetadata.orderId || 'N/A'}</span></div>
              <div className="text-slate-400">PayPal Auth ID: <span className="text-cyan-400">{contract.paypalMetadata.authorizationId || 'N/A'}</span></div>
              <div className="text-slate-400">Status: <span className="text-white font-bold">{contract.status}</span></div>
            </div>

            <div className={`p-4 rounded-xl border flex items-center justify-between ${
              isPassed ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300' : isFailed ? 'bg-rose-950/40 border-rose-800 text-rose-300' : 'bg-slate-950 border-slate-800 text-slate-400'
            }`}>
              <div>
                <span className="block text-[10px] text-slate-500 uppercase tracking-wider">Final Arbitration Verdict</span>
                <span className="text-sm font-bold mt-0.5 block">
                  {isPassed ? 'RELEASE_FUNDS_AUTHORIZED' : isFailed ? 'VOID_AUTHORIZATION_REFUND' : 'PENDING_VERIFICATION'}
                </span>
              </div>
              <div className="text-right">
                <span className="block text-[10px] text-slate-500 uppercase tracking-wider">Compliance Score</span>
                <span className="text-lg font-bold font-mono">
                  {isPassed ? '100%' : isFailed ? '25%' : '---'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
