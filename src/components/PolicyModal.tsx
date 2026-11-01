'use client';

import React from 'react';
import { ShieldCheck, X, Lock, RefreshCw, AlertTriangle, ShieldAlert } from 'lucide-react';

interface PolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PolicyModal: React.FC<PolicyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-[#F8FAFC]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-2xs">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Governance & Security Policy</h2>
              <p className="text-xs text-slate-500">Autonomous multi-agent guardrails and fund protection</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Clean, Spacious Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          
          {/* Card 1: Two-Phase Commit */}
          <div className="p-4 rounded-xl border border-slate-200 bg-[#F8FAFC] space-y-1.5">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-xs">
              <Lock className="w-4 h-4 text-slate-700 shrink-0" />
              <span>1. Two-Phase Escrow Safeguard (intent: AUTHORIZE)</span>
            </div>
            <p className="text-slate-700 leading-relaxed text-xs">
              Funds are never transferred directly to worker agents. All orders use a two-phase authorization hold in the PayPal vault. Money only releases after an AI Arbiter cryptographically verifies deliverables.
            </p>
          </div>

          {/* Card 2: Cure Period */}
          <div className="p-4 rounded-xl border border-slate-200 bg-[#F8FAFC] space-y-1.5">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-xs">
              <RefreshCw className="w-4 h-4 text-slate-700 shrink-0" />
              <span>2. Autonomous Cure Period (Up to 3 Revisions)</span>
            </div>
            <p className="text-slate-700 leading-relaxed text-xs">
              When code fails tests or contains security flaws, payout is halted immediately. The worker agent receives automated diagnostic notices and has up to 3 chances to patch. If all 3 fail, 100% of funds return to the buyer.
            </p>
          </div>

          {/* Card 3: Cyber Defense */}
          <div className="p-4 rounded-xl border border-slate-200 bg-[#F8FAFC] space-y-1.5">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-xs">
              <ShieldAlert className="w-4 h-4 text-slate-700 shrink-0" />
              <span>3. Automated Static Cyber Defense</span>
            </div>
            <p className="text-slate-700 leading-relaxed text-xs">
              Static AST parsers inspect every deliverable before release. SQL injection vulnerabilities (CWE-89) are halted, and hardcoded credentials (CWE-798) are automatically masked and quarantined.
            </p>
          </div>

          {/* Card 4: Spending Limits */}
          <div className="p-4 rounded-xl border border-slate-200 bg-[#F8FAFC] space-y-1.5">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-xs">
              <AlertTriangle className="w-4 h-4 text-slate-700 shrink-0" />
              <span>4. Spending Guardrails & Caps</span>
            </div>
            <p className="text-slate-700 leading-relaxed text-xs">
              Unattended autonomous agent transactions are capped at <strong>$100.00 USD</strong>. Higher transaction values require human dual-key authorization to prevent rogue agent overspending.
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-[#F8FAFC] flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            Compliant with OWASP Top 10 & Zero-Trust Standards
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-all cursor-pointer shadow-2xs"
          >
            Close Policy
          </button>
        </div>

      </div>
    </div>
  );
};
