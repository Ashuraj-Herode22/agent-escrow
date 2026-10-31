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
  const bottomRef = useRef<HTMLDivElement>(null);

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
          icon: <Users className="w-3.5 h-3.5 text-blue-400" />,
          color: 'bg-blue-950/70 border-blue-800/80 text-blue-300',
        };
      case 'WORKER_AGENT':
        return {
          label: 'Worker Agent (Synth-Coder)',
          icon: <Cpu className="w-3.5 h-3.5 text-purple-400" />,
          color: 'bg-purple-950/70 border-purple-800/80 text-purple-300',
        };
      case 'ARBITER_AGENT':
        return {
          label: 'AI Arbiter (Sentinel-01)',
          icon: <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />,
          color: 'bg-amber-950/70 border-amber-800/80 text-amber-300',
        };
      case 'PAYPAL_ESCROW':
        return {
          label: 'PayPal Escrow Engine',
          icon: <DollarSign className="w-3.5 h-3.5 text-emerald-400" />,
          color: 'bg-emerald-950/70 border-emerald-800/80 text-emerald-300',
        };
    }
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-sm shadow-xl flex flex-col h-[580px]">
      {/* Terminal Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-3">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
            Autonomous Agent Thought & Escrow Stream
          </h3>
          <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded-full font-mono text-slate-400">
            {messages.length} Events
          </span>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 text-[11px]">
          {(['ALL', 'BUYER_AGENT', 'WORKER_AGENT', 'ARBITER_AGENT', 'PAYPAL_ESCROW'] as const).map((role) => (
            <button
              key={role}
              onClick={() => setFilter(role)}
              className={`px-2 py-1 rounded-md transition-all font-mono ${
                filter === role ? 'bg-cyan-950 text-cyan-400 border border-cyan-800/80 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {role === 'ALL' ? 'ALL' : role.replace('_AGENT', '').replace('_ESCROW', '')}
            </button>
          ))}
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-slate-800">
        {filteredMessages.map((msg) => {
          const badge = getAgentBadge(msg.sender);
          const isExpanded = Boolean(expandedPayloads[msg.id]);

          return (
            <div
              key={msg.id}
              className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs flex flex-col gap-1.5 transition-all hover:border-slate-700/80"
            >
              <div className="flex items-center justify-between">
                <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border text-[11px] font-mono ${badge.color}`}>
                  {badge.icon}
                  <span>{badge.label}</span>
                </span>
                <span className="text-[10px] font-mono text-slate-500">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </span>
              </div>

              <div className="font-semibold text-white mt-0.5">{msg.title}</div>
              <p className="text-slate-300 leading-relaxed font-sans">{msg.content}</p>

              {/* Collapsible JSON payload */}
              {msg.dataPayload && (
                <div className="mt-1">
                  <button
                    onClick={() => togglePayload(msg.id)}
                    className="flex items-center gap-1 text-[10px] font-mono text-cyan-400/90 hover:text-cyan-300 transition-colors"
                  >
                    {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                    <span>{isExpanded ? 'Hide Payload JSON' : 'Inspect Signed Protocol Payload'}</span>
                  </button>

                  {isExpanded && (
                    <pre className="mt-1.5 p-2.5 rounded-lg bg-black/60 border border-slate-800 text-[10px] font-mono text-emerald-300/90 overflow-x-auto">
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
