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
          <div className="w-8 h-8 rounded-lg bg-[#003087] flex items-center justify-center text-white shadow-xs">
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
          <span className="text-xs font-bold text-[#003087] bg-[#F0F5FA] border border-[#D0E2F2] px-3 py-1 rounded-full">
            Total: ${contract.totalBudgetUSD.toFixed(2)} USD
          </span>
        </div>
      </div>

      {/* 2-Column Responsive Milestone Grid with Elegant Subtle Color Accents */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {contract.milestones.map((m) => (
          <div
            key={m.id}
            className={`p-4 rounded-xl border bg-white shadow-2xs transition-all flex flex-col justify-between gap-3 text-xs ${
              m.status === 'PASSED'
                ? 'border-slate-200/90 hover:border-emerald-300 border-l-4 border-l-emerald-500'
                : m.status === 'FAILED'
                ? 'border-slate-200/90 hover:border-rose-300 border-l-4 border-l-rose-500'
                : 'border-slate-200/90 border-l-4 border-l-slate-300 hover:border-slate-300'
            }`}
          >
            <div>
              {/* Title & Amount Row with generous spacing */}
              <div className="flex items-center justify-between gap-3 mb-1.5">
                <span className="font-bold text-slate-900 flex items-center gap-2 min-w-0">
                  <span className={`px-2 py-0.5 rounded text-xs font-bold shrink-0 ${
                    m.status === 'PASSED'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : m.status === 'FAILED'
                      ? 'bg-rose-50 text-rose-800 border border-rose-200'
                      : 'bg-slate-100 text-slate-800 border border-slate-200'
                  }`}>
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

            {/* Status Footer */}
            <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 text-xs mt-auto">
              <div className="flex items-center gap-1.5">
                {m.status === 'PASSED' && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                {m.status === 'FAILED' && <XCircle className="w-4 h-4 text-rose-600 shrink-0" />}
                {m.status === 'PENDING' && <Clock className="w-4 h-4 text-slate-400 shrink-0" />}
                <span className={`font-semibold ${
                  m.status === 'PASSED'
                    ? 'text-emerald-700'
                    : m.status === 'FAILED'
                    ? 'text-rose-700'
                    : 'text-slate-500'
                }`}>
                  {m.status === 'PASSED'
                    ? 'Arbiter Approved & Released'
                    : m.status === 'FAILED'
                    ? 'Arbiter Rejected'
                    : 'Awaiting Worker Delivery'}
                </span>
              </div>

              {m.testSuite.total > 0 && (
                <span className={`font-semibold px-2 py-0.5 rounded border ${
                  m.status === 'PASSED'
                    ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                    : m.status === 'FAILED'
                    ? 'text-rose-700 bg-rose-50 border-rose-200'
                    : 'text-slate-600 bg-slate-50 border-slate-200'
                }`}>
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
          <Award className="w-3.5 h-3.5 text-[#0070BA]" /> Escrow Protection Guarantee: <strong className="text-[#003087] font-semibold">Zero counterparty risk</strong>
        </span>
        <span className="text-slate-400 font-mono text-[11px]">
          Auth Policy: Two-Phase Commit
        </span>
      </div>

    </div>
  );
};
