'use client';

import React, { useState, useEffect, useRef } from 'react';
import { AgentMessage, AgentRole } from '@/types/escrow';
import { Terminal, Users, Cpu, ShieldCheck, DollarSign } from 'lucide-react';

interface AgentTerminalProps {
  messages: AgentMessage[];
}

export const AgentTerminal: React.FC<AgentTerminalProps> = ({ messages }) => {
  const [filter, setFilter] = useState<AgentRole | 'ALL'>('ALL');
  const [mounted, setMounted] = useState<boolean>(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Internal-only container scroll: NEVER scrolls the outer browser window!
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const filteredMessages = filter === 'ALL' ? messages : messages.filter((m) => m.sender === filter);

  const getAgentBadge = (sender: AgentRole) => {
    switch (sender) {
      case 'BUYER_AGENT':
        return {
          label: 'Buyer Agent',
          icon: <Users className="w-3.5 h-3.5 text-[#003087]" />,
          color: 'bg-blue-50 border-blue-200 text-[#003087]',
        };
      case 'WORKER_AGENT':
        return {
          label: 'Worker Agent',
          icon: <Cpu className="w-3.5 h-3.5 text-indigo-700" />,
          color: 'bg-indigo-50 border-indigo-200 text-indigo-900',
        };
      case 'ARBITER_AGENT':
        return {
          label: 'AI Arbiter',
          icon: <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />,
          color: 'bg-amber-50 border-amber-200 text-amber-900',
        };
      case 'PAYPAL_ESCROW':
        return {
          label: 'Escrow Engine',
          icon: <DollarSign className="w-3.5 h-3.5 text-[#0070BA]" />,
          color: 'bg-[#F0F5FA] border-[#D0E2F2] text-[#003087]',
        };
    }
  };

  const formatTimestamp = (isoString: string) => {
    if (!mounted) {
      return isoString.substring(11, 19) + ' UTC';
    }
    try {
      const d = new Date(isoString);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    } catch {
      return isoString.substring(11, 19);
    }
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex flex-col h-[600px]">
      
      {/* Title & Count Row */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-[#0070BA]" />
          <h3 className="text-sm font-bold text-slate-900">
            Agent Activity Stream
          </h3>
        </div>
        <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full font-semibold border border-slate-200">
          {messages.length} Events
        </span>
      </div>

      {/* Filter Segmented Control */}
      <div className="grid grid-cols-5 bg-slate-100/80 p-0.5 rounded-lg text-center text-xs mb-3 font-medium border border-slate-200/50">
        {(['ALL', 'BUYER_AGENT', 'WORKER_AGENT', 'ARBITER_AGENT', 'PAYPAL_ESCROW'] as const).map((role) => {
          const shortLabel = 
            role === 'ALL' ? 'All' :
            role === 'BUYER_AGENT' ? 'Buyer' :
            role === 'WORKER_AGENT' ? 'Worker' :
            role === 'ARBITER_AGENT' ? 'Arbiter' : 'Escrow';

          return (
            <button
              key={role}
              onClick={() => setFilter(role)}
              className={`py-1 rounded-md transition-all cursor-pointer ${
                filter === role
                  ? 'bg-white text-[#003087] font-bold shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {shortLabel}
            </button>
          );
        })}
      </div>

      {/* Messages Scroll Area */}
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto space-y-2.5 pr-1.5">
        {filteredMessages.map((msg) => {
          const badge = getAgentBadge(msg.sender);

          return (
            <div
              key={msg.id}
              className="p-3.5 rounded-xl bg-[#F8FAFC] border border-slate-200/80 text-xs flex flex-col gap-1.5 transition-all hover:bg-slate-50 hover:border-slate-300"
            >
              <div className="flex items-center justify-between">
                <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border text-xs font-semibold ${badge.color}`}>
                  {badge.icon}
                  <span>{badge.label}</span>
                </span>
                <span suppressHydrationWarning className="text-xs text-slate-500 font-medium">
                  {formatTimestamp(msg.timestamp)}
                </span>
              </div>

              <div className="font-bold text-slate-900 mt-0.5">{msg.title}</div>
              <p className="text-slate-600 leading-relaxed font-sans">{msg.content}</p>
            </div>
          );
        })}
      </div>

    </div>
  );
};
