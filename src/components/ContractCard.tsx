'use client';

import React from 'react';
import { TaskContract } from '@/types/escrow';
import { FileCode, CheckCircle2, XCircle, Clock, ShieldCheck, Award } from 'lucide-react';

interface ContractCardProps {
  contract: TaskContract;
}

export const ContractCard: React.FC<ContractCardProps> = ({ contract }) => {
  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 mb-5 gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white shadow-2xs">
            <FileCode className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">Programmable Contract Milestones</h2>
            <p className="text-xs text-slate-500">Milestone funds release only upon AI Arbiter test verification</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
            Contract #{contract.id}
          </span>
          <span className="text-xs font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
            Total: ${contract.totalBudgetUSD.toFixed(2)} USD
          </span>
        </div>
      </div>

      {/* 2-Column Responsive Milestone Grid (Spacious, Minimalist, No Pastel Colors!) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {contract.milestones.map((m) => (
          <div
            key={m.id}
            className="p-4 rounded-xl border border-slate-200 bg-white text-slate-900 shadow-2xs hover:border-slate-300 transition-all flex flex-col justify-between gap-3 text-xs"
          >
            <div>
              {/* Title & Amount Row with generous spacing */}
              <div className="flex items-center justify-between gap-3 mb-1.5">
                <span className="font-bold text-slate-900 flex items-center gap-2 min-w-0">
                  <span className="px-2 py-0.5 rounded bg-slate-100 text-xs font-bold text-slate-800 border border-slate-200 shrink-0">
                    {m.id}
                  </span>
                  <span className="truncate">{m.title}</span>
                </span>
                <span className="font-extrabold text-slate-900 shrink-0 text-sm">
                  ${m.amountUSD.toFixed(2)}
                </span>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed">
                {m.description}
              </p>
            </div>

            {/* Status Footer (Formal Slate) */}
            <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 text-xs mt-auto">
              <div className="flex items-center gap-1.5">
                {m.status === 'PASSED' && <CheckCircle2 className="w-4 h-4 text-slate-900 shrink-0" />}
                {m.status === 'FAILED' && <XCircle className="w-4 h-4 text-slate-900 shrink-0" />}
                {m.status === 'PENDING' && <Clock className="w-4 h-4 text-slate-400 shrink-0" />}
                <span className="font-semibold text-slate-800">
                  {m.status === 'PASSED'
                    ? 'Arbiter Approved & Released'
                    : m.status === 'FAILED'
                    ? 'Arbiter Rejected'
                    : 'Awaiting Worker Delivery'}
                </span>
              </div>

              {m.testSuite.total > 0 && (
                <span className="text-slate-700 font-semibold bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                  {m.testSuite.passed}/{m.testSuite.total} Tests Passed
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Guarantee Badge */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span className="flex items-center gap-1.5 font-medium">
          <Award className="w-3.5 h-3.5 text-slate-700" /> Escrow Protection Guarantee: Zero counterparty risk
        </span>
        <span className="text-slate-400 font-mono text-[11px]">
          Auth Policy: Two-Phase Commit
        </span>
      </div>

    </div>
  );
};
