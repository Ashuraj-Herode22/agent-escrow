'use client';

import React from 'react';
import { ShieldCheck, Play, RotateCcw, Zap, AlertTriangle, ArrowRight } from 'lucide-react';
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
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand & Sandbox Status */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                AgentEscrow
              </h1>
              <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800/60 font-mono">
                v2.4
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>{isSimulated ? 'PayPal Sandbox Simulator (Zero-Config)' : 'PayPal Live Sandbox Connected'}</span>
            </p>
          </div>
        </div>

        {/* Preset Selector */}
        <div className="flex items-center bg-slate-900/90 border border-slate-800 p-1 rounded-xl">
          <button
            onClick={() => onSelectPreset('SUCCESS_FLOW')}
            disabled={isRunning}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              currentPreset.id === 'SUCCESS_FLOW'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-900/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Scenario 1: Code Pass & Payout ($75)</span>
          </button>

          <button
            onClick={() => onSelectPreset('DISPUTE_FLOW')}
            disabled={isRunning}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              currentPreset.id === 'DISPUTE_FLOW'
                ? 'bg-gradient-to-r from-rose-600 to-amber-600 text-white shadow-md shadow-rose-900/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Scenario 2: Flaw Detected & Auto-Refund ($120)</span>
          </button>
        </div>

        {/* Simulation Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={onStartSimulation}
            disabled={isRunning || currentStep >= totalSteps}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shadow-lg ${
              currentStep >= totalSteps
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold shadow-cyan-500/20 active:scale-95'
            }`}
          >
            <Play className="w-4 h-4 fill-current" />
            <span>{isRunning ? 'Running Protocol...' : 'Run Auto Flow'}</span>
          </button>

          <button
            onClick={onNextStep}
            disabled={isRunning || currentStep >= totalSteps}
            className="px-3 py-2 rounded-xl text-xs font-medium bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 flex items-center gap-1.5 transition-all active:scale-95 disabled:opacity-50"
            title="Step-by-step agent transition"
          >
            <span>Next Step</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onReset}
            disabled={isRunning}
            className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-all"
            title="Reset Simulation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

      </div>
    </header>
  );
};
