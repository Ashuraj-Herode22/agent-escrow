'use client';

import React, { useState, useEffect, useRef } from 'react';
import { AgentMessage, AgentRole } from '@/types/escrow';
import { Terminal, Users, Cpu, ShieldCheck, DollarSign, ChevronDown, ChevronRight } from 'lucide-react';

interface AgentTerminalProps {
  messages: AgentMessage[];
}

export const AgentTerminal: React.FC<AgentTerminalProps> = ({ messages }) => {
  const [filter, setFilter] = useState<AgentRole | 'ALL'>('ALL');
  const [expandedPayloads, setExpandedPayloads] = useState<Record<string, boolean>>({});
  const [mounted, setMounted] = useState<boolean>(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const togglePayload = (id: string) => {
    setExpandedPayloads((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredMessages = filter === 'ALL' ? messages : messages.filter((m) => m.sender === filter);

  const getAgentBadge = (sender: AgentRole) => {
    switch (sender) {
      case 'BUYER_AGENT':
        return {
          label: 'Buyer Agent (Alpha-9)',
          icon: <Users className="w-3.5 h-3.5 text-[#003087]" />,
          color: 'bg-blue-50/80 border-blue-200 text-[#003087]',
        };
      case 'WORKER_AGENT':
        return {
          label: 'Worker Agent (Synth-Coder)',
          icon: <Cpu className="w-3.5 h-3.5 text-indigo-700" />,
          color: 'bg-indigo-50/80 border-indigo-200 text-indigo-900',
        };
      case 'ARBITER_AGENT':
        return {
          label: 'AI Arbiter (Sentinel-01)',
          icon: <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />,
          color: 'bg-amber-50/80 border-amber-200 text-amber-900',
        };
      case 'PAYPAL_ESCROW':
        return {
          label: 'PayPal Escrow Protocol',
          icon: <DollarSign className="w-3.5 h-3.5 text-[#0070BA]" />,
          color: 'bg-sky-50/80 border-sky-200 text-[#003087]',
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
    <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex flex-col h-[580px]">
      {/* Terminal Bar */}
      <div className="flex items-center justify-between pb-3.5 border-b border-slate-200 mb-3.5">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-[#0070BA]" />
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">
            Autonomous Agent Thought & Event Stream
          </h3>
          <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-mono font-medium border border-slate-200">
            {messages.length} Events
          </span>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 text-[11px]">
          {(['ALL', 'BUYER_AGENT', 'WORKER_AGENT', 'ARBITER_AGENT', 'PAYPAL_ESCROW'] as const).map((role) => (
            <button
              key={role}
              onClick={() => setFilter(role)}
              className={`px-2 py-1 rounded-md transition-all font-mono font-medium ${
                filter === role
                  ? 'bg-blue-50 text-[#003087] border border-blue-200 font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {role === 'ALL' ? 'ALL' : role.replace('_AGENT', '').replace('_ESCROW', '')}
            </button>
          ))}
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto space-y-2.5 pr-2">
        {filteredMessages.map((msg) => {
          const badge = getAgentBadge(msg.sender);
          const isExpanded = Boolean(expandedPayloads[msg.id]);

          return (
            <div
              key={msg.id}
              className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/80 text-xs flex flex-col gap-1.5 transition-all hover:bg-slate-50 hover:border-slate-300"
            >
              <div className="flex items-center justify-between">
                <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border text-[11px] font-mono font-medium ${badge.color}`}>
                  {badge.icon}
                  <span>{badge.label}</span>
                </span>
                <span suppressHydrationWarning className="text-[10px] font-mono text-slate-600 font-medium">
                  {formatTimestamp(msg.timestamp)}
                </span>
              </div>

              <div className="font-bold text-slate-900 mt-0.5">{msg.title}</div>
              <p className="text-slate-600 leading-relaxed font-sans">{msg.content}</p>

              {/* Collapsible JSON payload */}
              {msg.dataPayload && (
                <div className="mt-1">
                  <button
                    onClick={() => togglePayload(msg.id)}
                    className="flex items-center gap-1 text-[11px] font-mono text-[#0070BA] hover:text-[#003087] font-semibold transition-colors cursor-pointer"
                  >
                    {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                    <span>{isExpanded ? 'Hide Payload JSON' : 'Inspect Signed Protocol Payload'}</span>
                  </button>

                  {isExpanded && (
                    <pre className="mt-1.5 p-3 rounded-lg bg-slate-900 text-slate-100 text-[10px] font-mono overflow-x-auto leading-relaxed border border-slate-800">
                      {JSON.stringify(msg.dataPayload, null, 2)}
                    </pre>
                  )}
                </div>
              )}
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>
    </div>
  );
};
