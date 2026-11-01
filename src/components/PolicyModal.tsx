'use client';

import React from 'react';
import { ShieldCheck, X, Lock, RefreshCw, AlertTriangle, Terminal, KeyRound, Cpu } from 'lucide-react';

interface PolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PolicyModal: React.FC<PolicyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in duration-200">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-[#F8FAFC]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#F0F5FA] border border-[#D0E2F2] flex items-center justify-center text-[#003087]">
              <ShieldCheck className="w-4 h-4 text-[#0070BA]" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Enterprise Escrow & Security Governance Policy</h2>
              <p className="text-xs text-slate-500">Autonomous multi-agent guardrails and cyber defense standards</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          
          {/* Section 1: Financial Guardrails */}
          <div>
            <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-[#0070BA]" />
              <span>1. PayPal REST v2 Escrow Safeguards (Two-Phase Commit)</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              <div className="p-3 rounded-xl bg-[#F8FAFC] border border-slate-200">
                <span className="font-semibold text-slate-800 block mb-0.5">Two-Phase Authorization Hold</span>
                <p className="text-slate-600 leading-relaxed">
                  Funds are never transferred directly to worker agents. All orders use <code className="bg-slate-200/70 px-1 py-0.5 rounded text-[11px] font-mono">intent: &apos;AUTHORIZE&apos;</code> to hold funds in the PayPal vault until release.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-[#F8FAFC] border border-slate-200">
                <span className="font-semibold text-slate-800 block mb-0.5">Autonomous Spending Cap</span>
                <p className="text-slate-600 leading-relaxed">
                  Unattended autonomous transactions are strictly capped at <strong className="text-[#003087]">$100.00 USD</strong>. Contracts exceeding $100 require human buyer dual-key approval.
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: Self-Healing Revision Policy */}
          <div>
            <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-1.5">
              <RefreshCw className="w-3.5 h-3.5 text-indigo-600" />
              <span>2. Autonomous Self-Healing Cure Period (Max 3 Revisions)</span>
            </h3>
            <div className="p-3 rounded-xl bg-[#F0F5FA]/80 border border-[#D0E2F2] space-y-2">
              <p className="text-slate-700 leading-relaxed">
                When a worker agent delivers code with security vulnerabilities or failing tests, the protocol does not immediately destroy the transaction. Instead, it enters a <strong className="text-[#003087]">Cryptographic Cure Window</strong>:
              </p>
              <div className="grid grid-cols-3 gap-2 text-center pt-1">
                <div className="p-2 rounded-lg bg-white border border-slate-200">
                  <span className="text-[11px] font-bold text-slate-800 block">Attempt 1</span>
                  <span className="text-[10px] text-slate-500">Initial Delivery & Audit</span>
                </div>
                <div className="p-2 rounded-lg bg-white border border-blue-200">
                  <span className="text-[11px] font-bold text-[#0070BA] block">Attempt 2</span>
                  <span className="text-[10px] text-slate-500">Self-Healing Remediation</span>
                </div>
                <div className="p-2 rounded-lg bg-white border border-rose-200">
                  <span className="text-[11px] font-bold text-rose-700 block">Attempt 3</span>
                  <span className="text-[10px] text-slate-500">Final Chance / Auto-Void</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-500 italic">
                * If Attempt 3 fails, the PayPal authorization is permanently voided and 100% of funds return to the buyer agent.
              </p>
            </div>
          </div>

          {/* Section 3: Cyber Defense & AST Sandboxing */}
          <div>
            <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              <span>3. Cyber Attack Mitigation & Static AST Defense</span>
            </h3>
            <div className="space-y-2">
              <div className="p-2.5 rounded-xl bg-[#F8FAFC] border border-slate-200 flex items-start gap-2.5">
                <KeyRound className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-800">CWE-798: Zero Hardcoded Credential Leakage</span>
                  <p className="text-slate-600 text-[11px] mt-0.5 leading-relaxed">
                    Arbiter AST engine scans all deliverables for regex patterns matching API keys, JWT tokens, and private keys. Flawed secrets are masked and deliverables are quarantined.
                  </p>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-[#F8FAFC] border border-slate-200 flex items-start gap-2.5">
                <Terminal className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-800">CWE-89: Automated SQL Injection Interception</span>
                  <p className="text-slate-600 text-[11px] mt-0.5 leading-relaxed">
                    Direct formatted string queries (<code className="font-mono text-[10px] bg-slate-200 px-1 py-0.5 rounded">f&quot;SELECT... WHERE user=&apos;&#123;user&#125;&apos;&quot;</code>) are blocked. Release requires parameterized bindings (<code className="font-mono text-[10px] bg-slate-200 px-1 py-0.5 rounded">?, ?</code>).
                  </p>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-[#F8FAFC] border border-slate-200 flex items-start gap-2.5">
                <Cpu className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-800">Ephemeral MicroVM Jail & No-Egress Execution</span>
                  <p className="text-slate-600 text-[11px] mt-0.5 leading-relaxed">
                    Worker agent code is executed in isolated containers without external network egress, preventing supply-chain backdoors, data exfiltration, and malicious remote calls.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-slate-100 bg-[#F8FAFC] flex items-center justify-between">
          <span className="text-[11px] text-slate-500 font-medium">Policy Engine Version: v2.4 (Compliant with OWASP Top 10)</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-full bg-[#0070BA] hover:bg-[#003087] text-white text-xs font-semibold transition-all cursor-pointer"
          >
            Close Policy
          </button>
        </div>

      </div>
    </div>
  );
};
