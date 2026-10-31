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
    <header className="border-b border-slate-200 bg-white sticky top-0 z-50 shadow-xs">
      <div className="max-w-7xl mx-auto px-6 py-3 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand: Custom Geometric Vault Shield (No PayPal Logo/Name) */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#F0F5FA] border border-[#D0E2F2] flex items-center justify-center text-[#003087]">
            <Shield className="w-5 h-5 fill-[#0070BA]/20 stroke-[#003087]" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight text-[#003087]">AgentEscrow</span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#F0F5FA] text-[#0070BA] border border-[#D0E2F2] font-semibold">
                Autonomous Protocol v2
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
              <span className="flex items-center gap-1 font-medium text-emerald-600">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                {isSimulated ? 'Sandbox Simulator Ready' : 'Live Gateway Active'}
              </span>
              <span>•</span>
              <span className="text-slate-400">REST v2 Orders & Authorizations</span>
            </div>
          </div>
        </div>

        {/* Center: Segmented Scenario Toggle */}
        <div className="flex items-center bg-slate-100 p-1 rounded-full border border-slate-200">
          <button
            onClick={() => onSelectPreset('SUCCESS_FLOW')}
            disabled={isRunning}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              currentPreset.id === 'SUCCESS_FLOW'
                ? 'bg-white text-[#003087] shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Scenario 1: Code Pass & Payout ($75)</span>
          </button>

          <button
            onClick={() => onSelectPreset('DISPUTE_FLOW')}
            disabled={isRunning}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              currentPreset.id === 'DISPUTE_FLOW'
                ? 'bg-white text-[#003087] shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
            <span>Scenario 2: Flaw Intercepted & Refund ($120)</span>
          </button>
        </div>

        {/* Right Actions: Clean Pill Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onStartSimulation}
            disabled={isRunning || currentStep >= totalSteps}
            className={`px-5 py-2 rounded-full text-xs font-bold flex items-center gap-2 transition-all shadow-xs cursor-pointer ${
              currentStep >= totalSteps
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-[#0070BA] hover:bg-[#003087] text-white active:scale-98'
            }`}
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{isRunning ? 'Executing Flow...' : 'Run Protocol'}</span>
          </button>

          <button
            onClick={onNextStep}
            disabled={isRunning || currentStep >= totalSteps}
            className="px-4 py-2 rounded-full text-xs font-semibold bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 flex items-center gap-1.5 transition-all active:scale-98 disabled:opacity-40 cursor-pointer"
            title="Step-by-step transition"
          >
            <span>Next Step</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onReset}
            disabled={isRunning}
            className="p-2 rounded-full text-slate-500 hover:text-slate-800 bg-white hover:bg-slate-50 border border-slate-300 transition-all cursor-pointer"
            title="Reset to Initial State"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </header>
  );
};
