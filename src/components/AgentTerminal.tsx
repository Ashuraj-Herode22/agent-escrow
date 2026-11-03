'use client';

import React, { useState, useEffect, useRef } from 'react';
import { AgentMessage, AgentRole, TaskContract } from '@/types/escrow';
import { Terminal, Users, Cpu, ShieldCheck, DollarSign, Radio, Play } from 'lucide-react';

interface AgentTerminalProps {
  messages: AgentMessage[];
  contract?: TaskContract;
  onStartSimulation?: () => void;
  isRunning?: boolean;
}

export const AgentTerminal: React.FC<AgentTerminalProps> = ({
  messages,
  contract,
  onStartSimulation,
  isRunning,
}) => {
  const [filter, setFilter] = useState<AgentRole | 'ALL'>('ALL');
  const [mounted, setMounted] = useState<boolean>(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const filteredMessages = filter === 'ALL' ? messages : messages.filter((m) => m.sender === filter);

  // Tasteful, distinct agent badges for dark high-tech terminal
  const getAgentBadge = (sender: AgentRole) => {
    switch (sender) {
      case 'BUYER_AGENT':
        return {
          label: 'Buyer Agent',
          icon: <Users className="w-3.5 h-3.5 text-sky-400" />,
          badgeStyle: 'bg-sky-950/80 text-sky-300 border-sky-800/80',
          borderAccent: 'border-l-3 border-l-sky-500',
        };
      case 'WORKER_AGENT':
        return {
          label: 'Worker Agent',
          icon: <Cpu className="w-3.5 h-3.5 text-emerald-400" />,
          badgeStyle: 'bg-emerald-950/80 text-emerald-300 border-emerald-800/80',
          borderAccent: 'border-l-3 border-l-emerald-500',
        };
      case 'ARBITER_AGENT':
        return {
          label: 'AI Arbiter',
          icon: <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />,
          badgeStyle: 'bg-indigo-950/80 text-indigo-300 border-indigo-800/80',
          borderAccent: 'border-l-3 border-l-indigo-500',
        };
      case 'PAYPAL_ESCROW':
        return {
          label: 'PayPal Escrow',
          icon: <DollarSign className="w-3.5 h-3.5 text-[#0070BA]" />,
          badgeStyle: 'bg-[#002244]/90 text-sky-300 border-[#0070BA]/50',
          borderAccent: 'border-l-3 border-l-[#0070BA]',
        };
    }
  };

  const formatTimestamp = (isoString: string) => {
    if (!mounted) {
      return '';
    }
    try {
      const d = new Date(isoString);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    } catch {
      return '';
    }
  };

  return (
    <div className="bg-[#0B132B] border border-slate-800 rounded-2xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.15)] flex flex-col h-[640px] text-slate-100">
      
      {/* Terminal Title Bar & System Controls */}
      <div className="flex items-center justify-between pb-3.5 border-b border-slate-800/80 mb-3.5">
        <div className="flex items-center gap-3">
          {/* macOS window dots */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></span>
          </div>
          <div className="flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5 text-sky-400" />
            <span className="text-xs font-mono font-bold text-slate-300 tracking-tight">
              agent-terminal@paypal-sandbox:~$
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-800/60 px-2 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            LIVE SWARM
          </span>
          <span className="text-xs bg-[#111C38] text-sky-300 px-2.5 py-0.5 rounded-full font-mono font-bold border border-slate-800">
            {messages.length} Events
          </span>
        </div>
      </div>

      {/* Filter Segmented Control (Dark High-Tech) */}
      <div className="grid grid-cols-5 bg-[#111C38]/90 p-1 rounded-xl text-center text-xs mb-3.5 font-medium border border-slate-800/80">
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
              className={`py-1 rounded-lg transition-all cursor-pointer font-mono text-[11px] ${
                filter === role
                  ? 'bg-[#0070BA] text-white font-bold shadow-[0_0_12px_rgba(0,112,186,0.4)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {shortLabel}
            </button>
          );
        })}
      </div>

      {/* Messages Scroll Area or Clean Staged Ready State */}
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto space-y-2.5 pr-1.5 flex flex-col terminal-scroll">
        {messages.length > 0 ? (
          filteredMessages.map((msg) => {
            const badge = getAgentBadge(msg.sender);

            return (
              <div
                key={msg.id}
                className={`p-3.5 rounded-xl bg-[#111C38] border border-slate-800 text-xs flex flex-col gap-1.5 transition-all hover:border-slate-700 animate-in fade-in duration-150 ${badge.borderAccent}`}
              >
                <div className="flex items-center justify-between">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md border text-[11px] font-bold shadow-2xs ${badge.badgeStyle}`}>
                    {badge.icon}
                    <span>{badge.label}</span>
                  </span>
                  <span suppressHydrationWarning className="text-[11px] text-slate-400 font-medium font-mono">
                    {formatTimestamp(msg.timestamp)}
                  </span>
                </div>

                <div className="font-bold text-slate-100 mt-0.5 font-mono text-xs">{msg.title}</div>
                <p className="text-slate-300 leading-relaxed font-sans text-xs">{msg.content}</p>
              </div>
            );
          })
        ) : (
          /* HIGH-TECH TERMINAL BOOT CONSOLE (Dual-Tone Staged Ready State) */
          <div className="my-auto p-5 rounded-2xl bg-[#0D1527] border border-slate-800 flex flex-col gap-4 text-xs font-mono">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-800">
              <span className="font-bold text-sky-400 flex items-center gap-2">
                <Radio className="w-4 h-4 text-sky-400 animate-pulse" />
                <span>SWARM PROTOCOL STAGED & READY</span>
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/60">
                SANDBOX READY
              </span>
            </div>

            <div className="space-y-1.5 font-sans">
              <div className="text-sm font-bold text-slate-100">
                {contract?.title || 'Autonomous Task Commission'}
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {contract?.description || 'Awaiting execution trigger to broadcast task specifications to autonomous worker agents.'}
              </p>
            </div>

            {/* Agent Readiness Telemetry Grid */}
            <div className="grid grid-cols-2 gap-2 text-[11px] bg-[#070B16] p-3 rounded-xl border border-slate-800/80 font-mono">
              <div className="flex items-center gap-2 text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span>
                <span><strong>Buyer-01:</strong> RFQ Broadcaster Ready</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span><strong>Coder-01:</strong> Listening on Pipe</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                <span><strong>Arbiter-01:</strong> AST SecComp Jail Armed</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0070BA]"></span>
                <span><strong>PayPal Vault:</strong> Intent=AUTHORIZE</span>
              </div>
            </div>

            {/* CTA */}
            <div className="flex items-center justify-between pt-1 font-sans">
              <span className="text-slate-400 text-[11px]">
                Click <strong className="text-slate-200">Execute Contract</strong> or <strong className="text-slate-200">Next</strong> to start live execution.
              </span>
              {onStartSimulation && (
                <button
                  onClick={onStartSimulation}
                  disabled={isRunning}
                  className="px-4 py-1.5 rounded-full bg-[#003087] hover:bg-[#002266] text-white font-bold text-xs flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,112,186,0.3)] transition-all cursor-pointer active:scale-98"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>Execute Contract</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
