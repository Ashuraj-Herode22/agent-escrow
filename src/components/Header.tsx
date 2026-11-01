'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Play,
  RotateCcw,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Shield,
  Sparkles,
  Code2,
  RefreshCw,
  AlertOctagon,
  ChevronDown,
  MoreHorizontal,
  BookOpen,
} from 'lucide-react';
import { SimulationPreset } from '@/types/escrow';
import { SIMULATION_PRESETS } from '@/lib/agent-engine';

interface HeaderProps {
  currentPreset: SimulationPreset;
  onSelectPreset: (presetKey: 'SUCCESS_FLOW' | 'HEALING_FLOW' | 'DISPUTE_FLOW') => void;
  isRunning: boolean;
  onStartSimulation: () => void;
  onNextStep: () => void;
  onReset: () => void;
  currentStep: number;
  totalSteps: number;
  isSimulated: boolean;
  onOpenCustomTask?: () => void;
  onOpenSdkDocs?: () => void;
  onOpenPolicyModal?: () => void;
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
  onOpenCustomTask,
  onOpenSdkDocs,
  onOpenPolicyModal,
}) => {
  const [isScenarioMenuOpen, setIsScenarioMenuOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

  const scenarioRef = useRef<HTMLDivElement>(null);
  const moreRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (scenarioRef.current && !scenarioRef.current.contains(e.target as Node)) {
        setIsScenarioMenuOpen(false);
      }
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setIsMoreMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getScenarioIcon = (id: string) => {
    switch (id) {
      case 'SUCCESS_FLOW':
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />;
      case 'HEALING_FLOW':
        return <RefreshCw className="w-3.5 h-3.5 text-indigo-600 shrink-0" />;
      case 'DISPUTE_FLOW':
        return <AlertOctagon className="w-3.5 h-3.5 text-rose-600 shrink-0" />;
      default:
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />;
    }
  };

  return (
    <header className="border-b border-slate-200/90 bg-white sticky top-0 z-50">
      <div className="max-w-[1400px] mx-auto px-6 h-15 flex items-center justify-between gap-4">
        
        {/* Left: Clean Brand */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-xl bg-[#F0F5FA] border border-[#D0E2F2] flex items-center justify-center text-[#003087]">
            <Shield className="w-4 h-4 fill-[#0070BA]/20 stroke-[#003087]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-extrabold text-base tracking-tight text-[#003087]">AgentEscrow</span>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
              REST v2
            </span>
          </div>
        </div>

        {/* Center: Single Elegant Scenario Selector Dropdown */}
        <div className="relative" ref={scenarioRef}>
          <button
            onClick={() => !isRunning && setIsScenarioMenuOpen(!isScenarioMenuOpen)}
            disabled={isRunning}
            className={`h-9 px-3.5 rounded-full border text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-2xs ${
              isScenarioMenuOpen
                ? 'bg-[#F0F5FA] border-[#0070BA] text-[#003087]'
                : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
            }`}
          >
            {getScenarioIcon(currentPreset.id)}
            <span className="font-bold text-slate-900">{currentPreset.name.split('&')[0].trim()}</span>
            <span className="text-slate-400 font-normal">(${currentPreset.budgetUSD.toFixed(0)})</span>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isScenarioMenuOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown Menu */}
          {isScenarioMenuOpen && (
            <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-80 bg-white rounded-2xl border border-slate-200 shadow-xl p-2 z-50 animate-in fade-in duration-150">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2.5 py-1.5">
                Select Simulation Scenario
              </div>

              {/* Scenario 1 */}
              <button
                onClick={() => {
                  onSelectPreset('SUCCESS_FLOW');
                  setIsScenarioMenuOpen(false);
                }}
                className={`w-full text-left p-2.5 rounded-xl transition-all flex items-start gap-2.5 cursor-pointer ${
                  currentPreset.id === 'SUCCESS_FLOW' ? 'bg-[#F0F5FA] border border-[#D0E2F2]' : 'hover:bg-slate-50'
                }`}
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                    <span>1. Verified Payout</span>
                    <span className="text-emerald-700">$75</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                    Clean code passes 6/6 tests on Attempt 1 $\rightarrow$ instant release.
                  </p>
                </div>
              </button>

              {/* Scenario 2 */}
              <button
                onClick={() => {
                  onSelectPreset('HEALING_FLOW');
                  setIsScenarioMenuOpen(false);
                }}
                className={`w-full text-left p-2.5 rounded-xl transition-all flex items-start gap-2.5 cursor-pointer mt-1 ${
                  currentPreset.id === 'HEALING_FLOW' ? 'bg-[#F0F5FA] border border-[#D0E2F2]' : 'hover:bg-slate-50'
                }`}
              >
                <RefreshCw className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                    <span>2. Self-Healing Patch</span>
                    <span className="text-indigo-700">$120</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                    CWE-89 caught on Attempt 1 $\rightarrow$ Worker auto-patches on Attempt 2 $\rightarrow$ release.
                  </p>
                </div>
              </button>

              {/* Scenario 3 */}
              <button
                onClick={() => {
                  onSelectPreset('DISPUTE_FLOW');
                  setIsScenarioMenuOpen(false);
                }}
                className={`w-full text-left p-2.5 rounded-xl transition-all flex items-start gap-2.5 cursor-pointer mt-1 ${
                  currentPreset.id === 'DISPUTE_FLOW' ? 'bg-[#F0F5FA] border border-[#D0E2F2]' : 'hover:bg-slate-50'
                }`}
              >
                <AlertOctagon className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                    <span>3. Quota Exhausted Refund</span>
                    <span className="text-rose-700">$120</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                    Worker fails 3/3 attempts $\rightarrow$ authorization voided $\rightarrow$ 100% refund.
                  </p>
                </div>
              </button>
            </div>
          )}
        </div>

        {/* Right: Clean Action Controls */}
        <div className="flex items-center gap-2.5 shrink-0">
          
          {/* Custom Task Pill */}
          {onOpenCustomTask && (
            <button
              onClick={onOpenCustomTask}
              disabled={isRunning}
              className="h-9 px-3 rounded-full text-xs font-semibold bg-[#F0F5FA] hover:bg-[#E2EDF8] text-[#003087] border border-[#D0E2F2] flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs active:scale-98"
              title="Commission custom autonomous prompt"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#0070BA]" />
              <span>+ Custom Task</span>
            </button>
          )}

          {/* More Menu (Governance & SDK) */}
          <div className="relative" ref={moreRef}>
            <button
              onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
              disabled={isRunning}
              className="h-9 w-9 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 flex items-center justify-center transition-all cursor-pointer shadow-2xs"
              title="Governance, Policies & SDK Docs"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>

            {isMoreMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl border border-slate-200 shadow-xl p-1.5 z-50 animate-in fade-in duration-150">
                {onOpenPolicyModal && (
                  <button
                    onClick={() => {
                      onOpenPolicyModal();
                      setIsMoreMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4 text-indigo-600" />
                    <span>Security & Cure Policy</span>
                  </button>
                )}

                {onOpenSdkDocs && (
                  <button
                    onClick={() => {
                      onOpenSdkDocs();
                      setIsMoreMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <Code2 className="w-4 h-4 text-[#0070BA]" />
                    <span>Python & TypeScript SDK</span>
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="h-4 w-px bg-slate-200 mx-1" />

          {/* Run Flow (Primary CTA) */}
          <button
            onClick={onStartSimulation}
            disabled={isRunning || currentStep >= totalSteps}
            className={`h-9 px-4 rounded-full text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              currentStep >= totalSteps
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-[#0070BA] hover:bg-[#003087] text-white shadow-xs active:scale-98'
            }`}
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{isRunning ? 'Running...' : 'Run Demo'}</span>
          </button>

          {/* Step Button */}
          <button
            onClick={onNextStep}
            disabled={isRunning || currentStep >= totalSteps}
            className="h-9 px-3 rounded-full text-xs font-semibold bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 flex items-center gap-1.5 transition-all active:scale-98 disabled:opacity-40 cursor-pointer shadow-2xs"
            title="Step forward manually"
          >
            <span>Next</span>
            <ArrowRight className="w-3 h-3 text-slate-500" />
          </button>

          {/* Reset */}
          <button
            onClick={onReset}
            disabled={isRunning}
            className="w-9 h-9 rounded-full text-slate-400 hover:text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 flex items-center justify-center transition-all cursor-pointer shadow-2xs"
            title="Reset to beginning"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </header>
  );
};
