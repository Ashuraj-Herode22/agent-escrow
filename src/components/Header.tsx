'use client';

import React from 'react';
import { Play, RotateCcw, ArrowRight, ShieldCheck, CheckCircle2, Shield } from 'lucide-react';
import { SimulationPreset } from '@/types/escrow';

interface HeaderProps {
  currentPreset: SimulationPreset;
  onSelectPreset: (presetKey: 'SUCCESS_FLOW' | 'DISPUTE_FLOW') => void;
  isRunning: boolean;
  onStartSimulation: () => void;
  onNextStep: () => void;
  onReset: () => void;
  currentStep: number;
  totalSteps: number;
  isSimulated: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentPreset,
  onSelectPreset,
  isRunning,
  onStartSimulation,
  onNextStep,
  onReset,
  currentStep,
  totalSteps,
  isSimulated,
}) => {
  return (
    <header className="border-b border-slate-200/80 bg-white sticky top-0 z-50">
      <div className="max-w-[1440px] mx-auto px-6 h-14 flex items-center justify-between gap-4">
        
        {/* Brand: Tier 3 (18px) Logo + Tier 1 (12px) Pill */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-7 h-7 rounded-lg bg-[#F0F5FA] border border-[#D0E2F2] flex items-center justify-center text-[#003087]">
            <Shield className="w-4 h-4 fill-[#0070BA]/20 stroke-[#003087]" />
          </div>

          <div className="flex items-center gap-2">
            <span className="font-extrabold text-lg tracking-tight text-[#003087]">AgentEscrow</span>
            <span className="text-slate-300 font-light text-sm">|</span>
            <span className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              {isSimulated ? 'Sandbox v2 Ready' : 'Live Gateway Active'}
            </span>
          </div>
        </div>

        {/* Center: Tier 1 (12px) Sleek Toggle */}
        <div className="flex items-center bg-slate-100/80 p-0.5 rounded-full border border-slate-200/70 h-8">
          <button
            onClick={() => onSelectPreset('SUCCESS_FLOW')}
            disabled={isRunning}
            className={`px-3.5 py-1 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer h-7 ${
              currentPreset.id === 'SUCCESS_FLOW'
                ? 'bg-white text-[#003087] shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Scenario 1: Verified Payout ($75)</span>
          </button>

          <button
            onClick={() => onSelectPreset('DISPUTE_FLOW')}
            disabled={isRunning}
            className={`px-3.5 py-1 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer h-7 ${
              currentPreset.id === 'DISPUTE_FLOW'
                ? 'bg-white text-[#003087] shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
            <span>Scenario 2: Flaw Refund ($120)</span>
          </button>
        </div>

        {/* Right Actions: Tier 1 (12px) Pill Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onStartSimulation}
            disabled={isRunning || currentStep >= totalSteps}
            className={`h-8 px-4 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              currentStep >= totalSteps
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-[#0070BA] hover:bg-[#003087] text-white shadow-2xs active:scale-98'
            }`}
          >
            <Play className="w-3 h-3 fill-current" />
            <span>{isRunning ? 'Running...' : 'Run Flow'}</span>
          </button>

          <button
            onClick={onNextStep}
            disabled={isRunning || currentStep >= totalSteps}
            className="h-8 px-3 rounded-full text-xs font-semibold bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 flex items-center gap-1 transition-all active:scale-98 disabled:opacity-40 cursor-pointer"
            title="Step forward"
          >
            <span>Next</span>
            <ArrowRight className="w-3 h-3" />
          </button>

          <button
            onClick={onReset}
            disabled={isRunning}
            className="w-8 h-8 rounded-full text-slate-400 hover:text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 flex items-center justify-center transition-all cursor-pointer"
            title="Reset"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </header>
  );
};
