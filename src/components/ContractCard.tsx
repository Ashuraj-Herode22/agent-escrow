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
        return <span className="px-2.5 py-1 text-xs rounded-full bg-emerald-950 text-emerald-400 border border-emerald-700 font-medium">PAYOUT COMPLETED</span>;
      case 'DISPUTE_REFUNDED':
        return <span className="px-2.5 py-1 text-xs rounded-full bg-rose-950 text-rose-400 border border-rose-700 font-medium">REFUNDED TO BUYER</span>;
      case 'ESCROW_LOCKED':
        return <span className="px-2.5 py-1 text-xs rounded-full bg-cyan-950 text-cyan-400 border border-cyan-700 font-medium animate-pulse">ESCROW LOCKED</span>;
      case 'DELIVERED_AUDITING':
        return <span className="px-2.5 py-1 text-xs rounded-full bg-amber-950 text-amber-400 border border-amber-700 font-medium">AI AUDITING</span>;
      default:
        return <span className="px-2.5 py-1 text-xs rounded-full bg-slate-800 text-slate-300 font-medium">{status.replace('_', ' ')}</span>;
    }
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-sm shadow-xl flex flex-col gap-4">
      {/* Title & Status */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-cyan-400/90 font-semibold">{contract.id}</span>
            <span className="text-slate-600">•</span>
            <span className="text-xs text-slate-400">Autonomous Spec Contract</span>
          </div>
          <h2 className="text-base font-bold text-white leading-snug">{contract.title}</h2>
          <p className="text-xs text-slate-400 mt-1 line-clamp-2">{contract.description}</p>
        </div>
        <div className="shrink-0">{getStatusBadge(contract.status)}</div>
      </div>

      {/* Agents & Budget Grid */}
      <div className="grid grid-cols-3 gap-2 bg-slate-950/60 border border-slate-800/60 rounded-xl p-3 text-xs">
        <div>
          <span className="text-slate-500 block mb-0.5 flex items-center gap-1">
            <Users className="w-3 h-3 text-blue-400" /> Buyer Agent
          </span>
          <span className="font-mono text-slate-200 truncate block">{contract.buyerAgentId}</span>
        </div>
        <div>
          <span className="text-slate-500 block mb-0.5 flex items-center gap-1">
            <Cpu className="w-3 h-3 text-purple-400" /> Worker Agent
          </span>
          <span className="font-mono text-slate-200 truncate block">{contract.workerAgentId}</span>
        </div>
        <div>
          <span className="text-slate-500 block mb-0.5">Escrow Bounty</span>
          <span className="font-bold text-emerald-400 text-sm">${contract.totalBudgetUSD.toFixed(2)} USD</span>
        </div>
      </div>

      {/* Milestones */}
      <div>
        <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
          <FileCode className="w-3.5 h-3.5 text-cyan-400" /> Programmable Milestones
        </h3>
        <div className="space-y-2">
          {contract.milestones.map((m) => (
            <div
              key={m.id}
              className={`p-3 rounded-xl border text-xs transition-all ${
                m.status === 'PASSED'
                  ? 'bg-emerald-950/20 border-emerald-900/50 text-emerald-300'
                  : m.status === 'FAILED'
                  ? 'bg-rose-950/20 border-rose-900/50 text-rose-300'
                  : m.status === 'IN_REVIEW'
                  ? 'bg-amber-950/20 border-amber-900/50 text-amber-300'
                  : 'bg-slate-950/40 border-slate-800/60 text-slate-400'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-white flex items-center gap-1.5">
                  <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] font-mono text-slate-300">{m.id}</span>
                  {m.title}
                </span>
                <span className="font-mono font-medium text-slate-200">${m.amountUSD.toFixed(2)}</span>
              </div>
              <p className="text-[11px] text-slate-400 mb-2">{m.description}</p>

              {/* Status footer */}
              <div className="flex items-center justify-between pt-1 border-t border-slate-800/40 text-[11px]">
                <div className="flex items-center gap-1.5">
                  {m.status === 'PASSED' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                  {m.status === 'FAILED' && <XCircle className="w-3.5 h-3.5 text-rose-400" />}
                  {m.status === 'PENDING' && <Clock className="w-3.5 h-3.5 text-slate-500" />}
                  <span className="font-medium">
                    {m.status === 'PASSED' ? 'Arbiter Approved' : m.status === 'FAILED' ? 'Arbiter Rejected' : 'Awaiting Delivery'}
                  </span>
                </div>
                {m.testSuite.total > 0 && (
                  <span className="font-mono text-slate-300">
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
