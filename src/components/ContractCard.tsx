'use client';

import React from 'react';
import { TaskContract } from '@/types/escrow';
import { FileCode, CheckCircle2, XCircle, Clock, Cpu, Users } from 'lucide-react';

interface ContractCardProps {
  contract: TaskContract;
}

export const ContractCard: React.FC<ContractCardProps> = ({ contract }) => {
  const getStatusBadge = (status: TaskContract['status']) => {
    switch (status) {
      case 'PAYOUT_COMPLETED':
        return <span className="px-3 py-1 text-xs rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">PAYOUT COMPLETED</span>;
      case 'DISPUTE_REFUNDED':
        return <span className="px-3 py-1 text-xs rounded-full bg-rose-50 text-rose-700 border border-rose-200 font-semibold">REFUNDED TO BUYER</span>;
      case 'ESCROW_LOCKED':
        return <span className="px-3 py-1 text-xs rounded-full bg-blue-50 text-[#003087] border border-blue-200 font-semibold">ESCROW LOCKED</span>;
      case 'DELIVERED_AUDITING':
        return <span className="px-3 py-1 text-xs rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-semibold">AI ARBITRATION</span>;
      default:
        return <span className="px-3 py-1 text-xs rounded-full bg-slate-100 text-slate-700 font-semibold">{status.replace('_', ' ')}</span>;
    }
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex flex-col gap-4">
      {/* Title & Status */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
              {contract.id}
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs font-medium text-slate-500">Autonomous Spec Contract</span>
          </div>
          <h2 className="text-base font-bold text-slate-900 leading-snug">{contract.title}</h2>
          <p className="text-xs text-slate-600 mt-1 line-clamp-2">{contract.description}</p>
        </div>
        <div className="shrink-0">{getStatusBadge(contract.status)}</div>
      </div>

      {/* Agents & Budget Grid */}
      <div className="grid grid-cols-3 gap-3 bg-slate-50/80 border border-slate-200/80 rounded-xl p-3 text-xs">
        <div>
          <span className="text-slate-500 block mb-0.5 flex items-center gap-1 font-medium">
            <Users className="w-3.5 h-3.5 text-blue-600" /> Buyer Agent
          </span>
          <span className="font-mono text-slate-800 font-semibold truncate block">{contract.buyerAgentId}</span>
        </div>
        <div>
          <span className="text-slate-500 block mb-0.5 flex items-center gap-1 font-medium">
            <Cpu className="w-3.5 h-3.5 text-indigo-600" /> Worker Agent
          </span>
          <span className="font-mono text-slate-800 font-semibold truncate block">{contract.workerAgentId}</span>
        </div>
        <div>
          <span className="text-slate-500 block mb-0.5 font-medium">Escrow Bounty</span>
          <span className="font-bold text-emerald-600 text-sm">${contract.totalBudgetUSD.toFixed(2)} USD</span>
        </div>
      </div>

      {/* Milestones */}
      <div>
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
          <FileCode className="w-3.5 h-3.5 text-[#0070BA]" /> Programmable Milestones
        </h3>
        <div className="space-y-2">
          {contract.milestones.map((m) => (
            <div
              key={m.id}
              className={`p-3.5 rounded-xl border text-xs transition-all ${
                m.status === 'PASSED'
                  ? 'bg-emerald-50/50 border-emerald-200 text-emerald-900'
                  : m.status === 'FAILED'
                  ? 'bg-rose-50/50 border-rose-200 text-rose-900'
                  : m.status === 'IN_REVIEW'
                  ? 'bg-amber-50/50 border-amber-200 text-amber-900'
                  : 'bg-white border-slate-200 text-slate-600'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-slate-900 flex items-center gap-1.5">
                  <span className="px-1.5 py-0.5 rounded bg-slate-100 text-[10px] font-mono text-slate-600 border border-slate-200">
                    {m.id}
                  </span>
                  {m.title}
                </span>
                <span className="font-mono font-bold text-slate-800">${m.amountUSD.toFixed(2)}</span>
              </div>
              <p className="text-[11px] text-slate-500 mb-2">{m.description}</p>

              {/* Status footer */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-[11px]">
                <div className="flex items-center gap-1.5">
                  {m.status === 'PASSED' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                  {m.status === 'FAILED' && <XCircle className="w-3.5 h-3.5 text-rose-600" />}
                  {m.status === 'PENDING' && <Clock className="w-3.5 h-3.5 text-slate-400" />}
                  <span className="font-medium text-slate-700">
                    {m.status === 'PASSED' ? 'Arbiter Approved' : m.status === 'FAILED' ? 'Arbiter Rejected' : 'Awaiting Delivery'}
                  </span>
                </div>
                {m.testSuite.total > 0 && (
                  <span className="font-mono text-slate-600 font-medium">
                    {m.testSuite.passed}/{m.testSuite.total} Tests Passed
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
