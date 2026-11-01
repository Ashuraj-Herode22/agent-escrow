'use client';

import React, { useState } from 'react';
import { X, Sparkles, Loader2, ArrowRight } from 'lucide-react';
import { TaskContract, AgentMessage } from '@/types/escrow';

interface CustomTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyCustomTask: (contract: TaskContract, messages: AgentMessage[], result?: any) => void;
}

const QUICK_SUGGESTIONS = [
  {
    title: 'Validate Credit Card with Luhn Algorithm',
    desc: 'Python utility to compute Luhn checksum, clean inputs, and identify Visa/Mastercard/Amex.',
    bounty: 45,
  },
  {
    title: 'Distributed Token Bucket Rate Limiter',
    desc: 'Python Redis-backed token bucket algorithm with sliding window and concurrency locks.',
    bounty: 60,
  },
  {
    title: 'JWT Authentication Middleware (Flawed Spec)',
    desc: 'User login endpoint with raw SQL execution to test Arbiter CWE-89 security detection.',
    bounty: 85,
  },
];

export const CustomTaskModal: React.FC<CustomTaskModalProps> = ({ isOpen, onClose, onApplyCustomTask }) => {
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [bounty, setBounty] = useState('50');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    setLoading(true);
    try {
      const res = await fetch('/api/agent/custom-task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskTitle,
          taskDescription: taskDesc || taskTitle,
          budgetUSD: parseFloat(bounty) || 50,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        onApplyCustomTask(data.contract, data.messages, data.result);
        onClose();
      }
    } catch (err) {
      console.error('Failed to dispatch custom task:', err);
    } finally {
      setLoading(false);
    }
  };

  const applySuggestion = (s: typeof QUICK_SUGGESTIONS[0]) => {
    setTaskTitle(s.title);
    setTaskDesc(s.desc);
    setBounty(s.bounty.toString());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-lg w-full p-6 text-xs flex flex-col gap-4">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-slate-900 flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Dispatch Custom Agent Requisition</h3>
              <p className="text-xs text-slate-500">Live AI Multi-Agent Synthesis & Arbitration</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Suggestions */}
        <div>
          <span className="text-xs font-semibold text-slate-500 block mb-1.5">Quick Inspiration Presets:</span>
          <div className="flex flex-wrap gap-1.5">
            {QUICK_SUGGESTIONS.map((s, i) => (
              <button
                key={i}
                type="button"
                onClick={() => applySuggestion(s)}
                className="px-2.5 py-1 rounded-md bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-medium border border-slate-200 transition-colors cursor-pointer"
              >
                {s.title.split(' ')[0]} {s.title.split(' ')[1]} (${s.bounty})
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Task Title / Specification</label>
            <input
              type="text"
              required
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              placeholder="e.g. Build an asynchronous Python rate limiter"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:border-slate-400"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Acceptance Criteria</label>
            <textarea
              rows={2}
              value={taskDesc}
              onChange={(e) => setTaskDesc(e.target.value)}
              placeholder="e.g. Must handle 1,000 req/sec, zero hardcoded credentials, sub-10ms response"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:border-slate-400"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Escrow Bounty (USD)</label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-slate-400 font-bold">$</span>
              <input
                type="number"
                min="10"
                max="500"
                value={bounty}
                onChange={(e) => setBounty(e.target.value)}
                className="w-full pl-7 pr-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 font-bold focus:outline-hidden focus:border-slate-400"
              />
            </div>
          </div>

          {/* Action */}
          <button
            type="submit"
            disabled={loading || !taskTitle.trim()}
            className="w-full mt-2 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all active:scale-98 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>AI Agents Synthesizing & Arbitrating...</span>
              </>
            ) : (
              <>
                <span>Dispatch to AI Agent Network</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
};

