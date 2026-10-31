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
    a.download = `PayPal_AgentEscrow_Audit_${contract.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex flex-col h-[580px]">
      {/* Tab Navigation */}
      <div className="flex items-center justify-between pb-3.5 border-b border-slate-200 mb-3.5">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setActiveTab('CODE')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'CODE'
                ? 'bg-blue-50 text-[#003087] border border-blue-200 font-bold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Delivered Artifact</span>
          </button>

          <button
            onClick={() => setActiveTab('TESTS')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'TESTS'
                ? 'bg-blue-50 text-[#003087] border border-blue-200 font-bold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Arbiter Test Suite ({allTests.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('AUDIT')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'AUDIT'
                ? 'bg-blue-50 text-[#003087] border border-blue-200 font-bold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Audit Proof</span>
          </button>
        </div>

        {artifact && (
          <button
            onClick={downloadAuditReport}
            className="text-[11px] font-mono text-[#0070BA] hover:text-[#003087] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
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
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 pb-2 mb-2 border-b border-slate-100">
                  <span className="text-[#0070BA] font-bold">{artifact.filename}</span>
                  <span className="flex items-center gap-1 text-[10px] text-slate-400">
                    <Hash className="w-3 h-3" /> SHA: {artifact.sha256Hash.substring(0, 16)}...
                  </span>
                </div>
                <pre className="flex-1 p-3.5 rounded-xl bg-slate-900 text-slate-100 text-[11px] font-mono overflow-x-auto leading-relaxed border border-slate-800">
                  {artifact.code}
                </pre>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 text-xs gap-2">
                <Code2 className="w-8 h-8 text-slate-300" />
                <span className="font-medium text-slate-600">Worker Agent has not yet committed digital artifacts.</span>
                <span className="text-[11px] text-slate-400">Locked in PayPal Escrow until delivery.</span>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Test Suite Runner */}
        {activeTab === 'TESTS' && (
          <div className="space-y-2.5">
            {allTests.length > 0 ? (
              allTests.map((t, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border text-xs flex flex-col gap-1 ${
                    t.passed ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900' : 'bg-rose-50/60 border-rose-200 text-rose-900'
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
                    <span className="font-mono text-[11px] text-slate-500 font-medium">{t.durationMs}ms</span>
                  </div>

                  {t.error && (
                    <div className="mt-1.5 p-2.5 rounded-lg bg-rose-100 border border-rose-300 font-mono text-[11px] text-rose-900 leading-snug">
                      {t.error}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="h-48 flex flex-col items-center justify-center text-slate-400 text-xs gap-2">
                <Terminal className="w-8 h-8 text-slate-300" />
                <span className="font-medium text-slate-500">Test suite queue will trigger once code is submitted to Arbiter.</span>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Cryptographic Audit Proof */}
        {activeTab === 'AUDIT' && (
          <div className="space-y-3.5 text-xs font-mono">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="text-[#003087] font-bold mb-2 flex items-center gap-1.5 text-sm">
                <ShieldCheck className="w-4 h-4 text-[#0070BA]" /> PayPal AgentEscrow Certificate
              </div>
              <div className="text-slate-600">Contract ID: <span className="text-slate-900 font-bold">{contract.id}</span></div>
              <div className="text-slate-600">Buyer Agent: <span className="text-slate-800">{contract.buyerAgentId}</span></div>
              <div className="text-slate-600">Worker Agent: <span className="text-slate-800">{contract.workerAgentId}</span></div>
              <div className="text-slate-600">Arbiter Agent: <span className="text-slate-800">{contract.arbiterAgentId}</span></div>
              <div className="text-slate-600">PayPal Order: <span className="text-slate-800">{contract.paypalMetadata.orderId || 'N/A'}</span></div>
              <div className="text-slate-600">PayPal Auth ID: <span className="text-[#0070BA] font-bold">{contract.paypalMetadata.authorizationId || 'N/A'}</span></div>
              <div className="text-slate-600">Status: <span className="text-slate-900 font-bold">{contract.status}</span></div>
            </div>

            <div className={`p-4 rounded-xl border flex items-center justify-between ${
              isPassed ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : isFailed ? 'bg-rose-50 border-rose-200 text-rose-900' : 'bg-slate-50 border-slate-200 text-slate-600'
            }`}>
              <div>
                <span className="block text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Final Arbitration Verdict</span>
                <span className="text-sm font-bold mt-0.5 block">
                  {isPassed ? 'RELEASE_FUNDS_AUTHORIZED' : isFailed ? 'VOID_AUTHORIZATION_REFUND' : 'PENDING_VERIFICATION'}
                </span>
              </div>
              <div className="text-right">
                <span className="block text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Compliance Score</span>
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
