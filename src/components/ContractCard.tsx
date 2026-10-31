'use client';

import React from 'react';
import { TaskContract } from '@/types/escrow';
import { FileCode, CheckCircle2, XCircle, Clock, Cpu, Users, Award } from 'lucide-react';

interface ContractCardProps {
  contract: TaskContract;
}

export const ContractCard: React.FC<ContractCardProps> = ({ contract }) => {
  const getStatusBadge = (status: TaskContract['status']) => {
    switch (status) {
      case 'PAYOUT_COMPLETED':
        return <span className="px-3 py-1 text-xs rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold whitespace-nowrap">Payout Completed</span>;
      case 'DISPUTE_REFUNDED':
        return <span className="px-3 py-1 text-xs rounded-full bg-rose-50 text-rose-700 border border-rose-200 font-bold whitespace-nowrap">Refunded to Buyer</span>;
      case 'ESCROW_LOCKED':
        return <span className="px-3 py-1 text-xs rounded-full bg-[#F0F5FA] text-[#003087] border border-[#D0E2F2] font-bold whitespace-nowrap">Escrow Locked</span>;
      case 'DELIVERED_AUDITING':
        return <span className="px-3 py-1 text-xs rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-bold whitespace-nowrap">AI Arbitration</span>;
      default:
        return <span className="px-3 py-1 text-xs rounded-full bg-slate-100 text-slate-700 font-bold whitespace-nowrap">{status.replace('_', ' ')}</span>;
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col h-[580px]">
      
      {/* Top Header Row: ID & Status */}
      <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-[#003087] border border-slate-200">
            {contract.id}
          </span>
          <span className="text-xs text-slate-500 font-medium">Autonomous Contract</span>
        </div>
        <div>{getStatusBadge(contract.status)}</div>
      </div>

      {/* Contract Title & Description */}
      <div className="mb-3">
        <h2 className="text-sm font-bold text-slate-900 leading-snug">{contract.title}</h2>
        <p className="text-xs text-slate-600 mt-1 leading-relaxed">{contract.description}</p>
      </div>

      {/* Agents Card */}
      <div className="bg-[#F0F5FA]/80 border border-[#D0E2F2] rounded-xl p-3 flex flex-col gap-2 text-xs mb-3.5">
        <div className="flex items-center justify-between">
          <span className="text-slate-500 flex items-center gap-1.5 font-medium">
            <Users className="w-3.5 h-3.5 text-[#0070BA]" /> Buyer Agent:
          </span>
          <span className="text-slate-800 font-semibold">{contract.buyerAgentId}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-slate-500 flex items-center gap-1.5 font-medium">
            <Cpu className="w-3.5 h-3.5 text-indigo-600" /> Worker Agent:
          </span>
          <span className="text-slate-800 font-semibold">{contract.workerAgentId}</span>
        </div>
      </div>

      {/* Programmable Milestones */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1 mb-3">
        <h3 className="text-sm font-bold text-slate-800 mb-2 flex items-center gap-1.5 sticky top-0 bg-white py-1">
          <FileCode className="w-3.5 h-3.5 text-[#0070BA]" /> Programmable Milestones
        </h3>
        
        {contract.milestones.map((m) => (
          <div
            key={m.id}
            className={`p-3 rounded-xl border text-xs transition-all ${
              m.status === 'PASSED'
                ? 'bg-emerald-50/50 border-emerald-200'
                : m.status === 'FAILED'
                ? 'bg-rose-50/50 border-rose-200'
                : m.status === 'IN_REVIEW'
                ? 'bg-amber-50/50 border-amber-200'
                : 'bg-[#F8FAFC] border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                <span className="px-1.5 py-0.5 rounded bg-slate-100 text-xs font-semibold text-slate-600 border border-slate-200">
                  {m.id}
                </span>
                {m.title}
              </span>
              <span className="font-bold text-[#003087]">${m.amountUSD.toFixed(2)}</span>
            </div>
            <p className="text-xs text-slate-500 mb-2">{m.description}</p>

            {/* Status footer */}
            <div className="flex items-center justify-between pt-1.5 border-t border-slate-200/60 text-xs">
              <div className="flex items-center gap-1.5">
                {m.status === 'PASSED' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                {m.status === 'FAILED' && <XCircle className="w-3.5 h-3.5 text-rose-600" />}
                {m.status === 'PENDING' && <Clock className="w-3.5 h-3.5 text-slate-400" />}
                <span className="font-medium text-slate-700">
                  {m.status === 'PASSED' ? 'Arbiter Approved' : m.status === 'FAILED' ? 'Arbiter Rejected' : 'Awaiting Delivery'}
                </span>
              </div>
              {m.testSuite.total > 0 && (
                <span className="text-slate-600 font-semibold">
                  {m.testSuite.passed}/{m.testSuite.total} Tests Passed
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Guarantee Bar */}
      <div className="bg-[#F8FAFC] border border-slate-200 rounded-xl p-3 text-xs text-slate-600 flex items-center justify-between mt-auto">
        <span className="flex items-center gap-1.5 font-medium">
          <Award className="w-3.5 h-3.5 text-[#0070BA]" /> Escrow Protection Guarantee
        </span>
        <span className="font-bold text-[#003087]">Zero Counterparty Risk</span>
      </div>

    </div>
  );
};
